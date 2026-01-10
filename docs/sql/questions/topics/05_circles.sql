-- =====================================================
-- TOPIC 5: CIRCLES
-- Curved Shapes and Their Properties
-- =====================================================
-- This file contains questions about circles: their parts,
-- measurements, and special properties.
-- =====================================================

\i ../base_geometry_questions.sql

-- ============= KNOWLEDGE RECALL QUESTIONS =============

-- Circle Parts - Center and Radius
SELECT insert_geometry_question(
    'kr_pre_19',
    'Knowledge Recall',
    'The distance from the center of a circle to any point on the circle is the',
    '["Diameter","Radius","Chord","Arc"]'::jsonb,
    'Radius',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_19',
    'Knowledge Recall',
    'The center of a circle is',
    '["On the circumference","Inside the circle","Outside the circle","On the diameter"]'::jsonb,
    'Inside the circle',
    'easy',
    'posttest',
    1
);

-- Diameter
SELECT insert_geometry_question(
    'kr_pre_20',
    'Knowledge Recall',
    'The diameter of a circle is',
    '["Half the radius","Equal to the radius","Twice the radius","The circumference"]'::jsonb,
    'Twice the radius',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_09',
    'Knowledge Recall',
    'The line passing through the center and touching two points on the circle is',
    '["Chord","Radius","Diameter","Arc"]'::jsonb,
    'Diameter',
    'easy',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'kr_post_10',
    'Knowledge Recall',
    'A chord that passes through the center is the',
    '["Radius","Diameter","Tangent","Secant"]'::jsonb,
    'Diameter',
    'easy',
    'posttest',
    1
);

-- Chord
SELECT insert_geometry_question(
    'kr_pre_21',
    'Knowledge Recall',
    'A line segment joining two points on a circle is called a',
    '["Radius","Diameter","Chord","Tangent"]'::jsonb,
    'Chord',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_20',
    'Knowledge Recall',
    'Which line touches the circle at exactly one point?',
    '["Chord","Diameter","Tangent","Radius"]'::jsonb,
    'Tangent',
    'medium',
    'posttest',
    1
);

-- Arc and Sector
SELECT insert_geometry_question(
    'kr_pre_22',
    'Knowledge Recall',
    'A part of the circumference of a circle is called',
    '["Chord","Arc","Radius","Sector"]'::jsonb,
    'Arc',
    'easy',
    'pretest',
    1
);

-- Circumference
SELECT insert_geometry_question(
    'kr_pre_23',
    'Knowledge Recall',
    'The perimeter of a circle is called',
    '["Area","Diameter","Circumference","Radius"]'::jsonb,
    'Circumference',
    'easy',
    'pretest',
    1
);

-- ============= CONCEPT UNDERSTANDING QUESTIONS =============

-- Tangent Properties
SELECT insert_geometry_question(
    'cu_post_06',
    'Concept Understanding',
    'Which best describes a tangent to a circle?',
    '["Passes through two points of the circle","Passes through the center","Touches the circle at exactly one point","Lies entirely inside the circle"]'::jsonb,
    'Touches the circle at exactly one point',
    'medium',
    'posttest',
    1
);

-- Radius and Diameter Relationship
SELECT insert_geometry_question(
    'cu_pre_10',
    'Concept Understanding',
    'If the radius of a circle is 7 cm, what is the diameter?',
    '["3.5 cm","7 cm","14 cm","21 cm"]'::jsonb,
    '14 cm',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_13',
    'Concept Understanding',
    'All radii of the same circle are',
    '["Different lengths","Equal","Parallel","Perpendicular"]'::jsonb,
    'Equal',
    'easy',
    'posttest',
    1
);

-- Circle Properties
SELECT insert_geometry_question(
    'cu_pre_11',
    'Concept Understanding',
    'A circle has',
    '["No sides","One curved side","Two sides","Infinite sides"]'::jsonb,
    'No sides',
    'medium',
    'pretest',
    1
);

-- ============= PROCEDURAL SKILLS QUESTIONS =============

-- Circumference Calculation
SELECT insert_geometry_question(
    'ps_pre_07',
    'Procedural Skills',
    'The circumference of a circle with radius r is',
    '["πr","2πr","πr²","2r"]'::jsonb,
    '2πr',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_07',
    'Procedural Skills',
    'If a circle has a radius of 5 cm, its circumference is approximately (use π ≈ 3.14)',
    '["15.7 cm","31.4 cm","78.5 cm","157 cm"]'::jsonb,
    '31.4 cm',
    'medium',
    'posttest',
    1
);

-- Area Calculation
SELECT insert_geometry_question(
    'ps_pre_08',
    'Procedural Skills',
    'The area of a circle with radius r is',
    '["2πr","πr²","2πr²","r²"]'::jsonb,
    'πr²',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_08',
    'Procedural Skills',
    'The area of a circle with radius 4 cm is approximately (use π ≈ 3.14)',
    '["12.56 cm²","25.12 cm²","50.24 cm²","100.48 cm²"]'::jsonb,
    '50.24 cm²',
    'medium',
    'posttest',
    1
);

-- ============= ANALYTICAL THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'at_pre_05',
    'Analytical Thinking',
    'If you double the radius of a circle, what happens to its area?',
    '["Doubles","Triples","Quadruples","Stays the same"]'::jsonb,
    'Quadruples',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'at_post_05',
    'Analytical Thinking',
    'Two circles have radii of 3 cm and 6 cm. How do their circumferences compare?',
    '["They are equal","The larger is twice as big","The larger is three times as big","The larger is four times as big"]'::jsonb,
    'The larger is twice as big',
    'medium',
    'posttest',
    1
);

-- ============= PROBLEM SOLVING QUESTIONS =============

SELECT insert_geometry_question(
    'pb_pre_05',
    'Problem Solving',
    'A circular garden has a diameter of 10 m. What is its area? (use π ≈ 3.14)',
    '["31.4 m²","78.5 m²","157 m²","314 m²"]'::jsonb,
    '78.5 m²',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'pb_post_05',
    'Problem Solving',
    'A wheel has a circumference of 62.8 cm. What is its radius? (use π ≈ 3.14)',
    '["5 cm","10 cm","20 cm","31.4 cm"]'::jsonb,
    '10 cm',
    'hard',
    'posttest',
    1
);

-- ============= HIGHER ORDER THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'ho_pre_05',
    'Higher Order',
    'Why is π (pi) considered an irrational number?',
    '["It is very large","It cannot be expressed as a fraction","It changes value","It is negative"]'::jsonb,
    'It cannot be expressed as a fraction',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ho_post_05',
    'Higher Order',
    'A tangent line to a circle is always perpendicular to',
    '["Another tangent","A chord","The radius at the point of contact","The diameter"]'::jsonb,
    'The radius at the point of contact',
    'hard',
    'posttest',
    1
);

-- =====================================================
-- END OF CIRCLES QUESTIONS
-- =====================================================
