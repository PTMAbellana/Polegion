import React from 'react'
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
        <button
          onClick={onStart}
          className={`${styles.controlButton} ${styles.startButton}`}
          disabled={addedProblems.length === 0 || loading}
        >
          {loading ? 'Starting...' : 'Start Competition'}
        </button>
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
