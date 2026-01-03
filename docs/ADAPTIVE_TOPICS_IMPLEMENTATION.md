# Implementation Guide: Adaptive Learning Topics System

## ✅ COMPLETED
- [x] Created SQL schema: `docs/sql/CREATE_ADAPTIVE_LEARNING_TOPICS.sql`
- [x] Defined 16 clear, descriptive geometry topics (not story names)
- [x] Separated from worldmap chapters system

## 📝 TODO: Backend Updates

### 1. Run the SQL Migration (FIRST STEP!)

```bash
# Copy the SQL file content from:
docs/sql/CREATE_ADAPTIVE_LEARNING_TOPICS.sql

# Run it in your Supabase SQL Editor:
# 1. Go to Supabase Dashboard
# 2. Click "SQL Editor"
# 3. Paste the entire SQL file
# 4. Click "Run"
```

This creates:
- `adaptive_learning_topics` table (16 geometry topics)
- `adaptive_learning_state` table (replaces `student_difficulty_levels`)
- `adaptive_state_transitions` table (Q-Learning logging)

### 2. Update Backend Files

#### File: `backend/infrastructure/repository/AdaptiveLearningRepo.js`

**Changes already made:**
- ✅ Added `getAllTopics()` method
- ✅ Updated `getStudentDifficulty(userId, topicId)` to use new table
- ✅ Updated `createStudentDifficulty(userId, topicId)`
- ✅ Updated `updateStudentDifficulty(userId, topicId, updates)`

**Still needs fixing** (Lines 96, 148, 202):
1. Line 96: Change `chapterId` to `topicId` in cache key
2. Line 148-186: Update `logStateTransition()` to match new schema
3. Line 242+: Update `getAllStudentDifficulties()` to use new table

#### File: `backend/presentation/controllers/AdaptiveLearningController.js`

Add new method to get topics:

```javascript
/**
 * GET /api/adaptive/topics
 * Get all available adaptive learning topics
 */
async getTopics(req, res) {
  try {
    const topics = await this.service.getAllTopics();
    return res.status(200).json({
      success: true,
      data: topics
    });
  } catch (error) {
    console.error('Error in getTopics:', error);
    return res.status(500).json({
      error: 'Failed to get topics',
      message: error.message
    });
  }
}
```

Update existing methods - change all instances of `chapterId` to `topicId`:
- `submitAnswer(req, res)` - Line 15
- `getAdaptiveQuestions(req, res)` - Line 47
- `getStudentState(req, res)` - Line 75
- `resetProgress(req, res)` - Line 105
- `predictPerformance(req, res)` - Line 226

#### File: `backend/presentation/routes/AdaptiveLearningRoutes.js`

Add new route:

```javascript
/**
 * @route   GET /api/adaptive/topics
 * @desc    Get all available learning topics
 * @access  Public (authenticated)
 */
router.get('/topics', 
  authMiddleware,
  this.controller.getTopics.bind(this.controller)
);
```

Update param names in existing routes:
- Change `:chapterId` to `:topicId` in routes
- Update swagger docs

#### File: `backend/application/services/AdaptiveLearningService.js`

Add method:

```javascript
/**
 * Get all available adaptive learning topics
 */
async getAllTopics() {
  return await this.repo.getAllTopics();
}
```

Update method signatures - change all `chapterId` to `topicId`:
- `processAnswer(userId, topicId, questionId, isCorrect, timeSpent)` - Line 102
- `getAdaptiveQuestions(userId, topicId, count)` - Line 178
- `getStudentState(userId, topicId)` - Line 213
- `resetStudentProgress(userId, topicId)` - Line 236

### 3. Update Frontend Files

#### File: `frontend/app/student/adaptive-learning/page.tsx`

Replace entire file with:

