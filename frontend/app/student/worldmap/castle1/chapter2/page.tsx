"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import styles from '@/styles/castle1.module.css';

const CHAPTER_INFO = {
  number: 2,
  title: 'Paths of Light',
  description: 'Master the relationships between lines: parallel, intersecting, perpendicular, and skew.',
  icon: '✨',
  xp_reward: 150,
  lessons: [
    {
      id: 1,
      title: 'Parallel Lines',
      content: 'Parallel lines are lines in the same plane that never intersect, no matter how far they are extended. They maintain the same distance apart at all points.',
      examples: [
        'Railroad tracks are parallel',
        'Symbol: || (parallel symbol)',
        'Same slope in coordinate geometry',
        'Always in the same plane (coplanar)'
      ]
    },
    {
      id: 2,
      title: 'Intersecting Lines',
      content: 'Intersecting lines are lines that cross at exactly one point. This point of intersection is shared by both lines.',
      examples: [
        'Lines meet at a single point',
        'Form angles at intersection',
        'Can intersect at any angle',
        'Streets at a crossroad intersect'
      ]
    },
    {
      id: 3,
      title: 'Perpendicular Lines',
      content: 'Perpendicular lines are special intersecting lines that meet at a right angle (90°). They form four right angles at their intersection.',
      examples: [
        'Symbol: ⊥ (perpendicular symbol)',
        'Form 90° angles',
        'Create four right angles',
        'Corners of squares are perpendicular'
      ]
    },
    {
      id: 4,
      title: 'Skew Lines',
      content: 'Skew lines are lines that do not intersect and are not parallel. They exist in different planes and never meet.',
      examples: [
        'Not in the same plane (non-coplanar)',
        'Common in 3D geometry',
        'Never intersect or parallel',
        'Example: edges of a cube that don\'t touch'
      ]
    }
  ]
};

