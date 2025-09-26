"use client";

import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useMyApp } from "@/context/AppUtils";
import styles from "@/styles/leaderboard.module.css";
import { getCompetitionLeaderboards, getRoomLeaderboards } from "@/api/leaderboards";
import { Trophy, Medal, Crown, Star, Users, Target, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

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

  const fullName = p?.fullName ?? "Unknown";
  const avatarLetter = fullName.charAt(0).toUpperCase();
  const avatarSrc = p?.profile_pic;

  // Enhanced rank styling
  const getRankIcon = () => {
    if (rank === 0) return "👑";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return rank + 1;
  };

  const getRankClass = () => {
    if (rank === 0) return styles.champion;
    if (rank === 1) return styles.runner_up;
    if (rank === 2) return styles.third_place;
    return styles.participant;
  };

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
          <span className={styles.xp_value}>{row.accumulated_xp.toLocaleString()}</span>
          <span className={styles.xp_label}>XP</span>
        </div>
      </div>
    </div>
  );
};

export default function LeaderboardDetail({ params }: { params: Promise<{ roomId: number }> }) {
  const router = useRouter();
  const roomId = use(params);
  const { isLoggedIn, authLoading, userProfile } = useAuthStore();

  const [roomBoards, setRoomBoards] = useState<Leaderboard[]>([]);
  const [compeBoards, setCompeBoards] = useState<PerCompetition[]>([]);
  const [activeTab, setActiveTab] = useState<"overall" | "competition">("overall");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && !authLoading) {
      callMe();
    }
  }, [isLoggedIn, authLoading]);

  const callMe = async () => {
    try {
      setLoading(true);
      const data = await getRoomLeaderboards(roomId.roomId);
      setRoomBoards(data.data);

      const compe = await getCompetitionLeaderboards(roomId.roomId);
      setCompeBoards(compe.data);
    } catch (error) {
      console.log('Error fetching room details: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackClick = () => {
    router.push('/leaderboard'); // Or wherever you want to go back to
  };

  if (authLoading || !isLoggedIn || loading) {
    return (
      <div className={styles.loading_container}>
        <div className={styles.loading_content}>
          <Loader />
          <h2>Loading Leaderboards...</h2>
          <p>Fetching the latest rankings</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.leaderboard_container}>
      {/* Back Button */}
      <div className={styles.back_button_container}>
        <button onClick={handleBackClick} className={styles.back_button}>
          <ArrowLeft className={styles.back_icon} />
          <span>Back to Leaderboards</span>
        </button>
      </div>

      {/* Hero Header */}
      <div className={styles.hero_section}>
        <div className={styles.hero_background}></div>
        <div className={styles.hero_content}>
          <div className={styles.hero_icon}>
            <Trophy className={styles.trophy_icon} />
          </div>
          <h1 className={styles.hero_title}>Leaderboards</h1>
          <p className={styles.hero_subtitle}>
            How well did you do, <span className={styles.user_highlight}>{userProfile?.fullName || 'Champion'}</span>?
          </p>
          <div className={styles.stats_row}>
            <div className={styles.stat_item}>
              <Users className={styles.stat_icon} />
              <span className={styles.stat_value}>{roomBoards.length}</span>
              <span className={styles.stat_label}>Players</span>
            </div>
            <div className={styles.stat_item}>
              <Target className={styles.stat_icon} />
              <span className={styles.stat_value}>{compeBoards.length}</span>
              <span className={styles.stat_label}>Competitions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.main_content}>
        {/* Enhanced Navigation */}
        <div className={styles.nav_container}>
          <div className={styles.nav_bar}>
            <button
              className={`${styles.nav_btn} ${activeTab === "overall" ? styles.active : ""}`}
              onClick={() => setActiveTab("overall")}
            >
              <Trophy className={styles.nav_icon} />
              <span>Overall Rankings</span>
              <span className={styles.nav_count}>{roomBoards.length}</span>
            </button>
            <button
              className={`${styles.nav_btn} ${activeTab === "competition" ? styles.active : ""}`}
              onClick={() => setActiveTab("competition")}
            >
              <Medal className={styles.nav_icon} />
              <span>Competition Rankings</span>
              <span className={styles.nav_count}>{compeBoards.length}</span>
            </button>
          </div>
        </div>

        {/* Overall Leaderboard */}
        {activeTab === "overall" && (
          <div className={styles.content_section}>
            <div className={styles.section_header}>
              <h2 className={styles.section_title}>
                <Trophy className={styles.section_icon} />
                Overall Room Rankings
              </h2>
              <p className={styles.section_description}>
                Combined scores from all competitions in this room
              </p>
            </div>

            <div className={styles.leaderboard_grid}>
              {roomBoards.length === 0 ? (
                <div className={styles.empty_state}>
                  <div className={styles.empty_icon}>🏆</div>
                  <h3>No Rankings Yet</h3>
                  <p>Start competing to see your name on the leaderboard!</p>
                </div>
              ) : (
                roomBoards.map((row, idx) => (
                  <LeaderRow key={`overall-${idx}`} row={row} rank={idx} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Competition Leaderboards */}
        {activeTab === "competition" && (
          <div className={styles.content_section}>
            <div className={styles.section_header}>
              <h2 className={styles.section_title}>
                <Medal className={styles.section_icon} />
                Competition Rankings
              </h2>
              <p className={styles.section_description}>
                Individual competition leaderboards
              </p>
            </div>

            {compeBoards.length === 0 ? (
              <div className={styles.empty_state}>
                <div className={styles.empty_icon}>🏅</div>
                <h3>No Competition Data</h3>
                <p>Competition rankings will appear here once participants start playing.</p>
              </div>
            ) : (
              <div className={styles.competitions_container}>
                {compeBoards.map((comp) => (
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

                    <div className={styles.leaderboard_grid}>
                      {comp.data.length === 0 ? (
                        <div className={styles.empty_state_small}>
                          <div className={styles.empty_icon_small}>🏅</div>
                          <p>No participants yet</p>
                        </div>
                      ) : (
                        comp.data.map((row, idx) => (
                          <LeaderRow key={`comp-${comp.id}-${idx}`} row={row} rank={idx} />
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}