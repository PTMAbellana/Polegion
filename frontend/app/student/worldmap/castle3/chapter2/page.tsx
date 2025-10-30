"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, Lock, Eye } from 'lucide-react';
import styles from '@/styles/castle3-chapter2.module.css';

interface CircumferencePuzzle {
  id: number;
  radius?: number;
  diameter?: number;
  correctAnswer: number;
  hint: string;
}

const CoralCompass = () => {
  const router = useRouter();
  
  // Game State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [gamePhase, setGamePhase] = useState('introduction'); // introduction, playing, completed
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [completedPuzzles, setCompletedPuzzles] = useState({
    puzzle1: false,
    puzzle2: false,
    puzzle3: false,
    puzzle4: false,
    puzzle5: false
  });

  // Generate puzzles
  const puzzles: CircumferencePuzzle[] = [
    {
      id: 1,
      radius: 5,
      correctAnswer: Math.round(2 * Math.PI * 5 * 100) / 100,
      hint: `Use the formula C = 2πr. With r = 5, multiply 2 × π × 5 = 2 × 3.14 × 5`
    },
    {
      id: 2,
      diameter: 14,
      correctAnswer: Math.round(Math.PI * 14 * 100) / 100,
      hint: `Use the formula C = πd. With d = 14, multiply π × 14 = 3.14 × 14`
    },
    {
      id: 3,
      radius: 10,
      correctAnswer: Math.round(2 * Math.PI * 10 * 100) / 100,
      hint: `Use the formula C = 2πr. With r = 10, multiply 2 × π × 10 = 2 × 3.14 × 10`
    },
    {
      id: 4,
      diameter: 24,
      correctAnswer: Math.round(Math.PI * 24 * 100) / 100,
      hint: `Use the formula C = πd. With d = 24, multiply π × 24 = 3.14 × 24`
    },
    {
      id: 5,
      radius: 15,
      correctAnswer: Math.round(2 * Math.PI * 15 * 100) / 100,
      hint: `Use the formula C = 2πr. With r = 15, multiply 2 × π × 15 = 2 × 3.14 × 15`
    }
  ];

  const [currentPuzzleData, setCurrentPuzzleData] = useState(puzzles[0]);
  const [wizardMessage, setWizardMessage] = useState("Welcome to the Coral Compass! Calculate the circumference to navigate through...");

  // Initialize game
  useEffect(() => {
    setCurrentPuzzleData(puzzles[currentRound - 1]);
    setRoundCompleted(false);
    setUserAnswer('');
    setFeedback(null);
  }, [currentRound]);

  // Game introduction sequence
  useEffect(() => {
    const introSequence = [
      { delay: 2000, message: "Each coral gate requires the correct circumference to unlock!", phase: 'introduction' },
      { delay: 4000, message: "Use C = 2πr or C = πd. Remember, π ≈ 3.14", phase: 'playing' },
      { delay: 6000, message: puzzles[0].hint, phase: 'playing' }
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
    if (!userAnswer || roundCompleted) return;

    const answer = parseFloat(userAnswer);
    const tolerance = 0.5;

    if (Math.abs(answer - currentPuzzleData.correctAnswer) <= tolerance) {
      setFeedback('correct');
      setRoundCompleted(true);
      setPuzzlesSolved(prev => prev + 1);
      
      const puzzleKey = `puzzle${currentRound}` as keyof typeof completedPuzzles;
      setCompletedPuzzles(prev => ({ ...prev, [puzzleKey]: true }));
      
      setWizardMessage("Perfect! The coral gate opens!");
      
      if (currentRound === totalRounds) {
        setTimeout(() => {
          setGamePhase('completed');
          localStorage.setItem('castle3-chapter2-completed', 'true');
        }, 2000);
      }
    } else {
      setFeedback('incorrect');
      setWizardMessage("Not quite! Check your calculation and try again.");
      setTimeout(() => {
        setFeedback(null);
        setWizardMessage(showHint ? currentPuzzleData.hint : "Try again! Use the formula carefully.");
      }, 1500);
    }
  };

  const handleNext = () => {
    if (roundCompleted && currentRound < totalRounds) {
      setCurrentRound(prev => prev + 1);
      setShowHint(false);
    }
  };

  const handlePrevious = () => {
    if (currentRound > 1) {
      setCurrentRound(prev => prev - 1);
      setShowHint(false);
    }
  };

  const handleBack = () => {
    router.push('/student/worldmap/castle3');
  };

  const resetRound = () => {
    setRoundCompleted(false);
    setUserAnswer('');
    setFeedback(null);
    setWizardMessage(currentPuzzleData.hint);
  };

  // Render circle visualization
  const renderCircle = () => {
    const displayRadius = (currentPuzzleData.radius ? currentPuzzleData.radius : currentPuzzleData.diameter! / 2) * 8;
    const centerX = 150;
    const centerY = 150;

    return (
      <svg width="300" height="300" className={styles.circleSvg}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={displayRadius}
          fill="rgba(139, 69, 19, 0.08)"
          stroke="#8B6914"
          strokeWidth="3"
          className={styles.mainCircle}
        />

        {/* Center point */}
        <circle cx={centerX} cy={centerY} r="4" fill="#8B4513" />

        {/* Radius or Diameter line */}
        {currentPuzzleData.radius && (
          <>
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + displayRadius}
              y2={centerY}
              stroke="#CD853F"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x={centerX + displayRadius / 2}
              y={centerY - 10}
              textAnchor="middle"
              className={styles.circleLabel}
              fontSize="14"
              fill="#8B4513"
            >
              r = {currentPuzzleData.radius} cm
            </text>
          </>
        )}

        {currentPuzzleData.diameter && (
          <>
            <line
              x1={centerX - displayRadius}
              y1={centerY}
              x2={centerX + displayRadius}
              y2={centerY}
              stroke="#D2691E"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text
              x={centerX}
              y={centerY - 10}
              textAnchor="middle"
              className={styles.circleLabel}
              fontSize="14"
              fill="#8B4513"
            >
              d = {currentPuzzleData.diameter} cm
            </text>
          </>
        )}

        {/* Success indicator */}
        {roundCompleted && (
          <circle
            cx={centerX}
            cy={centerY}
            r={displayRadius}
            fill="none"
            stroke="#4DB6AC"
            strokeWidth="4"
            className={styles.successCircle}
          />
        )}
      </svg>
    );
  };

  return (
    <div className={styles.chapterContainer}>
      {/* Background overlay */}
      <div className={styles.backgroundOverlay}></div>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.chapterTitle}>Chapter 2: The Coral Compass</h1>
        <div className={styles.progressInfo}>
          <span>Round {currentRound}/{totalRounds} - {puzzlesSolved}/{totalRounds} Gates Unlocked</span>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${(puzzlesSolved / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Side Panel - Task List */}
      <div className={styles.taskPanel}>
        <h3 className={styles.taskPanelTitle}>Coral Gates</h3>
        {puzzles.map((puzzle) => (
          <div key={puzzle.id} className={styles.taskItem}>
            <div className={styles.taskIcon}>
              {completedPuzzles[`puzzle${puzzle.id}` as keyof typeof completedPuzzles] ? (
                <CheckCircle size={20} color="#4DB6AC" />
              ) : (
                <Lock size={20} color="#9E9E9E" />
              )}
            </div>
            <span className={completedPuzzles[`puzzle${puzzle.id}` as keyof typeof completedPuzzles] ? styles.completed : ''}>
              Gate {puzzle.id}
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

        {/* Central Circle Display */}
        <div className={styles.centralPedestal}>
          <div className={styles.pedestalBase}>
            <div className={styles.circleContainer}>
              {renderCircle()}
            </div>
            <div className={styles.pedestalLabel}>
              {currentPuzzleData.radius 
                ? `Find the circumference (r = ${currentPuzzleData.radius} cm)` 
                : `Find the circumference (d = ${currentPuzzleData.diameter} cm)`}
            </div>
            <div className={styles.pedestalDescription}>
              {currentPuzzleData.radius ? 'Use C = 2πr' : 'Use C = πd'} (π ≈ 3.14)
            </div>
            
            {/* Input Section */}
            <div className={styles.inputSection}>
              <input
                type="number"
                step="0.01"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`${styles.answerInput} ${
                  feedback === 'correct' ? styles.correctInput : 
                  feedback === 'incorrect' ? styles.incorrectInput : ''
                }`}
                placeholder="Enter answer"
                disabled={roundCompleted}
              />
              <button
                onClick={handleSubmit}
                className={styles.submitButton}
                disabled={!userAnswer || roundCompleted}
              >
                Submit
              </button>
            </div>

            {roundCompleted && (
              <div className={styles.solutionBox}>
                ✓ Answer: {currentPuzzleData.correctAnswer.toFixed(2)} cm
              </div>
            )}
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
          onClick={() => setShowHint(!showHint)}
        >
          <Eye size={20} />
          {showHint ? 'Hide Hint' : 'Show Hint'}
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
            <p>You have earned the <strong>Compass of Navigation</strong></p>
            <div className={styles.reward}>
              <div className={styles.pearl}>🧭</div>
              <p>This compass reveals the paths around all circles!</p>
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

export default CoralCompass;
