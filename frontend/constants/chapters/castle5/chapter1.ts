// Castle 5 - Chapter 1: The Hall of Planes
// Theme: Identifying plane (2D) and solid (3D) figures

interface ChapterDialogue { scene: 'opening' | 'lesson' | 'minigame'; text: string; key?: string; taskId?: string; }

export const CHAPTER1_DIALOGUE: ChapterDialogue[] = [
  { scene: 'opening', text: "Welcome to the Arcane Observatory! I am Dimensius, Guardian of Space." },
  { scene: 'opening', text: "You stand in the Hall of Planes, where shapes float in mysterious dimensions." },
  { scene: 'opening', text: "Some shapes are flat, they are PLANE FIGURES with only length and width." },
  { scene: 'opening', text: "Others have depth, they are SOLID FIGURES existing in three dimensions!" },
  { scene: 'opening', text: "Let us learn to see beyond the surface!" },
  { scene: 'lesson', key: 'intro', text: "PLANE FIGURES are flat, 2D shapes with length and width only.", taskId: 'task-0' },
  { scene: 'lesson', key: 'plane-examples', text: "Examples of plane figures: circle, square, triangle, rectangle, pentagon, hexagon.", taskId: 'task-1' },
  { scene: 'lesson', key: 'solid-intro', text: "SOLID FIGURES are 3D shapes with length, width, AND height (or depth).", taskId: 'task-2' },
  { scene: 'lesson', key: 'solid-examples', text: "Examples of solid figures: cube, sphere, cylinder, cone, pyramid, prism.", taskId: 'task-3' },
  { scene: 'lesson', key: 'difference', text: "The key difference: Plane figures are FLAT, solid figures have VOLUME!", taskId: 'task-4' },
  { scene: 'lesson', key: 'prism', text: "A PRISM is a solid figure with two identical parallel bases connected by rectangular faces.", taskId: 'task-5' },
  { scene: 'lesson', key: 'pyramid', text: "A PYRAMID has a polygon base and triangular faces meeting at a point (apex).", taskId: 'task-6' },
  { scene: 'lesson', key: 'practice', text: "Now sort shapes into their proper dimensions!" },
  { scene: 'minigame', text: "The Hall presents you with floating shapes!" },
  { scene: 'minigame', text: "Sort each shape: Is it a plane figure or solid figure?" },
  { scene: 'minigame', text: "Look carefully at the dimensions!" },
];

export const CHAPTER1_SCENE_RANGES = { opening: { start: 0, end: 4 }, lesson: { start: 5, end: 12 }, minigame: { start: 13, end: 15 } };

export const CHAPTER1_OPENING_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER1_LESSON_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER1_MINIGAME_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

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
    summary: 'Flat shapes with only length and width',
    description: 'Flat 2D shapes with length and width only (no depth).'
  },
  {
    key: 'plane-examples',
    title: 'Plane Examples',
    summary: 'Circle, square, triangle, rectangle, pentagon, hexagon',
    description: 'Common plane figures include circle, square, triangle, rectangle, pentagon, and hexagon.'
  },
  {
    key: 'solid',
    title: 'Solid Figures (3D)',
    summary: 'Shapes with length, width, AND height',
    description: '3D shapes with length, width, and height (depth).'
  },
  {
    key: 'solid-examples',
    title: 'Solid Examples',
    summary: 'Cube, sphere, cylinder, cone, pyramid, prism',
    description: 'Common solid figures include cube, sphere, cylinder, cone, pyramid, and prism.'
  },
  {
    key: 'difference',
    title: 'Key Difference',
    summary: 'Plane = flat, Solid = has volume',
    description: 'Plane figures are flat; solid figures occupy space and have volume.'
  },
  {
    key: 'prism',
    title: 'Prism',
    summary: 'Two parallel bases connected by rectangular faces',
    description: 'A solid with two parallel congruent bases and rectangular lateral faces.'
  },
  {
    key: 'pyramid',
    title: 'Pyramid',
    summary: 'Polygon base with triangular faces meeting at apex',
    description: 'A solid with a polygon base and triangular faces meeting at a single apex.'
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
  { id: 'task-12', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER1_XP_VALUES = {
  lesson: 60,
  minigame: 40,
  quiz1: 20,
  quiz2: 20,
  quiz3: 20,
  quiz4: 20,
  quiz5: 20,
  total: 200,
};

export const CHAPTER1_CASTLE_ID = '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c'; // Castle 5 (Arcane Observatory)
export const CHAPTER1_NUMBER = 1;

// Audio narration paths - matches dialogue indices
export const CHAPTER1_NARRATION = {
  opening: [
    '/audio/castle5/chapter1/opening_0.mp3',
    '/audio/castle5/chapter1/opening_1.mp3',
    '/audio/castle5/chapter1/opening_2.mp3',
    '/audio/castle5/chapter1/opening_3.mp3',
    '/audio/castle5/chapter1/opening_4.mp3',
  ],
  lesson: [
    '/audio/castle5/chapter1/lesson_0.mp3',
    '/audio/castle5/chapter1/lesson_1.mp3',
    '/audio/castle5/chapter1/lesson_2.mp3',
    '/audio/castle5/chapter1/lesson_3.mp3',
    '/audio/castle5/chapter1/lesson_4.mp3',
    '/audio/castle5/chapter1/lesson_5.mp3',
    '/audio/castle5/chapter1/lesson_6.mp3',
    '/audio/castle5/chapter1/lesson_7.mp3',
  ],
  minigame: [
    '/audio/castle5/chapter1/minigame_0.mp3',
    '/audio/castle5/chapter1/minigame_1.mp3',
    '/audio/castle5/chapter1/minigame_2.mp3',
  ],
};

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
