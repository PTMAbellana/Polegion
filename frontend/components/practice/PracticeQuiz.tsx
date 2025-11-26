// ============================================================================
// PRACTICE QUIZ COMPONENT
// ============================================================================
// Displays multiple-choice questions with instant feedback
// ============================================================================

'use client';

import React, { useState } from 'react';
import type { Question } from '@/utils/questions/generateQuestions';
import styles from '@/styles/practice.module.css';

interface PracticeQuizProps {
  questions: Question[];
  onComplete: (score: number, totalQuestions: number) => void;
  onRestart: () => void;
}

export default function PracticeQuiz({ questions, onComplete, onRestart }: PracticeQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleRestartClick = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setFeedback(null);
    setScore(0);
    setAnsweredQuestions(0);
    setIsFinished(false);
    onRestart();
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (option: string) => {
    if (feedback !== null) return; // Already answered
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || feedback !== null) return;

    const isCorrect = selectedAnswer === currentQuestion.correct;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions(answeredQuestions + 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setFeedback(null);
    } else {
      setIsFinished(true);
      onComplete(score, questions.length);
    }
  };

  if (isFinished) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className={styles.resultsContainer}>
        <div className={styles.resultsCard}>
          <h2 className={styles.resultsTitle}>Practice Complete!</h2>
          
          <div className={styles.scoreCircle}>
            <div className={styles.scoreNumber}>{percentage}%</div>
            <div className={styles.scoreLabel}>Score</div>
          </div>

          <div className={styles.resultsStats}>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{finalScore}</span>
              <span className={styles.statLabel}>Correct</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{questions.length - finalScore}</span>
              <span className={styles.statLabel}>Incorrect</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{questions.length}</span>
              <span className={styles.statLabel}>Total</span>
            </div>
          </div>

          <button className={styles.restartButton} onClick={handleRestartClick}>
            Practice Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.progressBar}>
        <div 
          className={styles.progressFill} 
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionHeader}>
          <span className={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className={styles.currentScore}>
            Score: {score}/{answeredQuestions}
          </span>
        </div>

        <h3 className={styles.questionText}>{currentQuestion.question}</h3>

        <div className={styles.optionsGrid}>
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrectAnswer = option === currentQuestion.correct;
            const showCorrect = feedback !== null && isCorrectAnswer;
            const showIncorrect = feedback === 'incorrect' && isSelected && !isCorrectAnswer;

            return (
              <button
                key={index}
                className={`${styles.optionButton} ${
                  isSelected ? styles.selected : ''
                } ${showCorrect ? styles.correct : ''} ${
                  showIncorrect ? styles.incorrect : ''
                }`}
                onClick={() => handleAnswerSelect(option)}
                disabled={feedback !== null}
              >
                {option}
                {showCorrect && <span className={styles.checkmark}>✓</span>}
                {showIncorrect && <span className={styles.xmark}>✗</span>}
              </button>
            );
          })}
        </div>

        {feedback === null ? (
          <button
            className={styles.submitButton}
            onClick={handleSubmit}
            disabled={!selectedAnswer}
          >
            Submit Answer
          </button>
        ) : (
          <div className={styles.feedbackSection}>
            <div className={`${styles.feedbackMessage} ${styles[feedback]}`}>
              {feedback === 'correct' ? 'Correct!' : 'Incorrect'}
            </div>
            <button className={styles.nextButton} onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
