'use client';

import React, { useState, useRef } from 'react';
import { Stage, Layer, Line as KonvaLine, Arc, Text, Circle } from 'react-konva';
import { MinigameQuestion } from '@/types/common/quiz';

interface AngleConstructorMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, userAngle?: number) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  styleModule: { readonly [key: string]: string };
}

const AngleConstructorMinigame: React.FC<AngleConstructorMinigameProps> = ({
  question,
  onComplete,
  canvasWidth = 800,
  canvasHeight = 400,
  styleModule,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [userAngle, setUserAngle] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const canvasSize = { width: canvasWidth, height: canvasHeight };
  
  const targetAngle = question.targetAngle || 45;
  const tolerance = question.tolerance || 3;

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Scale to canvas coordinates
    const scaleX = canvasSize.width / rect.width;
    const scaleY = canvasSize.height / rect.height;
    const canvasX = mouseX * scaleX;
    const canvasY = mouseY * scaleY;

    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2 + 50;

    // Calculate angle from center to mouse position
    const deltaX = canvasX - centerX;
    const deltaY = centerY - canvasY; // Inverted Y
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize to 0-180 range
    if (angle < 0) angle = 0;
    if (angle > 180) angle = 180;
    
    setUserAngle(Math.round(angle));
  };

  const handleSubmit = () => {
    if (showFeedback) return;

    const angleDifference = Math.abs(userAngle - targetAngle);
    const isCorrect = angleDifference <= tolerance;

    setFeedback(
      isCorrect
        ? `✓ Correct! You constructed ${userAngle}° (target: ${targetAngle}°)`
        : `✗ Not quite. You constructed ${userAngle}°, but the target was ${targetAngle}° (±${tolerance}°)`
    );
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      setUserAngle(0);
      onComplete(isCorrect, userAngle);
    }, 2500);
  };

  const renderAngle = () => {
    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2 + 50;
    const rayLength = Math.min(canvasSize.width, canvasSize.height) * 0.32;

    // Fixed horizontal ray (baseline)
    const ray1StartX = centerX - rayLength * 0.5;
    const ray1EndX = centerX + rayLength;
    const ray1Y = centerY;

    // User-controlled rotating ray
    const angleInRadians = (userAngle * Math.PI) / 180;
    const ray2EndX = centerX + rayLength * Math.cos(angleInRadians);
    const ray2EndY = centerY - rayLength * Math.sin(angleInRadians);

    const arcRadius = 70;

    return (
      <>
        {/* Horizontal baseline ray */}
        <KonvaLine
          points={[ray1StartX, ray1Y, ray1EndX, ray1Y]}
          stroke="#FFD700"
          strokeWidth={5}
          lineCap="round"
        />

        {/* Rotating ray (user controls) */}
        <KonvaLine
          points={[centerX, centerY, ray2EndX, ray2EndY]}
          stroke="#FF6B6B"
          strokeWidth={6}
          lineCap="round"
        />

        {/* Arc showing current angle */}
        {userAngle < 180 && userAngle !== 90 && (
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={0}
            outerRadius={arcRadius}
            angle={userAngle}
            rotation={-userAngle}
            fill="rgba(255, 107, 107, 0.3)"
          />
        )}

        {/* Arc border */}
        {userAngle <= 180 && userAngle !== 90 && (
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={arcRadius - 3}
            outerRadius={arcRadius + 3}
            angle={userAngle}
            rotation={-userAngle}
            fill="#FF6B6B"
            opacity={0.7}
          />
        )}

        {/* Right angle square */}
        {userAngle === 90 && (
          <KonvaLine
            points={[
              centerX + 35, centerY,
              centerX + 35, centerY - 35,
              centerX, centerY - 35
            ]}
            stroke="#FF6B6B"
            strokeWidth={3}
            closed={false}
          />
        )}

        {/* Vertex point */}
        <Circle
          x={centerX}
          y={centerY}
          radius={8}
          fill="#FFD700"
          stroke="#FFA000"
          strokeWidth={3}
        />

        {/* Current angle label */}
        <Text
          x={centerX + 85}
          y={centerY - 50}
          text={`${userAngle}°`}
          fontSize={36}
          fontStyle="bold"
          fill="#FF6B6B"
          stroke="#000"
          strokeWidth={2}
        />

        {/* Target angle hint */}
        <Text
          x={centerX - 80}
          y={centerY - 90}
          text={`Target: ${targetAngle}°`}
          fontSize={24}
          fontStyle="bold"
          fill="#4CAF50"
          stroke="#000"
          strokeWidth={1}
        />

        {/* Protractor markings */}
        {Array.from({ length: 19 }).map((_, i) => {
          const markAngle = i * 10;
          const markRad = (markAngle * Math.PI) / 180;
          const markStartRadius = arcRadius + 10;
          const markEndRadius = arcRadius + 20;
          
          const startX = centerX + markStartRadius * Math.cos(markRad);
          const startY = centerY - markStartRadius * Math.sin(markRad);
          const endX = centerX + markEndRadius * Math.cos(markRad);
          const endY = centerY - markEndRadius * Math.sin(markRad);

          return (
            <KonvaLine
              key={i}
              points={[startX, startY, endX, endY]}
              stroke="#B0CE88"
              strokeWidth={markAngle % 30 === 0 ? 3 : 1.5}
              opacity={0.6}
            />
          );
        })}
      </>
    );
  };

  return (
    <div className={styleModule.minigameContainer}>
      {/* Instruction */}
      <div style={{
        marginBottom: '1rem',
        color: '#F5EFE7',
        fontSize: '1.1rem',
        fontWeight: '600',
        textAlign: 'center',
      }}>
        Drag the red ray to construct a {targetAngle}° angle
      </div>

      {/* Canvas and Controls */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>
        {/* Canvas */}
        <div
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          style={{
            flex: '1 1 400px',
            minWidth: '300px',
            maxWidth: '800px',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
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
          >
            <Layer>{renderAngle()}</Layer>
          </Stage>
        </div>

        {/* Controls */}
        <div style={{
          flex: '0 1 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          minWidth: '200px',
          maxWidth: '250px',
        }}>
          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={showFeedback || userAngle === 0}
            style={{
              padding: '12px 20px',
              fontSize: '1rem',
              fontWeight: '700',
              background: showFeedback || userAngle === 0
                ? 'rgba(176, 206, 136, 0.3)'
                : 'linear-gradient(135deg, #FFFD8F 0%, #B0CE88 100%)',
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              color: showFeedback || userAngle === 0 ? '#888' : '#043915',
              cursor: showFeedback || userAngle === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
            }}
          >
            Check Angle
          </button>

          {/* Hint */}
          {question.hint && (
            <div style={{
              padding: '10px',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, rgba(255, 253, 143, 0.15) 0%, rgba(176, 206, 136, 0.1) 100%)',
              border: '1.5px solid rgba(176, 206, 136, 0.3)',
              borderRadius: '6px',
              color: '#FFFD8F',
              lineHeight: '1.4',
            }}>
              <strong style={{ color: '#B0CE88', fontSize: '0.75rem' }}>💡 Hint:</strong>
              <br />
              {question.hint}
            </div>
          )}

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              padding: '12px',
              fontSize: '0.9rem',
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
            }}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AngleConstructorMinigame;
