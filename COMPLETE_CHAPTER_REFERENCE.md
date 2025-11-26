# Complete Chapter Reference for All Castles

**Total Castles**: 5  
**Total Chapters**: 18  
**Last Updated**: Based on current constants files

---

## 📖 Quick Castle Overview

| Castle | Name | Guardian(s) | Chapters | Theme |
|--------|------|------------|----------|-------|
| Castle 1 | Euclidean Spire Quest | Archim | 3 | Points, Lines, Shapes |
| Castle 2 | Polygon Citadel | Sylvan, Constructor, Complementa, Solvera | 4 | Angles |
| Castle 3 | Circle Sanctuary | Archim | 3 | Circles |
| Castle 4 | Polygon Citadel | Polymus | 4 | Polygons |
| Castle 5 | Arcane Observatory | Dimensius | 4 | 2D/3D Geometry |

---

## 🏰 CASTLE 1: Euclidean Spire Quest

**Guardian**: Archim, Keeper of the Euclidean Spire (all chapters)  
**Theme**: Foundational geometry concepts

### **Chapter 1: The Point of Origin**
```javascript
// File: /constants/chapters/castle1/chapter1.ts
CHAPTER_KEY = 'castle1-chapter1'
Function: Chapter1Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3 (4 tasks)
Minigame task: task-4
Quiz tasks: task-5, task-6, task-7

// Content
Title: "Chapter 1: The Point of Origin"
Subtitle: "Castle 1 - Euclidean Spire Quest"
Theme: "Introduction to points and basic geometry"
Minigame: GeometryPhysicsGame
Relic: "Pointlight Crystal"
Relic Image: "/images/relics/pointlight-crystal.png"
Wizard: "Archim, Keeper of the Euclidean Spire"
Wizard Image: "/images/archim-wizard.png"
Welcome: "Welcome to the Euclidean Spire!"
XP: 20 (lesson), 30 (minigame), 50 (quiz)
```

### **Chapter 2: Lines and Angles**
```javascript
// File: /constants/chapters/castle1/chapter2.ts
CHAPTER_KEY = 'castle1-chapter2'
Function: Chapter2Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3, task-4 (5 tasks)
Minigame task: task-5
Quiz tasks: task-6, task-7, task-8

// Content
Title: "Chapter 2: Lines and Angles"
Subtitle: "Castle 1 - Euclidean Spire Quest"
Theme: "Lines, rays, segments, and basic angles"
Minigame: LineBasedMinigame
Relic: "Line Compass"
Relic Image: "/images/relics/line-compass.png"
Wizard: "Archim, Keeper of the Euclidean Spire"
Wizard Image: "/images/archim-wizard.png"
Welcome: "Welcome to the Euclidean Spire!"
XP: 30 (lesson), 45 (minigame), 75 (quiz)
```

### **Chapter 3: Shapes and Polygons**
```javascript
// File: /constants/chapters/castle1/chapter3.ts
CHAPTER_KEY = 'castle1-chapter3'
Function: Chapter3Page()

// Task IDs
Lesson tasks: task-0 to task-19 (20 tasks)
Minigame task: task-20
Quiz tasks: task-21, task-22, task-23

// Content
Title: "Chapter 3: Shapes and Polygons"
Subtitle: "Castle 1 - Euclidean Spire Quest"
Theme: "Polygon identification and classification"
Minigame: ShapeBasedMinigame
Relic: "Polygon Prism"
Relic Image: "/images/relics/polygon-prism.png"
Wizard: "Archim, Keeper of the Euclidean Spire"
Wizard Image: "/images/archim-wizard.png"
Welcome: "Welcome to the Euclidean Spire!"
XP: 40 (lesson), 60 (minigame), 100 (quiz)
```

---

## 🏰 CASTLE 2: Polygon Citadel (Angles)

**Guardians**: 4 different wizards (one per chapter)  
**Theme**: Comprehensive angle study

### **Chapter 1: The Hall of Rays**
```javascript
// File: /constants/chapters/castle2/chapter1.ts
CHAPTER_KEY = 'castle2-chapter1'
Function: Chapter1Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3, task-4, task-5 (6 tasks)
  - task-0: acute angles
  - task-1: right angles
  - task-2: obtuse angles
  - task-3: straight angles
  - task-4: reflex angles
  - task-5: protractor usage
Minigame task: task-6
Quiz tasks: task-7, task-8, task-9

// Content
Title: "Chapter 1: The Hall of Rays"
Subtitle: "Castle 2 - Polygon Citadel"
Theme: "Angle types and measurement (acute, right, obtuse, straight, reflex)"
Minigame: AngleTypeMinigame (identify angle types)
Relic: [Check castle2/chapter1.ts CHAPTER1_RELIC]
Wizard: "Sylvan, Guardian of the Polygon Citadel"
Wizard Image: "/images/sylvan-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 20 (lesson), 30 (minigame), 50 (quiz)
```

