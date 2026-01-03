-- ================================================================
-- STEP 1: Check What Tables You Have
-- Run this ENTIRE script - it's safe even if tables don't exist
-- ================================================================
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
