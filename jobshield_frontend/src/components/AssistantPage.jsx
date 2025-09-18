import React, { useState } from "react";

const API_BASE = process.env.REACT_APP_AI_API || "http://127.0.0.1:8000";

export default function AssistantPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  async function handleAsk(e) {
    e.preventDefault();
    setError(""); setAnswer("");
    if (!consent) { setError("Please tick the consent box."); return; }
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, consent: true }),
      });
      const data = await res.json();
      if (data.error) setError(data.message || data.error);
      else setAnswer(data.answer || "");
    } catch (err) {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{maxWidth: 900, margin: "0 auto", padding: "1.5rem"}}>
      <h1 style={{fontSize: 28, fontWeight: 700}}>Recovery Assistant (Beta)</h1>
      <p style={{color:"#555"}}>
        We don’t store your messages. If you enable “Ask AI”, your text is sent once to our AI provider to generate a reply.
        Avoid sharing personal identifiers.
      </p>

      <form onSubmit={handleAsk}>
        <textarea
          value={question}
          onChange={(e)=>setQuestion(e.target.value)}
          rows={6}
          placeholder="Describe what happened. Example: I paid an upfront fee and shared bank details after a WhatsApp job message."
          style={{width:"100%", padding:12, border:"1px solid #ddd", borderRadius:8, marginTop:8}}
        />
        <label style={{display:"flex", gap:8, alignItems:"center", margin:"10px 0"}}>
          <input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} />
          <span>I consent to send this text to the AI provider for a one-time answer.</span>
        </label>
        <button disabled={!consent || loading}
          style={{background:"#1f4dff", color:"#fff", padding:"10px 16px", border:"none", borderRadius:8, cursor:"pointer", opacity:(!consent||loading)?0.6:1}}>
          {loading ? "Thinking…" : "Ask AI"}
        </button>
      </form>

      {error && <div style={{color:"#b00020", marginTop:12}}>{error}</div>}
      {answer && (
        <div style={{marginTop:16, padding:16, border:"1px solid #eee", borderRadius:8, background:"#fff"}}>
          <div style={{whiteSpace:"pre-wrap"}}>{answer}</div>
        </div>
      )}
    </div>
  );
}