### **Chapter 2: The Chamber of Construction**
```javascript
// File: /constants/chapters/castle2/chapter2.ts
CHAPTER_KEY = 'castle2-chapter2'
Function: Chapter2Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 2: The Chamber of Construction"
Subtitle: "Castle 2 - Polygon Citadel"
Theme: "Constructing angles with protractor and compass"
Minigame: AngleConstructionMinigame
Relic: [Check castle2/chapter2.ts CHAPTER2_RELIC]
Wizard: "Constructor, Master of Angle Creation"
Wizard Image: "/images/constructor-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 30 (lesson), 45 (minigame), 75 (quiz)
```

### **Chapter 3: The Angle Forge**
```javascript
// File: /constants/chapters/castle2/chapter3.ts
CHAPTER_KEY = 'castle2-chapter3'
Function: Chapter3Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 3: The Angle Forge"
Subtitle: "Castle 2 - Polygon Citadel"
Theme: "Angle relationships (complementary, supplementary, adjacent, vertical)"
Minigame: AngleRelationshipMinigame
Relic: [Check castle2/chapter3.ts CHAPTER3_RELIC]
Wizard: "Complementa, Master of Angle Relationships"
Wizard Image: "/images/complementa-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 40 (lesson), 60 (minigame), 100 (quiz)
```

### **Chapter 4: The Temple of Solutions**
```javascript
// File: /constants/chapters/castle2/chapter4.ts
CHAPTER_KEY = 'castle2-chapter4'
Function: Chapter4Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 4: The Temple of Solutions"
Subtitle: "Castle 2 - Polygon Citadel"
Theme: "Solving angle problems and applications"
Minigame: AngleProblemSolvingMinigame
Relic: [Check castle2/chapter4.ts CHAPTER4_RELIC]
Wizard: "Solvera, Keeper of Geometric Wisdom"
Wizard Image: "/images/solvera-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 50 (lesson), 75 (minigame), 125 (quiz)
```

---

## 🏰 CASTLE 3: Circle Sanctuary

**Guardian**: Archim, Keeper of the Curved Path (all chapters)  
**Theme**: Circle geometry and measurements

### **Chapter 1: The Tide of Shapes**
```javascript
// File: /constants/chapters/castle3/chapter1.ts
CHAPTER_KEY = 'castle3-chapter1'
Function: Chapter1Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3, task-4, task-5 (6 tasks)
  - task-0: intro/center
  - task-1: radius
  - task-2: diameter
  - task-3: chord
  - task-4: arc
  - task-5: sector
Minigame task: task-6
Quiz tasks: task-7, task-8, task-9

// Content
Title: "Chapter 1: The Tide of Shapes"
Subtitle: "Castle 3 - Circle Sanctuary"
Theme: "Parts of a circle (center, radius, diameter, chord, arc, sector)"
Minigame: CirclePartsMinigame (identify circle components)
Relic: [Check castle3/chapter1.ts CHAPTER1_RELIC]
Wizard: "Archim, Keeper of the Curved Path"
Wizard Image: "/images/archim-circle-wizard.png"
Welcome: "Welcome to the Circle Sanctuary!"
XP: 20 (lesson), 30 (minigame), 50 (quiz)
```

### **Chapter 2: The Path of the Perimeter**
```javascript
// File: /constants/chapters/castle3/chapter2.ts
CHAPTER_KEY = 'castle3-chapter2'
Function: Chapter2Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 2: The Path of the Perimeter"
Subtitle: "Castle 3 - Circle Sanctuary"
Theme: "Circumference and circle measurements"
Minigame: CircumferenceMinigame
Relic: [Check castle3/chapter2.ts CHAPTER2_RELIC]
Wizard: "Archim, Keeper of the Curved Path"
Wizard Image: "/images/archim-circle-wizard.png"
Welcome: "Welcome to the Circle Sanctuary!"
XP: 30 (lesson), 45 (minigame), 75 (quiz)
```

