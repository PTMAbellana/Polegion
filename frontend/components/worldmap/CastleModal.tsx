"use client"

import React from 'react'
import { CastleModalProps } from '@/types/props/castle'
import styles from '@/styles/world-map.module.css'

export default function CastleModal({ castle, onClose, onEnter }: CastleModalProps) {
  return (
    <div className={styles.modal_overlay} onClick={onClose}>
      <div className={styles.modal_content} onClick={(e) => e.stopPropagation()}>
        <button
          className={styles.close_button}
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        <h2>{castle.name}</h2>
        <p className={styles.castle_description}>
          {castle.description || 'A mysterious castle awaits...'}
        </p>

        <div className={styles.castle_info}>
          <p><strong>Difficulty:</strong> {castle.difficulty || 'Easy'}</p>
          <p><strong>Region:</strong> {castle.region || 'Unknown'}</p>
          <p><strong>Total XP:</strong> {castle.total_xp || 0}</p>
        </div>

        {castle.progress?.unlocked && (
          <>
            <div className={styles.progress_bar_container}>
              <div className={styles.progress_label}>
                Progress: {castle.progress.completion_percentage || 0}%
              </div>
              <div className={styles.progress_bar}>
                <div
                  className={styles.progress_fill}
                  style={{ width: `${castle.progress.completion_percentage || 0}%` }}
                />
              </div>
            </div>

            <button
              className={styles.enter_button}
              onClick={() => onEnter(castle)}
            >
              {castle.progress?.completed ? 'Revisit Castle' : 'Enter Castle'}
            </button>
          </>
        )}

        {!castle.progress?.unlocked && (
          <p className={styles.locked_message}>
            🔒 Complete previous castles to unlock
          </p>
        )}
      </div>
    </div>
  )
}
