'use client';

import React, { useState } from 'react';
import { Stage, Layer, Circle, Line, Arc, Path, Text } from 'react-konva';
import { MinigameQuestion } from '@/types/common/quiz';

interface CirclePartsMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  styleModule: { readonly [key: string]: string };
}

const CirclePartsMinigame: React.FC<CirclePartsMinigameProps> = ({
  question,
  onComplete,
  canvasWidth = 600,
  canvasHeight = 600,
  styleModule,
}) => {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswer = question.correctAnswer?.toString() || '';
  const partType = question.partType || ''; // 'center', 'radius', 'diameter', 'chord', 'arc', 'sector'

  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radius = 150;

  const handlePartClick = (part: string) => {
    setSelectedPart(part);
    checkAnswer(part);
  };

  const checkAnswer = (part: string) => {
    const isCorrect = part === correctAnswer;

    setFeedback(isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        onComplete(true, part);
      } else {
        setSelectedPart(null);
        onComplete(false, part);
      }
    }, 2000);
  };

  const getPartColor = (part: string): string => {
    if (selectedPart === part) return '#4CAF50';
    if (hoveredPart === part) return '#FFD700';
    return '#667eea';
  };

  const renderCircleParts = () => {
    const parts: React.ReactElement[] = [];

    // Main circle
    parts.push(
      <Circle
        key="main-circle"
        x={centerX}
        y={centerY}
        radius={radius}
        stroke="rgba(255, 255, 255, 0.5)"
        strokeWidth={2}
      />
    );

    // Center point
    parts.push(
      <Circle
        key="center"
        x={centerX}
        y={centerY}
        radius={8}
        fill={getPartColor('center')}
        onClick={() => handlePartClick('center')}
        onMouseEnter={() => setHoveredPart('center')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    );

    // Radius (from center to edge at 45 degrees)
    const radiusEndX = centerX + radius * Math.cos(Math.PI / 4);
    const radiusEndY = centerY + radius * Math.sin(Math.PI / 4);
    parts.push(
      <Line
        key="radius"
        points={[centerX, centerY, radiusEndX, radiusEndY]}
        stroke={getPartColor('radius')}
        strokeWidth={4}
        onClick={() => handlePartClick('radius')}
        onMouseEnter={() => setHoveredPart('radius')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    );

    // Diameter (horizontal line through center)
    const diameterStartX = centerX - radius;
    const diameterEndX = centerX + radius;
    parts.push(
      <Line
        key="diameter"
        points={[diameterStartX, centerY, diameterEndX, centerY]}
        stroke={getPartColor('diameter')}
        strokeWidth={4}
        onClick={() => handlePartClick('diameter')}
        onMouseEnter={() => setHoveredPart('diameter')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    );

    // Chord (line not through center, at upper part)
    const chordAngle1 = Math.PI / 6; // 30 degrees
    const chordAngle2 = (5 * Math.PI) / 6; // 150 degrees
    const chordStartX = centerX + radius * Math.cos(chordAngle1);
    const chordStartY = centerY + radius * Math.sin(chordAngle1);
    const chordEndX = centerX + radius * Math.cos(chordAngle2);
    const chordEndY = centerY + radius * Math.sin(chordAngle2);
    parts.push(
      <Line
        key="chord"
        points={[chordStartX, chordStartY, chordEndX, chordEndY]}
        stroke={getPartColor('chord')}
        strokeWidth={4}
        onClick={() => handlePartClick('chord')}
        onMouseEnter={() => setHoveredPart('chord')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    );

    // Arc (highlighted portion of circumference, bottom right)
    const arcStartAngle = 0;
    const arcEndAngle = 90;
    parts.push(
      <Arc
        key="arc"
        x={centerX}
        y={centerY}
        innerRadius={radius - 5}
        outerRadius={radius + 5}
        angle={arcEndAngle - arcStartAngle}
        rotation={arcStartAngle}
        fill={getPartColor('arc')}
        onClick={() => handlePartClick('arc')}
        onMouseEnter={() => setHoveredPart('arc')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    );

    // Sector (pie slice, bottom left quadrant)
    const sectorStartAngle = Math.PI; // 180 degrees
    const sectorEndAngle = (3 * Math.PI) / 2; // 270 degrees
    const sectorStartX = centerX + radius * Math.cos(sectorStartAngle);
    const sectorStartY = centerY + radius * Math.sin(sectorStartAngle);
    const sectorEndX = centerX + radius * Math.cos(sectorEndAngle);
    const sectorEndY = centerY + radius * Math.sin(sectorEndAngle);

    const sectorPath = `
      M ${centerX} ${centerY}
      L ${sectorStartX} ${sectorStartY}
      A ${radius} ${radius} 0 0 1 ${sectorEndX} ${sectorEndY}
      Z
    `;

    parts.push(
      <Path
        key="sector"
        data={sectorPath}
        fill={getPartColor('sector')}
        opacity={0.5}
        onClick={() => handlePartClick('sector')}
        onMouseEnter={() => setHoveredPart('sector')}
        onMouseLeave={() => setHoveredPart(null)}
      />
    );

    // Labels
    parts.push(
      <Text
        key="label-center"
        x={centerX + 15}
        y={centerY - 5}
        text="Center"
        fontSize={14}
        fill={selectedPart === 'center' ? '#FFD700' : '#E8F4FD'}
      />
    );

    parts.push(
      <Text
        key="label-radius"
        x={centerX + (radiusEndX - centerX) / 2 - 20}
        y={centerY + (radiusEndY - centerY) / 2 - 20}
        text="Radius"
        fontSize={14}
        fill={selectedPart === 'radius' ? '#FFD700' : '#E8F4FD'}
      />
    );

    parts.push(
      <Text
        key="label-diameter"
        x={centerX - 40}
        y={centerY + 15}
        text="Diameter"
        fontSize={14}
        fill={selectedPart === 'diameter' ? '#FFD700' : '#E8F4FD'}
      />
    );

    parts.push(
      <Text
        key="label-chord"
        x={centerX - 25}
        y={centerY - radius / 2 - 20}
        text="Chord"
        fontSize={14}
        fill={selectedPart === 'chord' ? '#FFD700' : '#E8F4FD'}
      />
    );

    parts.push(
      <Text
        key="label-arc"
        x={centerX + radius / 2}
        y={centerY + radius / 2 + 20}
        text="Arc"
        fontSize={14}
        fill={selectedPart === 'arc' ? '#FFD700' : '#E8F4FD'}
      />
    );

    parts.push(
      <Text
        key="label-sector"
        x={centerX - radius / 2 - 40}
        y={centerY + radius / 2}
        text="Sector"
        fontSize={14}
        fill={selectedPart === 'sector' ? '#FFD700' : '#E8F4FD'}
      />
    );

    return parts;
  };

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.questionText}>{question.instruction}</div>

      <div className={styleModule.canvasWrapper}>
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>{renderCircleParts()}</Layer>
        </Stage>
      </div>

      {/* Instructions */}
      <div className={styleModule.instructions}>
        <p>Click on the part of the circle described in the question.</p>
        {selectedPart && <p>Selected: {selectedPart}</p>}
        {question.hint && <p className={styleModule.hint}>{question.hint}</p>}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`${styleModule.feedback} ${
            feedback.includes('Correct') ? styleModule.feedbackSuccess : styleModule.feedbackError
          }`}
        >
          {feedback}
        </div>
      )}
    </div>
  );
};

export default CirclePartsMinigame;
