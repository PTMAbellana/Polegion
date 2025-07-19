"use client";

import React, { use, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useMyApp } from "@/context/AppUtils";
import styles from "@/styles/leaderboard.module.css";
import { getCompetitionLeaderboards, getRoomLeaderboards } from "@/api/leaderboards";

interface Participant {
  id?: string;
  fullName?: string;
  email?: string;
  profile_pic?: string;
}

interface Leaderboard {
  accumulated_xp: number;
  participants: Participant[]
}

interface PerCompetition {
  id: number;
  title: string;
  data: Leaderboard[];
}

const LeaderRow: React.FC<{ row: Leaderboard; rank: number }> = ({
  row,
  rank,
}) => {
  const p: Participant | undefined = Array.isArray(row.participants)
    ? row.participants[0]
    : row.participants;

  const fullName     = p?.fullName ?? "Unknown";
  const avatarLetter = fullName.charAt(0).toUpperCase();
  const avatarSrc    = p?.profile_pic;

  // Use leaderboard-item, add .gold for 1st, .silver for 2nd and 3rd
  let itemClass = styles["leaderboard-item"];
  if (rank === 0) {
    itemClass += " " + styles.gold;
  } else {
    itemClass += " " + styles.silver;
  }

  return (
    <div className={itemClass}>
      <div className={styles["rank-section"]}>
        <span className={styles["rank-text"]}>
          {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : `${rank + 1}`}
        </span>
      </div>
      <div className={styles["avatar"]}>
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt={fullName} />
        ) : (
          <span className={styles["avatar-text"]}>{avatarLetter}</span>
        )}
      </div>
      <div className={styles["player-info"]}>
        <span className={styles["player-name"]}>{fullName}</span>
      </div>
      <div className={styles["score-section"]}>
        <span className={styles["score-text"]}>{row.accumulated_xp} XP</span>
      </div>
    </div>
  );
};

export default function LeaderboardDetail({ params }: { params: Promise<{ roomId: number }> }) {
  const roomId = use(params)
  const { isLoggedIn, authLoading } = useMyApp()

  const [ roomBoards, setRoomBoards ] = useState<Leaderboard[]>([])
  const [ compeBoards, setCompeBoards ] = useState<PerCompetition[]>([])

  useEffect(() => {
      if (isLoggedIn && !authLoading) {
          callMe()
      } else {
          if (authLoading || !isLoggedIn) fullLoader()
      }
  }, [isLoggedIn, authLoading])

  const callMe = async() => {
      try {
        const data = await getRoomLeaderboards(roomId.roomId)
        setRoomBoards(data.data)

        const compe = await getCompetitionLeaderboards(roomId.roomId)
        setCompeBoards(compe.data)
        
      } catch (error) {
          console.log('Error fetching room details: ', error)
      } 
  }

  const fullLoader = () => (
    <div className={styles["loading-container"]}>
      <Loader/>
    </div>
  );

  if (authLoading || !isLoggedIn) {
      return fullLoader();
  }

  return (
    <div className={styles["leaderboard-container"]}>
      <div className={styles["main-content"]}>
        {/* Room leaderboard */}
        <h1 className={styles["section-title"]}>Room Leaderboard</h1>
        <div className={styles["leaderboard-list"]}>
          {roomBoards.length === 0 ? (
            <div className={styles["empty-state"]}>
              <span className={styles["empty-icon"]}>🏆</span>
              <p>No participants yet.</p>
            </div>
          ) : (
            roomBoards.map((row, idx) => (
              <LeaderRow key={idx} row={row} rank={idx} />
            ))
          )}
        </div>

        {/* Each competition */}
        {compeBoards.map((comp) => (
          <section key={comp.id} className={styles["competition-section"]}>
            <h2 className={styles["section-title"]}>{comp.title}</h2>
            <div className={styles["leaderboard-list"]}>
              {comp.data.length === 0 ? (
                <div className={styles["empty-state"]}>
                  <span className={styles["empty-icon"]}>🏅</span>
                  <p>No participants for this competition.</p>
                </div>
              ) : (
                comp.data.map((row, idx) => (
                  <LeaderRow key={`${comp.id}-${idx}`} row={row} rank={idx} />
                ))
              )}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
