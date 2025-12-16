// Castle 3 - Chapter 2: The Path of the Perimeter
// Theme: Circumference of circles using C = 2πr and C = πd

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER2_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Well done, seeker! You understand the parts of the circle." },
  { scene: 'opening', text: "Now we venture to the massive circular gate of ancient coral." },
  { scene: 'opening', text: "The distance around a circle has a special name: CIRCUMFERENCE." },
  { scene: 'opening', text: "Let us unlock the formula that measures this sacred path!" },
  
  // Lesson scene (indices 4-10)
  { scene: 'lesson', key: 'intro', text: "The CIRCUMFERENCE is the distance around the circle, like walking along its edge.", taskId: 'task-0' },
  { scene: 'lesson', key: 'pi', text: "We use the magical constant π (pi) ≈ 3.14159... It represents the ratio of circumference to diameter!", taskId: 'task-1' },
  { scene: 'lesson', key: 'formula-radius', text: "When you know the radius, use: C = 2πr", taskId: 'task-2' },
  { scene: 'lesson', key: 'formula-diameter', text: "When you know the diameter, use: C = πd", taskId: 'task-3' },
  { scene: 'lesson', key: 'example1', text: "Example: If radius = 5 cm, then C = 2π(5) = 10π ≈ 31.4 cm", taskId: 'task-4' },
  { scene: 'lesson', key: 'example2', text: "Example: If diameter = 12 cm, then C = π(12) = 12π ≈ 37.7 cm", taskId: 'task-5' },
  { scene: 'lesson', key: 'practice', text: "Now calculate circumferences and open the coral gate!" },
  
  // Minigame scene (indices 11-13)
  { scene: 'minigame', text: "The gate presents you with circular locks!" },
  { scene: 'minigame', text: "Calculate the circumference to unlock each one." },
  { scene: 'minigame', text: "Use C = 2πr or C = πd. Round to 1 decimal place!" },
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

export const CHAPTER2_MINIGAME_LEVELS = [
  { id: 1, radius: 3, diameter: null, correctAnswer: 18.8, symbolicAnswer: '6π', acceptPi: true, instruction: 'Find circumference (radius = 3 cm)', hint: 'Use C = 2πr. Enter exact (e.g., 6π) or round to 1 decimal.' },
  { id: 2, radius: null, diameter: 10, correctAnswer: 31.4, symbolicAnswer: '10π', acceptPi: true, instruction: 'Find circumference (diameter = 10 cm)', hint: 'Use C = πd. Enter exact (e.g., 10π) or round to 1 decimal.' },
  { id: 3, radius: 7, diameter: null, correctAnswer: 44.0, symbolicAnswer: '14π', acceptPi: true, instruction: 'Find circumference (radius = 7 cm)', hint: 'Use C = 2πr. Enter exact (e.g., 14π) or round to 1 decimal.' },
  { id: 4, radius: null, diameter: 15, correctAnswer: 47.1, symbolicAnswer: '15π', acceptPi: true, instruction: 'Find circumference (diameter = 15 cm)', hint: 'Use C = πd. Enter exact (e.g., 15π) or round to 1 decimal.' },
  { id: 5, radius: 4.5, diameter: null, correctAnswer: 28.3, symbolicAnswer: '9π', acceptPi: true, instruction: 'Find circumference (radius = 4.5 cm)', hint: 'Use C = 2πr. Enter exact (e.g., 9π) or round to 1 decimal.' },
  { id: 6, radius: null, diameter: 20, correctAnswer: 62.8, symbolicAnswer: '20π', acceptPi: true, instruction: 'Find circumference (diameter = 20 cm)', hint: 'Use C = πd. Enter exact (e.g., 20π) or round to 1 decimal.' }
];

