-- ================================================================
-- STEP 1: Check What Tables You Have in PUBLIC schema
-- ================================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ================================================================
-- STEP 2: Check if you have chapters table
-- ================================================================
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'chapters' AND table_schema = 'public';

-- ================================================================
-- STEP 3: Check if you have castles table
-- ================================================================
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'castles' AND table_schema = 'public';

-- ================================================================
-- STEP 4: See sample castle/chapter data
-- ================================================================
SELECT * FROM castles LIMIT 5;

SELECT id, title, castle_id FROM chapters LIMIT 10;

-- ================================================================
-- STEP 5: Check auth.users table
-- ================================================================
SELECT id, email FROM auth.users LIMIT 5;
