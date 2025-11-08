// Castle 2 - Chapter 4: The Temple of Solutions
// Theme: Solving angle word problems and real-world applications

export const CHAPTER4_OPENING_DIALOGUE = [
  "Welcome to the Temple of Solutions! I am Solvera, Keeper of Geometric Wisdom.",
  "Here, angles reveal themselves through puzzles and real-world challenges.",
  "Word problems require careful reading and mathematical thinking.",
  "Let us combine all your angle knowledge to solve these mysteries!"
];

export const CHAPTER4_LESSON_DIALOGUE = [
  "Word problems translate real situations into mathematical equations.",
  "Read carefully to identify: What angles are given? What relationships exist?",
  "For complementary problems, use: angle + complement = 90°.",
  "For supplementary problems, use: angle + supplement = 180°.",
  "For angle relationships, set up equations based on the problem description.",
  "Now, let us solve these geometric riddles together!"
];

export const CHAPTER4_MINIGAME_DIALOGUE = [
  "Solvera presents a challenge! Read the problem and solve for the unknown angle.",
  "Think step by step: identify the relationship, set up the equation, solve.",
  "Your geometric wisdom will guide you!"
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

export const CHAPTER4_LEARNING_OBJECTIVES = [
  { id: 'task-0', label: 'Learn: Reading Word Problems', type: 'lesson' as const },
  { id: 'task-1', label: 'Learn: Setting Up Equations', type: 'lesson' as const },
  { id: 'task-2', label: 'Learn: Solving Angle Equations', type: 'lesson' as const },
  { id: 'task-3', label: 'Solve Complementary Problem', type: 'minigame' as const },
  { id: 'task-4', label: 'Solve Supplementary Problem', type: 'minigame' as const },
  { id: 'task-5', label: 'Solve Equal Complement Problem', type: 'minigame' as const },
  { id: 'task-6', label: 'Solve Relationship Problem', type: 'minigame' as const },
  { id: 'task-7', label: 'Solve Difference Problem', type: 'minigame' as const },
  { id: 'task-8', label: 'Solve Straight Line Problem', type: 'minigame' as const },
  { id: 'task-9', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-10', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-11', label: 'Pass Quiz Question 3', type: 'quiz' as const },
];

export const CHAPTER4_XP_VALUES = {
  lesson: 35,
  minigame: 40,
  quiz1: 25,
  quiz2: 25,
  quiz3: 25,
  total: 150,
};

export const CHAPTER4_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Angles Sanctuary)
export const CHAPTER4_NUMBER = 4;

// Relic information for reward screen
export const CHAPTER4_RELIC = {
  name: "Scroll of Solutions",
  image: "/images/relics/scroll-of-solutions.png",
  description: "You have conquered the Temple of Solutions! The Scroll of Solutions grants you the power to solve any angle problem, translating words into geometric wisdom."
};

// Wizard information
export const CHAPTER4_WIZARD = {
  name: "Solvera, Keeper of Geometric Wisdom",
  image: "/images/solvera-wizard.png"
};

// Chapter metadata
export const CHAPTER4_METADATA = {
  title: "The Temple of Solutions",
  subtitle: "Castle 2 - The Angles Sanctuary",
  description: "Apply your angle knowledge to solve challenging word problems and real-world geometric scenarios."
};
