// ============================================================================
// CHAPTER SEED DATA
// ============================================================================
// Note: quiz_config and game_config objects have been removed from this file.
// The frontend uses constants from frontend/constants/chapters/ instead.
// This file only contains the database metadata (IDs, titles, XP rewards, etc.)
// ============================================================================

// Castle 1 Chapters
const castle1Chapters = [
    {
        id: '0847c3d5-3f86-4c1e-9b05-464270295cd8',
        title: 'Chapter 1: The Point of Origin',
        description: 'These are Points, the seeds of all geometry. Learn about points, lines, rays, and line segments.',
        chapter_number: 1,
        xp_reward: 100
    },
    {
        id: '69d21734-679b-45ea-9203-1dd15194e5cf',
        title: 'Chapter 2: Paths of Power',
        description: "Navigate the tower's magical floating bridges and master parallel, intersecting, and perpendicular lines.",
        chapter_number: 2,
        xp_reward: 150
    },
    {
        id: 'c9b7a976-d466-4831-aacf-f8e0476f5153',
        title: 'Chapter 3: Shapes of the Spire',
        description: 'Breathe life into geometric shapes! Identify and draw triangles, squares, rectangles, circles, and polygons.',
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        description: 'Enter the Polygon Citadel where beams of light form geometric angles. Learn to name and measure angles, and identify acute, right, obtuse, straight, and reflex angles.',
        chapter_number: 1,
        xp_reward: 150
    },
    {
        id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Chapter 2: The Point of Convergence',
        description: 'Discover how angles relate when lines intersect. Master vertical angles, linear pairs, and angles around a point to solve geometric puzzles.',
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
        time_limit: null
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 1 - MINIGAMES (Angle Constructor)
// ============================================================================

const castle2Chapter1Minigames = [
    {
        id: 'b2c3d4e5-6789-abcd-ef01-234567890001',
        chapter_id: 'f3a8b5c2-4d6e-7f8a-9b0c-1d2e3f4a5b6c',
        title: 'Angle Constructor',
        description: 'Construct angles by dragging the ray to match the target angle',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 2 - QUIZZES (The Chamber of Construction)
// ============================================================================

const castle2Chapter2Quizzes = [
    {
        id: 'c3d4e5f6-789a-bcde-f012-345678900002',
        chapter_id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Angle Relationships Quiz',
        description: 'Test your understanding of vertical angles, linear pairs, and angles around a point',
        xp_reward: 75,
        passing_score: 70,
        time_limit: null
    }
];

// ============================================================================
// CASTLE 2 - CHAPTER 2 - MINIGAMES (Angle Relationships)
// ============================================================================

const castle2Chapter2Minigames = [
    {
        id: 'd4e5f6a7-89ab-cdef-0123-456789000002',
        chapter_id: 'a7b8c9d0-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Angle Relationships Solver',
        description: 'Find missing angles using vertical angles, linear pairs, and angles around a point',
        game_type: 'interactive',
        xp_reward: 40,
        time_limit: null,
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 3 - QUIZZES (The Hall of Angles)
// ============================================================================

const castle4Chapter3Quizzes = [
    {
        id: 'e5f6a7b8-9abc-def0-1234-567890123f3a',
        chapter_id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        title: 'Interior Angles of Polygons Quiz',
        description: 'Test your mastery of the interior angle formula (n-2) × 180°',
        xp_reward: 115,
        passing_score: 70,
        time_limit: null
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 3 - MINIGAMES (Angle Calculator)
// ============================================================================

const castle4Chapter3Minigames = [
    {
        id: 'f6a7b8c9-0abc-def1-2345-678901234f3a',
        chapter_id: '6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        title: 'Angle Calculator',
        description: 'Calculate the sum and individual measures of interior angles in polygons',
        game_type: 'interactive',
        xp_reward: 70,
        time_limit: null,
        order_index: 1
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 4 - QUIZZES
// ============================================================================

const castle4Chapter4Quizzes = [
    {
        id: 'a7b8c9d0-1bcd-ef12-3456-789012345f4a',
        chapter_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Perimeter and Area Mastery Quiz',
        description: 'Test your knowledge of polygon perimeter and area formulas',
        xp_reward: 125,
        passing_score: 70,
        time_limit: null
    }
];

// ============================================================================
// CASTLE 4 - CHAPTER 4 - MINIGAMES (Measurement Master)
// ============================================================================

const castle4Chapter4Minigames = [
    {
        id: 'b8c9d0e1-2cde-f123-4567-890123456f4a',
        chapter_id: '7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d',
        title: 'Measurement Master',
        description: 'Calculate perimeters and areas of various polygons',
        game_type: 'interactive',
        xp_reward: 85,
        time_limit: null,
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
        time_limit: null
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
        order_index: 1
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
