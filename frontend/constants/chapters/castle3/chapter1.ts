// Castle 3 - Chapter 1: The Tide of Shapes
// Theme: Parts of a Circle (center, radius, diameter, chord, arc, sector)

export const CHAPTER1_OPENING_DIALOGUE = [
  "Welcome to the Circle Sanctuary! I am Archim, Keeper of the Curved Path.",
  "Enter the Tidal Hall where glowing rings rise and fall like ripples on water.",
  "The circle is one of the most perfect shapes in all of geometry.",
  "Let us explore its sacred components together!"
];

export const CHAPTER1_LESSON_DIALOGUE = [
  { key: 'intro', text: "A circle is a set of all points equidistant from a single point called the center.", taskId: 'task-0' },
  { key: 'center', text: "The CENTER is the point equidistant from all points on the circle. We often label it as point O.", taskId: 'task-0' },
  { key: 'radius', text: "The RADIUS is a line segment from the center to any point on the circle.", taskId: 'task-1' },
  { key: 'diameter', text: "The DIAMETER is a line segment passing through the center, connecting two points on the circle. It equals 2 times the radius!", taskId: 'task-2' },
  { key: 'chord', text: "A CHORD is any line segment connecting two points on the circle (but not through the center).", taskId: 'task-3' },
  { key: 'arc', text: "An ARC is a curved portion of the circle between two points.", taskId: 'task-4' },
  { key: 'sector', text: "A SECTOR is a pie-shaped region bounded by two radii and an arc.", taskId: 'task-5' },
  { key: 'summary', text: "Master these parts, and you understand the foundation of all circular geometry!" }
];

export const CHAPTER1_MINIGAME_DIALOGUE = [
  "Excellent! Now identify the parts of the circle as they appear.",
  "Tap or select the correct part when I call its name!",
  "Precision is key in the Circle Sanctuary!"
];

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
    summary: 'The point equidistant from all points on the circle, usually labeled O'
  },
  {
    key: 'radius',
    title: 'Radius',
    summary: 'A line segment from the center to any point on the circle'
  },
  {
    key: 'diameter',
    title: 'Diameter',
    summary: 'A line segment through the center connecting two opposite points. Diameter = 2 × Radius'
  },
  {
    key: 'chord',
    title: 'Chord',
    summary: 'A line segment connecting two points on the circle (not through center)'
  },
  {
    key: 'arc',
    title: 'Arc',
    summary: 'A curved portion of the circle between two points'
  },
  {
    key: 'sector',
    title: 'Sector',
    summary: 'A pie-shaped region between two radii and an arc'
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
  { id: 'task-12', key: 'quiz6', label: 'Pass Quiz Question 6', type: 'quiz' as const },
];

export const CHAPTER1_XP_VALUES = {
  lesson: 40,
  minigame: 40,
  quiz1: 50,
  total: 250,
};

export const CHAPTER1_CASTLE_ID = '3d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8a'; // Castle 3 (Circle Sanctuary)
export const CHAPTER1_NUMBER = 1;

export const CHAPTER1_RELIC = {
  name: "Compass of the Circle",
  image: "/images/relics/compass-circle.png",
  description: "You have mastered the parts of a circle! The Compass of the Circle reveals the hidden structure within every curve."
};

export const CHAPTER1_WIZARD = {
  name: "Archim, Keeper of the Curved Path",
  image: "/images/archim-wizard.png"
};

export const CHAPTER1_METADATA = {
  title: "The Tide of Shapes",
  subtitle: "Castle 3 - The Circle Sanctuary",
  description: "Identify the parts of a circle: center, radius, diameter, chord, arc, and sector."
};
