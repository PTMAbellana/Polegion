# Adaptive Learning API Documentation

## 🎯 Overview
RESTful API for MDP-based adaptive difficulty adjustment system.

**Base URL:** `http://localhost:5000/api/adaptive`

**Authentication:** Required (Bearer token in header)

---

## 📡 API Endpoints

### 1. Submit Answer & Get Adaptive Feedback
**POST** `/api/adaptive/submit-answer`

Submit a student's answer and receive adaptive difficulty adjustment.

**Request Body:**
```json
{
  "chapterId": "uuid",
  "questionId": "uuid",
  "isCorrect": true,
  "timeSpent": 45
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "success": true,
    "isCorrect": true,
    "currentDifficulty": 4,
    "masteryLevel": 75.5,
    "action": "increase_difficulty",
    "actionReason": "Strong performance: 5 correct streak with 75.5% mastery. Increasing challenge.",
    "feedback": "Great job! Ready for a bigger challenge? 🚀"
  }
}
```

---

### 2. Get Adaptive Questions
**GET** `/api/adaptive/questions/:chapterId?count=10`

Get questions based on student's current difficulty level.

**Parameters:**
- `chapterId` (path): UUID of the chapter
- `count` (query, optional): Number of questions (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "questions": [...],
    "currentDifficulty": 3,
    "masteryLevel": 65.0,
    "difficultyLabel": "Medium"
  }
}
```

---

### 3. Get Student State
**GET** `/api/adaptive/state/:chapterId`

Get student's current adaptive learning state and performance metrics.

**Parameters:**
- `chapterId` (path): UUID of the chapter

**Response:**
```json
{
  "success": true,
  "data": {
    "currentDifficulty": 3,
    "difficultyLabel": "Medium",
    "masteryLevel": 72.5,
    "correctStreak": 4,
    "wrongStreak": 0,
    "totalAttempts": 25,
    "accuracy": "76.0",
    "recentHistory": [
      {
        "action": "increase_difficulty",
        "wasCorrect": true,
        "difficultyChange": 1,
        "timestamp": "2025-12-23T10:30:00Z"
      }
    ]
  }
}
```

---

### 4. Reset Difficulty
**POST** `/api/adaptive/reset/:chapterId`

Reset student's difficulty level to medium (3) for a chapter.

**Parameters:**
- `chapterId` (path): UUID of the chapter

**Response:**
```json
{
  "success": true,
  "message": "Difficulty reset to medium level",
  "data": {
    "chapterId": "uuid",
    "difficulty": 3
  }
}
```

---

### 5. Get Research Statistics
**GET** `/api/adaptive/stats?chapterId=uuid`

Get aggregated statistics for research analysis.

**Parameters:**
- `chapterId` (query, optional): Filter by specific chapter

**Response:**
```json
{
  "success": true,
  "data": {
    "totalStudents": 50,
    "averageMastery": 68.5,
    "averageDifficulty": 3.2,
    "difficultyDistribution": {
      "level1": 5,
      "level2": 12,
      "level3": 18,
      "level4": 10,
      "level5": 5
    },
    "masteryDistribution": {
      "low": 10,
      "medium": 25,
      "high": 15
    }
  }
}
```

---

## 🧠 MDP Logic

### Difficulty Levels
1. **Level 1** - Very Easy
2. **Level 2** - Easy
3. **Level 3** - Medium (default)
4. **Level 4** - Hard
5. **Level 5** - Very Hard

### Actions Taken
- `decrease_difficulty` - Too hard, make easier
- `maintain_difficulty` - Just right, continue
- `increase_difficulty` - Too easy, make harder
- `advance_chapter` - Mastered, ready for next
- `repeat_current` - Needs more practice

### Rules (Simplified MDP)
```
IF wrong_streak >= 3 AND difficulty > 1
  → DECREASE difficulty (prevent frustration)

IF mastery >= 85% AND correct_streak >= 3 AND difficulty == 5
  → ADVANCE to next chapter

IF correct_streak >= 5 AND mastery >= 75% AND difficulty < 5
  → INCREASE difficulty (add challenge)

IF correct_streak >= 8 AND difficulty <= 2 AND mastery >= 80%
  → INCREASE difficulty (too easy)

ELSE
  → MAINTAIN current difficulty
```

---

## 🧪 Testing with Postman/Thunder Client

### 1. Login to get token
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

Copy the `token` from response.

### 2. Submit answers
```http
POST http://localhost:5000/api/adaptive/submit-answer
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "chapterId": "chapter-uuid-here",
  "questionId": "question-uuid-here",
  "isCorrect": true,
  "timeSpent": 30
}
```

### 3. Check your state
```http
GET http://localhost:5000/api/adaptive/state/chapter-uuid-here
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📊 Database Tables

### student_difficulty_levels
Tracks current state per student per chapter.

**Columns:**
- `user_id`, `chapter_id` (composite key)
- `difficulty_level` (1-5)
- `mastery_level` (0-100)
- `correct_streak`, `wrong_streak`
- `total_attempts`, `correct_answers`

### mdp_state_transitions
Logs every decision for research analysis.

**Columns:**
- `user_id`, `chapter_id`, `timestamp`
- `prev_*` fields (state before)
- `action`, `action_reason`
- `new_*` fields (state after)
- `reward`
- `question_id`, `was_correct`, `time_spent_seconds`

---

## 🚀 Quick Start for Team

### 1. Run SQL Migration
```sql
-- Execute this in Supabase SQL Editor
\i docs/sql/ADAPTIVE_LEARNING_SCHEMA.sql
```

### 2. Start Backend
```powershell
cd backend
node server.js
# Should see: "Server running on port 5000"
```

### 3. Test Endpoint
```powershell
# Test health check (no auth needed)
curl http://localhost:5000/api/adaptive/health
```

---

## 📝 Notes for Research

**What gets logged:**
- Every answer submitted
- Every difficulty adjustment
- Mastery level changes
- Time spent per question
- Full state transitions

**For analysis:**
```sql
-- View all transitions
SELECT * FROM mdp_state_transitions ORDER BY timestamp DESC;

-- View current student states
SELECT * FROM student_performance_summary;

-- Get average mastery by difficulty
SELECT difficulty_level, AVG(mastery_level) 
FROM student_difficulty_levels 
GROUP BY difficulty_level;
```

---

## 🐛 Troubleshooting

**Error: "Chapter ID is required"**
- Ensure you're passing `chapterId` in request body/params

**Error: "Unauthorized"**
- Check your Bearer token is valid and not expired
- Re-login to get a new token

**Error: "Cannot find module"**
- Run `npm install` in backend folder

**Database errors**
- Ensure SQL migration has been executed in Supabase
- Check Supabase connection in `.env`

---

## ✅ Implementation Checklist

Backend (Complete):
- [x] Database schema created
- [x] AdaptiveLearningRepo.js
- [x] AdaptiveLearningService.js (rule-based MDP)
- [x] AdaptiveLearningController.js
- [x] AdaptiveLearningRoutes.js
- [x] Registered in container.js and server.js
- [x] Server tested and running

Frontend (To Do):
- [ ] Create `/student/adaptive` page
- [ ] Question display component
- [ ] Answer submission form
- [ ] State display (difficulty, mastery)
- [ ] Connect to API endpoints

---

**Questions?** Check [RESEARCH_IMPLEMENTATION_PLAN.md](../../RESEARCH_IMPLEMENTATION_PLAN.md) for detailed specs.
