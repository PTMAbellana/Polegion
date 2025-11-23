// ============================================================================
// ASSESSMENT QUESTION CARD - Kahoot/Quizlet Style
// Individual question display with answer choices
// ============================================================================
'use client';

import React from 'react';

interface QuestionCardProps {
    question: any;
    questionNumber: number;
    totalQuestions: number;
    category: string;
    onAnswer: (answer: string) => void;
}

export default function QuestionCard({ 
    question, 
    questionNumber, 
    totalQuestions,
    category,
    onAnswer 
}: QuestionCardProps) {
    return (
        <div className="question-card">
            {/* Kahoot-style question card with colorful answer buttons */}
            <div className="question-header">
                <span className="category-badge">{category}</span>
                <span className="progress">{questionNumber} / {totalQuestions}</span>
            </div>
            
            <div className="question-content">
                {/* Question text and image (if any) */}
            </div>
            
            <div className="answer-grid">
                {/* Grid of colorful answer buttons (Kahoot style) */}
            </div>
        </div>
    );
}
