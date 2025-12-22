# Research Implementation Plan: Adaptive Learning with MDP
**Deadline:** January 5, 2025 (14 days)  
**Branch:** `research-adaptive-learning-mdp`

## Research Objective
Implement an interactive, adaptive geometry learning platform using **Markov Decision Processes (MDP)** to optimize real-time lesson difficulty based on student performance.

### Core Research Questions
1. Can MDP effectively adapt lesson difficulty in real-time?
2. How does adaptive difficulty impact learning progression?
3. What is the optimal balance between challenge and mastery?

---

## Phase 1: Feature Removal (Day 1-2) 🗑️

### What to REMOVE (Simplify for Research Focus)

**Complete Removal:**
- ❌ Competition system (entire feature)
- ❌ Virtual rooms (teacher-student classroom management)
- ❌ Teacher role and dashboard
- ❌ Email invitations
- ❌ Leaderboards (global/competitive)
- ❌ Multi-user real-time features
- ❌ Google OAuth (keep simple email/password)

**What to KEEP (Core for Research):**
- ✅ Student authentication (email/password only)
- ✅ Castle/Chapter structure (learning path)
- ✅ Assessment system (will make adaptive)
- ✅ Problem submission tracking
- ✅ User progress tracking
- ✅ XP system (for motivation)
- ✅ Supabase backend (for data collection)

### Files to Delete

**Backend:**
```
backend/presentation/controllers/
  ❌ competitionController.js
  ❌ roomController.js
  ❌ leaderboardController.js

backend/presentation/routes/
  ❌ competitionRoutes.js
  ❌ roomRoutes.js

backend/application/services/
  ❌ competitionService.js
  ❌ roomService.js
  ❌ leaderboardService.js

backend/infrastructure/repository/
  ❌ competitionRepository.js
  ❌ roomRepository.js

backend/utils/
  ❌ GoogleAuth.js
  ❌ Mailer.js
```

**Frontend:**
```
frontend/app/teacher/          # Entire directory
frontend/app/student/rooms/    # Room participation
frontend/components/competitions/
frontend/components/leaderboards/
frontend/components/rooms/
```

### Database Tables to Keep (Ignore Others)
- ✅ users (students only)
- ✅ castles
- ✅ chapters
- ✅ assessments
- ✅ questions
- ✅ user_answers
- ✅ user_progress
- ✅ student_castle_progress
- ❌ competitions (ignore/delete)
- ❌ rooms (ignore/delete)
- ❌ room_participants (ignore/delete)
- ❌ problem_leaderboards (ignore/delete)

---

## Phase 2: MDP Implementation (Day 3-7) 🧠

### MDP Components for Adaptive Learning

#### 1. State Space (S)
Student's current learning state:
```javascript
State = {
  currentChapter: number,
  masteryLevel: [0-1],        // 0 = no mastery, 1 = complete mastery
  recentPerformance: [0-1],   // Last 5 assessment scores
  consecutiveCorrect: number,  // Streak of correct answers
  consecutiveWrong: number,    // Streak of wrong answers
  timeSpentOnChapter: minutes,
  attemptsOnCurrentLevel: number
}
```

#### 2. Action Space (A)
Possible difficulty adjustments:
```javascript
Actions = {
  REPEAT_CURRENT: 'repeat_current_difficulty',
  DECREASE_DIFFICULTY: 'easier_problems',
  MAINTAIN_DIFFICULTY: 'same_level',
  INCREASE_DIFFICULTY: 'harder_problems',
  ADVANCE_CHAPTER: 'move_to_next_chapter',
  REVIEW_PREVIOUS: 'review_previous_concept'
}
```

#### 3. Transition Function (P)
Probability of moving between states based on action:
```javascript
P(s' | s, a) = probability of reaching state s' from state s taking action a

// Example:
// If student has 80% mastery and we INCREASE_DIFFICULTY:
// - 70% chance mastery stays 70-85%
// - 20% chance mastery drops to 60-70%
// - 10% chance mastery improves to 85-95%
```

#### 4. Reward Function (R)
Optimize for learning efficiency:
```javascript
R(s, a, s') = {
  // Positive rewards
  +10: Advanced to next chapter with mastery >= 0.8
  +5:  Improved mastery level
  +3:  Maintained high mastery (0.7-0.9)
  +1:  Correct answer at appropriate difficulty
  
  // Negative rewards (penalties)
  -5:  Student frustrated (too hard, 5+ wrong in a row)
  -3:  Student bored (too easy, 10+ correct at low difficulty)
  -2:  Mastery decreased
  -1:  Repeated same level too many times (>5)
}
```

