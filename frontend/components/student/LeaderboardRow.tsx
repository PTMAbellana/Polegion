"use client"

import React from 'react'
import { Crown, Star } from 'lucide-react'
import { LeaderboardRowProps } from '@/types'
import styles from '@/styles/leaderboard.module.css'
import { safeNumber } from '@/utils/numberFormat'

export default function LeaderboardRow({ row, rank }: LeaderboardRowProps) {
  const participant = Array.isArray(row.participants) ? row.participants[0] : row.participants

  const fullName = participant ? `${participant.first_name || 'John'} ${participant.last_name || 'Doe'}` : 'John Doe'
  const avatarLetter = fullName.charAt(0).toUpperCase()
  const avatarSrc = participant?.profile_pic

  // Rank styling
  const getRankIcon = () => {
    if (rank === 0) return '#1'
    if (rank === 1) return '#2'
    if (rank === 2) return '#3'
    return rank + 1
  }

  const getRankClass = () => {
    if (rank === 0) return styles.champion
    if (rank === 1) return styles.runner_up
    if (rank === 2) return styles.third_place
    return styles.participant
  }

  return (
    <div className={`${styles.leaderboard_item} ${getRankClass()}`}>
      <div className={styles.rank_section}>
        <div className={styles.rank_badge}>
          {getRankIcon()}
        </div>
        {rank < 3 && <div className={styles.rank_glow}></div>}
      </div>

      <div className={styles.player_section}>
        <div className={styles.avatar_container}>
          {avatarSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatarSrc} alt={fullName} className={styles.avatar_image} />
          ) : (
            <div className={styles.avatar_placeholder}>
              {avatarLetter}
            </div>
          )}
          {rank === 0 && <Crown className={styles.crown_icon} />}
        </div>

        <div className={styles.player_info}>
          <h3 className={styles.player_name}>{fullName}</h3>
          <p className={styles.player_rank}>#{rank + 1}</p>
        </div>
      </div>

      <div className={styles.score_section}>
        <div className={styles.xp_container}>
          <Star className={styles.xp_icon} />
          <span className={styles.xp_value}>{safeNumber(row.accumulated_xp, 0).toLocaleString()}</span>
          <span className={styles.xp_label}>XP</span>
        </div>
      </div>
    </div>
  )
}
