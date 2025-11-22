import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ChapterProgress {
  currentScene: string
  messageIndex: number
  completedTasks: Record<string, boolean>
  failedTasks: Record<string, boolean>
  quizAnswers: Record<string, string>
  quizAttempts: number
  currentMinigameLevel: number
  currentQuizIndex: number
  earnedXP: {
    lesson: number
    minigame: number
    quiz: number
  }
  isMuted: boolean
  autoAdvanceEnabled: boolean
  lastUpdated: number
}

interface ChapterState {
  // Store progress for each chapter (key format: "castle1-chapter1")
  chapters: Record<string, ChapterProgress>
  
  // Actions
  getChapterProgress: (chapterKey: string) => ChapterProgress | null
  setScene: (chapterKey: string, scene: string) => void
  setMessageIndex: (chapterKey: string, index: number) => void
  setTaskComplete: (chapterKey: string, taskId: string) => void
  setTaskFailed: (chapterKey: string, taskId: string) => void
  setQuizAnswer: (chapterKey: string, questionId: string, answer: string) => void
  clearQuizAnswer: (chapterKey: string, questionId: string) => void
  setQuizAttempts: (chapterKey: string, attempts: number) => void
  setMinigameLevel: (chapterKey: string, level: number) => void
  setQuizIndex: (chapterKey: string, index: number) => void
  setEarnedXP: (chapterKey: string, type: 'lesson' | 'minigame' | 'quiz', xp: number) => void
  setAudioSettings: (chapterKey: string, isMuted: boolean, autoAdvanceEnabled: boolean) => void
  clearChapterProgress: (chapterKey: string) => void
  clearAllQuizData: (chapterKey: string) => void
  initializeChapter: (chapterKey: string) => void
  reset: () => void
}

const DEFAULT_CHAPTER_PROGRESS: ChapterProgress = {
  currentScene: 'opening',
  messageIndex: 0,
  completedTasks: {},
  failedTasks: {},
  quizAnswers: {},
  quizAttempts: 0,
  currentMinigameLevel: 0,
  currentQuizIndex: 0,
  earnedXP: {
    lesson: 0,
    minigame: 0,
    quiz: 0,
  },
  isMuted: false,
  autoAdvanceEnabled: false,
  lastUpdated: Date.now(),
}

export const useChapterStore = create<ChapterState>()(
  persist(
    (set, get) => ({
      chapters: {},

      getChapterProgress: (chapterKey: string) => {
        return get().chapters[chapterKey] || null
      },

      setScene: (chapterKey: string, scene: string) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              currentScene: scene,
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setMessageIndex: (chapterKey: string, index: number) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              messageIndex: index,
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setTaskComplete: (chapterKey: string, taskId: string) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              completedTasks: {
                ...(state.chapters[chapterKey]?.completedTasks || {}),
                [taskId]: true,
              },
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setTaskFailed: (chapterKey: string, taskId: string) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              failedTasks: {
                ...(state.chapters[chapterKey]?.failedTasks || {}),
                [taskId]: true,
              },
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setQuizAnswer: (chapterKey: string, questionId: string, answer: string) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              quizAnswers: {
                ...(state.chapters[chapterKey]?.quizAnswers || {}),
                [questionId]: answer,
              },
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      clearQuizAnswer: (chapterKey: string, questionId: string) => {
        set((state) => {
          const chapter = state.chapters[chapterKey]
          if (!chapter) return state

          const { [questionId]: removed, ...remainingAnswers } = chapter.quizAnswers

          return {
            chapters: {
              ...state.chapters,
              [chapterKey]: {
                ...chapter,
                quizAnswers: remainingAnswers,
                lastUpdated: Date.now(),
              },
            },
          }
        })
      },

      setQuizAttempts: (chapterKey: string, attempts: number) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              quizAttempts: attempts,
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setMinigameLevel: (chapterKey: string, level: number) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              currentMinigameLevel: level,
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setQuizIndex: (chapterKey: string, index: number) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              currentQuizIndex: index,
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setEarnedXP: (chapterKey: string, type: 'lesson' | 'minigame' | 'quiz', xp: number) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              earnedXP: {
                ...(state.chapters[chapterKey]?.earnedXP || DEFAULT_CHAPTER_PROGRESS.earnedXP),
                [type]: xp,
              },
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      setAudioSettings: (chapterKey: string, isMuted: boolean, autoAdvanceEnabled: boolean) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterKey]: {
              ...(state.chapters[chapterKey] || DEFAULT_CHAPTER_PROGRESS),
              isMuted,
              autoAdvanceEnabled,
              lastUpdated: Date.now(),
            },
          },
        }))
      },

      clearAllQuizData: (chapterKey: string) => {
        set((state) => {
          const chapter = state.chapters[chapterKey]
          if (!chapter) return state

          return {
            chapters: {
              ...state.chapters,
              [chapterKey]: {
                ...chapter,
                quizAnswers: {},
                quizAttempts: 0,
                failedTasks: {},
                completedTasks: {
                  ...chapter.completedTasks,
                  'task-5': false,
                  'task-6': false,
                  'task-7': false,
                },
                lastUpdated: Date.now(),
              },
            },
          }
        })
      },

      clearChapterProgress: (chapterKey: string) => {
        set((state) => {
          const { [chapterKey]: removed, ...remainingChapters } = state.chapters
          return { chapters: remainingChapters }
        })
      },

      initializeChapter: (chapterKey: string) => {
        set((state) => {
          if (state.chapters[chapterKey]) {
            return state // Already initialized
          }
          return {
            chapters: {
              ...state.chapters,
              [chapterKey]: { ...DEFAULT_CHAPTER_PROGRESS },
            },
          }
        })
      },

      reset: () => {
        set({ chapters: {} })
      },
    }),
    {
      name: 'chapter-progress-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
