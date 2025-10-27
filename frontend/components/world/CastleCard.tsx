'use client';

import React from 'react';
import type { CastleWithProgress } from '@/types/castle.types';
import styles from '@/styles/world-map.module.css';

interface CastleCardProps {
  castle: CastleWithProgress;
  onClick: () => void;
}

export default function CastleCard({ castle, onClick }: CastleCardProps) {
  const isLocked = !castle.progress?.unlocked;
  const isCompleted = castle.progress?.completed || false;
  const completionPercentage = castle.progress?.completion_percentage || 0;

  return (
    <div
      className={`${styles.castle_card} ${isLocked ? styles.locked : ''} ${isCompleted ? styles.completed : ''}`}
      onClick={onClick}
    >
      {/* Castle Image */}
      <div className={styles.castle_image_wrapper}>
        <img
          src={`/images/castles/castle${castle.image_number}.png`}
          alt={castle.name}
          className={styles.castle_img}
          style={{
            filter: isLocked ? 'grayscale(1) brightness(0.5)' : 'none',
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/castles/castle1.png';
          }}
        />

        {/* Lock Overlay */}
        {isLocked && (
          <div className={styles.lock_overlay}>
            <span className={styles.lock_icon}>🔒</span>
          </div>
        )}

        {/* Completion Crown */}
        {isCompleted && (
          <div className={styles.completion_crown}>
            <span>👑</span>
          </div>
        )}

        {/* Available Glow */}
        {!isLocked && !isCompleted && (
          <div className={styles.available_glow}></div>
        )}
      </div>

      {/* Castle Info */}
      <div className={styles.castle_info}>
        <h3 className={styles.castle_name}>{castle.name}</h3>
        <p className={styles.castle_region}>📍 {castle.region}</p>
        
        <div className={styles.castle_meta}>
          <span className={styles.difficulty} data-difficulty={castle.difficulty}>
            ⚡ {castle.difficulty}
          </span>
          <span className={styles.xp}>💎 {castle.total_xp} XP</span>
        </div>

        {/* Progress Bar */}
        {!isLocked && (
          <div className={styles.progress_bar}>
            <div
              className={styles.progress_fill}
              style={{ width: `${completionPercentage}%` }}
            ></div>
            <span className={styles.progress_text}>{completionPercentage}%</span>
          </div>
        )}

        {/* Status Badge */}
        <div className={styles.status_badge}>
          {isLocked && <span className={styles.badge_locked}>🔒 Locked</span>}
          {!isLocked && !isCompleted && <span className={styles.badge_available}>✨ Available</span>}
          {isCompleted && <span className={styles.badge_completed}>✅ Completed</span>}
        </div>
      </div>
    </div>
  );
}