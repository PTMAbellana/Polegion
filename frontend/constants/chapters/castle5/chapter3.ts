// Castle 5 - Chapter 3: The Sanctum of Surfaces
// Theme: Surface area of 3D solids

interface ChapterDialogue { scene: 'opening' | 'lesson' | 'minigame'; text: string; key?: string; taskId?: string; }

export const CHAPTER3_DIALOGUE: ChapterDialogue[] = [
  { scene: 'opening', text: "Magnificent work, measurement master!" },
  { scene: 'opening', text: "We ascend to the Sanctum of Surfaces." },
  { scene: 'opening', text: "Here, glowing 3D objects rotate in the air." },
  { scene: 'opening', text: "SURFACE AREA measures the total area covering a solid figure." },
  { scene: 'opening', text: "Think of it as wrapping paper needed to cover the shape completely!" },
  { scene: 'lesson', key: 'intro', text: "SURFACE AREA is the sum of the areas of all faces of a 3D solid.", taskId: 'task-0' },
  { scene: 'lesson', key: 'cube', text: "Cube Surface Area: SA = 6s² (6 square faces)", taskId: 'task-1' },
  { scene: 'lesson', key: 'rectangular-prism', text: "Rectangular Prism: SA = 2(lw + lh + wh)", taskId: 'task-2' },
  { scene: 'lesson', key: 'cylinder', text: "Cylinder: SA = 2πr² + 2πrh (two circles + curved surface)", taskId: 'task-3' },
  { scene: 'lesson', key: 'sphere', text: "Sphere: SA = 4πr² (perfectly round surface)", taskId: 'task-4' },
  { scene: 'lesson', key: 'cone', text: "Cone: SA = πr² + πrl (base + lateral surface, l = slant height)", taskId: 'task-5' },
  { scene: 'lesson', key: 'square-pyramid', text: "Square Pyramid: SA = b² + 2bl (base + 4 triangular faces, l = slant height)", taskId: 'task-6' },
  { scene: 'lesson', key: 'triangular-prism', text: "Triangular Prism: SA = 2(½bh) + (a+b+c)H (2 triangular bases + 3 rectangular faces)", taskId: 'task-7' },
  { scene: 'lesson', key: 'practice', text: "Now calculate surface areas of these 3D shapes!" },
  { scene: 'minigame', text: "The Sanctum challenges your spatial understanding!" },
  { scene: 'minigame', text: "Calculate the surface area of each rotating solid." },
  { scene: 'minigame', text: "Use π ≈ 3.14 for circular solids!" },
];

export const CHAPTER3_SCENE_RANGES = { opening: { start: 0, end: 4 }, lesson: { start: 5, end: 13 }, minigame: { start: 14, end: 16 } };

export const CHAPTER3_OPENING_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER3_LESSON_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER3_MINIGAME_DIALOGUE = CHAPTER3_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

export const CHAPTER3_MINIGAME_LEVELS = [
  { id: 1, shape: 'cube', side: 5, correctAnswer: 150, instruction: 'Find surface area of cube (s=5)', hint: 'SA = 6s²' },
  { id: 2, shape: 'rectangular-prism', length: 6, width: 4, height: 3, correctAnswer: 108, instruction: 'Find SA of rectangular prism (l=6, w=4, h=3)', hint: 'SA = 2(lw + lh + wh)' },
  { id: 3, shape: 'cylinder', radius: 3, height: 7, correctAnswer: 188, instruction: 'Find SA of cylinder (r=3, h=7)', hint: 'SA = 2πr² + 2πrh' },
  { id: 4, shape: 'sphere', radius: 4, correctAnswer: 201, instruction: 'Find SA of sphere (r=4)', hint: 'SA = 4πr²' },
  { id: 5, shape: 'cone', radius: 5, slantHeight: 13, correctAnswer: 283, instruction: 'Find SA of cone (r=5, l=13)', hint: 'SA = πr² + πrl' },
  { id: 6, shape: 'square-pyramid', base: 6, slantHeight: 5, correctAnswer: 96, instruction: 'Find SA of square pyramid (b=6, l=5)', hint: 'SA = b² + 2bl' }
];

