-- =====================================================
-- GEOMETRY ASSESSMENT QUESTIONS - MAIN INDEX
-- Organized by Topics
-- =====================================================
-- 
-- This is the main entry point for loading all geometry
-- assessment questions into the database.
--
-- STRUCTURE:
-- - Base template with common utilities
-- - Topic-specific question files
-- - Organized by geometry concepts
--
-- USAGE:
-- Run this file in your PostgreSQL database:
--   psql -U your_user -d your_database -f index.sql
--
-- Or from Supabase SQL editor:
--   Copy and paste the contents of this file
--
-- =====================================================

-- Display banner
DO $$ 
BEGIN
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'LOADING GEOMETRY ASSESSMENT QUESTIONS';
    RAISE NOTICE 'Organized by Topics - Modular Structure';
    RAISE NOTICE '=======================================================';
END $$;

-- =====================================================
-- STEP 1: Load Base Template (Parent Class)
-- =====================================================
\i questions/base_geometry_questions.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded base geometry questions template';
END $$;

-- =====================================================
-- STEP 2: Load Topic-Specific Questions
-- =====================================================

-- Topic 1: Points, Lines, and Planes (Foundation)
\i questions/topics/01_points_lines_planes.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded Topic 1: Points, Lines, and Planes';
END $$;

-- Topic 2: Angles (Measurement & Types)
\i questions/topics/02_angles.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded Topic 2: Angles';
END $$;

-- Topic 3: Polygons (2D Shapes)
\i questions/topics/03_polygons.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded Topic 3: Polygons';
END $$;

-- Topic 4: Triangles (Special Properties)
\i questions/topics/04_triangles.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded Topic 4: Triangles';
END $$;

-- Topic 5: Circles (Curved Shapes)
\i questions/topics/05_circles.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded Topic 5: Circles';
END $$;

-- Topic 6: 3D Shapes (Solid Figures)
\i questions/topics/06_3d_shapes.sql

DO $$ 
BEGIN
    RAISE NOTICE '✓ Loaded Topic 6: 3D Shapes';
END $$;

-- =====================================================
-- STEP 3: Verify and Display Statistics
-- =====================================================

DO $$ 
DECLARE
    total_count INTEGER;
    pretest_count INTEGER;
    posttest_count INTEGER;
    topic_counts TEXT;
BEGIN
    -- Count total questions
    SELECT COUNT(*) INTO total_count FROM assessment_questions;
    
    -- Count by test type
    SELECT COUNT(*) INTO pretest_count FROM assessment_questions WHERE test_type = 'pretest';
    SELECT COUNT(*) INTO posttest_count FROM assessment_questions WHERE test_type = 'posttest';
    
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'LOADING COMPLETE!';
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'Total Questions: %', total_count;
    RAISE NOTICE 'Pretest Questions: %', pretest_count;
    RAISE NOTICE 'Posttest Questions: %', posttest_count;
    RAISE NOTICE '=======================================================';
    RAISE NOTICE 'Questions by Category:';
    
    -- Display count by category
    FOR topic_counts IN 
        SELECT category || ': ' || COUNT(*)::TEXT 
        FROM assessment_questions 
        GROUP BY category 
        ORDER BY category
    LOOP
        RAISE NOTICE '  %', topic_counts;
    END LOOP;
    
    RAISE NOTICE '=======================================================';
END $$;

-- =====================================================
-- END OF GEOMETRY QUESTIONS LOADING
-- =====================================================
