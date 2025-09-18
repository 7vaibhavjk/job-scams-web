import os, re, json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.docstore.document import Document
from langchain.prompts import ChatPromptTemplate

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # set on Render
assert OPENAI_API_KEY, "OPENAI_API_KEY not set"

# ---------- Privacy / PII Redaction (client-side also recommended) ----------
PII_PATTERNS = [
    (re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I), "[email redacted]"),
    (re.compile(r"\b(\+?61|0)[2-478]\d{8}\b"), "[phone redacted]"),
    (re.compile(r"\b\d{2}-\d{3}\b"), "[bsb redacted]"),            # AU BSB rough
    (re.compile(r"\b\d{6,12}\b"), "[account redacted]"),           # rough account
    (re.compile(r"\b\d{8,9}\b"), "[id redacted]"),                 # rough TFN-like
]

def redact(text: str) -> str:
    clean = text
    for rx, repl in PII_PATTERNS:
        clean = rx.sub(repl, clean)
    return clean

# ---------- Load docs into FAISS (in-memory, no persistence) ----------
def load_markdown_dir(path: str):
    docs = []
    for fname in os.listdir(path):
        if fname.endswith(".md"):
            with open(os.path.join(path, fname), "r", encoding="utf-8") as f:
                docs.append(Document(page_content=f.read(), metadata={"source": fname}))
    return docs

splitter = RecursiveCharacterTextSplitter(chunk_size=1200, chunk_overlap=150)
raw_docs = load_markdown_dir("data")
chunks = splitter.split_documents(raw_docs)
emb = OpenAIEmbeddings(api_key=OPENAI_API_KEY)
vectordb = FAISS.from_documents(chunks, emb)

# ---------- LangChain LLM ----------
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2, api_key=OPENAI_API_KEY)

SYSTEM_INSTRUCTIONS = """
You are JobShield's Recovery Assistant. Be calm, clear, non-judgmental.
You must:
- Prefer step-by-step, short sentences, and bullet lists.
- Use ONLY the provided context to answer. If unsure, say you’re unsure and show official links.
- Include a “Next steps checklist” whenever the user indicates they were scammed.
- Never give legal/financial advice. Direct users to official authorities (ACCC/Scamwatch/police for monetary loss).
- Keep responses < 250 words.
"""

PROMPT = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_INSTRUCTIONS),
    ("human", "User question: {question}\n\nTopical context:\n{context}\n\nAnswer:")
])

def retrieve_context(q: str, k: int = 5):
    sims = vectordb.similarity_search(q, k=k)
    ctx = "\n\n".join([f"[{d.metadata.get('source','doc')}]\n{d.page_content}" for d in sims])
    sources = list({d.metadata.get("source","doc") for d in sims})
    return ctx, sources

# ---------- FastAPI ----------
app = FastAPI(title="JobShield AI API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten later to your domain
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str
    consent: bool = False

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/ask")
def ask(req: AskRequest):
    if not req.consent:
        return {"error": "consent_required", "message": "User must consent to send text to AI."}

    # redact server-side as a guardrail (also redact client-side)
    question = redact(req.question.strip())[:4000]
    if not question:
        return {"error": "empty_question", "message": "Question is empty."}

    context, sources = retrieve_context(question)
    messages = PROMPT.format_messages(question=question, context=context)
    resp = llm.invoke(messages)

    answer = resp.content.strip()
    return {"answer": answer, "sources": sources}
