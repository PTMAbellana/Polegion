// ============================================================================
// CASTLE 5 - CHAPTER 2: The Dimensional Nexus
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C5C2_2DMeasurementMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER2_CASTLE_ID,
  CHAPTER2_NUMBER,
  CHAPTER2_DIALOGUE,
  CHAPTER2_SCENE_RANGES,
  CHAPTER2_MINIGAME_LEVELS,
  CHAPTER2_LEARNING_OBJECTIVES,
  CHAPTER2_XP_VALUES,
  CHAPTER2_CONCEPTS,
  CHAPTER2_RELIC,
  CHAPTER2_WIZARD,
} from '@/constants/chapters/castle5/chapter2';
import { CHAPTER2_NARRATION } from '@/constants/chapters/castle5/chapter2';

const lessonTaskIds = CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER2_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTasks = Object.fromEntries(
  CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle5-chapter2',
  castleId: CHAPTER2_CASTLE_ID,
  chapterNumber: CHAPTER2_NUMBER,
  
  lessonTaskIds,
  minigameTaskId,
  quizTaskIds: quizTasks,
  
  dialogue: CHAPTER2_DIALOGUE,
  sceneRanges: CHAPTER2_SCENE_RANGES,
  minigameLevels: CHAPTER2_MINIGAME_LEVELS,
  learningObjectives: CHAPTER2_LEARNING_OBJECTIVES,
  xpValues: CHAPTER2_XP_VALUES,
  concepts: CHAPTER2_CONCEPTS,
  
  title: 'Chapter 2: The Dimensional Nexus',
  subtitle: 'Castle 5 - Arcane Observatory',
  castleName: 'Arcane Observatory',
  castleTheme: 'castle5Theme',
  welcomeMessage: 'Welcome to the Dimensional Nexus!',
  castleRoute: '/student/worldmap/castle5',
  
  wizard: CHAPTER2_WIZARD,
  relic: CHAPTER2_RELIC,
  
  narration: CHAPTER2_NARRATION,
  logPrefix: '[Castle5Ch2]',
  
  MinigameComponent: C5C2_2DMeasurementMinigame,
};

export default function Chapter2Page() {
  return <ChapterPageBase config={config} />;
}
