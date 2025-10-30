# Chapter Refactoring Implementation Guide

## Quick Start: Refactoring a Chapter Page

This guide shows you how to refactor an existing chapter page to use the new components and hooks.

---

## Step-by-Step Refactoring Process

### Step 1: Import New Components and Hooks

Replace the old imports with the new modular imports:

```tsx
// ❌ OLD WAY - Multiple imports, lots of boilerplate
import { useState, useEffect, useRef } from 'react';
import { Stage, Layer, Circle, Line } from 'react-konva';
import styles from './styles.module.css';

// ✅ NEW WAY - Clean, organized imports
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen
} from '@/components/chapters/shared';
import { PointBasedMinigame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid, VisualDemo } from '@/components/chapters/lessons';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';
```

---

### Step 2: Replace Data Loading Logic with useChapterData

```tsx
// ❌ OLD WAY - 50+ lines of useEffect logic
const [quiz, setQuiz] = useState<ChapterQuiz | null>(null);
const [minigame, setMinigame] = useState<Minigame | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const quizData = await getChapterQuizByChapterId(chapterId);
      const minigameData = await getMinigameByChapterId(chapterId);
      setQuiz(quizData);
      setMinigame(minigameData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, [chapterId]);

// ✅ NEW WAY - 1 line
const { quiz, minigame, loading, error, userProfile } = useChapterData({
  castleId: 1,
  chapterNumber: 1
});
```

---

### Step 3: Replace Dialogue Logic with useChapterDialogue

```tsx
// ❌ OLD WAY - 80+ lines of dialogue state and effects
const [messageIndex, setMessageIndex] = useState(0);
const [displayedText, setDisplayedText] = useState('');
const [isTyping, setIsTyping] = useState(false);
const [charIndex, setCharIndex] = useState(0);

useEffect(() => {
  if (!isTyping) return;
  const currentMessage = dialogueMessages[messageIndex];
  if (charIndex < currentMessage.text.length) {
    const timeout = setTimeout(() => {
      setDisplayedText(prev => prev + currentMessage.text[charIndex]);
      setCharIndex(charIndex + 1);
    }, 30);
    return () => clearTimeout(timeout);
  } else {
    setIsTyping(false);
  }
}, [charIndex, isTyping, messageIndex]);

// ✅ NEW WAY - Clean and simple
const {
  currentMessage,
  displayedText,
  isTyping,
  handleDialogueClick,
  goToNextMessage,
  resetDialogue
} = useChapterDialogue({
  messages: dialogueMessages,
  autoAdvance: autoAdvanceEnabled,
  autoAdvanceDelay: 3000,
  typingSpeed: 30
});
```

---

### Step 4: Replace Audio Logic with useChapterAudio

```tsx
// ❌ OLD WAY - 40+ lines of audio handling
const audioRef = useRef<HTMLAudioElement | null>(null);

const playNarration = (filename: string) => {
  if (isMuted) return;
  if (audioRef.current) {
    audioRef.current.pause();
  }
  try {
    const audio = new Audio(`/audio/${filename}`);
    audio.play();
    audioRef.current = audio;
  } catch (err) {
    console.error('Audio error:', err);
  }
};

// ✅ NEW WAY - Simple and clean
const { playNarration, stopAudio } = useChapterAudio({ isMuted });
```

---

### Step 5: Replace UI Components

#### Top Bar

```tsx
// ❌ OLD WAY - 50+ lines of custom top bar
<div className={styles.topBar}>
  <div className={styles.chapterInfo}>
    <h1>{chapterTitle}</h1>
    <p>{chapterSubtitle}</p>
  </div>
  <div className={styles.controls}>
    <button onClick={() => setIsMuted(!isMuted)}>
      {isMuted ? '🔇' : '🔊'}
    </button>
    {/* ... more controls */}
  </div>
</div>

// ✅ NEW WAY - 7 lines with component
<ChapterTopBar
  chapterTitle="Chapter 1: Points and Lines"
  chapterSubtitle="Castle 1 - Foundations of Geometry"
  isMuted={isMuted}
  autoAdvance={autoAdvanceEnabled}
  onMuteToggle={() => setIsMuted(!isMuted)}
  onAutoAdvanceToggle={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
  onExit={() => router.push('/student/worldmap/castle1')}
  styleModule={baseStyles}
/>
```

#### Task Panel

```tsx
// ❌ OLD WAY - 70+ lines of task tracking UI
<div className={styles.taskPanel}>
  <h3>Learning Objectives</h3>
  {tasks.map((task, idx) => (
    <div key={idx} className={completedTasks[idx] ? styles.completed : ''}>
      {completedTasks[idx] ? '✓' : '○'} {task}
    </div>
  ))}
</div>

// ✅ NEW WAY - 6 lines with component
<ChapterTaskPanel
  tasks={learningObjectives}
  completedTasks={completedTasks}
  failedTasks={failedTasks}
  styleModule={baseStyles}
/>
```

