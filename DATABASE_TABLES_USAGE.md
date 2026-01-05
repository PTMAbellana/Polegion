# Database Tables Usage

## ✅ ACTIVELY USED TABLES

### 1. `adaptive_learning_state`
**Status:** ✅ **HEAVILY USED**
- Stores per-user, per-topic learning state
- Tracks: difficulty_level, mastery_level, correct_streak, wrong_streak, total_attempts
- Updated after every answer submission
- Used for Q-learning state representation

### 2. `adaptive_learning_topics` 
**Status:** ✅ **USED**
- Stores all available topics (12 geometry topics)
- Links topics to chapters
- Provides topic metadata (name, description, cognitive_domain, difficulty_range)

### 3. `adaptive_state_transitions`
**Status:** ✅ **USED**  
- Logs every MDP state transition for research/analysis
- Tracks: prevState → action → newState → reward
- Used for Q-learning training data and debugging

### 4. `user_topic_progress`
**Status:** ✅ **USED**
- Tracks topic unlock status and mastery percentage
- Synced with adaptive_learning_state.mastery_level
- Used for topic progression and unlocking

## ⚠️ PARTIALLY USED / LEGACY TABLES

### 5. `adaptive_questions`
**Status:** ⚠️ **EMPTY BY DESIGN**
- Originally intended to store pre-made questions
- **Current System:** Uses `QuestionGeneratorService` to generate questions dynamically
- **Why?** Parametric generation creates infinite unique questions without storage
- **Decision:** Keep empty or deprecate (no impact on functionality)

### 6. `question_attempts`
**Status:** ✅ **ACTIVELY USED**
- Tracks how many times a user has attempted each question ID
- **Used by:** `AdaptiveLearningService.trackAttemptAndCheckHint()`
- **Purpose:** Prevent showing same question repeatedly, enables "try again" logic
- **Methods:** `trackQuestionAttempt()`, `getQuestionAttemptCount()`
- **Schema:** user_id, question_id, session_id, attempts, is_correct, answered_correctly_ever
- **Created by:** Migration `02_create_question_attempts.sql`

### 7. `user_session_questions`
**Status:** ✅ **ACTIVELY USED**
- Tracks all questions shown in current session to prevent immediate repeats
- **Used by:** `AdaptiveLearningService.generateQuestionForStudent()`
- **Purpose:** Question uniqueness within learning session
- **Methods:** `getShownQuestionsInSession()`, `addToQuestionHistory()`
- **Schema:** user_id, topic_id, session_id, question_id, question_type, difficulty_level, is_correct
- **Created by:** Migration `02_create_question_attempts.sql`

### 8. `user_question_history`
**Status:** 🔴 **BROKEN - DO NOT USE**
- **CRITICAL ISSUE:** Has FK to `adaptive_questions(id)` but that table is empty
- **Impact:** Cannot insert any records without violating foreign key constraint
- **Methods exist but fail:** `logQuestionShown()`, `updateQuestionAnswer()`
- **Location:** AdaptiveLearningRepo.js lines 386-440
- **Used for:** AI explanation storage (intended)
- **Fix Needed:** Either drop table, change FK to varchar, or remove FK constraint
- **Current Status:** Methods exist in repo but will always fail on insert

### 9. `adaptive_topic_objectives`
**Status:** ❓ **UNCLEAR - NO CODE USAGE FOUND**
- Likely for curriculum objectives/learning standards alignment
- No foreign keys FROM other tables
- No grep matches in codebase
- **Possible uses:** Teacher dashboard, curriculum mapping, standards reporting
- **Action Needed:** Verify with stakeholders if needed

## 📊 CURRENT QUESTION GENERATION STRATEGY

### Dynamic Question Generation (QuestionGeneratorService)
- **Templates:** 60+ parametric templates across 5 difficulty levels
- **Coverage:** All 12 geometry topics
- **Benefits:**
  - Infinite unique questions
  - No storage needed
  - Easy to add new question types
  - Parametric variations prevent memorization

### Topic Coverage (Updated):
✅ Interior Angles of Polygons
✅ Polygon Identification  
✅ Perimeter and Area of Polygons
✅ Kinds of Angles
✅ Basic Geometric Figures
✅ Volume of Space Figures
✅ Circumference and Area of a Circle
✅ Complementary and Supplementary Angles
✅ Parts of a Circle
⚠️ Geometric Proofs and Reasoning (needs more templates)
⚠️ Geometry Word Problems (uses all templates)
⚠️ Plane and 3D Figures (partial coverage)

## 🔧 RECOMMENDED ACTIONS

### ⚠️ CRITICAL - Fix Broken Table
1. **FIX `user_question_history` immediately:**
   ```sql
   -- Option 1: Drop FK constraint (recommended if AI explanations not used)
   ALTER TABLE user_question_history 
   DROP CONSTRAINT user_question_history_question_id_fkey;
   
   -- Option 2: Drop table entirely if not needed
   DROP TABLE user_question_history CASCADE;
   ```
   - Methods `logQuestionShown()` and `updateQuestionAnswer()` currently **always fail**
   - Intended for AI explanation storage but broken since `adaptive_questions` is empty
   - Decision: Drop table or remove FK to allow storing dynamically generated question IDs


## 🔍 AUDIT RESULTS (January 5, 2026)

### Code Analysis Findings:

**✅ Working Tables (7):**
1. `adaptive_learning_state` - Core MDP state
2. `adaptive_learning_topics` - 12 geometry topics
3. `adaptive_state_transitions` - Q-learning transitions
4. `user_topic_progress` - Mastery percentage for UI
5. `question_attempts` - Question retry tracking
6. `user_session_questions` - Session uniqueness
7. `adaptive_questions` - Empty but intentional (not a bug)

**🔴 Broken Table (1):**
8. `user_question_history` - FK to empty table, cannot insert records

**❓ Unknown Status (1):**
9. `adaptive_topic_objectives` - No code references found

### Method Usage Summary:
```javascript
// WORKING (in AdaptiveLearningRepo.js):
- trackQuestionAttempt() → question_attempts (lines 729-785)
- getQuestionAttemptCount() → question_attempts (lines 791-807)
- getShownQuestionsInSession() → user_session_questions (lines 815-831)
- addToQuestionHistory() → user_session_questions (lines 835-856)

// BROKEN (will fail on insert):
- logQuestionShown() → user_question_history (lines 386-408) ❌
- updateQuestionAnswer() → user_question_history (lines 412-440) ❌
```

### Migration Files:
- ✅ `02_create_question_attempts.sql` - Creates working tables (question_attempts, user_session_questions)
- ⚠️ Schema dump shows `user_question_history` exists but should not be used
### ✅ Verified Working
2. **Keep `question_attempts` and `user_session_questions`** - Both actively used and working
3. **Keep `adaptive_questions` empty** - Not a bug, it's by design (dynamic generation)

### 📊 Low Priority
4. **Add more templates** for under-covered topics:
   - Geometric Proofs (difficulty 4-5)
   - 3D solid figures identification
5. **Verify `adaptive_topic_objectives`** - Appears unused but may be needed for curriculum alignment

## 📝 NOTES

- Current system prioritizes **dynamic generation** over static question storage
- This design allows for **adaptive difficulty** and **infinite variations**
- Tables like `adaptive_questions` are legacy from earlier design iterations
- Q-learning uses `adaptive_state_transitions` for training data, not separate metrics table
