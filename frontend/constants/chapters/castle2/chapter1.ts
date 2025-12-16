// Castle 2 - Chapter 1: The Hall of Rays
// Theme: Learning about angle types and measurement (acute, right, obtuse, straight, reflex)

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER1_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Welcome, traveler! I am Sylvan, Guardian of the Polygon Citadel." },
  { scene: 'opening', text: "Within these sacred halls, beams of light converge to form angles of power." },
  { scene: 'opening', text: "An Angle is formed when two rays meet at a common point called the vertex." },
  { scene: 'opening', text: "Come, let us explore the magnificent world of angles together!" },
  
  // Lesson scene (indices 4-11)
  { scene: 'lesson', key: 'intro', text: "Angles are measured in degrees (°), describing the amount of rotation between two rays." },
  { scene: 'lesson', key: 'acute', text: "An Acute Angle measures less than 90°, small, sharp, and precise.", taskId: 'task-0' },
  { scene: 'lesson', key: 'right', text: "A Right Angle measures exactly 90°, forming a perfect corner, like the letter L.", taskId: 'task-1' },
  { scene: 'lesson', key: 'obtuse', text: "An Obtuse Angle measures between 90° and 180°, wider and more open.", taskId: 'task-2' },
  { scene: 'lesson', key: 'straight', text: "A Straight Angle measures exactly 180°, forming a perfectly straight line.", taskId: 'task-3' },
  { scene: 'lesson', key: 'reflex', text: "A Reflex Angle measures between 180° and 360°, more than a straight angle!", taskId: 'task-4' },
  { scene: 'lesson', key: 'protractor', text: "We use a Protractor to measure angles precisely. It's marked from 0° to 180°!", taskId: 'task-5' },
  { scene: 'lesson', key: 'conclusion', text: "Now, let us test your ability to identify and measure these angles!" },
  
  // Minigame scene (indices 12-14)
  { scene: 'minigame', text: "Excellent! Now it's time to construct angles yourself!" },
  { scene: 'minigame', text: "Drag the pink ray to create the angle shown. Watch the degree measurement change." },
  { scene: 'minigame', text: "When you think your angle is correct, click the Submit button below the canvas!" },
];

// Scene ranges for navigation
export const CHAPTER1_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 11 },
  minigame: { start: 12, end: 14 },
};

// Legacy exports for backward compatibility
export const CHAPTER1_OPENING_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER1_LESSON_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER1_MINIGAME_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

type AngleType = 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex';

export const CHAPTER1_MINIGAME_LEVELS: Array<{ 
  targetAngle: number;
  tolerance: number;
  angleType: AngleType; 
  name: string;
  description: string;
  instruction: string;
}> = [
  { 
    targetAngle: 45, 
    tolerance: 5,
    angleType: 'acute', 
    name: 'Acute Angle', 
    description: 'Less than 90°',
    instruction: 'Construct a 45° acute angle by dragging the ray. Click Submit when ready!'
  },
  { 
    targetAngle: 90, 
    tolerance: 3,
    angleType: 'right', 
    name: 'Right Angle', 
    description: 'Exactly 90°',
    instruction: 'Construct a perfect 90° right angle. Precision is key!'
  },
  { 
    targetAngle: 135, 
    tolerance: 5,
    angleType: 'obtuse', 
    name: 'Obtuse Angle', 
    description: 'Between 90° and 180°',
    instruction: 'Construct a 135° obtuse angle. Make it wide!'
  },
  { 
    targetAngle: 180, 
    tolerance: 3,
    angleType: 'straight', 
    name: 'Straight Angle', 
    description: 'Exactly 180°',
    instruction: 'Construct a perfectly straight 180° angle!'
  },
  { 
    targetAngle: 60, 
    tolerance: 5,
    angleType: 'acute', 
    name: 'Acute Angle', 
    description: 'Less than 90°',
    instruction: 'Construct a 60° acute angle!'
  },
  { 
    targetAngle: 120, 
    tolerance: 5,
    angleType: 'obtuse', 
    name: 'Obtuse Angle', 
    description: 'Between 90° and 180°',
    instruction: 'Construct a 120° obtuse angle!'
  }
];

