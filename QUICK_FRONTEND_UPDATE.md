# Frontend Updates for Adaptive Topics

## Step 1: Update API Client

### File: `frontend/api/adaptive.js`

**Find and Replace:**
- Find: `chapterId` → Replace: `topicId`

---

## Step 2: Replace Adaptive Learning Page

### File: `frontend/app/student/adaptive-learning/page.tsx`

**Delete entire file contents and replace with this:**

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
            {selectedTopicId && (
              <p style={{
                marginTop: '8px',
                fontSize: '13px',
                color: '#6B7280',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {topics.find(t => t.id === selectedTopicId)?.description}
              </p>
            )}
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

---

## Step 3: Update AdaptiveLearning Component

### File: `frontend/components/adaptive/AdaptiveLearning.tsx`

**Find and Replace:**
- Find: `chapterId` → Replace: `topicId`
- Find: `ChapterID` → Replace: `TopicID`

**Update interface at top:**

```typescript
// CHANGE FROM:
interface AdaptiveLearningProps {
  chapterId: string;
}

// TO:
interface AdaptiveLearningProps {
  topicId: string;
}
```

**Update function signature:**

```typescript
// CHANGE FROM:
export default function AdaptiveLearning({ chapterId }: AdaptiveLearningProps) {

// TO:
export default function AdaptiveLearning({ topicId }: AdaptiveLearningProps) {
```

**Update all axios calls:**
- Find: `chapterId:` → Replace: `topicId:`
- Find: `/questions/${chapterId}` → Replace: `/questions/${topicId}`
- Find: `/state/${chapterId}` → Replace: `/state/${topicId}`

---

## Step 4: Test Frontend

### 1. Start Frontend
```bash
cd frontend
npm run dev
```

### 2. Navigate to Page
```
http://localhost:3000/student/adaptive-learning
```

### 3. Expected Behavior
✅ Dropdown shows 12 topics grouped by cognitive domain  
✅ Topics have clear names like "Basic Geometric Figures"  
✅ Selecting a topic loads the adaptive learning interface  
✅ Q-Learning adapts difficulty based on answers

---

## VS Code Quick Replace (Frontend)

Press `Ctrl+Shift+F`:
- **Search:** `chapterId`
- **Replace:** `topicId`
- **Files to include:** `frontend/**/*.{ts,tsx,js}`
- Click "Replace All"

**Manual review needed for:**
- `frontend/app/student/adaptive-learning/page.tsx` - Full file replace (see above)

---

## Total Time: 15-20 minutes

After completing:
1. Restart frontend dev server
2. Test topic selection
3. Test Q-Learning adaptation
4. Ready for team testing!
