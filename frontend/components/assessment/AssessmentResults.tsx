// ============================================================================
// ASSESSMENT RESULTS - Kahoot/Quizlet Style
// Shows results after completing assessment with radar chart visualization
// ============================================================================
'use client';

import React from 'react';
import AssessmentRadarChart from './AssessmentRadarChart';
import styles from '@/styles/assessment.module.css';

interface CategoryScore {
    category: string;
    score: number;
    total: number;
    percentage: number;
    icon: string;
}

interface AssessmentResultsProps {
    results: {
        totalScore: number;
        totalQuestions: number;
        percentage: number;
        categoryScores: CategoryScore[];
        completedAt?: string;
        comparison?: {
            pretest: {
                percentage: number;
                categoryScores: Record<string, { correct: number; total: number; percentage: number }>;
                completedAt: string;
            };
            posttest: {
                percentage: number;
                categoryScores: Record<string, { correct: number; total: number; percentage: number }>;
                completedAt: string;
            };
            improvements: {
                overallImprovement: number;
                categoryImprovements: Record<string, number>;
            };
        };
    };
    assessmentType: 'pretest' | 'posttest';
    onContinue: () => void;
}

export default function AssessmentResults({ 
    results, 
    assessmentType,
    onContinue 
}: AssessmentResultsProps) {
    const percentage = results.percentage || 
        Math.round((results.totalScore / results.totalQuestions) * 100);
    
    const getGradeMessage = (percent: number) => {
        if (percent >= 90) return { emoji: '🏆', message: 'Outstanding!' };
        if (percent >= 80) return { emoji: '🌟', message: 'Excellent!' };
        if (percent >= 70) return { emoji: '👍', message: 'Great Job!' };
        if (percent >= 60) return { emoji: '💪', message: 'Good Effort!' };
        return { emoji: '📚', message: 'Keep Learning!' };
    };
    
    const grade = getGradeMessage(percentage);
    
    // Transform category scores for radar chart
    const currentCategoryScores = results.categoryScores.reduce((acc, cat) => {
        acc[cat.category] = {
            correct: cat.score,
            total: cat.total,
            percentage: cat.percentage
        };
        return acc;
    }, {} as Record<string, { correct: number; total: number; percentage: number }>);
    
    // Get pretest scores if this is posttest
    const pretestScores: Record<string, { correct: number; total: number; percentage: number }> | null = assessmentType === 'posttest' && results.comparison
        ? results.comparison.pretest.categoryScores
        : null;
    
    return (
        <div className={styles['assessment-results']}>
            {/* Celebration Header */}
            <div className={styles['results-header']}>
                <div className={styles['celebration-emoji']}>{grade.emoji}</div>
                <h1 className={styles['results-title']}>
                    {assessmentType === 'pretest' ? 'Pretest' : 'Posttest'} Complete!
                </h1>
                <p className={styles['results-subtitle']}>{grade.message}</p>
            </div>
            
            {/* Overall Score Card */}
            <div className={styles['overall-score-card']}>
                <div className={styles['score-circle']}>
                    <div className={styles['score-value']}>{percentage}%</div>
                    <div className={styles['score-label']}>Overall Score</div>
                </div>
                <div className={styles['score-details']}>
                    <div className={styles['score-stat']}>
                        <span className={styles['stat-value']}>{results.totalScore}</span>
                        <span className={styles['stat-label']}>Correct</span>
                    </div>
                    <div className={styles['score-stat']}>
                        <span className={styles['stat-value']}>{results.totalQuestions}</span>
                        <span className={styles['stat-label']}>Total</span>
                    </div>
                </div>
            </div>
            
            {/* Improvement Banner (Posttest only) */}
            {assessmentType === 'posttest' && results.comparison && (
                <div className={styles['improvement-banner']}>
                    <h2>🎯 Your Growth Journey</h2>
                    <p className={styles['improvement-text']}>
                        Overall Improvement: 
                        <span className={styles['improvement-value']}>
                            {results.comparison.improvements.overallImprovement >= 0 ? '+' : ''}
                            {results.comparison.improvements.overallImprovement.toFixed(1)}%
                        </span>
                    </p>
                </div>
            )}
            
            {/* Radar Chart */}
            <div className={styles['chart-section']}>
                <h2 className={styles['section-title']}>
                    {assessmentType === 'posttest' && pretestScores 
                        ? 'Performance Comparison' 
                        : 'Category Breakdown'}
                </h2>
                <AssessmentRadarChart 
                    currentScores={currentCategoryScores}
                    pretestScores={pretestScores}
                />
            </div>
            
            {/* Category Cards */}
            <div className={styles['category-grid']}>
                {results.categoryScores.map((cat) => {
                    const pretestCat = pretestScores?.[cat.category];
                    const improvement = pretestCat 
                        ? cat.percentage - pretestCat.percentage 
                        : null;
                    
                    return (
                        <div key={cat.category} className={styles['category-card']}>
                            <div className={styles['category-icon']}>{cat.icon}</div>
                            <h3 className={styles['category-name']}>{cat.category}</h3>
                            <div className={styles['category-score']}>
                                {cat.score} / {cat.total}
                            </div>
                            <div className={styles['category-percentage']}>
                                {cat.percentage.toFixed(1)}%
                            </div>
                            {improvement !== null && (
                                <div className={improvement >= 0 ? styles['improvement-positive'] : styles['improvement-negative']}>
                                    {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            
            {/* Continue Button */}
            <div className={styles['action-section']}>
                <button 
                    onClick={onContinue} 
                    className={styles['continue-button']}
                >
                    {assessmentType === 'pretest' 
                        ? 'Begin Your Journey' 
                        : 'Complete Your Adventure'}
                </button>
            </div>
        </div>
    );
}
