import React from 'react'
import { Competition, CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-student.module.css'

interface CompetitionWaitingRoomProps {
  competition: Competition
  participants: CompetitionParticipant[]
  activeParticipants?: any[]
}

export default function CompetitionWaitingRoom({ competition, participants, activeParticipants = [] }: CompetitionWaitingRoomProps) {
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
              <span className={styles.infoLabel}>Active Now</span>
              <span className={styles.infoValue} style={{ color: '#10b981' }}>{activeParticipants.length}</span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Total Joined</span>
              <span className={styles.infoValue}>{participants.length}</span>
            </div>
          </div>
        </div>
        
        <div className={styles.participantsPreview}>
          <h3 className={styles.previewTitle}>
            Currently Active ({activeParticipants.length})
          </h3>
          <div className={styles.avatarGrid}>
            {activeParticipants.slice(0, 12).map((p, idx) => (
              <div key={idx} className={styles.participantAvatar} title={`${p.first_name} ${p.last_name}`}>
                {p.profile_pic ? (
                  <img src={p.profile_pic} alt={`${p.first_name} ${p.last_name}`} />
                ) : (
                  <div className={styles.avatarPlaceholder}>
                    {p.first_name?.charAt(0) || '?'}
                  </div>
                )}
                <div className={styles.onlineIndicator} />
              </div>
            ))}
            {activeParticipants.length > 12 && (
              <div className={styles.moreParticipants}>
                +{activeParticipants.length - 12}
              </div>
            )}
            {activeParticipants.length === 0 && (
              <div className={styles.noActiveParticipants}>
                Waiting for participants to join...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
