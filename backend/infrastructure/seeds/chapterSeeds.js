// ============================================================================
// CASTLE 1 - CHAPTER SEED DATA
// ============================================================================

// Castle 1 Chapters
const castle1Chapters = [
    {
        id: '0847c3d5-3f86-4c1e-9b05-464270295cd8',
        title: 'Chapter 1: The Point of Origin',
        description: 'These are Points, the seeds of all geometry. Learn about points, lines, rays, and line segments through the Dot Dash mini-game.',
        chapter_number: 1,
        xp_reward: 100
    },
    {
        id: '69d21734-679b-45ea-9203-1dd15194e5cf',
        title: 'Chapter 2: Paths of Power',
        description: "Navigate the tower's magical floating bridges and master parallel, intersecting, and perpendicular lines through the Line Labyrinth.",
        chapter_number: 2,
        xp_reward: 150
    },
    {
        id: 'c9b7a976-d466-4831-aacf-f8e0476f5153',
        title: 'Chapter 3: Shapes of the Spire',
        description: 'Breathe life into geometric shapes! Identify and draw triangles, squares, rectangles, circles, and polygons in the Shape Summoner mini-game.',
        chapter_number: 3,
        xp_reward: 200
    }
];

// ============================================================================
// CASTLE 1 - CHAPTER 1 - QUIZZES
// ============================================================================

