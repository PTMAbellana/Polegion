"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Stage, Layer, Circle, Line, Arc, Text, Group } from 'react-konva'
import { Sparkles, Volume2, VolumeX, Play, Pause, X, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { AuthProtection } from '@/context/AuthProtection'
import styles from '@/styles/castle3-chapter1.module.css'
import { getChaptersByCastle, awardLessonXP, completeChapter } from '@/api/chapters'
import { getChapterQuizzesByChapter, submitQuizAttempt } from '@/api/chapterQuizzes'
import { getMinigamesByChapter, submitMinigameAttempt } from '@/api/minigames'
import type { 
  ChapterQuiz, 
  Minigame
} from '@/types/common'

const CASTLE_ID = 'd6e7a642-5d4c-4f9e-8b3a-1c2d3e4f5a6b'
const CHAPTER_NUMBER = 1

type SceneType = 'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward'

export default function Castle3Chapter1Page() {
  const router = useRouter()
  const { userProfile } = useAuthStore()
  const { isLoading: authLoading } = AuthProtection()

  const [chapterId, setChapterId] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<ChapterQuiz | null>(null)
  const [minigame, setMinigame] = useState<Minigame | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

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
    
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [minigameFeedback, setMinigameFeedback] = useState<string>("")
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState<boolean | null>(null)
  const [stageSize, setStageSize] = useState({ width: 700, height: 400 })
    
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const taskListRef = useRef<HTMLDivElement | null>(null)
  const gameAreaRef = useRef<HTMLDivElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
    
  const [completedTasks, setCompletedTasks] = useState({
    learnCenter: false,
    learnRadius: false,
    learnDiameter: false,
    learnChord: false,
    learnArc: false,
    learnSector: false,
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
    lesson: 20,
    minigame: 40,
    quiz1: 20,
    quiz2: 15,
    quiz3: 15,
    total: 150
  }

  const openingDialogue = [
    "Welcome, seeker of sacred curves, to the Circle Sanctuary!",
    "I am Archim, Guardian of the Golden Shores — where eternal shapes dwell.",
    "Behold! These are Circles — the most perfect of all forms, with no beginning and no end.",
    "From these sacred rings, we shall unlock the mysteries of the sanctuary!"
  ]

  const lessonDialogue = [
    "Every circle has a heart — the CENTER, from which all distances are equal.",
    "From the center to the edge flows the RADIUS — the measure of a circle's reach.",
    "Twice the radius forms the DIAMETER — a path straight through the center.",
    "Any line connecting two points on the edge is a CHORD — like a bridge across water.",
    "The curved path along the edge is an ARC — a portion of the eternal ring.",
    "Between two radii and an arc lies the SECTOR — a slice of the circle's soul.",
    "Now, let us put your knowledge to practice!"
  ]

  const minigameDialogue = [
    "Excellent! The ripples reveal the circle's secrets.",
    "Touch each part as I call for it — let the waters guide you.",
    "Choose wisely, young scholar of curves!"
  ]

  useEffect(() => {
    const loadChapterData = async () => {
      if (!authLoading && userProfile?.id) {
        try {
          setLoading(true)
          setLoadError(null)
          
          console.log('[Castle3-Ch1] Loading data for castle:', CASTLE_ID)
          const chaptersRes = await getChaptersByCastle(CASTLE_ID)
          console.log('[Castle3-Ch1] Chapters response:', chaptersRes)
          
          const chapter1 = chaptersRes.data?.find((ch: any) => ch.chapter_number === CHAPTER_NUMBER)
          
          if (!chapter1) {
            console.error('[Castle3-Ch1] Chapter 1 not found')
            setLoadError('Chapter 1 not found. Please contact support.')
            setLoading(false)
            return
          }
          
          console.log('[Castle3-Ch1] Found chapter 1:', chapter1)
          setChapterId(chapter1.id)
          
          const [quizzesRes, minigamesRes] = await Promise.all([
            getChapterQuizzesByChapter(chapter1.id),
            getMinigamesByChapter(chapter1.id)
          ])
          
          console.log('[Castle3-Ch1] Quizzes response:', quizzesRes)
          console.log('[Castle3-Ch1] Minigames response:', minigamesRes)
          
          // Set quiz or use fallback
          if (quizzesRes.data && quizzesRes.data.length > 0) {
            console.log('[Castle3-Ch1] Setting quiz:', quizzesRes.data[0])
            setQuiz(quizzesRes.data[0])
          } else {
            console.warn('[Castle3-Ch1] No quizzes found, using fallback')
            setQuiz({
              id: 'fallback-quiz',
              chapter_id: chapter1.id,
              quiz_config: {
                questions: [
                  {
                    question: "What is the center of a circle?",
                    options: ["The point equidistant from all edge points", "Any point on the circle", "The largest diameter", "The smallest radius"],
                    correctAnswer: "The point equidistant from all edge points"
                  },
                  {
                    question: "Which part is a line segment from the center to any point on the circle?",
                    options: ["Diameter", "Chord", "Radius", "Arc"],
                    correctAnswer: "Radius"
                  },
                  {
                    question: "What is the relationship between diameter and radius?",
                    options: ["Diameter = 2 × Radius", "Diameter = Radius", "Diameter = Radius ÷ 2", "Diameter = Radius²"],
                    correctAnswer: "Diameter = 2 × Radius"
                  }
                ]
              }
            } as any)
          }
          
          // Set minigame or use fallback
          if (minigamesRes.data && minigamesRes.data.length > 0) {
            console.log('[Castle3-Ch1] Setting minigame:', minigamesRes.data[0])
            setMinigame(minigamesRes.data[0])
          } else {
            console.warn('[Castle3-Ch1] No minigames found, using fallback')
            setMinigame({
              id: 'fallback-minigame',
              chapter_id: chapter1.id,
              game_config: {
                questions: [
                  { partType: 'center', instruction: 'Click on the CENTER of the circle', hint: 'The center is the point in the middle.' },
                  { partType: 'radius', instruction: 'Click on the RADIUS', hint: 'The radius goes from center to edge.' },
                  { partType: 'diameter', instruction: 'Click on the DIAMETER', hint: 'The diameter passes through the center.' },
                  { partType: 'chord', instruction: 'Click on the CHORD', hint: 'A chord connects two points on the circle.' },
                  { partType: 'arc', instruction: 'Click on the ARC', hint: 'The arc is the curved edge of the circle.' },
                  { partType: 'sector', instruction: 'Click on the SECTOR', hint: 'A sector is a pie-shaped region.' }
                ]
              }
            } as any)
          }
          
        } catch (error) {
          console.error('[Castle3-Ch1] Failed to load chapter data:', error)
          setLoadError('Failed to load chapter data. Please try again.')
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadChapterData()
  }, [authLoading, userProfile])

  const playNarration = (filename: string) => {
    if (isMuted || !filename) return
    
    try {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      const audio = new Audio(`/audio/narration/${filename}.mp3`)
      
      audio.onerror = () => {
        console.log(`[Audio] File not found (optional): ${filename}.mp3`)
      }
      
      audio.play().catch(err => {
        console.log(`[Audio] Playback skipped (optional): ${filename}.mp3`)
      })
      
      audioRef.current = audio
    } catch (error) {
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
        setStageSize({ width: width, height: 400 })
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
    if (currentScene === 'opening') audioToPlay = `castle3-opening-${messageIndex + 1}`
    else if (currentScene === 'lesson') audioToPlay = `castle3-lesson-${messageIndex + 1}`
    else if (currentScene === 'minigame') audioToPlay = `castle3-minigame-${messageIndex + 1}`
    else if (currentScene.startsWith('quiz')) {
      if (wizardMessage.includes("Correct!")) audioToPlay = 'castle3-quiz-correct'
      else if (wizardMessage.includes("Not quite")) audioToPlay = 'castle3-quiz-incorrect'
      else audioToPlay = 'castle3-quiz-intro'
    } else if (currentScene === 'reward') audioToPlay = 'castle3-reward-intro'
    
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
  }, [completedTasks.learnCenter, completedTasks.learnRadius, completedTasks.learnDiameter, completedTasks.learnChord, completedTasks.learnArc, completedTasks.learnSector])

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
        setCompletedTasks(prev => ({ ...prev, learnCenter: true }))
      }
    } else if (currentScene === 'lesson') {
      if (messageIndex < lessonDialogue.length - 1) {
        setMessageIndex(prev => prev + 1)
        setWizardMessage(lessonDialogue[messageIndex + 1])
        
        if (messageIndex === 1) setCompletedTasks(prev => ({ ...prev, learnRadius: true }))
        if (messageIndex === 2) setCompletedTasks(prev => ({ ...prev, learnDiameter: true }))
        if (messageIndex === 3) setCompletedTasks(prev => ({ ...prev, learnChord: true }))
        if (messageIndex === 4) setCompletedTasks(prev => ({ ...prev, learnArc: true }))
        if (messageIndex === 5) setCompletedTasks(prev => ({ ...prev, learnSector: true }))
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

  const handlePartClick = async (partType: string) => {
    if (!minigame || !minigame.game_config.questions[currentQuestion]) return
    
    const question = minigame.game_config.questions[currentQuestion]
    setSelectedPart(partType)
    
    const isCorrect = partType === question.partType
    
    if (isCorrect) {
      setIsFeedbackCorrect(true)
      setMinigameFeedback("Perfect! The ripples have revealed the truth.")
      
      setTimeout(async () => {
        if (currentQuestion < minigame.game_config.questions.length - 1) {
          setCurrentQuestion(prev => prev + 1)
          setSelectedPart(null)
          setMinigameFeedback("")
          setIsFeedbackCorrect(null)
          setWizardMessage("Well done! Now find the next part.")
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
          
          setWizardMessage("Magnificent! You understand the circle's sacred parts!")
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
        setSelectedPart(null)
        setMinigameFeedback("")
        setIsFeedbackCorrect(null)
      }, 2500)
    }
  }

  const renderCirclePart = (partType: string, isHighlighted: boolean = false) => {
    const centerX = stageSize.width / 2
    const centerY = stageSize.height / 2
    const radius = 120
    const color = isHighlighted ? "#FFD700" : "#DAA520"
    const strokeWidth = isHighlighted ? 4 : 2
    
    const parts: JSX.Element[] = []
    
    parts.push(
      <Circle
        key="circle-outline"
        x={centerX}
        y={centerY}
        radius={radius}
        stroke={isHighlighted && partType === 'arc' ? "#FFD700" : "#DAA520"}
        strokeWidth={isHighlighted && partType === 'arc' ? 5 : 2}
        listening={partType === 'arc'}
        onClick={() => partType === 'arc' && handlePartClick('arc')}
      />
    )
    
    if (partType === 'center' || !partType) {
      parts.push(
        <Circle
          key="center"
          x={centerX}
          y={centerY}
          radius={isHighlighted ? 10 : 6}
          fill={color}
          stroke="#FFFACD"
          strokeWidth={strokeWidth}
          listening={partType === 'center'}
          onClick={() => partType === 'center' && handlePartClick('center')}
          shadowColor={isHighlighted ? "rgba(255, 215, 0, 0.8)" : "rgba(218, 165, 32, 0.5)"}
          shadowBlur={isHighlighted ? 15 : 5}
        />
      )
      parts.push(
        <Text
          key="center-label"
          x={centerX - 8}
          y={centerY - 25}
          text="O"
          fontSize={16}
          fill="#FFFACD"
          fontStyle="bold"
          listening={false}
        />
      )
    }
    
    if (partType === 'radius' || !partType) {
      parts.push(
        <Line
          key="radius"
          points={[centerX, centerY, centerX + radius, centerY]}
          stroke={color}
          strokeWidth={strokeWidth}
          listening={partType === 'radius'}
          onClick={() => partType === 'radius' && handlePartClick('radius')}
          shadowColor={isHighlighted ? "rgba(255, 215, 0, 0.8)" : "transparent"}
          shadowBlur={isHighlighted ? 10 : 0}
        />
      )
      parts.push(
        <Text
          key="radius-label"
          x={centerX + radius / 2 - 8}
          y={centerY - 20}
          text="r"
          fontSize={14}
          fill="#FFFACD"
          fontStyle="italic"
          listening={false}
        />
      )
      parts.push(
        <Circle
          key="radius-end"
          x={centerX + radius}
          y={centerY}
          radius={5}
          fill={color}
          listening={false}
        />
      )
    }
    
    if (partType === 'diameter' || !partType) {
      parts.push(
        <Line
          key="diameter"
          points={[centerX - radius, centerY, centerX + radius, centerY]}
          stroke={color}
          strokeWidth={strokeWidth}
          listening={partType === 'diameter'}
          onClick={() => partType === 'diameter' && handlePartClick('diameter')}
          shadowColor={isHighlighted ? "rgba(255, 215, 0, 0.8)" : "transparent"}
          shadowBlur={isHighlighted ? 10 : 0}
        />
      )
      parts.push(
        <Circle
          key="diameter-start"
          x={centerX - radius}
          y={centerY}
          radius={5}
          fill={color}
          listening={false}
        />
      )
      parts.push(
        <Circle
          key="diameter-end"
          x={centerX + radius}
          y={centerY}
          radius={5}
          fill={color}
          listening={false}
        />
      )
      parts.push(
        <Text
          key="diameter-label-a"
          x={centerX - radius - 20}
          y={centerY - 5}
          text="A"
          fontSize={14}
          fill="#FFFACD"
          fontStyle="bold"
          listening={false}
        />
      )
      parts.push(
        <Text
          key="diameter-label-b"
          x={centerX + radius + 10}
          y={centerY - 5}
          text="B"
          fontSize={14}
          fill="#FFFACD"
          fontStyle="bold"
          listening={false}
        />
      )
    }
    
    if (partType === 'chord' || !partType) {
      const chordAngle1 = 30
      const chordAngle2 = 150
      const x1 = centerX + radius * Math.cos((chordAngle1 * Math.PI) / 180)
      const y1 = centerY + radius * Math.sin((chordAngle1 * Math.PI) / 180)
      const x2 = centerX + radius * Math.cos((chordAngle2 * Math.PI) / 180)
      const y2 = centerY + radius * Math.sin((chordAngle2 * Math.PI) / 180)
      
      parts.push(
        <Line
          key="chord"
          points={[x1, y1, x2, y2]}
          stroke={color}
          strokeWidth={strokeWidth}
          listening={partType === 'chord'}
          onClick={() => partType === 'chord' && handlePartClick('chord')}
          shadowColor={isHighlighted ? "rgba(255, 215, 0, 0.8)" : "transparent"}
          shadowBlur={isHighlighted ? 10 : 0}
        />
      )
      parts.push(
        <Circle key="chord-p1" x={x1} y={y1} radius={5} fill={color} listening={false} />
      )
      parts.push(
        <Circle key="chord-p2" x={x2} y={y2} radius={5} fill={color} listening={false} />
      )
      parts.push(
        <Text
          key="chord-label-c"
          x={x1 + 10}
          y={y1 - 20}
          text="C"
          fontSize={14}
          fill="#FFFACD"
          fontStyle="bold"
          listening={false}
        />
      )
      parts.push(
        <Text
          key="chord-label-d"
          x={x2 - 25}
          y={y2 - 20}
          text="D"
          fontSize={14}
          fill="#FFFACD"
          fontStyle="bold"
          listening={false}
        />
      )
    }
    
    if (partType === 'sector' || !partType) {
      const sectorAngle1 = 200
      const sectorAngle2 = 280
      const x1 = centerX + radius * Math.cos((sectorAngle1 * Math.PI) / 180)
      const y1 = centerY + radius * Math.sin((sectorAngle1 * Math.PI) / 180)
      const x2 = centerX + radius * Math.cos((sectorAngle2 * Math.PI) / 180)
      const y2 = centerY + radius * Math.sin((sectorAngle2 * Math.PI) / 180)
      
      parts.push(
        <Group
          key="sector-group"
          listening={partType === 'sector'}
          onClick={() => partType === 'sector' && handlePartClick('sector')}
        >
          <Arc
            x={centerX}
            y={centerY}
            innerRadius={0}
            outerRadius={radius}
            angle={sectorAngle2 - sectorAngle1}
            rotation={sectorAngle1}
            fill={isHighlighted ? "rgba(255, 215, 0, 0.3)" : "rgba(218, 165, 32, 0.2)"}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Line
            points={[centerX, centerY, x1, y1]}
            stroke={color}
            strokeWidth={strokeWidth}
          />
          <Line
            points={[centerX, centerY, x2, y2]}
            stroke={color}
            strokeWidth={strokeWidth}
          />
        </Group>
      )
    }
    
    return parts
  }

  const handleAnswerSelect = async (answer: string, correctAnswer: string, quizNumber: number) => {
    setSelectedAnswer(answer)
    const correct = answer === correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    const updatedAnswers = { ...quizAnswers, [`question${quizNumber}`]: answer }
    setQuizAnswers(updatedAnswers)
    
    if (correct) {
      setCompletedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof completedTasks]: true }))
      setFailedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof failedTasks]: false }))
      
      const xpKey = `quiz${quizNumber}` as keyof typeof XP_VALUES
      setEarnedXP(prev => ({ ...prev, quiz: prev.quiz + XP_VALUES[xpKey] }))
      setWizardMessage(`Correct! +${XP_VALUES[xpKey]} XP`)
      
      setTimeout(() => {
        setSelectedAnswer(null)
        setShowFeedback(false)
        
        if (quizNumber === 1) {
          setCurrentScene('quiz2')
          setWizardMessage("Next: Which part is a line segment from the center to any point on the circle?")
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3')
          setWizardMessage("Final question: What is the relationship between diameter and radius?")
        } else if (quizNumber === 3) {
          if (quiz?.id) {
            submitQuizAttempt(quiz.id, updatedAnswers).then(() => {
              setQuizAttempts(prev => prev + 1)
              setCanRetakeQuiz(true)
            }).catch(err => console.error('Failed to submit quiz:', err))
          }
          setCanRetakeQuiz(true)
          setCurrentScene('reward')
          setWizardMessage("The Pearl of the Center is yours. May it illuminate your journey!")
        }
      }, 2000)
    } else {
      setFailedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}` as keyof typeof failedTasks]: true }))
      setWizardMessage("⚠️ Not quite right. Think carefully about the definition.")
      
      setTimeout(() => {
        setShowFeedback(false)
        setSelectedAnswer(null)
        
        if (quizNumber === 1) {
          setCurrentScene('quiz2')
          setWizardMessage("Next: Which part is a line segment from the center to any point on the circle?")
        } else if (quizNumber === 2) {
          setCurrentScene('quiz3')
          setWizardMessage("Final question: What is the relationship between diameter and radius?")
        } else if (quizNumber === 3) {
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
    
    if (chapterId) {
      try {
        await completeChapter(chapterId)
        console.log('[Castle3-Ch1] Chapter marked as completed')
      } catch (error) {
        console.error('[Castle3-Ch1] Failed to mark chapter as completed:', error)
      }
    }
    
    router.push('/student/worldmap/castle3')
  }

  const handleRetakeQuiz = () => {
    setQuizAnswers({})
    setSelectedAnswer(null)
    setShowFeedback(false)
    setFailedTasks({
      passQuiz1: false,
      passQuiz2: false,
      passQuiz3: false
    })
    setCompletedTasks(prev => ({
      ...prev,
      passQuiz1: false,
      passQuiz2: false,
      passQuiz3: false
    }))
    setEarnedXP(prev => ({ ...prev, quiz: 0 }))
    setCurrentScene('quiz1')
    setWizardMessage("Let's try the quiz again! What is the center of a circle?")
  }

  const handleExit = () => {
    if (audioRef.current) audioRef.current.pause()
    router.push('/student/worldmap/castle3')
  }

  const toggleAutoAdvance = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAutoAdvance(!autoAdvance)
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsMuted(!isMuted)
  }

  if (authLoading) {
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', flexDirection: 'column', gap: '1rem' }}>
          <p>Authenticating...</p>
        </div>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: '#ff6b6b' }}>{loadError}</p>
          <button 
            onClick={() => router.push('/student/worldmap/castle3')}
            style={{ padding: '0.5rem 1rem', background: '#4CAF50', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer' }}
          >
            Return to Castle
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.chapterContainer}>
        <div className={styles.backgroundOverlay}></div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', flexDirection: 'column', gap: '1rem' }}>
          <p>Loading chapter...</p>
          <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Please wait...</p>
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
            <h1 className={styles.chapterTitle}>Chapter 1: The Tide of Shapes</h1>
            <p className={styles.chapterSubtitle}>Circle Sanctuary • Castle III</p>
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
              {Object.values(completedTasks).filter(Boolean).length} / 10 Complete
            </div>
          </div>
          <div className={styles.taskList} ref={taskListRef}>
            {[
              { key: 'learnCenter', label: 'Learn: Center' },
              { key: 'learnRadius', label: 'Learn: Radius' },
              { key: 'learnDiameter', label: 'Learn: Diameter' },
              { key: 'learnChord', label: 'Learn: Chord' },
              { key: 'learnArc', label: 'Learn: Arc' },
              { key: 'learnSector', label: 'Learn: Sector' },
              { key: 'completeMinigame', label: 'Complete Ripple Reveal' },
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
                  <h2 className={styles.doorTitle}>The Sacred Pools of Knowledge</h2>
                  <div className={styles.doorGrid}>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle3-door1.png" 
                          alt="Chapter 1" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter I: Tide of Shapes</span>
                    </div>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle3-door2.png" 
                          alt="Chapter 2" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter II: Path of Perimeter</span>
                    </div>
                    <div className={styles.doorCard}>
                      <div className={styles.doorImageWrapper}>
                        <img 
                          src="/images/castle3-door3.png" 
                          alt="Chapter 3" 
                          className={styles.doorImage}
                        />
                      </div>
                      <span className={styles.doorLabel}>Chapter III: Chamber of Space</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentScene === 'lesson' && (
            <div className={styles.lessonContent}>
              <div className={styles.conceptGrid}>
                <div className={`${styles.conceptCard} ${completedTasks.learnCenter ? styles.revealed : styles.hidden}`}>
                  <h3>Center (O)</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#DAA520" strokeWidth="2" />
                      <circle cx="100" cy="50" r="6" fill="#FFD700" />
                      <text x="100" y="38" textAnchor="middle" fill="#FFFACD" fontSize="14" fontWeight="bold">O</text>
                    </svg>
                  </div>
                  <p>The heart of the circle. All points on the edge are equidistant from it.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnRadius ? styles.revealed : styles.hidden}`}>
                  <h3>Radius (r)</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#DAA520" strokeWidth="2" />
                      <line x1="100" y1="50" x2="140" y2="50" stroke="#FFD700" strokeWidth="3" />
                      <circle cx="100" cy="50" r="4" fill="#FFD700" />
                      <circle cx="140" cy="50" r="4" fill="#FFD700" />
                      <text x="120" y="42" textAnchor="middle" fill="#FFFACD" fontSize="12" fontStyle="italic">r</text>
                    </svg>
                  </div>
                  <p>Line from center to any point on the circle.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnDiameter ? styles.revealed : styles.hidden}`}>
                  <h3>Diameter (d)</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#DAA520" strokeWidth="2" />
                      <line x1="60" y1="50" x2="140" y2="50" stroke="#FFD700" strokeWidth="3" />
                      <circle cx="60" cy="50" r="4" fill="#FFD700" />
                      <circle cx="140" cy="50" r="4" fill="#FFD700" />
                      <text x="58" y="66" textAnchor="middle" fill="#FFFACD" fontSize="12" fontWeight="bold">A</text>
                      <text x="142" y="66" textAnchor="middle" fill="#FFFACD" fontSize="12" fontWeight="bold">B</text>
                    </svg>
                  </div>
                  <p>Line through center connecting two edge points. d = 2r</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnChord ? styles.revealed : styles.hidden}`}>
                  <h3>Chord</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#DAA520" strokeWidth="2" />
                      <line x1="80" y1="26" x2="120" y2="74" stroke="#FFD700" strokeWidth="3" />
                      <circle cx="80" cy="26" r="4" fill="#FFD700" />
                      <circle cx="120" cy="74" r="4" fill="#FFD700" />
                      <text x="78" y="20" textAnchor="middle" fill="#FFFACD" fontSize="12" fontWeight="bold">C</text>
                      <text x="122" y="88" textAnchor="middle" fill="#FFFACD" fontSize="12" fontWeight="bold">D</text>
                    </svg>
                  </div>
                  <p>Line connecting two points on the circle (not through center).</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnArc ? styles.revealed : styles.hidden}`}>
                  <h3>Arc</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#DAA520" strokeWidth="2" />
                      <path d="M 100 10 A 40 40 0 0 1 140 50" fill="none" stroke="#FFD700" strokeWidth="5" />
                      <circle cx="100" cy="10" r="4" fill="#FFD700" />
                      <circle cx="140" cy="50" r="4" fill="#FFD700" />
                    </svg>
                  </div>
                  <p>A curved portion of the circle between two points.</p>
                </div>
                
                <div className={`${styles.conceptCard} ${completedTasks.learnSector ? styles.revealed : styles.hidden}`}>
                  <h3>Sector</h3>
                  <div className={styles.visualDemo}>
                    <svg width="100%" height="100" viewBox="0 0 200 100">
                      <circle cx="100" cy="50" r="40" fill="none" stroke="#DAA520" strokeWidth="2" />
                      <path d="M 100 50 L 100 10 A 40 40 0 0 1 140 50 Z" fill="rgba(255, 215, 0, 0.3)" stroke="#FFD700" strokeWidth="2" />
                      <line x1="100" y1="50" x2="100" y2="10" stroke="#FFD700" strokeWidth="2" />
                      <line x1="100" y1="50" x2="140" y2="50" stroke="#FFD700" strokeWidth="2" />
                    </svg>
                  </div>
                  <p>Pie-shaped region between two radii and an arc.</p>
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
                  <Stage width={stageSize.width} height={stageSize.height}>
                    <Layer>
                      {renderCirclePart(
                        minigame.game_config.questions[currentQuestion]?.partType,
                        selectedPart === minigame.game_config.questions[currentQuestion]?.partType
                      )}
                    </Layer>
                  </Stage>
                </div>
                
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
                    src="/images/pearl-center.png" 
                    alt="Pearl of the Center" 
                    className={styles.relicIcon}
                  />
                </div>
                <h3 className={styles.rewardName}>Pearl of the Center</h3>
                <p className={styles.rewardDescription}>
                  You have mastered the sacred parts of the circle! The heart of the sanctuary's magic is yours.
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
                  Return to Sanctuary
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
