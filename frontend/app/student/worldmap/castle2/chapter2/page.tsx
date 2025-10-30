"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import styles from '@/styles/castle2-chapter2.module.css';

const PerimeterPathway = () => {
  const router = useRouter();
  
  // Game State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(6);
  const [pathsGuarded, setPathsGuarded] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [gamePhase, setGamePhase] = useState('introduction'); // introduction, playing, completed
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isTracingComplete, setIsTracingComplete] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    round1: false,
    round2: false,
    round3: false,
    round4: false,
    round5: false,
    round6: false
  });

  // Perimeter rounds configurations
  const rounds = [
    {
      id: 1,
      shape: 'triangle',
      shapeName: 'Triangle',
      sides: [4, 5, 6],
      correctPerimeter: 15,
      description: 'Trace the triangle and add its sides',
      hint: 'Add all three sides: 4 + 5 + 6'
    },
    {
      id: 2,
      shape: 'rectangle',
      shapeName: 'Rectangle',
      sides: [8, 5, 8, 5],
      correctPerimeter: 26,
      description: 'Trace the rectangle and calculate perimeter',
      hint: 'Add all four sides: 8 + 5 + 8 + 5'
    },
    {
      id: 3,
      shape: 'square',
      shapeName: 'Square',
      sides: [7, 7, 7, 7],
      correctPerimeter: 28,
      description: 'Trace the square and find the perimeter',
      hint: 'All sides are equal: 7 + 7 + 7 + 7'
    },
    {
      id: 4,
      shape: 'pentagon',
      shapeName: 'Pentagon',
      sides: [6, 5, 7, 6, 8],
      correctPerimeter: 32,
      description: 'Trace the pentagon and sum all sides',
      hint: 'Add all five sides: 6 + 5 + 7 + 6 + 8'
    },
    {
      id: 5,
      shape: 'hexagon',
      shapeName: 'Hexagon',
      sides: [5, 5, 5, 5, 5, 5],
      correctPerimeter: 30,
      description: 'Trace the hexagon and calculate perimeter',
      hint: 'All sides equal 5: 5 × 6 = 30'
    },
    {
      id: 6,
      shape: 'irregular',
      shapeName: 'Irregular Polygon',
      sides: [4, 6, 3, 5, 7, 4],
      correctPerimeter: 29,
      description: 'Trace this irregular shape carefully',
      hint: 'Add each side: 4 + 6 + 3 + 5 + 7 + 4'
    }
  ];

  const [currentRoundData, setCurrentRoundData] = useState(rounds[0]);
  const [wizardMessage, setWizardMessage] = useState("Welcome to the Perimeter Pathway! Guard the boundary by calculating perimeters...");

  // Initialize game
  useEffect(() => {
    setCurrentRoundData(rounds[currentRound - 1]);
    setRoundCompleted(false);
    setUserAnswer('');
    setShowHint(false);
    setIsTracingComplete(false);
  }, [currentRound]);

  // Game introduction sequence
  useEffect(() => {
    const introSequence = [
      { delay: 2000, message: "Sir Segment guards this bridge. Only those who can walk its boundary may pass!", phase: 'introduction' },
      { delay: 4000, message: "Trace the edges and calculate the perimeter to unlock the path.", phase: 'playing' },
      { delay: 6000, message: rounds[0].description, phase: 'playing' }
    ];

    introSequence.forEach(({ delay, message, phase }) => {
      setTimeout(() => {
        setWizardMessage(message);
        if (phase) setGamePhase(phase);
      }, delay);
    });
  }, []);

  // Handle trace completion
  const handleTraceComplete = () => {
    setIsTracingComplete(true);
    setWizardMessage("Good! Now calculate the perimeter by adding all the sides.");
  };

  // Handle answer submission
  const handleSubmit = () => {
    if (gamePhase !== 'playing' || roundCompleted || !userAnswer) return;
    
    const answer = parseInt(userAnswer);
    
    if (answer === currentRoundData.correctPerimeter) {
      // Correct answer
      setRoundCompleted(true);
      setPathsGuarded(prev => prev + 1);
      setWizardMessage(`Excellent! The perimeter is ${currentRoundData.correctPerimeter} cm. The path opens!`);
      
      // Update completed tasks
      const taskKey = `round${currentRound}` as keyof typeof completedTasks;
      setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setWizardMessage("Well done! Ready for the next pathway?");
        } else {
          setGamePhase('completed');
          localStorage.setItem('castle2-chapter2-completed', 'true');
          setWizardMessage("Magnificent! You have mastered the Perimeter Pathway and earned the Key of Edges!");
        }
      }, 3000);
      
    } else {
      // Incorrect answer
      setWizardMessage(`Not quite right. The perimeter should be ${currentRoundData.correctPerimeter} cm. Try again!`);
      setTimeout(() => {
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
    router.push('/student/worldmap/castle2');
  };

  const resetRound = () => {
    setRoundCompleted(false);
    setUserAnswer('');
    setShowHint(false);
    setIsTracingComplete(false);
    setWizardMessage(currentRoundData.description);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      setWizardMessage(currentRoundData.hint);
    }
  };

  // Render polygon with side labels
  const renderPolygon = () => {
    const size = 280;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = 100;
    const sides = currentRoundData.sides;
    const numSides = sides.length;

    const getPolygonPoints = () => {
      const points = [];
      for (let i = 0; i < numSides; i++) {
        const angle = (Math.PI * 2 * i) / numSides - Math.PI / 2;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        points.push({ x, y });
      }
      return points;
    };

    const points = getPolygonPoints();
    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

    return (
      <svg width={size} height={size} className={styles.polygonSvg}>
        {/* Main polygon */}
        <path
          d={pathData}
          fill="rgba(76, 175, 80, 0.1)"
          stroke="#4CAF50"
          strokeWidth="3"
          className={isTracingComplete ? styles.tracedPath : styles.untraced}
        />
        
        {/* Side labels */}
        {points.map((point, i) => {
          const nextPoint = points[(i + 1) % numSides];
          const midX = (point.x + nextPoint.x) / 2;
          const midY = (point.y + nextPoint.y) / 2;
          
          return (
            <g key={i}>
              <circle cx={midX} cy={midY} r="18" fill="#4CAF50" opacity="0.9" />
              <text
                x={midX}
                y={midY + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
              >
                {sides[i]}
              </text>
            </g>
          );
        })}

        {/* Trace button */}
        {!isTracingComplete && (
          <g onClick={handleTraceComplete} style={{ cursor: 'pointer' }}>
            <rect x={centerX - 40} y={centerY - 15} width="80" height="30" fill="#4CAF50" rx="5" />
            <text x={centerX} y={centerY + 5} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
              Trace Path
            </text>
          </g>
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
        <h1 className={styles.chapterTitle}>Chapter 2: The Perimeter Pathway</h1>
        <div className={styles.progressInfo}>
          <span>Round {currentRound}/{totalRounds} - {pathsGuarded}/{totalRounds} Paths Guarded</span>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${(pathsGuarded / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Side Panel - Task List */}
      <div className={styles.taskPanel}>
        <h3 className={styles.taskPanelTitle}>Boundary Paths</h3>
        {rounds.map((round) => (
          <div key={round.id} className={styles.taskItem}>
            <div className={styles.taskIcon}>
              {completedTasks[`round${round.id}` as keyof typeof completedTasks] ? (
                <CheckCircle size={20} color="#4CAF50" />
              ) : (
                <Lock size={20} color="#666" />
              )}
            </div>
            <span className={completedTasks[`round${round.id}` as keyof typeof completedTasks] ? styles.completed : ''}>
              {round.shapeName}
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

        {/* Central Polygon Display */}
        <div className={styles.centralPedestal}>
          <div className={styles.pedestalBase}>
            <div className={styles.pedestalLabel}>
              <strong>{currentRoundData.shapeName}</strong>
            </div>
            <div className={styles.polygonContainer}>
              {renderPolygon()}
            </div>
            <div className={styles.pedestalDescription}>
              All measurements are in centimeters (cm)
            </div>
            {/* Formula hint */}
            {showHint && (
              <div className={styles.formulaHint}>
                Hint: {currentRoundData.hint}
              </div>
            )}
            {/* Input Area */}
            <div className={styles.answerInput}>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter perimeter in cm"
                disabled={roundCompleted || !isTracingComplete}
                className={styles.inputField}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button 
                className={styles.submitButton}
                onClick={handleSubmit}
                disabled={roundCompleted || !userAnswer || !isTracingComplete}
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
            <p>You have earned the <strong>Key of Edges</strong></p>
            <div className={styles.reward}>
              <div className={styles.key}>🗝️</div>
              <p>This key opens the Citadel gate and unlocks the secrets of perimeters!</p>
            </div>
            <button 
              className={styles.nextChapterButton}
              onClick={() => router.push('/student/worldmap/castle2')}
            >
              Return to Castle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerimeterPathway;