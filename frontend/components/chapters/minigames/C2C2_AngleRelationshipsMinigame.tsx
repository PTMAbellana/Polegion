// Castle 2 Chapter 2 - Angle Relationships Minigame
// Find missing angles using vertical angles, linear pairs, and angles around a point

'use client';

import React, { useState } from 'react';

interface AngleRelationshipsMinigameProps {
  question: {
    id: number;
    type: 'vertical-angles' | 'linear-pair' | 'around-point';
    givenAngles: number[];
    missingAngleIndex: number;
    correctAnswer: number;
    description: string;
    hint: string;
    diagram: string;
  };
  onComplete: (isCorrect: boolean) => void;
  styleModule: Record<string, string>;
}

const AngleRelationshipsMinigame: React.FC<AngleRelationshipsMinigameProps> = ({
  question,
  onComplete,
  styleModule,
}) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    const isCorrect = Math.abs(answer - question.correctAnswer) <= 2; // Allow 2° tolerance
    setFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
      onComplete(isCorrect);
      setUserAnswer('');
      setFeedback(null);
      setShowHint(false);
    }, 1500);
  };

  const renderDiagram = () => {
    const imagePath = `/images/castle2/chapter2/${question.type}.png`;
    
    return (
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          height: '250px',
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
            alt={question.description}
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
              {question.type === 'vertical-angles' && 'Diagram: Two intersecting lines with vertical angles labeled'}
              {question.type === 'linear-pair' && 'Diagram: Two adjacent angles on a straight line (linear pair)'}
              {question.type === 'around-point' && 'Diagram: Multiple angles around a central point summing to 360°'}
            </p>
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 'bold', color: '#50C878' }}>
              Answer: {question.correctAnswer}°
            </p>
          </div>
        </div>
        <p style={{ color: '#FFFD8F', marginTop: '0.75rem', fontSize: '1rem', fontFamily: "'Nunito', sans-serif", fontWeight: '600' }}>
          {question.description}
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
                placeholder="Enter angle"
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

          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className={styleModule.hintButton}
              style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #B0CE88, #4C763B)',
                color: '#fff',
                border: '2px solid #4C763B',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                width: '100%',
                fontFamily: "'Cinzel', serif",
                transition: 'all 0.3s ease'
              }}
            >
              Show Hint
            </button>
          )}

          {showHint && (
            <div style={{ 
              padding: '0.8rem', 
              backgroundColor: 'rgba(255, 253, 143, 0.2)',
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              color: '#043915',
              fontSize: '1rem',
              width: '100%',
              textAlign: 'center',
              fontFamily: "'Nunito', sans-serif",
              fontWeight: '600'
            }}>
              {question.hint}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={!userAnswer || feedback !== null}
            className={`${styleModule.submitButton} ${
              feedback === 'correct' 
                ? styleModule.submitButtonCorrect 
                : feedback === 'incorrect' 
                ? styleModule.submitButtonIncorrect 
                : ''
            }`}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              border: '2px solid #4C763B',
              cursor: userAnswer && feedback === null ? 'pointer' : 'not-allowed',
              background: feedback === 'correct' 
                ? 'linear-gradient(135deg, rgba(176, 206, 136, 0.8), rgba(76, 118, 59, 0.6))' 
                : feedback === 'incorrect' 
                ? 'linear-gradient(135deg, rgba(255, 138, 128, 0.7), rgba(255, 205, 210, 0.5))'
                : 'linear-gradient(135deg, #FFFD8F, #B0CE88)',
              color: feedback ? '#fff' : '#043915',
              opacity: userAnswer && feedback === null ? 1 : 0.6,
              width: '100%',
              fontFamily: "'Cinzel', serif",
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '0.8px'
            }}
          >
            {feedback === 'correct' ? 'Correct!' : feedback === 'incorrect' ? 'Try Again' : 'Submit Answer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AngleRelationshipsMinigame;
