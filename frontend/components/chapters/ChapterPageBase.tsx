// ============================================================================
// REUSABLE CHAPTER PAGE BASE COMPONENT
// ============================================================================
// This component contains all the shared logic for chapter pages.
// Individual chapter pages import this and pass their configuration.
// ============================================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { ConceptCard, LessonGrid } from '@/components/chapters/lessons';
import ChapterRestartModal from '@/components/chapters/ChapterRestartModal';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { cacheControl } from '@/api/axios';
import { submitQuizAttempt, getUserQuizAttempts } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import { useChapterStore } from '@/store/chapterStore';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz' | 'reward';

// ============================================================================
// Configuration Interface
// ============================================================================
export interface ChapterConfig {
  // Chapter identity
  chapterKey: string;              // e.g., 'castle1-chapter1'
  castleId: string;                // From constants (UUID string)
  chapterNumber: number;           // From constants (chapter number)
  
  // Task IDs
  lessonTaskIds: string[];         // e.g., ['task-0', 'task-1', 'task-2', 'task-3']
  minigameTaskId: string;          // e.g., 'task-4'
  quizTaskIds: Record<string, string>;  // e.g., { quiz1: 'task-5', quiz2: 'task-6', quiz3: 'task-7' }
  
  // Content from constants
  dialogue: Array<{
    scene: 'opening' | 'lesson' | 'minigame';
    text: string;
    key?: string;
    taskId?: string;
  }>;
  sceneRanges: {
    opening: { start: number; end: number };
    lesson: { start: number; end: number };
    minigame: { start: number; end: number };
  };
  minigameLevels: any[];
  learningObjectives: any[];
  xpValues: Record<string, number>;  // e.g., { lesson: 30, minigame: 45, quiz1: 20, quiz2: 25, quiz3: 30 }
  concepts: any[];
  
  // Display info
  title: string;
  subtitle: string;
  castleName: string;
  castleTheme: 'castle1Theme' | 'castle2Theme' | 'castle3Theme' | 'castle4Theme' | 'castle5Theme';
  welcomeMessage: string;
  castleRoute: string;
  
  wizard: {
    name: string;
    image: string;
  };
  
  relic: {
    name: string;
    image: string;
    description: string;
  };
  
  narration: {
    opening: string[];
    lesson: string[];
    minigame: string[];
  };
  logPrefix: string;
  
  // Minigame component
  MinigameComponent: React.ComponentType<{
    question: any;
    onComplete: (isCorrect: boolean) => void;
    styleModule: any;
  }>;
}

