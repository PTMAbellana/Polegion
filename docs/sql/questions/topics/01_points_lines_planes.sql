-- =====================================================
-- TOPIC 1: POINTS, LINES, AND PLANES
-- Foundation of Geometry
-- =====================================================
-- This file contains questions about the basic building
-- blocks of geometry: points, lines, rays, segments, and planes.
-- =====================================================

\i ../base_geometry_questions.sql

-- ============= KNOWLEDGE RECALL QUESTIONS =============

-- Points
SELECT insert_geometry_question(
    'kr_pre_01',
    'Knowledge Recall',
    'Which of the following is a location with no size?',
    '["Line","Point","Ray","Plane"]'::jsonb,
    'Point',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_01',
    'Knowledge Recall',
    'A point in geometry represents',
    '["A location with no size","A line segment","A shape","An area"]'::jsonb,
    'A location with no size',
    'easy',
    'posttest',
    1
);

-- Lines
SELECT insert_geometry_question(
    'kr_pre_02',
    'Knowledge Recall',
    'A straight path that extends infinitely in both directions is called a',
    '["Line","Line Segment","Ray","Angle"]'::jsonb,
    'Line',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_02',
    'Knowledge Recall',
    'A line extends infinitely in how many directions?',
    '["One","Two","Three","None"]'::jsonb,
    'Two',
    'easy',
    'posttest',
    1
);

-- Line Segments
SELECT insert_geometry_question(
    'kr_pre_03',
    'Knowledge Recall',
    'A part of a line with two endpoints is called',
    '["Ray","Line","Line Segment","Plane"]'::jsonb,
    'Line Segment',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_03',
    'Knowledge Recall',
    'The part of a line between two points is a',
    '["Ray","Line Segment","Angle","Vertex"]'::jsonb,
    'Line Segment',
    'easy',
    'posttest',
    1
);

-- Rays
SELECT insert_geometry_question(
    'kr_pre_04',
    'Knowledge Recall',
    'A part of a line that has one endpoint and extends infinitely in one direction is',
    '["Line","Segment","Ray","Plane"]'::jsonb,
    'Ray',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_04',
    'Knowledge Recall',
    'Which has exactly one endpoint?',
    '["Line","Line Segment","Ray","Point"]'::jsonb,
    'Ray',
    'easy',
    'posttest',
    1
);

-- Planes
SELECT insert_geometry_question(
    'kr_pre_05',
    'Knowledge Recall',
    'A flat surface that extends infinitely in all directions is called',
    '["Point","Line","Plane","Segment"]'::jsonb,
    'Plane',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_05',
    'Knowledge Recall',
    'A plane is a surface that extends infinitely in how many directions?',
    '["One","Two","Three","All directions"]'::jsonb,
    'All directions',
    'medium',
    'posttest',
    1
);

-- ============= CONCEPT UNDERSTANDING QUESTIONS =============

SELECT insert_geometry_question(
    'cu_pre_01',
    'Concept Understanding',
    'Two points determine',
    '["A plane","A line","An angle","A circle"]'::jsonb,
    'A line',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_01',
    'Concept Understanding',
    'How many points determine a unique line?',
    '["One","Two","Three","Four"]'::jsonb,
    'Two',
    'medium',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'cu_pre_02',
    'Concept Understanding',
    'Parallel lines are lines that',
    '["Intersect at one point","Never intersect","Form right angles","Overlap completely"]'::jsonb,
    'Never intersect',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_02',
    'Concept Understanding',
    'Perpendicular lines form',
    '["Acute angles","Right angles","Obtuse angles","Parallel paths"]'::jsonb,
    'Right angles',
    'medium',
    'posttest',
    1
);

-- ============= PROCEDURAL SKILLS QUESTIONS =============

SELECT insert_geometry_question(
    'ps_pre_01',
    'Procedural Skills',
    'To draw a line segment, you need',
    '["One point","Two points","Three points","No points"]'::jsonb,
    'Two points',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_01',
    'Procedural Skills',
    'To name a line segment, you write',
    '["One letter","Two letters with endpoints","Three letters","The midpoint only"]'::jsonb,
    'Two letters with endpoints',
    'medium',
    'posttest',
    1
);

-- ============= ANALYTICAL THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'at_pre_01',
    'Analytical Thinking',
    'If three points are collinear, they',
    '["Form a triangle","Lie on the same line","Are equally spaced","Form a right angle"]'::jsonb,
    'Lie on the same line',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'at_post_01',
    'Analytical Thinking',
    'Two lines that intersect form how many angles?',
    '["2","3","4","5"]'::jsonb,
    '4',
    'medium',
    'posttest',
    1
);

-- ============= PROBLEM SOLVING QUESTIONS =============

SELECT insert_geometry_question(
    'pb_pre_01',
    'Problem Solving',
    'If line AB intersects line CD at point E, how many line segments are formed?',
    '["2","3","4","5"]'::jsonb,
    '4',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'pb_post_01',
    'Problem Solving',
    'Point M is the midpoint of segment AB. If AB = 10 cm, what is AM?',
    '["2.5 cm","5 cm","10 cm","20 cm"]'::jsonb,
    '5 cm',
    'medium',
    'posttest',
    1
);

-- ============= HIGHER ORDER THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'ho_pre_01',
    'Higher Order',
    'Why can we say that a line has no thickness?',
    '["Because it is invisible","Because it is a mathematical concept","Because it is very thin","Because it is curved"]'::jsonb,
    'Because it is a mathematical concept',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ho_post_01',
    'Higher Order',
    'In real life, we can draw a perfect geometric point. True or False?',
    '["True, with a sharp pencil","False, all drawings have some width","True, with a computer","False, points don\'t exist"]'::jsonb,
    'False, all drawings have some width',
    'hard',
    'posttest',
    1
);

-- =====================================================
-- END OF POINTS, LINES, AND PLANES QUESTIONS
-- =====================================================
