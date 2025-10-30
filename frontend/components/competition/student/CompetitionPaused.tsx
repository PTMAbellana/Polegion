import React from 'react'
import styles from '@/styles/competition-student.module.css'

interface CompetitionPausedProps {
  formattedTime: string
  competitionTitle: string
}

export default function CompetitionPaused({ formattedTime, competitionTitle }: CompetitionPausedProps) {
  return (
    <div className={styles.pausedOverlay}>
      <div className={styles.pausedContent}>
        <div className={styles.pausedIcon}>⏸️</div>
        
        <h2 className={styles.pausedTitle}>Competition Paused</h2>
        
        <p className={styles.pausedDescription}>
          The competition is currently paused. Please wait for the instructor to resume.
        </p>
        
        <div className={styles.pausedInfo}>
          <div className={styles.competitionName}>{competitionTitle}</div>
          
          <div className={styles.timerDisplay}>
            <div className={styles.timerLabel}>Current Time</div>
            <div className={styles.timerValue}>{formattedTime}</div>
            <div className={styles.timerStatus}>⏸️ Paused</div>
          </div>
        </div>
        
        <div className={styles.waitingIndicator}>
          <div className={styles.waitingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Waiting for instructor...</p>
        </div>
      </div>
    </div>
  )
}
