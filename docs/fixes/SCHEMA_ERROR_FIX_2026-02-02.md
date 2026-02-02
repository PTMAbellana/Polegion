# Schema Error Fixes - February 2, 2026

## Problem Summary
Production logs showed two schema-related errors:
1. ❌ **Function not found**: `increment_hint_shown(p_topic_id, p_user_id)` 
2. ❌ **Column not found**: `correct_answers` in `user_topic_progress` table

## Root Cause Analysis

### Error 1: Missing RPC Function
- **Code called**: `increment_hint_shown` RPC function (TopicProgressRepo.js:648)
- **Status**: Function did NOT exist in database
- **Solution**: Created the function in `fix-schema-errors.sql`

### Error 2: Wrong Table/Column Usage
- **Code tried**: INSERT `correct_answers` into `user_topic_progress` table
- **Status**: Column does NOT exist in `user_topic_progress`
- **Why**: Code was mixing columns from TWO different tables:
  
  **`user_topic_progress` table has:**
  - ✅ mastery_level, mastery_percentage
  - ✅ unlocked, mastered
  - ✅ attempt_count, longest_correct_streak
  - ✅ hint_shown (boolean), hint_shown_at
  - ❌ NO correct_answers, hints_shown_count, difficulty_level, etc.
  
  **`adaptive_learning_state` table has:**
  - ✅ correct_answers, wrong_answers
  - ✅ hints_shown_count
  - ✅ difficulty_level, total_attempts
  - ✅ correct_streak, wrong_streak

- **Solution**: Fixed INSERT statement to only use columns that exist in `user_topic_progress`

## Files Changed

### 1. Backend Code Fix
**File**: `backend/infrastructure/repository/adaptive/TopicProgressRepo.js`
**Lines**: 222-241 (INSERT statement)
**Change**: Removed wrong columns from INSERT:
```javascript
// BEFORE (WRONG):
.insert({
  user_id: userId,
  topic_id: topicId,
  mastery_level: 0,
  difficulty_level: 1,        // ❌ Wrong table!
  total_attempts: 0,           // ❌ Wrong table!
  correct_answers: 0,          // ❌ Wrong table!
  correct_streak: 0,           // ❌ Wrong table!
  wrong_streak: 0,             // ❌ Wrong table!
  hints_shown_count: 0,        // ❌ Wrong table!
  mastery_percentage: 0,
  mastered: false,
  ...updates,
})

// AFTER (CORRECT):
.insert({
  user_id: userId,
  topic_id: topicId,
  mastery_level: 0,
  mastery_percentage: 0,
  mastered: false,
  unlocked: false,
  attempt_count: 0,            // ✅ Correct column name
  longest_correct_streak: 0,   // ✅ Exists in this table
  hint_shown: false,           // ✅ Boolean, not count
  ...updates,
})
```

### 2. Database Migration
**File**: `docs/database/fix-schema-errors.sql`
**Purpose**: Create missing RPC function
**What it does**:
- Creates `increment_hint_shown(p_user_id, p_topic_id)` function
- Updates `hint_shown` boolean and `hint_shown_at` timestamp in `user_topic_progress`
- Grants execute permissions to authenticated and service_role

## Deployment Steps

### Step 1: Apply Database Migration
```sql
-- Run in Supabase SQL Editor:
-- Copy/paste contents of docs/database/fix-schema-errors.sql
-- This creates the increment_hint_shown function
```

### Step 2: Deploy Code Changes
```bash
# Commit the TopicProgressRepo.js fix
cd backend
git add infrastructure/repository/adaptive/TopicProgressRepo.js
git commit -m "fix: Remove wrong columns from user_topic_progress INSERT"

# Push to both remotes
git push origin research-adaptive-learning-mdp
git push research research-adaptive-learning-mdp
```

### Step 3: Verify Fix
After deployment, check that:
1. No more "function not found" errors in logs
2. No more "column not found" errors in logs
3. Hint tracking works correctly
4. Topic progression updates successfully

## Testing Before Tomorrow's 50-User Test

### Local Test:
```bash
cd "c:\Users\User\Desktop\BSCS-3\Second Semester\SoftEng\Polegion"
node docs/backend-tests/test-load-50-concurrent.js
```

### Production Test:
- Apply SQL migration in Supabase
- Deploy code to Railway
- Monitor first few student signups
- Watch for schema errors in Railway logs

## Impact Assessment

**Before fix:**
- ❌ Topic progression INSERTs failed with schema errors
- ❌ Hint tracking calls failed with RPC not found
- ⚠️ System continued working (errors were caught and logged)
- ⚠️ Some analytics data not recorded

**After fix:**
- ✅ Topic progression INSERTs succeed
- ✅ Hint tracking updates succeed
- ✅ Full analytics data captured
- ✅ No schema errors in logs

## Emergency Rollback (if needed)

If the fix causes issues:

1. **Revert code change:**
```bash
git revert HEAD
git push origin research-adaptive-learning-mdp
git push research research-adaptive-learning-mdp
```

2. **Drop the function:**
```sql
DROP FUNCTION IF EXISTS public.increment_hint_shown(UUID, UUID);
```

## Notes for Tomorrow's Test
- Fix is NON-BREAKING: Old code had errors but system continued working
- New code eliminates errors and improves data quality
- No schema changes to existing tables (only added function)
- Safe to deploy during test (no downtime required)
