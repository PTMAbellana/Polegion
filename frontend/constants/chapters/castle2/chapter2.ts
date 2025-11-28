// Castle 2 - Chapter 2: The Point of Convergence
// Theme: Vertical angles, adjacent angles, and angles around a point

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER2_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Welcome to the Point of Convergence! I am Vertex, Master of Angle Positions." },
  { scene: 'opening', text: "When lines cross and meet, they create special angle relationships." },
  { scene: 'opening', text: "Angles can be neighbors, opposites, or surround a point completely." },
  { scene: 'opening', text: "Understanding these positions unlocks the secrets of geometric patterns!" },
  
  // Lesson scene (indices 4-10)
  { scene: 'lesson', key: 'intro', text: "Let me show you the powerful relationships between angles at a point!" },
  { scene: 'lesson', key: 'adjacent', text: "Adjacent angles share a common vertex and side, like neighbors next to each other.", taskId: 'task-0' },
  { scene: 'lesson', key: 'vertical', text: "When two lines intersect, they form vertical angles — opposite angles that are always equal!", taskId: 'task-1' },
  { scene: 'lesson', key: 'around-point', text: "All angles around a point add up to 360° — a complete circle!", taskId: 'task-2' },
  { scene: 'lesson', key: 'linear-pair', text: "Adjacent angles on a straight line form a linear pair and add up to 180°.", taskId: 'task-3' },
  { scene: 'lesson', key: 'finding-angles', text: "Use these relationships to find missing angles: if you know some angles, you can calculate the rest!", taskId: 'task-4' },
  { scene: 'lesson', key: 'practice', text: "Now, let us solve angle puzzles using these powerful relationships!" },
  
  // Minigame scene (indices 11-13)
  { scene: 'minigame', text: "Vertex challenges you! Look at the diagram and find the missing angle." },
  { scene: 'minigame', text: "Use what you know: vertical angles are equal, angles around a point sum to 360°!" },
  { scene: 'minigame', text: "Think carefully about the relationships!" },
];

// Scene ranges for navigation
export const CHAPTER2_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 10 },
  minigame: { start: 11, end: 13 },
};

// Legacy exports for backward compatibility
export const CHAPTER2_OPENING_DIALOGUE = CHAPTER2_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER2_LESSON_DIALOGUE = CHAPTER2_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER2_MINIGAME_DIALOGUE = CHAPTER2_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

// Concept cards for lesson scene
export const CHAPTER2_CONCEPTS = [
  {
    key: 'adjacent',
    title: 'Adjacent Angles',
    summary: 'Angles that share a vertex and a common side',
    description: 'Two angles are adjacent when they share a common vertex and side, like neighbors next to each other. They don\'t overlap!',
    image: '/images/castle2/adjacent-angles.png'
  },
  {
    key: 'vertical',
    title: 'Vertical Angles',
    summary: 'Opposite angles formed by intersecting lines - always equal!',
    description: 'When two lines cross, they form vertical angles across from each other. These special angles are always equal in measure!',
    image: '/images/castle2/vertical-angles.png'
  },
  {
    key: 'around-point',
    title: 'Angles Around a Point',
    summary: 'All angles meeting at one point add up to 360°',
    description: 'When multiple angles meet at a single point, their measures always add up to 360° - a complete rotation!',
    image: '/images/castle2/angles-around-point.png'
  },
  {
    key: 'linear-pair',
    title: 'Linear Pair',
    summary: 'Adjacent angles on a straight line that sum to 180°',
    description: 'A linear pair consists of two adjacent angles on a straight line. Together, they always sum to 180°!',
    image: '/images/castle2/linear-pair.png'
  },
  {
    key: 'finding-angles',
    title: 'Finding Missing Angles',
    summary: 'Use angle relationships to solve for unknowns',
    description: 'Apply what you know about angle relationships to find missing angle measures. Math detective work!',
    image: '/images/castle2/finding-angles.png'
  }
];

