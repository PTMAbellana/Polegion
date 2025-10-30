import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-teacher.module.css'

interface ParticipantsLeaderboardProps {
  participants: CompetitionParticipant[]
}

export default function ParticipantsLeaderboard({ participants }: ParticipantsLeaderboardProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const sortedParticipants = [...participants].sort((a, b) => {
    return sortOrder === 'desc' 
      ? b.accumulated_xp - a.accumulated_xp 
      : a.accumulated_xp - b.accumulated_xp
  })

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }

  return (
    <div className={styles.rightColumn}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>👥 Participants</h2>
          <div className={styles.sortControls}>
            <button
              onClick={toggleSort}
              className={styles.sortButton}
              title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
            >
              <div className={styles.sortIcons}>
                <ChevronUp 
                  className={`w-3 h-3 ${sortOrder === 'asc' ? styles.sortActive : styles.sortInactive}`} 
                />
                <ChevronDown 
                  className={`w-3 h-3 ${sortOrder === 'desc' ? styles.sortActive : styles.sortInactive}`} 
                />
              </div>
              <span className={styles.sortText}>
                {sortOrder === 'desc' ? 'Desc' : 'Asc'}
              </span>
            </button>
          </div>
        </div>
        
        <div className={styles.participantsList}>
          {sortedParticipants.length > 0 ? (
            sortedParticipants.map((participant, index) => (
              <div
                key={participant.id}
                className={`${styles.participantCard} ${index < 3 ? styles[`rank${index + 1}`] : ''}`}
              >
                <div className={styles.participantContent}>
                  <div className={styles.participantLeft}>
                    <div className={styles.participantRank}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </div>
                    <div className={styles.participantInfo}>
                      <h3 className={styles.participantName}>
                        {participant.fullName || 'Unknown Participant'}
                      </h3>
                    </div>
                  </div>
                  <div className={styles.participantRight}>
                    <div className={styles.participantXp}>
                      {participant.accumulated_xp} XP
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>👥</div>
              <p className={styles.emptyText}>No participants yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
