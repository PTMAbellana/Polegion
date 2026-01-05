-- =====================================================
-- TOPIC 3: POLYGONS
-- 2D Closed Shapes
-- =====================================================
-- This file contains questions about polygons: their
-- definition, types, properties, perimeter, and area.
-- =====================================================

\i ../base_geometry_questions.sql

-- ============= KNOWLEDGE RECALL QUESTIONS =============

-- Polygon Definition
SELECT insert_geometry_question(
    'kr_pre_11',
    'Knowledge Recall',
    'A closed figure made up of line segments is called a',
    '["Circle","Polygon","Angle","Arc"]'::jsonb,
    'Polygon',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_14',
    'Knowledge Recall',
    'A 5-sided polygon is called',
    '["Pentagram","Pentagon","Hexagon","Septagon"]'::jsonb,
    'Pentagon',
    'easy',
    'posttest',
    1
);

-- Triangle
SELECT insert_geometry_question(
    'kr_pre_10',
    'Knowledge Recall',
    'A triangle has how many sides?',
    '["2","3","4","5"]'::jsonb,
    '3',
    'easy',
    'pretest',
    1
);

-- Quadrilaterals
SELECT insert_geometry_question(
    'kr_pre_12',
    'Knowledge Recall',
    'A four-sided polygon is called a',
    '["Triangle","Quadrilateral","Pentagon","Hexagon"]'::jsonb,
    'Quadrilateral',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_pre_13',
    'Knowledge Recall',
    'A quadrilateral with all sides equal and all angles 90° is a',
    '["Rectangle","Rhombus","Square","Parallelogram"]'::jsonb,
    'Square',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_17',
    'Knowledge Recall',
    'A parallelogram has opposite sides that are',
    '["Equal and parallel","Equal only","Parallel only","Perpendicular"]'::jsonb,
    'Equal and parallel',
    'medium',
    'posttest',
    1
);

-- Regular Polygons
SELECT insert_geometry_question(
    'cu_post_10',
    'Concept Understanding',
    'A regular hexagon has',
    '["3 congruent sides","4 congruent sides","5 congruent sides","6 congruent sides"]'::jsonb,
    '6 congruent sides',
    'easy',
    'posttest',
    1
);

-- ============= CONCEPT UNDERSTANDING QUESTIONS =============

-- Congruence
SELECT insert_geometry_question(
    'cu_post_05',
    'Concept Understanding',
    'Two polygons are congruent if',
    '["They have the same number of sides only","They have equal corresponding sides and angles","One is rotated","They have curved boundaries"]'::jsonb,
    'They have equal corresponding sides and angles',
    'medium',
    'posttest',
    1
);

-- Interior Angles
SELECT insert_geometry_question(
    'cu_pre_05',
    'Concept Understanding',
    'The sum of the interior angles of a triangle is',
    '["90°","180°","270°","360°"]'::jsonb,
    '180°',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_07',
    'Concept Understanding',
    'The sum of interior angles of a pentagon is',
    '["360°","540°","720°","900°"]'::jsonb,
    '540°',
    'hard',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'cu_pre_06',
    'Concept Understanding',
    'The sum of the interior angles of a quadrilateral is',
    '["180°","360°","540°","720°"]'::jsonb,
    '360°',
    'medium',
    'pretest',
    1
);

-- ============= PROCEDURAL SKILLS QUESTIONS =============

-- Perimeter
SELECT insert_geometry_question(
    'ps_pre_03',
    'Procedural Skills',
    'The perimeter of a square with side 5 cm is',
    '["10 cm","15 cm","20 cm","25 cm"]'::jsonb,
    '20 cm',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_03',
    'Procedural Skills',
    'A rectangle has length 8 cm and width 3 cm. Its perimeter is',
    '["11 cm","22 cm","24 cm","32 cm"]'::jsonb,
    '22 cm',
    'medium',
    'posttest',
    1
);

-- Area
SELECT insert_geometry_question(
    'ps_pre_04',
    'Procedural Skills',
    'The area of a rectangle is found by',
    '["Adding length and width","Multiplying length and width","Adding all sides","Squaring the length"]'::jsonb,
    'Multiplying length and width',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_04',
    'Procedural Skills',
    'A square has side length 6 cm. Its area is',
    '["12 cm²","24 cm²","36 cm²","42 cm²"]'::jsonb,
    '36 cm²',
    'medium',
    'posttest',
    1
);

-- ============= ANALYTICAL THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'at_pre_03',
    'Analytical Thinking',
    'Which property is true for all rectangles?',
    '["All sides are equal","Opposite sides are equal","All angles are acute","Diagonals are perpendicular"]'::jsonb,
    'Opposite sides are equal',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'at_post_03',
    'Analytical Thinking',
    'If a quadrilateral has four right angles, it must be a',
    '["Square only","Rectangle or square","Rhombus","Trapezoid"]'::jsonb,
    'Rectangle or square',
    'hard',
    'posttest',
    1
);

-- ============= PROBLEM SOLVING QUESTIONS =============

SELECT insert_geometry_question(
    'pb_pre_03',
    'Problem Solving',
    'A regular pentagon has one angle measuring 108°. What is the sum of all its angles?',
    '["360°","450°","540°","720°"]'::jsonb,
    '540°',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'pb_post_03',
    'Problem Solving',
    'A rectangular garden is 12m long and 8m wide. How much fencing is needed to enclose it?',
    '["20m","32m","40m","96m"]'::jsonb,
    '40m',
    'medium',
    'posttest',
    1
);

-- ============= HIGHER ORDER THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'ho_pre_03',
    'Higher Order',
    'Can a polygon have curved sides?',
    '["Yes, circles are polygons","No, polygons must have straight sides","Yes, if they are irregular","Only in 3D"]'::jsonb,
    'No, polygons must have straight sides',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ho_post_03',
    'Higher Order',
    'Why is a square also considered a rectangle?',
    '["They both have 4 sides","A square has all the properties of a rectangle","They look similar","Because math rules say so"]'::jsonb,
    'A square has all the properties of a rectangle',
    'hard',
    'posttest',
    1
);

-- =====================================================
-- END OF POLYGONS QUESTIONS
-- =====================================================
