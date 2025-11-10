'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line as KonvaLine, Arc, Text, Circle } from 'react-konva';
import { MinigameQuestion } from '@/types/common/quiz';

interface AngleIdentificationMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  styleModule: { readonly [key: string]: string };
}

const AngleIdentificationMinigame: React.FC<AngleIdentificationMinigameProps> = ({
  question,
  onComplete,
  canvasWidth = 800,
  canvasHeight = 400,
  styleModule,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  // Use fixed canvas size to prevent zoom/resize issues
  const canvasSize = { width: canvasWidth, height: canvasHeight };

  const correctAnswer = question.correctAnswer?.toString() || '';

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    checkAnswer(answer);
  };

  const checkAnswer = (answer: string) => {
    // Normalize both answers for comparison
    const normalizedAnswer = answer.toLowerCase().replace(' angle', '');
    const normalizedCorrect = correctAnswer.toString().toLowerCase().replace(' angle', '');
    
    const isCorrect = normalizedAnswer === normalizedCorrect;

    setFeedback(isCorrect ? '✓ Correct! Well done!' : '✗ Incorrect. Try again!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedAnswer(null);
      onComplete(isCorrect, answer);
    }, 2000);
  };

  // Draw an angle at the center of the canvas
  const renderAngle = () => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2 + 20; // Shift down slightly for better vertical centering
    const rayLength = Math.min(canvasSize.width, canvasSize.height) * 0.32;

    // Get the actual angle measure from question data
    const angleValue = question.angleMeasure || 45;

    // Ray 1: Horizontal baseline extending left and right through center
    const ray1StartX = centerX - rayLength * 0.5;
    const ray1EndX = centerX + rayLength;
    const ray1Y = centerY;
    
    // Ray 2: Rotates counter-clockwise from the horizontal ray
    const angleInRadians = (angleValue * Math.PI) / 180;
    const ray2EndX = centerX + rayLength * Math.cos(angleInRadians);
    const ray2EndY = centerY - rayLength * Math.sin(angleInRadians);

    // Arc settings
    const arcRadius = 70;

    return (
      <>
        {/* Ray 1 - Horizontal baseline */}
        <KonvaLine
          points={[ray1StartX, ray1Y, ray1EndX, ray1Y]}
          stroke="#FFD700"
          strokeWidth={6}
          lineCap="round"
        />
        
        {/* Ray 2 - Angled ray from center */}
        <KonvaLine
          points={[centerX, centerY, ray2EndX, ray2EndY]}
          stroke="#FFD700"
          strokeWidth={6}
          lineCap="round"
        />

        {/* Arc showing the angle (filled area) - NOT for right angles */}
        {angleValue < 180 && angleValue !== 90 && (
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={0}
            outerRadius={arcRadius}
            angle={angleValue}
            rotation={-angleValue}
            fill="rgba(76, 175, 80, 0.35)"
          />
        )}

        {/* Arc border for clarity - NOT for right angles */}
        {angleValue <= 180 && angleValue !== 90 && (
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={arcRadius - 3}
            outerRadius={arcRadius + 3}
            angle={angleValue}
            rotation={-angleValue}
            fill="#4CAF50"
            opacity={0.8}
          />
        )}

        {/* Special right angle square indicator */}
        {angleValue === 90 && (
          <KonvaLine
            points={[
              centerX + 35, centerY,
              centerX + 35, centerY - 35,
              centerX, centerY - 35
            ]}
            stroke="#4CAF50"
            strokeWidth={4}
            closed={false}
          />
        )}

        {/* Vertex point at the center */}
        <Circle
          x={centerX}
          y={centerY}
          radius={8}
          fill="#FFD700"
          stroke="#FFA000"
          strokeWidth={3}
        />

        {/* Angle degree measurement label */}
        <Text
          x={centerX + 85}
          y={centerY - (angleValue === 180 ? 85 : angleValue >= 120 ? 65 : 50)}
          text={`${angleValue}°`}
          fontSize={38}
          fontStyle="bold"
          fill="#FFD700"
          stroke="#000"
          strokeWidth={2}
        />

        {/* Vertex label A (left end of ray 1) */}
        <Text
          x={ray1StartX - 25}
          y={ray1Y - 10}
          text="A"
          fontSize={26}
          fontStyle="bold"
          fill="#FFF"
          stroke="#000"
          strokeWidth={1}
        />
        
        {/* Vertex label B (center/vertex) */}
        <Text
          x={centerX - 15}
          y={centerY + 30}
          text="B"
          fontSize={26}
          fontStyle="bold"
          fill="#FFF"
          stroke="#000"
          strokeWidth={1}
        />
        
        {/* Vertex label C (end of ray 2) */}
        <Text
          x={ray2EndX + (angleValue > 90 ? -30 : 10)}
          y={ray2EndY - 15}
          text="C"
          fontSize={26}
          fontStyle="bold"
          fill="#FFF"
          stroke="#000"
          strokeWidth={1}
        />
      </>
    );
  };

  // Answer options
  const answerOptions = ['Acute Angle', 'Right Angle', 'Obtuse Angle', 'Straight Angle'];

  return (
    <div className={styleModule.minigameContainer}>
      {/* Level Info */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        <p className={styleModule.levelInstruction} style={{ 
          margin: 0, 
          flex: 1,
          color: '#F5EFE7',
          fontSize: '1.1rem',
          fontWeight: '600',
        }}>
          What type of angle is shown above?
        </p>
      </div>

      {/* Game Area */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Canvas Container */}
        <div ref={canvasRef} style={{ 
          flex: '1 1 400px', 
          minWidth: '300px', 
          maxWidth: '800px',
        }}>
          <Stage 
            width={canvasSize.width} 
            height={canvasSize.height}
            style={{
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              backgroundColor: '#1a1a2e',
              width: '100%',
              height: 'auto',
              display: 'block',
            }}
            scaleX={1}
            scaleY={1}
          >
            <Layer>
              {/* Draw subtle grid lines */}
              {Array.from({ length: Math.ceil(canvasSize.width / 40) + 1 }).map((_, i) => (
                <KonvaLine
                  key={`grid-v-${i}`}
                  points={[i * 40, 0, i * 40, canvasSize.height]}
                  stroke="rgba(255, 253, 143, 0.05)"
                  strokeWidth={1}
                />
              ))}
              {Array.from({ length: Math.ceil(canvasSize.height / 40) + 1 }).map((_, i) => (
                <KonvaLine
                  key={`grid-h-${i}`}
                  points={[0, i * 40, canvasSize.width, i * 40]}
                  stroke="rgba(255, 253, 143, 0.05)"
                  strokeWidth={1}
                />
              ))}

              {/* Draw the angle */}
              {renderAngle()}
            </Layer>
          </Stage>
        </div>

        {/* Answer Options and Info Container */}
        <div style={{
          flex: '0 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minWidth: '200px',
          maxWidth: '250px',
          width: '100%',
        }}>
          {/* Answer Options */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}>
            {answerOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                disabled={showFeedback}
                style={{
                  padding: '10px 16px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  background: selectedAnswer === option
                    ? 'linear-gradient(135deg, #FFFD8F 0%, #B0CE88 100%)'
                    : 'linear-gradient(135deg, rgba(255, 253, 143, 0.1) 0%, rgba(176, 206, 136, 0.05) 100%)',
                  border: selectedAnswer === option
                    ? '2px solid #FFFD8F'
                    : '1.5px solid rgba(176, 206, 136, 0.3)',
                  borderRadius: '6px',
                  color: selectedAnswer === option ? '#043915' : '#FFFD8F',
                  cursor: showFeedback ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(8px)',
                  boxShadow: selectedAnswer === option
                    ? '0 4px 12px rgba(255, 253, 143, 0.3)'
                    : '0 2px 6px rgba(0, 0, 0, 0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!showFeedback && selectedAnswer !== option) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 253, 143, 0.2) 0%, rgba(176, 206, 136, 0.15) 100%)';
                    e.currentTarget.style.borderColor = '#B0CE88';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAnswer !== option) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 253, 143, 0.1) 0%, rgba(176, 206, 136, 0.05) 100%)';
                    e.currentTarget.style.borderColor = 'rgba(176, 206, 136, 0.3)';
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              padding: '10px 12px',
              fontSize: '0.85rem',
              fontWeight: '700',
              background: feedback.includes('Correct') 
                ? 'linear-gradient(135deg, rgba(176, 206, 136, 0.3) 0%, rgba(76, 118, 59, 0.2) 100%)'
                : 'linear-gradient(135deg, rgba(255, 138, 128, 0.25) 0%, rgba(255, 205, 210, 0.2) 100%)',
              border: feedback.includes('Correct')
                ? '1.5px solid rgba(176, 206, 136, 0.6)'
                : '1.5px solid rgba(255, 138, 128, 0.5)',
              borderRadius: '6px',
              color: feedback.includes('Correct') ? '#B0CE88' : '#FF8A80',
              textAlign: 'center',
              backdropFilter: 'blur(8px)',
              animation: 'slideIn 0.3s ease-out',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            }}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AngleIdentificationMinigame;
