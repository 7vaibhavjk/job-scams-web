import os, re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain.prompts import ChatPromptTemplate

# NEW: local retriever
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel
import numpy as np

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

# ---------- Local TF-IDF retriever (no network, no timeouts) ----------
vectorizer = None
doc_matrix = None
chunk_texts = []
chunk_sources = []

if chunks:
    chunk_texts = [c.page_content for c in chunks]
    chunk_sources = [c.metadata.get("source", "doc") for c in chunks]
    vectorizer = TfidfVectorizer(ngram_range=(1,2), max_features=20000, stop_words="english")
    doc_matrix = vectorizer.fit_transform(chunk_texts)  # sparse CSR

def retrieve_context(q: str, k: int = 5):
    if vectorizer is None or doc_matrix is None or not chunk_texts:
        return "", []
    q_vec = vectorizer.transform([q])
    scores = linear_kernel(q_vec, doc_matrix).ravel()   # cosine similarity
    top_idx = np.argsort(scores)[-k:][::-1]
    ctx_parts = []
    srcs = []
    for i in top_idx:
        if scores[i] <= 0:
            continue
        ctx_parts.append(f"[{chunk_sources[i]}]\n{chunk_texts[i]}")
        srcs.append(chunk_sources[i])
    return "\n\n".join(ctx_parts), list(dict.fromkeys(srcs))

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
    return {"ok": True, "has_docs": bool(chunk_texts)}

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
