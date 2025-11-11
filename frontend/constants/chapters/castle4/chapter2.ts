// Castle 4 - Chapter 2: The Drawing Chamber
// Theme: Drawing polygons accurately

export const CHAPTER2_OPENING_DIALOGUE = [
  "Excellent work, polygon apprentice!",
  "Now we enter the Drawing Chamber, where shapes come to life.",
  "Here you will learn to draw polygons with precision.",
  "The art of construction is the heart of geometry!"
];

export const CHAPTER2_LESSON_DIALOGUE = [
  { key: 'intro', text: "To draw a polygon, we must plan its sides and angles carefully.", taskId: 'task-0' },
  { key: 'triangle', text: "Drawing a TRIANGLE: Start with one side, then use a protractor to measure angles and draw the other two sides.", taskId: 'task-1' },
  { key: 'quadrilateral', text: "Drawing a QUADRILATERAL: Draw four connected sides. Remember, interior angles must sum to 360°!", taskId: 'task-2' },
  { key: 'pentagon', text: "Drawing a PENTAGON: Five sides require careful angle measurement. Each interior angle in a regular pentagon is 108°.", taskId: 'task-3' },
  { key: 'hexagon', text: "Drawing a HEXAGON: Six sides, each interior angle in a regular hexagon is 120°.", taskId: 'task-4' },
  { key: 'tools', text: "Use a ruler for straight sides and a protractor for precise angles!", taskId: 'task-5' },
  { key: 'practice', text: "Now draw polygons and bring them to life!" }
];

export const CHAPTER2_MINIGAME_DIALOGUE = [
  "The Drawing Master challenges you!",
  "Draw the requested polygon accurately.",
  "Click to place vertices, following the instructions!"
];

export const CHAPTER2_MINIGAME_LEVELS = [
  { id: 1, polygonType: 'triangle', instruction: 'Draw a triangle', hint: '3 connected vertices' },
  { id: 2, polygonType: 'square', instruction: 'Draw a square', hint: '4 equal sides, all right angles' },
  { id: 3, polygonType: 'rectangle', instruction: 'Draw a rectangle', hint: '4 sides, opposite sides equal' },
  { id: 4, polygonType: 'pentagon', instruction: 'Draw a pentagon', hint: '5 connected vertices' },
  { id: 5, polygonType: 'hexagon', instruction: 'Draw a hexagon', hint: '6 connected vertices' },
  { id: 6, polygonType: 'octagon', instruction: 'Draw an octagon', hint: '8 connected vertices' }
];

export const CHAPTER2_CONCEPTS = [
  {
    key: 'drawing',
    title: 'Drawing Polygons',
    summary: 'Plan sides and angles carefully to construct polygons'
  },
  {
    key: 'triangle',
    title: 'Drawing Triangles',
    summary: 'Use protractor to measure angles between three sides'
  },
  {
    key: 'quadrilateral',
    title: 'Drawing Quadrilaterals',
    summary: 'Four sides, interior angles sum to 360°'
  },
  {
    key: 'pentagon',
    title: 'Drawing Pentagons',
    summary: 'Five sides, regular pentagon has 108° angles'
  },
  {
    key: 'hexagon',
    title: 'Drawing Hexagons',
    summary: 'Six sides, regular hexagon has 120° angles'
  },
  {
    key: 'tools',
    title: 'Drawing Tools',
    summary: 'Ruler for sides, protractor for angles'
  }
];

export const CHAPTER2_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'drawing', label: 'Learn: Drawing Polygons', type: 'lesson' as const },
  { id: 'task-1', key: 'triangle', label: 'Learn: Drawing Triangles', type: 'lesson' as const },
  { id: 'task-2', key: 'quadrilateral', label: 'Learn: Drawing Quadrilaterals', type: 'lesson' as const },
  { id: 'task-3', key: 'pentagon', label: 'Learn: Drawing Pentagons', type: 'lesson' as const },
  { id: 'task-4', key: 'hexagon', label: 'Learn: Drawing Hexagons', type: 'lesson' as const },
  { id: 'task-5', key: 'tools', label: 'Learn: Drawing Tools', type: 'lesson' as const },
  { id: 'task-6', key: 'minigame', label: 'Complete Polygon Drawing', type: 'minigame' as const },
  { id: 'task-7', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-8', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER2_XP_VALUES = {
  lesson: 60,
  minigame: 65,
  quiz1: 12,
  quiz2: 12,
  quiz3: 12,
  quiz4: 12,
  quiz5: 12,
  total: 185,
};

export const CHAPTER2_CASTLE_ID = '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b';
export const CHAPTER2_NUMBER = 2;

export const CHAPTER2_RELIC = {
  name: "Pencil of Precision",
  image: "/images/relics/pencil-precision.png",
  description: "You have mastered polygon drawing! The Pencil of Precision allows you to construct any shape with perfect accuracy."
};

export const CHAPTER2_WIZARD = {
  name: "Polymus, Master of Many Sides",
  image: "/images/polymus-wizard.png"
};

export const CHAPTER2_METADATA = {
  title: "The Drawing Chamber",
  subtitle: "Castle 4 - The Polygon Citadel",
  description: "Master the art of drawing polygons accurately with proper sides and angles."
};
