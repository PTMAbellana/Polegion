// Castle 4 - Chapter 4: The Measurement Vault
interface ChapterDialogue { scene: 'opening' | 'lesson' | 'minigame'; text: string; key?: string; taskId?: string; }
export const CHAPTER4_DIALOGUE: ChapterDialogue[] = [
  { scene: 'opening', text: "Outstanding, angle master!" },
  { scene: 'opening', text: "We have reached the final chamber: The Measurement Vault." },
  { scene: 'opening', text: "Here, you will apply all your polygon knowledge to real-world problems." },
  { scene: 'opening', text: "Calculate perimeters and areas to unlock the vault's treasures!" },
  { scene: 'lesson', key: 'intro', text: "PERIMETER is the distance around a polygon. Add all side lengths!", taskId: 'task-0' },
  { scene: 'lesson', key: 'rectangle-perimeter', text: "Rectangle Perimeter: P = 2(length + width) or P = 2l + 2w", taskId: 'task-1' },
  { scene: 'lesson', key: 'square-perimeter', text: "Square Perimeter: P = 4 × side", taskId: 'task-2' },
  { scene: 'lesson', key: 'area-intro', text: "AREA is the space inside a polygon, measured in square units.", taskId: 'task-3' },
  { scene: 'lesson', key: 'rectangle-area', text: "Rectangle Area: A = length × width", taskId: 'task-4' },
  { scene: 'lesson', key: 'square-area', text: "Square Area: A = side × side = side²", taskId: 'task-5' },
  { scene: 'lesson', key: 'triangle-area', text: "Triangle Area: A = (base × height) ÷ 2", taskId: 'task-6' },
  { scene: 'lesson', key: 'parallelogram-area', text: "Parallelogram Area: A = base × height", taskId: 'task-7' },
  { scene: 'lesson', key: 'trapezoid-area', text: "Trapezoid Area: A = [(base₁ + base₂) × height] ÷ 2", taskId: 'task-8' },
  { scene: 'lesson', key: 'word-problems', text: "Now apply these formulas to solve real-world problems!", taskId: 'task-9' },
  { scene: 'minigame', text: "The Vault Master presents measurement challenges!" },
  { scene: 'minigame', text: "Calculate perimeters and areas correctly." },
  { scene: 'minigame', text: "Apply the right formula for each shape!" },
];
export const CHAPTER4_SCENE_RANGES = { opening: { start: 0, end: 3 }, lesson: { start: 4, end: 13 }, minigame: { start: 14, end: 16 } };
export const CHAPTER4_OPENING_DIALOGUE = CHAPTER4_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER4_LESSON_DIALOGUE = CHAPTER4_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER4_MINIGAME_DIALOGUE = CHAPTER4_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

export const CHAPTER4_MINIGAME_LEVELS = [
  { id: 1, shape: 'rectangle', length: 8, width: 5, type: 'perimeter', correctAnswer: 26, instruction: 'Find perimeter of rectangle (l=8, w=5)', hint: 'P = 2(l + w)' },
  { id: 2, shape: 'square', side: 6, type: 'perimeter', correctAnswer: 24, instruction: 'Find perimeter of square (side=6)', hint: 'P = 4 × side' },
  { id: 3, shape: 'rectangle', length: 7, width: 4, type: 'area', correctAnswer: 28, instruction: 'Find area of rectangle (l=7, w=4)', hint: 'A = l × w' },
  { id: 4, shape: 'square', side: 5, type: 'area', correctAnswer: 25, instruction: 'Find area of square (side=5)', hint: 'A = side²' },
  { id: 5, shape: 'triangle', base: 10, height: 6, type: 'area', correctAnswer: 30, instruction: 'Find area of triangle (b=10, h=6)', hint: 'A = (b × h) ÷ 2' },
  { id: 6, shape: 'parallelogram', base: 9, height: 5, type: 'area', correctAnswer: 45, instruction: 'Find area of parallelogram (b=9, h=5)', hint: 'A = b × h' },
  { id: 7, shape: 'trapezoid', base1: 8, base2: 6, height: 4, type: 'area', correctAnswer: 28, instruction: 'Find area of trapezoid (b₁=8, b₂=6, h=4)', hint: 'A = [(b₁ + b₂) × h] ÷ 2' },
];

