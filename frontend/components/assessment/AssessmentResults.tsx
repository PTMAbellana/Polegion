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
    icon?: string;
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
    
    // ⭐ DepEd-Aligned Holistic Rubric
    const getProficiencyLevel = (percent: number) => {
        if (percent >= 90) return {
            level: 'Advanced',
            description: 'Demonstrates mastery: deep conceptual understanding, creativity, and flexible application of geometry.',
            color: '#10b981', // green
            icon: '⭐'
        };
        if (percent >= 75) return {
            level: 'Proficient',
            description: 'Solid understanding, correct reasoning, and consistent problem-solving.',
            color: '#3b82f6', // blue
            icon: '✓'
        };
        if (percent >= 60) return {
            level: 'Approaching Proficiency',
            description: 'Partial understanding; inconsistent or procedural-only.',
            color: '#f59e0b', // amber
            icon: '~'
        };
        if (percent >= 40) return {
            level: 'Developing',
            description: 'Fragmented understanding; struggles with multi-step problems.',
            color: '#ef4444', // red
            icon: '▽'
        };
        return {
            level: 'Beginning',
            description: 'Minimal understanding; mostly recall-level responses only.',
            color: '#dc2626', // dark red
            icon: '○'
        };
    };
    
    const getGradeMessage = (percent: number) => {
        if (percent >= 90) return { message: 'Outstanding!' };
        if (percent >= 80) return { message: 'Excellent!' };
        if (percent >= 70) return { message: 'Great Job!' };
        if (percent >= 60) return { message: 'Good Effort!' };
        return { message: 'Keep Learning!' };
    };
    
    const grade = getGradeMessage(percentage);
    const proficiency = getProficiencyLevel(percentage);
    
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
                <h1 className={styles['results-title']}>
                    {assessmentType === 'pretest' ? 'Pretest' : 'Posttest'} Complete!
                </h1>
                <p className={styles['results-subtitle']}>{grade.message}</p>
            </div>
            
            {/* Two Column Layout */}
            <div className={styles['results-grid']}>
                {/* LEFT COLUMN */}
                <div className={styles['left-column']}>
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
                    {/* ⭐ DepEd Proficiency Level Card */}
                    <div className={styles['proficiency-card']} style={{ borderColor: proficiency.color }}>
                        <div className={styles['proficiency-header']}>
                            <span className={styles['proficiency-icon']} style={{ color: proficiency.color }}>
                                {proficiency.icon}
                            </span>
                            <h2 className={styles['proficiency-level']} style={{ color: proficiency.color }}>
                                {proficiency.level}
                            </h2>
                        </div>
                        <p className={styles['proficiency-description']}>
                            {proficiency.description}
                        </p>
                        
                        {/* DepEd Rubric Scale */}
                        <div className={styles['rubric-scale']}>
                            <div className={styles['rubric-title']}>DepEd Proficiency Scale</div>
                            <div className={styles['rubric-levels']}>
                                {[
                                    { name: 'Advanced', min: 90, max: 100, color: '#10b981' },
                                    { name: 'Proficient', min: 75, max: 89, color: '#3b82f6' },
                                    { name: 'Approaching', min: 60, max: 74, color: '#f59e0b' },
                                    { name: 'Developing', min: 40, max: 59, color: '#ef4444' },
                                    { name: 'Beginning', min: 0, max: 39, color: '#dc2626' }
                                ].map((lvl) => {
                                    const isCurrentLevel = percentage >= lvl.min && percentage <= lvl.max;
                                    return (
                                        <div 
                                            key={lvl.name}
                                            className={`${styles['rubric-level']} ${isCurrentLevel ? styles['rubric-level-active'] : ''}`}
                                            style={{ 
                                                backgroundColor: isCurrentLevel ? `${lvl.color}15` : 'transparent',
                                                borderColor: isCurrentLevel ? lvl.color : '#e5e7eb'
                                            }}
                                        >
                                            <div className={styles['rubric-level-name']} style={{ color: isCurrentLevel ? lvl.color : '#6b7280' }}>
                                                {lvl.name}
                                            </div>
                                            <div className={styles['rubric-level-range']} style={{ color: isCurrentLevel ? lvl.color : '#9ca3af' }}>
                                                {lvl.min}–{lvl.max}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    {/* Improvement Banner (Posttest only) */}
                    {assessmentType === 'posttest' && results.comparison && (
                        <div className={styles['improvement-banner']}>
                            <h2>Your Growth Journey</h2>
                            <p className={styles['improvement-text']}>
                                Overall Improvement: 
                                <span className={styles['improvement-value']}>
                                    {results.comparison.improvements.overallImprovement >= 0 ? '+' : ''}
                                    {results.comparison.improvements.overallImprovement.toFixed(1)}%
                                </span>
                            </p>
                        </div>
                    )}
                </div>
                
                {/* RIGHT COLUMN */}
                <div className={styles['right-column']}>
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
                </div>
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
