'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line as KonvaLine, Arc, Text, Circle } from 'react-konva';
import { MinigameQuestion } from '@/types/common/quiz';

interface AngleConstructorMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, userAngle?: number) => void;
  styleModule: { readonly [key: string]: string };
}

const AngleConstructorMinigame: React.FC<AngleConstructorMinigameProps> = ({
  question,
  onComplete,
  styleModule,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [userAngle, setUserAngle] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 500, height: 300 });
  
  const targetAngle = question.targetAngle || 45;
  const tolerance = question.tolerance || 3;

  // Update canvas size based on container
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const width = Math.min(containerWidth - 40, 500); // Max 500px with 40px padding
        const height = Math.min(300, width * 0.6); // Maintain aspect ratio, max 300px
        setCanvasSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    
    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = () => {
    if (!isDragging || !stageRef.current) return;

    const stage = stageRef.current;
    const pointerPosition = stage.getPointerPosition();
    
    if (!pointerPosition) return;

    const centerX = canvasSize.width / 2;
    const centerY = canvasSize.height / 2;

    // Calculate angle from center to mouse position
    const deltaX = pointerPosition.x - centerX;
    const deltaY = centerY - pointerPosition.y; // Inverted Y
    
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Normalize to 0-360 range
    if (angle < 0) angle = 360 + angle;
    
    setUserAngle(Math.round(angle));
  };

  const handleSubmit = () => {
    if (showFeedback) return;

    const angleDifference = Math.abs(userAngle - targetAngle);
    const isCorrect = angleDifference <= tolerance;

    setFeedback(
      isCorrect
        ? `Correct!`
        : `Incorrect. Target angle: ${targetAngle}°`
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
    const centerY = canvasSize.height / 2;
    const rayLength = Math.min(canvasSize.width, canvasSize.height) * 0.32;

    // Fixed horizontal ray (baseline)
    const ray1StartX = centerX - rayLength;
    const ray1EndX = centerX + rayLength;
    const ray1Y = centerY;

    // User-controlled rotating ray
    const angleInRadians = (userAngle * Math.PI) / 180;
    const ray2EndX = centerX + rayLength * Math.cos(angleInRadians);
    const ray2EndY = centerY - rayLength * Math.sin(angleInRadians);

    const arcRadius = rayLength * 0.65;

    return (
      <>
        {/* Protractor arc background - full circle */}
        <Arc
          x={centerX}
          y={centerY}
          innerRadius={arcRadius}
          outerRadius={arcRadius + 3}
          angle={360}
          rotation={0}
          stroke="rgba(176, 206, 136, 0.3)"
          strokeWidth={2}
        />

        {/* Protractor degree markings */}
        {[0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((degree) => {
          const markRad = (degree * Math.PI) / 180;
          const markStartRadius = arcRadius - 5;
          const markEndRadius = arcRadius + 8;
          
          const startX = centerX + markStartRadius * Math.cos(markRad);
          const startY = centerY - markStartRadius * Math.sin(markRad);
          const endX = centerX + markEndRadius * Math.cos(markRad);
          const endY = centerY - markEndRadius * Math.sin(markRad);

          const isMajor = degree % 90 === 0;

          return (
            <React.Fragment key={degree}>
              <KonvaLine
                points={[startX, startY, endX, endY]}
                stroke="#B0CE88"
                strokeWidth={isMajor ? 2.5 : 1.5}
                opacity={0.7}
              />
              {isMajor && (
                <Text
                  x={centerX + (arcRadius + 20) * Math.cos(markRad) - 12}
                  y={centerY - (arcRadius + 20) * Math.sin(markRad) - (degree === 0 || degree === 180 ? 18 : 8)}
                  text={`${degree}°`}
                  fontSize={12}
                  fill="#B0CE88"
                  opacity={0.8}
                  fontStyle="bold"
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Horizontal baseline ray - golden */}
        <KonvaLine
          points={[ray1StartX, ray1Y, ray1EndX, ray1Y]}
          stroke="#4C763B"
          strokeWidth={3}
          lineCap="round"
        />

        {/* Rotating ray (user controls) */}
        <KonvaLine
          points={[centerX, centerY, ray2EndX, ray2EndY]}
          stroke="#FFFD8F"
          strokeWidth={3}
          lineCap="round"
        />

        {/* Arc showing current angle */}
        {userAngle > 0 && userAngle !== 180 && userAngle !== 360 && (
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={0}
            outerRadius={arcRadius - 10}
            angle={userAngle}
            rotation={-userAngle}
            fill="rgba(255, 253, 143, 0.25)"
          />
        )}

        {/* Vertex point */}
        <Circle
          x={centerX}
          y={centerY}
          radius={8}
          fill="#4C763B"
          stroke="#FFF"
          strokeWidth={2}
        />

        {/* Draggable handle on rotating ray */}
        <Circle
          x={ray2EndX}
          y={ray2EndY}
          radius={18}
          fill="#B0CE88"
          stroke="#FFF"
          strokeWidth={3}
        />
        <Circle
          x={ray2EndX}
          y={ray2EndY}
          radius={8}
          fill="#FFFD8F"
          opacity={0.9}
        />

        {/* Current angle label */}
        <Text
          x={centerX - 30}
          y={centerY - 12}
          text={`${userAngle}°`}
          fontSize={32}
          fontStyle="bold"
          fill="#FFFD8F"
          stroke="#1a1a2e"
          strokeWidth={1.5}
        />
      </>
    );
  };

  return (
    <div ref={containerRef} className={styleModule.minigameContainer}>
      {/* Instruction - plain text */}
      <p style={{
        color: '#FFFD8F',
        fontSize: '1.1rem',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '0.25rem',
        fontFamily: "'Cinzel', serif",
      }}>
        {question.instruction || `Drag the ray to construct a ${targetAngle}° angle`}
      </p>

      {/* Canvas and Controls side by side */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '0.25rem',
        flexWrap: 'wrap',
      }}>
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseUp}
          style={{
            border: '2px solid #8b7355',
            borderRadius: '8px',
            backgroundColor: '#0a0e1a',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <Layer>{renderAngle()}</Layer>
        </Stage>

        {/* Right side controls */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          alignItems: 'center',
        }}>
          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={showFeedback}
            className={styleModule.submitButton}
            style={{
              minWidth: '120px',
              height: '50px',
              fontFamily: "'Cinzel', serif",
              background: 'linear-gradient(135deg, #FFFD8F 0%, #B0CE88 100%)',
              color: '#043915',
              border: '2px solid #B0CE88',
              borderRadius: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              transition: 'all 0.3s ease'
            }}
          >
            Submit
          </button>

          {/* Feedback */}
          {showFeedback && (
            <div style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '8px',
              background: feedback.startsWith('Correct') 
                ? 'linear-gradient(135deg, rgba(176, 206, 136, 0.3) 0%, rgba(76, 118, 59, 0.2) 100%)' 
                : 'linear-gradient(135deg, rgba(255, 138, 128, 0.25) 0%, rgba(255, 205, 210, 0.2) 100%)',
              border: feedback.startsWith('Correct') 
                ? '2px solid rgba(176, 206, 136, 0.6)' 
                : '2px solid rgba(255, 138, 128, 0.5)',
              color: feedback.startsWith('Correct') ? '#4C763B' : '#FF8A80',
              fontSize: '1rem',
              fontWeight: 'bold',
              textAlign: 'center',
              minWidth: '120px',
              fontFamily: "'Nunito', sans-serif",
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
