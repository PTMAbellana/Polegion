"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, ChevronRight, RotateCw, FlipHorizontal, Move } from 'lucide-react';
import styles from '@/styles/castle4-chapter3.module.css';

const ChamberOfMotion = () => {
  const router = useRouter();
  const [currentLevel, setCurrentLevel] = useState(1);
  const [transformationsCompleted, setTransformationsCompleted] = useState(0);
  const [shapePosition, setShapePosition] = useState({ x: 2, y: 2 });
  const [shapeRotation, setShapeRotation] = useState(0);
  const [shapeReflected, setShapeReflected] = useState(false);
  const [targetPosition, setTargetPosition] = useState({ x: 5, y: 4 });
  const [targetRotation, setTargetRotation] = useState(0);
  const [targetReflected, setTargetReflected] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState('');
  const [showCompletion, setShowCompletion] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [wizardDialogue, setWizardDialogue] = useState(
    "Shapes are not bound to stillness. They move, turn, and mirror through the world."
  );

  // Grid size - reduced to 5x5
  const GRID_SIZE = 5;

  // Level configurations
  const levels = [
    {
      id: 1,
      type: 'translation',
      shape: 'triangle',
      startPos: { x: 1, y: 1 },
      targetPos: { x: 3, y: 3 },
      startRotation: 0,
      targetRotation: 0,
      startReflected: false,
      targetReflected: false,
      instruction: 'Move the triangle 2 units right, 2 units down',
      hint: 'Use the arrow buttons to translate the shape',
      reward: 'Translation Gem'
    },
    {
      id: 2,
      type: 'reflection',
      shape: 'square',
      startPos: { x: 2, y: 2 },
      targetPos: { x: 2, y: 2 },
      startRotation: 0,
      targetRotation: 0,
      startReflected: false,
      targetReflected: true,
      instruction: 'Reflect the square across the y-axis',
      hint: 'Click the reflect button to mirror the shape',
      reward: 'Mirror Crystal'
    },
    {
      id: 3,
      type: 'rotation',
      shape: 'hexagon',
      startPos: { x: 2, y: 2 },
      targetPos: { x: 2, y: 2 },
      startRotation: 0,
      targetRotation: 90,
      startReflected: false,
      targetReflected: false,
      instruction: 'Rotate the hexagon 90° clockwise',
      hint: 'Use the rotate button to turn the shape',
      reward: 'Rotation Orb'
    },
    {
      id: 4,
      type: 'combined',
      shape: 'pentagon',
      startPos: { x: 0, y: 0 },
      targetPos: { x: 4, y: 4 },
      startRotation: 0,
      targetRotation: 180,
      startReflected: false,
      targetReflected: false,
      instruction: 'Move 4 right, 4 down, then rotate 180°',
      hint: 'Combine translation and rotation',
      reward: 'Transformation Stone'
    },
    {
      id: 5,
      type: 'complex',
      shape: 'triangle',
      startPos: { x: 1, y: 2 },
      targetPos: { x: 3, y: 2 },
      startRotation: 0,
      targetRotation: 270,
      startReflected: false,
      targetReflected: true,
      instruction: 'Move 2 right, rotate 270°, then reflect',
      hint: 'Master all transformations together',
      reward: 'Master\'s Gear'
    }
  ];

  // Initialize level
  useEffect(() => {
    const level = levels[currentLevel - 1];
    if (level) {
      setShapePosition(level.startPos);
      setShapeRotation(level.startRotation);
      setShapeReflected(level.startReflected);
      setTargetPosition(level.targetPos);
      setTargetRotation(level.targetRotation);
      setTargetReflected(level.targetReflected);
      setCurrentInstruction(level.instruction);
      setWizardDialogue(level.hint);
      setLevelCompleted(false);
    }
  }, [currentLevel]);

  // Handle translation
  const handleMove = (dx, dy) => {
    const newX = Math.max(0, Math.min(GRID_SIZE - 1, shapePosition.x + dx));
    const newY = Math.max(0, Math.min(GRID_SIZE - 1, shapePosition.y + dy));
    setShapePosition({ x: newX, y: newY });
    setWizardDialogue(`Moved to position (${newX}, ${newY})`);
  };

  // Handle rotation
  const handleRotate = () => {
    const newRotation = (shapeRotation + 90) % 360;
    setShapeRotation(newRotation);
    setWizardDialogue(`Rotated to ${newRotation}°`);
  };

  // Handle reflection
  const handleReflect = () => {
    setShapeReflected(!shapeReflected);
    setWizardDialogue(shapeReflected ? 'Reflection removed' : 'Shape reflected');
  };

  // Check if transformation is complete
  const checkCompletion = () => {
    const posMatch = shapePosition.x === targetPosition.x && 
                     shapePosition.y === targetPosition.y;
    const rotMatch = shapeRotation === targetRotation;
    const refMatch = shapeReflected === targetReflected;

    if (posMatch && rotMatch && refMatch && !levelCompleted) {
      setLevelCompleted(true);
      const newCompleted = transformationsCompleted + 1;
      setTransformationsCompleted(newCompleted);
      
      if (currentLevel < levels.length) {
        // Not the last level - just move to next
        setWizardDialogue("Perfect! Moving to next transformation...");
        setTimeout(() => {
          setCurrentLevel(currentLevel + 1);
        }, 1500);
      } else {
        // Last level completed - show final modal
        setWizardDialogue("All transformations mastered!");
        setTimeout(() => {
          setShowCompletion(true);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    checkCompletion();
  }, [shapePosition, shapeRotation, shapeReflected]);

  // Reset current level
  const handleReset = () => {
    const level = levels[currentLevel - 1];
    setShapePosition(level.startPos);
    setShapeRotation(level.startRotation);
    setShapeReflected(level.startReflected);
    setLevelCompleted(false);
    setWizardDialogue("Level reset. Try again!");
  };

  // Navigation handlers
  const handlePrevious = () => {
    router.push('/student/worldmap/castle4/chapter3');
  };

  const handleBackToChapterMap = () => {
    router.push('/student/worldmap/castle4');
  };

  const handleNext = () => {
    localStorage.setItem('castle4-chapter3-completed', 'true');
    router.push('/student/worldmap/castle4');
  };

  // Render shape
  const renderShape = (type, color, rotation, reflected, size = 50) => {
    const shapeStyle = {
      transform: `rotate(${rotation}deg) scaleX(${reflected ? -1 : 1})`,
      transition: 'transform 0.5s ease',
    };

    switch (type) {
      case 'triangle':
        return (
          <div 
            className={styles.shapeTriangle} 
            style={{ 
              ...shapeStyle,
              borderBottomColor: color,
              borderLeftWidth: size / 2,
              borderRightWidth: size / 2,
              borderBottomWidth: size * 0.86,
            }}
          />
        );
      case 'square':
        return (
          <div 
            className={styles.shapeSquare} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      case 'hexagon':
        return (
          <div 
            className={styles.shapeHexagon} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      case 'pentagon':
        return (
          <div 
            className={styles.shapePentagon} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      default:
        return null;
    }
  };

  const currentShape = levels[currentLevel - 1]?.shape || 'triangle';

  return (
    <div className={styles.chapterContainer}>
      <div className={styles.backgroundOverlay}></div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.chapterTitle}>Chapter 3: The Chamber of Motion</h1>
        <div className={styles.progressContainer}>
          <p className={styles.progressInfo}>{transformationsCompleted}/{levels.length} Transformations Completed</p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ 
                width: `${(transformationsCompleted / levels.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className={styles.gameArea}>
        {/* Control Panel - Left Side */}
        <div className={styles.controlsPanel}>
          <h3 className={styles.panelTitle}>Transform Controls</h3>

          {/* Translation Controls */}
          <div className={styles.transformSection}>
            <h4 className={styles.transformTitle}>
              <Move size={16} />
              Translation
            </h4>
            <div className={styles.directionPad}>
              <button className={styles.dirButton} onClick={() => handleMove(0, -1)}>↑</button>
              <div className={styles.dirRow}>
                <button className={styles.dirButton} onClick={() => handleMove(-1, 0)}>←</button>
                <button className={styles.dirButton} onClick={() => handleMove(1, 0)}>→</button>
              </div>
              <button className={styles.dirButton} onClick={() => handleMove(0, 1)}>↓</button>
            </div>
          </div>

          {/* Rotation Control */}
          <div className={styles.transformSection}>
            <h4 className={styles.transformTitle}>
              <RotateCw size={16} />
              Rotation
            </h4>
            <button className={styles.actionButton} onClick={handleRotate}>
              Rotate 90° CW
            </button>
            <p className={styles.statusText}>Current: {shapeRotation}°</p>
          </div>

          {/* Reflection Control */}
          <div className={styles.transformSection}>
            <h4 className={styles.transformTitle}>
              <FlipHorizontal size={16} />
              Reflection
            </h4>
            <button className={styles.actionButton} onClick={handleReflect}>
              Reflect Y-Axis
            </button>
            <p className={styles.statusText}>
              {shapeReflected ? 'Reflected' : 'Normal'}
            </p>
          </div>

          <button className={styles.resetButton} onClick={handleReset}>
            Reset Level
          </button>
        </div>

        {/* Central Grid with Instruction */}
        <div className={styles.centralArea}>
          {/* Instruction Box Above Grid */}
          <div className={styles.instructionBox}>
            <p className={styles.instructionText}>{currentInstruction}</p>
          </div>

          <div className={styles.gridContainer}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const isShapePosition = x === shapePosition.x && y === shapePosition.y;
              const isTargetPosition = x === targetPosition.x && y === targetPosition.y;

              return (
                <div
                  key={index}
                  className={`${styles.gridCell} ${
                    isTargetPosition ? styles.targetCell : ''
                  }`}
                >
                  {isShapePosition && renderShape(
                    currentShape,
                    '#FF69B4',
                    shapeRotation,
                    shapeReflected,
                    40
                  )}
                  {isTargetPosition && (
                    <div className={styles.targetOutline}>
                      {renderShape(
                        currentShape,
                        'rgba(102, 187, 255, 0.3)',
                        targetRotation,
                        targetReflected,
                        40
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Position Info Panel - Right Side */}
        <div className={styles.levelPanel}>
          <h3 className={styles.panelTitle}>Position Info</h3>
          
          <div className={styles.coordinateInfo}>
            <div className={styles.coordItem}>
              <span className={styles.coordLabel}>Current:</span>
              <span className={styles.coordValue}>({shapePosition.x}, {shapePosition.y})</span>
            </div>
            <div className={styles.coordItem}>
              <span className={styles.coordLabel}>Target:</span>
              <span className={styles.coordValue}>({targetPosition.x}, {targetPosition.y})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Container - Right Side */}
      <div className={styles.wizardContainer}>
        <div className={styles.wizardSpeech}>
          <p>{wizardDialogue}</p>
        </div>
        <img 
          src="/images/wizard.png" 
          alt="Wizard Archimedes"
          className={styles.wizardImage}
        />
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <button className={styles.controlButton} onClick={handlePrevious}>
          <ArrowLeft size={20} />
          <span>Previous</span>
        </button>
        
        <button className={styles.controlButton} onClick={handleBackToChapterMap}>
          <Home size={20} />
          <span>Back to Chapter Map</span>
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={handleNext}
          disabled={transformationsCompleted < levels.length}
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Final Completion Modal - ONLY shows after 5/5 */}
      {showCompletion && (
        <div className={styles.completionModal}>
          <div className={styles.modalContent}>
            <h2>🎉 Transformation Mastery!</h2>
            <p>The Bastion's gears align once more!</p>
            <div className={styles.reward}>
              <div className={styles.crystal}>⚙️</div>
              <p>Reward: Cog of Motion</p>
            </div>
            <div className={styles.allRewardsEarned}>
              <p className={styles.rewardsTitle}>All Transformations Mastered:</p>
              <div className={styles.rewardsList}>
                {levels.map((level, index) => (
                  <div key={index} className={styles.earnedReward}>
                    <span>✓</span> {level.reward}
                  </div>
                ))}
              </div>
            </div>
            <button className={styles.nextChapterButton} onClick={handleNext}>
              Proceed to Next Chapter
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChamberOfMotion;