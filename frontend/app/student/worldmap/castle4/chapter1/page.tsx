"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCw, Eye, Unlock, Lock, CheckCircle, RefreshCw, Lightbulb } from 'lucide-react';
import styles from '@/styles/castle4-chapter1.module.css';

const HallOfMirrors = () => {
  const router = useRouter();
  
  // Game State
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds] = useState(5);
  const [reflectionsSolved, setReflectionsSolved] = useState(0);
  const [selectedShape, setSelectedShape] = useState(null);
  const [gamePhase, setGamePhase] = useState('introduction'); // introduction, congruence, symmetry, completed
  const [currentQuestion, setCurrentQuestion] = useState('congruence'); // congruence, symmetry
  const [completedTasks, setCompletedTasks] = useState({
    lineSymmetry: false,
    congruentPairs: false,
    rotationalSymmetry: false
  });
  
  // Shape definitions for each round
  const rounds = [
    {
      id: 1,
      central: { type: 'square', hasLineSymmetry: true, hasRotationalSymmetry: true },
      options: [
        { id: 'A', type: 'square', isCongruent: true, label: 'Shape A' },
        { id: 'B', type: 'pentagon', isCongruent: false, label: 'Shape B' },
        { id: 'C', type: 'triangle', isCongruent: false, label: 'Shape C' }
      ]
    },
    {
      id: 2,
      central: { type: 'triangle', hasLineSymmetry: true, hasRotationalSymmetry: false },
      options: [
        { id: 'A', type: 'triangle', isCongruent: true, label: 'Shape A' },
        { id: 'B', type: 'pentagon', isCongruent: false, label: 'Shape B' },
        { id: 'C', type: 'square', isCongruent: false, label: 'Shape C' }
      ]
    },
    {
      id: 3,
      central: { type: 'pentagon', hasLineSymmetry: true, hasRotationalSymmetry: true },
      options: [
        { id: 'A', type: 'hexagon', isCongruent: false, label: 'Shape A' },
        { id: 'B', type: 'pentagon', isCongruent: true, label: 'Shape B' },
        { id: 'C', type: 'triangle', isCongruent: false, label: 'Shape C' }
      ]
    },
    {
      id: 4,
      central: { type: 'hexagon', hasLineSymmetry: true, hasRotationalSymmetry: true },
      options: [
        { id: 'A', type: 'pentagon', isCongruent: false, label: 'Shape A' },
        { id: 'B', type: 'square', isCongruent: false, label: 'Shape B' },
        { id: 'C', type: 'hexagon', isCongruent: true, label: 'Shape C' }
      ]
    },
    {
      id: 5,
      central: { type: 'rhombus', hasLineSymmetry: true, hasRotationalSymmetry: true },
      options: [
        { id: 'A', type: 'rhombus', isCongruent: true, label: 'Shape A' },
        { id: 'B', type: 'rectangle', isCongruent: false, label: 'Shape B' },
        { id: 'C', type: 'triangle', isCongruent: false, label: 'Shape C' }
      ]
    }
  ];
  
  const [currentRoundData, setCurrentRoundData] = useState(rounds[0]);
  const [wizardMessage, setWizardMessage] = useState("Welcome to the Hall of Mirrors! Observe the central shape on the illuminated pedestal...");
  const [showSymmetryLine, setShowSymmetryLine] = useState(false);
  const [showRotation, setShowRotation] = useState(false);
  const [roundCompleted, setRoundCompleted] = useState({ congruence: false, symmetry: false });

  // Initialize game
  useEffect(() => {
    setCurrentRoundData(rounds[currentRound - 1]);
    setRoundCompleted({ congruence: false, symmetry: false });
    setCurrentQuestion('congruence');
    setSelectedShape(null);
  }, [currentRound]);

  // Game introduction sequence
  useEffect(() => {
    const introSequence = [
      { delay: 2000, message: "Every mirror reveals a truth — some perfect, some twisted.", phase: 'introduction' },
      { delay: 4000, message: "Find the forms that match, and you'll see beyond the surface.", phase: 'introduction' },
      { delay: 6000, message: "Look at the central shape. Which of the surrounding shapes is congruent to it?", phase: 'congruence' }
    ];

    introSequence.forEach(({ delay, message, phase }) => {
      setTimeout(() => {
        setWizardMessage(message);
        if (phase) setGamePhase(phase);
      }, delay);
    });
  }, []);

  // Handle shape selection for congruence question
  const handleShapeSelection = (shapeId) => {
    if (gamePhase !== 'congruence' || roundCompleted.congruence) return;
    
    const selectedOption = currentRoundData.options.find(opt => opt.id === shapeId);
    
    if (selectedOption.isCongruent) {
      // Correct answer
      setSelectedShape(selectedOption);
      setRoundCompleted(prev => ({ ...prev, congruence: true }));
      setWizardMessage("Excellent! You've identified the congruent shape. Now, what type of symmetry does the central shape have?");
      setGamePhase('symmetry');
      setCurrentQuestion('symmetry');
      
      // Update completed tasks
      if (!completedTasks.congruentPairs) {
        setCompletedTasks(prev => ({ ...prev, congruentPairs: true }));
      }
      
      // Add visual feedback
      setTimeout(() => {
        setShowSymmetryLine(false);
        setShowRotation(false);
      }, 2000);
      
    } else {
      // Incorrect answer
      setWizardMessage("Not quite right. Look carefully at the size and shape. Which one matches exactly?");
      // Brief visual feedback for wrong answer
      setTimeout(() => {
        setWizardMessage("Try again! Look for the shape that has the same size and form as the central shape.");
      }, 2000);
    }
  };

  // Handle symmetry question
  const handleSymmetryAnswer = (symmetryType) => {
    if (gamePhase !== 'symmetry' || roundCompleted.symmetry) return;
    
    const central = currentRoundData.central;
    let isCorrect = false;
    
    if (symmetryType === 'line' && central.hasLineSymmetry) {
      isCorrect = true;
      setShowSymmetryLine(true);
      setWizardMessage("Perfect! This shape has line symmetry. See how it can be folded along a line to match perfectly!");
      
      if (!completedTasks.lineSymmetry) {
        setCompletedTasks(prev => ({ ...prev, lineSymmetry: true }));
      }
      
    } else if (symmetryType === 'rotational' && central.hasRotationalSymmetry) {
      isCorrect = true;
      setShowRotation(true);
      setWizardMessage("Excellent! This shape has rotational symmetry. Watch how it looks the same when rotated!");
      
      if (!completedTasks.rotationalSymmetry) {
        setCompletedTasks(prev => ({ ...prev, rotationalSymmetry: true }));
      }
      
    } else if (symmetryType === 'both' && central.hasLineSymmetry && central.hasRotationalSymmetry) {
      isCorrect = true;
      setShowSymmetryLine(true);
      setShowRotation(true);
      setWizardMessage("Magnificent! This shape has both line AND rotational symmetry!");
      
      setCompletedTasks(prev => ({ 
        ...prev, 
        lineSymmetry: true, 
        rotationalSymmetry: true 
      }));
    }
    
    if (isCorrect) {
      setRoundCompleted(prev => ({ ...prev, symmetry: true }));
      setReflectionsSolved(prev => prev + 1);
      
      setTimeout(() => {
        if (currentRound < totalRounds) {
          setWizardMessage("Well done! Ready for the next challenge?");
        } else {
          setGamePhase('completed');
          setWizardMessage("Magnificent! You have mastered the Hall of Mirrors and earned the Crystal of Balance!");
        }
      }, 3000);
    } else {
      setWizardMessage("Not quite. Look more carefully at the shape. Can you draw a line through it that creates two identical halves?");
    }
  };

  const handleNext = () => {
    if (currentRound < totalRounds && roundCompleted.congruence && roundCompleted.symmetry) {
      setCurrentRound(prev => prev + 1);
      setShowSymmetryLine(false);
      setShowRotation(false);
      setWizardMessage("A new challenge appears! Which shape matches the central one?");
      setGamePhase('congruence');
    } else if (currentRound >= totalRounds) {
      setGamePhase('completed');
    }
  };

  const handlePrevious = () => {
    if (currentRound > 1) {
      setCurrentRound(prev => prev - 1);
      setShowSymmetryLine(false);
      setShowRotation(false);
    }
  };

  const handleBack = () => {
    router.push('/student/worldmap/castle4');
  };

  const resetRound = () => {
    setRoundCompleted({ congruence: false, symmetry: false });
    setCurrentQuestion('congruence');
    setGamePhase('congruence');
    setSelectedShape(null);
    setShowSymmetryLine(false);
    setShowRotation(false);
    setWizardMessage("Let's try this round again. Which shape is congruent to the central shape?");
  };

  // Shape rendering function
  const renderShape = (shapeType, size = 'medium', isSelected = false, showEffects = false) => {
    const sizeMap = {
      large: 80,
      medium: 60,
      small: 40
    };
    
    const shapeSize = sizeMap[size];
    const className = `${styles.shape} ${styles[shapeType]} ${isSelected ? styles.selectedShape : ''} ${showEffects ? styles.glowingShape : ''}`;
    
    return (
      <div 
        className={className}
        style={{ 
          width: shapeSize, 
          height: shapeSize,
          animation: showRotation ? `${styles.rotateAnimation} 2s ease-in-out infinite` : 'none'
        }}
      >
        {showSymmetryLine && (
          <div className={styles.symmetryLine}></div>
        )}
      </div>
    );
  };

  return (
    <div className={styles.chapterContainer}>
      {/* Background overlay */}
      <div className={styles.backgroundOverlay}></div>
      
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.chapterTitle}>Chapter 1: Mirror Match</h1>
        <div className={styles.progressInfo}>
          <span>Round {currentRound}/{totalRounds} - {reflectionsSolved}/{totalRounds} Completed</span>
        </div>
      </div>

      {/* Side Panel - Task List */}
      <div className={styles.taskPanel}>
        <div className={styles.taskItem}>
          <div className={styles.taskIcon}>
            {completedTasks.lineSymmetry ? <CheckCircle size={20} /> : <Lock size={20} />}
          </div>
          <span className={completedTasks.lineSymmetry ? styles.completed : ''}>
            Line of Symmetry
          </span>
        </div>
        
        <div className={styles.taskItem}>
          <div className={styles.taskIcon}>
            {completedTasks.congruentPairs ? <CheckCircle size={20} /> : <Lock size={20} />}
          </div>
          <span className={completedTasks.congruentPairs ? styles.completed : ''}>
            Congruent Pairs
          </span>
        </div>
        
        <div className={styles.taskItem}>
          <div className={styles.taskIcon}>
            {completedTasks.rotationalSymmetry ? <CheckCircle size={20} /> : <Unlock size={20} />}
          </div>
          <span className={completedTasks.rotationalSymmetry ? styles.completed : ''}>
            Rotational Symmetry
          </span>
        </div>
      </div>

      {/* Main Game Area */}
      <div className={styles.gameArea}>
        {/* Central Pedestal */}
        <div className={styles.centralPedestal}>
          <div className={styles.pedestalBase}>
            <div className={styles.centralShape}>
              {renderShape(currentRoundData.central.type, 'large', false, true)}
            </div>
            <div className={styles.pedestalLabel}>Central Shape</div>
          </div>
        </div>

        {/* Option Pedestals */}
        <div className={styles.optionPedestals}>
          {currentRoundData.options.map((option, index) => (
            <div 
              key={option.id}
              className={`${styles.optionPedestal} ${selectedShape?.id === option.id ? styles.selectedPedestal : ''}`}
              onClick={() => handleShapeSelection(option.id)}
              style={{ 
                pointerEvents: gamePhase === 'congruence' && !roundCompleted.congruence ? 'auto' : 'none',
                opacity: gamePhase === 'congruence' && !roundCompleted.congruence ? 1 : 0.7
              }}
            >
              <div className={styles.optionShape}>
                {renderShape(option.type, 'medium', selectedShape?.id === option.id)}
              </div>
              <div className={styles.optionLabel}>{option.label}</div>
            </div>
          ))}
        </div>

        {/* Congruence Question Panel */}
        {gamePhase === 'congruence' && (
          <div className={styles.questionContainer}>
            <h3>Which shape is congruent to the central shape?</h3>
          </div>
        )}

        {/* Symmetry Question Panel */}
        {gamePhase === 'symmetry' && (
          <div className={styles.symmetryQuestion}>
            <h3>What type of symmetry does this shape have?</h3>
            <div className={styles.symmetryOptions}>
              <button 
                className={styles.symmetryButton}
                onClick={() => handleSymmetryAnswer('line')}
                disabled={roundCompleted.symmetry}
              >
                Line Symmetry
              </button>
              <button 
                className={styles.symmetryButton}
                onClick={() => handleSymmetryAnswer('rotational')}
                disabled={roundCompleted.symmetry}
              >
                Rotational Symmetry
              </button>
              {currentRoundData.central.hasLineSymmetry && currentRoundData.central.hasRotationalSymmetry && (
                <button 
                  className={styles.symmetryButton}
                  onClick={() => handleSymmetryAnswer('both')}
                  disabled={roundCompleted.symmetry}
                >
                  Both Types
                </button>
              )}
            </div>
          </div>
        )}

        {/* Wizard Character and Message */}
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
          disabled={!roundCompleted.congruence || !roundCompleted.symmetry}
        >
          Next Round
        </button>
      </div>

      {/* Completion Modal */}
      {gamePhase === 'completed' && (
        <div className={styles.completionModal}>
          <div className={styles.modalContent}>
            <h2>🏆 Chapter Complete!</h2>
            <p>You have earned the <strong>Crystal of Balance</strong></p>
            <div className={styles.reward}>
              <div className={styles.crystal}>💎</div>
              <p>This crystal reveals hidden symmetry lines throughout the Bastion!</p>
            </div>
            <button 
              className={styles.nextChapterButton}
              onClick={() => router.push('/student/worldmap/castle4')}
            >
              Return to Castle
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HallOfMirrors;