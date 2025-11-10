// Castle 2 - Chapter 1: The Hall of Rays
// Theme: Learning about angle types and measurement (acute, right, obtuse, straight, reflex)

export const CHAPTER1_OPENING_DIALOGUE = [
  "Welcome, traveler! I am Angulus, Guardian of the Angles Sanctuary.",
  "Within these sacred halls, beams of light converge to form angles of power.",
  "An Angle is formed when two rays meet at a common point called the vertex.",
  "Come, let us explore the magnificent world of angles together!"
];

// Lesson dialogue with semantic keys for tracking
export const CHAPTER1_LESSON_DIALOGUE = [
  { key: 'intro', text: "Angles are measured in degrees (°), describing the amount of rotation between two rays." },
  { key: 'acute', text: "An Acute Angle measures less than 90° — small, sharp, and precise.", taskId: 'task-0' },
  { key: 'right', text: "A Right Angle measures exactly 90° — forming a perfect corner, like the letter L.", taskId: 'task-1' },
  { key: 'obtuse', text: "An Obtuse Angle measures between 90° and 180° — wider and more open.", taskId: 'task-2' },
  { key: 'straight', text: "A Straight Angle measures exactly 180° — forming a perfectly straight line.", taskId: 'task-3' },
  { key: 'reflex', text: "A Reflex Angle measures between 180° and 360° — more than a straight angle!", taskId: 'task-4' },
  { key: 'protractor', text: "We use a Protractor to measure angles precisely. It's marked from 0° to 180°!", taskId: 'task-5' },
  { key: 'conclusion', text: "Now, let us test your ability to identify and measure these angles!" }
];

export const CHAPTER1_MINIGAME_DIALOGUE = [
  "Excellent! Now let's test your knowledge of angles.",
  "Look at each angle carefully and identify its type.",
  "Choose wisely, young angle-seeker!"
];

type AngleType = 'acute' | 'right' | 'obtuse' | 'straight' | 'reflex';

export const CHAPTER1_MINIGAME_LEVELS: Array<{ 
  angleMeasure: number; 
  angleType: AngleType; 
  name: string;
  description: string;
}> = [
  { angleMeasure: 45, angleType: 'acute', name: 'Acute Angle', description: 'Less than 90°' },
  { angleMeasure: 90, angleType: 'right', name: 'Right Angle', description: 'Exactly 90°' },
  { angleMeasure: 135, angleType: 'obtuse', name: 'Obtuse Angle', description: 'Between 90° and 180°' },
  { angleMeasure: 180, angleType: 'straight', name: 'Straight Angle', description: 'Exactly 180°' },
  { angleMeasure: 60, angleType: 'acute', name: 'Acute Angle', description: 'Less than 90°' },
  { angleMeasure: 120, angleType: 'obtuse', name: 'Obtuse Angle', description: 'Between 90° and 180°' }
];

// Concept cards with semantic keys matching dialogue
export const CHAPTER1_CONCEPTS = [
  { key: 'acute', title: 'Acute Angle', description: "An angle that measures less than 90°. Sharp and precise, like a slice of pizza!", image: '/images/castle2/acute-angle.png', taskId: 'task-0' },
  { key: 'right', title: 'Right Angle', description: "An angle that measures exactly 90°. Forms a perfect corner, like the letter L.", image: '/images/castle2/right-angle.png', taskId: 'task-1' },
  { key: 'obtuse', title: 'Obtuse Angle', description: "An angle that measures between 90° and 180°. Wider and more open than a right angle.", image: '/images/castle2/obtuse-angle.png', taskId: 'task-2' },
  { key: 'straight', title: 'Straight Angle', description: "An angle that measures exactly 180°. Forms a perfectly straight line.", image: '/images/castle2/straight-angle.png', taskId: 'task-3' },
  { key: 'reflex', title: 'Reflex Angle', description: "An angle that measures between 180° and 360°. More than a straight angle!", image: '/images/castle2/reflex-angle.png', taskId: 'task-4' },
  { key: 'protractor', title: 'Protractor', description: "A tool used to measure angles in degrees. Essential for any angle explorer!", image: '/images/castle2/protractor.png', taskId: 'task-5' }
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

export const CHAPTER1_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Angles Sanctuary)
export const CHAPTER1_NUMBER = 1;

// Relic information for reward screen
export const CHAPTER1_RELIC = {
  name: "Protractor of Precision",
  image: "/images/relics/protractor-of-precision.png",
  description: "You have mastered the art of angle measurement! The Protractor of Precision shines with your geometric understanding, revealing the degrees hidden in every corner."
};

// Wizard information
export const CHAPTER1_WIZARD = {
  name: "Angulus, Guardian of the Angles Sanctuary",
  image: "/images/angulus-wizard.png"
};

// Chapter metadata
export const CHAPTER1_METADATA = {
  title: "The Hall of Rays",
  subtitle: "Castle 2 - The Angles Sanctuary",
  description: "Learn to identify and measure different types of angles: acute, right, obtuse, straight, and reflex."
};
