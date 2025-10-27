"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import styles from '@/styles/castle1.module.css';

interface Lesson {
  id: number;
  title: string;
  content: string;
  image?: string;
  examples: string[];
}

const CHAPTER_INFO = {
  number: 1,
  title: 'The Point of Origin',
  description: 'Master the fundamental building blocks of geometry: points, lines, rays, and line segments.',
  icon: '📍',
  xp_reward: 100,
  lessons: [
    {
      id: 1,
      title: 'What is a Point?',
      content: 'A point is the most basic element in geometry. It represents an exact location in space and has no size, width, or thickness. Points are named using capital letters.',
      examples: [
        'Point A represents a specific location',
        'Points are dimensionless (0D)',
        'Multiple points can exist in space',
        'Points are used to define lines and shapes'
      ]
    },
    {
      id: 2,
      title: 'Understanding Lines',
      content: 'A line extends infinitely in both directions. It has no endpoints and is perfectly straight. A line is named using any two points on it or with a single lowercase letter.',
      examples: [
        'Line AB extends forever in both directions',
        'Symbol: ↔ (arrows on both ends)',
        'Lines are one-dimensional (1D)',
        'Two points determine a unique line'
      ]
    },
    {
      id: 3,
      title: 'What are Rays?',
      content: 'A ray has one endpoint and extends infinitely in one direction. It is named by its endpoint first, followed by another point on the ray.',
      examples: [
        'Ray AB starts at A and goes through B',
        'Symbol: → (arrow on one end)',
        'The endpoint is always named first',
        'Rays are used to represent directions'
      ]
    },
    {
      id: 4,
      title: 'Line Segments',
      content: 'A line segment is part of a line with two endpoints. It has a definite length that can be measured. It is named by its two endpoints.',
      examples: [
        'Segment AB connects points A and B',
        'Symbol: ¯ (bar over the letters)',
        'Line segments have measurable length',
        'Used to create polygons and shapes'
      ]
    }
  ]
};

