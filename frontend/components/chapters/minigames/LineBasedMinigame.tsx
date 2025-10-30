'use client';

import React, { useState } from 'react';
import { Stage, Layer, Circle, Line as KonvaLine, Text, Arrow } from 'react-konva';
import { MinigameQuestion, MinigameLine } from '@/types/common/quiz';

interface LineBasedMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  styleModule: { readonly [key: string]: string };
}

const LineBasedMinigame: React.FC<LineBasedMinigameProps> = ({
  question,
  onComplete,
  canvasWidth = 800,
  canvasHeight = 600,
  styleModule,
}) => {
  const [selectedLine, setSelectedLine] = useState<string | null>(null);
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const lines = question.lines || [];
  const correctAnswer = question.correctAnswer?.toString() || '';
  const showType = question.showType || 'line'; // 'segment', 'ray', or 'line'

  const handleLineClick = (lineId: string) => {
    setSelectedLine(lineId);
    checkAnswer(lineId);
  };

  const checkAnswer = (lineId: string) => {
    const isCorrect = lineId === correctAnswer;

    setFeedback(isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        onComplete(true, lineId);
      } else {
        setSelectedLine(null);
        onComplete(false, lineId);
      }
    }, 2000);
  };

  const getLineColor = (lineId: string): string => {
    if (selectedLine === lineId) return '#4CAF50';
    if (hoveredLine === lineId) return '#FFD700';
    return '#667eea';
  };

  const renderLine = (line: MinigameLine) => {
    const isSelected = selectedLine === line.id;
    const isHovered = hoveredLine === line.id;
    const color = getLineColor(line.id);

    // For segments: just a straight line
    if (showType === 'segment') {
      return (
        <KonvaLine
          key={line.id}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke={color}
          strokeWidth={isSelected ? 5 : isHovered ? 4 : 3}
          onClick={() => handleLineClick(line.id)}
          onMouseEnter={() => setHoveredLine(line.id)}
          onMouseLeave={() => setHoveredLine(null)}
          shadowColor="black"
          shadowBlur={isSelected ? 10 : 5}
          shadowOpacity={0.5}
        />
      );
    }

    // For rays: arrow in one direction
    if (showType === 'ray') {
      return (
        <Arrow
          key={line.id}
          points={[line.x1, line.y1, line.x2, line.y2]}
          stroke={color}
          fill={color}
          strokeWidth={isSelected ? 5 : isHovered ? 4 : 3}
          pointerLength={15}
          pointerWidth={15}
          onClick={() => handleLineClick(line.id)}
          onMouseEnter={() => setHoveredLine(line.id)}
          onMouseLeave={() => setHoveredLine(null)}
          shadowColor="black"
          shadowBlur={isSelected ? 10 : 5}
          shadowOpacity={0.5}
        />
      );
    }

    // For lines: extend beyond both endpoints
    if (showType === 'line') {
      // Calculate extended points
      const dx = line.x2 - line.x1;
      const dy = line.y2 - line.y1;
      const length = Math.sqrt(dx * dx + dy * dy);
      const extendFactor = 2; // Extend to 2x the original length on each side

      const extendedX1 = line.x1 - (dx / length) * (length * extendFactor);
      const extendedY1 = line.y1 - (dy / length) * (length * extendFactor);
      const extendedX2 = line.x2 + (dx / length) * (length * extendFactor);
      const extendedY2 = line.y2 + (dy / length) * (length * extendFactor);

      return (
        <KonvaLine
          key={line.id}
          points={[extendedX1, extendedY1, extendedX2, extendedY2]}
          stroke={color}
          strokeWidth={isSelected ? 5 : isHovered ? 4 : 3}
          dash={[10, 5]} // Dashed for infinite lines
          onClick={() => handleLineClick(line.id)}
          onMouseEnter={() => setHoveredLine(line.id)}
          onMouseLeave={() => setHoveredLine(null)}
          shadowColor="black"
          shadowBlur={isSelected ? 10 : 5}
          shadowOpacity={0.5}
        />
      );
    }

    return null;
  };

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.questionText}>{question.instruction}</div>

      <div className={styleModule.canvasWrapper}>
        <Stage width={canvasWidth} height={canvasHeight}>
          <Layer>
            {/* Draw grid lines (optional) */}
            {Array.from({ length: 21 }).map((_, i) => (
              <React.Fragment key={`grid-${i}`}>
                <KonvaLine
                  points={[i * 40, 0, i * 40, canvasHeight]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={1}
                />
                <KonvaLine
                  points={[0, i * 30, canvasWidth, i * 30]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}

            {/* Draw all lines */}
            {lines.map((line: MinigameLine) => renderLine(line))}

            {/* Draw endpoint circles for reference */}
            {lines.map((line: MinigameLine) => (
              <React.Fragment key={`points-${line.id}`}>
                <Circle x={line.x1} y={line.y1} radius={4} fill="#fff" />
                <Circle x={line.x2} y={line.y2} radius={4} fill="#fff" />
                
                {/* Label */}
                {line.label && (
                  <Text
                    x={(line.x1 + line.x2) / 2 - 20}
                    y={(line.y1 + line.y2) / 2 - 30}
                    text={line.label}
                    fontSize={16}
                    fontStyle="bold"
                    fill={selectedLine === line.id ? '#FFD700' : '#E8F4FD'}
                    align="center"
                    width={40}
                  />
                )}
              </React.Fragment>
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Instructions */}
      <div className={styleModule.instructions}>
        <p>
          Click on the {showType} that matches the description.{' '}
          {selectedLine ? `Selected: ${selectedLine}` : 'None selected'}
        </p>
        <p className={styleModule.hint}>{question.hint}</p>
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

export default LineBasedMinigame;
