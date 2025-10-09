import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
assert GOOGLE_API_KEY, "GOOGLE_API_KEY not set"

MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash")
ALLOWED_ORIGINS = [o.strip() for o in os.getenv("CORS_ALLOWED_ORIGINS", "http://13.236.66.151:3000").split(",")]

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel(MODEL_NAME)

SYSTEM_INSTRUCTIONS = """
You are JobShield's Recovery Assistant. Be calm, clear, and non-judgmental.

FORMAT:
- Return output as SIMPLE HTML ONLY (no Markdown, no asterisks).
- Allowed tags: <p>, <strong>, <ul>, <ol>, <li>, <br>, <a>.
- Short sections with <strong> headings are OK.
- Keep under 250 words. Use concise bullets for steps.
- Use short <p> paragraphs and <ul><li> bullets. Avoid headings unless strictly needed. Never output asterisks.


POLICY:
- Use provided context when possible; if unsure, say so and include official links.
- Include a <strong>Next Steps Checklist</strong> if the user may be scammed.
- No legal/financial advice; point to ACCC/Scamwatch/police for money loss.

"""

app = FastAPI(title="JobShield Mini AI API", version="0.1")
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AskRequest(BaseModel):
    question: str
    consent: bool = False

@app.get("/health")
def health():
    return {"ok": True, "model": MODEL_NAME}

@app.post("/ask")
def ask(req: AskRequest):
    if not req.consent:
        return {"error": "consent_required", "message": "Please tick the consent box."}
    q = (req.question or "").strip()
    if not q:
        return {"error": "empty_question", "message": "Question is empty."}

    prompt = f"{SYSTEM_INSTRUCTIONS}\n\nUser: {q}\n\nAssistant:"
    try:
        resp = model.generate_content(prompt)
        text = resp.text or "(no response)"
        return {"answer": text}
    except Exception as e:
        return {"error": "model_error", "message": str(e)}
