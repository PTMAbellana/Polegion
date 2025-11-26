"use client"

import React from 'react'
import { Trophy, Medal } from 'lucide-react'
import { LeaderboardTabsProps } from '@/types'
import styles from '@/styles/leaderboard.module.css'

export default function LeaderboardTabs({
  activeTab,
  onTabChange,
  overallCount,
  competitionCount
}: LeaderboardTabsProps) {
  return (
    <div className={styles.nav_container}>
      <div className={styles.nav_bar}>
        <button
          className={`${styles.nav_btn} ${activeTab === 'overall' ? styles.active : ''}`}
          onClick={() => onTabChange('overall')}
        >
          <Trophy className={styles.nav_icon} />
          <span>Overall Rankings</span>
          <span className={styles.nav_count}>{overallCount}</span>
        </button>
        <button
          className={`${styles.nav_btn} ${activeTab === 'competition' ? styles.active : ''}`}
          onClick={() => onTabChange('competition')}
        >
          <Medal className={styles.nav_icon} />
          <span>Competition Rankings</span>
          <span className={styles.nav_count}>{competitionCount}</span>
        </button>
      </div>
    </div>
  )
}
