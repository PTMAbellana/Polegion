"use client";

import React, { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, Volume2, VolumeX, Play, Pause } from 'lucide-react';
import styles from '@/styles/castle1-chapter1.module.css';

interface ChapterLayoutProps {
  chapterNumber: number;
  chapterTitle: string;
  chapterSubtitle: string;
  children: ReactNode;
  isMuted: boolean;
  autoAdvance: boolean;
  onToggleMute: (e: React.MouseEvent) => void;
  onToggleAutoAdvance: (e: React.MouseEvent) => void;
  onExit: () => void;
}

export default function ChapterLayout({
  chapterNumber,
  chapterTitle,
  chapterSubtitle,
  children,
  isMuted,
  autoAdvance,
  onToggleMute,
  onToggleAutoAdvance,
  onExit
}: ChapterLayoutProps) {
  return (
    <div className={styles.chapterContainer}>
      <div className={styles.backgroundOverlay}></div>

      <div className={styles.topBar}>
        <div className={styles.chapterInfo}>
          <Sparkles className={styles.titleIcon} />
          <div>
            <h1 className={styles.chapterTitle}>{chapterTitle}</h1>
            <p className={styles.chapterSubtitle}>{chapterSubtitle}</p>
          </div>
        </div>
        
        <div className={styles.topBarActions}>
          <button
            className={`${styles.controlButton} ${isMuted ? styles.controlButtonActive : ''}`}
            onClick={onToggleMute}
            title={isMuted ? "Audio: OFF" : "Audio: ON"}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button
            className={`${styles.controlButton} ${autoAdvance ? styles.controlButtonActive : ''}`}
            onClick={onToggleAutoAdvance}
            title={autoAdvance ? "Auto: ON" : "Auto: OFF"}
          >
            {autoAdvance ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <button className={styles.exitButton} onClick={onExit}>
            <X size={20} />
          </button>
        </div>
      </div>

      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  );
}