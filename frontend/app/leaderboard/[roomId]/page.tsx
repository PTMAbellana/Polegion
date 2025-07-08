"use client";

import React, { use, useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { myAppHook } from "@/context/AppUtils";
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
  // Accept both shapes: {…}  OR  [{…}]
  const p: Participant | undefined = Array.isArray(row.participants)
    ? row.participants[0]            // take the first element in the array
    : row.participants;              // it’s already a single object

  /* graceful fall‑backs */
  const fullName     = p?.fullName ?? "Unknown";
  const avatarLetter = fullName.charAt(0).toUpperCase();
  const avatarSrc    = p?.profile_pic;

  return (
    <div className={styles["leaderboard-item"]}>
      {/* Rank */}
      <div className={styles["rank-section"]}>
        <span className={styles["rank-text"]}>
          {rank === 0 ? "1st" : rank === 1 ? "2nd" : rank === 2 ? "3rd" : `${rank + 1}th`}
        </span>
      </div>

      {/* Avatar */}
      <div className={styles["avatar"]}>
        {avatarSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarSrc} alt={fullName} />
        ) : (
          <span className={styles["avatar-text"]}>{avatarLetter}</span>
        )}
      </div>

      {/* Player name */}
      <div className={styles["player-info"]}>
        <h3 className={styles["player-name"]}>{fullName}</h3>
      </div>

      {/* XP */}
      <div className={styles["score-section"]}>
        <span className={styles["score-text"]}>{row.accumulated_xp}</span>
      </div>
    </div>
  );
};


export default function LeaderboardDetail({ params }: { params: Promise<{ roomId: number }> }) {
  const roomId = use(params)
  console.log('get roomId: ', roomId.roomId)
  const { isLoggedIn, authLoading } = myAppHook()

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

  console.log('all participants by xp points: ', roomBoards)
  console.log('all participants by xp points per compe: ', compeBoards)


  const fullLoader = () => {
      console.log('Leaderboard Rooms: App is still loading')
      return (
          <div className={styles["loading-container"]}>
              <Loader/>
          </div>
      )
  }

  if (authLoading || !isLoggedIn) {
      return (
          <div className={styles["loading-container"]}>
              <Loader/>
          </div>
      )
  }

  return (
    <div className={styles["leaderboard-container"]}>
      <div className={styles["main-content"]}>
        {/* Room leaderboard */}
        <h1 className={styles["section-title"]}>Room leaderboard</h1>
        <div className={styles["leaderboard-list"]}>
          {roomBoards.map((row, idx) => (
            <LeaderRow key={idx} row={row} rank={idx} />
          ))}
        </div>

        {/* Each competition */}
        {compeBoards.map((comp) => (
          <section key={comp.id}>
            <h2 className={styles["section-title"]}>{comp.title}</h2>
            <div className={styles["leaderboard-list"]}>
              {comp.data.map((row, idx) => (
                <LeaderRow key={`${comp.id}-${idx}`} row={row} rank={idx} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
