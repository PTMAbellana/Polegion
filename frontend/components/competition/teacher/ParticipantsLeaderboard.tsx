import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-teacher.module.css'
import { safeNumber } from '@/utils/numberFormat'

interface ParticipantsLeaderboardProps {
  participants: CompetitionParticipant[]
  activeParticipants?: any[]
  currentProblemIndex?: number
  competitionStatus?: string
  currentUserId?: string
}

export default function ParticipantsLeaderboard({ participants, activeParticipants = [], currentProblemIndex = 0, competitionStatus = 'NEW', currentUserId }: ParticipantsLeaderboardProps) {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const lastProblemIndexRef = useRef(currentProblemIndex)
  const lastXpValuesRef = useRef<Map<string, number>>(new Map())

  console.log('🔍 [Leaderboard] Participants:', participants);
  console.log('🔍 [Leaderboard] Active participants:', activeParticipants);
  console.log('🔍 [Leaderboard] Current problem index:', currentProblemIndex);
  console.log('🔍 [Leaderboard] Current user ID:', currentUserId);

  // Track when problem changes
  useEffect(() => {
    if (currentProblemIndex !== lastProblemIndexRef.current) {
      console.log('🔄 [Leaderboard] Problem changed from', lastProblemIndexRef.current, 'to', currentProblemIndex);
      // Store current XP values when moving to next problem
      const newXpMap = new Map<string, number>();
      participants.forEach(p => {
        const key = p.user_id || p.id;
        if (key) {
          newXpMap.set(key, p.accumulated_xp || 0);
        }
      });
      lastXpValuesRef.current = newXpMap;
      lastProblemIndexRef.current = currentProblemIndex;
    }
  }, [currentProblemIndex, participants]);

  // Check if participant has submitted for current problem - memoized for performance
  const hasSubmittedCurrentProblem = useCallback((participant: CompetitionParticipant) => {
    const key = participant.user_id || participant.id;
    if (!key) return false;
    
    const lastXp = lastXpValuesRef.current.get(key) || 0;
    const currentXp = participant.accumulated_xp || 0;
    
    console.log(`🎯 [Status Check] ${participant.fullName}: lastXp=${lastXp}, currentXp=${currentXp}, submitted=${currentXp > lastXp}`);
    
    // If XP increased since last problem started, they've submitted
    return currentXp > lastXp;
  }, []);

  const sortedParticipants = useMemo(() => {
    return [...participants].sort((a, b) => {
      return sortOrder === 'desc' 
        ? b.accumulated_xp - a.accumulated_xp 
        : a.accumulated_xp - b.accumulated_xp
    });
  }, [participants, sortOrder]);

  const toggleSort = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')
  }
  
  // Check if participant is active - match by user_id (UUID) not participant id
  const isActive = (participant: CompetitionParticipant) => {
    return activeParticipants.some(ap => ap.id === participant.user_id)
  }
  
  // Count only students who are actually online (exclude teachers and current user/host)
  // Deduplicate by user_id to count unique users instead of sessions
  const activeStudentCount = [...new Set(
    activeParticipants
      .filter(ap => ap.role !== 'teacher' && ap.id !== currentUserId)
      .map(ap => ap.id)
  )].length

  return (
    <div className={styles.rightColumn}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Participants
            <span className={styles.activeCount}>
              {activeStudentCount} Active
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
                        </h3>
                        {competitionStatus === 'ONGOING' && (
                          <div className={styles.participantStatus}>
                            {hasSubmittedCurrentProblem(participant) ? (
                              <span className={styles.statusSubmitted}>✓ Submitted</span>
                            ) : (
                              <span className={styles.statusAnswering}>⏳ Answering</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={styles.participantRight}>
                      <div className={styles.participantXp}>
                        {safeNumber(participant.accumulated_xp, 0)} XP
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
