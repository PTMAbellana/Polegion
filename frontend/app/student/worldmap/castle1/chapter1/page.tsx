'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { PointBasedMinigame, GeometryPhysicsGame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid, VisualDemo } from '@/components/chapters/lessons';
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
  CHAPTER1_XP_VALUES,
} from '@/constants/chapters/castle1/chapter1';
import Image from 'next/image';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { submitQuizAttempt, getUserQuizAttempts } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import { useChapterStore } from '@/store/chapterStore';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward';

const CHAPTER_KEY = 'castle1-chapter1';

export default function Chapter1Page() {
  const router = useRouter();
  
  // Zustand store
  const chapterStore = useChapterStore();
  const savedProgress = chapterStore.getChapterProgress(CHAPTER_KEY);
  
  // Progress modal state
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [hasCheckedProgress, setHasCheckedProgress] = useState(false);
  
  // Initialize chapter in store if not exists and check for existing progress
  useEffect(() => {
    chapterStore.initializeChapter(CHAPTER_KEY);
    
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
    
    // Check if there's saved progress and it's not at the start
    if (!hasCheckedProgress && savedProgress && savedProgress.currentScene !== 'opening' && shouldShowModal) {
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
  const checkedLessonTasksRef = React.useRef<Set<number>>(new Set());
  const previousMessageIndexRef = React.useRef<number>(-1);
  
  // Task tracking - initialize from store or defaults
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    savedProgress?.completedTasks || {}
  );
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
             currentScene === 'lesson' ? CHAPTER1_LESSON_DIALOGUE : 
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
          console.log('[Chapter1] Fetched quiz attempts:', attempts);
          
          if (attempts && attempts.length > 0) {
            // Get the most recent attempt (assuming attempts are ordered by creation date)
            const sortedAttempts = attempts.sort((a: any, b: any) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const mostRecentScore = sortedAttempts[0]?.score || 0;
            console.log('[Chapter1] Most recent quiz score:', mostRecentScore);
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
    if (currentScene === 'lesson' && messageIndex >= 0 && messageIndex <= 3) {
      console.log('Lesson scene - messageIndex:', messageIndex, 'previous:', previousMessageIndexRef.current);
      
      // Detect if we're jumping backward (dialogue reset) - reset the previous index
      if (previousMessageIndexRef.current > messageIndex) {
        console.log('Detected backward jump - resetting previous index');
        previousMessageIndexRef.current = -1;
      }
      
      // Only process if we haven't checked this task yet
      if (checkedLessonTasksRef.current.has(messageIndex)) {
        console.log('Skipping - already checked');
        previousMessageIndexRef.current = messageIndex;
        return;
      }
      
      // Check if this is a valid progression:
      // - First message should be 0 (when previous is -1, only accept messageIndex 0)
      // - Otherwise, should be moving forward by 1 (sequential progression)
      const isValidFirstMessage = previousMessageIndexRef.current === -1 && messageIndex === 0;
      const isSequentialProgression = messageIndex === previousMessageIndexRef.current + 1;
      
      if (isValidFirstMessage || isSequentialProgression) {
        console.log('Processing task for messageIndex:', messageIndex);
        
        // Mark the task based on messageIndex and track it
        if (messageIndex === 0) {
          console.log('Marking task-0 complete');
          markTaskComplete('task-0'); // Learn about Point
          checkedLessonTasksRef.current.add(0);
        } else if (messageIndex === 1) {
          console.log('Marking task-1 complete');
          markTaskComplete('task-1'); // Learn about Line Segment
          checkedLessonTasksRef.current.add(1);
        } else if (messageIndex === 2) {
          console.log('Marking task-2 complete');
          markTaskComplete('task-2'); // Learn about Ray
          checkedLessonTasksRef.current.add(2);
        } else if (messageIndex === 3) {
          console.log('Marking task-3 complete');
          markTaskComplete('task-3'); // Learn about Line
          checkedLessonTasksRef.current.add(3);
        }
      } else {
        console.log('Skipping - invalid sequence (expected', previousMessageIndexRef.current + 1, 'got', messageIndex, ')');
      }
      
      // Update previous messageIndex
      previousMessageIndexRef.current = messageIndex;
    }
  }, [currentScene, messageIndex]);

  // Handlers
  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      checkedLessonTasksRef.current = new Set(); // Reset checked tasks when entering lesson scene
      previousMessageIndexRef.current = -1; // Reset previous message index
      setCurrentScene('lesson');
      playNarration('chapter1-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= CHAPTER1_LESSON_DIALOGUE.length - 1) {
      // All lesson tasks should be marked by now through the useEffect above
      awardXP('lesson');
      setCurrentScene('minigame');
    }
  }

  // Reset dialogue when scene changes
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
    else if (type === 'quiz') xp = CHAPTER1_XP_VALUES.quiz1 + CHAPTER1_XP_VALUES.quiz2 + CHAPTER1_XP_VALUES.quiz3;

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
        markTaskComplete('task-4'); // Complete minigame task
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

  const handleQuizSubmit = async (quizNumber: 1 | 2 | 3) => {
    if (!quiz || !userProfile?.id) return;

    const taskKey = quizNumber === 1 ? 'task-5' : quizNumber === 2 ? 'task-6' : 'task-7';
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
          // Clear the answer for the next quiz question
          const nextQuestion = quiz.quiz_config.questions[1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3');
          // Clear the answer for the next quiz question
          const nextQuestion = quiz.quiz_config.questions[2];
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
            console.log('[Chapter1] Submitting quiz with answers:', quizAnswers);
            console.log('[Chapter1] Quiz config:', quiz.quiz_config);
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
          // Clear the answer for the next quiz question
          const nextQuestion = quiz.quiz_config.questions[1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3');
          // Clear the answer for the next quiz question
          const nextQuestion = quiz.quiz_config.questions[2];
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
    
    // Clear quiz task completions (task-5, task-6, task-7)
    setCompletedTasks((prev) => {
      const updated = { ...prev };
      delete updated['task-5'];
      delete updated['task-6'];
      delete updated['task-7'];
      return updated;
    });
    
    setCurrentScene('quiz1');
  };

  const handleContinueProgress = () => {
    setShowProgressModal(false);
    // Continue with saved progress (already loaded)
  };

  const handleDontShowAgain = () => {
    localStorage.setItem(`${CHAPTER_KEY}-dont-show-modal`, 'true');
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
    
    // Reset lesson tracking
    checkedLessonTasksRef.current = new Set();
    previousMessageIndexRef.current = -1;
    
    // Reset dialogue
    resetDialogue();
  };

  const handleReturnToCastle = () => {
    router.push('/student/worldmap/castle1');
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
    <div className={`${baseStyles.chapterContainer} ${baseStyles.castle1Theme}`}>
      <div className={baseStyles.backgroundOverlay}></div>

      {/* Progress Modal */}
      {showProgressModal && (
        <ChapterProgressModal
          chapterTitle="Chapter 1: The Point of Origin"
          currentScene={savedProgress?.currentScene || 'opening'}
          onContinue={handleContinueProgress}
          onRestart={handleRestartChapter}
          onDontShowAgain={handleDontShowAgain}
        />
      )}

      {/* Top Bar */}
      <ChapterTopBar
        chapterTitle="Chapter 1: The Point of Origin"
        chapterSubtitle="Castle 1 - Euclidean Spire Quest"
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
              <h2 style={{ color: '#FFD700', fontSize: '2rem' }}>Welcome to the Euclidean Spire!</h2>
              <p style={{ color: '#E8F4FD', fontSize: '1.2rem', marginTop: '1rem' }}>
                Click the dialogue box to begin your journey...
              </p>
            </div>
          )}

          {/* Lesson Scene */}
          {currentScene === 'lesson' && (
            <LessonGrid columns={2} gap="medium" styleModule={lessonStyles}>
              <ConceptCard
                title="Point"
                description="A point is a location in space. It has no size, no width, no length - just a position marked by a dot."
                icon={<Image src="/images/castle1/point.png" alt="Point" width={200} height={80} />}
                highlighted={messageIndex >= 0}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Line Segment"
                description="A line segment connects two points. It has a definite beginning and end, with measurable length."
                icon={<Image src="/images/castle1/line-segment.png" alt="Line Segment" width={200} height={80} />}
                highlighted={messageIndex >= 1}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Ray"
                description="A ray starts at one point and extends infinitely in one direction, like a beam of light."
                icon={<Image src="/images/castle1/ray.png" alt="Ray" width={200} height={80} />}
                highlighted={messageIndex >= 2}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Line"
                description="A line extends infinitely in both directions. It has no endpoints and continues forever."
                icon={<Image src="/images/castle1/line.png" alt="Line" width={200} height={80} />}
                highlighted={messageIndex >= 3}
                styleModule={lessonStyles}
              />
            </LessonGrid>
          )}

          {/* Minigame Scene */}
          {currentScene === 'minigame' && (
            <GeometryPhysicsGame
              level={CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel]}
              onComplete={handleMinigameComplete}
              styleModule={minigameStyles}
            />
          )}

          {/* Quiz Scenes */}
          {(currentScene === 'quiz1' || currentScene === 'quiz2' || currentScene === 'quiz3') && quiz && (
            <div className={minigameStyles.minigameContainer}>
              <div className={minigameStyles.questionText}>
                {quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2]?.question}
              </div>
              
              <div className={minigameStyles.answerOptions}>
                {quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2]?.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`${minigameStyles.answerOption} ${
                      quizAnswers[quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].id] === option
                        ? minigameStyles.answerOptionSelected
                        : ''
                    }`}
                    onClick={() => {
                      const questionId = quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].id;
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
                onClick={() => handleQuizSubmit(currentScene === 'quiz1' ? 1 : currentScene === 'quiz2' ? 2 : 3)}
                disabled={!quizAnswers[quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].id] || quizFeedback !== null}
              >
                {quizFeedback === 'correct' ? '✓ Correct!' : quizFeedback === 'incorrect' ? '✗ Incorrect' : 'Submit Answer'}
              </button>
            </div>
          )}

          {/* Reward Scene */}
          {currentScene === 'reward' && (
            <ChapterRewardScreen
              relicName="Pointlight Crystal"
              relicImage="/images/relics/pointlight-crystal.png"
              relicDescription="You have mastered the fundamental building blocks of geometry! The Pointlight Crystal allows you to illuminate dark areas and reveal hidden paths."
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
          wizardName="Archim, Keeper of the Euclidean Spire"
          wizardImage="/images/archim-wizard.png"
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
