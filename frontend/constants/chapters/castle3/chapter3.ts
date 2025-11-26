// Castle 3 - Chapter 3: The Chamber of Space
// Theme: Area of circles using A = πr²

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER3_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Marvelous work! You have measured the circle's edge." },
  { scene: 'opening', text: "Now we enter the Chamber of Space, where a circular pool glows with starlight." },
  { scene: 'opening', text: "The AREA of a circle measures the space inside its boundary." },
  { scene: 'opening', text: "Let us discover the formula that reveals this inner realm!" },
  
  // Lesson scene (indices 4-11)
  { scene: 'lesson', key: 'intro', text: "The AREA is the amount of space inside the circle.", taskId: 'task-0' },
  { scene: 'lesson', key: 'formula', text: "The formula for the area of a circle is: A = πr²", taskId: 'task-1' },
  { scene: 'lesson', key: 'squared', text: "Notice: We SQUARE the radius (r²), meaning r × r!", taskId: 'task-2' },
  { scene: 'lesson', key: 'example1', text: "Example: If radius = 4 cm, then A = π(4²) = π(16) = 16π ≈ 50.3 cm²", taskId: 'task-3' },
  { scene: 'lesson', key: 'semicircle', text: "A SEMI-CIRCLE is half of a circle. Its area is: A = πr²/2", taskId: 'task-4' },
  { scene: 'lesson', key: 'example2', text: "Example: Semi-circle with radius 6 cm has area = π(36)/2 = 18π ≈ 56.5 cm²", taskId: 'task-5' },
  { scene: 'lesson', key: 'sector-intro', text: "A SECTOR is a portion of the circle, like a slice of pie.", taskId: 'task-6' },
  { scene: 'lesson', key: 'practice', text: "Now calculate areas and illuminate the Chamber of Space!" },
  
  // Minigame scene (indices 12-14)
  { scene: 'minigame', text: "The starlight pool presents circular challenges!" },
  { scene: 'minigame', text: "Calculate the area of each circle or semi-circle." },
  { scene: 'minigame', text: "Use A = πr² or A = πr²/2. Round to 1 decimal place!" },
];

// Scene ranges for navigation
export const CHAPTER3_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 11 },
  minigame: { start: 12, end: 14 },
};

// Legacy exports for backward compatibility
export const CHAPTER3_OPENING_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER3_LESSON_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER3_MINIGAME_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

export const CHAPTER3_MINIGAME_LEVELS = [
  { id: 1, radius: 3, isSemiCircle: false, correctAnswer: 28.3, symbolicAnswer: '9π', acceptPi: true, instruction: 'Find area (radius = 3 cm)', hint: 'Use A = πr². Enter exact (e.g., 9π) or round to 1 decimal.' },
  { id: 2, radius: 5, isSemiCircle: false, correctAnswer: 78.5, symbolicAnswer: '25π', acceptPi: true, instruction: 'Find area (radius = 5 cm)', hint: 'Use A = πr². Enter exact (e.g., 25π) or round to 1 decimal.' },
  { id: 3, radius: 4, isSemiCircle: true, correctAnswer: 25.1, symbolicAnswer: '8π', acceptPi: true, instruction: 'Find semi-circle area (radius = 4 cm)', hint: 'Use A = πr²/2. Enter exact (e.g., 8π) or round to 1 decimal.' },
  { id: 4, radius: 7, isSemiCircle: false, correctAnswer: 153.9, symbolicAnswer: '49π', acceptPi: true, instruction: 'Find area (radius = 7 cm)', hint: 'Use A = πr². Enter exact (e.g., 49π) or round to 1 decimal.' },
  { id: 5, radius: 6, isSemiCircle: true, correctAnswer: 56.5, symbolicAnswer: '18π', acceptPi: true, instruction: 'Find semi-circle area (radius = 6 cm)', hint: 'Use A = πr²/2. Enter exact (e.g., 18π) or round to 1 decimal.' },
  { id: 6, radius: 10, isSemiCircle: false, correctAnswer: 314.2, symbolicAnswer: '100π', acceptPi: true, instruction: 'Find area (radius = 10 cm)', hint: 'Use A = πr². Enter exact (e.g., 100π) or round to 1 decimal.' }
];

