"use client"

import React from 'react'
import { CastleStatsProps } from '@/types/props/castle'
import styles from '@/styles/world-map.module.css'

export default function CastleStats({
  totalCastles,
  unlockedCastles,
  completedCastles,
  totalXP
}: CastleStatsProps) {
  return (
    <div className={styles.stats_panel}>
      <div className={styles.stat_item}>
        <span className={styles.stat_label}>Completed:</span>
        <span className={styles.stat_value}>{completedCastles}/{totalCastles}</span>
      </div>
      <div className={styles.stat_item}>
        <span className={styles.stat_label}>Unlocked:</span>
        <span className={styles.stat_value}>{unlockedCastles}</span>
      </div>
      <div className={styles.stat_item}>
        <span className={styles.stat_label}>Total XP:</span>
        <span className={styles.stat_value}>{totalXP}</span>
      </div>
    </div>
  )
}
