import type { MinigameQuestion } from '@/types/common/quiz';

// Dialogue data
export const CHAPTER3_OPENING_DIALOGUE = [
  "Well done, Apprentice! You've mastered points and lines.",
  "Now we venture deeper into the Spire, where shapes come alive!",
  "This chamber holds the Shape Summoner — an ancient artifact.",
  "Here, you'll learn to identify and classify geometric shapes.",
  "Triangles, squares, rectangles, circles, and more await your discovery!",
  "Are you ready to breathe life into the Shapes of the Spire?"
];

export const CHAPTER3_LESSON_DIALOGUE = [
  "Let me teach you about the fundamental shapes of geometry...",
  "First, basic shapes: TRIANGLE (3 sides) and CIRCLE (perfectly round, no sides).",
  "Now, the QUADRILATERALS — all shapes with 4 sides! SQUARE (equal sides, right angles), RECTANGLE (opposite sides equal).",
  "More quadrilaterals: RHOMBUS (equal sides, slanted), PARALLELOGRAM (opposite sides parallel), TRAPEZOID (one pair parallel), and KITE (adjacent sides equal).",
  "PENTAGON (5 sides), HEXAGON (6 sides), HEPTAGON (7 sides), OCTAGON (8 sides like a STOP sign)!",
  "NONAGON (9 sides), DECAGON (10 sides), HENDECAGON (11 sides), and DODECAGON (12 sides)!",
  "Each polygon is named by its number of sides. 'Gon' means angle in Greek!",
  "Master these shapes, and you'll understand the building blocks of all geometry!"
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
    instruction: 'Which shape is a TRIANGLE? (3 sides, 3 vertices)',
    hint: 'Triangles have exactly 3 straight sides and 3 corners.',
    correctAnswer: 'triangle',
    shapes: [
      { id: 'triangle', name: 'Triangle', type: 'triangle', properties: { sides: 3, angles: 3 } },
      { id: 'square', name: 'Square', type: 'square', properties: { sides: 4, angles: 4 } },
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon', properties: { sides: 5, angles: 5 } },
    ],
  },
  {
    id: 'level-2-quadrilaterals',
    instruction: 'Which shape is a SQUARE? (4 equal sides, 4 right angles)',
    hint: 'Squares have 4 equal sides and all corners are 90° angles.',
    correctAnswer: 'square',
    shapes: [
      { id: 'rectangle', name: 'Rectangle', type: 'rectangle', properties: { sides: 4, angles: 4 } },
      { id: 'square', name: 'Square', type: 'square', properties: { sides: 4, angles: 4 } },
      { id: 'triangle', name: 'Triangle', type: 'triangle', properties: { sides: 3, angles: 3 } },
    ],
  },
  {
    id: 'level-3-pentagon',
    instruction: 'Which shape is a PENTAGON? (5 sides, 5 vertices)',
    hint: 'Pentagons have exactly 5 straight sides. The Pentagon building has this shape!',
    correctAnswer: 'pentagon',
    shapes: [
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon', properties: { sides: 6, angles: 6 } },
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon', properties: { sides: 5, angles: 5 } },
      { id: 'square', name: 'Square', type: 'square', properties: { sides: 4, angles: 4 } },
    ],
  },
  {
    id: 'level-4-hexagon',
    instruction: 'Which shape is a HEXAGON? (6 sides, 6 vertices)',
    hint: 'Hexagons have 6 straight sides. Honeycombs are made of hexagons!',
    correctAnswer: 'hexagon',
    shapes: [
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon', properties: { sides: 5, angles: 5 } },
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon', properties: { sides: 6, angles: 6 } },
      { id: 'circle', name: 'Circle', type: 'circle', properties: { sides: 0, angles: 0 } },
    ],
  },
  {
    id: 'level-5-heptagon',
    instruction: 'Which shape is a HEPTAGON? (7 sides, 7 vertices)',
    hint: 'Heptagons have 7 straight sides. The prefix "hepta" means seven!',
    correctAnswer: 'heptagon',
    shapes: [
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon', properties: { sides: 6, angles: 6 } },
      { id: 'heptagon', name: 'Heptagon', type: 'heptagon', properties: { sides: 7, angles: 7 } },
      { id: 'octagon', name: 'Octagon', type: 'octagon', properties: { sides: 8, angles: 8 } },
    ],
  },
  {
    id: 'level-6-octagon',
    instruction: 'Which shape is an OCTAGON? (8 sides, 8 vertices)',
    hint: 'Octagons have 8 straight sides. Think of a STOP sign!',
    correctAnswer: 'octagon',
    shapes: [
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon', properties: { sides: 6, angles: 6 } },
      { id: 'heptagon', name: 'Heptagon', type: 'heptagon', properties: { sides: 7, angles: 7 } },
      { id: 'octagon', name: 'Octagon', type: 'octagon', properties: { sides: 8, angles: 8 } },
    ],
  },
  {
    id: 'level-7-parallelogram',
    instruction: 'Which shape is a PARALLELOGRAM? (4 sides, opposite sides parallel)',
    hint: 'Parallelograms have opposite sides that are parallel and equal in length.',
    correctAnswer: 'parallelogram',
    shapes: [
      { id: 'rectangle', name: 'Rectangle', type: 'rectangle', properties: { sides: 4, angles: 4 } },
      { id: 'parallelogram', name: 'Parallelogram', type: 'parallelogram', properties: { sides: 4, angles: 4 } },
      { id: 'trapezoid', name: 'Trapezoid', type: 'trapezoid', properties: { sides: 4, angles: 4 } },
    ],
  },
  {
    id: 'level-8-circle',
    instruction: 'Which shape is a CIRCLE? (No sides, perfectly round)',
    hint: 'Circles are perfectly round with no corners or straight edges!',
    correctAnswer: 'circle',
    shapes: [
      { id: 'pentagon', name: 'Pentagon', type: 'pentagon', properties: { sides: 5, angles: 5 } },
      { id: 'circle', name: 'Circle', type: 'circle', properties: { sides: 0, angles: 0 } },
      { id: 'hexagon', name: 'Hexagon', type: 'hexagon', properties: { sides: 6, angles: 6 } },
    ],
  },
];

// Learning objectives
export const CHAPTER3_LEARNING_OBJECTIVES = [
  { key: 'task-0', label: 'Learn: Basic Shapes (Triangle, Circle)' },
  { key: 'task-1', label: 'Learn: Quadrilaterals Part 1' },
  { key: 'task-2', label: 'Learn: Quadrilaterals Part 2' },
  { key: 'task-3', label: 'Learn: Pentagon to Octagon' },
  { key: 'task-4', label: 'Learn: Nonagon to Dodecagon' },
  { key: 'task-5', label: 'Learn: Polygon Naming' },
  { key: 'task-6', label: 'Minigame' },
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
