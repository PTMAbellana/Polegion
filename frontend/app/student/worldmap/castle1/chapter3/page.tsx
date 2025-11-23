// ============================================================================
// CASTLE 1 - CHAPTER 3: Shapes and Polygons
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { ShapeBasedMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER3_CASTLE_ID,
  CHAPTER3_NUMBER,
  CHAPTER3_DIALOGUE,
  CHAPTER3_SCENE_RANGES,
  CHAPTER3_MINIGAME_LEVELS,
  CHAPTER3_LEARNING_OBJECTIVES,
  CHAPTER3_XP_VALUES,
  CHAPTER3_CONCEPTS,
  CHAPTER3_NARRATION,
} from '@/constants/chapters/castle1/chapter3';

const lessonTaskIds = CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER3_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTaskIds = Object.fromEntries(
  CHAPTER3_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  chapterKey: 'castle1-chapter3',
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
  
  title: 'Chapter 3: Shapes and Polygons',
  subtitle: 'Castle 1 - Euclidean Spire Quest',
  castleName: 'Euclidean Spire',
  castleTheme: 'castle1Theme',
  welcomeMessage: 'Welcome to the Euclidean Spire!',
  castleRoute: '/student/worldmap/castle1',
  
  wizard: {
    name: 'Archim, Keeper of the Euclidean Spire',
    image: '/images/archim-wizard.png',
  },
  
  relic: {
    name: 'Polygon Prism',
    image: '/images/relics/polygon-prism.png',
    description: 'You have mastered shapes and polygons! The Polygon Prism reveals the hidden properties of all geometric forms.',
  },
  
  narration: CHAPTER3_NARRATION,
  logPrefix: '[Castle1Ch3]',
  
  MinigameComponent: ShapeBasedMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
