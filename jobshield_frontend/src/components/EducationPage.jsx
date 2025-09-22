import React, {useEffect, useState} from 'react';

function EducationPage({onNavigate}) {
    const [activeTab, setActiveTab] = useState('maze');

    return (
        <div id="education-page" className="page active magical-theme">
            <div className="container">
                <div className="back-btn magical-btn" onClick={() => onNavigate('home')}>
                    <i className="fas fa-arrow-left"></i> Back to Home
                </div>

                <h2 className="section-title magical-title">Job Hunting Adventure</h2>
                <p className="section-subtitle magical-subtitle">
                    Learn to identify and avoid job scams through an adventure
                </p>

                <div className="tab-container magical-tabs">
                    <div
                        className={`tab ${activeTab === 'maze' ? 'active' : ''} magical-tab`}
                        onClick={() => setActiveTab('maze')}
                    >
                        <i className="fas fa-dragon"></i> Adventure Game
                    </div>
                    <div
                        className={`tab ${activeTab === 'flashcards' ? 'active' : ''} magical-tab`}
                        onClick={() => setActiveTab('flashcards')}
                    >
                        <i className="fas fa-scroll"></i> Knowledge Scrolls
                    </div>
                </div>

                {activeTab === 'maze' && <AdventureGame/>}
                {activeTab === 'flashcards' && <FlashCardGame/>}

                <div className="card magical-card" style={{marginTop: '40px'}}>
                    <h3 className="card-title magical-card-title">
                        <i className="fas fa-info-circle"></i> Disclaimer
                    </h3>
                    <p>
                        <strong>Warning:</strong> These educational games are based on common scam patterns but may not cover all situations.
                        Always exercise caution when sharing personal information online.
                    </p>
                    <p>
                        <strong>Privacy:</strong> We do not collect any personal data from these games. Your progress is stored only on your device.
                    </p>
                    <p>
                        <strong>Knowledge Sources:</strong> Information is based on reports from the Australian Cyber Security Centre, Scamwatch, and other cybersecurity organizations.
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}

// Adventure Game Component
const AdventureGame = () => {
    // Scenario Database - Expanded
    const scenarioDatabase = {
        start: {
            id: 'start',
            title: 'The Beginning of Your Magical Job Hunt',
            description: 'You are a magic apprentice looking for a job when suddenly you receive a letter delivered by a magical owl...',
            options: [
                {
                    text: 'Open the letter to see its contents',
                    next: 'random',
                    risk: 0,
                    position: {x: 1, y: 1}
                },
            ],
            position: {x: 0, y: 2},
            theme: 'start'
        },
        'A': {
            id: 'A',
            title: 'Job Offer',
            description: 'Letter content: "Dear Magician, Congratulations! You have been selected for a high-level position at the Ministry of Magic. Please click http://magic-careers.work to accept your offer immediately and receive your magic wand."',
            options: [
                {
                    text: 'Click the link to view the magical offer',
                    next: 'random',
                    risk: 8,
                    position: {x: 2, y: 0}
                },
                {
                    text: 'Verify through the official Ministry of Magic',
                    next: 'random',
                    risk: 2,
                    position: {x: 2, y: 2}
                },
                {
                    text: 'Reply with personal information to receive magical items',
                    next: 'random',
                    risk: 9,
                    position: {x: 2, y: 4}
                }
            ],
            position: {x: 1, y: 2},
            theme: 'sms'
        },
        'B': {
            id: 'B',
            title: 'Suspicious Magical Website',
            description: 'After clicking the link, you enter a magical website that looks unprofessional and asks for your personal information and bank account details to receive "magical salary".',
            options: [
                {
                    text: 'Enter personal information to continue',
                    next: 'random',
                    risk: 15,
                    position: {x: 3, y: 0}
                },
                {
                    text: 'Close the website and report suspicious activity',
                    next: 'random',
                    risk: 0,
                    position: {x: 3, y: 2}
                },
                {
                    text: 'Contact a friend for advice',
                    next: 'random',
                    risk: 5,
                    position: {x: 3, y: 4}
                }
            ],
            position: {x: 2, y: 2},
            theme: 'web'
        },
        'C': {
            id: 'C',
            title: 'Official Verification',
            description: 'You decide to verify this job opportunity through official channels. You find the official website and contact information of the Ministry of Magic.',
            options: [
                {
                    text: 'Apply for the position through the official website',
                    next: 'random',
                    risk: 0,
                    position: {x: 3, y: 1}
                },
                {
                    text: 'Call directly to confirm',
                    next: 'random',
                    risk: 0,
                    position: {x: 3, y: 3}
                }
            ],
            position: {x: 2, y: 2},
            theme: 'safe'
        },
        'D': {
            id: 'D',
            title: 'Personal Information Request',
            description: 'You replied to the letter providing personal information. The other party immediately requested more detailed information, including ID number and bank account.',
            options: [
                {
                    text: 'Provide all requested information',
                    next: 'random',
                    risk: 20,
                    position: {x: 3, y: 4}
                },
                {
                    text: 'Refuse and provide false information',
                    next: 'random',
                    risk: 10,
                    position: {x: 3, y: 3}
                },
                {
                    text: 'Stop responding and request official verification',
                    next: 'random',
                    risk: 2,
                    position: {x: 3, y: 2}
                }
            ],
            position: {x: 2, y: 4},
            theme: 'danger'
        },
        'E': {
            id: 'E',
            title: 'High-Risk Information Provision',
            description: 'You provided personal information and bank account. The other party replied that they need a "magic activation fee" to continue processing your application.',
            options: [
                {
                    text: 'Pay the activation fee',
                    next: 'random',
                    risk: 25,
                    position: {x: 4, y: 0}
                },
                {
                    text: 'Refuse to pay and terminate contact',
                    next: 'random',
                    risk: 5,
                    position: {x: 4, y: 2}
                }
            ],
            position: {x: 3, y: 0},
            theme: 'danger'
        },
        'F': {
            id: 'F',
            title: "Friend's Advice",
            description: 'Your friend tells you this looks like a common magical job scam and advises you to stop all contact.',
            options: [
                {
                    text: 'Follow friend advice and stop contact',
                    next: 'random',
                    risk: 0,
                    position: {x: 4, y: 4}
                },
                {
                    text: 'Ignore advice and continue communication',
                    next: 'random',
                    risk: 10,
                    position: {x: 4, y: 3}
                }
            ],
            position: {x: 3, y: 4},
            theme: 'advice'
        },
        'G': {
            id: 'G',
            title: 'Formal Application Process',
            description: 'You applied for the position through the official website and received a formal interview invitation and request for supporting documents.',
            options: [
                {
                    text: 'Prepare for interview and provide necessary documents',
                    next: 'random',
                    risk: 0,
                    position: {x: 4, y: 1}
                },
                {
                    text: 'Suspect it is a scam and give up',
                    next: 'random',
                    risk: 5,
                    position: {x: 4, y: 3}
                }
            ],
            position: {x: 3, y: 1},
            theme: 'safe'
        },
        'H': {
            id: 'H',
            title: 'Mysterious Job Offer SMS',
            description: 'You receive an SMS: "Congratulations on your job offer! Click http://job-careers.work to claim your Offer, valid today only."',
            options: [
                { text: 'Click the link directly to view', next: 'random', risk: 8, position: {x: 1, y: 0} },
                { text: 'Verify through company official website/job platform', next: 'random', risk: 2, position: {x: 1, y: 1} },
                { text: 'Reply SMS with personal info (name + last 4 digits of ID)', next: 'random', risk: 9, position: {x: 1, y: 2} },
                { text: 'Ignore and report as spam SMS', next: 'random', risk: 0, position: {x: 1, y: 3} }
            ],
            position: {x: 0, y: 1},
            theme: 'sms'
        },
        'I': {
            id: 'I',
            title: 'Fake Page',
            description: 'The page asks you to log in with your job platform account or pay an "onboarding deposit".',
            options: [
                { text: 'Log in to check', next: 'random', risk: 15, position: {x: 2, y: 0} },
                { text: 'Request to continue on Telegram', next: 'random', risk: 10, position: {x: 2, y: 1} },
                { text: 'Close the page immediately', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 1, y: 0},
            theme: 'web'
        },
        'J': {
            id: 'J',
            title: 'Telegram HR Continues Request',
            description: 'Asks you to transfer 199 yuan "badge fee" first.',
            options: [
                { text: 'Make payment', next: 'random', risk: 25, position: {x: 3, y: 0} },
                { text: 'Refuse and verify through official website', next: 'random', risk: 2, position: {x: 3, y: 1} }
            ],
            position: {x: 2, y: 1},
            theme: 'danger'
        },
        'K': {
            id: 'K',
            title: 'Official Website Verification',
            description: 'You find the official website domain name is inconsistent with the SMS link.',
            options: [
                { text: 'Apply normally through official website', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Still click back to the SMS link', next: 'random', risk: 8, position: {x: 2, y: 2} }
            ],
            position: {x: 1, y: 1},
            theme: 'safe'
        },
        'L': {
            id: 'L',
            title: 'Reply SMS with Information',
            description: 'The other party requests ID photo and bank card number.',
            options: [
                { text: 'Continue providing', next: 'random', risk: 20, position: {x: 2, y: 2} },
                { text: 'Stop and clear messages', next: 'random', risk: 2, position: {x: 2, y: 3} }
            ],
            position: {x: 1, y: 2},
            theme: 'danger'
        },
        'M': {
            id: 'M',
            title: 'Received Suspected Phishing Email',
            description: 'You receive an email claiming to be from a bank, asking you to click a link to update your password.',
            options: [
                { text: 'Click the link to update password', next: 'random', risk: 15, position: {x: 2, y: 0} },
                { text: 'Go to official website to verify', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore the email', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 0, y: 0},
            theme: 'web'
        },
        'N': {
            id: 'N',
            title: 'Received Prize SMS',
            description: 'SMS claims you won a big prize and need to provide bank account information to receive the bonus.',
            options: [
                { text: 'Provide bank information', next: 'random', risk: 20, position: {x: 2, y: 0} },
                { text: 'Ignore and report', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ask friend for opinion', next: 'random', risk: 2, position: {x: 2, y: 2} }
            ],
            position: {x: 0, y: 1},
            theme: 'sms'
        },
        'O': {
            id: 'O',
            title: 'Fake Job Website',
            description: 'You see a high-paying part-time job on social media, the website requires payment of a registration fee first.',
            options: [
                { text: 'Pay registration fee', next: 'random', risk: 25, position: {x: 2, y: 0} },
                { text: 'Verify company information', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Close the webpage', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 0, y: 2},
            theme: 'web'
        },
        'P': {
            id: 'P',
            title: 'Suspicious App Download',
            description: 'You receive a push notification claiming to download and install this App to receive rewards.',
            options: [
                { text: 'Download and install', next: 'random', risk: 15, position: {x: 2, y: 0} },
                { text: 'Search through official app store', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore and delete message', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 0, y: 3},
            theme: 'danger'
        },
        'Q': {
            id: 'Q',
            title: 'Received Call Claiming to be from Bank',
            description: 'Call claims your account is abnormal and requires verification code.',
            options: [
                { text: 'Provide verification code', next: 'random', risk: 20, position: {x: 2, y: 0} },
                { text: 'Hang up and call official customer service', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore the call', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 1, y: 0},
            theme: 'danger'
        },
        'R': {
            id: 'R',
            title: 'Loan Scam',
            description: 'Someone contacts you claiming quick loans but requires handling fee.',
            options: [
                { text: 'Pay handling fee', next: 'random', risk: 25, position: {x: 2, y: 0} },
                { text: 'Consult through formal loan channels', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Refuse and report', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 1, y: 1},
            theme: 'danger'
        },
        'S': {
            id: 'S',
            title: 'Fake Charity Donation',
            description: 'Someone on social media launches emergency relief requesting WeChat transfer.',
            options: [
                { text: 'Transfer donation', next: 'random', risk: 20, position: {x: 2, y: 0} },
                { text: 'Verify charity organization information', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore message', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 1, y: 2},
            theme: 'danger'
        },
        'T': {
            id: 'T',
            title: 'Prize Email',
            description: 'Email claims you won an international prize and need to pay handling fee to claim.',
            options: [
                { text: 'Pay handling fee', next: 'random', risk: 25, position: {x: 2, y: 0} },
                { text: 'Verify organizer information', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore email', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 1, y: 3},
            theme: 'danger'
        },
        'U': {
            id: 'U',
            title: 'Suspicious Link from Friend Request',
            description: 'Receive friend message containing suspicious link claiming to click for red envelope.',
            options: [
                { text: 'Click the link', next: 'random', risk: 15, position: {x: 2, y: 0} },
                { text: 'Contact friend to confirm', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore message', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 2, y: 0},
            theme: 'web'
        },
        'V': {
            id: 'V',
            title: 'Fake Investment Platform',
            description: 'Ad claims small investment can yield high returns, requires remittance first.',
            options: [
                { text: 'Remit for investment', next: 'random', risk: 25, position: {x: 2, y: 0} },
                { text: 'Operate through formal investment platform', next: 'random', risk: 0, position: {x: 2, y: 1} },
                { text: 'Ignore the ad', next: 'random', risk: 0, position: {x: 2, y: 2} }
            ],
            position: {x: 2, y: 1},
            theme: 'danger'
        },
    };

    // Outcomes Database - Expanded
    const outcomesDatabase = {
        'safe-avoidance': {
            id: 'safe-avoidance',
            type: 'outcome',
            title: '✅ Safe Avoidance',
            description: 'You cautiously handled suspicious information and avoided any loss and risk.',
            explanation: 'Carefully verifying information, ignoring unknown links or unfamiliar requests is key to preventing scams.',
            advice: [
                'Stay vigilant, do not click unknown links randomly',
                'Verify job or prize information through official channels',
                'Consult reliable friends or official agencies about suspected scam information'
            ],
            position: {x: 1, y: 4},
            theme: 'safe'
        },
        'close-call': {
            id: 'close-call',
            type: 'outcome',
            title: '⚠️ Close Call',
            description: 'You almost fell into the scam but recognized it in time or stopped the operation, avoiding major losses.',
            explanation: 'Some operations may leak a small amount of information or increase risk, but you stopped the loss in time and protected yourself.',
            advice: [
                'Review operations to ensure no sensitive information was leaked',
                'Change relevant account passwords and enable two-factor authentication',
                'Enhance ability to identify similar scam scenarios'
            ],
            position: {x: 3, y: 3},
            theme: 'warning'
        },
        'compromised': {
            id: 'compromised',
            type: 'outcome',
            title: '❌ Compromised',
            description: 'You provided too much personal information or property, which was exploited by scammers causing losses.',
            explanation: 'This type of operation may lead to identity theft, property loss or account intrusion, requiring immediate remedial measures.',
            advice: [
                'Immediately freeze affected accounts and contact bank',
                'Report online scam to official platforms or police department',
                'Change all relevant passwords, enable two-factor authentication',
                'Continuously monitor credit records and account activities'
            ],
            position: {x: 4, y: 0},
            theme: 'danger'
        }
    };

    const [currentScenario, setCurrentScenario] = useState(scenarioDatabase.start);
    const [riskLevel, setRiskLevel] = useState(0);
    const [decisionLog, setDecisionLog] = useState([]);
    const [playerPosition, setPlayerPosition] = useState({x: 0, y: 2});
    const [visitedNodes, setVisitedNodes] = useState(['start']);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [monsters, setMonsters] = useState([]); // Track attached monsters

    // Game map configuration - Modified to 5×5 grid
    const gridSize = 5; // Changed from 7 to 5
    const cellSize = 112; // Changed from 80 to 112, keeping total size 560px (5×112=560)

    // Monster types
    const monsterTypes = [
        {name: 'Information Stealing Monster', icon: 'fa-user-secret', riskThreshold: 20},
        {name: 'Money Greed Monster', icon: 'fa-coins', riskThreshold: 40},
        {name: 'Identity Theft Dragon', icon: 'fa-dragon', riskThreshold: 60},
        {name: 'Scam Master', icon: 'fa-crown', riskThreshold: 80}
    ];

    const mapBackgroundImage = "/background.png";
    const playerCharacterImage = "/figure.png";

    const [stepCount, setStepCount] = useState(0); // Current step count
    const maxSteps = 5; // Maximum steps

    const handleOptionSelect = (option) => {
        // 1️⃣ Accumulate risk
        const newRiskLevel = Math.min(100, riskLevel + option.risk);
        setRiskLevel(newRiskLevel);

        // 2️⃣ Trigger monsters based on risk
        const newMonsters = monsterTypes.filter(monster => newRiskLevel >= monster.riskThreshold);
        setMonsters(newMonsters);

        // 3️⃣ Record decision log
        setDecisionLog(prev => [...prev, {
            scenario: currentScenario.title,
            choice: option.text,
            risk: option.risk
        }]);

        // 4️⃣ Record visited nodes
        // const coordKey = option.position ? `${option.position.x}-${option.position.y}` : option.next;
        // setVisitedNodes(prev => prev.includes(coordKey) ? prev : [...prev, coordKey]);

        // 5️⃣ Move player
        setPlayerPosition(option.position || playerPosition);

        // 6️⃣ Step count +1
        const nextStepCount = stepCount + 1;
        setStepCount(nextStepCount);

        let nextScenario;

        // 7️⃣ Check if reached fifth step
        if (nextStepCount >= maxSteps) {
            // Jump to outcome based on accumulated risk
            if (newRiskLevel === 0) nextScenario = outcomesDatabase['safe-avoidance'];
            else if (newRiskLevel <= 50) nextScenario = outcomesDatabase['close-call'];
            else nextScenario = outcomesDatabase['compromised'];

            setGameCompleted(true); // Game over
        } else {
            // 8️⃣ Randomly select unvisited scenarios
            const unvisited = Object.values(scenarioDatabase).filter(s => !visitedNodes.includes(s.id));
            if (unvisited.length > 0) {
                nextScenario = unvisited[Math.floor(Math.random() * unvisited.length)];
            } else {
                // Fallback: if no unvisited scenarios, jump to safe outcome early
                nextScenario = outcomesDatabase['safe-avoidance'];
                setGameCompleted(true);
            }
        }

        // 9️⃣ Delay scenario update (for animation/transition)
        setTimeout(() => {
            if (nextScenario) {
                setCurrentScenario(nextScenario);
                if (nextScenario.position) {
                    const nextCoordKey = `${nextScenario.position.x}-${nextScenario.position.y}`;
                    setVisitedNodes(prev => prev.includes(nextCoordKey) ? prev : [...prev, nextCoordKey]);
                }
            }
        }, 500);
    };

    const restartGame = () => {
        setCurrentScenario(scenarioDatabase.start);
        setRiskLevel(0);
        setDecisionLog([]);
        setPlayerPosition({x: 0, y: 2});
        setVisitedNodes(['start']);
        setGameCompleted(false);
        setMonsters([]);
        setStepCount(0);
    };

    // Render game map
    const renderGameMap = () => {
        const mapGrid = [];

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                let scenarioHere = null;

                Object.values(scenarioDatabase).forEach(scenario => {
                    if (scenario.position && scenario.position.x === x && scenario.position.y === y) {
                        scenarioHere = scenario;
                    }
                });

                if (!scenarioHere) {
                    Object.values(outcomesDatabase).forEach(outcome => {
                        if (outcome.position && outcome.position.x === x && outcome.position.y === y) {
                            scenarioHere = outcome;
                        }
                    });
                }

                const isCurrent = playerPosition.x === x && playerPosition.y === y;

                // const isVisited = visitedNodes.includes(`${x}-${y}`);
                // let cellClass = "map-cell magical-map-cell";
                // if (isCurrent) cellClass += " current";
                // else if (isVisited) cellClass += " visited";

                let cellClass = "map-cell magical-map-cell";
                if (scenarioHere) {
                    cellClass += ` theme-${scenarioHere.theme || 'default'}`;
                }

                mapGrid.push(
                    <div
                        key={`${x}-${y}`}
                        className={cellClass}
                        style={{
                            left: x * cellSize,
                            top: y * cellSize,
                            width: cellSize,
                            height: cellSize
                        }}
                    >
                        <i className="fas fa-question"></i>
                    </div>
                );
            }
        }

        return mapGrid;
    };

    return (
        <div className="adventure-game magical-adventure">
            <div className="game-header magical-header">
                <h3>Magical Job Hunting Adventure</h3>
                <div className="risk-meter magical-risk-meter">
                    <div className="risk-label">Magical Risk Level:</div>
                    <div className="risk-bar magical-risk-bar">
                        <div
                            className="risk-fill magical-risk-fill"
                            style={{
                                width: `${riskLevel}%`,
                                backgroundColor: riskLevel < 30 ? '#2e7d32' : riskLevel < 70 ? '#f57f17' : '#E4002B'
                            }}
                        ></div>
                    </div>
                    <div className="risk-value">{riskLevel}%</div>
                </div>

                {/* Display attached monsters */}
                <div className="monsters-container">
                    {monsters.map((monster, index) => (
                        <div key={index} className="monster-icon">
                            <i className={`fas ${monster.icon}`} title={monster.name}></i>
                        </div>
                    ))}
                </div>
            </div>

            <div className="game-container magical-game-container">
                <div className="map-view magical-map-view">
                    <div
                        className="game-map magical-game-map"
                        style={{
                            backgroundImage: `url(${mapBackgroundImage})`,
                            backgroundSize: "cover",
                            width: `${gridSize * cellSize}px`,
                            height: `${gridSize * cellSize}px`
                        }}
                    >
                        {renderGameMap()}
                        <div
                            className="player magical-player"
                            style={{
                                left: playerPosition.x * cellSize + cellSize / 2 - 30,
                                top: playerPosition.y * cellSize + cellSize / 2 - 30,
                                backgroundImage: `url(${playerCharacterImage})`,
                                width: "60px",
                                height: "60px"
                            }}
                        >
                            {/*{playerCharacterImage === "/figure.png" && <i className="fas fa-hat-wizard"></i>}*/}
                            {/* Display attached monsters */}
                            {monsters.map((monster, index) => (
                                <div key={index} className="attached-monster">
                                    <i className={`fas ${monster.icon}`}></i>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="scenario-view magical-scenario-view">
                    <div className="scenario-card magical-scenario-card">
                        <h4>{currentScenario.title}</h4>

                        {currentScenario.type === 'outcome' ? (
                            <div className={`outcome ${currentScenario.theme} magical-outcome`}>
                                <p>{currentScenario.description}</p>
                                <div className="explanation">
                                    <h5>Magical Analysis:</h5>
                                    <p>{currentScenario.explanation}</p>
                                </div>
                                <div className="advice">
                                    <h5>Magical Advice:</h5>
                                    <ul>
                                        {currentScenario.advice.map((item, index) => (
                                            <li key={index}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <button className="btn btn-primary magical-btn" onClick={restartGame}>
                                    <i className="fas fa-redo"></i> Restart Adventure
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="scenario-description">
                                    <p>{currentScenario.description}</p>
                                </div>

                                <div className="options-container magical-options">
                                    {currentScenario.options.map((option, index) => (
                                        <button
                                            key={index}
                                            className="option-btn magical-option-btn"
                                            onClick={() => handleOptionSelect(option)}
                                            disabled={gameCompleted}
                                        >
                                            <span className="option-text">{option.text}</span>
                                            <span className="risk-indicator magical-risk-indicator">
                                                Risk: +{option.risk}%
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="decision-log card magical-card">
                <h4>
                    <i className="fas fa-book"></i> Adventure Log
                </h4>
                <div className="log-entries">
                    {decisionLog.length === 0 ? (
                        <p className="no-entries">No magical decisions made yet</p>
                    ) : (
                        decisionLog.map((entry, index) => (
                            <div key={index} className="log-entry magical-log-entry">
                                <div className="log-scenario">{entry.scenario}</div>
                                <div className="log-choice">{entry.choice}</div>
                                <div className="log-risk">+{entry.risk}% risk</div>
                            </div>
                        ))
                    )}
                </div>
                <button className="btn btn-outline magical-btn" onClick={restartGame}>
                    <i className="fas fa-undo"></i> Restart Adventure
                </button>
            </div>
        </div>
    );
};

// Flash Card Game Component
const FlashCardGame = () => {
    const flashCards = [
        {
            id: 1,
            question: "A magical company asks you to pay a 'magical material fee' before starting work. What should you do?",
            options: [
                "Pay the fee - it might be a normal process to get magical materials",
                "Research the company and verify the legitimacy of the request",
                "Provide your magical bank details for direct deduction"
            ],
            correctAnswer: 1,
            explanation: "Legitimate magical employers will never ask you to pay before starting work. This is a common magical scam strategy."
        },
        {
            id: 2,
            question: "You receive a letter delivered by a magical owl offering you a job you didn't apply for. What's the best response?",
            options: [
                "Reply immediately and send your magical resume",
                "Ignore it completely",
                "Research the company and contact them through official Ministry of Magic channels"
            ],
            correctAnswer: 2,
            explanation: "Always verify unsolicited job offers through official Ministry of Magic contact information, not using provided links or owl replies."
        },
        {
            id: 3,
            question: "Someone requests your ID and magical bank account through a magical messenger, what would you do?",
            options: [
                "Provide immediately",
                "Refuse and contact official Ministry of Magic for verification",
                "Only provide name and birthday"
            ],
            correctAnswer: 1,
            explanation: "Do not provide sensitive information through unofficial channels, official channel verification is the safe practice."
        },
        {
            id: 4,
            question: "Receive SMS notifying you won a magical prize but requires paying handling fee first, what would you do?",
            options: [
                "Pay handling fee to claim the prize",
                "Ignore SMS and report",
                "Click the link to fill in information"
            ],
            correctAnswer: 1,
            explanation: "Legitimate prizes won't require advance payment, payment is a scam technique."
        },
        {
            id: 5,
            question: "A company's official website looks formal but asks you to contact HR on Telegram and pay money, what would you do?",
            options: [
                "Pay as requested on Telegram",
                "Go back to official website to verify position and apply",
                "Ignore the position"
            ],
            correctAnswer: 1,
            explanation: "Switching to unknown platforms for payment is a red flag, should return to official channels to operate."
        },
        {
            id: 6,
            question: "You receive a magical recruitment email with strange links, what should you do?",
            options: [
                "Click the link directly to view",
                "Verify through official website",
                "Reply to email with personal information"
            ],
            correctAnswer: 1,
            explanation: "Always verify recruitment information through official channels, clicking unknown links is risky."
        },
        {
            id: 7,
            question: "Someone claims you got a high-paying magical job but requires bank card information first, what would you do?",
            options: [
                "Provide bank card information",
                "Stop communication and report",
                "Pay deposit first then consider"
            ],
            correctAnswer: 1,
            explanation: "High-paying jobs won't require advance payment or providing bank cards, it's a scam."
        },
        {
            id: 8,
            question: "During magical job hunting, how to confirm company legitimacy?",
            options: [
                "Check official website and official Ministry of Magic information",
                "Trust SMS or email links",
                "Just confirm through friends"
            ],
            correctAnswer: 0,
            explanation: "Official channel verification is the safest verification method."
        },
        {
            id: 9,
            question: "If the other party asks you to download an unknown magical app for interview, what would you do?",
            options: [
                "Download and fill in information",
                "Refuse and apply through official channels",
                "Ask in forums first"
            ],
            correctAnswer: 1,
            explanation: "Unknown apps may contain malware, should refuse to download."
        },
        {
            id: 10,
            question: "You receive a magical recruitment SMS requiring reply within 24 hours, what would you do?",
            options: [
                "Reply immediately to not miss opportunity",
                "Calmly analyze, verify authenticity",
                "Ignore everything directly"
            ],
            correctAnswer: 1,
            explanation: "High-pressure urgency is a common scam technique, should calmly verify authenticity."
        }
    ];

    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isFlipping, setIsFlipping] = useState(false);
    const [shuffledCards, setShuffledCards] = useState([]);
    const [gameProgress, setGameProgress] = useState(0);

    useEffect(() => {
        startNewGame();
    }, []);

    const startNewGame = () => {
        const shuffled = [...flashCards].sort(() => Math.random() - 0.5).slice(0, 4); // 4 questions per game
        setShuffledCards(shuffled);
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setScore(0);
        setSelectedOption(null);
        setGameProgress(0);
    };

    const handleOptionSelect = (index) => {
        if (showAnswer || isFlipping) return;

        setSelectedOption(index);
        setIsFlipping(true);

        setTimeout(() => {
            setShowAnswer(true);
            setIsFlipping(false);

            if (index === shuffledCards[currentCardIndex].correctAnswer) {
                setScore(prev => prev + 25);
            }

            setGameProgress(((currentCardIndex + 1) / shuffledCards.length) * 100);
        }, 300);
    };

    const nextCard = () => {
        if (currentCardIndex >= shuffledCards.length - 1) {
            return;
        }

        setIsFlipping(true);
        setShowAnswer(false);
        setSelectedOption(null);

        setTimeout(() => {
            setCurrentCardIndex(prev => prev + 1);
            setIsFlipping(false);
        }, 300);
    };

    const resetGame = () => {
        startNewGame();
    };

    if (shuffledCards.length === 0) {
        return <div className="loading">Loading magical scrolls...</div>;
    }

    const currentCard = shuffledCards[currentCardIndex];
    const isLastCard = currentCardIndex >= shuffledCards.length - 1;

    return (
        <div className="flashcard-game magical-flashcard-game">
            <div className="game-stats card magical-card">
                <div className="stat">
                    <span className="stat-label">Magical Score:</span>
                    <span className="stat-value">{score}</span> {/* 25 points per question accumulated */}
                </div>
                <div className="stat">
                    <span className="stat-label">Scroll Progress:</span>
                    <span className="stat-value">{currentCardIndex + 1}/{shuffledCards.length}</span>
                </div>
                <div className="stat">
                    <div className="progress-bar magical-progress-bar">
                        <div
                            className="progress-fill magical-progress-fill"
                            style={{width: `${gameProgress}%`}}
                        ></div>
                    </div>
                </div>
                <button className="btn btn-outline magical-btn" onClick={resetGame}>
                    <i className="fas fa-sync"></i> New Game
                </button>
            </div>

            <div className="flashcard-container magical-flashcard-container">
                <div
                    className={`flashcard ${showAnswer ? 'flipped' : ''} ${isFlipping ? 'flipping' : ''} magical-flashcard`}>
                    <div className="flashcard-front magical-card-front">
                        <div className="card-header magical-card-header">
                            <span className="card-number">Magical Question {currentCardIndex + 1}</span>
                            <div className="card-category">Scam Prevention Knowledge</div>
                        </div>

                        <div className="card-content magical-card-content">
                            <p>{currentCard.question}</p>
                        </div>

                        <div className="flashcard-options magical-options">
                            {currentCard.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`option-btn ${selectedOption === index ? 'selected' : ''} magical-option-btn`}
                                    onClick={() => handleOptionSelect(index)}
                                    disabled={showAnswer}
                                    style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: '8px' }}
                                >
                                    <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                                    <span className="option-text">{option}</span>
                                </button>
                            ))}
                        </div>

                        {!showAnswer && (
                            <button
                                className="btn show-answer-btn magical-btn"
                                onClick={() => {
                                    setIsFlipping(true);
                                    setTimeout(() => {
                                        setShowAnswer(true);
                                        setIsFlipping(false);
                                    }, 300);
                                }}
                            >
                                <i className="fas fa-eye"></i> Reveal Answer
                            </button>
                        )}
                    </div>

                    <div className="flashcard-back magical-card-back">
                        <div className="card-header magical-card-header">
                            <span className="card-number">Magical Analysis</span>
                            <div className="card-category">Scam Prevention Knowledge</div>
                        </div>

                        {showAnswer && selectedOption !== null && (
                            <div className="answer-result magical-answer-result">
                                {selectedOption === currentCard.correctAnswer ? (
                                    <div className="correct">
                                        <i className="fas fa-check-circle"></i> Correct!
                                    </div>
                                ) : (
                                    <div className="incorrect">
                                        <i className="fas fa-times-circle"></i> Not Quite Right
                                    </div>
                                )}
                            </div>
                        )}


                        <div className="card-content magical-card-content">
                            <p>{currentCard.explanation}</p>
                        </div>

                        <div className="correct-answer magical-correct-answer">
                            <div className="correct-label">Recommended Magical Strategy:</div>
                            <div className="correct-text">{currentCard.options[currentCard.correctAnswer]}</div>
                        </div>

                        {!isLastCard ? (
                            <button className="btn btn-primary magical-btn next-btn" onClick={nextCard}>
                                Next Scroll <i className="fas fa-arrow-right"></i>
                            </button>
                        ) : (
                            <div className="game-complete magical-game-complete">
                                <h4>Magical Trial Complete!</h4>
                                <p>Your final magical score: {score}/100</p>
                                <button className="btn btn-primary magical-btn" onClick={resetGame}>
                                    <i className="fas fa-redo"></i> Challenge Again
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="knowledge-center card magical-card">
                <h4>
                    <i className="fas fa-lightbulb"></i> Scam Prevention Guide
                </h4>
                <div className="tips-grid magical-tips-grid">
                    <div className="tip-item magical-tip-item">
                        <div className="tip-icon">
                            <i className="fas fa-gem"></i>
                        </div>
                        <div className="tip-content">
                            <h5>No Advance Payment</h5>
                            <p>Legitimate employers will never ask you to pay before starting work</p>
                        </div>
                    </div>
                    <div className="tip-item magical-tip-item">
                        <div className="tip-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <div className="tip-content">
                            <h5>Verify Contacts</h5>
                            <p>Always verify company contact information</p>
                        </div>
                    </div>
                    <div className="tip-item magical-tip-item">
                        <div className="tip-icon">
                            <i className="fas fa-search"></i>
                        </div>
                        <div className="tip-content">
                            <h5>Research Companies</h5>
                            <p>Thoroughly research company background before sharing personal information</p>
                        </div>
                    </div>
                    <div className="tip-item magical-tip-item">
                        <div className="tip-icon">
                            <i className="fas fa-exclamation-triangle"></i>
                        </div>
                        <div className="tip-content">
                            <h5>Watch for Red Flags</h5>
                            <p>Be cautious of interviews conducted only through text</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationPage;