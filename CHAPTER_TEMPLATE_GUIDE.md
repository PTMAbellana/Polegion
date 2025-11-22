# Chapter Template Customization Guide

## Quick Reference: What to Change When Copying Chapter Templates

Use this guide when copying a chapter template to create new chapters across different castles.

---

## 🔍 Find & Replace (Universal Changes)

When copying from **Chapter X** to **Chapter Y** within the same castle:

```bash
# Example: Chapter 1 → Chapter 2
CHAPTERX_     →  CHAPTERY_
[ChapterX]    →  [ChapterY]
'chapterX-    →  'chapterY-
ChapterXPage  →  ChapterYPage
castleN-chapterX  →  castleN-chapterY
```

---

## 📋 Castle 1: Euclidean Spire Quest

### **Chapter 1: The Point of Origin**
```javascript
// Constants
CHAPTER_KEY = 'castle1-chapter1'
Function: Chapter1Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3 (4 tasks)
Minigame task: task-4
Quiz tasks: task-5, task-6, task-7

// Content
Title: "Chapter 1: The Point of Origin"
Subtitle: "Castle 1 - Euclidean Spire Quest"
Minigame: GeometryPhysicsGame
Relic: "Pointlight Crystal"
Relic Image: "/images/relics/pointlight-crystal.png"
Wizard: "Archim, Keeper of the Euclidean Spire"
Wizard Image: "/images/archim-wizard.png"
Welcome: "Welcome to the Euclidean Spire!"
```

### **Chapter 2: Lines and Angles**
```javascript
// Constants
CHAPTER_KEY = 'castle1-chapter2'
Function: Chapter2Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3, task-4 (5 tasks)
Minigame task: task-5
Quiz tasks: task-6, task-7, task-8

// Content
Title: "Chapter 2: Lines and Angles"
Subtitle: "Castle 1 - Euclidean Spire Quest"
Minigame: LineBasedMinigame
Relic: "Line Compass"
Relic Image: "/images/relics/line-compass.png"
Wizard: "Archim, Keeper of the Euclidean Spire"
Wizard Image: "/images/archim-wizard.png"
Welcome: "Welcome to the Euclidean Spire!"
```

### **Chapter 3: Shapes and Polygons**
```javascript
// Constants
CHAPTER_KEY = 'castle1-chapter3'
Function: Chapter3Page()

// Task IDs
Lesson tasks: task-0 to task-19 (20 tasks)
Minigame task: task-20
Quiz tasks: task-21, task-22, task-23

// Content
Title: "Chapter 3: Shapes and Polygons"
Subtitle: "Castle 1 - Euclidean Spire Quest"
Minigame: ShapeBasedMinigame
Relic: "Polygon Prism"
Relic Image: "/images/relics/polygon-prism.png"
Wizard: "Archim, Keeper of the Euclidean Spire"
Wizard Image: "/images/archim-wizard.png"
Welcome: "Welcome to the Euclidean Spire!"
```

---

## 📋 Castle 2: [Castle Name]

### **Chapter 1: [Chapter Title]**
```javascript
// Constants
CHAPTER_KEY = 'castle2-chapter1'
Function: Chapter1Page()

// Task IDs (UPDATE BASED ON YOUR CHAPTER)
Lesson tasks: task-0, task-1, task-2, task-3
Minigame task: task-4
Quiz tasks: task-5, task-6, task-7

// Content (UPDATE ALL)
Title: "[Your Chapter Title]"
Subtitle: "Castle 2 - [Your Castle Name]"
Minigame: [YourMinigameComponent]
Relic: "[Your Relic Name]"
Relic Image: "/images/relics/[your-relic].png"
Wizard: "[Wizard Name]"
Wizard Image: "/images/[wizard].png"
Welcome: "Welcome to [Castle Name]!"
```

### **Chapter 2: [Chapter Title]**
```javascript
// Constants
CHAPTER_KEY = 'castle2-chapter2'
Function: Chapter2Page()

// Task IDs (UPDATE BASED ON YOUR CHAPTER)
Lesson tasks: task-0, task-1, task-2, task-3, task-4
Minigame task: task-5
Quiz tasks: task-6, task-7, task-8

// Content (UPDATE ALL)
Title: "[Your Chapter Title]"
Subtitle: "Castle 2 - [Your Castle Name]"
Minigame: [YourMinigameComponent]
Relic: "[Your Relic Name]"
Relic Image: "/images/relics/[your-relic].png"
Wizard: "[Wizard Name]"
Wizard Image: "/images/[wizard].png"
Welcome: "Welcome to [Castle Name]!"
```

