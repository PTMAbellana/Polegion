# Adaptive Learning System - QA Testing Checklist

**Test Date:** _____________  
**Tester Name:** _____________  
**Version:** 1.0  
**Last Updated:** January 2, 2026

---

## 1. FUNCTIONALITY TESTS

### 1.1 Question Generation & Variety
- [ ] **Questions are not repetitive** - Different problems shown after each answer
- [ ] **Difficulty progression works** - Questions get harder/easier based on performance
- [ ] **Three representation types render correctly:**
  - [ ] TEXT: Word problems display properly
  - [ ] VISUAL: SVG diagrams show rectangle with dimensions
  - [ ] REAL_WORLD: Garden fence context displays
- [ ] **Representation switching occurs** - System changes representation after 3 wrong answers
- [ ] **Answer options are randomized** - Choices don't appear in same order every time

**Notes/Bugs:**
```
_________________________________________________________________
_________________________________________________________________
```

---

## 2. ADAPTIVE BEHAVIOR (MDP)

### 2.1 State Tracking
- [ ] **Mastery level updates** - Percentage increases on correct, decreases on wrong
- [ ] **Correct streak tracked** - Counter increments on consecutive correct answers
- [ ] **Wrong streak tracked** - Counter increments on consecutive wrong answers
- [ ] **Total attempts increment** - Counter increases with each answer
- [ ] **Difficulty level changes** - 1-5 scale adjusts based on performance

### 2.2 Pedagogical Actions
- [ ] **decrease_difficulty** - Triggered after 3 wrong answers at high difficulty
- [ ] **increase_difficulty** - Triggered after 7 consecutive correct answers
- [ ] **switch_to_visual** - Activated when struggling with text representation
- [ ] **switch_to_real_world** - Activated when struggling with visual representation
- [ ] **give_hint_retry** - Shows helpful hint after 2-3 wrong attempts
- [ ] **advance_topic** - Moves to next topic when mastery >= 85%
- [ ] **review_prerequisite** - Returns to basics when mastery < 25%
- [ ] **maintain_difficulty** - Keeps current level when in flow state

### 2.3 Feedback Quality
- [ ] **Feedback appears after each action** - AdaptiveFeedbackBox shows appropriate message
- [ ] **Feedback matches MDP action** - Message accurately describes what system is doing
- [ ] **Feedback is encouraging** - Tone is positive and motivating
- [ ] **Feedback is clear** - Students understand why representation/difficulty changed

**Test Scenario:**
1. Answer 3 questions wrong → Check if difficulty decreases or representation switches
2. Answer 7 questions correct → Check if difficulty increases
3. Get 85% mastery → Check if system suggests advancing

**Results:**
```
_________________________________________________________________
_________________________________________________________________
```

---

## 3. DATABASE PERSISTENCE

### 3.1 Data Logging
- [ ] **State transitions logged** - Check `mdp_state_transitions` table in Supabase
- [ ] **Enhanced columns populated:**
  - [ ] `pedagogical_strategy` (e.g., "scaffolding", "challenge")
  - [ ] `representation_type` (text/visual/real_world)
  - [ ] `misconception_detected` (boolean)
  - [ ] `teaching_strategy` (action name)
- [ ] **Student progress persists** - Refresh page → mastery level remains
- [ ] **Q-values update** - Check `q_table` for new entries after actions
- [ ] **Difficulty levels saved** - Check `student_difficulty_levels` table

### 3.2 Misconception Detection
- [ ] **Recent attempts retrieved** - System checks last 10 attempts
- [ ] **Pattern detection works** - Identifies repeated errors with same representation
- [ ] **Misconception logged** - `misconception_detected` = true when pattern found

**Database Query to Run:**
```sql
-- Check last 20 state transitions
SELECT 
  action, 
  pedagogical_strategy, 
  representation_type, 
  misconception_detected, 
  reward,
  timestamp 
FROM mdp_state_transitions 
WHERE user_id = '<your-test-user-id>'
ORDER BY timestamp DESC 
LIMIT 20;
```

**Results:**
```
_________________________________________________________________
_________________________________________________________________
```

---

## 4. USER EXPERIENCE (UX)