export const CHAPTER4_CONCEPTS = [
  {
    key: 'perimeter',
    title: 'Perimeter',
    summary: 'The distance around a polygon'
  },
  {
    key: 'rectangle-perimeter',
    title: 'Rectangle Perimeter',
    summary: 'P = 2(l + w)'
  },
  {
    key: 'square-perimeter',
    title: 'Square Perimeter',
    summary: 'P = 4 × side'
  },
  {
    key: 'area',
    title: 'Area',
    summary: 'The space inside a polygon (square units)'
  },
  {
    key: 'rectangle-area',
    title: 'Rectangle Area',
    summary: 'A = length × width'
  },
  {
    key: 'square-area',
    title: 'Square Area',
    summary: 'A = side²'
  },
  {
    key: 'triangle-area',
    title: 'Triangle Area',
    summary: 'A = (base × height) ÷ 2'
  },
  {
    key: 'parallelogram-area',
    title: 'Parallelogram Area',
    summary: 'A = base × height'
  },
  {
    key: 'trapezoid-area',
    title: 'Trapezoid Area',
    summary: 'A = [(b₁ + b₂) × h] ÷ 2'
  },
  {
    key: 'word-problems',
    title: 'Word Problems',
    summary: 'Apply formulas to real-world situations'
  }
];

export const CHAPTER4_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'perimeter', label: 'Learn: Perimeter', type: 'lesson' as const },
  { id: 'task-1', key: 'rectangle-perimeter', label: 'Learn: Rectangle Perimeter', type: 'lesson' as const },
  { id: 'task-2', key: 'square-perimeter', label: 'Learn: Square Perimeter', type: 'lesson' as const },
  { id: 'task-3', key: 'area', label: 'Learn: Area', type: 'lesson' as const },
  { id: 'task-4', key: 'rectangle-area', label: 'Learn: Rectangle Area', type: 'lesson' as const },
  { id: 'task-5', key: 'square-area', label: 'Learn: Square Area', type: 'lesson' as const },
  { id: 'task-6', key: 'triangle-area', label: 'Learn: Triangle Area', type: 'lesson' as const },
  { id: 'task-7', key: 'parallelogram-area', label: 'Learn: Parallelogram Area', type: 'lesson' as const },
  { id: 'task-8', key: 'trapezoid-area', label: 'Learn: Trapezoid Area', type: 'lesson' as const },
  { id: 'task-9', key: 'word-problems', label: 'Learn: Word Problems', type: 'lesson' as const },
  { id: 'task-10', key: 'minigame', label: 'Complete Measurement Challenges', type: 'minigame' as const },
  { id: 'task-11', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-12', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-13', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-14', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-15', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER4_XP_VALUES = {
  lesson: 75,
  minigame: 50,
  quiz1: 25,
  quiz2: 25,
  quiz3: 25,
  quiz4: 25,
  quiz5: 25,
  total: 250,
};

export const CHAPTER4_CASTLE_ID = '4e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8a9b';
export const CHAPTER4_NUMBER = 4;

export const CHAPTER4_RELIC = {
  name: "Ruler of Realms",
  image: "/images/relics/ruler-realms.png",
  description: "You have mastered polygon measurements! The Ruler of Realms allows you to measure any shape in any dimension."
};

export const CHAPTER4_WIZARD = {
  name: "Polymus, Master of Many Sides",
  image: "/images/polymus-wizard.png"
};

export const CHAPTER4_METADATA = {
  title: "The Measurement Vault",
  subtitle: "Castle 4 - The Polygon Citadel",
  description: "Calculate perimeters and areas of polygons and solve real-world measurement problems."
};
