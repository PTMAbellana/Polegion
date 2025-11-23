// ============================================================================
// ASSESSMENT PROGRESS BAR - Kahoot Style
// Shows current progress through the assessment
// ============================================================================
'use client';

import React from 'react';

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
        <div className="assessment-progress">
            <div className="progress-info">
                <span className="category-info">
                    <span className="icon">{categoryIcon}</span>
                    <span className="name">{currentCategory}</span>
                </span>
                <span className="question-count">
                    {currentQuestion} / {totalQuestions}
                </span>
            </div>
            
            <div className="progress-bar-container">
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
