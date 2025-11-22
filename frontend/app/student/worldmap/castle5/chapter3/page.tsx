// ============================================================================
// CASTLE 5 - CHAPTER 3: The Volume Sanctum
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { AreaCalculationMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER3_CASTLE_ID,
  CHAPTER3_NUMBER,
  CHAPTER3_DIALOGUE,
  CHAPTER3_SCENE_RANGES,
  CHAPTER3_MINIGAME_LEVELS,
  CHAPTER3_LEARNING_OBJECTIVES,
  CHAPTER3_XP_VALUES,
  CHAPTER3_CONCEPTS,
  CHAPTER3_RELIC,
  CHAPTER3_WIZARD,
} from '@/constants/chapters/castle5/chapter3';

const config: ChapterConfig = {
  chapterKey: 'castle5-chapter3',
  castleId: CHAPTER3_CASTLE_ID,
  chapterNumber: CHAPTER3_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2'],
  minigameTaskId: 'task-3',
  quizTaskIds: {
    quiz1: 'task-4',
    quiz2: 'task-5',
    quiz3: 'task-6',
    quiz4: 'task-7',
    quiz5: 'task-8',
  },
  
  dialogue: CHAPTER3_DIALOGUE,
  sceneRanges: CHAPTER3_SCENE_RANGES,
  minigameLevels: CHAPTER3_MINIGAME_LEVELS,
  learningObjectives: CHAPTER3_LEARNING_OBJECTIVES,
  xpValues: CHAPTER3_XP_VALUES,
  concepts: CHAPTER3_CONCEPTS,
  
  title: 'Chapter 3: The Volume Sanctum',
  subtitle: 'Castle 5 - Arcane Observatory',
  castleName: 'Arcane Observatory',
  castleTheme: 'castle5Theme',
  welcomeMessage: 'Welcome to the Volume Sanctum!',
  castleRoute: '/student/worldmap/castle5',
  
  wizard: CHAPTER3_WIZARD,
  relic: CHAPTER3_RELIC,
  
  narrationKey: 'castle5-chapter3-lesson-intro',
  logPrefix: '[Castle5Ch3]',
  
  MinigameComponent: AreaCalculationMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
