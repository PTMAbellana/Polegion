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
// CASTLE 3 - CHAPTER SEED DATA
// ============================================================================

// Castle 3 Chapters - Circle Sanctuary Quest
const castle3Chapters = [
    {
        id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        title: 'Chapter 1: The Tide of Shapes',
        description: 'Enter the Tidal Hall where glowing rings rise and fall like ripples on water. Identify the parts of a circle — center, radius, diameter, chord, arc, and sector.',
        chapter_number: 1,
        xp_reward: 150
    },
    {
        id: '2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        title: 'Chapter 2: The Path of the Perimeter',
        description: 'Archim leads you to a massive circular gate made of ancient coral. Understand and compute the circumference of circles using C = 2πr and C = πd.',
        chapter_number: 2,
        xp_reward: 175
    },
    {
        id: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        title: 'Chapter 3: The Chamber of Space',
        description: 'In the center of the sanctuary lies a circular pool glowing with starlight. Calculate the area of circles and recognize semi-circles and sectors using A = πr².',
        chapter_number: 3,
        xp_reward: 200
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
    // Castle 2
    castle2Chapters,
    castle2Chapter1Quizzes,
    castle2Chapter1Minigames,
    castle2Chapter2Quizzes,
    castle2Chapter2Minigames,
    // Castle 3
    castle3Chapters,
    castle3Chapter1Quizzes,
    castle3Chapter1Minigames,
    castle3Chapter2Quizzes,
    castle3Chapter2Minigames,
    castle3Chapter3Quizzes,
    castle3Chapter3Minigames
};
