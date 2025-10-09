import React, { useState, useEffect } from 'react';

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

const questions = [
    { id: 'q1', question: 'Have you transferred money?', type: 'radio', options: ['Yes', 'No'] },
    { id: 'q2', question: 'Have you provided bank card/ID?', type: 'radio', options: ['Yes', 'No'] },
    { id: 'q3', question: 'Did you click a link and log in?', type: 'radio', options: ['Yes', 'No'] },
    { id: 'q4', question: 'Have you installed any software?', type: 'radio', options: ['Yes', 'No'] },
    { id: 'q5', question: 'Have you leaked verification code/2FA?', type: 'radio', options: ['Yes', 'No'] },
    { id: 'q6', question: 'When did it happen?', type: 'input' },
    { id: 'q7', question: 'Location/Bank/Platform?', type: 'input' }
];

const SupportPage = () => {
    const [answers, setAnswers] = useState({});
    const [adviceText, setAdviceText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [aiResponse, setAiResponse] = useState('AI is coming soon!');
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex(prev => (prev + 1) % scamMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleRadioChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const handleInputChange = (qId, value) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const generateAdvice = (answers) => {
        const adviceList = [];
        if (answers.q1 === 'Yes') adviceList.push("You have transferred money to a suspicious party. Please contact your bank immediately to freeze your account and closely monitor fund movements.");
        if (answers.q2 === 'Yes') adviceList.push("You have provided bank card or ID information. Please change relevant account information as soon as possible and consider applying for ID loss reporting.");
        if (answers.q3 === 'Yes') adviceList.push("You clicked on a suspicious link and logged into an account. Please change relevant passwords immediately and enable two-factor authentication to prevent information leakage.");
        if (answers.q4 === 'Yes') adviceList.push("You installed unknown software. Please uninstall suspicious programs and use antivirus software to check device security.");
        if (answers.q5 === 'Yes') adviceList.push("You leaked verification code/2FA information. Please update all relevant account verification information promptly and enable additional security measures.");
        if (answers.q6) adviceList.push(`Incident time: ${answers.q6}`);
        if (answers.q7) adviceList.push(`Incident location/platform/bank: ${answers.q7}`);
        if (adviceList.length === 0) adviceList.push("No high-risk behaviors selected. Please remain vigilant.");
        return adviceList.join(" ");
    };

    const handleSubmitQuestionnaire = () => {
        const advice = generateAdvice(answers);
        setAdviceText(advice);
    };

    const handleAiSubmit = () => {
        setAiResponse('AI is coming soon!');
    };

    return (
        <div className="deepseek-container">
            {/* Left Panel - Questionnaire */}
            <div className="left-panel">
                <h3>Quick Assessment Questionnaire</h3>
                <div className="quick-questionnaire">
                    {questions.map(q => (
                        <div key={q.id} className="question-item">
                            <p>{q.question}</p>
                            {q.type === 'radio' ? (
                                <div className="radio-options">
                                    {q.options.map(opt => (
                                        <label key={opt}>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={opt}
                                                checked={answers[q.id] === opt}
                                                onChange={() => handleRadioChange(q.id, opt)}
                                            />
                                            {opt}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    className="input-field"
                                    value={answers[q.id] || ''}
                                    onChange={e => handleInputChange(q.id, e.target.value)}
                                />
                            )}
                        </div>
                    ))}
                    <button className="submit-button" onClick={handleSubmitQuestionnaire}>
                        Submit Questionnaire
                    </button>
                    {adviceText && (
                        <div className="final-advice">
                            <h4>Anti-Scam Advice:</h4>
                            <p>{adviceText}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Panel - AI Section */}
            <div className="middle-panel">
                <h3>AI Assistance</h3>
                <div className="ai-container">
                    <textarea
                        placeholder={aiResponse || "AI is coming soon!"}
                        value={userInput}
                        onChange={e => setUserInput(e.target.value)}
                    />
                    <button className="submit-button" onClick={handleAiSubmit}>
                        Get Answer
                    </button>
                </div>
            </div>

            {/* Right Panel - Help Resources */}
            <div className="right-panel">
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
                <div className="scam-message-rotator">{scamMessages[currentMessageIndex]}</div>
            </div>
        </div>
    );
};

export default SupportPage;