# 🔧 Complete RLS Policy Setup for Polegion

## Overview
This document contains all required Row Level Security (RLS) policies for the Polegion adaptive learning platform.

## Tables Requiring RLS Policies

### 1. user_castle_progress
**Purpose:** Track user progress through castles/worlds

```sql
-- Enable RLS
ALTER TABLE user_castle_progress ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own castle progress
CREATE POLICY "Users can insert their own castle progress"
ON user_castle_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own castle progress  
CREATE POLICY "Users can view their own castle progress"
ON user_castle_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own castle progress
CREATE POLICY "Users can update their own castle progress"
ON user_castle_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 2. user_topic_progress
**Purpose:** Track mastery and progress for each topic

```sql
-- Enable RLS
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own topic progress
CREATE POLICY "Users can insert their own topic progress"
ON user_topic_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own topic progress
CREATE POLICY "Users can view their own topic progress"
ON user_topic_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own topic progress
CREATE POLICY "Users can update their own topic progress"
ON user_topic_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 3. adaptive_learning_sessions
**Purpose:** Track individual learning sessions

```sql
-- Enable RLS
ALTER TABLE adaptive_learning_sessions ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own sessions
CREATE POLICY "Users can insert their own learning sessions"
ON adaptive_learning_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own sessions
CREATE POLICY "Users can view their own learning sessions"
ON adaptive_learning_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own sessions
CREATE POLICY "Users can update their own learning sessions"
ON adaptive_learning_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 4. adaptive_user_stats
**Purpose:** Aggregate statistics for each user

```sql
-- Enable RLS
ALTER TABLE adaptive_user_stats ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own stats (auto-created by triggers)
CREATE POLICY "Users can insert their own stats"
ON adaptive_user_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own stats
CREATE POLICY "Users can view their own stats"
ON adaptive_user_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own stats (via triggers)
CREATE POLICY "Users can update their own stats"
ON adaptive_user_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 5. adaptive_daily_activity
**Purpose:** Daily activity tracking for streaks

```sql
-- Enable RLS
ALTER TABLE adaptive_daily_activity ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own daily activity
CREATE POLICY "Users can insert their own daily activity"
ON adaptive_daily_activity
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own daily activity
CREATE POLICY "Users can view their own daily activity"
ON adaptive_daily_activity
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own daily activity
CREATE POLICY "Users can update their own daily activity"
ON adaptive_daily_activity
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 6. question_attempts
**Purpose:** Track all question attempts and answers

```sql
-- Enable RLS
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own attempts
CREATE POLICY "Users can insert their own question attempts"
ON question_attempts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own attempts
CREATE POLICY "Users can view their own question attempts"
ON question_attempts
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own attempts (if needed)
CREATE POLICY "Users can update their own question attempts"
ON question_attempts
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

### 7. user_chapter_progress
**Purpose:** Track chapter completion within castles

```sql
-- Enable RLS
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;

-- INSERT: Users can create their own chapter progress
CREATE POLICY "Users can insert their own chapter progress"
ON user_chapter_progress
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- SELECT: Users can view their own chapter progress
CREATE POLICY "Users can view their own chapter progress"
ON user_chapter_progress
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- UPDATE: Users can update their own chapter progress
CREATE POLICY "Users can update their own chapter progress"
ON user_chapter_progress
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

## Public Tables (No RLS Required)

These tables should have RLS **DISABLED** as they contain public reference data:

```sql
-- Disable RLS for public reference tables
ALTER TABLE castles DISABLE ROW LEVEL SECURITY;
ALTER TABLE topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE minigames DISABLE ROW LEVEL SECURITY;
```

## Complete Setup Script

Run this complete script in Supabase SQL Editor:

```sql
-- ==================================================
-- POLEGION RLS POLICIES - COMPLETE SETUP
-- ==================================================

-- 1. USER_CASTLE_PROGRESS
ALTER TABLE user_castle_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own castle progress" ON user_castle_progress;
DROP POLICY IF EXISTS "Users can view their own castle progress" ON user_castle_progress;
DROP POLICY IF EXISTS "Users can update their own castle progress" ON user_castle_progress;

