"use client"

import React from 'react'
import { Target, Users } from 'lucide-react'
import { CompetitionLeaderboardsProps } from '@/types'
import styles from '@/styles/leaderboard.module.css'
import LeaderboardGrid from './LeaderboardGrid'

export default function CompetitionLeaderboards({
  competitions
}: CompetitionLeaderboardsProps) {
  if (competitions.length === 0) {
    return (
      <div className={styles.empty_state}>
        <div className={styles.empty_icon}>🏅</div>
        <h3>No Competition Data</h3>
        <p>Competition rankings will appear here once participants start playing.</p>
      </div>
    )
  }

  return (
    <div className={styles.competitions_container}>
      {competitions.map((comp) => (
        <div key={comp.id} className={styles.competition_card}>
          <div className={styles.competition_header}>
            <div className={styles.competition_info}>
              <h3 className={styles.competition_title}>
                <Target className={styles.competition_icon} />
                {comp.title}
              </h3>
              <div className={styles.competition_meta}>
                <span className={styles.participant_count}>
                  <Users className={styles.meta_icon} />
                  {comp.data.length} participants
                </span>
              </div>
            </div>
          </div>

          <LeaderboardGrid
            items={comp.data}
            emptyMessage="No Participants Yet"
            emptyIcon="🏅"
          />
        </div>
      ))}
    </div>
  )
}
