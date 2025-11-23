// ============================================================================
// CASTLE 2 - CHAPTER 1: The Hall of Rays
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { AngleConstructorMinigame } from '@/components/chapters/minigames';
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
  CHAPTER1_NARRATION,
} from '@/constants/chapters/castle2/chapter1';

const config: ChapterConfig = {
  chapterKey: 'castle2-chapter1',
  castleId: CHAPTER1_CASTLE_ID,
  chapterNumber: CHAPTER1_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2', 'task-3', 'task-4', 'task-5'],
  minigameTaskId: 'task-6',
  quizTaskIds: {
    quiz1: 'task-7',
    quiz2: 'task-8',
    quiz3: 'task-9',
    quiz4: 'task-10',
    quiz5: 'task-11',
  },
  
  dialogue: CHAPTER1_DIALOGUE,
  sceneRanges: CHAPTER1_SCENE_RANGES,
  minigameLevels: CHAPTER1_MINIGAME_LEVELS,
  learningObjectives: CHAPTER1_LEARNING_OBJECTIVES,
  xpValues: CHAPTER1_XP_VALUES,
  concepts: CHAPTER1_CONCEPTS,
  
  title: 'Chapter 1: The Hall of Rays',
  subtitle: 'Castle 2 - Polygon Citadel',
  castleName: 'Polygon Citadel',
  castleTheme: 'castle2Theme',
  welcomeMessage: 'Welcome to the Polygon Citadel!',
  castleRoute: '/student/worldmap/castle2',
  
  wizard: {
    name: CHAPTER1_WIZARD.name,
    image: CHAPTER1_WIZARD.image,
  },
  
  relic: {
    name: CHAPTER1_RELIC.name,
    image: CHAPTER1_RELIC.image,
    description: CHAPTER1_RELIC.description,
  },
  
  narration: CHAPTER1_NARRATION,
  logPrefix: '[Castle2Ch1]',
  
  MinigameComponent: AngleConstructorMinigame,
};

export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
