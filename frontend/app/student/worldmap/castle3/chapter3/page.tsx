// ============================================================================
// CASTLE 3 - CHAPTER 3: The Chamber of Areas
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { C3C3_CircleAreaMinigame } from '@/components/chapters/minigames';
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
  CHAPTER3_NARRATION,
} from '@/constants/chapters/castle3/chapter3';

const config: ChapterConfig = {
  chapterKey: 'castle3-chapter3',
  castleId: CHAPTER3_CASTLE_ID,
  chapterNumber: CHAPTER3_NUMBER,
  
  lessonTaskIds: ['task-0', 'task-1', 'task-2'],
  minigameTaskId: 'task-3',
  quizTaskIds: {
    quiz1: 'task-4',
    quiz2: 'task-5',
    quiz3: 'task-6',
    quiz4: 'task-7',
    quiz5: 'task-8',
  },
  
  dialogue: CHAPTER3_DIALOGUE,
  sceneRanges: CHAPTER3_SCENE_RANGES,
  minigameLevels: CHAPTER3_MINIGAME_LEVELS,
  learningObjectives: CHAPTER3_LEARNING_OBJECTIVES,
  xpValues: CHAPTER3_XP_VALUES,
  concepts: CHAPTER3_CONCEPTS,
  
  title: 'Chapter 3: The Chamber of Areas',
  subtitle: 'Castle 3 - Circle Sanctuary',
  castleName: 'Circle Sanctuary',
  castleTheme: 'castle3Theme',
  welcomeMessage: 'Welcome to the Chamber of Areas!',
  castleRoute: '/student/worldmap/castle3',
  
  wizard: CHAPTER3_WIZARD,
  relic: CHAPTER3_RELIC,
  
  narration: CHAPTER3_NARRATION,
  logPrefix: '[Castle3Ch3]',
  
  MinigameComponent: C3C3_CircleAreaMinigame,
};

export default function Chapter3Page() {
  return <ChapterPageBase config={config} />;
}
