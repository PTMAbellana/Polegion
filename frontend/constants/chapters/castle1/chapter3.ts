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
  { key: 'angles', text: "Let me introduce you to the concept of ANGLES! An angle forms when two rays meet at a common endpoint called the vertex.", taskId: 'task-0' },
  { key: 'polygons', text: "Now, let's explore POLYGONS - closed figures made of straight line segments!", taskId: 'task-1' },
  { key: 'polygon-def', text: "A POLYGON is a closed figure made of straight line segments. The word 'polygon' comes from Greek: 'poly' means many, and 'gon' means angle!", taskId: 'task-2' },
  { key: 'triangle', text: "First, the TRIANGLE - a polygon with 3 sides and 3 angles. It's the simplest polygon!", taskId: 'task-3' },
  { key: 'circle', text: "And here's the CIRCLE, perfectly round with no corners—not a polygon!", taskId: 'task-4' },
  { key: 'square', text: "Now behold the SQUARE - a quadrilateral with 4 equal sides and 4 right angles!", taskId: 'task-5' },
  { key: 'rectangle', text: "And the RECTANGLE - a quadrilateral with opposite sides equal and 4 right angles.", taskId: 'task-6' },
  { key: 'rhombus', text: "Meet the RHOMBUS - a quadrilateral with 4 equal sides, but slanted!", taskId: 'task-7' },
  { key: 'parallelogram', text: "Here's the PARALLELOGRAM - opposite sides are parallel and equal.", taskId: 'task-8' },
  { key: 'trapezoid', text: "The TRAPEZOID has one pair of parallel sides.", taskId: 'task-9' },
  { key: 'kite', text: "And the KITE has two pairs of adjacent equal sides!", taskId: 'task-10' },
  { key: 'pentagon', text: "Behold the PENTAGON - a polygon with 5 sides!", taskId: 'task-11' },
  { key: 'hexagon', text: "The HEXAGON has 6 sides - like a honeycomb!", taskId: 'task-12' },
  { key: 'heptagon', text: "The HEPTAGON has 7 sides!", taskId: 'task-13' },
  { key: 'octagon', text: "And the OCTAGON has 8 sides - like a STOP sign!", taskId: 'task-14' },
  { key: 'nonagon', text: "The NONAGON has 9 sides!", taskId: 'task-15' },
  { key: 'decagon', text: "The DECAGON has 10 sides!", taskId: 'task-16' },
  { key: 'hendecagon', text: "The HENDECAGON has 11 sides!", taskId: 'task-17' },
  { key: 'dodecagon', text: "And the DODECAGON has 12 sides!", taskId: 'task-18' },
  { key: 'summary', text: "Remember: Each polygon is named by its number of sides and angles. Master these shapes, and you've learned the building blocks of all geometry!", taskId: 'task-19' }
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

