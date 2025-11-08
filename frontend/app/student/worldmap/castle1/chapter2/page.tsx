'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { LineBasedMinigame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid } from '@/components/chapters/lessons';
import ChapterProgressModal from '@/components/chapters/ChapterProgressModal';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import {
  CHAPTER2_CASTLE_ID,
  CHAPTER2_NUMBER,
  CHAPTER2_OPENING_DIALOGUE,
  CHAPTER2_LESSON_DIALOGUE,
  CHAPTER2_MINIGAME_DIALOGUE,
  CHAPTER2_LEARNING_OBJECTIVES,
  CHAPTER2_XP_VALUES,
  CHAPTER2_MINIGAME_LEVELS,
  CHAPTER2_CONCEPTS,
} from '@/constants/chapters/castle1/chapter2';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { submitQuizAttempt, getUserQuizAttempts } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import { useChapterStore } from '@/store/chapterStore';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward';

const CHAPTER_KEY = 'castle1-chapter2';

export default function Chapter2Page() {
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
      const lessonTasks = ['task-0', 'task-1', 'task-2', 'task-3', 'task-4'];
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
  
  const [currentScene, setCurrentScene] = useState<SceneType>(
    (savedProgress?.currentScene as SceneType) || 'opening'
  );
  const [isMuted, setIsMuted] = useState(savedProgress?.isMuted || false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(savedProgress?.autoAdvanceEnabled || false);
  const [currentMinigameQuestion, setCurrentMinigameQuestion] = useState(savedProgress?.currentMinigameLevel || 0);
  
  // Track minigame score
  const minigameScoreRef = React.useRef<number>(0);
  
  const checkedLessonTasksRef = React.useRef<Set<string>>(new Set());
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
    return filtered;
  });
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>(
    savedProgress?.failedTasks || {}
  );
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(
    savedProgress?.quizAnswers || {}
  );
  const [quizAttempts, setQuizAttempts] = useState(savedProgress?.quizAttempts || 0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const [earnedXP, setEarnedXP] = useState({
    lesson: savedProgress?.earnedXP.lesson || 0,
    minigame: savedProgress?.earnedXP.minigame || 0,
    quiz: savedProgress?.earnedXP.quiz || 0,
  });

  // Quiz score tracking
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const { chapterId, quiz, minigame, loading, error, authLoading, userProfile } = useChapterData({
    castleId: CHAPTER2_CASTLE_ID,
    chapterNumber: CHAPTER2_NUMBER,
  });

  const {
    displayedText,
    isTyping,
    messageIndex,
    handleDialogueClick,
    handleNextMessage,
    resetDialogue,
  } = useChapterDialogue({
    dialogue: currentScene === 'opening' ? CHAPTER2_OPENING_DIALOGUE : 
             currentScene === 'lesson' ? CHAPTER2_LESSON_DIALOGUE.map(d => d.text) : 
             CHAPTER2_MINIGAME_DIALOGUE,
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
    chapterStore.setMinigameLevel(CHAPTER_KEY, currentMinigameQuestion);
  }, [currentMinigameQuestion]);

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
          console.log('[Chapter2] Fetched quiz attempts:', attempts);
          
          if (attempts && attempts.length > 0) {
            // Get the most recent attempt (assuming attempts are ordered by creation date)
            const sortedAttempts = attempts.sort((a: any, b: any) => {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            const mostRecentScore = sortedAttempts[0]?.score || 0;
            console.log('[Chapter2] Most recent quiz score:', mostRecentScore);
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

  // Track lesson progress using semantic keys
  React.useEffect(() => {
    if (currentScene === 'lesson' && messageIndex >= 0 && messageIndex < CHAPTER2_LESSON_DIALOGUE.length) {
      const currentDialogue = CHAPTER2_LESSON_DIALOGUE[messageIndex];
      
      // Skip if already processed this dialogue
      if (checkedLessonTasksRef.current.has(currentDialogue.key)) {
        return;
      }
      
      // If this dialogue has an associated task, mark it complete
      if (currentDialogue.taskId) {
        markTaskComplete(currentDialogue.taskId);
        checkedLessonTasksRef.current.add(currentDialogue.key);
        
        // Scroll to make the Skew Lines card visible when it's unlocked
        if (currentDialogue.key === 'skew') {
          setTimeout(() => {
            const lessonGrid = document.querySelector(`.${lessonStyles.lessonGrid2Col}`);
            if (lessonGrid) {
              lessonGrid.scrollTo({
                top: lessonGrid.scrollHeight,
                behavior: 'smooth'
              });
            }
          }, 100);
        }
      }
    }
  }, [currentScene, messageIndex]);

  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      checkedLessonTasksRef.current = new Set();
      previousMessageIndexRef.current = -1;
      resetDialogue(); // Reset dialogue BEFORE changing scene to prevent messageIndex carryover
      setCurrentScene('lesson');
      playNarration('chapter2-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= CHAPTER2_LESSON_DIALOGUE.length - 1) {
      awardXP('lesson');
      resetDialogue(); // Reset dialogue BEFORE changing scene
      setCurrentScene('minigame');
    }
  }

  // Reset dialogue when scene changes (backup, in case direct calls are missed)
  React.useEffect(() => {
    resetDialogue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene]);

  const markTaskComplete = (taskKey: string) => {
    setCompletedTasks((prev) => {
      if (prev[taskKey]) return prev;
      return { ...prev, [taskKey]: true };
    });
  };

  const markTaskFailed = (taskKey: string) => {
    setFailedTasks((prev) => ({ ...prev, [taskKey]: true }));
  };

  const awardXP = async (type: 'lesson' | 'minigame' | 'quiz') => {
    let xp = 0;
    if (type === 'lesson') xp = CHAPTER2_XP_VALUES.lesson;
    else if (type === 'minigame') xp = CHAPTER2_XP_VALUES.minigame;
    else if (type === 'quiz') xp = CHAPTER2_XP_VALUES.quiz1 + CHAPTER2_XP_VALUES.quiz2 + CHAPTER2_XP_VALUES.quiz3;

    setEarnedXP((prev) => ({ ...prev, [type]: xp }));

    if (chapterId && userProfile?.id) {
      try {
        await awardLessonXP(chapterId, xp);
      } catch (error) {
        console.error('Failed to award XP:', error);
      }
    }
  };

  const handleMinigameComplete = async (isCorrect: boolean) => {
    console.log(`[Chapter2] Question ${currentMinigameQuestion + 1}/${CHAPTER2_MINIGAME_LEVELS.length} - Correct: ${isCorrect}, Current Score: ${minigameScoreRef.current}`);
    
    if (isCorrect) {
      // Award points based on correctness
      const pointsPerQuestion = 100 / CHAPTER2_MINIGAME_LEVELS.length; // Distribute 100 points across all questions
      minigameScoreRef.current += pointsPerQuestion;
      console.log(`[Chapter2] Points awarded: ${pointsPerQuestion}, New Score: ${minigameScoreRef.current}`);
      
      // Move to next question or complete minigame
      if (currentMinigameQuestion < CHAPTER2_MINIGAME_LEVELS.length - 1) {
        setCurrentMinigameQuestion(currentMinigameQuestion + 1);
      } else {
        // All questions answered correctly
        markTaskComplete('task-5');
        awardXP('minigame');
        
        if (minigame && userProfile?.id) {
          try {
            const finalScore = Math.round(minigameScoreRef.current);
            console.log(`[Chapter2] ALL QUESTIONS COMPLETED - Final Score: ${finalScore}`);
            console.log(`[Chapter2] Submitting to backend:`, {
              minigame_id: minigame.id,
              score: finalScore,
              completed: finalScore >= 100,
              expected_xp: finalScore >= 100 ? 45 : 0
            });
            
            await submitMinigameAttempt(minigame.id, {
              score: finalScore,
              time_taken: 60,
              attempt_data: { completedQuestions: CHAPTER2_MINIGAME_LEVELS.length },
            });
          } catch (error) {
            console.error('Failed to submit minigame:', error);
          }
        }
        
        setCurrentScene('quiz1');
      }
    } else {
      // Incorrect answer - user can try again (no progression)
      console.log(`[Chapter2] Incorrect answer - user can retry the same question`);
    }
  };

  const handleQuizSubmit = async (quizNumber: 1 | 2 | 3) => {
    if (!quiz || !userProfile?.id) return;

    const taskKey = quizNumber === 1 ? 'task-6' : quizNumber === 2 ? 'task-7' : 'task-8';
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
      delete updated['task-6'];
      delete updated['task-7'];
      delete updated['task-8'];
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
    setCurrentMinigameQuestion(0);
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

  if (authLoading || loading) {
    return (
      <div className={baseStyles.loading_container}>
        <p>Loading Chapter 2...</p>
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

  return (
    <div className={`${baseStyles.chapterContainer} ${baseStyles.castle1Theme}`}>
      <div className={baseStyles.backgroundOverlay}></div>

      {/* Progress Modal */}
      {showProgressModal && (
        <ChapterProgressModal
          chapterTitle="Chapter 2: The Paths of Power"
          currentScene={savedProgress?.currentScene || 'opening'}
          onContinue={handleContinueProgress}
          onRestart={handleRestartChapter}
          onDontShowAgain={handleDontShowAgain}
        />
      )}

      <ChapterTopBar
        chapterTitle="Chapter 2: The Paths of Power"
        chapterSubtitle="Castle 1 - Euclidean Spire Quest"
        isMuted={isMuted}
        autoAdvance={autoAdvanceEnabled}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleAutoAdvance={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
        onExit={handleReturnToCastle}
        styleModule={baseStyles}
      />

      <div className={baseStyles.mainContent}>
        <ChapterTaskPanel
          tasks={CHAPTER2_LEARNING_OBJECTIVES}
          completedTasks={completedTasks}
          failedTasks={failedTasks}
          styleModule={baseStyles}
        />

        <div className={baseStyles.gameArea}>
          {currentScene === 'opening' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ color: '#FFD700', fontSize: '2rem' }}>The Paths of Power Await!</h2>
              <p style={{ color: '#E8F4FD', fontSize: '1.2rem', marginTop: '1rem' }}>
                Click the dialogue box to continue your journey...
              </p>
            </div>
          )}

          {currentScene === 'lesson' && (
            <LessonGrid columns={2} gap="medium" styleModule={lessonStyles}>
              {CHAPTER2_CONCEPTS.map((concept, index) => {
                // Find the dialogue index for this concept to determine if it should be highlighted
                const dialogueIndex = CHAPTER2_LESSON_DIALOGUE.findIndex(d => d.key === concept.key);
                const isHighlighted = dialogueIndex !== -1 && messageIndex >= dialogueIndex;
                
                return (
                  <ConceptCard
                    key={`${concept.key}-${index}`}
                    title={concept.title}
                    description={concept.description}
                    imageSrc={concept.image}
                    highlighted={isHighlighted}
                    styleModule={lessonStyles}
                  />
                );
              })}
            </LessonGrid>
          )}

          {currentScene === 'minigame' && CHAPTER2_MINIGAME_LEVELS[currentMinigameQuestion] && (
            <LineBasedMinigame
              question={CHAPTER2_MINIGAME_LEVELS[currentMinigameQuestion]}
              onComplete={handleMinigameComplete}
              styleModule={minigameStyles}
            />
          )}

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
                {quizFeedback === 'correct' ? ' Correct!' : quizFeedback === 'incorrect' ? ' Incorrect' : 'Submit Answer'}
              </button>
            </div>
          )}

          {currentScene === 'reward' && (
            <ChapterRewardScreen
              relicName="Mirror of Reflection"
              relicImage="/images/relics/mirror-reflection.png"
              relicDescription="You have uncovered the paths of power! The lines of geometry bend to your understanding."
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