#### Dialogue Box

```tsx
// ❌ OLD WAY - 40+ lines of dialogue UI
<div className={styles.dialogueBox} onClick={handleDialogueClick}>
  <img src="/wizard.png" />
  <div>
    <h4>{currentMessage.speaker}</h4>
    <p>{displayedText}</p>
    {!isTyping && <span>Click to continue...</span>}
  </div>
</div>

// ✅ NEW WAY - 6 lines with component
<ChapterDialogueBox
  wizardName="Professor Pythagoras"
  wizardImage="/images/wizard-pythagoras.png"
  displayedText={displayedText}
  isTyping={isTyping}
  onClick={handleDialogueClick}
  styleModule={baseStyles}
/>
```

---

### Step 6: Replace Minigame Canvas with Component

```tsx
// ❌ OLD WAY - 200+ lines of Konva canvas logic
<Stage width={800} height={600}>
  <Layer>
    {points.map(point => (
      <Circle
        key={point.id}
        x={point.x}
        y={point.y}
        radius={selectedPoints.includes(point.id) ? 12 : 8}
        fill={selectedPoints.includes(point.id) ? '#4CAF50' : '#667eea'}
        onClick={() => handlePointClick(point.id)}
      />
    ))}
    {/* ... 150+ more lines */}
  </Layer>
</Stage>

// ✅ NEW WAY - 5 lines with component
<PointBasedMinigame
  question={currentMinigameQuestion}
  onComplete={handleMinigameComplete}
  canvasWidth={800}
  canvasHeight={600}
  styleModule={minigameStyles}
/>
```

---

### Step 7: Replace Lesson Content with Components

```tsx
// ❌ OLD WAY - 100+ lines of concept cards and grids
<div className={styles.conceptGrid}>
  <div className={styles.conceptCard}>
    <img src="/point.svg" />
    <h3>Point</h3>
    <p>A location in space...</p>
  </div>
  <div className={styles.conceptCard}>
    <img src="/line.svg" />
    <h3>Line</h3>
    <p>A straight path...</p>
  </div>
  {/* ... more cards */}
</div>

// ✅ NEW WAY - Clean component composition
<LessonGrid columns={2} gap="medium" styleModule={lessonStyles}>
  <ConceptCard
    title="Point"
    description="A location in space with no size or dimension"
    imageSrc="/images/concepts/point.svg"
    styleModule={lessonStyles}
  />
  <ConceptCard
    title="Line"
    description="A straight path extending infinitely in both directions"
    imageSrc="/images/concepts/line.svg"
    styleModule={lessonStyles}
  />
</LessonGrid>
```

---

## Complete Before/After Example

### BEFORE: Castle1Chapter1Page (1100+ lines)

```tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Stage, Layer, Circle, Line, Text } from 'react-konva';
import { getChapterQuizByChapterId, getMinigameByChapterId } from '@/api/chapters';
import { submitChapterCompletion } from '@/api/progress';
import styles from './castle1-chapter1.module.css';

export default function Castle1Chapter1Page() {
  // State declarations (50+ lines)
  const [currentStage, setCurrentStage] = useState<'lesson' | 'minigame' | 'quiz' | 'reward'>('lesson');
  const [quiz, setQuiz] = useState<ChapterQuiz | null>(null);
  const [minigame, setMinigame] = useState<Minigame | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // ... 30+ more state variables

  // Data fetching (50+ lines)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const quizData = await getChapterQuizByChapterId('castle1-chapter1');
        const minigameData = await getMinigameByChapterId('castle1-chapter1');
        setQuiz(quizData);
        setMinigame(minigameData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dialogue logic (80+ lines)
  useEffect(() => {
    // Typing animation...
  }, [charIndex, isTyping]);

  useEffect(() => {
    // Auto-advance...
  }, [autoAdvanceEnabled, isTyping]);

  // Audio logic (40+ lines)
  const playNarration = (filename: string) => {
    // Audio handling...
  };

  // Handler functions (200+ lines)
  const handlePointClick = (pointId: string) => {
    // Point selection logic...
  };

  const handleMinigameComplete = () => {
    // Minigame completion...
  };

  const handleQuizSubmit = () => {
    // Quiz submission...
  };

  // Render methods (500+ lines)
  const renderLesson = () => {
    return (
      <div>
        {/* 200+ lines of lesson content */}
      </div>
    );
  };

  const renderMinigame = () => {
    return (
      <Stage width={800} height={600}>
        {/* 200+ lines of canvas logic */}
      </Stage>
    );
  };

  const renderQuiz = () => {
    return (
      <div>
        {/* 100+ lines of quiz UI */}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return <div className={styles.loading_container}>Loading...</div>;
  }

  // Main render (150+ lines)
  return (
    <div className={styles.chapterContainer}>
      {/* Top bar - 50 lines */}
      <div className={styles.topBar}>
        <div className={styles.chapterInfo}>
          <h1>Chapter 1: Points and Lines</h1>
          <p>Castle 1 - Foundations of Geometry</p>
        </div>
        <div className={styles.controls}>
          <button onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? '🔇' : '🔊'}
          </button>
          <button onClick={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}>
            Auto: {autoAdvanceEnabled ? 'ON' : 'OFF'}
          </button>
          <button onClick={() => router.push('/student/worldmap/castle1')}>
            Exit
          </button>
        </div>
      </div>

      {/* Task panel - 70 lines */}
      <div className={styles.taskPanel}>
        {/* Task tracking UI */}
      </div>

      {/* Main content - varies by stage */}
      <div className={styles.mainContent}>
        {currentStage === 'lesson' && renderLesson()}
        {currentStage === 'minigame' && renderMinigame()}
        {currentStage === 'quiz' && renderQuiz()}
        {currentStage === 'reward' && (
          <div className={styles.rewardScreen}>
            {/* Reward UI - 100 lines */}
          </div>
        )}
      </div>

      {/* Dialogue box - 40 lines */}
      <div className={styles.dialogueWrapper}>
        <div className={styles.dialogueContainer} onClick={handleDialogueClick}>
          {/* Dialogue UI */}
        </div>
      </div>
    </div>
  );
}
```

