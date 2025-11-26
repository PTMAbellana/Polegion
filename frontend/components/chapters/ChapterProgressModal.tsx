"use client"

import React, { useState } from 'react';
import styles from '@/styles/chapters/chapter-base.module.css';

interface ChapterProgressModalProps {
  chapterTitle: string;
  currentScene: string;
  onContinue: () => void;
  onRestart: () => void;
  onDontShowAgain: () => void;
}

export default function ChapterProgressModal({
  chapterTitle,
  currentScene,
  onContinue,
  onRestart,
  onDontShowAgain,
}: ChapterProgressModalProps) {
  const [showDontShowOption, setShowDontShowOption] = useState(false);

  // Convert scene names to user-friendly text
  const getSceneDisplay = (scene: string): string => {
    const sceneMap: Record<string, string> = {
      'opening': 'Opening Scene',
      'lesson': 'Lesson',
      'minigame': 'Minigame',
      'quiz1': 'Quiz 1',
      'quiz2': 'Quiz 2',
      'quiz3': 'Quiz 3',
      'reward': 'Reward Screen',
    };
    return sceneMap[scene] || scene;
  };

  const handleDontShowAgain = () => {
    // Set expiration for 5 minutes (300000 milliseconds)
    const expirationTime = Date.now() + 300000; // 5 minutes from now
    localStorage.setItem(`${chapterTitle}-dont-show-modal`, 'true');
    localStorage.setItem(`${chapterTitle}-modal-expiration`, expirationTime.toString());
    onDontShowAgain();
    onContinue();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>Progress Found</h2>
        
        <div className={styles.modalBody}>
          <p className={styles.modalText}>
            You have unfinished progress in
          </p>
          <p className={styles.modalChapterName}>{chapterTitle}</p>
          
          <div className={styles.modalProgress}>
            <span className={styles.modalLabel}>Last position:</span>
            <span className={styles.modalScene}>{getSceneDisplay(currentScene)}</span>
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            className={`${styles.modalButton} ${styles.modalButtonContinue}`}
            onClick={onContinue}
          >
            Continue
          </button>
          
          <button
            className={`${styles.modalButton} ${styles.modalButtonRestart}`}
            onClick={onRestart}
          >
            Restart
          </button>
        </div>

        <div className={styles.modalFooter}>
          {!showDontShowOption ? (
            <button
              className={styles.modalLinkButton}
              onClick={() => setShowDontShowOption(true)}
            >
              Don't show this again
            </button>
          ) : (
            <div className={styles.modalConfirm}>
              <p className={styles.modalWarning}>
                This will hide the progress dialog for 5 minutes.
              </p>
              <div className={styles.modalConfirmActions}>
                <button
                  className={styles.modalConfirmButton}
                  onClick={handleDontShowAgain}
                >
                  Confirm
                </button>
                <button
                  className={styles.modalCancelButton}
                  onClick={() => setShowDontShowOption(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          {!showDontShowOption && (
            <p className={styles.modalNote}>
              Starting fresh will reset all progress in this chapter
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
