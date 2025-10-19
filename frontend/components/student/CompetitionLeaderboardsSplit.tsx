"use client"

import React, { useState } from 'react'
import { Target, Users } from 'lucide-react'
import { LeaderboardData } from '@/types'
import styles from '@/styles/leaderboard.module.css'
import LeaderboardGrid from './LeaderboardGrid'

interface CompetitionLeaderboardsSplitProps {
  competitions: LeaderboardData[]
}

export default function CompetitionLeaderboardsSplit({
  competitions
}: CompetitionLeaderboardsSplitProps) {
  const [selectedCompId, setSelectedCompId] = useState<number | null>(
    competitions.length > 0 ? competitions[0].id || 0 : null
  )

  const selectedComp = competitions.find(c => c.id === selectedCompId)

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
    <div className={styles.competition_split_container}>
      {/* Left Sidebar - Competition List */}
      <div className={styles.competition_list_sidebar}>
        {competitions.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCompId(comp.id || 0)}
            className={`${styles.competition_item_button} ${
              selectedCompId === comp.id ? styles.active : ''
            }`}
            aria-pressed={selectedCompId === comp.id}
          >
            <div className={styles.competition_item_icon}>
              <Target size={20} />
            </div>
            <div className={styles.competition_item_info}>
              <div className={styles.competition_item_title}>{comp.title}</div>
              <div className={styles.competition_item_count}>
                {comp.data.length} participants
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right Content Area - Selected Competition Leaderboard */}
      <div className={styles.competition_content_area}>
        {selectedComp && (
          <>
            {/* Header */}
            <div className={styles.competition_leaderboard_header}>
              <div className={styles.competition_leaderboard_header_icon}>
                🎯
              </div>
              <div className={styles.competition_leaderboard_header_info}>
                <h3 className={styles.competition_leaderboard_header_title}>
                  {selectedComp.title}
                </h3>
                <p className={styles.competition_leaderboard_header_subtitle}>
                  <Users size={14} style={{ display: 'inline', marginRight: '0.25rem' }} />
                  {selectedComp.data.length} participants
                </p>
              </div>
            </div>

            {/* Leaderboard */}
            <LeaderboardGrid
              items={selectedComp.data}
              emptyMessage="No Participants Yet"
              emptyIcon="🏅"
            />
          </>
        )}
      </div>
    </div>
  )
}