### **Chapter 3: The Chamber of Space**
```javascript
// File: /constants/chapters/castle3/chapter3.ts
CHAPTER_KEY = 'castle3-chapter3'
Function: Chapter3Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 3: The Chamber of Space"
Subtitle: "Castle 3 - Circle Sanctuary"
Theme: "Circle area and applications"
Minigame: CircleAreaMinigame
Relic: [Check castle3/chapter3.ts CHAPTER3_RELIC]
Wizard: "Archim, Keeper of the Curved Path"
Wizard Image: "/images/archim-circle-wizard.png"
Welcome: "Welcome to the Circle Sanctuary!"
XP: 40 (lesson), 60 (minigame), 100 (quiz)
```

---

## 🏰 CASTLE 4: Polygon Citadel

**Guardian**: Polymus, Master of Many Sides (all chapters)  
**Theme**: Polygon properties and measurements

### **Chapter 1: The Gallery of Shapes**
```javascript
// File: /constants/chapters/castle4/chapter1.ts
CHAPTER_KEY = 'castle4-chapter1'
Function: Chapter1Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3, task-4, task-5 (6 tasks)
  - task-0: polygon definition
  - task-1: naming polygons
  - task-2: congruent concept
  - task-3: congruent example
  - task-4: similar concept
  - task-5: similar example
Minigame task: task-6
Quiz tasks: task-7, task-8, task-9

// Content
Title: "Chapter 1: The Gallery of Shapes"
Subtitle: "Castle 4 - Polygon Citadel"
Theme: "Identifying polygons, similar and congruent polygons"
Minigame: PolygonIdentificationMinigame (name polygons by side count)
Relic: [Check castle4/chapter1.ts CHAPTER1_RELIC]
Wizard: "Polymus, Master of Many Sides"
Wizard Image: "/images/polymus-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 20 (lesson), 30 (minigame), 50 (quiz)
```

### **Chapter 2: The Drawing Chamber**
```javascript
// File: /constants/chapters/castle4/chapter2.ts
CHAPTER_KEY = 'castle4-chapter2'
Function: Chapter2Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 2: The Drawing Chamber"
Subtitle: "Castle 4 - Polygon Citadel"
Theme: "Drawing and constructing polygons"
Minigame: PolygonDrawingMinigame
Relic: [Check castle4/chapter2.ts CHAPTER2_RELIC]
Wizard: "Polymus, Master of Many Sides"
Wizard Image: "/images/polymus-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 30 (lesson), 45 (minigame), 75 (quiz)
```

### **Chapter 3: The Hall of Angles**
```javascript
// File: /constants/chapters/castle4/chapter3.ts
CHAPTER_KEY = 'castle4-chapter3'
Function: Chapter3Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 3: The Hall of Angles"
Subtitle: "Castle 4 - Polygon Citadel"
Theme: "Polygon angle properties and calculations"
Minigame: PolygonAngleMinigame
Relic: [Check castle4/chapter3.ts CHAPTER3_RELIC]
Wizard: "Polymus, Master of Many Sides"
Wizard Image: "/images/polymus-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 40 (lesson), 60 (minigame), 100 (quiz)
```

### **Chapter 4: The Measurement Vault**
```javascript
// File: /constants/chapters/castle4/chapter4.ts
CHAPTER_KEY = 'castle4-chapter4'
Function: Chapter4Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 4: The Measurement Vault"
Subtitle: "Castle 4 - Polygon Citadel"
Theme: "Polygon perimeter and area"
Minigame: PolygonMeasurementMinigame
Relic: [Check castle4/chapter4.ts CHAPTER4_RELIC]
Wizard: "Polymus, Master of Many Sides"
Wizard Image: "/images/polymus-wizard.png"
Welcome: "Welcome to the Polygon Citadel!"
XP: 50 (lesson), 75 (minigame), 125 (quiz)
```

---

## 🏰 CASTLE 5: Arcane Observatory

**Guardian**: Dimensius, Guardian of Space (all chapters)  
**Theme**: 2D and 3D geometry

### **Chapter 1: The Hall of Planes**
```javascript
// File: /constants/chapters/castle5/chapter1.ts
CHAPTER_KEY = 'castle5-chapter1'
Function: Chapter1Page()

// Task IDs
Lesson tasks: task-0, task-1, task-2, task-3, task-4, task-5, task-6 (7 tasks)
  - task-0: plane figure intro
  - task-1: plane examples
  - task-2: solid intro
  - task-3: solid examples
  - task-4: difference
  - task-5: prism
  - task-6: pyramid
Minigame task: task-7
Quiz tasks: task-8, task-9, task-10

// Content
Title: "Chapter 1: The Hall of Planes"
Subtitle: "Castle 5 - Arcane Observatory"
Theme: "Identifying plane (2D) and solid (3D) figures"
Minigame: PlaneVsSolidMinigame (sort shapes into 2D/3D)
Relic: [Check castle5/chapter1.ts CHAPTER1_RELIC]
Wizard: "Dimensius, Guardian of Space"
Wizard Image: "/images/dimensius-wizard.png"
Welcome: "Welcome to the Arcane Observatory!"
XP: 20 (lesson), 30 (minigame), 50 (quiz)
```

