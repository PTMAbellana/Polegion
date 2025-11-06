"use client"

import React from 'react'
import { ChevronRight } from 'lucide-react'

export interface ChapterRewardScreenProps {
  relicName: string
  relicImage: string
  relicDescription: string
  earnedXP: {
    lesson: number
    minigame: number
    quiz: number
  }
  quizScore?: number | null
  canRetakeQuiz: boolean
  onRetakeQuiz: () => void
  onComplete: () => void
  styleModule: any
}

export default function ChapterRewardScreen({
  relicName,
  relicImage,
  relicDescription,
  earnedXP,
  quizScore,
  canRetakeQuiz,
  onRetakeQuiz,
  onComplete,
  styleModule: styles
}: ChapterRewardScreenProps) {
  return (
    <div className={styles.rewardContent}>
      <h2 className={styles.rewardTitle}>Chapter Complete!</h2>
      <div className={styles.rewardCard}>
        <div className={styles.relicDisplay}>
          <img 
            src={relicImage}
            alt={relicName}
            className={styles.relicIcon}
          />
        </div>
        <h3 className={styles.rewardName}>{relicName}</h3>
        <p className={styles.rewardDescription}>
          {relicDescription}
        </p>
      </div>
      <div className={styles.rewardStats}>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Lesson XP</span>
          <span className={styles.statValue}>{earnedXP.lesson}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Minigame XP</span>
          <span className={styles.statValue}>{earnedXP.minigame}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statLabel}>Quiz XP</span>
          <span className={styles.statValue}>{earnedXP.quiz}</span>
        </div>
        {quizScore !== null && quizScore !== undefined && (
          <div className={styles.statBox}>
            <span className={styles.statLabel}>Quiz Score</span>
            <span className={styles.statValue}>{quizScore}%</span>
          </div>
        )}
      </div>
      <div className={styles.rewardActions}>
        {canRetakeQuiz && (
          <button className={styles.retakeButton} onClick={onRetakeQuiz}>
            Retake Quiz
          </button>
        )}
        <button className={styles.returnButton} onClick={onComplete}>
          Return to Castle
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