export const CHAPTER3_CONCEPTS = [
  {
    key: 'surface-area',
    title: 'Surface Area',
    summary: 'Total area of all faces of a 3D solid',
    description: 'Total covering area of a solid’s outer surfaces.'
  },
  {
    key: 'cube',
    title: 'Cube Surface Area',
    summary: 'SA = 6s² (6 equal square faces)',
    description: 'Six identical squares; multiply 6 by side squared.'
  },
  {
    key: 'rectangular-prism',
    title: 'Rectangular Prism',
    summary: 'SA = 2(lw + lh + wh)',
    description: 'Sum areas of all rectangular faces.'
  },
  {
    key: 'cylinder',
    title: 'Cylinder Surface Area',
    summary: 'SA = 2πr² + 2πrh',
    description: 'Two circular ends plus curved side area.'
  },
  {
    key: 'sphere',
    title: 'Sphere Surface Area',
    summary: 'SA = 4πr²',
    description: 'Area depends only on radius: 4 × π × r².'
  },
  {
    key: 'cone',
    title: 'Cone Surface Area',
    summary: 'SA = πr² + πrl (l = slant height)',
    description: 'Base circle plus lateral surface using slant height.'
  },
  {
    key: 'square-pyramid',
    title: 'Square Pyramid',
    summary: 'SA = b² + 2bl (l = slant height)',
    description: 'Square base plus four triangular faces.'
  },
  {
    key: 'triangular-prism',
    title: 'Triangular Prism',
    summary: 'SA = 2(½bh) + perimeter × H',
    description: 'Two triangular bases plus three rectangles; sum all face areas.'
  }
];

export const CHAPTER3_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'surface-area', label: 'Learn: Surface Area', type: 'lesson' as const },
  { id: 'task-1', key: 'cube', label: 'Learn: Cube SA', type: 'lesson' as const },
  { id: 'task-2', key: 'rectangular-prism', label: 'Learn: Rectangular Prism SA', type: 'lesson' as const },
  { id: 'task-3', key: 'cylinder', label: 'Learn: Cylinder SA', type: 'lesson' as const },
  { id: 'task-4', key: 'sphere', label: 'Learn: Sphere SA', type: 'lesson' as const },
  { id: 'task-5', key: 'cone', label: 'Learn: Cone SA', type: 'lesson' as const },
  { id: 'task-6', key: 'square-pyramid', label: 'Learn: Square Pyramid SA', type: 'lesson' as const },
  { id: 'task-7', key: 'triangular-prism', label: 'Learn: Triangular Prism SA', type: 'lesson' as const },
  { id: 'task-8', key: 'minigame', label: 'Complete Surface Area Calculations', type: 'minigame' as const },
  { id: 'task-9', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-12', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-13', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER3_XP_VALUES = {
  lesson: 75,
  minigame: 50,
  quiz1: 25,
  quiz2: 25,
  quiz3: 25,
  quiz4: 25,
  quiz5: 25,
  total: 250,
};

export const CHAPTER3_CASTLE_ID = '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c';
export const CHAPTER3_NUMBER = 3;

// Audio narration paths - matches dialogue indices
export const CHAPTER3_NARRATION = {
  opening: [
    '/audio/castle5/chapter3/opening_0.wav',
    '/audio/castle5/chapter3/opening_1.wav',
    '/audio/castle5/chapter3/opening_2.wav',
    '/audio/castle5/chapter3/opening_3.wav',
    '/audio/castle5/chapter3/opening_4.wav',
  ],
  lesson: [
    '/audio/castle5/chapter3/lesson_0.wav',
    '/audio/castle5/chapter3/lesson_1.wav',
    '/audio/castle5/chapter3/lesson_2.wav',
    '/audio/castle5/chapter3/lesson_3.wav',
    '/audio/castle5/chapter3/lesson_4.wav',
    '/audio/castle5/chapter3/lesson_5.wav',
    '/audio/castle5/chapter3/lesson_6.wav',
    '/audio/castle5/chapter3/lesson_7.wav',
    '/audio/castle5/chapter3/lesson_8.wav',
  ],
  minigame: [
    '/audio/castle5/chapter3/minigame_0.wav',
    '/audio/castle5/chapter3/minigame_1.wav',
    '/audio/castle5/chapter3/minigame_2.wav',
  ],
};

export const CHAPTER3_RELIC = {
  name: "Wrapping Crystal",
  image: "/images/relics/wrapping-crystal.png",
  description: "You have mastered surface area! The Wrapping Crystal reveals how much material covers any 3D object."
};

export const CHAPTER3_WIZARD = {
  name: "Dimensius, Guardian of Space",
  image: "/images/wizards/dimensius-wizard.png"
};

export const CHAPTER3_METADATA = {
  title: "The Sanctum of Surfaces",
  subtitle: "Castle 5 - The Arcane Observatory",
  description: "Calculate surface area of cubes, prisms, cylinders, spheres, cones, and pyramids."
};
