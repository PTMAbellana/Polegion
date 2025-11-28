// Castle 3 - Chapter 1: The Tide of Shapes
// Theme: Parts of a Circle (center, radius, diameter, chord, arc, sector)

interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

// Unified dialogue array combining all scenes
export const CHAPTER1_DIALOGUE: ChapterDialogue[] = [
  // Opening scene (indices 0-3)
  { scene: 'opening', text: "Welcome to the Circle Sanctuary! I am Arcana, Keeper of the Curved Path." },
  { scene: 'opening', text: "Enter the Tidal Hall where glowing rings rise and fall like ripples on water." },
  { scene: 'opening', text: "The circle is one of the most perfect shapes in all of geometry." },
  { scene: 'opening', text: "Let us explore its sacred components together!" },
  
  // Lesson scene (indices 4-11)
  { scene: 'lesson', key: 'intro', text: "A circle is a set of all points equidistant from a single point called the center.", taskId: 'task-0' },
  { scene: 'lesson', key: 'center', text: "The CENTER is the point equidistant from all points on the circle. We often label it as point O.", taskId: 'task-0' },
  { scene: 'lesson', key: 'radius', text: "The RADIUS is a line segment from the center to any point on the circle.", taskId: 'task-1' },
  { scene: 'lesson', key: 'diameter', text: "The DIAMETER is a line segment passing through the center, connecting two points on the circle. It equals 2 times the radius!", taskId: 'task-2' },
  { scene: 'lesson', key: 'chord', text: "A CHORD is any line segment connecting two points on the circle (but not through the center).", taskId: 'task-3' },
  { scene: 'lesson', key: 'arc', text: "An ARC is a curved portion of the circle between two points.", taskId: 'task-4' },
  { scene: 'lesson', key: 'sector', text: "A SECTOR is a pie-shaped region bounded by two radii and an arc.", taskId: 'task-5' },
  { scene: 'lesson', key: 'summary', text: "Master these parts, and you understand the foundation of all circular geometry!" },
  
  // Minigame scene (indices 12-14)
  { scene: 'minigame', text: "Excellent! Now identify the parts of the circle as they appear." },
  { scene: 'minigame', text: "Tap or select the correct part when I call its name!" },
  { scene: 'minigame', text: "Precision is key in the Circle Sanctuary!" },
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

export const CHAPTER1_MINIGAME_LEVELS = [
  { id: 1, partType: 'center', instruction: 'Find the CENTER', hint: 'The center is the point equidistant from all points on the circle' },
  { id: 2, partType: 'radius', instruction: 'Find the RADIUS', hint: 'A radius connects the center to any point on the circle' },
  { id: 3, partType: 'diameter', instruction: 'Find the DIAMETER', hint: 'The diameter passes through the center' },
  { id: 4, partType: 'chord', instruction: 'Find a CHORD', hint: 'A chord connects two points but does NOT pass through center' },
  { id: 5, partType: 'arc', instruction: 'Find an ARC', hint: 'An arc is a curved portion of the circle' },
  { id: 6, partType: 'sector', instruction: 'Find a SECTOR', hint: 'A sector looks like a slice of pie' }
];

export const CHAPTER1_CONCEPTS = [
  {
    key: 'center',
    title: 'Center',
    summary: 'The point equidistant from all points on the circle, usually labeled O',
    description: 'The fixed point at the middle of a circle, often labeled O.',
    image: '/images/castle3/circle-center.png'
  },
  {
    key: 'radius',
    title: 'Radius',
    summary: 'A line segment from the center to any point on the circle',
    description: 'A segment from the center to a point on the circle.',
    image: '/images/castle3/radius.png'
  },
  {
    key: 'diameter',
    title: 'Diameter',
    summary: 'A line segment through the center connecting two opposite points. Diameter = 2 × Radius',
    description: 'A segment through the center connecting two points; equals 2 × radius.',
    image: '/images/castle3/diameter.png'
  },
  {
    key: 'chord',
    title: 'Chord',
    summary: 'A line segment connecting two points on the circle (not through center)',
    description: 'A segment between two points on the circle that does not pass through the center.',
    image: '/images/castle3/chord.png'
  },
  {
    key: 'arc',
    title: 'Arc',
    summary: 'A curved portion of the circle between two points',
    description: 'A curved portion of the circle between two points.',
    image: '/images/castle3/arc.png'
  },
  {
    key: 'sector',
    title: 'Sector',
    summary: 'A pie-shaped region between two radii and an arc',
    description: 'A pie-shaped region bounded by two radii and the arc.',
    image: '/images/castle3/sector.png'
  }
];

export const CHAPTER1_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'center', label: 'Learn: Circle Center', type: 'lesson' as const },
  { id: 'task-1', key: 'radius', label: 'Learn: Radius', type: 'lesson' as const },
  { id: 'task-2', key: 'diameter', label: 'Learn: Diameter', type: 'lesson' as const },
  { id: 'task-3', key: 'chord', label: 'Learn: Chord', type: 'lesson' as const },
  { id: 'task-4', key: 'arc', label: 'Learn: Arc', type: 'lesson' as const },
  { id: 'task-5', key: 'sector', label: 'Learn: Sector', type: 'lesson' as const },
  { id: 'task-6', key: 'minigame', label: 'Complete Circle Parts Identification', type: 'minigame' as const },
  { id: 'task-7', key: 'quiz1', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-8', key: 'quiz2', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-9', key: 'quiz3', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-10', key: 'quiz4', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-11', key: 'quiz5', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER1_XP_VALUES = {
  lesson: 160,
  minigame: 40,
  quiz1: 10,
  quiz2: 10,
  quiz3: 10,
  quiz4: 10,
  quiz5: 10,
  total: 250,
};

export const CHAPTER1_CASTLE_ID = '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a'; // Castle 3 (Circle Sanctuary)
export const CHAPTER1_NUMBER = 1;

// Audio narration paths - matches dialogue indices
export const CHAPTER1_NARRATION = {
  opening: [
    '/audio/castle3/chapter1/opening_0.wav',
    '/audio/castle3/chapter1/opening_1.wav',
    '/audio/castle3/chapter1/opening_2.wav',
    '/audio/castle3/chapter1/opening_3.wav',
  ],
  lesson: [
    '/audio/castle3/chapter1/lesson_0.wav',
    '/audio/castle3/chapter1/lesson_1.wav',
    '/audio/castle3/chapter1/lesson_2.wav',
    '/audio/castle3/chapter1/lesson_3.wav',
    '/audio/castle3/chapter1/lesson_4.wav',
    '/audio/castle3/chapter1/lesson_5.wav',
    '/audio/castle3/chapter1/lesson_6.wav',
    '/audio/castle3/chapter1/lesson_7.wav',
  ],
  minigame: [
    '/audio/castle3/chapter1/minigame_0.wav',
    '/audio/castle3/chapter1/minigame_1.wav',
    '/audio/castle3/chapter1/minigame_2.wav',
  ],
};

export const CHAPTER1_RELIC = {
  name: "Compass of the Circle",
  image: "/images/relics/compass-circle.png",
  description: "You have mastered the parts of a circle! The Compass of the Circle reveals the hidden structure within every curve."
};

export const CHAPTER1_WIZARD = {
  name: "Arcana, Keeper of the Curved Path",
  image: "/images/arcana-wizard.png"
};

export const CHAPTER1_METADATA = {
  title: "The Tide of Shapes",
  subtitle: "Castle 3 - The Circle Sanctuary",
  description: "Identify the parts of a circle: center, radius, diameter, chord, arc, and sector."
};
