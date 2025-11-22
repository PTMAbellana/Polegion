import type { GeometryLevel } from '@/components/chapters/minigames/C1C1_GeometryPhysicsGame';

// Unified dialogue system with scene markers
export interface ChapterDialogue {
  scene: 'opening' | 'lesson' | 'minigame';
  text: string;
  key?: string;
  taskId?: string;
}

export const CHAPTER1_DIALOGUE: ChapterDialogue[] = [
  // Opening Scene (indices 0-3)
  { scene: 'opening', text: 'Ah, a new seeker of shapes has arrived! Welcome, traveler.' },
  { scene: 'opening', text: 'I am Archim, Keeper of the Euclidean Spire, where all geometry was born.' },
  { scene: 'opening', text: 'These are Points, the seeds of all geometry. Touch one, and it comes alive!' },
  { scene: 'opening', text: 'From these points, we shall unlock the tower\'s ancient power!' },
  
  // Lesson Scene (indices 4-9)
  { scene: 'lesson', text: 'Every shape begins with a Point, small, yet mighty.', key: 'intro' },
  { scene: 'lesson', text: 'A point represents a specific location in space with no size, only position.', key: 'point', taskId: 'task-0' },
  { scene: 'lesson', text: 'Two points form a connection, that is the beginning of a Line Segment.', key: 'line-segment', taskId: 'task-1' },
  { scene: 'lesson', text: 'If the path stretches endlessly in one direction, it is a Ray.', key: 'ray', taskId: 'task-2' },
  { scene: 'lesson', text: 'And if it continues in both directions, it becomes a Line, infinite and eternal.', key: 'line', taskId: 'task-3' },
  { scene: 'lesson', text: 'Now, let us put your knowledge to practice!', key: 'practice' },
  
  // Minigame Scene (indices 10-12)
  { scene: 'minigame', text: 'Excellent! Now let\'s put your knowledge into practice with a fun challenge!' },
  { scene: 'minigame', text: 'Help the ball reach the trash can by creating geometric shapes.' },
  { scene: 'minigame', text: 'Think carefully about where to place your points!' },
];

// Helper to get scene boundaries
export const CHAPTER1_SCENE_RANGES = {
  opening: { start: 0, end: 3 },
  lesson: { start: 4, end: 9 },
  minigame: { start: 10, end: 12 },
};

// Legacy exports for backward compatibility (deprecated)
export const CHAPTER1_OPENING_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'opening').map(d => d.text);
export const CHAPTER1_LESSON_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'lesson').map(d => ({ key: d.key || '', text: d.text, taskId: d.taskId }));
export const CHAPTER1_MINIGAME_DIALOGUE = CHAPTER1_DIALOGUE.filter(d => d.scene === 'minigame').map(d => d.text);

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

// Concept cards for lesson scene
export const CHAPTER1_CONCEPTS = [
  {
    key: 'point',
    title: 'Point',
    description: 'A point represents a specific location in space. It has no size, only position. We name points with capital letters.',
    image: '/images/castle1/point.png',
    taskId: 'task-0',
  },
  {
    key: 'line-segment',
    title: 'Line Segment',
    description: 'A line segment is a straight path between two points. It has a definite beginning and end. We write it as AB.',
    image: '/images/castle1/line-segment.png',
    taskId: 'task-1',
  },
  {
    key: 'ray',
    title: 'Ray',
    description: 'A ray starts at one point and extends infinitely in one direction. Like a beam of light! We write it as AB with an arrow.',
    image: '/images/castle1/ray.png',
    taskId: 'task-2',
  },
  {
    key: 'line',
    title: 'Line',
    description: 'A line extends infinitely in both directions. It has no beginning or end. We draw arrows on both sides and write it as ↔AB.',
    image: '/images/castle1/line.png',
    taskId: 'task-3',
  },
];

// Learning objectives
export const CHAPTER1_LEARNING_OBJECTIVES = [
  { id: 'task-0', key: 'point', label: 'Learn: Points', type: 'lesson' },
  { id: 'task-1', key: 'line-segment', label: 'Learn: Line Segments', type: 'lesson' },
  { id: 'task-2', key: 'ray', label: 'Learn: Rays', type: 'lesson' },
  { id: 'task-3', key: 'line', label: 'Learn: Infinite Lines', type: 'lesson' },
  { id: 'task-4', key: 'minigame', label: 'Minigame', type: 'minigame' },
  { id: 'task-5', key: 'quiz1', label: 'Pass Quiz 1', type: 'quiz' },
  { id: 'task-6', key: 'quiz2', label: 'Pass Quiz 2', type: 'quiz' },
  { id: 'task-7', key: 'quiz3', label: 'Pass Quiz 3', type: 'quiz' },
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
