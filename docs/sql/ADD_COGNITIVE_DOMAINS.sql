-- ============================================
-- COGNITIVE DOMAIN ENHANCEMENTS
-- ============================================
-- Add cognitive domain tracking to adaptive learning system
-- Based on Bloom's Taxonomy educational framework
-- 
-- 6 Cognitive Domains:
-- - KR (Knowledge Recall): Basic facts and formulas
-- - CU (Concept Understanding): Relationships between concepts
-- - PS (Procedural Skills): Step-by-step calculations
-- - AT (Analytical Thinking): Multi-step reasoning
-- - PS+ (Problem Solving): Real-world applications
-- - HOT (Higher Order Thinking): Creative/complex reasoning
--
-- Created: January 3, 2026
-- ============================================

-- Create ENUM type for cognitive domains
DO $$ BEGIN
    CREATE TYPE cognitive_domain AS ENUM (
        'knowledge_recall',
        'concept_understanding',
        'procedural_skills',
        'analytical_thinking',
        'problem_solving',
        'higher_order_thinking'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 1. ADD COGNITIVE DOMAIN TO STUDENT TRACKING
-- ============================================

-- Add current_cognitive_domain to student_difficulty_levels table
ALTER TABLE student_difficulty_levels
ADD COLUMN IF NOT EXISTS current_cognitive_domain cognitive_domain DEFAULT 'knowledge_recall',
ADD COLUMN IF NOT EXISTS cognitive_domain_mastery JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cognitive_domain_history TEXT[] DEFAULT '{}';

-- Add comment explaining the columns
COMMENT ON COLUMN student_difficulty_levels.current_cognitive_domain IS 
'Current cognitive domain level based on student performance and mastery';

COMMENT ON COLUMN student_difficulty_levels.cognitive_domain_mastery IS 
'JSON object tracking mastery % for each cognitive domain: {"knowledge_recall": 75, "procedural_skills": 60, ...}';

COMMENT ON COLUMN student_difficulty_levels.cognitive_domain_history IS 
'Array tracking progression through cognitive domains over time';

-- ============================================
-- 2. ADD COGNITIVE DOMAIN TO STATE TRANSITIONS
-- ============================================

-- Add cognitive_domain to mdp_state_transitions for research tracking
ALTER TABLE mdp_state_transitions
ADD COLUMN IF NOT EXISTS cognitive_domain cognitive_domain,
ADD COLUMN IF NOT EXISTS cognitive_domain_changed BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN mdp_state_transitions.cognitive_domain IS 
'Cognitive domain of the question presented in this transition';

COMMENT ON COLUMN mdp_state_transitions.cognitive_domain_changed IS 
'Whether the MDP system switched cognitive domains during this transition';

-- ============================================
-- 3. CREATE COGNITIVE DOMAIN ANALYTICS VIEW
-- ============================================

CREATE OR REPLACE VIEW cognitive_domain_analytics AS
SELECT 
    sdl.user_id,
    sdl.chapter_id,
    sdl.current_cognitive_domain,
    sdl.mastery_level as overall_mastery,
    sdl.difficulty_level,
    
    -- Performance by cognitive domain
    COUNT(CASE WHEN mst.cognitive_domain = 'knowledge_recall' AND mst.was_correct THEN 1 END) as kr_correct,
    COUNT(CASE WHEN mst.cognitive_domain = 'knowledge_recall' AND NOT mst.was_correct THEN 1 END) as kr_wrong,
    
    COUNT(CASE WHEN mst.cognitive_domain = 'concept_understanding' AND mst.was_correct THEN 1 END) as cu_correct,
    COUNT(CASE WHEN mst.cognitive_domain = 'concept_understanding' AND NOT mst.was_correct THEN 1 END) as cu_wrong,
    
    COUNT(CASE WHEN mst.cognitive_domain = 'procedural_skills' AND mst.was_correct THEN 1 END) as ps_correct,
    COUNT(CASE WHEN mst.cognitive_domain = 'procedural_skills' AND NOT mst.was_correct THEN 1 END) as ps_wrong,
    
    COUNT(CASE WHEN mst.cognitive_domain = 'analytical_thinking' AND mst.was_correct THEN 1 END) as at_correct,
    COUNT(CASE WHEN mst.cognitive_domain = 'analytical_thinking' AND NOT mst.was_correct THEN 1 END) as at_wrong,
    
    COUNT(CASE WHEN mst.cognitive_domain = 'problem_solving' AND mst.was_correct THEN 1 END) as psp_correct,
    COUNT(CASE WHEN mst.cognitive_domain = 'problem_solving' AND NOT mst.was_correct THEN 1 END) as psp_wrong,
    
    COUNT(CASE WHEN mst.cognitive_domain = 'higher_order_thinking' AND mst.was_correct THEN 1 END) as hot_correct,
    COUNT(CASE WHEN mst.cognitive_domain = 'higher_order_thinking' AND NOT mst.was_correct THEN 1 END) as hot_wrong,
    
    -- Total attempts and accuracy
    COUNT(*) as total_attempts,
    ROUND(AVG(CASE WHEN mst.was_correct THEN 100 ELSE 0 END), 2) as overall_accuracy
    
FROM student_difficulty_levels sdl
LEFT JOIN mdp_state_transitions mst ON sdl.user_id = mst.user_id AND sdl.chapter_id = mst.chapter_id
GROUP BY sdl.user_id, sdl.chapter_id, sdl.current_cognitive_domain, sdl.mastery_level, sdl.difficulty_level;

COMMENT ON VIEW cognitive_domain_analytics IS 
'Analytics view showing student performance broken down by cognitive domain';

-- ============================================
-- 4. CREATE COGNITIVE DOMAIN PROGRESSION FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION update_cognitive_domain_progression(
    p_user_id UUID,
    p_chapter_id UUID,
    p_cognitive_domain cognitive_domain,
    p_mastery_change NUMERIC
)
RETURNS cognitive_domain
LANGUAGE plpgsql
AS $$
DECLARE
    v_current_mastery JSONB;
    v_domain_mastery NUMERIC;
    v_new_domain cognitive_domain;
BEGIN
    -- Get current cognitive domain mastery levels
    SELECT cognitive_domain_mastery INTO v_current_mastery
    FROM student_difficulty_levels
    WHERE user_id = p_user_id AND chapter_id = p_chapter_id;
    
    -- Initialize if null
    IF v_current_mastery IS NULL THEN
        v_current_mastery := '{}'::JSONB;
    END IF;
    
    -- Update mastery for the current domain
    v_domain_mastery := COALESCE((v_current_mastery->>p_cognitive_domain::TEXT)::NUMERIC, 50);
    v_domain_mastery := v_domain_mastery + p_mastery_change;
    v_domain_mastery := GREATEST(0, LEAST(100, v_domain_mastery)); -- Clamp 0-100
    
    v_current_mastery := jsonb_set(
        v_current_mastery,
        ARRAY[p_cognitive_domain::TEXT],
        to_jsonb(v_domain_mastery)
    );
    
    -- Determine if student should progress to next cognitive domain
    v_new_domain := p_cognitive_domain;
    
    IF v_domain_mastery >= 80 THEN
        -- Student has mastered this domain, advance to next
        v_new_domain := CASE p_cognitive_domain
            WHEN 'knowledge_recall' THEN 'concept_understanding'
            WHEN 'concept_understanding' THEN 'procedural_skills'
            WHEN 'procedural_skills' THEN 'analytical_thinking'
            WHEN 'analytical_thinking' THEN 'problem_solving'
            WHEN 'problem_solving' THEN 'higher_order_thinking'
            ELSE 'higher_order_thinking'
        END;
    ELSIF v_domain_mastery < 30 THEN
        -- Student struggling, may need to go back
        v_new_domain := CASE p_cognitive_domain
            WHEN 'higher_order_thinking' THEN 'problem_solving'
            WHEN 'problem_solving' THEN 'analytical_thinking'
            WHEN 'analytical_thinking' THEN 'procedural_skills'
            WHEN 'procedural_skills' THEN 'concept_understanding'
            WHEN 'concept_understanding' THEN 'knowledge_recall'
            ELSE 'knowledge_recall'
        END;
    END IF;
    
    -- Update student record
    UPDATE student_difficulty_levels
    SET 
        current_cognitive_domain = v_new_domain,
        cognitive_domain_mastery = v_current_mastery,
        cognitive_domain_history = array_append(cognitive_domain_history, p_cognitive_domain::TEXT)
    WHERE user_id = p_user_id AND chapter_id = p_chapter_id;
    
    RETURN v_new_domain;
END;
$$;

COMMENT ON FUNCTION update_cognitive_domain_progression IS 
'Updates cognitive domain mastery and determines if student should progress/regress to different domain';

-- ============================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for querying by cognitive domain
CREATE INDEX IF NOT EXISTS idx_student_cognitive_domain 
ON student_difficulty_levels(current_cognitive_domain);

CREATE INDEX IF NOT EXISTS idx_transitions_cognitive_domain 
ON mdp_state_transitions(cognitive_domain);

-- Composite index for analytics queries
CREATE INDEX IF NOT EXISTS idx_transitions_user_chapter_domain 
ON mdp_state_transitions(user_id, chapter_id, cognitive_domain);

-- ============================================
-- 6. SAMPLE QUERY - Cognitive Domain Report
-- ============================================

-- Query to see cognitive domain performance for a student
/*
SELECT 
    user_id,
    chapter_id,
    current_cognitive_domain,
    cognitive_domain_mastery,
    overall_mastery,
    difficulty_level,
    total_attempts,
    overall_accuracy
FROM cognitive_domain_analytics
WHERE user_id = '<USER_ID>'
ORDER BY chapter_id;
*/

-- Query to see cognitive domain distribution across all students
/*
SELECT 
    current_cognitive_domain,
    COUNT(DISTINCT user_id) as student_count,
    ROUND(AVG(overall_mastery), 2) as avg_mastery,
    ROUND(AVG(overall_accuracy), 2) as avg_accuracy
FROM cognitive_domain_analytics
GROUP BY current_cognitive_domain
ORDER BY 
    CASE current_cognitive_domain
        WHEN 'knowledge_recall' THEN 1
        WHEN 'concept_understanding' THEN 2
        WHEN 'procedural_skills' THEN 3
        WHEN 'analytical_thinking' THEN 4
        WHEN 'problem_solving' THEN 5
        WHEN 'higher_order_thinking' THEN 6
    END;
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if columns were added successfully
SELECT 
    column_name, 
    data_type, 
    column_default
FROM information_schema.columns
WHERE table_name = 'student_difficulty_levels'
  AND column_name IN ('current_cognitive_domain', 'cognitive_domain_mastery', 'cognitive_domain_history');

-- Check mdp_state_transitions updates
SELECT 
    column_name, 
    data_type
FROM information_schema.columns
WHERE table_name = 'mdp_state_transitions'
  AND column_name IN ('cognitive_domain', 'cognitive_domain_changed');

-- Verify enum type exists
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = 'cognitive_domain'::regtype
ORDER BY enumsortorder;
