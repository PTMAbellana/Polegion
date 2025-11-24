// ============================================================================
// CASTLE 0 - CHAPTER 1: PRETEST ASSESSMENT
// "The Trial Grounds" - Initial Assessment
// ============================================================================

export const CASTLE0_CHAPTER1_TITLE = "The Trial Grounds";
export const CASTLE0_CHAPTER1_DESCRIPTION = "Prove your worth before entering the kingdom!";

// Dialogue and Scenes (Kahoot/Quizlet Style)
export const CASTLE0_CHAPTER1_DIALOGUE = [
    // Opening Scene
    "Welcome, brave adventurer! Before you embark on your journey through the Kingdom of Geometry...",
    "The Guardian must assess your current knowledge.",
    "Don't worry - there are no wrong answers here. This helps us understand what you already know!",
    "Are you ready to begin the Trial?",
    
    // Assessment will be loaded dynamically via API
];

export const CASTLE0_CHAPTER1_SCENES = {
    opening: { start: 0, end: 3 }
    // Assessment scene will be handled by AssessmentQuiz component
};

// Audio narration paths (optional)
export const CASTLE0_CHAPTER1_NARRATION = {
    opening: [
        '/audio/castle0/chapter1/opening_0.wav',
        '/audio/castle0/chapter1/opening_1.wav',
        '/audio/castle0/chapter1/opening_2.wav',
        '/audio/castle0/chapter1/opening_3.wav'
    ]
};

// Assessment configuration
export const CASTLE0_CHAPTER1_ASSESSMENT_CONFIG = {
    type: 'pretest' as const,
    castleId: 'castle0',
    chapterId: 'castle0-chapter1',
    totalQuestions: 60,
    questionsPerCategory: 10,
    categories: [
        { 
            id: 'knowledge_recall', 
            name: 'Memory Challenge',
            description: 'Remember and recall geometric facts'
        },
        { 
            id: 'concept_understanding', 
            name: 'Wisdom Test',
            description: 'Understand geometric concepts'
        },
        { 
            id: 'procedural_skills', 
            name: 'Skill Trial',
            description: 'Apply geometric procedures'
        },
        { 
            id: 'analytical_thinking', 
            name: 'Detective Quest',
            description: 'Analyze geometric relationships'
        },
        { 
            id: 'problem_solving', 
            name: "Hero's Challenge",
            description: 'Solve geometric problems'
        },
        { 
            id: 'higher_order', 
            name: "Master's Riddle",
            description: 'Creative geometric thinking'
        }
    ],
    theme: {
        primaryColor: '#6366f1', // Indigo
        accentColor: '#8b5cf6',  // Purple
        style: 'kahoot' as const // Kahoot-inspired styling
    }
};