#### 5. Policy (π)
Decision-making strategy:
```javascript
// Epsilon-greedy policy with decay
π(a | s) = {
  explore: Random action (10% initially, decay to 1%)
  exploit: Best action based on Q-values (90%)
}
```

### MDP Algorithm: Q-Learning (Simplified for Real-time)

```javascript
// Initialize Q-table
Q[state][action] = 0 for all state-action pairs

// Learning parameters
alpha = 0.1      // Learning rate
gamma = 0.9      // Discount factor
epsilon = 0.1    // Exploration rate

// For each assessment submission:
1. Observe current state (s)
2. Choose action (a) using epsilon-greedy policy
3. Execute action (adjust difficulty)
4. Observe new state (s') and reward (r)
5. Update Q-value:
   Q[s][a] = Q[s][a] + alpha * (r + gamma * max(Q[s'][a']) - Q[s][a])
6. Update epsilon (decay): epsilon = epsilon * 0.995
```

### Simplified Implementation (Feasible in 2 Weeks)

**Backend Service:** `backend/application/services/adaptiveLearningService.js`

```javascript
class AdaptiveLearningService {
  // State assessment
  async assessStudentState(userId, chapterId) {
    const recentAnswers = await this.getRecentAnswers(userId, chapterId, 10);
    const masteryLevel = this.calculateMastery(recentAnswers);
    const streak = this.calculateStreak(recentAnswers);
    
    return {
      userId,
      chapterId,
      masteryLevel,
      correctStreak: streak.correct,
      wrongStreak: streak.wrong,
      averageScore: this.calculateAverage(recentAnswers)
    };
  }
  
  // Action selection
  async determineNextAction(state) {
    // Rule-based policy (simplified MDP)
    if (state.wrongStreak >= 3) {
      return 'DECREASE_DIFFICULTY';
    }
    if (state.correctStreak >= 5 && state.masteryLevel >= 0.8) {
      return 'INCREASE_DIFFICULTY';
    }
    if (state.masteryLevel >= 0.85 && state.correctStreak >= 3) {
      return 'ADVANCE_CHAPTER';
    }
    if (state.masteryLevel < 0.5 && state.wrongStreak >= 2) {
      return 'REPEAT_CURRENT';
    }
    return 'MAINTAIN_DIFFICULTY';
  }
  
  // Difficulty adjustment
  async adjustDifficulty(userId, chapterId, action) {
    const currentDifficulty = await this.getCurrentDifficulty(userId, chapterId);
    
    const difficultyMap = {
      'DECREASE_DIFFICULTY': Math.max(1, currentDifficulty - 1),
      'INCREASE_DIFFICULTY': Math.min(5, currentDifficulty + 1),
      'MAINTAIN_DIFFICULTY': currentDifficulty,
      'REPEAT_CURRENT': currentDifficulty,
      'ADVANCE_CHAPTER': 3, // Reset to medium for new chapter
      'REVIEW_PREVIOUS': Math.max(1, currentDifficulty - 2)
    };
    
    const newDifficulty = difficultyMap[action];
    await this.updateStudentDifficulty(userId, chapterId, newDifficulty);
    
    return newDifficulty;
  }
  
  // Question selection based on difficulty
  async getAdaptiveQuestions(chapterId, difficulty, count = 10) {
    // Select questions matching current difficulty level
    return await this.questionRepository.getQuestionsByDifficulty(
      chapterId, 
      difficulty, 
      count
    );
  }
  
  // Reward calculation
  calculateReward(oldState, action, newState) {
    let reward = 0;
    
    // Positive rewards
    if (newState.masteryLevel > oldState.masteryLevel) reward += 5;
    if (newState.masteryLevel >= 0.8 && action === 'ADVANCE_CHAPTER') reward += 10;
    
    // Negative rewards
    if (newState.wrongStreak >= 5) reward -= 5; // Frustration
    if (oldState.correctStreak >= 10 && oldState.masteryLevel < 0.7) reward -= 3; // Boredom
    if (newState.masteryLevel < oldState.masteryLevel) reward -= 2;
    
    return reward;
  }
}
```

---

## Phase 3: Database Schema Updates (Day 3-4) 📊

### New Tables for MDP

