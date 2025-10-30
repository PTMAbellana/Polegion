import React from 'react'
import { Competition, CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-student.module.css'

interface CompetitionWaitingRoomProps {
  competition: Competition
  participants: CompetitionParticipant[]
}

export default function CompetitionWaitingRoom({ competition, participants }: CompetitionWaitingRoomProps) {
  return (
    <div className={styles.waitingRoom}>
      <div className={styles.waitingContent}>
        <div className={styles.waitingIcon}>⏳</div>
        
        <h2 className={styles.waitingTitle}>Competition Not Started</h2>
        
        <p className={styles.waitingDescription}>
          The competition hasn&apos;t begun yet. Please wait for your instructor to start.
        </p>
        
        <div className={styles.competitionInfo}>
          <div className={styles.competitionTitle}>{competition.title}</div>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Status</span>
              <span className={styles.infoValue}>{competition.status}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Participants</span>
              <span className={styles.infoValue}>{participants.length}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.participantsPreview}>
          <h3 className={styles.previewTitle}>Joined Participants</h3>
          <div className={styles.avatarGrid}>
            {participants.slice(0, 12).map(p => (
              <div key={p.id} className={styles.participantAvatar} title={p.fullName}>
                {p.profile_pic ? (
                  <img src={p.profile_pic} alt={p.fullName} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {p.fullName?.charAt(0) || '?'}
                  </div>
                )}
              </div>
            ))}
            {participants.length > 12 && (
              <div className={styles.moreParticipants}>
                +{participants.length - 12}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
