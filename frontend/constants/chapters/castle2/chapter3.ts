// Castle 2 - Chapter 3: The Angle Forge
// Theme: Complementary and supplementary angles, solving for missing angles

export const CHAPTER3_OPENING_DIALOGUE = [
  "Welcome to the Angle Forge! I am Complementa, Master of Angle Relationships.",
  "Here, angles join forces to create perfect pairs of geometric harmony.",
  "Complementary angles work together to form 90° — a right angle!",
  "Supplementary angles unite to create 180° — a straight line!"
];

export const CHAPTER3_LESSON_DIALOGUE = [
  "Two angles are complementary if their measures add up to exactly 90°.",
  "Example: 30° and 60° are complementary because 30° + 60° = 90°.",
  "Two angles are supplementary if their measures add up to exactly 180°.",
  "Example: 110° and 70° are supplementary because 110° + 70° = 180°.",
  "To find a missing angle: subtract the known angle from 90° (complement) or 180° (supplement).",
  "Now, let us forge angle pairs together and solve for the missing measures!"
];

export const CHAPTER3_MINIGAME_DIALOGUE = [
  "Complementa challenges you! Find the missing angle to complete the pair.",
  "Use the relationship: complement = 90° - angle, supplement = 180° - angle.",
  "Forge the perfect angle pair!"
];

export const CHAPTER3_MINIGAME_LEVELS = [
  {
    id: 1,
    givenAngle: 25,
    relationship: 'complementary' as const,
    correctAnswer: 65,
    description: 'Find the complement of 25°',
    hint: '90° - 25° = 65°',
    targetSum: 90
  },
  {
    id: 2,
    givenAngle: 110,
    relationship: 'supplementary' as const,
    correctAnswer: 70,
    description: 'Find the supplement of 110°',
    hint: '180° - 110° = 70°',
    targetSum: 180
  },
  {
    id: 3,
    givenAngle: 42,
    relationship: 'complementary' as const,
    correctAnswer: 48,
    description: 'Find the complement of 42°',
    hint: '90° - 42° = 48°',
    targetSum: 90
  },
  {
    id: 4,
    givenAngle: 75,
    relationship: 'supplementary' as const,
    correctAnswer: 105,
    description: 'Find the supplement of 75°',
    hint: '180° - 75° = 105°',
    targetSum: 180
  },
  {
    id: 5,
    givenAngle: 60,
    relationship: 'complementary' as const,
    correctAnswer: 30,
    description: 'Find the complement of 60°',
    hint: '90° - 60° = 30°',
    targetSum: 90
  },
  {
    id: 6,
    givenAngle: 135,
    relationship: 'supplementary' as const,
    correctAnswer: 45,
    description: 'Find the supplement of 135°',
    hint: '180° - 135° = 45°',
    targetSum: 180
  }
];

export const CHAPTER3_LEARNING_OBJECTIVES = [
  { id: 'task-0', label: 'Learn: Complementary Angles', type: 'lesson' as const },
  { id: 'task-1', label: 'Learn: Supplementary Angles', type: 'lesson' as const },
  { id: 'task-2', label: 'Learn: Finding Missing Angles', type: 'lesson' as const },
  { id: 'task-3', label: 'Find Complement of 25°', type: 'minigame' as const },
  { id: 'task-4', label: 'Find Supplement of 110°', type: 'minigame' as const },
  { id: 'task-5', label: 'Find Complement of 42°', type: 'minigame' as const },
  { id: 'task-6', label: 'Find Supplement of 75°', type: 'minigame' as const },
  { id: 'task-7', label: 'Find Complement of 60°', type: 'minigame' as const },
  { id: 'task-8', label: 'Find Supplement of 135°', type: 'minigame' as const },
  { id: 'task-9', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-10', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-11', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-12', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-13', label: 'Pass Quiz Question 5', type: 'quiz' as const },
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

export const CHAPTER3_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Angles Sanctuary)
export const CHAPTER3_NUMBER = 3;

// Relic information for reward screen
export const CHAPTER3_RELIC = {
  name: "Medallion of Harmony",
  image: "/images/relics/medallion-of-harmony.png",
  description: "You have mastered the Angle Forge! The Medallion of Harmony reveals the perfect pairs — complementary and supplementary angles working in unity."
};

// Wizard information
export const CHAPTER3_WIZARD = {
  name: "Complementa, Master of Angle Relationships",
  image: "/images/complementa-wizard.png"
};

// Chapter metadata
export const CHAPTER3_METADATA = {
  title: "The Angle Forge",
  subtitle: "Castle 2 - The Angles Sanctuary",
  description: "Master complementary and supplementary angles, learning to solve for missing angle measures using angle relationships."
};
