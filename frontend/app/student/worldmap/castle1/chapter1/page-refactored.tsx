'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen,
} from '@/components/chapters/shared';
import { PointBasedMinigame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid, VisualDemo } from '@/components/chapters/lessons';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
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
  'Excellent! Now connect the points to form the shapes I call for.',
  'Click the points in the correct order to form the requested shape.',
  'Choose wisely, young geometer!',
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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Task tracking
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>({});
  
  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizAttempts, setQuizAttempts] = useState(0);
  
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

  // Handlers
  function handleDialogueComplete() {
    if (currentScene === 'opening') {
      setCurrentScene('lesson');
      resetDialogue();
      playNarration('chapter1-lesson-intro');
    } else if (currentScene === 'lesson' && messageIndex >= lessonDialogue.length - 1) {
      markTaskComplete('task-0'); // First 4 objectives about learning concepts
      markTaskComplete('task-1');
      markTaskComplete('task-2');
      markTaskComplete('task-3');
      awardXP('lesson');
      setCurrentScene('minigame');
      resetDialogue();
    }
  }

  const markTaskComplete = (taskKey: string) => {
    setCompletedTasks((prev) => ({ ...prev, [taskKey]: true }));
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
        await awardLessonXP({ userId: userProfile.id, chapterId, xp });
      } catch (error) {
        console.error('Failed to award XP:', error);
      }
    }
  };

  const handleMinigameComplete = async (isCorrect: boolean, selectedPoints?: string[]) => {
    if (isCorrect) {
      // Move to next question or complete minigame
      if (minigame && currentQuestionIndex < minigame.game_config.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        markTaskComplete('task-4'); // Complete minigame task
        awardXP('minigame');
        
        // Submit minigame attempt
        if (minigame && userProfile?.id) {
          try {
            await submitMinigameAttempt({
              user_id: userProfile.id,
              minigame_id: minigame.id,
              score: 100,
              time_taken: 60,
              attempt_data: { selectedPoints },
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
      markTaskComplete(taskKey);
      
      // Move to next quiz or reward
      if (quizNumber === 1) setCurrentScene('quiz2');
      else if (quizNumber === 2) setCurrentScene('quiz3');
      else {
        // All quizzes complete
        awardXP('quiz');
        
        // Submit quiz attempt
        try {
          await submitQuizAttempt({
            user_id: userProfile.id,
            quiz_id: quiz.id,
            answers: quizAnswers,
            score: 100,
            time_taken: 120,
          });
        } catch (error) {
          console.error('Failed to submit quiz:', error);
        }
        
        // Complete chapter
        try {
          await completeChapter({
            userId: userProfile.id,
            chapterId: chapterId!,
            xpEarned: earnedXP.lesson + earnedXP.minigame + 50,
          });
        } catch (error) {
          console.error('Failed to complete chapter:', error);
        }
        
        setCurrentScene('reward');
      }
    } else {
      markTaskFailed(taskKey);
      setQuizAttempts(quizAttempts + 1);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizAttempts(0);
    setFailedTasks({});
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
    <div className={baseStyles.chapterContainer}>
      <div className={baseStyles.backgroundOverlay}></div>

      {/* Top Bar */}
      <ChapterTopBar
        chapterTitle="Chapter 1: Points and Lines"
        chapterSubtitle="Castle 1 - Foundations of Geometry"
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
                icon={<span style={{ fontSize: '4rem' }}>•</span>}
                highlighted={messageIndex >= 0}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Line Segment"
                description="A line segment connects two points. It has a definite beginning and end, with measurable length."
                icon={<span style={{ fontSize: '4rem' }}>─</span>}
                highlighted={messageIndex >= 1}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Ray"
                description="A ray starts at one point and extends infinitely in one direction, like a beam of light."
                icon={<span style={{ fontSize: '4rem' }}>→</span>}
                highlighted={messageIndex >= 2}
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Line"
                description="A line extends infinitely in both directions. It has no endpoints and continues forever."
                icon={<span style={{ fontSize: '4rem' }}>↔</span>}
                highlighted={messageIndex >= 3}
                styleModule={lessonStyles}
              />
            </LessonGrid>
          )}

          {/* Minigame Scene */}
          {currentScene === 'minigame' && minigame && (
            <PointBasedMinigame
              question={minigame.game_config.questions[currentQuestionIndex]}
              onComplete={handleMinigameComplete}
              canvasWidth={800}
              canvasHeight={600}
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
                className={minigameStyles.submitButton}
                onClick={() => handleQuizSubmit(currentScene === 'quiz1' ? 1 : currentScene === 'quiz2' ? 2 : 3)}
                disabled={!quizAnswers[quiz.quiz_config.questions[currentScene === 'quiz1' ? 0 : currentScene === 'quiz2' ? 1 : 2].id]}
              >
                Submit Answer
              </button>
            </div>
          )}

          {/* Reward Scene */}
          {currentScene === 'reward' && (
            <ChapterRewardScreen
              relicName="Compass of Precision"
              relicImage="/images/relics/compass.png"
              relicDescription="You have mastered the fundamental building blocks of geometry! The Compass of Precision allows you to mark exact locations in space."
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
          wizardImage="/images/wizard-pythagoras.png"
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
