import React from 'react'
import { Competition } from '@/types/common/competition'
import styles from '@/styles/competition-teacher.module.css'

interface CompetitionListProps {
  competitions: Competition[]
  onManage: (competitionId: number) => void
}

export default function CompetitionList({ competitions, onManage }: CompetitionListProps) {
  return (
    <div className={styles.competitionGrid}>
      {competitions.length > 0 ? (
        competitions.map((comp) => (
          <div key={comp.id} className={styles.competitionCard}>
            <div className={styles.competitionBanner}>
              <div className={styles.competitionBannerOverlay}></div>
              <div className={styles.competitionBannerContent}>
                <h3 className={styles.competitionBannerTitle}>{comp.title}</h3>
              </div>
            </div>
            
            <div className={styles.competitionContent}>
              <div className={styles.competitionFooter}>
                <div className={styles.competitionStatus}>
                  <span className={styles.statusLabel}>Status:</span>
                  <span 
                    className={styles.statusBadge}
                    data-status={comp.status.toLowerCase()}
                  >
                    {comp.status}
                  </span>
                </div>
                
                {comp.status !== 'DONE' && (
                  <button 
                    className={styles.manageButton} 
                    onClick={() => onManage(comp.id)}
                  >
                    Manage
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}></div>
          <p className={styles.emptyText}>No competitions found</p>
          <p className={styles.emptySubtext}>Create a competition to get started</p>
        </div>
      )}
    </div>
  )
}
