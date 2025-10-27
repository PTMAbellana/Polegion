"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AuthProtection } from '@/context/AuthProtection';
import Loader from '@/components/Loader';
import styles from '@/styles/castle1.module.css';

interface ChapterProgress {
  id: string;
  chapter_id: string;
  unlocked: boolean;
  completed: boolean;
  xp_earned: number;
  quiz_passed: boolean;
  started_at?: string;
  completed_at?: string;
}

interface Chapter {
  id: string;
  castle_id: string;
  title: string;
  description: string;
  chapter_number: number;
  xp_reward: number;
  progress?: ChapterProgress;
}

interface CastleProgress {
  id: string;
  castle_id: string;
  unlocked: boolean;
  completed: boolean;
  total_xp_earned: number;
  completion_percentage: number;
  started_at?: string;
  completed_at?: string;
}

const CASTLE_INFO = {
  id: 'castle1',
  name: 'Euclidean Spire',
  region: 'Northern Peaks',
  theme: 'Birth of Geometry – Points, Lines, and Angles',
  guide: 'Archim (Wizard of Origins)',
  description: 'Welcome to the Euclidean Spire, where geometry begins. Master the fundamentals of points, lines, and angles under the guidance of Archim, the ancient Wizard of Origins.',
  imageNumber: 1,
  chapters: [
    {
      number: 1,
      title: 'The Point of Origin',
      description: 'Discover the fundamental building blocks: points, lines, rays, and line segments.',
      topics: ['Points', 'Lines', 'Rays', 'Line Segments'],
      minigame: 'Dot Dash',
      route: 'chapter1',
      icon: '📍'
    },
    {
      number: 2,
      title: 'Paths of Light',
      description: 'Explore the relationships between lines: parallel, intersecting, perpendicular, and skew.',
      topics: ['Parallel Lines', 'Intersecting Lines', 'Perpendicular Lines', 'Skew Lines'],
      minigame: 'Laser Paths',
      route: 'chapter2',
      icon: '✨'
    },
    {
      number: 3,
      title: 'Angles Awaken',
      description: 'Master the art of angles: types, naming conventions, and measurement techniques.',
      topics: ['Angle Types', 'Naming Angles', 'Measuring Angles', 'Protractor Usage'],
      minigame: 'Angle Forge',
      route: 'chapter3',
      icon: '📐'
    }
  ]
};

