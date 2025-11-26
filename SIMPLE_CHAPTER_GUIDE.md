# Simple Chapter Creation Guide

## 🚀 The New Way (Super Simple!)

Instead of 800+ lines of code per chapter, you now only need **~80 lines** of configuration!

## 📦 What Changed

### Old Way ❌
- Copy entire 800-line chapter file
- Find and replace dozens of values manually
- Easy to miss updates
- Lots of duplicate code

### New Way ✅
- **1 reusable base component** with all the logic: `ChapterPageBase.tsx`
- **Each chapter page** is just a small config file (~80 lines)
- **No code duplication** - all logic is centralized
- **Easy to maintain** - fix a bug once, all chapters benefit

## 📁 File Structure

```
frontend/
├── components/
│   └── chapters/
│       └── ChapterPageBase.tsx          ← The reusable base (you rarely touch this)
│
└── app/
    └── student/
        └── worldmap/
            ├── castle1/
            │   ├── chapter1/
            │   │   └── page.tsx          ← Just config! (~80 lines)
            │   ├── chapter2/
            │   │   └── page.tsx          ← Just config! (~80 lines)
            │   └── chapter3/
            │       └── page.tsx          ← Just config! (~80 lines)
            ├── castle2/
            │   └── chapter1/
            │       └── page.tsx          ← Just config! (~80 lines)
            └── ...
```

## 🎯 How to Create a New Chapter

### Step 1: Copy the Template

Use any of the example files:
- `EXAMPLE_CASTLE2_CHAPTER1.tsx`
- `EXAMPLE_CASTLE5_CHAPTER1.tsx`
- Or `frontend/app/student/worldmap/castle1/chapter1/page-simplified.tsx`

```powershell
Copy-Item "EXAMPLE_CASTLE2_CHAPTER1.tsx" `
          "frontend/app/student/worldmap/castle3/chapter1/page.tsx"
```

### Step 2: Update the Configuration

Open the file and update the `config` object. Here's what to change:

```typescript
const config: ChapterConfig = {
  // 1. CHAPTER IDENTITY
  chapterKey: 'castle3-chapter1',              // ← Change castle and chapter number
  castleId: CHAPTER1_CASTLE_ID,                // ← From constants (stays same)
  chapterNumber: CHAPTER1_NUMBER,              // ← From constants (stays same)
  
  // 2. TASK IDs (check your constants file)
  lessonTaskIds: ['task-0', 'task-1', ...],    // ← List all lesson task IDs
  minigameTaskId: 'task-6',                    // ← Minigame task (after lessons)
  quizTaskIds: {
    quiz1: 'task-7',                           // ← Quiz 1 task
    quiz2: 'task-8',                           // ← Quiz 2 task
    quiz3: 'task-9',                           // ← Quiz 3 task
  },
  
  // 3. CONSTANTS (just pass through from your constants file)
  dialogue: CHAPTER1_DIALOGUE,
  sceneRanges: CHAPTER1_SCENE_RANGES,
  minigameLevels: CHAPTER1_MINIGAME_LEVELS,
  learningObjectives: CHAPTER1_LEARNING_OBJECTIVES,
  xpValues: CHAPTER1_XP_VALUES,
  concepts: CHAPTER1_CONCEPTS,
  
  // 4. DISPLAY INFO
  title: 'Chapter 1: The Tide of Shapes',      // ← Your chapter title
  subtitle: 'Castle 3 - Circle Sanctuary',     // ← Your subtitle
  castleName: 'Circle Sanctuary',              // ← Castle name
  welcomeMessage: 'Welcome to the Circle Sanctuary!',  // ← Welcome text
  castleRoute: '/student/worldmap/castle3',    // ← Castle route
  
  // 5. WIZARD INFO
  wizard: {
    name: 'Archim, Keeper of the Curved Path', // ← Wizard name
    image: '/images/archim-circle-wizard.png', // ← Wizard image
  },
  
  // 6. RELIC INFO
  relic: {
    name: 'Circle Compass',                    // ← Relic name
    image: '/images/relics/circle-compass.png',// ← Relic image
    description: 'You mastered circles!...',   // ← Relic description
  },
  
  // 7. OTHER
  narrationKey: 'chapter1-lesson-intro',       // ← Usually stays same
  logPrefix: '[Castle3Ch1]',                   // ← For debugging logs
  
  // 8. MINIGAME COMPONENT
  MinigameComponent: CirclePartsMinigame,      // ← Your minigame component
};
```

### Step 3: Update the Import

Change the constants import path to match your castle/chapter:

```typescript
// Before
import { ... } from '@/constants/chapters/castle2/chapter1';

// After (for Castle 3, Chapter 1)
import { ... } from '@/constants/chapters/castle3/chapter1';
```

### Step 4: Import the Correct Minigame

```typescript
// Before
import { AngleTypeMinigame } from '@/components/chapters/minigames';

