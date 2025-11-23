-- =====================================================
-- CASTLE 0 & CASTLE 6 - ASSESSMENT CASTLES
-- Pretest and Posttest Castles
-- Run this in Supabase SQL Editor after main schema
-- =====================================================

-- Castle 0: The Trial Grounds (Pretest)
-- Unlock order 0 means it's available from the start
INSERT INTO castles (id, name, description, difficulty, region, route, image_number, total_xp, unlock_order)
VALUES 
  (
    'a0b1c2d3-0000-4000-a000-000000000000',
    'The Trial Grounds',
    'Prove your worth before embarking on your geometric journey. Take the assessment to help us understand your current knowledge.',
    'Assessment',
    'The Entrance',
    'castle0',
    0,
    0,
    0
  )
ON CONFLICT (id) DO NOTHING;

-- Castle 6: The Grand Championship (Posttest)
-- Unlock order 6 means it unlocks after Castle 5
INSERT INTO castles (id, name, description, difficulty, region, route, image_number, total_xp, unlock_order)
VALUES 
  (
    'a0b1c2d3-0006-4000-a000-000000000006',
    'The Grand Championship',
    'You have conquered all five kingdoms! Now prove your mastery in the Grand Championship and see how much you have grown.',
    'Assessment',
    'The Arena of Champions',
    'castle6',
    6,
    0,
    6
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- CASTLE 0 - CHAPTER 1: PRETEST ASSESSMENT
-- =====================================================

-- Chapter for pretest
INSERT INTO chapters (id, castle_id, title, description, chapter_number, xp_reward)
VALUES 
  (
    'a0b1c2d3-0000-4001-a001-000000000001',
    'a0b1c2d3-0000-4000-a000-000000000000',
    'The Guardian''s Assessment',
    'Answer the Guardian''s questions to begin your journey through the Kingdom of Geometry.',
    1,
    0
  )
ON CONFLICT (castle_id, chapter_number) DO NOTHING;

-- =====================================================
-- CASTLE 6 - CHAPTER 1: POSTTEST ASSESSMENT
-- =====================================================

-- Chapter for posttest
INSERT INTO chapters (id, castle_id, title, description, chapter_number, xp_reward)
VALUES 
  (
    'a0b1c2d3-0006-4001-a001-000000000001',
    'a0b1c2d3-0006-4000-a000-000000000006',
    'The Championship Challenge',
    'Face the final challenge and demonstrate all you have learned on your geometric adventure!',
    1,
    0
  )
ON CONFLICT (castle_id, chapter_number) DO NOTHING;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check if castles were created
SELECT id, name, route, unlock_order, region 
FROM castles 
WHERE route IN ('castle0', 'castle6')
ORDER BY unlock_order;

-- Check if chapters were created
SELECT c.title as chapter_title, cas.name as castle_name, c.chapter_number
FROM chapters c
JOIN castles cas ON c.castle_id = cas.id
WHERE cas.route IN ('castle0', 'castle6')
ORDER BY cas.unlock_order;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Castle 0 (Pretest) and Castle 6 (Posttest) created successfully!';
  RAISE NOTICE 'Castle 0 is unlocked from the start (unlock_order = 0)';
  RAISE NOTICE 'Castle 6 unlocks after Castle 5 (unlock_order = 6)';
  RAISE NOTICE 'Next step: Add assessment quiz questions via backend API';
END $$;
