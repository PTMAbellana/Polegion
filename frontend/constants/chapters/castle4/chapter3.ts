// Castle 4 - Chapter 3: The Hall of Angles
// Theme: Interior angles of polygons using (n-2) × 180°

interface ChapterDialogue { scene: 'opening' | 'lesson' | 'minigame'; text: string; key?: string; taskId?: string; }

export const CHAPTER3_DIALOGUE: ChapterDialogue[] = [
  { scene: 'opening', text: "Impressive drawing skills, geometer!" },
  { scene: 'opening', text: "Now we enter the Hall of Angles, where ancient formulas are inscribed." },
  { scene: 'opening', text: "Every polygon hides a secret pattern within its angles." },
  { scene: 'opening', text: "Let us discover the formula that unlocks this mystery!" },
  { scene: 'lesson', key: 'intro', text: "The sum of INTERIOR ANGLES in a polygon follows a beautiful pattern.", taskId: 'task-0' },
  { scene: 'lesson', key: 'formula', text: "The formula is: Sum = (n - 2) × 180°, where n is the number of sides.", taskId: 'task-1' },
  { scene: 'lesson', key: 'triangle-example', text: "Triangle (n=3): (3-2) × 180° = 1 × 180° = 180°", taskId: 'task-2' },
  { scene: 'lesson', key: 'quadrilateral-example', text: "Quadrilateral (n=4): (4-2) × 180° = 2 × 180° = 360°", taskId: 'task-3' },
  { scene: 'lesson', key: 'pentagon-example', text: "Pentagon (n=5): (5-2) × 180° = 3 × 180° = 540°", taskId: 'task-4' },
  { scene: 'lesson', key: 'hexagon-example', text: "Hexagon (n=6): (6-2) × 180° = 4 × 180° = 720°", taskId: 'task-5' },
  { scene: 'lesson', key: 'regular', text: "For REGULAR polygons (all sides equal), each angle = Sum ÷ n", taskId: 'task-6' },
  { scene: 'lesson', key: 'regular-example', text: "Regular pentagon: Each angle = 540° ÷ 5 = 108°", taskId: 'task-7' },
  { scene: 'lesson', key: 'practice', text: "Now calculate interior angles for any polygon!" },
  { scene: 'minigame', text: "The Hall presents you with angular challenges!" },
  { scene: 'minigame', text: "Calculate the sum of interior angles." },
  { scene: 'minigame', text: "For regular polygons, find each individual angle!" },
];

export const CHAPTER3_SCENE_RANGES = { opening: { start: 0, end: 3 }, lesson: { start: 4, end: 12 }, minigame: { start: 13, end: 15 } };
export const CHAPTER3_OPENING_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER3_LESSON_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER3_MINIGAME_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

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
    summary: 'The angles inside a polygon',
    description: 'Angles formed inside a polygon\'s sides.',
    image: '/images/castle4/chapter3/interior-angles.webp',
    taskId: 'task-0'
  },
  {
    key: 'formula',
    title: 'Angle Sum Formula',
    summary: 'Sum = (n - 2) × 180°',
    description: 'Sum equals (n − 2) times 180 degrees.',
    image: '/images/castle4/chapter3/formula.webp',
    taskId: 'task-1'
  },
  {
    key: 'triangle',
    title: 'Triangle Angles',
    summary: '(3-2) × 180° = 180°',
    description: 'Three sides give a total of 180 degrees.',
    image: '/images/castle4/chapter3/triangle.webp',
    taskId: 'task-2'
  },
  {
    key: 'quadrilateral',
    title: 'Quadrilateral Angles',
    summary: '(4-2) × 180° = 360°',
    description: 'Four sides give a total of 360 degrees.',
    image: '/images/castle4/chapter3/quadrilateral.webp',
    taskId: 'task-3'
  },
  {
    key: 'pentagon',
    title: 'Pentagon Angles',
    summary: '(5-2) × 180° = 540°',
    description: 'Five sides give a total of 540 degrees.',
    image: '/images/castle4/chapter3/pentagon.webp',
    taskId: 'task-4'
  },
  {
    key: 'hexagon',
    title: 'Hexagon Angles',
    summary: '(6-2) × 180° = 720°',
    description: 'Six sides give a total of 720 degrees.',
    image: '/images/castle4/chapter3/hexagon.webp',
    taskId: 'task-5'
  },
  {
    key: 'regular',
    title: 'Regular Polygons',
    summary: 'Each angle = Sum ÷ n',
    description: 'Equal sides and angles; each angle is Sum divided by n.',
    image: '/images/castle4/chapter3/regular.webp',
    taskId: 'task-6'
  },
  {
    key: 'regular-example',
    title: 'Regular Pentagon',
    summary: '540° ÷ 5 = 108° per angle',
    description: 'Each angle in a regular pentagon is 108 degrees.',
    image: '/images/castle4/chapter3/regular-example.webp',
    taskId: 'task-7'
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
  minigame: 40,
  quiz1: 23,
  quiz2: 23,
  quiz3: 23,
  quiz4: 23,
  quiz5: 23,
  total: 225,
};

export const CHAPTER3_CASTLE_ID = '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b';
export const CHAPTER3_NUMBER = 3;

// Audio narration paths - matches dialogue indices
export const CHAPTER3_NARRATION = {
  opening: [
    '/audio/castle4/chapter3/opening_0.mp3',
    '/audio/castle4/chapter3/opening_1.mp3',
    '/audio/castle4/chapter3/opening_2.mp3',
    '/audio/castle4/chapter3/opening_3.mp3',
  ],
  lesson: [
    '/audio/castle4/chapter3/lesson_0.mp3',
    '/audio/castle4/chapter3/lesson_1.mp3',
    '/audio/castle4/chapter3/lesson_2.mp3',
    '/audio/castle4/chapter3/lesson_3.mp3',
    '/audio/castle4/chapter3/lesson_4.mp3',
    '/audio/castle4/chapter3/lesson_5.mp3',
    '/audio/castle4/chapter3/lesson_6.mp3',
    '/audio/castle4/chapter3/lesson_7.mp3',
    '/audio/castle4/chapter3/lesson_8.mp3',
  ],
  minigame: [
    '/audio/castle4/chapter3/minigame_0.mp3',
    '/audio/castle4/chapter3/minigame_1.mp3',
    '/audio/castle4/chapter3/minigame_2.mp3',
  ],
};

export const CHAPTER3_RELIC = {
  name: "Protractor of Power",
  image: "/images/relics/protractor-power.webp",
  description: "You have mastered interior angles! The Protractor of Power reveals the angular secrets of any polygon."
};

export const CHAPTER3_WIZARD = {
  name: "Polymus, Master of Many Sides",
  image: "/images/wizards/polymus-wizard.webp"
};

export const CHAPTER3_METADATA = {
  title: "The Hall of Angles",
  subtitle: "Castle 4 - The Fractal Bastion",
  description: "Calculate interior angles using (n-2) × 180° and find individual angles in regular polygons."
};
