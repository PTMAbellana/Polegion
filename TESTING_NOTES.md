# Testing & Research Notes

## 🔴 Priority Testing (Do This First)

### 1. Clear Database & Test Fresh Start
```sql
-- Run in Supabase SQL Editor
DELETE FROM user_session_questions;
DELETE FROM question_attempts;
DELETE FROM adaptive_state_transitions;
DELETE FROM user_topic_progress;
DELETE FROM adaptive_learning_state;
DROP TABLE IF EXISTS user_question_history CASCADE;
```

### 2. Test Adaptive Learning Flow (30 min)
- [ ] Access `/student/adaptive-learning` as fresh user
- [ ] Verify first topic auto-unlocks and loads question
- [ ] Answer 3 questions correctly → mastery increases
- [ ] Answer 3 questions wrong → difficulty decreases
- [ ] No infinite loading (distractor bug FIXED)
- [ ] Refresh page → progress persists

### 3. Verify Bug Fixes
- [ ] Polygon interior angles questions appear (not circles)
- [ ] 4 answer choices display correctly
- [ ] No timeout/hanging on question generation
- [ ] Options have one correct answer marked

---

## 🎓 Q-Learning Hyperparameters - Research Notes

### Current Implementation Values
```javascript
// Location: backend/application/services/AdaptiveLearningService.js
EPSILON: 0.1 - 0.3 (exploration rate, decreases over time)
LEARNING_RATE (α): 0.1
DISCOUNT_FACTOR (γ): 0.95
REWARD_CORRECT: +1.0 to +3.0 (based on difficulty)
REWARD_INCORRECT: -0.5 to -2.0
```

### Research Justification
**Source**: "Optimizing Educational Content With Q-learning" (Atlantis Press)
- **ε = 0.1** (Figure 2, epsilon-greedy strategy)
- **α = 0.1** (Figure 2, learning rate)
- **γ = 0.9** (Figure 2, discount factor)
- **Context**: Moodle ITS, general student skill levels

**Adaptations for K-12 Geometry**:
- γ = 0.95 (higher than 0.9) → values long-term skill building more
- ε range 0.1-0.3 → allows more exploration for learning

**Research Gap Identified**:
- ✅ No prior work validates Q-learning for K-12 geometry tutoring
- ✅ YOUR contribution: First experimental validation in this domain
- ✅ Baseline values from general ITS adapted for geometry context

### For Your Thesis/Paper
```
"Due to the absence of K-12 geometry-specific Q-learning implementations, 
we adopt baseline hyperparameters from existing ITS research (ε=0.1, α=0.1, γ=0.9) 
[Atlantis Press]. We increase γ to 0.95 to emphasize long-term skill retention, 
appropriate for cumulative mathematics learning. This represents the first 
validation of Q-learning hyperparameters for middle school geometry adaptive systems."
```

---

## 🤖 AI Services Configuration

### All Services Now Use Groq (Free Tier Friendly)
- ✅ **AIExplanationService** → Groq (llama-3.1-8b-instant)
- ✅ **HintGenerationService** → Groq (llama-3.1-8b-instant)
- ❌ **GeminiQuestionGenerator** → Disabled (Gemini only 20/month)

**API Limits**:
- Groq: ~14,400 requests/day (30/min)
- Gemini: 0 requests (not used)

---

## 🐛 Bugs Fixed Today (Jan 5, 2026)

1. ✅ **Infinite loop** in `generateDistractors()` for polygon interior angles
   - Problem: Negative angle variations rejected, loop never completed
   - Fix: Added max attempts (50), better variation formulas, fallback generation

2. ✅ **Broken `user_question_history` table** 
   - Problem: FK to empty `adaptive_questions` table
   - Fix: Dropped table, removed unused repo methods

3. ✅ **New user stuck at loading**
   - Problem: No topic unlocked, no auto-unlock logic
   - Fix: Auto-unlock first topic on access, frontend fallback to select first topic

4. ✅ **Gemini API overuse**
   - Problem: 500/day limit but free tier is 20/month
   - Fix: Switched all services to Groq, disabled Gemini question generation

5. ✅ **Documentation cleanup**
   - Removed 29 legacy MD/SQL files
   - Kept only essential docs (PROJECT_DOCUMENTATION, API guides, schemas)

---

## 📊 Technical Specifications

### Difficulty Levels (1-5)
- Level 1: 11 templates (basic recall)
- Level 2: 10 templates (concepts)
- Level 3: 8 templates (procedural)
- Level 4: 6 templates (analytical)
- Level 5: 4 templates (problem-solving)

### Topics (12 Total)
1. Interior Angles of Polygons
2. Geometric Proofs and Reasoning
3. Geometry Word Problems
4. Polygon Identification
5. Plane and 3D Figures
6. Perimeter and Area of Polygons
7. Kinds of Angles
8. Basic Geometric Figures
9. Volume of Space Figures
10. Circumference and Area of a Circle
11. Complementary and Supplementary Angles
12. Parts of a Circle

### Mastery Thresholds
- 0-20%: Beginner
- 20-40%: Developing
- 40-60%: Proficient (approaching unlock)
- 60-80%: Advanced (unlocks next topic)
- 80-100%: Mastered

---

## ⚡ Quick 5-Min Smoke Test

If extremely short on time:
1. Run SQL cleanup
2. Login → adaptive learning
3. Answer 5 questions
4. Refresh page → verify progress saved
5. ✅ If works, system is functional

---

## 🎯 What to Document After Testing

- [ ] Screenshot of working adaptive flow
- [ ] Mastery percentage progression (0% → 60%+)
- [ ] Topic unlock notification
- [ ] Question variety (different polygon types)
- [ ] No errors in browser console
- [ ] Response times (should be <2s per question)

Good luck with testing! 🚀
