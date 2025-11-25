// ============================================================================
// ASSESSMENT INTRO - Kahoot Style
// Introduction screen before starting assessment
// ============================================================================
'use client';

import React from 'react';
import styles from '@/styles/assessment.module.css';

interface AssessmentIntroProps {
    title: string;
    description: string;
    totalQuestions: number;
    castleNumber: number;
    categories: Array<{
        name: string;
        icon?: string;
        description: string;
    }>;
    onStart: () => void;
}

export default function AssessmentIntro({ 
    title, 
    description,
    totalQuestions,
    castleNumber,
    categories,
    onStart 
}: AssessmentIntroProps) {
    // Castle-specific color themes
    const getCastleTheme = () => {
        switch(castleNumber) {
            case 0:
                return {
                    primary: '#37353E',
                    secondary: '#44444E',
                    accent: '#715A5A',
                    light: '#D3DAD9',
                    gradient: 'linear-gradient(135deg, #37353E 0%, #44444E 100%)',
                    cardGradient: 'linear-gradient(135deg, #E8ECEB 0%, #D3DAD9 100%)',
                    buttonGradient: 'linear-gradient(135deg, #715A5A 0%, #5A4848 100%)',
                    panelBg: '#F2F2F4',
                };
            case 6:
                return {
                    primary: '#000080',
                    secondary: '#00044A',
                    accent: '#FFBF1C',
                    light: '#FFD60A',
                    gradient: 'linear-gradient(135deg, #000080 0%, #00044A 100%)',
                    cardGradient: 'linear-gradient(135deg, #FFD60A 0%, #FFBF1C 100%)',
                    buttonGradient: 'linear-gradient(135deg, #FFBF1C 0%, #D1A309 100%)',
                    panelBg: '#FFF4C7',
                };
            default:
                return {
                    primary: '#667eea',
                    secondary: '#764ba2',
                    accent: '#10b981',
                    light: '#f0f4ff',
                    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    cardGradient: 'linear-gradient(135deg, #f8f9ff 0%, #f0f4ff 100%)',
                    buttonGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    panelBg: '#f7faff',
                };
        }
    };

    const theme = getCastleTheme();
    const castleLabel = castleNumber === 0 
        ? 'Castle 0 · Trial Grounds'
        : castleNumber === 6
            ? 'Castle 6 · Grand Championship'
            : `Castle ${castleNumber}`;
    const castleTone = castleNumber === 0
        ? 'Baseline Skill Check'
        : castleNumber === 6
            ? 'Final Mastery Review'
            : 'Assessment Preview';

    return (
        <div 
            className={styles['assessment-intro']}
            style={{
                ['--castle-primary' as any]: theme.primary,
                ['--castle-secondary' as any]: theme.secondary,
                ['--castle-accent' as any]: theme.accent,
                ['--castle-light' as any]: theme.light,
                ['--castle-gradient' as any]: theme.gradient,
                ['--castle-card-gradient' as any]: theme.cardGradient,
                ['--castle-button-gradient' as any]: theme.buttonGradient,
                ['--castle-panel-bg' as any]: theme.panelBg,
            }}
        >
            <div className={styles['intro-hero']}>
                <div className={styles['intro-text']}>
                    <span className={styles['castle-label']}>{castleLabel}</span>
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
                <div className={styles['hero-pill']}>
                    <span className={styles['hero-pill-title']}>{castleTone}</span>
                    <span className={styles['hero-pill-subtext']}>
                        {totalQuestions} questions | {categories.length} categories
                    </span>
                </div>
            </div>
            
            <div className={styles['assessment-info']}>
                <div className={styles['info-card']}>
                    <span className={styles['label']}>{totalQuestions} Questions</span>
                </div>
                <div className={styles['info-card']}>
                    <span className={styles['label']}>No Time Limit</span>
                </div>
                <div className={styles['info-card']}>
                    <span className={styles['label']}>{categories.length} Categories</span>
                </div>
            </div>
            
            <div className={styles['categories-preview']}>
                <h3>What You'll Be Tested On:</h3>
                <div className={styles['categories-grid']}>
                    {categories.map((cat, idx) => (
                        <div key={idx} className={styles['category-card-intro']}>
                            {cat.icon && <span className={styles['icon']}>{cat.icon}</span>}
                            <h4>{cat.name}</h4>
                            <p>{cat.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <button onClick={onStart} className={styles['start-button']}>
                Begin Assessment
            </button>
        </div>
    );
}
