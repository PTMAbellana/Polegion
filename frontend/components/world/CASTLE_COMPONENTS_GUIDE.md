# Castle Adventure Component Library

This component library provides reusable React components for creating castle adventure experiences in the Polegion game. The components are designed to be style-agnostic, allowing you to create different castles by simply changing the CSS modules while keeping the component structure identical.

## Component Structure

```
components/world/
├── CastleAdventure/        # Castle chapter selection screen components
│   ├── CastleIntro.tsx     # Intro overlay with castle name
│   ├── CastleHeader.tsx    # Title and progress bar
│   ├── ChapterCard.tsx     # Individual chapter card
│   ├── ChapterList.tsx     # Chapter list container
│   ├── WizardCharacter.tsx # Wizard image wrapper
│   ├── ParticleEffect.tsx  # Background particle animations
│   └── index.ts           # Barrel exports
├── ChapterGame/           # Chapter puzzle game components
│   ├── GameLayout.tsx     # Main game container
│   ├── GameHeader.tsx     # Game title and puzzle counter
│   ├── ProgressBar.tsx    # Progress indicator
│   ├── WizardDialogue.tsx # Wizard message display
│   ├── ControlPanel.tsx   # Game control buttons
│   └── index.ts          # Barrel exports
└── shared/               # Shared components
    ├── WorldMapButton.tsx # World map navigation button
    └── index.ts          # Barrel exports
```

## Usage Examples

### 1. Castle Chapter Selection Page (Castle Adventure)

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CastleIntro,
  CastleHeader,
  ChapterList,
  WizardCharacter,
  ParticleEffect,
  Chapter
} from '@/components/world/CastleAdventure';
import { WorldMapButton } from '@/components/world/shared';
import styles from '@/styles/castle4-adventure.module.css'; // Change for each castle

const Castle4Page = () => {
  const router = useRouter();
  const [showIntro, setShowIntro] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState(1);

  // Define chapters (customize for each castle)
  const chapters: Chapter[] = [
    {
      id: 1,
      number: 1,
      title: 'Lines of Symmetry',
      objective: 'Discover the symmetrical patterns',
      reward: 'Symmetry Badge',
      locked: false,
      completed: false,
      emoji: '🔷'
    },
    // ... more chapters
  ];

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleStartChapter = () => {
    router.push(`/student/worldmap/castle4/chapter${selectedChapter}`);
  };

  return (
    <div className={styles.container}>
      <CastleIntro 
        show={showIntro}
        castleName="Fractal Bastion"
        subtitle="Master the Geometry"
        styles={styles}
      />

      <ParticleEffect count={15} styles={styles} />

      <WorldMapButton 
        onClick={() => router.push('/student/worldmap')}
        styles={styles}
      />

      <div className={styles.contentWrapper}>
        <CastleHeader
          castleName="Fractal Bastion"
          location="The Mathematical Realm"
          completedChapters={0}
          totalChapters={4}
          styles={styles}
        />

        <div className={styles.mainContent}>
          <WizardCharacter 
            imagePath="/images/wizard.png"
            alt="Castle Wizard"
            styles={styles}
          />

          <ChapterList
            chapters={chapters}
            selectedChapter={selectedChapter}
            onSelectChapter={setSelectedChapter}
            onStartChapter={handleStartChapter}
            styles={styles}
          />
        </div>
      </div>
    </div>
  );
};

export default Castle4Page;
```

### 2. Chapter Puzzle Game Page

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  GameLayout,
  GameHeader,
  ProgressBar,
  WizardDialogue,
  ControlPanel
} from '@/components/world/ChapterGame';
import styles from '@/styles/castle4-chapter4.module.css'; // Change for each chapter

const Chapter4Page = () => {
  const router = useRouter();
  const [currentPuzzle, setCurrentPuzzle] = useState(1);
  const totalPuzzles = 6;

  // Define control panel buttons
  const controlButtons = [
    {
      label: 'Previous',
      onClick: () => setCurrentPuzzle(prev => Math.max(1, prev - 1)),
      disabled: currentPuzzle === 1,
      icon: 'previous' as const,
      variant: 'previous' as const
    },
    {
      label: 'Back to Chapter Map',
      onClick: () => router.push('/student/worldmap/castle4'),
      icon: 'home' as const,
      variant: 'default' as const
    },
    {
      label: 'Next',
      onClick: () => setCurrentPuzzle(prev => Math.min(totalPuzzles, prev + 1)),
      disabled: currentPuzzle === totalPuzzles,
      icon: 'next' as const,
      variant: 'next' as const
    }
  ];

  return (
    <GameLayout styles={styles}>
      <GameHeader
        title="Polygon Angles"
        currentPuzzle={currentPuzzle}
        totalPuzzles={totalPuzzles}
        styles={styles}
      />

      <ProgressBar
        current={currentPuzzle}
        total={totalPuzzles}
        styles={styles}
      />

      <div className={styles.gameArea}>
        {/* Your puzzle content here */}
      </div>

      <WizardDialogue
        message="Select the correct angle for each polygon!"
        styles={styles}
      />

      <ControlPanel
        buttons={controlButtons}
        styles={styles}
      />
    </GameLayout>
  );
};

export default Chapter4Page;
```

