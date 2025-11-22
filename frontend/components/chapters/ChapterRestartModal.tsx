"use client"

import React from 'react';
import styles from '@/styles/chapters/chapter-base.module.css';

interface ChapterRestartModalProps {
  chapterTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ChapterRestartModal({
  chapterTitle,
  onConfirm,
  onCancel,
}: ChapterRestartModalProps) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent} style={{ maxWidth: '450px', padding: '1.5rem' }}>
        <h2 className={styles.modalTitle} style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
          Restart Chapter?
        </h2>
        
        <div className={styles.modalBody}>
          <div style={{ 
            textAlign: 'center',
            background: 'rgba(255, 215, 0, 0.1)',
            border: '1px solid rgba(255, 215, 0, 0.4)',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '1rem'
          }}>
            <p style={{ 
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: '600',
              color: '#FFD700'
            }}>
              {chapterTitle}
            </p>
          </div>
          
          <p style={{ 
            margin: '0 0 0.75rem 0', 
            fontSize: '0.95rem',
            color: '#E8F4FD',
            lineHeight: '1.4'
          }}>
            This will reset all progress including tasks and quiz scores.
          </p>
          
          <p style={{
            margin: 0,
            fontSize: '0.85rem',
            color: '#A0C4E8',
            lineHeight: '1.4'
          }}>
            Previously earned XP will remain in your account.
          </p>
        </div>

        <div className={styles.modalActions} style={{ gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            className={`${styles.modalButton} ${styles.modalButtonContinue}`}
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              fontSize: '0.95rem'
            }}
          >
            Cancel
          </button>
          
          <button
            className={`${styles.modalButton} ${styles.modalButtonRestart}`}
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              fontSize: '0.95rem'
            }}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
}