export const CHAPTER2_CONCEPTS = [
  {
    key: 'circumference',
    title: 'Circumference',
    summary: 'The distance around a circle',
    description: 'The full length around a circle\'s edge.',
    image: '/images/castle3/circumference.webp'
  },
  {
    key: 'pi',
    title: 'Pi (π)',
    summary: 'A special constant approximately equal to 3.14159',
    description: 'A constant ratio of circumference to diameter, about 3.14159.',
    image: '/images/castle3/pi.webp'
  },
  {
    key: 'formula-radius',
    title: 'Formula with Radius',
    summary: 'C = 2πr (when radius is known)',
    description: 'Use radius to compute circumference: two times π times r.',
    image: '/images/castle3/formula-radius.webp'
  },
  {
    key: 'formula-diameter',
    title: 'Formula with Diameter',
    summary: 'C = πd (when diameter is known)',
    description: 'Use diameter to compute circumference: π times d.',
    image: '/images/castle3/formula-diameter.webp'
  },
  {
    key: 'example1',
    title: 'Example: Using Radius',
    summary: 'If r = 5, then C = 2π(5) = 10π ≈ 31.4',
    description: 'With r = 5 cm, C ≈ 31.4 cm using 2πr.',
    image: '/images/castle3/example1.webp'
  },
  {
    key: 'example2',
    title: 'Example: Using Diameter',
    summary: 'If d = 12, then C = π(12) = 12π ≈ 37.7',
    description: 'With d = 12 cm, C ≈ 37.7 cm using πd.',
    image: '/images/castle3/example2.webp'
  }
];

export const CHAPTER2_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'circumference', label: 'Learn: Circumference', type: 'lesson' as const },
  { id: 'task-1', key: 'pi', label: 'Learn: Pi (π)', type: 'lesson' as const },
  { id: 'task-2', key: 'formula-radius', label: 'Learn: C = 2πr', type: 'lesson' as const },
  { id: 'task-3', key: 'formula-diameter', label: 'Learn: C = πd', type: 'lesson' as const },
  { id: 'task-4', key: 'example1', label: 'Learn: Example with Radius', type: 'lesson' as const },
  { id: 'task-5', key: 'example2', label: 'Learn: Example with Diameter', type: 'lesson' as const },
  { id: 'task-6', key: 'minigame', label: 'Complete Circumference Calculations', type: 'minigame' as const },
  { id: 'task-7', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-8', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER2_XP_VALUES = {
  lesson: 130,
  minigame: 60,
  quiz1: 12,
  quiz2: 12,
  quiz3: 12,
  quiz4: 12,
  quiz5: 12,
  total: 250,
};

export const CHAPTER2_CASTLE_ID = '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a';
export const CHAPTER2_NUMBER = 2;

// Audio narration paths - matches dialogue indices
export const CHAPTER2_NARRATION = {
  opening: [
    '/audio/castle3/chapter2/opening_0.wav',
    '/audio/castle3/chapter2/opening_1.wav',
    '/audio/castle3/chapter2/opening_2.wav',
    '/audio/castle3/chapter2/opening_3.wav',
  ],
  lesson: [
    '/audio/castle3/chapter2/lesson_0.wav',
    '/audio/castle3/chapter2/lesson_1.wav',
    '/audio/castle3/chapter2/lesson_2.wav',
    '/audio/castle3/chapter2/lesson_3.wav',
    '/audio/castle3/chapter2/lesson_4.wav',
    '/audio/castle3/chapter2/lesson_5.wav',
    '/audio/castle3/chapter2/lesson_6.wav',
  ],
  minigame: [
    '/audio/castle3/chapter2/minigame_0.wav',
    '/audio/castle3/chapter2/minigame_1.wav',
    '/audio/castle3/chapter2/minigame_2.wav',
  ],
};

export const CHAPTER2_RELIC = {
  name: "Ring of Measurement",
  image: "/images/relics/ring-measurement.webp",
  description: "You have mastered circumference! The Ring of Measurement allows you to calculate the perimeter of any circular path."
};

export const CHAPTER2_WIZARD = {
  name: "Arcana, Keeper of the Curved Path",
  image: "/images/wizards/arcana-wizard.webp"
};

export const CHAPTER2_METADATA = {
  title: "The Path of the Perimeter",
  subtitle: "Castle 3 - The Circle Sanctuary",
  description: "Calculate the circumference of circles using C = 2πr and C = πd."
};
