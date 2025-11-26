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
            className={`${styles.controlButton} ${styles.pauseButton}`}
            disabled={loading}
          >
            {isPaused ? '▶️ Resume' : '⏸️ Pause'}
          </button>
          
          <button
            onClick={onNext}
            className={`${styles.controlButton} ${
              isLastProblem ? styles.finishButton : styles.nextButton
            }`}
            disabled={!competition.current_problem_id || loading}
          >
            {isLastProblem ? 'Finish Competition' : 'Next Problem'}
          </button>
          
          <div className={styles.problemStatus}>
            Problem {currentIndex + 1} of {addedProblems.length}
          </div>
        </>
      )}
      
      {competition.status === 'DONE' && (
        <div className={styles.competitionStatus}>
          <span>✅ Competition Completed</span>
        </div>
      )}
    </div>
  )
}
