"use client"

import React from 'react'
import { LeaderboardGridProps } from '@/types'
import styles from '@/styles/leaderboard.module.css'
import LeaderboardRow from './LeaderboardRow'

export default function LeaderboardGrid({
  items,
  emptyMessage = 'No Rankings Yet',
  emptyIcon = '🏆'
}: LeaderboardGridProps) {
  if (items.length === 0) {
    return (
      <div className={styles.empty_state}>
        <div className={styles.empty_icon}>{emptyIcon}</div>
        <h3>{emptyMessage}</h3>
        <p>Start competing to see your name on the leaderboard!</p>
      </div>
    )
  }

  return (
    <div className={styles.leaderboard_grid}>
      {items.map((row, idx) => (
        <LeaderboardRow key={`leaderboard-${idx}`} row={row} rank={idx} />
      ))}
    </div>
  )
}
