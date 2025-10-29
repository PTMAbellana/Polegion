# 🚀 Polegion Setup Instructions

## ⚠️ CRITICAL: Run Database Setup FIRST!

### Step 1: Create Database Tables

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Open the file `DATABASE_COMPLETE_SCHEMA.sql` in this project
4. **Copy ALL the SQL** and paste it into the Supabase SQL Editor
5. Click **Run** to execute

This will create:
- ✅ `castles` table
- ✅ `chapters` table
- ✅ `chapter_quizzes` table
- ✅ `minigames` table
- ✅ `user_castle_progress` table
- ✅ `user_chapter_progress` table
- ✅ `user_quiz_attempts` table ⭐ **NEW**
- ✅ `user_minigame_attempts` table ⭐ **NEW**
- ✅ All indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Triggers for auto-updating castle completion

### Step 2: Verify Tables Exist

Run this query in Supabase SQL Editor:

```sql
SELECT 
  table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'castles', 
    'chapters', 
    'chapter_quizzes', 
    'minigames',
    'user_castle_progress',
    'user_chapter_progress',
    'user_quiz_attempts',
    'user_minigame_attempts'
  )
ORDER BY table_name;
```

You should see **8 tables** returned.

---

## 📊 How Auto-Seeding Works

### What Gets Auto-Created?

When a user visits a castle for the first time, the system automatically creates:

1. **Chapters** - from `backend/infrastructure/seeds/chapterSeeds.js`
2. **Quizzes** - from the same file
3. **Minigames** - from the same file

### The Seeding Flow:

```
User visits Castle 1
  ↓
CastleService.getCastleWithProgress(userId, 'castle1')
  ↓
ChapterSeeder.seedChaptersForCastle(castleId, 'castle1')
  ├─ Checks if chapters exist
  ├─ If not, creates Chapter 1, 2, 3
  └─ Returns chapters
  ↓
QuizAndMinigameSeeder.seedForChapter(chapterId, chapterNumber)
  ├─ For each chapter:
  │   ├─ Checks if quiz exists by ID
  │   ├─ If not, creates quiz
  │   ├─ Checks if minigame exists by ID
  │   └─ If not, creates minigame
  └─ Returns quizzes and minigames
  ↓
All data ready for use!
```

### How It Prevents Duplicates:

#### For Chapters:
```javascript
// ChapterSeeder.js
const existingChapters = await this.chapterRepo.getChaptersByCastleId(castleId);

if (existingChapters.length > 0) {
    console.log(`Castle already has ${existingChapters.length} chapters`);
    return existingChapters; // Don't seed again
}
```

#### For Quizzes & Minigames:
```javascript
// QuizAndMinigameSeeder.js
for (const quizData of quizSeeds) {
    const existing = await this.chapterQuizRepo.getChapterQuizById(quizData.id);
    
    if (!existing) {
        // Create new quiz
        const quiz = await this.chapterQuizRepo.createChapterQuiz({
            ...quizData,
            chapter_id: chapterId
        });
    } else {
        console.log(`Quiz already exists: ${quizData.title}`);
        // Return existing quiz
    }
}
```

**Key Point**: The seeder checks by **ID**, not by name or other fields. This means:
- ✅ If quiz/minigame ID exists → **Skip creation**
- ✅ If quiz/minigame ID doesn't exist → **Create it**
- ✅ No duplicates, even if you run seeding multiple times

---

## 🔄 When to Update Seed Data

### Scenario: You want to change minigame questions

**Option 1: Update Existing Data (Recommended for small changes)**

1. Edit `backend/infrastructure/seeds/chapterSeeds.js`
2. Change the `game_config` for the minigame
3. Run this SQL in Supabase to **update** the existing minigame:

```sql
UPDATE minigames
SET game_config = '{
  "questions": [
    {
      "id": "mg1",
      "instruction": "Your new instruction here",
      ...
    }
  ]
}'::jsonb
WHERE id = 'b2c3d4e5-2345-6789-abcd-ef0123456789';
```

**Option 2: Delete and Re-seed (Clean slate)**

1. Delete the minigame:
```sql
DELETE FROM minigames WHERE id = 'b2c3d4e5-2345-6789-abcd-ef0123456789';
```

