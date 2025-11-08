// Castle 5 - Chapter 1: The Hall of Planes
// Theme: Identifying plane (2D) and solid (3D) figures

export const CHAPTER1_OPENING_DIALOGUE = [
  "Welcome to the Arcane Observatory! I am Dimensius, Guardian of Space.",
  "You stand in the Hall of Planes, where shapes float in mysterious dimensions.",
  "Some shapes are flat — they are PLANE FIGURES with only length and width.",
  "Others have depth — they are SOLID FIGURES existing in three dimensions!",
  "Let us learn to see beyond the surface!"
];

export const CHAPTER1_LESSON_DIALOGUE = [
  { key: 'intro', text: "PLANE FIGURES are flat, 2D shapes with length and width only.", taskId: 'task-0' },
  { key: 'plane-examples', text: "Examples of plane figures: circle, square, triangle, rectangle, pentagon, hexagon.", taskId: 'task-1' },
  { key: 'solid-intro', text: "SOLID FIGURES are 3D shapes with length, width, AND height (or depth).", taskId: 'task-2' },
  { key: 'solid-examples', text: "Examples of solid figures: cube, sphere, cylinder, cone, pyramid, prism.", taskId: 'task-3' },
  { key: 'difference', text: "The key difference: Plane figures are FLAT, solid figures have VOLUME!", taskId: 'task-4' },
  { key: 'prism', text: "A PRISM is a solid figure with two identical parallel bases connected by rectangular faces.", taskId: 'task-5' },
  { key: 'pyramid', text: "A PYRAMID has a polygon base and triangular faces meeting at a point (apex).", taskId: 'task-6' },
  { key: 'practice', text: "Now sort shapes into their proper dimensions!" }
];

export const CHAPTER1_MINIGAME_DIALOGUE = [
  "The Hall presents you with floating shapes!",
  "Sort each shape: Is it a plane figure or solid figure?",
  "Look carefully at the dimensions!"
];

export const CHAPTER1_MINIGAME_LEVELS = [
  { id: 1, shape: 'triangle', type: 'plane', instruction: 'Is this a plane or solid figure?', hint: 'Does it have depth?' },
  { id: 2, shape: 'cube', type: 'solid', instruction: 'Is this a plane or solid figure?', hint: 'Does it have volume?' },
  { id: 3, shape: 'circle', type: 'plane', instruction: 'Is this a plane or solid figure?', hint: 'Is it flat?' },
  { id: 4, shape: 'cylinder', type: 'solid', instruction: 'Is this a plane or solid figure?', hint: 'Does it have three dimensions?' },
  { id: 5, shape: 'rectangle', type: 'plane', instruction: 'Is this a plane or solid figure?', hint: 'Only length and width' },
  { id: 6, shape: 'pyramid', type: 'solid', instruction: 'Is this a plane or solid figure?', hint: 'Has height/depth' },
  { id: 7, shape: 'hexagon', type: 'plane', instruction: 'Is this a plane or solid figure?', hint: 'Flat polygon' },
  { id: 8, shape: 'sphere', type: 'solid', instruction: 'Is this a plane or solid figure?', hint: 'Three dimensional' }
];

export const CHAPTER1_CONCEPTS = [
  {
    key: 'plane',
    title: 'Plane Figures (2D)',
    summary: 'Flat shapes with only length and width'
  },
  {
    key: 'plane-examples',
    title: 'Plane Examples',
    summary: 'Circle, square, triangle, rectangle, pentagon, hexagon'
  },
  {
    key: 'solid',
    title: 'Solid Figures (3D)',
    summary: 'Shapes with length, width, AND height'
  },
  {
    key: 'solid-examples',
    title: 'Solid Examples',
    summary: 'Cube, sphere, cylinder, cone, pyramid, prism'
  },
  {
    key: 'difference',
    title: 'Key Difference',
    summary: 'Plane = flat, Solid = has volume'
  },
  {
    key: 'prism',
    title: 'Prism',
    summary: 'Two parallel bases connected by rectangular faces'
  },
  {
    key: 'pyramid',
    title: 'Pyramid',
    summary: 'Polygon base with triangular faces meeting at apex'
  }
];

export const CHAPTER1_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'plane', label: 'Learn: Plane Figures', type: 'lesson' as const },
  { id: 'task-1', key: 'plane-examples', label: 'Learn: Plane Examples', type: 'lesson' as const },
  { id: 'task-2', key: 'solid', label: 'Learn: Solid Figures', type: 'lesson' as const },
  { id: 'task-3', key: 'solid-examples', label: 'Learn: Solid Examples', type: 'lesson' as const },
  { id: 'task-4', key: 'difference', label: 'Learn: 2D vs 3D', type: 'lesson' as const },
  { id: 'task-5', key: 'prism', label: 'Learn: Prisms', type: 'lesson' as const },
  { id: 'task-6', key: 'pyramid', label: 'Learn: Pyramids', type: 'lesson' as const },
  { id: 'task-7', key: 'minigame', label: 'Complete Shape Sorting', type: 'minigame' as const },
  { id: 'task-8', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
];

export const CHAPTER1_XP_VALUES = {
  lesson: 80,
  minigame: 60,
  quiz1: 100,
  total: 200,
};

export const CHAPTER1_CASTLE_ID = '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c'; // Castle 5 (Arcane Observatory)
export const CHAPTER1_NUMBER = 1;

export const CHAPTER1_RELIC = {
  name: "Lens of Dimensions",
  image: "/images/relics/lens-dimensions.png",
  description: "You can now see beyond the surface! The Lens of Dimensions reveals whether a shape exists in 2D or 3D space."
};

export const CHAPTER1_WIZARD = {
  name: "Dimensius, Guardian of Space",
  image: "/images/dimensius-wizard.png"
};

export const CHAPTER1_METADATA = {
  title: "The Hall of Planes",
  subtitle: "Castle 5 - The Arcane Observatory",
  description: "Identify and differentiate between plane (2D) and solid (3D) figures."
};
