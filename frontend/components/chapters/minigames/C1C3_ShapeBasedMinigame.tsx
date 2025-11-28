'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MinigameQuestion } from '@/types/common/quiz';

interface ShapeBasedMinigameProps {
  question: MinigameQuestion;
  onComplete: (isCorrect: boolean, selectedAnswer?: string) => void;
  styleModule: { readonly [key: string]: string };
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
        setSelectedShape(null); // Reset selection for next question
      } else {
        setSelectedShape(null);
        onComplete(false, shapeId);
      }
    }, 2000);
  };

  // Get image path for shape
  const getShapeImagePath = (shape: any) => {
    return `/images/castle1/${shape.type.toLowerCase()}.png`;
  };

  return (
    <div className={styleModule.minigameContainer}>
      <div className={styleModule.questionText}>{question.instruction}</div>

      <div className={styleModule.shapePreview}>
        {shapes.map((shape: any) => (
          <div
            key={shape.id}
            className={`${styleModule.shapeCard} ${
              selectedShape === shape.id ? styleModule.shapeCardSelected : ''
            }`}
            onClick={() => handleShapeClick(shape.id)}
          >
            <div className={styleModule.shapeIcon}>
              <Image 
                src={getShapeImagePath(shape)} 
                alt={shape.name || shape.type}
                width={180}
                height={120}
                style={{ objectFit: 'contain' }}
              />
            </div>
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
