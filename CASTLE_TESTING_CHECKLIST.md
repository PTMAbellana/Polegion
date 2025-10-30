# 🧪 Castle Initialization - Testing Checklist

## ✅ Pre-Testing Requirements

### Database Setup
- [ ] `castles` table has castle1 record with `route = 'castle1'` and `unlock_order = 1`
- [ ] `chapters` table has at least 3 chapters for castle1
- [ ] Backend server restarted (to load new code)
- [ ] Frontend running on localhost:3000

### Verify Castle Data
```sql
-- Check castle exists
SELECT id, name, route, unlock_order FROM castles WHERE route = 'castle1';

-- Check chapters exist (replace 'castle1-id' with actual UUID)
SELECT id, title, chapter_number, xp_reward 
FROM chapters 
WHERE castle_id = (SELECT id FROM castles WHERE route = 'castle1')
ORDER BY chapter_number;
```

Expected:
- Castle1 found with unlock_order = 1
- At least 1 chapter found

---

## 🧪 Test Scenario 1: New User (No Existing Progress)

### Setup
```sql
-- Clear any existing progress for test user
DELETE FROM user_chapter_progress WHERE user_id = 'YOUR_USER_ID';
DELETE FROM user_castle_progress WHERE user_id = 'YOUR_USER_ID';
```

### Steps
1. **Login as student**
2. **Navigate to**: `http://localhost:3000/student/worldmap/castle1`
3. **Wait for page load**

### Expected Results
#### Browser Console
```
[Castle1Page] Initializing castle for user: <userId>
[CastleAPI] Initializing castle progress: {...}
[CastleAPI] Initialize response: { success: true, data: {...} }
[Castle1Page] Initialized data: { castle: {...}, progress: {...}, chapterCount: 3 }
```

#### UI Display
- [ ] Castle name and description displayed
- [ ] Progress bar shows 0%
- [ ] Chapter 1 is **unlocked** (clickable, no lock icon)
- [ ] Chapter 2+ are **locked** (greyed out, lock icon)
- [ ] "Start Chapter" button is **enabled**
- [ ] XP shows 0
- [ ] No error messages

#### Database Verification
```sql
-- Check castle progress created
SELECT unlocked, completed, completion_percentage 
FROM user_castle_progress 
WHERE user_id = 'YOUR_USER_ID' 
  AND castle_id = (SELECT id FROM castles WHERE route = 'castle1');

-- Expected: unlocked = true, completed = false, completion_percentage = 0

-- Check chapter progress created
SELECT c.chapter_number, ucp.unlocked, ucp.completed, ucp.xp_earned
FROM user_chapter_progress ucp
JOIN chapters c ON ucp.chapter_id = c.id
WHERE ucp.user_id = 'YOUR_USER_ID'
ORDER BY c.chapter_number;

-- Expected:
-- Chapter 1: unlocked = true, completed = false, xp_earned = 0
-- Chapter 2: unlocked = false, completed = false, xp_earned = 0
-- Chapter 3: unlocked = false, completed = false, xp_earned = 0
```

### ✅ Pass Criteria
- No console errors
- Castle loads successfully
- Database records created automatically
- Chapter 1 unlocked, others locked

---

## 🧪 Test Scenario 2: Existing User (Has Progress)

### Setup
```sql
-- Manually create some progress
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, total_xp_earned)
SELECT 'YOUR_USER_ID', id, true, false, 100
FROM castles WHERE route = 'castle1';

INSERT INTO user_chapter_progress (user_id, chapter_id, unlocked, completed, xp_earned)
SELECT 'YOUR_USER_ID', id, true, true, 100
FROM chapters 
WHERE castle_id = (SELECT id FROM castles WHERE route = 'castle1')
  AND chapter_number = 1;
```

### Steps
1. **Refresh page**: `/student/worldmap/castle1`

### Expected Results
#### Browser Console
```
[Castle1Page] Initializing castle for user: <userId>
[CastleAPI] Initializing castle progress: {...}
```

**Should NOT see**:
```
[CastleService] Creating castle progress...
[CastleService] Creating progress for chapter 1
```

#### UI Display
- [ ] Castle loads with existing progress
- [ ] Chapter 1 shows as **completed** (checkmark or crown)
- [ ] XP shows 100
- [ ] Progress bar reflects completion

#### Database Verification
```sql
-- Verify no duplicate records created
SELECT COUNT(*) FROM user_castle_progress 
WHERE user_id = 'YOUR_USER_ID' 
  AND castle_id = (SELECT id FROM castles WHERE route = 'castle1');
-- Expected: 1 (not 2)

SELECT COUNT(*) FROM user_chapter_progress 
WHERE user_id = 'YOUR_USER_ID';
-- Expected: 3 (not 6)
```

### ✅ Pass Criteria
- Existing progress preserved
- No duplicate records created
- UI reflects actual progress

---

## 🧪 Test Scenario 3: Network Tab Verification