```sql
-- Store student's current difficulty level per chapter
CREATE TABLE student_difficulty_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, chapter_id)
);

-- Track MDP state transitions for research analysis
CREATE TABLE mdp_state_transitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- State before action
  prev_mastery_level DECIMAL(3,2),
  prev_difficulty INTEGER,
  prev_correct_streak INTEGER,
  prev_wrong_streak INTEGER,
  
  -- Action taken
  action VARCHAR(50),
  
  -- State after action
  new_mastery_level DECIMAL(3,2),
  new_difficulty INTEGER,
  new_correct_streak INTEGER,
  new_wrong_streak INTEGER,
  
  -- Reward
  reward DECIMAL(5,2),
  
  -- Additional metrics
  questions_attempted INTEGER,
  time_spent_seconds INTEGER
);

-- Add difficulty level to questions
ALTER TABLE questions 
ADD COLUMN difficulty_level INTEGER DEFAULT 3 CHECK (difficulty_level BETWEEN 1 AND 5);

-- Index for performance
CREATE INDEX idx_student_difficulty ON student_difficulty_levels(user_id, chapter_id);
CREATE INDEX idx_mdp_transitions ON mdp_state_transitions(user_id, chapter_id, timestamp);
CREATE INDEX idx_questions_difficulty ON questions(chapter_id, difficulty_level);
```

---

## Phase 4: Frontend UI Updates (Day 5-8) 🎨

### Adaptive Learning Dashboard

**New Components:**

1. **Mastery Progress Bar**
   - Visual indicator of current mastery level (0-100%)
   - Color-coded: Red (<50%), Yellow (50-80%), Green (>80%)

2. **Difficulty Indicator**
   - Show current difficulty level (1-5 stars)
   - Explanation: "Easy", "Medium", "Hard", "Very Hard", "Expert"

3. **Adaptive Feedback Messages**
   ```
   Mastery >= 80%: "Great job! Ready for harder challenges?"
   Wrong streak >= 3: "Let's try some easier problems to build confidence"
   Correct streak >= 5: "You're doing great! Moving to next level"
   ```

4. **Progress Visualization**
   - Line chart showing mastery level over time
   - Bar chart showing difficulty adjustments
   - Success rate per difficulty level

### Updated Assessment Flow

```
Old Flow:
Student → Take Assessment → See Score → Next Chapter (manual)

New Adaptive Flow:
Student → Take Adaptive Assessment → 
  → MDP analyzes performance → 
  → Adjust difficulty automatically → 
  → Show personalized feedback → 
  → Continue at adjusted level OR advance to next chapter
```

**File:** `frontend/app/student/assessments/[id]/page.tsx`

```tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';

export default function AdaptiveAssessmentPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(3);
  const [masteryLevel, setMasteryLevel] = useState(0);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    loadAdaptiveQuestions();
  }, [id]);

  const loadAdaptiveQuestions = async () => {
    const response = await api.get(`/api/assessments/${id}/adaptive-questions`);
    setQuestions(response.data.questions);
    setCurrentDifficulty(response.data.currentDifficulty);
    setMasteryLevel(response.data.masteryLevel);
  };

  const submitAnswer = async (questionId, answer) => {
    const response = await api.post(`/api/assessments/${id}/submit-adaptive`, {
      questionId,
      answer
    });

    // MDP determines next action
    if (response.data.action === 'ADVANCE_CHAPTER') {
      setFeedback('🎉 Excellent! Moving to next chapter!');
      // Auto-advance after 2 seconds
      setTimeout(() => router.push('/student/castles'), 2000);
    } else if (response.data.action === 'DECREASE_DIFFICULTY') {
      setFeedback('💪 Let\'s try some easier problems to build confidence');
    } else if (response.data.action === 'INCREASE_DIFFICULTY') {
      setFeedback('🚀 Great progress! Ready for harder challenges?');
    }

    // Update state
    setCurrentDifficulty(response.data.newDifficulty);
    setMasteryLevel(response.data.newMastery);
    
    // Load next adaptive question
    loadAdaptiveQuestions();
  };

  return (
    <div>
      {/* Mastery Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span>Mastery Level</span>
          <span>{Math.round(masteryLevel * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className={`h-4 rounded-full transition-all ${
              masteryLevel >= 0.8 ? 'bg-green-500' :
              masteryLevel >= 0.5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${masteryLevel * 100}%` }}
          />
        </div>
      </div>

      {/* Difficulty Indicator */}
      <div className="mb-4">
        <span>Current Difficulty: </span>
        {'⭐'.repeat(currentDifficulty)}
      </div>

      {/* Adaptive Feedback */}
      {feedback && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-4">
          {feedback}
        </div>
      )}

      {/* Questions */}
      {questions.map(q => (
        <QuestionCard 
          key={q.id} 
          question={q} 
          onSubmit={(answer) => submitAnswer(q.id, answer)}
        />
      ))}
    </div>
  );
}
```

---

## Phase 5: Testing & Data Collection (Day 9-12) 📈

### Research Data to Collect

1. **Performance Metrics:**
   - Average mastery level per chapter
   - Time to achieve 80% mastery
   - Number of difficulty adjustments per student
   - Success rate per difficulty level

2. **MDP Effectiveness:**
   - Distribution of actions taken
   - Cumulative rewards over time
   - State transition patterns
   - Convergence to optimal policy

3. **User Experience:**
   - Student satisfaction (self-reported)
   - Frustration indicators (quit rate, long pauses)
   - Engagement metrics (time spent, completion rate)

### Testing Protocol

**Test with 5-10 students per group:**

**Group A (Control):** Traditional fixed difficulty  
**Group B (Experimental):** MDP adaptive difficulty

**Metrics to compare:**
- Time to complete chapter
- Final mastery level
- Number of attempts needed
- Self-reported engagement (survey)

---

## Phase 6: Research Documentation (Day 13-14) 📝

### Required Deliverables

1. **Research Paper Components:**
   - Abstract
   - Introduction (problem statement)
   - Related work (MDP in education)
   - Methodology (your MDP implementation)
   - Results (data analysis)
   - Discussion
   - Conclusion

2. **Data Visualizations:**
   - Learning curves (mastery over time)
   - Difficulty adjustment patterns
   - Success rate distributions
   - Reward accumulation

3. **Code Documentation:**
   - MDP algorithm explanation
   - API documentation
   - Database schema
   - Deployment guide

---

## Implementation Timeline

### Week 1 (Dec 22-28)
- **Day 1-2:** Remove features, clean up codebase
- **Day 3-4:** Implement MDP backend service
- **Day 5-6:** Database schema updates
- **Day 7:** Testing MDP logic

### Week 2 (Dec 29 - Jan 5)
- **Day 8-9:** Frontend adaptive UI
- **Day 10:** Integration testing
- **Day 11-12:** User testing & data collection
- **Day 13-14:** Document results, prepare presentation

---

## Realistic Scope for 2 Weeks

### ✅ Achievable (MVP)
- Simplified MDP with rule-based policy
- 3 difficulty levels (Easy, Medium, Hard)
- Basic state tracking (mastery, streaks)
- Adaptive question selection
- Progress visualization
- Data collection for analysis

### ⚠️ Stretch Goals (If time permits)
- Full Q-learning implementation
- 5 difficulty levels
- Machine learning integration
- Real-time policy updates
- Advanced reward shaping

### ❌ Out of Scope (Future work)
- Multi-agent MDP (multiple students)
- Deep reinforcement learning
- Personalized learning paths per student
- Content generation

---

## Risk Mitigation

### Risk 1: MDP too complex to implement
**Mitigation:** Start with rule-based policy, upgrade to Q-learning if time allows

### Risk 2: Not enough test users
**Mitigation:** Simulate user behavior with scripts, use historical data

### Risk 3: Database performance issues
**Mitigation:** Use indexes, cache frequently accessed data

### Risk 4: Frontend integration delays
**Mitigation:** Build backend API first, use Postman for testing before frontend

---

## Success Criteria

### Minimum (Must Have):
- [ ] MDP adjusts difficulty based on performance
- [ ] Students see personalized feedback
- [ ] Data collected for 10+ test sessions
- [ ] Clear improvement over fixed difficulty

### Target (Should Have):
- [ ] Mastery level calculated accurately
- [ ] Smooth difficulty transitions (not jarring)
- [ ] 80%+ student satisfaction
- [ ] Measurable learning improvement

### Ideal (Nice to Have):
- [ ] Q-learning converges to optimal policy
- [ ] Visualization dashboard for research analysis
- [ ] Publishable results

---

## Next Steps (Do NOW)

1. **Review and confirm this plan** ✅
2. **Start Phase 1: Feature removal** (Day 1-2)
3. **Set up development environment for research branch**
4. **Create database backup before schema changes**

Ready to start? I can help you execute each phase step by step.
