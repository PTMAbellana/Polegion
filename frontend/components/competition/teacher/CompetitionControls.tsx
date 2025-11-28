import React, { useState, useEffect, useCallback } from 'react'
import { Competition, CompetitionProblem } from '@/types/common/competition'
import styles from '@/styles/competition-teacher.module.css'

interface CompetitionControlsProps {
  competition: Competition
  addedProblems: CompetitionProblem[]
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onNext: () => void
  loading?: boolean
}

export default function CompetitionControls({
  competition,
  addedProblems,
  onStart,
  onPause,
  onResume,
  onNext,
  loading = false
}: CompetitionControlsProps) {
  const currentIndex = competition.current_problem_index || 0
  const isLastProblem = currentIndex + 1 >= addedProblems.length
  const isPaused = competition.gameplay_indicator === 'PAUSE'
  
  // Countdown state for start delay
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [countdown, setCountdown] = useState(5)

  // Handle countdown logic
  useEffect(() => {
    if (!isCountingDown) return
    
    if (countdown === 0) {
      setIsCountingDown(false)
      onStart()
      return
    }
    
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [isCountingDown, countdown, onStart])

  // Start countdown instead of immediately starting
  const handleStartClick = useCallback(() => {
    setCountdown(5)
    setIsCountingDown(true)
  }, [])

  // Cancel countdown
  const handleCancelCountdown = useCallback(() => {
    setIsCountingDown(false)
    setCountdown(5)
  }, [])

  // Determine button text based on state
  const getPauseResumeText = () => {
    if (loading) return isPaused ? 'Resuming...' : 'Pausing...'
    return isPaused ? 'Resume' : 'Pause'
  }

  const getNextButtonText = () => {
    if (loading) return isLastProblem ? 'Finishing...' : 'Loading...'
    return isLastProblem ? 'Finish Competition' : 'Next Problem'
  }

  return (
    <div className={styles.competitionControls}>
      {competition.status === 'NEW' && (
        <>
          {isCountingDown ? (
            <div className={styles.countdownContainer}>
              <div className={styles.countdownNumber}>{countdown}</div>
              <div className={styles.countdownText}>Competition starting in...</div>
              <button
                onClick={handleCancelCountdown}
                className={`${styles.controlButton} ${styles.cancelButton}`}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={handleStartClick}
              className={`${styles.controlButton} ${styles.startButton}`}
              disabled={addedProblems.length === 0 || loading}
            >
              {loading ? 'Starting...' : 'Start Competition'}
            </button>
          )}
        </>
      )}
      
      {competition.status === 'ONGOING' && (
        <>
          <button
            onClick={isPaused ? onResume : onPause}
            className={`${styles.controlButton} ${styles.pauseButton} ${loading ? styles.buttonLoading : ''}`}
            disabled={loading}
          >
            {getPauseResumeText()}
          </button>
          
          <button
            onClick={onNext}
            className={`${styles.controlButton} ${
              isLastProblem ? styles.finishButton : styles.nextButton
            } ${loading ? styles.buttonLoading : ''}`}
            disabled={!competition.current_problem_id || loading}
          >
            {getNextButtonText()}
          </button>
          
          <div className={styles.problemStatus}>
            Problem {currentIndex + 1} of {addedProblems.length}
          </div>
        </>
      )}
      
      {competition.status === 'DONE' && (
        <div className={styles.completedBanner}>
          <div className={styles.completedBannerContent}>
            <div className={styles.completedBadge}>COMPLETED</div>
            <h3 className={styles.completedBannerTitle}>Competition has ended</h3>
            <p className={styles.completedBannerText}>
              All participants have finished. View the final rankings below.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
