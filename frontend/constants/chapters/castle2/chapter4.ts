// Castle 2 - Chapter 4: The Temple of Solutions
// Theme: Solving angle word problems and real-world applications

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER4_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Welcome to the Temple of Solutions! I am Solvera, Keeper of Geometric Wisdom." },
  { scene: 'opening', text: "Here, angles reveal themselves through puzzles and real-world challenges." },
  { scene: 'opening', text: "Word problems require careful reading and mathematical thinking." },
  { scene: 'opening', text: "Let us combine all your angle knowledge to solve these mysteries!" },
  
  // Lesson scene (indices 4-9)
  { scene: 'lesson', key: 'intro', text: "Word problems translate real situations into mathematical equations.", taskId: 'task-0' },
  { scene: 'lesson', key: 'reading', text: "Read carefully to identify: What angles are given? What relationships exist?", taskId: 'task-0' },
  { scene: 'lesson', key: 'complementary', text: "For complementary problems, use: angle + complement = 90°.", taskId: 'task-1' },
  { scene: 'lesson', key: 'supplementary', text: "For supplementary problems, use: angle + supplement = 180°.", taskId: 'task-1' },
  { scene: 'lesson', key: 'equations', text: "For angle relationships, set up equations based on the problem description.", taskId: 'task-2' },
  { scene: 'lesson', key: 'conclusion', text: "Now, let us solve these geometric riddles together!", taskId: 'task-2' },
  
  // Minigame scene (indices 10-12)
  { scene: 'minigame', text: "Solvera presents a challenge! Read the problem and solve for the unknown angle." },
  { scene: 'minigame', text: "Think step by step: identify the relationship, set up the equation, solve." },
  { scene: 'minigame', text: "Your geometric wisdom will guide you!" },
];

// Scene ranges for navigation
export const CHAPTER4_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 9 },
  minigame: { start: 10, end: 12 },
};

// Legacy exports for backward compatibility
export const CHAPTER4_OPENING_DIALOGUE = CHAPTER4_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER4_LESSON_DIALOGUE = CHAPTER4_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER4_MINIGAME_DIALOGUE = CHAPTER4_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

// Concept cards for lesson scene
export const CHAPTER4_CONCEPTS = [
  {
    key: 'reading',
    title: 'Reading Word Problems',
    summary: 'Identify given angles and relationships',
    description: 'Carefully read to find what angles are given and what relationships connect them. Look for keywords like "complementary" or "supplementary"!',
    image: '/images/castle2/reading-word-problems.webp'
  },
  {
    key: 'equations',
    title: 'Setting Up Equations',
    summary: 'Translate words into mathematical equations',
    description: 'Turn word problems into math! Use variables for unknown angles and write equations based on the angle relationships described.',
    image: '/images/castle2/setting-up-equations.webp'
  },
  {
    key: 'solving',
    title: 'Solving Angle Equations',
    summary: 'Use algebra to find unknown angle measures',
    description: 'Apply your algebra skills to solve for unknown angles. Isolate the variable to discover the missing angle measure!',
    image: '/images/castle2/solving-equations.webp'
  }
];

export const CHAPTER4_MINIGAME_LEVELS = [
  {
    id: 1,
    problem: 'Two angles are complementary. One angle is 35°. Find the other angle.',
    correctAnswer: 55,
    description: 'Complementary angles problem',
    hint: 'Complementary angles sum to 90°. So 90° - 35° = ?',
    solution: '90° - 35° = 55°',
    type: 'complementary' as const
  },
  {
    id: 2,
    problem: 'Two angles are supplementary. One angle is 125°. Find the other angle.',
    correctAnswer: 55,
    description: 'Supplementary angles problem',
    hint: 'Supplementary angles sum to 180°. So 180° - 125° = ?',
    solution: '180° - 125° = 55°',
    type: 'supplementary' as const
  },
  {
    id: 3,
    problem: 'An angle and its complement are equal. Find the angle.',
    correctAnswer: 45,
    description: 'Equal complement problem',
    hint: 'If both angles are equal and sum to 90°, each is 45°',
    solution: 'Let x = angle. Then x + x = 90°, so 2x = 90°, x = 45°',
    type: 'complementary' as const
  },
  {
    id: 4,
    problem: 'The supplement of an angle is twice the angle. Find the angle.',
    correctAnswer: 60,
    description: 'Supplement relationship problem',
    hint: 'Let x = angle. Then 180 - x = 2x. Solve: 180 = 3x',
    solution: 'Let x = angle. 180° - x = 2x, so 180° = 3x, x = 60°',
    type: 'supplementary' as const
  },
  {
    id: 5,
    problem: 'Two supplementary angles differ by 40°. Find the smaller angle.',
    correctAnswer: 70,
    description: 'Angle difference problem',
    hint: 'Let angles be x and x+40. Then x + (x+40) = 180',
    solution: 'Let x = smaller angle. x + (x+40°) = 180°, so 2x = 140°, x = 70°',
    type: 'supplementary' as const
  },
  {
    id: 6,
    problem: 'Three angles form a straight line. Two angles are 65° and 45°. Find the third.',
    correctAnswer: 70,
    description: 'Straight line angles problem',
    hint: 'Angles on a straight line sum to 180°',
    solution: '180° - 65° - 45° = 70°',
    type: 'supplementary' as const
  }
];