export const CHAPTER3_CONCEPTS = [
  {
    key: 'area',
    title: 'Area of Circle',
    summary: 'The amount of space inside the circle',
    description: 'Space enclosed by the circle’s boundary.'
  },
  {
    key: 'formula',
    title: 'Area Formula',
    summary: 'A = πr² (pi times radius squared)',
    description: 'Multiply π by the square of the radius.'
  },
  {
    key: 'squared',
    title: 'Squaring the Radius',
    summary: 'r² means r × r (multiply radius by itself)',
    description: 'r² means radius multiplied by itself.'
  },
  {
    key: 'example1',
    title: 'Example: Full Circle',
    summary: 'If r = 4, then A = π(16) ≈ 50.3 cm²',
    description: 'With r = 4 cm, A ≈ 50.3 cm² using πr².'
  },
  {
    key: 'semicircle',
    title: 'Semi-Circle',
    summary: 'Half of a circle, area = πr²/2',
    description: 'Half a circle has area equal to πr² ÷ 2.'
  },
  {
    key: 'example2',
    title: 'Example: Semi-Circle',
    summary: 'If r = 6, then A = 18π ≈ 56.5 cm²',
    description: 'With r = 6 cm, A ≈ 56.5 cm² for a semicircle.'
  },
  {
    key: 'sector',
    title: 'Sector',
    summary: 'A pie-shaped portion of the circle',
    description: 'A slice of the circle defined by a central angle.'
  }
];

export const CHAPTER3_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'area', label: 'Learn: Circle Area', type: 'lesson' as const },
  { id: 'task-1', key: 'formula', label: 'Learn: A = πr²', type: 'lesson' as const },
  { id: 'task-2', key: 'squared', label: 'Learn: Squaring Radius', type: 'lesson' as const },
  { id: 'task-3', key: 'example1', label: 'Learn: Full Circle Example', type: 'lesson' as const },
  { id: 'task-4', key: 'semicircle', label: 'Learn: Semi-Circle', type: 'lesson' as const },
  { id: 'task-5', key: 'example2', label: 'Learn: Semi-Circle Example', type: 'lesson' as const },
  { id: 'task-6', key: 'sector', label: 'Learn: Sector', type: 'lesson' as const },
  { id: 'task-7', key: 'minigame', label: 'Complete Area Calculations', type: 'minigame' as const },
  { id: 'task-8', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-12', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER3_XP_VALUES = {
  lesson: 110,
  minigame: 70,
  quiz1: 14,
  quiz2: 14,
  quiz3: 14,
  quiz4: 14,
  quiz5: 14,
  total: 250,
};

export const CHAPTER3_CASTLE_ID = '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a';
export const CHAPTER3_NUMBER = 3;

// Audio narration paths - matches dialogue indices
export const CHAPTER3_NARRATION = {
  opening: [
    '/audio/castle3/chapter3/opening_0.wav',
    '/audio/castle3/chapter3/opening_1.wav',
    '/audio/castle3/chapter3/opening_2.wav',
    '/audio/castle3/chapter3/opening_3.wav',
  ],
  lesson: [
    '/audio/castle3/chapter3/lesson_0.wav',
    '/audio/castle3/chapter3/lesson_1.wav',
    '/audio/castle3/chapter3/lesson_2.wav',
    '/audio/castle3/chapter3/lesson_3.wav',
    '/audio/castle3/chapter3/lesson_4.wav',
    '/audio/castle3/chapter3/lesson_5.wav',
    '/audio/castle3/chapter3/lesson_6.wav',
    '/audio/castle3/chapter3/lesson_7.wav',
  ],
  minigame: [
    '/audio/castle3/chapter3/minigame_0.wav',
    '/audio/castle3/chapter3/minigame_1.wav',
    '/audio/castle3/chapter3/minigame_2.wav',
  ],
};

export const CHAPTER3_RELIC = {
  name: "Orb of Space",
  image: "/images/relics/orb-space.png",
  description: "You have mastered circle area! The Orb of Space reveals the inner dimensions of any circular realm."
};

export const CHAPTER3_WIZARD = {
  name: "Arcana, Keeper of the Curved Path",
  image: "/images/arcana-wizard.png"
};

export const CHAPTER3_METADATA = {
  title: "The Chamber of Space",
  subtitle: "Castle 3 - The Circle Sanctuary",
  description: "Calculate the area of circles and semi-circles using A = πr²."
};