// Concept cards with semantic keys matching dialogue
export const CHAPTER1_CONCEPTS = [
  { key: 'acute', title: 'Acute Angle', description: "An angle that measures less than 90°. Sharp and precise, like a slice of pizza!", image: '/images/castle2/acute-angle.webp', taskId: 'task-0' },
  { key: 'right', title: 'Right Angle', description: "An angle that measures exactly 90°. Forms a perfect corner, like the letter L.", image: '/images/castle2/right-angle.webp', taskId: 'task-1' },
  { key: 'obtuse', title: 'Obtuse Angle', description: "An angle that measures between 90° and 180°. Wider and more open than a right angle.", image: '/images/castle2/obtuse-angle.webp', taskId: 'task-2' },
  { key: 'straight', title: 'Straight Angle', description: "An angle that measures exactly 180°. Forms a perfectly straight line.", image: '/images/castle2/straight-angle.webp', taskId: 'task-3' },
  { key: 'reflex', title: 'Reflex Angle', description: "An angle that measures between 180° and 360°. More than a straight angle!", image: '/images/castle2/reflex-angle.webp', taskId: 'task-4' },
  { key: 'protractor', title: 'Protractor', description: "A tool used to measure angles in degrees. Essential for any angle explorer!", image: '/images/castle2/protractor.webp', taskId: 'task-5' }
];

export const CHAPTER1_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'acute', label: 'Learn about Acute Angles', type: 'lesson' as const },
  { id: 'task-1', key: 'right', label: 'Learn about Right Angles', type: 'lesson' as const },
  { id: 'task-2', key: 'obtuse', label: 'Learn about Obtuse Angles', type: 'lesson' as const },
  { id: 'task-3', key: 'straight', label: 'Learn about Straight Angles', type: 'lesson' as const },
  { id: 'task-4', key: 'reflex', label: 'Learn about Reflex Angles', type: 'lesson' as const },
  { id: 'task-5', key: 'protractor', label: 'Learn about the Protractor', type: 'lesson' as const },
  { id: 'task-6', key: 'minigame', label: 'Complete Angle Identification', type: 'minigame' as const },
  { id: 'task-7', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-8', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER1_XP_VALUES = {
  lesson: 35,
  minigame: 40,
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  quiz4: 15,
  quiz5: 15,
  total: 150,
};

export const CHAPTER1_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Polygon Citadel)
export const CHAPTER1_NUMBER = 1;

// Audio narration paths - matches dialogue indices
export const CHAPTER1_NARRATION = {
  opening: [
    '/audio/castle2/chapter1/opening_0.mp3',
    '/audio/castle2/chapter1/opening_1.mp3',
    '/audio/castle2/chapter1/opening_2.mp3',
    '/audio/castle2/chapter1/opening_3.mp3',
  ],
  lesson: [
    '/audio/castle2/chapter1/lesson_0.mp3',
    '/audio/castle2/chapter1/lesson_1.mp3',
    '/audio/castle2/chapter1/lesson_2.mp3',
    '/audio/castle2/chapter1/lesson_3.mp3',
    '/audio/castle2/chapter1/lesson_4.mp3',
    '/audio/castle2/chapter1/lesson_5.mp3',
    '/audio/castle2/chapter1/lesson_6.mp3',
    '/audio/castle2/chapter1/lesson_7.mp3',
  ],
  minigame: [
    '/audio/castle2/chapter1/minigame_0.mp3',
    '/audio/castle2/chapter1/minigame_1.mp3',
    '/audio/castle2/chapter1/minigame_2.mp3',
  ],
};

// Relic information for reward screen
export const CHAPTER1_RELIC = {
  name: "Protractor of Precision",
  image: "/images/relics/protractor-of-precision.webp",
  description: "You have mastered the art of angle measurement! The Protractor of Precision shines with your geometric understanding, revealing the degrees hidden in every corner."
};

// Wizard information
export const CHAPTER1_WIZARD = {
  name: "Sylvan, Guardian of the Polygon Citadel",
  image: "/images/wizards/sylvan-wizard.webp"
};

// Chapter metadata
export const CHAPTER1_METADATA = {
  title: "The Hall of Rays",
  subtitle: "Castle 2 - Polygon Citadel",
  description: "Learn to identify and measure different types of angles: acute, right, obtuse, straight, and reflex."
};
