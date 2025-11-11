// Castle 5 - Chapter 4: The Core of Volumes
// Theme: Volume of 3D solids

export const CHAPTER4_OPENING_DIALOGUE = [
  "Extraordinary, surface sage!",
  "We have reached the Observatory's heart: The Core of Volumes.",
  "VOLUME measures the space INSIDE a 3D solid.",
  "Think of it as how much water, air, or material fills the shape.",
  "This is the ultimate mastery of three-dimensional geometry!"
];

export const CHAPTER4_LESSON_DIALOGUE = [
  { key: 'intro', text: "VOLUME is the amount of 3D space inside a solid, measured in cubic units.", taskId: 'task-0' },
  { key: 'cube', text: "Cube Volume: V = s³ (side cubed)", taskId: 'task-1' },
  { key: 'rectangular-prism', text: "Rectangular Prism (Box): V = l × w × h", taskId: 'task-2' },
  { key: 'cylinder', text: "Cylinder: V = πr²h (circular base area × height)", taskId: 'task-3' },
  { key: 'sphere', text: "Sphere: V = (4/3)πr³", taskId: 'task-4' },
  { key: 'cone', text: "Cone: V = (1/3)πr²h (one-third of cylinder)", taskId: 'task-5' },
  { key: 'square-pyramid', text: "Square Pyramid: V = (1/3)b²h (one-third of prism)", taskId: 'task-6' },
  { key: 'triangular-prism', text: "Triangular Prism: V = (½bh) × H (triangular base area × height)", taskId: 'task-7' },
  { key: 'pattern', text: "Notice: Pyramids and cones are 1/3 of their prism/cylinder counterparts!", taskId: 'task-8' },
  { key: 'word-problems', text: "Now solve volume word problems involving real-world containers!", taskId: 'task-9' },
  { key: 'practice', text: "Calculate volumes and master the Observatory!" }
];

export const CHAPTER4_MINIGAME_DIALOGUE = [
  "The Core pulses with geometric power!",
  "Calculate the volume of each solid.",
  "Use π ≈ 3.14 for rounded answers!"
];

export const CHAPTER4_MINIGAME_LEVELS = [
  { id: 1, shape: 'cube', side: 6, correctAnswer: 216, instruction: 'Find volume of cube (s=6)', hint: 'V = s³' },
  { id: 2, shape: 'rectangular-prism', length: 8, width: 5, height: 4, correctAnswer: 160, instruction: 'Find volume of prism (l=8, w=5, h=4)', hint: 'V = l × w × h' },
  { id: 3, shape: 'cylinder', radius: 4, height: 10, correctAnswer: 502, instruction: 'Find volume of cylinder (r=4, h=10)', hint: 'V = πr²h' },
  { id: 4, shape: 'sphere', radius: 6, correctAnswer: 905, instruction: 'Find volume of sphere (r=6)', hint: 'V = (4/3)πr³' },
  { id: 5, shape: 'cone', radius: 5, height: 12, correctAnswer: 314, instruction: 'Find volume of cone (r=5, h=12)', hint: 'V = (1/3)πr²h' },
  { id: 6, shape: 'square-pyramid', base: 8, height: 9, correctAnswer: 192, instruction: 'Find volume of square pyramid (b=8, h=9)', hint: 'V = (1/3)b²h' },
  { id: 7, shape: 'triangular-prism', base: 6, triangleHeight: 4, prismHeight: 10, correctAnswer: 120, instruction: 'Find volume (triangle: b=6, h=4; prism H=10)', hint: 'V = (½bh) × H' },
];

export const CHAPTER4_CONCEPTS = [
  {
    key: 'volume',
    title: 'Volume',
    summary: 'Space inside a 3D solid (cubic units)'
  },
  {
    key: 'cube',
    title: 'Cube Volume',
    summary: 'V = s³'
  },
  {
    key: 'rectangular-prism',
    title: 'Rectangular Prism',
    summary: 'V = l × w × h'
  },
  {
    key: 'cylinder',
    title: 'Cylinder Volume',
    summary: 'V = πr²h'
  },
  {
    key: 'sphere',
    title: 'Sphere Volume',
    summary: 'V = (4/3)πr³'
  },
  {
    key: 'cone',
    title: 'Cone Volume',
    summary: 'V = (1/3)πr²h'
  },
  {
    key: 'square-pyramid',
    title: 'Square Pyramid',
    summary: 'V = (1/3)b²h'
  },
  {
    key: 'triangular-prism',
    title: 'Triangular Prism',
    summary: 'V = (½bh) × H'
  },
  {
    key: 'pattern',
    title: 'Volume Pattern',
    summary: 'Pyramids/cones = 1/3 of prisms/cylinders'
  },
  {
    key: 'word-problems',
    title: 'Volume Word Problems',
    summary: 'Calculate capacity of containers'
  }
];

export const CHAPTER4_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'volume', label: 'Learn: Volume', type: 'lesson' as const },
  { id: 'task-1', key: 'cube', label: 'Learn: Cube Volume', type: 'lesson' as const },
  { id: 'task-2', key: 'rectangular-prism', label: 'Learn: Prism Volume', type: 'lesson' as const },
  { id: 'task-3', key: 'cylinder', label: 'Learn: Cylinder Volume', type: 'lesson' as const },
  { id: 'task-4', key: 'sphere', label: 'Learn: Sphere Volume', type: 'lesson' as const },
  { id: 'task-5', key: 'cone', label: 'Learn: Cone Volume', type: 'lesson' as const },
  { id: 'task-6', key: 'square-pyramid', label: 'Learn: Pyramid Volume', type: 'lesson' as const },
  { id: 'task-7', key: 'triangular-prism', label: 'Learn: Triangular Prism', type: 'lesson' as const },
  { id: 'task-8', key: 'pattern', label: 'Learn: Volume Patterns', type: 'lesson' as const },
  { id: 'task-9', key: 'word-problems', label: 'Learn: Volume Word Problems', type: 'lesson' as const },
  { id: 'task-10', key: 'minigame', label: 'Complete Volume Calculations', type: 'minigame' as const },
  { id: 'task-11', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-12', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-13', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-14', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-15', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER4_XP_VALUES = {
  lesson: 120,
  minigame: 100,
  quiz1: 12,
  quiz2: 12,
  quiz3: 12,
  quiz4: 12,
  quiz5: 12,
  total: 280,
};

export const CHAPTER4_CASTLE_ID = '5f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8a9b0c';
export const CHAPTER4_NUMBER = 4;

export const CHAPTER4_RELIC = {
  name: "Orb of Capacity",
  image: "/images/relics/orb-capacity.png",
  description: "You have conquered the Arcane Observatory! The Orb of Capacity reveals the volume within any 3D shape, making you a true master of space."
};

export const CHAPTER4_WIZARD = {
  name: "Dimensius, Guardian of Space",
  image: "/images/dimensius-wizard.png"
};

export const CHAPTER4_METADATA = {
  title: "The Core of Volumes",
  subtitle: "Castle 5 - The Arcane Observatory",
  description: "Master volume calculations for prisms, pyramids, cylinders, cones, and spheres."
};