### 4.1 Student Flow
- [ ] **Onboarding is clear** - Easy to understand what to do first
- [ ] **Chapter selection intuitive** - Dropdown easy to find and use
- [ ] **Question flow logical** - Answer → Feedback → Next Question
- [ ] **No dead ends** - Always have a path forward
- [ ] **Error states handled** - Graceful handling of network errors

### 4.2 Engagement & Motivation
- [ ] **Progress bar motivating** - Clear visual feedback on improvement
- [ ] **Streak counter engaging** - Encourages consecutive correct answers
- [ ] **Success celebration appropriate** - ✓ checkmark animation on correct answer
- [ ] **Feedback tone positive** - Never discouraging, always supportive
- [ ] **Pacing feels good** - Not too fast, not too slow

### 4.3 Cognitive Load
- [ ] **One task at a time** - Focus on answering question, not navigating UI
- [ ] **Visual hierarchy clear** - Important info stands out
- [ ] **Instructions simple** - Elementary students can understand
- [ ] **No overwhelming colors** - Calm, educational palette
- [ ] **Whitespace sufficient** - Not cluttered or cramped

**Student Testing (if possible):**
- Ask student: "What do you think you're supposed to do?"
- Observe: Do they understand representation switches?
- Ask: "Is this fun?" or "Would you want to use this again?"

**Observations:**
```
_________________________________________________________________
_________________________________________________________________
```

---

## 5. USER INTERFACE (UI)

### 5.1 Design Quality
- [ ] **Looks professional** - Not AI-generated, human-designed feel
- [ ] **Classroom-tested aesthetic** - Inspired by Khan Academy Kids/Prodigy Math
- [ ] **Color palette restrained** - ≤5 colors (Blue, Green, Amber, Gray, White)
- [ ] **Typography readable** - System font, 16px+ for body text
- [ ] **Touch-friendly buttons** - 44px+ touch targets
- [ ] **Soft shadows** - Subtle depth, not heavy 3D effects
- [ ] **No emoji overload** - Strategic use only (✓, 📊, 🌍)
- [ ] **No neon gradients** - Solid colors or subtle gradients only

### 5.2 Responsive Design
- [ ] **Works on mobile** - Test on phone (320px width)
- [ ] **Works on tablet** - Test on iPad (768px width)
- [ ] **Works on desktop** - Test on laptop (1024px+ width)
- [ ] **SVG diagrams scale** - Rectangle maintains proportions
- [ ] **Text doesn't overflow** - All content fits within containers

### 5.3 Accessibility
- [ ] **Sufficient color contrast** - Text readable on all backgrounds
- [ ] **Focus states visible** - Keyboard navigation works
- [ ] **Loader accessible** - Clear loading indicator
- [ ] **Error messages clear** - Actionable guidance provided

**Device Testing:**
```
Mobile (iPhone/Android):     [ ] Pass  [ ] Fail
Tablet (iPad):              [ ] Pass  [ ] Fail
Desktop (Chrome):           [ ] Pass  [ ] Fail
Desktop (Firefox):          [ ] Pass  [ ] Fail
```

---

## 6. PERFORMANCE & BUGS

### 6.1 Performance
- [ ] **Page loads < 3 seconds** - Initial load time acceptable
- [ ] **Transitions smooth** - No lag when switching representations
- [ ] **No memory leaks** - Can answer 50+ questions without slowdown
- [ ] **Backend responds quickly** - API calls < 500ms

### 6.2 Known Bugs to Check
- [ ] **Double-click protection** - Can't submit answer twice rapidly
- [ ] **Race conditions** - Rapid clicks don't cause incorrect state
- [ ] **Browser refresh handled** - State restored correctly
- [ ] **Network errors handled** - Graceful fallback when offline
- [ ] **Chapter switch clears state** - Switching chapters resets progress correctly

### 6.3 Edge Cases
- [ ] **Mastery = 0%** - System doesn't break, offers encouragement
- [ ] **Mastery = 100%** - System handles completion gracefully
- [ ] **10 wrong in a row** - System doesn't give up, keeps adapting
- [ ] **Empty chapter** - Handles no questions scenario
- [ ] **Database connection loss** - Shows error, allows retry

