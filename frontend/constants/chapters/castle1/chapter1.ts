import type { GeometryLevel } from '@/components/chapters/minigames/GeometryPhysicsGame';

// Dialogue data
export const CHAPTER1_OPENING_DIALOGUE = [
  'Ah, a new seeker of shapes has arrived! Welcome, traveler.',
  'I am Archim, Keeper of the Euclidean Spire, where all geometry was born.',
  'These are Points, the seeds of all geometry. Touch one, and it comes alive!',
  'From these points, we shall unlock the tower\'s ancient power!',
];

export const CHAPTER1_LESSON_DIALOGUE = [
  'Every shape begins with a Point, small, yet mighty.',
  'Two points form a connection, that is the beginning of a Line Segment.',
  'If the path stretches endlessly in one direction, it is a Ray.',
  'And if it continues in both directions, it becomes a Line, infinite and eternal.',
  'Watch closely as these fundamental forms reveal themselves.',
  'Now, let us put your knowledge to practice!',
];

export const CHAPTER1_MINIGAME_DIALOGUE = [
  'Excellent! Now let\'s put your knowledge into practice with a fun challenge!',
  'Help the ball reach the trash can by creating geometric shapes.',
  'Think carefully about where to place your points!',
];

// Minigame levels
export const CHAPTER1_MINIGAME_LEVELS: GeometryLevel[] = [
  {
    id: 1,
    type: 'line-segment',
    title: 'Level 1: Line Segment',
    instruction: 'Create a line segment to guide the ball into the box. Click two points to create the segment.',
    ballStartX: 20,
    ballStartY: 10,
  },
  {
    id: 2,
    type: 'ray',
    title: 'Level 2: Ray',
    instruction: 'Create a ray starting near the box. Place the first point carefully, then the second point to set the direction.',
    ballStartX: 15,
    ballStartY: 15,
  },
  {
    id: 3,
    type: 'line',
    title: 'Level 3: Line',
    instruction: 'Draw a line and keep the ball balanced on it! Don\'t let it fall off or touch the walls!',
    ballStartX: 10,
    ballStartY: 20,
  },
];

// Learning objectives
export const CHAPTER1_LEARNING_OBJECTIVES = [
  { key: 'task-0', label: 'Learn: Points' },
  { key: 'task-1', label: 'Learn: Line Segments' },
  { key: 'task-2', label: 'Learn: Rays' },
  { key: 'task-3', label: 'Learn: Infinite Lines' },
  { key: 'task-4', label: 'Minigame' },
  { key: 'task-5', label: 'Pass Quiz 1' },
  { key: 'task-6', label: 'Pass Quiz 2' },
  { key: 'task-7', label: 'Pass Quiz 3' },
];

// XP Values
export const CHAPTER1_XP_VALUES = {
  lesson: 20,
  minigame: 30,
  quiz1: 15,
  quiz2: 15,
  quiz3: 20,
  total: 100,
};

// Castle and Chapter IDs
export const CHAPTER1_CASTLE_ID = 'cd5ddb70-b4ba-46cb-85fd-d66e5735619f';
export const CHAPTER1_NUMBER = 1;
