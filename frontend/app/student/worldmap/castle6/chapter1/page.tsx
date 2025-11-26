// Castle 6 - Chapter 1: Posttest Assessment
'use client';

import { useEffect, useState } from 'react';
import AssessmentPageBase, { AssessmentConfig } from '@/components/assessment/AssessmentPageBase';
import { 
    CASTLE6_CHAPTER1_TITLE,
    CASTLE6_CHAPTER1_DESCRIPTION,
    CASTLE6_CHAPTER1_DIALOGUE,
    CASTLE6_CHAPTER1_SCENES,
    CASTLE6_CHAPTER1_NARRATION,
    CASTLE6_CHAPTER1_ASSESSMENT_CONFIG
} from '@/constants/chapters/castle6/chapter1';

export default function Castle6Chapter1Page() {
    // Force remount on retake by using timestamp as key
    const [remountKey, setRemountKey] = useState(Date.now());
    
    useEffect(() => {
        // Update key when page is visited to force fresh state
        setRemountKey(Date.now());
    }, []);

    const config: AssessmentConfig = {
        type: 'posttest',
        castleId: 'a0b1c2d3-0006-4000-a000-000000000006',
        chapterId: 'a0b1c2d3-0006-4001-a001-000000000001',
        
        title: CASTLE6_CHAPTER1_TITLE,
        description: CASTLE6_CHAPTER1_DESCRIPTION,
        castleName: 'The Grand Championship',
        
        dialogue: CASTLE6_CHAPTER1_DIALOGUE,
        scenes: CASTLE6_CHAPTER1_SCENES,
        narration: CASTLE6_CHAPTER1_NARRATION,
        
        totalQuestions: CASTLE6_CHAPTER1_ASSESSMENT_CONFIG.totalQuestions,
        questionsPerCategory: CASTLE6_CHAPTER1_ASSESSMENT_CONFIG.questionsPerCategory,
        categories: CASTLE6_CHAPTER1_ASSESSMENT_CONFIG.categories,
        theme: CASTLE6_CHAPTER1_ASSESSMENT_CONFIG.theme,
        showComparison: CASTLE6_CHAPTER1_ASSESSMENT_CONFIG.showComparison,
        
        nextRoute: '/student/worldmap'
    };

    return <AssessmentPageBase key={remountKey} config={config} />;
}
