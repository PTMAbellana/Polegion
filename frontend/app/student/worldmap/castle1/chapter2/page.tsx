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

const config: ChapterConfig = {
  chapterKey: 'castle1-chapter2',
  castleId: CHAPTER2_CASTLE_ID,
  chapterNumber: CHAPTER2_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2', 'task-3', 'task-4'],
  minigameTaskId: 'task-5',
  quizTaskIds: {
    quiz1: 'task-6',
    quiz2: 'task-7',
    quiz3: 'task-8',
  },
  
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
    image: '/images/archim-wizard.png',
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
