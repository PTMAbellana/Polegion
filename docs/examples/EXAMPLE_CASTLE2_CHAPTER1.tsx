// ============================================================================
// EXAMPLE: CASTLE 2 - CHAPTER 1: The Hall of Rays
// ============================================================================

'use client';

import ChapterPageBase, { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { AngleTypeMinigame } from '@/components/chapters/minigames';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_DIALOGUE,
  CHAPTER1_SCENE_RANGES,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_XP_VALUES,
  CHAPTER1_CONCEPTS,
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
  welcomeMessage: 'Welcome to the Polygon Citadel!',
  castleRoute: '/student/worldmap/castle2',
  
  wizard: {
    name: 'Sylvan, Guardian of the Polygon Citadel',
    image: '/images/wizards/sylvan-wizard.png',
  },
  
  relic: {
    name: 'Angle Protractor',
    image: '/images/relics/angle-protractor.png',
    description: 'You have mastered the types of angles! The Angle Protractor reveals hidden angle measurements.',
  },
  
  narrationKey: 'chapter1-lesson-intro',
  logPrefix: '[Castle2Ch1]',
  
  MinigameComponent: AngleTypeMinigame,
};

export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