export default function Chapter2Page() {
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

  // Laser Paths Minigame State
  const [minigameScore, setMinigameScore] = useState(0);
  const [minigameLevel, setMinigameLevel] = useState(1);
  const [laserPath, setLaserPath] = useState<{x: number, y: number}[]>([]);
  const [mirrors, setMirrors] = useState<{x: number, y: number, angle: number}[]>([]);
  const [targetReached, setTargetReached] = useState(false);
  const [laserStart] = useState({ x: 50, y: 200 });
  const [laserTarget] = useState({ x: 450, y: 200 });

  useEffect(() => {
    if (!authLoading && userProfile) {
      initializeChapter();
    }
  }, [authLoading, userProfile]);

  useEffect(() => {
    if (showMinigame) {
      generateLaserLevel();
    }
  }, [minigameLevel, showMinigame]);

  const initializeChapter = async () => {
    try {
      setLoading(true);
      setLessonComplete(new Array(CHAPTER_INFO.lessons.length).fill(false));
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
      0: 'b', // Parallel lines
      1: 'a', // Intersecting lines
      2: 'c', // Perpendicular angle
      3: 'b', // Skew lines
      4: 'd'  // Parallel symbol
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
      setTimeout(() => {
        setShowQuiz(false);
        setShowMinigame(true);
      }, 3000);
    }
  };

  const generateLaserLevel = () => {
    // Generate random mirror positions for the level
    const levelMirrors: {x: number, y: number, angle: number}[] = [];
    const numMirrors = minigameLevel + 1;

    for (let i = 0; i < numMirrors; i++) {
      levelMirrors.push({
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
        angle: Math.floor(Math.random() * 4) * 45 // 0, 45, 90, 135
      });
    }

    setMirrors(levelMirrors);
    setLaserPath([laserStart]);
    setTargetReached(false);
  };

  const handleMirrorRotate = (index: number) => {
    const newMirrors = [...mirrors];
    newMirrors[index].angle = (newMirrors[index].angle + 45) % 180;
    setMirrors(newMirrors);
    calculateLaserPath(newMirrors);
  };

  const calculateLaserPath = (currentMirrors: {x: number, y: number, angle: number}[]) => {
    // Simplified laser path calculation
    const path = [laserStart];
    let currentPos = {...laserStart};
    let currentAngle = 0; // Starting horizontal

    // Simple simulation - in real game, would use proper reflection physics
    currentMirrors.forEach(mirror => {
      path.push({x: mirror.x, y: mirror.y});
      currentPos = {x: mirror.x, y: mirror.y};
    });

    // Check if path reaches target (simplified)
    const lastPoint = path[path.length - 1];
    const distanceToTarget = Math.sqrt(
      Math.pow(lastPoint.x - laserTarget.x, 2) + 
      Math.pow(lastPoint.y - laserTarget.y, 2)
    );

    if (distanceToTarget < 50) {
      path.push(laserTarget);
      setTargetReached(true);
      setMinigameScore(minigameScore + 20);
    }

    setLaserPath(path);
  };

  const handleNextLevel = () => {
    if (targetReached) {
      setMinigameLevel(minigameLevel + 1);
      setTargetReached(false);
    }
  };

  const handleMinigameComplete = () => {
    router.push('/student/worldmap/castle1');
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading Chapter 2...</p>
      </div>
    );
  }

  const lesson = CHAPTER_INFO.lessons[currentLesson];

  return (
    <div className={styles.chapter_container}>
      <div className={styles.chapter_background} />

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

      <main className={styles.chapter_content}>
        {!showQuiz && !showMinigame && (
          <div className={styles.lesson_container}>
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

            <div className={styles.lesson_card}>
              <div className={styles.lesson_header}>
                <span className={styles.lesson_number}>Lesson {currentLesson + 1}</span>
                <h2 className={styles.lesson_title}>{lesson.title}</h2>
              </div>

              <div className={styles.lesson_body}>
                <div className={styles.visual_container}>
                  {currentLesson === 0 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <line x1="50" y1="80" x2="350" y2="80" stroke="#5a3e2b" strokeWidth="3" />
                      <line x1="50" y1="120" x2="350" y2="120" stroke="#5a3e2b" strokeWidth="3" />
                      <text x="370" y="85" fill="#5a3e2b" fontSize="20">||</text>
                      <text x="200" y="60" textAnchor="middle" fill="#e74c3c" fontSize="16" fontWeight="bold">
                        Never Intersect
                      </text>
                    </svg>
                  )}
                  
                  {currentLesson === 1 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <line x1="50" y1="50" x2="350" y2="150" stroke="#5a3e2b" strokeWidth="3" />
                      <line x1="50" y1="150" x2="350" y2="50" stroke="#3498db" strokeWidth="3" />
                      <circle cx="200" cy="100" r="8" fill="#e74c3c" />
                      <text x="220" y="105" fill="#e74c3c" fontSize="16" fontWeight="bold">
                        Intersection Point
                      </text>
                    </svg>
                  )}

                  {currentLesson === 2 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 200">
                      <line x1="200" y1="50" x2="200" y2="150" stroke="#5a3e2b" strokeWidth="3" />
                      <line x1="100" y1="100" x2="300" y2="100" stroke="#3498db" strokeWidth="3" />
                      <circle cx="200" cy="100" r="8" fill="#e74c3c" />
                      <path d="M 200,100 L 220,100 L 220,120 L 200,120" fill="none" stroke="#e74c3c" strokeWidth="2" />
                      <text x="230" y="115" fill="#e74c3c" fontSize="16" fontWeight="bold">90°</text>
                    </svg>
                  )}

                  {currentLesson === 3 && (
                    <svg className={styles.geometry_svg} viewBox="0 0 400 300">
                      {/* 3D-ish representation */}
                      <line x1="100" y1="200" x2="300" y2="200" stroke="#5a3e2b" strokeWidth="3" />
                      <line x1="150" y1="80" x2="250" y2="120" stroke="#3498db" strokeWidth="3" strokeDasharray="5,5" />
                      <text x="200" y="50" textAnchor="middle" fill="#e74c3c" fontSize="14" fontWeight="bold">
                        Different Planes
                      </text>
                      <text x="200" y="230" textAnchor="middle" fill="#5a3e2b" fontSize="14">
                        Never Meet, Not Parallel
                      </text>
                    </svg>
                  )}
                </div>

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
                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>1. Parallel lines are lines that:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q0" value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 0: e.target.value })} />
                      <span>Always intersect</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q0" value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 0: e.target.value })} />
                      <span>Never intersect and are in the same plane</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q0" value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 0: e.target.value })} />
                      <span>Meet at right angles</span>
                    </label>
                  </div>
                </div>

                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>2. Intersecting lines meet at:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q1" value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 1: e.target.value })} />
                      <span>Exactly one point</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q1" value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 1: e.target.value })} />
                      <span>Multiple points</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q1" value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 1: e.target.value })} />
                      <span>Never meet</span>
                    </label>
                  </div>
                </div>

                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>3. Perpendicular lines form angles of:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q2" value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 2: e.target.value })} />
                      <span>45 degrees</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q2" value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 2: e.target.value })} />
                      <span>60 degrees</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q2" value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 2: e.target.value })} />
                      <span>90 degrees</span>
                    </label>
                  </div>
                </div>

                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>4. Skew lines are:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q3" value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 3: e.target.value })} />
                      <span>Always parallel</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q3" value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 3: e.target.value })} />
                      <span>Not parallel and do not intersect</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q3" value="c"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 3: e.target.value })} />
                      <span>Always perpendicular</span>
                    </label>
                  </div>
                </div>

                <div className={styles.quiz_question}>
                  <p className={styles.question_text}>5. The symbol || represents:</p>
                  <div className={styles.quiz_options}>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q4" value="a"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 4: e.target.value })} />
                      <span>Perpendicular lines</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q4" value="b"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 4: e.target.value })} />
                      <span>Intersecting lines</span>
                    </label>
                    <label className={styles.quiz_option}>
                      <input type="radio" name="q4" value="d"
                        onChange={(e) => setQuizAnswers({ ...quizAnswers, 4: e.target.value })} />
                      <span>Parallel lines</span>
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
                      ? 'You passed! Get ready for Laser Paths...'
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

        {/* Minigame: Laser Paths */}
        {showMinigame && (
          <div className={styles.minigame_container}>
            <div className={styles.minigame_card}>
              <h2 className={styles.minigame_title}>✨ Laser Paths Mini-Game</h2>
              <p className={styles.minigame_subtitle}>
                Rotate mirrors to guide the laser beam to the target!
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

              {targetReached && (
                <div className={styles.success_message}>
                  🎉 Target Reached! Click Next Level
                </div>
              )}

              <div className={styles.minigame_canvas}>
                <svg viewBox="0 0 500 400" className={styles.laser_canvas}>
                  {/* Laser Source */}
                  <circle cx={laserStart.x} cy={laserStart.y} r="15" fill="#e74c3c" />
                  <text x={laserStart.x} y={laserStart.y - 25} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                    START
                  </text>

                  {/* Target */}
                  <circle cx={laserTarget.x} cy={laserTarget.y} r="20" fill="none" stroke="#27ae60" strokeWidth="3" />
                  <circle cx={laserTarget.x} cy={laserTarget.y} r="10" fill="#27ae60" />
                  <text x={laserTarget.x} y={laserTarget.y + 35} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                    TARGET
                  </text>

                  {/* Mirrors */}
                  {mirrors.map((mirror, index) => (
                    <g key={index} onClick={() => handleMirrorRotate(index)} style={{ cursor: 'pointer' }}>
                      <line
                        x1={mirror.x - 25}
                        y1={mirror.y}
                        x2={mirror.x + 25}
                        y2={mirror.y}
                        stroke="#3498db"
                        strokeWidth="6"
                        transform={`rotate(${mirror.angle} ${mirror.x} ${mirror.y})`}
                      />
                      <circle cx={mirror.x} cy={mirror.y} r="30" fill="rgba(52, 152, 219, 0.2)" />
                    </g>
                  ))}

                  {/* Laser Path */}
                  {laserPath.length > 1 && laserPath.map((point, index) => {
                    if (index === 0) return null;
                    const prevPoint = laserPath[index - 1];
                    return (
                      <line
                        key={index}
                        x1={prevPoint.x}
                        y1={prevPoint.y}
                        x2={point.x}
                        y2={point.y}
                        stroke="#f39c12"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                        className={styles.laser_beam}
                      />
                    );
                  })}
                </svg>
              </div>

              <div className={styles.minigame_controls}>
                <button
                  className={styles.reset_button}
                  onClick={() => generateLaserLevel()}
                >
                  Reset Level
                </button>
                {targetReached && (
                  <button
                    className={styles.next_level_button}
                    onClick={handleNextLevel}
                  >
                    Next Level →
                  </button>
                )}
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
                  <li>Click mirrors to rotate them 45°</li>
                  <li>Guide the laser from START to TARGET</li>
                  <li>Use line relationships to solve puzzles</li>
                  <li>Complete 5 levels to finish!</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}