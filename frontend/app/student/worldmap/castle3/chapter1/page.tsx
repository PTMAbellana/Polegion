'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { CirclePartsMinigame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid } from '@/components/chapters/lessons';
import ChapterProgressModal from '@/components/chapters/ChapterProgressModal';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_OPENING_DIALOGUE,
  CHAPTER1_LESSON_DIALOGUE,
  CHAPTER1_MINIGAME_DIALOGUE,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_CONCEPTS,
  CHAPTER1_XP_VALUES,
  CHAPTER1_RELIC,
  CHAPTER1_WIZARD,
} from '@/constants/chapters/castle3/chapter1';
import Image from 'next/image';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { submitQuizAttempt, getUserQuizAttempts } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import { useChapterStore } from '@/store/chapterStore';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'quiz4' | 'quiz5' | 'quiz6' | 'reward';

const CHAPTER_KEY = 'castle3-chapter1';

export default function Castle2Chapter1Page() {
  const router = useRouter();
  
  // Zustand store
  const chapterStore = useChapterStore();
  const savedProgress = chapterStore.getChapterProgress(CHAPTER_KEY);
  
  // Progress modal state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [hasCheckedProgress, setHasCheckedProgress] = useState(false);
  
  // Initialize chapter in store if not exists and check for existing progress
  useEffect(() => {
    // Get existing progress BEFORE initializing (to check if it's truly new)
    const existingProgress = chapterStore.getChapterProgress(CHAPTER_KEY);
    const hasRealProgress = existingProgress && (
      existingProgress.currentScene !== 'opening' ||
      Object.keys(existingProgress.completedTasks || {}).length > 0 ||
      existingProgress.earnedXP.lesson > 0 ||
      existingProgress.earnedXP.minigame > 0 ||
      existingProgress.earnedXP.quiz > 0
    );
    
    chapterStore.initializeChapter(CHAPTER_KEY);
    
    // Clean up lesson tasks from store (remove old corrupted data)
    if (existingProgress?.completedTasks) {
      const lessonTasks = ['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
      lessonTasks.forEach(taskId => {
        if (existingProgress.completedTasks[taskId]) {
          const progress = chapterStore.getChapterProgress(CHAPTER_KEY);
          if (progress && progress.completedTasks) {
            const cleaned = { ...progress.completedTasks };
            delete cleaned[taskId];
            chapterStore.chapters[CHAPTER_KEY].completedTasks = cleaned;
          }
        }
      });
    }
    
    // Check if user has disabled this modal for this chapter
    const dontShowAgain = localStorage.getItem(`${CHAPTER_KEY}-dont-show-modal`);
    const modalExpiration = localStorage.getItem(`${CHAPTER_KEY}-modal-expiration`);
    
    // Check if the "don't show again" has expired
    let shouldShowModal = true;
    if (dontShowAgain === 'true' && modalExpiration) {
      const expirationTime = parseInt(modalExpiration, 10);
      if (Date.now() < expirationTime) {
        // Still within the 5-minute window, don't show modal
        shouldShowModal = false;
      } else {
        // Expired, clear the flags
        localStorage.removeItem(`${CHAPTER_KEY}-dont-show-modal`);
        localStorage.removeItem(`${CHAPTER_KEY}-modal-expiration`);
      }
    }
    
    // Only show modal if there's REAL progress (not just initialization)
    if (!hasCheckedProgress && hasRealProgress && shouldShowModal) {
      setShowProgressModal(true);
      setHasCheckedProgress(true);
    } else {
      setHasCheckedProgress(true);
    }
  }, []);
  
  // Scene and state management - initialize from store or defaults
  const [currentScene, setCurrentScene] = useState<SceneType>(
    (savedProgress?.currentScene as SceneType) || 'opening'
  );
  const [isMuted, setIsMuted] = useState(savedProgress?.isMuted || false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(savedProgress?.autoAdvanceEnabled || false);
  const [currentMinigameLevel, setCurrentMinigameLevel] = useState(savedProgress?.currentMinigameLevel || 0);
  
  // Track which lesson tasks have been checked to prevent duplicates (using ref to avoid re-renders)
  const checkedLessonTasksRef = React.useRef<Set<string>>(new Set()); // Changed from number to string for semantic keys
  const previousMessageIndexRef = React.useRef<number>(-1);
  
  // Task tracking - initialize from store but filter out lesson tasks
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(() => {
    const saved = savedProgress?.completedTasks || {};
    const filtered = { ...saved };
    // Remove lesson tasks - they will be re-tracked by the new system
    delete filtered['task-0'];
    delete filtered['task-1'];
    delete filtered['task-2'];
    delete filtered['task-3'];
    delete filtered['task-4'];
    delete filtered['task-5'];
    return filtered;
  });
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>(
    savedProgress?.failedTasks || {}
  );
  
  // Quiz state - initialize from store or defaults
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(
    savedProgress?.quizAnswers || {}
  );
  const [quizAttempts, setQuizAttempts] = useState(savedProgress?.quizAttempts || 0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // XP tracking - initialize from store or defaults
  const [earnedXP, setEarnedXP] = useState({
    lesson: savedProgress?.earnedXP.lesson || 0,
    minigame: savedProgress?.earnedXP.minigame || 0,
    quiz: savedProgress?.earnedXP.quiz || 0,
  });

  // Quiz score tracking
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Custom hooks
  const { chapterId, quiz, minigame, loading, error, authLoading, userProfile } = useChapterData({
    castleId: CHAPTER1_CASTLE_ID,
    chapterNumber: CHAPTER1_NUMBER,
  });

  const {
    displayedText,
    isTyping,
    messageIndex,
    handleDialogueClick,
    handleNextMessage,
    resetDialogue,
  } = useChapterDialogue({
    dialogue: currentScene === 'opening' ? CHAPTER1_OPENING_DIALOGUE : 
             currentScene === 'lesson' ? CHAPTER1_LESSON_DIALOGUE.map(d => d.text) : 
             CHAPTER1_MINIGAME_DIALOGUE,
    autoAdvance: autoAdvanceEnabled,
    autoAdvanceDelay: 3000,
    typingSpeed: 30,
    onDialogueComplete: handleDialogueComplete,
  });

  const { playNarration, stopAudio } = useChapterAudio({ isMuted });

  // Sync state changes to store
  useEffect(() => {
    chapterStore.setScene(CHAPTER_KEY, currentScene);
  }, [currentScene]);

  useEffect(() => {
    chapterStore.setMinigameLevel(CHAPTER_KEY, currentMinigameLevel);
  }, [currentMinigameLevel]);

  useEffect(() => {
    chapterStore.setAudioSettings(CHAPTER_KEY, isMuted, autoAdvanceEnabled);
  }, [isMuted, autoAdvanceEnabled]);

  // Sync completed tasks to store
  useEffect(() => {
    Object.entries(completedTasks).forEach(([taskId, completed]) => {
      if (completed) {
        const savedProgress = chapterStore.getChapterProgress(CHAPTER_KEY);
        if (!savedProgress?.completedTasks[taskId]) {
          chapterStore.setTaskComplete(CHAPTER_KEY, taskId);
        }
      }
    });
  }, [completedTasks]);

  // Sync failed tasks to store
  useEffect(() => {
    Object.entries(failedTasks).forEach(([taskId, failed]) => {
      if (failed) {
        const savedProgress = chapterStore.getChapterProgress(CHAPTER_KEY);
        if (!savedProgress?.failedTasks[taskId]) {
          chapterStore.setTaskFailed(CHAPTER_KEY, taskId);
        }
      }
    });
  }, [failedTasks]);

  // Sync quiz answers to store
  useEffect(() => {
    Object.entries(quizAnswers).forEach(([questionId, answer]) => {
      const savedProgress = chapterStore.getChapterProgress(CHAPTER_KEY);
      if (savedProgress?.quizAnswers[questionId] !== answer) {
        chapterStore.setQuizAnswer(CHAPTER_KEY, questionId, answer);
      }
    });
  }, [quizAnswers]);

  // Sync earned XP to store
  useEffect(() => {
    if (earnedXP.lesson > 0) {
      chapterStore.setEarnedXP(CHAPTER_KEY, 'lesson', earnedXP.lesson);
    }
    if (earnedXP.minigame > 0) {
      chapterStore.setEarnedXP(CHAPTER_KEY, 'minigame', earnedXP.minigame);
    }
    if (earnedXP.quiz > 0) {
      chapterStore.setEarnedXP(CHAPTER_KEY, 'quiz', earnedXP.quiz);
    }
  }, [earnedXP]);

  // Fetch quiz score when entering reward scene
  useEffect(() => {
    const fetchQuizScore = async () => {
      if (currentScene === 'reward' && quiz?.id) {
        try {
          // Add a small delay to ensure the backend has finished processing
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const attempts = await getUserQuizAttempts(quiz.id);
          console.log('[castle3-chapter1] Fetched quiz attempts:', attempts);
          
          if (attempts && attempts.length > 0) {
            // Get the most recent attempt (assuming attempts are ordered by creation date)
            const sortedAttempts = attempts.sort((a: any, b: any) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const mostRecentScore = sortedAttempts[0]?.score || 0;
            console.log('[castle3-chapter1] Most recent quiz score:', mostRecentScore);
            setQuizScore(mostRecentScore);
          }
        } catch (error) {
          console.error('Failed to fetch quiz score:', error);
          // Fallback to calculating score from earnedXP
          setQuizScore(null);
        }
      }
    };
    
    fetchQuizScore();
  }, [currentScene, quiz?.id]);

  // Track lesson progress and mark tasks as dialogue progresses
  React.useEffect(() => {
    // Castle 3 Chapter 1 has 6 lesson concepts with semantic keys
    if (currentScene === 'lesson' && messageIndex >= 0 && messageIndex < CHAPTER1_LESSON_DIALOGUE.length) {
      const currentDialogue = CHAPTER1_LESSON_DIALOGUE[messageIndex];
      
      // Skip if no taskId (intro/conclusion messages)
      if (!currentDialogue.taskId) return;
      
      const dialogueKey = currentDialogue.key;
      
      console.log('Lesson scene - dialogueKey:', dialogueKey, 'taskId:', currentDialogue.taskId);
      
      // Only process if we haven't checked this concept yet
      if (checkedLessonTasksRef.current.has(dialogueKey)) {
        console.log('Skipping - already checked:', dialogueKey);
        return;
      }
      
      // Mark the task complete based on dialogue key
      console.log('Marking task complete:', currentDialogue.taskId, 'for concept:', dialogueKey);
      markTaskComplete(currentDialogue.taskId);
      checkedLessonTasksRef.current.add(dialogueKey);
      
      // Update previous messageIndex for backward detection
      previousMessageIndexRef.current = messageIndex;
    }
    
    // Detect if we're jumping backward (dialogue reset) - reset the tracking
    if (previousMessageIndexRef.current > messageIndex) {
      console.log('Detected backward jump - user may have restarted dialogue');
      previousMessageIndexRef.current = messageIndex;
    }
  }, [currentScene, messageIndex]);

  // Handlers
  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      checkedLessonTasksRef.current = new Set(); // Reset checked tasks when entering lesson scene
      previousMessageIndexRef.current = -1; // Reset previous message index
      resetDialogue(); // Reset dialogue BEFORE changing scene to prevent messageIndex carryover
      setCurrentScene('lesson');
      playNarration('castle3-chapter1-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= CHAPTER1_LESSON_DIALOGUE.length - 1) {
      // All lesson tasks should be marked by now through the useEffect above
      awardXP('lesson');
      resetDialogue(); // Reset dialogue BEFORE changing scene
      setCurrentScene('minigame');
    }
  }

  // Reset dialogue when scene changes (backup, in case direct calls are missed)
  React.useEffect(() => {
    resetDialogue();
  }, [currentScene]);

  const markTaskComplete = (taskKey: string) => {
    setCompletedTasks((prev) => {
      if (prev[taskKey]) {
        console.log(`Task ${taskKey} already completed, skipping`);
        return prev; // Already completed, don't update
      }
      console.log(`Marking task ${taskKey} as complete`);
      return { ...prev, [taskKey]: true };
    });
  };

  const markTaskFailed = (taskKey: string) => {
    setFailedTasks((prev) => ({ ...prev, [taskKey]: true }));
  };

  const awardXP = async (type: 'lesson' | 'minigame' | 'quiz') => {
    let xp = 0;
    if (type === 'lesson') xp = CHAPTER1_XP_VALUES.lesson;
    else if (type === 'minigame') xp = CHAPTER1_XP_VALUES.minigame;
    else if (type === 'quiz') xp = CHAPTER1_XP_VALUES.quiz1 + CHAPTER1_XP_VALUES.quiz2 + CHAPTER1_XP_VALUES.quiz3 + CHAPTER1_XP_VALUES.quiz4 + CHAPTER1_XP_VALUES.quiz5 + CHAPTER1_XP_VALUES.quiz6;

    setEarnedXP((prev) => ({ ...prev, [type]: xp }));

    // Award to backend
    if (chapterId && userProfile?.id) {
      try {
        await awardLessonXP(chapterId, xp);
      } catch (error) {
        console.error('Failed to award XP:', error);
      }
    }
  };

  const handleMinigameComplete = async (isCorrect: boolean) => {
    if (isCorrect) {
      // Move to next level or complete minigame
      if (currentMinigameLevel < CHAPTER1_MINIGAME_LEVELS.length - 1) {
        setCurrentMinigameLevel(currentMinigameLevel + 1);
      } else {
        // All levels complete
        markTaskComplete('task-6'); // Complete minigame task
        awardXP('minigame');
        
        // Submit minigame attempt
        if (minigame && userProfile?.id) {
          try {
            await submitMinigameAttempt(minigame.id, {
              score: 100,
              time_taken: 60,
              attempt_data: { completedLevels: CHAPTER1_MINIGAME_LEVELS.length },
            });
          } catch (error) {
            console.error('Failed to submit minigame:', error);
          }
        }
        
        setCurrentScene('quiz1');
      }
    }
  };

  const handleQuizSubmit = async (quizNumber: 1 | 2 | 3 | 4 | 5 | 6) => {
    if (!quiz || !userProfile?.id) return;

    const taskKey = quizNumber === 1 ? 'task-7' : quizNumber === 2 ? 'task-8' : quizNumber === 3 ? 'task-9' : quizNumber === 4 ? 'task-10' : quizNumber === 5 ? 'task-11' : 'task-12';
    const questionIndex = quizNumber - 1;
    const question = quiz.quiz_config.questions[questionIndex];
    const userAnswer = quizAnswers[question.id];

    if (userAnswer === question.correctAnswer) {
      setQuizFeedback('correct');
      markTaskComplete(taskKey);
      
      // Delay moving to next scene to show feedback
      setTimeout(() => {
        setQuizFeedback(null);
        
        // Move to next quiz or reward
        if (quizNumber === 1) {
          setCurrentScene('quiz2');
          const nextQuestion = quiz.quiz_config.questions[1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3');
          const nextQuestion = quiz.quiz_config.questions[2];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 3) {
          setCurrentScene('quiz4');
          const nextQuestion = quiz.quiz_config.questions[3];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 4) {
          setCurrentScene('quiz5');
          const nextQuestion = quiz.quiz_config.questions[4];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 5) {
          setCurrentScene('quiz6');
          const nextQuestion = quiz.quiz_config.questions[5];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else {
          // All quizzes complete
          awardXP('quiz');
          
          // Submit quiz attempt
          try {
            console.log('[castle3-chapter1] Submitting quiz with answers:', quizAnswers);
            console.log('[castle3-chapter1] Quiz config:', quiz.quiz_config);
            submitQuizAttempt(quiz.id, quizAnswers);
          } catch (error) {
            console.error('Failed to submit quiz:', error);
          }
          
          // Complete chapter
          try {
            completeChapter(chapterId!);
          } catch (error) {
            console.error('Failed to complete chapter:', error);
          }
          
          setCurrentScene('reward');
        }
      }, 1000); // 1 second delay to show green feedback
    } else {
      setQuizFeedback('incorrect');
      markTaskFailed(taskKey);
      setQuizAttempts(quizAttempts + 1);
      
      // Reset feedback and move to next question after delay
      setTimeout(() => {
        setQuizFeedback(null);
        
        // Move to next quiz even if incorrect
        if (quizNumber === 1) {
          setCurrentScene('quiz2');
          const nextQuestion = quiz.quiz_config.questions[1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3');
          const nextQuestion = quiz.quiz_config.questions[2];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 3) {
          setCurrentScene('quiz4');
          const nextQuestion = quiz.quiz_config.questions[3];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 4) {
          setCurrentScene('quiz5');
          const nextQuestion = quiz.quiz_config.questions[4];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 5) {
          setCurrentScene('quiz6');
          const nextQuestion = quiz.quiz_config.questions[5];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else {
          // All quizzes answered (even if some wrong)
          // Submit quiz attempt
          try {
            submitQuizAttempt(quiz.id, quizAnswers);
          } catch (error) {
            console.error('Failed to submit quiz:', error);
          }
          
          // Complete chapter (even with wrong answers)
          try {
            completeChapter(chapterId!);
          } catch (error) {
            console.error('Failed to complete chapter:', error);
          }
          
          setCurrentScene('reward');
        }
      }, 1000);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizAttempts(0);
    setFailedTasks({});
    setQuizFeedback(null);
    setQuizScore(null); // Reset quiz score when retaking
    
    // Clear quiz data from store
    chapterStore.clearAllQuizData(CHAPTER_KEY);
    
    // Clear quiz task completions (task-7 through task-12)
    setCompletedTasks((prev) => {
      const updated = { ...prev };
      delete updated['task-7'];
      delete updated['task-8'];
      delete updated['task-9'];
      delete updated['task-10'];
      delete updated['task-11'];
      delete updated['task-12'];
      delete updated['task-9'];
      delete updated['task-10'];
      delete updated['task-11'];
      return updated;
    });
    
    setCurrentScene('quiz1');
  };

  const handleContinueProgress = () => {
    setShowProgressModal(false);
    // Continue with saved progress (already loaded)
  };

  const handleDontShowAgain = () => {
    const expirationTime = Date.now() + 5 * 60 * 1000; // 5 minutes
    localStorage.setItem(`${CHAPTER_KEY}-dont-show-modal`, 'true');
    localStorage.setItem(`${CHAPTER_KEY}-modal-expiration`, expirationTime.toString());
    setShowProgressModal(false);
  };

  const handleRestartChapter = () => {
    setShowProgressModal(false);
    
    // Reset all state to initial values
    setCurrentScene('opening');
    setCompletedTasks({});
    setFailedTasks({});
    setQuizAnswers({});
    setQuizAttempts(0);
    setEarnedXP({ lesson: 0, minigame: 0, quiz: 0 });
    setCurrentMinigameLevel(0);
    setQuizFeedback(null);
    
    // Clear all data from store for this chapter
    chapterStore.clearAllQuizData(CHAPTER_KEY);
    chapterStore.setScene(CHAPTER_KEY, 'opening');
    chapterStore.setMinigameLevel(CHAPTER_KEY, 0);
    chapterStore.setEarnedXP(CHAPTER_KEY, 'lesson', 0);
    chapterStore.setEarnedXP(CHAPTER_KEY, 'minigame', 0);
    chapterStore.setEarnedXP(CHAPTER_KEY, 'quiz', 0);
    
    // Reset lesson tracking
    checkedLessonTasksRef.current = new Set();
    previousMessageIndexRef.current = -1;
    
    // Reset dialogue
    resetDialogue();
  };

  const handleReturnToCastle = () => {
    router.push('/student/worldmap/castle2');
  };

  // Loading and error states
  if (authLoading || loading) {
    return (
      <div className={baseStyles.loading_container}>
        <p>Loading Chapter 1...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={baseStyles.loading_container}>
        <p>Error: {error}</p>
        <button onClick={handleReturnToCastle}>Return to Castle</button>
      </div>
    );
  }

  // Main render
  return (
    <div className={`${baseStyles.chapterContainer} ${baseStyles.castle3Theme}`}>
      <div className={baseStyles.backgroundOverlay}></div>

      {/* Progress Modal */}
      {showProgressModal && (
        <ChapterProgressModal
          chapterTitle="Chapter 1: The Tide of Shapes"
          currentScene={savedProgress?.currentScene || 'opening'}
          onContinue={handleContinueProgress}
          onRestart={handleRestartChapter}
          onDontShowAgain={handleDontShowAgain}
        />
      )}

      {/* Top Bar */}
      <ChapterTopBar
        chapterTitle="Chapter 1: The Tide of Shapes"
        chapterSubtitle="Castle 3 - Circle Sanctuary"
        isMuted={isMuted}
        autoAdvance={autoAdvanceEnabled}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleAutoAdvance={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
        onExit={handleReturnToCastle}
        styleModule={baseStyles}
      />

      {/* Main Content */}
      <div className={baseStyles.mainContent}>
        {/* Task Panel */}
        <ChapterTaskPanel
          tasks={CHAPTER1_LEARNING_OBJECTIVES}
          completedTasks={completedTasks}
          failedTasks={failedTasks}
          styleModule={baseStyles}
        />

        {/* Game Area */}
        <div className={baseStyles.gameArea}>
          {/* Opening Scene */}
          {currentScene === 'opening' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ color: '#FFFD8F', fontSize: '2rem' }}>Welcome to The Tide of Shapes!</h2>
              <p style={{ color: '#B0CE88', fontSize: '1.2rem', marginTop: '1rem' }}>
                Click the dialogue box to begin your journey...
              </p>
            </div>
          )}

          {/* Lesson Scene */}
          {currentScene === 'lesson' && (
            <LessonGrid columns={3} gap="medium" styleModule={lessonStyles}>
              {CHAPTER1_CONCEPTS.map((concept, index) => {
                // Find the corresponding dialogue to determine if it's been reached
                const dialogueIndex = CHAPTER1_LESSON_DIALOGUE.findIndex(d => d.key === concept.key);
                const isHighlighted = messageIndex >= dialogueIndex;
                
                return (
                  <ConceptCard
                    key={`${concept.key}-${index}`}
                    title={concept.title}
                    description={concept.summary}
                    icon={null}
                    highlighted={isHighlighted}
                    styleModule={lessonStyles}
                  />
                );
              })}
            </LessonGrid>
          )}

          {/* Minigame Scene */}
          {currentScene === 'minigame' && (
            <CirclePartsMinigame
              question={{
                id: `minigame-${currentMinigameLevel}`,
                instruction: CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel].instruction,
                correctAnswer: CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel].partType,
                partType: CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel].partType,
                hint: CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel].hint,
              }}
              onComplete={handleMinigameComplete}
              styleModule={minigameStyles}
            />
          )}

          {/* Quiz Scenes */}
          {(currentScene === 'quiz1' || currentScene === 'quiz2' || currentScene === 'quiz3' || currentScene === 'quiz4' || currentScene === 'quiz5' || currentScene === 'quiz6') && quiz && (
            <div className={minigameStyles.minigameContainer}>
              <div className={minigameStyles.questionText}>
                {quiz.quiz_config.questions[
                  currentScene === 'quiz1' ? 0 : 
                  currentScene === 'quiz2' ? 1 : 
                  currentScene === 'quiz3' ? 2 : 
                  currentScene === 'quiz4' ? 3 : 
                  currentScene === 'quiz5' ? 4 : 5
                ]?.question}
              </div>
              
              <div className={minigameStyles.answerOptions}>
                {quiz.quiz_config.questions[
                  currentScene === 'quiz1' ? 0 : 
                  currentScene === 'quiz2' ? 1 : 
                  currentScene === 'quiz3' ? 2 : 
                  currentScene === 'quiz4' ? 3 : 
                  currentScene === 'quiz5' ? 4 : 5
                ]?.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`${minigameStyles.answerOption} ${
                      quizAnswers[quiz.quiz_config.questions[
                        currentScene === 'quiz1' ? 0 : 
                        currentScene === 'quiz2' ? 1 : 
                        currentScene === 'quiz3' ? 2 : 
                        currentScene === 'quiz4' ? 3 : 
                        currentScene === 'quiz5' ? 4 : 5
                      ].id] === option
                        ? minigameStyles.answerOptionSelected
                        : ''
                    }`}
                    onClick={() => {
                      const questionId = quiz.quiz_config.questions[
                        currentScene === 'quiz1' ? 0 : 
                        currentScene === 'quiz2' ? 1 : 
                        currentScene === 'quiz3' ? 2 : 
                        currentScene === 'quiz4' ? 3 : 
                        currentScene === 'quiz5' ? 4 : 5
                      ].id;
                      setQuizAnswers((prev) => ({ ...prev, [questionId]: option }));
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>

              <button
                className={`${minigameStyles.submitButton} ${
                  quizFeedback === 'correct' 
                    ? minigameStyles.submitButtonCorrect 
                    : quizFeedback === 'incorrect' 
                    ? minigameStyles.submitButtonIncorrect 
                    : ''
                }`}
                onClick={() => handleQuizSubmit(
                  currentScene === 'quiz1' ? 1 : 
                  currentScene === 'quiz2' ? 2 : 
                  currentScene === 'quiz3' ? 3 : 
                  currentScene === 'quiz4' ? 4 : 
                  currentScene === 'quiz5' ? 5 : 6
                )}
                disabled={!quizAnswers[quiz.quiz_config.questions[
                  currentScene === 'quiz1' ? 0 : 
                  currentScene === 'quiz2' ? 1 : 
                  currentScene === 'quiz3' ? 2 : 
                  currentScene === 'quiz4' ? 3 : 4
                ].id] || quizFeedback !== null}
              >
                {quizFeedback === 'correct' ? '✓ Correct!' : quizFeedback === 'incorrect' ? '✗ Incorrect' : 'Submit Answer'}
              </button>
            </div>
          )}

          {/* Reward Scene */}
          {currentScene === 'reward' && (
            <ChapterRewardScreen
              relicName={CHAPTER1_RELIC.name}
              relicImage={CHAPTER1_RELIC.image}
              relicDescription={CHAPTER1_RELIC.description}
              earnedXP={earnedXP}
              quizScore={quizScore}
              canRetakeQuiz={true}
              onRetakeQuiz={handleRetakeQuiz}
              onComplete={handleReturnToCastle}
              styleModule={baseStyles}
            />
          )}
        </div>
      </div>

      {/* Dialogue Box */}
      {currentScene !== 'reward' && (
        <ChapterDialogueBox
          wizardName={CHAPTER1_WIZARD.name}
          wizardImage={CHAPTER1_WIZARD.image}
          displayedText={displayedText}
          isTyping={isTyping}
          showContinuePrompt={!isTyping}
          onClick={handleDialogueClick}
          styleModule={baseStyles}
        />
      )}
    </div>
  );
}
