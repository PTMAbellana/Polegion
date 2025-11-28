// ============================================================================
// ASSESSMENT QUIZ COMPONENT - Kahoot/Quizlet Style
// Main component for displaying pretest/posttest assessments
// ============================================================================
'use client';

import React, { useState } from 'react';
import styles from '@/styles/assessment.module.css';

interface Question {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
    category: string;
    difficulty: string;
}

interface AssessmentQuizProps {
    questions: Question[];
    currentQuestionIndex: number;
    userAnswers: Record<number, string>;
    onAnswerSubmit: (answer: string) => void;
    onNavigate: (index: number) => void;
    onSubmitAssessment: () => void;
    // Progress bar props
    currentCategory?: string;
    categoryIcon?: string;
    elapsedSeconds?: number;
}

export default function AssessmentQuiz({ 
    questions, 
    currentQuestionIndex,
    userAnswers,
    onAnswerSubmit,
    onNavigate,
    onSubmitAssessment,
    currentCategory = '',
    categoryIcon = '',
    elapsedSeconds = 0
}: AssessmentQuizProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

    // Load saved answer when question changes
    React.useEffect(() => {
        const savedAnswer = userAnswers[currentQuestionIndex];
        setSelectedAnswer(savedAnswer || null);
    }, [currentQuestionIndex, userAnswers]);

    if (!questions || questions.length === 0 || currentQuestionIndex >= questions.length) {
        return (
            <div className={styles['quiz-error']}>
                <p>No questions available</p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const answerLabels = ['A', 'B', 'C', 'D'];

    const handleAnswerClick = (answer: string) => {
        setSelectedAnswer(answer);
        onAnswerSubmit(answer); // Save answer immediately
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            onNavigate(currentQuestionIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            onNavigate(currentQuestionIndex + 1);
        }
    };

    const allQuestionsAnswered = Object.keys(userAnswers).length === questions.length;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className={styles['quiz-container']}>
            <div className={styles['quiz-left']}>
                <div className={styles['question-navigator']}>
                    <div className={styles['navigator-header']}>
                        <div className={styles['progress-text']}>
                            {Object.keys(userAnswers).length} / {questions.length} answered
                        </div>
                        <div className={styles['answer-legend']}>
                            <div className={styles['legend-item']}>
                                <span className={`${styles['legend-dot']} ${styles['legend-dot-current']}`}></span>
                                <span>Current</span>
                            </div>
                            <div className={styles['legend-item']}>
                                <span className={`${styles['legend-dot']} ${styles['legend-dot-answered']}`}></span>
                                <span>Answered</span>
                            </div>
                            <div className={styles['legend-item']}>
                                <span className={styles['legend-dot']}></span>
                                <span>Not answered</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['question-grid']}>
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles['question-number']} ${
                                    index === currentQuestionIndex ? styles['current'] : ''
                                } ${
                                    userAnswers[index] ? styles['answered'] : ''
                                }`}
                                onClick={() => onNavigate(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles['quiz-right']}>
                {/* Progress Bar */}
                <div className={styles['assessment-progress']}>
                    <div className={styles['progress-info']}>
                        <span className={styles['category-info']}>
                            <span className={styles['icon']}>{categoryIcon}</span>
                            <span className={styles['name']}>{currentCategory}</span>
                        </span>
                        <span className={styles['question-count']}>
                            {currentQuestionIndex + 1} / {questions.length}
                        </span>
                        <span className={styles['timer-badge']}>
                            ⏱ {formatTime(elapsedSeconds)}
                        </span>
                    </div>
                    <div className={styles['progress-bar-container']}>
                        <div 
                            className={styles['progress-bar-fill']} 
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Question Card */}
                <div className={styles['question-card']}>
                    <div className={styles['question-header']}>
                        <span className={styles['question-number-label']}>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className={styles['question-category']}>{currentQuestion.category}</span>
                    </div>
                    
                    <div className={styles['question-text']}>
                        {currentQuestion.question}
                    </div>
                </div>

                {/* Answer Options */}
                <div className={styles['answer-grid']}>
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`${styles['answer-button']} ${
                                selectedAnswer === option ? styles['selected'] : ''
                            } ${styles[`answer-color-${index}`]}`}
                            onClick={() => handleAnswerClick(option)}
                        >
                            <div className={styles['answer-label']}>
                                {answerLabels[index]}
                            </div>
                            <div className={styles['answer-text']}>
                                {option}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Navigation Buttons */}
                <div className={styles['navigation-section']}>
                    <button 
                        onClick={handlePrevious}
                        className={styles['nav-button']}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    
                    {allQuestionsAnswered ? (
                        <button 
                            onClick={onSubmitAssessment}
                            className={styles['submit-assessment-button']}
                        >
                            Submit Assessment
                        </button>
                    ) : (
                        <span className={styles['submit-hint']}>
                            Answer all questions to submit
                        </span>
                    )}
                    
                    <button 
                        onClick={handleNext}
                        className={styles['nav-button']}
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
