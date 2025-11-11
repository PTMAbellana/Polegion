'use client';

import React, { useState } from 'react';
import { MinigameQuestion } from '@/types/common/quiz';

interface WordProblemSolverMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, userAnswer?: number) => void;
  styleModule: { readonly [key: string]: string };
}

const WordProblemSolverMinigame: React.FC<WordProblemSolverMinigameProps> = ({
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
        ? `✓ Correct! The answer is ${correctAnswer}°`
        : `✗ Not quite. The correct answer is ${correctAnswer}°`
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

  return (
    <div className={styleModule.minigameContainer}>
      {/* Problem Statement */}
      <div style={{
        marginBottom: '2rem',
      }}>
        <div style={{
          fontSize: '1.2rem',
          fontWeight: '700',
          color: '#FFFD8F',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          📖 Word Problem Challenge
        </div>
        
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.15) 0%, rgba(176, 206, 136, 0.1) 100%)',
          border: '2px solid #B0CE88',
          borderRadius: '12px',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: '#F5EFE7',
            textAlign: 'center',
          }}>
            {problem}
          </div>
        </div>

        {question.description && (
          <div style={{
            padding: '1rem',
            fontSize: '0.9rem',
            color: '#B0CE88',
            fontStyle: 'italic',
            textAlign: 'center',
            border: '1px solid rgba(176, 206, 136, 0.3)',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}>
            {question.description}
          </div>
        )}
      </div>

      {/* Answer Input */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        maxWidth: '500px',
        margin: '0 auto',
      }}>
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          width: '100%',
        }}>
          <label style={{
            fontSize: '1.1rem',
            color: '#FFFD8F',
            fontWeight: '600',
          }}>
            Answer:
          </label>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your answer"
            disabled={showFeedback}
            style={{
              flex: 1,
              padding: '14px 20px',
              fontSize: '1.2rem',
              fontWeight: '600',
              background: 'rgba(26, 26, 46, 0.6)',
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              color: '#FFFD8F',
              textAlign: 'center',
            }}
          />
          <span style={{ fontSize: '1.5rem', color: '#FFFD8F', fontWeight: 'bold' }}>°</span>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={showFeedback || !userAnswer}
          style={{
            padding: '14px 40px',
            fontSize: '1.1rem',
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
            maxWidth: '300px',
          }}
        >
          Submit Answer
        </button>

        {/* Hint */}
        {question.hint && !showFeedback && (
          <div style={{
            padding: '12px 16px',
            fontSize: '0.9rem',
            background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.15) 0%, rgba(176, 206, 136, 0.1) 100%)',
            border: '1.5px solid rgba(176, 206, 136, 0.3)',
            borderRadius: '8px',
            color: '#FFFD8F',
            lineHeight: '1.5',
            width: '100%',
          }}>
            <strong style={{ color: '#B0CE88', fontSize: '0.8rem' }}>💡 Hint:</strong>
            <br />
            {question.hint}
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div style={{
            padding: '14px 20px',
            fontSize: '1rem',
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
            width: '100%',
            animation: 'slideIn 0.3s ease-out',
          }}>
            {feedback}
          </div>
        )}

        {/* Solution (shown on incorrect answer) */}
        {showSolution && solution && (
          <div style={{
            padding: '16px 20px',
            fontSize: '0.95rem',
            background: 'rgba(255, 253, 143, 0.1)',
            border: '2px solid rgba(176, 206, 136, 0.4)',
            borderRadius: '8px',
            color: '#F5EFE7',
            lineHeight: '1.6',
            width: '100%',
          }}>
            <div style={{
              fontSize: '0.9rem',
              color: '#B0CE88',
              fontWeight: '700',
              marginBottom: '0.5rem',
            }}>
              📝 Solution:
            </div>
            {solution}
          </div>
        )}
      </div>

      {/* Problem Type Indicator */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
      }}>
        {question.type === 'complementary' && (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(76, 175, 80, 0.2)',
            border: '1px solid #4CAF50',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#4CAF50',
            fontWeight: '600',
          }}>
            Complementary Angles (90°)
          </div>
        )}
        {question.type === 'supplementary' && (
          <div style={{
            padding: '8px 16px',
            background: 'rgba(100, 150, 255, 0.2)',
            border: '1px solid #6496FF',
            borderRadius: '6px',
            fontSize: '0.85rem',
            color: '#6496FF',
            fontWeight: '600',
          }}>
            Supplementary Angles (180°)
          </div>
        )}
      </div>
    </div>
  );
};

export default WordProblemSolverMinigame;
