# Adaptive Learning Repository Refactor

## Overview
The original `AdaptiveLearningRepo.js` (1700+ lines) has been refactored into smaller, focused repository modules for better maintainability and code organization.

## New Structure

```
backend/infrastructure/repository/adaptive/
├── AdaptiveLearningRepo.js              # Main coordinator (backward compatible)
├── AdaptiveLearningRepo.refactored.js   # New refactored version
├── TopicRepo.js                         # Topic CRUD operations
├── StudentStateRepo.js                  # Student difficulty & learning state
├── QLearningRepo.js                     # Q-learning: Q-values & state transitions
├── QuestionAttemptRepo.js               # Question tracking & attempts
├── TopicProgressRepo.js                 # Progress, mastery & unlocking
└── CohortRepo.js                        # A/B testing cohort management
```

## Module Responsibilities

### 1. **TopicRepo.js** (~65 lines)
- `getAllTopics()` - Fetch all active learning topics
- `getTopicById(topicId)` - Get single topic details

### 2. **StudentStateRepo.js** (~165 lines)
- `getStudentDifficulty(userId, topicId)` - Get/create student state
- `createStudentDifficulty(userId, topicId)` - Initialize student state
- `updateStudentDifficulty(userId, topicId, updates)` - Update difficulty & metrics
- `getAllStatesForUser(userId)` - Fetch all states for one student
- `getAllStudentDifficulties(chapterId)` - Research analysis data

### 3. **QLearningRepo.js** (~265 lines)
- `logStateTransition(transitionData)` - Log MDP state transitions
- `saveQValue(userId, stateKey, action, qValue)` - Persist Q-values
- `getQValue(userId, stateKey, action)` - Retrieve single Q-value
- `getQValuesByState(userId, stateKey)` - Get all Q-values for a state
- `getAllQValues()` - Export all Q-values (research)
- `getTransitionsForExport(options)` - Export state transitions (CSV)
- `getPerformanceHistory(userId, topicId, limit)` - Student performance
- `getRecentAttempts(userId, topicId, limit)` - Recent attempts for misconception detection
- `getResearchStatistics(chapterId)` - Aggregated research stats

### 4. **QuestionAttemptRepo.js** (~230 lines)
- `trackQuestionAttempt(...)` - Log question attempts
- `updateHintCount(...)` - Track hint usage
- `getQuestionAttemptCount(...)` - Count attempts per question
- `getShownQuestionsInSession(...)` - Prevent question repeats
- `getRecentQuestionTypes(...)` - Avoid immediate type repeats
- `getCognitiveDomainPerformance(userId)` - Cognitive domain analytics
- `saveQuestion(questionData)` - Save generated questions
- `getQuestionsByTopicAndDifficulty(...)` - Retrieve questions
- `checkSubmissionDuplicate(...)` - Idempotency check
- `recordSubmission(...)` - Record submission IDs

### 5. **TopicProgressRepo.js** (~330 lines)
- `getTopicProgress(userId, topicId)` - Get/create progress record
- `createTopicProgress(userId, topicId, unlocked)` - Initialize progress
- `updateTopicMastery(userId, topicId, percentage)` - Update mastery
- `updateLongestStreak(userId, topicId, streak)` - Track best streak
- `getAllTopicProgress(userId)` - Fetch all progress for user
- `updateTopicProgress(userId, topicId, updates)` - General updates
- `initializeTopicsForUser(userId, allTopics)` - Setup new user
- `savePendingQuestion(...)` - Persist pending question
- `clearPendingQuestion(...)` - Clear after answer
- `incrementAttemptCount(...)` - Atomic attempt counter
- `getPendingQuestion(...)` - Retrieve pending question
- `markHintShown(...)` - Track hint analytics
- `getStuckStudents(...)` - Teacher dashboard data

### 6. **CohortRepo.js** (~95 lines)
- `getUserCohort(userId)` - Get cohort assignment (adaptive/control)
- `getCohortCounts()` - Get current cohort distribution
- `assignUserToBalancedCohort(userId)` - Balanced random assignment
- `setUserCohort(userId, cohort)` - Manual override (admin)

### 7. **AdaptiveLearningRepo.refactored.js** (~270 lines)
- Main coordinator that delegates to specialized repos
- Maintains backward compatibility with existing code
- Single entry point for container.js

## Migration Plan

### Phase 1: Testing (Current)
1. Keep original `AdaptiveLearningRepo.js` as backup
2. Test new refactored version in development
3. Verify all methods work identically

### Phase 2: Gradual Migration
1. Update `container.js` to use `AdaptiveLearningRepo.refactored.js`
2. Run full test suite
3. Monitor production for 24-48 hours

### Phase 3: Cleanup
1. Rename `AdaptiveLearningRepo.refactored.js` → `AdaptiveLearningRepo.js`
2. Archive old version to `AdaptiveLearningRepo.legacy.js`
3. Update documentation

## Benefits

✅ **Maintainability**: Each file <350 lines, focused responsibility
✅ **Testability**: Easier to write unit tests for isolated modules
✅ **Readability**: Clear separation of concerns
✅ **Scalability**: Easy to add new features to specific modules
✅ **Backward Compatible**: No breaking changes to existing code

## Usage Example

```javascript
// In container.js - NO CHANGES NEEDED
const AdaptiveLearningRepository = require('./infrastructure/repository/adaptive/AdaptiveLearningRepo.refactored');
const adaptiveLearningRepository = new AdaptiveLearningRepository(supabase);

// All existing method calls work exactly the same
await adaptiveLearningRepository.getStudentDifficulty(userId, topicId);
await adaptiveLearningRepository.saveQValue(userId, stateKey, action, qValue);
```

## Testing Checklist

- [ ] All topic operations work (getAllTopics, getTopicById)
- [ ] Student state CRUD operations functional
- [ ] Q-learning persistence verified (Q-values, transitions)
- [ ] Question attempt tracking accurate
- [ ] Topic progress/unlocking works correctly
- [ ] Cohort assignment functioning
- [ ] Backward compatibility confirmed
- [ ] Performance benchmarks equivalent
- [ ] No breaking changes in API

## Notes

- Original file archived as reference
- All business logic preserved
- Cache layer maintained
- Error handling consistent
- Database queries unchanged
