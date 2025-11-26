import { useState, useEffect, useRef, useCallback } from 'react'
import { useChapterStore } from '@/store/chapterStore'

interface LessonDialogue {
  key: string
  text: string
  taskId?: string
}

interface UseChapterProgressOptions {
  chapterKey: string
  lessonDialogue: LessonDialogue[]
  onSceneChange?: (scene: string) => void
}

interface UseChapterProgressReturn {
  // State
  currentScene: string
  completedTasks: Record<string, boolean>
  failedTasks: Record<string, boolean>
  earnedXP: { lesson: number; minigame: number; quiz: number }
  currentMinigameLevel: number
  quizAnswers: Record<string, string>
  quizAttempts: number
  
  // Lesson tracking
  checkedLessonTasks: Set<string>
  currentMessageIndex: number
  
  // Actions
  setCurrentScene: (scene: string) => void
  markTaskComplete: (taskId: string) => void
  markTaskFailed: (taskId: string) => void
  awardXP: (type: 'lesson' | 'minigame' | 'quiz', amount: number) => void
  setMinigameLevel: (level: number) => void
  setQuizAnswer: (questionId: string, answer: string) => void
  incrementQuizAttempts: () => void
  
  // Lesson dialogue tracking
  onLessonDialogueAdvance: (newIndex: number) => void
  
  // Operations
  handleContinue: () => { shouldRestoreLesson: boolean; savedMessageIndex: number }
  handleRestart: () => void
  handleRetakeQuiz: (quizTaskIds: string[]) => void
  handleRetakeLesson: (lessonTaskIds: string[]) => void
  
  // State check
  hasProgress: () => boolean
}

export function useChapterProgress({
  chapterKey,
  lessonDialogue,
  onSceneChange,
}: UseChapterProgressOptions): UseChapterProgressReturn {
  const chapterStore = useChapterStore()
  const savedProgress = chapterStore.getChapterProgress(chapterKey)
  
  // Initialize from saved progress or defaults
  const [currentScene, setCurrentSceneState] = useState<string>(
    savedProgress?.currentScene || 'opening'
  )
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>(
    savedProgress?.completedTasks || {}
  )
  const [failedTasks, setFailedTasks] = useState<Record<string, boolean>>(
    savedProgress?.failedTasks || {}
  )
  const [earnedXP, setEarnedXP] = useState({
    lesson: savedProgress?.earnedXP?.lesson || 0,
    minigame: savedProgress?.earnedXP?.minigame || 0,
    quiz: savedProgress?.earnedXP?.quiz || 0,
  })
  const [currentMinigameLevel, setCurrentMinigameLevelState] = useState(
    savedProgress?.currentMinigameLevel || 0
  )
  const [quizAnswers, setQuizAnswersState] = useState<Record<string, string>>(
    savedProgress?.quizAnswers || {}
  )
  const [quizAttempts, setQuizAttemptsState] = useState(
    savedProgress?.quizAttempts || 0
  )
  const [currentMessageIndex, setCurrentMessageIndex] = useState(
    savedProgress?.messageIndex || 0
  )
  
  // Initialize checkedLessonTasks from saved completed tasks
  const initializeCheckedTasks = (): Set<string> => {
    const saved = savedProgress?.completedTasks || {}
    const keys = new Set<string>()
    
    Object.keys(saved).forEach(taskId => {
      if (saved[taskId]) {
        const dialogue = lessonDialogue.find(d => d.taskId === taskId)
        if (dialogue) {
          keys.add(dialogue.key)
        }
      }
    })
    
    return keys
  }
  
  const checkedLessonTasksRef = useRef<Set<string>>(initializeCheckedTasks())
  
  // Initialize chapter in store if needed
  useEffect(() => {
    chapterStore.initializeChapter(chapterKey)
  }, [])
  
  // Sync all state to store
  useEffect(() => {
    chapterStore.setScene(chapterKey, currentScene)
    onSceneChange?.(currentScene)
  }, [currentScene])
  
  useEffect(() => {
    chapterStore.setMessageIndex(chapterKey, currentMessageIndex)
  }, [currentMessageIndex])
  
  useEffect(() => {
    Object.entries(completedTasks).forEach(([taskId, isComplete]) => {
      if (isComplete && !savedProgress?.completedTasks?.[taskId]) {
        chapterStore.setTaskComplete(chapterKey, taskId)
      }
    })
  }, [completedTasks])
  
  useEffect(() => {
    Object.entries(failedTasks).forEach(([taskId, isFailed]) => {
      if (isFailed && !savedProgress?.failedTasks?.[taskId]) {
        chapterStore.setTaskFailed(chapterKey, taskId)
      }
    })
  }, [failedTasks])
  
  useEffect(() => {
    chapterStore.setMinigameLevel(chapterKey, currentMinigameLevel)
  }, [currentMinigameLevel])
  
  useEffect(() => {
    Object.entries(quizAnswers).forEach(([questionId, answer]) => {
      if (savedProgress?.quizAnswers?.[questionId] !== answer) {
        chapterStore.setQuizAnswer(chapterKey, questionId, answer)
      }
    })
  }, [quizAnswers])
  
  useEffect(() => {
    if (quizAttempts !== savedProgress?.quizAttempts) {
      chapterStore.setQuizAttempts(chapterKey, quizAttempts)
    }
  }, [quizAttempts])
  
  useEffect(() => {
    if (earnedXP.lesson > 0 && earnedXP.lesson !== savedProgress?.earnedXP?.lesson) {
      chapterStore.setEarnedXP(chapterKey, 'lesson', earnedXP.lesson)
    }
  }, [earnedXP.lesson])
  
  useEffect(() => {
    if (earnedXP.minigame > 0 && earnedXP.minigame !== savedProgress?.earnedXP?.minigame) {
      chapterStore.setEarnedXP(chapterKey, 'minigame', earnedXP.minigame)
    }
  }, [earnedXP.minigame])
  
  useEffect(() => {
    if (earnedXP.quiz > 0 && earnedXP.quiz !== savedProgress?.earnedXP?.quiz) {
      chapterStore.setEarnedXP(chapterKey, 'quiz', earnedXP.quiz)
    }
  }, [earnedXP.quiz])
  
  // Actions
  const setCurrentScene = useCallback((scene: string) => {
    setCurrentSceneState(scene)
  }, [])
  
  const markTaskComplete = useCallback((taskId: string) => {
    setCompletedTasks(prev => {
      if (prev[taskId]) return prev
      return { ...prev, [taskId]: true }
    })
  }, [])
  
  const markTaskFailed = useCallback((taskId: string) => {
    setFailedTasks(prev => ({ ...prev, [taskId]: true }))
  }, [])
  
  const awardXP = useCallback((type: 'lesson' | 'minigame' | 'quiz', amount: number) => {
    setEarnedXP(prev => ({ ...prev, [type]: amount }))
  }, [])
  
  const setMinigameLevel = useCallback((level: number) => {
    setCurrentMinigameLevelState(level)
  }, [])
  
  const setQuizAnswer = useCallback((questionId: string, answer: string) => {
    setQuizAnswersState(prev => ({ ...prev, [questionId]: answer }))
  }, [])
  
  const incrementQuizAttempts = useCallback(() => {
    setQuizAttemptsState(prev => prev + 1)
  }, [])
  
  const onLessonDialogueAdvance = useCallback((newIndex: number) => {
    setCurrentMessageIndex(newIndex)
    
    // Check if this dialogue has a task
    if (newIndex >= 0 && newIndex < lessonDialogue.length) {
      const dialogue = lessonDialogue[newIndex]
      
      // Skip if already checked
      if (checkedLessonTasksRef.current.has(dialogue.key)) {
        return
      }
      
      // Mark task complete if it has one
      if (dialogue.taskId) {
        markTaskComplete(dialogue.taskId)
        checkedLessonTasksRef.current.add(dialogue.key)
      }
    }
  }, [lessonDialogue, markTaskComplete])
  
  const hasProgress = useCallback(() => {
    return (
      currentScene !== 'opening' ||
      Object.keys(completedTasks).length > 0 ||
      earnedXP.lesson > 0 ||
      earnedXP.minigame > 0 ||
      earnedXP.quiz > 0
    )
  }, [currentScene, completedTasks, earnedXP])
  
  const handleContinue = useCallback(() => {
    return {
      shouldRestoreLesson: currentScene === 'lesson' && currentMessageIndex > 0,
      savedMessageIndex: currentMessageIndex,
    }
  }, [currentScene, currentMessageIndex])
  
  const handleRestart = useCallback(() => {
    // Reset all local state
    setCurrentSceneState('opening')
    setCompletedTasks({})
    setFailedTasks({})
    setQuizAnswersState({})
    setQuizAttemptsState(0)
    setEarnedXP({ lesson: 0, minigame: 0, quiz: 0 })
    setCurrentMinigameLevelState(0)
    setCurrentMessageIndex(0)
    
    // Clear store
    chapterStore.clearAllQuizData(chapterKey)
    chapterStore.setScene(chapterKey, 'opening')
    chapterStore.setMinigameLevel(chapterKey, 0)
    chapterStore.setMessageIndex(chapterKey, 0)
    
    // Reset refs
    checkedLessonTasksRef.current = new Set()
  }, [chapterKey, chapterStore])
  
  const handleRetakeQuiz = useCallback((quizTaskIds: string[]) => {
    // Remove quiz tasks from completed tasks
    setCompletedTasks(prev => {
      const updated = { ...prev }
      quizTaskIds.forEach(taskId => {
        delete updated[taskId]
      })
      return updated
    })
    
    // Clear quiz data from store
    chapterStore.clearAllQuizData(chapterKey)
    
    // Reset quiz attempts
    setQuizAttemptsState(0)
  }, [chapterKey, chapterStore])
  
  const handleRetakeLesson = useCallback((lessonTaskIds: string[]) => {
    // Remove lesson tasks from completed tasks
    setCompletedTasks(prev => {
      const updated = { ...prev }
      lessonTaskIds.forEach(taskId => {
        delete updated[taskId]
      })
      return updated
    })
    
    // Reset lesson tracking
    checkedLessonTasksRef.current = new Set()
    setCurrentMessageIndex(0)
    
    // Go back to lesson scene
    setCurrentSceneState('lesson')
  }, [])
  
  return {
    // State
    currentScene,
    completedTasks,
    failedTasks,
    earnedXP,
    currentMinigameLevel,
    quizAnswers,
    quizAttempts,
    checkedLessonTasks: checkedLessonTasksRef.current,
    currentMessageIndex,
    
    // Actions
    setCurrentScene,
    markTaskComplete,
    markTaskFailed,
    awardXP,
    setMinigameLevel,
    setQuizAnswer,
    incrementQuizAttempts,
    onLessonDialogueAdvance,
    
    // Operations
    handleContinue,
    handleRestart,
    handleRetakeQuiz,
    handleRetakeLesson,
    hasProgress,
  }
}
