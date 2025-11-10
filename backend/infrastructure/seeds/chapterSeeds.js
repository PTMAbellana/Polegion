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
        title: 'Geometry Physics Challenge',
        description: 'Guide the ball into the box using geometric shapes',
        game_type: 'physics',
        xp_reward: 30,
        time_limit: null,
        order_index: 1,
        game_config: {
            levels: [
                {
                    id: 1,
                    type: 'line-segment',
                    title: 'Level 1: Line Segment',
                    instruction: 'Create a line segment to guide the ball into the box. Click two points to create the segment.',
                    ballStartX: 20,
                    ballStartY: 10
                },
                {
                    id: 2,
                    type: 'ray',
                    title: 'Level 2: Ray',
                    instruction: 'Create a ray starting near the box. Place the first point carefully, then the second point to set the direction.',
                    ballStartX: 15,
                    ballStartY: 15
                },
                {
                    id: 3,
                    type: 'line',
                    title: 'Level 3: Line',
                    instruction: 'Create a line to guide the ball. Remember, a line extends infinitely in both directions!',
                    ballStartX: 10,
                    ballStartY: 20
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
        xp_reward: 75,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Two lines that never meet and are always the same distance apart are called?',
                    options: ['Intersecting', 'Parallel', 'Perpendicular', 'Skew'],
                    correctAnswer: 'Parallel',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'When two lines meet at 90°, they are called?',
                    options: ['Parallel', 'Intersecting', 'Perpendicular', 'Adjacent'],
                    correctAnswer: 'Perpendicular',
                    points: 25
                },
                {
                    id: 'q3',
                    question: 'Lines that cross paths but not at a right angle are called?',
                    options: ['Parallel', 'Perpendicular', 'Intersecting', 'Skew'],
                    correctAnswer: 'Intersecting',
                    points: 30
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
        xp_reward: 45,
        time_limit: null,
        order_index: 1,
        game_config: {
            questions: [
                {
                    id: 'level-1-parallel',
                    instruction: 'Select BOTH parallel lines: Lines that travel side by side, never touching, always the same distance apart.',
                    lines: [
                        { id: 'line-a', x1: 50, y1: 100, x2: 750, y2: 100, label: 'A' },
                        { id: 'line-b', x1: 50, y1: 200, x2: 750, y2: 200, label: 'B' },
                        { id: 'line-c', x1: 100, y1: 280, x2: 700, y2: 360, label: 'C' },
                        { id: 'line-d', x1: 400, y1: 250, x2: 400, y2: 380, label: 'D' }
                    ],
                    correctAnswer: 'line-a,line-b',
                    hint: 'Parallel lines never meet and maintain equal distance. Look for TWO lines that run in the same direction!'
                },
                {
                    id: 'level-2-intersecting',
                    instruction: 'Select the line that intersects with BOTH parallel lines.',
                    lines: [
                        { id: 'line-a', x1: 50, y1: 100, x2: 750, y2: 100, label: 'A' },
                        { id: 'line-b', x1: 50, y1: 300, x2: 750, y2: 300, label: 'B' },
                        { id: 'line-c', x1: 150, y1: 50, x2: 650, y2: 350, label: 'C' }
                    ],
                    correctAnswer: 'line-c',
                    hint: 'Look for the line that crosses through both of the parallel lines.'
                },
                {
                    id: 'level-3-perpendicular',
                    instruction: 'Select ALL lines that form a 90° angle (perpendicular) with each other.',
                    lines: [
                        { id: 'line-a', x1: 400, y1: 50, x2: 400, y2: 350, label: 'A' },
                        { id: 'line-b', x1: 100, y1: 200, x2: 700, y2: 200, label: 'B' },
                        { id: 'line-c', x1: 150, y1: 100, x2: 650, y2: 300, label: 'C' }
                    ],
                    correctAnswer: 'line-a,line-b',
                    hint: 'Perpendicular lines intersect at exactly 90 degrees, forming a perfect right angle. Look for a vertical and horizontal line!'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 1 - CHAPTER 3 - QUIZZES
// ============================================================================

const castle1Chapter3Quizzes = [
    {
        id: 'c3d4e5f6-7890-abcd-ef01-234567890123',
        chapter_id: 'c9b7a976-d466-4831-aacf-f8e0476f5153',
        title: 'Shape Mastery Quiz',
        description: 'Test your knowledge of geometric shapes',
        xp_reward: 100,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Which shape has exactly 3 sides?',
                    options: ['Square', 'Triangle', 'Circle', 'Pentagon'],
                    correctAnswer: 'Triangle',
                    points: 30
                },
                {
                    id: 'q2',
                    question: 'Which shape has 4 equal sides and 4 right angles?',
                    options: ['Rectangle', 'Triangle', 'Square', 'Circle'],
                    correctAnswer: 'Square',
                    points: 35
                },
                {
                    id: 'q3',
                    question: 'Which shape has no sides and is perfectly round?',
                    options: ['Triangle', 'Square', 'Circle', 'Rectangle'],
                    correctAnswer: 'Circle',
                    points: 35
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 1 - CHAPTER 3 - MINIGAMES
// ============================================================================

const castle1Chapter3Minigames = [
    {
        id: 'c3d1d2e3-5678-90ab-cdef-123456789012',
        chapter_id: 'c9b7a976-d466-4831-aacf-f8e0476f5153',
        title: 'Shape Summoner',
        description: 'Identify polygons: triangle, quadrilateral, pentagon, hexagon, heptagon, octagon, nonagon, decagon, hendecagon, dodecagon',
        game_type: 'interactive',
        xp_reward: 60,
        time_limit: null,
        order_index: 1,
        game_config: {
            questions: [
                {
                    id: 'level-1-triangle',
                    instruction: 'Identify the TRIANGLE: A polygon with 3 sides and 3 angles.',
                    shapes: [
                        { id: 'triangle', type: 'triangle', sides: 3, label: 'Triangle' },
                        { id: 'square', type: 'square', sides: 4, label: 'Square' },
                        { id: 'pentagon', type: 'pentagon', sides: 5, label: 'Pentagon' }
                    ],
                    correctAnswer: 'triangle',
                    hint: 'Triangles have 3 sides.'
                },
                {
                    id: 'level-2-quadrilateral',
                    instruction: 'Identify the QUADRILATERAL: A polygon with 4 sides.',
                    shapes: [
                        { id: 'quadrilateral', type: 'square', sides: 4, label: 'Quadrilateral' },
                        { id: 'hexagon', type: 'hexagon', sides: 6, label: 'Hexagon' },
                        { id: 'triangle', type: 'triangle', sides: 3, label: 'Triangle' }
                    ],
                    correctAnswer: 'quadrilateral',
                    hint: 'Quadrilaterals have 4 sides.'
                },
                {
                    id: 'level-3-pentagon',
                    instruction: 'Identify the PENTAGON: A polygon with 5 sides.',
                    shapes: [
                        { id: 'pentagon', type: 'pentagon', sides: 5, label: 'Pentagon' },
                        { id: 'octagon', type: 'octagon', sides: 8, label: 'Octagon' },
                        { id: 'hexagon', type: 'hexagon', sides: 6, label: 'Hexagon' }
                    ],
                    correctAnswer: 'pentagon',
                    hint: 'Pentagons have 5 sides.'
                },
                {
                    id: 'level-4-hexagon',
                    instruction: 'Identify the HEXAGON: A polygon with 6 sides.',
                    shapes: [
                        { id: 'hexagon', type: 'hexagon', sides: 6, label: 'Hexagon' },
                        { id: 'heptagon', type: 'heptagon', sides: 7, label: 'Heptagon' },
                        { id: 'nonagon', type: 'nonagon', sides: 9, label: 'Nonagon' }
                    ],
                    correctAnswer: 'hexagon',
                    hint: 'Hexagons have 6 sides.'
                },
                {
                    id: 'level-5-heptagon',
                    instruction: 'Identify the HEPTAGON: A polygon with 7 sides.',
                    shapes: [
                        { id: 'heptagon', type: 'heptagon', sides: 7, label: 'Heptagon' },
                        { id: 'octagon', type: 'octagon', sides: 8, label: 'Octagon' },
                        { id: 'decagon', type: 'decagon', sides: 10, label: 'Decagon' }
                    ],
                    correctAnswer: 'heptagon',
                    hint: 'Heptagons have 7 sides.'
                },
                {
                    id: 'level-6-octagon',
                    instruction: 'Identify the OCTAGON: A polygon with 8 sides.',
                    shapes: [
                        { id: 'octagon', type: 'octagon', sides: 8, label: 'Octagon' },
                        { id: 'nonagon', type: 'nonagon', sides: 9, label: 'Nonagon' },
                        { id: 'dodecagon', type: 'dodecagon', sides: 12, label: 'Dodecagon' }
                    ],
                    correctAnswer: 'octagon',
                    hint: 'Octagons have 8 sides.'
                },
                {
                    id: 'level-7-nonagon',
                    instruction: 'Identify the NONAGON: A polygon with 9 sides.',
                    shapes: [
                        { id: 'nonagon', type: 'nonagon', sides: 9, label: 'Nonagon' },
                        { id: 'decagon', type: 'decagon', sides: 10, label: 'Decagon' },
                        { id: 'hendecagon', type: 'hendecagon', sides: 11, label: 'Hendecagon' }
                    ],
                    correctAnswer: 'nonagon',
                    hint: 'Nonagons have 9 sides.'
                },
                {
                    id: 'level-8-decagon',
                    instruction: 'Identify the DECAGON: A polygon with 10 sides.',
                    shapes: [
                        { id: 'decagon', type: 'decagon', sides: 10, label: 'Decagon' },
                        { id: 'hendecagon', type: 'hendecagon', sides: 11, label: 'Hendecagon' },
                        { id: 'dodecagon', type: 'dodecagon', sides: 12, label: 'Dodecagon' }
                    ],
                    correctAnswer: 'decagon',
                    hint: 'Decagons have 10 sides.'
                },
                {
                    id: 'level-9-hendecagon',
                    instruction: 'Identify the HENDECAGON: A polygon with 11 sides.',
                    shapes: [
                        { id: 'hendecagon', type: 'hendecagon', sides: 11, label: 'Hendecagon' },
                        { id: 'dodecagon', type: 'dodecagon', sides: 12, label: 'Dodecagon' },
                        { id: 'triangle', type: 'triangle', sides: 3, label: 'Triangle' }
                    ],
                    correctAnswer: 'hendecagon',
                    hint: 'Hendecagons have 11 sides.'
                },
                {
                    id: 'level-10-dodecagon',
                    instruction: 'Identify the DODECAGON: A polygon with 12 sides.',
                    shapes: [
                        { id: 'dodecagon', type: 'dodecagon', sides: 12, label: 'Dodecagon' },
                        { id: 'triangle', type: 'triangle', sides: 3, label: 'Triangle' },
                        { id: 'square', type: 'square', sides: 4, label: 'Square' }
                    ],
                    correctAnswer: 'dodecagon',
                    hint: 'Dodecagons have 12 sides.'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER SEED DATA - ANGLES SANCTUARY
// ============================================================================

// Castle 2 Chapters - Angles Sanctuary Quest (Total: 600 XP)
// Distribution: 150 + 150 + 150 + 150 = 600 XP
const castle2Chapters = [
    {
        id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Chapter 1: The Hall of Rays',
        description: 'Enter the Angles Sanctuary where beams of light form geometric angles. Learn to name and measure angles, and identify acute, right, obtuse, straight, and reflex angles.',
        chapter_number: 1,
        xp_reward: 150
    },
    {
        id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Chapter 2: The Chamber of Construction',
        description: 'Master the art of constructing angles using a protractor. Draw angles of specific measures and identify congruent angles that share the same measurement.',
        chapter_number: 2,
        xp_reward: 150
    },
    {
        id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Chapter 3: The Angle Forge',
        description: 'Discover complementary angles (sum = 90°) and supplementary angles (sum = 180°). Solve for missing angle measures using angle relationships.',
        chapter_number: 3,
        xp_reward: 150
    },
    {
        id: 'd1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
        title: 'Chapter 4: The Temple of Solutions',
        description: 'Apply your angle mastery to solve real-world problems. Calculate missing angles in various scenarios and tackle word problems involving angle relationships.',
        chapter_number: 4,
        xp_reward: 150
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 1 - QUIZZES (The Hall of Rays)
// ============================================================================

const castle2Chapter1Quizzes = [
    {
        id: 'a1b2c3d4-5678-9abc-def0-123456789001',
        chapter_id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Angle Types & Measurement Quiz',
        description: 'Test your knowledge of angle types and measurement',
        xp_reward: 75,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'An angle that measures exactly 90° is called:',
                    options: ['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle'],
                    correctAnswer: 'Right angle',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'An angle that measures less than 90° is called:',
                    options: ['Acute angle', 'Right angle', 'Obtuse angle', 'Reflex angle'],
                    correctAnswer: 'Acute angle',
                    points: 20
                },
                {
                    id: 'q3',
                    question: 'An angle that measures between 90° and 180° is called:',
                    options: ['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle'],
                    correctAnswer: 'Obtuse angle',
                    points: 25
                },
                {
                    id: 'q4',
                    question: 'An angle that measures exactly 180° is called:',
                    options: ['Obtuse angle', 'Straight angle', 'Reflex angle', 'Complete angle'],
                    correctAnswer: 'Straight angle',
                    points: 20
                },
                {
                    id: 'q5',
                    question: 'What type of angle measures 45°?',
                    options: ['Acute', 'Right', 'Obtuse', 'Straight'],
                    correctAnswer: 'Acute',
                    points: 15,
                    hint: 'Less than 90°'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 1 - MINIGAMES (Angle Identifier)
// ============================================================================

const castle2Chapter1Minigames = [
    {
        id: 'b2c3d4e5-6789-abcd-ef01-234567890001',
        chapter_id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Angle Identifier',
        description: 'Measure angles using a protractor and classify them by type',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Look at the angle and identify what type it is!',
            rounds: [
                {
                    id: 'round1',
                    angleMeasure: 45,
                    angleType: 'acute',
                    hint: 'Think about how many degrees this angle has'
                },
                {
                    id: 'round2',
                    angleMeasure: 90,
                    angleType: 'right',
                    hint: 'Look carefully at the corner formed by these two rays'
                },
                {
                    id: 'round3',
                    angleMeasure: 135,
                    angleType: 'obtuse',
                    hint: 'Compare this angle to a right angle'
                },
                {
                    id: 'round4',
                    angleMeasure: 180,
                    angleType: 'straight',
                    hint: 'What do you notice about how the two rays are positioned?'
                },
                {
                    id: 'round5',
                    angleMeasure: 60,
                    angleType: 'acute',
                    hint: 'Is this angle smaller or larger than a right angle?'
                },
                {
                    id: 'round6',
                    angleMeasure: 120,
                    angleType: 'obtuse',
                    hint: 'Compare the size of this angle opening'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 2 - QUIZZES (The Chamber of Construction)
// ============================================================================

const castle2Chapter2Quizzes = [
    {
        id: 'c3d4e5f6-789a-bcde-f012-345678900002',
        chapter_id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Angle Construction & Congruence Quiz',
        description: 'Test your understanding of constructing and identifying congruent angles',
        xp_reward: 75,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Two angles are congruent if they have:',
                    options: ['The same measure', 'The same shape', 'Different measures', 'Different vertices'],
                    correctAnswer: 'The same measure',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'Which tool is used to measure and construct angles?',
                    options: ['Compass', 'Protractor', 'Ruler', 'Calculator'],
                    correctAnswer: 'Protractor',
                    points: 15
                },
                {
                    id: 'q3',
                    question: 'If ∠A = 65° and ∠B = 65°, what can we say about these angles?',
                    options: ['They are supplementary', 'They are complementary', 'They are congruent', 'They are perpendicular'],
                    correctAnswer: 'They are congruent',
                    points: 25
                },
                {
                    id: 'q4',
                    question: 'To construct a 45° angle, you would place your protractor and mark at:',
                    options: ['30°', '45°', '60°', '90°'],
                    correctAnswer: '45°',
                    points: 20
                },
                {
                    id: 'q5',
                    question: 'Which pair of angles are congruent?',
                    options: ['30° and 60°', '45° and 45°', '90° and 180°', '120° and 60°'],
                    correctAnswer: '45° and 45°',
                    points: 20
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 2 - MINIGAMES (Angle Constructor)
// ============================================================================

const castle2Chapter2Minigames = [
    {
        id: 'd4e5f6a7-89ab-cdef-0123-456789000002',
        chapter_id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Angle Constructor',
        description: 'Use the protractor to construct angles with specific measures',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Construct the angle by rotating the ray to the correct degree!',
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Construct a 30° angle',
                    targetAngle: 30,
                    tolerance: 3,
                    hint: 'Use the protractor to measure 30°'
                },
                {
                    id: 'mg2',
                    instruction: 'Construct a 60° angle',
                    targetAngle: 60,
                    tolerance: 3,
                    hint: 'Look for 60° on the protractor scale'
                },
                {
                    id: 'mg3',
                    instruction: 'Construct a 90° angle (right angle)',
                    targetAngle: 90,
                    tolerance: 2,
                    hint: 'A right angle is exactly 90°'
                },
                {
                    id: 'mg4',
                    instruction: 'Construct a 135° angle',
                    targetAngle: 135,
                    tolerance: 3,
                    hint: 'This is between 90° and 180°'
                },
                {
                    id: 'mg5',
                    instruction: 'Construct a 45° angle',
                    targetAngle: 45,
                    tolerance: 3,
                    hint: 'Exactly half of a right angle'
                },
                {
                    id: 'mg6',
                    instruction: 'Construct a 120° angle',
                    targetAngle: 120,
                    tolerance: 3,
                    hint: 'An obtuse angle measuring 120°'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 3 - QUIZZES (The Angle Forge)
// ============================================================================

const castle2Chapter3Quizzes = [
    {
        id: 'e5f6a7b8-9abc-def0-1234-567890000003',
        chapter_id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Complementary & Supplementary Angles Quiz',
        description: 'Test your understanding of angle relationships',
        xp_reward: 75,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Two angles are complementary if their sum equals:',
                    options: ['45°', '90°', '180°', '360°'],
                    correctAnswer: '90°',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'Two angles are supplementary if their sum equals:',
                    options: ['90°', '120°', '180°', '360°'],
                    correctAnswer: '180°',
                    points: 20
                },
                {
                    id: 'q3',
                    question: 'If one angle measures 35°, what is its complement?',
                    options: ['45°', '55°', '65°', '145°'],
                    correctAnswer: '55°',
                    points: 25,
                    hint: '90° - 35° = ?'
                },
                {
                    id: 'q4',
                    question: 'If one angle measures 120°, what is its supplement?',
                    options: ['30°', '60°', '90°', '180°'],
                    correctAnswer: '60°',
                    points: 25,
                    hint: '180° - 120° = ?'
                },
                {
                    id: 'q5',
                    question: 'Two angles measure 45° and 45°. What relationship do they have?',
                    options: ['Complementary', 'Supplementary', 'Both complementary and congruent', 'Neither'],
                    correctAnswer: 'Both complementary and congruent',
                    points: 10,
                    hint: '45° + 45° = 90° and they have equal measure'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 3 - MINIGAMES (Angle Forge Challenge)
// ============================================================================

const castle2Chapter3Minigames = [
    {
        id: 'f6a7b8c9-0def-1234-5678-900000000003',
        chapter_id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Angle Forge Challenge',
        description: 'Solve for missing angles using complementary and supplementary relationships',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Find the missing angle measure!',
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Find the complement of 25°',
                    givenAngle: 25,
                    relationship: 'complementary',
                    correctAnswer: 65,
                    hint: '90° - 25° = ?'
                },
                {
                    id: 'mg2',
                    instruction: 'Find the supplement of 110°',
                    givenAngle: 110,
                    relationship: 'supplementary',
                    correctAnswer: 70,
                    hint: '180° - 110° = ?'
                },
                {
                    id: 'mg3',
                    instruction: 'Find the complement of 42°',
                    givenAngle: 42,
                    relationship: 'complementary',
                    correctAnswer: 48,
                    hint: '90° - 42° = ?'
                },
                {
                    id: 'mg4',
                    instruction: 'Find the supplement of 75°',
                    givenAngle: 75,
                    relationship: 'supplementary',
                    correctAnswer: 105,
                    hint: '180° - 75° = ?'
                },
                {
                    id: 'mg5',
                    instruction: 'Find the complement of 60°',
                    givenAngle: 60,
                    relationship: 'complementary',
                    correctAnswer: 30,
                    hint: '90° - 60° = ?'
                },
                {
                    id: 'mg6',
                    instruction: 'Find the supplement of 135°',
                    givenAngle: 135,
                    relationship: 'supplementary',
                    correctAnswer: 45,
                    hint: '180° - 135° = ?'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 4 - QUIZZES (The Temple of Solutions)
// ============================================================================

const castle2Chapter4Quizzes = [
    {
        id: 'a2b3c4d5-6789-abcd-ef01-234567890004',
        chapter_id: 'd1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
        title: 'Angle Word Problems Quiz',
        description: 'Solve real-world problems involving angles',
        xp_reward: 75,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Two complementary angles are in the ratio 1:2. What are their measures?',
                    options: ['20° and 40°', '30° and 60°', '45° and 45°', '25° and 50°'],
                    correctAnswer: '30° and 60°',
                    points: 30,
                    hint: 'Let angles be x and 2x, then x + 2x = 90°'
                },
                {
                    id: 'q2',
                    question: 'The supplement of an angle is three times the angle. Find the angle.',
                    options: ['30°', '45°', '60°', '90°'],
                    correctAnswer: '45°',
                    points: 35,
                    hint: 'Let angle be x, then 180° - x = 3x'
                },
                {
                    id: 'q3',
                    question: 'An angle is 20° more than its complement. Find the angle.',
                    options: ['45°', '50°', '55°', '70°'],
                    correctAnswer: '55°',
                    points: 35,
                    hint: 'Let angle be x, then x = (90° - x) + 20°'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 4 - MINIGAMES (Problem Solver)
// ============================================================================

const castle2Chapter4Minigames = [
    {
        id: 'b3c4d5e6-789a-bcde-f012-345678900004',
        chapter_id: 'd1e2f3a4-5b6c-7d8e-9f0a-1b2c3d4e5f6a',
        title: 'Angle Problem Solver',
        description: 'Solve complex angle problems step by step',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Read each problem carefully and solve for the unknown angle!',
            questions: [
                {
                    id: 'mg1',
                    problem: 'Two angles are complementary. One angle is 35°. Find the other.',
                    correctAnswer: 55,
                    hint: 'Complementary angles sum to 90°'
                },
                {
                    id: 'mg2',
                    problem: 'Two angles are supplementary. One angle is 125°. Find the other.',
                    correctAnswer: 55,
                    hint: 'Supplementary angles sum to 180°'
                },
                {
                    id: 'mg3',
                    problem: 'An angle and its complement are equal. Find the angle.',
                    correctAnswer: 45,
                    hint: 'If both angles are equal and sum to 90°, each is 45°'
                },
                {
                    id: 'mg4',
                    problem: 'The supplement of an angle is twice the angle. Find the angle.',
                    correctAnswer: 60,
                    hint: 'Let x be the angle, then 180 - x = 2x'
                },
                {
                    id: 'mg5',
                    problem: 'Two supplementary angles differ by 40°. Find the smaller angle.',
                    correctAnswer: 70,
                    hint: 'Let angles be x and x+40, then x + (x+40) = 180'
                },
                {
                    id: 'mg6',
                    problem: 'Three angles form a straight line. Two angles are 65° and 45°. Find the third.',
                    correctAnswer: 70,
                    hint: 'Angles on a straight line sum to 180°'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER SEED DATA
// ============================================================================

// Castle 3 Chapters - Circle Sanctuary Quest
const castle3Chapters = [
    {
        id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        title: 'Chapter 1: The Tide of Shapes',
        description: 'Enter the Tidal Hall where glowing rings rise and fall like ripples on water. Identify the parts of a circle — center, radius, diameter, chord, arc, and sector.',
        chapter_number: 1,
        xp_reward: 250
    },
    {
        id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        title: 'Chapter 2: The Path of the Perimeter',
        description: 'Archim leads you to a massive circular gate made of ancient coral. Understand and compute the circumference of circles using C = 2πr and C = πd.',
        chapter_number: 2,
        xp_reward: 250
    },
    {
        id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        title: 'Chapter 3: The Chamber of Space',
        description: 'In the center of the sanctuary lies a circular pool glowing with starlight. Calculate the area of circles and recognize semi-circles and sectors using A = πr².',
        chapter_number: 3,
        xp_reward: 250
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER 1 - QUIZZES
// ============================================================================

// Castle 3 - Chapter 1 Quizzes (The Tide of Shapes)
const castle3Chapter1Quizzes = [
    {
        id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        chapter_id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        title: 'Parts of a Circle Quiz',
        description: 'Test your understanding of circle components',
        xp_reward: 50,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'What is the center of a circle?',
                    options: [
                        'The point equidistant from all points on the circle',
                        'A line passing through the circle',
                        'Half of the diameter',
                        'The edge of the circle'
                    ],
                    correctAnswer: 'The point equidistant from all points on the circle',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'Which part of a circle is a line segment from the center to any point on the circle?',
                    options: ['Radius', 'Diameter', 'Chord', 'Arc'],
                    correctAnswer: 'Radius',
                    points: 15
                },
                {
                    id: 'q3',
                    question: 'What is the relationship between diameter and radius?',
                    options: [
                        'Diameter = 2 × Radius',
                        'Diameter = Radius ÷ 2',
                        'Diameter = Radius',
                        'Diameter = Radius × 3'
                    ],
                    correctAnswer: 'Diameter = 2 × Radius',
                    points: 20
                },
                {
                    id: 'q4',
                    question: 'A chord is:',
                    options: [
                        'A line segment connecting two points on the circle',
                        'A line from center to edge',
                        'Half of a circle',
                        'The distance around the circle'
                    ],
                    correctAnswer: 'A line segment connecting two points on the circle',
                    points: 15
                },
                {
                    id: 'q5',
                    question: 'What is an arc?',
                    options: [
                        'A curved portion of the circle',
                        'A straight line through the circle',
                        'The center point',
                        'A radius doubled'
                    ],
                    correctAnswer: 'A curved portion of the circle',
                    points: 15
                },
                {
                    id: 'q6',
                    question: 'A sector is:',
                    options: [
                        'A pie-shaped region between two radii and an arc',
                        'A straight line',
                        'The same as a chord',
                        'Half of the diameter'
                    ],
                    correctAnswer: 'A pie-shaped region between two radii and an arc',
                    points: 15
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER 1 - MINIGAMES
// ============================================================================

// Castle 3 - Chapter 1 Minigames (Ripple Reveal)
const castle3Chapter1Minigames = [
    {
        id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        chapter_id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        title: 'Ripple Reveal',
        description: 'Identify circle parts as glowing rings rise and fall like water ripples',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Archim names a part - tap or drag the correct segment!',
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Find the CENTER of the circle',
                    partType: 'center',
                    correctAnswer: 'O',
                    hint: 'The center is the point equidistant from all points on the circle - usually labeled O'
                },
                {
                    id: 'mg2',
                    instruction: 'Find the RADIUS',
                    partType: 'radius',
                    correctAnswer: 'OA',
                    hint: 'A radius connects the center to any point on the circle'
                },
                {
                    id: 'mg3',
                    instruction: 'Find the DIAMETER',
                    partType: 'diameter',
                    correctAnswer: 'AB',
                    hint: 'The diameter passes through the center and connects two opposite points on the circle'
                },
                {
                    id: 'mg4',
                    instruction: 'Find a CHORD (not diameter)',
                    partType: 'chord',
                    correctAnswer: 'CD',
                    hint: 'A chord connects two points on the circle but does NOT pass through the center'
                },
                {
                    id: 'mg5',
                    instruction: 'Find an ARC',
                    partType: 'arc',
                    correctAnswer: 'arc-AB',
                    hint: 'An arc is a curved portion of the circle between two points'
                },
                {
                    id: 'mg6',
                    instruction: 'Find a SECTOR',
                    partType: 'sector',
                    correctAnswer: 'sector-OAB',
                    hint: 'A sector looks like a slice of pie - bounded by two radii and an arc'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER 2 - QUIZZES
// ============================================================================

// Castle 3 - Chapter 2 Quizzes (The Path of the Perimeter)
const castle3Chapter2Quizzes = [
    {
        id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        chapter_id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        title: 'Circumference Mastery Quiz',
        description: 'Calculate circumferences using C = 2πr and C = πd',
        xp_reward: 60,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'What is the formula for the circumference of a circle using radius?',
                    options: ['C = 2πr', 'C = πr²', 'C = πd', 'C = 2r'],
                    correctAnswer: 'C = 2πr',
                    points: 15
                },
                {
                    id: 'q2',
                    question: 'A circle has a radius of 5 cm. What is its circumference? (Use π = 3.14)',
                    options: ['31.4 cm', '15.7 cm', '78.5 cm', '10 cm'],
                    correctAnswer: '31.4 cm',
                    points: 25,
                    hint: 'C = 2πr = 2 × 3.14 × 5'
                },
                {
                    id: 'q3',
                    question: 'A circle has a diameter of 14 cm. What is its circumference? (Use π = 3.14)',
                    options: ['43.96 cm', '21.98 cm', '153.86 cm', '28 cm'],
                    correctAnswer: '43.96 cm',
                    points: 25,
                    hint: 'C = πd = 3.14 × 14'
                },
                {
                    id: 'q4',
                    question: 'If a circle has a radius of 7 cm, what is its diameter?',
                    options: ['14 cm', '7 cm', '3.5 cm', '21 cm'],
                    correctAnswer: '14 cm',
                    points: 15,
                    hint: 'Diameter = 2 × Radius'
                },
                {
                    id: 'q5',
                    question: 'Which formula uses diameter to find circumference?',
                    options: ['C = πd', 'C = 2πr', 'C = πr²', 'C = d²'],
                    correctAnswer: 'C = πd',
                    points: 20
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER 2 - MINIGAMES
// ============================================================================

const castle3Chapter2Minigames = [
    {
        id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        chapter_id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        title: 'The Coral Compass',
        description: 'Use circumference formulas to unlock ancient coral gates',
        game_type: 'interactive',
        xp_reward: 50,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Calculate the circumference to unlock each gate! (Use π = 3.14)',
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Find the circumference (radius = 5 cm)',
                    radius: 5,
                    correctAnswer: 31.4,
                    unit: 'cm',
                    hint: 'C = 2πr = 2 × 3.14 × 5'
                },
                {
                    id: 'mg2',
                    instruction: 'Find the circumference (diameter = 12 cm)',
                    diameter: 12,
                    correctAnswer: 37.68,
                    unit: 'cm',
                    hint: 'C = πd = 3.14 × 12'
                },
                {
                    id: 'mg3',
                    instruction: 'Find the circumference (radius = 7 cm)',
                    radius: 7,
                    correctAnswer: 43.96,
                    unit: 'cm',
                    hint: 'C = 2πr = 2 × 3.14 × 7'
                },
                {
                    id: 'mg4',
                    instruction: 'Find the circumference (diameter = 10 cm)',
                    diameter: 10,
                    correctAnswer: 31.4,
                    unit: 'cm',
                    hint: 'C = πd = 3.14 × 10'
                },
                {
                    id: 'mg5',
                    instruction: 'Find the circumference (radius = 3.5 cm)',
                    radius: 3.5,
                    correctAnswer: 21.98,
                    unit: 'cm',
                    hint: 'C = 2πr = 2 × 3.14 × 3.5'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER 3 - QUIZZES
// ============================================================================

// Castle 3 - Chapter 3 Quizzes (The Chamber of Space)
const castle3Chapter3Quizzes = [
    {
        id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
        chapter_id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        title: 'Circle Area Mastery Quiz',
        description: 'Calculate areas of circles, semi-circles, and sectors',
        xp_reward: 70,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'What is the formula for the area of a circle?',
                    options: ['A = πr²', 'A = 2πr', 'A = πd', 'A = r²'],
                    correctAnswer: 'A = πr²',
                    points: 15
                },
                {
                    id: 'q2',
                    question: 'Find the area of a circle with radius 7 cm (Use π = 3.14)',
                    options: ['153.86 cm²', '43.96 cm²', '49 cm²', '98 cm²'],
                    correctAnswer: '153.86 cm²',
                    points: 25,
                    hint: 'A = πr² = 3.14 × 7²'
                },
                {
                    id: 'q3',
                    question: 'A circle has a radius of 5 cm. What is its area? (Use π = 3.14)',
                    options: ['78.5 cm²', '31.4 cm²', '25 cm²', '15.7 cm²'],
                    correctAnswer: '78.5 cm²',
                    points: 25,
                    hint: 'A = πr² = 3.14 × 5²'
                },
                {
                    id: 'q4',
                    question: 'What is the area of a semi-circle with radius 4 cm? (Use π = 3.14)',
                    options: ['25.12 cm²', '50.24 cm²', '12.56 cm²', '16 cm²'],
                    correctAnswer: '25.12 cm²',
                    points: 30,
                    hint: 'Semi-circle area = (πr²) ÷ 2 = (3.14 × 16) ÷ 2'
                },
                {
                    id: 'q5',
                    question: 'Which of the following statements is true?',
                    options: [
                        'Diameter = twice the radius',
                        'Radius = twice the diameter',
                        'Circumference = radius × radius',
                        'None of the above'
                    ],
                    correctAnswer: 'Diameter = twice the radius',
                    points: 15
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 3 - CHAPTER 3 - MINIGAMES
// ============================================================================

const castle3Chapter3Minigames = [
    {
        id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
        chapter_id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        title: 'Lunar Pools',
        description: 'Calculate areas to fill the starlit circular pools',
        game_type: 'interactive',
        xp_reward: 60,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Calculate the area using A = πr² (Use π = 3.14)',
            questions: [
                {
                    id: 'mg1',
                    instruction: 'Find the area of this circle (radius = 5 cm)',
                    radius: 5,
                    correctAnswer: 78.5,
                    unit: 'cm²',
                    hint: 'A = πr² = 3.14 × 5²'
                },
                {
                    id: 'mg2',
                    instruction: 'Find the area of this circle (radius = 7 cm)',
                    radius: 7,
                    correctAnswer: 153.86,
                    unit: 'cm²',
                    hint: 'A = πr² = 3.14 × 7²'
                },
                {
                    id: 'mg3',
                    instruction: 'Find the area of this semi-circle (radius = 6 cm)',
                    radius: 6,
                    shape: 'semi-circle',
                    correctAnswer: 56.52,
                    unit: 'cm²',
                    hint: 'Semi-circle area = (πr²) ÷ 2 = (3.14 × 36) ÷ 2'
                },
                {
                    id: 'mg4',
                    instruction: 'Find the area of this circle (radius = 10 cm)',
                    radius: 10,
                    correctAnswer: 314,
                    unit: 'cm²',
                    hint: 'A = πr² = 3.14 × 10²'
                },
                {
                    id: 'mg5',
                    instruction: 'Find the area of this quarter-circle sector (radius = 8 cm)',
                    radius: 8,
                    shape: 'quarter-sector',
                    correctAnswer: 50.24,
                    unit: 'cm²',
                    hint: 'Quarter-circle area = (πr²) ÷ 4 = (3.14 × 64) ÷ 4'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER SEED DATA - POLYGON CITADEL
// ============================================================================

// Castle 4 Chapters - Polygon Citadel Quest (Total: 900 XP)
// Distribution: 200 + 225 + 225 + 250 = 900 XP
const castle4Chapters = [
    {
        id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        title: 'Chapter 1: The Gallery of Shapes',
        description: 'Enter the grand gallery where polygons float like art. Learn to identify different polygons by counting sides, and understand similar and congruent polygons.',
        chapter_number: 1,
        xp_reward: 200
    },
    {
        id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Chapter 2: The Drawing Chamber',
        description: 'Master the art of drawing polygons accurately. Practice creating triangles, quadrilaterals, pentagons, and other polygons with precision.',
        chapter_number: 2,
        xp_reward: 225
    },
    {
        id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        title: 'Chapter 3: The Hall of Angles',
        description: 'Discover the secret formula for interior angles: (n-2) × 180°. Calculate the sum of interior angles for any polygon and find individual angle measures in regular polygons.',
        chapter_number: 3,
        xp_reward: 225
    },
    {
        id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Chapter 4: The Measurement Vault',
        description: 'Apply your polygon knowledge to real-world challenges. Calculate perimeters and areas of rectangles, squares, triangles, parallelograms, and trapezoids. Solve word problems involving polygon measurements.',
        chapter_number: 4,
        xp_reward: 250
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 1 - QUIZZES (The Gallery of Shapes)
// ============================================================================

const castle4Chapter1Quizzes = [
    {
        id: 'a1b2c3d4-5678-9abc-def0-1234567890f1',
        chapter_id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        title: 'Polygon Identification Quiz',
        description: 'Test your knowledge of identifying and classifying polygons',
        xp_reward: 100,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'How many sides does a pentagon have?',
                    options: ['4 sides', '5 sides', '6 sides', '7 sides'],
                    correctAnswer: '5 sides',
                    points: 15
                },
                {
                    id: 'q2',
                    question: 'What is a polygon with 8 sides called?',
                    options: ['Hexagon', 'Heptagon', 'Octagon', 'Nonagon'],
                    correctAnswer: 'Octagon',
                    points: 15
                },
                {
                    id: 'q3',
                    question: 'Two polygons are congruent if they have:',
                    options: ['Same shape only', 'Same size only', 'Same shape and same size', 'Different shapes'],
                    correctAnswer: 'Same shape and same size',
                    points: 25
                },
                {
                    id: 'q4',
                    question: 'Two polygons are similar if they have:',
                    options: ['Same shape but different sizes', 'Different shapes', 'Same perimeter', 'Same area'],
                    correctAnswer: 'Same shape but different sizes',
                    points: 25
                },
                {
                    id: 'q5',
                    question: 'Which polygon has exactly 10 sides?',
                    options: ['Octagon', 'Nonagon', 'Decagon', 'Hendecagon'],
                    correctAnswer: 'Decagon',
                    points: 20
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 1 - MINIGAMES (Polygon Classifier)
// ============================================================================

const castle4Chapter1Minigames = [
    {
        id: 'b2c3d4e5-6789-abcd-ef01-2345678901f1',
        chapter_id: '4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        title: 'Polygon Classifier',
        description: 'Identify polygons by counting sides and determine if pairs are congruent or similar',
        game_type: 'interactive',
        xp_reward: 60,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Count the sides and classify each polygon!',
            rounds: [
                {
                    id: 'round1',
                    task: 'Identify the polygon',
                    sides: 3,
                    correctAnswer: 'triangle',
                    hint: '3 sides = triangle'
                },
                {
                    id: 'round2',
                    task: 'Identify the polygon',
                    sides: 6,
                    correctAnswer: 'hexagon',
                    hint: '6 sides = hexagon'
                },
                {
                    id: 'round3',
                    task: 'Are these triangles congruent?',
                    polygon1: { type: 'triangle', sides: [3, 4, 5] },
                    polygon2: { type: 'triangle', sides: [3, 4, 5] },
                    correctAnswer: 'yes',
                    hint: 'Same shape, same size = congruent'
                },
                {
                    id: 'round4',
                    task: 'Are these rectangles similar?',
                    polygon1: { type: 'rectangle', length: 4, width: 2 },
                    polygon2: { type: 'rectangle', length: 8, width: 4 },
                    correctAnswer: 'yes',
                    hint: 'Same shape (both rectangles), proportional sides = similar'
                },
                {
                    id: 'round5',
                    task: 'Identify the polygon',
                    sides: 9,
                    correctAnswer: 'nonagon',
                    hint: '9 sides = nonagon'
                },
                {
                    id: 'round6',
                    task: 'Identify the polygon',
                    sides: 12,
                    correctAnswer: 'dodecagon',
                    hint: '12 sides = dodecagon'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 2 - QUIZZES (The Drawing Chamber)
// ============================================================================

const castle4Chapter2Quizzes = [
    {
        id: 'c3d4e5f6-789a-bcde-f012-3456789012f2',
        chapter_id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Polygon Drawing Quiz',
        description: 'Test your understanding of polygon properties for accurate drawing',
        xp_reward: 115,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'To draw a regular pentagon, all sides must be:',
                    options: ['Different lengths', 'Equal length', 'Parallel', 'Perpendicular'],
                    correctAnswer: 'Equal length',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'Which tool is most useful for drawing accurate polygons?',
                    options: ['Only a pencil', 'Ruler and protractor', 'Compass only', 'Eraser'],
                    correctAnswer: 'Ruler and protractor',
                    points: 20
                },
                {
                    id: 'q3',
                    question: 'A quadrilateral MUST have:',
                    options: ['3 sides', '4 sides', '5 sides', 'All equal sides'],
                    correctAnswer: '4 sides',
                    points: 25
                },
                {
                    id: 'q4',
                    question: 'When drawing a regular hexagon, each interior angle measures:',
                    options: ['90°', '108°', '120°', '135°'],
                    correctAnswer: '120°',
                    points: 35,
                    hint: 'Sum of angles = 720°, divided by 6 sides'
                },
                {
                    id: 'q5',
                    question: 'Which statement about drawing polygons is TRUE?',
                    options: ['All polygons have curved sides', 'Polygons must be closed shapes', 'Polygons can have 2 sides', 'All polygons are regular'],
                    correctAnswer: 'Polygons must be closed shapes',
                    points: 15
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 2 - MINIGAMES (Polygon Sketch Master)
// ============================================================================

const castle4Chapter2Minigames = [
    {
        id: 'd4e5f6a7-89ab-cdef-0123-4567890123f2',
        chapter_id: '5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        title: 'Polygon Sketch Master',
        description: 'Draw polygons by connecting vertices in the correct order',
        game_type: 'interactive',
        xp_reward: 70,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Connect the dots to draw the polygon requested!',
            stages: [
                {
                    id: 'stage1',
                    instruction: 'Draw a triangle',
                    vertices: 3,
                    polygonType: 'triangle',
                    hint: 'Connect 3 points to form a triangle'
                },
                {
                    id: 'stage2',
                    instruction: 'Draw a quadrilateral',
                    vertices: 4,
                    polygonType: 'quadrilateral',
                    hint: 'Connect 4 points in order'
                },
                {
                    id: 'stage3',
                    instruction: 'Draw a pentagon',
                    vertices: 5,
                    polygonType: 'pentagon',
                    hint: 'Connect 5 points to form a 5-sided shape'
                },
                {
                    id: 'stage4',
                    instruction: 'Draw a hexagon',
                    vertices: 6,
                    polygonType: 'hexagon',
                    hint: 'Connect all 6 vertices'
                },
                {
                    id: 'stage5',
                    instruction: 'Draw an octagon',
                    vertices: 8,
                    polygonType: 'octagon',
                    hint: 'An 8-sided polygon'
                },
                {
                    id: 'stage6',
                    instruction: 'Draw a regular hexagon',
                    vertices: 6,
                    polygonType: 'regular-hexagon',
                    hint: 'All sides and angles must be equal'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 3 - QUIZZES (The Hall of Angles)
// ============================================================================

const castle4Chapter3Quizzes = [
    {
        id: 'e5f6a7b8-9abc-def0-1234-567890123f3',
        chapter_id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        title: 'Interior Angles of Polygons Quiz',
        description: 'Test your mastery of the interior angle formula (n-2) × 180°',
        xp_reward: 115,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'What is the formula for finding the sum of interior angles of a polygon?',
                    options: ['n × 180°', '(n-2) × 180°', '(n+2) × 180°', 'n × 90°'],
                    correctAnswer: '(n-2) × 180°',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'What is the sum of interior angles in a quadrilateral?',
                    options: ['180°', '270°', '360°', '540°'],
                    correctAnswer: '360°',
                    points: 25,
                    hint: '(4-2) × 180° = ?'
                },
                {
                    id: 'q3',
                    question: 'What is the sum of interior angles in a hexagon?',
                    options: ['540°', '720°', '900°', '1080°'],
                    correctAnswer: '720°',
                    points: 30,
                    hint: '(6-2) × 180° = ?'
                },
                {
                    id: 'q4',
                    question: 'Each interior angle of a regular pentagon measures:',
                    options: ['90°', '108°', '120°', '135°'],
                    correctAnswer: '108°',
                    points: 40,
                    hint: 'Sum = 540°, divide by 5 sides'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 3 - MINIGAMES (Angle Calculator)
// ============================================================================

const castle4Chapter3Minigames = [
    {
        id: 'f6a7b8c9-0abc-def1-2345-678901234f3',
        chapter_id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        title: 'Angle Calculator',
        description: 'Calculate the sum and individual measures of interior angles in polygons',
        game_type: 'interactive',
        xp_reward: 70,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Use the formula (n-2) × 180° to find interior angle sums!',
            challenges: [
                {
                    id: 'challenge1',
                    instruction: 'Find the sum of interior angles in a triangle',
                    sides: 3,
                    correctAnswer: 180,
                    hint: '(3-2) × 180° = 180°'
                },
                {
                    id: 'challenge2',
                    instruction: 'Find the sum of interior angles in a pentagon',
                    sides: 5,
                    correctAnswer: 540,
                    hint: '(5-2) × 180° = 540°'
                },
                {
                    id: 'challenge3',
                    instruction: 'Find each angle in a regular quadrilateral (square)',
                    sides: 4,
                    regular: true,
                    correctAnswer: 90,
                    hint: 'Sum = 360°, divide by 4'
                },
                {
                    id: 'challenge4',
                    instruction: 'Find the sum of interior angles in an octagon',
                    sides: 8,
                    correctAnswer: 1080,
                    hint: '(8-2) × 180° = ?'
                },
                {
                    id: 'challenge5',
                    instruction: 'Find each angle in a regular hexagon',
                    sides: 6,
                    regular: true,
                    correctAnswer: 120,
                    hint: 'Sum = 720°, divide by 6'
                },
                {
                    id: 'challenge6',
                    instruction: 'Find the sum of interior angles in a decagon',
                    sides: 10,
                    correctAnswer: 1440,
                    hint: '(10-2) × 180° = ?'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 4 - QUIZZES
// ============================================================================

const castle4Chapter4Quizzes = [
    {
        id: 'a7b8c9d0-1bcd-ef12-3456-789012345f4',
        chapter_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Perimeter and Area Mastery Quiz',
        description: 'Test your knowledge of polygon perimeter and area formulas',
        xp_reward: 125,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'What is the perimeter of a rectangle with length 8 cm and width 5 cm?',
                    options: ['13 cm', '26 cm', '40 cm', '65 cm'],
                    correctAnswer: '26 cm',
                    points: 25,
                    hint: 'Perimeter = 2(length + width)'
                },
                {
                    id: 'q2',
                    question: 'What is the area of a square with side length 7 cm?',
                    options: ['14 cm²', '28 cm²', '49 cm²', '56 cm²'],
                    correctAnswer: '49 cm²',
                    points: 25,
                    hint: 'Area = side × side'
                },
                {
                    id: 'q3',
                    question: 'What is the area of a triangle with base 10 cm and height 6 cm?',
                    options: ['16 cm²', '30 cm²', '60 cm²', '20 cm²'],
                    correctAnswer: '30 cm²',
                    points: 30,
                    hint: 'Area = ½ × base × height'
                },
                {
                    id: 'q4',
                    question: 'The area of a parallelogram with base 8 cm and height 4 cm is:',
                    options: ['12 cm²', '24 cm²', '32 cm²', '48 cm²'],
                    correctAnswer: '32 cm²',
                    points: 30,
                    hint: 'Area = base × height'
                },
                {
                    id: 'q5',
                    question: 'A trapezoid has parallel sides of 6 cm and 10 cm, and height 4 cm. What is its area?',
                    options: ['24 cm²', '32 cm²', '40 cm²', '64 cm²'],
                    correctAnswer: '32 cm²',
                    points: 15,
                    hint: 'Area = ½ × (sum of parallel sides) × height'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 4 - MINIGAMES (Measurement Master)
// ============================================================================

const castle4Chapter4Minigames = [
    {
        id: 'b8c9d0e1-2cde-f123-4567-890123456f4',
        chapter_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Measurement Master',
        description: 'Calculate perimeters and areas of various polygons',
        game_type: 'interactive',
        xp_reward: 85,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Apply the correct formula to find perimeter or area!',
            problems: [
                {
                    id: 'problem1',
                    instruction: 'Find the perimeter of a rectangle (length: 9 cm, width: 4 cm)',
                    shape: 'rectangle',
                    dimensions: { length: 9, width: 4 },
                    measurementType: 'perimeter',
                    correctAnswer: 26,
                    unit: 'cm',
                    hint: '2(9 + 4) = ?'
                },
                {
                    id: 'problem2',
                    instruction: 'Find the area of a square (side: 6 cm)',
                    shape: 'square',
                    dimensions: { side: 6 },
                    measurementType: 'area',
                    correctAnswer: 36,
                    unit: 'cm²',
                    hint: '6 × 6 = ?'
                },
                {
                    id: 'problem3',
                    instruction: 'Find the area of a triangle (base: 12 cm, height: 5 cm)',
                    shape: 'triangle',
                    dimensions: { base: 12, height: 5 },
                    measurementType: 'area',
                    correctAnswer: 30,
                    unit: 'cm²',
                    hint: '½ × 12 × 5 = ?'
                },
                {
                    id: 'problem4',
                    instruction: 'Find the area of a parallelogram (base: 7 cm, height: 6 cm)',
                    shape: 'parallelogram',
                    dimensions: { base: 7, height: 6 },
                    measurementType: 'area',
                    correctAnswer: 42,
                    unit: 'cm²',
                    hint: '7 × 6 = ?'
                },
                {
                    id: 'problem5',
                    instruction: 'Find the area of a trapezoid (bases: 5 cm and 9 cm, height: 4 cm)',
                    shape: 'trapezoid',
                    dimensions: { base1: 5, base2: 9, height: 4 },
                    measurementType: 'area',
                    correctAnswer: 28,
                    unit: 'cm²',
                    hint: '½ × (5 + 9) × 4 = ?'
                },
                {
                    id: 'problem6',
                    instruction: 'Word Problem: A rectangular garden is 15 m long and 8 m wide. What is its perimeter?',
                    shape: 'rectangle',
                    dimensions: { length: 15, width: 8 },
                    measurementType: 'perimeter',
                    correctAnswer: 46,
                    unit: 'm',
                    hint: '2(15 + 8) = ?'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER SEED DATA - ARCANE OBSERVATORY
// ============================================================================

// Castle 5 Chapters - Arcane Observatory Quest (Total: 1000 XP)
// Distribution: 200 + 250 + 250 + 300 = 1000 XP
const castle5Chapters = [
    {
        id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
        title: 'Floor 1: The Hall of Planes',
        description: 'Step into a room filled with floating outlines. Learn to identify plane and solid figures, and differentiate between 2D and 3D shapes.',
        chapter_number: 1,
        xp_reward: 200
    },
    {
        id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
        title: 'Floor 2: The Chamber of Perimeters',
        description: 'The chamber\'s walls form moving puzzles. Master perimeter and area of rectangles, squares, triangles, parallelograms, and trapezoids.',
        chapter_number: 2,
        xp_reward: 250
    },
    {
        id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
        title: 'Floor 3: The Sanctum of Surfaces',
        description: 'Inside the Sanctum, glowing 3D objects rotate slowly. Calculate surface area of cubes, prisms, pyramids, cylinders, cones, and spheres.',
        chapter_number: 3,
        xp_reward: 250
    },
    {
        id: '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
        title: 'Floor 4: The Core of Volumes',
        description: 'The Observatory\'s heart beats with geometric power. Master volume calculations of prisms, pyramids, cylinders, cones, and spheres.',
        chapter_number: 4,
        xp_reward: 300
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 1 - QUIZZES
// ============================================================================

const castle5Chapter1Quizzes = [
    {
        id: 'c9d0e1f2-3def-4567-89ab-cdef01234f51',
        chapter_id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
        title: 'Plane and Solid Figures Quiz',
        description: 'Test your ability to identify and differentiate between 2D and 3D shapes',
        xp_reward: 100,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Which of these is a plane figure?',
                    options: ['Cube', 'Triangle', 'Sphere', 'Cylinder'],
                    correctAnswer: 'Triangle',
                    points: 20
                },
                {
                    id: 'q2',
                    question: 'Which of these is a solid figure?',
                    options: ['Circle', 'Rectangle', 'Pyramid', 'Hexagon'],
                    correctAnswer: 'Pyramid',
                    points: 20
                },
                {
                    id: 'q3',
                    question: 'What is the main difference between 2D and 3D shapes?',
                    options: ['2D shapes have color', '3D shapes have depth/volume', '2D shapes are larger', '3D shapes have fewer sides'],
                    correctAnswer: '3D shapes have depth/volume',
                    points: 30
                },
                {
                    id: 'q4',
                    question: 'A prism is a type of:',
                    options: ['Plane figure', 'Solid figure', '2D shape', 'Line segment'],
                    correctAnswer: 'Solid figure',
                    points: 30
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 1 - MINIGAMES
// ============================================================================

const castle5Chapter1Minigames = [
    {
        id: 'd0e1f2a3-4ef0-5678-9abc-def012345f51',
        chapter_id: '8b9c0d1e-2f3a-4b5c-6d7e-8f9a0b1c2d3e',
        title: 'Shape Sorter',
        description: 'Drag shapes into the correct portals: Plane Figures or Solid Figures',
        game_type: 'interactive',
        xp_reward: 60,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Sort each shape into either "Plane Figures" or "Solid Figures" portal!',
            shapes: [
                { id: 'shape1', name: 'Square', type: 'plane', difficulty: 'easy' },
                { id: 'shape2', name: 'Cube', type: 'solid', difficulty: 'easy' },
                { id: 'shape3', name: 'Circle', type: 'plane', difficulty: 'easy' },
                { id: 'shape4', name: 'Sphere', type: 'solid', difficulty: 'easy' },
                { id: 'shape5', name: 'Trapezoid', type: 'plane', difficulty: 'medium' },
                { id: 'shape6', name: 'Rectangular Prism', type: 'solid', difficulty: 'medium' },
                { id: 'shape7', name: 'Pentagon', type: 'plane', difficulty: 'medium' },
                { id: 'shape8', name: 'Cone', type: 'solid', difficulty: 'hard' }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 2 - QUIZZES
// ============================================================================

const castle5Chapter2Quizzes = [
    {
        id: 'e1f2a3b4-5f01-6789-abcd-ef0123456f52',
        chapter_id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
        title: 'Perimeter and Area Mastery Quiz',
        description: 'Test your knowledge of perimeter and area calculations for various polygons',
        xp_reward: 125,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Find the perimeter of a rectangle with length 12 cm and width 8 cm.',
                    options: ['20 cm', '40 cm', '96 cm', '32 cm'],
                    correctAnswer: '40 cm',
                    points: 25,
                    hint: 'P = 2(l + w) = 2(12 + 8)'
                },
                {
                    id: 'q2',
                    question: 'Find the area of a square with side length 9 cm.',
                    options: ['18 cm²', '36 cm²', '81 cm²', '72 cm²'],
                    correctAnswer: '81 cm²',
                    points: 25,
                    hint: 'A = s² = 9²'
                },
                {
                    id: 'q3',
                    question: 'The area of a triangle with base 10 cm and height 6 cm is:',
                    options: ['30 cm²', '60 cm²', '16 cm²', '20 cm²'],
                    correctAnswer: '30 cm²',
                    points: 30,
                    hint: 'A = ½ × base × height'
                },
                {
                    id: 'q4',
                    question: 'A parallelogram has base 8 m and height 5 m. What is its area?',
                    options: ['13 m²', '26 m²', '40 m²', '80 m²'],
                    correctAnswer: '40 m²',
                    points: 40,
                    hint: 'A = base × height'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 2 - MINIGAMES
// ============================================================================

const castle5Chapter2Minigames = [
    {
        id: 'f2a3b4c5-6012-789a-bcde-f01234567f52',
        chapter_id: '9c0d1e2f-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
        title: 'Perimeter Gatekeeper',
        description: 'Calculate perimeters to unlock each gate toward the Tower Core',
        game_type: 'interactive',
        xp_reward: 85,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Measure and calculate the perimeter to open each magical gate!',
            gates: [
                {
                    id: 'gate1',
                    shapeType: 'rectangle',
                    length: 10,
                    width: 6,
                    correctPerimeter: 32,
                    unit: 'cm',
                    hint: 'P = 2(length + width)'
                },
                {
                    id: 'gate2',
                    shapeType: 'triangle',
                    sides: [5, 7, 8],
                    correctPerimeter: 20,
                    unit: 'cm',
                    hint: 'Add all three sides'
                },
                {
                    id: 'gate3',
                    shapeType: 'trapezoid',
                    sides: [6, 4, 8, 5],
                    correctPerimeter: 23,
                    unit: 'm',
                    hint: 'Add all four sides'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 3 - QUIZZES
// ============================================================================

const castle5Chapter3Quizzes = [
    {
        id: 'a3b4c5d6-7123-89ab-cdef-012345678f53',
        chapter_id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
        title: 'Surface Area Mastery Quiz',
        description: 'Test your knowledge of surface area calculations for 3D solids',
        xp_reward: 125,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Find the surface area of a cube with edge length 5 cm.',
                    options: ['25 cm²', '100 cm²', '125 cm²', '150 cm²'],
                    correctAnswer: '150 cm²',
                    points: 30,
                    hint: 'SA = 6s² = 6 × 5²'
                },
                {
                    id: 'q2',
                    question: 'The formula for surface area of a rectangular prism is:',
                    options: ['SA = lwh', 'SA = 2(lw + lh + wh)', 'SA = l + w + h', 'SA = πr²h'],
                    correctAnswer: 'SA = 2(lw + lh + wh)',
                    points: 30
                },
                {
                    id: 'q3',
                    question: 'A cylinder has radius 3 cm and height 8 cm. What is its surface area? (Use π = 3.14)',
                    options: ['150.72 cm²', '207.24 cm²', '75.36 cm²', '226.08 cm²'],
                    correctAnswer: '207.24 cm²',
                    points: 40,
                    hint: 'SA = 2πr² + 2πrh'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 3 - MINIGAMES
// ============================================================================

const castle5Chapter3Minigames = [
    {
        id: 'b4c5d6e7-8234-9abc-def0-123456789f53',
        chapter_id: '0d1e2f3a-4b5c-6d7e-8f9a-0b1c2d3e4f5a',
        title: 'Surface Sculptor',
        description: 'Rotate 3D solids and calculate their surface areas to restore their form',
        game_type: 'interactive',
        xp_reward: 85,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Calculate the surface area to solidify each 3D shape!',
            solids: [
                {
                    id: 'solid1',
                    type: 'cube',
                    edgeLength: 4,
                    correctSurfaceArea: 96,
                    unit: 'cm²',
                    formula: 'SA = 6s²'
                },
                {
                    id: 'solid2',
                    type: 'rectangular_prism',
                    dimensions: { length: 6, width: 4, height: 3 },
                    correctSurfaceArea: 108,
                    unit: 'cm²',
                    formula: 'SA = 2(lw + lh + wh)'
                },
                {
                    id: 'solid3',
                    type: 'cylinder',
                    radius: 5,
                    height: 10,
                    correctSurfaceArea: 471,
                    unit: 'cm²',
                    formula: 'SA = 2πr² + 2πrh (π = 3.14)'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 4 - QUIZZES
// ============================================================================

const castle5Chapter4Quizzes = [
    {
        id: 'c5d6e7f8-9345-abcd-ef01-234567890f54',
        chapter_id: '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
        title: 'Volume Mastery Quiz',
        description: 'Test your mastery of volume calculations for various 3D solids',
        xp_reward: 150,
        passing_score: 70,
        time_limit: null,
        quiz_config: {
            questions: [
                {
                    id: 'q1',
                    question: 'Find the volume of a rectangular prism with length 8 cm, width 5 cm, and height 4 cm.',
                    options: ['17 cm³', '160 cm³', '120 cm³', '200 cm³'],
                    correctAnswer: '160 cm³',
                    points: 30,
                    hint: 'V = l × w × h'
                },
                {
                    id: 'q2',
                    question: 'A cylinder has radius 6 cm and height 10 cm. What is its volume? (Use π = 3.14)',
                    options: ['376.8 cm³', '1130.4 cm³', '188.4 cm³', '753.6 cm³'],
                    correctAnswer: '1130.4 cm³',
                    points: 40,
                    hint: 'V = πr²h = 3.14 × 6² × 10'
                },
                {
                    id: 'q3',
                    question: 'The volume of a cone is:',
                    options: ['V = πr²h', 'V = ⅓πr²h', 'V = ⅔πr³', 'V = 2πrh'],
                    correctAnswer: 'V = ⅓πr²h',
                    points: 30
                },
                {
                    id: 'q4',
                    question: 'Find the volume of a sphere with radius 3 cm. (Use π = 3.14)',
                    options: ['28.26 cm³', '113.04 cm³', '37.68 cm³', '84.78 cm³'],
                    correctAnswer: '113.04 cm³',
                    points: 50,
                    hint: 'V = ⁴⁄₃πr³ = (4/3) × 3.14 × 3³'
                }
            ]
        }
    }
];

// ============================================================================
// CASTLE 5 - CHAPTER 4 - MINIGAMES
// ============================================================================

const castle5Chapter4Minigames = [
    {
        id: 'd6e7f8a9-0456-bcde-f012-345678901f54',
        chapter_id: '1e2f3a4b-5c6d-7e8f-9a0b-1c2d3e4f5a6b',
        title: 'Fill the Shape!',
        description: 'Calculate how much energy (volume) is needed to fill each 3D container',
        game_type: 'interactive',
        xp_reward: 100,
        time_limit: null,
        order_index: 1,
        game_config: {
            instructions: 'Calculate the volume to fill each Energy Sphere!',
            containers: [
                {
                    id: 'container1',
                    type: 'cube',
                    edgeLength: 7,
                    correctVolume: 343,
                    unit: 'cm³',
                    formula: 'V = s³'
                },
                {
                    id: 'container2',
                    type: 'cylinder',
                    radius: 4,
                    height: 10,
                    correctVolume: 502.4,
                    unit: 'cm³',
                    formula: 'V = πr²h (π = 3.14)'
                },
                {
                    id: 'container3',
                    type: 'cone',
                    radius: 5,
                    height: 12,
                    correctVolume: 314,
                    unit: 'cm³',
                    formula: 'V = ⅓πr²h (π = 3.14)'
                },
                {
                    id: 'container4',
                    type: 'sphere',
                    radius: 6,
                    correctVolume: 904.32,
                    unit: 'cm³',
                    formula: 'V = ⁴⁄₃πr³ (π = 3.14)'
                }
            ]
        }
    }
];

// ============================================================================
// FUTURE CASTLES & CHAPTERS - ADD HERE
// ============================================================================

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    // Castle 1
    castle1Chapters,
    castle1Chapter1Quizzes,
    castle1Chapter1Minigames,
    castle1Chapter2Quizzes,
    castle1Chapter2Minigames,
    castle1Chapter3Quizzes,
    castle1Chapter3Minigames,
    // Castle 2
    castle2Chapters,
    castle2Chapter1Quizzes,
    castle2Chapter1Minigames,
    castle2Chapter2Quizzes,
    castle2Chapter2Minigames,
    castle2Chapter3Quizzes,
    castle2Chapter3Minigames,
    castle2Chapter4Quizzes,
    castle2Chapter4Minigames,
    // Castle 3
    castle3Chapters,
    castle3Chapter1Quizzes,
    castle3Chapter1Minigames,
    castle3Chapter2Quizzes,
    castle3Chapter2Minigames,
    castle3Chapter3Quizzes,
    castle3Chapter3Minigames,
    // Castle 4
    castle4Chapters,
    castle4Chapter1Quizzes,
    castle4Chapter1Minigames,
    castle4Chapter2Quizzes,
    castle4Chapter2Minigames,
    castle4Chapter3Quizzes,
    castle4Chapter3Minigames,
    castle4Chapter4Quizzes,
    castle4Chapter4Minigames,
    // Castle 5
    castle5Chapters,
    castle5Chapter1Quizzes,
    castle5Chapter1Minigames,
    castle5Chapter2Quizzes,
    castle5Chapter2Minigames,
    castle5Chapter3Quizzes,
    castle5Chapter3Minigames,
    castle5Chapter4Quizzes,
    castle5Chapter4Minigames
};
