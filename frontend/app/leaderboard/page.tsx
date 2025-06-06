"use client"

import React from 'react'
import Loader from '@/components/Loader'
import { myAppHook } from '@/context/AppUtils'
import styles from '@/styles/leaderboard.module.css'

const leaderboardData = [
  {
    rank: 1,
    name: "Jane Doe",
    initial: "J",
    score: 400,
    change: "+204",
    progress: 100,
    bgColor: "gold",
    avatarColor: "red",
    trending: "up"
  },
  {
    rank: 2,
    name: "Tom Jones",
    initial: "T",
    score: 300,
    change: "+196",
    progress: 75,
    bgColor: "silver",
    avatarColor: "blue",
    trending: "down"
  },
  {
    rank: 3,
    name: "Mary Sue",
    initial: "M",
    score: 275,
    change: "+94",
    progress: 65,
    bgColor: "silver",
    avatarColor: "pink",
    trending: "down"
  },
  {
    rank: 4,
    name: "Richard Roe",
    initial: "R",
    score: 250,
    change: "+112",
    progress: 55,
    bgColor: "silver",
    avatarColor: "blue",
    trending: "up"
  },
  {
    rank: 5,
    name: "Joshua Eratum",
    initial: "J",
    score: 200,
    change: "+112",
    progress: 30,
    bgColor: "silver",
    avatarColor: "blue",
    trending: "up"
  }
];

const TrendingIcon = ({ direction }) => {
  if (direction === "up") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles["trending-up"]}>
        <path d="M7 14l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  } else {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={styles["trending-down"]}>
        <path d="M17 10l-5 5-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
};

export default function Leaderboard() {
    const { isLoggedIn, userProfile, isLoading } = myAppHook()

    if (isLoading || !isLoggedIn) {
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={styles['leaderboard-container']}>
            <div className={styles["main-content"]}>
                {/* Title */}
                <div className={styles["welcome-section"]}>
                    <h1>Leaderboard</h1>
                </div>

                {/* Leaderboard List */}
                <div className={styles["leaderboard-list"]}>
                    {leaderboardData.map((player, index) => (
                        <div
                            key={index}
                            className={`${styles["leaderboard-item"]} ${styles[player.bgColor]}`}
                        >
                            {/* Rank */}
                            <div className={styles["rank-section"]}>
                                <span className={styles["rank-text"]}>
                                    {player.rank === 1 ? '1st' : 
                                     player.rank === 2 ? '2nd' : 
                                     player.rank === 3 ? '3rd' : 
                                     `${player.rank}th`}
                                </span>
                            </div>

                            {/* Avatar */}
                            <div className={`${styles["avatar"]} ${styles[player.avatarColor]}`}>
                                <span className={styles["avatar-text"]}>
                                    {player.initial}
                                </span>
                            </div>

                            {/* Player Info */}
                            <div className={styles["player-info"]}>
                                <h3 className={styles["player-name"]}>
                                    {player.name}
                                </h3>
                                
                                {/* Progress Bar */}
                                <div className={styles["progress-container"]}>
                                    <div className={styles["progress-bar"]}>
                                        <div 
                                            className={styles["progress-fill"]}
                                            style={{ width: `${player.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                
                                {/* Score Change */}
                                <div className={styles["score-change"]}>
                                    <span className={styles["change-text"]}>
                                        {player.change}
                                    </span>
                                </div>
                            </div>

                            {/* Score */}
                            <div className={styles["score-section"]}>
                                <span className={styles["score-text"]}>
                                    {player.score}
                                </span>
                            </div>

                            {/* Trending Icon */}
                            <div className={styles["trending-section"]}>
                                <TrendingIcon direction={player.trending} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}