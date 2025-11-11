"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, ChevronRight } from 'lucide-react';
import styles from '@/styles/castle4-chapter4.module.css';

const PolygonalThrone = () => {
  const router = useRouter();
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const [puzzlesSolved, setPuzzlesSolved] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [wizardDialogue, setWizardDialogue] = useState(
    "At last, the Throne of Forms. Only one who knows the secrets of every polygon may unlock it."
  );

  // Puzzle configurations
  const puzzles = [
    {
      id: 1,
      type: 'identify',
      question: 'Identify this polygon:',
      polygon: 'hexagon',
      options: ['Triangle', 'Quadrilateral', 'Pentagon', 'Hexagon', 'Octagon'],
      correctAnswer: 'Hexagon',
      hint: 'Count the number of sides carefully.',
      sides: 6
    },
    {
      id: 2,
      type: 'angle-sum',
      question: 'What is the sum of interior angles in a pentagon?',
      polygon: 'pentagon',
      formula: '(n - 2) × 180°',
      correctAnswer: '540',
      hint: 'Use the formula: (n - 2) × 180°, where n = 5',
      sides: 5,
      calculation: '(5 - 2) × 180° = 3 × 180° = 540°'
    },
    {
      id: 3,
      type: 'regular-angle',
      question: 'Each angle in a regular octagon measures ___?',
      polygon: 'octagon',
      correctAnswer: '135',
      hint: 'Find the sum first: (8-2)×180° = 1080°, then divide by 8',
      sides: 8,
      calculation: '1080° ÷ 8 = 135°'
    },
    {
      id: 4,
      type: 'angle-sum',
      question: 'Find the sum of angles in a decagon.',
      polygon: 'decagon',
      correctAnswer: '1440',
      hint: 'A decagon has 10 sides. Apply (n - 2) × 180°',
      sides: 10,
      calculation: '(10 - 2) × 180° = 8 × 180° = 1440°'
    },
    {
      id: 5,
      type: 'comparison',
      question: 'Are these two polygons congruent or similar?',
      polygon1: 'triangle',
      polygon2: 'triangle',
      size1: 60,
      size2: 40,
      options: ['Congruent', 'Similar', 'Neither'],
      correctAnswer: 'Similar',
      hint: 'Same shape but different size means similar polygons.',
      explanation: 'These triangles have the same angles but different side lengths, making them similar.'
    },
    {
      id: 6,
      type: 'comparison',
      question: 'Are these two squares congruent or similar?',
      polygon1: 'square',
      polygon2: 'square',
      size1: 50,
      size2: 50,
      options: ['Congruent', 'Similar', 'Neither'],
      correctAnswer: 'Congruent',
      hint: 'Equal sides and angles mean congruent polygons.',
      explanation: 'These squares have equal side lengths and equal angles, making them congruent.'
    }
  ];

  const currentPuzzleData = puzzles[currentPuzzle - 1];

  // Handle answer submission
  const handleSubmit = () => {
    const answer = currentPuzzleData.type === 'identify' || currentPuzzleData.type === 'comparison'
      ? selectedOption
      : userAnswer.trim();

    if (!answer) {
      setWizardDialogue("Please provide an answer first!");
      return;
    }

    const correct = answer === currentPuzzleData.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setWizardDialogue("Excellent! You've mastered this polygon puzzle!");
      setPuzzlesSolved(puzzlesSolved + 1);
      
      setTimeout(() => {
        if (currentPuzzle < puzzles.length) {
          setCurrentPuzzle(currentPuzzle + 1);
          setUserAnswer('');
          setSelectedOption('');
          setShowFeedback(false);
          setWizardDialogue("Now for the next challenge...");
        } else {
          setShowCompletion(true);
        }
      }, 2500);
    } else {
      setWizardDialogue(`Not quite. ${currentPuzzleData.hint}`);
      
      // Continue to next puzzle after showing feedback for incorrect answer
      setTimeout(() => {
        if (currentPuzzle < puzzles.length) {
          setCurrentPuzzle(currentPuzzle + 1);
          setUserAnswer('');
          setSelectedOption('');
          setShowFeedback(false);
          setWizardDialogue("Let's try the next puzzle.");
        } else {
          setShowCompletion(true);
        }
      }, 2500);
    }
  };

  // Handle next puzzle
  const handleNext = () => {
    if (currentPuzzle < puzzles.length) {
      setCurrentPuzzle(currentPuzzle + 1);
      setUserAnswer('');
      setSelectedOption('');
      setShowFeedback(false);
      setWizardDialogue("Let's continue to the next puzzle.");
    }
  };

  // Handle previous puzzle
  const handlePreviousPuzzle = () => {
    if (currentPuzzle > 1) {
      setCurrentPuzzle(currentPuzzle - 1);
      setUserAnswer('');
      setSelectedOption('');
      setShowFeedback(false);
      setWizardDialogue("Let's review this puzzle.");
    }
  };

  // Handle showing hint
  const handleShowHint = () => {
    setWizardDialogue(currentPuzzleData.hint);
  };

  // Navigation handlers
  const handlePrevious = () => {
    router.push('/student/worldmap/castle4');
  };

  const handleHome = () => {
    router.push('/student/worldmap');
  };

  const handleNextChapter = () => {
    localStorage.setItem('castle4-chapter4-completed', 'true');
    localStorage.setItem('castle4-completed', 'true');
    router.push('/student/worldmap');
  };

  // Render polygon shape
  const renderPolygon = (type, size = 80, color = '#9370DB') => {
    const shapeStyle = {
      transition: 'all 0.3s ease',
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
      case 'octagon':
        return (
          <div 
            className={styles.shapeOctagon} 
            style={{ 
              ...shapeStyle,
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        );
      case 'decagon':
        return (
          <div 
            className={styles.shapeDecagon} 
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

  return (
    <div className={styles.chapterContainer}>
      <div className={styles.backgroundOverlay}></div>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.chapterTitle}>Chapter 4: The Polygonal Throne</h1>
        <div className={styles.progressContainer}>
          <p className={styles.progressInfo}>Puzzle {currentPuzzle} of {puzzles.length}</p>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${(puzzlesSolved / puzzles.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className={styles.gameArea}>
        {/* Puzzle Display Panel - Left Side */}
        <div className={styles.puzzlePanel}>
          <h3 className={styles.panelTitle}>Polygon Display</h3>
          <div className={styles.polygonDisplay}>
            {currentPuzzleData.type === 'comparison' ? (
              <div className={styles.comparisonContainer}>
                <div className={styles.polygonBox}>
                  {renderPolygon(currentPuzzleData.polygon1, currentPuzzleData.size1, '#9370DB')}
                  <p className={styles.polygonLabel}>Polygon A</p>
                </div>
                <div className={styles.polygonBox}>
                  {renderPolygon(currentPuzzleData.polygon2, currentPuzzleData.size2, '#4FC3F7')}
                  <p className={styles.polygonLabel}>Polygon B</p>
                </div>
              </div>
            ) : (
              <div className={styles.singlePolygon}>
                {renderPolygon(currentPuzzleData.polygon, 120, '#66BBFF')}
                {currentPuzzleData.sides && (
                  <p className={styles.sidesInfo}>{currentPuzzleData.sides} sides</p>
                )}
              </div>
            )}
          </div>
          
          {currentPuzzleData.formula && (
            <div className={styles.formulaBox}>
              <p className={styles.formulaTitle}>Formula:</p>
              <p className={styles.formulaText}>{currentPuzzleData.formula}</p>
              {currentPuzzleData.calculation && showFeedback && isCorrect && (
                <p className={styles.calculationText}>{currentPuzzleData.calculation}</p>
              )}
            </div>
          )}
        </div>

        {/* Central Question Area */}
        <div className={styles.centralArea}>
          <div className={styles.questionBox}>
            <h2 className={styles.questionText}>{currentPuzzleData.question}</h2>
          </div>

          <div className={styles.answerArea}>
            {(currentPuzzleData.type === 'identify' || currentPuzzleData.type === 'comparison') ? (
              <div className={styles.optionsGrid}>
                {currentPuzzleData.options.map((option, index) => (
                  <button
                    key={index}
                    className={`${styles.optionButton} ${
                      selectedOption === option ? styles.selectedOption : ''
                    } ${
                      showFeedback && option === currentPuzzleData.correctAnswer
                        ? styles.correctOption
                        : showFeedback && selectedOption === option && !isCorrect
                        ? styles.wrongOption
                        : ''
                    }`}
                    onClick={() => !showFeedback && setSelectedOption(option)}
                    disabled={showFeedback}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : (
              <div className={styles.inputArea}>
                <input
                  type="number"
                  className={styles.answerInput}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter your answer"
                  disabled={showFeedback}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !showFeedback) {
                      handleSubmit();
                    }
                  }}
                />
                <span className={styles.degreesSymbol}>°</span>
              </div>
            )}

            {showFeedback && (
              <div className={`${styles.feedbackBox} ${isCorrect ? styles.correctFeedback : styles.wrongFeedback}`}>
                <p className={styles.feedbackText}>
                  {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                {currentPuzzleData.explanation && isCorrect && (
                  <p className={styles.explanationText}>{currentPuzzleData.explanation}</p>
                )}
              </div>
            )}
          </div>

          <div className={styles.actionButtons}>
            {!showFeedback && (
              <>
                <button className={styles.hintButton} onClick={handleShowHint}>
                  Show Hint
                </button>
                <button className={styles.submitButton} onClick={handleSubmit}>
                  Submit Answer
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info Panel - Right Side */}
        <div className={styles.infoPanel}>
          <h3 className={styles.panelTitle}>Angle Facts</h3>
          <div className={styles.infoContent}>
            <div className={styles.infoCard}>
              <p className={styles.infoTitle}>Interior Angle Sum:</p>
              <p className={styles.infoFormula}>(n - 2) × 180°</p>
              <p className={styles.infoNote}>n = number of sides</p>
            </div>
            
            <div className={styles.infoCard}>
              <p className={styles.infoTitle}>Regular Polygon:</p>
              <p className={styles.infoFormula}>Sum ÷ n</p>
              <p className={styles.infoNote}>Each angle is equal</p>
            </div>

            <div className={styles.infoCard}>
              <p className={styles.infoTitle}>Congruent:</p>
              <p className={styles.infoNote}>Same shape & size</p>
              <p className={styles.infoNote}>Equal sides & angles</p>
            </div>

            <div className={styles.infoCard}>
              <p className={styles.infoTitle}>Similar:</p>
              <p className={styles.infoNote}>Same shape</p>
              <p className={styles.infoNote}>Different size</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wizard Container */}
      <div className={styles.wizardContainer}>
        <img 
          src="/images/wizard.png" 
          alt="Wizard Archimedes"
          className={styles.wizardImage}
        />
        <div className={styles.wizardSpeech}>
          <p>{wizardDialogue}</p>
        </div>
      </div>

      {/* Control Panel */}
      <div className={styles.controlPanel}>
        <button 
          className={styles.controlButton} 
          onClick={handlePreviousPuzzle}
          disabled={currentPuzzle === 1}
        >
          <ArrowLeft size={20} />
          <span>Previous</span>
        </button>
        
        <button className={styles.controlButton} onClick={handlePrevious}>
          <Home size={20} />
          <span>Back to Chapter Map</span>
        </button>
        
        <button 
          className={styles.controlButton}
          onClick={handleNext}
          disabled={currentPuzzle >= puzzles.length || !showFeedback || !isCorrect}
        >
          <span>Next</span>
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div className={styles.completionModal}>
          <div className={styles.modalContent}>
            <h2>🎉 The Throne Unlocked! 🎉</h2>
            <p>You have mastered the secrets of polygons and conquered the Bastion of Forms!</p>
            
            <div className={styles.reward}>
              <div className={styles.crystal}>👑</div>
              <p>Crown of Angles</p>
            </div>

            <p>The final relic is yours. The geometry of the ancients bows before your wisdom!</p>
            
            <button className={styles.nextChapterButton} onClick={handleNextChapter}>
              <ChevronRight size={24} />
              <span>Return to World Map</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolygonalThrone;
