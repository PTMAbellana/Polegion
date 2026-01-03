-- =====================================================
-- FETCH PRETEST SUBMISSIONS FROM 11 AM ON DEC 18, 2025
-- Run these queries in Supabase SQL Editor
-- =====================================================

-- Query 1: Get all pretest submissions from 11 AM onwards with user details
-- This is the main query you'll need
SELECT 
    uar.id,
    uar.user_id,
    uar.test_type,
    uar.total_score,
    uar.max_score,
    uar.percentage,
    uar.category_scores,
    uar.completed_at,
    uar.started_at,
    uar.ended_at,
    uar.duration_seconds,
    u.first_name,
    u.last_name,
    u.role
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
ORDER BY uar.completed_at ASC;


-- Query 2: Get summary statistics of pretest submissions from 11 AM onwards
SELECT 
    COUNT(*) as total_submissions,
    AVG(percentage) as average_percentage,
    MAX(percentage) as highest_percentage,
    MIN(percentage) as lowest_percentage,
    AVG(duration_seconds) as average_duration_seconds
FROM user_assessment_results
WHERE test_type = 'pretest'
  AND completed_at >= '2025-12-18 11:00:00';


-- Query 3: Get pretest submissions grouped by role
SELECT 
    u.role,
    COUNT(*) as submission_count,
    AVG(uar.percentage) as average_percentage,
    MAX(uar.percentage) as highest_percentage,
    MIN(uar.percentage) as lowest_percentage
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
GROUP BY u.role
ORDER BY u.role;


-- Query 4: Get detailed pretest submissions with all individual question attempts
SELECT 
    uar.id as result_id,
    u.first_name,
    u.last_name,
    u.role,
    uar.total_score,
    uar.percentage,
    uar.completed_at,
    uaa.question_id,
    aq.question,
    aq.category,
    uaa.user_answer,
    uaa.is_correct,
    uaa.points_earned,
    uaa.answered_at
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
LEFT JOIN user_assessment_attempts uaa ON uar.user_id = uaa.user_id AND uar.test_type = uaa.test_type
LEFT JOIN assessment_questions aq ON uaa.question_id = aq.id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
ORDER BY uar.completed_at ASC, uaa.answered_at ASC;


-- Query 5: Get category-wise performance for each student from 11 AM onwards
SELECT 
    u.first_name,
    u.last_name,
    u.role,
    uar.completed_at,
    uar.percentage as overall_percentage,
    uar.category_scores
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
ORDER BY uar.completed_at ASC;


-- Query 6: Get only students who scored below 60% (failing score)
SELECT 
    u.first_name,
    u.last_name,
    u.role,
    uar.total_score,
    uar.max_score,
    uar.percentage,
    uar.completed_at,
    uar.duration_seconds
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
  AND uar.percentage < 60
ORDER BY uar.percentage ASC;


-- Query 7: Get students who scored 80% or higher
SELECT 
    u.first_name,
    u.last_name,
    u.role,
    uar.total_score,
    uar.max_score,
    uar.percentage,
    uar.completed_at
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
  AND uar.percentage >= 80
ORDER BY uar.percentage DESC;


-- Query 8: Get pretest submissions within a specific time range (11 AM to 12 PM)
SELECT 
    u.first_name,
    u.last_name,
    u.role,
    uar.percentage,
    uar.completed_at
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
  AND uar.completed_at < '2025-12-18 12:00:00'
ORDER BY uar.completed_at ASC;


-- Query 9: Export-ready format with all essential information
SELECT 
    ROW_NUMBER() OVER (ORDER BY uar.completed_at) as row_num,
    u.first_name || ' ' || u.last_name as student_name,
    u.role,
    uar.total_score || ' / ' || uar.max_score as score,
    ROUND(uar.percentage, 2) || '%' as percentage,
    CONCAT(
        FLOOR(uar.duration_seconds / 60), 'm ',
        MOD(uar.duration_seconds, 60), 's'
    ) as duration,
    TO_CHAR(uar.completed_at, 'YYYY-MM-DD HH24:MI:SS') as completed_at
FROM user_assessment_results uar
LEFT JOIN user_profiles u ON uar.user_id = u.user_id
WHERE uar.test_type = 'pretest'
  AND uar.completed_at >= '2025-12-18 11:00:00'
ORDER BY uar.completed_at ASC;


-- Query 10: Count of submissions per hour
SELECT 
    DATE_TRUNC('hour', completed_at) as hour,
    COUNT(*) as submission_count
FROM user_assessment_results
WHERE test_type = 'pretest'
  AND completed_at >= '2025-12-18 11:00:00'
GROUP BY DATE_TRUNC('hour', completed_at)
ORDER BY hour;


-- =====================================================
-- CUSTOMIZATION OPTIONS
-- =====================================================

-- To change the start time, replace '2025-12-18 11:00:00' with your desired timestamp
-- Example: '2025-12-18 09:00:00' for 9 AM
-- Example: '2025-12-18 14:30:00' for 2:30 PM

-- To get ALL pretest submissions (no time filter), remove the line:
-- AND uar.completed_at >= '2025-12-18 11:00:00'

-- To filter by specific role, add:
-- AND u.role = 'student'

-- To get data for a specific date range, use:
-- AND uar.completed_at >= '2025-12-18 11:00:00'
-- AND uar.completed_at <= '2025-12-18 23:59:59'
