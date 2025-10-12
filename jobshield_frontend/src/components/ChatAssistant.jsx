import React, { useEffect, useRef, useState } from "react";

const API_BASE =
  process.env.REACT_APP_AI_API_BASE || "https://job-scams-web.onrender.com";

/* ------------------ helpers ------------------ */
function sanitizeHtml(html) {
  const withoutDanger = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
  const allowed = /<\/?(p|strong|ul|ol|li|br|a)(\s+href="[^"]*")?\s*>/gi;
  return withoutDanger.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag) =>
    tag.match(allowed) ? tag : ""
  );
}
function mdishToHtml(text) {
  let t = text;
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\n{2,}/g, "</p><p>");
  t = t.replace(/\n/g, "<br>");
  return `<p>${t}</p>`;
}
function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* ------------- quick questions ------------- */
const QUICK = [
  "How do I identify a fake job posting?",
  "Is this job offer legitimate?",
  "What are common employment scam red flags?",
  "How do I verify a company's authenticity?",
  "What should I do if I've been scammed?",
  "Are upfront training fees normal?",
];

/* ------------------ tiny inline SVGs ------------------ */
const IconChat = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M4 5h16v10H7l-3 3V5z" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconBolt = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill="currentColor" />
  </svg>
);
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
    <path d="M4 20c2-4 14-4 16 0" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);
const IconBot = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="6" width="16" height="10" rx="3" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="10" cy="11" r="1.5" fill="currentColor"/>
    <circle cx="14" cy="11" r="1.5" fill="currentColor"/>
    <path d="M12 3v3" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

/* ------------------ component ------------------ */
export default function AssistantPage() {
  const [consent, setConsent] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      html: `<p>Hi! I'm Protegrad's AI Recovery assistant. I'm here to help you identify employment scams and stay safe during your job search. How can I help you today?</p>`,
      time: new Date(),
    },
  ]);
  const scrollerRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  /** Shared sender for typed messages & quick questions */
  async function sendToAI(questionText) {
    const q = questionText.trim();
    if (!q) return;

    if (!consent) {
      setMessages((m) => [
        ...m,
        { role: "system", html: `<p>Please tick the consent box to continue.</p>`, time: new Date() },
      ]);
      return;
    }

    // show user message
    setMessages((m) => [...m, { role: "user", html: `<p>${escapeHtml(q)}</p>`, time: new Date() }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, consent: true }),
      });
      const data = await res.json();

      let html = data?.answer || "";
      if (!html.includes("<p") && html.includes("**")) html = mdishToHtml(html);
      html = sanitizeHtml(html);

      setMessages((m) => [...m, { role: "assistant", html, time: new Date() }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "system", html: `<p>Sorry, I couldn't reach the AI right now. Please try again.</p>`, time: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleQuick(q) {
    textareaRef.current?.focus();
    // route to AI, not hardcoded
    sendToAI(q);
  }

  async function askAI() {
    const q = input.trim();
    setInput("");
    await sendToAI(q);
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      askAI();
    }
  }

  return (
    <div className="chatx page active">
      <div className="chatx-wrap">
        {/* Page title */}
        <div className="chatx-title">
        </div>

        {/* Chat Card */}
        <div className="chatx-card">
          {/* Header */}
          <div className="chatx-header">
            <div className="chatx-assistant">
              <div className="chatx-avatar bot"><IconBot /></div>
              <div>
                <div className="chatx-assistant-name">Protegrad Assistant</div>
                <div className="chatx-status"><span className="dot" /> Online — Ready to help</div>
              </div>
            </div>
            <div className="chatx-meta">{messages.length} messages</div>
          </div>

          {/* Messages */}
          <div className="chatx-messages" ref={scrollerRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chatx-msg ${m.role}`}>
                <div className={`chatx-avatar ${m.role === "user" ? "user" : "bot"}`}>
                  {m.role === "user" ? <IconUser /> : <IconBot />}
                </div>
                <div className="chatx-bubble" dangerouslySetInnerHTML={{ __html: m.html }} />
              </div>
            ))}
            {loading && (
              <div className="chatx-msg assistant">
                <div className="chatx-avatar bot"><IconBot /></div>
                <div className="chatx-bubble typing">
                  <span className="dot" /><span className="dot" /><span className="dot" />
                </div>
              </div>
            )}
          </div>

          {/* Quick questions */}
          <div className="chatx-quick">
            <div className="qq-title">Quick Questions:</div>
            <div className="qq-grid">
              {QUICK.map((q) => (
                <button key={q} className="qq-btn" onClick={() => handleQuick(q)} disabled={loading}>
                  <span className="qq-ico"><IconBolt /></span>
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Composer */}
          <div className="chatx-input">
            <textarea
              ref={textareaRef}
              className="chatx-textarea"
              rows={1}
              placeholder="Ask me about employment scams, job safety, or verification tips..."
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
            />
            <button
              className="chatx-send"
              onClick={askAI}
              disabled={loading || !input.trim()}
              title="Send (Ctrl/⌘ + Enter)"
            >
              ➤
            </button>
          </div>

          {/* Consent */}
          <label className="chatx-consent">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>I consent to send this text to the AI provider for a one-time answer.</span>
          </label>
        </div>
      </div>
    </div>
  );
}
