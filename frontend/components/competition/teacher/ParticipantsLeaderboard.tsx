import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-teacher.module.css'

interface ParticipantsLeaderboardProps {
  participants: CompetitionParticipant[]
  activeParticipants?: any[]
}

export default function ParticipantsLeaderboard({ participants, activeParticipants = [] }: ParticipantsLeaderboardProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  console.log('🔍 [Leaderboard] Participants:', participants);
  console.log('🔍 [Leaderboard] Active participants:', activeParticipants);

  const sortedParticipants = [...participants].sort((a, b) => {
    return sortOrder === 'desc' 
      ? b.accumulated_xp - a.accumulated_xp 
      : a.accumulated_xp - b.accumulated_xp
  })

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }
  
  // Check if participant is active - match by user_id (UUID) not participant id
  const isActive = (participant: CompetitionParticipant) => {
    return activeParticipants.some(ap => ap.id === participant.user_id)
  }
  
  // Use direct active count from presence (already filtered for students in parent)
  // This is more accurate than computing from participant matches
  const activeStudentCount = activeParticipants.length

  return (
    <div className={styles.rightColumn}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Participants
            <span className={styles.activeCount}>
              {participants.length} / {activeStudentCount} Active
            </span>
          </h2>
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
            sortedParticipants.map((participant, index) => {
              const active = isActive(participant)
              const key = participant.id || participant.user_id || `participant-${index}`
              return (
                <div
                  key={key}
                  className={`${styles.participantCard} ${index < 3 ? styles[`rank${index + 1}`] : ''} ${active ? styles.activeParticipant : ''}`}
                >
                  <div className={styles.participantContent}>
                    <div className={styles.participantLeft}>
                      <div className={styles.participantRank}>
                        {index === 0 ? '#1' : index === 1 ? '#2' : index === 2 ? '#3' : `#${index + 1}`}
                      </div>
                      <div className={styles.participantInfo}>
                        <h3 className={styles.participantName}>
                          {participant.fullName || 'Unknown Participant'}
                          {active && <span className={styles.onlineBadge}>● Online</span>}
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
              )
            })
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}></div>
              <p className={styles.emptyText}>No participants yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
