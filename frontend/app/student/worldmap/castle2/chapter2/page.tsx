// ============================================================================
// CASTLE 2 - CHAPTER 2: The Chamber of Construction
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { AngleRelationshipsMinigame } from '@/components/chapters/minigames';
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
  CHAPTER2_NARRATION,
} from '@/constants/chapters/castle2/chapter2';

const lessonTaskIds = CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER2_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTaskIds = Object.fromEntries(
  CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle2-chapter2',
  castleId: CHAPTER2_CASTLE_ID,
  chapterNumber: CHAPTER2_NUMBER,
  
  lessonTaskIds,
  minigameTaskId,
  quizTaskIds,
  
  dialogue: CHAPTER2_DIALOGUE,
  sceneRanges: CHAPTER2_SCENE_RANGES,
  minigameLevels: CHAPTER2_MINIGAME_LEVELS,
  learningObjectives: CHAPTER2_LEARNING_OBJECTIVES,
  xpValues: CHAPTER2_XP_VALUES,
  concepts: CHAPTER2_CONCEPTS,
  
  title: 'Chapter 2: The Point of Convergence',
  subtitle: 'Castle 2 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle2Theme',
  welcomeMessage: 'Welcome to the Point of Convergence!',
  castleRoute: '/student/worldmap/castle2',
  
  wizard: CHAPTER2_WIZARD,
  relic: CHAPTER2_RELIC,
  
  narration: CHAPTER2_NARRATION,
  logPrefix: '[Castle2Ch2]',
  
  MinigameComponent: AngleRelationshipsMinigame,
};

export default function Chapter2Page() {
  return <ChapterPageBase config={config} />;
}
