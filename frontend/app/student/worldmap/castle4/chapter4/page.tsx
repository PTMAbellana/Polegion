// ============================================================================
// CASTLE 4 - CHAPTER 4: The Hall of Measurements
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C4C4_PolygonMeasurementMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER4_CASTLE_ID,
  CHAPTER4_NUMBER,
  CHAPTER4_DIALOGUE,
  CHAPTER4_SCENE_RANGES,
  CHAPTER4_MINIGAME_LEVELS,
  CHAPTER4_LEARNING_OBJECTIVES,
  CHAPTER4_XP_VALUES,
  CHAPTER4_CONCEPTS,
  CHAPTER4_RELIC,
  CHAPTER4_WIZARD,
} from '@/constants/chapters/castle4/chapter4';
import { CHAPTER4_NARRATION } from '@/constants/chapters/castle4/chapter4';

const lessonTaskIds = CHAPTER4_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER4_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTasks = Object.fromEntries(
  CHAPTER4_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle4-chapter4',
  castleId: CHAPTER4_CASTLE_ID,
  chapterNumber: CHAPTER4_NUMBER,
  
  lessonTaskIds,
  minigameTaskId,
  quizTaskIds: quizTasks,
  
  dialogue: CHAPTER4_DIALOGUE,
  sceneRanges: CHAPTER4_SCENE_RANGES,
  minigameLevels: CHAPTER4_MINIGAME_LEVELS,
  learningObjectives: CHAPTER4_LEARNING_OBJECTIVES,
  xpValues: CHAPTER4_XP_VALUES,
  concepts: CHAPTER4_CONCEPTS,
  
  title: 'Chapter 4: The Hall of Measurements',
  subtitle: 'Castle 4 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle4Theme',
  welcomeMessage: 'Welcome to the Hall of Measurements!',
  castleRoute: '/student/worldmap/castle4',
  
  wizard: CHAPTER4_WIZARD,
  relic: CHAPTER4_RELIC,
  
  narration: CHAPTER4_NARRATION,
  logPrefix: '[Castle4Ch4]',
  
  MinigameComponent: C4C4_PolygonMeasurementMinigame,
};

export default function Chapter4Page() {
  return <ChapterPageBase config={config} />;
}
