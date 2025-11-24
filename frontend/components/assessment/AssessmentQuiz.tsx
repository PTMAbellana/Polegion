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
    onAnswerSubmit: (answer: string) => void;
}

export default function AssessmentQuiz({ 
    questions, 
    currentQuestionIndex, 
    onAnswerSubmit 
}: AssessmentQuizProps) {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        if (isSubmitting) return;
        setSelectedAnswer(answer);
    };

    const handleSubmit = () => {
        if (!selectedAnswer || isSubmitting) return;
        
        setIsSubmitting(true);
        onAnswerSubmit(selectedAnswer);
        
        // Reset for next question
        setTimeout(() => {
            setSelectedAnswer(null);
            setIsSubmitting(false);
        }, 300);
    };

    return (
        <div className={styles['quiz-container']}>
            {/* Question Card */}
            <div className={styles['question-card']}>
                <div className={styles['question-header']}>
                    <span className={styles['question-category']}>{currentQuestion.category}</span>
                    <span className={styles['question-difficulty']}>{currentQuestion.difficulty}</span>
                </div>
                
                <div className={styles['question-text']}>
                    {currentQuestion.question}
                </div>
            </div>

            {/* Answer Options - Kahoot Style */}
            <div className={styles['answer-grid']}>
                {currentQuestion.options.map((option, index) => (
                    <button
                        key={index}
                        className={`${styles['answer-button']} ${
                            selectedAnswer === answerLabels[index] ? styles['selected'] : ''
                        } ${styles[`answer-color-${index}`]}`}
                        onClick={() => handleAnswerClick(answerLabels[index])}
                        disabled={isSubmitting}
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

            {/* Submit Button */}
            {selectedAnswer && (
                <div className={styles['submit-section']}>
                    <button 
                        onClick={handleSubmit}
                        className={styles['submit-button']}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Answer'}
                    </button>
                </div>
            )}
        </div>
    );
}
