# Database Migration Required

## Problem: Grading Settings Not Saving

The grading settings (`problem_type`, `shape_constraint`, `grading_rules`, `accepts_submissions`) are not being saved because these columns don't exist in your database yet.

## Solution: Run the Migration

You need to run the SQL migration to add these columns to the `problems` table.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to the SQL Editor

2. **Run the Migration**
   - Open the file: `docs/sql/ADD_PROBLEM_GRADING_FEATURES.sql`
   - Copy the entire contents
   - Paste it into the Supabase SQL Editor
   - Click "Run" or press Ctrl+Enter

3. **Verify the Migration**
   After running, verify the columns were added:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'problems';
   ```
   
   You should see these new columns:
   - `problem_type` (VARCHAR)
   - `shape_constraint` (VARCHAR)
   - `grading_rules` (JSONB)
   - `accepts_submissions` (BOOLEAN)

4. **Test Creating a Problem**
   - Create a new problem with grading settings
   - Edit it and verify the settings are preserved

## What the Migration Does:

1. Adds 4 new columns to the `problems` table
2. Changes `visibility` from 'show'/'hide' to 'public'/'private'
3. Adds validation constraints for problem types and shape constraints
4. Creates `problem_leaderboards` table for tracking student performance
5. Adds performance indexes

## After Migration:

Once completed, all grading settings will be properly saved and loaded when editing problems.
