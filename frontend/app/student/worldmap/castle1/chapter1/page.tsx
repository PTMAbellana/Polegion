"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, ChevronRight, Star, Award, CheckCircle, Lock, Volume2, VolumeX, Play, Pause, Target } from 'lucide-react';
import { Stage, Layer, Circle, Line, Arrow, Text } from 'react-konva';
import styles from '@/styles/castle1-chapter1.module.css';
import { startChapter, awardLessonXP } from '@/api/progress';
import { submitMinigameAttempt } from '@/api/minigames';
import { submitQuizAttempt } from '@/api/quizzes';

interface Point {
  id: string;
  x: number;
  y: number;
  label: string;
}

const CHAPTER_SETUP_DATA = {
  quiz: {
    title: "Lines, Rays & Segments Quiz",
    description: "Test your understanding of geometric primitives",
    xp_reward: 100,
    passing_score: 70,
    questions: [
      {
        question: "Which one has TWO endpoints?",
        options: ["Line", "Ray", "Line Segment"],
        correctAnswer: "Line Segment"
      },
      {
        question: "Which geometric element extends infinitely in one direction?",
        options: ["Line", "Ray", "Line Segment"],
        correctAnswer: "Ray"
      },
      {
        question: "Which extends infinitely in BOTH directions?",
        options: ["Line", "Ray", "Line Segment"],
        correctAnswer: "Line"
      }
    ]
  },
  minigames: [
    {
      title: "Identify the Geometric Elements",
      description: "Click on the correct geometric element",
      game_type: "interactive",
      xp_reward: 75,
      order_index: 1,
      questions: [
        {
          question: "Click on all points that form a line segment",
          type: "line-segment"
        },
        {
          question: "Click on the starting point and direction of a ray",
          type: "ray"
        },
        {
          question: "Click on any two points on an infinite line",
          type: "line"
        }
      ]
    }
  ]
};

