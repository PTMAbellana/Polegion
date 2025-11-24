// ============================================================================
// ASSESSMENT PROGRESS BAR - Kahoot Style
// Shows current progress through the assessment
// ============================================================================
'use client';

import React from 'react';
import styles from '@/styles/assessment.module.css';

interface AssessmentProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    currentCategory: string;
    categoryIcon: string;
}

export default function AssessmentProgress({ 
    currentQuestion, 
    totalQuestions,
    currentCategory,
    categoryIcon
}: AssessmentProgressProps) {
    const progress = (currentQuestion / totalQuestions) * 100;
    
    return (
        <div className={styles['assessment-progress']}>
            <div className={styles['progress-info']}>
                <span className={styles['category-info']}>
                    <span className={styles['icon']}>{categoryIcon}</span>
                    <span className={styles['name']}>{currentCategory}</span>
                </span>
                <span className={styles['question-count']}>
                    {currentQuestion} / {totalQuestions}
                </span>
            </div>
            
            <div className={styles['progress-bar-container']}>
                <div 
                    className={styles['progress-bar-fill']} 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
