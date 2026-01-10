-- =====================================================
-- TOPIC 4: TRIANGLES
-- Special Properties and Theorems
-- =====================================================
-- This file contains questions about triangles: their
-- classification, properties, theorems, and special types.
-- =====================================================

\i ../base_geometry_questions.sql

-- ============= KNOWLEDGE RECALL QUESTIONS =============

-- Triangle Types by Sides
SELECT insert_geometry_question(
    'kr_pre_14',
    'Knowledge Recall',
    'A triangle with all three sides equal is called',
    '["Scalene","Isosceles","Equilateral","Right"]'::jsonb,
    'Equilateral',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_18',
    'Knowledge Recall',
    'A triangle with exactly two equal sides is',
    '["Scalene","Isosceles","Equilateral","Right"]'::jsonb,
    'Isosceles',
    'easy',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'kr_pre_15',
    'Knowledge Recall',
    'A triangle with no equal sides is',
    '["Isosceles","Equilateral","Scalene","Right"]'::jsonb,
    'Scalene',
    'easy',
    'pretest',
    1
);

-- Triangle Types by Angles
SELECT insert_geometry_question(
    'kr_pre_16',
    'Knowledge Recall',
    'A triangle with one angle of 90° is called',
    '["Acute","Obtuse","Right","Equilateral"]'::jsonb,
    'Right',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_08',
    'Concept Understanding',
    'A right triangle must have',
    '["One 90° angle","One obtuse angle","All angles equal","No equal angles"]'::jsonb,
    'One 90° angle',
    'easy',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'kr_pre_17',
    'Knowledge Recall',
    'A triangle with one angle greater than 90° is',
    '["Acute","Right","Obtuse","Scalene"]'::jsonb,
    'Obtuse',
    'easy',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_pre_18',
    'Knowledge Recall',
    'A triangle with all angles less than 90° is',
    '["Acute","Right","Obtuse","Equilateral"]'::jsonb,
    'Acute',
    'easy',
    'pretest',
    1
);

-- ============= CONCEPT UNDERSTANDING QUESTIONS =============

-- Angle Sum
SELECT insert_geometry_question(
    'cu_pre_07',
    'Concept Understanding',
    'In a right triangle, the sum of the two acute angles is',
    '["45°","90°","180°","270°"]'::jsonb,
    '90°',
    'medium',
    'pretest',
    1
);

-- Triangle Inequality
SELECT insert_geometry_question(
    'cu_pre_08',
    'Concept Understanding',
    'For a triangle with sides 3, 4, and 5, which is true?',
    '["It is equilateral","It is a right triangle","It is obtuse","It cannot exist"]'::jsonb,
    'It is a right triangle',
    'medium',
    'pretest',
    1
);

-- Pythagorean Theorem
SELECT insert_geometry_question(
    'cu_pre_09',
    'Concept Understanding',
    'The Pythagorean theorem applies to',
    '["All triangles","Right triangles only","Isosceles triangles only","Equilateral triangles only"]'::jsonb,
    'Right triangles only',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_11',
    'Concept Understanding',
    'In a right triangle, the longest side is called',
    '["Base","Height","Hypotenuse","Leg"]'::jsonb,
    'Hypotenuse',
    'medium',
    'posttest',
    1
);

-- Triangle Properties
SELECT insert_geometry_question(
    'cu_post_12',
    'Concept Understanding',
    'An exterior angle of a triangle equals',
    '["One interior angle","Sum of opposite interior angles","180° minus interior angle","Half the interior angle"]'::jsonb,
    'Sum of opposite interior angles',
    'hard',
    'posttest',
    1
);

-- ============= PROCEDURAL SKILLS QUESTIONS =============

-- Area Calculation
SELECT insert_geometry_question(
    'ps_pre_05',
    'Procedural Skills',
    'The area of a triangle is calculated using',
    '["Base × Height","½ × Base × Height","Base + Height","Perimeter ÷ 2"]'::jsonb,
    '½ × Base × Height',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_05',
    'Procedural Skills',
    'A triangle has base 10 cm and height 6 cm. Its area is',
    '["16 cm²","30 cm²","60 cm²","120 cm²"]'::jsonb,
    '30 cm²',
    'medium',
    'posttest',
    1
);

-- Pythagorean Application
SELECT insert_geometry_question(
    'ps_pre_06',
    'Procedural Skills',
    'In a right triangle with legs 3 and 4, the hypotenuse is',
    '["5","6","7","12"]'::jsonb,
    '5',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_06',
    'Procedural Skills',
    'Using the Pythagorean theorem, if a = 6 and b = 8, then c =',
    '["10","14","48","100"]'::jsonb,
    '10',
    'medium',
    'posttest',
    1
);

-- ============= ANALYTICAL THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'at_pre_04',
    'Analytical Thinking',
    'Can a triangle have two obtuse angles?',
    '["Yes","No","Only if equilateral","Only if isosceles"]'::jsonb,
    'No',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'at_post_04',
    'Analytical Thinking',
    'In an isosceles triangle, if one angle is 40°, what are the other two angles?',
    '["70°, 70°","40°, 100°","50°, 90°","Cannot determine"]'::jsonb,
    'Cannot determine',
    'hard',
    'posttest',
    1
);

-- ============= PROBLEM SOLVING QUESTIONS =============

SELECT insert_geometry_question(
    'pb_pre_04',
    'Problem Solving',
    'If two angles of a triangle are 60° and 80°, what is the third angle?',
    '["20°","40°","60°","140°"]'::jsonb,
    '40°',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'pb_post_04',
    'Problem Solving',
    'An equilateral triangle has a perimeter of 30 cm. What is the length of each side?',
    '["5 cm","10 cm","15 cm","30 cm"]'::jsonb,
    '10 cm',
    'medium',
    'posttest',
    1
);

-- ============= HIGHER ORDER THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'ho_pre_04',
    'Higher Order',
    'Why must the sum of any two sides of a triangle be greater than the third side?',
    '["Because triangles are rigid","It is a mathematical law","The shortest distance is a straight line","All shapes follow this rule"]'::jsonb,
    'The shortest distance is a straight line',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ho_post_04',
    'Higher Order',
    'Can you have a triangle with sides 2, 3, and 6 cm?',
    '["Yes","No, violates triangle inequality","Only if it is right-angled","Only if it is obtuse"]'::jsonb,
    'No, violates triangle inequality',
    'hard',
    'posttest',
    1
);

-- =====================================================
-- END OF TRIANGLES QUESTIONS
-- =====================================================
