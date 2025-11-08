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
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  const correctAnswer = question.correctAnswer?.toString() || '';

  // Update canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current;
      if (container) {
        const containerWidth = container.clientWidth;
        const width = Math.min(containerWidth, 800);
        const height = Math.floor(width * (canvasHeight / canvasWidth));
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    let resizeObserver: ResizeObserver | null = null;
    if (canvasRef.current) {
      resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(canvasRef.current);
    }
    
    return () => {
      window.removeEventListener('resize', updateSize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [canvasWidth, canvasHeight]);

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    checkAnswer(answer);
  };

  const checkAnswer = (answer: string) => {
    const isCorrect = answer === correctAnswer;

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
    const centerY = canvasSize.height / 2;
    const rayLength = Math.min(canvasSize.width, canvasSize.height) * 0.35;

    // Determine angle type and visual representation
    let angleValue = 0;
    const answerLower = correctAnswer.toLowerCase();
    
    if (answerLower === 'acute' || answerLower === 'acute angle') {
      angleValue = 45; // Example acute angle
    } else if (answerLower === 'right' || answerLower === 'right angle') {
      angleValue = 90;
    } else if (answerLower === 'obtuse' || answerLower === 'obtuse angle') {
      angleValue = 135; // Example obtuse angle
    } else if (answerLower === 'straight' || answerLower === 'straight angle') {
      angleValue = 180;
    } else {
      // Try to parse as number if provided
      angleValue = parseInt(correctAnswer) || 45;
    }

    // Calculate ray endpoints
    const ray1EndX = centerX + rayLength;
    const ray1EndY = centerY;
    
    const angleRad = (angleValue * Math.PI) / 180;
    const ray2EndX = centerX + rayLength * Math.cos(angleRad);
    const ray2EndY = centerY - rayLength * Math.sin(angleRad); // Negative because canvas Y is inverted

    // Arc radius for angle indicator
    const arcRadius = 50;

    return (
      <>
        {/* First ray (horizontal) */}
        <KonvaLine
          points={[centerX - rayLength * 0.3, centerY, ray1EndX, ray1EndY]}
          stroke="#FFFD8F"
          strokeWidth={4}
          lineCap="round"
          shadowColor="black"
          shadowBlur={8}
          shadowOpacity={0.5}
        />
        
        {/* Second ray */}
        <KonvaLine
          points={[centerX, centerY, ray2EndX, ray2EndY]}
          stroke="#FFFD8F"
          strokeWidth={4}
          lineCap="round"
          shadowColor="black"
          shadowBlur={8}
          shadowOpacity={0.5}
        />

        {/* Vertex point */}
        <Circle
          x={centerX}
          y={centerY}
          radius={6}
          fill="#B0CE88"
          stroke="#4C763B"
          strokeWidth={2}
        />

        {/* Angle arc indicator */}
        {angleValue !== 180 && (
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={arcRadius - 3}
            outerRadius={arcRadius}
            angle={angleValue}
            rotation={-angleValue}
            fill="#B0CE88"
            opacity={0.6}
          />
        )}

        {/* Angle label */}
        <Text
          x={centerX + 15}
          y={centerY - 30}
          text={`${angleValue}°`}
          fontSize={24}
          fontStyle="bold"
          fill="#FFFD8F"
          align="center"
        />

        {/* Right angle square indicator if 90 degrees */}
        {angleValue === 90 && (
          <KonvaLine
            points={[
              centerX + 20, centerY,
              centerX + 20, centerY - 20,
              centerX, centerY - 20
            ]}
            stroke="#B0CE88"
            strokeWidth={2}
            closed={false}
          />
        )}
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
          {question.instruction}
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
              maxWidth: '100%',
            }}
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
          {/* Hint Box */}
          <div className={styleModule.hint} style={{ 
            margin: 0,
            padding: '8px 12px',
            fontSize: '0.75rem',
            background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.15) 0%, rgba(176, 206, 136, 0.1) 100%)',
            border: '1.5px solid rgba(176, 206, 136, 0.3)',
            borderRadius: '6px',
            color: '#FFFD8F',
            lineHeight: '1.4',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}>
            <strong style={{ 
              display: 'block', 
              marginBottom: '0.35rem', 
              color: '#B0CE88',
              fontSize: '0.7rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>Hint</strong>
            <span style={{ fontSize: '0.75rem' }}>
              {question.hint || 'Select the correct angle type.'}
            </span>
          </div>

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
