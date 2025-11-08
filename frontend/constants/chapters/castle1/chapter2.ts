import type { MinigameLine, MinigameQuestion } from '@/types/common/quiz';

// Dialogue data
export const CHAPTER2_OPENING_DIALOGUE = [
  "Ah, Apprentice! You've brought life back to the Points and Paths of the Spire.",
  "But our journey continues deeper, into the Paths of Power!",
  "These radiant lines you see… they do not all behave the same.",
  "Some walk side by side, never meeting. Others collide and part ways.",
  "And a few meet with perfect balance, forming right angles!",
  "Let us explore the dance of direction together!",
];

export const CHAPTER2_LESSON_DIALOGUE = [
  { key: 'plane', text: "Before we explore lines, let us understand the canvas they rest upon: the PLANE! A plane is a flat surface that extends infinitely, like an endless sheet of paper.", taskId: 'task-0' },
  { key: 'parallel', text: "When two lines travel side by side on a plane, never touching, they share parallel harmony!", taskId: 'task-1' },
  { key: 'parallel-detail', text: "Parallel lines, forever apart, yet always equal in distance. A lesson in quiet companionship!" },
  { key: 'intersecting', text: "Some lines meet and then diverge. These are intersecting lines.", taskId: 'task-2' },
  { key: 'intersecting-detail', text: "When two paths meet like travelers at a crossroads, they intersect. No balance, no order, only direction and destiny!" },
  { key: 'perpendicular', text: "Ah! The rarest bond of all, perpendicular lines! When they meet at 90°, their energy forms perfect symmetry.", taskId: 'task-3' },
  { key: 'skew', text: "Your eyes are sharp! Skew lines dwell in different planes, never crossing nor aligning. Like stars that shine apart in the vast sky.", taskId: 'task-4' },
  { key: 'practice', text: "Now let us test your understanding!" },
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
      // Two horizontal parallel lines (A and B)
      { id: 'line-a', x1: 50, y1: 100, x2: 750, y2: 100, label: 'A' },
      { id: 'line-b', x1: 50, y1: 200, x2: 750, y2: 200, label: 'B' },
      // One diagonal line (C) - clearly NOT parallel
      { id: 'line-c', x1: 100, y1: 280, x2: 700, y2: 360, label: 'C' },
      // One vertical line (D) - clearly NOT parallel to A or B
      { id: 'line-d', x1: 400, y1: 250, x2: 400, y2: 380, label: 'D' },
    ],
  },
  {
    id: 'level-2-intersecting',
    instruction: 'Select the line that intersects with BOTH parallel lines.',
    hint: 'Look for the line that crosses through both of the parallel lines.',
    correctAnswer: 'line-c',
    lines: [
      // First parallel horizontal line at top
      { id: 'line-a', x1: 50, y1: 100, x2: 750, y2: 100, label: 'A' },
      // Second parallel horizontal line at bottom
      { id: 'line-b', x1: 50, y1: 300, x2: 750, y2: 300, label: 'B' },
      // Diagonal line that intersects both A and B
      { id: 'line-c', x1: 150, y1: 50, x2: 650, y2: 350, label: 'C' },
    ],
  },
  {
    id: 'level-3-perpendicular',
    instruction: 'Select ALL lines that form a 90° angle (perpendicular) with each other.',
    hint: 'Perpendicular lines intersect at exactly 90 degrees, forming a perfect right angle. Look for a vertical and horizontal line!',
    correctAnswer: 'line-a,line-b',
    lines: [
      // Vertical line (A)
      { id: 'line-a', x1: 400, y1: 50, x2: 400, y2: 350, label: 'A' },
      // Horizontal line (B) - intersects A at 90°
      { id: 'line-b', x1: 100, y1: 200, x2: 700, y2: 200, label: 'B' },
      // Diagonal line (C) - NOT perpendicular
      { id: 'line-c', x1: 150, y1: 100, x2: 650, y2: 300, label: 'C' },
    ],
  },
];

// Concept cards for lesson scene
export const CHAPTER2_CONCEPTS = [
  {
    key: 'plane',
    title: 'Plane',
    description: 'A plane is a flat surface that extends infinitely in all directions, like an endless sheet of paper. It has no thickness.',
    image: '/images/geometry/plane.png',
    taskId: 'task-0',
  },
  {
    key: 'parallel',
    title: 'Parallel Lines',
    description: 'Parallel lines travel side by side on the same plane, never touching. They maintain equal distance forever.',
    image: '/images/geometry/parallel-lines.png',
    taskId: 'task-1',
  },
  {
    key: 'intersecting',
    title: 'Intersecting Lines',
    description: 'Intersecting lines cross each other at a point. They meet and then diverge in different directions.',
    image: '/images/geometry/intersecting-lines.png',
    taskId: 'task-2',
  },
  {
    key: 'perpendicular',
    title: 'Perpendicular Lines',
    description: 'Perpendicular lines intersect at exactly 90°, forming a perfect right angle. They create perfect symmetry.',
    image: '/images/geometry/perpendicular-lines.png',
    taskId: 'task-3',
  },
  {
    key: 'skew',
    title: 'Skew Lines',
    description: 'Skew lines exist in different planes. They never cross and are not parallel. Like stars shining apart in the vast sky.',
    image: '/images/geometry/skew-lines.png',
    taskId: 'task-4',
  },
];

// Learning objectives
export const CHAPTER2_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'plane', label: 'Learn: Plane', type: 'lesson' },
  { id: 'task-1', key: 'parallel', label: 'Learn: Parallel Lines', type: 'lesson' },
  { id: 'task-2', key: 'intersecting', label: 'Learn: Intersecting Lines', type: 'lesson' },
  { id: 'task-3', key: 'perpendicular', label: 'Learn: Perpendicular Lines', type: 'lesson' },
  { id: 'task-4', key: 'skew', label: 'Learn: Skew Lines', type: 'lesson' },
  { id: 'task-5', key: 'minigame', label: 'Minigame', type: 'minigame' },
  { id: 'task-6', key: 'quiz1', label: 'Pass Quiz 1', type: 'quiz' },
  { id: 'task-7', key: 'quiz2', label: 'Pass Quiz 2', type: 'quiz' },
  { id: 'task-8', key: 'quiz3', label: 'Pass Quiz 3', type: 'quiz' },
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