---

### AFTER: Castle1Chapter1Page (80 lines)

```tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChapterTopBar,
  ChapterTaskPanel,
  ChapterDialogueBox,
  ChapterRewardScreen
} from '@/components/chapters/shared';
import { PointBasedMinigame } from '@/components/chapters/minigames';
import { ConceptCard, LessonGrid } from '@/components/chapters/lessons';
import { useChapterData, useChapterDialogue, useChapterAudio } from '@/hooks/chapters';
import { submitChapterCompletion } from '@/api/progress';
import baseStyles from '@/styles/chapters/chapter-base.module.css';
import minigameStyles from '@/styles/chapters/minigame-shared.module.css';
import lessonStyles from '@/styles/chapters/lesson-shared.module.css';

export default function Castle1Chapter1Page() {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<'lesson' | 'minigame' | 'quiz' | 'reward'>('lesson');
  const [isMuted, setIsMuted] = useState(false);
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [earnedXP, setEarnedXP] = useState({ lesson: 0, minigame: 0, quiz: 0 });

  // Use custom hooks
  const { quiz, minigame, loading } = useChapterData({ castleId: 1, chapterNumber: 1 });
  const { displayedText, isTyping, handleDialogueClick } = useChapterDialogue({
    messages: dialogueMessages,
    autoAdvance: autoAdvanceEnabled,
    onComplete: () => setCompletedTasks(prev => ({ ...prev, 0: true }))
  });
  const { playNarration } = useChapterAudio({ isMuted });

  // Minimal handlers
  const handleMinigameComplete = async (isCorrect: boolean) => {
    if (isCorrect) {
      setEarnedXP(prev => ({ ...prev, minigame: 100 }));
      setCurrentStage('quiz');
    }
  };

  const handleQuizComplete = async (score: number) => {
    setEarnedXP(prev => ({ ...prev, quiz: score * 10 }));
    await submitChapterCompletion('castle1-chapter1', earnedXP);
    setCurrentStage('reward');
  };

  if (loading) {
    return <div className={baseStyles.loading_container}>Loading...</div>;
  }

  return (
    <div className={baseStyles.chapterContainer}>
      <ChapterTopBar
        chapterTitle="Chapter 1: Points and Lines"
        chapterSubtitle="Castle 1 - Foundations of Geometry"
        isMuted={isMuted}
        autoAdvance={autoAdvanceEnabled}
        onMuteToggle={() => setIsMuted(!isMuted)}
        onAutoAdvanceToggle={() => setAutoAdvanceEnabled(!autoAdvanceEnabled)}
        onExit={() => router.push('/student/worldmap/castle1')}
        styleModule={baseStyles}
      />

      <div className={baseStyles.mainContent}>
        <ChapterTaskPanel
          tasks={learningObjectives}
          completedTasks={completedTasks}
          failedTasks={{}}
          styleModule={baseStyles}
        />

        <div className={baseStyles.gameArea}>
          {currentStage === 'lesson' && (
            <LessonGrid columns={2} gap="medium" styleModule={lessonStyles}>
              <ConceptCard
                title="Point"
                description="A location in space with no size"
                imageSrc="/images/concepts/point.svg"
                styleModule={lessonStyles}
              />
              <ConceptCard
                title="Line"
                description="A straight path extending infinitely"
                imageSrc="/images/concepts/line.svg"
                styleModule={lessonStyles}
              />
            </LessonGrid>
          )}

          {currentStage === 'minigame' && minigame && (
            <PointBasedMinigame
              question={minigame.game_config.questions[0]}
              onComplete={handleMinigameComplete}
              styleModule={minigameStyles}
            />
          )}

          {currentStage === 'reward' && (
            <ChapterRewardScreen
              relicName="Compass of Precision"
              relicImage="/images/relics/compass.png"
              relicDescription="Master the art of marking exact locations"
              earnedXP={earnedXP}
              onRetakeQuiz={() => setCurrentStage('quiz')}
              onReturnToCastle={() => router.push('/student/worldmap/castle1')}
              styleModule={baseStyles}
            />
          )}
        </div>
      </div>

      <ChapterDialogueBox
        wizardName="Professor Pythagoras"
        wizardImage="/images/wizard-pythagoras.png"
        displayedText={displayedText}
        isTyping={isTyping}
        onClick={handleDialogueClick}
        styleModule={baseStyles}
      />
    </div>
  );
}
```