2. Edit `backend/infrastructure/seeds/chapterSeeds.js`
3. Restart backend → The seeder will detect it's missing and create it fresh

**Option 3: Change the ID (Force new version)**

1. Edit `backend/infrastructure/seeds/chapterSeeds.js`
2. Change the `id` field to a new UUID
3. Restart backend → Old minigame stays, new one is created
4. Manually delete the old one if needed

---

## 🐛 Troubleshooting

### Issue: "Page is empty"

**Possible Causes:**

1. **Frontend dev server not running**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Backend server not running**
   ```bash
   cd backend
   npm start
   ```

3. **Database tables missing**
   - Run `DATABASE_COMPLETE_SCHEMA.sql` in Supabase

4. **Castle not initialized**
   - Visit the castle page (e.g., `/student/worldmap/castle1`)
   - Check backend console for seeding logs

5. **Browser cache issue**
   - Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or clear browser cache

### Issue: "Getting quizzes for chapter: [ID]" but nothing appears

**Check these:**

1. **Backend logs** - Do you see:
   ```
   [QuizAndMinigameSeeder] Creating quiz: Lines, Rays & Segments Quiz
   [QuizAndMinigameSeeder] Creating minigame: Identify the Geometric Elements
   ```

2. **Database** - Run this query:
   ```sql
   SELECT id, title FROM chapter_quizzes 
   WHERE chapter_id = '0847c3d5-3f86-4c1e-9b05-464270295cd8';
   
   SELECT id, title FROM minigames 
   WHERE chapter_id = '0847c3d5-3f86-4c1e-9b05-464270295cd8';
   ```

3. **Frontend console** - Do you see:
   ```
   [Chapter1] Quizzes response: { success: true, data: [...] }
   [Chapter1] Minigames response: { success: true, data: [...] }
   ```

### Issue: "user_quiz_attempts" or "user_minigame_attempts" table doesn't exist

**Solution:**
- Run `DATABASE_COMPLETE_SCHEMA.sql` in Supabase SQL Editor
- The script creates these tables if they don't exist

### Issue: Minigame/Quiz submission fails with 400 error

**Check:**

1. **User authentication** - Is `req.user.id` set?
   ```javascript
   // In your API call, check if you're logged in
   console.log('User profile:', userProfile)
   ```

2. **Request body** - Are you sending the right data?
   ```javascript
   // Minigame attempt
   await submitMinigameAttempt(minigameId, {
     score: 100,
     time_taken: 0,
     attempt_data: { completedQuestions: 3 }
   })
   
   // Quiz attempt
   await submitQuizAttempt(quizId, {
     question1: 'Line',
     question2: 'Line Segment',
     question3: 'Ray'
   })
   ```

3. **Backend logs** - Check for detailed error messages

---

## ✅ Final Checklist

Before testing Chapter 1:

- [ ] Database tables created (`user_quiz_attempts`, `user_minigame_attempts`)
- [ ] Backend server running (`npm start` in `backend/`)
- [ ] Frontend server running (`npm run dev` in `frontend/`)
- [ ] User logged in as student
- [ ] Castle 1 visited (triggers auto-seeding)
- [ ] Browser console shows no errors
- [ ] Backend console shows seeding logs

---

## 📝 Summary

### What You DON'T Need to Do:

- ❌ Manually create chapters, quizzes, or minigames
- ❌ Manually delete and re-insert data when updating
- ❌ Write SQL INSERT statements for seed data

### What You DO Need to Do:

- ✅ Run `DATABASE_COMPLETE_SCHEMA.sql` **once** in Supabase
- ✅ Edit `backend/infrastructure/seeds/chapterSeeds.js` when you want to change seed data
- ✅ Restart backend server after editing seed files
- ✅ Visit the castle page to trigger auto-seeding

### How the System Works:

1. **First Visit** → Seeder creates everything
2. **Subsequent Visits** → Seeder checks "already exists" and skips creation
3. **Data Updates** → Edit seed file, delete old data in DB, restart backend
4. **Chapter Completion** → Automatically updates user progress and castle completion percentage

---

## 🎯 Next Steps

1. Run the SQL script
2. Restart backend
3. Visit `http://localhost:3000/student/worldmap/castle1`
4. Click on Chapter 1
5. Complete the chapter
6. Check that progress is updated

**The page should no longer be empty!** 🎉
