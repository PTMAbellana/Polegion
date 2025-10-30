import type { MinigameLine, MinigameQuestion } from '@/types/common/quiz';

// Dialogue data
export const CHAPTER2_OPENING_DIALOGUE = [
  "Ah, Apprentice! You've brought life back to the Points and Paths of the Spire.",
  "But our journey continues deeper — into the Paths of Power!",
  "These radiant lines you see… they do not all behave the same.",
  "Some walk side by side, never meeting. Others collide and part ways.",
  "And a few meet with perfect balance — forming right angles!",
  "Let us explore the dance of direction together!",
];

export const CHAPTER2_LESSON_DIALOGUE = [
  "When two lines travel side by side, never touching, they share parallel harmony!",
  "Parallel lines — forever apart, yet always equal in distance. A lesson in quiet companionship!",
  "Some lines meet and then diverge. These are intersecting lines.",
  "When two paths meet like travelers at a crossroads, they intersect. No balance, no order — only direction and destiny!",
  "Ah! The rarest bond of all — perpendicular lines! When they meet at 90°, their energy forms perfect symmetry.",
  "Your eyes are sharp! Skew lines dwell in different planes, never crossing nor aligning. Like stars that shine apart in the vast sky.",
  "Now let us test your understanding!",
];

export const CHAPTER2_MINIGAME_DIALOGUE = [
  "Excellent! Now identify the types of lines I present to you.",
  "Click on the lines that match the description.",
  "Choose wisely, young geometer!",
];

// Minigame level structures
export const CHAPTER2_MINIGAME_LEVELS: MinigameQuestion[] = [
  {
    id: 'level-1-parallel',
    instruction: 'Select BOTH parallel lines: Lines that travel side by side, never touching, always the same distance apart.',
    hint: 'Parallel lines never meet and maintain equal distance. Look for TWO lines that run in the same direction!',
    correctAnswer: 'line-a,line-b',
    lines: [
      { id: 'line-a', x1: 20, y1: 80, x2: 780, y2: 80, label: 'A' },
      { id: 'line-b', x1: 20, y1: 150, x2: 780, y2: 150, label: 'B' },
      { id: 'line-c', x1: 170, y1: 270, x2: 470, y2: 340, label: 'C' },
      { id: 'line-d', x1: 200, y1: 370, x2: 500, y2: 300, label: 'D' },
    ],
  },
  {
    id: 'level-2-intersecting',
    instruction: 'Select the line that intersects with BOTH parallel lines.',
    hint: 'Look for the line that crosses through both of the parallel lines.',
    correctAnswer: 'line-c',
    lines: [
      // First parallel horizontal line
      { id: 'line-a', x1: 50, y1: 120, x2: 750, y2: 120, label: 'A' },
      // Second parallel horizontal line
      { id: 'line-b', x1: 50, y1: 280, x2: 750, y2: 280, label: 'B' },
      // Diagonal line that intersects both A and B
      { id: 'line-c', x1: 100, y1: 50, x2: 700, y2: 350, label: 'C' },
    ],
  },
  {
    id: 'level-3-perpendicular',
    instruction: 'Select ALL lines that form a 90° angle (perpendicular) with each other.',
    hint: 'Perpendicular lines intersect at exactly 90 degrees, forming a perfect right angle. Look for a vertical and horizontal line!',
    correctAnswer: 'line-a,line-b',
    lines: [
      { id: 'line-a', x1: 300, y1: 50, x2: 300, y2: 350, label: 'A' },
      { id: 'line-b', x1: 100, y1: 200, x2: 500, y2: 200, label: 'B' },
      { id: 'line-c', x1: 150, y1: 100, x2: 450, y2: 300, label: 'C' },
    ],
  },
];

// Learning objectives
export const CHAPTER2_LEARNING_OBJECTIVES = [
  { key: 'task-0', label: 'Learn: Parallel Lines' },
  { key: 'task-1', label: 'Learn: Intersecting Lines' },
  { key: 'task-2', label: 'Learn: Perpendicular Lines' },
  { key: 'task-3', label: 'Learn: Skew Lines' },
  { key: 'task-4', label: 'Minigame' },
  { key: 'task-5', label: 'Pass Quiz 1' },
  { key: 'task-6', label: 'Pass Quiz 2' },
  { key: 'task-7', label: 'Pass Quiz 3' },
];

// XP Values
export const CHAPTER2_XP_VALUES = {
  lesson: 30,
  minigame: 45,
  quiz1: 20,
  quiz2: 25,
  quiz3: 30,
  total: 150,
};

// Castle and Chapter IDs
export const CHAPTER2_CASTLE_ID = 'cd5ddb70-b4ba-46cb-85fd-d66e5735619f';
export const CHAPTER2_NUMBER = 2;
