# How to Use the Chapter Page Template

This guide explains how to use `CHAPTER_PAGE_TEMPLATE.tsx` to quickly create new chapter pages.

## 📋 Quick Start

1. **Copy the template file**
   ```powershell
   Copy-Item "frontend/app/student/worldmap/CHAPTER_PAGE_TEMPLATE.tsx" `
             "frontend/app/student/worldmap/castle{N}/chapter{M}/page.tsx"
   ```

2. **Search for `CUSTOMIZE:` in the file** - there are only **8 customization points**

3. **Use `COMPLETE_CHAPTER_REFERENCE.md`** to find the exact values for your castle/chapter

## 🎯 The 8 Customization Points

### 1. Minigame Component Import (Line ~17)
```typescript
// CUSTOMIZE: Import the appropriate minigame component
import { GeometryPhysicsGame } from '@/components/chapters/minigames';
```

**Common minigames:**
- `GeometryPhysicsGame` - Castle 1, Chapter 1
- `LineBasedMinigame` - Castle 1, Chapter 2
- `ShapeBasedMinigame` - Castle 1, Chapter 3
- `AngleTypeMinigame` - Castle 2, Chapter 1
- `CirclePartsMinigame` - Castle 3, Chapter 1
- `PolygonIdentificationMinigame` - Castle 4, Chapter 1
- `PlaneVsSolidMinigame` - Castle 5, Chapter 1

### 2. Constants Import Path (Line ~24)
```typescript
// CUSTOMIZE: Update import path to match your castle and chapter
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  // ... etc
} from '@/constants/chapters/castle1/chapter1';
```

**Pattern:** `'@/constants/chapters/castle{N}/chapter{M}'`

**Examples:**
- Castle 1, Chapter 1: `'@/constants/chapters/castle1/chapter1'`
- Castle 2, Chapter 3: `'@/constants/chapters/castle2/chapter3'`
- Castle 5, Chapter 4: `'@/constants/chapters/castle5/chapter4'`

### 3. Configuration Section (Lines ~50-100)

This is the main configuration block with **7 sub-sections**:

#### 3a. CHAPTER_KEY
```typescript
const CHAPTER_KEY = 'castle1-chapter1';
```
**Pattern:** `'castle{N}-chapter{M}'`

#### 3b. MINIGAME_TASK_ID
```typescript
const MINIGAME_TASK_ID = 'task-4';
```

**How to find:**
1. Count lesson dialogue items with `taskId` in your constants file
2. Minigame task is the next number after last lesson
3. Example: 4 lessons (task-0 to task-3) → minigame is `task-4`

#### 3c. QUIZ_TASK_IDS
```typescript
const QUIZ_TASK_IDS = {
  quiz1: 'task-5',
  quiz2: 'task-6',
  quiz3: 'task-7',
} as const;
```

**Pattern:** Sequential IDs after minigame
- If minigame is `task-4`, quizzes are `task-5, 6, 7`
- If minigame is `task-6`, quizzes are `task-7, 8, 9`

#### 3d. LESSON_TASK_IDS
```typescript
const LESSON_TASK_IDS = ['task-0', 'task-1', 'task-2', 'task-3'];
```

**How to find:** List all task IDs from lesson dialogue in your constants file

**Examples:**
- 4 lessons: `['task-0', 'task-1', 'task-2', 'task-3']`
- 5 lessons: `['task-0', 'task-1', 'task-2', 'task-3', 'task-4']`
- 7 lessons: `['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6']`

#### 3e. LOG_PREFIX
```typescript
const LOG_PREFIX = '[Castle1Ch1]';
```

**Pattern:** `'[Castle{N}Ch{M}]'`

**Examples:**
- Castle 1, Chapter 1: `'[Castle1Ch1]'`
- Castle 2, Chapter 3: `'[Castle2Ch3]'`
- Castle 5, Chapter 4: `'[Castle5Ch4]'`

#### 3f. CHAPTER_INFO Object
```typescript
const CHAPTER_INFO = {
  title: 'Chapter 1: The Point of Origin',
  subtitle: 'Castle 1 - Euclidean Spire Quest',
  castleName: 'Euclidean Spire',
  welcomeMessage: 'Welcome to the Euclidean Spire!',
  castleRoute: '/student/worldmap/castle1',
  
  wizard: {
    name: 'Archim, Keeper of the Euclidean Spire',
    image: '/images/archim-wizard.png',
  },
  
  relic: {
    name: 'Pointlight Crystal',
    image: '/images/relics/pointlight-crystal.png',
    description: 'You have mastered the fundamental building blocks of geometry!...',
  },
  
  narrationKey: 'chapter1-lesson-intro',
} as const;
```

**Find these values in:** `COMPLETE_CHAPTER_REFERENCE.md`

**Key patterns:**
- `castleRoute`: `/student/worldmap/castle{N}`
- `narrationKey`: `chapter{M}-lesson-intro`

### 4. Function Name (Line ~107)
```typescript
export default function Chapter1Page() {
```

**Pattern:** `Chapter{M}Page`

**Examples:**
- Chapter 1: `Chapter1Page`
- Chapter 2: `Chapter2Page`
- Chapter 3: `Chapter3Page`

### 5. Minigame Component in Render (Line ~623)
```typescript
{currentScene === 'minigame' && (
  <GeometryPhysicsGame
    level={CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel]}
    onComplete={handleMinigameComplete}
    styleModule={minigameStyles}
  />
)}
```

**Must match:** Minigame component from customization point #1

## 📝 Step-by-Step Example

Let's create **Castle 2, Chapter 1: The Hall of Rays**

### Step 1: Copy Template
```powershell
Copy-Item "frontend/app/student/worldmap/CHAPTER_PAGE_TEMPLATE.tsx" `
          "frontend/app/student/worldmap/castle2/chapter1/page.tsx"
```

