import React, { useState, useRef, useEffect } from "react";

const API_BASE =
    process.env.REACT_APP_AI_API_BASE || "https://job-scams-web.onrender.com";

const scamMessages = [
    "If you suspect a scam, report it to the Australian Cyber Security Centre (ACSC).",
    "Never share personal or financial details with unknown callers.",
    "Scammers often impersonate government agencies like the ATO or Centrelink.",
    "Be cautious of unsolicited emails asking for urgent action.",
    "Verify the identity of anyone requesting money or information.",
    "Use the Scamwatch website to check for known scams.",
    "If an offer seems too good to be true, it probably is.",
    "Scammers may threaten legal action to pressure you.",
    "Do not click on links in suspicious emails or messages.",
    "Protect your devices with up-to-date security software.",
    "Be wary of investment opportunities with high returns and low risk.",
    "Scammers often target vulnerable individuals.",
    "Report phishing attempts to your email provider.",
    "Check the legitimacy of charities before donating.",
    "Scammers may ask for payment in gift cards or cryptocurrency.",
    "Monitor your bank accounts for unauthorized transactions.",
    "Educate family members about common scam tactics.",
    "Scammers may pretend to be from tech support companies.",
    "Keep your personal information secure online.",
    "Contact your bank immediately if you suspect fraud."
];

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

export default function AssistantPage() {
    const [consent, setConsent] = useState(true);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            html: `<p>Hi, I'm your <strong>Recovery Assistant</strong>. I'll ask a few quick questions and then give you a personal <strong>Next Steps Checklist</strong>. Avoid sharing personal identifiers here.</p>`,
        },
    ]);

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    const scrollerRef = useRef(null);

    useEffect(() => {
        scrollerRef.current?.scrollTo({
            top: scrollerRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => (prev + 1) % scamMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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
                    html: `<p>Sorry, I couldn't reach the AI right now. Please try again.</p>`,
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
        <div id="assistant-page" className="page active">
            <div className="page-content-wrapper">
                <div
                    className="deepseek-container"
                    style={{ display: "flex", minHeight: "90vh", height: "100%" }}
                >
            {/* 左侧 */}
            <div
                className="left-panel"
                style={{ flex: 2, display: "flex", flexDirection: "column" }}
            >
                <div
                    className="assistant-shell"
                    style={{ flex: 1, display: "flex", flexDirection: "column" }}
                >
                    <h2 className="assistant-title">
                        Recovery Assistant <span className="beta-pill">Beta</span>
                    </h2>
                    <p className="assistant-sub">
                        We don't store your messages. If you enable <strong>Ask AI</strong>, your
                        text is sent once to our AI provider to generate a reply. Avoid sharing
                        personal identifiers.
                    </p>

                    {/* 聊天窗口 */}
                    <div
                        className="chat-window cardish"
                        ref={scrollerRef}
                        style={{ flex: "1", overflowY: "auto" }}
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`msg ${m.role}`}
                                style={i === 0 && m.role === "assistant"
                                    ? { fontSize: "1.1rem", lineHeight: "1.6", padding: "16px" }
                                    : {}}
                            >
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

                    {/* 输入框 */}
                    <div className="composer" style={{ marginTop: "auto" }}>
                        <textarea
                            className="composer-input"
                            placeholder="Briefly describe what happened… (Ctrl/⌘ + Enter to send)"
                            rows={8}   // 输入框行数
                            style={{ minHeight: "180px" }} // 输入框最小高度
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
                                <span>
                                    I consent to send this text to the AI provider for a one-time
                                    answer.
                                </span>
                            </label>
                            <button
                                className="send-btn"
                                onClick={askAI}
                                disabled={loading || !input.trim()}
                            >
                                {loading ? "Thinking…" : "Ask AI"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 右侧 */}
            <div className="right-panel" style={{ flex: 1 }}>
                <h3>Australian Anti-Scam Resources</h3>
                <section>
                    <h4>Emergency Contacts</h4>
                    <ul>
                        <li>Emergency (Police/Fire/Ambulance): 000</li>
                        <li>Police Non-Emergency: 131 444</li>
                        <li>Free Interpreter Service: 131 450</li>
                    </ul>
                </section>
                <section>
                    <h4>Bank Fraud Hotlines</h4>
                    <table>
                        <thead>
                        <tr><th>Bank</th><th>Domestic</th><th>International</th><th>Email</th></tr>
                        </thead>
                        <tbody>
                        <tr><td>CBA</td><td>13 2221</td><td>+61 2 9999 3283</td><td>reportascam@cba.com.au</td></tr>
                        <tr><td>NAB</td><td>13 22 65</td><td>+61 3 8641 9083</td><td>spoof@nab.com.au</td></tr>
                        <tr><td>ANZ</td><td>13 22 73</td><td>+61 3 9683 9999</td><td>hoax@cybersecurity.anz.com</td></tr>
                        <tr><td>Westpac</td><td>1300 364 294</td><td>+61 2 9155 7777</td><td>hoax@westpac.com.au</td></tr>
                        <tr><td>BOQ</td><td>1300 55 72 72</td><td>+61 7 3336 2420</td><td>N/A</td></tr>
                        </tbody>
                    </table>
                </section>
                <section>
                    <h4>Government Reporting</h4>
                    <ul>
                        <li>Cybercrime: ACSC ReportCyber - Online Report</li>
                        <li>Scam Information: ACCC Scamwatch - Website Report / 1300 795 995</li>
                        <li>Phone/SMS Harassment: ACMA - Website Report / 1300 850 115</li>
                        <li>Tax-related Scams: ATO - 1800 008 540 / ReportEmailFraud@ato.gov.au</li>
                        <li>Identity Theft: IDCARE - 1300 432 273</li>
                    </ul>
                </section>
                <section>
                    <h4>Consular Protection</h4>
                    <ul>
                        <li>Ministry of Foreign Affairs: +86-10-12308 / +86-10-65612308</li>
                        <li>Consulate in Brisbane: +61 7 3012 8090</li>
                        <li>Consulate in Sydney: +61 2 9550 5519</li>
                        <li>Consulate in Adelaide: +61 8 8268 8806</li>
                    </ul>
                </section>
                <section>
                    <h4>Telecom Providers</h4>
                    <ul>
                        <li>Telstra: 13 22 00</li>
                        <li>Optus: 13 39 37</li>
                        <li>Vodafone Australia: 13 00 11</li>
                    </ul>
                </section>
                <section>
                    <h4>Mental Support Hotlines</h4>
                    <ul>
                        <li>Lifeline (24/7): 13 11 14</li>
                        <li>Beyond Blue (24/7): 1300 22 4636</li>
                        <li>Kids Helpline (5-25 years, 24/7): 1800 55 1800</li>
                    </ul>
                </section>
                <div className="scam-message-rotator">
                    {scamMessages[currentMessageIndex]}
                </div>
            </div>
                </div>
            </div>
        </div>
    );
}

function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}