export default function Castle1Page() {
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const { isLoading: authLoading } = AuthProtection();

  const [loading, setLoading] = useState(true);
  const [castleProgress, setCastleProgress] = useState<CastleProgress | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [showGuideDialog, setShowGuideDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && userProfile) {
      initializeCastle();
    }
  }, [authLoading, userProfile]);

  const initializeCastle = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/castles/${CASTLE_INFO.id}/progress`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // const data = await response.json();

      // Mock data for now
      const mockCastleProgress: CastleProgress = {
        id: '1',
        castle_id: 'castle1',
        unlocked: true,
        completed: false,
        total_xp_earned: 150,
        completion_percentage: 33,
        started_at: new Date().toISOString()
      };

      const mockChapters: Chapter[] = [
        {
          id: 'ch1',
          castle_id: 'castle1',
          title: 'The Point of Origin',
          description: 'Points, lines, rays, and line segments',
          chapter_number: 1,
          xp_reward: 100,
          progress: {
            id: 'p1',
            chapter_id: 'ch1',
            unlocked: true,
            completed: true,
            xp_earned: 100,
            quiz_passed: true,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          }
        },
        {
          id: 'ch2',
          castle_id: 'castle1',
          title: 'Paths of Light',
          description: 'Parallel, intersecting, perpendicular, and skew lines',
          chapter_number: 2,
          xp_reward: 150,
          progress: {
            id: 'p2',
            chapter_id: 'ch2',
            unlocked: true,
            completed: false,
            xp_earned: 50,
            quiz_passed: false,
            started_at: new Date().toISOString()
          }
        },
        {
          id: 'ch3',
          castle_id: 'castle1',
          title: 'Angles Awaken',
          description: 'Types of angles, naming, and measuring',
          chapter_number: 3,
          xp_reward: 200,
          progress: {
            id: 'p3',
            chapter_id: 'ch3',
            unlocked: false,
            completed: false,
            xp_earned: 0,
            quiz_passed: false
          }
        }
      ];

      setCastleProgress(mockCastleProgress);
      setChapters(mockChapters);
      
      // Show guide dialog on first visit
      const hasSeenGuide = localStorage.getItem('castle1_guide_seen');
      if (!hasSeenGuide) {
        setTimeout(() => setShowGuideDialog(true), 1000);
      }
    } catch (error) {
      console.error('Error initializing castle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChapterClick = (chapterNumber: number) => {
    const chapter = chapters.find(ch => ch.chapter_number === chapterNumber);
    
    if (!chapter?.progress?.unlocked) {
      return;
    }

    if (selectedChapter === chapterNumber) {
      router.push(`/student/worldmap/castle1/${CASTLE_INFO.chapters[chapterNumber - 1].route}`);
    } else {
      setSelectedChapter(chapterNumber);
    }
  };

  const handleBackToMap = () => {
    router.push('/student/worldmap');
  };

  const handleGuideClose = () => {
    setShowGuideDialog(false);
    localStorage.setItem('castle1_guide_seen', 'true');
  };

  if (authLoading || loading) {
    return (
      <div className={styles.loading_container}>
        <Loader />
        <p>Loading Euclidean Spire...</p>
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className={styles.error_container}>
        <h2>Access Denied</h2>
        <p>Please log in to access this castle.</p>
      </div>
    );
  }

  const totalXP = CASTLE_INFO.chapters.reduce((sum, ch) => sum + (chapters[ch.number - 1]?.xp_reward || 0), 0);
  const earnedXP = castleProgress?.total_xp_earned || 0;
  const completedChapters = chapters.filter(ch => ch.progress?.completed).length;

  return (
    <div className={styles.castle_container}>
      {/* Background */}
      <div 
        className={styles.castle_background}
        style={{
          backgroundImage: `url('/images/${CASTLE_INFO.imageNumber}-background.png')`,
        }}
      />

      {/* Header */}
      <header className={styles.castle_header}>
        <button className={styles.back_button} onClick={handleBackToMap}>
          ← Back to Map
        </button>

        <div className={styles.castle_title_section}>
          <h1 className={styles.castle_title}>🏰 {CASTLE_INFO.name}</h1>
          <p className={styles.castle_region}>📍 {CASTLE_INFO.region}</p>
          <p className={styles.castle_theme}>📜 {CASTLE_INFO.theme}</p>
        </div>

        <button 
          className={styles.guide_button}
          onClick={() => setShowGuideDialog(true)}
        >
          🧙‍♂️ Meet {CASTLE_INFO.guide.split(' ')[0]}
        </button>
      </header>

      {/* Progress Overview */}
      <section className={styles.progress_overview}>
        <div className={styles.progress_card}>
          <div className={styles.progress_stat}>
            <span className={styles.stat_icon}>⭐</span>
            <div className={styles.stat_content}>
              <div className={styles.stat_label}>XP Earned</div>
              <div className={styles.stat_value}>{earnedXP} / {totalXP}</div>
            </div>
          </div>

          <div className={styles.progress_stat}>
            <span className={styles.stat_icon}>📚</span>
            <div className={styles.stat_content}>
              <div className={styles.stat_label}>Chapters</div>
              <div className={styles.stat_value}>{completedChapters} / {CASTLE_INFO.chapters.length}</div>
            </div>
          </div>

          <div className={styles.progress_stat}>
            <span className={styles.stat_icon}>🎯</span>
            <div className={styles.stat_content}>
              <div className={styles.stat_label}>Progress</div>
              <div className={styles.stat_value}>{castleProgress?.completion_percentage || 0}%</div>
            </div>
          </div>
        </div>

        <div className={styles.progress_bar_container}>
          <div className={styles.progress_bar}>
            <div 
              className={styles.progress_fill}
              style={{ width: `${castleProgress?.completion_percentage || 0}%` }}
            />
          </div>
        </div>
      </section>

      {/* Chapters Grid */}
      <main className={styles.chapters_grid}>
        {CASTLE_INFO.chapters.map((chapterInfo, index) => {
          const chapter = chapters.find(ch => ch.chapter_number === chapterInfo.number);
          const progress = chapter?.progress;
          const isUnlocked = progress?.unlocked || false;
          const isCompleted = progress?.completed || false;
          const isSelected = selectedChapter === chapterInfo.number;

          return (
            <div
              key={chapterInfo.number}
              className={`${styles.chapter_card} ${
                isUnlocked ? styles.unlocked : styles.locked
              } ${isCompleted ? styles.completed : ''} ${
                isSelected ? styles.selected : ''
              }`}
              onClick={() => handleChapterClick(chapterInfo.number)}
            >
              {/* Chapter Number Badge */}
              <div className={styles.chapter_badge}>
                <span className={styles.chapter_number}>{chapterInfo.number}</span>
              </div>

              {/* Lock/Completion Indicator */}
              {!isUnlocked && (
                <div className={styles.lock_overlay}>
                  <span className={styles.lock_icon}>🔒</span>
                </div>
              )}

              {isCompleted && (
                <div className={styles.completion_badge}>
                  <span>✅</span>
                </div>
              )}

              {/* Chapter Icon */}
              <div className={styles.chapter_icon}>
                <span>{chapterInfo.icon}</span>
              </div>

              {/* Chapter Info */}
              <div className={styles.chapter_info}>
                <h3 className={styles.chapter_title}>{chapterInfo.title}</h3>
                <p className={styles.chapter_description}>{chapterInfo.description}</p>

                {/* Topics */}
                <div className={styles.chapter_topics}>
                  {chapterInfo.topics.map((topic, i) => (
                    <span key={i} className={styles.topic_tag}>
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Minigame */}
                <div className={styles.minigame_info}>
                  <span className={styles.minigame_icon}>🎮</span>
                  <span className={styles.minigame_name}>{chapterInfo.minigame}</span>
                </div>

                {/* XP Reward */}
                <div className={styles.xp_reward}>
                  <span className={styles.xp_icon}>⭐</span>
                  <span className={styles.xp_amount}>{chapter?.xp_reward || 0} XP</span>
                </div>

                {/* Progress Bar for Unlocked Chapters */}
                {isUnlocked && !isCompleted && (
                  <div className={styles.chapter_progress}>
                    <div className={styles.chapter_progress_bar}>
                      <div 
                        className={styles.chapter_progress_fill}
                        style={{ 
                          width: `${progress?.xp_earned ? (progress.xp_earned / (chapter?.xp_reward || 1)) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <p className={styles.chapter_progress_text}>
                      {progress?.xp_earned || 0} / {chapter?.xp_reward || 0} XP
                    </p>
                  </div>
                )}
              </div>

              {/* Enter Button */}
              {isSelected && isUnlocked && (
                <button className={styles.enter_chapter_button}>
                  {isCompleted ? 'Replay Chapter' : 'Continue Chapter'} →
                </button>
              )}
            </div>
          );
        })}
      </main>

      {/* Guide Dialog */}
      {showGuideDialog && (
        <div className={styles.dialog_overlay} onClick={handleGuideClose}>
          <div className={styles.dialog_content} onClick={(e) => e.stopPropagation()}>
            <button className={styles.dialog_close} onClick={handleGuideClose}>
              ×
            </button>

            <div className={styles.guide_section}>
              <div className={styles.guide_avatar}>
                <span className={styles.guide_emoji}>🧙‍♂️</span>
              </div>

              <h2 className={styles.guide_title}>Greetings, Young Scholar!</h2>
              <p className={styles.guide_subtitle}>I am {CASTLE_INFO.guide}</p>

              <div className={styles.guide_message}>
                <p>
                  Welcome to the <strong>Euclidean Spire</strong>, where your journey into the realm of geometry begins! 
                  Here, you will master the fundamental concepts that form the foundation of all geometric knowledge.
                </p>
                <p>
                  Each chapter contains lessons, interactive exercises, and a mini-game to test your skills. 
                  Complete all chapters to unlock the next castle in your adventure!
                </p>
                <p>
                  <strong>Remember:</strong> Understanding comes with practice. Take your time, explore each concept 
                  thoroughly, and don't hesitate to revisit chapters if needed.
                </p>
              </div>

              <div className={styles.guide_tips}>
                <h3>📚 Quick Tips:</h3>
                <ul>
                  <li>✅ Complete chapters in order to unlock the next one</li>
                  <li>🎮 Play mini-games to earn bonus XP</li>
                  <li>📝 Pass the chapter quiz to proceed</li>
                  <li>⭐ Collect XP to track your progress</li>
                </ul>
              </div>

              <button className={styles.guide_start_button} onClick={handleGuideClose}>
                Begin My Journey! 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}