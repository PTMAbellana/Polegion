-- =====================================================
-- MANUAL INSERT FOR CASTLE 0 & CASTLE 6
-- Alternative to the main seed file
-- Use this if you prefer the same format as existing castles
-- =====================================================

-- Insert Castle 0 (Pretest)
INSERT INTO "public"."castles" (
    "id", 
    "name", 
    "region", 
    "description", 
    "difficulty", 
    "image_number", 
    "total_xp", 
    "unlock_order", 
    "route", 
    "created_at"
) VALUES (
    'a0b1c2d3-0000-4000-a000-000000000000', 
    'The Trial Grounds', 
    'The Entrance', 
    'Prove your worth before embarking on your geometric journey. Take the assessment to help us understand your current knowledge.', 
    'Assessment', 
    '0', 
    '0', 
    '0', 
    'castle0', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert Castle 6 (Posttest)
INSERT INTO "public"."castles" (
    "id", 
    "name", 
    "region", 
    "description", 
    "difficulty", 
    "image_number", 
    "total_xp", 
    "unlock_order", 
    "route", 
    "created_at"
) VALUES (
    'a0b1c2d3-0006-4000-a000-000000000006', 
    'The Grand Championship', 
    'The Arena of Champions', 
    'You have conquered all five kingdoms! Now prove your mastery in the Grand Championship and see how much you have grown.', 
    'Assessment', 
    '6', 
    '0', 
    '6', 
    'castle6', 
    NOW()
)
ON CONFLICT (id) DO NOTHING;

-- Insert Chapter for Castle 0
INSERT INTO "public"."chapters" (
    "id", 
    "castle_id", 
    "title", 
    "description", 
    "chapter_number", 
    "xp_reward",
    "created_at"
) VALUES (
    'a0b1c2d3-0000-4001-a001-000000000001',
    'a0b1c2d3-0000-4000-a000-000000000000',
    'The Guardian''s Assessment',
    'Answer the Guardian''s questions to begin your journey through the Kingdom of Geometry.',
    1,
    0,
    NOW()
)
ON CONFLICT (castle_id, chapter_number) DO NOTHING;

-- Insert Chapter for Castle 6
INSERT INTO "public"."chapters" (
    "id", 
    "castle_id", 
    "title", 
    "description", 
    "chapter_number", 
    "xp_reward",
    "created_at"
) VALUES (
    'a0b1c2d3-0006-4001-a001-000000000001',
    'a0b1c2d3-0006-4000-a000-000000000006',
    'The Championship Challenge',
    'Face the final challenge and demonstrate all you have learned on your geometric adventure!',
    1,
    0,
    NOW()
)
ON CONFLICT (castle_id, chapter_number) DO NOTHING;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to check if castles were added successfully
SELECT 
    id, 
    name, 
    route, 
    unlock_order, 
    region,
    difficulty,
    image_number
FROM castles 
ORDER BY unlock_order;

-- Should show 7 castles:
-- unlock_order 0: The Trial Grounds (castle0)
-- unlock_order 1: Euclidean Spire (castle1)
-- unlock_order 2: Polygon Citadel (castle2)
-- unlock_order 3: Circle Sanctuary (castle3)
-- unlock_order 4: Fractal Bastion (castle4)
-- unlock_order 5: Arcane Observatory (castle5)
-- unlock_order 6: The Grand Championship (castle6)
