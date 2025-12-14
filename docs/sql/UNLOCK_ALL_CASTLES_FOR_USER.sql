-- =====================================================
-- UNLOCK ALL CASTLES FOR SPECIFIC USER
-- Run this in Supabase SQL Editor
-- =====================================================

-- User ID: 1ba7df82-af92-4854-b6f5-80179ef85605

-- 1. Insert or update progress for all castles to be unlocked
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, total_xp_earned, completion_percentage, started_at, created_at, updated_at)
SELECT 
    '1ba7df82-af92-4854-b6f5-80179ef85605'::uuid as user_id,
    id as castle_id,
    true as unlocked,
    false as completed,
    0 as total_xp_earned,
    0 as completion_percentage,
    NOW() as started_at,
    NOW() as created_at,
    NOW() as updated_at
FROM castles
ON CONFLICT (user_id, castle_id) 
DO UPDATE SET
    unlocked = true,
    started_at = COALESCE(user_castle_progress.started_at, NOW()),
    updated_at = NOW();

-- 2. Unlock the first chapter of each castle
INSERT INTO user_chapter_progress (user_id, chapter_id, unlocked, completed, xp_earned, quiz_passed, started_at, created_at, updated_at)
SELECT 
    '1ba7df82-af92-4854-b6f5-80179ef85605'::uuid as user_id,
    ch.id as chapter_id,
    true as unlocked,
    false as completed,
    0 as xp_earned,
    false as quiz_passed,
    NOW() as started_at,
    NOW() as created_at,
    NOW() as updated_at
FROM chapters ch
WHERE ch.chapter_number = 1
ON CONFLICT (user_id, chapter_id)
DO UPDATE SET
    unlocked = true,
    started_at = COALESCE(user_chapter_progress.started_at, NOW()),
    updated_at = NOW();

-- 3. Verify castle unlocks
SELECT 
    c.name as castle_name,
    c.route,
    c.unlock_order,
    ucp.unlocked as castle_unlocked,
    ucp.completed as castle_completed,
    ucp.total_xp_earned
FROM user_castle_progress ucp
JOIN castles c ON c.id = ucp.castle_id
WHERE ucp.user_id = '1ba7df82-af92-4854-b6f5-80179ef85605'::uuid
ORDER BY c.unlock_order;

-- 4. Verify chapter unlocks (first chapter of each castle)
SELECT 
    c.name as castle_name,
    ch.title as chapter_title,
    ch.chapter_number,
    uchp.unlocked as chapter_unlocked,
    uchp.completed as chapter_completed
FROM user_chapter_progress uchp
JOIN chapters ch ON ch.id = uchp.chapter_id
JOIN castles c ON c.id = ch.castle_id
WHERE uchp.user_id = '1ba7df82-af92-4854-b6f5-80179ef85605'::uuid
    AND ch.chapter_number = 1
ORDER BY c.unlock_order;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ All castles unlocked for user: 1ba7df82-af92-4854-b6f5-80179ef85605';
    RAISE NOTICE '✅ First chapter of each castle unlocked';
    RAISE NOTICE '🎮 The user can now access all castles and their first chapters!';
END $$;