**Result: 1100+ lines → 80 lines = 93% reduction!**

---

## Minigame Component Selection Guide

| Chapter | Minigame Type | Component to Use |
|---------|---------------|------------------|
| Castle 1 Ch1 | Point connecting | `PointBasedMinigame` |
| Castle 1 Ch2 | Line identification | `LineBasedMinigame` |
| Castle 1 Ch3 | Shape recognition | `ShapeBasedMinigame` |
| Castle 2 Ch1 | Perimeter calculation | `PerimeterMinigame` |
| Castle 2 Ch3 | Area calculation | `AreaCalculationMinigame` |
| Castle 3 Ch1 | Circle parts | `CirclePartsMinigame` |

---

## Common Patterns

### Pattern 1: Stage Management

```tsx
const [currentStage, setCurrentStage] = useState<'lesson' | 'minigame' | 'quiz' | 'reward'>('lesson');

// Progress through stages
const goToMinigame = () => {
  setCompletedTasks(prev => ({ ...prev, [lessonIndex]: true }));
  setCurrentStage('minigame');
};

const goToQuiz = () => {
  setCompletedTasks(prev => ({ ...prev, [minigameIndex]: true }));
  setCurrentStage('quiz');
};
```

### Pattern 2: XP Tracking

```tsx
const [earnedXP, setEarnedXP] = useState({
  lesson: 0,
  minigame: 0,
  quiz: 0
});

// Award XP for completing stages
const handleLessonComplete = () => {
  setEarnedXP(prev => ({ ...prev, lesson: 50 }));
};
```

### Pattern 3: Conditional Rendering by Stage

```tsx
{currentStage === 'lesson' && <LessonContent />}
{currentStage === 'minigame' && <MinigameContent />}
{currentStage === 'quiz' && <QuizContent />}
{currentStage === 'reward' && <RewardContent />}
```

---

## Checklist for Refactoring a Chapter

- [ ] Import new components and hooks
- [ ] Replace data fetching with `useChapterData`
- [ ] Replace dialogue logic with `useChapterDialogue`
- [ ] Replace audio logic with `useChapterAudio`
- [ ] Replace top bar with `ChapterTopBar`
- [ ] Replace task panel with `ChapterTaskPanel`
- [ ] Replace dialogue box with `ChapterDialogueBox`
- [ ] Replace minigame canvas with appropriate minigame component
- [ ] Replace lesson content with `ConceptCard` and `LessonGrid`
- [ ] Replace reward screen with `ChapterRewardScreen`
- [ ] Update CSS imports to use shared modules
- [ ] Test all stage transitions
- [ ] Test XP awarding
- [ ] Test audio playback
- [ ] Test responsive design

---

## Tips for Success

1. **Start with one chapter** - Use Castle 1 Chapter 1 as your reference
2. **Test frequently** - Test after each component replacement
3. **Keep existing logic** - Stage management and XP tracking stay the same
4. **Use TypeScript** - Let IntelliSense guide you with component props
5. **Reuse CSS** - Most styling is now in shared modules
6. **Preserve functionality** - Don't change behavior, just implementation

---

## Need Help?

- **Component Props**: Check the TypeScript interface at the top of each component file
- **Hook Options**: Check the `Options` interface in each hook file
- **CSS Classes**: Browse the shared CSS modules for available styles
- **Examples**: Look at the `REFACTORING_PROGRESS.md` for component usage examples