// ============================================================================
// Base Chapter Component
// ============================================================================
function ChapterPageBase({ config }: { config: ChapterConfig }) {
  const router = useRouter();
  
  // Zustand store
  const chapterStore = useChapterStore();
  const savedProgress = chapterStore.getChapterProgress(config.chapterKey);
  
  // Restart modal state
  const [showRestartModal, setShowRestartModal] = useState(false);
  
  // Initialize chapter in store if not exists
  useEffect(() => {
    chapterStore.initializeChapter(config.chapterKey);
  }, [config.chapterKey]);
  
  // Scene and state management - initialize from store or defaults
  const getInitialScene = (): SceneType => {
    const saved = savedProgress?.currentScene as SceneType | undefined;

    if (saved === 'reward') return 'reward';
    if (typeof saved === 'string' && saved.startsWith('quiz')) return saved;
    if (saved === 'minigame') return 'minigame';

    const savedIndex = savedProgress?.messageIndex || 0;
    const dialogue = config.dialogue[savedIndex];
    if (dialogue && (dialogue.scene === 'opening' || dialogue.scene === 'lesson' || dialogue.scene === 'minigame')) {
      return dialogue.scene;
    }
    return 'opening';
  };
  
  const [currentScene, setCurrentScene] = useState<SceneType>(getInitialScene());
  const [isMuted, setIsMuted] = useState(savedProgress?.isMuted || false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(savedProgress?.autoAdvanceEnabled || false);
  const [currentMinigameLevel, setCurrentMinigameLevel] = useState(savedProgress?.currentMinigameLevel || 0);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(savedProgress?.currentQuizIndex || 0);
  
  // Track which lesson tasks have been checked
  const getInitialCheckedTasks = (): Set<string> => {
    const saved = savedProgress?.completedTasks || {};
    const keys = new Set<string>();
    
    Object.keys(saved).forEach(taskId => {
      if (saved[taskId]) {
        const dialogue = config.dialogue.find(d => d.taskId === taskId);
        if (dialogue && dialogue.key) {
          keys.add(dialogue.key);
        }
      }
    });
    
    return keys;
  };
  
  const checkedLessonTasksRef = React.useRef<Set<string>>(getInitialCheckedTasks());
  
  // Task tracking
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    savedProgress?.completedTasks || {}
  );
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>(
    savedProgress?.failedTasks || {}
  );
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(
    savedProgress?.quizAnswers || {}
  );
  const [quizAttempts, setQuizAttempts] = useState(savedProgress?.quizAttempts || 0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // XP tracking
  const getInitialXP = () => {
    if (savedProgress?.earnedXP) {
      console.log(`${config.logPrefix} Loading saved XP from store:`, savedProgress.earnedXP);
      return {
        lesson: savedProgress.earnedXP.lesson || 0,
        minigame: savedProgress.earnedXP.minigame || 0,
        quiz: savedProgress.earnedXP.quiz || 0,
      };
    }
    
    const tasks = savedProgress?.completedTasks || {};
    console.log(`${config.logPrefix} No saved XP, reconstructing from tasks:`, tasks);
    
    const hasCompletedLesson = config.lessonTaskIds.some(taskId => tasks[taskId]);
    const hasCompletedMinigame = tasks[config.minigameTaskId];
    const hasCompletedQuiz = Object.values(config.quizTaskIds).some(taskId => tasks[taskId]);
    
    const reconstructedXP = {
      lesson: hasCompletedLesson ? config.xpValues.lesson : 0,
      minigame: hasCompletedMinigame ? config.xpValues.minigame : 0,
      quiz: hasCompletedQuiz ? Object.keys(config.quizTaskIds).reduce((sum, key) => sum + (config.xpValues[key] || 0), 0) : 0,
    };
    
    console.log(`${config.logPrefix} Reconstructed XP:`, reconstructedXP);
    return reconstructedXP;
  };
  
  const [earnedXP, setEarnedXP] = useState(getInitialXP());
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizScoreKey, setQuizScoreKey] = useState(0);

  // Custom hooks
  const { chapterId, quiz, minigame, loading, error, authLoading, userProfile } = useChapterData({
    castleId: config.castleId,
    chapterNumber: config.chapterNumber,
    castleRoute: config.castleRoute,
  });

  const {
    displayedText,
    isTyping,
    messageIndex,
    handleDialogueClick,
    handleNextMessage,
    resetDialogue,
  } = useChapterDialogue({
    dialogue: config.dialogue.map(d => d.text),
    autoAdvance: autoAdvanceEnabled,
    autoAdvanceDelay: 3000,
    typingSpeed: 30,
    onDialogueComplete: handleDialogueComplete,
    initialMessageIndex: savedProgress?.messageIndex || 0,
    onMessageIndexChange: (index: number) => {
      chapterStore.setMessageIndex(config.chapterKey, index);
    },
  });

  const { playNarration, stopAudio } = useChapterAudio({ isMuted });

  // Sync state changes to store
  useEffect(() => {
    chapterStore.setScene(config.chapterKey, currentScene);
    try {
      localStorage.setItem(`chapter:lastScene:${config.chapterKey}`, currentScene);
    } catch {}
  }, [currentScene, config.chapterKey]);

  useEffect(() => {
    chapterStore.setMinigameLevel(config.chapterKey, currentMinigameLevel);
    try {
      localStorage.setItem(`chapter:lastMinigameLevel:${config.chapterKey}`, String(currentMinigameLevel));
    } catch {}
  }, [currentMinigameLevel, config.chapterKey]);

  useEffect(() => {
    chapterStore.setQuizIndex(config.chapterKey, currentQuizIndex);
  }, [currentQuizIndex, config.chapterKey]);

  useEffect(() => {
    chapterStore.setAudioSettings(config.chapterKey, isMuted, autoAdvanceEnabled);
  }, [isMuted, autoAdvanceEnabled, config.chapterKey]);

  useEffect(() => {
    Object.entries(completedTasks).forEach(([taskId, completed]) => {
      if (completed) {
        const savedProgress = chapterStore.getChapterProgress(config.chapterKey);
        if (!savedProgress?.completedTasks[taskId]) {
          chapterStore.setTaskComplete(config.chapterKey, taskId);
        }
      }
    });
  }, [completedTasks, config.chapterKey]);

  useEffect(() => {
    Object.entries(failedTasks).forEach(([taskId, failed]) => {
      if (failed) {
        const savedProgress = chapterStore.getChapterProgress(config.chapterKey);
        if (!savedProgress?.failedTasks[taskId]) {
          chapterStore.setTaskFailed(config.chapterKey, taskId);
        }
      }
    });
  }, [failedTasks, config.chapterKey]);

  useEffect(() => {
    Object.entries(quizAnswers).forEach(([questionId, answer]) => {
      const savedProgress = chapterStore.getChapterProgress(config.chapterKey);
      if (savedProgress?.quizAnswers[questionId] !== answer) {
        chapterStore.setQuizAnswer(config.chapterKey, questionId, answer);
      }
    });
  }, [quizAnswers, config.chapterKey]);

  useEffect(() => {
    if (earnedXP.lesson > 0) {
      chapterStore.setEarnedXP(config.chapterKey, 'lesson', earnedXP.lesson);
    }
    if (earnedXP.minigame > 0) {
      chapterStore.setEarnedXP(config.chapterKey, 'minigame', earnedXP.minigame);
    }
    if (earnedXP.quiz > 0) {
      chapterStore.setEarnedXP(config.chapterKey, 'quiz', earnedXP.quiz);
    }
  }, [earnedXP, config.chapterKey]);

  // Fetch quiz score when entering reward scene
  useEffect(() => {
    const fetchQuizScore = async () => {
      if (currentScene === 'reward' && quiz?.id) {
        try {
          // Longer delay to ensure backend has processed the submission
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const response = await getUserQuizAttempts(quiz.id);
          console.log(`${config.logPrefix} Raw quiz attempts response:`, response);
          
          // Handle both direct array and data wrapper
          const attempts = Array.isArray(response) ? response : response?.data || [];
          console.log(`${config.logPrefix} Parsed quiz attempts:`, attempts);
          
          if (attempts && attempts.length > 0) {
            const sortedAttempts = attempts.sort((a: any, b: any) => {
              return new Date(b.createdAt || b.created_at).getTime() - new Date(a.createdAt || a.created_at).getTime();
            });
            const mostRecentScore = sortedAttempts[0]?.score || 0;
            console.log(`${config.logPrefix} Most recent quiz score:`, mostRecentScore);
            console.log(`${config.logPrefix} Setting quizScore state to:`, mostRecentScore);
            setQuizScore(mostRecentScore);
          } else {
            console.log(`${config.logPrefix} No quiz attempts found`);
            // Calculate score from completed tasks as fallback
            const totalQuestions = Object.keys(config.quizTaskIds).length;
            const correctAnswers = Object.values(config.quizTaskIds).filter(taskId => completedTasks[taskId]).length;
            const calculatedScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
            console.log(`${config.logPrefix} Calculated score from tasks: ${correctAnswers}/${totalQuestions} = ${calculatedScore}%`);
            setQuizScore(calculatedScore);
          }
        } catch (error) {
          console.error(`${config.logPrefix} Failed to fetch quiz score:`, error);
          // Calculate score from completed tasks as fallback
          const totalQuestions = Object.keys(config.quizTaskIds).length;
          const correctAnswers = Object.values(config.quizTaskIds).filter(taskId => completedTasks[taskId]).length;
          const calculatedScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
          console.log(`${config.logPrefix} Error fallback - calculated score: ${calculatedScore}%`);
          setQuizScore(calculatedScore);
        }
      }
    };
    
    fetchQuizScore();
  }, [currentScene, quiz?.id, quizScoreKey, config.logPrefix, config.quizTaskIds, completedTasks]);

  // Auto-update scene based on messageIndex
  const hasInitializedSceneRef = React.useRef(false);
  
  useEffect(() => {
    if (!hasInitializedSceneRef.current) {
      hasInitializedSceneRef.current = true;
      return;
    }
    
    if (currentScene === 'reward' || currentScene.startsWith('quiz')) {
      return;
    }
    
    const currentDialogue = config.dialogue[messageIndex];
    if (currentDialogue) {
      const newScene = currentDialogue.scene;
      if (newScene === 'opening' || newScene === 'lesson' || newScene === 'minigame') {
        if (currentScene !== newScene) {
          setCurrentScene(newScene);
        }
      }
    }
  }, [messageIndex, currentScene, config.dialogue]);

  // Track lesson progress
  React.useEffect(() => {
    if (messageIndex >= 0 && messageIndex < config.dialogue.length) {
      const currentDialogue = config.dialogue[messageIndex];
      
      if (currentDialogue.key && checkedLessonTasksRef.current.has(currentDialogue.key)) {
        return;
      }
      
      if (currentDialogue.taskId) {
        markTaskComplete(currentDialogue.taskId);
        if (currentDialogue.key) {
          checkedLessonTasksRef.current.add(currentDialogue.key);
        }
      }
    }
  }, [messageIndex, config.dialogue]);
  
  // Play narration audio for each dialogue message
  React.useEffect(() => {
    if (messageIndex < 0 || messageIndex >= config.dialogue.length) return;
    
    const currentDialogue = config.dialogue[messageIndex];
    const scene = currentDialogue.scene;
    
    // Determine the narration array and index within that scene
    let narrationArray: string[] = [];
    let sceneIndex = 0;
    
    if (scene === 'opening') {
      narrationArray = config.narration.opening;
      sceneIndex = messageIndex - config.sceneRanges.opening.start;
    } else if (scene === 'lesson') {
      narrationArray = config.narration.lesson;
      sceneIndex = messageIndex - config.sceneRanges.lesson.start;
    } else if (scene === 'minigame') {
      narrationArray = config.narration.minigame;
      sceneIndex = messageIndex - config.sceneRanges.minigame.start;
    }
    
    // Play audio if path exists for this index
    if (narrationArray[sceneIndex]) {
      playNarration(narrationArray[sceneIndex]);
    }
  }, [messageIndex, config.dialogue, config.narration, config.sceneRanges, playNarration]);
  
  // Award XP when crossing scene boundaries
  React.useEffect(() => {
    if (messageIndex === config.sceneRanges.lesson.end + 1) {
      console.log(`${config.logPrefix} Lesson complete! Awarding lesson XP`);
      awardXP('lesson');
    }
    else if (messageIndex === config.sceneRanges.minigame.end + 1) {
      console.log(`${config.logPrefix} Minigame dialogue complete`);
    }
  }, [messageIndex, config.sceneRanges, config.logPrefix]);

  // Handlers
  function handleDialogueComplete() {
    if (messageIndex === config.sceneRanges.opening.end) {
      checkedLessonTasksRef.current = new Set();
      handleNextMessage();
    } else if (messageIndex === config.sceneRanges.lesson.end) {
      awardXP('lesson');
      handleNextMessage();
    } else if (messageIndex === config.sceneRanges.minigame.end) {
      // Minigame will handle gameplay
    }
  }

  const markTaskComplete = (taskKey: string) => {
    setCompletedTasks((prev) => {
      if (prev[taskKey]) {
        return prev;
      }
      return { ...prev, [taskKey]: true };
    });
  };

  const markTaskFailed = (taskKey: string) => {
    setFailedTasks((prev) => ({ ...prev, [taskKey]: true }));
  };

  const awardXP = async (type: 'lesson' | 'minigame' | 'quiz') => {
    let xp = 0;
    if (type === 'lesson') xp = config.xpValues.lesson;
    else if (type === 'minigame') xp = config.xpValues.minigame;
    else if (type === 'quiz') xp = Object.keys(config.quizTaskIds).reduce((sum, key) => sum + (config.xpValues[key] || 0), 0);

    console.log(`${config.logPrefix} Awarding ${type} XP:`, xp);
    setEarnedXP((prev) => {
      const updated = { ...prev, [type]: xp };
      console.log(`${config.logPrefix} Updated earnedXP:`, updated);
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

  const handleMinigameComplete = async (isCorrect: boolean) => {
    if (isCorrect) {
      if (currentMinigameLevel < config.minigameLevels.length - 1) {
        setCurrentMinigameLevel(currentMinigameLevel + 1);
      } else {
        markTaskComplete(config.minigameTaskId);
        awardXP('minigame');
        
        if (minigame && userProfile?.id) {
          try {
            console.log(`${config.logPrefix} Submitting minigame attempt for minigame ID:`, minigame.id);
            const result = await submitMinigameAttempt(minigame.id, {
              score: 100,
              time_taken: 60,
              attempt_data: { completedLevels: config.minigameLevels.length },
            });
            console.log(`${config.logPrefix} Minigame attempt submitted successfully:`, result);
          } catch (error) {
            console.error(`${config.logPrefix} Failed to submit minigame attempt:`, error);
            alert('Failed to save minigame progress. Please check your connection and try again.');
            return; // Don't proceed to quiz if minigame save failed
          }
        } else {
          console.warn(`${config.logPrefix} Cannot submit minigame: missing minigame (${!!minigame}) or user (${!!userProfile?.id})`);
        }
        
        setCurrentQuizIndex(0);
        setCurrentScene('quiz');
      }
    }
  };

  const handleQuizSubmit = async (quizIndex: number) => {
    if (!quiz || !userProfile?.id) return;

    const quizKeys = Object.keys(config.quizTaskIds).sort();
    const taskKey = config.quizTaskIds[quizKeys[quizIndex]];
    const question = quiz.quiz_config.questions[quizIndex];
    const userAnswer = quizAnswers[question.id];

    if (userAnswer === question.correctAnswer) {
      setQuizFeedback('correct');
      markTaskComplete(taskKey);
      
      setTimeout(async () => {
        setQuizFeedback(null);
        
        if (quizIndex + 1 < quiz.quiz_config.questions.length) {
          setCurrentQuizIndex(quizIndex + 1);
          const nextQuestion = quiz.quiz_config.questions[quizIndex + 1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
        } else {
          awardXP('quiz');
          
          try {
            console.log(`${config.logPrefix} Submitting quiz with answers:`, quizAnswers);
            await submitQuizAttempt(quiz.id, quizAnswers);
          } catch (error) {
            console.error('Failed to submit quiz:', error);
          }
          
          try {
            await completeChapter(chapterId!);
            console.log(`${config.logPrefix} Chapter marked as complete, next castle should be unlocked`);
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
      
      setTimeout(async () => {
        setQuizFeedback(null);
        
        if (quizIndex + 1 < quiz.quiz_config.questions.length) {
          setCurrentQuizIndex(quizIndex + 1);
          const nextQuestion = quiz.quiz_config.questions[quizIndex + 1];
          setQuizAnswers((prev) => {
            const updated = { ...prev };
            delete updated[nextQuestion.id];
            return updated;
          });
      } else {
        try {
          await submitQuizAttempt(quiz.id, quizAnswers);
        } catch (error) {
          console.error('Failed to submit quiz:', error);
        }
        
        try {
          await completeChapter(chapterId!);
          console.log(`${config.logPrefix} Chapter marked as complete (with wrong answers)`);
        } catch (error) {
          console.error('Failed to complete chapter:', error);
        }
        
        awardXP('quiz');
        
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
    setQuizScore(null);
    setQuizScoreKey(prev => prev + 1);
    cacheControl.clear();
    
    setEarnedXP(prev => ({ ...prev, quiz: 0 }));
    chapterStore.clearAllQuizData(config.chapterKey);
    
    setCompletedTasks((prev) => {
      const updated = { ...prev };
      Object.values(config.quizTaskIds).forEach(taskId => {
        delete updated[taskId];
      });
      return updated;
    });
    
    const currentProgress = chapterStore.getChapterProgress(config.chapterKey);
    if (currentProgress) {
      const updatedTasks = { ...currentProgress.completedTasks };
      Object.values(config.quizTaskIds).forEach(taskId => {
        delete updatedTasks[taskId];
      });
      
      chapterStore.chapters[config.chapterKey] = {
        ...currentProgress,
        completedTasks: updatedTasks,
        earnedXP: { ...currentProgress.earnedXP, quiz: 0 },
        lastUpdated: Date.now(),
      };
    }
    
    chapterStore.setEarnedXP(config.chapterKey, 'quiz', 0);
    setCurrentQuizIndex(0);
    setCurrentScene('quiz');
  };

  const handleRestartChapter = () => {
    setShowRestartModal(true);
  };

  const confirmRestartChapter = () => {
    setShowRestartModal(false);
    
    setCurrentScene('opening');
    setCompletedTasks({});
    setFailedTasks({});
    setQuizAnswers({});
    setQuizAttempts(0);
    setEarnedXP({ lesson: 0, minigame: 0, quiz: 0 });
    setCurrentMinigameLevel(0);
    setQuizFeedback(null);
    
    chapterStore.clearChapterProgress(config.chapterKey);
    chapterStore.initializeChapter(config.chapterKey);
    
    checkedLessonTasksRef.current = new Set();
    resetDialogue();
  };

  const handleReturnToCastle = () => {
    router.push(config.castleRoute);
  };

  // Loading and error states
  if (authLoading || loading) {
    return (
      <div className={`${baseStyles.loading_container} ${baseStyles[config.castleTheme]}`}>
        <p>Loading {config.title}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${baseStyles.loading_container} ${baseStyles[config.castleTheme]}`}>
        <p>Error: {error}</p>
        <button onClick={handleReturnToCastle}>Return to Castle</button>
      </div>
    );
  }

  // Main render
  return (
    <div className={`${baseStyles.chapterContainer} ${baseStyles[config.castleTheme]} ${config.castleTheme}`}>
      <div className={baseStyles.backgroundOverlay}></div>

      {showRestartModal && (
        <ChapterRestartModal
          chapterTitle={config.title}
          onConfirm={confirmRestartChapter}
          onCancel={() => setShowRestartModal(false)}
        />
      )}

      <ChapterTopBar
        chapterTitle={config.title}
        chapterSubtitle={config.subtitle}
        isMuted={isMuted}
        autoAdvance={autoAdvanceEnabled}
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleAutoAdvance={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
        onExit={handleReturnToCastle}
        onRestart={handleRestartChapter}
        styleModule={baseStyles}
      />

      <div className={baseStyles.mainContent}>
        <ChapterTaskPanel
          tasks={config.learningObjectives}
          completedTasks={completedTasks}
          failedTasks={failedTasks}
          styleModule={baseStyles}
        />

        <div className={baseStyles.gameArea}>
          {/* Opening Scene */}
          {currentScene === 'opening' && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <h2 style={{ color: '#FFD700', fontSize: '2rem' }}>{config.welcomeMessage}</h2>
              <p style={{ color: '#E8F4FD', fontSize: '1.2rem', marginTop: '1rem' }}>
                Click the dialogue box to begin your journey...
              </p>
            </div>
          )}

          {/* Lesson Scene */}
          {currentScene === 'lesson' && (
            <LessonGrid columns={2} gap="medium" styleModule={lessonStyles}>
              {config.concepts.map((concept, index) => {
                const conceptDialogue = config.dialogue.find(d => d.key === concept.key);
                const conceptDialogueIndex = conceptDialogue ? config.dialogue.indexOf(conceptDialogue) : -1;
                const isHighlighted = conceptDialogueIndex !== -1 && messageIndex === conceptDialogueIndex;

                return (
                  <ConceptCard
                    key={`${concept.key}-${index}`}
                    title={concept.title}
                    description={concept.description}
                    imageSrc={concept.image}
                    imageAlt={concept.title}
                    highlighted={isHighlighted}
                    styleModule={lessonStyles}
                  />
                );
              })}
            </LessonGrid>
          )}

          {/* Minigame Scene */}
          {currentScene === 'minigame' && config.minigameLevels[currentMinigameLevel] && (
            <config.MinigameComponent
              question={config.minigameLevels[currentMinigameLevel]}
              onComplete={handleMinigameComplete}
              styleModule={minigameStyles}
            />
          )}

          {/* Quiz Scenes */}
          {currentScene === 'quiz' && quiz && quiz.quiz_config.questions[currentQuizIndex] && (
            <div className={`${minigameStyles.minigameContainer} ${config.castleTheme}`}>
              <div className={minigameStyles.questionText}>
                {quiz.quiz_config.questions[currentQuizIndex]?.question}
              </div>
              
              <div className={minigameStyles.answerOptions}>
                {quiz.quiz_config.questions[currentQuizIndex]?.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`${minigameStyles.answerOption} ${
                      quizAnswers[quiz.quiz_config.questions[currentQuizIndex].id] === option
                        ? minigameStyles.answerOptionSelected
                        : ''
                    }`}
                    onClick={() => {
                      const questionId = quiz.quiz_config.questions[currentQuizIndex].id;
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
                onClick={() => handleQuizSubmit(currentQuizIndex)}
                disabled={!quizAnswers[quiz.quiz_config.questions[currentQuizIndex].id] || quizFeedback !== null}
              >
                {quizFeedback === 'correct' ? '✓ Correct!' : quizFeedback === 'incorrect' ? '✗ Incorrect' : 'Submit Answer'}
              </button>
            </div>
          )}

          {/* Reward Scene */}
          {currentScene === 'reward' && (
            <>
              {console.log(`${config.logPrefix} Rendering reward screen with earnedXP:`, earnedXP)}
              {console.log(`${config.logPrefix} Rendering reward screen with quizScore:`, quizScore)}
              <ChapterRewardScreen
                relicName={config.relic.name}
                relicImage={config.relic.image}
                relicDescription={config.relic.description}
                earnedXP={earnedXP}
                quizScore={quizScore}
                canRetakeQuiz={true}
                onRetakeQuiz={handleRetakeQuiz}
                onRestartChapter={handleRestartChapter}
                onComplete={handleReturnToCastle}
                styleModule={baseStyles}
              />
            </>
          )}
        </div>
      </div>

      {/* Dialogue Box */}
      {currentScene !== 'reward' && !currentScene.startsWith('quiz') && (
        <ChapterDialogueBox
          wizardName={config.wizard.name}
          wizardImage={config.wizard.image}
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

export default ChapterPageBase;
