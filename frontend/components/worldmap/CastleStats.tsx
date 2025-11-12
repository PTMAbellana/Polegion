"use client"

import React from 'react'
import { CastleStatsProps } from '@/types/props/castle'
import styles from '@/styles/world-map.module.css'

// Castle color themes matching the modal
const CASTLE_THEMES: Record<number, { primary: string; secondary: string; accent: string; light: string }> = {
  1: { primary: '#3E5879', secondary: '#213555', accent: '#5A7FA3', light: '#7BA3C9' },
  2: { primary: '#4C763B', secondary: '#043915', accent: '#6B9C52', light: '#8BC36D' },
  3: { primary: '#27667B', secondary: '#143D60', accent: '#3B8BA5', light: '#5BAFD1' },
  4: { primary: '#B77466', secondary: '#957C62', accent: '#D09082', light: '#E5AE9F' },
  5: { primary: '#6A4C93', secondary: '#2D1B4E', accent: '#8B6BB8', light: '#B394D4' }
}

interface ExtendedCastleStatsProps extends CastleStatsProps {
  currentCastleIndex?: number;
}

export default function CastleStats({
  totalCastles,
  unlockedCastles,
  completedCastles,
  totalXP,
  currentCastleIndex = 0
}: ExtendedCastleStatsProps) {
  // Get theme for current castle (1-indexed)
  const theme = CASTLE_THEMES[currentCastleIndex + 1] || CASTLE_THEMES[1];

  return (
    <div 
      className={styles.stats_panel}
      style={{
        borderColor: `${theme.accent}99`,
        background: `linear-gradient(135deg, ${theme.secondary}25 0%, ${theme.primary}20 100%)`,
        boxShadow: `0 4px 20px rgba(0, 0, 0, 0.6), 0 0 30px ${theme.primary}15, inset 0 1px 2px ${theme.accent}10`
      }}
    >
      <div className={styles.stat_item}>
        <span 
          className={styles.stat_label}
          style={{ color: `${theme.light}` }}
        >
          Completed:
        </span>
        <span 
          className={styles.stat_value}
          style={{
            color: theme.light,
            textShadow: `0 0 20px ${theme.accent}60, 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 40px ${theme.primary}40`
          }}
        >
          {completedCastles}/{totalCastles}
        </span>
      </div>
      <div className={styles.stat_item}>
        <span 
          className={styles.stat_label}
          style={{ color: `${theme.light}` }}
        >
          Unlocked:
        </span>
        <span 
          className={styles.stat_value}
          style={{
            color: theme.light,
            textShadow: `0 0 20px ${theme.accent}60, 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 40px ${theme.primary}40`
          }}
        >
          {unlockedCastles}
        </span>
      </div>
      <div className={styles.stat_item}>
        <span 
          className={styles.stat_label}
          style={{ color: `${theme.light}` }}
        >
          Total XP:
        </span>
        <span 
          className={styles.stat_value}
          style={{
            color: theme.light,
            textShadow: `0 0 20px ${theme.accent}60, 0 2px 8px rgba(0, 0, 0, 0.6), 0 0 40px ${theme.primary}40`
          }}
        >
          {totalXP}
        </span>
      </div>
    </div>
  )
}
