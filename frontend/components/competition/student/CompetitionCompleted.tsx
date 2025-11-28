import React, { useEffect, useState } from 'react'
import { CompetitionParticipant } from '@/types/common/competition'
import styles from '@/styles/competition-student.module.css'

interface CompetitionCompletedProps {
  competitionTitle: string
  formattedTime: string
  participants: CompetitionParticipant[]
  onRefresh?: () => void
  onCopyLink?: () => void
}

// Confetti component for celebration effect
function Confetti() {
  return (
    <div className={styles.confettiContainer}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className={styles.confetti}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 2}s`,
            backgroundColor: ['#FABC60', '#2C514C', '#06b6d4', '#ef4444', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 6)],
          }}
        />
      ))}
    </div>
  )
}

// Helper function to get initials from full name (first letter of first name + first letter of last name)
function getInitials(fullName: string | undefined): string {
  if (!fullName) return 'U'
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

export default function CompetitionCompleted({
  competitionTitle,
  formattedTime,
  participants,
  onRefresh,
  onCopyLink
}: CompetitionCompletedProps) {
  const [showConfetti, setShowConfetti] = useState(true)
  const [copied, setCopied] = useState(false)
  
  const sortedParticipants = [...participants].sort((a, b) => b.accumulated_xp - a.accumulated_xp)
  const winner = sortedParticipants[0]
  const totalXP = sortedParticipants.reduce((acc, p) => acc + p.accumulated_xp, 0)

  // Stop confetti after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  const handleCopyLink = () => {
    if (onCopyLink) {
      onCopyLink()
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className={styles.completedSection}>
      {showConfetti && <Confetti />}
      
      <div className={styles.completedContent}>
        {/* Trophy Animation */}
        <div className={styles.trophyContainer}>
          <div className={styles.trophyGlow} />
          <div className={styles.completedIconText}>COMPLETED</div>
        </div>
        
        <h2 className={styles.completedTitle}>Competition Completed!</h2>
        
        <p className={styles.completedDescription}>
          Congratulations to all participants! Here are the final standings.
        </p>
        
        {/* Winner Spotlight */}
        {winner && (
          <div className={styles.winnerSpotlight}>
            <div className={styles.winnerBadge}>Champion</div>
            <div className={styles.winnerAvatar}>
              <span className={styles.winnerInitial}>
                {getInitials(winner.fullName)}
              </span>
            </div>
            <h3 className={styles.winnerName}>{winner.fullName || 'Unknown'}</h3>
            <div className={styles.winnerXP}>
              {winner.accumulated_xp} XP
            </div>
          </div>
        )}
        
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <span className={styles.statValue}>{competitionTitle}</span>
            <span className={styles.statLabel}>Competition</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statValue}>{participants.length}</span>
            <span className={styles.statLabel}>Participants</span>
          </div>
          
          <div className={styles.statCard}>
            <span className={styles.statValue}>{totalXP}</span>
            <span className={styles.statLabel}>Total XP Earned</span>
          </div>
        </div>
        
        {/* Final Leaderboard */}
        <div className={styles.finalLeaderboard}>
          <h3 className={styles.leaderboardTitle}>
            Final Rankings
          </h3>
          
          <div className={styles.leaderboardList}>
            {sortedParticipants.slice(0, 10).map((participant, index) => (
              <div 
                key={participant.id} 
                className={`${styles.leaderboardItem} ${index < 3 ? styles[`podium${index + 1}`] : ''}`}
              >
                <div className={styles.rankBadge}>
                  <span className={styles.rankNumber}>#{index + 1}</span>
                </div>
                
                <div className={styles.participantInfo}>
                  <div className={styles.participantAvatar}>
                    <span>{getInitials(participant.fullName)}</span>
                  </div>
                  <span className={styles.name}>
                    {participant.fullName || 'Unknown'}
                  </span>
                </div>
                
                <div className={styles.xpBadge}>
                  <span className={styles.xpValue}>{participant.accumulated_xp}</span>
                  <span className={styles.xpLabel}>XP</span>
                </div>
              </div>
            ))}
            
            {sortedParticipants.length === 0 && (
              <div className={styles.noParticipants}>
                <p>No participants found</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {onRefresh && (
            <button onClick={onRefresh} className={styles.refreshButton}>
              Refresh Results
            </button>
          )}
          
          {onCopyLink && (
            <button onClick={handleCopyLink} className={`${styles.shareButton} ${copied ? styles.copied : ''}`}>
              {copied ? 'Link Copied!' : 'Copy Results Link'}
            </button>
          )}
        </div>
        
        {/* Footer Message */}
        <p className={styles.footerMessage}>
          Great job everyone! Keep learning and competing!
        </p>
      </div>
    </div>
  )
}
