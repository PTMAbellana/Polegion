-- =====================================================
-- COGNITIVE DOMAIN ANALYSIS - TOP 28 LATEST PRETEST TAKERS
-- Run this in Supabase SQL Editor
-- =====================================================

-- Query 1: Get average performance by cognitive domain (Top 28 latest pretest takers)
-- This provides the summary table you requested
SELECT 
    'Knowledge Recall' as cognitive_domain,
    ROUND(AVG((category_scores->'Knowledge Recall'->>'percentage')::numeric), 1) as pretest_percentage,
    'Pending' as posttest_percentage,
    'To be calculated' as improvement_percentage
FROM (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
) latest_28

UNION ALL

SELECT 
    'Concept Understanding' as cognitive_domain,
    ROUND(AVG((category_scores->'Concept Understanding'->>'percentage')::numeric), 1) as pretest_percentage,
    'Pending' as posttest_percentage,
    'To be calculated' as improvement_percentage
FROM (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
) latest_28

UNION ALL

SELECT 
    'Procedural Skills' as cognitive_domain,
    ROUND(AVG((category_scores->'Procedural Skills'->>'percentage')::numeric), 1) as pretest_percentage,
    'Pending' as posttest_percentage,
    'To be calculated' as improvement_percentage
FROM (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
) latest_28

UNION ALL

SELECT 
    'Analytical Thinking' as cognitive_domain,
    ROUND(AVG((category_scores->'Analytical Thinking'->>'percentage')::numeric), 1) as pretest_percentage,
    'Pending' as posttest_percentage,
    'To be calculated' as improvement_percentage
FROM (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
) latest_28

UNION ALL

SELECT 
    'Problem-Solving' as cognitive_domain,
    ROUND(AVG((category_scores->'Problem-Solving'->>'percentage')::numeric), 1) as pretest_percentage,
    'Pending' as posttest_percentage,
    'To be calculated' as improvement_percentage
FROM (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
) latest_28

UNION ALL

SELECT 
    'Higher-Order Thinking' as cognitive_domain,
    ROUND(AVG((category_scores->'Higher-Order Thinking'->>'percentage')::numeric), 1) as pretest_percentage,
    'Pending' as posttest_percentage,
    'To be calculated' as improvement_percentage
FROM (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
) latest_28

ORDER BY cognitive_domain;


-- =====================================================
-- Query 2: More efficient version using JSON aggregation
-- =====================================================

WITH latest_pretest AS (
    SELECT category_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
),
category_averages AS (
    SELECT 
        'Knowledge Recall' as domain,
        AVG((category_scores->'Knowledge Recall'->>'percentage')::numeric) as avg_pct
    FROM latest_pretest
    UNION ALL
    SELECT 
        'Concept Understanding',
        AVG((category_scores->'Concept Understanding'->>'percentage')::numeric)
    FROM latest_pretest
    UNION ALL
    SELECT 
        'Procedural Skills',
        AVG((category_scores->'Procedural Skills'->>'percentage')::numeric)
    FROM latest_pretest
    UNION ALL
    SELECT 
        'Analytical Thinking',
        AVG((category_scores->'Analytical Thinking'->>'percentage')::numeric)
    FROM latest_pretest
    UNION ALL
    SELECT 
        'Problem-Solving',
        AVG((category_scores->'Problem-Solving'->>'percentage')::numeric)
    FROM latest_pretest
    UNION ALL
    SELECT 
        'Higher-Order Thinking',
        AVG((category_scores->'Higher-Order Thinking'->>'percentage')::numeric)
    FROM latest_pretest
)
SELECT 
    domain as "Cognitive Domain",
    ROUND(avg_pct, 1) || '%' as "Pretest (%)",
    'Pending' as "Posttest (%)",
    'To be calculated' as "Improvement (%)"
FROM category_averages
ORDER BY domain;


-- =====================================================
-- Query 3: With posttest data included (when available)
-- This will show actual posttest results and calculate improvement
-- =====================================================

WITH latest_pretest AS (
    SELECT 
        user_id,
        category_scores as pretest_scores
    FROM user_assessment_results
    WHERE test_type = 'pretest'
    ORDER BY completed_at DESC
    LIMIT 28
),
posttest_data AS (
    SELECT 
        user_id,
        category_scores as posttest_scores
    FROM user_assessment_results
    WHERE test_type = 'posttest'
    AND user_id IN (SELECT user_id FROM latest_pretest)
),
combined_data AS (
    SELECT 
        lp.user_id,
        lp.pretest_scores,
        pd.posttest_scores
    FROM latest_pretest lp
    LEFT JOIN posttest_data pd ON lp.user_id = pd.user_id
)
SELECT 
    'Knowledge Recall' as "Cognitive Domain",
    ROUND(AVG((pretest_scores->'Knowledge Recall'->>'percentage')::numeric), 1) || '%' as "Pretest (%)",
    COALESCE(
        ROUND(AVG((posttest_scores->'Knowledge Recall'->>'percentage')::numeric), 1) || '%',
        'Pending'
    ) as "Posttest (%)",
    COALESCE(
        ROUND(
            AVG((posttest_scores->'Knowledge Recall'->>'percentage')::numeric) - 
            AVG((pretest_scores->'Knowledge Recall'->>'percentage')::numeric), 
            1
        ) || '%',
        'To be calculated'
    ) as "Improvement (%)"
