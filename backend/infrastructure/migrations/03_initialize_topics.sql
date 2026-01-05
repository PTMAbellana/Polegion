-- ================================================================
-- MIGRATION: Initialize Topics for Existing Users
-- Created: January 5, 2026
-- Purpose: Unlock Topic 1 for all EXISTING users
-- Note: New users will have topics initialized automatically via AuthController
-- ================================================================

-- First, show all available topics to verify data
SELECT id, topic_code, topic_name, cognitive_domain
FROM adaptive_learning_topics
ORDER BY topic_code
LIMIT 10;

-- Unlock first topic for all existing users
-- Using ORDER BY created_at to get the first topic created
INSERT INTO user_topic_progress (user_id, topic_id, unlocked, mastery_level, unlocked_at)
SELECT 
  u.id as user_id,
  (SELECT id FROM adaptive_learning_topics ORDER BY created_at ASC LIMIT 1) as topic_id,
  TRUE as unlocked,
  0 as mastery_level,
  NOW() as unlocked_at
FROM auth.users u
WHERE EXISTS (SELECT 1 FROM adaptive_learning_topics)
  AND (SELECT id FROM adaptive_learning_topics ORDER BY created_at ASC LIMIT 1) IS NOT NULL
ON CONFLICT (user_id, topic_id) 
DO UPDATE SET 
  unlocked = TRUE,
  unlocked_at = COALESCE(user_topic_progress.unlocked_at, NOW());

-- Show results
SELECT 
  COUNT(DISTINCT utp.user_id) as users_initialized,
  t.topic_code,
  t.topic_name as unlocked_topic
FROM user_topic_progress utp
JOIN adaptive_learning_topics t ON utp.topic_id = t.id
WHERE utp.unlocked = TRUE
GROUP BY t.topic_code, t.topic_name
ORDER BY COUNT(DISTINCT utp.user_id) DESC;
