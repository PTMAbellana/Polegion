'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { ConceptCard, LessonGrid } from '@/components/chapters/lessons';
import { ShapeBasedMinigame } from '@/components/chapters/minigames';
import ChapterProgressModal from '@/components/chapters/ChapterProgressModal';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import {
  CHAPTER3_CASTLE_ID,
  CHAPTER3_NUMBER,
  CHAPTER3_OPENING_DIALOGUE,
  CHAPTER3_LESSON_DIALOGUE,
  CHAPTER3_MINIGAME_DIALOGUE,
  CHAPTER3_MINIGAME_LEVELS,
  CHAPTER3_LEARNING_OBJECTIVES,
  CHAPTER3_XP_VALUES,
  CHAPTER3_CONCEPTS,
} from '@/constants/chapters/castle1/chapter3';
import Image from 'next/image';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { submitQuizAttempt, getUserQuizAttempts } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import { useChapterStore } from '@/store/chapterStore';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward';

const CHAPTER_KEY = 'castle1-chapter3';

export default function Chapter3Page() {
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
      const lessonTasks = ['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6', 'task-7'];
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
    
    // Only show modal if there's REAL progress (not just initialization)
    if (!hasCheckedProgress && hasRealProgress && dontShowAgain !== 'true') {
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
  
  // Track which lesson tasks have been checked (using semantic keys)
  const checkedLessonTasksRef = useRef<Set<string>>(new Set());
  const previousMessageIndexRef = useRef<number>(-1);
  
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
    delete filtered['task-6'];
    delete filtered['task-7'];
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
  const [quizScore, setQuizScore] = useState<number | null>(null);
  
  // XP tracking - initialize from store or defaults
  const [earnedXP, setEarnedXP] = useState({
    lesson: savedProgress?.earnedXP.lesson || 0,
    minigame: savedProgress?.earnedXP.minigame || 0,
    quiz: savedProgress?.earnedXP.quiz || 0,
  });

  // Custom hooks
  const { chapterId, quiz, minigame, loading, error, authLoading, userProfile } = useChapterData({
    castleId: CHAPTER3_CASTLE_ID,
    chapterNumber: CHAPTER3_NUMBER,
  });

  const {
    displayedText,
    isTyping,
    messageIndex,
    handleDialogueClick,
    handleNextMessage,
    resetDialogue,
  } = useChapterDialogue({
    dialogue: currentScene === 'opening' ? CHAPTER3_OPENING_DIALOGUE : 
             currentScene === 'lesson' ? CHAPTER3_LESSON_DIALOGUE.map(d => d.text) : 
             CHAPTER3_MINIGAME_DIALOGUE,
    autoAdvance: autoAdvanceEnabled,
    autoAdvanceDelay: 3000,
    typingSpeed: 30,
    onDialogueComplete: handleDialogueComplete,
  });

  const { playNarration, stopAudio } = useChapterAudio({ isMuted });

  // Fetch quiz score when entering reward scene
  React.useEffect(() => {
    const fetchQuizScore = async () => {
      if (currentScene === 'reward' && quiz?.id) {
        try {
          // Add a small delay to ensure the backend has finished processing
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const attempts = await getUserQuizAttempts(quiz.id);
          console.log('[Chapter3] Fetched quiz attempts:', attempts);
          console.log('[Chapter3] Number of attempts:', attempts?.length);
          
          if (attempts && attempts.length > 0) {
            // Get the most recent attempt (assuming attempts are ordered by creation date)
            const sortedAttempts = attempts.sort((a: any, b: any) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            console.log('[Chapter3] Sorted attempts:', sortedAttempts.map((a: any) => ({
              id: a.id.substring(0, 8),
              score: a.score,
              createdAt: a.createdAt
            })));
            const mostRecentScore = sortedAttempts[0]?.score || 0;
            console.log('[Chapter3] Most recent quiz score:', mostRecentScore);
            setQuizScore(mostRecentScore);
          }
        } catch (error) {
          console.error('Failed to fetch quiz score:', error);
          // Fallback to null
          setQuizScore(null);
        }
      }
    };
    
    fetchQuizScore();
  }, [currentScene, quiz?.id]);

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

  // Sync completedTasks to store
  useEffect(() => {
    Object.entries(completedTasks).forEach(([taskKey, isComplete]) => {
      if (isComplete) {
        const savedTask = savedProgress?.completedTasks?.[taskKey];
        if (!savedTask) {
          chapterStore.setTaskComplete(CHAPTER_KEY, taskKey);
        }
      }
    });
  }, [completedTasks]);

  // Sync failedTasks to store
  useEffect(() => {
    Object.entries(failedTasks).forEach(([taskKey, isFailed]) => {
      if (isFailed) {
        const savedTask = savedProgress?.failedTasks?.[taskKey];
        if (!savedTask) {
          chapterStore.setTaskFailed(CHAPTER_KEY, taskKey);
        }
      }
    });
  }, [failedTasks]);

  // Sync quizAnswers to store
  useEffect(() => {
    Object.entries(quizAnswers).forEach(([questionId, answer]) => {
      const savedAnswer = savedProgress?.quizAnswers?.[questionId];
      if (savedAnswer !== answer) {
        chapterStore.setQuizAnswer(CHAPTER_KEY, questionId, answer);
      }
    });
  }, [quizAnswers]);

  // Sync earnedXP to store
  useEffect(() => {
    if (earnedXP.lesson > 0 && earnedXP.lesson !== savedProgress?.earnedXP.lesson) {
      chapterStore.setEarnedXP(CHAPTER_KEY, 'lesson', earnedXP.lesson);
    }
  }, [earnedXP.lesson]);

  useEffect(() => {
    if (earnedXP.minigame > 0 && earnedXP.minigame !== savedProgress?.earnedXP.minigame) {
      chapterStore.setEarnedXP(CHAPTER_KEY, 'minigame', earnedXP.minigame);
    }
  }, [earnedXP.minigame]);

  useEffect(() => {
    if (earnedXP.quiz > 0 && earnedXP.quiz !== savedProgress?.earnedXP.quiz) {
      chapterStore.setEarnedXP(CHAPTER_KEY, 'quiz', earnedXP.quiz);
    }
  }, [earnedXP.quiz]);

  // Track lesson progress using semantic keys
  React.useEffect(() => {
    if (currentScene === 'lesson' && messageIndex >= 0 && messageIndex < CHAPTER3_LESSON_DIALOGUE.length) {
      const currentDialogue = CHAPTER3_LESSON_DIALOGUE[messageIndex];
      
      // Skip if already processed this dialogue
      if (checkedLessonTasksRef.current.has(currentDialogue.key)) {
        return;
      }
      
      // If this dialogue has an associated task, mark it complete
      if (currentDialogue.taskId) {
        markTaskComplete(currentDialogue.taskId);
        checkedLessonTasksRef.current.add(currentDialogue.key);
        
        // Scroll to make new cards visible - only scroll when completing a row (every 2 cards in 2-column layout)
        // Cards: [angles, polygons] [polygon-def, triangle] [circle, square] [rectangle, rhombus] [parallelogram, trapezoid] [kite, pentagon] [hexagon, heptagon] [octagon, nonagon] [decagon, hendecagon] [dodecagon, summary]
        const scrollKeys = ['polygons', 'triangle', 'square', 'rhombus', 'trapezoid', 'pentagon', 'heptagon', 'nonagon', 'hendecagon', 'summary'];
        
        if (scrollKeys.includes(currentDialogue.key)) {
          setTimeout(() => {
            const lessonGrid = document.querySelector(`.${lessonStyles.lessonGrid2Col}`);
            if (lessonGrid) {
              // Calculate which row we're on (0-indexed)
              const rowIndex = scrollKeys.indexOf(currentDialogue.key);
              const totalRows = 10; // 20 cards / 2 columns = 10 rows
              const scrollRatio = Math.min((rowIndex + 1) / totalRows, 1.0);
              
              lessonGrid.scrollTo({
                top: lessonGrid.scrollHeight * scrollRatio,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }
      
      previousMessageIndexRef.current = messageIndex;
    }
  }, [currentScene, messageIndex]);

  // Handlers
  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      checkedLessonTasksRef.current = new Set();
      previousMessageIndexRef.current = 0; // Start at beginning of lesson dialogue
      resetDialogue(); // Reset dialogue BEFORE changing scene to prevent messageIndex carryover
      setCurrentScene('lesson');
      playNarration('chapter3-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= CHAPTER3_LESSON_DIALOGUE.length - 1) {
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
      if (prev[taskKey]) return prev;
      return { ...prev, [taskKey]: true };
    });
  };

  const markTaskFailed = (taskKey: string) => {
    setFailedTasks((prev) => {
      return { ...prev, [taskKey]: true };
    });
  };

  const awardXP = async (type: 'lesson' | 'minigame' | 'quiz') => {
    let xp = 0;
    if (type === 'lesson') xp = CHAPTER3_XP_VALUES.lesson;
    else if (type === 'minigame') xp = CHAPTER3_XP_VALUES.minigame;
    else if (type === 'quiz') xp = CHAPTER3_XP_VALUES.quiz1 + CHAPTER3_XP_VALUES.quiz2 + CHAPTER3_XP_VALUES.quiz3;

    setEarnedXP((prev) => {
      const updated = { ...prev, [type]: xp };
      return updated;
    });

    if (chapterId && userProfile?.id) {
      try {
        await awardLessonXP(chapterId, xp);
      } catch (error) {
        console.error('Failed to award XP:', error);
      }
    }
  };

  // Minigame completion handler
  const handleMinigameComplete = async (isCorrect: boolean) => {
    if (isCorrect) {
      // Move to next level or complete minigame
      if (currentMinigameLevel < CHAPTER3_MINIGAME_LEVELS.length - 1) {
        setCurrentMinigameLevel(currentMinigameLevel + 1);
      } else {
        // All levels complete
        markTaskComplete('task-8');
        awardXP('minigame');
        
        // Submit minigame attempt
        if (minigame && userProfile?.id) {
          try {
            await submitMinigameAttempt(minigame.id, {
              score: 100,
              time_taken: 60,
              attempt_data: { completedLevels: CHAPTER3_MINIGAME_LEVELS.length },
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

    const taskKey = `task-${8 + quizNumber}`;
    const questionIndex = quizNumber - 1;
    const question = quiz.quiz_config.questions[questionIndex];
    const userAnswer = quizAnswers[question.id];

    if (userAnswer === question.correctAnswer) {
      setQuizFeedback('correct');
      markTaskComplete(taskKey);
      
      setTimeout(() => {
        setQuizFeedback(null);
        
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
        } else {
          awardXP('quiz');
          
          try {
            console.log('[Chapter3] Submitting quiz with answers:', quizAnswers);
            console.log('[Chapter3] Quiz config:', quiz.quiz_config);
            submitQuizAttempt(quiz.id, quizAnswers);
          } catch (error) {
            console.error('Failed to submit quiz:', error);
          }
          
          try {
            completeChapter(chapterId!);
          } catch (error) {
            console.error('Failed to complete chapter:', error);
          }
          
          setCurrentScene('reward');
        }
      }, 1000);
    } else {
      setQuizFeedback('incorrect');
      markTaskFailed(taskKey);
      setQuizAttempts(quizAttempts + 1);
      
      setTimeout(() => {
        setQuizFeedback(null);
        
        if (quizNumber === 1) {
          setCurrentScene('quiz2');
          const nextQuestion = quiz.quiz_config.questions[1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            chapterStore.clearQuizAnswer(CHAPTER_KEY, nextQuestion.id);
            return updated;
          });
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3');
          const nextQuestion = quiz.quiz_config.questions[2];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            chapterStore.clearQuizAnswer(CHAPTER_KEY, nextQuestion.id);
            return updated;
          });
        } else {
          try {
            submitQuizAttempt(quiz.id, quizAnswers);
          } catch (error) {
            console.error('Failed to submit quiz:', error);
          }
          
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
    
    setCompletedTasks((prev) => {
      const updated = { ...prev };
      delete updated['task-9'];
      delete updated['task-10'];
      delete updated['task-11'];
      return updated;
    });
    
    setCurrentScene('quiz1');
  };

  const handleRetakeLesson = () => {
    // Reset lesson-related state
    checkedLessonTasksRef.current = new Set();
    previousMessageIndexRef.current = 0;
    
    // Clear lesson tasks from completed tasks
    setCompletedTasks((prev) => {
      const updated = { ...prev };
      delete updated['task-0'];
      delete updated['task-1'];
      delete updated['task-2'];
      delete updated['task-3'];
      delete updated['task-4'];
      delete updated['task-5'];
      delete updated['task-6'];
      delete updated['task-7'];
      return updated;
    });
    
    // Go back to lesson scene
    setCurrentScene('lesson');
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
    previousMessageIndexRef.current = 0; // Start at beginning of lesson dialogue
    
    // Reset dialogue
    resetDialogue();
  };

  const handleExit = () => {
    router.push('/student/worldmap/castle1');
  };

  // Loading and error states
  if (authLoading || loading) {
    return (
      <div className={baseStyles.loading_container}>
        <p>Loading Chapter 3...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={baseStyles.loading_container}>
        <p>Error: {error}</p>
        <button onClick={handleExit}>Return to Castle</button>
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
          chapterTitle="Chapter 3: Shapes of the Spire"
          currentScene={savedProgress?.currentScene || 'opening'}
          onContinue={handleContinueProgress}
          onRestart={handleRestartChapter}
          onDontShowAgain={handleDontShowAgain}
        />
      )}

      {/* Top Bar */}
      <ChapterTopBar
        chapterTitle="Chapter 3: Shapes of the Spire"
        chapterSubtitle="Castle 1 - Euclidean Spire Quest"
        isMuted={isMuted}
        autoAdvance={autoAdvanceEnabled}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleAutoAdvance={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
        onExit={handleExit}
        styleModule={baseStyles}
      />

      {/* Main Content */}
      <div className={baseStyles.mainContent}>
        {/* Task Panel */}
        <ChapterTaskPanel
          tasks={CHAPTER3_LEARNING_OBJECTIVES}
          completedTasks={completedTasks}
          failedTasks={failedTasks}
          styleModule={baseStyles}
        />

        {/* Game Area */}
        <div className={baseStyles.gameArea}>
          {/* Opening Scene */}
          {currentScene === 'opening' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ color: '#FFD700', fontSize: '2rem' }}>Welcome to the Shape Summoner!</h2>
              <p style={{ color: '#E8F4FD', fontSize: '1.2rem', marginTop: '1rem' }}>
                Click the dialogue box to begin your journey...
              </p>
            </div>
          )}

          {/* Lesson Scene - Using LessonGrid and ConceptCard */}
          {currentScene === 'lesson' && (
            <LessonGrid columns={2} gap="medium" styleModule={lessonStyles}>
              {CHAPTER3_CONCEPTS.map((concept, index) => {
                // Find the dialogue index for this concept to determine if it should be highlighted
                const dialogueIndex = CHAPTER3_LESSON_DIALOGUE.findIndex(d => d.key === concept.key);
                const isHighlighted = dialogueIndex !== -1 && messageIndex >= dialogueIndex;
                
                return (
                  <ConceptCard
                    key={`${concept.key}-${index}`}
                    title={concept.title}
                    description={concept.description}
                    icon={<Image src={concept.image} alt={concept.title} width={180} height={120} />}
                    highlighted={isHighlighted}
                    styleModule={lessonStyles}
                  />
                );
              })}
            </LessonGrid>
          )}

          {/* Minigame Scene */}
          {currentScene === 'minigame' && messageIndex >= CHAPTER3_MINIGAME_DIALOGUE.length - 1 && (
            <ShapeBasedMinigame
              question={CHAPTER3_MINIGAME_LEVELS[currentMinigameLevel]}
              onComplete={handleMinigameComplete}
              styleModule={minigameStyles}
            />
          )}

          {/* Quiz Scenes */}
          {(currentScene === 'quiz1' || currentScene === 'quiz2' || currentScene === 'quiz3') && quiz && (
            <div className={minigameStyles.minigameContainer}>
              {quiz.quiz_config.questions && quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2] && (
                <>
                  <div className={minigameStyles.questionText}>
                    {quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].question}
                  </div>
                  
                  <div className={minigameStyles.answerOptions}>
                    {quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].options.map((option: string) => {
                      const currentQuestion = quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2];
                      const questionId = currentQuestion.id;
                      return (
                        <div
                          key={option}
                          className={`${minigameStyles.answerOption} ${
                            quizFeedback && quizAnswers[questionId] === option
                              ? quizFeedback === 'correct'
                                ? minigameStyles.answerOptionCorrect
                                : minigameStyles.answerOptionIncorrect
                              : quizAnswers[questionId] === option
                              ? minigameStyles.answerOptionSelected
                              : ''
                          }`}
                          onClick={() => handleQuizAnswer(questionId, option, currentQuestion.correctAnswer)}
                        >
                          {option}
                        </div>
                      );
                    })}
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
                </>
              )}
            </div>
          )}

          {/* Reward Scene */}
          {currentScene === 'reward' && (
            <ChapterRewardScreen
              relicName="Shape Summoner Crystal"
              relicImage="/images/relics/shape-crystal.png"
              relicDescription="You have mastered the geometric shapes! The Shape Summoner Crystal allows you to summon and manipulate shapes at will."
              earnedXP={earnedXP}
              quizScore={quizScore}
              canRetakeQuiz={true}
              onRetakeQuiz={handleRetakeQuiz}
              onRetakeLesson={handleRetakeLesson}
              onComplete={handleExit}
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
  
  // Helper function for quiz answer selection
  function handleQuizAnswer(questionId: string, answer: string, correctAnswer: string) {
    if (quizFeedback !== null) return; // Don't allow answer changes after submission
    
    setQuizAnswers((prev) => {
      const updated = { ...prev, [questionId]: answer };
      return updated;
    });
  }
}
