import React from 'react'
import { Printer } from 'lucide-react'
import styles from '@/styles/competition-teacher.module.css'

interface CompetitionHeaderProps {
  title: string
  status?: string
  timer?: string
  participantCount?: number
  activeCount?: number
  onBack: () => void
  onPrint?: () => void
}

export default function CompetitionHeader({ 
  title, 
  status, 
  timer, 
  participantCount = 0,
  activeCount = 0,
  onBack,
  onPrint
}: CompetitionHeaderProps) {
  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'NEW':
        return styles.statusNew
      case 'ONGOING':
        return styles.statusOngoing
      case 'DONE':
        return styles.statusDone
      default:
        return ''
    }
  }

  return (
    <div className={styles.competitionHeader}>
      <div className={styles.competitionHeaderContent}>
        {/* Top Row: Back button and Status */}
        <div className={styles.headerTopRow}>
          <button 
            onClick={onBack}
            className={styles.backButton}
            title="Go back"
          >
            Back
          </button>
          
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {onPrint && (
              <button
                onClick={onPrint}
                className={styles.printButton}
                title="Print competition results"
              >
                <Printer size={16} />
                Print Results
              </button>
            )}
            
            {status && status.toUpperCase() !== 'DONE' && (
              <div className={`${styles.statusBadgeLarge} ${getStatusColor(status)}`}>
                {status}
              </div>
            )}
          </div>
        </div>
        
        {/* Title */}
        <h1 className={styles.competitionTitle}>{title}</h1>
        
        {/* Stats Row */}
        <div className={styles.headerStatsRow}>
          {timer && (
            <div className={styles.headerStat}>
              <span className={styles.headerStatLabel}>Time</span>
              <span className={styles.headerStatValue}>{timer}</span>
            </div>
          )}
          
          <div className={styles.headerStat}>
            <span className={styles.headerStatLabel}>Participants</span>
            <span className={styles.headerStatValue}>{participantCount}</span>
          </div>
          
          <div className={styles.headerStat}>
            <span className={styles.headerStatLabel}>Active</span>
            <span className={`${styles.headerStatValue} ${styles.activeValue}`}>{activeCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
