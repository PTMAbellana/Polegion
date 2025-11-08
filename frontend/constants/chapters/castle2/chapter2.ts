// Castle 2 - Chapter 2: The Chamber of Construction
// Theme: Constructing angles and identifying congruent angles

export const CHAPTER2_OPENING_DIALOGUE = [
  "Welcome to the Chamber of Construction! I am Constructor, Master of Angle Creation.",
  "Here, we forge angles with precision using the sacred protractor.",
  "To construct an angle means to draw it accurately with a specific measurement.",
  "Congruent angles have the exact same measurement — they are angle twins!"
];

export const CHAPTER2_LESSON_DIALOGUE = [
  { key: 'protractor', text: "To construct an angle, we use a protractor — a half-circle tool marked with degrees.", taskId: 'task-0' },
  { key: 'construction-steps', text: "Place the protractor's center at the vertex, align the baseline with one ray. Find the desired degree on the protractor scale and mark that point.", taskId: 'task-1' },
  { key: 'complete-angle', text: "Draw a ray from the vertex through your mark — you've constructed an angle!", taskId: 'task-1' },
  { key: 'congruent', text: "Two angles are congruent if they have the same measure, even if rotated or positioned differently.", taskId: 'task-2' },
  { key: 'practice', text: "Now, let us construct angles together and identify congruent pairs!", taskId: 'task-2' }
];

// Concept cards for lesson scene
export const CHAPTER2_CONCEPTS = [
  {
    key: 'protractor',
    title: 'Using a Protractor',
    summary: 'A protractor measures angles in degrees'
  },
  {
    key: 'construction-steps',
    title: 'Construction Steps',
    summary: 'Place center at vertex, align baseline, mark the degree'
  },
  {
    key: 'complete-angle',
    title: 'Complete the Angle',
    summary: 'Draw a ray through the marked point'
  },
  {
    key: 'congruent',
    title: 'Congruent Angles',
    summary: 'Angles with the same measure are congruent'
  },
  {
    key: 'practice',
    title: 'Practice Construction',
    summary: 'Ready to construct angles with precision!'
  }
];

export const CHAPTER2_MINIGAME_DIALOGUE = [
  "Constructor challenges you! Use the protractor to construct the angle shown.",
  "Rotate the ray to match the target angle measurement.",
  "Precision is key, young architect!"
];

export const CHAPTER2_MINIGAME_LEVELS = [
  {
    id: 1,
    targetAngle: 30,
    angleType: 'acute',
    description: 'Construct a 30° angle',
    hint: 'Use the protractor to measure 30°',
    tolerance: 3
  },
  {
    id: 2,
    targetAngle: 60,
    angleType: 'acute',
    description: 'Construct a 60° angle',
    hint: 'Look for 60° on the protractor scale',
    tolerance: 3
  },
  {
    id: 3,
    targetAngle: 90,
    angleType: 'right',
    description: 'Construct a 90° right angle',
    hint: 'A right angle is exactly 90°',
    tolerance: 2
  },
  {
    id: 4,
    targetAngle: 135,
    angleType: 'obtuse',
    description: 'Construct a 135° angle',
    hint: 'This is between 90° and 180°',
    tolerance: 3
  },
  {
    id: 5,
    targetAngle: 45,
    angleType: 'acute',
    description: 'Construct a 45° angle',
    hint: 'Exactly half of a right angle',
    tolerance: 3
  },
  {
    id: 6,
    targetAngle: 120,
    angleType: 'obtuse',
    description: 'Construct a 120° angle',
    hint: 'An obtuse angle measuring 120°',
    tolerance: 3
  }
];

export const CHAPTER2_LEARNING_OBJECTIVES = [
  { id: 'task-0', label: 'Learn: Using a Protractor', type: 'lesson' as const },
  { id: 'task-1', label: 'Learn: Constructing Angles', type: 'lesson' as const },
  { id: 'task-2', label: 'Learn: Congruent Angles', type: 'lesson' as const },
  { id: 'task-3', label: 'Construct 30° Angle', type: 'minigame' as const },
  { id: 'task-4', label: 'Construct 60° Angle', type: 'minigame' as const },
  { id: 'task-5', label: 'Construct 90° Right Angle', type: 'minigame' as const },
  { id: 'task-6', label: 'Construct 135° Angle', type: 'minigame' as const },
  { id: 'task-7', label: 'Construct 45° Angle', type: 'minigame' as const },
  { id: 'task-8', label: 'Construct 120° Angle', type: 'minigame' as const },
  { id: 'task-9', label: 'Pass Quiz Question 1', type: 'quiz' as const },
  { id: 'task-10', label: 'Pass Quiz Question 2', type: 'quiz' as const },
  { id: 'task-11', label: 'Pass Quiz Question 3', type: 'quiz' as const },
  { id: 'task-12', label: 'Pass Quiz Question 4', type: 'quiz' as const },
  { id: 'task-13', label: 'Pass Quiz Question 5', type: 'quiz' as const },
];

export const CHAPTER2_XP_VALUES = {
  lesson: 35,
  minigame: 40,
  quiz1: 15,
  quiz2: 15,
  quiz3: 15,
  quiz4: 15,
  quiz5: 15,
  total: 150,
};

export const CHAPTER2_CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008'; // Castle 2 (Angles Sanctuary)
export const CHAPTER2_NUMBER = 2;

// Relic information for reward screen
export const CHAPTER2_RELIC = {
  name: "Compass of Creation",
  image: "/images/relics/compass-of-creation.png",
  description: "You have mastered angle construction! The Compass of Creation allows you to forge angles with perfect precision, understanding the art of congruence."
};

// Wizard information
export const CHAPTER2_WIZARD = {
  name: "Constructor, Master of Angle Creation",
  image: "/images/constructor-wizard.png"
};

// Chapter metadata
export const CHAPTER2_METADATA = {
  title: "The Chamber of Construction",
  subtitle: "Castle 2 - The Angles Sanctuary",
  description: "Master the art of constructing angles with precision using a protractor and identify congruent angle pairs."
};
