'use client';

import React, { useState } from 'react';
import { MinigameQuestion } from '@/types/common/quiz';

interface PerimeterMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, answer?: number) => void;
  styleModule: { readonly [key: string]: string };
}

const PerimeterMinigame: React.FC<PerimeterMinigameProps> = ({
  question,
  onComplete,
  styleModule,
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswer = Number(question.correctAnswer);
  const shape = question.shape || '';
  const dimensions = question.dimensions || {};
  const unit = question.unit || 'units';
  const formula = question.formula || '';

  const handleSubmit = () => {
    if (!answer) return;

    const userAnswer = parseFloat(answer);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.01;

    setFeedback(
      isCorrect
        ? `Correct! The perimeter is ${correctAnswer} ${unit}`
        : `Incorrect. The correct answer is ${correctAnswer} ${unit}`
    );
    setShowFeedback(true);

  setTimeout(() => {
    setShowFeedback(false);
    onComplete(isCorrect, userAnswer);
    setAnswer('');
  }, 2500);
  };

  const renderShapeDiagram = () => {
    const svgSize = 300;
    const padding = 40;

    switch (shape.toLowerCase()) {
      case 'rectangle':
        const rectWidth = 200;
        const rectHeight = 120;
        const rectX = (svgSize - rectWidth) / 2;
        const rectY = (svgSize - rectHeight) / 2;

        return (
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <rect
              x={rectX}
              y={rectY}
              width={rectWidth}
              height={rectHeight}
              fill="rgba(102, 126, 234, 0.2)"
              stroke="#667eea"
              strokeWidth="3"
            />
            
            {/* Top side label */}
            <text
              x={svgSize / 2}
              y={rectY - 10}
              textAnchor="middle"
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              {dimensions.length || dimensions.width} {unit}
            </text>
            
            {/* Left side label */}
            <text
              x={rectX - 10}
              y={svgSize / 2}
              textAnchor="end"
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              {dimensions.width || dimensions.height} {unit}
            </text>
          </svg>
        );

      case 'square':
        const squareSize = 160;
        const squareX = (svgSize - squareSize) / 2;
        const squareY = (svgSize - squareSize) / 2;

        return (
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <rect
              x={squareX}
              y={squareY}
              width={squareSize}
              height={squareSize}
              fill="rgba(102, 126, 234, 0.2)"
              stroke="#667eea"
              strokeWidth="3"
            />
            
            <text
              x={svgSize / 2}
              y={squareY - 10}
              textAnchor="middle"
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              {question.sides} {unit}
            </text>
          </svg>
        );

      case 'triangle':
        const triBase = 200;
        const triHeight = 150;
        const triX = svgSize / 2;
        const triY = padding;
        
        // For simplicity, assuming equilateral or isosceles
        const sideLength = question.sides || dimensions.base;

        return (
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <polygon
              points={`${triX},${triY} ${triX - triBase / 2},${triY + triHeight} ${triX + triBase / 2},${triY + triHeight}`}
              fill="rgba(102, 126, 234, 0.2)"
              stroke="#667eea"
              strokeWidth="3"
            />
            
            {/* Base label */}
            <text
              x={svgSize / 2}
              y={triY + triHeight + 25}
              textAnchor="middle"
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              {dimensions.base} {unit}
            </text>
            
            {/* Left side label */}
            <text
              x={triX - triBase / 4 - 20}
              y={triY + triHeight / 2}
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              {sideLength} {unit}
            </text>
            
            {/* Right side label */}
            <text
              x={triX + triBase / 4 + 20}
              y={triY + triHeight / 2}
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              {sideLength} {unit}
            </text>
          </svg>
        );

      case 'circle':
        const radius = 80;
        const centerX = svgSize / 2;
        const centerY = svgSize / 2;

        return (
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`}>
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="rgba(102, 126, 234, 0.2)"
              stroke="#667eea"
              strokeWidth="3"
            />
            
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke="#FFD700"
              strokeWidth="2"
            />
            
            <circle cx={centerX} cy={centerY} r="3" fill="#FFD700" />
            
            <text
              x={centerX + radius / 2}
              y={centerY - 10}
              textAnchor="middle"
              fill="#FFD700"
              fontSize="16"
              fontWeight="bold"
            >
              r: {question.radius} {unit}
            </text>
          </svg>
        );

      default:
        return (
          <div className={styleModule.shapeLabel}>
            Shape: {shape}
            <br />
            {JSON.stringify(dimensions)}
          </div>
        );
    }
  };

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.questionText}>{question.instruction}</div>

      {/* Shape Diagram */}
      <div className={styleModule.canvasWrapper}>
        {renderShapeDiagram()}
      </div>

      {/* Formula Display */}
      {formula && (
        <div className={styleModule.formulaDisplay}>
          Formula: {formula}
        </div>
      )}

      {/* Hint */}
      {question.hint && (
        <div className={styleModule.instructions}>
          <p className={styleModule.hint}>{question.hint}</p>
        </div>
      )}

      {/* Answer Input */}
      <div className={styleModule.inputContainer}>
        <input
          type="number"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Enter perimeter..."
          className={styleModule.answerInput}
        />
        <span style={{ color: '#E8F4FD', fontSize: '1.2rem', fontWeight: 600 }}>
          {unit}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!answer}
          className={styleModule.submitButton}
        >
          Submit Answer
        </button>
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

export default PerimeterMinigame;