**Bugs Found:**
```
Bug #1: ________________________________________________________
Severity: [ ] Critical  [ ] High  [ ] Medium  [ ] Low
Steps to reproduce: ____________________________________________
_________________________________________________________________

Bug #2: ________________________________________________________
Severity: [ ] Critical  [ ] High  [ ] Medium  [ ] Low
Steps to reproduce: ____________________________________________
_________________________________________________________________
```

---

## 7. CONTENT ACCURACY

### 7.1 Topic Alignment
- [ ] **Questions match chapter topic** - Geometry shapes content appropriate
- [ ] **Perimeter problems correct** - Math is accurate (8+5+8+5 = 26)
- [ ] **Answer options plausible** - Wrong answers are realistic distractors
- [ ] **Difficulty scaling logical** - Harder problems genuinely more challenging
- [ ] **Real-world contexts relatable** - Garden fence scenario makes sense

### 7.2 Educational Value
- [ ] **Teaches perimeter concept** - Students learn from feedback
- [ ] **Visual aids helpful** - Diagrams clarify concept
- [ ] **Real-world connection clear** - Context helps understanding
- [ ] **Hints are useful** - Actually help solve problem
- [ ] **Progression builds knowledge** - Difficulty increases appropriately

**Content Review:**
```
Topic coverage:     [ ] Excellent  [ ] Good  [ ] Needs work
Math accuracy:      [ ] Excellent  [ ] Good  [ ] Needs work
Pedagogical value:  [ ] Excellent  [ ] Good  [ ] Needs work
```

---

## 8. RESEARCH VALIDITY

### 8.1 Data Collection
- [ ] **All required data logged** - State, action, reward, representation, strategy
- [ ] **Timestamps accurate** - Can reconstruct learning session timeline
- [ ] **User IDs tracked** - Can analyze individual student progress
- [ ] **Enough data points** - Minimum 20-30 attempts per test session
- [ ] **No data corruption** - Database entries complete and valid

### 8.2 MDP Evaluation Metrics
- [ ] **Reward function working** - Positive rewards for advancement, negative for frustration
- [ ] **Q-values converging** - Table shows learning over time
- [ ] **Exploration vs exploitation balanced** - Epsilon decay functioning
- [ ] **Action distribution reasonable** - Not stuck repeating one action
- [ ] **Learning curve visible** - Mastery increases over session

**Research Readiness:**
```
Can generate graphs:        [ ] Yes  [ ] No
Data sufficient for paper:  [ ] Yes  [ ] No
Misconception detection measurable: [ ] Yes  [ ] No
```

---

## 9. SYSTEM INTEGRATION

### 9.1 Backend Connection
- [ ] **Frontend connects to backend** - No CORS errors
- [ ] **API endpoints respond** - `/adaptive/state/:chapterId` works
- [ ] **Submit answer endpoint works** - `/adaptive/submit-answer` saves data
- [ ] **Authentication integrated** - User session maintained
- [ ] **Error responses handled** - 400/500 errors don't crash UI

### 9.2 Supabase Integration
- [ ] **RLS policies allow access** - Backend can read/write with service key
- [ ] **Tables created** - All adaptive learning tables exist
- [ ] **Enhanced schema applied** - New columns added via ENHANCE_ADAPTIVE_SCHEMA.sql
- [ ] **Realtime updates work** - (if applicable)

**Integration Test:**
1. Open DevTools Network tab
2. Answer 5 questions
3. Check: Are all API calls successful (200 status)?

**Results:**
```
_________________________________________________________________
```

---

## 10. OVERALL ASSESSMENT

### Strengths
```
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________
```

### Areas for Improvement
```
1. _____________________________________________________________
2. _____________________________________________________________
3. _____________________________________________________________
```

### Critical Issues (Must Fix Before Demo)
```
1. _____________________________________________________________
2. _____________________________________________________________
```

### Recommendation
- [ ] **Ready for demo** - System meets all requirements
- [ ] **Needs minor fixes** - Fix bugs listed above
- [ ] **Needs major work** - Significant issues found

---

## SIGN-OFF

**Tester Signature:** _________________________  
**Date:** _____________  
**Overall Rating:** [ ] Excellent  [ ] Good  [ ] Fair  [ ] Poor

**Next Steps:**
```
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```
