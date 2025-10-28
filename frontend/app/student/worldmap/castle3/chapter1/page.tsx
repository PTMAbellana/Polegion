"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, Lock, Eye } from 'lucide-react';
import styles from '@/styles/castle3-chapter1.module.css';

const TideOfShapes = () => {
  const router = useRouter();
  
  // Game State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(6);
  const [partsSolved, setPartsSolved] = useState(0);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [gamePhase, setGamePhase] = useState('introduction'); // introduction, playing, completed
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [completedTasks, setCompletedTasks] = useState({
    center: false,
    radius: false,
    diameter: false,
    chord: false,
    arc: false,
    circumference: false
  });

  // Circle parts definitions for each round
  const rounds = [
    {
      id: 1,
      partId: 'center',
      partName: 'Center',
      description: 'The point equidistant from all points on the circle',
      hint: 'Look for the exact middle point of the circle — the heart from which all radii extend!'
    },
    {
      id: 2,
      partId: 'radius',
      partName: 'Radius',
      description: 'A line segment from the center to any point on the circle',
      hint: 'Find the line that reaches from the center to the edge of the circle!'
    },
    {
      id: 3,
      partId: 'diameter',
      partName: 'Diameter',
      description: 'A line segment passing through the center with endpoints on the circle',
      hint: 'Look for the longest line — it passes through the center and touches both sides!'
    },
    {
      id: 4,
      partId: 'chord',
      partName: 'Chord',
      description: 'A line segment with both endpoints on the circle (but not through center)',
      hint: 'Find a line that connects two points on the circle, but doesn\'t go through the center!'
    },
    {
      id: 5,
      partId: 'arc',
      partName: 'Arc',
      description: 'A portion of the circumference between two points',
      hint: 'Look for a curved section of the circle\'s edge — part of the boundary!'
    },
    {
      id: 6,
      partId: 'circumference',
      partName: 'Circumference',
      description: 'The complete perimeter or boundary of the circle',
      hint: 'This is the entire outer edge of the circle — the full boundary!'
    }
  ];

  const [currentRoundData, setCurrentRoundData] = useState(rounds[0]);
  const [wizardMessage, setWizardMessage] = useState("Welcome to the Tide of Shapes! The waves reveal the secrets of circles...");

  // Initialize game
  useEffect(() => {
    setCurrentRoundData(rounds[currentRound - 1]);
    setRoundCompleted(false);
    setSelectedPart(null);
  }, [currentRound]);

  // Game introduction sequence
  useEffect(() => {
    const introSequence = [
      { delay: 2000, message: "Each wave brings a new challenge — identify the parts of the circle!", phase: 'introduction' },
      { delay: 4000, message: "Click on the circle to find the parts I describe.", phase: 'playing' },
      { delay: 6000, message: rounds[0].hint, phase: 'playing' }
    ];

    introSequence.forEach(({ delay, message, phase }) => {
      setTimeout(() => {
        setWizardMessage(message);
        if (phase) setGamePhase(phase);
      }, delay);
    });
  }, []);

  // Handle part selection
  const handlePartClick = (partId: string) => {
    if (gamePhase !== 'playing' || roundCompleted) return;
    
    setSelectedPart(partId);
    
    if (partId === currentRoundData.partId) {
      // Correct answer
      setRoundCompleted(true);
      setPartsSolved(prev => prev + 1);
      setWizardMessage(`Excellent! You've identified the ${currentRoundData.partName}! ${currentRoundData.description}`);
      
      // Update completed tasks
      setCompletedTasks(prev => ({ ...prev, [partId]: true }));
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setWizardMessage("Well done! Ready for the next challenge?");
        } else {
          setGamePhase('completed');
          localStorage.setItem('castle3-chapter1-completed', 'true');
          setWizardMessage("Magnificent! You have mastered the Tide of Shapes and earned the Pearl of the Center!");
        }
      }, 3000);
      
    } else {
      // Incorrect answer
      setWizardMessage(`Not quite right. ${currentRoundData.hint}`);
      setTimeout(() => {
        setSelectedPart(null);
        setWizardMessage(currentRoundData.hint);
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds && roundCompleted) {
      setCurrentRound(prev => prev + 1);
      setWizardMessage(rounds[currentRound].hint);
    } else if (currentRound >= totalRounds) {
      setGamePhase('completed');
    }
  };

  const handlePrevious = () => {
    if (currentRound > 1) {
      setCurrentRound(prev => prev - 1);
      setWizardMessage(rounds[currentRound - 2].hint);
    }
  };

  const handleBack = () => {
    router.push('/student/worldmap/castle3');
  };

  const resetRound = () => {
    setRoundCompleted(false);
    setSelectedPart(null);
    setWizardMessage(currentRoundData.hint);
  };

  // Render circle with interactive parts
  const renderCircle = () => {
    const radius = 150; 
    const centerX = 150; 
    const centerY = 150; 

    return (
      <svg width="300" height="300" className={styles.circleSvg}>
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="rgba(139, 69, 19, 0.08)"
          stroke="#8B6914"
          strokeWidth="2"
          className={styles.mainCircle}
        />

        {/* CIRCUMFERENCE - Draw first (bottom layer) */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="none"
            stroke={selectedPart === 'circumference' ? '#2E8B57' : 'rgba(46, 139, 87, 0.7)'}
            strokeWidth={currentRoundData.partId === 'circumference' && !roundCompleted ? '4' : '2'}
            strokeDasharray="10,5"
            className={`${styles.circlePart} ${currentRoundData.partId === 'circumference' && !roundCompleted ? styles.targetPart : ''}`}
            onClick={() => handlePartClick('circumference')}
            style={{ cursor: 'pointer' }}
          />
        </g>

        {/* ARC */}
        <g>
          <path
            d={`M ${centerX + radius * Math.cos(Math.PI / 6)} ${centerY + radius * Math.sin(Math.PI / 6)} 
                A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos(Math.PI * 2 / 3)} ${centerY + radius * Math.sin(Math.PI * 2 / 3)}`}
            fill="none"
            stroke={selectedPart === 'arc' ? '#9370DB' : 'rgba(147, 112, 219, 0.8)'}
            strokeWidth={currentRoundData.partId === 'arc' && !roundCompleted ? '5' : '3'}
            className={`${styles.circlePart} ${currentRoundData.partId === 'arc' && !roundCompleted ? styles.targetPart : ''}`}
            onClick={() => handlePartClick('arc')}
            style={{ cursor: 'pointer' }}
          />
          <path
            d={`M ${centerX + radius * Math.cos(Math.PI / 6)} ${centerY + radius * Math.sin(Math.PI / 6)} 
                A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos(Math.PI * 2 / 3)} ${centerY + radius * Math.sin(Math.PI * 2 / 3)}`}
            fill="none"
            stroke="transparent"
            strokeWidth="15"
            onClick={() => handlePartClick('arc')}
            style={{ cursor: 'pointer' }}
          />
        </g>

        {/* CHORD */}
        <g>
          <line
            x1={centerX + radius * Math.cos(Math.PI * 5 / 6)}
            y1={centerY + radius * Math.sin(Math.PI * 5 / 6)}
            x2={centerX + radius * Math.cos(Math.PI / 4)}
            y2={centerY + radius * Math.sin(Math.PI / 4)}
            stroke={selectedPart === 'chord' ? '#4682B4' : 'rgba(70, 130, 180, 0.8)'}
            strokeWidth={currentRoundData.partId === 'chord' && !roundCompleted ? '4' : '2'}
            className={`${styles.circlePart} ${currentRoundData.partId === 'chord' && !roundCompleted ? styles.targetPart : ''}`}
            onClick={() => handlePartClick('chord')}
            style={{ cursor: 'pointer' }}
          />
          <line
            x1={centerX + radius * Math.cos(Math.PI * 5 / 6)}
            y1={centerY + radius * Math.sin(Math.PI * 5 / 6)}
            x2={centerX + radius * Math.cos(Math.PI / 4)}
            y2={centerY + radius * Math.sin(Math.PI / 4)}
            stroke="transparent"
            strokeWidth="15"
            onClick={() => handlePartClick('chord')}
            style={{ cursor: 'pointer' }}
          />
        </g>

        {/* DIAMETER */}
        <g>
          <line
            x1={centerX - radius}
            y1={centerY}
            x2={centerX + radius}
            y2={centerY}
            stroke={selectedPart === 'diameter' ? '#D2691E' : 'rgba(210, 105, 30, 0.8)'}
            strokeWidth={currentRoundData.partId === 'diameter' && !roundCompleted ? '4' : '2'}
            strokeDasharray="5,5"
            className={`${styles.circlePart} ${currentRoundData.partId === 'diameter' && !roundCompleted ? styles.targetPart : ''}`}
            onClick={() => handlePartClick('diameter')}
            style={{ cursor: 'pointer' }}
          />
          <line
            x1={centerX - radius}
            y1={centerY}
            x2={centerX + radius}
            y2={centerY}
            stroke="transparent"
            strokeWidth="15"
            onClick={() => handlePartClick('diameter')}
            style={{ cursor: 'pointer' }}
          />
        </g>

        {/* RADIUS */}
        <g>
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos(Math.PI * 3 / 4)}
            y2={centerY + radius * Math.sin(Math.PI * 3 / 4)}
            stroke={selectedPart === 'radius' ? '#CD853F' : 'rgba(205, 133, 63, 0.8)'}
            strokeWidth={currentRoundData.partId === 'radius' && !roundCompleted ? '4' : '2'}
            className={`${styles.circlePart} ${currentRoundData.partId === 'radius' && !roundCompleted ? styles.targetPart : ''}`}
            onClick={() => handlePartClick('radius')}
            style={{ cursor: 'pointer' }}
          />
          <line
            x1={centerX}
            y1={centerY}
            x2={centerX + radius * Math.cos(Math.PI * 3 / 4)}
            y2={centerY + radius * Math.sin(Math.PI * 3 / 4)}
            stroke="transparent"
            strokeWidth="15"
            onClick={() => handlePartClick('radius')}
            style={{ cursor: 'pointer' }}
          />
        </g>

        {/* CENTER POINT - Draw last (top layer) */}
        <g>
          <circle
            cx={centerX}
            cy={centerY}
            r="8"
            fill={selectedPart === 'center' ? '#8B4513' : 'rgba(139, 69, 19, 0.9)'}
            stroke={currentRoundData.partId === 'center' && !roundCompleted ? '#D2691E' : '#A0522D'}
            strokeWidth={currentRoundData.partId === 'center' && !roundCompleted ? '3' : '2'}
            className={`${styles.circlePart} ${currentRoundData.partId === 'center' && !roundCompleted ? styles.targetPart : ''}`}
            onClick={() => handlePartClick('center')}
            style={{ cursor: 'pointer' }}
          />
          {currentRoundData.partId === 'center' && !roundCompleted && (
            <circle
              cx={centerX}
              cy={centerY}
              r="12"
              fill="none"
              stroke="#D2691E"
              strokeWidth="2"
              className={styles.pulseRing}
            />
          )}
        </g>

        {/* Labels */}
        <text x={centerX} y={centerY - 12} textAnchor="middle" className={styles.circleLabel} fontSize="14" fill="#8B4513">
          O
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
        <h1 className={styles.chapterTitle}>Chapter 1: The Tide of Shapes</h1>
        <div className={styles.progressInfo}>
          <span>Round {currentRound}/{totalRounds} - {partsSolved}/{totalRounds} Parts Identified</span>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${(partsSolved / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Side Panel - Task List */}
      <div className={styles.taskPanel}>
        <h3 className={styles.taskPanelTitle}>Circle Parts</h3>
        {rounds.map((round) => (
          <div key={round.partId} className={styles.taskItem}>
            <div className={styles.taskIcon}>
              {completedTasks[round.partId as keyof typeof completedTasks] ? (
                <CheckCircle size={20} color="#32CD32" />
              ) : (
                <Lock size={20} color="#8B4513" />
              )}
            </div>
            <span className={completedTasks[round.partId as keyof typeof completedTasks] ? styles.completed : ''}>
              {round.partName}
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
              Find: <strong>{currentRoundData.partName}</strong>
            </div>
            <div className={styles.pedestalDescription}>
              {currentRoundData.description}
            </div>
            {/* Instruction Text - Inside Pedestal */}
            <div className={styles.pedestalInstruction}>
              CLICK ON THE {currentRoundData.partName.toUpperCase()} OF THE CIRCLE
            </div>
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
            <p>You have earned the <strong>Pearl of the Center</strong></p>
            <div className={styles.reward}>
              <div className={styles.pearl}>🔮</div>
              <p>This pearl reveals the sacred geometry hidden within all circles!</p>
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

export default TideOfShapes;
