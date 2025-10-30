# Castle Initialization System - Update Summary

## 🎯 What Was Done

### **Problem Solved**
Previously, when a new user accessed a castle page, they would get errors because:
1. No castle progress record existed in `user_castle_progress`
2. No chapter progress records existed in `user_chapter_progress`
3. Manual database insertion was required

### **Solution Implemented**
Created an **automatic initialization system** that:
- ✅ Checks if user has progress data
- ✅ Creates missing records automatically
- ✅ Unlocks first castle (castle1) by default for new users
- ✅ Unlocks first chapter of unlocked castles
- ✅ Returns complete castle data with progress in one API call

---

## 📁 Files Modified/Created

### **Backend Changes**

#### 1. **Repository Layer** (Converted to Supabase API)

**ChapterRepo.js** - Updated methods:
- `createChapter()` - Uses `supabase.from('chapters').insert()`
- `getChaptersByCastleId()` - NEW method to get chapters by castle
- `fromDatabase()` instead of `fromDb()`
- All methods return proper Chapter models

**UserChapterProgressRepo.js** - Updated methods:
- `createUserChapterProgress()` - Uses Supabase API
- `getUserChapterProgressByUserAndChapter()` - NEW method
- `getAllUserChapterProgressByUser()` - NEW method
- `fromDatabase()` instead of `fromDb()`

#### 2. **Domain Models** (Added toJSON methods)

**Chapter.js**:
```javascript
constructor() {
  this.castleId = castle_id  // camelCase internally
  this.chapterNumber = chapter_number
}

toJSON() {
  return {
    castle_id: this.castleId,  // snake_case for API
    chapter_number: this.chapterNumber
  }
}
```

**UserChapterProgress.js**:
```javascript
constructor() {
  this.xpEarned = xp_earned  // camelCase internally
  this.quizPassed = quiz_passed
}

toJSON() {
  return {
    xp_earned: this.xpEarned,  // snake_case for API
    quiz_passed: this.quizPassed
  }
}
```

#### 3. **Service Layer**

**CastleService.js** - NEW method:
```javascript
async initializeUserCastleProgress(userId, castleRoute) {
  // 1. Find castle by route
  // 2. Create/fetch castle progress
  // 3. Get all chapters for castle
  // 4. Create/fetch chapter progress for each chapter
  // 5. Auto-unlock first castle and first chapter
  // 6. Return complete data structure
}
```

Dependencies injected:
- `userCastleProgressRepo`
- `chapterRepo`
- `userChapterProgressRepo`

#### 4. **Controller Layer**

**CastleController.js** - NEW endpoint:
```javascript
async initializeProgress(req, res) {
  const { userId, castleRoute } = req.body;
  const data = await this.castleService.initializeUserCastleProgress(userId, castleRoute);
  res.json({ success: true, data });
}
```

#### 5. **Routes**

**CastleRoutes.js** - NEW route (must be before `'/'`):
```javascript
this.router.post('/initialize', this.castleController.initializeProgress.bind(...));
```

#### 6. **Dependency Injection**

**container.js** - Updated:
```javascript
const castleService = new CastleService(
  castleRepository,
  userCastleProgressRepository,
  chapterRepository,
  userChapterProgressRepository
);
```

---

### **Frontend Changes**

#### 1. **API Layer**

**api/castles.js** - NEW function:
```typescript
export const initializeCastleProgress = async (userId, castleRoute) => {
  const res = await api.post('castles/initialize', { userId, castleRoute });
  return res.data;
}
```

#### 2. **Castle Page**

**app/student/worldmap/castle1/page.tsx**:
- Removed dependency on `getAllCastles()` and `getUserProgress()`
- Now uses single `initializeCastleProgress()` call
- Simplified data flow
- Added proper TypeScript interfaces inline
- Better error handling

**Before**:
```typescript
const castlesResponse = await getAllCastles(userId);
const castle = castlesResponse.data.find(...);
const progressResponse = await getUserProgress(userId, castle.id);
// Multiple API calls, manual data merging
```

**After**:
```typescript
const response = await initializeCastleProgress(userId, CASTLE_ROUTE);
const { castle, castleProgress, chapters } = response.data;
// Single API call, auto-initialization
```

---

## 🔄 Data Flow

### **New User Flow**

1. **User visits `/student/worldmap/castle1`**
2. **Frontend calls**: `POST /api/castles/initialize`
   ```json
   { 
     "userId": "550e8400-e29b-41d4-a716-446655440000",
     "castleRoute": "castle1"
   }
   ```

3. **Backend checks**:
   - Does `user_castle_progress` exist for this user/castle?
   - If NO → Create with `unlocked: true` (for castle1)
   - If YES → Use existing

4. **Backend fetches chapters**:
   ```sql
   SELECT * FROM chapters WHERE castle_id = ? ORDER BY chapter_number
   ```

5. **Backend checks each chapter**:
   - Does `user_chapter_progress` exist for this user/chapter?
   - If NO → Create with `unlocked: true` (for chapter 1 only)
   - If YES → Use existing

6. **Backend returns**:
   ```json
   {
     "success": true,
     "data": {
       "castle": { "id": "...", "name": "Castle 1", ... },
       "castleProgress": { "unlocked": true, "completed": false, ... },
       "chapters": [
         {
           "id": "...",
           "title": "Chapter 1",
           "chapter_number": 1,
           "progress": { "unlocked": true, "completed": false, ... }
         },
         {
           "id": "...",
           "title": "Chapter 2",
           "chapter_number": 2,
           "progress": { "unlocked": false, "completed": false, ... }
         }
       ]
     }
   }
   ```

7. **Frontend renders**:
   - Castle header with progress
   - Chapter list (chapter 1 unlocked, others locked)
   - Castle card with XP info
   - Start button enabled for chapter 1

