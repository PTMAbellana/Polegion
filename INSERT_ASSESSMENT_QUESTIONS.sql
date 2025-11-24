-- =====================================================
-- ASSESSMENT QUESTIONS SEED
-- Generated: 2025-11-24T10:07:36.446Z
-- Total Questions: 260
-- =====================================================

-- Question 1: kr_pre_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_01',
    'Knowledge Recall',
    'Which of the following is a location with no size?',
    '["Line","Point","Ray","Plane"]'::jsonb,
    'Point',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 2: kr_pre_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_02',
    'Knowledge Recall',
    'A straight path that extends infinitely in both directions is called a',
    '["Line","Line Segment","Ray","Angle"]'::jsonb,
    'Line',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 3: kr_pre_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_03',
    'Knowledge Recall',
    'A part of a line with two endpoints is called',
    '["Ray","Line","Line Segment","Plane"]'::jsonb,
    'Line Segment',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 4: kr_pre_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_04',
    'Knowledge Recall',
    'Two lines that never meet are called',
    '["Intersecting lines","Perpendicular lines","Parallel lines","Skew lines"]'::jsonb,
    'Parallel lines',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 5: kr_pre_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_05',
    'Knowledge Recall',
    'Lines that meet or cross at one point are called',
    '["Parallel","Intersecting","Perpendicular","Skew"]'::jsonb,
    'Intersecting',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 6: kr_pre_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_06',
    'Knowledge Recall',
    'Lines that intersect to form a right angle are',
    '["Parallel","Skew","Intersecting","Perpendicular"]'::jsonb,
    'Perpendicular',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 7: kr_pre_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_07',
    'Knowledge Recall',
    'Lines that are not coplanar and do not meet are',
    '["Parallel","Skew","Perpendicular","Coplanar"]'::jsonb,
    'Skew',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 8: kr_pre_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_08',
    'Knowledge Recall',
    'A figure formed by two rays with a common endpoint is',
    '["Segment","Ray","Angle","Line"]'::jsonb,
    'Angle',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 9: kr_pre_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_09',
    'Knowledge Recall',
    'The common endpoint of an angle is called the',
    '["Vertex","Arm","Side","Endpoint"]'::jsonb,
    'Vertex',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 10: kr_pre_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_10',
    'Knowledge Recall',
    'A triangle has how many sides?',
    '["2","3","4","5"]'::jsonb,
    '3',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 11: kr_pre_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_11',
    'Knowledge Recall',
    'A polygon with four sides is called',
    '["Triangle","Quadrilateral","Pentagon","Hexagon"]'::jsonb,
    'Quadrilateral',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 12: kr_pre_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_12',
    'Knowledge Recall',
    'A circle is named using its',
    '["Center","Radius","Diameter","Chord"]'::jsonb,
    'Center',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 13: kr_pre_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_13',
    'Knowledge Recall',
    'The distance from the center of a circle to any point on the circle is',
    '["Radius","Diameter","Chord","Arc"]'::jsonb,
    'Radius',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 14: kr_pre_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_14',
    'Knowledge Recall',
    'The longest chord in a circle is the',
    '["Radius","Diameter","Tangent","Secant"]'::jsonb,
    'Diameter',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 15: kr_pre_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_15',
    'Knowledge Recall',
    'A flat surface that extends infinitely is a',
    '["Point","Line","Plane","Solid"]'::jsonb,
    'Plane',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 16: kr_pre_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_16',
    'Knowledge Recall',
    'A 3D figure with a circular base and one vertex is a',
    '["Cylinder","Sphere","Cone","Prism"]'::jsonb,
    'Cone',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 17: kr_pre_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_17',
    'Knowledge Recall',
    'Which is NOT a polygon?',
    '["Triangle","Circle","Hexagon","Octagon"]'::jsonb,
    'Circle',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 18: kr_pre_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_18',
    'Knowledge Recall',
    'A solid figure with two congruent parallel faces is a',
    '["Prism","Pyramid","Sphere","Cone"]'::jsonb,
    'Prism',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 19: kr_pre_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_19',
    'Knowledge Recall',
    'A figure with all points equidistant from the center is a',
    '["Circle","Square","Triangle","Rectangle"]'::jsonb,
    'Circle',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 20: kr_pre_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_pre_20',
    'Knowledge Recall',
    'A three-dimensional figure with no edges and no vertices is a',
    '["Cube","Sphere","Cone","Prism"]'::jsonb,
    'Sphere',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 21: kr_post_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_01',
    'Knowledge Recall',
    'A location in space without width, length, or height is a',
    '["Plane","Point","Line","Vertex"]'::jsonb,
    'Point',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 22: kr_post_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_02',
    'Knowledge Recall',
    'A plane extends in:',
    '["One direction","Two directions","Three directions","Four directions"]'::jsonb,
    'Two directions',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 23: kr_post_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_03',
    'Knowledge Recall',
    'A ray has',
    '["No endpoints","One endpoint","Two endpoints","Infinite endpoints"]'::jsonb,
    'One endpoint',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 24: kr_post_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_04',
    'Knowledge Recall',
    'Which lines are always the same distance apart?',
    '["Perpendicular","Intersecting","Parallel","Skew"]'::jsonb,
    'Parallel',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 25: kr_post_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_05',
    'Knowledge Recall',
    'Lines that lie in different planes are',
    '["Skew lines","Perpendicular","Intersecting","Coplanar"]'::jsonb,
    'Skew lines',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 26: kr_post_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_06',
    'Knowledge Recall',
    'Two rays forming an angle are called',
    '["Arms","Bases","Segments","Ends"]'::jsonb,
    'Arms',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 27: kr_post_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_07',
    'Knowledge Recall',
    'A polygon with 8 sides is a',
    '["Heptagon","Octagon","Nonagon","Decagon"]'::jsonb,
    'Octagon',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 28: kr_post_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_08',
    'Knowledge Recall',
    'A closed figure made of straight segments is a',
    '["Circle","Arc","Polygon","Ray"]'::jsonb,
    'Polygon',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 29: kr_post_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_09',
    'Knowledge Recall',
    'The line passing through the center and touching two points on the circle is',
    '["Chord","Radius","Diameter","Arc"]'::jsonb,
    'Diameter',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 30: kr_post_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_10',
    'Knowledge Recall',
    'A chord that passes through the center is the',
    '["Radius","Diameter","Tangent","Secant"]'::jsonb,
    'Diameter',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 31: kr_post_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_11',
    'Knowledge Recall',
    'A polyhedron with one base and triangular faces is a',
    '["Prism","Pyramid","Cylinder","Sphere"]'::jsonb,
    'Pyramid',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 32: kr_post_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_12',
    'Knowledge Recall',
    'A solid figure with two circular congruent bases is a',
    '["Cone","Sphere","Cylinder","Pyramid"]'::jsonb,
    'Cylinder',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 33: kr_post_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_13',
    'Knowledge Recall',
    'The measure of the "opening" of an angle refers to',
    '["Sides","Vertex","Degree","Length"]'::jsonb,
    'Degree',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 34: kr_post_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_14',
    'Knowledge Recall',
    'A 5-sided polygon is called',
    '["Pentagram","Pentagon","Hexagon","Septagon"]'::jsonb,
    'Pentagon',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 35: kr_post_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_15',
    'Knowledge Recall',
    'How many faces does a cube have?',
    '["4","6","8","12"]'::jsonb,
    '6',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 36: kr_post_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_16',
    'Knowledge Recall',
    'A triangle with all sides equal is',
    '["Isosceles","Scalene","Equilateral","Right"]'::jsonb,
    'Equilateral',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 37: kr_post_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_17',
    'Knowledge Recall',
    'A figure that is flat and has length and width is',
    '["Solid figure","Plane figure","Spatial figure","Volume"]'::jsonb,
    'Plane figure',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 38: kr_post_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_18',
    'Knowledge Recall',
    'Which is NOT a solid figure?',
    '["Cube","Cone","Triangle","Prism"]'::jsonb,
    'Triangle',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 39: kr_post_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_19',
    'Knowledge Recall',
    'A curved surface with no edges belongs to a',
    '["Cube","Cylinder","Sphere","Prism"]'::jsonb,
    'Sphere',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 40: kr_post_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'kr_post_20',
    'Knowledge Recall',
    'A figure formed by points in space is a',
    '["Plane figure","Solid figure","Circular figure","Line figure"]'::jsonb,
    'Solid figure',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 41: cu_pre_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_01',
    'Concept Understanding',
    'Which best describes parallel lines?',
    '["Lines that meet at a right angle","Lines that meet at one point","Lines that lie in the same plane and never meet","Lines that are in different planes"]'::jsonb,
    'Lines that lie in the same plane and never meet',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 42: cu_pre_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_02',
    'Concept Understanding',
    'What makes perpendicular lines different from intersecting lines?',
    '["They do not meet","They meet but form a 90° angle","They are in different planes","They form an obtuse angle"]'::jsonb,
    'They meet but form a 90° angle',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 43: cu_pre_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_03',
    'Concept Understanding',
    'What is true about skew lines?',
    '["They are parallel","They lie in the same plane","They intersect at one point","They never meet and are in different planes"]'::jsonb,
    'They never meet and are in different planes',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 44: cu_pre_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_04',
    'Concept Understanding',
    'Which angle is greater than 90° but less than 180°?',
    '["Acute","Right","Obtuse","Straight"]'::jsonb,
    'Obtuse',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 45: cu_pre_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_05',
    'Concept Understanding',
    'A straight angle measures',
    '["45°","90°","180°","360°"]'::jsonb,
    '180°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 46: cu_pre_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_06',
    'Concept Understanding',
    'Complementary angles have measures that add up to',
    '["90°","180°","270°","360°"]'::jsonb,
    '90°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 47: cu_pre_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_07',
    'Concept Understanding',
    'Supplementary angles add up to',
    '["60°","90°","120°","180°"]'::jsonb,
    '180°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 48: cu_pre_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_08',
    'Concept Understanding',
    'Which describes a radius?',
    '["A line from one point on the circle to another","A line segment from center to a point on the circle","A line passing through the circle","A curve around the circle"]'::jsonb,
    'A line segment from center to a point on the circle',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 49: cu_pre_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_09',
    'Concept Understanding',
    'A diameter is',
    '["Twice the radius","Half the radius","Same as radius","Larger than circumference"]'::jsonb,
    'Twice the radius',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 50: cu_pre_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_10',
    'Concept Understanding',
    'What makes a regular polygon "regular"?',
    '["It has all right angles","All sides and angles are equal","It has curved sides","It has at least six sides"]'::jsonb,
    'All sides and angles are equal',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 51: cu_pre_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_11',
    'Concept Understanding',
    'Which is NOT a property of a triangle?',
    '["Has three sides","Has three vertices","Has interior angle sum of 180°","Has four angles"]'::jsonb,
    'Has four angles',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 52: cu_pre_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_12',
    'Concept Understanding',
    'A quadrilateral has',
    '["2 sides","3 sides","4 sides","5 sides"]'::jsonb,
    '4 sides',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 53: cu_pre_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_13',
    'Concept Understanding',
    'A cone is different from a cylinder because a cone has',
    '["Two circular bases","A curved surface","One circular base and a vertex","No base"]'::jsonb,
    'One circular base and a vertex',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 54: cu_pre_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_14',
    'Concept Understanding',
    'A prism is identified by its',
    '["Sides","Base shape","Height","Surface area"]'::jsonb,
    'Base shape',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 55: cu_pre_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_15',
    'Concept Understanding',
    'A sphere is unique because',
    '["It has edges","It has vertices","All points are equidistant from the center","It has flat surfaces"]'::jsonb,
    'All points are equidistant from the center',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 56: cu_pre_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_16',
    'Concept Understanding',
    'What do we call a triangle with all angles less than 90°?',
    '["Right","Scalene","Acute","Obtuse"]'::jsonb,
    'Acute',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 57: cu_pre_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_17',
    'Concept Understanding',
    'A polygon is a figure made of',
    '["Curved lines","Straight segments","Rays","Arcs"]'::jsonb,
    'Straight segments',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 58: cu_pre_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_18',
    'Concept Understanding',
    'Which set of angles forms a linear pair?',
    '["They add up to 90°","They are opposite angles","They are adjacent and sum to 180°","They are acute"]'::jsonb,
    'They are adjacent and sum to 180°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 59: cu_pre_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_19',
    'Concept Understanding',
    'Vertical angles are',
    '["Adjacent","Formed by parallel lines","Equal in measure","Always acute"]'::jsonb,
    'Equal in measure',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 60: cu_pre_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_pre_20',
    'Concept Understanding',
    'Which describes a plane?',
    '["Has one endpoint","Curved surface","A flat surface extending forever","A solid figure"]'::jsonb,
    'A flat surface extending forever',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 61: cu_post_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_01',
    'Concept Understanding',
    'If two lines are perpendicular, which is always true?',
    '["They never meet","They form four 90° angles","They form parallel lines","They lie in different planes"]'::jsonb,
    'They form four 90° angles',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 62: cu_post_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_02',
    'Concept Understanding',
    'If ∠A and ∠B are complementary, which must be true?',
    '["Both angles are obtuse","One angle is straight","Their sum is 90°","They are vertical angles"]'::jsonb,
    'Their sum is 90°',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 63: cu_post_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_03',
    'Concept Understanding',
    'If an angle measures 120°, it is',
    '["Acute","Right","Obtuse","Straight"]'::jsonb,
    'Obtuse',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 64: cu_post_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_04',
    'Concept Understanding',
    'A radius is always',
    '["Half of the diameter","Equal to the circumference","Longer than the diameter","Longer than the chord"]'::jsonb,
    'Half of the diameter',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 65: cu_post_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_05',
    'Concept Understanding',
    'Two polygons are congruent if',
    '["They have the same number of sides only","They have equal corresponding sides and angles","One is rotated","They have curved boundaries"]'::jsonb,
    'They have equal corresponding sides and angles',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 66: cu_post_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_06',
    'Concept Understanding',
    'Which best describes a tangent to a circle?',
    '["Passes through two points of the circle","Passes through the center","Touches the circle at exactly one point","Lies entirely inside the circle"]'::jsonb,
    'Touches the circle at exactly one point',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 67: cu_post_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_07',
    'Concept Understanding',
    'The sum of interior angles of a pentagon is',
    '["360°","540°","720°","900°"]'::jsonb,
    '540°',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 68: cu_post_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_08',
    'Concept Understanding',
    'A right triangle must have',
    '["One 90° angle","One obtuse angle","All angles equal","No equal angles"]'::jsonb,
    'One 90° angle',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 69: cu_post_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_09',
    'Concept Understanding',
    'Opposite angles formed by intersecting lines are called',
    '["Adjacent angles","Complementary angles","Vertical angles","Linear pairs"]'::jsonb,
    'Vertical angles',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 70: cu_post_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_10',
    'Concept Understanding',
    'A regular hexagon has',
    '["3 congruent sides","4 congruent sides","5 congruent sides","6 congruent sides"]'::jsonb,
    '6 congruent sides',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 71: cu_post_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_11',
    'Concept Understanding',
    'A cylinder has',
    '["One base","Two circular congruent bases","Four faces","No curved surface"]'::jsonb,
    'Two circular congruent bases',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 72: cu_post_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_12',
    'Concept Understanding',
    'A pyramid is different from a prism because',
    '["A pyramid has only one base","A pyramid has parallel bases","A pyramid has no vertices","A pyramid is 2D"]'::jsonb,
    'A pyramid has only one base',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 73: cu_post_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_13',
    'Concept Understanding',
    'A square is always a',
    '["Rhombus","Rectangle","Parallelogram","All of the above"]'::jsonb,
    'All of the above',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 74: cu_post_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_14',
    'Concept Understanding',
    'The point where all radii of a circle meet is called',
    '["Chord","Center","Diameter","Tangent"]'::jsonb,
    'Center',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 75: cu_post_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_15',
    'Concept Understanding',
    'When two angles form a straight line, they are',
    '["Complementary","Vertical","Adjacent angles","Linear pair"]'::jsonb,
    'Linear pair',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 76: cu_post_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_16',
    'Concept Understanding',
    'If two angles share a common arm, they are',
    '["Vertical","Adjacent","Complementary","Straight"]'::jsonb,
    'Adjacent',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 77: cu_post_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_17',
    'Concept Understanding',
    'A triangle with exactly two equal sides is',
    '["Scalene","Isosceles","Equilateral","Right"]'::jsonb,
    'Isosceles',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 78: cu_post_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_18',
    'Concept Understanding',
    'A three-dimensional object with a circular base and no edges is',
    '["Cone","Sphere","Cylinder","Prism"]'::jsonb,
    'Sphere',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 79: cu_post_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_19',
    'Concept Understanding',
    'A quadrilateral with only one pair of parallel sides is',
    '["Square","Trapezoid","Rectangle","Rhombus"]'::jsonb,
    'Trapezoid',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 80: cu_post_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'cu_post_20',
    'Concept Understanding',
    'The boundary of a circle is called',
    '["Radius","Chord","Circumference","Arc"]'::jsonb,
    'Circumference',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 81: ps_pre_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_01',
    'Procedural Skills',
    'Which of the following correctly represents line segment AB?',
    '["→AB","AB↔","AB̅","Ray AB"]'::jsonb,
    'AB̅',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 82: ps_pre_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_02',
    'Procedural Skills',
    'To construct a perpendicular line to a given line, which tool is best?',
    '["Compass","Ruler and protractor","Divider","Pencil only"]'::jsonb,
    'Ruler and protractor',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 83: ps_pre_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_03',
    'Procedural Skills',
    'When constructing an angle of 60° using a protractor, which step is first?',
    '["Place vertex at protractor center","Draw a 60° arc","Connect points to form angle","Extend the line"]'::jsonb,
    'Place vertex at protractor center',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 84: ps_pre_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_04',
    'Procedural Skills',
    'When measuring the length of a line segment using a ruler, which unit is most appropriate?',
    '["Centimeters","Degrees","Liters","Square meters"]'::jsonb,
    'Centimeters',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 85: ps_pre_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_05',
    'Procedural Skills',
    'A ray starting at point A toward point B is represented by which symbol?',
    '["AB̅","→AB","AB↔","Point A"]'::jsonb,
    '→AB',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 86: ps_pre_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_06',
    'Procedural Skills',
    'Find the perimeter of a rectangle with L=12 cm and W=5 cm.',
    '["34 cm","60 cm","17 cm","30 cm"]'::jsonb,
    '34 cm',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 87: ps_pre_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_07',
    'Procedural Skills',
    'Find the area of a triangle with base 10 cm and height 6 cm.',
    '["16 cm²","30 cm²","60 cm²","36 cm²"]'::jsonb,
    '30 cm²',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 88: ps_pre_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_08',
    'Procedural Skills',
    'Find the circumference of a circle with r=7 cm. (π=3.14)',
    '["43.96 cm","21.98 cm","49 cm","22 cm"]'::jsonb,
    '43.96 cm',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 89: ps_pre_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_09',
    'Procedural Skills',
    'Find the area of a circle with r=5 cm. (π=3.14)',
    '["31.4 cm²","78.5 cm²","25 cm²","50 cm²"]'::jsonb,
    '78.5 cm²',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 90: ps_pre_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_10',
    'Procedural Skills',
    'Find the sum of interior angles of a hexagon.',
    '["360°","540°","720°","900°"]'::jsonb,
    '720°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 91: ps_pre_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_11',
    'Procedural Skills',
    'When constructing a regular pentagon, how many equal sides should it have?',
    '["4","5","6","8"]'::jsonb,
    '5',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 92: ps_pre_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_12',
    'Procedural Skills',
    'Find the surface area of a cube with side 3 cm.',
    '["9 cm²","27 cm²","36 cm²","54 cm²"]'::jsonb,
    '54 cm²',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 93: ps_pre_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_13',
    'Procedural Skills',
    'Find the volume of a rectangular prism with L=5, W=3, H=2.',
    '["10 cm³","15 cm³","30 cm³","60 cm³"]'::jsonb,
    '30 cm³',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 94: ps_pre_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_14',
    'Procedural Skills',
    'Find the volume of a cylinder with r=4, h=10 (π=3.14).',
    '["125.6 cm³","502.4 cm³","251.2 cm³","100.48 cm³"]'::jsonb,
    '502.4 cm³',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 95: ps_pre_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_15',
    'Procedural Skills',
    'Find the volume of a cone with r=3, h=9 (π=3.14).',
    '["84.78 cm³","254.34 cm³","282.6 cm³","28.26 cm³"]'::jsonb,
    '84.78 cm³',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 96: ps_pre_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_16',
    'Procedural Skills',
    'Find the area of a parallelogram with base 8 cm and height 5 cm.',
    '["20 cm²","30 cm²","40 cm²","50 cm²"]'::jsonb,
    '40 cm²',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 97: ps_pre_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_17',
    'Procedural Skills',
    'When a student constructs an angle bisector, which is TRUE?',
    '["Divides the angle into two equal parts","Measures the angle","Extends the line segment","Draws a perpendicular line"]'::jsonb,
    'Divides the angle into two equal parts',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 98: ps_pre_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_18',
    'Procedural Skills',
    'When constructing a tangent to a circle at a given point, which is correct?',
    '["Passes through center","Touches circle at exactly one point","Passes through two points on the circle","Lies inside the circle"]'::jsonb,
    'Touches circle at exactly one point',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 99: ps_pre_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_19',
    'Procedural Skills',
    'An angle measured with a protractor shows 110°. Which category is it?',
    '["Acute","Right","Obtuse","Straight"]'::jsonb,
    'Obtuse',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 100: ps_pre_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_20',
    'Procedural Skills',
    'Find the perimeter of a trapezoid with sides 6, 8, 10, 12 cm.',
    '["30 cm","32 cm","36 cm","40 cm"]'::jsonb,
    '36 cm',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 101: ps_pre_21
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_21',
    'Procedural Skills',
    'Calculate the perimeter of a square with side length 9 cm.',
    '["18 cm","27 cm","36 cm","81 cm"]'::jsonb,
    '36 cm',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 102: ps_pre_22
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_22',
    'Procedural Skills',
    'Find the area of a square with side 6 cm.',
    '["12 cm²","24 cm²","36 cm²","48 cm²"]'::jsonb,
    '36 cm²',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 103: ps_pre_23
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_23',
    'Procedural Skills',
    'If a circle has diameter 14 cm, what is its radius?',
    '["7 cm","14 cm","28 cm","3.5 cm"]'::jsonb,
    '7 cm',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 104: ps_pre_24
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_24',
    'Procedural Skills',
    'Calculate the area of a rectangle with length 11 cm and width 4 cm.',
    '["30 cm²","44 cm²","15 cm²","22 cm²"]'::jsonb,
    '44 cm²',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 105: ps_pre_25
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_25',
    'Procedural Skills',
    'A triangle has sides of 7 cm, 8 cm, and 9 cm. What is its perimeter?',
    '["20 cm","22 cm","24 cm","26 cm"]'::jsonb,
    '24 cm',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 106: ps_post_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_01',
    'Procedural Skills',
    'Which of the following is the correct symbol for line MN?',
    '["MN̅","→MN","↔MN","Ray MN"]'::jsonb,
    '↔MN',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 107: ps_post_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_02',
    'Procedural Skills',
    'To construct a parallel line through a given point, which tool combination is most appropriate?',
    '["Compass only","Ruler only","Compass and straightedge","Protractor only"]'::jsonb,
    'Compass and straightedge',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 108: ps_post_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_03',
    'Procedural Skills',
    'You are asked to construct a 45° angle. What should you do first?',
    '["Draw an arc above the vertex","Place the protractor at the vertex","Mark 90° then bisect it","Draw two rays randomly"]'::jsonb,
    'Place the protractor at the vertex',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 109: ps_post_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_04',
    'Procedural Skills',
    'What is the most appropriate tool to measure a 5 cm line segment?',
    '["Protractor","Compass","Meter stick","Ruler"]'::jsonb,
    'Ruler',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 110: ps_post_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_05',
    'Procedural Skills',
    'Which of the following correctly represents ray CD?',
    '["CD̅","↔CD","→CD","DC̅"]'::jsonb,
    '→CD',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 111: ps_post_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_06',
    'Procedural Skills',
    'What is the area of a rectangle with length 15 cm and width 4 cm?',
    '["30 cm²","60 cm²","45 cm²","120 cm²"]'::jsonb,
    '60 cm²',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 112: ps_post_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_07',
    'Procedural Skills',
    'Find the area of a triangle with base 12 cm and height 8 cm.',
    '["48 cm²","96 cm²","36 cm²","72 cm²"]'::jsonb,
    '48 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 113: ps_post_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_08',
    'Procedural Skills',
    'A circle has a diameter of 20 cm. What is its circumference? (π = 3.14)',
    '["31.4 cm","62.8 cm","94.2 cm","120 cm"]'::jsonb,
    '62.8 cm',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 114: ps_post_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_09',
    'Procedural Skills',
    'A circle has a radius of 9 cm. What is its area? (π = 3.14)',
    '["254.34 cm²","162 cm²","254 cm²","254.16 cm²"]'::jsonb,
    '254.34 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 115: ps_post_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_10',
    'Procedural Skills',
    'What is the sum of interior angles of an octagon?',
    '["900°","1080°","1260°","1440°"]'::jsonb,
    '1080°',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 116: ps_post_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_11',
    'Procedural Skills',
    'When constructing a regular hexagon, how many congruent sides does it have?',
    '["5","6","7","8"]'::jsonb,
    '6',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 117: ps_post_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_12',
    'Procedural Skills',
    'Find the surface area of a cube with side length 4 cm.',
    '["16 cm²","64 cm²","96 cm²","384 cm²"]'::jsonb,
    '96 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 118: ps_post_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_13',
    'Procedural Skills',
    'Find the volume of a rectangular prism with L=7 cm, W=2 cm, H=5 cm.',
    '["35 cm³","70 cm³","50 cm³","140 cm³"]'::jsonb,
    '70 cm³',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 119: ps_post_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_14',
    'Procedural Skills',
    'Find the volume of a cylinder with radius 3 cm, height 12 cm (π=3.14).',
    '["339.12 cm³","452.16 cm³","271.44 cm³","108 cm³"]'::jsonb,
    '339.12 cm³',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 120: ps_post_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_15',
    'Procedural Skills',
    'Find the volume of a cone with radius 5 cm and height 10 cm (π=3.14).',
    '["104.67 cm³","261.67 cm³","523.33 cm³","785.4 cm³"]'::jsonb,
    '261.67 cm³',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 121: ps_post_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_16',
    'Procedural Skills',
    'Find the area of a parallelogram with base 9 cm and height 7 cm.',
    '["16 cm²","63 cm²","81 cm²","72 cm²"]'::jsonb,
    '63 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 122: ps_post_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_17',
    'Procedural Skills',
    'Which statement is TRUE about the perpendicular bisector of a segment?',
    '["It touches the segment at two points","It divides the segment into equal halves","It extends only to the right","It forms a 60° angle"]'::jsonb,
    'It divides the segment into equal halves',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 123: ps_post_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_18',
    'Procedural Skills',
    'Which statement describes a secant line of a circle?',
    '["Touches circle at one point","Passes through center","Intersects circle at two points","Lies outside the circle"]'::jsonb,
    'Intersects circle at two points',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 124: ps_post_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_19',
    'Procedural Skills',
    'An angle measures 150°. What type of angle is this?',
    '["Acute","Obtuse","Straight","Reflex"]'::jsonb,
    'Obtuse',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 125: ps_post_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_20',
    'Procedural Skills',
    'Find the perimeter of a triangle with sides 11 cm, 13 cm, and 15 cm.',
    '["29 cm","30 cm","39 cm","41 cm"]'::jsonb,
    '39 cm',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 126: ps_post_21
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_21',
    'Procedural Skills',
    'Calculate the perimeter of a pentagon with all sides measuring 8 cm.',
    '["32 cm","40 cm","48 cm","56 cm"]'::jsonb,
    '40 cm',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 127: ps_post_22
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_22',
    'Procedural Skills',
    'Find the area of a trapezoid with bases 6 cm and 10 cm, and height 5 cm.',
    '["30 cm²","40 cm²","50 cm²","80 cm²"]'::jsonb,
    '40 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 128: ps_post_23
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_23',
    'Procedural Skills',
    'If a circle has radius 10 cm, what is its diameter?',
    '["5 cm","10 cm","20 cm","30 cm"]'::jsonb,
    '20 cm',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 129: ps_post_24
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_24',
    'Procedural Skills',
    'Calculate the volume of a cube with side 5 cm.',
    '["25 cm³","75 cm³","100 cm³","125 cm³"]'::jsonb,
    '125 cm³',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 130: ps_post_25
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_25',
    'Procedural Skills',
    'Find the perimeter of a regular hexagon with side length 7 cm.',
    '["35 cm","42 cm","49 cm","56 cm"]'::jsonb,
    '42 cm',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 131: at_pre_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_01',
    'Analytical Thinking',
    'Which statement best explains why two acute angles cannot form a straight line?',
    '["Their sum is always 90°.","Their sum is less than 180°.","They measure more than 90°.","They are always congruent."]'::jsonb,
    'Their sum is less than 180°.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 132: at_pre_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_02',
    'Analytical Thinking',
    'If two lines are perpendicular, what can you conclude about the angles they form?',
    '["They form two acute angles.","They form complementary angles.","They form four 90° angles.","They never intersect."]'::jsonb,
    'They form four 90° angles.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 133: at_pre_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_03',
    'Analytical Thinking',
    'Which of the following sets shows parallel lines?',
    '["Lines that meet at one point","Lines that lie on different planes","Lines that are always the same distance apart","Lines that intersect at right angles"]'::jsonb,
    'Lines that are always the same distance apart',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 134: at_pre_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_04',
    'Analytical Thinking',
    'Which pair of angles is always supplementary?',
    '["Adjacent acute angles","Vertical angles","Angles forming a linear pair","Corresponding angles"]'::jsonb,
    'Angles forming a linear pair',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 135: at_pre_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_05',
    'Analytical Thinking',
    'If two angles are congruent, what is true?',
    '["They have the same shape.","They have the same measure.","They form a straight angle.","They add up to 90°."]'::jsonb,
    'They have the same measure.',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 136: at_pre_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_06',
    'Analytical Thinking',
    'A chord is drawn inside a circle. Which statement is TRUE?',
    '["It always passes through the center.","It is always the longest segment in the circle.","It connects two points on the circle.","It is equal to the radius."]'::jsonb,
    'It connects two points on the circle.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 137: at_pre_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_07',
    'Analytical Thinking',
    'Which statement about a regular pentagon is TRUE?',
    '["All angles are congruent.","All sides are different.","It has two pairs of parallel sides.","It has 3 equal angles."]'::jsonb,
    'All angles are congruent.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 138: at_pre_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_08',
    'Analytical Thinking',
    'Which of the following shapes ALWAYS has four right angles?',
    '["Parallelogram","Kite","Square","Trapezoid"]'::jsonb,
    'Square',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 139: at_pre_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_09',
    'Analytical Thinking',
    'A triangle has sides 8 cm, 15 cm, and 17 cm. Which statement is TRUE?',
    '["It is a right triangle.","It is an acute triangle.","It is an equilateral triangle.","It is impossible to form a triangle."]'::jsonb,
    'It is a right triangle.',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 140: at_pre_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_10',
    'Analytical Thinking',
    'Which figure CANNOT tessellate a plane?',
    '["Square","Triangle","Regular hexagon","Regular pentagon"]'::jsonb,
    'Regular pentagon',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 141: at_pre_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_11',
    'Analytical Thinking',
    'Which angle pair is formed when two parallel lines are cut by a transversal?',
    '["Adjacent angles","Vertical angles","Corresponding angles","Reflex angles"]'::jsonb,
    'Corresponding angles',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 142: at_pre_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_12',
    'Analytical Thinking',
    'Which statement BEST describes a trapezoid?',
    '["All sides are equal.","It has exactly one pair of parallel sides.","It has two pairs of equal sides.","All angles are right angles."]'::jsonb,
    'It has exactly one pair of parallel sides.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 143: at_pre_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_13',
    'Analytical Thinking',
    'A prism and a pyramid have the same base. Which is TRUE?',
    '["They have the same volume formula.","A prism has slant height; a pyramid does not.","A pyramid has only one base.","They have the same number of faces."]'::jsonb,
    'A pyramid has only one base.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 144: at_pre_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_14',
    'Analytical Thinking',
    'What can be concluded about the radii of the same circle?',
    '["They are always congruent.","They form acute angles.","They are longer than the diameter.","They form a straight line."]'::jsonb,
    'They are always congruent.',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 145: at_pre_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_15',
    'Analytical Thinking',
    'Which figure has NO right angles?',
    '["Rectangle","Square","Parallelogram","Right triangle"]'::jsonb,
    'Parallelogram',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 146: at_pre_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_16',
    'Analytical Thinking',
    'Two triangles have all three corresponding sides equal. Which is TRUE?',
    '["They are similar only","They are congruent","They are isosceles","They must be scalene"]'::jsonb,
    'They are congruent',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 147: at_pre_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_17',
    'Analytical Thinking',
    'Which 3D figure has exactly one curved surface and two circular bases?',
    '["Cone","Sphere","Cylinder","Pyramid"]'::jsonb,
    'Cylinder',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 148: at_pre_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_18',
    'Analytical Thinking',
    'Which statement distinguishes volume from surface area?',
    '["Volume measures space inside; surface area measures covering outside.","Volume measures length; surface area measures width.","Volume measures edges; surface area measures vertices.","They measure the same thing."]'::jsonb,
    'Volume measures space inside; surface area measures covering outside.',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 149: at_pre_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_19',
    'Analytical Thinking',
    'A student says: "A square is a rectangle." Is the statement correct?',
    '["No, because squares have equal sides.","No, because rectangles are not quadrilaterals.","Yes, because a square has 4 right angles like a rectangle.","Yes, because a square is a rhombus."]'::jsonb,
    'Yes, because a square has 4 right angles like a rectangle.',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 150: at_pre_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_pre_20',
    'Analytical Thinking',
    'All equilateral triangles are _______.',
    '["Obtuse","Acute","Right","Straight"]'::jsonb,
    'Acute',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 151: at_post_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_01',
    'Analytical Thinking',
    'Why can''t two obtuse angles be supplementary?',
    '["They are both greater than 90°.","They are both less than 45°.","They are equal in measure.","They form vertical angles."]'::jsonb,
    'They are both greater than 90°.',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 152: at_post_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_02',
    'Analytical Thinking',
    'If two lines are parallel, what can you conclude when a transversal crosses them?',
    '["Only acute angles are formed.","All corresponding angles are congruent.","Vertical angles disappear.","Adjacent angles become equal."]'::jsonb,
    'All corresponding angles are congruent.',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 153: at_post_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_03',
    'Analytical Thinking',
    'Which of the following shows perpendicular lines?',
    '["Lines that intersect to form 90° angles","Lines that never meet","Lines that form a linear pair","Lines in different planes"]'::jsonb,
    'Lines that intersect to form 90° angles',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 154: at_post_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_04',
    'Analytical Thinking',
    'Which angles are ALWAYS congruent?',
    '["Adjacent angles","Vertical angles","Linear pairs","Alternate interior angles"]'::jsonb,
    'Vertical angles',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 155: at_post_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_05',
    'Analytical Thinking',
    'Two angles add up to 90°. These angles are called:',
    '["Supplementary","Vertical","Adjacent","Complementary"]'::jsonb,
    'Complementary',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 156: at_post_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_06',
    'Analytical Thinking',
    'A radius is drawn from the center of a circle. What can be concluded?',
    '["It is always the longest segment","It is half the diameter","It must form a 45° angle","It crosses the circle twice"]'::jsonb,
    'It is half the diameter',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 157: at_post_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_07',
    'Analytical Thinking',
    'Which property is TRUE for a regular hexagon?',
    '["Opposite sides are perpendicular","All sides and all angles are equal","It has only one line of symmetry","It has 8 vertices"]'::jsonb,
    'All sides and all angles are equal',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 158: at_post_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_08',
    'Analytical Thinking',
    'Which shape ALWAYS has opposite sides parallel?',
    '["Trapezoid","Kite","Parallelogram","Pentagon"]'::jsonb,
    'Parallelogram',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 159: at_post_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_09',
    'Analytical Thinking',
    'Triangle sides: 7 cm, 24 cm, 25 cm. What can be concluded?',
    '["Not a triangle","Acute triangle","Right triangle","Scalene but not right"]'::jsonb,
    'Right triangle',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 160: at_post_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_10',
    'Analytical Thinking',
    'Which figure CAN tessellate the plane?',
    '["Regular octagon","Regular pentagon","Regular triangle","Circle"]'::jsonb,
    'Regular triangle',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 161: at_post_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_11',
    'Analytical Thinking',
    'When two parallel lines are cut by a transversal, which angle pair is equal?',
    '["Consecutive interior","Vertical only","Corresponding","Adjacent"]'::jsonb,
    'Corresponding',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 162: at_post_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_12',
    'Analytical Thinking',
    'Which BEST describes a rhombus?',
    '["All angles equal","One pair of parallel sides","Four equal sides","Two right angles"]'::jsonb,
    'Four equal sides',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 163: at_post_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_13',
    'Analytical Thinking',
    'Comparing a cylinder and a cone with the same base and height:',
    '["Cylinder has half the volume of the cone","Cone has one-third the volume of the cylinder","Their volumes are always equal","Cone has greater surface area"]'::jsonb,
    'Cone has one-third the volume of the cylinder',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 164: at_post_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_14',
    'Analytical Thinking',
    'All diameters of the same circle are ________.',
    '["Parallel","Congruent","Perpendicular","Different lengths"]'::jsonb,
    'Congruent',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 165: at_post_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_15',
    'Analytical Thinking',
    'Which figure sometimes has right angles but not always?',
    '["Square","Rectangle","Parallelogram","Cube"]'::jsonb,
    'Parallelogram',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 166: at_post_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_16',
    'Analytical Thinking',
    'Two triangles are similar if:',
    '["All sides are equal","All corresponding angles are equal","They have the same perimeter","They are the same size"]'::jsonb,
    'All corresponding angles are equal',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 167: at_post_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_17',
    'Analytical Thinking',
    'Which solid has only one vertex?',
    '["Cube","Cylinder","Pyramid","Cone"]'::jsonb,
    'Cone',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 168: at_post_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_18',
    'Analytical Thinking',
    'Which statement is TRUE about surface area?',
    '["It measures the space inside a solid.","It measures the boundary of a 2D shape.","It measures the total area covering a solid.","It is measured in cubic units."]'::jsonb,
    'It measures the total area covering a solid.',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 169: at_post_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_19',
    'Analytical Thinking',
    'A rectangle is a parallelogram. Why?',
    '["All its sides are equal","It has one pair of parallel sides","It has two pairs of parallel sides","All angles are obtuse"]'::jsonb,
    'It has two pairs of parallel sides',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 170: at_post_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'at_post_20',
    'Analytical Thinking',
    'All isosceles triangles have ______.',
    '["Two equal sides","All equal angles","One right angle","A reflex angle"]'::jsonb,
    'Two equal sides',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 171: ps_pre_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_01',
    'Problem-Solving',
    'A rectangular garden has a length of 12 m and a width of 8 m. What is its area?',
    '["20 m²","48 m²","96 m²","100 m²"]'::jsonb,
    '96 m²',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 172: ps_pre_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_02',
    'Problem-Solving',
    'A triangle has a base of 10 cm and height of 6 cm. What is its area?',
    '["30 cm²","60 cm²","20 cm²","16 cm²"]'::jsonb,
    '30 cm²',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 173: ps_pre_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_03',
    'Problem-Solving',
    'The ratio of two angles forming a linear pair is 2:1. What are their measures?',
    '["120° and 60°","100° and 50°","90° and 45°","80° and 40°"]'::jsonb,
    '120° and 60°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 174: ps_pre_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_04',
    'Problem-Solving',
    'A circle has a radius of 7 cm. What is its circumference? (Use π = 22/7)',
    '["22 cm","44 cm","28 cm","14 cm"]'::jsonb,
    '44 cm',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 175: ps_pre_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_05',
    'Problem-Solving',
    'What is the interior angle sum of a hexagon?',
    '["360°","540°","720°","900°"]'::jsonb,
    '720°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 176: ps_pre_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_06',
    'Problem-Solving',
    'A cube has an edge length of 5 cm. What is its volume?',
    '["15 cm³","25 cm³","75 cm³","125 cm³"]'::jsonb,
    '125 cm³',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 177: ps_pre_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_07',
    'Problem-Solving',
    'A student draws two angles measuring 45° and 35°. What is their sum?',
    '["75°","80°","90°","100°"]'::jsonb,
    '80°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 178: ps_pre_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_08',
    'Problem-Solving',
    'If a triangle''s angles measure 2x, x, and 3x, what is x?',
    '["15°","20°","30°","45°"]'::jsonb,
    '30°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 179: ps_pre_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_09',
    'Problem-Solving',
    'A rectangular lot has a perimeter of 50 m and width of 10 m. What is the length?',
    '["15 m","20 m","25 m","30 m"]'::jsonb,
    '15 m',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 180: ps_pre_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_10',
    'Problem-Solving',
    'What is the area of a circle with diameter 14 cm? (π=3.14)',
    '["49π","153.86 cm²","78.5 cm²","154 cm²"]'::jsonb,
    '153.86 cm²',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 181: ps_pre_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_11',
    'Problem-Solving',
    'A 40° angle is adjacent to an angle forming a straight line. What is the missing angle?',
    '["140°","40°","90°","180°"]'::jsonb,
    '140°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 182: ps_pre_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_12',
    'Problem-Solving',
    'A pizza has radius 10 cm. What is its circumference?',
    '["20π","40π","10π","30π"]'::jsonb,
    '20π',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 183: ps_pre_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_13',
    'Problem-Solving',
    'A square lot has an area of 225 m². What is the side length?',
    '["10 m","12 m","15 m","18 m"]'::jsonb,
    '15 m',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 184: ps_pre_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_14',
    'Problem-Solving',
    'A prism has base area 12 cm² and height 10 cm. What is its volume?',
    '["120 cm³","22 cm³","100 cm³","60 cm³"]'::jsonb,
    '120 cm³',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 185: ps_pre_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_15',
    'Problem-Solving',
    'A trapezoid has bases 8 cm and 12 cm, and height 5 cm. What is its area?',
    '["30 cm²","40 cm²","50 cm²","60 cm²"]'::jsonb,
    '50 cm²',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 186: ps_pre_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_16',
    'Problem-Solving',
    'The sum of two complementary angles is 90°. If one angle is 35°, what is the other?',
    '["65°","55°","45°","35°"]'::jsonb,
    '55°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 187: ps_pre_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_17',
    'Problem-Solving',
    'A cone has a radius of 3 cm and height of 4 cm. What is its volume?',
    '["12π","24π","36π","48π"]'::jsonb,
    '12π',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 188: ps_pre_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_18',
    'Problem-Solving',
    'A room is shaped like a rectangle: 6 m by 4 m. What is its perimeter?',
    '["10 m","20 m","18 m","24 m"]'::jsonb,
    '20 m',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 189: ps_pre_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_19',
    'Problem-Solving',
    'A cylinder has radius 5 cm and height 10 cm. What is its volume?',
    '["250π","500π","750π","1000π"]'::jsonb,
    '250π',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 190: ps_pre_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_20',
    'Problem-Solving',
    'What is the measure of each interior angle of a regular pentagon?',
    '["108°","120°","135°","150°"]'::jsonb,
    '108°',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 191: ps_pre_21
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_21',
    'Problem-Solving',
    'A rectangular field is 20 m long and 15 m wide. What is the total distance around it?',
    '["35 m","50 m","70 m","300 m²"]'::jsonb,
    '70 m',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 192: ps_pre_22
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_22',
    'Problem-Solving',
    'Two supplementary angles are in the ratio 5:4. What is the smaller angle?',
    '["80°","100°","90°","60°"]'::jsonb,
    '80°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 193: ps_pre_23
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_23',
    'Problem-Solving',
    'A circular pond has a diameter of 28 m. What is its circumference? (π = 22/7)',
    '["44 m","88 m","66 m","56 m"]'::jsonb,
    '88 m',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 194: ps_pre_24
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_24',
    'Problem-Solving',
    'What is the sum of interior angles of an octagon?',
    '["720°","900°","1080°","1260°"]'::jsonb,
    '1080°',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 195: ps_pre_25
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_pre_25',
    'Problem-Solving',
    'A box is 8 cm long, 5 cm wide, and 3 cm high. What is its volume?',
    '["40 cm³","80 cm³","120 cm³","240 cm³"]'::jsonb,
    '120 cm³',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 196: ps_post_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_01',
    'Problem-Solving',
    'A triangle has sides 10 cm, 10 cm, and 12 cm. What type of triangle is it?',
    '["Equilateral","Isosceles","Scalene","Right"]'::jsonb,
    'Isosceles',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 197: ps_post_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_02',
    'Problem-Solving',
    'A square has a perimeter of 48 cm. What is the area?',
    '["144 cm²","196 cm²","256 cm²","576 cm²"]'::jsonb,
    '144 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 198: ps_post_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_03',
    'Problem-Solving',
    'The angles of a quadrilateral are in the ratio 1:2:3:4. What is the largest angle?',
    '["72°","108°","144°","180°"]'::jsonb,
    '144°',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 199: ps_post_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_04',
    'Problem-Solving',
    'A circle has a circumference of 31.4 cm. What is the radius? (π=3.14)',
    '["2 cm","3 cm","4 cm","5 cm"]'::jsonb,
    '5 cm',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 200: ps_post_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_05',
    'Problem-Solving',
    'A right triangle has legs 9 m and 12 m. What is the hypotenuse?',
    '["10 m","12 m","15 m","20 m"]'::jsonb,
    '15 m',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 201: ps_post_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_06',
    'Problem-Solving',
    'The area of a trapezoid is 48 cm². Bases are 6 cm and 10 cm. What is the height?',
    '["4 cm","6 cm","8 cm","10 cm"]'::jsonb,
    '6 cm',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 202: ps_post_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_07',
    'Problem-Solving',
    'A cone has volume 100π cm³. Radius = 5 cm. What is the height?',
    '["8 cm","10 cm","12 cm","15 cm"]'::jsonb,
    '12 cm',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 203: ps_post_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_08',
    'Problem-Solving',
    'A parallelogram has base 20 cm and height 7 cm. What is the area?',
    '["27 cm²","70 cm²","140 cm²","200 cm²"]'::jsonb,
    '140 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 204: ps_post_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_09',
    'Problem-Solving',
    'The radius of a sphere is doubled. Its volume becomes…',
    '["Doubled","Tripled","Four times","Eight times"]'::jsonb,
    'Eight times',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 205: ps_post_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_10',
    'Problem-Solving',
    'A polygon has 15 sides. What is its interior angle sum?',
    '["1980°","2160°","2340°","2520°"]'::jsonb,
    '2340°',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 206: ps_post_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_11',
    'Problem-Solving',
    'A cylinder has volume 628 cm³ and height 10 cm (π = 3.14). What is the radius?',
    '["2 cm","3 cm","4 cm","5 cm"]'::jsonb,
    '4 cm',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 207: ps_post_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_12',
    'Problem-Solving',
    'A child draws an angle measuring 75° and another measuring 105°. What relationship do they have?',
    '["Complementary","Supplementary","Vertical","Congruent"]'::jsonb,
    'Supplementary',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 208: ps_post_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_13',
    'Problem-Solving',
    'What is the area of a triangle with sides 13, 14, and 15?',
    '["42 cm²","84 cm²","210 cm²","100 cm²"]'::jsonb,
    '84 cm²',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 209: ps_post_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_14',
    'Problem-Solving',
    'A rectangular prism is 4 cm × 5 cm × 6 cm. What is its volume?',
    '["60 cm³","100 cm³","120 cm³","240 cm³"]'::jsonb,
    '120 cm³',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 210: ps_post_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_15',
    'Problem-Solving',
    'The base angles of an isosceles triangle measure (x + 10)° each. The vertex angle is (2x – 20)°. Find x.',
    '["30°","40°","50°","60°"]'::jsonb,
    '50°',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 211: ps_post_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_16',
    'Problem-Solving',
    'A ladder leans against a wall forming a right triangle. Ladder = 10 m, base = 6 m. Height?',
    '["6 m","8 m","10 m","12 m"]'::jsonb,
    '8 m',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 212: ps_post_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_17',
    'Problem-Solving',
    'A classroom whiteboard is 3 m × 1.5 m. What is the perimeter?',
    '["6 m","9 m","10 m","12 m"]'::jsonb,
    '9 m',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 213: ps_post_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_18',
    'Problem-Solving',
    'A circle has area 154 cm² (π=22/7). What is the radius?',
    '["5 cm","7 cm","10 cm","14 cm"]'::jsonb,
    '7 cm',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 214: ps_post_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_19',
    'Problem-Solving',
    'A regular decagon has each interior angle measuring…',
    '["120°","135°","144°","150°"]'::jsonb,
    '144°',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 215: ps_post_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_20',
    'Problem-Solving',
    'A cylindrical can has radius 4 cm and height 12 cm. What is its volume?',
    '["48π","96π","128π","192π"]'::jsonb,
    '192π',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 216: ps_post_21
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_21',
    'Problem-Solving',
    'A triangle has angles in the ratio 1:2:3. What is the largest angle?',
    '["60°","90°","120°","180°"]'::jsonb,
    '90°',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 217: ps_post_22
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_22',
    'Problem-Solving',
    'A rectangular garden is 18 m × 12 m. What is the area?',
    '["60 m²","120 m²","180 m²","216 m²"]'::jsonb,
    '216 m²',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 218: ps_post_23
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_23',
    'Problem-Solving',
    'The perimeter of a rhombus is 80 cm. What is the side length?',
    '["10 cm","15 cm","20 cm","40 cm"]'::jsonb,
    '20 cm',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 219: ps_post_24
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_24',
    'Problem-Solving',
    'A cube has volume 216 cm³. What is its edge length?',
    '["4 cm","6 cm","8 cm","12 cm"]'::jsonb,
    '6 cm',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 220: ps_post_25
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'ps_post_25',
    'Problem-Solving',
    'A circle has radius 10 cm. What is its area? (π=3.14)',
    '["62.8 cm²","314 cm²","31.4 cm²","628 cm²"]'::jsonb,
    '314 cm²',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 221: hot_pre_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_01',
    'Higher-Order Thinking',
    'If you double the radius of a circle, how does its area change?',
    '["Twice as large","Three times as large","Four times as large","Eight times as large"]'::jsonb,
    'Four times as large',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 222: hot_pre_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_02',
    'Higher-Order Thinking',
    'Which diagram best represents perpendicular lines?',
    '["Two lines forming an acute angle","Two lines crossing at 90°","Two lines that never meet","Two lines crossing at 45°"]'::jsonb,
    'Two lines crossing at 90°',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 223: hot_pre_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_03',
    'Higher-Order Thinking',
    'A cube and a rectangular prism have the same volume. Which statement is MOST likely true?',
    '["They must have equal lengths of sides","Their shapes are always identical","The cube has shorter edges but more height","They can have different dimensions but same volume"]'::jsonb,
    'They can have different dimensions but same volume',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 224: hot_pre_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_04',
    'Higher-Order Thinking',
    'A student claims a triangle with sides 4, 5, 10 is possible. Evaluate.',
    '["Correctany three numbers make a triangle","Incorrectviolates triangle inequality","Correct10 is the longest side","Correct4 + 5 > 10"]'::jsonb,
    'Incorrectviolates triangle inequality',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 225: hot_pre_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_05',
    'Higher-Order Thinking',
    'A circular table has radius r. If you increase its radius by 20%, what happens to its area?',
    '["It stays the same","It increases by 20%","It increases by more than 20%","It decreases"]'::jsonb,
    'It increases by more than 20%',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 226: hot_pre_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_06',
    'Higher-Order Thinking',
    'Which shape would lose the MOST area if its height is reduced?',
    '["Square","Rectangle","Triangle","Parallelogram"]'::jsonb,
    'Triangle',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 227: hot_pre_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_07',
    'Higher-Order Thinking',
    'A builder needs the strongest support, so he chooses two beams forming a right angle. Why?',
    '["Right angles create symmetry","Right angles distribute weight evenly","Right angles look better","Right angles are the easiest to construct"]'::jsonb,
    'Right angles distribute weight evenly',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 228: hot_pre_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_08',
    'Higher-Order Thinking',
    'What happens to total surface area if all edge lengths of a cube are tripled?',
    '["×3","×6","×9","×27"]'::jsonb,
    '×9',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 229: hot_pre_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_09',
    'Higher-Order Thinking',
    'Which figure CANNOT be the cross-section of a cube?',
    '["Triangle","Square","Pentagon","Rectangle"]'::jsonb,
    'Pentagon',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 230: hot_pre_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_10',
    'Higher-Order Thinking',
    'If two angles are supplementary and one is increased, then the other must…',
    '["Also increase","Stay the same","Decrease","Become complementary"]'::jsonb,
    'Decrease',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 231: hot_pre_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_11',
    'Higher-Order Thinking',
    'A solid has 6 rectangular faces. What shape is it?',
    '["Cube","Cylinder","Rectangular prism","Hexagonal prism"]'::jsonb,
    'Rectangular prism',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 232: hot_pre_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_12',
    'Higher-Order Thinking',
    'Which situation requires using the Pythagorean Theorem?',
    '["Finding area of a garden","Finding distance across a diagonal lot","Finding perimeter of a square","Finding radius from area"]'::jsonb,
    'Finding distance across a diagonal lot',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 233: hot_pre_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_13',
    'Higher-Order Thinking',
    'A student claims all parallelograms are rectangles. Evaluate.',
    '["True","False","True for some","True for squares only"]'::jsonb,
    'False',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 234: hot_pre_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_14',
    'Higher-Order Thinking',
    'Doubling both height and base of a triangle makes its area…',
    '["Twice","Four times","Half","Same"]'::jsonb,
    'Four times',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 235: hot_pre_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_15',
    'Higher-Order Thinking',
    'A shape has 1 curved surface and 2 circular bases. Identify it.',
    '["Cone","Cylinder","Sphere","Prism"]'::jsonb,
    'Cylinder',
    'easy',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 236: hot_pre_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_16',
    'Higher-Order Thinking',
    'A student draws a 3D shape but all edges appear the same length. What is likely the shape?',
    '["Cylinder","Cube","Rectangular prism","Pyramid"]'::jsonb,
    'Cube',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 237: hot_pre_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_17',
    'Higher-Order Thinking',
    'If the sum of two angles increases, what happens to each angle?',
    '["They both increase","Both decrease","One increases, one decreases","Not enough information"]'::jsonb,
    'Not enough information',
    'hard',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 238: hot_pre_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_18',
    'Higher-Order Thinking',
    'A pentagon is regular. Which statement is ALWAYS true?',
    '["All sides equal","All angles equal","Both A and B","Neither"]'::jsonb,
    'Both A and B',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 239: hot_pre_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_19',
    'Higher-Order Thinking',
    'Which change creates the BIGGEST increase in circle circumference?',
    '["Increase radius by 1 cm","Increase diameter by 1 cm","Increase radius by 2 cm","Increase radius by 0.5 cm"]'::jsonb,
    'Increase radius by 2 cm',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 240: hot_pre_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_pre_20',
    'Higher-Order Thinking',
    'Two figures are similar. Which is ALWAYS true?',
    '["Same area","Same shape","Same size","Same perimeter"]'::jsonb,
    'Same shape',
    'medium',
    'pretest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 241: hot_post_01
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_01',
    'Higher-Order Thinking',
    'A cube''s volume is increased by 800%. How must the edge length change?',
    '["×2","×3","×4","×8"]'::jsonb,
    '×3',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 242: hot_post_02
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_02',
    'Higher-Order Thinking',
    'Which transformation changes the SIZE of a figure?',
    '["Translation","Rotation","Reflection","Dilation"]'::jsonb,
    'Dilation',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 243: hot_post_03
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_03',
    'Higher-Order Thinking',
    'A designer doubles the radius of a cylinder but keeps height the same. What happens to volume?',
    '["Doubles","Triples","Quadruples","Decreases"]'::jsonb,
    'Quadruples',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 244: hot_post_04
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_04',
    'Higher-Order Thinking',
    'What shape has the GREATEST area for a fixed perimeter?',
    '["Square","Rectangle","Circle","Triangle"]'::jsonb,
    'Circle',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 245: hot_post_05
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_05',
    'Higher-Order Thinking',
    'Two triangles have equal areas but different heights. How is this possible?',
    '["Their bases adjust to compensate","Impossible","Their shapes are identical","Their perimeters must be equal"]'::jsonb,
    'Their bases adjust to compensate',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 246: hot_post_06
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_06',
    'Higher-Order Thinking',
    'A shape has 5 faces, 9 edges, 6 vertices. What is it?',
    '["Rectangular prism","Triangular pyramid","Square pyramid","Triangular prism"]'::jsonb,
    'Triangular prism',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 247: hot_post_07
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_07',
    'Higher-Order Thinking',
    'A solid''s surface area increases. Which MUST be true?',
    '["Volume increases","Volume decreases","At least one dimension increased","All dimensions increased"]'::jsonb,
    'At least one dimension increased',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 248: hot_post_08
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_08',
    'Higher-Order Thinking',
    'A car turns 90° at an intersection. What type of angle does it make?',
    '["Acute","Obtuse","Right","Reflex"]'::jsonb,
    'Right',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 249: hot_post_09
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_09',
    'Higher-Order Thinking',
    'A student says: "A trapezoid with equal legs is a parallelogram." Evaluate.',
    '["Always true","Sometimes true","Never true","True only if it''s a square"]'::jsonb,
    'Never true',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 250: hot_post_10
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_10',
    'Higher-Order Thinking',
    'What can you say about two triangles with all angles equal but sides not equal?',
    '["Congruent","Similar","Identical","Impossible"]'::jsonb,
    'Similar',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 251: hot_post_11
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_11',
    'Higher-Order Thinking',
    'Which change creates the GREATEST increase in volume?',
    '["Doubling radius of a sphere","Doubling height only","Doubling width only","Doubling length only"]'::jsonb,
    'Doubling radius of a sphere',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 252: hot_post_12
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_12',
    'Higher-Order Thinking',
    'A student folds a paper circle in half. What new figure is formed?',
    '["Sector","Semicircle","Chord","Diameter"]'::jsonb,
    'Semicircle',
    'easy',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 253: hot_post_13
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_13',
    'Higher-Order Thinking',
    'Which statement is ALWAYS true about congruent polygons?',
    '["Same shape","Same area","Same perimeter","All of the above"]'::jsonb,
    'All of the above',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 254: hot_post_14
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_14',
    'Higher-Order Thinking',
    'A city wants to maximize park area using 100 m of fencing. What shape should they build?',
    '["Square","Rectangle","Circle","Triangle"]'::jsonb,
    'Circle',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 255: hot_post_15
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_15',
    'Higher-Order Thinking',
    'A building''s shadow and a stick''s shadow are used to find height of the building. What principle is used?',
    '["Congruent triangles","Vertical angles","Similar triangles","Complementary angles"]'::jsonb,
    'Similar triangles',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 256: hot_post_16
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_16',
    'Higher-Order Thinking',
    'A cube and sphere have equal volume. Which has greater surface area?',
    '["Cube","Sphere","Both equal","Not enough info"]'::jsonb,
    'Cube',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 257: hot_post_17
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_17',
    'Higher-Order Thinking',
    'Two triangles have equal height but one has twice the base. What happens to area?',
    '["Half","Same","Double","Triple"]'::jsonb,
    'Double',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 258: hot_post_18
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_18',
    'Higher-Order Thinking',
    'A radius is increased by 10%. By how much does area increase (approx.)?',
    '["10%","20%","21%","40%"]'::jsonb,
    '21%',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 259: hot_post_19
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_19',
    'Higher-Order Thinking',
    'Which of these is the BEST reason why circles minimize fencing material?',
    '["They are round","They have constant radius","They have max area for fixed perimeter","They look nice"]'::jsonb,
    'They have max area for fixed perimeter',
    'hard',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;

-- Question 260: hot_post_20
INSERT INTO assessment_questions (question_id, category, question, options, correct_answer, difficulty, test_type, points)
VALUES (
    'hot_post_20',
    'Higher-Order Thinking',
    'Which is the MOST efficient cross-section to cut a cylinder into equal parts?',
    '["Horizontal","Vertical","Diagonal","Any"]'::jsonb,
    'Horizontal',
    'medium',
    'posttest',
    1
)
ON CONFLICT (question_id) DO NOTHING;


-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
SELECT 
    category, 
    test_type, 
    COUNT(*) as count 
FROM assessment_questions 
GROUP BY category, test_type 
ORDER BY category, test_type;
