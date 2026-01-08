# Adaptive Learning (MDP + Q-Learning) — Project Overview and Refactor Plan

This document explains how the adaptive learning system works in this repository and proposes a clean backend structure centered on adaptive learning. It is grounded in the current codebase and links directly to source files.

## 1. System Walkthrough

- **Pretest → Initial Mastery**:
  - Pretest/posttest are generated and graded by assessment modules. See [backend/application/services/AssessmentService.js](../../backend/application/services/AssessmentService.js) and routes in [backend/presentation/routes/AssessmentRoutes.js](../../backend/presentation/routes/AssessmentRoutes.js).
  - `generateAssessment()` builds pre/post tests by categories; `submitAssessment()` grades and stores results. This establishes baseline proficiency. Adaptive practice mastery is tracked separately via `adaptive_learning_state` updates.

- **State Representation (mastery, difficulty, streaks)**:
  - Per-topic state is persisted in `adaptive_learning_state` via the repo. See [backend/infrastructure/repository/AdaptiveLearningRepo.js](../../backend/infrastructure/repository/AdaptiveLearningRepo.js).
  - `updatePerformanceMetrics()` computes `mastery_level` (0–100%) using accuracy, streak bonuses/penalties, difficulty bonus, and time factor, then writes back to `adaptive_learning_state` and syncs `user_topic_progress.mastery_percentage`. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).
  - For Q-learning, `getStateKey(state)` discretizes mastery into buckets, along with difficulty and streak buckets. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).

- **Action Selection (decrease/maintain/increase + strategies)**:
  - MDP `ACTIONS` include difficulty changes and pedagogy strategies (e.g., `GIVE_HINT_RETRY`, `REVIEW_PREREQUISITE_TOPIC`). See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).
  - `selectActionQLearning(stateKey, state)` uses epsilon-greedy: explore early, exploit later. If Q-values are unknown, it falls back to `determineActionRuleBased(state)` with pedagogy-informed rules. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).
  - `applyAction()` updates `difficulty_level`, `current_representation` (currently text only), and `teaching_strategy` (e.g., `scaffolding`), then persists via the repo. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).

- **Reward Calculation**:
  - `calculateAdvancedReward(prevState, newState, action, timeSpent)` combines mastery change, optimal challenge zone, high mastery maintenance, frustration/boredom penalties, speed, and difficulty appropriateness. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).

- **Q-Value Update**:
  - Q-values are updated with the Bellman equation in `updateQValue()`, and transitions are logged in `adaptive_state_transitions` via `AdaptiveLearningRepository.logStateTransition()` with action, reward, epsilon, updated q-value, correctness, and question_id. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js) and [backend/infrastructure/repository/AdaptiveLearningRepo.js](../../backend/infrastructure/repository/AdaptiveLearningRepo.js).

- **Topic Unlock Logic (mastery ≥ 3)**:
  - Unlocking uses `user_topic_progress` and is triggered by `AdaptiveLearningService.checkAndUnlockNextTopic()` and `MasteryProgressionService` via `MasteryProgressionHook`. Threshold is mastery level ≥ 3 (~≥ 60%). See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js), [backend/application/services/MasteryProgressionService.js](../../backend/application/services/MasteryProgressionService.js), and [backend/application/services/MasteryProgressionHook.js](../../backend/application/services/MasteryProgressionHook.js).

- **Why Q-Learning (vs. rules)**:
  - The system starts safely with rules but learns personalized strategies via Q-learning, adjusting action values based on outcomes for each student. Hybrid design: `selectActionQLearning()` with rule-based bootstrap when Q-values are unknown. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).

- **Hints, Similar Questions, Representations in the MDP**:
  - Hints: `HintGenerationService.generateHint()` triggers only when `wrong_streak >= 2`, using rule-based hints by default and AI (Groq/Gemini) when MDP action warrants (e.g., `GIVE_HINT_RETRY`). See [backend/application/services/HintGenerationService.js](../../backend/application/services/HintGenerationService.js).
  - Similar Questions: `generateSimilarQuestion()` regenerates parametric variants after wrong attempts and works with `user_topic_progress.attempt_count` for pending persistence. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).
  - Representations: Declared `REPRESENTATIONS` include text/visual/real_world; currently visual/real_world rendering is disabled in `applyAction()` and falls back to scaffolding, while representation type is passed to hint generation. See [backend/application/services/AdaptiveLearningService.js](../../backend/application/services/AdaptiveLearningService.js).

- **`user_topic_progress` vs `adaptive_state_transitions`**:
  - `user_topic_progress`: per-topic progression and pending-question persistence (unlocked/mastered, mastery 0–5, mastery %, `pending_question_id`, `attempt_count`, `hint_shown`). Schemas in [docs/migrations/01_create_user_topic_progress.sql](../../docs/migrations/01_create_user_topic_progress.sql) and [docs/migrations/02_add_pending_question_tracking.sql](../../docs/migrations/02_add_pending_question_tracking.sql).
  - `adaptive_state_transitions`: the MDP log for research — action, reward, epsilon, updated q-value, correctness, and timing. See [backend/infrastructure/repository/AdaptiveLearningRepo.js](../../backend/infrastructure/repository/AdaptiveLearningRepo.js).

## 2. Backend Refactor Plan (Adaptive-Centric)

- **Objectives**: Separate RL policy, state tracking, and content generation; keep API stable; improve research clarity.

- **Proposed Directory**: `backend/adaptive-learning/`
  - `policy/qlearning/`: ACTIONS, `getStateKey()`, `selectActionQLearning()`, `updateQValue()`, reward shaping, epsilon schedule.
  - `policy/rule-based/`: `determineActionRuleBased()` and misconception detection.
  - `state/state-representation.js`: Bucketing and state schema used by Q-learning.
  - `state/metrics.js`: `updatePerformanceMetrics()` logic for mastery, streaks, time.
  - `state/transitions.js`: research logging wrappers around repo.
  - `content/question-generation/`: `QuestionGeneratorService` and `GroqQuestionGenerator`; topic filters and domain mapping.
  - `content/hints/`: `HintGenerationService` (providers, rate limits, caches).
  - `progression/mastery/`: `MasteryProgressionService` and `MasteryProgressionHook`.
  - `progression/topics/`: unlock checks and helpers for `user_topic_progress`.
  - `api/controller-adaptive.js`: Facade to `AdaptiveLearningController`.
  - `api/routes-adaptive.js`: Facade to `AdaptiveLearningRoutes`.

- **Why This Grouping**:
  - Clarifies boundaries: RL policy vs state vs content vs progression.
  - Keeps pedagogy heuristics explicit and separate from learned policy.
  - Provides a research-friendly map of components and data flows.

- **Change Strategy**:
  - Phase 1 (now): Scaffold directory and documentation; do not move logic yet.
  - Phase 2: Introduce re-export barrels to avoid import churn; gradually relocate modules.
  - Phase 3: Update imports in services/controllers in small PRs.

- **If We Don’t Phase Changes**:
  - Direct moves would break many `require()` paths in controllers/services/tests and risk runtime failures. Facades/re-exports mitigate this.

---

This file is intended as your quick reference for both the current system and the proposed structure before any code moves.
