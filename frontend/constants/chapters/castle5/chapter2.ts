// Castle 5 - Chapter 2: The Chamber of Perimeters
// Theme: Perimeter and area of 2D shapes (advanced)

interface ChapterDialogue { scene: 'opening' | 'lesson' | 'minigame'; text: string; key?: string; taskId?: string; }

export const CHAPTER2_DIALOGUE: ChapterDialogue[] = [
  { scene: 'opening', text: "Well done, dimensional explorer!" },
  { scene: 'opening', text: "Now we climb to the Chamber of Perimeters." },
  { scene: 'opening', text: "The walls form moving puzzles, each a geometric challenge." },
  { scene: 'opening', text: "Master perimeter and area calculations to unlock the next floor!" },
  { scene: 'lesson', key: 'review-perimeter', text: "PERIMETER is the total distance around a shape. Add all sides!", taskId: 'task-0' },
  { scene: 'lesson', key: 'review-area', text: "AREA is the space inside a shape, measured in square units.", taskId: 'task-1' },
  { scene: 'lesson', key: 'rectangle', text: "Rectangle: P = 2(l + w), A = l × w", taskId: 'task-2' },
  { scene: 'lesson', key: 'square', text: "Square: P = 4s, A = s²", taskId: 'task-3' },
  { scene: 'lesson', key: 'triangle', text: "Triangle: P = a + b + c, A = (b × h) ÷ 2", taskId: 'task-4' },
  { scene: 'lesson', key: 'parallelogram', text: "Parallelogram: P = 2(a + b), A = b × h", taskId: 'task-5' },
  { scene: 'lesson', key: 'trapezoid', text: "Trapezoid: P = a + b₁ + c + b₂, A = [(b₁ + b₂) × h] ÷ 2", taskId: 'task-6' },
  { scene: 'lesson', key: 'circle-review', text: "Circle: C = 2πr or πd, A = πr²", taskId: 'task-7' },
  { scene: 'lesson', key: 'word-problems', text: "Now apply these formulas to complex word problems!", taskId: 'task-8' },
  { scene: 'minigame', text: "The Chamber walls shift with geometric challenges!" },
  { scene: 'minigame', text: "Calculate perimeters and areas correctly." },
  { scene: 'minigame', text: "Each shape requires the right formula!" },
];

export const CHAPTER2_SCENE_RANGES = { opening: { start: 0, end: 3 }, lesson: { start: 4, end: 12 }, minigame: { start: 13, end: 15 } };

export const CHAPTER2_OPENING_DIALOGUE = CHAPTER2_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER2_LESSON_DIALOGUE = CHAPTER2_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER2_MINIGAME_DIALOGUE = CHAPTER2_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

export const CHAPTER2_MINIGAME_LEVELS = [
  { id: 1, shape: 'rectangle', length: 12, width: 7, type: 'both', correctPerimeter: 38, correctArea: 84, instruction: 'Find both perimeter and area', hint: 'P = 2(l+w), A = l×w' },
  { id: 2, shape: 'square', side: 9, type: 'both', correctPerimeter: 36, correctArea: 81, instruction: 'Find both perimeter and area', hint: 'P = 4s, A = s²' },
  { id: 3, shape: 'triangle', side1: 5, side2: 12, side3: 13, base: 12, height: 5, type: 'both', correctPerimeter: 30, correctArea: 30, instruction: 'Find perimeter and area', hint: 'P = a+b+c, A = (b×h)÷2' },
  { id: 4, shape: 'circle', radius: 7, type: 'both', correctPerimeter: 44, correctArea: 154, instruction: 'Find circumference and area (use π ≈ 3.14)', hint: 'C = 2πr, A = πr²' },
  { id: 5, shape: 'parallelogram', side1: 8, side2: 5, base: 8, height: 4, type: 'both', correctPerimeter: 26, correctArea: 32, instruction: 'Find perimeter and area', hint: 'P = 2(a+b), A = b×h' },
  { id: 6, shape: 'trapezoid', side1: 6, side2: 4, side3: 6, base1: 10, base2: 6, height: 5, type: 'both', correctPerimeter: 26, correctArea: 40, instruction: 'Find perimeter and area', hint: 'A = [(b₁+b₂)×h]÷2' }
];

