-- =====================================================
-- TOPIC 6: 3D SHAPES (SOLID FIGURES)
-- Three-Dimensional Geometry
-- =====================================================
-- This file contains questions about 3D shapes: prisms,
-- pyramids, cylinders, cones, spheres, and their properties.
-- =====================================================

\i ../base_geometry_questions.sql

-- ============= KNOWLEDGE RECALL QUESTIONS =============

-- Polyhedra
SELECT insert_geometry_question(
    'kr_post_11',
    'Knowledge Recall',
    'A polyhedron with one base and triangular faces is a',
    '["Prism","Pyramid","Cylinder","Sphere"]'::jsonb,
    'Pyramid',
    'medium',
    'posttest',
    1
);

-- Cylinder
SELECT insert_geometry_question(
    'kr_post_12',
    'Knowledge Recall',
    'A solid figure with two circular congruent bases is a',
    '["Cone","Sphere","Cylinder","Pyramid"]'::jsonb,
    'Cylinder',
    'medium',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'cu_post_11',
    'Concept Understanding',
    'A cylinder has',
    '["One base","Two circular congruent bases","Four faces","No curved surface"]'::jsonb,
    'Two circular congruent bases',
    'easy',
    'posttest',
    1
);

-- Cube
SELECT insert_geometry_question(
    'kr_post_15',
    'Knowledge Recall',
    'How many faces does a cube have?',
    '["4","6","8","12"]'::jsonb,
    '6',
    'medium',
    'posttest',
    1
);

SELECT insert_geometry_question(
    'kr_post_16',
    'Knowledge Recall',
    'A cube has how many edges?',
    '["6","8","12","16"]'::jsonb,
    '12',
    'medium',
    'posttest',
    1
);

-- Prisms
SELECT insert_geometry_question(
    'kr_pre_24',
    'Knowledge Recall',
    'A prism has bases that are',
    '["Circles","Congruent polygons","Triangles only","Different shapes"]'::jsonb,
    'Congruent polygons',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'kr_post_21',
    'Knowledge Recall',
    'A rectangular prism has how many vertices?',
    '["4","6","8","12"]'::jsonb,
    '8',
    'medium',
    'posttest',
    1
);

-- Pyramids
SELECT insert_geometry_question(
    'kr_pre_25',
    'Knowledge Recall',
    'The base of a pyramid can be any',
    '["Circle","Polygon","Triangle only","Curved shape"]'::jsonb,
    'Polygon',
    'medium',
    'pretest',
    1
);

-- Cone
SELECT insert_geometry_question(
    'kr_pre_26',
    'Knowledge Recall',
    'A cone has how many bases?',
    '["0","1","2","3"]'::jsonb,
    '1',
    'easy',
    'pretest',
    1
);

-- Sphere
SELECT insert_geometry_question(
    'kr_pre_27',
    'Knowledge Recall',
    'A sphere has',
    '["No flat surfaces","One flat surface","Two flat surfaces","Many flat surfaces"]'::jsonb,
    'No flat surfaces',
    'easy',
    'pretest',
    1
);

-- ============= CONCEPT UNDERSTANDING QUESTIONS =============

-- Faces, Edges, Vertices
SELECT insert_geometry_question(
    'cu_pre_12',
    'Concept Understanding',
    'A rectangular prism has',
    '["4 faces","6 faces","8 faces","12 faces"]'::jsonb,
    '6 faces',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_14',
    'Concept Understanding',
    'Euler\'s formula for polyhedra states that F + V - E equals',
    '["0","1","2","3"]'::jsonb,
    '2',
    'hard',
    'posttest',
    1
);

-- Volume Concepts
SELECT insert_geometry_question(
    'cu_pre_13',
    'Concept Understanding',
    'The volume of a cube with side length s is',
    '["s²","s³","6s²","4s³"]'::jsonb,
    's³',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'cu_post_15',
    'Concept Understanding',
    'A sphere is the set of all points',
    '["On a flat surface","Equidistant from a center point","On a curved line","Inside a circle"]'::jsonb,
    'Equidistant from a center point',
    'medium',
    'posttest',
    1
);

-- ============= PROCEDURAL SKILLS QUESTIONS =============

-- Volume Calculations
SELECT insert_geometry_question(
    'ps_pre_09',
    'Procedural Skills',
    'The volume of a rectangular prism is found by',
    '["Adding length, width, and height","Multiplying length × width × height","Squaring the base","Adding all faces"]'::jsonb,
    'Multiplying length × width × height',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_09',
    'Procedural Skills',
    'A cube has side length 5 cm. Its volume is',
    '["25 cm³","75 cm³","125 cm³","150 cm³"]'::jsonb,
    '125 cm³',
    'medium',
    'posttest',
    1
);

-- Surface Area
SELECT insert_geometry_question(
    'ps_pre_10',
    'Procedural Skills',
    'The surface area of a cube with side s is',
    '["4s²","6s²","s³","12s"]'::jsonb,
    '6s²',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ps_post_10',
    'Procedural Skills',
    'A rectangular prism has length 4, width 3, and height 2. Its volume is',
    '["9 cm³","12 cm³","24 cm³","48 cm³"]'::jsonb,
    '24 cm³',
    'medium',
    'posttest',
    1
);

-- ============= ANALYTICAL THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'at_pre_06',
    'Analytical Thinking',
    'If you double all dimensions of a cube, its volume',
    '["Doubles","Quadruples","Increases 6 times","Increases 8 times"]'::jsonb,
    'Increases 8 times',
    'hard',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'at_post_06',
    'Analytical Thinking',
    'A pyramid and a prism have the same base and height. How do their volumes compare?',
    '["They are equal","Pyramid is 1/3 of prism","Pyramid is 1/2 of prism","Pyramid is 2/3 of prism"]'::jsonb,
    'Pyramid is 1/3 of prism',
    'hard',
    'posttest',
    1
);

-- ============= PROBLEM SOLVING QUESTIONS =============

SELECT insert_geometry_question(
    'pb_pre_06',
    'Problem Solving',
    'A box is 10 cm long, 8 cm wide, and 5 cm tall. How many cubic cm can it hold?',
    '["23 cm³","80 cm³","400 cm³","800 cm³"]'::jsonb,
    '400 cm³',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'pb_post_06',
    'Problem Solving',
    'A cube has a volume of 64 cm³. What is the length of one edge?',
    '["4 cm","8 cm","16 cm","32 cm"]'::jsonb,
    '4 cm',
    'hard',
    'posttest',
    1
);

-- ============= HIGHER ORDER THINKING QUESTIONS =============

SELECT insert_geometry_question(
    'ho_pre_06',
    'Higher Order',
    'Why does a sphere have no vertices or edges?',
    '["It is too small","It has only curved surfaces","It is hollow","It is three-dimensional"]'::jsonb,
    'It has only curved surfaces',
    'medium',
    'pretest',
    1
);

SELECT insert_geometry_question(
    'ho_post_06',
    'Higher Order',
    'Among all 3D shapes with the same surface area, which has the maximum volume?',
    '["Cube","Sphere","Cylinder","Pyramid"]'::jsonb,
    'Sphere',
    'hard',
    'posttest',
    1
);

-- =====================================================
-- END OF 3D SHAPES QUESTIONS
-- =====================================================