export default function Chapter1Page() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const { isLoading: authLoading } = AuthProtection();

  const [loading, setLoading] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showMinigame, setShowMinigame] = useState(false);
  const [lessonComplete, setLessonComplete] = useState<boolean[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Minigame state
  const [minigameScore, setMinigameScore] = useState(0);
  const [minigameLevel, setMinigameLevel] = useState(1);
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);
  const [targetPattern, setTargetPattern] = useState<string>('line');

  useEffect(() => {
    if (!authLoading && userProfile) {
      initializeChapter();
    }
  }, [authLoading, userProfile]);

  const initializeChapter = async () => {
    try {
      setLoading(true);
      // Initialize lesson completion tracking
      setLessonComplete(new Array(CHAPTER_INFO.lessons.length).fill(false));
      
      // TODO: Load progress from API
      // const progress = await fetchChapterProgress();
      
    } catch (error) {
      console.error('Error initializing chapter:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = () => {
    const newComplete = [...lessonComplete];
    newComplete[currentLesson] = true;
    setLessonComplete(newComplete);

    if (currentLesson < CHAPTER_INFO.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
    } else {
      setShowQuiz(true);
    }
  };

  const handleQuizSubmit = () => {
    let correctAnswers = 0;
    const correctAnswerKey: { [key: number]: string } = {
      0: 'b', // Point definition
      1: 'c', // Line extends
      2: 'a', // Ray endpoint
      3: 'b', // Line segment
      4: 'd'  // Naming convention
    };

    Object.keys(quizAnswers).forEach((key) => {
      if (quizAnswers[parseInt(key)] === correctAnswerKey[parseInt(key)]) {
        correctAnswers++;
      }
    });

    const percentage = (correctAnswers / 5) * 100;
    setScore(percentage);
    setQuizSubmitted(true);

    if (percentage >= 70) {
      // Quiz passed - show minigame
      setTimeout(() => {
        setShowQuiz(false);
        setShowMinigame(true);
      }, 3000);
    }
  };

  const handleMinigameComplete = () => {
    // TODO: Submit progress to backend
    router.push('/student/worldmap/castle1');
  };

  const handlePointClick = (pointId: string) => {
    if (selectedPoints.includes(pointId)) {
      setSelectedPoints(selectedPoints.filter(p => p !== pointId));
    } else if (selectedPoints.length < 2) {
      setSelectedPoints([...selectedPoints, pointId]);
    }

    // Check if pattern is correct
    if (selectedPoints.length === 1) {
      checkMinigamePattern([...selectedPoints, pointId]);
    }
  };

  const checkMinigamePattern = (points: string[]) => {
    const isCorrect = validatePattern(points, targetPattern);
    if (isCorrect) {
      setMinigameScore(minigameScore + 10);
      setMinigameLevel(minigameLevel + 1);
      setSelectedPoints([]);
      generateNewPattern();
    }
  };

  const validatePattern = (points: string[], pattern: string): boolean => {
    // Simple validation - you can enhance this
    return points.length === 2;
  };

  const generateNewPattern = () => {
    const patterns = ['line', 'ray', 'segment'];
    setTargetPattern(patterns[Math.floor(Math.random() * patterns.length)]);
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading Chapter 1...</p>
      </div>
    );
  }

  const lesson = CHAPTER_INFO.lessons[currentLesson];
  const allLessonsComplete = lessonComplete.every(complete => complete);

  return (
    <div className={styles.chapter_container}>
      {/* Background */}
      <div className={styles.chapter_background} />

      {/* Header */}
      <header className={styles.chapter_header}>
        <button 
          className={styles.back_button}
          onClick={() => router.push('/student/worldmap/castle1')}
        >
          ← Back to Castle
        </button>

        <div className={styles.chapter_title_section}>
          <h1 className={styles.chapter_title}>
            {CHAPTER_INFO.icon} {CHAPTER_INFO.title}
          </h1>
          <p className={styles.chapter_subtitle}>{CHAPTER_INFO.description}</p>
        </div>

        <div className={styles.chapter_progress_header}>
          <span className={styles.progress_text}>
            Lesson {currentLesson + 1} / {CHAPTER_INFO.lessons.length}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.chapter_content}>
        {!showQuiz && !showMinigame && (
          <div className={styles.lesson_container}>
            {/* Lesson Progress Dots */}
            <div className={styles.lesson_progress_dots}>
              {CHAPTER_INFO.lessons.map((_, index) => (
                <div
                  key={index}
                  className={`${styles.progress_dot} ${
                    index === currentLesson ? styles.active : ''
                  } ${lessonComplete[index] ? styles.completed : ''}`}
                  onClick={() => lessonComplete[index] && setCurrentLesson(index)}
                />
              ))}
            </div>

            {/* Lesson Content */}
            <div className={styles.lesson_card}>
              <div className={styles.lesson_header}>
                <span className={styles.lesson_number}>Lesson {currentLesson + 1}</span>
                <h2 className={styles.lesson_title}>{lesson.title}</h2>
              </div>

              <div className={styles.lesson_body}>
                {/* Visual Representation */}
                <div className={styles.visual_container}>
                  {currentLesson === 0 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <circle cx="200" cy="100" r="8" fill="#5a3e2b" />
                      <text x="200" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="20" fontWeight="bold">
                        A
                      </text>
                    </svg>
                  )}
                  
                  {currentLesson === 1 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <defs>
                        <marker id="arrowLeft" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto" markerUnits="strokeWidth">
                          <path d="M10,0 L10,6 L0,3 z" fill="#5a3e2b" />
                        </marker>
                        <marker id="arrowRight" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,6 L10,3 z" fill="#5a3e2b" />
                        </marker>
                      </defs>
                      <line x1="50" y1="100" x2="350" y2="100" stroke="#5a3e2b" strokeWidth="3" markerStart="url(#arrowLeft)" markerEnd="url(#arrowRight)" />
                      <circle cx="150" cy="100" r="6" fill="#e74c3c" />
                      <circle cx="250" cy="100" r="6" fill="#e74c3c" />
                      <text x="150" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="18" fontWeight="bold">A</text>
                      <text x="250" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="18" fontWeight="bold">B</text>
                    </svg>
                  )}

                  {currentLesson === 2 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <defs>
                        <marker id="rayArrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                          <path d="M0,0 L0,6 L10,3 z" fill="#5a3e2b" />
                        </marker>
                      </defs>
                      <line x1="100" y1="100" x2="350" y2="100" stroke="#5a3e2b" strokeWidth="3" markerEnd="url(#rayArrow)" />
                      <circle cx="100" cy="100" r="8" fill="#e74c3c" />
                      <circle cx="225" cy="100" r="6" fill="#3498db" />
                      <text x="100" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="18" fontWeight="bold">A</text>
                      <text x="225" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="18" fontWeight="bold">B</text>
                    </svg>
                  )}

                  {currentLesson === 3 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <line x1="100" y1="100" x2="300" y2="100" stroke="#5a3e2b" strokeWidth="3" />
                      <circle cx="100" cy="100" r="8" fill="#e74c3c" />
                      <circle cx="300" cy="100" r="8" fill="#e74c3c" />
                      <text x="100" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="18" fontWeight="bold">A</text>
                      <text x="300" y="130" textAnchor="middle" fill="#5a3e2b" fontSize="18" fontWeight="bold">B</text>
                    </svg>
                  )}
                </div>

                {/* Explanation */}
                <div className={styles.lesson_explanation}>
                  <p className={styles.lesson_text}>{lesson.content}</p>

                  <div className={styles.examples_section}>
                    <h3 className={styles.examples_title}>Key Points:</h3>
                    <ul className={styles.examples_list}>
                      {lesson.examples.map((example, index) => (
                        <li key={index} className={styles.example_item}>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className={styles.lesson_navigation}>
                {currentLesson > 0 && (
                  <button
                    className={styles.nav_button_prev}
                    onClick={() => setCurrentLesson(currentLesson - 1)}
                  >
                    ← Previous Lesson
                  </button>
                )}

                <button
                  className={styles.nav_button_next}
                  onClick={handleLessonComplete}
                >
                  {currentLesson === CHAPTER_INFO.lessons.length - 1
                    ? 'Take Quiz →'
                    : 'Next Lesson →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Section */}
        {showQuiz && !showMinigame && (
          <div className={styles.quiz_container}>
            <div className={styles.quiz_card}>
              <h2 className={styles.quiz_title}>📝 Chapter Quiz</h2>
              <p className={styles.quiz_subtitle}>Test your knowledge! Score 70% or higher to proceed.</p>

              <div className={styles.quiz_questions}>
                {/* Question 1 */}
                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>1. What is a point in geometry?</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q0"
                        value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 0: e.target.value })}
                      />
                      <span>A shape with area</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q0"
                        value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 0: e.target.value })}
                      />
                      <span>An exact location in space with no size</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q0"
                        value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 0: e.target.value })}
                      />
                      <span>A line segment</span>
                    </label>
                  </div>
                </div>

                {/* Question 2 */}
                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>2. A line extends:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q1"
                        value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 1: e.target.value })}
                      />
                      <span>In one direction only</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q1"
                        value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 1: e.target.value })}
                      />
                      <span>Has two endpoints</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q1"
                        value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 1: e.target.value })}
                      />
                      <span>Infinitely in both directions</span>
                    </label>
                  </div>
                </div>

                {/* Question 3 */}
                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>3. A ray has:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q2"
                        value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 2: e.target.value })}
                      />
                      <span>One endpoint and extends infinitely</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q2"
                        value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 2: e.target.value })}
                      />
                      <span>Two endpoints</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q2"
                        value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 2: e.target.value })}
                      />
                      <span>No endpoints</span>
                    </label>
                  </div>
                </div>

                {/* Question 4 */}
                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>4. Which has measurable length?</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q3"
                        value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 3: e.target.value })}
                      />
                      <span>A line</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q3"
                        value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 3: e.target.value })}
                      />
                      <span>A line segment</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q3"
                        value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 3: e.target.value })}
                      />
                      <span>A ray</span>
                    </label>
                  </div>
                </div>

                {/* Question 5 */}
                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>5. How do we name a line segment?</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q4"
                        value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 4: e.target.value })}
                      />
                      <span>Using one point</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q4"
                        value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 4: e.target.value })}
                      />
                      <span>Using arrows</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input
                        type="radio"
                        name="q4"
                        value="d"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 4: e.target.value })}
                      />
                      <span>Using its two endpoints</span>
                    </label>
                  </div>
                </div>
              </div>

              {!quizSubmitted ? (
                <button
                  className={styles.submit_quiz_button}
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(quizAnswers).length < 5}
                >
                  Submit Quiz
                </button>
              ) : (
                <div className={styles.quiz_results}>
                  <h3 className={styles.results_title}>
                    {score >= 70 ? '🎉 Congratulations!' : '😔 Try Again'}
                  </h3>
                  <p className={styles.results_score}>Your Score: {score}%</p>
                  <p className={styles.results_message}>
                    {score >= 70
                      ? 'You passed! Get ready for the mini-game...'
                      : 'You need 70% or higher. Review the lessons and try again.'}
                  </p>
                  {score < 70 && (
                    <button
                      className={styles.retry_button}
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                        setScore(0);
                      }}
                    >
                      Retry Quiz
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Minigame: Dot Dash */}
        {showMinigame && (
          <div className={styles.minigame_container}>
            <div className={styles.minigame_card}>
              <h2 className={styles.minigame_title}>🎮 Dot Dash Mini-Game</h2>
              <p className={styles.minigame_subtitle}>
                Connect the dots to create the requested geometric element!
              </p>

              <div className={styles.minigame_stats}>
                <div className={styles.minigame_stat}>
                  <span className={styles.stat_label}>Level:</span>
                  <span className={styles.stat_value}>{minigameLevel}</span>
                </div>
                <div className={styles.minigame_stat}>
                  <span className={styles.stat_label}>Score:</span>
                  <span className={styles.stat_value}>{minigameScore}</span>
                </div>
              </div>

              <div className={styles.minigame_target}>
                <p>Create a: <strong>{targetPattern.toUpperCase()}</strong></p>
              </div>

              <div className={styles.minigame_canvas}>
                <svg viewBox="0 0 500 400" className={styles.dot_canvas}>
                  {/* Grid of points */}
                  {[0, 1, 2, 3, 4].map((row) =>
                    [0, 1, 2, 3, 4].map((col) => {
                      const pointId = `${row}-${col}`;
                      const x = 100 + col * 80;
                      const y = 80 + row * 80;
                      const isSelected = selectedPoints.includes(pointId);

                      return (
                        <g key={pointId}>
                          <circle
                            cx={x}
                            cy={y}
                            r="12"
                            fill={isSelected ? '#e74c3c' : '#5a3e2b'}
                            className={styles.dot_point}
                            onClick={() => handlePointClick(pointId)}
                            style={{ cursor: 'pointer' }}
                          />
                          {isSelected && (
                            <circle
                              cx={x}
                              cy={y}
                              r="18"
                              fill="none"
                              stroke="#e74c3c"
                              strokeWidth="2"
                              className={styles.dot_pulse}
                            />
                          )}
                        </g>
                      );
                    })
                  )}

                  {/* Draw line between selected points */}
                  {selectedPoints.length === 2 && (
                    <line
                      x1={100 + parseInt(selectedPoints[0].split('-')[1]) * 80}
                      y1={80 + parseInt(selectedPoints[0].split('-')[0]) * 80}
                      x2={100 + parseInt(selectedPoints[1].split('-')[1]) * 80}
                      y2={80 + parseInt(selectedPoints[1].split('-')[0]) * 80}
                      stroke="#3498db"
                      strokeWidth="3"
                      className={styles.connecting_line}
                    />
                  )}
                </svg>
              </div>

              <div className={styles.minigame_controls}>
                <button
                  className={styles.reset_button}
                  onClick={() => setSelectedPoints([])}
                >
                  Reset
                </button>
                {minigameLevel > 5 && (
                  <button
                    className={styles.complete_button}
                    onClick={handleMinigameComplete}
                  >
                    Complete Chapter! 🎉
                  </button>
                )}
              </div>

              <div className={styles.minigame_instructions}>
                <h4>How to Play:</h4>
                <ul>
                  <li>Click on two dots to connect them</li>
                  <li>Create the requested geometric element</li>
                  <li>Complete 5 levels to finish!</li>
                  <li>Earn points for each correct pattern</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}