# Chapter 2 & 3 Migration Guide - Unified Dialogue System

## Changes Summary
Apply the same pattern used in Chapter 1 to Chapter 2 and Chapter 3.

---

## CHAPTER 2 Changes

### 1. Update Imports (lines ~14-22)
**FIND:**
```typescript
import {
  CHAPTER2_CASTLE_ID,
  CHAPTER2_NUMBER,
  CHAPTER2_OPENING_DIALOGUE,
  CHAPTER2_LESSON_DIALOGUE,
  CHAPTER2_MINIGAME_DIALOGUE,
  // ... rest
} from '@/constants/chapters/castle1/chapter2';
```

**REPLACE WITH:**
```typescript
import {
  CHAPTER2_CASTLE_ID,
  CHAPTER2_NUMBER,
  CHAPTER2_DIALOGUE,
  CHAPTER2_SCENE_RANGES,
  // ... rest (keep MINIGAME_LEVELS, LEARNING_OBJECTIVES, etc.)
} from '@/constants/chapters/castle1/chapter2';
```

### 2. Update Initial Scene Calculation (around line ~51)
**ADD after savedProgress declaration:**
```typescript
const getInitialScene = (): SceneType => {
  const savedIndex = savedProgress?.messageIndex || 0;
  const dialogue = CHAPTER2_DIALOGUE[savedIndex];
  if (dialogue) {
    if (dialogue.scene === 'opening' || dialogue.scene === 'lesson' || dialogue.scene === 'minigame') {
      return dialogue.scene;
    }
  }
  return savedProgress?.currentScene as SceneType || 'opening';
};

const [currentScene, setCurrentScene] = useState<SceneType>(getInitialScene());
```

**REMOVE:**
```typescript
const [currentScene, setCurrentScene] = useState<SceneType>(
  (savedProgress?.currentScene as SceneType) || 'opening'
);
```

### 3. Update getInitialCheckedTasks (around line ~75)
**FIND:**
```typescript
const dialogue = CHAPTER2_LESSON_DIALOGUE.find(d => d.taskId === taskId);
```

**REPLACE WITH:**
```typescript
const dialogue = CHAPTER2_DIALOGUE.find(d => d.taskId === taskId);
```

### 4. Update useChapterDialogue Hook (around line ~125)
**FIND:**
```typescript
const {
  // ... hook return values
} = useChapterDialogue({
  dialogue: currentScene === 'opening' ? CHAPTER2_OPENING_DIALOGUE : 
           currentScene === 'lesson' ? CHAPTER2_LESSON_DIALOGUE.map(d => d.text) : 
           CHAPTER2_MINIGAME_DIALOGUE,
  // ... other props
  initialMessageIndex: currentScene === 'lesson' ? (savedProgress?.messageIndex || 0) : 0,
  onMessageIndexChange: (index: number) => {
    if (currentScene === 'lesson') {
      chapterStore.setMessageIndex(CHAPTER_KEY, index);
    }
  },
});
```

**REPLACE WITH:**
```typescript
const {
  // ... hook return values
} = useChapterDialogue({
  dialogue: CHAPTER2_DIALOGUE.map(d => d.text),
  // ... other props
  initialMessageIndex: savedProgress?.messageIndex || 0,
  onMessageIndexChange: (index: number) => {
    chapterStore.setMessageIndex(CHAPTER_KEY, index);
  },
});
```

### 5. Add Auto Scene Detection (after useChapterDialogue hook)
**ADD:**
```typescript
// Auto-update scene based on messageIndex (but don't override on initial load)
const hasInitializedSceneRef = React.useRef(false);

useEffect(() => {
  if (!hasInitializedSceneRef.current) {
    hasInitializedSceneRef.current = true;
    return; // Skip on first render to preserve saved scene
  }
  
  const currentDialogue = CHAPTER2_DIALOGUE[messageIndex];
  if (currentDialogue) {
    const newScene = currentDialogue.scene;
    if (newScene === 'opening' || newScene === 'lesson' || newScene === 'minigame') {
      if (currentScene !== newScene) {
        setCurrentScene(newScene);
      }
    }
  }
}, [messageIndex]);
```

