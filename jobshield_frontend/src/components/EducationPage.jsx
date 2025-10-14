import React, {useEffect, useState} from 'react';

function EducationPage({onNavigate}) {
    const [activeTab, setActiveTab] = useState('maze');

    return (
        <div className="maze-game-scale">
            <div id="education-page" className="page active magical-theme">
                <div className="page-content-wrapper">
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

                    {activeTab === 'maze' && (
                        <div className="game-card">
                            <AdventureGame />
                        </div>
                        )}
                    {activeTab === 'flashcards' && <FlashCardGame/>}

                    <div className="card magical-card" style={{marginTop: '40px'}}>
                        <h3 className="card-title magical-card-title">
                            <i className="fas fa-info-circle"></i> Guide
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
            </div>
        </div>
    );
}
const SCALE = 0.66; // Control overall maze scaling ratio
// Adventure Game Component - Maze Version
const AdventureGame = () => {
    // Maze configuration - larger maze
    const MAZE_SIZE = 25; // 25x25 maze
    const CELL_SIZE = 40; // Each cell 40px (enlarged map)
    const PLAYER_SIZE = 45; // Player size (enlarged image)
    const ENEMY_SIZE = 48; // Enemy size (enlarged image)
    
    // Maze wall layout (1=wall, 0=passage) - 25x25 complex asymmetric maze
    const mazeLayout = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,1,0,1,1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,1],
        [1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
        [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
        [1,1,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
        [1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,1,1,1,1,1,1,0,1],
        [1,0,1,0,0,0,0,0,1,0,0,0,1,0,1,0,0,0,1,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,1,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];
    
    // Game state
    const [playerPosition, setPlayerPosition] = useState({ x: 1, y: 1 });
    const [gameStarted, setGameStarted] = useState(false);
    const [gameCompleted, setGameCompleted] = useState(false);
    const [showQuestion, setShowQuestion] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [currentEnemy, setCurrentEnemy] = useState(null);
    const [enemies, setEnemies] = useState([]);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [showCelebration, setShowCelebration] = useState(false);
    const [decisionLog, setDecisionLog] = useState([]);
    const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
    const [answerFeedback, setAnswerFeedback] = useState('');
    const [isAnswerWrong, setIsAnswerWrong] = useState(false);
    
    // Exit position
    const EXIT_POSITION = { x: 23, y: 23 };

    // Enemy position
    const enemyPositions = [
        { x: 3, y: 3 },
        { x: 5, y: 5 },
        { x: 7, y: 7 },
        { x: 9, y: 9 },
        { x: 11, y: 11 },
        { x: 13, y: 13 },
        { x: 15, y: 15 },
        { x: 17, y: 17 },
        { x: 19, y: 19 },
        { x: 21, y: 21 }
    ];

    // Question database
    const questionDatabase = [
        {
            id: 1,
            question: "A company asks you to pay a 'training fee' before starting work. What should you do?",
            options: [
                "Pay the fee to secure the job",
                "Ask for more details about the training",
                "Refuse and report as suspicious",
                "Negotiate a lower fee"
            ],
            correctAnswer: 2,
            explanation: "Legitimate employers never ask for upfront payments. This is a common scam pattern."
        },
        {
            id: 2,
            question: "You receive a job offer via WhatsApp with no interview. What's the best response?",
            options: [
                "Accept immediately",
                "Ask for company verification",
                "Provide personal information",
                "Pay a background check fee"
            ],
            correctAnswer: 1,
            explanation: "Always verify the company through official channels before accepting any job offer."
        },
        {
            id: 3,
            question: "A job posting promises 'easy money from home' with no experience needed. What should you do?",
            options: [
                "Apply immediately",
                "Research the company thoroughly",
                "Share your bank details",
                "Pay for 'startup materials'"
            ],
            correctAnswer: 1,
            explanation: "If it sounds too good to be true, it usually is. Always research before applying."
        },
        {
            id: 4,
            question: "You're asked to transfer money as part of your 'job duties'. What should you do?",
            options: [
                "Do it to prove your trustworthiness",
                "Ask for written authorization",
                "Refuse and report immediately",
                "Only transfer small amounts"
            ],
            correctAnswer: 2,
            explanation: "Money laundering is illegal. No legitimate job involves transferring money for the company."
        },
        {
            id: 5,
            question: "A job requires you to buy equipment from a specific vendor. What's the red flag?",
            options: [
                "The equipment is expensive",
                "You can't choose your own vendor",
                "The vendor is overseas",
                "All of the above"
            ],
            correctAnswer: 3,
            explanation: "Legitimate companies provide equipment or reimburse purchases from any vendor."
        }
    ];

    // Start game
    const startGame = () => {
        setGameStarted(true);
        setGameCompleted(false);
        setPlayerPosition({ x: 1, y: 1 });
        setEnemies([]);
        setWrongAnswers(0);
        setShowCelebration(false);
        setDecisionLog([]);
        setShowAnswerFeedback(false);
        setAnswerFeedback('');
    };

    // Restart game
    const restartGame = () => {
        setGameStarted(false);
        setGameCompleted(false);
        setPlayerPosition({ x: 1, y: 1 });
        setEnemies([]);
        setWrongAnswers(0);
        setShowCelebration(false);
        setShowQuestion(false);
        setCurrentQuestion(null);
        setCurrentEnemy(null);
        setDecisionLog([]);
        setShowAnswerFeedback(false);
        setAnswerFeedback('');
        setIsAnswerWrong(false);
    };

    // Move player
    const movePlayer = (direction) => {
            if (!gameStarted || gameCompleted || showQuestion) return;
            
            const newPosition = { ...playerPosition };
            
        switch (direction) {
                case 'ArrowUp':
                    newPosition.y = Math.max(0, newPosition.y - 1);
                    break;
                case 'ArrowDown':
                    newPosition.y = Math.min(MAZE_SIZE - 1, newPosition.y + 1);
                    break;
                case 'ArrowLeft':
                    newPosition.x = Math.max(0, newPosition.x - 1);
                    break;
                case 'ArrowRight':
                    newPosition.x = Math.min(MAZE_SIZE - 1, newPosition.x + 1);
                    break;
                default:
                    return;
            }
            
            // Check if hitting wall
        if (mazeLayout[newPosition.y][newPosition.x] === 1) {
            return;
        }

                setPlayerPosition(newPosition);
        
        // Check if encountering enemy
                checkEnemyEncounter(newPosition);
        
        // Check if reached exit
                checkExit(newPosition);
        };
    
    // Check if encountering enemy
    const checkEnemyEncounter = (position) => {
        const enemyIndex = enemyPositions.findIndex(enemy => 
            enemy.x === position.x && enemy.y === position.y
        );
        
        if (enemyIndex !== -1 && !enemies.includes(enemyIndex)) {
            // Get used question IDs
            const usedQuestionIds = decisionLog.map(log => log.questionId);
            
            // Select from unused questions
            const availableQuestions = questionDatabase.filter(q => !usedQuestionIds.includes(q.id));
            
            let selectedQuestion;
            if (availableQuestions.length > 0) {
                // If there are still unused questions, randomly select one
                selectedQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
            } else {
                // If all questions have been used, restart the question pool
                selectedQuestion = questionDatabase[Math.floor(Math.random() * questionDatabase.length)];
            }
            
            setCurrentEnemy(enemyIndex);
            setCurrentQuestion(selectedQuestion);
            setShowQuestion(true);
            setEnemies(prev => [...prev, enemyIndex]);
        }
    };
    
    // Check if reached exit
    const checkExit = (position) => {
        if (position.x === EXIT_POSITION.x && position.y === EXIT_POSITION.y) {
            setGameCompleted(true);
            setTimeout(() => {
            setShowCelebration(true);
            }, 500);
        }
    };
    
    // Handle question answers
    const handleAnswer = (selectedAnswer) => {
        if (!currentQuestion) return;
        
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        const newWrongAnswers = isCorrect ? wrongAnswers : wrongAnswers + 1;
        
        // Record decision
        setDecisionLog(prev => [...prev, {
            questionId: currentQuestion.id,
            question: currentQuestion.question,
            selectedAnswer,
            correctAnswer: currentQuestion.correctAnswer,
            isCorrect,
            timestamp: new Date().toISOString()
        }]);
        
        if (isCorrect) {
            // Correct answer, continue game
            setIsAnswerWrong(false);
            setAnswerFeedback('✅ Correct! You can continue your journey!');
            setShowAnswerFeedback(true);
            setTimeout(() => {
                setShowAnswerFeedback(false);
                setShowQuestion(false);
                setCurrentQuestion(null);
                setCurrentEnemy(null);
            }, 2000);
        } else {
            // Wrong answer
            setIsAnswerWrong(true);
            setWrongAnswers(newWrongAnswers);
            
            if (newWrongAnswers >= 3) {
                // Game over, return to starting point
                setAnswerFeedback('❌ Game Over! Too many wrong answers. The magical creatures have captured you!');
                setShowAnswerFeedback(true);
                setTimeout(() => {
                    setShowAnswerFeedback(false);
                    setShowQuestion(false);
                    setCurrentQuestion(null);
                    setCurrentEnemy(null);
                    // Return to starting point
                    setPlayerPosition({ x: 1, y: 1 });
                    setWrongAnswers(0);
                    setEnemies([]);
                    setDecisionLog([]);
                    setIsAnswerWrong(false);
                }, 3000);
            } else {
                // Show error message, then continue to next question
                setAnswerFeedback(`❌ Wrong answer! ${3 - newWrongAnswers} chances left. Next question...`);
                setShowAnswerFeedback(true);
                setTimeout(() => {
                    setShowAnswerFeedback(false);
                    // Continue to next question (don't repeat already asked questions)
                    const usedQuestionIds = decisionLog.map(log => log.questionId);
                    const availableQuestions = questionDatabase.filter(q => !usedQuestionIds.includes(q.id));
                    
                    if (availableQuestions.length > 0) {
                        const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
                        setCurrentQuestion(randomQuestion);
                    } else {
                        // If all questions have been asked, restart question pool
                        const randomQuestion = questionDatabase[Math.floor(Math.random() * questionDatabase.length)];
                        setCurrentQuestion(randomQuestion);
                    }
                }, 2000);
            }
        }
    };
    
    // Keyboard event listener
    useEffect(() => {
        const handleKeyPress = (event) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
                event.preventDefault();
                movePlayer(event.key);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [playerPosition, gameStarted, gameCompleted, showQuestion]);
    
    // Render maze
    const renderMaze = () => {
        const maze = [];
        
        for (let y = 0; y < MAZE_SIZE; y++) {
            for (let x = 0; x < MAZE_SIZE; x++) {
                const isWall = mazeLayout[y][x] === 1;
                const isPlayer = playerPosition.x === x && playerPosition.y === y;
                const isExit = x === EXIT_POSITION.x && y === EXIT_POSITION.y;
                const hasEnemy = enemyPositions.some((enemy, index) => 
                    enemy.x === x && enemy.y === y && !enemies.includes(index)
                );
                
                if (isPlayer) {
                    // Player
                    maze.push(
                        <div
                            key={`player-${x}-${y}`}
                            style={{
                                position: 'absolute',
                                left: x * CELL_SIZE,
                                top: y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'transparent',
                                zIndex: 10,
                                borderRadius: '50%',
                                boxShadow: '0 0 20px rgba(0,0,0,0.9)'
                            }}
                        >
                            <div
                style={{
                    width: PLAYER_SIZE,
                    height: PLAYER_SIZE,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                                    backgroundImage: `url('${process.env.PUBLIC_URL}/Weixin Image_20251001220430_5917.jpg')`,
                                    borderRadius: '50%'
                                }}
                            />
                        </div>
                    );
                } else if (isExit) {
                    // Exit
                    maze.push(
                        <div
                            key={`exit-${x}-${y}`}
                            style={{
                                position: 'absolute',
                                left: x * CELL_SIZE,
                                top: y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#4CAF50',
                                borderRadius: '8px',
                                border: '2px solid #2E7D32',
                                zIndex: 5
                            }}
                        >
                            <span style={{ fontSize: '20px', color: 'white' }}>🚪</span>
                        </div>
                    );
                } else if (hasEnemy) {
                    // Grid with enemy - display as white background
                    maze.push(
                        <div
                            key={`enemy-cell-${x}-${y}`}
                            style={{
                                position: 'absolute',
                                left: x * CELL_SIZE,
                                top: y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                backgroundColor: '#ffffff' // White background
                }}
            />
        );
        
                    // Enemy - only show when player reaches that grid
                    const isPlayerOnEnemy = playerPosition.x === x && playerPosition.y === y;
                    if (isPlayerOnEnemy) {
                        const enemyIndex = enemyPositions.findIndex(enemy => enemy.x === x && enemy.y === y);
                maze.push(
                    <div
                                key={`enemy-${x}-${y}`}
                        style={{
                            position: 'absolute',
                                    left: x * CELL_SIZE,
                                    top: y * CELL_SIZE,
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    zIndex: 8
                                }}
                            >
                                <div
                                    style={{
                            width: ENEMY_SIZE,
                            height: ENEMY_SIZE,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                                        backgroundImage: `url('${process.env.PUBLIC_URL}/Weixin Image_20251001220420_5919.jpg')`,
                            borderRadius: '50%',
                            boxShadow: '0 0 20px rgba(0,0,0,0.9)'
                        }}
                    />
                            </div>
                );
            }
                } else if (isWall) {
                    // Wall - gold color, no border
        maze.push(
            <div
                            key={`wall-${x}-${y}`}
                style={{
                    position: 'absolute',
                                left: x * CELL_SIZE,
                                top: y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                backgroundColor: '#FFD700' // Gold color
                            }}
                        />
                    );
                } else {
                    // Passage - white, no border
                    maze.push(
                        <div
                            key={`path-${x}-${y}`}
                            style={{
                                position: 'absolute',
                                left: x * CELL_SIZE,
                                top: y * CELL_SIZE,
                                width: CELL_SIZE,
                                height: CELL_SIZE,
                                backgroundColor: '#ffffff'
                            }}
                        />
                    );
                }
            }
        }
        
        return maze;
    };
    
    return (
        <div className="maze-game magical-maze-game"
        style={{ height: 'auto', minHeight: 'unset', overflow: 'visible', padding: '0 0 8px 0'}}>
            
            {/*}
            <div className="game-header magical-header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h3>Magical Maze Adventu</h3>
                <div className="game-info" style={{ marginBottom: '20px' }}>
                    <p>Use arrow keys to move through the maze!</p>
                    <p>Find the exit while avoiding the magical enemies!</p>
                    <p>Wrong answers: {wrongAnswers}/3</p>
                </div>
                {!gameStarted && (
                    <button className="btn btn-primary magical-btn start-game-btn" onClick={startGame}>
                        <i className="fas fa-play"></i> Start Adventure
                    </button>
                )}
                {gameStarted && (
                    <button className="btn btn-outline magical-btn" onClick={restartGame}>
                        <i className="fas fa-redo"></i> Restart
                    </button>
                )}
            </div>
            */}
            {/* ===== Left and right columns: left maze + right instruction card ===== */}
            <div className="game-layout">
                {/* Left side: maze */}
                <div className="left-section">
                    <div
                        className="maze-frame"
                        style={{
                            width: MAZE_SIZE * CELL_SIZE,   // 外层按“原始尺寸”占位
                            height: MAZE_SIZE * CELL_SIZE,
                            overflow: 'visible',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        {/* 内层真正的迷宫做缩放 */}
                        <div
                            className="maze-scale"
                            style={{
                                transform: `scale(${SCALE})`,
                                transformOrigin: 'top left',
                                width: `${MAZE_SIZE * CELL_SIZE}px`,
                                height: `${MAZE_SIZE * CELL_SIZE}px`,
                                }}
                            >
                                <div
                                className="maze-container magical-maze-container"
                                style={{
                                    position: 'relative',
                                    width: `${MAZE_SIZE * CELL_SIZE}px`,
                                    height: `${MAZE_SIZE * CELL_SIZE}px`,
                                    backgroundColor: '#2c1810',
                                    border: '3px solid #9370DB',
                                    boxShadow: '0 0 20px rgba(147,112,219,.5)',
                                    borderRadius: '16px',
                                }}
                            >
                                {renderMaze()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 右侧：说明卡片 */}
                <div className="right-section">
                    <div className="maze-info-card">
                    <h3 className="maze-title">Maze Adventure</h3>
                    <p className="maze-desc">Use your wisdom to navigate the maze and reach the exit!</p>
                    <p className="maze-desc">Avoid traps, face challenges, and learn how to detect scams through gameplay.</p>

                    {/* 想和上面的开始按钮共存：随你保留或删除 */}
                    {!gameStarted ? (
                        <button className="start-game-btn" onClick={startGame}>Start Adventure</button>
                    ) : (
                        <button className="start-game-btn" onClick={restartGame}>Restart</button>
                    )}
                    </div>
                </div>
            </div>
            {/* ===== 左右两列结束 ===== */}

                {/* 问题弹窗 - 优化布局 */}
                {showQuestion && currentQuestion && (
                    <div className="question-modal magical-question-modal" style={{zIndex: 9999}}>
                        <div className="modal-overlay" style={{zIndex: 9998}}></div>
                        <div className="modal-content magical-modal-content" style={{
                            zIndex: 9999,
                            maxWidth: '700px',
                            width: '90%',
                            maxHeight: '80vh',
                            overflow: 'auto'
                        }}>
                            <div className="question-layout" style={{
                                display: 'flex',
                                gap: '25px',
                                alignItems: 'flex-start'
                            }}>
                                {/* 左侧区域 - 怪物图片 */}
                                <div className="left-section" style={{
                                    flex: '0 0 220px',
                                    textAlign: 'center'
                                }}>
                                    <div className="challenge-text" style={{
                                        marginBottom: '20px'
                                    }}>
                                        <h3 style={{
                                            fontSize: '24px',
                                            margin: '0 0 10px 0',
                                            color: '#d4af37',
                                            fontWeight: 'bold',
                                            textShadow: 'none'
                                        }}>Monster Challenge!</h3>
                                        <p style={{
                                            fontSize: '16px',
                                            margin: '0',
                                            color: '#d4af37',
                                            fontWeight: '500',
                                            textShadow: 'none'
                                        }}>Answer correctly to continue your journey!</p>
                                    </div>
                                    
                                        <div 
                                            className="monster-image"
                                            style={{
                                            width: '180px',
                                            height: '180px',
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                            backgroundImage: `url('${process.env.PUBLIC_URL}/${isAnswerWrong ? 'Weixin Image_20251001220437_5920.jpg' : 'Weixin Image_20251001220420_5919.jpg'}')`,
                                            borderRadius: '8px',
                                            margin: '0 auto',
                                            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
                                        }}
                                    />
                                            </div>
                                            
                                {/* 右侧区域 - 问题内容 */}
                                <div className="right-section" style={{
                                    flex: '1',
                                    minWidth: '0'
                                }}>
                                    <div className="question-content">
                                        <h4 style={{
                                            fontSize: '20px',
                                            color: '#d4af37',
                                            marginBottom: '20px',
                                            lineHeight: '1.4',
                                            fontWeight: 'bold',
                                            textShadow: 'none'
                                        }}>{currentQuestion.question}</h4>
                                        <div className="question-options" style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '12px'
                                        }}>
                                            {currentQuestion.options.map((option, index) => (
                                                <button
                                                    key={index}
                                                    className="option-btn magical-option-btn"
                                                    onClick={() => handleAnswer(index)}
                                                    style={{
                                                        padding: '15px 20px',
                                                        fontSize: '16px',
                                                        lineHeight: '1.4',
                                                        textAlign: 'left',
                                                        minHeight: '60px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '12px'
                                                    }}
                                                >
                                                    <span className="option-letter" style={{
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        color: '#d4af37',
                                                        minWidth: '25px'
                                                    }}>{String.fromCharCode(65 + index)}</span>
                                                    <span className="option-text" style={{
                                                        flex: '1',
                                                        fontSize: '16px',
                                                        lineHeight: '1.4'
                                                    }}>{option}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 答案反馈 */}
                {showAnswerFeedback && (
                    <div className="answer-feedback" style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        backgroundColor: '#1a1a2e',
                        border: '2px solid #d4af37',
                        padding: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                        zIndex: 10000,
                        textAlign: 'center'
                    }}>
                        <p style={{ 
                            margin: 0, 
                            fontSize: '18px',
                            color: '#d4af37',
                            fontWeight: 'bold'
                        }}>{answerFeedback}</p>
                    </div>
                )}

                {/* 庆祝动画 */}
                {showCelebration && (
                    <div className="celebration-modal magical-celebration-modal">
                        <div className="celebration-content magical-celebration-content">
                            <div className="celebration-animation">
                                <i className="fas fa-trophy celebration-icon"></i>
                                <h2>🎉 Congratulations! 🎉</h2>
                                <p>You've successfully completed the maze!</p>
                                <p>You defeated {enemies.length} enemies and reached the exit!</p>
                                <button className="btn btn-primary magical-btn" onClick={restartGame}>
                                    <i className="fas fa-redo"></i> Play Again
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        
    );
};

// FlashCard Game Component
const FlashCardGame = () => {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [isFlipping, setIsFlipping] = useState(false);
    const [shuffledCards, setShuffledCards] = useState([]);

    // Question database
    const questionDatabase = [
        {
            id: 1,
            question: "What is the most common red flag in job scams?",
            options: [
                "High salary offers",
                "Requesting upfront payment",
                "Remote work opportunities",
                "Flexible hours"
            ],
            correctAnswer: 1,
            explanation: "Legitimate employers never ask for upfront payments. This is the biggest red flag in job scams."
        },
        {
            id: 2,
            question: "How should you verify a job opportunity?",
            options: [
                "Trust the email signature",
                "Check the company's official website",
                "Call the provided phone number",
                "All of the above"
            ],
            correctAnswer: 3,
            explanation: "Always verify through multiple official channels before accepting any job offer."
        },
        {
            id: 3,
            question: "What should you do if asked to transfer money as part of your job?",
            options: [
                "Do it to prove trustworthiness",
                "Ask for written authorization",
                "Refuse and report immediately",
                "Only transfer small amounts"
            ],
            correctAnswer: 2,
            explanation: "Money laundering is illegal. No legitimate job involves transferring money for the company."
        },
        {
            id: 4,
            question: "Which of these is a legitimate job requirement?",
            options: [
                "Buying equipment from specific vendor",
                "Paying for background checks",
                "Providing bank account details",
                "None of the above"
            ],
            correctAnswer: 3,
            explanation: "Legitimate companies provide equipment and handle background checks themselves."
        }
    ];

    // 初始化游戏
    useEffect(() => {
        const shuffled = [...questionDatabase].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
    }, []);

    const handleOptionSelect = (optionIndex) => {
        setSelectedOption(optionIndex);
        // 显示答案是否正确
        const isCorrect = optionIndex === shuffledCards[currentCardIndex].correctAnswer;
        if (isCorrect) {
            setScore(prev => prev + 25);
        }
        // 显示答案反馈
        setShowAnswer(true);
        // 如果是最后一张卡片，直接完成游戏
        if (currentCardIndex >= shuffledCards.length - 1) {
            // 游戏完成，不需要更新 currentCardIndex
        }
    };

    const nextCard = () => {
        if (currentCardIndex < shuffledCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setShowAnswer(false);
            setSelectedOption(null);
            setIsFlipping(false);
        }
    };

    const resetGame = () => {
        setCurrentCardIndex(0);
        setShowAnswer(false);
        setSelectedOption(null);
        setScore(0);
        setIsFlipping(false);
        const shuffled = [...questionDatabase].sort(() => Math.random() - 0.5);
        setShuffledCards(shuffled);
    };

    const gameProgress = ((currentCardIndex + 1) / shuffledCards.length) * 100;

    if (shuffledCards.length === 0) {
        return <div>Loading...</div>;
    }

    const currentCard = shuffledCards[currentCardIndex];
    const isLastCard = currentCardIndex >= shuffledCards.length - 1;

    return (
        <div className="flashcard-game magical-flashcard-game">
            <div className="game-stats card magical-card">
                <div className="stat">
                    <span className="stat-label">Score:</span>
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
                            <span className="card-number">Question {currentCardIndex + 1}</span>
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
                                    style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
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
                            <span className="card-number">Analysis</span>
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
                            <div className="correct-label">Recommended Strategy:</div>
                            <div className="correct-text">{currentCard.options[currentCard.correctAnswer]}</div>
                        </div>

                        {!isLastCard ? (
                            <button className="btn btn-primary magical-btn next-btn" onClick={nextCard}>
                                Next Scroll <i className="fas fa-arrow-right"></i>
                            </button>
                        ) : (
                            <div className="game-complete magical-game-complete">
                                <h4>Trial Complete!</h4>
                                <p>Your final score: {score}/100</p>
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
                            <p>Always verify company contact information through official Ministry of Magic</p>
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
                            <p>Be cautious of interviews conducted only through owls or messengers</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EducationPage;