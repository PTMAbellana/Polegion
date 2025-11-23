// ============================================================================
// CASTLE 4 - CHAPTER 1: The Gallery of Shapes
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C4C1_ShapeGalleryMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_DIALOGUE,
  CHAPTER1_SCENE_RANGES,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_XP_VALUES,
  CHAPTER1_CONCEPTS,
  CHAPTER1_RELIC,
  CHAPTER1_WIZARD,
} from '@/constants/chapters/castle4/chapter1';
import { CHAPTER1_NARRATION } from '@/constants/chapters/castle4/chapter1';

const config: ChapterConfig = {
  chapterKey: 'castle4-chapter1',
  castleId: CHAPTER1_CASTLE_ID,
  chapterNumber: CHAPTER1_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2'],
  minigameTaskId: 'task-3',
  quizTaskIds: {
    quiz1: 'task-4',
    quiz2: 'task-5',
    quiz3: 'task-6',
    quiz4: 'task-7',
    quiz5: 'task-8',
  },
  
  dialogue: CHAPTER1_DIALOGUE,
  sceneRanges: CHAPTER1_SCENE_RANGES,
  minigameLevels: CHAPTER1_MINIGAME_LEVELS,
  learningObjectives: CHAPTER1_LEARNING_OBJECTIVES,
  xpValues: CHAPTER1_XP_VALUES,
  concepts: CHAPTER1_CONCEPTS,
  
  title: 'Chapter 1: The Gallery of Shapes',
  subtitle: 'Castle 4 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle4Theme',
  welcomeMessage: 'Welcome to the Gallery of Shapes!',
  castleRoute: '/student/worldmap/castle4',
  
  wizard: CHAPTER1_WIZARD,
  relic: CHAPTER1_RELIC,
  
  narration: CHAPTER1_NARRATION,
  logPrefix: '[Castle4Ch1]',
  
  MinigameComponent: C4C1_ShapeGalleryMinigame,
};

export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