---

## 🗄️ Database Auto-Creation

### **Tables Updated Automatically**

#### **user_castle_progress**
```sql
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, ...)
VALUES ('user-uuid', 'castle1-uuid', true, false, ...)
-- Only for castle1 (unlock_order = 1)
```

#### **user_chapter_progress**
```sql
INSERT INTO user_chapter_progress (user_id, chapter_id, unlocked, completed, ...)
VALUES ('user-uuid', 'chapter1-uuid', true, false, ...)
-- Only for first chapter of unlocked castle
```

### **Prerequisites (Must Exist)**

#### **castles table**
```sql
INSERT INTO castles (name, route, unlock_order, image_number, ...) 
VALUES ('Castle 1', 'castle1', 1, 1, ...);
```

#### **chapters table**
```sql
INSERT INTO chapters (castle_id, title, chapter_number, xp_reward, ...)
VALUES 
  ('castle1-id', 'Chapter 1: The Point of Origin', 1, 100, ...),
  ('castle1-id', 'Chapter 2: Paths of Power', 2, 150, ...),
  ('castle1-id', 'Chapter 3: Shapes of the Spire', 3, 200, ...);
```

---

## 🚀 Testing

### **Step 1: Ensure Castle & Chapters Exist**
```sql
-- Check castle
SELECT * FROM castles WHERE route = 'castle1';

-- Check chapters
SELECT c.* FROM chapters c
JOIN castles cs ON c.castle_id = cs.id
WHERE cs.route = 'castle1'
ORDER BY c.chapter_number;
```

If missing, insert:
```sql
-- Get castle ID
SELECT id FROM castles WHERE route = 'castle1';

-- Insert chapters (replace 'castle1-id' with actual UUID)
INSERT INTO chapters (castle_id, title, description, chapter_number, xp_reward) VALUES
('castle1-id', 'Chapter 1: The Point of Origin', 'Learn about points, lines, rays...', 1, 100),
('castle1-id', 'Chapter 2: Paths of Power', 'Master parallel and perpendicular lines...', 2, 150),
('castle1-id', 'Chapter 3: Shapes of the Spire', 'Identify and draw geometric shapes...', 3, 200);
```

### **Step 2: Test New User**

1. **Login as new student** (no existing progress)
2. **Navigate to**: `/student/worldmap/castle1`
3. **Check browser console**:
   ```
   [Castle1Page] Initializing castle for user: <userId>
   [CastleAPI] Initializing castle progress: { userId, castleRoute: 'castle1' }
   [CastleController] ===== INITIALIZE CASTLE PROGRESS =====
   [CastleService] initializeUserCastleProgress - userId: ..., castleRoute: castle1
   [CastleService] Found castle: { id, name: 'Castle 1', ... }
   [CastleService] Creating castle progress for user ...
   [CastleService] Found 3 chapters
   [CastleService] Creating progress for chapter 1
   [CastleService] Creating progress for chapter 2
   [CastleService] Creating progress for chapter 3
   ```

4. **Verify database**:
   ```sql
   -- Check castle progress created
   SELECT * FROM user_castle_progress 
   WHERE user_id = '<userId>' AND castle_id = (SELECT id FROM castles WHERE route = 'castle1');
   
   -- Check chapter progress created
   SELECT ucp.*, c.chapter_number 
   FROM user_chapter_progress ucp
   JOIN chapters c ON ucp.chapter_id = c.id
   WHERE ucp.user_id = '<userId>'
   ORDER BY c.chapter_number;
   ```

5. **Expected Results**:
   - Castle progress: `unlocked: true, completed: false`
   - Chapter 1 progress: `unlocked: true`
   - Chapter 2 progress: `unlocked: false`
   - Chapter 3 progress: `unlocked: false`

### **Step 3: Test Existing User**

1. **Visit castle again** (should use existing progress)
2. **Check console**: Should NOT see "Creating castle progress" or "Creating progress for chapter"
3. **Verify**: Data returned from existing records

---

## ✅ Benefits

1. **No Manual Setup** - New users automatically get progress records
2. **Single API Call** - Reduced network overhead
3. **Consistent Data** - All users start with same state
4. **Idempotent** - Safe to call multiple times (won't create duplicates)
5. **Progressive Unlocking** - First castle/chapter unlocked, others locked
6. **Type Safe** - Proper TypeScript interfaces
7. **Error Handling** - Graceful degradation on failure

---

## 🔧 Next Steps

### **To Apply to Other Castles**

1. **Update castle2/page.tsx, castle3/page.tsx, etc.**:
   ```typescript
   const CASTLE_ROUTE = 'castle2'; // Change this
   const response = await initializeCastleProgress(userId, CASTLE_ROUTE);
   ```

2. **No backend changes needed** - Same endpoint works for all castles

3. **Ensure chapters exist** in database for each castle

---

## 🐛 Troubleshooting

### **Error: "Castle with route 'castle1' not found"**
**Solution**: Insert castle record in `castles` table

### **Error: "Required repositories not injected"**
**Solution**: Check `container.js` - ensure all dependencies passed to CastleService

### **Empty chapters array**
**Solution**: Insert chapter records for the castle in `chapters` table

### **Chapter 1 not unlocked**
**Check**: 
- Castle `unlock_order = 1` (should auto-unlock)
- Castle progress `unlocked = true`
- Logic: `unlocked && chapter_number === 1`

---

## 📝 Summary

This update transforms the castle initialization from **manual database setup** to **automatic data creation**. New users can now seamlessly access castles without requiring pre-existing progress records. The system intelligently creates necessary data while respecting existing progress for returning users.

**Key Achievement**: Zero-friction onboarding for new students! 🎉
