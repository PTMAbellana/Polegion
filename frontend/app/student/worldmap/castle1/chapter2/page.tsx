'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { LineBasedMinigame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid } from '@/components/chapters/lessons';
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
} from '@/constants/chapters/castle1/chapter2';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { submitQuizAttempt } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward';

export default function Chapter2Page() {
  const router = useRouter();
  
  const [currentScene, setCurrentScene] = useState<SceneType>('opening');
  const [isMuted, setIsMuted] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [currentMinigameQuestion, setCurrentMinigameQuestion] = useState(0);
  
  const checkedLessonTasksRef = React.useRef<Set<number>>(new Set());
  const previousMessageIndexRef = React.useRef<number>(-1);
  
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>({});
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  const [earnedXP, setEarnedXP] = useState({
    lesson: 0,
    minigame: 0,
    quiz: 0,
  });

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
             currentScene === 'lesson' ? CHAPTER2_LESSON_DIALOGUE : 
             CHAPTER2_MINIGAME_DIALOGUE,
    autoAdvance: autoAdvanceEnabled,
    autoAdvanceDelay: 3000,
    typingSpeed: 30,
    onDialogueComplete: handleDialogueComplete,
  });

  const { playNarration, stopAudio } = useChapterAudio({ isMuted });

  React.useEffect(() => {
    if (currentScene === 'lesson') {
      // Detect if we're jumping backward (dialogue reset) - reset the previous index
      if (previousMessageIndexRef.current > messageIndex) {
        previousMessageIndexRef.current = -1;
      }
      
      // Only process if we haven't checked this task yet
      if (checkedLessonTasksRef.current.has(messageIndex)) {
        previousMessageIndexRef.current = messageIndex;
        return;
      }
      
      // Check if this is a valid progression:
      // - First message should be 0 (when previous is -1, only accept messageIndex 0)
      // - Otherwise, should be moving forward by 1 (sequential progression)
      const isValidFirstMessage = previousMessageIndexRef.current === -1 && messageIndex === 0;
      const isSequentialProgression = messageIndex === previousMessageIndexRef.current + 1;
      
      if (isValidFirstMessage || isSequentialProgression) {
        // Mark the task based on messageIndex and track it
        // Parallel Lines - dialogue index 0
        if (messageIndex === 0) {
          markTaskComplete('task-0');
          checkedLessonTasksRef.current.add(0);
        } 
        // Intersecting Lines - dialogue index 2
        else if (messageIndex === 2) {
          markTaskComplete('task-1');
          checkedLessonTasksRef.current.add(2);
        } 
        // Perpendicular Lines - dialogue index 4
        else if (messageIndex === 4) {
          markTaskComplete('task-2');
          checkedLessonTasksRef.current.add(4);
        } 
        // Skew Lines - dialogue index 5
        else if (messageIndex === 5) {
          markTaskComplete('task-3');
          checkedLessonTasksRef.current.add(5);
        }
      }
      
      // Update previous messageIndex
      previousMessageIndexRef.current = messageIndex;
    }
  }, [currentScene, messageIndex]);

  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      checkedLessonTasksRef.current = new Set();
      previousMessageIndexRef.current = -1;
      setCurrentScene('lesson');
      playNarration('chapter2-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= CHAPTER2_LESSON_DIALOGUE.length - 1) {
      awardXP('lesson');
      setCurrentScene('minigame');
    }
  }

  React.useEffect(() => {
    resetDialogue();
  }, [currentScene, resetDialogue]);

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
    if (isCorrect) {
      if (currentMinigameQuestion < CHAPTER2_MINIGAME_LEVELS.length - 1) {
        setCurrentMinigameQuestion(currentMinigameQuestion + 1);
      } else {
        markTaskComplete('task-4');
        awardXP('minigame');
        
        if (minigame && userProfile?.id) {
          try {
            await submitMinigameAttempt(minigame.id, {
              score: 100,
              time_taken: 60,
              attempt_data: { completedQuestions: CHAPTER2_MINIGAME_LEVELS.length },
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
    
    setCompletedTasks((prev) => {
      const updated = { ...prev };
      delete updated['task-5'];
      delete updated['task-6'];
      delete updated['task-7'];
      return updated;
    });
    
    setCurrentScene('quiz1');
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
              <ConceptCard
                title="Parallel Lines"
                description="Lines that never meet, no matter how far extended. They maintain the same distance apart."
                imageSrc="/images/castle1/parallel-lines.png"
                highlighted={messageIndex >= 0}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Intersecting Lines"
                description="Lines that cross at exactly one point."
                imageSrc="/images/castle1/intersecting-lines.png"
                highlighted={messageIndex >= 2}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Perpendicular Lines"
                description="Lines that intersect at a 90° angle (right angle)."
                imageSrc="/images/castle1/perpendicular-lines.png"
                highlighted={messageIndex >= 4}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Skew Lines"
                description="Lines in 3D space that don't intersect and aren't parallel."
                imageSrc="/images/castle1/skew-lines.png"
                highlighted={messageIndex >= 5}
                styleModule={lessonStyles}
              />
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
                    onClick={() =>
                      setQuizAnswers((prev) => ({
                        ...prev,
                        [quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].id]: option,
                      }))
                    }
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