// Concept cards for lesson scene
export const CHAPTER3_CONCEPTS = [
  {
    key: 'angles',
    title: 'Angles',
    description: 'An angle forms when two rays meet at a common endpoint called the vertex.',
    image: '/images/castle1/angle.png',
    taskId: 'task-0',
  },
  {
    key: 'polygons',
    title: 'Polygons',
    description: 'Polygons are closed figures made of straight line segments.',
    image: '/images/castle1/polygon-intro.png',
    taskId: 'task-1',
  },
  {
    key: 'polygon-def',
    title: 'Polygon Definition',
    description: "The word 'polygon' comes from Greek: 'poly' (many) + 'gon' (angle). A polygon has straight sides that form a closed shape.",
    image: '/images/castle1/polygon.png',
    taskId: 'task-2',
  },
  {
    key: 'triangle',
    title: 'Triangle',
    description: 'A TRIANGLE has 3 sides and 3 angles. It is the simplest polygon.',
    image: '/images/castle1/triangle.png',
    taskId: 'task-3',
  },
  {
    key: 'circle',
    title: 'Circle',
    description: 'A CIRCLE is perfectly round with no corners—not a polygon!',
    image: '/images/castle1/circle.png',
    taskId: 'task-4',
  },
  {
    key: 'square',
    title: 'Square',
    description: 'A SQUARE has 4 equal sides and 4 right angles. All sides are the same length.',
    image: '/images/castle1/square.png',
    taskId: 'task-5',
  },
  {
    key: 'rectangle',
    title: 'Rectangle',
    description: 'A RECTANGLE has opposite sides equal and 4 right angles.',
    image: '/images/castle1/rectangle.png',
    taskId: 'task-6',
  },
  {
    key: 'rhombus',
    title: 'Rhombus',
    description: 'A RHOMBUS has 4 equal sides, but they are slanted (not right angles).',
    image: '/images/castle1/rhombus.png',
    taskId: 'task-7',
  },
  {
    key: 'parallelogram',
    title: 'Parallelogram',
    description: 'A PARALLELOGRAM has opposite sides that are parallel and equal in length.',
    image: '/images/castle1/parallelogram.png',
    taskId: 'task-8',
  },
  {
    key: 'trapezoid',
    title: 'Trapezoid',
    description: 'A TRAPEZOID has exactly one pair of parallel sides.',
    image: '/images/castle1/trapezoid.png',
    taskId: 'task-9',
  },
  {
    key: 'kite',
    title: 'Kite',
    description: 'A KITE has two pairs of adjacent sides that are equal in length.',
    image: '/images/castle1/kite.png',
    taskId: 'task-10',
  },
  {
    key: 'pentagon',
    title: 'Pentagon',
    description: 'A PENTAGON is a polygon with 5 sides and 5 angles.',
    image: '/images/castle1/pentagon.png',
    taskId: 'task-11',
  },
  {
    key: 'hexagon',
    title: 'Hexagon',
    description: 'A HEXAGON is a polygon with 6 sides and 6 angles. Think of a honeycomb!',
    image: '/images/castle1/hexagon.png',
    taskId: 'task-12',
  },
  {
    key: 'heptagon',
    title: 'Heptagon',
    description: 'A HEPTAGON is a polygon with 7 sides and 7 angles.',
    image: '/images/castle1/heptagon.png',
    taskId: 'task-13',
  },
  {
    key: 'octagon',
    title: 'Octagon',
    description: 'An OCTAGON is a polygon with 8 sides and 8 angles. Like a STOP sign!',
    image: '/images/castle1/octagon.png',
    taskId: 'task-14',
  },
  {
    key: 'nonagon',
    title: 'Nonagon',
    description: 'A NONAGON is a polygon with 9 sides and 9 angles.',
    image: '/images/castle1/nonagon.png',
    taskId: 'task-15',
  },
  {
    key: 'decagon',
    title: 'Decagon',
    description: 'A DECAGON is a polygon with 10 sides and 10 angles.',
    image: '/images/castle1/decagon.png',
    taskId: 'task-16',
  },
  {
    key: 'hendecagon',
    title: 'Hendecagon',
    description: 'A HENDECAGON is a polygon with 11 sides and 11 angles.',
    image: '/images/castle1/hendecagon.png',
    taskId: 'task-17',
  },
  {
    key: 'dodecagon',
    title: 'Dodecagon',
    description: 'A DODECAGON is a polygon with 12 sides and 12 angles.',
    image: '/images/castle1/dodecagon.png',
    taskId: 'task-18',
  },
  {
    key: 'summary',
    title: 'Polygon Naming',
    description: 'Each polygon is named by its number of sides and angles. These are the building blocks of geometry!',
    image: '/images/castle1/polygon-summary.png',
    taskId: 'task-19',
  },
];

// Learning objectives
export const CHAPTER3_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'angles', label: 'Learn: Angles', type: 'lesson' },
  { id: 'task-1', key: 'polygons', label: 'Learn: Polygons', type: 'lesson' },
  { id: 'task-2', key: 'polygon-def', label: 'Learn: Polygon Definition', type: 'lesson' },
  { id: 'task-3', key: 'triangle', label: 'Learn: Triangle', type: 'lesson' },
  { id: 'task-4', key: 'circle', label: 'Learn: Circle', type: 'lesson' },
  { id: 'task-5', key: 'square', label: 'Learn: Square', type: 'lesson' },
  { id: 'task-6', key: 'rectangle', label: 'Learn: Rectangle', type: 'lesson' },
  { id: 'task-7', key: 'rhombus', label: 'Learn: Rhombus', type: 'lesson' },
  { id: 'task-8', key: 'parallelogram', label: 'Learn: Parallelogram', type: 'lesson' },
  { id: 'task-9', key: 'trapezoid', label: 'Learn: Trapezoid', type: 'lesson' },
  { id: 'task-10', key: 'kite', label: 'Learn: Kite', type: 'lesson' },
  { id: 'task-11', key: 'pentagon', label: 'Learn: Pentagon', type: 'lesson' },
  { id: 'task-12', key: 'hexagon', label: 'Learn: Hexagon', type: 'lesson' },
  { id: 'task-13', key: 'heptagon', label: 'Learn: Heptagon', type: 'lesson' },
  { id: 'task-14', key: 'octagon', label: 'Learn: Octagon', type: 'lesson' },
  { id: 'task-15', key: 'nonagon', label: 'Learn: Nonagon', type: 'lesson' },
  { id: 'task-16', key: 'decagon', label: 'Learn: Decagon', type: 'lesson' },
  { id: 'task-17', key: 'hendecagon', label: 'Learn: Hendecagon', type: 'lesson' },
  { id: 'task-18', key: 'dodecagon', label: 'Learn: Dodecagon', type: 'lesson' },
  { id: 'task-19', key: 'summary', label: 'Learn: Polygon Naming Rules', type: 'lesson' },
  { id: 'task-20', key: 'minigame', label: 'Complete Minigame', type: 'minigame' },
  { id: 'task-21', key: 'quiz1', label: 'Pass Quiz 1', type: 'quiz' },
  { id: 'task-22', key: 'quiz2', label: 'Pass Quiz 2', type: 'quiz' },
  { id: 'task-23', key: 'quiz3', label: 'Pass Quiz 3', type: 'quiz' },
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