export default function Chapter1Page() {
  const router = useRouter();
  const [currentScene, setCurrentScene] = useState<'opening' | 'lesson' | 'minigame' | 'quiz1' | 'quiz2' | 'quiz3' | 'reward'>('opening');
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [wizardMessage, setWizardMessage] = useState("");
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  
  // Minigame state
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [minigameFeedback, setMinigameFeedback] = useState<string>("");
  const [isFeedbackCorrect, setIsFeedbackCorrect] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [stageSize, setStageSize] = useState({ width: 700, height: 250 });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const taskListRef = useRef<HTMLDivElement | null>(null);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  
  const [completedTasks, setCompletedTasks] = useState({
    learnPoint: false,
    learnLineSegment: false,
    learnRay: false,
    learnLine: false,
    completeMinigame: false,
    passQuiz1: false,
    passQuiz2: false,
    passQuiz3: false
  });
  
  // XP state
  const [earnedXP, setEarnedXP] = useState({
    lesson: 0,
    minigame: 0,
    quiz: 0
  });

  // XP Distribution System
  const XP_VALUES = {
    lesson: 20,        // 20 XP for completing lesson
    minigame: 30,      // 30 XP for completing minigame
    quiz1: 15,         // 15 XP per quiz
    quiz2: 15,
    quiz3: 20,         // Final quiz worth more
    total: 100
  };

  // Minigame questions
  const minigameQuestions = [
    {
      instruction: "Create a Line Segment AB: Connect point A to point B. It has two endpoints and a fixed length.",
      points: [
        { id: 'A', x: 150, y: 125, label: 'A' },
        { id: 'B', x: 550, y: 125, label: 'B' }
      ],
      correctAnswer: ['A', 'B'],
      type: 'Line Segment',
      showType: 'segment',
      hint: "A line segment has endpoints on both ends - it doesn't extend beyond them."
    },
    {
      instruction: "Create Ray CD: Start at point C and go through point D. It has ONE endpoint at C and extends infinitely through D.",
      points: [
        { id: 'C', x: 150, y: 125, label: 'C' },
        { id: 'D', x: 350, y: 125, label: 'D' },
        { id: 'E', x: 550, y: 125, label: 'E' }
      ],
      correctAnswer: ['C', 'D'],
      type: 'Ray',
      showType: 'ray',
      hint: "A ray starts at one point and continues forever in one direction."
    },
    {
      instruction: "Create Line FG: Connect points F and G.",
      points: [
        { id: 'F', x: 200, y: 100, label: 'F' },
        { id: 'G', x: 350, y: 125, label: 'G' },
        { id: 'H', x: 500, y: 150, label: 'H' }
      ],
      correctAnswer: ['F', 'G'],
      // alternateAnswer: ['G', 'H'], // Add this for flexibility
      type: 'Line',
      showType: 'line',
      hint: "A line has NO endpoints - it goes on forever in both directions."
    }
  ];

  const openingDialogue = [
    "Ah… a new seeker of shapes has arrived! Welcome, traveler.",
    "I am Archim, Keeper of the Euclidean Spire — where all geometry was born.",
    "Before this tower may awaken again, you must master the foundations of form...",
    "...from the smallest point… to the grandest figure!"
  ];

  const lessonDialogue = [
    "Every shape begins with a Point — small, yet mighty.",
    "Without it, no line, ray, or segment could ever exist.",
    "Watch closely. Two points form a connection… that is the beginning of a Line Segment.",
    "If the path stretches endlessly in one direction — it is a Ray.",
    "And if it continues in both… it becomes a Line — infinite and eternal.",
    "Now, let us put your knowledge to practice!"
  ];

  const minigameDialogue = [
    "Excellent! Now, let's see if you can create these shapes.",
    "Click and drag from one point to another to connect them.",
    "Choose wisely, young geometer!"
  ];

  // Wrap audio playback in try-catch
  const playNarration = (filename: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      const audio = new Audio(`/audio/narration/${filename}`);
      
      // Handle error gracefully
      audio.onerror = () => {
        console.warn(`Audio file not found: ${filename}`);
      };
      
      audio.play().catch(err => {
        console.warn('Audio playback failed:', err);
      });
      
      audioRef.current = audio;
    } catch (error) {
      console.warn('Audio error:', error);
    }
  };

  const [chapterId, setChapterId] = useState<string | null>(null);
  const [quizId, setQuizId] = useState<string | null>(null);
  const [minigameId, setMinigameId] = useState<string | null>(null);

  useEffect(() => {
    const initializeChapter = async () => {
      if (!userProfile?.id) return;

      try {
        // Get chapters for castle1
        const chaptersResponse = await getChaptersByCastle('CASTLE1_ID_HERE'); // Replace with actual castle ID
        const chapter1 = chaptersResponse.data.find(ch => ch.chapter_number === 1);
        
        if (!chapter1) {
          console.error('Chapter 1 not found');
          return;
        }

        setChapterId(chapter1.id);

        // Setup chapter (creates quiz and minigames if they don't exist)
        const setupResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/setup/chapters/${chapter1.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(CHAPTER_SETUP_DATA)
        });

        const setupData = await setupResponse.json();
        
        if (setupData.success) {
          setQuizId(setupData.data.quiz?.id);
          setMinigameId(setupData.data.minigames[0]?.id);
        }

        // Start chapter progress
        await startChapter(chapter1.id);
      } catch (error) {
        console.error('Failed to initialize chapter:', error);
      }
    };

    initializeChapter();
  }, [userProfile]);

  useEffect(() => {
    if (isMuted && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isMuted]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasContainerRef.current) {
        const width = canvasContainerRef.current.offsetWidth;
        setStageSize({ width: width, height: 250 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!wizardMessage) return;
    
    setIsTyping(true);
    setDisplayedText("");
    let currentIndex = 0;
    
    let audioToPlay = "";
    if (currentScene === 'opening') audioToPlay = `opening-${messageIndex + 1}`;
    else if (currentScene === 'lesson') audioToPlay = `lesson-${messageIndex + 1}`;
    else if (currentScene === 'minigame') audioToPlay = `minigame-${messageIndex + 1}`;
    else if (currentScene.startsWith('quiz')) {
      if (wizardMessage.includes("Splendid!") || wizardMessage.includes("Correct!")) audioToPlay = 'quiz-correct';
      else if (wizardMessage.includes("Careful") || wizardMessage.includes("Not quite")) audioToPlay = 'quiz-incorrect';
      else audioToPlay = 'quiz-intro';
    } else if (currentScene === 'reward') audioToPlay = 'reward-intro';
    
    if (audioToPlay) playNarration(audioToPlay);

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < wizardMessage.length) {
        setDisplayedText(wizardMessage.substring(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingIntervalRef.current!);
        if (autoAdvance && (currentScene === 'opening' || currentScene === 'lesson' || currentScene === 'minigame')) {
          autoAdvanceTimeoutRef.current = setTimeout(() => handleNextMessage(), 2500);
        }
      }
    }, 30);

    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [wizardMessage]);

  useEffect(() => {
    if (!isTyping && autoAdvance && (currentScene === 'opening' || currentScene === 'lesson' || currentScene === 'minigame')) {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = setTimeout(() => handleNextMessage(), 2500);
    }
    return () => {
      if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    };
  }, [isTyping, autoAdvance, currentScene]);

  useEffect(() => {
    if (currentScene === 'opening') {
      setWizardMessage(openingDialogue[0]);
      setMessageIndex(0);
    } else if (currentScene === 'lesson') {
      setWizardMessage(lessonDialogue[0]);
      setMessageIndex(0);
    } else if (currentScene === 'minigame') {
      setWizardMessage(minigameDialogue[0]);
      setMessageIndex(0);
    }
  }, [currentScene]);

  useEffect(() => {
    if (taskListRef.current) {
      const completedCount = Object.values(completedTasks).filter(Boolean).length;
      if (completedCount > 0) {
        const taskItems = taskListRef.current.querySelectorAll(`.${styles.taskItem}`);
        if (taskItems[completedCount - 1]) {
          setTimeout(() => {
            taskItems[completedCount - 1].scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'nearest'
            });
          }, 300);
        }
      }
    }
  }, [completedTasks]);

  useEffect(() => {
    if (gameAreaRef.current && currentScene === 'lesson') {
      setTimeout(() => {
        const conceptCards = gameAreaRef.current?.querySelectorAll(`.${styles.conceptCard}`);
        if (conceptCards && conceptCards.length > 0) {
          const lastCard = conceptCards[conceptCards.length - 1];
          lastCard.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'nearest'
          });
        }
      }, 400);
    }
  }, [completedTasks.learnPoint, completedTasks.learnLineSegment, completedTasks.learnRay, completedTasks.learnLine]);

  const handleDialogueClick = () => {
    if (autoAdvanceTimeoutRef.current) clearTimeout(autoAdvanceTimeoutRef.current);
    if (isTyping) {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
      setDisplayedText(wizardMessage);
      setIsTyping(false);
    } else {
      handleNextMessage();
    }
  };

  const handleNextMessage = async () => {
    if (currentScene === 'opening') {
      if (messageIndex < openingDialogue.length - 1) {
        setMessageIndex(prev => prev + 1);
        setWizardMessage(openingDialogue[messageIndex + 1]);
      } else {
        setCurrentScene('lesson');
        setMessageIndex(0);
        setCompletedTasks(prev => ({ ...prev, learnPoint: true }));
      }
    } else if (currentScene === 'lesson') {
      if (messageIndex < lessonDialogue.length - 1) {
        setMessageIndex(prev => prev + 1);
        setWizardMessage(lessonDialogue[messageIndex + 1]);
        
        if (messageIndex === 1) setCompletedTasks(prev => ({ ...prev, learnLineSegment: true }));
        if (messageIndex === 2) setCompletedTasks(prev => ({ ...prev, learnRay: true }));
        if (messageIndex === 3) setCompletedTasks(prev => ({ ...prev, learnLine: true }));
      } else {
        // Award lesson XP
        if (chapterId) {
          try {
            await awardLessonXP(chapterId, XP_VALUES.lesson);
            setEarnedXP(prev => ({ ...prev, lesson: XP_VALUES.lesson }));
          } catch (error) {
            console.error('Failed to award lesson XP:', error);
          }
        }
        
        setCurrentScene('minigame');
        setMessageIndex(0);
      }
    } else if (currentScene === 'minigame') {
      if (messageIndex < minigameDialogue.length - 1) {
        setMessageIndex(prev => prev + 1);
        setWizardMessage(minigameDialogue[messageIndex + 1]);
      }
    }
  };

  const handlePointMouseDown = (pointId: string) => {
    setIsDragging(true);
    setDragStart(pointId);
    if (selectedPoints.length === 0) {
      setSelectedPoints([pointId]);
    }
  };

  const handlePointMouseUp = (pointId: string) => {
    if (isDragging && dragStart && dragStart !== pointId) {
      setSelectedPoints([dragStart, pointId]);
      checkAnswer([dragStart, pointId]);
    }
    setIsDragging(false);
    setDragStart(null);
    setMousePos(null);
  };

  const handlePointClick = (pointId: string) => {
    if (!isDragging) {
      if (selectedPoints.length === 0) {
        setSelectedPoints([pointId]);
      } else if (selectedPoints.length === 1 && selectedPoints[0] !== pointId) {
        const newSelection = [...selectedPoints, pointId];
        setSelectedPoints(newSelection);
        checkAnswer(newSelection);
      }
    }
  };

  const handleMouseMove = (e: any) => {
    if (isDragging && dragStart) {
      const stage = e.target.getStage();
      const pos = stage.getPointerPosition();
      setMousePos(pos);
    }
  };

  const checkAnswer = async (points: string[]) => {
    const question = minigameQuestions[currentQuestion];
    
    // For rays, order matters! First point must be the endpoint
    let isCorrect = false;
    
    if (question.showType === 'ray') {
      // Ray must start at the correct endpoint (order matters)
      isCorrect = (points[0] === question.correctAnswer[0] && points[1] === question.correctAnswer[1]);
    } else if (question.showType === 'line') {
      // Line can be any two points in any order
      const isCorrectPrimary = 
        (points.includes(question.correctAnswer[0]) && points.includes(question.correctAnswer[1]));
      
      const isCorrectAlternate = question.alternateAnswer ? 
        (points.includes(question.alternateAnswer[0]) && points.includes(question.alternateAnswer[1])) : 
        false;
      
      isCorrect = isCorrectPrimary || isCorrectAlternate;
    } else {
      // Line segment - any order works
      isCorrect = (points.includes(question.correctAnswer[0]) && points.includes(question.correctAnswer[1]));
    }

    if (isCorrect) {
      setIsFeedbackCorrect(true);
      
      let feedbackMessage = "";
      if (question.showType === 'segment') {
        feedbackMessage = "Perfect! This Line Segment AB has endpoints at A and B. It doesn't extend beyond them.";
      } else if (question.showType === 'ray') {
        feedbackMessage = "Excellent! Ray CD starts at point C (the endpoint) and goes forever through D.";
      } else if (question.showType === 'line') {
        feedbackMessage = "Brilliant! Line FG passes through both points but extends infinitely in both directions!";
      }
      
      setMinigameFeedback(feedbackMessage);
      
      setTimeout(async () => {
        if (currentQuestion < minigameQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedPoints([]);
          setMinigameFeedback("");
          setIsFeedbackCorrect(null);
          setWizardMessage("Great work! Notice the differences. Now try the next one!");
        } else {
          // Submit minigame attempt
          if (minigameId) {
            try {
              await submitMinigameAttempt(minigameId, {
                score: 100,
                time_taken: 0,
                attempt_data: { completedQuestions: minigameQuestions.length }
              });
              
              setEarnedXP(prev => ({ ...prev, minigame: XP_VALUES.minigame }));
              setCompletedTasks(prev => ({ ...prev, completeMinigame: true }));
            } catch (error) {
              console.error('Failed to submit minigame:', error);
            }
          }
          
          setWizardMessage("Excellent! You now understand the key differences: Line Segment (2 endpoints), Ray (1 endpoint), and Line (no endpoints)!");
          setTimeout(() => {
            setCurrentScene('quiz1');
            setWizardMessage("Now let's test your knowledge! Which of these continues infinitely in both directions?");
          }, 3000);
        }
      }, 2500);
    } else {
      setIsFeedbackCorrect(false);
      
      // More helpful error messages
      let errorMessage = "Not quite. ";
      if (question.showType === 'segment') {
        errorMessage += "Connect A to B to create a line segment with two endpoints.";
      } else if (question.showType === 'ray') {
        errorMessage += "Remember: Ray CD must START at C (the endpoint) and go THROUGH D!";
      } else if (question.showType === 'line') {
        errorMessage += "Connect F and G to create a line that extends infinitely both ways.";
      }
      
      setMinigameFeedback(errorMessage);
      setTimeout(() => {
        setSelectedPoints([]);
        setMinigameFeedback("");
        setIsFeedbackCorrect(null);
      }, 2500);
    }
  };

  const getScaledPoints = () => {
    const question = minigameQuestions[currentQuestion];
    const scaleX = stageSize.width / 700;
    const scaleY = stageSize.height / 250;
    
    return question.points.map(p => ({
      ...p,
      x: p.x * scaleX,
      y: p.y * scaleY
    }));
  };

  const renderConnection = () => {
    if (selectedPoints.length !== 2) return null;

    const question = minigameQuestions[currentQuestion];
    const scaledPoints = getScaledPoints();
    const p1 = scaledPoints.find(p => p.id === selectedPoints[0]);
    const p2 = scaledPoints.find(p => p.id === selectedPoints[1]);
    
    if (!p1 || !p2) return null;

    const elements = [];

    // Draw the main line
    elements.push(
      <Line
        key="main-line"
        points={[p1.x, p1.y, p2.x, p2.y]}
        stroke="#66BBFF"
        strokeWidth={3}
        lineCap="round"
      />
    );

    // Draw endpoints or arrows based on type
    if (question.showType === 'segment') {
      // Two endpoints
      elements.push(
        <Circle key="endpoint1" x={p1.x} y={p1.y} radius={6} fill="#66BBFF" />,
        <Circle key="endpoint2" x={p2.x} y={p2.y} radius={6} fill="#66BBFF" />
      );
    } else if (question.showType === 'ray') {
      // Endpoint at start, arrow at end
      elements.push(
        <Circle key="endpoint-start" x={p1.x} y={p1.y} radius={6} fill="#66BBFF" />,
        <Arrow
          key="arrow-end"
          points={[p1.x, p1.y, p2.x, p2.y]}
          stroke="#66BBFF"
          fill="#66BBFF"
          strokeWidth={3}
          pointerLength={15}
          pointerWidth={15}
        />
      );
    } else if (question.showType === 'line') {
      // Arrows at both ends
      elements.push(
        <Arrow
          key="arrow-line"
          points={[p1.x, p1.y, p2.x, p2.y]}
          stroke="#66BBFF"
          fill="#66BBFF"
          strokeWidth={3}
          pointerLength={15}
          pointerWidth={15}
          pointerAtBeginning={true}
        />
      );
    }

    return elements;
  };

  const handleAnswerSelect = async (answer: string, correctAnswer: string, quizNumber: number) => {
    setSelectedAnswer(answer);
    const correct = answer === correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      // Collect answers for final submission
      const quizAnswers = { [`question${quizNumber}`]: answer };
      
      // If last quiz, submit all answers
      if (quizNumber === 3 && quizId) {
        try {
          const result = await submitQuizAttempt(quizId, quizAnswers);
          
          if (result.data.passed) {
            setEarnedXP(prev => ({ ...prev, quiz: prev.quiz + XP_VALUES[`quiz${quizNumber}`] }));
            setCompletedTasks(prev => ({ ...prev, [`passQuiz${quizNumber}`]: true }));
          }
        } catch (error) {
          console.error('Failed to submit quiz:', error);
        }
      }
      
      if (quizNumber === 1) {
        setEarnedXP(prev => ({ ...prev, quiz: prev.quiz + XP_VALUES.quiz1 }));
        setWizardMessage(`Correct! +${XP_VALUES.quiz1} XP`);
        setCompletedTasks(prev => ({ ...prev, passQuiz1: true }));
        setTimeout(() => {
          setCurrentScene('quiz2');
          setSelectedAnswer(null);
          setShowFeedback(false);
          setWizardMessage("Next challenge: What geometric shape has exactly two endpoints?");
        }, 2000);
      } else if (quizNumber === 2) {
        setEarnedXP(prev => ({ ...prev, quiz: prev.quiz + XP_VALUES.quiz2 }));
        setWizardMessage(`Splendid! A line segment indeed has two endpoints! +${XP_VALUES.quiz2} XP`);
        setCompletedTasks(prev => ({ ...prev, passQuiz2: true }));
        setTimeout(() => {
          setCurrentScene('quiz3');
          setSelectedAnswer(null);
          setShowFeedback(false);
          setWizardMessage("Final question: Which shape starts at one point and extends infinitely?");
        }, 2000);
      } else if (quizNumber === 3) {
        setEarnedXP(prev => ({ ...prev, quiz: prev.quiz + XP_VALUES.quiz3 }));
        setWizardMessage(`Excellent! A ray starts at a point and goes on forever! +${XP_VALUES.quiz3} XP`);
        setCompletedTasks(prev => ({ ...prev, passQuiz3: true }));
        setTimeout(() => {
          setCurrentScene('reward');
          setWizardMessage("The first spark of geometry is yours. Carry it, for it will guide you through the paths ahead.");
        }, 2000);
      }
    } else {
      setWizardMessage("⚠️ Not quite right. Think carefully about the definition.");
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);
        if (quizNumber === 1) setWizardMessage("Try again! Which shape extends forever in both directions?");
        else if (quizNumber === 2) setWizardMessage("Try again! Which shape has two endpoints?");
        else if (quizNumber === 3) setWizardMessage("Try again! Which shape has one endpoint and extends infinitely?");
      }, 2500);
    }
  };

  const handleComplete = () => {
    if (audioRef.current) audioRef.current.pause();
    router.push('/student/worldmap/castle1');
  };

  const handleExit = () => {
    if (audioRef.current) audioRef.current.pause();
    router.push('/student/worldmap/castle1');
  };

  const toggleAutoAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAutoAdvance(!autoAdvance);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const scaledPoints = getScaledPoints();

  return (
    <div className={styles.chapterContainer}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.topBar}>
        <div className={styles.chapterInfo}>
          <Sparkles className={styles.titleIcon} />
          <div>
            <h1 className={styles.chapterTitle}>Chapter 1: The Point of Origin</h1>
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
              { key: 'learnPoint', label: 'Learn: Point' },
              { key: 'learnLineSegment', label: 'Learn: Line Segment' },
              { key: 'learnRay', label: 'Learn: Ray' },
              { key: 'learnLine', label: 'Learn: Line' },
              { key: 'completeMinigame', label: 'Complete Practice' },
              { key: 'passQuiz1', label: 'Pass Quiz 1' },
              { key: 'passQuiz2', label: 'Pass Quiz 2' },
              { key: 'passQuiz3', label: 'Pass Quiz 3' }
            ].map(task => (
              <div key={task.key} className={`${styles.taskItem} ${completedTasks[task.key as keyof typeof completedTasks] ? styles.taskCompleted : ''}`}>
                <div className={styles.taskIconWrapper}>
                  {completedTasks[task.key as keyof typeof completedTasks] ? (
                    <CheckCircle size={18} className={styles.iconComplete} />
                  ) : (
                    <Lock size={18} className={styles.iconLocked} />
                  )}
                </div>
                <span className={styles.taskText}>{task.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.gameArea} ref={gameAreaRef}>
          {currentScene === 'opening' && (
            <div className={styles.sceneContent}>
              <div className={styles.observatoryView}>
                <div className={styles.doorPreview}>
                  <h2 className={styles.doorTitle}>The Three Paths Ahead</h2>
                  <div className={styles.doorGrid}>
                    {[
                      { label: 'Point of Origin', image: '/images/point-of-origin.png' },
                      { label: 'Paths of Power', image: '/images/paths-of-power.png' },
                      { label: 'Shapes of the Spire', image: '/images/shapes-of-the-spire.png' }
                    ].map((door, i) => (
                      <div key={i} className={styles.doorCard}>
                        <div className={styles.doorImageWrapper}>
                          <img src={door.image} alt={door.label} className={styles.doorImage} />
                        </div>
                        <span className={styles.doorLabel}>{door.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentScene === 'lesson' && (
            <div className={styles.lessonContent}>
              <div className={styles.conceptGrid}>
                {completedTasks.learnPoint && (
                  <div className={`${styles.conceptCard} ${styles.conceptUnlocked}`}>
                    <div className={styles.conceptVisual}>
                      <div className={styles.point}>
                        <span className={styles.pointDot}></span>
                      </div>
                    </div>
                    <h3 className={styles.conceptTitle}>Point</h3>
                    <p className={styles.conceptDesc}>A precise location in space</p>
                    <div className={styles.unlockBadge}>✓</div>
                  </div>
                )}
                
                {completedTasks.learnLineSegment && (
                  <div className={`${styles.conceptCard} ${styles.conceptUnlocked}`}>
                    <div className={styles.conceptVisual}>
                      <div className={styles.segment}>
                        <span className={styles.endpointLeft}></span>
                        <span className={styles.endpointRight}></span>
                      </div>
                    </div>
                    <h3 className={styles.conceptTitle}>Line Segment</h3>
                    <p className={styles.conceptDesc}>Connects two points with defined endpoints</p>
                    <div className={styles.unlockBadge}>✓</div>
                  </div>
                )}
                
                {completedTasks.learnRay && (
                  <div className={`${styles.conceptCard} ${styles.conceptUnlocked}`}>
                    <div className={styles.conceptVisual}>
                      <div className={styles.ray}>
                        <span className={styles.endpointLeft}></span>
                        <span className={styles.arrowhead}></span>
                      </div>
                    </div>
                    <h3 className={styles.conceptTitle}>Ray</h3>
                    <p className={styles.conceptDesc}>Starts at a point, extends infinitely in one direction</p>
                    <div className={styles.unlockBadge}>✓</div>
                  </div>
                )}
                
                {completedTasks.learnLine && (
                  <div className={`${styles.conceptCard} ${styles.conceptUnlocked}`}>
                    <div className={styles.conceptVisual}>
                      <div className={styles.line}>
                        <span className={styles.arrowheadLeft}></span>
                        <span className={styles.arrowheadRight}></span>
                      </div>
                    </div>
                    <h3 className={styles.conceptTitle}>Line</h3>
                    <p className={styles.conceptDesc}>Extends infinitely in both directions</p>
                    <div className={styles.unlockBadge}>✓</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentScene === 'minigame' && (
            <div className={styles.minigameContent}>
              <div className={styles.minigameCard}>
                <div className={styles.minigameHeader}>
                  <h3 className={styles.minigameTitle}>Connect the Points</h3>
                  <p className={styles.minigameInstruction}>
                    {minigameQuestions[currentQuestion].instruction}
                  </p>
                </div>
                
                <div className={styles.minigameCanvas} ref={canvasContainerRef}>
                  <Stage
                    width={stageSize.width}
                    height={stageSize.height}
                    onMouseMove={handleMouseMove}
                    onMouseUp={() => {
                      setIsDragging(false);
                      setDragStart(null);
                      setMousePos(null);
                    }}
                  >
                    <Layer>
                      {/* Draw temporary drag line */}
                      {isDragging && dragStart && mousePos && (() => {
                        const startPoint = scaledPoints.find(p => p.id === dragStart);
                        if (startPoint) {
                          return (
                            <Line
                              points={[startPoint.x, startPoint.y, mousePos.x, mousePos.y]}
                              stroke="#66BBFF"
                              strokeWidth={2}
                              dash={[5, 5]}
                              opacity={0.6}
                            />
                          );
                        }
                      })()}

                      {/* Draw connection */}
                      {renderConnection()}

                      {/* Draw points */}
                      {scaledPoints.map(point => (
                        <React.Fragment key={point.id}>
                          <Circle
                            x={point.x}
                            y={point.y}
                            radius={selectedPoints.includes(point.id) || dragStart === point.id ? 10 : 8}
                            fill={selectedPoints.includes(point.id) || dragStart === point.id ? "#66BBFF" : "#4FC3F7"}
                            stroke="#66BBFF"
                            strokeWidth={2}
                            shadowBlur={selectedPoints.includes(point.id) || dragStart === point.id ? 15 : 8}
                            shadowColor="#66BBFF"
                            onMouseDown={() => handlePointMouseDown(point.id)}
                            onMouseUp={() => handlePointMouseUp(point.id)}
                            onClick={() => handlePointClick(point.id)}
                            onTouchStart={() => handlePointMouseDown(point.id)}
                            onTouchEnd={() => handlePointMouseUp(point.id)}
                          />
                          <Text
                            x={point.x}
                            y={point.y - 25}
                            text={point.label}
                            fontSize={18}
                            fontFamily="Cinzel"
                            fontStyle="bold"
                            fill="#66BBFF"
                            align="center"
                            width={40}
                            offsetX={20}
                          />
                        </React.Fragment>
                      ))}
                    </Layer>
                  </Stage>
                </div>

                <div className={styles.minigameProgress}>
                  Question {currentQuestion + 1} of {minigameQuestions.length}
                </div>
                
                {minigameFeedback && (
                  <div className={`${styles.minigameFeedback} ${
                    isFeedbackCorrect ? styles.feedbackCorrect : 
                    isFeedbackCorrect === false ? styles.feedbackIncorrect : ''
                  }`}>
                    {minigameFeedback}
                  </div>
                )}
              </div>
            </div>
          )}

          {currentScene === 'quiz1' && (
            <div className={styles.quizContent}>
              <div className={styles.quizCard}>
                <div className={styles.quizHeader}>
                  <h3 className={styles.quizQuestion}>
                    Which of these continues infinitely in <strong>both directions</strong>?
                  </h3>
                </div>
                <div className={styles.answerGrid}>
                  {[
                    { label: 'A', text: 'Ray', type: 'ray' },
                    { label: 'B', text: 'Line Segment', type: 'segment' },
                    { label: 'C', text: 'Line', type: 'line' }
                  ].map(answer => (
                    <button
                      key={answer.label}
                      className={`${styles.answerButton} ${selectedAnswer === answer.label ? (isCorrect ? styles.answerCorrect : styles.answerIncorrect) : ''}`}
                      onClick={() => handleAnswerSelect(answer.label, 'C', 1)}
                      disabled={showFeedback}
                    >
                      <span className={styles.answerLabel}>{answer.label}</span>
                      <div className={styles.answerContent}>
                        <span className={styles.answerText}>{answer.text}</span>
                        <div className={styles.visualPreview}>
                          <div className={styles[answer.type]}>
                            {answer.type === 'segment' && (
                              <>
                                <span className={styles.endpointLeft}></span>
                                <span className={styles.endpointRight}></span>
                              </>
                            )}
                            {answer.type === 'ray' && (
                              <>
                                <span className={styles.endpointLeft}></span>
                                <span className={styles.arrowhead}></span>
                              </>
                            )}
                            {answer.type === 'line' && (
                              <>
                                <span className={styles.arrowheadLeft}></span>
                                <span className={styles.arrowheadRight}></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScene === 'quiz2' && (
            <div className={styles.quizContent}>
              <div className={styles.quizCard}>
                <div className={styles.quizHeader}>
                  <h3 className={styles.quizQuestion}>
                    What geometric shape has exactly <strong>two endpoints</strong>?
                  </h3>
                </div>
                <div className={styles.answerGrid}>
                  {[
                    { label: 'A', text: 'Point', type: 'point' },
                    { label: 'B', text: 'Line Segment', type: 'segment' },
                    { label: 'C', text: 'Ray', type: 'ray' }
                  ].map(answer => (
                    <button
                      key={answer.label}
                      className={`${styles.answerButton} ${selectedAnswer === answer.label ? (isCorrect ? styles.answerCorrect : styles.answerIncorrect) : ''}`}
                      onClick={() => handleAnswerSelect(answer.label, 'B', 2)}
                      disabled={showFeedback}
                    >
                      <span className={styles.answerLabel}>{answer.label}</span>
                      <div className={styles.answerContent}>
                        <span className={styles.answerText}>{answer.text}</span>
                        <div className={styles.visualPreview}>
                          <div className={styles[answer.type]}>
                            {answer.type === 'point' && <span className={styles.pointDot}></span>}
                            {answer.type === 'segment' && (
                              <>
                                <span className={styles.endpointLeft}></span>
                                <span className={styles.endpointRight}></span>
                              </>
                            )}
                            {answer.type === 'ray' && (
                              <>
                                <span className={styles.endpointLeft}></span>
                                <span className={styles.arrowhead}></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentScene === 'quiz3' && (
            <div className={styles.quizContent}>
              <div className={styles.quizCard}>
                <div className={styles.quizHeader}>
                  <h3 className={styles.quizQuestion}>
                    Which shape starts at <strong>one point</strong> and extends <strong>infinitely</strong>?
                  </h3>
                </div>
                <div className={styles.answerGrid}>
                  {[
                    { label: 'A', text: 'Line', type: 'line' },
                    { label: 'B', text: 'Ray', type: 'ray' },
                    { label: 'C', text: 'Line Segment', type: 'segment' }
                  ].map(answer => (
                    <button
                      key={answer.label}
                      className={`${styles.answerButton} ${selectedAnswer === answer.label ? (isCorrect ? styles.answerCorrect : styles.answerIncorrect) : ''}`}
                      onClick={() => handleAnswerSelect(answer.label, 'B', 3)}
                      disabled={showFeedback}
                    >
                      <span className={styles.answerLabel}>{answer.label}</span>
                      <div className={styles.answerContent}>
                        <span className={styles.answerText}>{answer.text}</span>
                        <div className={styles.visualPreview}>
                          <div className={styles[answer.type]}>
                            {answer.type === 'line' && (
                              <>
                                <span className={styles.arrowheadLeft}></span>
                                <span className={styles.arrowheadRight}></span>
                              </>
                            )}
                            {answer.type === 'ray' && (
                              <>
                                <span className={styles.endpointLeft}></span>
                                <span className={styles.arrowhead}></span>
                              </>
                            )}
                            {answer.type === 'segment' && (
                              <>
                                <span className={styles.endpointLeft}></span>
                                <span className={styles.endpointRight}></span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
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
                    src="/images/pointlight-crystal.png" 
                    alt="Pointlight Crystal" 
                    className={styles.relicIcon} 
                  />
                </div>
                <h3 className={styles.rewardName}>Pointlight Crystal</h3>
                <p className={styles.rewardDescription}>The first spark of geometry is yours!</p>
              </div>
              <div className={styles.rewardStats}>
                <div className={styles.statBox}>
                  <Star className={styles.statIcon} />
                  <div className={styles.statBreakdown}>
                    <span className={styles.statValue}>+{earnedXP.lesson + earnedXP.minigame + earnedXP.quiz} XP</span>
                    <span className={styles.statDetail}>
                      Lesson: {earnedXP.lesson} • Practice: {earnedXP.minigame} • Quizzes: {earnedXP.quiz}
                    </span>
                  </div>
                </div>
                <div className={styles.statBox}>
                  <Award className={styles.statIcon} />
                  <span className={styles.statValue}>8/8 Tasks</span>
                </div>
              </div>
              <button className={styles.returnButton} onClick={handleComplete}>
                <span>Return to Castle</span>
                <ChevronRight size={20} />
              </button>
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
                  <p>{displayedText}</p>
                </div>
              </div>
              {!isTyping && currentScene !== 'minigame' && (
                <div className={styles.continuePrompt}>
                  <span>Click to continue</span>
                  <ChevronRight size={16} className={styles.chevronBounce} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}