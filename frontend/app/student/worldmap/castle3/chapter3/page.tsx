"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import styles from '@/styles/castle3-chapter3.module.css';

const ChamberOfSpace = () => {
  const router = useRouter();
  
  // Game State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(6);
  const [poolsFilled, setPoolsFilled] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [gamePhase, setGamePhase] = useState('introduction'); // introduction, playing, completed
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [waterLevel, setWaterLevel] = useState(0); // 0-100 for visual feedback
  const [completedTasks, setCompletedTasks] = useState({
    round1: false,
    round2: false,
    round3: false,
    round4: false,
    round5: false,
    round6: false
  });

  // Circle pool configurations for each round
  const rounds = [
    {
      id: 1,
      type: 'full-circle',
      radius: 5,
      formula: 'πr²',
      description: 'A circular pool with radius 5m',
      hint: 'Use the formula Area = πr². With radius 5, calculate π × 5²',
      correctAnswer: 78.5, // π × 25
      tolerance: 1,
      displayShape: 'Full Circle'
    },
    {
      id: 2,
      type: 'full-circle',
      radius: 8,
      formula: 'πr²',
      description: 'A larger circular pool with radius 8m',
      hint: 'Area = πr². With radius 8, calculate π × 8²',
      correctAnswer: 201.06, // π × 64
      tolerance: 2,
      displayShape: 'Full Circle'
    },
    {
      id: 3,
      type: 'semi-circle',
      radius: 6,
      formula: '½πr²',
      description: 'A semi-circular pool with radius 6m',
      hint: 'A semi-circle is half of a full circle. Use Area = ½πr²',
      correctAnswer: 56.55, // ½ × π × 36
      tolerance: 1,
      displayShape: 'Semi-Circle'
    },
    {
      id: 4,
      type: 'semi-circle',
      radius: 10,
      formula: '½πr²',
      description: 'A larger semi-circular pool with radius 10m',
      hint: 'Half of a circle! Area = ½πr². Calculate ½ × π × 10²',
      correctAnswer: 157.08, // ½ × π × 100
      tolerance: 2,
      displayShape: 'Semi-Circle'
    },
    {
      id: 5,
      type: 'quarter-circle',
      radius: 8,
      formula: '¼πr²',
      description: 'A quarter-circle pool (sector) with radius 8m',
      hint: 'A quarter is ¼ of the full circle. Area = ¼πr²',
      correctAnswer: 50.27, // ¼ × π × 64
      tolerance: 1,
      displayShape: 'Quarter Circle (Sector)'
    },
    {
      id: 6,
      type: 'quarter-circle',
      radius: 12,
      formula: '¼πr²',
      description: 'A larger quarter-circle pool with radius 12m',
      hint: 'One quarter of the circle! Area = ¼πr². Calculate ¼ × π × 12²',
      correctAnswer: 113.10, // ¼ × π × 144
      tolerance: 2,
      displayShape: 'Quarter Circle (Sector)'
    }
  ];

  const [currentRoundData, setCurrentRoundData] = useState(rounds[0]);
  const [wizardMessage, setWizardMessage] = useState("Welcome to the Chamber of Space! The circular pools hold the secrets of area...");

  // Initialize game
  useEffect(() => {
    setCurrentRoundData(rounds[currentRound - 1]);
    setRoundCompleted(false);
    setUserAnswer('');
    setShowHint(false);
    setWaterLevel(0);
  }, [currentRound]);

  // Game introduction sequence
  useEffect(() => {
    const introSequence = [
      { delay: 2000, message: "Each pool glows with starlight. Calculate their area to fill them!", phase: 'introduction' },
      { delay: 4000, message: "Use π ≈ 3.14 for your calculations.", phase: 'playing' },
      { delay: 6000, message: rounds[0].hint, phase: 'playing' }
    ];

    introSequence.forEach(({ delay, message, phase }) => {
      setTimeout(() => {
        setWizardMessage(message);
        if (phase) setGamePhase(phase);
      }, delay);
    });
  }, []);

  // Handle answer submission
  const handleSubmit = () => {
    if (gamePhase !== 'playing' || roundCompleted || !userAnswer) return;
    
    const answer = parseFloat(userAnswer);
    const isCorrect = Math.abs(answer - currentRoundData.correctAnswer) <= currentRoundData.tolerance;
    
    if (isCorrect) {
      // Correct answer - fill the pool
      setRoundCompleted(true);
      setPoolsFilled(prev => prev + 1);
      setWaterLevel(100);
      setWizardMessage(`Excellent! The pool fills with glowing water! Area = ${currentRoundData.correctAnswer.toFixed(2)}m²`);
      
      // Update completed tasks
      const taskKey = `round${currentRound}` as keyof typeof completedTasks;
      setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setWizardMessage("Well done! Ready for the next pool?");
        } else {
          setGamePhase('completed');
          localStorage.setItem('castle3-chapter3-completed', 'true');
          setWizardMessage("Magnificent! You have mastered the Chamber of Space and earned the Orb of Infinity!");
        }
      }, 3000);
      
    } else {
      // Incorrect answer - drain partially
      setWaterLevel(30);
      setWizardMessage(`Not quite right. The pool drains partially. Try again!`);
      setTimeout(() => {
        setWaterLevel(0);
        setWizardMessage(showHint ? currentRoundData.hint : "Would you like a hint?");
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds && roundCompleted) {
      setCurrentRound(prev => prev + 1);
    } else if (currentRound >= totalRounds) {
      setGamePhase('completed');
    }
  };

  const handlePrevious = () => {
    if (currentRound > 1) {
      setCurrentRound(prev => prev - 1);
    }
  };

  const handleBack = () => {
    router.push('/student/worldmap/castle3');
  };

  const resetRound = () => {
    setRoundCompleted(false);
    setUserAnswer('');
    setWaterLevel(0);
    setShowHint(false);
    setWizardMessage(currentRoundData.description);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      setWizardMessage(currentRoundData.hint);
    }
  };

  // Render pool based on type
  const renderPool = () => {
    const radius = 100;
    const centerX = 130;
    const centerY = 130;

    return (
      <svg width="260" height="260" className={styles.poolSvg}>
        {/* Base pool outline */}
        <defs>
          <radialGradient id={`waterGlow-${currentRound}`}>
            <stop offset="0%" stopColor={waterLevel > 0 ? "#4FC3F7" : "#1E3A5F"} stopOpacity={waterLevel / 100} />
            <stop offset="100%" stopColor={waterLevel > 0 ? "#0288D1" : "#0D1B2A"} stopOpacity={waterLevel / 100} />
          </radialGradient>
        </defs>

        {/* Render based on pool type */}
        {currentRoundData.type === 'full-circle' && (
          <>
            {/* Water fill */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * (waterLevel / 100)}
              fill={`url(#waterGlow-${currentRound})`}
              className={waterLevel > 0 ? styles.glowingWater : ''}
            />
            {/* Pool outline */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="3"
              className={styles.poolOutline}
            />
          </>
        )}

        {currentRoundData.type === 'semi-circle' && (
          <>
            {/* Water fill */}
            <path
              d={`M ${centerX - radius} ${centerY} 
                  A ${radius * (waterLevel / 100)} ${radius * (waterLevel / 100)} 0 0 1 ${centerX + radius} ${centerY}
                  Z`}
              fill={`url(#waterGlow-${currentRound})`}
              className={waterLevel > 0 ? styles.glowingWater : ''}
            />
            {/* Pool outline */}
            <path
              d={`M ${centerX - radius} ${centerY} 
                  A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}
                  Z`}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="3"
              className={styles.poolOutline}
            />
          </>
        )}

        {currentRoundData.type === 'quarter-circle' && (
          <>
            {/* Water fill */}
            <path
              d={`M ${centerX} ${centerY}
                  L ${centerX + radius * (waterLevel / 100)} ${centerY}
                  A ${radius * (waterLevel / 100)} ${radius * (waterLevel / 100)} 0 0 0 ${centerX} ${centerY - radius * (waterLevel / 100)}
                  Z`}
              fill={`url(#waterGlow-${currentRound})`}
              className={waterLevel > 0 ? styles.glowingWater : ''}
            />
            {/* Pool outline */}
            <path
              d={`M ${centerX} ${centerY}
                  L ${centerX + radius} ${centerY}
                  A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius}
                  Z`}
              fill="none"
              stroke="#4A90E2"
              strokeWidth="3"
              className={styles.poolOutline}
            />
          </>
        )}

        {/* Center point */}
        <circle
          cx={centerX}
          cy={centerY}
          r="4"
          fill="#8B4513"
        />

        {/* Radius label */}
        <text 
          x={centerX + 50} 
          y={centerY + 15} 
          textAnchor="middle" 
          className={styles.poolLabel}
          fill="#E0E0E0"
          fontSize="14"
        >
          r = {currentRoundData.radius}m
        </text>
      </svg>
    );
  };

  return (
    <div className={styles.chapterContainer}>
      {/* Background overlay */}
      <div className={styles.backgroundOverlay}></div>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.chapterTitle}>Chapter 3: The Chamber of Space</h1>
        <div className={styles.progressInfo}>
          <span>Round {currentRound}/{totalRounds} - {poolsFilled}/{totalRounds} Pools Filled</span>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${(poolsFilled / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Side Panel - Task List */}
      <div className={styles.taskPanel}>
        <h3 className={styles.taskPanelTitle}>Lunar Pools</h3>
        {rounds.map((round) => (
          <div key={round.id} className={styles.taskItem}>
            <div className={styles.taskIcon}>
              {completedTasks[`round${round.id}` as keyof typeof completedTasks] ? (
                <CheckCircle size={20} color="#32CD32" />
              ) : (
                <Lock size={20} color="#8B4513" />
              )}
            </div>
            <span className={completedTasks[`round${round.id}` as keyof typeof completedTasks] ? styles.completed : ''}>
              {round.displayShape} (r={round.radius})
            </span>
          </div>
        ))}
      </div>

      {/* Main Game Area */}
      <div className={styles.gameArea}>
        {/* Wizard Character and Message - LEFT SIDE */}
        <div className={styles.wizardContainer}>
          <img 
            src="/images/wizard.png" 
            alt="Wizard Archimedes"
            className={styles.wizardImage}
          />
          <div className={styles.wizardSpeech}>
            <p>{wizardMessage}</p>
          </div>
        </div>

        {/* Central Pool Display */}
        <div className={styles.centralPedestal}>
          <div className={styles.pedestalBase}>
            <div className={styles.poolContainer}>
              {renderPool()}
            </div>
            <div className={styles.pedestalLabel}>
              <strong>{currentRoundData.displayShape}</strong>
            </div>
            <div className={styles.pedestalDescription}>
              {currentRoundData.description}
            </div>
            {/* Formula hint */}
            {showHint && (
              <div className={styles.formulaHint}>
                Formula: Area = {currentRoundData.formula}
              </div>
            )}
            {/* Input Area */}
            <div className={styles.answerInput}>
              <input
                type="number"
                step="0.01"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter area in m²"
                disabled={roundCompleted}
                className={styles.inputField}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button 
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={roundCompleted || !userAnswer}
              >
                Submit
              </button>
            </div>
            {/* Hint Button */}
            <button 
              className={styles.hintButton}
              onClick={toggleHint}
              disabled={roundCompleted}
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <button 
          className={styles.controlButton}
          onClick={handlePrevious}
          disabled={currentRound <= 1}
        >
          <ArrowLeft size={20} />
          Previous
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={handleBack}
        >
          Back to Chapter Map
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={resetRound}
        >
          <RefreshCw size={20} />
          Reset Round
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={handleNext}
          disabled={!roundCompleted}
        >
          Next Round
        </button>
      </div>

      {/* Completion Modal */}
      {gamePhase === 'completed' && (
        <div className={styles.completionModal}>
          <div className={styles.modalContent}>
            <h2>🏆 Chapter Complete!</h2>
            <p>You have earned the <strong>Orb of Infinity</strong></p>
            <div className={styles.reward}>
              <div className={styles.orb}>♾️</div>
              <p>This orb reveals the infinite space within circles and their fractions!</p>
            </div>
            <button 
              className={styles.nextChapterButton}
              onClick={() => router.push('/student/worldmap/castle3')}
            >
              Return to Castle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamberOfSpace;