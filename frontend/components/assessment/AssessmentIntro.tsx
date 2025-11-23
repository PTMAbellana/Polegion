// ============================================================================
// ASSESSMENT INTRO - Kahoot Style
// Introduction screen before starting assessment
// ============================================================================
'use client';

import React from 'react';

interface AssessmentIntroProps {
    title: string;
    description: string;
    totalQuestions: number;
    categories: Array<{
        name: string;
        icon: string;
        description: string;
    }>;
    onStart: () => void;
}

export default function AssessmentIntro({ 
    title, 
    description,
    totalQuestions,
    categories,
    onStart 
}: AssessmentIntroProps) {
    return (
        <div className="assessment-intro">
            <div className="intro-header">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            
            <div className="assessment-info">
                <div className="info-card">
                    <span className="icon">📝</span>
                    <span className="label">{totalQuestions} Questions</span>
                </div>
                <div className="info-card">
                    <span className="icon">⏱️</span>
                    <span className="label">No Time Limit</span>
                </div>
                <div className="info-card">
                    <span className="icon">✨</span>
                    <span className="label">6 Categories</span>
                </div>
            </div>
            
            <div className="categories-preview">
                <h3>What You'll Be Tested On:</h3>
                <div className="categories-grid">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="category-card">
                            <span className="icon">{cat.icon}</span>
                            <h4>{cat.name}</h4>
                            <p>{cat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <button onClick={onStart} className="start-button">
                Begin Assessment 🚀
            </button>
        </div>
    );
}
