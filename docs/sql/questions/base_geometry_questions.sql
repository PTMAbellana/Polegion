-- =====================================================
-- BASE GEOMETRY QUESTIONS TEMPLATE
-- Parent Class/Template for All Geometry Question Topics
-- =====================================================
-- 
-- This file defines the common structure and utilities
-- that all geometry question topic files should follow.
--
-- STRUCTURE:
-- - Each question has a unique question_id
-- - Categories: Knowledge Recall, Concept Understanding, 
--   Procedural Skills, Analytical Thinking, Problem Solving, Higher Order
-- - Test Types: pretest, posttest
-- - Difficulties: easy, medium, hard
--
-- NAMING CONVENTION:
-- question_id format: {category_abbrev}_{test_type}_{number}
-- Examples:
--   - kr_pre_01  (Knowledge Recall, Pretest, Question 1)
--   - cu_post_15 (Concept Understanding, Posttest, Question 15)
--   - ps_pre_07  (Procedural Skills, Pretest, Question 7)
--
-- CATEGORY ABBREVIATIONS:
--   kr = Knowledge Recall
--   cu = Concept Understanding
--   ps = Procedural Skills
--   at = Analytical Thinking
--   pb = Problem Solving
--   ho = Higher Order
--
-- =====================================================

-- Common function to insert question with conflict handling
-- This ensures questions can be re-run without duplicates
CREATE OR REPLACE FUNCTION insert_geometry_question(
    p_question_id TEXT,
    p_category TEXT,
    p_question TEXT,
    p_options JSONB,
    p_correct_answer TEXT,
    p_difficulty TEXT,
    p_test_type TEXT,
    p_points INTEGER DEFAULT 1
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO assessment_questions (
        question_id, 
        category, 
        question, 
        options, 
        correct_answer, 
        difficulty, 
        test_type, 
        points
    )
    VALUES (
        p_question_id,
        p_category,
        p_question,
        p_options,
        p_correct_answer,
        p_difficulty,
        p_test_type,
        p_points
    )
    ON CONFLICT (question_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TOPIC ORGANIZATION
-- =====================================================
--
-- All geometry questions are organized by topic:
--
-- 1. POINTS, LINES, AND PLANES (Foundation)
--    - Points (location with no size)
--    - Lines (infinite straight paths)
--    - Line segments (parts of lines with endpoints)
--    - Rays (lines with one endpoint)
--    - Planes (flat surfaces)
--
-- 2. ANGLES (Measurement & Types)
--    - Angle definition and vertex
--    - Measuring angles (degrees)
--    - Angle types (acute, right, obtuse, straight, reflex)
--    - Angle relationships (complementary, supplementary, vertical)
--
-- 3. POLYGONS (2D Shapes)
--    - Polygon definition (closed figures)
--    - Triangle types (equilateral, isosceles, scalene, right)
--    - Quadrilaterals (square, rectangle, parallelogram, trapezoid)
--    - Other polygons (pentagon, hexagon, heptagon, octagon)
--    - Regular vs irregular polygons
--    - Perimeter and area
--
-- 4. TRIANGLES (Special Properties)
--    - Triangle inequality theorem
--    - Sum of angles (180°)
--    - Triangle classification (by sides and angles)
--    - Pythagorean theorem
--    - Congruence and similarity
--
-- 5. CIRCLES (Curved Shapes)
--    - Circle definition (all points equidistant from center)
--    - Radius and diameter
--    - Chord, arc, sector, segment
--    - Tangent and secant
--    - Circumference and area (πr², 2πr)
--
-- 6. 3D SHAPES (Solid Figures)
--    - Polyhedra (prisms, pyramids)
--    - Curved solids (cylinder, cone, sphere)
--    - Faces, edges, vertices
--    - Surface area and volume
--    - Cross-sections and nets
--
-- =====================================================

-- Helper function to validate question structure
CREATE OR REPLACE FUNCTION validate_question_structure(
    p_question_id TEXT,
    p_options JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    option_count INTEGER;
BEGIN
    -- Check question_id format (should match pattern)
    IF p_question_id !~ '^(kr|cu|ps|at|pb|ho)_(pre|post)_\d+$' THEN
        RAISE WARNING 'Invalid question_id format: %', p_question_id;
        RETURN FALSE;
    END IF;
    
    -- Check options count (should be exactly 4)
    option_count := jsonb_array_length(p_options);
    IF option_count != 4 THEN
        RAISE WARNING 'Question % has % options, expected 4', p_question_id, option_count;
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- USAGE EXAMPLE
-- =====================================================
--
-- To add a new question, use the insert_geometry_question function:
--
-- SELECT insert_geometry_question(
--     'kr_pre_01',                                    -- question_id
--     'Knowledge Recall',                              -- category
--     'Which of the following is a location with no size?',  -- question
--     '["Line","Point","Ray","Plane"]'::jsonb,        -- options
--     'Point',                                         -- correct_answer
--     'easy',                                          -- difficulty
--     'pretest',                                       -- test_type
--     1                                                -- points
-- );
--
-- =====================================================
