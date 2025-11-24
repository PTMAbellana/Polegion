// ============================================================================
// CASTLE 6 - CHAPTER 1: POSTTEST ASSESSMENT
// "The Grand Championship" - Final Assessment
// ============================================================================

export const CASTLE6_CHAPTER1_TITLE = "The Grand Championship";
export const CASTLE6_CHAPTER1_DESCRIPTION = "Show how much you've grown as a geometry master!";

// Dialogue and Scenes (Kahoot/Quizlet Style)
export const CASTLE6_CHAPTER1_DIALOGUE = [
    // Opening Scene
    "Congratulations, Champion! You've conquered all five castles of the Kingdom!",
    "Now it's time for the Grand Championship - a final test of all you've learned.",
    "The Guardian is eager to see how much you've grown on your journey.",
    "Let's see your mastery of geometry! Ready?",
    
    // Assessment will be loaded dynamically via API
];

export const CASTLE6_CHAPTER1_SCENES = {
    opening: { start: 0, end: 3 }
    // Assessment scene will be handled by AssessmentQuiz component
};

// Audio narration paths (optional)
export const CASTLE6_CHAPTER1_NARRATION = {
    opening: [
        '/audio/castle6/chapter1/opening_0.mp3',
        '/audio/castle6/chapter1/opening_1.mp3',
        '/audio/castle6/chapter1/opening_2.mp3',
        '/audio/castle6/chapter1/opening_3.mp3'
    ]
};

// Assessment configuration
export const CASTLE6_CHAPTER1_ASSESSMENT_CONFIG = {
    type: 'posttest' as const,
    castleId: 'castle6',
    chapterId: 'castle6-chapter1',
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
        primaryColor: '#f59e0b', // Amber/Gold
        accentColor: '#eab308',  // Yellow
        style: 'kahoot' as const // Kahoot-inspired styling
    },
    showComparison: true // Show improvement from pretest
};
