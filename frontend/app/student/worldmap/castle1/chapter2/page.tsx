// ============================================================================
// CASTLE 1 - CHAPTER 2: Lines and Angles
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { LineBasedMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER2_CASTLE_ID,
  CHAPTER2_NUMBER,
  CHAPTER2_DIALOGUE,
  CHAPTER2_SCENE_RANGES,
  CHAPTER2_MINIGAME_LEVELS,
  CHAPTER2_LEARNING_OBJECTIVES,
  CHAPTER2_XP_VALUES,
  CHAPTER2_CONCEPTS,
  CHAPTER2_NARRATION,
} from '@/constants/chapters/castle1/chapter2';

const lessonTaskIds = CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER2_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTaskIds = Object.fromEntries(
  CHAPTER2_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle1-chapter2',
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
  
  title: 'Chapter 2: Lines and Angles',
  subtitle: 'Castle 1 - Euclidean Spire Quest',
  castleName: 'Euclidean Spire',
  castleTheme: 'castle1Theme',
  welcomeMessage: 'Welcome to the Euclidean Spire!',
  castleRoute: '/student/worldmap/castle1',
  
  wizard: {
    name: 'Archim, Keeper of the Euclidean Spire',
    image: '/images/wizards/archim-wizard.png',
  },
  
  relic: {
    name: 'Line Compass',
    image: '/images/relics/line-compass.png',
    description: 'You have mastered lines and angles! The Line Compass allows you to measure and draw perfect lines.',
  },
  
  narration: CHAPTER2_NARRATION,
  logPrefix: '[Castle1Ch2]',
  
  MinigameComponent: LineBasedMinigame,
};

export default function Chapter2Page() {
  return <ChapterPageBase config={config} />;
}
