'use client';

import React, { useState } from 'react';

interface InteractiveExampleProps {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
  onCorrect?: () => void;
  styleModule: { readonly [key: string]: string };
}

const InteractiveExample: React.FC<InteractiveExampleProps> = ({
  question,
  options,
  correctAnswer,
  explanation,
  onCorrect,
  styleModule,
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleOptionClick = (option: string) => {
    if (hasAnswered) return;

    setSelectedOption(option);
    setHasAnswered(true);

    if (option === correctAnswer && onCorrect) {
      setTimeout(() => onCorrect(), 1500);
    }
  };

  const getOptionClassName = (option: string) => {
    if (!hasAnswered) {
      return selectedOption === option
        ? styleModule.answerOptionSelected
        : styleModule.answerOption;
    }

    if (option === correctAnswer) {
      return `${styleModule.answerOption} ${styleModule.answerOptionCorrect}`;
    }

    if (option === selectedOption && option !== correctAnswer) {
      return `${styleModule.answerOption} ${styleModule.answerOptionIncorrect}`;
    }

    return styleModule.answerOption;
  };

  return (
    <div className={styleModule.interactiveExample}>
      <div className={styleModule.exampleQuestion}>{question}</div>

      <div className={styleModule.answerOptions}>
        {options.map((option, index) => (
          <div
            key={index}
            className={getOptionClassName(option)}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </div>
        ))}
      </div>

      {hasAnswered && explanation && (
        <div
          className={`${styleModule.explanation} ${
            selectedOption === correctAnswer
              ? styleModule.explanationCorrect
              : styleModule.explanationIncorrect
          }`}
        >
          <strong>
            {selectedOption === correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </strong>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default InteractiveExample;
