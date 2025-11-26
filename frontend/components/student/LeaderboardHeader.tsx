"use client"

import React from 'react'
import { Trophy, Users, Target } from 'lucide-react'
import { LeaderboardHeaderProps } from '@/types'
import { useAuthStore } from '@/store/authStore'
import styles from '@/styles/leaderboard.module.css'

export default function LeaderboardHeader({
  totalPlayers,
  totalCompetitions
}: LeaderboardHeaderProps) {
  const { userProfile } = useAuthStore()

  let userName = 'Champion'
  if (userProfile) {
    const profile = userProfile as unknown as Record<string, unknown>
    if (profile.fullName) {
      userName = String(profile.fullName)
    } else if (profile.first_name && profile.last_name) {
      userName = `${String(profile.first_name)} ${String(profile.last_name)}`
    } else if (profile.first_name) {
      userName = String(profile.first_name)
    }
  }

  return (
    <div className={styles.hero_section}>
      <div className={styles.hero_background}></div>
      <div className={styles.hero_content}>
        <div className={styles.hero_icon}>
          <Trophy className={styles.trophy_icon} />
        </div>
        <h1 className={styles.hero_title}>Leaderboards</h1>
        <p className={styles.hero_subtitle}>
          How well did you do, <span className={styles.user_highlight}>{userName}</span>?
        </p>
        <div className={styles.stats_row}>
          <div className={styles.stat_item}>
            <Users className={styles.stat_icon} />
            <span className={styles.stat_value}>{totalPlayers}</span>
            <span className={styles.stat_label}>Players</span>
          </div>
          <div className={styles.stat_item}>
            <Target className={styles.stat_icon} />
            <span className={styles.stat_value}>{totalCompetitions}</span>
            <span className={styles.stat_label}>Competitions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
