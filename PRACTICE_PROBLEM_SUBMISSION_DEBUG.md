# Practice Problem Submission Debug Guide

## Issue
Failed to submit practice problem at: `student/joined-rooms/mDgein/practice-problems/c02dd75b-e9f2-4f81-af54-ec1a5e544b1e`

## What Was Done

### 1. Enhanced Error Logging
Added comprehensive logging to track submission failures:

**Frontend API** (`frontend/api/problems.js`):
- Added console logs before submission with problem details
- Enhanced error logging with status codes and full error details
- Logs shape count and time spent for debugging

**Frontend Page** (`frontend/app/student/joined-rooms/[roomCode]/practice-problems/[problemId]/page.tsx`):
- Added specific error message handling for common failure cases:
  - "Problem not public" → Shows "Problem Not Available"
  - "Not a participant" → Shows "Access Denied"
- Added detailed console logging on submission failure
- Logs problem ID, room code, and number of shapes

### 2. Submission Flow Analysis

The submission process works as follows:

1. **Frontend** calls `submitProblemAttempt(problemId, solution)`
2. **API** sends POST to `/problems/{problem_id}/attempt`
3. **Backend Controller** receives request at `ProblemController.submitPublicProblemAttempt`
4. **Backend Service** (`ProblemService.submitPublicProblemAttempt`) performs:
   - Fetches problem by ID
   - Checks if problem is public and accepts submissions
   - **Verifies user is a participant in the problem's room**
   - Grades the submission
   - Stores the attempt

### 3. Common Failure Reasons

Based on the code analysis, submissions can fail for these reasons:

#### A. Not a Room Participant
- **Error**: "Not a participant in this room"
- **Cause**: The problem belongs to a room, and the user is not registered as a participant
- **Check**: Query `room_participants` table for `room_id` and `user_id`

```sql
-- Verify room participation
SELECT * FROM room_participants 
WHERE room_id = (SELECT room_id FROM problems WHERE id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e')
AND user_id = '<your-user-id>';
```

#### B. Problem Not Public or Not Accepting Submissions
- **Error**: "Problem not found or not public"
- **Cause**: Problem visibility is not 'public' or `accepts_submissions` is false

```sql
-- Check problem status
SELECT id, visibility, accepts_submissions, room_id 
FROM problems 
WHERE id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e';
```

#### C. Authentication Issues
- **Error**: 401 Unauthorized
- **Cause**: Access token expired or missing
- **Check**: Browser console for token refresh logs

### 4. How to Debug

1. **Open Browser Console** (F12 → Console tab)
2. **Attempt to submit** the practice problem
3. **Look for these log messages**:
   ```
   📤 Submitting problem attempt: { problem_id, shapes_count, time_spent }
   ```
   - If you see this, the API call was initiated

   ```
   ✅ Submission successful: { ... }
   ```
   - If you see this, the submission worked

   ```
   ❌ Submission failed: { status, message, error }
   ```
   - If you see this, note the error message and status code

4. **Check the specific error**:
   - **403 Forbidden** → Not a room participant
   - **404 Not Found** → Problem not public or doesn't exist
   - **401 Unauthorized** → Authentication issue
   - **500 Server Error** → Backend issue

### 5. Verification Queries

Run these queries in your Supabase SQL editor:

```sql
-- 1. Check if problem exists and is public
SELECT 
  id, 
  title, 
  visibility, 
  accepts_submissions, 
  room_id,
  max_attempts,
  expected_xp
FROM problems 
WHERE id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e';

-- 2. Check if user is a participant in the room
-- Replace <user-id> with your actual user ID
SELECT rp.* 
FROM room_participants rp
JOIN problems p ON p.room_id = rp.room_id
WHERE p.id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e'
AND rp.user_id = '<user-id>';

-- 3. Check room code matches
SELECT r.code 
FROM rooms r
JOIN problems p ON p.room_id = r.id
WHERE p.id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e';
-- This should return 'mDgein'

-- 4. Check existing attempts
SELECT * FROM problem_attempts
WHERE problem_id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e'
ORDER BY created_at DESC
LIMIT 5;
```

### 6. Quick Fix Options

#### If Not a Participant:
```sql
-- Add user as participant to the room
INSERT INTO room_participants (room_id, user_id)
SELECT room_id, '<user-id>'
FROM problems
WHERE id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e'
ON CONFLICT DO NOTHING;
```

#### If Problem Not Public:
```sql
-- Make problem public and accepting submissions
UPDATE problems
SET 
  visibility = 'public',
  accepts_submissions = true
WHERE id = 'c02dd75b-e9f2-4f81-af54-ec1a5e544b1e';
```

### 7. Testing the Fix

After running any SQL fixes:

1. **Clear cache** in the browser (Ctrl+Shift+Delete)
2. **Refresh the page**
3. **Try submitting again**
4. **Check the console logs** for the new response

## Next Steps

1. Check the browser console when submitting
2. Note the exact error message and status code
3. Run the verification queries above
4. Apply the appropriate fix
5. Test the submission again

If the issue persists after these steps, check:
- Backend server logs
- Network tab in browser DevTools
- Supabase logs for RLS policy violations
