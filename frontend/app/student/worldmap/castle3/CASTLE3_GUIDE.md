# Castle 3: Circle Sanctuary - Implementation Guide

## 🏰 Castle Overview

**Name**: Circle Sanctuary  
**ID**: circle-keep  
**Region**: Golden Shores  
**Theme**: Coastal fortress with golden/amber color scheme  
**Description**: Where waves trace perfect arcs and circles rule the tides

## 📚 Educational Content

### Chapter 1: The Tide of Shapes
**Objective**: Identify the parts of a circle  
**Topics**:
- Center (point equidistant from all points)
- Radius (line from center to circle edge)
- Diameter (line through center, endpoints on circle)
- Chord (line segment with endpoints on circle)
- Arc (portion of circumference)
- Sector (pie-slice region)

**Mini-Game**: "Ripple Reveal"
- Interactive circle with labeled points
- Tap/drag correct segment when prompted
- Visual feedback: water sparkles on correct, ripples fade on incorrect
- Progressive difficulty with overlapping shapes

**Reward**: Pearl of the Center 🌊

---

### Chapter 2: The Path of the Perimeter
**Objective**: Understand and compute circumference  
**Topics**:
- Circumference formula: C = 2πr or C = πd
- Using π (3.14 or symbolic)
- Measuring curved perimeters
- Word problems

**Mini-Game**: "The Coral Compass"
- Circles with different radii shown
- Calculate circumference to unlock gates
- Random values generated each time
- Drag glowing line around edge to visualize

**Reward**: Shell of Motion 🐚

---

### Chapter 3: The Chamber of Space
**Objective**: Calculate area of circles  
**Topics**:
- Area formula: A = πr²
- Semi-circles (½ area)
- Sectors (fractional areas)
- Word problems with area

**Mini-Game**: "Lunar Pools"
- Varying circle radii
- Calculate area with hints initially
- Some pools half-filled or sector-shaped
- Correct answers fill with glowing water

**Reward**: Orb of Infinity ⭐

## 🎨 Visual Theme

### Color Palette
- **Primary Gold**: #FFD700
- **Dark Gold**: #B8860B (Goldenrod)
- **Amber**: #FFBF00
- **Coastal Brown**: #8B4513 (SaddleBrown)
- **Light Cream**: #FFFACD (LemonChiffon)
- **Sandy**: #F4E4C1
- **Ocean Accent**: #4682B4 (SteelBlue)
- **Success Green**: #32CD32 (LimeGreen)

### Typography
- **Title Font**: UnifrakturMaguntia (medieval style)
- **Body Font**: Cinzel (elegant serif)
- **Size Range**: Responsive with clamp()

### Effects
- Golden glow on titles
- Particle effects with golden tint
- Shimmer on hover
- Coastal wave animations

## 📁 Files Created

### 1. Chapter Selection Page
**File**: `frontend/app/student/worldmap/castle3/selection.tsx`

**Features**:
- Uses reusable `CastleAdventure` components
- 3 chapters with progressive unlocking
- LocalStorage progress tracking
- Golden/coastal theme via CSS
- Wizard Archimedes character

**Components Used**:
```tsx
import {
  CastleIntro,
  CastleHeader,
  ChapterList,
  WizardCharacter,
  ParticleEffect,
  type Chapter
} from '@/components/world/CastleAdventure';
import { WorldMapButton } from '@/components/world/shared';
```

---

### 2. CSS Theme File
**File**: `frontend/styles/castle3-chapter-selection.module.css`

