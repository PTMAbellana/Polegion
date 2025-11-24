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
    categories,
    onStart 
}: AssessmentIntroProps) {
    return (
        <div className={styles['assessment-intro']}>
            <div className={styles['intro-header']}>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            
            <div className={styles['assessment-info']}>
                <div className={styles['info-card']}>
                    <span className={styles['label']}>{totalQuestions} Questions</span>
                </div>
                <div className={styles['info-card']}>
                    <span className={styles['label']}>No Time Limit</span>
                </div>
                <div className={styles['info-card']}>
                    <span className={styles['label']}>6 Categories</span>
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
