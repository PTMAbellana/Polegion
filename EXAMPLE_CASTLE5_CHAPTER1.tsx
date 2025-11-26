// ============================================================================
// EXAMPLE: CASTLE 5 - CHAPTER 1: The Hall of Planes
// ============================================================================

'use client';

import ChapterPageBase, { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { PlaneVsSolidMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_DIALOGUE,
  CHAPTER1_SCENE_RANGES,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_XP_VALUES,
  CHAPTER1_CONCEPTS,
} from '@/constants/chapters/castle5/chapter1';

const config: ChapterConfig = {
  chapterKey: 'castle5-chapter1',
  castleId: CHAPTER1_CASTLE_ID,
  chapterNumber: CHAPTER1_NUMBER,
  
  // Castle 5 Chapter 1 has 7 lesson tasks
  lessonTaskIds: ['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5', 'task-6'],
  minigameTaskId: 'task-7',
  quizTaskIds: {
    quiz1: 'task-8',
    quiz2: 'task-9',
    quiz3: 'task-10',
  },
  
  dialogue: CHAPTER1_DIALOGUE,
  sceneRanges: CHAPTER1_SCENE_RANGES,
  minigameLevels: CHAPTER1_MINIGAME_LEVELS,
  learningObjectives: CHAPTER1_LEARNING_OBJECTIVES,
  xpValues: CHAPTER1_XP_VALUES,
  concepts: CHAPTER1_CONCEPTS,
  
  title: 'Chapter 1: The Hall of Planes',
  subtitle: 'Castle 5 - Arcane Observatory',
  castleName: 'Arcane Observatory',
  welcomeMessage: 'Welcome to the Arcane Observatory!',
  castleRoute: '/student/worldmap/castle5',
  
  wizard: {
    name: 'Dimensius, Guardian of Space',
    image: '/images/dimensius-wizard.png',
  },
  
  relic: {
    name: 'Dimensional Lens',
    image: '/images/relics/dimensional-lens.png',
    description: 'You have learned to see beyond flatness! The Dimensional Lens reveals whether shapes exist in 2D or 3D space.',
  },
  
  narrationKey: 'chapter1-lesson-intro',
  logPrefix: '[Castle5Ch1]',
  
  MinigameComponent: PlaneVsSolidMinigame,
};

export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
