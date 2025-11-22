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
} from '@/constants/chapters/castle2/chapter2';

const config: ChapterConfig = {
  chapterKey: 'castle2-chapter2',
  castleId: CHAPTER2_CASTLE_ID,
  chapterNumber: CHAPTER2_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2', 'task-3', 'task-4'],
  minigameTaskId: 'task-5',
  quizTaskIds: {
    quiz1: 'task-6',
    quiz2: 'task-7',
    quiz3: 'task-8',
    quiz4: 'task-9',
    quiz5: 'task-10',
  },
  
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
  
  narrationKey: 'castle2-chapter2-lesson-intro',
  logPrefix: '[Castle2Ch2]',
  
  MinigameComponent: AngleRelationshipsMinigame,
};

export default function Chapter2Page() {
  return <ChapterPageBase config={config} />;
}