### Step 2: Look up values in COMPLETE_CHAPTER_REFERENCE.md
```
Castle 2, Chapter 1:
- Title: "Chapter 1: The Hall of Rays"
- Subtitle: "Castle 2 - Polygon Citadel"
- Castle: "Polygon Citadel"
- Wizard: "Sylvan, Guardian of the Polygon Citadel"
- Lesson tasks: 6 (task-0 to task-5)
- Minigame: task-6
- Quizzes: task-7, 8, 9
- Minigame type: AngleTypeMinigame
```

### Step 3: Make 8 customizations

**1. Import minigame** (line ~17):
```typescript
import { AngleTypeMinigame } from '@/components/chapters/minigames';
```

**2. Import constants** (line ~24):
```typescript
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  // ... etc
} from '@/constants/chapters/castle2/chapter1';
```

**3a. CHAPTER_KEY** (line ~52):
```typescript
const CHAPTER_KEY = 'castle2-chapter1';
```

**3b. MINIGAME_TASK_ID** (line ~60):
```typescript
const MINIGAME_TASK_ID = 'task-6';
```

**3c. QUIZ_TASK_IDS** (line ~63):
```typescript
const QUIZ_TASK_IDS = {
  quiz1: 'task-7',
  quiz2: 'task-8',
  quiz3: 'task-9',
} as const;
```

**3d. LESSON_TASK_IDS** (line ~72):
```typescript
const LESSON_TASK_IDS = ['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
```

**3e. LOG_PREFIX** (line ~78):
```typescript
const LOG_PREFIX = '[Castle2Ch1]';
```

**3f. CHAPTER_INFO** (line ~81):
```typescript
const CHAPTER_INFO = {
  title: 'Chapter 1: The Hall of Rays',
  subtitle: 'Castle 2 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  welcomeMessage: 'Welcome to the Polygon Citadel!',
  castleRoute: '/student/worldmap/castle2',
  
  wizard: {
    name: 'Sylvan, Guardian of the Polygon Citadel',
    image: '/images/sylvan-wizard.png',
  },
  
  relic: {
    name: '[Check castle2/chapter1.ts CHAPTER1_RELIC]',
    image: '/images/relics/[relic-name].png',
    description: '[Check castle2/chapter1.ts for description]',
  },
  
  narrationKey: 'chapter1-lesson-intro',
} as const;
```

**4. Function name** (line ~107):
```typescript
export default function Chapter1Page() {
```

**5. Minigame component** (line ~623):
```typescript
{currentScene === 'minigame' && (
  <AngleTypeMinigame
    level={CHAPTER1_MINIGAME_LEVELS[currentMinigameLevel]}
    onComplete={handleMinigameComplete}
    styleModule={minigameStyles}
  />
)}
```

### Step 4: Done! ✅

The chapter is ready to use. All state management, XP tracking, quiz handling, and navigation is already implemented.

## 🔍 Quick Verification Checklist

After customization, search for these in your new file:

- [ ] No occurrences of `CUSTOMIZE:` remain (all replaced)
- [ ] `CHAPTER_KEY` matches pattern `castle{N}-chapter{M}`
- [ ] Function name is `Chapter{M}Page`
- [ ] Minigame import matches minigame component in render
- [ ] All task IDs are sequential and match your constants file
- [ ] `LESSON_TASK_IDS` count matches lesson dialogue count in constants
- [ ] `castleRoute` points to correct castle

## 🎨 What's Already Built-In

The template includes (no customization needed):

✅ **State Management**
- Zustand store integration
- Auto-save progress
- Resume from where you left off

✅ **XP System**
- Automatic XP award on lesson/minigame/quiz completion
- XP reconstruction from completed tasks
- Backend sync

✅ **Quiz System**
- 3-quiz sequential flow
- Retake quiz functionality
- Score tracking and display

✅ **Navigation**
- Return to castle
- Restart chapter with confirmation modal
- Scene transitions

✅ **Audio**
- Mute toggle
- Auto-advance toggle
- Narration support

✅ **Dialogue System**
- Typewriter effect
- Auto-advance
- Message index tracking

## 📚 Reference Files

- **Template:** `frontend/app/student/worldmap/CHAPTER_PAGE_TEMPLATE.tsx`
- **Chapter Details:** `COMPLETE_CHAPTER_REFERENCE.md`
- **Constants Location:** `frontend/constants/chapters/castle{N}/chapter{M}.ts`

## 💡 Pro Tips

1. **Use Find & Replace:** After copying, use VS Code's Find (Ctrl+F) to search for `CUSTOMIZE:` and jump to each customization point

2. **Check Constants First:** Always look at your chapter's constants file to get accurate task IDs and lesson count

3. **Minigame Components:** If unsure which minigame to use, check `COMPLETE_CHAPTER_REFERENCE.md` for examples from similar chapters

4. **Test Task IDs:** After setup, check browser console logs to verify task IDs are being marked complete correctly

5. **Relic Info:** If relic details aren't in the reference, check your constants file for `CHAPTER{N}_RELIC` export

## ⚠️ Common Mistakes

❌ **Wrong Task IDs:** Minigame task doesn't match lesson count
- ✅ Fix: Count lesson tasks in constants, then use next number

❌ **Mismatched Minigame:** Import doesn't match render component
- ✅ Fix: Ensure both use same component name

❌ **Function Name:** Forgot to update from `Chapter1Page`
- ✅ Fix: Change to match your chapter number (Chapter2Page, etc.)

❌ **Castle Route:** Wrong castle number in route
- ✅ Fix: `/student/worldmap/castle{N}` where N is your castle number

---

**Questions?** Check `COMPLETE_CHAPTER_REFERENCE.md` for all castle/chapter details!
