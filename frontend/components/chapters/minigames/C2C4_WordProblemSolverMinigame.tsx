// Castle 2 Chapter 4 - Word Problem Solver Minigame
// Solve angle word problems involving complementary and supplementary angles

'use client';

import React, { useState } from 'react';
import { MinigameQuestion } from '@/types/common/quiz';

interface C2C4_WordProblemSolverMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, userAnswer?: number) => void;
  styleModule: { readonly [key: string]: string };
}

const C2C4_WordProblemSolverMinigame: React.FC<C2C4_WordProblemSolverMinigameProps> = ({
  question,
  onComplete,
  styleModule,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const problem = question.problem || question.instruction;
  const correctAnswer = Number(question.correctAnswer);
  const solution = question.solution || '';

  const handleSubmit = () => {
    if (showFeedback || !userAnswer) return;

    const numericAnswer = parseInt(userAnswer, 10);
    
    if (isNaN(numericAnswer)) {
      setFeedback('Please enter a valid number');
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2000);
      return;
    }

    const isCorrect = numericAnswer === correctAnswer;

    setFeedback(
      isCorrect
        ? `Correct! The answer is ${correctAnswer}°`
        : `Not quite. The correct answer is ${correctAnswer}°`
    );
    setShowFeedback(true);

    if (!isCorrect) {
      setShowSolution(true);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setShowSolution(false);
      setUserAnswer('');
      onComplete(isCorrect, numericAnswer);
    }, isCorrect ? 2500 : 4000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const renderProblemDiagram = () => {
    const imagePath = `/images/castle2/chapter4/problem-${question.id}.webp`;
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          minHeight: '250px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '2px dashed #B0CE88',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          margin: '0 auto'
        }}>
          <img 
            src={imagePath} 
            alt={question.description || 'Word problem diagram'}
            style={{ 
              maxWidth: '100%', 
              maxHeight: '100%',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'block';
            }}
          />
          <div style={{ 
            display: 'none',
            color: '#4C763B',
            fontSize: '0.9rem',
            textAlign: 'center',
            lineHeight: '1.5'
          }}>
            Diagram visualization for:<br />
            <strong style={{ color: '#FFFD8F' }}>{problem}</strong>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styleModule.minigameContainer}>
      <div style={{
        fontSize: '1.2rem',
        fontWeight: '700',
        color: '#FFFD8F',
        marginBottom: '1.5rem',
        textAlign: 'center',
        fontFamily: 'Cinzel, serif',
      }}>
        Word Problem Challenge
      </div>

      {/* Side-by-side layout: Diagram left, Controls right */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'start',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
        width: '100%',
      }}>
        {/* Left: Problem Diagram */}
        <div style={{ flex: '0 0 auto', maxWidth: '350px' }}>
          {renderProblemDiagram()}
          
          {/* Problem Type Indicator */}
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
          }}>
            {question.type === 'complementary' && (
              <div style={{
                padding: '6px 12px',
                background: 'rgba(176, 206, 136, 0.2)',
                border: '1px solid #B0CE88',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#B0CE88',
                fontWeight: '600',
              }}>
                Complementary (90°)
              </div>
            )}
            {question.type === 'supplementary' && (
              <div style={{
                padding: '6px 12px',
                background: 'rgba(255, 253, 143, 0.2)',
                border: '1px solid #FFFD8F',
                borderRadius: '6px',
                fontSize: '0.8rem',
                color: '#FFFD8F',
                fontWeight: '600',
              }}>
                Supplementary (180°)
              </div>
            )}
          </div>
        </div>

        {/* Right: Controls */}
        <div style={{
          flex: '1 1 300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '280px',
          maxWidth: '450px',
        }}>
          {/* Problem Statement */}
          <div style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.15) 0%, rgba(176, 206, 136, 0.1) 100%)',
            border: '2px solid #B0CE88',
            borderRadius: '12px',
          }}>
            <div style={{
              fontSize: '0.95rem',
              lineHeight: '1.6',
              color: '#F5EFE7',
            }}>
              {problem}
            </div>
          </div>

          {/* Answer Input */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}>
            <label style={{
              fontSize: '0.95rem',
              color: '#FFFD8F',
              fontWeight: '600',
              whiteSpace: 'nowrap',
            }}>
              Answer:
            </label>
            <input
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter angle"
              disabled={showFeedback}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '1rem',
                fontWeight: '600',
                background: 'rgba(26, 26, 46, 0.6)',
                border: '2px solid #B0CE88',
                borderRadius: '8px',
                color: '#FFFD8F',
                textAlign: 'center',
              }}
            />
            <span style={{ fontSize: '1.2rem', color: '#FFFD8F', fontWeight: 'bold' }}>°</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={showFeedback || !userAnswer}
            style={{
              padding: '10px 28px',
              fontSize: '0.95rem',
              fontWeight: '700',
              background: showFeedback || !userAnswer
                ? 'rgba(176, 206, 136, 0.3)'
                : 'linear-gradient(135deg, #FFFD8F 0%, #B0CE88 100%)',
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              color: showFeedback || !userAnswer ? '#888' : '#043915',
              cursor: showFeedback || !userAnswer ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              width: '100%',
            }}
          >
            Submit Answer
          </button>

          {/* Hint */}
          {question.hint && !showFeedback && (
            <div style={{
              padding: '10px 12px',
              fontSize: '0.8rem',
              background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.15) 0%, rgba(176, 206, 136, 0.1) 100%)',
              border: '1.5px solid rgba(176, 206, 136, 0.3)',
              borderRadius: '8px',
              color: '#FFFD8F',
              lineHeight: '1.4',
            }}>
              <strong style={{ color: '#B0CE88', fontSize: '0.7rem' }}>Hint:</strong>
              <br />
              {question.hint}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              padding: '12px 16px',
              fontSize: '0.95rem',
              fontWeight: '700',
              background: feedback.includes('Correct')
                ? 'linear-gradient(135deg, rgba(176, 206, 136, 0.3) 0%, rgba(76, 118, 59, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(255, 138, 128, 0.25) 0%, rgba(255, 205, 210, 0.2) 100%)',
              border: feedback.includes('Correct')
                ? '2px solid rgba(176, 206, 136, 0.6)'
                : '2px solid rgba(255, 138, 128, 0.5)',
              borderRadius: '8px',
              color: feedback.includes('Correct') ? '#B0CE88' : '#FF8A80',
              textAlign: 'center',
              animation: 'slideIn 0.3s ease-out',
            }}>
              {feedback}
            </div>
          )}

          {/* Solution */}
          {showSolution && solution && (
            <div style={{
              padding: '14px 16px',
              fontSize: '0.9rem',
              background: 'rgba(255, 253, 143, 0.1)',
              border: '2px solid rgba(176, 206, 136, 0.4)',
              borderRadius: '8px',
              color: '#F5EFE7',
              lineHeight: '1.6',
            }}>
              <div style={{
                fontSize: '0.85rem',
                color: '#B0CE88',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}>
                Solution:
              </div>
              {solution}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default C2C4_WordProblemSolverMinigame;
