'use client';

import React, { useState } from 'react';
import { MinigameQuestion } from '@/types/common/quiz';

interface ShapeBasedMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void;
  styleModule: { readonly [key: string]: string };
}

interface ShapeOption {
  id: string;
  name: string;
  svg: string;
  description?: string;
}

const ShapeBasedMinigame: React.FC<ShapeBasedMinigameProps> = ({
  question,
  onComplete,
  styleModule,
}) => {
  const [selectedShape, setSelectedShape] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const shapes = question.shapes || [];
  const correctAnswer = question.correctAnswer?.toString() || '';

  const handleShapeClick = (shapeId: string) => {
    setSelectedShape(shapeId);
    checkAnswer(shapeId);
  };

  const checkAnswer = (shapeId: string) => {
    const isCorrect = shapeId === correctAnswer;

    setFeedback(isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again!');
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      if (isCorrect) {
        onComplete(true, shapeId);
      } else {
        setSelectedShape(null);
        onComplete(false, shapeId);
      }
    }, 2000);
  };

  // Render shape SVG based on type
  const renderShapeSVG = (shape: any) => {
    const size = 80;
    const center = size / 2;

    switch (shape.type?.toLowerCase()) {
      case 'triangle':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon
              points={`${center},10 10,70 70,70`}
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'square':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect
              x="10"
              y="10"
              width="60"
              height="60"
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'rectangle':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <rect
              x="5"
              y="20"
              width="70"
              height="40"
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'circle':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <circle
              cx={center}
              cy={center}
              r="30"
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'pentagon':
        const pentagonPoints = Array.from({ length: 5 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          const x = center + 30 * Math.cos(angle);
          const y = center + 30 * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon
              points={pentagonPoints}
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'hexagon':
        const hexagonPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 6;
          const x = center + 30 * Math.cos(angle);
          const y = center + 30 * Math.sin(angle);
          return `${x},${y}`;
        }).join(' ');
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon
              points={hexagonPoints}
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'parallelogram':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon
              points="20,20 70,20 60,60 10,60"
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      case 'trapezoid':
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <polygon
              points="25,20 55,20 70,60 10,60"
              fill="none"
              stroke="#667eea"
              strokeWidth="3"
            />
          </svg>
        );

      default:
        // Custom SVG if provided
        if (shape.svg) {
          return <div dangerouslySetInnerHTML={{ __html: shape.svg }} />;
        }
        return (
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <text x={center} y={center} textAnchor="middle" fill="#667eea">
              ?
            </text>
          </svg>
        );
    }
  };

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.questionText}>{question.instruction}</div>

      {question.hint && (
        <div className={styleModule.instructions}>
          <p className={styleModule.hint}>{question.hint}</p>
        </div>
      )}

      <div className={styleModule.shapePreview}>
        {shapes.map((shape: any) => (
          <div
            key={shape.id}
            className={`${styleModule.shapeCard} ${
              selectedShape === shape.id ? styleModule.shapeCardSelected : ''
            }`}
            onClick={() => handleShapeClick(shape.id)}
          >
            <div className={styleModule.shapeIcon}>{renderShapeSVG(shape)}</div>
            <div className={styleModule.shapeLabel}>{shape.name || shape.type}</div>
            {shape.properties && (
              <div className={styleModule.shapeProperties}>
                {shape.properties.sides && <span>{shape.properties.sides} sides</span>}
                {shape.properties.angles && <span>{shape.properties.angles} angles</span>}
              </div>
            )}
          </div>
        ))}
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

export default ShapeBasedMinigame;
