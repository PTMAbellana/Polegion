"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Stage, Layer, Circle, Line, Arrow, Text, Rect, RegularPolygon } from 'react-konva'
import { Sparkles, Volume2, VolumeX, Play, Pause, X, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AuthProtection } from '@/context/AuthProtection'
import styles from '@/styles/castle1-chapter3.module.css'
import { getChaptersByCastle, awardLessonXP, completeChapter } from '@/api/chapters'
import { getChapterQuizzesByChapter, submitQuizAttempt } from '@/api/chapterQuizzes'
import { getMinigamesByChapter, submitMinigameAttempt } from '@/api/minigames'
import type { 
  ChapterQuiz, 
  Minigame, 
  MinigamePoint,
  MinigameQuestion 
} from '@/types/common'

const CASTLE_ID = 'cd5ddb70-b4ba-46cb-85fd-d66e5735619f'
const CHAPTER_NUMBER = 3

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward'

export default function Chapter3Page() {
  const router = useRouter()
  const { userProfile } = useAuthStore()
  const { isLoading: authLoading } = AuthProtection()

  const [chapterId, setChapterId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<ChapterQuiz | null>(null)
  const [minigame, setMinigame] = useState<Minigame | null>(null)
  const [loading, setLoading] = useState(true)

  const [currentScene, setCurrentScene] = useState<SceneType>('opening')
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [wizardMessage, setWizardMessage] = useState("")
  const [messageIndex, setMessageIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  
  const [selectedPoints, setSelectedPoints] = useState<string[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [minigameFeedback, setMinigameFeedback] = useState<string>("")
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState<boolean | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<string | null>(null)
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null)
  const [stageSize, setStageSize] = useState({ width: 700, height: 250 })
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const taskListRef = useRef<HTMLDivElement | null>(null)
  const gameAreaRef = useRef<HTMLDivElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  
  const [completedTasks, setCompletedTasks] = useState({
    learnTriangle: false,
    learnSquare: false,
    learnRectangle: false,
    learnCircle: false,
    completeMinigame: false,
    passQuiz1: false,
    passQuiz2: false,
    passQuiz3: false
  })
  
  const [failedTasks, setFailedTasks] = useState({
    passQuiz1: false,
    passQuiz2: false,
    passQuiz3: false
  })
  
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const [quizAttempts, setQuizAttempts] = useState(0)
  const [canRetakeQuiz, setCanRetakeQuiz] = useState(false)
  
  const [earnedXP, setEarnedXP] = useState({
    lesson: 0,
    minigame: 0,
    quiz: 0
  })

  const XP_VALUES = {
    lesson: 40,
    minigame: 60,
    quiz1: 20,
    quiz2: 25,
    quiz3: 30,
    total: 200
  }

  const openingDialogue = [
    "Well done, Apprentice! You've mastered points and lines.",
    "Now we venture deeper into the Spire, where shapes come alive!",
    "This chamber holds the Shape Summoner — an ancient artifact.",
    "Here, you'll learn to identify and classify geometric shapes.",
    "Triangles, squares, rectangles, circles, and more await your discovery!",
    "Are you ready to breathe life into the Shapes of the Spire?"
  ]

  const lessonDialogue = [
    "Let me teach you about the fundamental shapes of geometry...",
    "First, the TRIANGLE — a shape with exactly 3 sides and 3 vertices. The simplest polygon!",
    "Next, the SQUARE — 4 equal sides and 4 perfect right angles. A symbol of balance.",
    "Then the RECTANGLE — 4 sides with opposite sides equal and 4 right angles. Like a stretched square!",
    "And the CIRCLE — no sides, no vertices, perfectly round. Nature's most common shape!",
    "Each shape has unique properties. Understanding them unlocks deeper geometric mysteries."
  ]

  const minigameDialogue = [
    "Now, let's practice! The Shape Summoner will show you various shapes.",
    "Click on the shapes that match the description. Some challenges require multiple selections!",
    "Choose wisely, young geometer!"
  ]

  useEffect(() => {
    const loadChapterData = async () => {
      if (!authLoading && userProfile?.id) {
        try {
          setLoading(true)
          
          console.log('[Chapter3] Loading data for castle:', CASTLE_ID)
          const chaptersRes = await getChaptersByCastle(CASTLE_ID)
          console.log('[Chapter3] Chapters response:', chaptersRes)
          
          const chapter3 = chaptersRes.data?.find((ch: any) => ch.chapter_number === CHAPTER_NUMBER)
          
          if (!chapter3) {
            throw new Error('Chapter 3 not found')
          }
          
          console.log('[Chapter3] Found chapter 3:', chapter3)
          setChapterId(chapter3.id)
          
          const [quizzesRes, minigamesRes] = await Promise.all([
            getChapterQuizzesByChapter(chapter3.id),
            getMinigamesByChapter(chapter3.id)
          ])
          
          console.log('[Chapter3] Quizzes response:', quizzesRes)
          console.log('[Chapter3] Minigames response:', minigamesRes)
          
          if (quizzesRes.data && quizzesRes.data.length > 0) {
            console.log('[Chapter3] Setting quiz:', quizzesRes.data[0])
            setQuiz(quizzesRes.data[0])
          } else {
            console.warn('[Chapter3] No quizzes found!')
          }
          
          if (minigamesRes.data && minigamesRes.data.length > 0) {
            console.log('[Chapter3] Setting minigame:', minigamesRes.data[0])
            setMinigame(minigamesRes.data[0])
          } else {
            console.warn('[Chapter3] No minigames found!')
          }
          
        } catch (error) {
          console.error('[Chapter3] Failed to load chapter data:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadChapterData()
  }, [authLoading, userProfile])

  const playNarration = (filename: string) => {
    // Skip audio playback if muted or no filename
    if (isMuted || !filename) return
    
    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(`/audio/narration/${filename}.mp3`)
      
      audio.onerror = () => {
        // Silently fail - audio files will be added later
        console.log(`[Audio] File not found (optional): ${filename}.mp3`)
      }
      
      audio.play().catch(err => {
        // Silently fail - audio is optional
        console.log(`[Audio] Playback skipped (optional): ${filename}.mp3`)
      })
      
      audioRef.current = audio
    } catch (error) {
      // Silently fail - audio is optional
      console.log('[Audio] Audio playback is optional, continuing without sound')
    }
  }

  useEffect(() => {
    if (isMuted && audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [isMuted])

  useEffect(() => {
    const handleResize = () => {
      if (canvasContainerRef.current) {
        const width = canvasContainerRef.current.offsetWidth
        setStageSize({ width: width, height: 250 })
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!wizardMessage) return
    
    setIsTyping(true)
    setDisplayedText("")
    let currentIndex = 0
    
    let audioToPlay = ""
    if (currentScene === 'opening') audioToPlay = `opening-${messageIndex + 1}`
    else if (currentScene === 'lesson') audioToPlay = `lesson-${messageIndex + 1}`
    else if (currentScene === 'minigame') audioToPlay = `minigame-${messageIndex + 1}`
    else if (currentScene.startsWith('quiz')) {
      if (wizardMessage.includes("Splendid!") || wizardMessage.includes("Correct!")) audioToPlay = 'quiz-correct'
      else if (wizardMessage.includes("Careful") || wizardMessage.includes("Not quite")) audioToPlay = 'quiz-incorrect'
      else audioToPlay = 'quiz-intro'
    } else if (currentScene === 'reward') audioToPlay = 'reward-intro'
    
    if (audioToPlay) playNarration(audioToPlay)

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < wizardMessage.length) {
        setDisplayedText(wizardMessage.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsTyping(false)
        clearInterval(typingIntervalRef.current!)
        if (autoAdvance && (currentScene === 'opening' || currentScene === 'lesson' || currentScene === 'minigame')) {
          autoAdvanceTimeoutRef.current = setTimeout(() => handleNextMessage(), 2500)
        }
      }
    }, 15)

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)
      if (audioRef.current) audioRef.current.pause()
    }
  }, [wizardMessage])

  useEffect(() => {
    if (!isTyping && autoAdvance && (currentScene === 'opening' || currentScene === 'lesson' || currentScene === 'minigame')) {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)
      autoAdvanceTimeoutRef.current = setTimeout(() => handleNextMessage(), 2500)
    }
    return () => {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)
    }
  }, [isTyping, autoAdvance, currentScene])

  useEffect(() => {
    if (currentScene === 'opening') {
      setWizardMessage(openingDialogue[0])
      setMessageIndex(0)
    } else if (currentScene === 'lesson') {
      setWizardMessage(lessonDialogue[0])
      setMessageIndex(0)
    } else if (currentScene === 'minigame') {
      setWizardMessage(minigameDialogue[0])
      setMessageIndex(0)
    }
  }, [currentScene])

  useEffect(() => {
    if (taskListRef.current) {
      const completedCount = Object.values(completedTasks).filter(Boolean).length
      if (completedCount > 0) {
        const taskItems = taskListRef.current.querySelectorAll(`.${styles.taskItem}`)
        if (taskItems[completedCount - 1]) {
          setTimeout(() => {
            taskItems[completedCount - 1].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest'
            })
          }, 300)
        }
      }
    }
  }, [completedTasks])

  useEffect(() => {
    if (gameAreaRef.current && currentScene === 'lesson') {
      setTimeout(() => {
        const conceptCards = gameAreaRef.current?.querySelectorAll(`.${styles.conceptCard}`)
        if (conceptCards && conceptCards.length > 0) {
          const lastCard = conceptCards[conceptCards.length - 1]
          lastCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          })
        }
      }, 400)
    }
  }, [completedTasks.learnTriangle, completedTasks.learnSquare, completedTasks.learnRectangle, completedTasks.learnCircle])

  const handleDialogueClick = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current)
    if (isTyping) {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current)
      setDisplayedText(wizardMessage)
      setIsTyping(false)
    } else {
      handleNextMessage()
    }
  }

  const handleNextMessage = async () => {
    if (currentScene === 'opening') {
      if (messageIndex < openingDialogue.length - 1) {
        setMessageIndex(prev => prev + 1)
        setWizardMessage(openingDialogue[messageIndex + 1])
      } else {
        setCurrentScene('lesson')
        setMessageIndex(0)
        setCompletedTasks(prev => ({ ...prev, learnTriangle: true }))
      }
    } else if (currentScene === 'lesson') {
      if (messageIndex < lessonDialogue.length - 1) {
        setMessageIndex(prev => prev + 1)
        setWizardMessage(lessonDialogue[messageIndex + 1])
        
        if (messageIndex === 1) setCompletedTasks(prev => ({ ...prev, learnSquare: true }))
        if (messageIndex === 2) setCompletedTasks(prev => ({ ...prev, learnRectangle: true }))
        if (messageIndex === 3) setCompletedTasks(prev => ({ ...prev, learnCircle: true }))
      } else {
        if (chapterId) {
          try {
            await awardLessonXP(chapterId, XP_VALUES.lesson)
            setEarnedXP(prev => ({ ...prev, lesson: XP_VALUES.lesson }))
          } catch (error) {
            console.error('Failed to award lesson XP:', error)
          }
        }
        
        setCurrentScene('minigame')
        setMessageIndex(0)
      }
    } else if (currentScene === 'minigame') {
      if (messageIndex < minigameDialogue.length - 1) {
        setMessageIndex(prev => prev + 1)
        setWizardMessage(minigameDialogue[messageIndex + 1])
      }
    }
  }

  const handleShapeClick = (shapeId: string) => {
    // Toggle shape selection
    if (selectedPoints.includes(shapeId)) {
      setSelectedPoints(prev => prev.filter(id => id !== shapeId))
    } else {
      setSelectedPoints(prev => [...prev, shapeId])
    }
  }

  const handleMouseMove = (e: any) => {
    // Not needed for shape clicking in Chapter 3
  }

  const checkAnswer = async (shapes: string[]) => {
    if (!minigame || !minigame.game_config.questions[currentQuestion]) return
    
    const question = minigame.game_config.questions[currentQuestion]
    
    // Check if selected shapes match correct answer (order doesn't matter)
    const correctSet = new Set(question.correctAnswer)
    const selectedSet = new Set(shapes)
    
    const isCorrect = 
      correctSet.size === selectedSet.size &&
      [...correctSet].every(id => selectedSet.has(id))

    if (isCorrect) {
      setIsFeedbackCorrect(true)
      
      let feedbackMessage = "Perfect! "
      // The hint field contains the shape type info
      if (question.hint?.includes('Triangle')) {
        feedbackMessage += "These are triangles with 3 sides and 3 vertices!"
      } else if (question.hint?.includes('Rectangle')) {
        feedbackMessage += "These rectangles have opposite sides equal and 4 right angles!"
      } else if (question.hint?.includes('Circle')) {
        feedbackMessage += "This circle is perfectly round with no corners!"
      } else {
        feedbackMessage += "You identified the correct shapes!"
      }
      
      setMinigameFeedback(feedbackMessage)
      
      setTimeout(async () => {
        if (currentQuestion < minigame.game_config.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setSelectedPoints([])
          setMinigameFeedback("")
          setIsFeedbackCorrect(null)
          setWizardMessage("Great work! Notice the differences. Now try the next one!")
        } else {
          if (minigame.id) {
            try {
              await submitMinigameAttempt(minigame.id, {
                score: 100,
                time_taken: 0,
                attempt_data: { completedQuestions: minigame.game_config.questions.length }
              })
              
              setEarnedXP(prev => ({ ...prev, minigame: XP_VALUES.minigame }))
              setCompletedTasks(prev => ({ ...prev, completeMinigame: true }))
            } catch (error) {
              console.error('Failed to submit minigame:', error)
            }
          }
          
          setWizardMessage("Excellent! You now understand the key differences!")
          setTimeout(() => {
            setCurrentScene('quiz1')
            setWizardMessage("Now let's test your knowledge!")
          }, 3000)
        }
      }, 2500)
    } else {
      setIsFeedbackCorrect(false)
      setMinigameFeedback("Not quite. " + question.hint)
      setTimeout(() => {
        setSelectedPoints([])
        setMinigameFeedback("")
        setIsFeedbackCorrect(null)
      }, 2500)
    }
  }

  const getScaledShapes = () => {
    if (!minigame || !minigame.game_config.questions[currentQuestion]) return []
    
    const question = minigame.game_config.questions[currentQuestion]
    const scaleX = stageSize.width / 700
    const scaleY = stageSize.height / 250
    
    return question.shapes.map((shape: any) => {
      const scaled = { ...shape }
      
      if (shape.type === 'triangle' || shape.type === 'pentagon') {
        // Scale polygon points
        scaled.points = shape.points.map((val: number, idx: number) => 
          idx % 2 === 0 ? val * scaleX : val * scaleY
        )
      } else if (shape.type === 'circle') {
        scaled.cx = shape.cx * scaleX
        scaled.cy = shape.cy * scaleY
        scaled.r = shape.r * scaleX
      } else if (shape.type === 'square') {
        scaled.x = shape.x * scaleX
        scaled.y = shape.y * scaleY
        scaled.size = shape.size * scaleX
      } else if (shape.type === 'rectangle') {
        scaled.x = shape.x * scaleX
        scaled.y = shape.y * scaleY
        scaled.width = shape.width * scaleX
        scaled.height = shape.height * scaleY
      }
      
      return scaled
    })
  }

  const renderConnection = () => {
    // For Chapter 3, we don't need to render connections
    // Users select shapes directly
    return null
  }

  const handleAnswerSelect = async (answer: string, correctAnswer: string, quizNumber: number) => {
    setSelectedAnswer(answer)
    const correct = answer === correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    // Store the answer - create updated answers object immediately
    const updatedAnswers = { ...quizAnswers, [`question${quizNumber}`]: answer }
    setQuizAnswers(updatedAnswers)
    
    if (correct) {
      // Mark as passed
      setCompletedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof completedTasks]: true }))
      setFailedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof failedTasks]: false }))
      
      // Award XP
      const xpKey = `quiz${quizNumber}` as keyof typeof XP_VALUES
      setEarnedXP(prev => ({ ...prev, quiz: prev.quiz + XP_VALUES[xpKey] }))
      setWizardMessage(`Correct! +${XP_VALUES[xpKey]} XP`)
      
      setTimeout(() => {
        setSelectedAnswer(null)
        setShowFeedback(false)
        
        if (quizNumber === 1) {
          setCurrentScene('quiz2')
          setWizardMessage("Next challenge: What geometric shape has exactly two endpoints?")
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3')
          setWizardMessage("Final question: Which shape starts at one point and extends infinitely?")
        } else if (quizNumber === 3) {
          // Submit all quiz answers with the updated answers including question3
          if (quiz?.id) {
            submitQuizAttempt(quiz.id, updatedAnswers).then(() => {
              setQuizAttempts(prev => prev + 1)
              setCanRetakeQuiz(true)
            }).catch(err => console.error('Failed to submit quiz:', err))
          }
          setCanRetakeQuiz(true)
          setCurrentScene('reward')
          setWizardMessage("The first spark of geometry is yours. Carry it, for it will guide you through the paths ahead.")
        }
      }, 2000)
    } else {
      // Mark as failed (red)
      setFailedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof failedTasks]: true }))
      setWizardMessage("⚠️ Not quite right. Think carefully about the definition.")
      
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedAnswer(null)
        
        // Move to next question without awarding XP
        if (quizNumber === 1) {
          setCurrentScene('quiz2')
          setWizardMessage("Next challenge: What geometric shape has exactly two endpoints?")
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3')
          setWizardMessage("Final question: Which shape starts at one point and extends infinitely?")
        } else if (quizNumber === 3) {
          // Submit quiz attempt even if wrong - use updatedAnswers to include question3
          if (quiz?.id) {
            submitQuizAttempt(quiz.id, updatedAnswers).then(() => {
              setQuizAttempts(prev => prev + 1)
              setCanRetakeQuiz(true)
            }).catch(err => console.error('Failed to submit quiz:', err))
          }
          setCanRetakeQuiz(true)
          setCurrentScene('reward')
          setWizardMessage("You've completed the chapter. Review and retake the quiz to improve your score!")
        }
      }, 2500)
    }
  }

  const handleComplete = async () => {
    if (audioRef.current) audioRef.current.pause()
    
    // Mark chapter as completed
    if (chapterId) {
      try {
        await completeChapter(chapterId)
        console.log('[Chapter3] Chapter marked as completed')
      } catch (error) {
        console.error('[Chapter3] Failed to mark chapter as completed:', error)
      }
    }
    
    router.push('/student/worldmap/castle1')
  }

  const handleRetakeQuiz = () => {
    // Reset quiz state
    setQuizAnswers({})
    setSelectedAnswer(null)
    setShowFeedback(false)
    setFailedTasks({
      passQuiz1: false,
      passQuiz2: false,
      passQuiz3: false
    })
    // Reset completed quiz tasks to allow re-attempting
    setCompletedTasks(prev => ({
      ...prev,
      passQuiz1: false,
      passQuiz2: false,
      passQuiz3: false
    }))
    // Reset quiz XP to 0 for retake
    setEarnedXP(prev => ({ ...prev, quiz: 0 }))
    setCurrentScene('quiz1')
    setWizardMessage("Let's try the quiz again! Which shape extends forever in both directions?")
  }

  const handleExit = () => {
    if (audioRef.current) audioRef.current.pause()
    router.push('/student/worldmap/castle1')
  }

  const toggleAutoAdvance = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAutoAdvance(!autoAdvance)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  if (loading || !quiz || !minigame) {
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
          <p>Loading chapter...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.chapterContainer}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.topBar}>
        <div className={styles.chapterInfo}>
          <Sparkles className={styles.titleIcon} />
          <div>
            <h1 className={styles.chapterTitle}>Chapter 3: Shapes of the Spire</h1>
            <p className={styles.chapterSubtitle}>The Euclidean Spire • Castle I</p>
          </div>
        </div>
        
        <div className={styles.topBarActions}>
          <button
            className={`${styles.controlButton} ${isMuted ? styles.controlButtonActive : ''}`}
            onClick={toggleMute}
            title={isMuted ? "Audio: OFF" : "Audio: ON"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            className={`${styles.controlButton} ${autoAdvance ? styles.controlButtonActive : ''}`}
            onClick={toggleAutoAdvance}
            title={autoAdvance ? "Auto: ON" : "Auto: OFF"}
          >
            {autoAdvance ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className={styles.exitButton} onClick={handleExit}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.taskPanel}>
          <div className={styles.taskPanelHeader}>
            <span className={styles.taskPanelTitle}>Learning Objectives</span>
            <div className={styles.progressText}>
              {Object.values(completedTasks).filter(Boolean).length} / 8 Complete
            </div>
          </div>
          <div className={styles.taskList} ref={taskListRef}>
            {[
              { key: 'learnTriangle', label: 'Learn: Triangle' },
              { key: 'learnSquare', label: 'Learn: Square' },
              { key: 'learnRectangle', label: 'Learn: Rectangle' },
              { key: 'learnCircle', label: 'Learn: Circle' },
              { key: 'completeMinigame', label: 'Complete Practice' },
              { key: 'passQuiz1', label: 'Pass Quiz 1' },
              { key: 'passQuiz2', label: 'Pass Quiz 2' },
              { key: 'passQuiz3', label: 'Pass Quiz 3' }
            ].map(task => (
              <div key={task.key} className={`${styles.taskItem} ${
                completedTasks[task.key as keyof typeof completedTasks] ? styles.taskCompleted : ''
              } ${
                failedTasks[task.key as keyof typeof failedTasks] ? styles.taskFailed : ''
              }`}>
                <div className={styles.taskCheckbox}>
                  {completedTasks[task.key as keyof typeof completedTasks] && <span>✓</span>}
                  {failedTasks[task.key as keyof typeof failedTasks] && <span>✗</span>}
                </div>
                <span className={styles.taskLabel}>{task.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.gameArea} ref={gameAreaRef}>
          {currentScene === 'opening' && (
            <div className={styles.sceneContent}>
              <div className={styles.observatoryView}>
                <div className={styles.doorPreview}>
                  <h2 className={styles.doorTitle}>The Three Paths of Geometry</h2>
                  <div className={styles.doorGrid}>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle1-door1.png" 
                          alt="Chapter 1" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter I: Foundations</span>
                    </div>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle1-door2.png" 
                          alt="Chapter 2" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter II: Angles</span>
                    </div>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle1-door3.png" 
                          alt="Chapter 3" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter III: Constructions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentScene === 'lesson' && (
            <div className={styles.lessonContent}>
              <div className={styles.conceptGrid}>
                <div className={`${styles.conceptCard} ${completedTasks.learnTriangle ? styles.revealed : styles.hidden}`}>
                  <h3>Triangle</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="80" viewBox="0 0 200 80">
                      <polygon points="100,15 40,65 160,65" fill="none" stroke="#FFD700" strokeWidth="3" />
                      <text x="100" y="75" textAnchor="middle" fill="#FFD700" fontSize="12">3 sides, 3 vertices</text>
                    </svg>
                  </div>
                  <p>A polygon with exactly 3 sides and 3 vertices.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnSquare ? styles.revealed : styles.hidden}`}>
                  <h3>Square</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="80" viewBox="0 0 200 80">
                      <rect x="60" y="15" width="80" height="80" fill="none" stroke="#66BBFF" strokeWidth="3" />
                      <text x="100" y="75" textAnchor="middle" fill="#66BBFF" fontSize="12">4 equal sides, 4 right angles</text>
                    </svg>
                  </div>
                  <p>4 equal sides and 4 perfect right angles.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnRectangle ? styles.revealed : styles.hidden}`}>
                  <h3>Rectangle</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="80" viewBox="0 0 200 80">
                      <rect x="40" y="20" width="120" height="60" fill="none" stroke="#FF6B6B" strokeWidth="3" />
                      <text x="100" y="75" textAnchor="middle" fill="#FF6B6B" fontSize="12">Opposite sides equal</text>
                    </svg>
                  </div>
                  <p>4 sides with opposite sides equal and 4 right angles.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnCircle ? styles.revealed : styles.hidden}`}>
                  <h3>Circle</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="80" viewBox="0 0 200 80">
                      <circle cx="100" cy="40" r="35" fill="none" stroke="#4ECDC4" strokeWidth="3" />
                      <text x="100" y="75" textAnchor="middle" fill="#4ECDC4" fontSize="12">No sides, no vertices</text>
                    </svg>
                  </div>
                  <p>Perfectly round with no corners or straight edges.</p>
                </div>
              </div>
            </div>
          )}

          {currentScene === 'minigame' && minigame && (
            <div className={styles.minigameContent}>
              <div className={styles.minigameCard}>
                <h3>{minigame.game_config.questions[currentQuestion]?.instruction}</h3>
                <p className={styles.minigameHint}>
                  {minigame.game_config.questions[currentQuestion]?.hint}
                </p>
                
                <div className={styles.canvasContainer} ref={canvasContainerRef}>
                  <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                  >
                    <Layer>
                      {getScaledShapes().map((shape: any) => {
                        const isSelected = selectedPoints.includes(shape.id)
                        const shapeColor = isSelected ? "#FFD700" : shape.color
                        
                        return (
                          <React.Fragment key={shape.id}>
                            {shape.type === 'triangle' && (
                              <Line
                                points={shape.points}
                                stroke={shapeColor}
                                strokeWidth={isSelected ? 5 : 3}
                                closed
                                onClick={() => handleShapeClick(shape.id)}
                                onTap={() => handleShapeClick(shape.id)}
                                shadowColor={isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(102, 187, 255, 0.5)"}
                                shadowBlur={isSelected ? 15 : 8}
                                listening={true}
                              />
                            )}
                            {shape.type === 'square' && (
                              <Rect
                                x={shape.x}
                                y={shape.y}
                                width={shape.size}
                                height={shape.size}
                                stroke={shapeColor}
                                strokeWidth={isSelected ? 5 : 3}
                                onClick={() => handleShapeClick(shape.id)}
                                onTap={() => handleShapeClick(shape.id)}
                                shadowColor={isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(102, 187, 255, 0.5)"}
                                shadowBlur={isSelected ? 15 : 8}
                                listening={true}
                              />
                            )}
                            {shape.type === 'rectangle' && (
                              <Rect
                                x={shape.x}
                                y={shape.y}
                                width={shape.width}
                                height={shape.height}
                                stroke={shapeColor}
                                strokeWidth={isSelected ? 5 : 3}
                                onClick={() => handleShapeClick(shape.id)}
                                onTap={() => handleShapeClick(shape.id)}
                                shadowColor={isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(102, 187, 255, 0.5)"}
                                shadowBlur={isSelected ? 15 : 8}
                                listening={true}
                              />
                            )}
                            {shape.type === 'circle' && (
                              <Circle
                                x={shape.cx}
                                y={shape.cy}
                                radius={shape.r}
                                stroke={shapeColor}
                                strokeWidth={isSelected ? 5 : 3}
                                onClick={() => handleShapeClick(shape.id)}
                                onTap={() => handleShapeClick(shape.id)}
                                shadowColor={isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(102, 187, 255, 0.5)"}
                                shadowBlur={isSelected ? 15 : 8}
                                listening={true}
                              />
                            )}
                            {shape.type === 'pentagon' && (
                              <Line
                                points={shape.points}
                                stroke={shapeColor}
                                strokeWidth={isSelected ? 5 : 3}
                                closed
                                onClick={() => handleShapeClick(shape.id)}
                                onTap={() => handleShapeClick(shape.id)}
                                shadowColor={isSelected ? "rgba(255, 215, 0, 0.8)" : "rgba(102, 187, 255, 0.5)"}
                                shadowBlur={isSelected ? 15 : 8}
                                listening={true}
                              />
                            )}
                            <Text
                              x={shape.type === 'circle' ? shape.cx : (shape.x || shape.points[0])}
                              y={shape.type === 'circle' ? shape.cy + shape.r + 10 : (shape.y || shape.points[1]) - 15}
                              text={shape.label}
                              fontSize={16}
                              fontStyle="bold"
                              fill={isSelected ? "#FFD700" : "#E8F4FD"}
                              align="center"
                              shadowColor="rgba(0, 0, 0, 0.8)"
                              shadowBlur={4}
                              listening={false}
                            />
                          </React.Fragment>
                        )
                      })}
                    </Layer>
                  </Stage>
                </div>
                
                <button 
                  className={styles.submitButton} 
                  onClick={() => checkAnswer(selectedPoints)}
                  disabled={selectedPoints.length === 0}
                >
                  Submit Answer
                </button>
                
                {minigameFeedback && (
                  <div className={`${styles.feedback} ${isFeedbackCorrect ? styles.correct : styles.incorrect}`}>
                    {minigameFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentScene === 'quiz1' && quiz && quiz.quiz_config.questions[0] && (
            <div className={styles.quizContent}>
              <div className={styles.quizCard}>
                <h3 className={styles.quizQuestion}>{quiz.quiz_config.questions[0].question}</h3>
                <div className={styles.quizOptions}>
                  {quiz.quiz_config.questions[0].options.map((option) => (
                    <button
                      key={option}
                      className={`${styles.quizOption} ${
                        selectedAnswer === option
                          ? isCorrect
                            ? styles.correct
                            : styles.incorrect
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(option, quiz.quiz_config.questions[0].correctAnswer, 1)}
                      disabled={showFeedback}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScene === 'quiz2' && quiz && quiz.quiz_config.questions[1] && (
            <div className={styles.quizContent}>
              <div className={styles.quizCard}>
                <h3 className={styles.quizQuestion}>{quiz.quiz_config.questions[1].question}</h3>
                <div className={styles.quizOptions}>
                  {quiz.quiz_config.questions[1].options.map((option) => (
                    <button
                      key={option}
                      className={`${styles.quizOption} ${
                        selectedAnswer === option
                          ? isCorrect
                            ? styles.correct
                            : styles.incorrect
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(option, quiz.quiz_config.questions[1].correctAnswer, 2)}
                      disabled={showFeedback}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScene === 'quiz3' && quiz && quiz.quiz_config.questions[2] && (
            <div className={styles.quizContent}>
              <div className={styles.quizCard}>
                <h3 className={styles.quizQuestion}>{quiz.quiz_config.questions[2].question}</h3>
                <div className={styles.quizOptions}>
                  {quiz.quiz_config.questions[2].options.map((option) => (
                    <button
                      key={option}
                      className={`${styles.quizOption} ${
                        selectedAnswer === option
                          ? isCorrect
                            ? styles.correct
                            : styles.incorrect
                          : ''
                      }`}
                      onClick={() => handleAnswerSelect(option, quiz.quiz_config.questions[2].correctAnswer, 3)}
                      disabled={showFeedback}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScene === 'reward' && (
            <div className={styles.rewardContent}>
              <h2 className={styles.rewardTitle}>Chapter Complete!</h2>
              <div className={styles.rewardCard}>
                <div className={styles.relicDisplay}>
                  <img 
                    src="/images/shape-summoner.png" 
                    alt="Shape Summoner" 
                    className={styles.relicIcon}
                  />
                </div>
                <h3 className={styles.rewardName}>The Shape Summoner</h3>
                <p className={styles.rewardDescription}>
                  You have mastered the fundamental shapes! Geometry's building blocks bend to your will.
                </p>
              </div>
              <div className={styles.rewardStats}>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Lesson XP</span>
                  <span className={styles.statValue}>{earnedXP.lesson}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Minigame XP</span>
                  <span className={styles.statValue}>{earnedXP.minigame}</span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statLabel}>Quiz XP</span>
                  <span className={styles.statValue}>{earnedXP.quiz}</span>
                </div>
              </div>
              <div className={styles.rewardActions}>
                {canRetakeQuiz && (
                  <button className={styles.retakeButton} onClick={handleRetakeQuiz}>
                    Retake Quiz
                  </button>
                )}
                <button className={styles.returnButton} onClick={handleComplete}>
                  Return to Castle
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {currentScene !== 'reward' && (
        <div className={styles.dialogueWrapper}>
          <div className={styles.dialogueContainer} onClick={handleDialogueClick}>
            <div className={styles.characterSection}>
              <div className={styles.portraitFrame}>
                <img src="/images/archim-wizard.png" alt="Archim" className={styles.wizardPortrait} />
              </div>
            </div>
            <div className={styles.messageSection}>
              <div className={styles.dialogueTextWrapper}>
                <div className={styles.dialogueSpeaker}>Archim</div>
                <div className={styles.dialogueText}>
                  {displayedText}
                </div>
              </div>
              {!isTyping && currentScene !== 'minigame' && (
                <div className={styles.continuePrompt}>
                  Click to continue →
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