## Creating a New Castle

To create a new castle (e.g., Castle 5), follow these steps:

### Step 1: Create CSS Module

Create `frontend/styles/castle5-adventure.module.css`:

```css
/* Copy structure from castle4-adventure.module.css */
/* Change colors, fonts, backgrounds to match Castle 5 theme */

.container {
  background: url('/images/castle5-bg.jpg'); /* New background */
  /* ... rest of styles with Castle 5 theme colors */
}

.titlePanel {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
  /* ... */
}

/* Keep all class names identical, only change values */
```

### Step 2: Create Castle Page

Create `frontend/app/student/worldmap/castle5/page.tsx`:

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CastleIntro,
  CastleHeader,
  ChapterList,
  WizardCharacter,
  ParticleEffect,
  Chapter
} from '@/components/world/CastleAdventure';
import { WorldMapButton } from '@/components/world/shared';
import styles from '@/styles/castle5-adventure.module.css'; // New CSS module

const Castle5Page = () => {
  // ... exact same structure as Castle 4
  // Only change: castle name, chapters array content, styles import
};

export default Castle5Page;
```

### Step 3: Create Chapter CSS Modules

For each chapter, create CSS modules (e.g., `castle5-chapter1.module.css`, `castle5-chapter2.module.css`, etc.) with your custom styling.

### Step 4: Create Chapter Pages

Create chapter pages using the ChapterGame components with your new CSS modules.

## Key Principles

1. **Component Structure is Fixed**: Never modify component logic when creating new castles
2. **Styling is Flexible**: All visual customization happens in CSS modules
3. **CSS Class Names Must Match**: Keep all className references identical across castles
4. **Props Provide Content**: Change castle names, chapter titles, images via props
5. **Barrel Exports**: Always import from index files for clean code

## CSS Class Requirements

### For CastleAdventure components:
- `.container`, `.contentWrapper`, `.mainContent`
- `.titlePanel`, `.castleTitle`, `.castleLocation`
- `.progressSection`, `.progressBar`, `.progressFill`
- `.chapterList`, `.chapterCard`, `.chapterIcon`, `.chapterInfo`
- `.wizardCharacter`, `.particle`
- `.backButton`, `.backButtonImage`, `.backButtonText`
- `.introOverlay`, `.introContent`, `.spinner`

### For ChapterGame components:
- `.chapterContainer`, `.headerPanel`, `.chapterTitle`, `.puzzleCounter`
- `.progressBar`, `.progressFill`
- `.gameArea`, `.centralArea`, `.puzzlePanel`, `.infoPanel`
- `.wizardDialogue`, `.wizardImage`, `.wizardMessage`
- `.controlPanel`, `.controlButton`, `.previousButton`, `.nextButton`

## TypeScript Interfaces

### Chapter Interface
```tsx
interface Chapter {
  id: number;
  number: number;
  title: string;
  objective: string;
  reward: string;
  locked: boolean;
  completed: boolean;
  emoji: string;
}
```

### ControlPanelButton Interface
```tsx
interface ControlPanelButton {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  icon?: 'previous' | 'home' | 'next';
  variant?: 'previous' | 'default' | 'next';
}
```

## Benefits

- ✅ **Consistency**: All castles share the same component structure
- ✅ **Maintainability**: Fix bugs once, apply to all castles
- ✅ **Scalability**: Create 10 castles by just creating 10 CSS files
- ✅ **Theme Flexibility**: Each castle can have unique visual identity
- ✅ **Type Safety**: Full TypeScript support with proper interfaces
- ✅ **Clean Code**: Barrel exports keep imports organized

## Migration Example

Before (Castle-specific hardcoded component):
```tsx
<div className={styles.titlePanel}>
  <h1 className={styles.castleTitle}>Fractal Bastion</h1>
  {/* ... hardcoded structure */}
</div>
```

After (Reusable component):
```tsx
<CastleHeader
  castleName="Fractal Bastion"  // Easy to change per castle
  location="The Mathematical Realm"
  completedChapters={progress}
  totalChapters={4}
  styles={styles}  // CSS module changes per castle
/>
```

## Testing Checklist

When creating a new castle, verify:
- [ ] Intro animation plays correctly
- [ ] Progress bar calculates correctly
- [ ] Chapters display with proper icons (lock/check/emoji)
- [ ] World map button navigates correctly
- [ ] Selected chapter highlights properly
- [ ] Start button navigates to correct chapter
- [ ] Wizard and particles animate
- [ ] All hover effects work
- [ ] Responsive layout maintains structure
- [ ] CSS theme colors apply consistently