// Castle 1 - Chapter 1 Quizzes
const castle1Chapter1Quizzes = [
    {
        id: 'a1b2c3d4-1234-5678-9abc-def012345678',
        chapter_id: '0847c3d5-3f86-4c1e-9b05-464270295cd8',
        title: 'Lines, Rays & Segments Quiz',
        description: 'Test your understanding of geometric primitives',
        xp_reward: 50,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Which geometric element extends infinitely in BOTH directions?',
                    options: ['Line', 'Ray', 'Line Segment'],
                    correctAnswer: 'Line',
                    points: 15
                },
                {
                    id: 'q2',
                    question: 'Which shape has exactly two endpoints?',
                    options: ['Line', 'Ray', 'Line Segment'],
                    correctAnswer: 'Line Segment',
                    points: 15
                },
                {
                    id: 'q3',
                    question: 'Which shape starts at one point and extends infinitely?',
                    options: ['Line', 'Ray', 'Line Segment'],
                    correctAnswer: 'Ray',
                    points: 20
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 1 - CHAPTER 1 - MINIGAMES
// ============================================================================

// Castle 1 - Chapter 1 Minigames
const castle1Chapter1Minigames = [
    {
        id: 'b2c3d4e5-2345-6789-abcd-ef0123456789',
        chapter_id: '0847c3d5-3f86-4c1e-9b05-464270295cd8',
        title: 'Identify the Geometric Elements',
        description: 'Click and drag to create geometric shapes',
        game_type: 'interactive',
        xp_reward: 30,
        time_limit: null,
        order_index: 1,
        game_config: {
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Create a Line Segment AB: Connect point A to point B. It has two endpoints and a fixed length.',
                    points: [
                        { id: 'A', x: 150, y: 125, label: 'A' },
                        { id: 'B', x: 550, y: 125, label: 'B' }
                    ],
                    correctAnswer: ['A', 'B'],
                    type: 'Line Segment',
                    showType: 'segment',
                    hint: "A line segment has endpoints on both ends - it doesn't extend beyond them."
                },
                {
                    id: 'mg2',
                    instruction: 'Create Ray CD: Start at point C and go through point D. It has ONE endpoint at C and extends infinitely through D.',
                    points: [
                        { id: 'C', x: 150, y: 125, label: 'C' },
                        { id: 'D', x: 350, y: 125, label: 'D' },
                        { id: 'E', x: 550, y: 80, label: 'E' }
                    ],
                    correctAnswer: ['C', 'D'],
                    type: 'Ray',
                    showType: 'ray',
                    hint: 'A ray starts at one point and continues forever in one direction.'
                },
                {
                    id: 'mg3',
                    instruction: 'Create Line FG: Connect points F and G.',
                    points: [
                        { id: 'F', x: 200, y: 100, label: 'F' },
                        { id: 'G', x: 350, y: 125, label: 'G' },
                        { id: 'H', x: 500, y: 90, label: 'H' }
                    ],
                    correctAnswer: ['F', 'G'],
                    type: 'Line',
                    showType: 'line',
                    hint: 'A line has NO endpoints - it goes on forever in both directions.'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 1 - CHAPTER 2 - QUIZZES
// ============================================================================

// Castle 1 - Chapter 2 Quizzes
const castle1Chapter2Quizzes = [
    {
        id: 'c2d1d2e3-4567-89ab-cdef-012345678901',
        chapter_id: '69d21734-679b-45ea-9203-1dd15194e5cf',
        title: 'Lines & Relationships Quiz',
        description: 'Test your understanding of parallel, intersecting, and perpendicular lines',
        xp_reward: 50,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Two lines that never meet and are always the same distance apart are called?',
                    options: ['Intersecting', 'Parallel', 'Perpendicular', 'Skew'],
                    correctAnswer: 'Parallel',
                    points: 15
                },
                {
                    id: 'q2',
                    question: 'When two lines meet at 90°, they are called?',
                    options: ['Parallel', 'Intersecting', 'Perpendicular', 'Adjacent'],
                    correctAnswer: 'Perpendicular',
                    points: 15
                },
                {
                    id: 'q3',
                    question: 'Lines that cross paths but not at a right angle are called?',
                    options: ['Parallel', 'Perpendicular', 'Intersecting', 'Skew'],
                    correctAnswer: 'Intersecting',
                    points: 20
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 1 - CHAPTER 2 - MINIGAMES
// ============================================================================

// Castle 1 - Chapter 2 Minigames
const castle1Chapter2Minigames = [
    {
        id: 'c2d1d2e3-5678-90ab-cdef-123456789012',
        chapter_id: '69d21734-679b-45ea-9203-1dd15194e5cf',
        title: 'Paths of Power',
        description: 'Identify parallel, intersecting, and perpendicular lines',
        game_type: 'interactive',
        xp_reward: 30,
        time_limit: null,
        order_index: 1,
        game_config: {
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Identify the PARALLEL lines: Lines that travel side by side, never touching, always the same distance apart.',
                    lines: [
                        { id: 'L1', x1: 100, y1: 50, x2: 600, y2: 50, label: 'Line A' },
                        { id: 'L2', x1: 100, y1: 150, x2: 600, y2: 150, label: 'Line B' },
                        { id: 'L3', x1: 100, y1: 100, x2: 400, y2: 200, label: 'Line C' }
                    ],
                    correctAnswer: ['L1', 'L2'],
                    type: 'Parallel Lines',
                    hint: 'Parallel lines never meet and maintain equal distance. Look for lines that run in the same direction!'
                },
                {
                    id: 'mg2',
                    instruction: 'Identify the PERPENDICULAR lines: Lines that meet at exactly 90° (a right angle).',
                    lines: [
                        { id: 'L1', x1: 350, y1: 50, x2: 350, y2: 200, label: 'Line A' },
                        { id: 'L2', x1: 200, y1: 125, x2: 500, y2: 125, label: 'Line B' },
                        { id: 'L3', x1: 150, y1: 80, x2: 450, y2: 180, label: 'Line C' }
                    ],
                    correctAnswer: ['L1', 'L2'],
                    type: 'Perpendicular Lines',
                    hint: 'Perpendicular lines form a perfect right angle (90°). Look for lines that form a corner like the letter L!'
                },
                {
                    id: 'mg3',
                    instruction: 'Identify the INTERSECTING lines: Lines that cross but NOT at a right angle.',
                    lines: [
                        { id: 'L1', x1: 100, y1: 50, x2: 600, y2: 50, label: 'Line A' },
                        { id: 'L2', x1: 150, y1: 30, x2: 550, y2: 220, label: 'Line B' },
                        { id: 'L3', x1: 100, y1: 150, x2: 600, y2: 150, label: 'Line C' }
                    ],
                    correctAnswer: ['L1', 'L2'],
                    type: 'Intersecting Lines',
                    hint: 'Intersecting lines cross each other at any angle except 90°. They meet like an X!'
                }
            ]
        }
    }
];

// ============================================================================
// FUTURE CASTLES & CHAPTERS - ADD HERE
// ============================================================================

// Example structure for Castle 1 - Chapter 2 (when ready):
// const castle1Chapter2Quizzes = [
//     {
//         id: 'uuid-here',
//         chapter_id: '69d21734-679b-45ea-9203-1dd15194e5cf',
//         title: 'Lines Quiz',
//         description: 'Test your knowledge of parallel and intersecting lines',
//         xp_reward: 50,
//         passing_score: 70,
//         time_limit: null,
//         quiz_config: { questions: [...] }
//     }
// ];
//
// const castle1Chapter2Minigames = [
//     {
//         id: 'uuid-here',
//         chapter_id: '69d21734-679b-45ea-9203-1dd15194e5cf',
//         title: 'Line Labyrinth',
//         description: 'Navigate through parallel and perpendicular lines',
//         game_type: 'interactive',
//         xp_reward: 30,
//         ...
//     }
// ];

// Example structure for Castle 2 - Chapter 1 (when ready):
// const castle2Chapter1Quizzes = [
//     {
//         id: 'uuid-here',
//         chapter_id: 'castle-2-chapter-1-uuid',
//         title: 'Castle 2 Quiz',
//         ...
//     }
// ];
//
// const castle2Chapter1Minigames = [
//     {
//         id: 'uuid-here',
//         chapter_id: 'castle-2-chapter-1-uuid',
//         title: 'Castle 2 Minigame',
//         ...
//     }
// ];

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    castle1Chapters,
    castle1Chapter1Quizzes,
    castle1Chapter1Minigames,
    castle1Chapter2Quizzes,
    castle1Chapter2Minigames
    // Export additional quizzes/minigames as you add them:
    // castle2Chapter1Quizzes,
    // castle2Chapter1Minigames,
};
