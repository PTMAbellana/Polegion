// Castle 4 - Chapter 3: The Hall of Angles
// Theme: Interior angles of polygons using (n-2) × 180°

export const CHAPTER3_OPENING_DIALOGUE = [
  "Impressive drawing skills, geometer!",
  "Now we enter the Hall of Angles, where ancient formulas are inscribed.",
  "Every polygon hides a secret pattern within its angles.",
  "Let us discover the formula that unlocks this mystery!"
];

export const CHAPTER3_LESSON_DIALOGUE = [
  { key: 'intro', text: "The sum of INTERIOR ANGLES in a polygon follows a beautiful pattern.", taskId: 'task-0' },
  { key: 'formula', text: "The formula is: Sum = (n - 2) × 180°, where n is the number of sides.", taskId: 'task-1' },
  { key: 'triangle-example', text: "Triangle (n=3): (3-2) × 180° = 1 × 180° = 180°", taskId: 'task-2' },
  { key: 'quadrilateral-example', text: "Quadrilateral (n=4): (4-2) × 180° = 2 × 180° = 360°", taskId: 'task-3' },
  { key: 'pentagon-example', text: "Pentagon (n=5): (5-2) × 180° = 3 × 180° = 540°", taskId: 'task-4' },
  { key: 'hexagon-example', text: "Hexagon (n=6): (6-2) × 180° = 4 × 180° = 720°", taskId: 'task-5' },
  { key: 'regular', text: "For REGULAR polygons (all sides equal), each angle = Sum ÷ n", taskId: 'task-6' },
  { key: 'regular-example', text: "Regular pentagon: Each angle = 540° ÷ 5 = 108°", taskId: 'task-7' },
  { key: 'practice', text: "Now calculate interior angles for any polygon!" }
];

export const CHAPTER3_MINIGAME_DIALOGUE = [
  "The Hall presents you with angular challenges!",
  "Calculate the sum of interior angles.",
  "For regular polygons, find each individual angle!"
];

export const CHAPTER3_MINIGAME_LEVELS = [
  { id: 1, sides: 3, isRegular: false, correctAnswer: 180, instruction: 'Sum of interior angles in triangle', hint: 'Use (n-2) × 180°' },
  { id: 2, sides: 4, isRegular: false, correctAnswer: 360, instruction: 'Sum of interior angles in quadrilateral', hint: 'Use (n-2) × 180°' },
  { id: 3, sides: 5, isRegular: false, correctAnswer: 540, instruction: 'Sum of interior angles in pentagon', hint: 'Use (n-2) × 180°' },
  { id: 4, sides: 8, isRegular: false, correctAnswer: 1080, instruction: 'Sum of interior angles in octagon', hint: 'Use (n-2) × 180°' },
  { id: 5, sides: 6, isRegular: true, correctAnswer: 120, instruction: 'Each angle in regular hexagon', hint: 'Sum ÷ number of sides' },
  { id: 6, sides: 5, isRegular: true, correctAnswer: 108, instruction: 'Each angle in regular pentagon', hint: 'Sum ÷ number of sides' }
];

export const CHAPTER3_CONCEPTS = [
  {
    key: 'interior-angles',
    title: 'Interior Angles',
    summary: 'The angles inside a polygon'
  },
  {
    key: 'formula',
    title: 'Angle Sum Formula',
    summary: 'Sum = (n - 2) × 180°'
  },
  {
    key: 'triangle',
    title: 'Triangle Angles',
    summary: '(3-2) × 180° = 180°'
  },
  {
    key: 'quadrilateral',
    title: 'Quadrilateral Angles',
    summary: '(4-2) × 180° = 360°'
  },
  {
    key: 'pentagon',
    title: 'Pentagon Angles',
    summary: '(5-2) × 180° = 540°'
  },
  {
    key: 'hexagon',
    title: 'Hexagon Angles',
    summary: '(6-2) × 180° = 720°'
  },
  {
    key: 'regular',
    title: 'Regular Polygons',
    summary: 'Each angle = Sum ÷ n'
  },
  {
    key: 'regular-example',
    title: 'Regular Pentagon',
    summary: '540° ÷ 5 = 108° per angle'
  }
];

export const CHAPTER3_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'interior-angles', label: 'Learn: Interior Angles', type: 'lesson' as const },
  { id: 'task-1', key: 'formula', label: 'Learn: (n-2) × 180°', type: 'lesson' as const },
  { id: 'task-2', key: 'triangle', label: 'Learn: Triangle Angles', type: 'lesson' as const },
  { id: 'task-3', key: 'quadrilateral', label: 'Learn: Quadrilateral Angles', type: 'lesson' as const },
  { id: 'task-4', key: 'pentagon', label: 'Learn: Pentagon Angles', type: 'lesson' as const },
  { id: 'task-5', key: 'hexagon', label: 'Learn: Hexagon Angles', type: 'lesson' as const },
  { id: 'task-6', key: 'regular', label: 'Learn: Regular Polygons', type: 'lesson' as const },
  { id: 'task-7', key: 'regular-example', label: 'Learn: Regular Example', type: 'lesson' as const },
  { id: 'task-8', key: 'minigame', label: 'Complete Angle Calculations', type: 'minigame' as const },
  { id: 'task-9', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-12', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-13', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER3_XP_VALUES = {
  lesson: 70,
  minigame: 75,
  quiz1: 12,
  quiz2: 12,
  quiz3: 12,
  quiz4: 12,
  quiz5: 12,
  total: 205,
};

export const CHAPTER3_CASTLE_ID = '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b';
export const CHAPTER3_NUMBER = 3;

export const CHAPTER3_RELIC = {
  name: "Protractor of Power",
  image: "/images/relics/protractor-power.png",
  description: "You have mastered interior angles! The Protractor of Power reveals the angular secrets of any polygon."
};

export const CHAPTER3_WIZARD = {
  name: "Polymus, Master of Many Sides",
  image: "/images/polymus-wizard.png"
};

export const CHAPTER3_METADATA = {
  title: "The Hall of Angles",
  subtitle: "Castle 4 - The Polygon Citadel",
  description: "Calculate interior angles using (n-2) × 180° and find individual angles in regular polygons."
};
