// ============================================================================
// ASSESSMENT RESULTS - Kahoot/Quizlet Style
// Shows results after completing assessment
// ============================================================================
'use client';

import React from 'react';

interface AssessmentResultsProps {
    results: {
        totalScore: number;
        totalQuestions: number;
        categoryScores: Array<{
            category: string;
            score: number;
            total: number;
            icon: string;
        }>;
        timeTaken?: number;
    };
    assessmentType: 'pretest' | 'posttest';
    comparison?: {
        pretestScore: number;
        improvement: number;
    };
    onContinue: () => void;
}

export default function AssessmentResults({ 
    results, 
    assessmentType,
    comparison,
    onContinue 
}: AssessmentResultsProps) {
    return (
        <div className="assessment-results">
            {/* Celebration animation and results display */}
            <div className="results-header">
                <h1>Assessment Complete! 🎉</h1>
            </div>
            
            <div className="overall-score">
                <div className="score-circle">
                    {results.totalScore} / {results.totalQuestions}
                </div>
            </div>
            
            <div className="category-breakdown">
                {/* Category-by-category results */}
            </div>
            
            {assessmentType === 'posttest' && comparison && (
                <div className="improvement-section">
                    <h2>Your Growth Journey</h2>
                    <div className="comparison-chart">
                        {/* Before/after comparison */}
                    </div>
                </div>
            )}
            
            <button onClick={onContinue} className="continue-button">
                Continue Your Adventure
            </button>
        </div>
    );
}
