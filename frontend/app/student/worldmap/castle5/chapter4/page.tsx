// ============================================================================
// CASTLE 5 - CHAPTER 4: The Cosmic Observatory
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C5C4_VolumeMinigame } from '@/components/chapters/minigames';
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
} from '@/constants/chapters/castle5/chapter4';
import { CHAPTER4_NARRATION } from '@/constants/chapters/castle5/chapter4';

const lessonTaskIds = CHAPTER4_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER4_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTasks = Object.fromEntries(
  CHAPTER4_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle5-chapter4',
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
  
  title: 'Chapter 4: The Cosmic Observatory',
  subtitle: 'Castle 5 - Arcane Observatory',
  castleName: 'Arcane Observatory',
  castleTheme: 'castle5Theme',
  welcomeMessage: 'Welcome to the Cosmic Observatory!',
  castleRoute: '/student/worldmap/castle5',
  
  wizard: CHAPTER4_WIZARD,
  relic: CHAPTER4_RELIC,
  
  narration: CHAPTER4_NARRATION,
  logPrefix: '[Castle5Ch4]',
  
  MinigameComponent: C5C4_VolumeMinigame,
};

export default function Chapter4Page() {
  return <ChapterPageBase config={config} />;
}
