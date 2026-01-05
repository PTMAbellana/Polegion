# Quick Start Guide - Adaptive Learning Flow

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
# Frontend - Add confetti library
cd frontend
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti

# Backend - Gemini AI (if not already installed)
cd backend
npm install @google/generative-ai
```

### Step 2: Database Setup

Run these SQL migrations in Supabase SQL Editor:

1. Open Supabase Dashboard → SQL Editor
2. Create new query
3. Copy and paste `backend/infrastructure/migrations/01_create_user_topic_progress.sql`
4. Run
5. Create another new query
6. Copy and paste `backend/infrastructure/migrations/02_create_question_attempts.sql`
7. Run

### Step 3: Environment Variables

Add to `backend/.env`:

```bash
# Gemini AI for Question Generation
GEMINI_API_KEY=your_gemini_api_key_here
AI_MODEL=gemini-2.0-flash-exp

# Optional: Override default limits
AI_QUESTION_DAILY_LIMIT=500
AI_QUESTION_PER_MINUTE_LIMIT=10
```

Get Gemini API key: https://makersuite.google.com/app/apikey

### Step 4: Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 5: Initialize Topics for Existing Users

Run this query in Supabase SQL Editor to initialize topics for existing users:

```sql
-- Initialize all topics for all users
-- Topic 1 will be unlocked, rest locked
INSERT INTO user_topic_progress (user_id, topic_id, unlocked, mastered, mastery_level, mastery_percentage)
SELECT 
  u.id as user_id,
  t.id as topic_id,
  CASE WHEN t.order_index = 1 THEN TRUE ELSE FALSE END as unlocked,
  FALSE as mastered,
  0 as mastery_level,
  0 as mastery_percentage
FROM users u
CROSS JOIN adaptive_learning_topics t
ON CONFLICT (user_id, topic_id) DO NOTHING;
```

### Step 6: Test the System

1. Log in as a student
2. Navigate to Adaptive Learning
3. Should see Topic 1 unlocked, others locked
4. Complete questions to increase mastery
5. When mastery reaches 60% (Level 3), next topic unlocks 🎉
6. When mastery reaches 90% (Level 5), celebration with confetti ✨

---

## 📱 Using the Features

### Topic Selector
```tsx
import TopicSelector from '@/components/adaptive/TopicSelector';

<TopicSelector 
  onSelectTopic={(topicId) => {
    // Handle topic selection
  }}
  selectedTopicId={currentTopicId}
/>
```

### Adaptive Learning with Unlocking
```tsx
import AdaptiveLearning from '@/components/adaptive/AdaptiveLearning';

<AdaptiveLearning topicId="topic-uuid-here" />
```

The component now automatically handles:
- Session tracking
- Hint modals on wrong answers
- Topic unlock celebrations
- Mastery celebrations with confetti
- Similar question generation

### Celebration Modal (Standalone)
```tsx
import CelebrationModal from '@/components/adaptive/CelebrationModal';

<CelebrationModal
  type="unlock"  // or "mastery"
  title="Topic Unlocked!"
  message="Great job! You've unlocked Triangles!"
  onClose={() => setShow(false)}
  show={showModal}
/>
```

---

## 🧪 Quick Test Script

Run this in your browser console while on the adaptive learning page:

```javascript
// Test API endpoints
const testAdaptiveFlow = async () => {
  // 1. Get topics with progress
  const topics = await fetch('/api/adaptive/topics-with-progress').then(r => r.json());
  console.log('Topics:', topics);
  
  // 2. Check if initialized
  if (!topics.data || topics.data.length === 0) {
    await fetch('/api/adaptive/initialize-topics', { method: 'POST' });
    console.log('Topics initialized');
  }
  
  // 3. Generate AI question (difficulty 4)
  const aiQuestion = await fetch('/api/adaptive/generate-ai-question', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      topicId: topics.data[0].id,
      difficultyLevel: 4,
      cognitiveDomain: 'analytical_thinking'
    })
  }).then(r => r.json());
  console.log('AI Question:', aiQuestion);
};

testAdaptiveFlow();
```

---

## 🐛 Troubleshooting

### Error: "canvas-confetti not found"
```bash
cd frontend
npm install canvas-confetti
```

### Error: "Topics not initialized"
- Run the SQL query in Step 5 above
- Or call `/api/adaptive/initialize-topics` endpoint

### Error: "AI question generation failed"
- Check GEMINI_API_KEY is set in .env
- Verify API key is valid at https://makersuite.google.com/app/apikey
- Check backend logs for rate limit errors
- System will fallback to parametric questions automatically

### Error: "RLS policy violation"
- Ensure user is authenticated
- Check auth.uid() matches user_id in database
- Verify RLS policies are enabled on new tables

### No confetti animation
- Check browser console for errors
- Ensure canvas-confetti is installed
- Try on different browser (Chrome/Firefox work best)

---

## 📊 Monitoring

### Check AI Usage
```bash
# Backend endpoint
GET /api/adaptive/qlearning/stats
```

Returns:
```json
{
  "success": true,
  "data": {
    "totalStates": 150,
    "averageQValues": 2.34,
    "aiQuestionStats": {
      "dailyCount": 45,
      "dailyLimit": 500
    }
  }
}
```

### Check Topic Unlock Rates
```sql
-- In Supabase SQL Editor
SELECT 
  t.topic_name,
  COUNT(CASE WHEN utp.unlocked THEN 1 END) as unlocked_count,
  COUNT(CASE WHEN utp.mastered THEN 1 END) as mastered_count,
  COUNT(*) as total_users,
  ROUND(AVG(utp.mastery_percentage), 2) as avg_mastery
FROM user_topic_progress utp
JOIN adaptive_learning_topics t ON t.id = utp.topic_id
GROUP BY t.topic_name, t.order_index
ORDER BY t.order_index;
```

---

## 🎯 Success Indicators

You'll know it's working when:

1. ✅ New users see Topic 1 unlocked, others locked
2. ✅ Progress bars update as you answer questions
3. ✅ Wrong answers show hint modal
4. ✅ 2nd wrong answer generates similar question
5. ✅ Reaching 60% mastery unlocks next topic with celebration
6. ✅ Reaching 90% mastery shows confetti celebration
7. ✅ No question repeats in same session
8. ✅ Difficulty 4-5 questions look different (AI-generated)

---

## 📞 Support

If you encounter issues:
1. Check ADAPTIVE_FLOW_IMPLEMENTATION_COMPLETE.md for detailed docs
2. Review backend logs for errors
3. Check browser console for frontend errors
4. Verify database migrations ran successfully
5. Test API endpoints individually

Happy Learning! 🎓✨
