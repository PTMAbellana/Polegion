import React from 'react'
import { CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-student.module.css'

interface CompetitionCompletedProps {
  competitionTitle: string
  formattedTime: string
  participants: CompetitionParticipant[]
  onRefresh?: () => void
  onCopyLink?: () => void
}

export default function CompetitionCompleted({
  competitionTitle,
  formattedTime,
  participants,
  onRefresh,
  onCopyLink
}: CompetitionCompletedProps) {
  const sortedParticipants = [...participants].sort((a, b) => b.accumulated_xp - a.accumulated_xp)

  return (
    <div className={styles.completedSection}>
      <div className={styles.completedContent}>
        <div className={styles.completedIcon}></div>
        
        <h2 className={styles.completedTitle}>Competition Completed!</h2>
        
        <p className={styles.completedDescription}>
          This competition has been completed. Check out the final results below!
        </p>
        
        <div className={styles.competitionSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Competition</span>
            <span className={styles.summaryValue}>{competitionTitle}</span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Final Time</span>
            <span className={styles.summaryValue}>{formattedTime}</span>
          </div>
          
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Participants</span>
            <span className={styles.summaryValue}>{participants.length}</span>
          </div>
        </div>
        
        <div className={styles.finalLeaderboard}>
          <h3 className={styles.leaderboardTitle}>Final Results</h3>
          
          <div className={styles.leaderboardList}>
            {sortedParticipants.slice(0, 10).map((participant, index) => (
              <div 
                key={participant.id} 
                className={`${styles.leaderboardItem} ${index < 3 ? styles[`podium${index + 1}`] : ''}`}
              >
                <span className={styles.rank}>
                  {index === 0 ? '#1' : index === 1 ? '#2' : index === 2 ? '#3' : `#${index + 1}`}
                </span>
                
                <span className={styles.name}>
                  {participant.fullName || 'Unknown'}
                </span>
                
                <span className={styles.xp}>{participant.accumulated_xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.actionButtons}>
          {onRefresh && (
            <button onClick={onRefresh} className={styles.refreshButton}>
              <span className={styles.buttonIcon}></span>
              Refresh Results
            </button>
          )}
          
          {onCopyLink && (
            <button onClick={onCopyLink} className={styles.shareButton}>
              <span className={styles.buttonIcon}></span>
              Copy Results Link
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