```typescript
'use client';

import { useEffect, useState } from 'react';
import AdaptiveLearning from '@/components/adaptive/AdaptiveLearning';
import Loader from '@/components/Loader';
import axios from 'axios';

interface Topic {
  id: string;
  topic_code: string;
  topic_name: string;
  description: string;
  cognitive_domain: string;
}

export default function AdaptiveLearningPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await axios.get('/api/adaptive/topics');
      if (response.data.success) {
        const topicsData = response.data.data || [];
        setTopics(topicsData);
        // Auto-select first topic
        if (topicsData.length > 0) {
          setSelectedTopicId(topicsData[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  // Group topics by cognitive domain
  const groupedTopics = topics.reduce((acc, topic) => {
    const domain = topic.cognitive_domain;
    if (!acc[domain]) acc[domain] = [];
    acc[domain].push(topic);
    return acc;
  }, {} as Record<string, Topic[]>);

  const domainLabels: Record<string, string> = {
    knowledge_recall: '📚 Knowledge & Recall',
    concept_understanding: '💡 Concept Understanding',
    procedural_skills: '🔧 Procedural Skills',
    analytical_thinking: '🧠 Analytical Thinking',
    problem_solving: '🎯 Problem Solving',
    higher_order_thinking: '🚀 Advanced Topics'
  };

  return (
    <>
      {/* Topic Selector Header */}
      {topics.length > 0 && (
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #E5E7EB',
          padding: '20px 16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: '#374151',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Select a Geometry Topic
            </label>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '15px',
                border: '2px solid #E5E7EB',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#1F2937',
                cursor: 'pointer',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                outline: 'none'
              }}
            >
              <option value="">Choose a topic to begin adaptive learning</option>
              {Object.entries(groupedTopics).map(([domain, domainTopics]) => (
                <optgroup key={domain} label={domainLabels[domain] || domain}>
                  {domainTopics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.topic_name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Adaptive Learning Component */}
      {selectedTopicId ? (
        <AdaptiveLearning topicId={selectedTopicId} />
      ) : (
        <div style={{
          minHeight: '80vh',
          background: '#F9FAFB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '400px' }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              backgroundColor: '#EFF6FF',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px'
            }}>
              🎯
            </div>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#1F2937',
              marginBottom: '8px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              AI-Powered Adaptive Learning
            </h2>
            <p style={{ 
              fontSize: '15px', 
              color: '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Select a topic above. Our Q-Learning AI will adapt question difficulty based on your performance in real-time.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
```

#### File: `frontend/components/adaptive/AdaptiveLearning.tsx`

Change prop from `chapterId` to `topicId`:

```typescript
interface AdaptiveLearningProps {
  topicId: string;  // Changed from chapterId
}

export default function AdaptiveLearning({ topicId }: AdaptiveLearningProps) {
  // Update all axios calls to use topicId instead of chapterId
  // Line 72: POST /api/adaptive/submit-answer with topicId
  // Line 58: GET /api/adaptive/questions/${topicId}
  // etc.
}
```

#### File: `frontend/api/adaptive.js`

Update all parameter names from `chapterId` to `topicId`

## 🎯 Benefits of New System

### For Students:
✅ Clear topic names: "Perimeter Calculations" not "Paths of Power"  
✅ See exactly what they're learning  
✅ Choose topics by difficulty level

### For Research (ICETT Paper):
✅ Clean separation from game/worldmap  
✅ Topics organized by cognitive domain (Bloom's Taxonomy)  
✅ Better data collection and analysis  
✅ Professional topic naming for academic paper

### For Q-Learning AI:
✅ Each topic has independent Q-Table  
✅ Tracks mastery per specific geometry concept  
✅ Better granularity for adaptation  

## 📊 Topics Created

**Knowledge Recall (3 topics):**
- Points, Lines, and Line Segments
- Angle Types and Measurement
- 2D Shapes and Polygons

**Concept Understanding (3 topics):**
- Angle Relationships
- Parallel and Perpendicular Lines
- Parts of a Circle

**Procedural Skills (3 topics):**
- Perimeter Calculations
- Area of 2D Shapes
- Circle Circumference

**Analytical Thinking (3 topics):**
- Polygon Interior Angles
- Surface Area of 3D Shapes
- Volume of 3D Shapes

**Problem Solving (2 topics):**
- Geometry Word Problems
- Composite Shape Calculations

**Higher Order Thinking (2 topics):**
- Geometric Proofs and Reasoning
- Optimization Problems

**Total: 16 Topics** covering full geometry curriculum

## ⏱️ Implementation Timeline

**Immediately (Jan 3):**
1. Run SQL migration in Supabase
2. Update backend repository (30 min)
3. Update backend controller (20 min)
4. Update backend service (20 min)
5. Update backend routes (10 min)

**After backend works (Jan 3 evening):**
6. Update frontend page (30 min)
7. Update frontend component (20 min)
8. Update API client (10 min)

**Test (Jan 4 morning):**
9. Test topic selection
10. Test Q-Learning with new topics
11. Collect data for paper

**Total estimate: 2-3 hours**
