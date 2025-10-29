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
// CASTLE 2 - CHAPTER SEED DATA
// ============================================================================

// Castle 2 Chapters - Polygon & Measurement Castle
const castle2Chapters = [
    {
        id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Chapter 1: The Shapewood Path',
        description: 'Journey through the enchanted forest and master polygon identification. Learn to recognize triangles, quadrilaterals, pentagons, hexagons, heptagons, and octagons.',
        chapter_number: 1,
        xp_reward: 150
    },
    {
        id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Chapter 2: The Perimeter Pathway',
        description: 'Guard the forest boundaries by calculating perimeters. Trace the edges of various polygons and sum their side lengths.',
        chapter_number: 2,
        xp_reward: 175
    },
    {
        id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Chapter 3: The Courtyard of Area',
        description: 'Restore ancient forest tiles by calculating areas. Master formulas for rectangles, squares, triangles, parallelograms, trapezoids, and composite figures.',
        chapter_number: 3,
        xp_reward: 200
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 1 - QUIZZES
// ============================================================================

const castle2Chapter1Quizzes = [
    {
        id: 'a1b2c3d4-5678-9abc-def0-123456789001',
        chapter_id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Polygon Identification Quiz',
        description: 'Test your knowledge of polygon shapes and their properties',
        xp_reward: 80,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'How many sides does a triangle have?',
                    options: ['2 sides', '3 sides', '4 sides', '5 sides'],
                    correctAnswer: '3 sides',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'How many sides does a hexagon have?',
                    options: ['4 sides', '5 sides', '6 sides', '7 sides'],
                    correctAnswer: '6 sides',
                    points: 20
                },
                {
                    id: 'q3',
                    question: 'Which polygon has the most sides?',
                    options: ['Pentagon (5)', 'Hexagon (6)', 'Heptagon (7)', 'Octagon (8)'],
                    correctAnswer: 'Octagon (8)',
                    points: 40
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 1 - MINIGAMES
// ============================================================================

const castle2Chapter1Minigames = [
    {
        id: 'b2c3d4e5-6789-abcd-ef01-234567890001',
        chapter_id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Shape Collector',
        description: 'Identify and collect polygons by clicking on the correct shapes',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Click on the polygon that matches the name Sylvan calls out!',
            rounds: [
                {
                    id: 'round1',
                    targetShape: 'triangle',
                    targetName: 'Triangle',
                    sides: 3,
                    hint: 'Look for the shape with 3 sides'
                },
                {
                    id: 'round2',
                    targetShape: 'square',
                    targetName: 'Square (Quadrilateral)',
                    sides: 4,
                    hint: 'Find the shape with 4 equal sides'
                },
                {
                    id: 'round3',
                    targetShape: 'pentagon',
                    targetName: 'Pentagon',
                    sides: 5,
                    hint: 'Search for the 5-sided polygon'
                },
                {
                    id: 'round4',
                    targetShape: 'hexagon',
                    targetName: 'Hexagon',
                    sides: 6,
                    hint: 'Like a honeycomb cell - 6 sides'
                },
                {
                    id: 'round5',
                    targetShape: 'heptagon',
                    targetName: 'Heptagon',
                    sides: 7,
                    hint: 'Count carefully - 7 sides'
                },
                {
                    id: 'round6',
                    targetShape: 'octagon',
                    targetName: 'Octagon',
                    sides: 8,
                    hint: 'Like a stop sign - 8 sides'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 2 - QUIZZES
// ============================================================================

const castle2Chapter2Quizzes = [
    {
        id: 'c3d4e5f6-789a-bcde-f012-345678900002',
        chapter_id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Perimeter Mastery Quiz',
        description: 'Calculate the perimeter of various polygons',
        xp_reward: 90,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'What is the perimeter of a square with side length 5 cm?',
                    options: ['10 cm', '15 cm', '20 cm', '25 cm'],
                    correctAnswer: '20 cm',
                    points: 20,
                    hint: 'Perimeter of square = 4 × side'
                },
                {
                    id: 'q2',
                    question: 'A rectangle has length 8 cm and width 3 cm. What is its perimeter?',
                    options: ['11 cm', '16 cm', '22 cm', '24 cm'],
                    correctAnswer: '22 cm',
                    points: 30,
                    hint: 'Perimeter = 2(length + width)'
                },
                {
                    id: 'q3',
                    question: 'A triangle has sides of 6 cm, 8 cm, and 10 cm. What is the perimeter?',
                    options: ['14 cm', '18 cm', '24 cm', '30 cm'],
                    correctAnswer: '24 cm',
                    points: 40,
                    hint: 'Add all three sides together'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 2 - MINIGAMES
// ============================================================================

const castle2Chapter2Minigames = [
    {
        id: 'd4e5f6a7-89ab-cdef-0123-456789000002',
        chapter_id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Perimeter Pathway',
        description: 'Trace the edges and calculate perimeters of forest shapes',
        game_type: 'interactive',
        xp_reward: 50,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Calculate the perimeter by adding all side lengths!',
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Find the perimeter of this square',
                    shape: 'square',
                    sides: [4, 4, 4, 4],
                    correctAnswer: 16,
                    unit: 'cm',
                    hint: 'Add all four sides: 4 + 4 + 4 + 4'
                },
                {
                    id: 'mg2',
                    instruction: 'Find the perimeter of this rectangle',
                    shape: 'rectangle',
                    sides: [7, 3, 7, 3],
                    correctAnswer: 20,
                    unit: 'cm',
                    hint: 'Add: 7 + 3 + 7 + 3'
                },
                {
                    id: 'mg3',
                    instruction: 'Find the perimeter of this triangle',
                    shape: 'triangle',
                    sides: [5, 5, 6],
                    correctAnswer: 16,
                    unit: 'cm',
                    hint: 'Add all three sides: 5 + 5 + 6'
                },
                {
                    id: 'mg4',
                    instruction: 'Find the perimeter of this pentagon',
                    shape: 'pentagon',
                    sides: [4, 4, 4, 4, 4],
                    correctAnswer: 20,
                    unit: 'cm',
                    hint: 'A regular pentagon: 5 sides of 4 cm each'
                }
            ]
        }
    }
];

// ============================================================================
// FUTURE CASTLES & CHAPTERS - ADD HERE
// ============================================================================

// Example structure for Castle 3 - Chapters (when ready):
// const castle3Chapters = [
//     {
//         id: 'uuid-here',
//         title: 'Castle 3 Chapter',
//         description: 'Description here',
//         chapter_number: 1,
//         xp_reward: 150
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
    castle1Chapter2Minigames,
    // Castle 2
    castle2Chapters,
    castle2Chapter1Quizzes,
    castle2Chapter1Minigames,
    castle2Chapter2Quizzes,
    castle2Chapter2Minigames
};