**Theme Customizations**:
- Background: Golden gradient overlay
- Borders: #FFD700 (gold)
- Text: #FFFACD (cream) and #FFD700 (gold)
- Panels: Brown (rgba(139, 69, 19, 0.8))
- Particles: Golden (#FFD700)
- Hover: Amber highlights
- Progress bar: Gold-to-orange gradient

**Key Classes**:
- `.chapterSelectionContainer` - Main container with coastal background
- `.titlePanel` - Golden bordered header
- `.chapterPanel` - Brown panel with gold accents
- `.chapterItem` - Coastal theme with amber hover
- `.startButton` - Gold gradient button
- `.particle` - Golden floating particles

## 🎮 Chapter Structure

### Progress Flow
1. **Chapter 1**: Always unlocked (identify circle parts)
2. **Chapter 2**: Unlocks when Chapter 1 complete (circumference)
3. **Chapter 3**: Unlocks when Chapter 2 complete (area)

### LocalStorage Keys
```javascript
'castle3-chapter1-completed' // Boolean
'castle3-chapter2-completed' // Boolean
'castle3-chapter3-completed' // Boolean
```

## 🔧 Implementation Status

### ✅ Completed
- [x] Chapter selection page with reusable components
- [x] Golden/coastal CSS theme
- [x] 3 chapter definitions with objectives
- [x] Progressive unlock system
- [x] LocalStorage integration
- [x] Responsive design
- [x] Wizard character integration
- [x] Particle effects

### 📝 To Do (Chapter Games)
- [ ] Chapter 1: Ripple Reveal mini-game
- [ ] Chapter 2: Coral Compass mini-game
- [ ] Chapter 3: Lunar Pools mini-game
- [ ] Circle drawing/interaction components
- [ ] Formula calculator components
- [ ] Answer validation logic
- [ ] Completion tracking

## 🎯 Using Reusable Components

The chapter selection page demonstrates the component library:

```tsx
// Same structure for all castles, just change:
// 1. CSS import
import styles from '@/styles/castle3-chapter-selection.module.css';

// 2. Castle name/location
<CastleHeader
  castleName="Circle Sanctuary"
  location="Golden Shores"
  ...
/>

// 3. Chapter content
const chapters: Chapter[] = [
  {
    id: 1,
    title: "The Tide of Shapes",
    objective: "Identify the parts of a circle...",
    reward: "Pearl of the Center",
    emoji: "🌊"
  },
  // ... more chapters
];

// 4. LocalStorage keys
localStorage.getItem('castle3-chapter1-completed')
```

## 🎨 CSS Customization Example

To create different theme (e.g., blue/ocean variant):

```css
/* Change colors only */
.titlePanel {
  border: 2px solid #4682B4; /* Ocean blue instead of gold */
}

.chapterItem:hover:not(.locked) {
  background: rgba(70, 130, 180, 0.1); /* Blue tint */
  border-left-color: #4682B4;
}

.progressFill {
  background: linear-gradient(90deg, #4682B4, #5F9EA0); /* Blue gradient */
}
```

## 🚀 Next Steps

### 1. Create Chapter 1 Game
Use `ChapterGame` components:
```tsx
import {
  GameLayout,
  GameHeader,
  ProgressBar,
  WizardDialogue,
  ControlPanel
} from '@/components/world/ChapterGame';
```

Create `castle3-chapter1.module.css` for game styling.

### 2. Implement Circle Drawing
- SVG-based circle component
- Interactive parts highlighting
- Click/tap detection on circle regions
- Visual feedback animations

### 3. Add Formula Components
- Input fields for circumference calculation
- π symbol display options
- Step-by-step hints
- Answer validation with tolerance

### 4. Integrate Progress
- Mark chapters complete on finish
- Update localStorage
- Unlock next chapter
- Award rewards

## 📖 Story Integration

### Wizard Archimedes Dialogue
Use for each chapter:

**Chapter 1 Intro**:
> "Ah, the Golden Shores... where straight edges end and the curve begins. Can you identify each part of the perfect circle?"

**Chapter 2 Intro**:
> "The circular gate awaits! Measure not by width, but by the path around."

**Chapter 3 Intro**:
> "The pool reflects the heavens. How much space does each circle hold within?"

## 🎨 Visual Assets Needed

- `castle3-background.png` - Coastal/beach castle scene
- Circle diagrams for Chapter 1
- Coral gate images for Chapter 2
- Lunar pool graphics for Chapter 3
- Golden particle sprites (optional)

## 📊 Comparison with Castle 4

| Aspect | Castle 3 | Castle 4 |
|--------|----------|----------|
| Theme | Golden/Coastal | Purple/Fractal |
| Chapters | 3 | 4 |
| Primary Color | #FFD700 (Gold) | #66BBFF (Blue) |
| Background | Brown/Amber | Dark Purple |
| Topic | Circles | Polygons |
| Components | ✅ Same | ✅ Same |

**Result**: Only CSS changes needed! 🎉

---

**Status**: Chapter selection complete and ready for chapter development!
