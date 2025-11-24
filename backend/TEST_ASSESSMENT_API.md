# Assessment API Testing Guide

## Prerequisites
1. Backend server running: `node server.js` or `npm start`
2. Valid JWT token from login
3. User ID from authenticated user

## API Endpoints

### 1. Generate Assessment
**Request:**
```http
POST http://localhost:5000/api/assessments/generate/pretest
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "your-user-id-here"
}
```

**Expected Response:**
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "What is polymorphism in OOP?",
      "options": ["A", "B", "C", "D"],
      "category": "Concept Understanding",
      "difficulty": "Medium"
    }
    // ... 59 more questions (10 per category)
  ],
  "metadata": {
    "totalQuestions": 60,
    "testType": "pretest",
    "categoriesIncluded": [
      "Knowledge Recall",
      "Concept Understanding",
      "Procedural Skills",
      "Analytical Thinking",
      "Problem-Solving",
      "Higher-Order Thinking"
    ]
  }
}
```

### 2. Submit Assessment
**Request:**
```http
POST http://localhost:5000/api/assessments/submit
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "userId": "your-user-id-here",
  "testType": "pretest",
  "answers": [
    { "questionId": 1, "selectedAnswer": "A" },
    { "questionId": 2, "selectedAnswer": "C" },
    // ... 58 more answers
  ]
}
```

**Expected Response:**
```json
{
  "success": true,
  "results": {
    "userId": "your-user-id-here",
    "testType": "pretest",
    "totalQuestions": 60,
    "correctAnswers": 42,
    "percentage": 70.00,
    "categoryScores": {
      "Knowledge Recall": { "correct": 7, "total": 10, "percentage": 70.00 },
      "Concept Understanding": { "correct": 8, "total": 10, "percentage": 80.00 },
      "Procedural Skills": { "correct": 6, "total": 10, "percentage": 60.00 },
      "Analytical Thinking": { "correct": 7, "total": 10, "percentage": 70.00 },
      "Problem-Solving": { "correct": 8, "total": 10, "percentage": 80.00 },
      "Higher-Order Thinking": { "correct": 6, "total": 10, "percentage": 60.00 }
    },
    "completedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Assessment submitted successfully"
}
```

### 3. Get Assessment Results
**Request:**
```http
GET http://localhost:5000/api/assessments/results/your-user-id-here/pretest
Authorization: Bearer <your-jwt-token>
```

**Expected Response:**
```json
{
  "success": true,
  "results": {
    "userId": "your-user-id-here",
    "testType": "pretest",
    "totalQuestions": 60,
    "correctAnswers": 42,
    "percentage": 70.00,
    "categoryScores": { /* same as above */ },
    "completedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 4. Get Comparison Data (Pretest vs Posttest)
**Request:**
```http
GET http://localhost:5000/api/assessments/comparison/your-user-id-here
Authorization: Bearer <your-jwt-token>
```

**Expected Response:**
```json
{
  "success": true,
  "comparison": {
    "pretest": {
      "percentage": 70.00,
      "categoryScores": { /* ... */ },
      "completedAt": "2024-01-15T10:30:00.000Z"
    },
    "posttest": {
      "percentage": 85.00,
      "categoryScores": { /* ... */ },
      "completedAt": "2024-03-20T14:45:00.000Z"
    },
    "improvements": {
      "overallImprovement": 15.00,
      "categoryImprovements": {
        "Knowledge Recall": 10.00,
        "Concept Understanding": 5.00,
        "Procedural Skills": 20.00,
        "Analytical Thinking": 15.00,
        "Problem-Solving": 10.00,
        "Higher-Order Thinking": 25.00
      }
    }
  }
}
```

## Testing Steps

### Step 1: Generate Pretest
1. Start backend server
2. Login to get JWT token
3. Send POST request to `/api/assessments/generate/pretest`
4. Save the returned questions (you'll need the question IDs)

### Step 2: Submit Pretest
1. Use the question IDs from Step 1
2. Create answers array with all 60 questions
3. Send POST request to `/api/assessments/submit`
4. Verify the results are saved correctly

### Step 3: Retrieve Results
1. Send GET request to `/api/assessments/results/:userId/pretest`
2. Verify results match what was submitted

### Step 4: Complete Posttest
1. Generate posttest: POST `/api/assessments/generate/posttest`
2. Submit posttest: POST `/api/assessments/submit` with testType="posttest"

### Step 5: View Comparison
1. Send GET request to `/api/assessments/comparison/:userId`
2. Verify improvements are calculated correctly

## Testing with Postman/Thunder Client

### Collection Setup
1. Create new collection: "Assessment API"
2. Add environment variables:
   - `baseUrl`: http://localhost:5000
   - `token`: <your-jwt-token>
   - `userId`: <your-user-id>

### Request Templates

**Generate Pretest:**
- Method: POST
- URL: `{{baseUrl}}/api/assessments/generate/pretest`
- Headers: `Authorization: Bearer {{token}}`
- Body: `{"userId": "{{userId}}"}`

**Submit Assessment:**
- Method: POST
- URL: `{{baseUrl}}/api/assessments/submit`
- Headers: `Authorization: Bearer {{token}}`
- Body: See above

**Get Results:**
- Method: GET
- URL: `{{baseUrl}}/api/assessments/results/{{userId}}/pretest`
- Headers: `Authorization: Bearer {{token}}`

**Get Comparison:**
- Method: GET
- URL: `{{baseUrl}}/api/assessments/comparison/{{userId}}`
- Headers: `Authorization: Bearer {{token}}`

## Expected Database Changes

After submitting assessment, check these tables:

1. **user_assessment_attempts** - Should have 60 rows (one per question)
2. **user_assessment_results** - Should have 1 row with overall results
3. Query to verify:
```sql
-- Check attempts count
SELECT COUNT(*) FROM user_assessment_attempts 
WHERE user_id = 'your-user-id' AND test_type = 'pretest';
-- Should return 60

-- Check results
SELECT * FROM user_assessment_results 
WHERE user_id = 'your-user-id' AND test_type = 'pretest';
-- Should return 1 row with all scores
```

## Common Issues

### 401 Unauthorized
- Check JWT token is valid
- Verify token in Authorization header

### 404 Not Found
- Backend server running?
- Correct port (5000)?
- Route registered in server.js?

### 500 Internal Server Error
- Check backend logs for stack trace
- Verify database connection
- Check all 260 questions exist in `assessment_questions` table

### Empty Questions Array
- Verify questions inserted into database
- Check category names match exactly
- Check test_type column has correct values

## Success Criteria

✅ Generate returns 60 randomized questions (10 per category)
✅ Submit calculates scores correctly
✅ Results saved to database
✅ Get results retrieves saved data
✅ Comparison shows both tests with improvements
✅ No duplicate results for same user/test type (upsert works)
✅ Category scores add up to overall score

## Next Steps After Testing

1. ✅ Verify all endpoints work
2. Connect frontend AssessmentPageBase to these APIs
3. Install recharts library
4. Implement radar chart in AssessmentResults
5. Add loading states and error handling
6. Test end-to-end flow in browser