FROM combined_data

UNION ALL

SELECT 
    'Concept Understanding',
    ROUND(AVG((pretest_scores->'Concept Understanding'->>'percentage')::numeric), 1) || '%',
    COALESCE(
        ROUND(AVG((posttest_scores->'Concept Understanding'->>'percentage')::numeric), 1) || '%',
        'Pending'
    ),
    COALESCE(
        ROUND(
            AVG((posttest_scores->'Concept Understanding'->>'percentage')::numeric) - 
            AVG((pretest_scores->'Concept Understanding'->>'percentage')::numeric), 
            1
        ) || '%',
        'To be calculated'
    )
FROM combined_data

UNION ALL

SELECT 
    'Procedural Skills',
    ROUND(AVG((pretest_scores->'Procedural Skills'->>'percentage')::numeric), 1) || '%',
    COALESCE(
        ROUND(AVG((posttest_scores->'Procedural Skills'->>'percentage')::numeric), 1) || '%',
        'Pending'
    ),
    COALESCE(
        ROUND(
            AVG((posttest_scores->'Procedural Skills'->>'percentage')::numeric) - 
            AVG((pretest_scores->'Procedural Skills'->>'percentage')::numeric), 
            1
        ) || '%',
        'To be calculated'
    )
FROM combined_data

UNION ALL

SELECT 
    'Analytical Thinking',
    ROUND(AVG((pretest_scores->'Analytical Thinking'->>'percentage')::numeric), 1) || '%',
    COALESCE(
        ROUND(AVG((posttest_scores->'Analytical Thinking'->>'percentage')::numeric), 1) || '%',
        'Pending'
    ),
    COALESCE(
        ROUND(
            AVG((posttest_scores->'Analytical Thinking'->>'percentage')::numeric) - 
            AVG((pretest_scores->'Analytical Thinking'->>'percentage')::numeric), 
            1
        ) || '%',
        'To be calculated'
    )
FROM combined_data

UNION ALL

SELECT 
    'Problem-Solving',
    ROUND(AVG((pretest_scores->'Problem-Solving'->>'percentage')::numeric), 1) || '%',
    COALESCE(
        ROUND(AVG((posttest_scores->'Problem-Solving'->>'percentage')::numeric), 1) || '%',
        'Pending'
    ),
    COALESCE(
        ROUND(
            AVG((posttest_scores->'Problem-Solving'->>'percentage')::numeric) - 
            AVG((pretest_scores->'Problem-Solving'->>'percentage')::numeric), 
            1
        ) || '%',
        'To be calculated'
    )
FROM combined_data

UNION ALL

SELECT 
    'Higher-Order Thinking',
    ROUND(AVG((pretest_scores->'Higher-Order Thinking'->>'percentage')::numeric), 1) || '%',
    COALESCE(
        ROUND(AVG((posttest_scores->'Higher-Order Thinking'->>'percentage')::numeric), 1) || '%',
        'Pending'
    ),
    COALESCE(
        ROUND(
            AVG((posttest_scores->'Higher-Order Thinking'->>'percentage')::numeric) - 
            AVG((pretest_scores->'Higher-Order Thinking'->>'percentage')::numeric), 
            1
        ) || '%',
        'To be calculated'
    )
FROM combined_data

ORDER BY "Cognitive Domain";


-- =====================================================
-- Query 4: Individual student performance (Top 28)
-- Shows each student's performance across all domains
-- =====================================================

WITH latest_pretest AS (
    SELECT 
        uar.user_id,
        uar.completed_at,
        uar.category_scores,
        u.first_name,
        u.last_name,
        ROW_NUMBER() OVER (ORDER BY uar.completed_at DESC) as rank
    FROM user_assessment_results uar
    LEFT JOIN user_profiles u ON uar.user_id = u.user_id
    WHERE uar.test_type = 'pretest'
    ORDER BY uar.completed_at DESC
    LIMIT 28
)
SELECT 
    rank as "Rank",
    first_name || ' ' || last_name as "Student Name",
    (category_scores->'Knowledge Recall'->>'percentage')::numeric || '%' as "Knowledge Recall",
    (category_scores->'Concept Understanding'->>'percentage')::numeric || '%' as "Concept Understanding",
    (category_scores->'Procedural Skills'->>'percentage')::numeric || '%' as "Procedural Skills",
    (category_scores->'Analytical Thinking'->>'percentage')::numeric || '%' as "Analytical Thinking",
    (category_scores->'Problem-Solving'->>'percentage')::numeric || '%' as "Problem-Solving",
    (category_scores->'Higher-Order Thinking'->>'percentage')::numeric || '%' as "Higher-Order Thinking",
    TO_CHAR(completed_at, 'YYYY-MM-DD HH24:MI:SS') as "Completed At"
FROM latest_pretest
ORDER BY rank;


-- =====================================================
-- NOTES
-- =====================================================

-- Note 1: The assessment uses "Higher-Order Thinking" instead of "Spatial Reasoning"
-- If you need to rename it, modify the SELECT statements above

-- Note 2: To change from top 28 to a different number, change LIMIT 28

-- Note 3: Query 2 is the most efficient for just getting the summary table

-- Note 4: Query 3 will automatically show posttest data and calculate improvement
-- when posttest data becomes available for these students

-- Note 5: To get ALL pretest takers (not just top 28), remove the LIMIT clause
