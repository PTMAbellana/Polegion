// ============================================================================
// CASTLE 5 - CHAPTER 1: The Hall of Planes
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { ShapeBasedMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_DIALOGUE,
  CHAPTER1_SCENE_RANGES,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_XP_VALUES,
  CHAPTER1_CONCEPTS,
  CHAPTER1_RELIC,
  CHAPTER1_WIZARD,
} from '@/constants/chapters/castle5/chapter1';
import { CHAPTER1_NARRATION } from '@/constants/chapters/castle5/chapter1';

const config: ChapterConfig = {
  chapterKey: 'castle5-chapter1',
  castleId: CHAPTER1_CASTLE_ID,
  chapterNumber: CHAPTER1_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2'],
  minigameTaskId: 'task-3',
  quizTaskIds: {
    quiz1: 'task-4',
    quiz2: 'task-5',
    quiz3: 'task-6',
    quiz4: 'task-7',
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
  castleTheme: 'castle5Theme',
  welcomeMessage: 'Welcome to the Hall of Planes!',
  castleRoute: '/student/worldmap/castle5',
  
  wizard: CHAPTER1_WIZARD,
  relic: CHAPTER1_RELIC,
  
  narration: CHAPTER1_NARRATION,
  logPrefix: '[Castle5Ch1]',
  
  MinigameComponent: ShapeBasedMinigame,
};

export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
