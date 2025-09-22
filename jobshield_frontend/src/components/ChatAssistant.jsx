import React, { useState, useRef, useEffect } from "react";

const API_BASE =
  process.env.REACT_APP_AI_API_BASE || "https://job-scams-web.onrender.com";

// Very small sanitizer for a safe subset of tags we told the model to use.
// It strips everything else. This avoids pulling extra libs.
function sanitizeHtml(html) {
  // remove scripts/styles/events
  const withoutDanger = html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
  // allow only a small whitelist of tags; strip others
  const allowed = /<\/?(p|strong|ul|ol|li|br|a)(\s+href="[^"]*")?\s*>/gi;
  return withoutDanger.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag) =>
    tag.match(allowed) ? tag : ""
  );
}

// Fallback: convert markdown-y text (**bold**, \n) to simple HTML if server
// still returns asterisks.
function mdishToHtml(text) {
  let t = text;
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\n{2,}/g, "</p><p>");
  t = t.replace(/\n/g, "<br>");
  return `<p>${t}</p>`;
}

export default function AssistantPage() {
  const [consent, setConsent] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      html: `<p>Hi, I’m your <strong>Recovery Assistant</strong>. I’ll ask a few quick questions and then give you a personal <strong>Next Steps Checklist</strong>. Avoid sharing personal identifiers here.</p>`,
    },
  ]);

  const scrollerRef = useRef(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function askAI() {
    const q = input.trim();
    if (!q) return;
    if (!consent) {
      setMessages((m) => [
        ...m,
        { role: "system", html: `<p>Please tick the consent box to continue.</p>` },
      ]);
      return;
    }

    setMessages((m) => [...m, { role: "user", html: `<p>${escapeHtml(q)}</p>` }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q, consent: true }),
      });
      const data = await res.json();

      let answerHtml = data?.answer || "";
      // sanitize & fallback if server accidentally returned markdown
      if (!answerHtml.includes("<p") && answerHtml.includes("**")) {
        answerHtml = mdishToHtml(answerHtml);
      }
      answerHtml = sanitizeHtml(answerHtml);

      setMessages((m) => [...m, { role: "assistant", html: answerHtml }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "system",
          html: `<p>Sorry, I couldn’t reach the AI right now. Please try again.</p>`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      askAI();
    }
  }

  return (
    <div className="assistant-shell container">
      <h2 className="assistant-title">Recovery Assistant</h2>
      <p className="assistant-sub">
        We don’t store your messages. If you enable <strong>Ask AI</strong>, your text is sent once to our AI provider to generate a reply. Avoid sharing personal identifiers.
      </p>

      <div className="chat-window cardish" ref={scrollerRef}>
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div
              className="bubble"
              dangerouslySetInnerHTML={{ __html: m.html }}
            />
          </div>
        ))}
        {loading && (
          <div className="msg assistant">
            <div className="bubble typing">
              <span className="dot" /><span className="dot" /><span className="dot" />
            </div>
          </div>
        )}
      </div>

      <div className="composer">
        <textarea
          className="composer-input"
          placeholder="Briefly describe what happened… (Ctrl/⌘ + Enter to send)"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="composer-bar">
          <label className="consent-row">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
            />
            <span>I consent to send this text to the AI provider for a one-time answer.</span>
          </label>
          <button className="send-btn" onClick={askAI} disabled={loading || !input.trim()}>
            {loading ? "Thinking…" : "Ask AI"}
          </button>
        </div>
      </div>
    </div>
  );
}

// helpers
function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