// After (for Castle 3, Chapter 1)
import { CirclePartsMinigame } from '@/components/chapters/minigames';
```

### Step 5: Done! ✅

That's it! Your chapter page is ready.

## 📋 Quick Checklist

After creating a chapter, verify:

- [ ] `chapterKey` format: `'castle{N}-chapter{M}'`
- [ ] Constants import path matches castle/chapter
- [ ] Minigame component imported and used in config
- [ ] Task IDs are sequential (lesson → minigame → quizzes)
- [ ] `castleRoute` points to correct castle
- [ ] `logPrefix` format: `'[Castle{N}Ch{M}]'`

## 🎨 Complete Example

Here's a complete Castle 3, Chapter 1 page:

```typescript
'use client';

import ChapterPageBase, { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { CirclePartsMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_DIALOGUE,
  CHAPTER1_SCENE_RANGES,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_XP_VALUES,
  CHAPTER1_CONCEPTS,
} from '@/constants/chapters/castle3/chapter1';

const config: ChapterConfig = {
  chapterKey: 'castle3-chapter1',
  castleId: CHAPTER1_CASTLE_ID,
  chapterNumber: CHAPTER1_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5'],
  minigameTaskId: 'task-6',
  quizTaskIds: {
    quiz1: 'task-7',
    quiz2: 'task-8',
    quiz3: 'task-9',
  },
  
  dialogue: CHAPTER1_DIALOGUE,
  sceneRanges: CHAPTER1_SCENE_RANGES,
  minigameLevels: CHAPTER1_MINIGAME_LEVELS,
  learningObjectives: CHAPTER1_LEARNING_OBJECTIVES,
  xpValues: CHAPTER1_XP_VALUES,
  concepts: CHAPTER1_CONCEPTS,
  
  title: 'Chapter 1: The Tide of Shapes',
  subtitle: 'Castle 3 - Circle Sanctuary',
  castleName: 'Circle Sanctuary',
  welcomeMessage: 'Welcome to the Circle Sanctuary!',
  castleRoute: '/student/worldmap/castle3',
  
  wizard: {
    name: 'Archim, Keeper of the Curved Path',
    image: '/images/archim-circle-wizard.png',
  },
  
  relic: {
    name: 'Circle Compass',
    image: '/images/relics/circle-compass.png',
    description: 'You have mastered the parts of a circle! The Circle Compass reveals circular patterns.',
  },
  
  narrationKey: 'chapter1-lesson-intro',
  logPrefix: '[Castle3Ch1]',
  
  MinigameComponent: CirclePartsMinigame,
};

export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
```

**That's only 57 lines!** (vs 800+ before)

## 🔧 How to Find Task IDs

Open your chapter's constants file (`frontend/constants/chapters/castle{N}/chapter{M}.ts`) and look for:

1. **Lesson tasks**: Count dialogue items with `taskId` field
   ```typescript
   { scene: 'lesson', key: 'intro', text: "...", taskId: 'task-0' },
   { scene: 'lesson', key: 'center', text: "...", taskId: 'task-1' },
   // etc.
   ```

2. **Minigame task**: Next number after last lesson
   - If lessons are task-0 to task-5 (6 lessons), minigame is `task-6`

3. **Quiz tasks**: Three sequential IDs after minigame
   - If minigame is task-6, quizzes are `task-7, task-8, task-9`

## 🎮 Common Minigame Components

| Minigame Component | Used In |
|-------------------|---------|
| `GeometryPhysicsGame` | Castle 1, Chapter 1 |
| `LineBasedMinigame` | Castle 1, Chapter 2 |
| `ShapeBasedMinigame` | Castle 1, Chapter 3 |
| `AngleTypeMinigame` | Castle 2, Chapter 1 |
| `CirclePartsMinigame` | Castle 3, Chapter 1 |
| `CircumferenceMinigame` | Castle 3, Chapter 2 |
| `PolygonIdentificationMinigame` | Castle 4, Chapter 1 |
| `PlaneVsSolidMinigame` | Castle 5, Chapter 1 |

## 💡 Benefits

1. **90% less code** per chapter page
2. **No logic duplication** - all shared in base component
3. **Easy bug fixes** - fix once in base, all chapters benefit
4. **Type-safe** - TypeScript ensures config is correct
5. **Readable** - just configuration, no complex logic

## 🚨 When to Edit ChapterPageBase.tsx

Only edit the base component if you need to:
- Add a new feature to ALL chapters
- Fix a bug that affects all chapters
- Change core chapter behavior

For individual chapter customization, just update the config!

## 📚 Reference

- **Base Component**: `frontend/components/chapters/ChapterPageBase.tsx`
- **Examples**: See `EXAMPLE_*.tsx` files in project root
- **Chapter Details**: `COMPLETE_CHAPTER_REFERENCE.md`
- **Constants**: `frontend/constants/chapters/castle{N}/chapter{M}.ts`

---

**Result**: Creating a new chapter is now as simple as copying an example and filling in ~10 configuration values! 🎉
