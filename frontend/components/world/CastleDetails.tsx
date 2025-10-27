'use client';

import React, { useState } from 'react';
import type { CastleWithProgress, ChapterWithProgress } from '@/types/castle.types';
import { useAuthStore } from '@/store/authStore';
import { completeChapter, updateQuizStatus } from '@/api/chapters';
import styles from '@/styles/castle.module.css';

interface CastleDetailsProps {
  castle: CastleWithProgress;
  chapters: ChapterWithProgress[];
  loading: boolean;
  onClose: () => void;
  onChapterComplete: () => void;
}

export default function CastleDetails({
  castle,
  chapters,
  loading,
  onClose,
  onChapterComplete
}: CastleDetailsProps) {
  // Follow the pattern - use userProfile
  const { userProfile } = useAuthStore();
  const userId = userProfile?.id;
  
  const [selectedChapter, setSelectedChapter] = useState<ChapterWithProgress | null>(null);
  const [working, setWorking] = useState(false);

  if (!castle) return null;

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleChapterClick = (chapter: ChapterWithProgress) => {
    if (!chapter.progress || !chapter.progress.unlocked) {
      alert('This chapter is locked. Complete previous chapters first!');
      return;
    }
    setSelectedChapter(chapter);
  };

  const handleBack = () => {
    setSelectedChapter(null);
  };

  const handleComplete = async () => {
    if (!selectedChapter || !userId) {
      alert('You must be logged in to complete chapters');
      return;
    }

    try {
      setWorking(true);
      await completeChapter(selectedChapter.id, userId, selectedChapter.xp_reward);
      alert(`Chapter completed! You earned ${selectedChapter.xp_reward} XP`);
      onChapterComplete();
      setSelectedChapter(null);
    } catch (error) {
      console.error('Error completing chapter:', error);
      alert('Failed to complete chapter');
    } finally {
      setWorking(false);
    }
  };

  const handleQuiz = async () => {
    if (!selectedChapter || !userId) {
      alert('You must be logged in to take quizzes');
      return;
    }

    const passed = confirm('Did you pass the quiz?');
    
    try {
      setWorking(true);
      await updateQuizStatus(selectedChapter.id, userId, passed, selectedChapter.xp_reward);
      
      if (passed) {
        alert(`Quiz passed! You earned ${selectedChapter.xp_reward} XP`);
      } else {
        alert('Keep practicing! Try again later.');
      }
      
      onChapterComplete();
      setSelectedChapter(null);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz');
    } finally {
      setWorking(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={handleContentClick}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <div className={styles.castleHeader}>
          <img
            src={`/images/castles/castle${castle.image_number}.png`}
            alt={castle.name}
            className={styles.castleHeaderImage}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/castles/castle1.png';
            }}
          />
          <div className={styles.castleHeaderInfo}>
            <h2>{castle.name}</h2>
            <p>{castle.description}</p>
            <div className={styles.castleStats}>
              <span>📍 {castle.region}</span>
              <span>⚡ {castle.difficulty}</span>
              <span>💎 {castle.total_xp} XP</span>
            </div>
          </div>
        </div>

        {loading && (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>Loading chapters...</p>
          </div>
        )}

        {!loading && selectedChapter && (
          <div className={styles.chapterContent}>
            <button className={styles.backButton} onClick={handleBack}>
              ← Back to Chapters
            </button>

            <div className={styles.chapterHeader}>
              <h2>
                Chapter {selectedChapter.chapter_number}: {selectedChapter.title}
              </h2>
              <div className={styles.chapterMeta}>
                <span>💎 {selectedChapter.xp_reward} XP</span>
                {selectedChapter.has_quiz && <span>📝 Has Quiz</span>}
              </div>
            </div>

            <div className={styles.chapterBody}>
              <div
                className={styles.chapterText}
                dangerouslySetInnerHTML={{ __html: selectedChapter.content }}
              />
            </div>

            <div className={styles.chapterActions}>
              {!selectedChapter.progress?.completed && (
                <button
                  className={styles.completeButton}
                  onClick={handleComplete}
                  disabled={working}
                >
                  {working ? 'Processing...' : '✅ Mark as Complete'}
                </button>
              )}

              {selectedChapter.has_quiz && !selectedChapter.progress?.quiz_passed && (
                <button
                  className={styles.quizButton}
                  onClick={handleQuiz}
                  disabled={working}
                >
                  {working ? 'Processing...' : '📝 Take Quiz'}
                </button>
              )}

              {selectedChapter.progress?.completed && (
                <div className={styles.completedMessage}>
                  ✅ Chapter Completed! ({selectedChapter.xp_reward} XP earned)
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && !selectedChapter && (
          <div className={styles.chaptersList}>
            <h3>Chapters ({chapters.length})</h3>

            {chapters.length === 0 ? (
              <p className={styles.emptyState}>No chapters available</p>
            ) : (
              chapters.map((chapter) => {
                const isLocked = !chapter.progress || !chapter.progress.unlocked;
                const isCompleted = chapter.progress?.completed || false;

                return (
                  <div
                    key={chapter.id}
                    className={`${styles.chapterItem} ${isLocked ? styles.chapterLocked : ''} ${isCompleted ? styles.chapterCompleted : ''}`}
                    onClick={() => !isLocked && handleChapterClick(chapter)}
                  >
                    <div className={styles.chapterNumber}>
                      {isLocked ? '🔒' : isCompleted ? '✅' : chapter.chapter_number}
                    </div>

                    <div className={styles.chapterInfo}>
                      <h4>{chapter.title}</h4>
                      <div className={styles.chapterMeta}>
                        <span>💎 {chapter.xp_reward} XP</span>
                        {chapter.has_quiz && <span>📝 Quiz</span>}
                        {isCompleted && (
                          <span className={styles.completedTag}>Completed</span>
                        )}
                      </div>
                    </div>

                    {!isLocked && (
                      <div className={styles.chapterArrow}>→</div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}