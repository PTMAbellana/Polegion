# Fix for Hidden Problems Appearing on Student Side

## Problem
Problems with visibility set to "hide" were still appearing on the student side because the database view `public_problems_with_stats` was only filtering for `visibility = 'public'`, which excluded most problems.

## Solution
Updated the database view to correctly filter problems:
- **Include**: Problems with `visibility = 'show'` or `visibility = 'public'`
- **Exclude**: Problems with `visibility = 'hide'`

## How to Apply the Fix

### Step 1: Run the SQL Migration
1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Open the file: `docs/sql/FIX_HIDDEN_PROBLEMS_FILTER.sql`
4. Copy the SQL content and paste it into the Supabase SQL Editor
5. Click "Run" to execute the migration

### Step 2: Verify the Fix
After running the migration, you can verify it worked by:

1. **Check problem visibility distribution:**
   ```sql
   SELECT 
     visibility,
     accepts_submissions,
     COUNT(*) as count
   FROM problems
   GROUP BY visibility, accepts_submissions
   ORDER BY visibility, accepts_submissions;
   ```

2. **Check the view results:**
   ```sql
   SELECT id, title, room_id
   FROM public_problems_with_stats
   ORDER BY created_at DESC
   LIMIT 10;
   ```

3. **Test on the student side:**
   - Set a problem's visibility to "hide" in the teacher interface
   - Log in as a student
   - Navigate to Practice Problems
   - Verify the hidden problem does NOT appear in the list

## Visibility Values Reference

| Value | Visible to Students | Use Case |
|-------|-------------------|----------|
| `show` | ✅ Yes | Default - Problem is visible and can be attempted |
| `public` | ✅ Yes | Problem is publicly accessible |
| `hide` | ❌ No | Problem is hidden from students (draft, archived, etc.) |

## Technical Details

### Database View Changed
**View Name:** `public_problems_with_stats`

**Before:**
```sql
WHERE p.visibility = 'public' AND p.accepts_submissions = true
```

**After:**
```sql
WHERE p.visibility IN ('show', 'public') AND p.accepts_submissions = true
```

### Files Modified
- Created: `docs/sql/FIX_HIDDEN_PROBLEMS_FILTER.sql` - SQL migration script
- Created: `HIDDEN_PROBLEMS_FIX.md` - This documentation

### Impact
- **Student Side:** Hidden problems will no longer appear in practice problems list
- **Teacher Side:** No changes - teachers can still see and manage all problems regardless of visibility
- **API Endpoints:** No code changes needed - the fix is at the database view level

## No Restart Required
Since this is a database view change, no application restart is needed. The changes take effect immediately after running the SQL migration.
