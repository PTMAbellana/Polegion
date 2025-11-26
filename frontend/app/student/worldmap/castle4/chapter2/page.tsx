// ============================================================================
// CASTLE 4 - CHAPTER 2: The Polygon Workshop
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C4C2_PolygonDrawingMinigame } from '@/components/chapters/minigames';
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
} from '@/constants/chapters/castle4/chapter2';
import { CHAPTER2_NARRATION } from '@/constants/chapters/castle4/chapter2';

const lessonTaskIds = CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER2_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTasks = Object.fromEntries(
  CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle4-chapter2',
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
  
  title: 'Chapter 2: The Polygon Workshop',
  subtitle: 'Castle 4 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle4Theme',
  welcomeMessage: 'Welcome to the Polygon Workshop!',
  castleRoute: '/student/worldmap/castle4',
  
  wizard: CHAPTER2_WIZARD,
  relic: CHAPTER2_RELIC,
  
  narration: CHAPTER2_NARRATION,
  logPrefix: '[Castle4Ch2]',
  
  MinigameComponent: C4C2_PolygonDrawingMinigame,
};

export default function Chapter2Page() {
  return <ChapterPageBase config={config} />;
}
