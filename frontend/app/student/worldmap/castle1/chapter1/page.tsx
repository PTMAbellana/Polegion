'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { PointBasedMinigame, GeometryPhysicsGame } from '@/components/chapters/minigames';
import type { GeometryLevel } from '@/components/chapters/minigames/GeometryPhysicsGame';
import { ConceptCard, LessonGrid, VisualDemo } from '@/components/chapters/lessons';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import Image from 'next/image';
import { awardLessonXP, completeChapter } from '@/api/chapters';
import { submitQuizAttempt } from '@/api/chapterQuizzes';
import { submitMinigameAttempt } from '@/api/minigames';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

const CASTLE_ID = 'cd5ddb70-b4ba-46cb-85fd-d66e5735619f';
const CHAPTER_NUMBER = 1;

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward';

// Dialogue data
const openingDialogue = [
  'Ah, a new seeker of shapes has arrived! Welcome, traveler.',
  'I am Archim, Keeper of the Euclidean Spire — where all geometry was born.',
  'These are Points — the seeds of all geometry. Touch one, and it comes alive!',
  'From these points, we shall unlock the tower\'s ancient power!',
];

const lessonDialogue = [
  'Every shape begins with a Point — small, yet mighty.',
  'Two points form a connection — that is the beginning of a Line Segment.',
  'If the path stretches endlessly in one direction — it is a Ray.',
  'And if it continues in both directions — it becomes a Line, infinite and eternal.',
  'Watch closely as these fundamental forms reveal themselves.',
  'Now, let us put your knowledge to practice!',
];

const minigameDialogue = [
  'Excellent! Now let\'s put your knowledge into practice with a fun challenge!',
  'Help the ball reach the trash can by creating geometric shapes.',
  'Think carefully about where to place your points!',
];

// Minigame levels
const minigameLevels: GeometryLevel[] = [
  {
    id: 1,
    type: 'line-segment',
    title: 'Level 1: Line Segment',
    instruction: 'Create a line segment to guide the ball into the box. Click two points to create the segment.',
    ballStartX: 20,
    ballStartY: 10,
  },
  {
    id: 2,
    type: 'ray',
    title: 'Level 2: Ray',
    instruction: 'Create a ray starting near the box. Place the first point carefully, then the second point to set the direction.',
    ballStartX: 15,
    ballStartY: 15,
  },
  {
    id: 3,
    type: 'line',
    title: 'Level 3: Line',
    instruction: 'Create a line to guide the ball. Remember, a line extends infinitely in both directions!',
    ballStartX: 10,
    ballStartY: 20,
  },
];

// Learning objectives
const learningObjectives = [
  { key: 'task-0', label: 'Understand what a point represents in geometry' },
  { key: 'task-1', label: 'Learn about line segments and their properties' },
  { key: 'task-2', label: 'Understand what rays are and how they differ from lines' },
  { key: 'task-3', label: 'Master the concept of infinite lines' },
  { key: 'task-4', label: 'Complete the minigame challenge' },
  { key: 'task-5', label: 'Pass Quiz 1: Points' },
  { key: 'task-6', label: 'Pass Quiz 2: Lines and Segments' },
  { key: 'task-7', label: 'Pass Quiz 3: Comprehensive Review' },
];

const XP_VALUES = {
  lesson: 20,
  minigame: 30,
  quiz1: 15,
  quiz2: 15,
  quiz3: 20,
  total: 100,
};

export default function Chapter1PageRefactored() {
  const router = useRouter();
  
  // Scene and state management
  const [currentScene, setCurrentScene] = useState<SceneType>('opening');
  const [isMuted, setIsMuted] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [currentMinigameLevel, setCurrentMinigameLevel] = useState(0); // Track which minigame level (0-2)
  
  // Track which lesson tasks have been checked to prevent duplicates (using ref to avoid re-renders)
  const checkedLessonTasksRef = React.useRef<Set<number>>(new Set());
  const previousMessageIndexRef = React.useRef<number>(-1);
  
  // Task tracking
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>({});
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // XP tracking
  const [earnedXP, setEarnedXP] = useState({
    lesson: 0,
    minigame: 0,
    quiz: 0,
  });

  // Custom hooks
  const { chapterId, quiz, minigame, loading, error, authLoading, userProfile } = useChapterData({
    castleId: CASTLE_ID,
    chapterNumber: CHAPTER_NUMBER,
  });

  const {
    displayedText,
    isTyping,
    messageIndex,
    handleDialogueClick,
    handleNextMessage,
    resetDialogue,
  } = useChapterDialogue({
    dialogue: currentScene === 'opening' ? openingDialogue : 
             currentScene === 'lesson' ? lessonDialogue : 
             minigameDialogue,
    autoAdvance: autoAdvanceEnabled,
    autoAdvanceDelay: 3000,
    typingSpeed: 30,
    onDialogueComplete: handleDialogueComplete,
  });

  const { playNarration, stopAudio } = useChapterAudio({ isMuted });

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
    } else if (currentScene === 'lesson' && messageIndex >= lessonDialogue.length - 1) {
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
    if (type === 'lesson') xp = XP_VALUES.lesson;
    else if (type === 'minigame') xp = XP_VALUES.minigame;
    else if (type === 'quiz') xp = XP_VALUES.quiz1 + XP_VALUES.quiz2 + XP_VALUES.quiz3;

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
      if (currentMinigameLevel < minigameLevels.length - 1) {
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
              attempt_data: { completedLevels: minigameLevels.length },
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
          tasks={learningObjectives}
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
              level={minigameLevels[currentMinigameLevel]}
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