### Steps
1. **Open DevTools** → Network tab
2. **Visit**: `/student/worldmap/castle1`
3. **Find request**: `POST /api/castles/initialize`

### Expected Request
```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "castleRoute": "castle1"
}
```

### Expected Response (Status 200)
```json
{
  "success": true,
  "data": {
    "castle": {
      "id": "...",
      "name": "Castle 1",
      "description": "...",
      "route": "castle1",
      "image_number": 1,
      "total_xp": 500
    },
    "castleProgress": {
      "unlocked": true,
      "completed": false,
      "total_xp_earned": 0,
      "completion_percentage": 0
    },
    "chapters": [
      {
        "id": "...",
        "title": "Chapter 1: The Point of Origin",
        "chapter_number": 1,
        "xp_reward": 100,
        "progress": {
          "unlocked": true,
          "completed": false,
          "xp_earned": 0
        }
      },
      // ... more chapters
    ]
  }
}
```

### ✅ Pass Criteria
- Single API call (not multiple)
- Response includes castle + progress + chapters
- All data properly formatted (snake_case)

---

## 🧪 Test Scenario 4: Error Handling

### Test 4a: Missing Castle
```sql
-- Ensure castle2 doesn't exist
DELETE FROM castles WHERE route = 'castle2';
```

**Steps**:
1. Change CASTLE_ROUTE to `'castle2'` in code
2. Visit page

**Expected**:
- Error message: "Castle with route 'castle2' not found"
- User shown error screen with "Return to World Map" button

### Test 4b: No Chapters
```sql
-- Remove all chapters for castle1
DELETE FROM chapters WHERE castle_id = (SELECT id FROM castles WHERE route = 'castle1');
```

**Steps**:
1. Visit `/student/worldmap/castle1`

**Expected**:
- Castle loads successfully
- Empty chapter list
- Message: "No chapters available"

### Test 4c: Unauthenticated User
**Steps**:
1. Logout
2. Try to visit `/student/worldmap/castle1`

**Expected**:
- Redirect to login page OR
- Error: "User not authenticated"

---

## 🧪 Test Scenario 5: Chapter Unlocking Logic

### Setup
```sql
-- Mark chapter 1 as completed
UPDATE user_chapter_progress 
SET completed = true, xp_earned = 100
WHERE user_id = 'YOUR_USER_ID'
  AND chapter_id = (
    SELECT id FROM chapters 
    WHERE castle_id = (SELECT id FROM castles WHERE route = 'castle1')
      AND chapter_number = 1
  );

-- Unlock chapter 2
UPDATE user_chapter_progress 
SET unlocked = true
WHERE user_id = 'YOUR_USER_ID'
  AND chapter_id = (
    SELECT id FROM chapters 
    WHERE castle_id = (SELECT id FROM castles WHERE route = 'castle1')
      AND chapter_number = 2
  );
```

### Expected
- [ ] Chapter 1: Completed (crown/checkmark icon)
- [ ] Chapter 2: Unlocked and auto-selected
- [ ] Chapter 3: Locked
- [ ] "Start Chapter" button points to chapter 2

---

## 📊 Test Results Summary

| Scenario | Status | Notes |
|----------|--------|-------|
| New User | ⬜ | Auto-creates progress |
| Existing User | ⬜ | Uses existing data |
| Network Request | ⬜ | Single API call |
| Missing Castle | ⬜ | Error handling |
| No Chapters | ⬜ | Graceful degradation |
| Unauthenticated | ⬜ | Proper redirect |
| Chapter Logic | ⬜ | Correct selection |

---

## 🐛 Common Issues & Solutions

### Issue: "Required repositories not injected"
**Cause**: container.js not updated
**Solution**: Restart backend server

### Issue: 404 on /api/castles/initialize
**Cause**: Route not registered
**Solution**: Check CastleRoutes.js, ensure `initialize` route is **before** `'/'` route

### Issue: Chapters not created
**Cause**: getChaptersByCastleId() returning empty
**Solution**: Check ChapterRepo uses correct Supabase syntax

### Issue: Castle always locked
**Cause**: unlock_order not = 1
**Solution**: Update castles table: `UPDATE castles SET unlock_order = 1 WHERE route = 'castle1'`

### Issue: TypeScript errors in castle1/page.tsx
**Cause**: Missing type imports
**Solution**: Types are now defined inline in the file

---

## ✅ Final Checklist

Before deploying to production:
- [ ] All test scenarios pass
- [ ] No console errors
- [ ] Database records created correctly
- [ ] No duplicate records
- [ ] Error handling works
- [ ] UI displays correctly
- [ ] Backend logs show initialization steps
- [ ] Network requests return proper data
- [ ] Castle images load (if available)
- [ ] Navigation works (back to world map, start chapter)

---

**Testing Complete!** 🎉

If all tests pass, the castle initialization system is working correctly and ready for use!
