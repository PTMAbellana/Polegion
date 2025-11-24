// Castle 0 - Chapter 1: Pretest Assessment
'use client';

import { useEffect, useState } from 'react';
import AssessmentPageBase, { AssessmentConfig } from '@/components/assessment/AssessmentPageBase';
import { 
    CASTLE0_CHAPTER1_TITLE,
    CASTLE0_CHAPTER1_DESCRIPTION,
    CASTLE0_CHAPTER1_DIALOGUE,
    CASTLE0_CHAPTER1_SCENES,
    CASTLE0_CHAPTER1_NARRATION,
    CASTLE0_CHAPTER1_ASSESSMENT_CONFIG
} from '@/constants/chapters/castle0/chapter1';

export default function Castle0Chapter1Page() {
    // Force remount on retake by using timestamp as key
    const [remountKey, setRemountKey] = useState(Date.now());
    
    useEffect(() => {
        // Update key when page is visited to force fresh state
        setRemountKey(Date.now());
    }, []);

    const config: AssessmentConfig = {
        type: 'pretest',
        castleId: 'a0b1c2d3-0000-4000-a000-000000000000',
        chapterId: 'a0b1c2d3-0000-4001-a001-000000000001',
        
        title: CASTLE0_CHAPTER1_TITLE,
        description: CASTLE0_CHAPTER1_DESCRIPTION,
        castleName: 'The Trial Grounds',
        
        dialogue: CASTLE0_CHAPTER1_DIALOGUE,
        scenes: CASTLE0_CHAPTER1_SCENES,
        narration: CASTLE0_CHAPTER1_NARRATION,
        
        totalQuestions: CASTLE0_CHAPTER1_ASSESSMENT_CONFIG.totalQuestions,
        questionsPerCategory: CASTLE0_CHAPTER1_ASSESSMENT_CONFIG.questionsPerCategory,
        categories: CASTLE0_CHAPTER1_ASSESSMENT_CONFIG.categories,
        theme: CASTLE0_CHAPTER1_ASSESSMENT_CONFIG.theme,
        
        nextRoute: '/student/worldmap'
    };

    return <AssessmentPageBase key={remountKey} config={config} />;
}
