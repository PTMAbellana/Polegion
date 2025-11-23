// ============================================================================
// CASTLE 4 - CHAPTER 3: The Shape Forge
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C4C3_AngleSumMinigame } from '@/components/chapters/minigames';
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
} from '@/constants/chapters/castle4/chapter3';
import { CHAPTER3_NARRATION } from '@/constants/chapters/castle4/chapter3';

const lessonTaskIds = CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER3_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTasks = Object.fromEntries(
  CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle4-chapter3',
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
  
  title: 'Chapter 3: The Shape Forge',
  subtitle: 'Castle 4 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle4Theme',
  welcomeMessage: 'Welcome to the Shape Forge!',
  castleRoute: '/student/worldmap/castle4',
  
  wizard: CHAPTER3_WIZARD,
  relic: CHAPTER3_RELIC,
  
  narration: CHAPTER3_NARRATION,
  logPrefix: '[Castle4Ch3]',
  
  MinigameComponent: C4C3_AngleSumMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
