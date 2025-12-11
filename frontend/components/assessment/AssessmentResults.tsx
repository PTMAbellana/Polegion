// ============================================================================
// ASSESSMENT RESULTS - Kahoot/Quizlet Style
// Shows results after completing assessment with radar chart visualization
// ============================================================================
'use client';

import React, { useRef, useState } from 'react';
import AssessmentRadarChart from './AssessmentRadarChart';
import Certificate from './Certificate';
import { useAuthStore } from '@/store/authStore';
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
        categoryScores: Record<string, { correct: number; total: number; score?: number; maxScore?: number; percentage: number }>;
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
    const { userProfile } = useAuthStore();
    const certificateRef = useRef<HTMLDivElement>(null);
    const [showCertificate, setShowCertificate] = useState(false);
    
    const percentage = results.percentage || 
        Math.round((results.totalScore / results.totalQuestions) * 100);
    
    // Format completion date
    const formatDate = (dateString?: string) => {
        if (!dateString) return new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };
    
    // Download certificate as image
    const handleDownloadCertificate = async () => {
        if (!certificateRef.current) return;
        
        try {
            // Dynamically import html2canvas
            const html2canvas = (await import('html2canvas')).default;
            
            const canvas = await html2canvas(certificateRef.current, {
                scale: 2,
                backgroundColor: '#ffffff',
                logging: false
            });
            
            // Convert to blob and download
            canvas.toBlob((blob) => {
                if (!blob) return;
                
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Polegion-Certificate-${userProfile?.first_name || 'Student'}-${new Date().getTime()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            });
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Failed to download certificate. Please try again.');
        }
    };
    
    // Castle-specific theme
    const getCastleTheme = () => {
        if (assessmentType === 'pretest') {
            return {
                primary: '#37353E',
                secondary: '#715A5A',
                accent: '#D3DAD9',
                buttonGradient: 'linear-gradient(135deg, #715A5A 0%, #5A4848 100%)',
                buttonHover: 'linear-gradient(135deg, #5A4848 0%, #4A3838 100%)'
            };
        } else if (assessmentType === 'posttest') {
            return {
                primary: '#000080',
                secondary: '#FFBF1C',
                accent: '#FFD60A',
                buttonGradient: 'linear-gradient(135deg, #FFBF1C 0%, #D1A309 100%)',
                buttonHover: 'linear-gradient(135deg, #D1A309 0%, #B8900A 100%)'
            };
        }
        return {
            primary: '#667eea',
            secondary: '#764ba2',
            accent: '#f0f4ff',
            buttonGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            buttonHover: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
        };
    };
    
    const castleTheme = getCastleTheme();
    
    // DepEd-Aligned Holistic Rubric
    const getProficiencyLevel = (percent: number) => {
        if (percent >= 90) return {
            level: 'Advanced',
            description: 'Demonstrates mastery: deep conceptual understanding, creativity, and flexible application of geometry.',
            color: '#10b981', // green
            icon: 'A'
        };
        if (percent >= 75) return {
            level: 'Proficient',
            description: 'Solid understanding, correct reasoning, and consistent problem-solving.',
            color: '#3b82f6', // blue
            icon: 'P'
        };
        if (percent >= 60) return {
            level: 'Approaching Proficiency',
            description: 'Partial understanding; inconsistent or procedural-only.',
            color: '#f59e0b', // amber
            icon: 'AP'
        };
        if (percent >= 40) return {
            level: 'Developing',
            description: 'Fragmented understanding; struggles with multi-step problems.',
            color: '#ef4444', // red
            icon: 'D'
        };
        return {
            level: 'Beginning',
            description: 'Minimal understanding; mostly recall-level responses only.',
            color: '#dc2626', // dark red
            icon: 'B'
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
    
    // categoryScores is already an object from the backend, no transformation needed
    const currentCategoryScores = results.categoryScores || {};
    
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
                        <div className={styles['score-main']}>
                            <div 
                                className={styles['score-circle']}
                                style={{
                                    '--percentage': percentage
                                } as React.CSSProperties}
                            >
                                <div className={styles['score-value']}>{percentage.toFixed(1)}%</div>
                                <div className={styles['score-label']}>Overall</div>
                            </div>
                            <div className={styles['score-info']}>
                                <h3 className={styles['score-heading']}>
                                    {assessmentType === 'pretest' ? 'Pretest Score' : 'Posttest Score'}
                                </h3>
                                <p className={styles['score-message']}>{grade.message}</p>
                            </div>
                        </div>
                        <div className={styles['score-divider']}></div>
                        <div className={styles['score-details']}>
                            <div className={styles['score-stat']}>
                                <div className={styles['stat-content']}>
                                    <span className={styles['stat-value']}>{results.totalScore}</span>
                                    <span className={styles['stat-label']}>Correct</span>
                                </div>
                            </div>
                            <div className={styles['score-stat']}>
                                <div className={styles['stat-content']}>
                                    <span className={styles['stat-value']}>{results.totalQuestions}</span>
                                    <span className={styles['stat-label']}>Questions</span>
                                </div>
                            </div>
                            <div className={styles['score-stat']}>
                                <div className={styles['stat-content']}>
                                    <span className={styles['stat-value']}>{proficiency.icon}</span>
                                    <span className={styles['stat-label']}>{proficiency.level.split(' ')[0]}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ⭐ DepEd Proficiency Level Card */}
                    <div className={styles['proficiency-card']} style={{ 
                        borderColor: proficiency.color,
                        background: `linear-gradient(135deg, ${proficiency.color}08 0%, ${proficiency.color}15 100%)`
                    }}>
                        <div className={styles['proficiency-header']}>
                            <span className={styles['proficiency-icon']} style={{ 
                                color: 'white',
                                background: proficiency.color,
                                width: '2.5rem',
                                height: '2.5rem',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                fontSize: '1.125rem',
                                boxShadow: `0 4px 12px ${proficiency.color}40`
                            }}>
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
            
            {/* Certificate Section (Posttest Only) */}
            {assessmentType === 'posttest' && (
                <div className={styles['certificate-section']}>
                    <div className={styles['certificate-header']}>
                        <h2 className={styles['certificate-title']}>
                            🏆 Congratulations, Geometry Master! 🏆
                        </h2>
                        <p className={styles['certificate-subtitle']}>
                            You've completed your journey through the Kingdom of Geometry!
                        </p>
                        <button
                            onClick={() => setShowCertificate(!showCertificate)}
                            className={styles['certificate-toggle-btn']}
                            style={{
                                background: castleTheme.buttonGradient,
                            }}
                        >
                            {showCertificate ? 'Hide Certificate' : 'View Your Certificate'}
                        </button>
                    </div>
                    
                    {showCertificate && (
                        <div className={styles['certificate-display']}>
                            <Certificate 
                                ref={certificateRef}
                                userName={`${userProfile?.first_name || ''} ${userProfile?.last_name || ''}`.trim() || 'Student'}
                                completionDate={formatDate(results.completedAt)}
                            />
                            <button
                                onClick={handleDownloadCertificate}
                                className={styles['download-certificate-btn']}
                                style={{
                                    background: castleTheme.buttonGradient,
                                }}
                            >
                                📥 Download Certificate
                            </button>
                        </div>
                    )}
                </div>
            )}
            
            {/* Continue Button */}
            <div className={styles['action-section']}>
                <button 
                    onClick={onContinue} 
                    className={styles['continue-button']}
                    style={{
                        background: castleTheme.buttonGradient,
                        boxShadow: `0 4px 12px ${castleTheme.primary}40`
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = castleTheme.buttonHover;
                        e.currentTarget.style.boxShadow = `0 6px 20px ${castleTheme.primary}50`;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = castleTheme.buttonGradient;
                        e.currentTarget.style.boxShadow = `0 4px 12px ${castleTheme.primary}40`;
                    }}
                >
                    {assessmentType === 'pretest' 
                        ? 'Begin Your Journey' 
                        : 'Complete Your Adventure'}
                </button>
            </div>
        </div>
    );
}
