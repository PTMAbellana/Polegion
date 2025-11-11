'use client';

import React, { useState } from 'react';
import { MinigameQuestion } from '@/types/common/quiz';

interface ComplementarySupplementaryMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, userAnswer?: number) => void;
  styleModule: { readonly [key: string]: string };
}

const ComplementarySupplementaryMinigame: React.FC<ComplementarySupplementaryMinigameProps> = ({
  question,
  onComplete,
  styleModule,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const givenAngle = question.givenAngle || 0;
  const relationship = question.relationship || 'complementary';
  const targetSum = question.targetSum || (relationship === 'complementary' ? 90 : 180);
  const correctAnswer = Number(question.correctAnswer);

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
        ? `✓ Correct! ${givenAngle}° + ${correctAnswer}° = ${targetSum}°`
        : `✗ Not quite. The correct answer is ${correctAnswer}° because ${givenAngle}° + ${correctAnswer}° = ${targetSum}°`
    );
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer('');
      onComplete(isCorrect, numericAnswer);
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className={styleModule.minigameContainer}>
      {/* Problem Display */}
      <div style={{
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: '1.3rem',
          fontWeight: '700',
          color: '#FFFD8F',
          marginBottom: '1rem',
        }}>
          Find the {relationship === 'complementary' ? 'Complement' : 'Supplement'}
        </div>
        
        <div style={{
          display: 'inline-block',
          padding: '2rem 3rem',
          background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.2) 0%, rgba(176, 206, 136, 0.15) 100%)',
          border: '3px solid #B0CE88',
          borderRadius: '12px',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            fontSize: '1.1rem',
            color: '#F5EFE7',
            marginBottom: '1rem',
          }}>
            Given Angle: <span style={{ fontSize: '2rem', color: '#FFFD8F', fontWeight: 'bold' }}>{givenAngle}°</span>
          </div>
          
          <div style={{
            fontSize: '1rem',
            color: '#B0CE88',
            marginBottom: '1rem',
          }}>
            {relationship === 'complementary' 
              ? 'Complementary angles add to 90°'
              : 'Supplementary angles add to 180°'}
          </div>

          <div style={{
            fontSize: '1.2rem',
            color: '#FFFD8F',
            fontWeight: '600',
          }}>
            {givenAngle}° + ? = {targetSum}°
          </div>
        </div>

        {question.description && (
          <div style={{
            fontSize: '0.95rem',
            color: '#F5EFE7',
            fontStyle: 'italic',
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
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter angle in degrees"
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
          Check Answer
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
      </div>

      {/* Visual Representation */}
      <div style={{
        marginTop: '2rem',
        display: 'flex',
        justifyContent: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
      }}>
        {/* Given Angle Arc */}
        <div style={{
          padding: '1.5rem',
          background: 'rgba(26, 26, 46, 0.4)',
          border: '2px solid rgba(176, 206, 136, 0.3)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: '#B0CE88', marginBottom: '0.5rem' }}>
            Given Angle
          </div>
          <div style={{ fontSize: '2rem', color: '#FFFD8F', fontWeight: 'bold' }}>
            {givenAngle}°
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '2rem',
          color: '#FFFD8F',
          fontWeight: 'bold',
        }}>
          +
        </div>

        {/* Missing Angle */}
        <div style={{
          padding: '1.5rem',
          background: 'rgba(26, 26, 46, 0.4)',
          border: '2px dashed rgba(255, 107, 107, 0.5)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: '#FF8A80', marginBottom: '0.5rem' }}>
            Missing Angle
          </div>
          <div style={{ fontSize: '2rem', color: '#FF8A80', fontWeight: 'bold' }}>
            ?°
          </div>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: '2rem',
          color: '#FFFD8F',
          fontWeight: 'bold',
        }}>
          =
        </div>

        {/* Target Sum */}
        <div style={{
          padding: '1.5rem',
          background: 'rgba(26, 26, 46, 0.4)',
          border: '2px solid rgba(76, 175, 80, 0.5)',
          borderRadius: '8px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '0.9rem', color: '#4CAF50', marginBottom: '0.5rem' }}>
            {relationship === 'complementary' ? 'Right Angle' : 'Straight Angle'}
          </div>
          <div style={{ fontSize: '2rem', color: '#4CAF50', fontWeight: 'bold' }}>
            {targetSum}°
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplementarySupplementaryMinigame;
