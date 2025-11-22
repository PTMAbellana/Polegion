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
        ? `Correct! ${givenAngle}° + ${correctAnswer}° = ${targetSum}°`
        : `Not quite. The correct answer is ${correctAnswer}° because ${givenAngle}° + ${correctAnswer}° = ${targetSum}°`
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

  const renderDiagram = () => {
    const imagePath = `/images/castle2/chapter3/${relationship}.png`;
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          height: '300px',
          backgroundColor: 'rgba(244, 228, 193, 0.2)',
          border: '2px dashed #B0CE88',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <img 
            src={imagePath} 
            alt={question.description || `${relationship} angles`}
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
            color: '#3d2a1f',
            fontSize: '0.95rem',
            textAlign: 'center',
            lineHeight: '1.5',
            fontFamily: "'Nunito', sans-serif"
          }}>
            <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold' }}>Image Placeholder</p>
            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem' }}>
              {relationship === 'complementary' && `Two angles that add to 90°: ${givenAngle}° + ${correctAnswer}° = 90°`}
              {relationship === 'supplementary' && `Two angles that add to 180°: ${givenAngle}° + ${correctAnswer}° = 180°`}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#50C878' }}>
              Answer: {correctAnswer}°
            </p>
          </div>
        </div>
        <p style={{ color: '#FFFD8F', marginTop: '0.75rem', fontSize: '1rem', fontFamily: "'Nunito', sans-serif", fontWeight: '600' }}>
          {question.description || `Find the ${relationship} angle`}
        </p>
      </div>
    );
  };

  return (
    <div className={styleModule.minigameContainer}>
      {/* Main content with diagram on left, controls on right */}
      <div style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        width: '100%'
      }}>
        {/* Left side: Diagram with description */}
        <div style={{ flex: '0 0 auto' }}>
          {renderDiagram()}
        </div>

        {/* Right side: Question, input, hint, submit */}
        <div style={{
          flex: '0 0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          alignItems: 'center',
          minWidth: '280px'
        }}>
          <div className={styleModule.inputSection}>
            <label style={{ color: '#FFFD8F', fontSize: '1.1rem', marginBottom: '0.5rem', display: 'block', textAlign: 'center', fontFamily: "'Cinzel', serif", fontWeight: 'bold' }}>
              What is the missing angle?
            </label>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter angle"
                disabled={showFeedback}
                className={styleModule.angleInput}
                style={{
                  padding: '0.7rem',
                  fontSize: '1.1rem',
                  width: '160px',
                  borderRadius: '8px',
                  border: '2px solid #B0CE88',
                  textAlign: 'center',
                  fontFamily: "'Nunito', sans-serif",
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  color: '#043915',
                  fontWeight: 'bold'
                }}
              />
              <span style={{ color: '#FFFD8F', fontSize: '1.1rem', marginLeft: '0.5rem', fontWeight: 'bold' }}>°</span>
            </div>
          </div>

          {question.hint && !showFeedback && (
            <div style={{ 
              padding: '0.8rem', 
              backgroundColor: 'rgba(255, 253, 143, 0.2)',
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              color: '#043915',
              fontSize: '0.95rem',
              width: '100%',
              textAlign: 'center',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: '600'
            }}>
              Hint: {question.hint}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!userAnswer || showFeedback}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: '2px solid #4C763B',
              cursor: userAnswer && !showFeedback ? 'pointer' : 'not-allowed',
              background: showFeedback
                ? (feedback.includes('Correct')
                  ? 'linear-gradient(135deg, rgba(176, 206, 136, 0.8), rgba(76, 118, 59, 0.6))'
                  : 'linear-gradient(135deg, rgba(255, 138, 128, 0.7), rgba(255, 205, 210, 0.5))')
                : 'linear-gradient(135deg, #FFFD8F, #B0CE88)',
              color: showFeedback ? '#fff' : '#043915',
              opacity: userAnswer && !showFeedback ? 1 : 0.6,
              width: '100%',
              fontFamily: "'Cinzel', serif",
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}
          >
            {showFeedback
              ? (feedback.includes('Correct') ? 'Correct!' : 'Try Again')
              : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplementarySupplementaryMinigame;
