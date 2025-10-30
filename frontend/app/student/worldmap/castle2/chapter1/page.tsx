﻿"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Volume2, VolumeX, Play, Pause, X, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AuthProtection } from '@/context/AuthProtection'
import styles from '@/styles/castle2-chapter1.module.css'
import { getChaptersByCastle, awardLessonXP, completeChapter } from '@/api/chapters'
import { getChapterQuizzesByChapter, submitQuizAttempt } from '@/api/chapterQuizzes'
import { getMinigamesByChapter, submitMinigameAttempt } from '@/api/minigames'
import type { ChapterQuiz, Minigame } from '@/types/common'

const CASTLE_ID = 'bdfc1a9f-cd2a-4c1a-9062-9f99ec41e008' // Castle 2 (Polygon Citadel)
const CHAPTER_NUMBER = 1

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward'
type ShapeType = 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'heptagon' | 'octagon'

export default function Chapter1Page() {
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
  
  const [currentShapeRound, setCurrentShapeRound] = useState(0)
  const [clickedShape, setClickedShape] = useState<ShapeType | null>(null)
  const [shapeFeedback, setShapeFeedback] = useState<string>("")
  const [isShapeFeedbackCorrect, setIsShapeFeedbackCorrect] = useState<boolean | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const taskListRef = useRef<HTMLDivElement | null>(null)
  const gameAreaRef = useRef<HTMLDivElement | null>(null)
  
  const [completedTasks, setCompletedTasks] = useState({
    learnTriangle: false,
    learnQuadrilateral: false,
    learnPentagon: false,
    learnHexagon: false,
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
    lesson: 30,
    minigame: 40,
    quiz1: 20,
    quiz2: 20,
    quiz3: 40,
    total: 150
  }

  const openingDialogue = [
    "Welcome, young traveler! I am Sylvan, Guardian of the Shapewood Forest.",
    "Within these enchanted woods, nature's patterns reveal themselves as geometric forms.",
    "These are Polygons — shapes bounded by straight sides, each with its own unique beauty.",
    "Come, let us explore the magical world of shapes together!"
  ]

  const lessonDialogue = [
    "Every polygon has a special number of sides that defines it.",
    "A Triangle has 3 sides and 3 corners — the simplest polygon of all.",
    "A Quadrilateral has 4 sides — like a square, rectangle, or diamond shape.",
    "A Pentagon has 5 sides — like the pattern of a forest starflower.",
    "A Hexagon has 6 sides — seen in honeycomb patterns throughout nature.",
    "Now, let us test your ability to recognize these shapes in the wild!"
  ]

  const minigameDialogue = [
    "Excellent! Now identify each shape by clicking on it.",
    "Click on the correct polygon when I call its name.",
    "Choose wisely, young shape-seeker!"
  ]

  const shapeRounds: { shape: ShapeType; name: string; sides: number }[] = [
    { shape: 'triangle', name: 'Triangle', sides: 3 },
    { shape: 'square', name: 'Square (Quadrilateral)', sides: 4 },
    { shape: 'pentagon', name: 'Pentagon', sides: 5 },
    { shape: 'hexagon', name: 'Hexagon', sides: 6 },
    { shape: 'heptagon', name: 'Heptagon', sides: 7 },
    { shape: 'octagon', name: 'Octagon', sides: 8 }
  ]

  useEffect(() => {
    const loadChapterData = async () => {
      if (!authLoading && userProfile?.id) {
        try {
          setLoading(true)
          
          console.log('[Castle2-Chapter1] Loading data for castle:', CASTLE_ID)
          const chaptersRes = await getChaptersByCastle(CASTLE_ID)
          console.log('[Castle2-Chapter1] Chapters response:', chaptersRes)
          console.log('[Castle2-Chapter1] All chapters:', chaptersRes.data)
          
          const chapter1 = chaptersRes.data?.find((ch: any) => ch.chapter_number === CHAPTER_NUMBER)
          
          console.log('[Castle2-Chapter1] Looking for chapter number:', CHAPTER_NUMBER)
          console.log('[Castle2-Chapter1] Found chapter1:', chapter1)
          
          if (!chapter1) {
            console.error('[Castle2-Chapter1] Available chapters:', chaptersRes.data?.map((ch: any) => ({ 
              id: ch.id, 
              number: ch.chapter_number, 
              title: ch.title 
            })))
            throw new Error('Chapter 1 not found - check if chapters were seeded properly')
          }
          
          console.log('[Castle2-Chapter1] Found chapter 1:', chapter1)
          setChapterId(chapter1.id)
          
          const [quizzesRes, minigamesRes] = await Promise.all([
            getChapterQuizzesByChapter(chapter1.id),
            getMinigamesByChapter(chapter1.id)
          ])
          
          console.log('[Castle2-Chapter1] Quizzes response:', quizzesRes)
          console.log('[Castle2-Chapter1] Quizzes data:', quizzesRes.data)
          console.log('[Castle2-Chapter1] Minigames response:', minigamesRes)
          console.log('[Castle2-Chapter1] Minigames data:', minigamesRes.data)
          
          if (quizzesRes.data && quizzesRes.data.length > 0) {
            console.log('[Castle2-Chapter1] Setting quiz:', quizzesRes.data[0])
            setQuiz(quizzesRes.data[0])
          } else {
            console.warn('[Castle2-Chapter1] No quizzes found! Response:', quizzesRes)
          }
          
          if (minigamesRes.data && minigamesRes.data.length > 0) {
            console.log('[Castle2-Chapter1] Setting minigame:', minigamesRes.data[0])
            setMinigame(minigamesRes.data[0])
          } else {
            console.warn('[Castle2-Chapter1] No minigames found! Response:', minigamesRes)
          }
          
        } catch (error) {
          console.error('[Castle2-Chapter1] Failed to load chapter data:', error)
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
      
      const audio = new Audio(`/audio/narration/castle2/${filename}.mp3`)
      
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
  }, [completedTasks.learnTriangle, completedTasks.learnQuadrilateral, completedTasks.learnPentagon, completedTasks.learnHexagon])

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
        
        if (messageIndex === 1) setCompletedTasks(prev => ({ ...prev, learnQuadrilateral: true }))
        if (messageIndex === 2) setCompletedTasks(prev => ({ ...prev, learnPentagon: true }))
        if (messageIndex === 3) setCompletedTasks(prev => ({ ...prev, learnHexagon: true }))
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

  const handleShapeClick = async (shape: ShapeType) => {
    if (!minigame) return
    
    const currentRound = shapeRounds[currentShapeRound]
    setClickedShape(shape)
    
    const isCorrect = shape === currentRound.shape
    
    if (isCorrect) {
      setIsShapeFeedbackCorrect(true)
      setShapeFeedback(`Perfect! This is a ${currentRound.name} with ${currentRound.sides} sides!`)
      
      setTimeout(async () => {
        if (currentShapeRound < shapeRounds.length - 1) {
          setCurrentShapeRound(prev => prev + 1)
          setClickedShape(null)
          setShapeFeedback("")
          setIsShapeFeedbackCorrect(null)
          setWizardMessage(`Great! Now find the ${shapeRounds[currentShapeRound + 1].name}!`)
        } else {
          if (minigame.id) {
            try {
              await submitMinigameAttempt(minigame.id, {
                score: 100,
                time_taken: 0,
                attempt_data: { completedShapes: shapeRounds.length }
              })
              
              setEarnedXP(prev => ({ ...prev, minigame: XP_VALUES.minigame }))
              setCompletedTasks(prev => ({ ...prev, completeMinigame: true }))
            } catch (error) {
              console.error('Failed to submit minigame:', error)
            }
          }
          
          setWizardMessage("Excellent! You can identify all the polygon shapes!")
          setTimeout(() => {
            setCurrentScene('quiz1')
            setWizardMessage("Now let's test your polygon knowledge!")
          }, 3000)
        }
      }, 2500)
    } else {
      setIsShapeFeedbackCorrect(false)
      setShapeFeedback(`Not quite! Look for a shape with ${currentRound.sides} sides.`)
      setTimeout(() => {
        setClickedShape(null)
        setShapeFeedback("")
        setIsShapeFeedbackCorrect(null)
      }, 2500)
    }
  }

  const renderPolygon = (shape: ShapeType, centerX: number, centerY: number, size: number) => {
    const sidesMap: Record<ShapeType, number> = {
      triangle: 3,
      square: 4,
      pentagon: 5,
      hexagon: 6,
      heptagon: 7,
      octagon: 8
    }
    
    const sides = sidesMap[shape]
    const points: string[] = []
    
    for (let i = 0; i < sides; i++) {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2
      const x = centerX + size * Math.cos(angle)
      const y = centerY + size * Math.sin(angle)
      points.push(`${x},${y}`)
    }
    
    return points.join(' ')
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
          setWizardMessage("Next question: How many sides does a hexagon have?")
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3')
          setWizardMessage("Final question: Which polygon has the most sides?")
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
          setWizardMessage("The wisdom of shapes is yours. You have earned the Gem of Sides!")
        }
      }, 2000)
    } else {
      // Mark as failed (red)
      setFailedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof failedTasks]: true }))
      setWizardMessage("⚠️ Not quite right. Remember what you learned about polygon sides.")
      
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedAnswer(null)
        
        // Move to next question without awarding XP
        if (quizNumber === 1) {
          setCurrentScene('quiz2')
          setWizardMessage("Next question: How many sides does a hexagon have?")
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3')
          setWizardMessage("Final question: Which polygon has the most sides?")
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
        console.log('[Castle2-Chapter1] Chapter marked as completed')
      } catch (error) {
        console.error('[Castle2-Chapter1] Failed to mark chapter as completed:', error)
      }
    }
    
    router.push('/student/worldmap/castle2')
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
    setWizardMessage("Let's try the quiz again! How many sides does a triangle have?")
  }

  const handleExit = () => {
    if (audioRef.current) audioRef.current.pause()
    router.push('/student/worldmap/castle2')
  }

  const toggleAutoAdvance = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAutoAdvance(!autoAdvance)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  if (loading) {
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '1.5rem' }}>Loading chapter...</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Castle ID: {CASTLE_ID}</p>
        </div>
      </div>
    )
  }

  if (!quiz || !minigame) {
    console.warn('[Castle2-Chapter1] Missing data - Quiz:', quiz, 'Minigame:', minigame)
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '1.5rem' }}>⚠️ Chapter data not found</p>
          <p style={{ fontSize: '0.9rem' }}>Quiz loaded: {quiz ? '✓' : '✗'}</p>
          <p style={{ fontSize: '0.9rem' }}>Minigame loaded: {minigame ? '✓' : '✗'}</p>
          <button 
            onClick={() => router.push('/student/worldmap/castle2')}
            style={{ 
              padding: '0.75rem 1.5rem', 
              fontSize: '1rem', 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Return to Castle 2
          </button>
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
            <h1 className={styles.chapterTitle}>Chapter 1: The Shapewood Path</h1>
            <p className={styles.chapterSubtitle}>The Forest Castle • Castle II</p>
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
              { key: 'learnQuadrilateral', label: 'Learn: Quadrilateral' },
              { key: 'learnPentagon', label: 'Learn: Pentagon' },
              { key: 'learnHexagon', label: 'Learn: Hexagon' },
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
                  <h2 className={styles.doorTitle}>The Three Paths of Measurement</h2>
                  <div className={styles.doorGrid}>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle2-door1.png" 
                          alt="Chapter 1" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter I: Shapes</span>
                    </div>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle2-door2.png" 
                          alt="Chapter 2" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter II: Perimeter</span>
                    </div>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle2-door3.png" 
                          alt="Chapter 3" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter III: Area</span>
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
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <polygon 
                        points={renderPolygon('triangle', 100, 60, 35)} 
                        fill="none" 
                        stroke="#4CAF50" 
                        strokeWidth="3"
                      />
                      <text x="100" y="85" textAnchor="middle" fill="#4CAF50" fontSize="14" fontWeight="bold">3 sides</text>
                    </svg>
                  </div>
                  <p>A polygon with 3 straight sides and 3 angles.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnQuadrilateral ? styles.revealed : styles.hidden}`}>
                  <h3>Quadrilateral</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <polygon 
                        points={renderPolygon('square', 100, 50, 30)} 
                        fill="none" 
                        stroke="#66BB6A" 
                        strokeWidth="3"
                      />
                      <text x="100" y="90" textAnchor="middle" fill="#66BB6A" fontSize="14" fontWeight="bold">4 sides</text>
                    </svg>
                  </div>
                  <p>A polygon with 4 sides. Includes squares and rectangles.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnPentagon ? styles.revealed : styles.hidden}`}>
                  <h3>Pentagon</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <polygon 
                        points={renderPolygon('pentagon', 100, 55, 32)} 
                        fill="none" 
                        stroke="#81C784" 
                        strokeWidth="3"
                      />
                      <text x="100" y="92" textAnchor="middle" fill="#81C784" fontSize="14" fontWeight="bold">5 sides</text>
                    </svg>
                  </div>
                  <p>A polygon with 5 sides and 5 angles.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnHexagon ? styles.revealed : styles.hidden}`}>
                  <h3>Hexagon</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <polygon 
                        points={renderPolygon('hexagon', 100, 50, 30)} 
                        fill="none" 
                        stroke="#A5D6A7" 
                        strokeWidth="3"
                      />
                      <text x="100" y="87" textAnchor="middle" fill="#A5D6A7" fontSize="14" fontWeight="bold">6 sides</text>
                    </svg>
                  </div>
                  <p>A polygon with 6 sides. Found in honeycombs!</p>
                </div>
              </div>
            </div>
          )}

          {currentScene === 'minigame' && minigame && (
            <div className={styles.minigameContent}>
              <div className={styles.minigameCard}>
                <h3>Click on the {shapeRounds[currentShapeRound].name}!</h3>
                <p className={styles.minigameHint}>
                  Look for a shape with {shapeRounds[currentShapeRound].sides} sides
                </p>
                
                <div className={styles.shapeGrid}>
                  {(['triangle', 'square', 'pentagon', 'hexagon', 'heptagon', 'octagon'] as ShapeType[]).map((shape) => (
                    <div 
                      key={shape}
                      className={`${styles.shapeOption} ${clickedShape === shape ? (isShapeFeedbackCorrect ? styles.correct : styles.incorrect) : ''}`}
                      onClick={() => !clickedShape && handleShapeClick(shape)}
                      style={{ cursor: clickedShape ? 'not-allowed' : 'pointer' }}
                    >
                      <svg width="100%" height="120" viewBox="0 0 200 120">
                        <polygon 
                          points={renderPolygon(shape, 100, 60, 40)} 
                          fill="rgba(76, 175, 80, 0.2)" 
                          stroke="#4CAF50" 
                          strokeWidth="3"
                        />
                      </svg>
                    </div>
                  ))}
                </div>
                
                {shapeFeedback && (
                  <div className={`${styles.feedback} ${isShapeFeedbackCorrect ? styles.correct : styles.incorrect}`}>
                    {shapeFeedback}
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
                    src="/images/gem-of-sides.png" 
                    alt="Gem of Sides" 
                    className={styles.relicIcon}
                  />
                </div>
                <h3 className={styles.rewardName}>The Gem of Sides</h3>
                <p className={styles.rewardDescription}>
                  You have mastered the art of polygon identification! The Gem of Sides glows with your geometric wisdom.
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
                <img src="/images/sylvan-wizard.png" alt="Sylvan" className={styles.wizardPortrait} />
              </div>
            </div>
            <div className={styles.messageSection}>
              <div className={styles.dialogueTextWrapper}>
                <div className={styles.dialogueSpeaker}>Sylvan</div>
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