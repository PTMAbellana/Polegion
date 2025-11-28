// Castle 2 - Chapter 3: The Angle Forge
// Theme: Complementary and supplementary angles, solving for missing angles

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER3_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Welcome to the Angle Forge! I am Complementa, Master of Angle Relationships." },
  { scene: 'opening', text: "Here, angles join forces to create perfect pairs of geometric harmony." },
  { scene: 'opening', text: "Complementary angles work together to form 90° — a right angle!" },
  { scene: 'opening', text: "Supplementary angles unite to create 180° — a straight line!" },
  
  // Lesson scene (indices 4-9)
  { scene: 'lesson', text: "Two angles are complementary if their measures add up to exactly 90°.", key: 'complementary', taskId: 'task-0' },
  { scene: 'lesson', text: "Example: 30° and 60° are complementary because 30° + 60° = 90°.", key: 'complementary', taskId: 'task-0' },
  { scene: 'lesson', text: "Two angles are supplementary if their measures add up to exactly 180°.", key: 'supplementary', taskId: 'task-1' },
  { scene: 'lesson', text: "Example: 110° and 70° are supplementary because 110° + 70° = 180°.", key: 'supplementary', taskId: 'task-1' },
  { scene: 'lesson', text: "To find a missing angle: subtract the known angle from 90° (complement) or 180° (supplement).", key: 'finding-missing', taskId: 'task-2' },
  { scene: 'lesson', text: "Now, let us forge angle pairs together and solve for the missing measures!", key: 'finding-missing', taskId: 'task-2' },
  
  // Minigame scene (indices 10-12)
  { scene: 'minigame', text: "Complementa challenges you! Find the missing angle to complete the pair." },
  { scene: 'minigame', text: "Use the relationship: complement = 90° - angle, supplement = 180° - angle." },
  { scene: 'minigame', text: "Forge the perfect angle pair!" },
];

// Scene ranges for navigation
export const CHAPTER3_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 9 },
  minigame: { start: 10, end: 12 },
};

// Legacy exports for backward compatibility
export const CHAPTER3_OPENING_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER3_LESSON_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'lesson').map(d => d.text);
export const CHAPTER3_MINIGAME_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

// Concept cards for lesson scene
export const CHAPTER3_CONCEPTS = [
  {
    key: 'complementary',
    title: 'Complementary Angles',
    summary: 'Two angles that add up to 90°',
    description: 'Complementary angles work together to form a perfect right angle. If you know one, subtract from 90° to find its partner!',
    image: '/images/castle2/complementary-angles.png'
  },
  {
    key: 'supplementary',
    title: 'Supplementary Angles',
    summary: 'Two angles that add up to 180°',
    description: 'Supplementary angles join forces to create a straight line. Subtract from 180° to discover the missing angle!',
    image: '/images/castle2/supplementary-angles.png'
  },
  {
    key: 'finding-missing',
    title: 'Finding Missing Angles',
    summary: 'Subtract from 90° or 180° to find the pair',
    description: 'Use simple subtraction to find missing angles: 90° minus angle for complements, 180° minus angle for supplements!',
    image: '/images/castle2/finding-missing-angles.png'
  }
];

export const CHAPTER3_MINIGAME_LEVELS = [
  {
    id: 1,
    givenAngle: 25,
    relationship: 'complementary' as const,
    correctAnswer: 65,
    description: 'Find the complement of 25°',
    hint: 'Subtract from 90° to find the complement',
    targetSum: 90
  },
  {
    id: 2,
    givenAngle: 110,
    relationship: 'supplementary' as const,
    correctAnswer: 70,
    description: 'Find the supplement of 110°',
    hint: 'Subtract from 180° to find the supplement',
    targetSum: 180
  },
  {
    id: 3,
    givenAngle: 42,
    relationship: 'complementary1' as const,
    correctAnswer: 48,
    description: 'Find the complement of 42°',
    hint: 'Remember: complementary angles add to 90°',
    targetSum: 90
  },
  {
    id: 4,
    givenAngle: 75,
    relationship: 'supplementary1' as const,
    correctAnswer: 105,
    description: 'Find the supplement of 75°',
    hint: 'Remember: supplementary angles add to 180°',
    targetSum: 180
  },
  {
    id: 5,
    givenAngle: 60,
    relationship: 'complementary2' as const,
    correctAnswer: 30,
    description: 'Find the complement of 60°',
    hint: 'What angle adds with 60° to make 90°?',
    targetSum: 90
  },
  {
    id: 6,
    givenAngle: 135,
    relationship: 'supplementary2' as const,
    correctAnswer: 45,
    description: 'Find the supplement of 135°',
    hint: 'What angle adds with 135° to make 180°?',
    targetSum: 180
  }
];

export const CHAPTER3_LEARNING_OBJECTIVES = [
  { id: 'task-0', label: 'Learn: Complementary Angles', type: 'lesson' as const },
  { id: 'task-1', label: 'Learn: Supplementary Angles', type: 'lesson' as const },
  { id: 'task-2', label: 'Learn: Finding Missing Angles', type: 'lesson' as const },
  { id: 'task-3', key: 'minigame', label: 'Complete Angle Pairs', type: 'minigame' as const },
  { id: 'task-4', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-5', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-6', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-7', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-8', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER3_XP_VALUES = {
  lesson: 35,
  minigame: 40,
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  quiz4: 15,
  quiz5: 15,
  total: 150,
};

export const CHAPTER3_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Polygon Citadel)
export const CHAPTER3_NUMBER = 3;

// Audio narration paths - matches dialogue indices
export const CHAPTER3_NARRATION = {
  opening: [
    '/audio/castle2/chapter3/opening_0.mp3',
    '/audio/castle2/chapter3/opening_1.mp3',
    '/audio/castle2/chapter3/opening_2.mp3',
    '/audio/castle2/chapter3/opening_3.mp3',
  ],
  lesson: [
    '/audio/castle2/chapter3/lesson_0.mp3',
    '/audio/castle2/chapter3/lesson_1.mp3',
    '/audio/castle2/chapter3/lesson_2.mp3',
    '/audio/castle2/chapter3/lesson_3.mp3',
    '/audio/castle2/chapter3/lesson_4.mp3',
    '/audio/castle2/chapter3/lesson_5.mp3',
  ],
  minigame: [
    '/audio/castle2/chapter3/minigame_0.mp3',
    '/audio/castle2/chapter3/minigame_1.mp3',
    '/audio/castle2/chapter3/minigame_2.mp3',
  ],
};

// Relic information for reward screen
export const CHAPTER3_RELIC = {
  name: "Medallion of Harmony",
  image: "/images/relics/medallion-of-harmony.png",
  description: "You have mastered the Angle Forge! The Medallion of Harmony reveals the perfect pairs, complementary and supplementary angles working in unity."
};

// Wizard information
export const CHAPTER3_WIZARD = {
  name: "Complementa, Master of Angle Relationships",
  image: "/images/wizards/complementa-wizard.png"
};

// Chapter metadata
export const CHAPTER3_METADATA = {
  title: "The Angle Forge",
  subtitle: "Castle 2 - Polygon Citadel",
  description: "Master complementary and supplementary angles, learning to solve for missing angle measures using angle relationships."
};
