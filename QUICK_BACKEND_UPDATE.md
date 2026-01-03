# Quick Backend Update Script

## Files to Update Manually (Search & Replace)

### 1. backend/presentation/controllers/AdaptiveLearningController.js

**Find and Replace (case-sensitive):**
- Find: `chapterId` → Replace: `topicId`
- Find: `Chapter ID` → Replace: `Topic ID`
- Find: `/adaptive/state/:chapterId` → Replace: `/adaptive/state/:topicId`
- Find: `/adaptive/reset/:chapterId` → Replace: `/adaptive/reset/:topicId`
- Find: `/adaptive/predict/:chapterId` → Replace: `/adaptive/predict/:topicId`
- Find: `/adaptive/questions/:chapterId` → Replace: `/adaptive/questions/:topicId`

**Result:** 15 replacements

### 2. backend/presentation/routes/AdaptiveLearningRoutes.js

**Add new route FIRST (line 17, after `initializeRoutes()`):**

```javascript
    /**
     * @route   GET /api/adaptive/topics
     * @desc    Get all available learning topics
     * @access  Private (authenticated)
     */
    this.router.get(
      '/topics',
      this.controller.getTopics.bind(this.controller)
    );
```

**Then Find and Replace:**
- Find: `:chapterId` → Replace: `:topicId`
- Find: `chapterId` → Replace: `topicId`

**Result:** ~10 replacements

### 3. backend/application/services/AdaptiveLearningService.js

**Add new method at top (after constructor):**

```javascript
  /**
   * Get all available adaptive learning topics
   */
  async getAllTopics() {
    return await this.repo.getAllTopics();
  }
```

**Then Find and Replace:**
- Find: `chapterId` → Replace: `topicId`
- Find: `chapter_id` → Replace: `topic_id`

**Result:** ~50+ replacements

### 4. backend/infrastructure/repository/AdaptiveLearningRepo.js

**Already partially updated!** Just fix one remaining issue:

**Line 96:** Change `chapterId` to `topicId` in cache key

```javascript
// OLD:
const cacheKey = cache.generateKey('student_difficulty', userId, chapterId);

// NEW:
const cacheKey = cache.generateKey('student_difficulty', userId, topicId);
```

---

## Quick Test After Updates

### 1. Test Topics Endpoint

```bash
# Start backend
cd backend
npm start
```

```bash
# Test in another terminal (or use Postman)
curl http://localhost:5000/api/adaptive/topics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid...",
      "topic_code": "BASIC_FIGURES",
      "topic_name": "Basic Geometric Figures",
      "description": "...",
      "cognitive_domain": "knowledge_recall"
    },
    ...
  ]
}
```

### 2. Test Submit Answer

```bash
curl -X POST http://localhost:5000/api/adaptive/submit-answer \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topicId": "TOPIC_UUID_FROM_ABOVE",
    "questionId": "q1",
    "isCorrect": true,
    "timeSpent": 30
  }'
```

---

## VS Code Find & Replace Instructions

### For Each File:

1. Press `Ctrl+H` (Windows) or `Cmd+H` (Mac)
2. Click the case-sensitive button (Aa)
3. Type find term in top box
4. Type replace term in bottom box
5. Click "Replace All" button

**OR use this faster method:**

Press `Ctrl+Shift+F` (Find in Files)
- Search: `chapterId`
- Replace: `topicId`
- Files to include: `backend/**/*.js`
- Click "Replace All" (2nd icon)

---

## Estimated Time: 10-15 minutes

After completing these replacements:
1. Restart backend server
2. Test `/api/adaptive/topics` endpoint
3. Move to frontend updates (next step)
