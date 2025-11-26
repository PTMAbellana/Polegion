// ============================================================================
// CASTLE 2 - CHAPTER 3: The Angle Forge
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { ComplementarySupplementaryMinigame } from '@/components/chapters/minigames';
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
  CHAPTER3_NARRATION,
} from '@/constants/chapters/castle2/chapter3';

const lessonTaskIds = CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER3_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTaskIds = Object.fromEntries(
  CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle2-chapter3',
  castleId: CHAPTER3_CASTLE_ID,
  chapterNumber: CHAPTER3_NUMBER,
  
  lessonTaskIds,
  minigameTaskId,
  quizTaskIds,
  
  dialogue: CHAPTER3_DIALOGUE,
  sceneRanges: CHAPTER3_SCENE_RANGES,
  minigameLevels: CHAPTER3_MINIGAME_LEVELS,
  learningObjectives: CHAPTER3_LEARNING_OBJECTIVES,
  xpValues: CHAPTER3_XP_VALUES,
  concepts: CHAPTER3_CONCEPTS,
  
  title: 'Chapter 3: The Angle Forge',
  subtitle: 'Castle 2 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle2Theme',
  welcomeMessage: 'Welcome to the Angle Forge!',
  castleRoute: '/student/worldmap/castle2',
  
  wizard: CHAPTER3_WIZARD,
  relic: CHAPTER3_RELIC,
  
  narration: CHAPTER3_NARRATION,
  logPrefix: '[Castle2Ch3]',
  
  MinigameComponent: ComplementarySupplementaryMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
