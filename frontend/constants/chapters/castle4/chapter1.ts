// Castle 4 - Chapter 1: The Gallery of Shapes
// Theme: Identifying polygons, similar and congruent polygons

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER1_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Welcome to the Fractal Bastion! I am Polymus, Master of Many Sides." },
  { scene: 'opening', text: "Enter the grand gallery where polygons float like art pieces." },
  { scene: 'opening', text: "Each polygon has a unique number of sides and angles." },
  { scene: 'opening', text: "Let us explore the naming and classification of these magnificent shapes!" },
  
  // Lesson scene (indices 4-10)
  { scene: 'lesson', key: 'intro', text: "A POLYGON is a closed figure made of straight line segments.", taskId: 'task-0' },
  { scene: 'lesson', key: 'naming', text: "Polygons are named by their number of sides: Triangle (3), Quadrilateral (4), Pentagon (5), Hexagon (6), Heptagon (7), Octagon (8), Nonagon (9), Decagon (10).", taskId: 'task-1' },
  { scene: 'lesson', key: 'congruent', text: "Two polygons are CONGRUENT if they have the same shape AND same size.", taskId: 'task-2' },
  { scene: 'lesson', key: 'congruent-example', text: "Example: Two squares with side length 5 cm are congruent.", taskId: 'task-3' },
  { scene: 'lesson', key: 'similar', text: "Two polygons are SIMILAR if they have the same shape but different sizes.", taskId: 'task-4' },
  { scene: 'lesson', key: 'similar-example', text: "Example: A square with side 3 cm and a square with side 6 cm are similar (same shape, different size).", taskId: 'task-5' },
  { scene: 'lesson', key: 'practice', text: "Now identify polygons and determine their relationships!" },
  
  // Minigame scene (indices 11-13)
  { scene: 'minigame', text: "The Gallery Keeper challenges you!" },
  { scene: 'minigame', text: "Identify polygons by counting their sides." },
  { scene: 'minigame', text: "Determine if pairs are congruent or similar!" },
];

// Scene ranges for navigation
export const CHAPTER1_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 10 },
  minigame: { start: 11, end: 13 },
};

// Legacy exports for backward compatibility
export const CHAPTER1_OPENING_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER1_LESSON_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER1_MINIGAME_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

export const CHAPTER1_MINIGAME_LEVELS = [
  { id: 1, sides: 5, correctAnswer: 'pentagon', instruction: 'What is a 5-sided polygon called?', hint: 'Count the sides carefully' },
  { id: 2, sides: 8, correctAnswer: 'octagon', instruction: 'What is an 8-sided polygon called?', hint: 'Like a STOP sign' },
  { id: 3, sides: 6, correctAnswer: 'hexagon', instruction: 'What is a 6-sided polygon called?', hint: 'Like a honeycomb' },
  { id: 4, sides: 10, correctAnswer: 'decagon', instruction: 'What is a 10-sided polygon called?', hint: 'Deca means ten' },
  { id: 5, type: 'congruent', correctAnswer: true, instruction: 'Are these two squares congruent? (both have side 4 cm)', hint: 'Same shape and same size' },
  { id: 6, type: 'similar', correctAnswer: true, instruction: 'Are these two triangles similar? (same angles, different sizes)', hint: 'Same shape, different size' }
];

export const CHAPTER1_CONCEPTS = [
  {
    key: 'polygon',
    title: 'Polygon',
    summary: 'A closed figure made of straight line segments',
    description: 'A closed shape formed by straight line segments called sides.'
  },
  {
    key: 'naming',
    title: 'Naming Polygons',
    summary: 'Named by number of sides: Pentagon (5), Hexagon (6), Octagon (8), etc.',
    description: 'Named by side count (e.g., triangle=3, quadrilateral=4, pentagon=5, hexagon=6, octagon=8).'
  },
  {
    key: 'congruent',
    title: 'Congruent Polygons',
    summary: 'Same shape AND same size',
    description: 'Polygons that match in shape and size (equal corresponding sides and angles).'
  },
  {
    key: 'congruent-example',
    title: 'Congruent Example',
    summary: 'Two identical squares are congruent',
    description: 'Squares with equal side lengths (e.g., both 5 cm) are congruent.'
  },
  {
    key: 'similar',
    title: 'Similar Polygons',
    summary: 'Same shape but different sizes',
    description: 'Same shape with proportional sides and equal angles; sizes differ.'
  },
  {
    key: 'similar-example',
    title: 'Similar Example',
    summary: 'A small and large square are similar',
    description: 'Squares with side lengths in proportion (e.g., 3 cm and 6 cm) are similar.'
  }
];

export const CHAPTER1_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'polygon', label: 'Learn: Polygons', type: 'lesson' as const },
  { id: 'task-1', key: 'naming', label: 'Learn: Naming Polygons', type: 'lesson' as const },
  { id: 'task-2', key: 'congruent', label: 'Learn: Congruent Polygons', type: 'lesson' as const },
  { id: 'task-3', key: 'congruent-example', label: 'Learn: Congruent Example', type: 'lesson' as const },
  { id: 'task-4', key: 'similar', label: 'Learn: Similar Polygons', type: 'lesson' as const },
  { id: 'task-5', key: 'similar-example', label: 'Learn: Similar Example', type: 'lesson' as const },
  { id: 'task-6', key: 'minigame', label: 'Complete Polygon Classification', type: 'minigame' as const },
  { id: 'task-7', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-8', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER1_XP_VALUES = {
  lesson: 50,
  minigame: 50,
  quiz1: 20,
  quiz2: 20,
  quiz3: 20,
  quiz4: 20,
  quiz5: 20,
  total: 200,
};

export const CHAPTER1_CASTLE_ID = '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b'; // Castle 4 (Polygon Citadel)
export const CHAPTER1_NUMBER = 1;

// Audio narration paths - matches dialogue indices
export const CHAPTER1_NARRATION = {
  opening: [
    '/audio/castle4/chapter1/opening_0.mp3',
    '/audio/castle4/chapter1/opening_1.mp3',
    '/audio/castle4/chapter1/opening_2.mp3',
    '/audio/castle4/chapter1/opening_3.mp3',
  ],
  lesson: [
    '/audio/castle4/chapter1/lesson_0.mp3',
    '/audio/castle4/chapter1/lesson_1.mp3',
    '/audio/castle4/chapter1/lesson_2.mp3',
    '/audio/castle4/chapter1/lesson_3.mp3',
    '/audio/castle4/chapter1/lesson_4.mp3',
    '/audio/castle4/chapter1/lesson_5.mp3',
    '/audio/castle4/chapter1/lesson_6.mp3',
  ],
  minigame: [
    '/audio/castle4/chapter1/minigame_0.mp3',
    '/audio/castle4/chapter1/minigame_1.mp3',
    '/audio/castle4/chapter1/minigame_2.mp3',
  ],
};

export const CHAPTER1_RELIC = {
  name: "Prism of Polygons",
  image: "/images/relics/prism-polygons.png",
  description: "You have mastered polygon identification! The Prism of Polygons reveals the nature of any multi-sided shape."
};

export const CHAPTER1_WIZARD = {
  name: "Polymus, Master of Many Sides",
  image: "/images/polymus-wizard.png"
};

export const CHAPTER1_METADATA = {
  title: "The Gallery of Shapes",
  subtitle: "Castle 4 - The Fractal Bastion",
  description: "Identify polygons by counting sides and understand congruent and similar polygons."
};