export const CHAPTER2_CONCEPTS = [
  {
    key: 'perimeter-review',
    title: 'Perimeter Review',
    summary: 'Total distance around a shape',
    description: 'Add all side lengths to get the boundary length.',
    image: '/images/castle5/perimeter-review.webp',
    taskId: 'task-0'
  },
  {
    key: 'area-review',
    title: 'Area Review',
    summary: 'Space inside a shape (square units)',
    description: 'Measure the space inside; units are squared.',
    image: '/images/castle5/area-review.webp',
    taskId: 'task-1'
  },
  {
    key: 'rectangle',
    title: 'Rectangle Formulas',
    summary: 'P = 2(l + w), A = l × w',
    description: 'Perimeter doubles sum of length and width; area is l × w.',
    image: '/images/castle5/rectangle-formulas.webp',
    taskId: 'task-2'
  },
  {
    key: 'square',
    title: 'Square Formulas',
    summary: 'P = 4s, A = s²',
    description: 'Four equal sides; area equals side squared.',
    image: '/images/castle5/square-formulas.webp',
    taskId: 'task-3'
  },
  {
    key: 'triangle',
    title: 'Triangle Formulas',
    summary: 'P = a + b + c, A = (b × h) ÷ 2',
    description: 'Sum three sides for P; A is base × height ÷ 2.',
    image: '/images/castle5/triangle-formulas.webp',
    taskId: 'task-4'
  },
  {
    key: 'parallelogram',
    title: 'Parallelogram Formulas',
    summary: 'P = 2(a + b), A = b × h',
    description: 'Perimeter doubles sum of adjacent sides; area is b × h.',
    image: '/images/castle5/parallelogram-formulas.webp',
    taskId: 'task-5'
  },
  {
    key: 'trapezoid',
    title: 'Trapezoid Formulas',
    summary: 'A = [(b₁ + b₂) × h] ÷ 2',
    description: 'Area equals average of bases times height.',
    image: '/images/castle5/trapezoid-formulas.webp',
    taskId: 'task-6'
  },
  {
    key: 'circle',
    title: 'Circle Formulas',
    summary: 'C = 2πr, A = πr²',
    description: 'Use circumference 2πr or πd; area is πr².',
    image: '/images/castle5/circle-formulas.webp',
    taskId: 'task-7'
  },
  {
    key: 'word-problems',
    title: 'Word Problems',
    summary: 'Apply formulas to real situations',
    description: 'Choose formulas to model and solve practical tasks.',
    image: '/images/castle5/word-problems.webp',
    taskId: 'task-8'
  }
];

export const CHAPTER2_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'perimeter-review', label: 'Learn: Perimeter Review', type: 'lesson' as const },
  { id: 'task-1', key: 'area-review', label: 'Learn: Area Review', type: 'lesson' as const },
  { id: 'task-2', key: 'rectangle', label: 'Learn: Rectangle Formulas', type: 'lesson' as const },
  { id: 'task-3', key: 'square', label: 'Learn: Square Formulas', type: 'lesson' as const },
  { id: 'task-4', key: 'triangle', label: 'Learn: Triangle Formulas', type: 'lesson' as const },
  { id: 'task-5', key: 'parallelogram', label: 'Learn: Parallelogram Formulas', type: 'lesson' as const },
  { id: 'task-6', key: 'trapezoid', label: 'Learn: Trapezoid Formulas', type: 'lesson' as const },
  { id: 'task-7', key: 'circle', label: 'Learn: Circle Formulas', type: 'lesson' as const },
  { id: 'task-8', key: 'word-problems', label: 'Learn: Word Problems', type: 'lesson' as const },
  { id: 'task-9', key: 'minigame', label: 'Complete Measurement Challenges', type: 'minigame' as const },
  { id: 'task-10', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-12', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-13', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-14', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER2_XP_VALUES = {
  lesson: 70,
  minigame: 55,
  quiz1: 25,
  quiz2: 25,
  quiz3: 25,
  quiz4: 25,
  quiz5: 25,
  total: 250,
};

export const CHAPTER2_CASTLE_ID = '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c';
export const CHAPTER2_NUMBER = 2;

// Audio narration paths - matches dialogue indices
export const CHAPTER2_NARRATION = {
  opening: [
    '/audio/castle5/chapter2/opening_0.wav',
    '/audio/castle5/chapter2/opening_1.wav',
    '/audio/castle5/chapter2/opening_2.wav',
    '/audio/castle5/chapter2/opening_3.wav',
  ],
  lesson: [
    '/audio/castle5/chapter2/lesson_0.wav',
    '/audio/castle5/chapter2/lesson_1.wav',
    '/audio/castle5/chapter2/lesson_2.wav',
    '/audio/castle5/chapter2/lesson_3.wav',
    '/audio/castle5/chapter2/lesson_4.wav',
    '/audio/castle5/chapter2/lesson_5.wav',
    '/audio/castle5/chapter2/lesson_6.wav',
    '/audio/castle5/chapter2/lesson_7.wav',
    '/audio/castle5/chapter2/lesson_8.wav',
  ],
  minigame: [
    '/audio/castle5/chapter2/minigame_0.wav',
    '/audio/castle5/chapter2/minigame_1.wav',
    '/audio/castle5/chapter2/minigame_2.wav',
  ],
};

export const CHAPTER2_RELIC = {
  name: "Compass of Calculation",
  image: "/images/relics/compass-calculation.webp",
  description: "You have mastered 2D measurements! The Compass of Calculation instantly reveals perimeter and area of any flat shape."
};

export const CHAPTER2_WIZARD = {
  name: "Dimensius, Guardian of Space",
  image: "/images/wizards/dimensius-wizard.webp"
};

export const CHAPTER2_METADATA = {
  title: "The Chamber of Perimeters",
  subtitle: "Castle 5 - The Arcane Observatory",
  description: "Master perimeter and area calculations for rectangles, squares, triangles, parallelograms, trapezoids, and circles."
};
