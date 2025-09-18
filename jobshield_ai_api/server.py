import os, re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.prompts import ChatPromptTemplate

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
assert GOOGLE_API_KEY, "GOOGLE_API_KEY not set"

MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash")
ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "*").split(",")

# ---------- Privacy / PII Redaction ----------
PII_PATTERNS = [
    (re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I), "[email redacted]"),
    (re.compile(r"\b(\+?61|0)[2-478]\d{8}\b"), "[phone redacted]"),
    (re.compile(r"\b\d{2}-\d{3}\b"), "[bsb redacted]"),
    (re.compile(r"\b\d{6,12}\b"), "[account redacted]"),
    (re.compile(r"\b\d{8,9}\b"), "[id redacted]"),
]
def redact(text: str) -> str:
    for rx, repl in PII_PATTERNS:
        text = rx.sub(repl, text)
    return text

# ---------- Load docs ----------
def load_markdown_dir(path: str):
    docs = []
    if not os.path.isdir(path):
        return docs
    for fname in os.listdir(path):
        if fname.endswith(".md"):
            with open(os.path.join(path, fname), "r", encoding="utf-8") as f:
                docs.append(Document(page_content=f.read(), metadata={"source": fname}))
    return docs

splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
raw_docs = load_markdown_dir("data")
chunks = splitter.split_documents(raw_docs)

# Build vector store only if we have chunks
vectordb = None
if chunks:
    emb = GoogleGenerativeAIEmbeddings(
        model="text-embedding-004",
        google_api_key=GOOGLE_API_KEY,
    )
    vectordb = FAISS.from_documents(chunks, emb)

def retrieve_context(q: str, k: int = 5):
    if vectordb is None:
        return "", []
    sims = vectordb.similarity_search(q, k=k)
    ctx = "\n\n".join([f"[{d.metadata.get('source','doc')}]\n{d.page_content}" for d in sims])
    sources = list({d.metadata.get("source","doc") for d in sims})
    return ctx, sources

# ---------- LLM ----------
llm = ChatGoogleGenerativeAI(
    model=MODEL_NAME,
    temperature=0.2,
    google_api_key=GOOGLE_API_KEY,
)

SYSTEM_INSTRUCTIONS = """
You are JobShield's Recovery Assistant. Be calm, clear, non-judgmental.
Use ONLY the provided context when possible; if unsure, say so and include official links.
Include a “Next Steps Checklist” if the user may be scammed.
Never give legal/financial advice. Point to ACCC/Scamwatch/police for monetary loss.
Keep responses under 250 words, use bullets and short sentences.
"""

PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_INSTRUCTIONS),
    ("human", "User question: {question}\n\nTopical context:\n{context}\n\nAnswer:")
])

# ---------- FastAPI ----------
app = FastAPI(title="JobShield AI API (Gemini)", version="0.1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in ALLOWED_ORIGINS if o.strip()],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str
    consent: bool = False

@app.get("/health")
def health():
    return {"ok": True, "has_docs": bool(vectordb)}

@app.post("/ask")
def ask(req: AskRequest):
    if not req.consent:
        return {"error": "consent_required", "message": "User must consent to send text to AI."}
    question = redact(req.question.strip())[:4000]
    if not question:
        return {"error": "empty_question", "message": "Question is empty."}

    context, sources = retrieve_context(question)
    messages = PROMPT.format_messages(question=question, context=context)
    resp = llm.invoke(messages)
    return {"answer": resp.content.strip(), "sources": sources}