### **Chapter 2: The Chamber of Perimeters**
```javascript
// File: /constants/chapters/castle5/chapter2.ts
CHAPTER_KEY = 'castle5-chapter2'
Function: Chapter2Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 2: The Chamber of Perimeters"
Subtitle: "Castle 5 - Arcane Observatory"
Theme: "Perimeter of 2D shapes"
Minigame: PerimeterMinigame
Relic: [Check castle5/chapter2.ts CHAPTER2_RELIC]
Wizard: "Dimensius, Guardian of Space"
Wizard Image: "/images/dimensius-wizard.png"
Welcome: "Welcome to the Arcane Observatory!"
XP: 30 (lesson), 45 (minigame), 75 (quiz)
```

### **Chapter 3: The Sanctum of Surfaces**
```javascript
// File: /constants/chapters/castle5/chapter3.ts
CHAPTER_KEY = 'castle5-chapter3'
Function: Chapter3Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 3: The Sanctum of Surfaces"
Subtitle: "Castle 5 - Arcane Observatory"
Theme: "Surface area of 3D shapes"
Minigame: SurfaceAreaMinigame
Relic: [Check castle5/chapter3.ts CHAPTER3_RELIC]
Wizard: "Dimensius, Guardian of Space"
Wizard Image: "/images/dimensius-wizard.png"
Welcome: "Welcome to the Arcane Observatory!"
XP: 40 (lesson), 60 (minigame), 100 (quiz)
```

### **Chapter 4: The Core of Volumes**
```javascript
// File: /constants/chapters/castle5/chapter4.ts
CHAPTER_KEY = 'castle5-chapter4'
Function: Chapter4Page()

// Task IDs
Lesson tasks: [Check file for exact count]
Minigame task: [task-N+1]
Quiz tasks: [task-N+2, task-N+3, task-N+4]

// Content
Title: "Chapter 4: The Core of Volumes"
Subtitle: "Castle 5 - Arcane Observatory"
Theme: "Volume of 3D shapes"
Minigame: VolumeMinigame
Relic: [Check castle5/chapter4.ts CHAPTER4_RELIC]
Wizard: "Dimensius, Guardian of Space"
Wizard Image: "/images/dimensius-wizard.png"
Welcome: "Welcome to the Arcane Observatory!"
XP: 50 (lesson), 75 (minigame), 125 (quiz)
```

---

## 📝 XP Progression Pattern

Consistent across ALL castles:

| Chapter | Lesson XP | Minigame XP | Quiz XP |
|---------|-----------|-------------|---------|
| Chapter 1 | 20 | 30 | 50 |
| Chapter 2 | 30 | 45 | 75 |
| Chapter 3 | 40 | 60 | 100 |
| Chapter 4 | 50 | 75 | 125 |

---

## 🎯 Quick Copy Guide

When copying from **Castle 1, Chapter 1** to another castle/chapter:

1. **Update CHAPTER_KEY**: `'castle1-chapter1'` → `'castle[N]-chapter[M]'`
2. **Update Function Name**: `Chapter1Page()` → `Chapter[M]Page()`
3. **Update Task IDs**: Check constants file for lesson count, then calculate minigame and quiz IDs
4. **Update Title & Subtitle**: Match castle and chapter name
5. **Update Theme**: From constants file first comment
6. **Update Minigame Component**: Based on chapter topic
7. **Update XP Values**: Follow the pattern above
8. **Update Wizard**: Check constants file for guardian name
9. **Update Welcome Message**: Match castle name
10. **Update Relic**: Check constants file CHAPTER[N]_RELIC export

---

## 📂 File Locations

**Constants**: `/constants/chapters/castle{N}/chapter{N}.ts`  
**Pages**: `/app/student/worldmap/castle{N}/chapter{N}/page.tsx`  
**Minigames**: `/components/chapters/minigames/`

---

**Note**: Items marked `[Check castle{N}/chapter{N}.ts ...]` require reading the specific constants file for exact values like relic names, exact task counts for chapters 2-4 in each castle.