### 6. Update Task Tracking Effect (around line ~235)
**FIND:**
```typescript
React.useEffect(() => {
  if (currentScene === 'lesson' && messageIndex >= 0 && messageIndex < CHAPTER2_LESSON_DIALOGUE.length) {
    const currentDialogue = CHAPTER2_LESSON_DIALOGUE[messageIndex];
    // ...
  }
}, [currentScene, messageIndex]);
```

**REPLACE WITH:**
```typescript
React.useEffect(() => {
  if (messageIndex >= 0 && messageIndex < CHAPTER2_DIALOGUE.length) {
    const currentDialogue = CHAPTER2_DIALOGUE[messageIndex];
    
    // Skip if already processed this dialogue
    if (currentDialogue.key && checkedLessonTasksRef.current.has(currentDialogue.key)) {
      return;
    }
    
    // If this dialogue has an associated task, mark it complete
    if (currentDialogue.taskId) {
      markTaskComplete(currentDialogue.taskId);
      if (currentDialogue.key) {
        checkedLessonTasksRef.current.add(currentDialogue.key);
      }
    }
  }
}, [messageIndex]);
```

### 7. Update handleDialogueComplete (around line ~255)
**REPLACE ENTIRE FUNCTION:**
```typescript
function handleDialogueComplete() {
  // Check which scene just completed based on current messageIndex
  if (messageIndex === CHAPTER2_SCENE_RANGES.opening.end) {
    // Opening complete, advance to lesson
    checkedLessonTasksRef.current = new Set();
    previousMessageIndexRef.current = -1;
    handleNextMessage(); // This will auto-advance to lesson scene
    playNarration('chapter2-lesson-intro');
  } else if (messageIndex === CHAPTER2_SCENE_RANGES.lesson.end) {
    // Lesson complete, award XP and advance to minigame
    awardXP('lesson');
    handleNextMessage(); // This will auto-advance to minigame scene
  } else if (messageIndex === CHAPTER2_SCENE_RANGES.minigame.end) {
    // Minigame dialogue complete
    // No action needed here
  }
}
```

### 8. Update confirmRestartChapter (around line ~485)
**FIND:**
```typescript
resetDialogue();
```

**REPLACE WITH:**
```typescript
// Reset dialogue to index 0 (start of opening scene)
setMessageIndex(0);
setCurrentMessage(CHAPTER2_DIALOGUE[0].text);
```

### 9. Update Lesson Scene Highlighting (around line ~585)
**FIND:**
```typescript
const dialogueIndex = CHAPTER2_LESSON_DIALOGUE.findIndex(d => d.key === concept.key);
const isHighlighted = dialogueIndex !== -1 && messageIndex >= dialogueIndex;
```

**REPLACE WITH:**
```typescript
const conceptDialogue = CHAPTER2_DIALOGUE.find(d => d.key === concept.key);
const conceptDialogueIndex = conceptDialogue ? CHAPTER2_DIALOGUE.indexOf(conceptDialogue) : -1;
const isHighlighted = conceptDialogueIndex !== -1 && messageIndex >= conceptDialogueIndex;
```

---

## CHAPTER 3 Changes

Apply the exact same pattern as Chapter 2, but use:
- `CHAPTER3_DIALOGUE` instead of `CHAPTER2_DIALOGUE`
- `CHAPTER3_SCENE_RANGES` instead of `CHAPTER2_SCENE_RANGES`
- `CHAPTER_KEY = 'castle1-chapter3'`

All the same 9 steps apply with just the constant names changed.

---

## Testing Checklist

After applying changes to both chapters:

1. **Fresh Start**: Clear localStorage, start from opening dialogue
2. **Progress Save**: Advance to middle of lesson, refresh page - should resume at same dialogue
3. **Scene Transitions**: Opening → Lesson → Minigame should flow smoothly
4. **Task Completion**: Tasks should mark complete as dialogue advances
5. **Concept Highlighting**: Concept cards should highlight at correct dialogue
6. **Restart**: Click restart button - should go back to opening dialogue[0]
7. **Navigation**: Leave page and return - should restore exact position

---

## Key Benefits of This Pattern

✅ Single dialogue array - no scene transition bugs
✅ Auto scene detection - scene follows messageIndex
✅ Simple restart - just set messageIndex to 0
✅ Clean checkpointing - one index to save/restore
✅ No dialogue array swapping - hook never resets unexpectedly