CREATE POLICY "Users can insert their own castle progress" ON user_castle_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own castle progress" ON user_castle_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own castle progress" ON user_castle_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. USER_TOPIC_PROGRESS
ALTER TABLE user_topic_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own topic progress" ON user_topic_progress;
DROP POLICY IF EXISTS "Users can view their own topic progress" ON user_topic_progress;
DROP POLICY IF EXISTS "Users can update their own topic progress" ON user_topic_progress;

CREATE POLICY "Users can insert their own topic progress" ON user_topic_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own topic progress" ON user_topic_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own topic progress" ON user_topic_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 3. ADAPTIVE_LEARNING_SESSIONS
ALTER TABLE adaptive_learning_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own learning sessions" ON adaptive_learning_sessions;
DROP POLICY IF EXISTS "Users can view their own learning sessions" ON adaptive_learning_sessions;
DROP POLICY IF EXISTS "Users can update their own learning sessions" ON adaptive_learning_sessions;

CREATE POLICY "Users can insert their own learning sessions" ON adaptive_learning_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own learning sessions" ON adaptive_learning_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own learning sessions" ON adaptive_learning_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 4. ADAPTIVE_USER_STATS
ALTER TABLE adaptive_user_stats ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own stats" ON adaptive_user_stats;
DROP POLICY IF EXISTS "Users can view their own stats" ON adaptive_user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON adaptive_user_stats;

CREATE POLICY "Users can insert their own stats" ON adaptive_user_stats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own stats" ON adaptive_user_stats FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON adaptive_user_stats FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 5. ADAPTIVE_DAILY_ACTIVITY
ALTER TABLE adaptive_daily_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own daily activity" ON adaptive_daily_activity;
DROP POLICY IF EXISTS "Users can view their own daily activity" ON adaptive_daily_activity;
DROP POLICY IF EXISTS "Users can update their own daily activity" ON adaptive_daily_activity;

CREATE POLICY "Users can insert their own daily activity" ON adaptive_daily_activity FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own daily activity" ON adaptive_daily_activity FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily activity" ON adaptive_daily_activity FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 6. QUESTION_ATTEMPTS
ALTER TABLE question_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own question attempts" ON question_attempts;
DROP POLICY IF EXISTS "Users can view their own question attempts" ON question_attempts;
DROP POLICY IF EXISTS "Users can update their own question attempts" ON question_attempts;

CREATE POLICY "Users can insert their own question attempts" ON question_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own question attempts" ON question_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own question attempts" ON question_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 7. USER_CHAPTER_PROGRESS
ALTER TABLE user_chapter_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can insert their own chapter progress" ON user_chapter_progress;
DROP POLICY IF EXISTS "Users can view their own chapter progress" ON user_chapter_progress;
DROP POLICY IF EXISTS "Users can update their own chapter progress" ON user_chapter_progress;

CREATE POLICY "Users can insert their own chapter progress" ON user_chapter_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own chapter progress" ON user_chapter_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own chapter progress" ON user_chapter_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- PUBLIC TABLES (NO RLS)
ALTER TABLE castles DISABLE ROW LEVEL SECURITY;
ALTER TABLE topics DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapters DISABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE minigames DISABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'RLS policies created successfully!' AS status;
```

## Verification

After running the script, verify policies are active:

```sql
-- Check RLS status for all tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'user_castle_progress', 
  'user_topic_progress', 
  'adaptive_learning_sessions',
  'adaptive_user_stats',
  'adaptive_daily_activity',
  'question_attempts',
  'user_chapter_progress'
);

-- Check policies for a specific table
SELECT * FROM pg_policies WHERE tablename = 'user_castle_progress';
```

## Troubleshooting

### Error: "new row violates row-level security policy"
- **Solution:** Run the complete setup script above
- **Verify:** Check that INSERT policies exist for the affected table

### Error: "insufficient privilege" (42501)
- **Solution:** User doesn't have permission to perform operation
- **Check:** Verify the policy's USING and WITH CHECK clauses match `auth.uid() = user_id`

### Statistics not appearing
- **Solution:** Ensure all analytics tables have proper SELECT policies
- **Check:** Run the adaptive_user_stats policy creation

---

**Last Updated:** January 21, 2026  
**Applies To:** Polegion Adaptive Learning Platform
