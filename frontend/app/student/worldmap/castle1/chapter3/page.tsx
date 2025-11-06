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
    chapterStore.initializeChapter(CHAPTER_KEY);
    
    // Check if user has disabled this modal for this chapter
    const dontShowAgain = localStorage.getItem(`${CHAPTER_KEY}-dont-show-modal`);
    
    // Check if there's saved progress and it's not at the start
    if (!hasCheckedProgress && savedProgress && savedProgress.currentScene !== 'opening' && dontShowAgain !== 'true') {
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
  
  // Track which lesson tasks have been checked
  const checkedLessonTasksRef = useRef<Set<number>>(new Set());
  const previousMessageIndexRef = useRef<number>(-1);
  
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
             currentScene === 'lesson' ? CHAPTER3_LESSON_DIALOGUE : 
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

  // Track lesson progress (7 lesson messages: indices 0-6, tasks 0-5)
  // Message index 1 completes task-0, index 2 completes task-1, etc.
  React.useEffect(() => {
    if (currentScene === 'lesson' && messageIndex >= 1 && messageIndex <= 6) {
      const taskIndex = messageIndex - 1; // Convert message index to task index
      
      if (previousMessageIndexRef.current > messageIndex) {
        previousMessageIndexRef.current = 0; // Reset to start of lesson (not -1)
      }
      
      if (checkedLessonTasksRef.current.has(taskIndex)) {
        previousMessageIndexRef.current = messageIndex;
        return;
      }
      
      const isValidFirstMessage = previousMessageIndexRef.current === 0 && messageIndex === 1;
      const isSequentialProgression = messageIndex === previousMessageIndexRef.current + 1;
      
      if (isValidFirstMessage || isSequentialProgression) {
        markTaskComplete(`task-${taskIndex}`);
        checkedLessonTasksRef.current.add(taskIndex);
      }
      
      previousMessageIndexRef.current = messageIndex;
    }
  }, [currentScene, messageIndex]);

  // Handlers
  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      checkedLessonTasksRef.current = new Set();
      previousMessageIndexRef.current = 0; // Start at beginning of lesson dialogue
      setCurrentScene('lesson');
      playNarration('chapter3-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= CHAPTER3_LESSON_DIALOGUE.length - 1) {
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
        markTaskComplete('task-6');
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

    const taskKey = `task-${6 + quizNumber}`;
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
      delete updated['task-7'];
      delete updated['task-8'];
      delete updated['task-9'];
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
            <LessonGrid columns={3} gap="medium" styleModule={lessonStyles}>
              {/* Basic Shapes */}
              <ConceptCard
                title="Triangle"
                description="A polygon with three sides and three angles."
                icon={<Image src="/images/castle1/chapter3/triangle.png" alt="Triangle" width={180} height={120} />}
                highlighted={messageIndex >= 1}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Circle"
                description="A perfectly round shape where all points are equidistant from the center."
                icon={<Image src="/images/castle1/chapter3/circle.png" alt="Circle" width={180} height={120} />}
                highlighted={messageIndex >= 1}
                styleModule={lessonStyles}
              />
              
              {/* Quadrilaterals Part 1 */}
              <ConceptCard
                title="Square"
                description="A quadrilateral with four equal sides and four right angles."
                icon={<Image src="/images/castle1/chapter3/square.png" alt="Square" width={180} height={120} />}
                highlighted={messageIndex >= 2}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Rectangle"
                description="A quadrilateral with opposite sides equal and four right angles."
                icon={<Image src="/images/castle1/chapter3/rectangle.png" alt="Rectangle" width={180} height={120} />}
                highlighted={messageIndex >= 2}
                styleModule={lessonStyles}
              />
              
              {/* Quadrilaterals Part 2 */}
              <ConceptCard
                title="Rhombus"
                description="A quadrilateral with all four sides of equal length."
                icon={<Image src="/images/castle1/chapter3/rhombus.png" alt="Rhombus" width={180} height={120} />}
                highlighted={messageIndex >= 3}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Parallelogram"
                description="A quadrilateral with opposite sides parallel and equal in length."
                icon={<Image src="/images/castle1/chapter3/parallelogram.png" alt="Parallelogram" width={180} height={120} />}
                highlighted={messageIndex >= 3}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Trapezoid"
                description="A quadrilateral with at least one pair of parallel sides."
                icon={<Image src="/images/castle1/chapter3/trapezoid.png" alt="Trapezoid" width={180} height={120} />}
                highlighted={messageIndex >= 3}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Kite"
                description="A quadrilateral with two pairs of adjacent sides equal."
                icon={<Image src="/images/castle1/chapter3/kite.png" alt="Kite" width={180} height={120} />}
                highlighted={messageIndex >= 3}
                styleModule={lessonStyles}
              />
              
              {/* Pentagon to Octagon */}
              <ConceptCard
                title="Pentagon"
                description="A polygon with five sides and five angles."
                icon={<Image src="/images/castle1/chapter3/pentagon.png" alt="Pentagon" width={180} height={120} />}
                highlighted={messageIndex >= 4}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Hexagon"
                description="A polygon with six sides and six angles."
                icon={<Image src="/images/castle1/chapter3/hexagon.png" alt="Hexagon" width={180} height={120} />}
                highlighted={messageIndex >= 4}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Heptagon"
                description="A polygon with seven sides and seven angles."
                icon={<Image src="/images/castle1/chapter3/heptagon.png" alt="Heptagon" width={180} height={120} />}
                highlighted={messageIndex >= 4}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Octagon"
                description="A polygon with eight sides and eight angles."
                icon={<Image src="/images/castle1/chapter3/octagon.png" alt="Octagon" width={180} height={120} />}
                highlighted={messageIndex >= 4}
                styleModule={lessonStyles}
              />
              
              {/* Nonagon to Dodecagon */}
              <ConceptCard
                title="Nonagon"
                description="A polygon with nine sides and nine angles."
                icon={<Image src="/images/castle1/chapter3/nonagon.png" alt="Nonagon" width={180} height={120} />}
                highlighted={messageIndex >= 5}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Decagon"
                description="A polygon with ten sides and ten angles."
                icon={<Image src="/images/castle1/chapter3/decagon.png" alt="Decagon" width={180} height={120} />}
                highlighted={messageIndex >= 5}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Hendecagon"
                description="A polygon with eleven sides and eleven angles."
                icon={<Image src="/images/castle1/chapter3/hendecagon.png" alt="Hendecagon" width={180} height={120} />}
                highlighted={messageIndex >= 5}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Dodecagon"
                description="A polygon with twelve sides and twelve angles."
                icon={<Image src="/images/castle1/chapter3/dodecagon.png" alt="Dodecagon" width={180} height={120} />}
                highlighted={messageIndex >= 5}
                styleModule={lessonStyles}
              />
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