export const CHAPTER2_MINIGAME_LEVELS = [
  {
    id: 1,
    type: 'vertical-angles',
    givenAngles: [65],
    missingAngleIndex: 2, // Which angle to solve for (0-3, going clockwise)
    correctAnswer: 65,
    description: 'Find the vertical angle',
    hint: 'Vertical angles are equal!',
    diagram: 'two-lines-intersecting' // Type of diagram to show
  },
  {
    id: 2,
    type: 'linear-pair',
    givenAngles: [110],
    missingAngleIndex: 1,
    correctAnswer: 70,
    description: 'Find the linear pair angle',
    hint: 'Linear pair angles add to 180°',
    diagram: 'straight-line-with-angles'
  },
  {
    id: 3,
    type: 'around-point',
    givenAngles: [80, 120, 90],
    missingAngleIndex: 3,
    correctAnswer: 70,
    description: 'Find the missing angle around the point',
    hint: 'All angles around a point = 360°',
    diagram: 'four-angles-at-point'
  },
  {
    id: 4,
    type: 'vertical-angles1',
    givenAngles: [135],
    missingAngleIndex: 2,
    correctAnswer: 135,
    description: 'Find the vertical angle',
    hint: 'Remember: vertical angles are always equal!',
    diagram: 'two-lines-intersecting'
  },
  {
    id: 5,
    type: 'linear-pair1',
    givenAngles: [45],
    missingAngleIndex: 1,
    correctAnswer: 135,
    description: 'Find the linear pair angle',
    hint: '180° - 45° = ?',
    diagram: 'straight-line-with-angles'
  },
  {
    id: 6,
    type: 'around-point1',
    givenAngles: [95, 105, 85],
    missingAngleIndex: 3,
    correctAnswer: 75,
    description: 'Find the missing angle',
    hint: 'Add the given angles, then subtract from 360°',
    diagram: 'four-angles-at-point'
  }
];

export const CHAPTER2_LEARNING_OBJECTIVES = [
  { id: 'task-0', label: 'Learn: Adjacent Angles', type: 'lesson' as const },
  { id: 'task-1', label: 'Learn: Vertical Angles', type: 'lesson' as const },
  { id: 'task-2', label: 'Learn: Angles Around a Point', type: 'lesson' as const },
  { id: 'task-3', label: 'Learn: Linear Pairs', type: 'lesson' as const },
  { id: 'task-4', label: 'Learn: Finding Missing Angles', type: 'lesson' as const },
  { id: 'task-5', key: 'minigame', label: 'Complete Angle Relationships', type: 'minigame' as const },
  { id: 'task-6', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-7', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-8', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-9', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-10', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER2_XP_VALUES = {
  lesson: 35,
  minigame: 40,
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  quiz4: 15,
  quiz5: 15,
  total: 150,
};

export const CHAPTER2_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Polygon Citadel)
export const CHAPTER2_NUMBER = 2;

// Audio narration paths - matches dialogue indices
export const CHAPTER2_NARRATION = {
  opening: [
    '/audio/castle2/chapter2/opening_0.wav',
    '/audio/castle2/chapter2/opening_1.wav',
    '/audio/castle2/chapter2/opening_2.wav',
    '/audio/castle2/chapter2/opening_3.wav',
  ],
  lesson: [
    '/audio/castle2/chapter2/lesson_0.wav',
    '/audio/castle2/chapter2/lesson_1.wav',
    '/audio/castle2/chapter2/lesson_2.wav',
    '/audio/castle2/chapter2/lesson_3.wav',
    '/audio/castle2/chapter2/lesson_4.wav',
    '/audio/castle2/chapter2/lesson_5.wav',
    '/audio/castle2/chapter2/lesson_6.wav',
  ],
  minigame: [
    '/audio/castle2/chapter2/minigame_0.wav',
    '/audio/castle2/chapter2/minigame_1.wav',
    '/audio/castle2/chapter2/minigame_2.wav',
  ],
};

// Relic information for reward screen
export const CHAPTER2_RELIC = {
  name: "Lens of Convergence",
  image: "/images/relics/lens-of-convergence.png",
  description: "You have mastered angle relationships! The Lens of Convergence reveals how angles connect, showing you vertical angles, linear pairs, and the harmony of angles around a point."
};

// Wizard information
export const CHAPTER2_WIZARD = {
  name: "Vertex, Master of Angle Positions",
  image: "/images/vertex-wizard.png"
};

// Chapter metadata
export const CHAPTER2_METADATA = {
  title: "The Point of Convergence",
  subtitle: "Castle 2 - Polygon Citadel",
  description: "Discover how angles relate when lines intersect. Master vertical angles, linear pairs, and angles around a point to solve geometric puzzles."
};
