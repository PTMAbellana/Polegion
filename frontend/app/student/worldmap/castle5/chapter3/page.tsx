// ============================================================================
// CASTLE 5 - CHAPTER 3: The Volume Sanctum
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C5C3_SurfaceAreaMinigame } from '@/components/chapters/minigames';
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
import { CHAPTER3_NARRATION } from '@/constants/chapters/castle5/chapter3';

const lessonTaskIds = CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER3_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTasks = Object.fromEntries(
  CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle5-chapter3',
  castleId: CHAPTER3_CASTLE_ID,
  chapterNumber: CHAPTER3_NUMBER,
  
  lessonTaskIds,
  minigameTaskId,
  quizTaskIds: quizTasks,
  
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
  
  narration: CHAPTER3_NARRATION,
  logPrefix: '[Castle5Ch3]',
  
  MinigameComponent: C5C3_SurfaceAreaMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
