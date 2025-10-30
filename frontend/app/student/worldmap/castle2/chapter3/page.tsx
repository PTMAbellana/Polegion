"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RefreshCw, CheckCircle, Lock } from 'lucide-react';
import styles from '@/styles/castle2-chapter3.module.css';

const CourtyardOfArea = () => {
  const router = useRouter();
  
  // Game State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(6);
  const [tilesRestored, setTilesRestored] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [gamePhase, setGamePhase] = useState('introduction'); // introduction, playing, completed
  const [roundCompleted, setRoundCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  const [completedTasks, setCompletedTasks] = useState({
    round1: false,
    round2: false,
    round3: false,
    round4: false,
    round5: false,
    round6: false
  });

  // Area calculation rounds
  const rounds = [
    {
      id: 1,
      shape: 'rectangle',
      shapeName: 'Rectangle',
      dimensions: { length: 8, width: 5 },
      formula: 'Area = length × width',
      correctArea: 40,
      description: 'Calculate the area of this rectangular tile',
      hint: 'Area = 8 × 5'
    },
    {
      id: 2,
      shape: 'square',
      shapeName: 'Square',
      dimensions: { side: 7 },
      formula: 'Area = side × side',
      correctArea: 49,
      description: 'Find the area of this square tile',
      hint: 'Area = 7 × 7'
    },
    {
      id: 3,
      shape: 'triangle',
      shapeName: 'Triangle',
      dimensions: { base: 10, height: 6 },
      formula: 'Area = ½ × base × height',
      correctArea: 30,
      description: 'Calculate the area of this triangular tile',
      hint: 'Area = ½ × 10 × 6'
    },
    {
      id: 4,
      shape: 'parallelogram',
      shapeName: 'Parallelogram',
      dimensions: { base: 9, height: 5 },
      formula: 'Area = base × height',
      correctArea: 45,
      description: 'Find the area of this parallelogram tile',
      hint: 'Area = 9 × 5'
    },
    {
      id: 5,
      shape: 'trapezoid',
      shapeName: 'Trapezoid',
      dimensions: { base1: 8, base2: 6, height: 5 },
      formula: 'Area = ½ × (base1 + base2) × height',
      correctArea: 35,
      description: 'Calculate the area of this trapezoid tile',
      hint: 'Area = ½ × (8 + 6) × 5'
    },
    {
      id: 6,
      shape: 'composite',
      shapeName: 'Composite Figure',
      dimensions: { rect_l: 6, rect_w: 4, tri_b: 6, tri_h: 3 },
      formula: 'Area = Rectangle + Triangle',
      correctArea: 33,
      description: 'Find the total area of this composite shape',
      hint: 'Rectangle: 6×4=24, Triangle: ½×6×3=9, Total: 24+9=33'
    }
  ];

  const [currentRoundData, setCurrentRoundData] = useState(rounds[0]);
  const [wizardMessage, setWizardMessage] = useState("Welcome to the Courtyard of Area! Restore the geometric tiles...");

  // Initialize game
  useEffect(() => {
    setCurrentRoundData(rounds[currentRound - 1]);
    setRoundCompleted(false);
    setUserAnswer('');
    setShowHint(false);
    setGlowIntensity(0);
  }, [currentRound]);

  // Game introduction sequence
  useEffect(() => {
    const introSequence = [
      { delay: 2000, message: "The courtyard tiles were designed by Ancient Mathemagicians!", phase: 'introduction' },
      { delay: 4000, message: "Calculate each tile's area to restore their balance.", phase: 'playing' },
      { delay: 6000, message: rounds[0].description, phase: 'playing' }
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
    
    if (answer === currentRoundData.correctArea) {
      // Correct answer - tile glows
      setRoundCompleted(true);
      setTilesRestored(prev => prev + 1);
      setGlowIntensity(100);
      setWizardMessage(`Excellent! The tile glows with area = ${currentRoundData.correctArea} square units!`);
      
      // Update completed tasks
      const taskKey = `round${currentRound}` as keyof typeof completedTasks;
      setCompletedTasks(prev => ({ ...prev, [taskKey]: true }));
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setWizardMessage("Well done! Ready for the next tile?");
        } else {
          setGamePhase('completed');
          localStorage.setItem('castle2-chapter3-completed', 'true');
          setWizardMessage("Magnificent! You have restored the Courtyard and earned the Medallion of Measure!");
        }
      }, 3000);
      
    } else {
      // Incorrect answer - tile dims
      setGlowIntensity(20);
      setWizardMessage(`Not quite right. Try again!`);
      setTimeout(() => {
        setGlowIntensity(0);
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
    setGlowIntensity(0);
    setWizardMessage(currentRoundData.description);
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    if (!showHint) {
      setWizardMessage(currentRoundData.hint);
    }
  };

  // Render shape with dimensions
  const renderShape = () => {
    const { shape, dimensions } = currentRoundData;

    return (
      <svg width="280" height="280" className={styles.shapeSvg}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {shape === 'rectangle' && (
          <g>
            <rect x="70" y="90" width="140" height="100" 
              fill={`rgba(76, 175, 80, ${glowIntensity / 100})`}
              stroke="#4CAF50" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            <text x="140" y="80" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              {dimensions.length}
            </text>
            <text x="50" y="145" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              {dimensions.width}
            </text>
          </g>
        )}

        {shape === 'square' && (
          <g>
            <rect x="65" y="65" width="150" height="150" 
              fill={`rgba(76, 175, 80, ${glowIntensity / 100})`}
              stroke="#4CAF50" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            <text x="140" y="55" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              {dimensions.side}
            </text>
          </g>
        )}

        {shape === 'triangle' && (
          <g>
            <polygon points="140,60 240,200 40,200" 
              fill={`rgba(76, 175, 80, ${glowIntensity / 100})`}
              stroke="#4CAF50" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            <text x="140" y="220" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              base = {dimensions.base}
            </text>
            <text x="30" y="135" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              h = {dimensions.height}
            </text>
            <line x1="140" y1="60" x2="140" y2="200" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5,5" />
          </g>
        )}

        {shape === 'parallelogram' && (
          <g>
            <polygon points="90,80 230,80 190,180 50,180" 
              fill={`rgba(76, 175, 80, ${glowIntensity / 100})`}
              stroke="#4CAF50" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            <text x="160" y="70" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              base = {dimensions.base}
            </text>
            <text x="30" y="135" textAnchor="middle" fill="#4CAF50" fontSize="16" fontWeight="bold">
              h = {dimensions.height}
            </text>
            <line x1="90" y1="80" x2="90" y2="180" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5,5" />
          </g>
        )}

        {shape === 'trapezoid' && (
          <g>
            <polygon points="90,70 190,70 230,190 50,190" 
              fill={`rgba(76, 175, 80, ${glowIntensity / 100})`}
              stroke="#4CAF50" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            <text x="140" y="60" textAnchor="middle" fill="#4CAF50" fontSize="14" fontWeight="bold">
              b₁ = {dimensions.base1}
            </text>
            <text x="140" y="210" textAnchor="middle" fill="#4CAF50" fontSize="14" fontWeight="bold">
              b₂ = {dimensions.base2}
            </text>
            <text x="30" y="135" textAnchor="middle" fill="#4CAF50" fontSize="14" fontWeight="bold">
              h = {dimensions.height}
            </text>
            <line x1="90" y1="70" x2="90" y2="190" stroke="#4CAF50" strokeWidth="2" strokeDasharray="5,5" />
          </g>
        )}

        {shape === 'composite' && (
          <g>
            {/* Rectangle */}
            <rect x="80" y="120" width="120" height="80" 
              fill={`rgba(76, 175, 80, ${glowIntensity / 100})`}
              stroke="#4CAF50" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            {/* Triangle on top */}
            <polygon points="140,60 200,120 80,120" 
              fill={`rgba(102, 187, 106, ${glowIntensity / 100})`}
              stroke="#66BB6A" strokeWidth="3"
              filter={glowIntensity > 0 ? "url(#glow)" : "none"}
            />
            <text x="140" y="165" textAnchor="middle" fill="#4CAF50" fontSize="12" fontWeight="bold">
              {dimensions.rect_l}×{dimensions.rect_w}
            </text>
            <text x="140" y="100" textAnchor="middle" fill="#66BB6A" fontSize="12" fontWeight="bold">
              b={dimensions.tri_b}, h={dimensions.tri_h}
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
        <h1 className={styles.chapterTitle}>Chapter 3: The Courtyard of Area</h1>
        <div className={styles.progressInfo}>
          <span>Round {currentRound}/{totalRounds} - {tilesRestored}/{totalRounds} Tiles Restored</span>
        </div>
        {/* Progress Bar */}
        <div className={styles.progressBarContainer}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${(tilesRestored / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      {/* Side Panel - Task List */}
      <div className={styles.taskPanel}>
        <h3 className={styles.taskPanelTitle}>Courtyard Tiles</h3>
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

        {/* Central Shape Display */}
        <div className={styles.centralPedestal}>
          <div className={styles.pedestalBase}>
            <div className={styles.pedestalLabel}>
              <strong>{currentRoundData.shapeName}</strong>
            </div>
            <div className={styles.shapeContainer}>
              {renderShape()}
            </div>
            <div className={styles.pedestalDescription}>
              {currentRoundData.description}
            </div>
            {/* Formula */}
            <div className={styles.formulaDisplay}>
              Formula: {currentRoundData.formula}
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
                step="0.1"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter area"
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
            <p>You have earned the <strong>Medallion of Measure</strong></p>
            <div className={styles.reward}>
              <div className={styles.medallion}>🏅</div>
              <p>This medallion reveals the secrets of area calculation and geometric balance!</p>
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

export default CourtyardOfArea;
