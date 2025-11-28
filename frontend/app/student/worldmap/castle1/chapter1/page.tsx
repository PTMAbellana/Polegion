// ============================================================================
// CASTLE 1 - CHAPTER 1: The Point of Origin
// ============================================================================
// This chapter uses the reusable ChapterPageBase component.
// Only configuration is needed - all logic is in the base component.
// ============================================================================

'use client';

import ChapterPageBase from '@/components/chapters/ChapterPageBase';
import type { ChapterConfig } from '@/components/chapters/ChapterPageBase';
import { GeometryPhysicsGame } from '@/components/chapters/minigames';
import {
  CHAPTER1_CASTLE_ID,
  CHAPTER1_NUMBER,
  CHAPTER1_DIALOGUE,
  CHAPTER1_SCENE_RANGES,
  CHAPTER1_MINIGAME_LEVELS,
  CHAPTER1_LEARNING_OBJECTIVES,
  CHAPTER1_XP_VALUES,
  CHAPTER1_CONCEPTS,
  CHAPTER1_NARRATION,
} from '@/constants/chapters/castle1/chapter1';

// ============================================================================
// Chapter Configuration
// ============================================================================
const lessonTaskIds = CHAPTER1_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'lesson').map((t: any) => t.id)
const minigameTaskId = CHAPTER1_LEARNING_OBJECTIVES.find((t: any) => t.type === 'minigame')!.id
const quizTaskIds = Object.fromEntries(
  CHAPTER1_LEARNING_OBJECTIVES.filter((t: any) => t.type === 'quiz').map((t: any, i: number) => [`quiz${i + 1}`, t.id])
)

const config: ChapterConfig = {
  // Identity
  chapterKey: 'castle1-chapter1',
  castleId: CHAPTER1_CASTLE_ID,
  chapterNumber: CHAPTER1_NUMBER,
  
  // Task IDs
  lessonTaskIds,
  minigameTaskId,
  quizTaskIds,
  
  // Content from constants
  dialogue: CHAPTER1_DIALOGUE,
  sceneRanges: CHAPTER1_SCENE_RANGES,
  minigameLevels: CHAPTER1_MINIGAME_LEVELS,
  learningObjectives: CHAPTER1_LEARNING_OBJECTIVES,
  xpValues: CHAPTER1_XP_VALUES,
  concepts: CHAPTER1_CONCEPTS,
  
  // Display info
  title: 'Chapter 1: The Point of Origin',
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
    name: 'Pointlight Crystal',
    image: '/images/relics/pointlight-crystal.png',
    description: 'You have mastered the fundamental building blocks of geometry! The Pointlight Crystal allows you to illuminate dark areas and reveal hidden paths.',
  },
  
  narration: CHAPTER1_NARRATION,
  logPrefix: '[Castle1Ch1]',
  
  // Minigame component
  MinigameComponent: GeometryPhysicsGame,
};

// ============================================================================
// Component - Just pass the config to the base!
// ============================================================================
export default function Chapter1Page() {
  return <ChapterPageBase config={config} />;
}
