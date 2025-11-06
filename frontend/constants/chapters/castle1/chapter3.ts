import type { MinigameQuestion } from '@/types/common/quiz';

// Dialogue data
export const CHAPTER3_OPENING_DIALOGUE = [
  "Well done, Apprentice! You've mastered points and lines.",
  "Now we venture deeper into the Spire, where shapes come alive!",
  "This chamber holds the Shape Summoner, an ancient artifact.",
  "Here, you'll learn to identify and classify geometric shapes.",
  "Triangles, squares, rectangles, circles, and more await your discovery!",
  "Are you ready to breathe life into the Shapes of the Spire?"
];

export const CHAPTER3_LESSON_DIALOGUE = [
  "Let me introduce you to the fundamental shapes of geometry. Watch as they appear before you...",
  "First, the TRIANGLE, a shape with 3 sides and 3 corners. And the CIRCLE, perfectly round with no corners at all!",
  "Now behold the QUADRILATERALS, shapes with 4 sides! The SQUARE has 4 equal sides and 4 right angles. The RECTANGLE has opposite sides equal.",
  "More quadrilaterals appear: RHOMBUS (4 equal sides, slanted), PARALLELOGRAM (opposite sides parallel), TRAPEZOID (one pair parallel sides), and KITE (two pairs of adjacent equal sides).",
  "Next, the PENTAGON (5 sides), HEXAGON (6 sides), HEPTAGON (7 sides), and OCTAGON (8 sides like a STOP sign)!",
  "Finally, NONAGON (9 sides), DECAGON (10 sides), HENDECAGON (11 sides), and DODECAGON (12 sides)!",
  "Remember: Each polygon is named by its number of sides. The word 'gon' means angle in Greek. Master these shapes, and you've learned the building blocks of all geometry!"
];

export const CHAPTER3_MINIGAME_DIALOGUE = [
  "Now, let's practice! The Shape Summoner will show you various shapes.",
  "Click on the shapes that match the description. Some challenges require multiple selections!",
  "Choose wisely, young geometer!"
];

// Minigame level structures - Shape identification
export const CHAPTER3_MINIGAME_LEVELS: MinigameQuestion[] = [
  {
    id: 'level-1-triangle',
    instruction: 'Which shape is a TRIANGLE?',
    correctAnswer: 'triangle',
    shapes: [
      { id: 'triangle', name: 'Triangle', type: 'triangle' },
      { id: 'square', name: 'Square', type: 'square' },
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon' },
    ],
  },
  {
    id: 'level-2-quadrilaterals',
    instruction: 'Which shape is a SQUARE?',
    correctAnswer: 'square',
    shapes: [
      { id: 'rectangle', name: 'Rectangle', type: 'rectangle' },
      { id: 'square', name: 'Square', type: 'square' },
      { id: 'triangle', name: 'Triangle', type: 'triangle' },
    ],
  },
  {
    id: 'level-3-pentagon',
    instruction: 'Which shape is a PENTAGON?',
    correctAnswer: 'pentagon',
    shapes: [
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon' },
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon' },
      { id: 'square', name: 'Square', type: 'square' },
    ],
  },
  {
    id: 'level-4-hexagon',
    instruction: 'Which shape is a HEXAGON?',
    correctAnswer: 'hexagon',
    shapes: [
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon' },
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon' },
      { id: 'circle', name: 'Circle', type: 'circle' },
    ],
  },
  {
    id: 'level-5-heptagon',
    instruction: 'Which shape is a HEPTAGON?',
    correctAnswer: 'heptagon',
    shapes: [
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon' },
      { id: 'heptagon', name: 'Heptagon', type: 'heptagon' },
      { id: 'octagon', name: 'Octagon', type: 'octagon' },
    ],
  },
  {
    id: 'level-6-octagon',
    instruction: 'Which shape is an OCTAGON?',
    correctAnswer: 'octagon',
    shapes: [
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon' },
      { id: 'heptagon', name: 'Heptagon', type: 'heptagon' },
      { id: 'octagon', name: 'Octagon', type: 'octagon' },
    ],
  },
  {
    id: 'level-7-parallelogram',
    instruction: 'Which shape is a PARALLELOGRAM?',
    correctAnswer: 'parallelogram',
    shapes: [
      { id: 'rectangle', name: 'Rectangle', type: 'rectangle' },
      { id: 'parallelogram', name: 'Parallelogram', type: 'parallelogram' },
      { id: 'trapezoid', name: 'Trapezoid', type: 'trapezoid' },
    ],
  },
  {
    id: 'level-8-circle',
    instruction: 'Which shape is a CIRCLE?',
    correctAnswer: 'circle',
    shapes: [
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon' },
      { id: 'circle', name: 'Circle', type: 'circle' },
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon' },
    ],
  },
];

// Learning objectives
export const CHAPTER3_LEARNING_OBJECTIVES = [
  { key: 'task-0', label: 'Learn: Basic Shapes (Triangle, Circle)' },
  { key: 'task-1', label: 'Learn: Basic Quadrilaterals' },
  { key: 'task-2', label: 'Learn: Advanced Quadrilaterals' },
  { key: 'task-3', label: 'Learn: Pentagon to Octagon' },
  { key: 'task-4', label: 'Learn: Nonagon to Dodecagon' },
  { key: 'task-5', label: 'Learn: Polygon Naming Rules' },
  { key: 'task-6', label: 'Complete Minigame' },
  { key: 'task-7', label: 'Pass Quiz 1' },
  { key: 'task-8', label: 'Pass Quiz 2' },
  { key: 'task-9', label: 'Pass Quiz 3' },
];

// XP Values
export const CHAPTER3_XP_VALUES = {
  lesson: 40,
  minigame: 60,
  quiz1: 30,
  quiz2: 35,
  quiz3: 35,
  total: 200,
};

// Castle and Chapter IDs
export const CHAPTER3_CASTLE_ID = 'cd5ddb70-b4ba-46cb-85fd-d66e5735619f';
export const CHAPTER3_NUMBER = 3;