### **Chapter 3: [Chapter Title]**
```javascript
// Constants
CHAPTER_KEY = 'castle2-chapter3'
Function: Chapter3Page()

// Task IDs (UPDATE BASED ON YOUR CHAPTER)
Lesson tasks: task-0 to task-X
Minigame task: task-X+1
Quiz tasks: task-X+2, task-X+3, task-X+4

// Content (UPDATE ALL)
Title: "[Your Chapter Title]"
Subtitle: "Castle 2 - [Your Castle Name]"
Minigame: [YourMinigameComponent]
Relic: "[Your Relic Name]"
Relic Image: "/images/relics/[your-relic].png"
Wizard: "[Wizard Name]"
Wizard Image: "/images/[wizard].png"
Welcome: "Welcome to [Castle Name]!"
```

---

## 📋 Castle 3-5: Template

Follow the same pattern as Castle 2. Each castle should have:
- 3 chapters
- Unique wizard and castle name
- Progressive task IDs (lesson → minigame → quiz)
- Chapter-specific relics and minigames

---

## 🎯 Step-by-Step Customization Checklist

### Step 1: Copy Template
- Copy `castle1/chapter1/page.tsx` to your target location

### Step 2: Update Imports & Constants
- [ ] Update minigame import (line 11)
- [ ] Update constant imports path (line 16-25)
- [ ] Change all `CHAPTER1_*` to `CHAPTER2_*` (or appropriate number)

### Step 3: Update Keys & Function
- [ ] Update `CHAPTER_KEY` (line 38)
- [ ] Update function name `Chapter1Page()` (line 41)

### Step 4: Update Task IDs
- [ ] Minigame task ID in `getInitialScene()` (line 73)
- [ ] Lesson task check in `getInitialXP()` (line 150)
- [ ] Minigame task ID in `getInitialXP()` (line 151)
- [ ] Quiz task IDs in `getInitialXP()` (line 152)
- [ ] Minigame task ID in `handleMinigameComplete()` (line 427)
- [ ] Quiz task IDs in `handleQuizSubmit()` (line 437)
- [ ] Quiz task IDs in `handleRetakeQuiz()` (lines 577-579 & 586-588)

### Step 5: Update Console Logs & Messages
- [ ] All `[Chapter1]` → `[Chapter2]` in console.logs
- [ ] Loading message (line 644)
- [ ] Return route in `handleReturnToCastle()` (line 637)

### Step 6: Update Content & UI
- [ ] Modal title (line 669)
- [ ] Top bar title and subtitle (lines 677-678)
- [ ] Welcome text (line 703)
- [ ] Minigame component (line 736)
- [ ] Relic name, image, description (lines 772-774)
- [ ] Wizard name and image (lines 789-790)

### Step 7: Verify Constants Usage
- [ ] All CHAPTER constants updated throughout
- [ ] All narration keys updated (e.g., `'chapter1-lesson-intro'`)

---

## 📝 Task ID Pattern

### Standard Pattern
```
Lesson tasks:   task-0, task-1, ..., task-N
Minigame task:  task-(N+1)
Quiz tasks:     task-(N+2), task-(N+3), task-(N+4)
```

### Examples
```
Chapter 1 (4 lessons):  0,1,2,3 → 4 → 5,6,7
Chapter 2 (5 lessons):  0,1,2,3,4 → 5 → 6,7,8
Chapter 3 (20 lessons): 0-19 → 20 → 21,22,23
```

---

## 🔧 Common Mistakes to Avoid

1. ❌ Forgetting to update task IDs in `handleRetakeQuiz()` (appears in 3 places)
2. ❌ Missing console.log prefix updates `[Chapter1]` → `[Chapter2]`
3. ❌ Not updating the lesson task check in `getInitialXP()` for chapters with different numbers of lessons
4. ❌ Forgetting to change the minigame component import
5. ❌ Leaving old CHAPTER constants in the code
6. ❌ Not updating the route in `handleReturnToCastle()`

---

## ✅ Verification

After copying and customizing, search for:
- [ ] `CHAPTER1` (should find NONE if copying to Chapter 2+)
- [ ] `task-4` (verify it matches your minigame task)
- [ ] `task-5` (verify it matches your first quiz task)
- [ ] `[Chapter1]` (should find NONE if copying to Chapter 2+)
- [ ] `'castle1-chapter1'` (should match your CHAPTER_KEY)

Run the file through TypeScript compiler to catch any missed constant names!

---

## 📚 Additional Resources

- All constants are defined in: `/constants/chapters/castle{N}/chapter{N}.ts`
- Minigame components in: `/components/chapters/minigames/`
- Task IDs must match those defined in your chapter constants file
- XP values are defined per chapter in the constants file

---

**Pro Tip**: After copying, do a full-file search for the old chapter number to ensure nothing was missed!
