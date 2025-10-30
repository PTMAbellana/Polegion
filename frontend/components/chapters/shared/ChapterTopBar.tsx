"use client"

import React from 'react'
import { Sparkles, Volume2, VolumeX, Play, Pause, X } from 'lucide-react'

export interface ChapterTopBarProps {
  chapterTitle: string
  chapterSubtitle: string
  isMuted: boolean
  autoAdvance: boolean
  onToggleMute: (e: React.MouseEvent) => void
  onToggleAutoAdvance: (e: React.MouseEvent) => void
  onExit: () => void
  styleModule: any
}

export default function ChapterTopBar({
  chapterTitle,
  chapterSubtitle,
  isMuted,
  autoAdvance,
  onToggleMute,
  onToggleAutoAdvance,
  onExit,
  styleModule: styles
}: ChapterTopBarProps) {
  return (
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
  )
}
