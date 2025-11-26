/**
 * Chapter Helper Utilities
 * 
 * Centralized functions for common chapter operations like continue, restart,
 * retake quiz, etc. These can be used by existing chapters without full refactoring.
 */

import { useChapterStore } from '@/store/chapterStore'

export interface RestartChapterOptions {
  chapterKey: string
  setCurrentScene: (scene: string) => void
  setCompletedTasks: (tasks: Record<string, boolean>) => void
  setFailedTasks: (tasks: Record<string, boolean>) => void
  setQuizAnswers: (answers: Record<string, string>) => void
  setQuizAttempts: (attempts: number) => void
  setEarnedXP: (xp: { lesson: number; minigame: number; quiz: number }) => void
  setMinigameLevel: (level: number) => void
  setMessageIndex?: (index: number) => void
  checkedLessonTasksRef?: React.MutableRefObject<Set<string>>
  resetDialogue?: () => void
}

export interface RetakeQuizOptions {
  chapterKey: string
  quizTaskIds: string[]
  setCompletedTasks: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void
  setQuizAnswers: (answers: Record<string, boolean>) => void
  setQuizAttempts: (attempts: number) => void
  setCurrentScene: (scene: string) => void
  resetDialogue?: () => void
}

export interface RetakeLessonOptions {
  chapterKey: string
  lessonTaskIds: string[]
  setCompletedTasks: (updater: (prev: Record<string, boolean>) => Record<string, boolean>) => void
  setCurrentScene: (scene: string) => void
  setMessageIndex?: (index: number) => void
  checkedLessonTasksRef?: React.MutableRefObject<Set<string>>
  resetDialogue?: () => void
}

/**
 * Completely restart a chapter from the beginning
 */
export function restartChapter(options: RestartChapterOptions) {
  const chapterStore = useChapterStore.getState()
  
  // Reset all local state
  options.setCurrentScene('opening')
  options.setCompletedTasks({})
  options.setFailedTasks({})
  options.setQuizAnswers({})
  options.setQuizAttempts(0)
  options.setEarnedXP({ lesson: 0, minigame: 0, quiz: 0 })
  options.setMinigameLevel(0)
  options.setMessageIndex?.(0)
  
  // Clear store
  chapterStore.clearAllQuizData(options.chapterKey)
  chapterStore.setScene(options.chapterKey, 'opening')
  chapterStore.setMinigameLevel(options.chapterKey, 0)
  chapterStore.setMessageIndex(options.chapterKey, 0)
  
  // Reset refs
  if (options.checkedLessonTasksRef) {
    options.checkedLessonTasksRef.current = new Set()
  }
  
  // Reset dialogue
  options.resetDialogue?.()
}

/**
 * Clear quiz progress and return to first quiz
 */
export function retakeQuiz(options: RetakeQuizOptions) {
  const chapterStore = useChapterStore.getState()
  
  // Remove quiz tasks from completed tasks
  options.setCompletedTasks(prev => {
    const updated = { ...prev }
    options.quizTaskIds.forEach(taskId => {
      delete updated[taskId]
    })
    return updated
  })
  
  // Clear quiz data
  chapterStore.clearAllQuizData(options.chapterKey)
  options.setQuizAnswers({})
  options.setQuizAttempts(0)
  
  // Go to first quiz
  options.setCurrentScene('quiz1')
  options.resetDialogue?.()
}

/**
 * Clear lesson progress and return to lesson start
 */
export function retakeLesson(options: RetakeLessonOptions) {
  // Remove lesson tasks from completed tasks
  options.setCompletedTasks(prev => {
    const updated = { ...prev }
    options.lessonTaskIds.forEach(taskId => {
      delete updated[taskId]
    })
    return updated
  })
  
  // Reset lesson tracking
  if (options.checkedLessonTasksRef) {
    options.checkedLessonTasksRef.current = new Set()
  }
  options.setMessageIndex?.(0)
  
  // Go back to lesson scene
  options.setCurrentScene('lesson')
  options.resetDialogue?.()
}

/**
 * Check if chapter has real progress (not just initialization)
 */
export function hasChapterProgress(
  chapterKey: string,
  completedTasks: Record<string, boolean>,
  earnedXP: { lesson: number; minigame: number; quiz: number },
  currentScene: string
): boolean {
  const chapterStore = useChapterStore.getState()
  const savedProgress = chapterStore.getChapterProgress(chapterKey)
  
  return !!(
    savedProgress && (
      currentScene !== 'opening' ||
      Object.keys(completedTasks).length > 0 ||
      earnedXP.lesson > 0 ||
      earnedXP.minigame > 0 ||
      earnedXP.quiz > 0
    )
  )
}

/**
 * Restore lesson dialogue position when continuing
 */
export function shouldRestoreLessonPosition(
  currentScene: string,
  savedMessageIndex: number | undefined
): { shouldRestore: boolean; messageIndex: number } {
  return {
    shouldRestore: currentScene === 'lesson' && (savedMessageIndex || 0) > 0,
    messageIndex: savedMessageIndex || 0,
  }
}

/**
 * Restore minigame level when continuing
 */
export function shouldRestoreMinigame(
  currentScene: string,
  currentMinigameLevel: number
): boolean {
  return currentScene === 'minigame' && currentMinigameLevel > 0
}
