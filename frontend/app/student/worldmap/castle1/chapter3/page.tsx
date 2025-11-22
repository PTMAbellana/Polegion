// ============================================================================
// CASTLE 1 - CHAPTER 3: Shapes and Polygons
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { ShapeBasedMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER3_CASTLE_ID,
  CHAPTER3_NUMBER,
  CHAPTER3_DIALOGUE,
  CHAPTER3_SCENE_RANGES,
  CHAPTER3_MINIGAME_LEVELS,
  CHAPTER3_LEARNING_OBJECTIVES,
  CHAPTER3_XP_VALUES,
  CHAPTER3_CONCEPTS,
} from '@/constants/chapters/castle1/chapter3';

const config: ChapterConfig = {
  chapterKey: 'castle1-chapter3',
  castleId: CHAPTER3_CASTLE_ID,
  chapterNumber: CHAPTER3_NUMBER,
  
  lessonTaskIds: [
    'task-0', 'task-1', 'task-2', 'task-3', 'task-4',
    'task-5', 'task-6', 'task-7', 'task-8', 'task-9',
    'task-10', 'task-11', 'task-12', 'task-13', 'task-14',
    'task-15', 'task-16', 'task-17', 'task-18', 'task-19'
  ],
  minigameTaskId: 'task-20',
  quizTaskIds: {
    quiz1: 'task-21',
    quiz2: 'task-22',
    quiz3: 'task-23',
  },
  
  dialogue: CHAPTER3_DIALOGUE,
  sceneRanges: CHAPTER3_SCENE_RANGES,
  minigameLevels: CHAPTER3_MINIGAME_LEVELS,
  learningObjectives: CHAPTER3_LEARNING_OBJECTIVES,
  xpValues: CHAPTER3_XP_VALUES,
  concepts: CHAPTER3_CONCEPTS,
  
  title: 'Chapter 3: Shapes and Polygons',
  subtitle: 'Castle 1 - Euclidean Spire Quest',
  castleName: 'Euclidean Spire',
  castleTheme: 'castle1Theme',
  welcomeMessage: 'Welcome to the Euclidean Spire!',
  castleRoute: '/student/worldmap/castle1',
  
  wizard: {
    name: 'Archim, Keeper of the Euclidean Spire',
    image: '/images/archim-wizard.png',
  },
  
  relic: {
    name: 'Polygon Prism',
    image: '/images/relics/polygon-prism.png',
    description: 'You have mastered shapes and polygons! The Polygon Prism reveals the hidden properties of all geometric forms.',
  },
  
  narrationKey: 'chapter3-lesson-intro',
  logPrefix: '[Castle1Ch3]',
  
  MinigameComponent: ShapeBasedMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
