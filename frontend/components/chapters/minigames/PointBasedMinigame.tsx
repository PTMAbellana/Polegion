'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import { MinigameQuestion, MinigamePoint } from '@/types/common/quiz';

interface PointBasedMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedPoints?: string[]) => void;
  canvasWidth?: number;
  canvasHeight?: number;
  styleModule: { readonly [key: string]: string };
}

const PointBasedMinigame: React.FC<PointBasedMinigameProps> = ({
  question,
  onComplete,
  canvasWidth = 700,
  canvasHeight = 350,
  styleModule,
}) => {
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const points = question.points || [];
  const correctAnswer = Array.isArray(question.correctAnswer)
    ? question.correctAnswer
    : [question.correctAnswer?.toString() || ''];

  const handlePointClick = (pointLabel: string) => {
    if (selectedPoints.includes(pointLabel)) {
      setSelectedPoints(selectedPoints.filter((p) => p !== pointLabel));
    } else {
      const newSelected = [...selectedPoints, pointLabel];
      setSelectedPoints(newSelected);

      // Auto-check when all required points selected
      if (newSelected.length === correctAnswer.length) {
        checkAnswer(newSelected);
      }
    }
  };

  const checkAnswer = (selected: string[]) => {
    const sortedSelected = [...selected].sort();
    const sortedCorrect = [...correctAnswer].sort();
    const isCorrect =
      sortedSelected.length === sortedCorrect.length &&
      sortedSelected.every((val, idx) => val === sortedCorrect[idx]);

    setFeedback(isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        onComplete(true, selected);
      } else {
        setSelectedPoints([]);
        onComplete(false, selected);
      }
    }, 2000);
  };

  const getPointColor = (pointLabel: string): string => {
    if (selectedPoints.includes(pointLabel)) return '#4CAF50';
    if (hoveredPoint === pointLabel) return '#FFD700';
    return '#667eea';
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
                {/* Vertical lines */}
                <Line
                  points={[i * 40, 0, i * 40, canvasHeight]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={1}
                />
                {/* Horizontal lines */}
                <Line
                  points={[0, i * 30, canvasWidth, i * 30]}
                  stroke="rgba(255, 255, 255, 0.1)"
                  strokeWidth={1}
                />
              </React.Fragment>
            ))}

            {/* Draw connecting lines between selected points */}
            {selectedPoints.length > 1 &&
              points &&
              selectedPoints.map((pointLabel, idx) => {
                if (idx === 0) return null;
                const prevPoint = points.find((p) => p.label === selectedPoints[idx - 1]);
                const currPoint = points.find((p) => p.label === pointLabel);

                if (!prevPoint || !currPoint) return null;

                return (
                  <Line
                    key={`line-${idx}`}
                    points={[prevPoint.x, prevPoint.y, currPoint.x, currPoint.y]}
                    stroke="#4CAF50"
                    strokeWidth={3}
                    dash={[10, 5]}
                  />
                );
              })}

            {/* Draw points */}
            {points.map((point: MinigamePoint) => {
              const isSelected = selectedPoints.includes(point.label);
              const isHovered = hoveredPoint === point.label;

              return (
                <React.Fragment key={point.label}>
                  {/* Point circle */}
                  <Circle
                    x={point.x}
                    y={point.y}
                    radius={isSelected ? 12 : isHovered ? 10 : 8}
                    fill={getPointColor(point.label)}
                    stroke={isSelected ? '#FFD700' : '#fff'}
                    strokeWidth={isSelected ? 3 : 2}
                    onClick={() => handlePointClick(point.label)}
                    onMouseEnter={() => setHoveredPoint(point.label)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    shadowColor="black"
                    shadowBlur={isSelected ? 10 : 5}
                    shadowOpacity={0.5}
                    style={{ cursor: 'pointer' }}
                  />

                  {/* Point label */}
                  <Text
                    x={point.x - 15}
                    y={point.y + 20}
                    text={point.label}
                    fontSize={14}
                    fontStyle="bold"
                    fill={isSelected ? '#FFD700' : '#E8F4FD'}
                    align="center"
                    width={30}
                  />
                </React.Fragment>
              );
            })}
          </Layer>
        </Stage>
      </div>

      {/* Instructions */}
      <div className={styleModule.instructions}>
        <p>Selected: {selectedPoints.join(', ') || 'None'} {selectedPoints.length > 0 && `(${selectedPoints.length}/${correctAnswer.length})`}</p>
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

export default PointBasedMinigame;
