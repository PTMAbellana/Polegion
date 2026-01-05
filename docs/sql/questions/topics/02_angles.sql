-- =====================================================
-- TOPIC 2: ANGLES
-- Measurement and Types
-- =====================================================
-- This file contains questions about angles: their
-- definition, types, measurement, and relationships.
-- =====================================================

\i ../base_geometry_questions.sql

-- ============= KNOWLEDGE RECALL QUESTIONS =============

-- Angle Definition
SELECT insert_geometry_question(
    'kr_pre_08',
    'Knowledge Recall',
    'A figure formed by two rays with a common endpoint is',
    '["Segment","Ray","Angle","Line"]'::jsonb,
    'Angle',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_08',
    'Knowledge Recall',
    'An angle is formed by',
    '["Two line segments","Two rays with a common endpoint","Two parallel lines","Two points"]'::jsonb,
    'Two rays with a common endpoint',
    'easy',
    'posttest',
    1
);

-- Vertex
SELECT insert_geometry_question(
    'kr_pre_09',
    'Knowledge Recall',
    'The common endpoint of an angle is called the',
    '["Vertex","Arm","Side","Endpoint"]'::jsonb,
    'Vertex',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_13',
    'Knowledge Recall',
    'The measure of the "opening" of an angle refers to',
    '["Sides","Vertex","Degree","Length"]'::jsonb,
    'Degree',
    'medium',
    'posttest',
    1
);

-- Angle Types
SELECT insert_geometry_question(
    'kr_pre_06',
    'Knowledge Recall',
    'An angle less than 90 degrees is',
    '["Right","Acute","Obtuse","Straight"]'::jsonb,
    'Acute',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_06',
    'Knowledge Recall',
    'A 90-degree angle is called',
    '["Acute","Right","Obtuse","Straight"]'::jsonb,
    'Right',
    'easy',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'kr_pre_07',
    'Knowledge Recall',
    'An angle greater than 90 degrees but less than 180 degrees is',
    '["Acute","Right","Obtuse","Reflex"]'::jsonb,
    'Obtuse',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_07',
    'Knowledge Recall',
    'An angle of exactly 180 degrees is called',
    '["Right angle","Straight angle","Obtuse angle","Reflex angle"]'::jsonb,
    'Straight angle',
    'easy',
    'posttest',
    1
);

-- ============= CONCEPT UNDERSTANDING QUESTIONS =============

-- Complementary Angles
SELECT insert_geometry_question(
    'cu_pre_03',
    'Concept Understanding',
    'Two angles are complementary if their sum is',
    '["90°","180°","270°","360°"]'::jsonb,
    '90°',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_03',
    'Concept Understanding',
    'If one angle is 40°, its complement is',
    '["50°","40°","140°","320°"]'::jsonb,
    '50°',
    'medium',
    'posttest',
    1
);

-- Supplementary Angles
SELECT insert_geometry_question(
    'cu_pre_04',
    'Concept Understanding',
    'Two angles are supplementary if their sum is',
    '["90°","180°","270°","360°"]'::jsonb,
    '180°',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_04',
    'Concept Understanding',
    'If one angle measures 110°, its supplement measures',
    '["70°","110°","250°","290°"]'::jsonb,
    '70°',
    'medium',
    'posttest',
    1
);

-- Vertical Angles
SELECT insert_geometry_question(
    'cu_post_09',
    'Concept Understanding',
    'Opposite angles formed by intersecting lines are called',
    '["Adjacent angles","Complementary angles","Vertical angles","Linear pairs"]'::jsonb,
    'Vertical angles',
    'medium',
    'posttest',
    1
);

-- ============= PROCEDURAL SKILLS QUESTIONS =============

SELECT insert_geometry_question(
    'ps_pre_02',
    'Procedural Skills',
    'To measure an angle, you use a',
    '["Ruler","Compass","Protractor","Calculator"]'::jsonb,
    'Protractor',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_02',
    'Procedural Skills',
    'The center point of a protractor should be placed at',
    '["The ray","The vertex of the angle","The opposite side","Any point"]'::jsonb,
    'The vertex of the angle',
    'medium',
    'posttest',
    1
);

-- ============= ANALYTICAL THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'at_pre_02',
    'Analytical Thinking',
    'If two angles are vertical angles, they are',
    '["Equal","Complementary","Supplementary","Adjacent"]'::jsonb,
    'Equal',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'at_post_02',
    'Analytical Thinking',
    'If angle A and angle B are complementary, and angle A = 30°, what is angle B?',
    '["30°","60°","90°","150°"]'::jsonb,
    '60°',
    'medium',
    'posttest',
    1
);

-- ============= PROBLEM SOLVING QUESTIONS =============

SELECT insert_geometry_question(
    'pb_pre_02',
    'Problem Solving',
    'The sum of three angles around a point is 240°. What is the measure of the fourth angle?',
    '["60°","90°","120°","180°"]'::jsonb,
    '120°',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'pb_post_02',
    'Problem Solving',
    'Two supplementary angles are in the ratio 2:3. What is the measure of the smaller angle?',
    '["60°","72°","90°","108°"]'::jsonb,
    '72°',
    'hard',
    'posttest',
    1
);

-- ============= HIGHER ORDER THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'ho_pre_02',
    'Higher Order',
    'Can an angle be both acute and obtuse?',
    '["Yes, if it measures 90°","No, these are mutually exclusive","Yes, depending on orientation","Only in 3D geometry"]'::jsonb,
    'No, these are mutually exclusive',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ho_post_02',
    'Higher Order',
    'Why are vertical angles always equal?',
    '["They look the same","They share a common side","They are formed by the same pair of lines","Because geometry rules say so"]'::jsonb,
    'They are formed by the same pair of lines',
    'hard',
    'posttest',
    1
);

-- =====================================================
-- END OF ANGLES QUESTIONS
-- =====================================================
