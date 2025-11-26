import React from 'react'
import styles from '@/styles/competition-student.module.css'

interface CompetitionTimerProps {
  formattedTime: string
  isActive: boolean
  isExpired: boolean
  isPaused: boolean
  currentProblemIndex?: number
  totalProblems?: number
  status: string
}

export default function CompetitionTimer({
  formattedTime,
  isActive,
  isExpired,
  isPaused,
  currentProblemIndex,
  totalProblems,
  status
}: CompetitionTimerProps) {
  const getStatusLabel = () => {
    if (status === 'NEW') return 'Competition not started'
    if (status === 'DONE') return 'Competition completed'
    if (isPaused) return 'Competition Paused'
    if (isExpired) return 'Time up!'
    if (currentProblemIndex !== undefined && totalProblems) {
      return `Problem ${currentProblemIndex + 1} of ${totalProblems}`
    }
    return 'Active'
  }

  return (
    <div className={styles.timerSection}>
      <div className={styles.timerContent}>
        <div className={`${styles.timer} ${isExpired ? styles.timerExpired : ''} ${isPaused ? styles.timerPaused : ''}`}>
          {formattedTime}
        </div>
        
        <div className={styles.timerStatus}>
          <span className={styles.timerLabel}>{getStatusLabel()}</span>
        </div>
      </div>
    </div>
  )
}