export const CHAPTER4_QUIZ_QUESTIONS = [
  {
    id: 'quiz1',
    question: 'Two complementary angles are in the ratio 1:2. What are their measures?',
    options: ['20° and 40°', '30° and 60°', '45° and 45°', '25° and 50°'],
    correctAnswer: '30° and 60°',
    explanation: 'Let angles be x and 2x, then x + 2x = 90°. So 3x = 90°, x = 30°. The angles are 30° and 60°.'
  },
  {
    id: 'quiz2',
    question: 'The supplement of an angle is three times the angle. Find the angle.',
    options: ['30°', '45°', '60°', '90°'],
    correctAnswer: '45°',
    explanation: 'Let angle be x, then 180° - x = 3x. So 180° = 4x, x = 45°.'
  },
  {
    id: 'quiz3',
    question: 'An angle is 20° more than its complement. Find the angle.',
    options: ['45°', '50°', '55°', '70°'],
    correctAnswer: '55°',
    explanation: 'Let angle be x, then x = (90° - x) + 20°. So 2x = 110°, x = 55°.'
  },
  {
    id: 'quiz4',
    question: 'Two angles are supplementary. One angle is 4 times the other. Find the smaller angle.',
    options: ['30°', '36°', '40°', '45°'],
    correctAnswer: '36°',
    explanation: 'Let smaller angle be x, then x + 4x = 180°. So 5x = 180°, x = 36°.'
  },
  {
    id: 'quiz5',
    question: 'The complement of an angle is 15° less than twice the angle. Find the angle.',
    options: ['30°', '35°', '40°', '45°'],
    correctAnswer: '35°',
    explanation: 'Let angle be x, then 90° - x = 2x - 15°. So 105° = 3x, x = 35°.'
  }
];

export const CHAPTER4_LEARNING_OBJECTIVES = [
  { id: 'task-0', label: 'Learn: Reading Word Problems', type: 'lesson' as const },
  { id: 'task-1', label: 'Learn: Setting Up Equations', type: 'lesson' as const },
  { id: 'task-2', label: 'Learn: Solving Angle Equations', type: 'lesson' as const },
  { id: 'task-3', key: 'minigame', label: 'Complete Angle Word Problems', type: 'minigame' as const },
  { id: 'task-4', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-5', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-6', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-7', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-8', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER4_XP_VALUES = {
  lesson: 35,
  minigame: 40,
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  quiz4: 15,
  quiz5: 15,
  total: 150,
};

export const CHAPTER4_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Polygon Citadel)
export const CHAPTER4_NUMBER = 4;

// Audio narration paths - matches dialogue indices
export const CHAPTER4_NARRATION = {
  opening: [
    '/audio/castle2/chapter4/opening_0.wav',
    '/audio/castle2/chapter4/opening_1.wav',
    '/audio/castle2/chapter4/opening_2.wav',
    '/audio/castle2/chapter4/opening_3.wav',
  ],
  lesson: [
    '/audio/castle2/chapter4/lesson_0.wav',
    '/audio/castle2/chapter4/lesson_1.wav',
    '/audio/castle2/chapter4/lesson_2.wav',
    '/audio/castle2/chapter4/lesson_3.wav',
    '/audio/castle2/chapter4/lesson_4.wav',
    '/audio/castle2/chapter4/lesson_5.wav',
  ],
  minigame: [
    '/audio/castle2/chapter4/minigame_0.wav',
    '/audio/castle2/chapter4/minigame_1.wav',
    '/audio/castle2/chapter4/minigame_2.wav',
  ],
};

// Relic information for reward screen
export const CHAPTER4_RELIC = {
  name: "Scroll of Solutions",
  image: "/images/relics/scroll-of-solutions.webp",
  description: "You have conquered the Temple of Solutions! The Scroll of Solutions grants you the power to solve any angle problem, translating words into geometric wisdom."
};

// Wizard information
export const CHAPTER4_WIZARD = {
  name: "Solvera, Keeper of Geometric Wisdom",
  image: "/images/wizards/solvera-wizard.webp"
};

// Chapter metadata
export const CHAPTER4_METADATA = {
  title: "The Temple of Solutions",
  subtitle: "Castle 2 - Polygon Citadel",
  description: "Apply your angle knowledge to solve challenging word problems and real-world geometric scenarios."
};
