"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useStudentRoomStore } from "@/store/studentRoomStore"
import Loader from "@/components/Loader"
import LoadingOverlay from "@/components/LoadingOverlay"
import PageHeader from "@/components/PageHeader"
import RoomCardsList from "@/components/RoomCardsList"
import { STUDENT_ROUTES } from "@/constants/routes"
import { getRoomLeaderboards } from "@/api/leaderboards"
import dashboardStyles from "@/styles/dashboard-wow.module.css"
import studentStyles from "@/styles/dashboard.module.css"
import competitionStyles from "@/styles/competitions-dashboard.module.css"
import { Competition } from "@/types/common/competition"
import { LeaderboardData } from "@/types/common/leaderboard"
import AnimatedAvatar from "@/components/profile/AnimatedAvatar"

// Extended type for competitions with room context and additional fields
interface CompetitionWithRoom extends Competition {
  roomTitle?: string;
  roomCode?: string;
  problems?: Array<{ id: number }>;
  participants?: Array<{ id: number }>;
}

export default function StudentDashboard() {
  const router = useRouter()
  const { isLoggedIn, appLoading, userProfile } = useAuthStore()
  const { 
    joinedRooms, 
    loading: roomsLoading, 
    fetchJoinedRooms 
  } = useStudentRoomStore()

  const [activeCompetitions, setActiveCompetitions] = useState<CompetitionWithRoom[]>([])
  const [leaderboards, setLeaderboards] = useState<LeaderboardData[]>([])

  useEffect(() => {
    if (isLoggedIn && !appLoading) {
      void fetchJoinedRooms()
    }
  }, [isLoggedIn, appLoading, fetchJoinedRooms])

  // Fetch leaderboards for joined rooms
  useEffect(() => {
    const fetchLeaderboards = async () => {
      if (joinedRooms.length > 0) {
        const leaderboardPromises = joinedRooms.slice(0, 3).map(async (room) => {
          const result = await getRoomLeaderboards(room.id)
          if (result.success && result.data) {
            return {
              id: room.id,
              title: room.title,
              data: result.data.slice(0, 5) // Top 5
            }
          }
          return null
        })
        const results = await Promise.all(leaderboardPromises)
        setLeaderboards(results.filter(Boolean) as LeaderboardData[])
      }
    }
    fetchLeaderboards()
  }, [joinedRooms])

  // Extract active competitions from joined rooms
  useEffect(() => {
    if (joinedRooms.length > 0) {
      const competitions: CompetitionWithRoom[] = []
      joinedRooms.forEach(room => {
          // Type guard: check if room has competitions property
        const roomWithCompetitions = room as typeof room & { competitions?: Competition[] }
        if (roomWithCompetitions.competitions && Array.isArray(roomWithCompetitions.competitions)) {
          // Filter for NEW or ONGOING competitions
          const activeOnes = roomWithCompetitions.competitions.filter(
            (comp: Competition) => comp.status === 'NEW' || comp.status === 'ONGOING'
          )
          competitions.push(...activeOnes.map((comp: Competition) => ({
            ...comp,
            roomTitle: room.title, // Add room context
            roomCode: room.code
          })))
        }
      })
      // Sort by status (ONGOING first, then NEW)
      competitions.sort((a, b) => {
        if (a.status === 'ONGOING' && b.status !== 'ONGOING') return -1
        if (a.status !== 'ONGOING' && b.status === 'ONGOING') return 1
        return 0
      })
      setActiveCompetitions(competitions)
    }
  }, [joinedRooms])

  const handleJoinRoom = () => {
    router.push(STUDENT_ROUTES.JOINED_ROOMS)
  }

  const handleViewRoom = (roomCode: string | number) => {
    router.push(`/student/joined-rooms/${roomCode}`)
  }

  const handleCompetitionClick = (competition: CompetitionWithRoom) => {
    if (competition.status === 'ONGOING') {
      router.push(`/student/competition/${competition.id}/play`)
    } else {
      router.push(`/student/competition/${competition.id}`)
    }
  }

  if (appLoading || !isLoggedIn) {
    return <LoadingOverlay isLoading={true}><Loader /></LoadingOverlay>
  }

  return (
    <div className={dashboardStyles["dashboard-container"]}>
      {/* Fixed Header */}
      <PageHeader 
        title={`Welcome back, ${userProfile?.first_name || 'Student'}! 🎮`}
        subtitle="Continue your learning journey and track your progress"
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'S'}
      />

      {/* Scrollable Content */}
      <div className={dashboardStyles["scrollable-content"]}>

        {/* Top Section: Mini Profile + Quick Actions */}
        <div className={studentStyles.topSection}>
          {/* Mini Profile Card */}
          <section className={studentStyles.miniProfileCard}>
            <div className={studentStyles.miniProfileAvatar}>
              {userProfile?.profile_pic ? (
                <AnimatedAvatar
                  className={studentStyles.miniProfileImg}
                  src={userProfile.profile_pic}
                  alt="Profile"
                />
              ) : (
                <div className={studentStyles.miniProfileLetter}>
                  {userProfile?.first_name?.charAt(0).toUpperCase() || 'S'}
                </div>
              )}
            </div>
            <div className={studentStyles.miniProfileInfo}>
              <h3 className={studentStyles.miniProfileName}>
                {userProfile?.first_name} {userProfile?.last_name}
              </h3>
              <p className={studentStyles.miniProfileRole}>
                <span className={studentStyles.roleIcon}>🎓</span>
                Student
              </p>
            </div>
            <button 
              className={studentStyles.viewProfileButton}
              onClick={() => router.push(STUDENT_ROUTES.PROFILE)}
            >
              View Full Profile →
            </button>
          </section>

          {/* Quick Actions Cards */}
          <div className={studentStyles.quickActionsGrid}>
            <button 
              className={studentStyles.quickActionCard}
              onClick={() => router.push(STUDENT_ROUTES.WORLD_MAP)}
            >
              <div className={studentStyles.quickActionIcon}>🗺️</div>
              <div className={studentStyles.quickActionContent}>
                <h4>Adventure Mode</h4>
                <p>Explore the world map</p>
              </div>
            </button>
            
            <button 
              className={studentStyles.quickActionCard}
              onClick={handleJoinRoom}
            >
              <div className={studentStyles.quickActionIcon}>➕</div>
              <div className={studentStyles.quickActionContent}>
                <h4>Join Room</h4>
                <p>Enter a room code</p>
              </div>
            </button>

            <button 
              className={studentStyles.quickActionCard}
              onClick={() => router.push(STUDENT_ROUTES.LEADERBOARD)}
            >
              <div className={studentStyles.quickActionIcon}>🏆</div>
              <div className={studentStyles.quickActionContent}>
                <h4>Leaderboard</h4>
                <p>See top performers</p>
              </div>
            </button>
          </div>
        </div>

        {/* Active Competitions Section */}
        {activeCompetitions.length > 0 && (
          <section className={dashboardStyles["card"]}>
            <div className={competitionStyles.section_header}>
              <div>
                <h2 className={`${competitionStyles.section_title} ${competitionStyles.student}`}>
                  <span className={competitionStyles.icon}>⚡</span>
                  Active Competitions
                </h2>
                <p className={competitionStyles.section_subtitle}>
                  Jump into ongoing or upcoming competitions
                </p>
              </div>
            </div>
            
            <div className={competitionStyles.competitions_grid}>
              {activeCompetitions.map(competition => (
                <div 
                  key={competition.id} 
                  className={`${competitionStyles.competition_card} ${competitionStyles.student_card}`}
                  onClick={() => handleCompetitionClick(competition)}
                >
                  <div className={competitionStyles.competition_header}>
                    <h3 className={`${competitionStyles.competition_title} ${competitionStyles.student_title}`}>{competition.title}</h3>
                    <span className={`${competitionStyles.status_badge} ${competitionStyles[competition.status.toLowerCase()]}`}>
                      {competition.status === 'ONGOING' ? '🔴 LIVE' : '⏳ Starting Soon'}
                    </span>
                  </div>
                  
                  <div className={`${competitionStyles.competition_meta} ${competitionStyles.student_meta}`}>
                    <span className={competitionStyles.meta_item}>
                      📚 {competition.roomTitle || 'Unknown Room'}
                    </span>
                    <span className={competitionStyles.meta_item}>
                      🎯 {competition.problems?.length || 0} Problems
                    </span>
                    {competition.participants && (
                      <span className={competitionStyles.meta_item}>
                        👥 {competition.participants.length} Participants
                      </span>
                    )}
                  </div>

                  <div className={competitionStyles.competition_action}>
                    {competition.status === 'ONGOING' ? (
                      <button className={competitionStyles.join_button}>
                        🎮 Join Now →
                      </button>
                    ) : (
                      <button className={competitionStyles.view_button}>
                        👀 View Details
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Leaderboards Section */}
        {leaderboards.length > 0 && (
          <section className={studentStyles.leaderboardsSection}>
            <div className={studentStyles.sectionHeader}>
              <h2>🏆 Top Performers</h2>
              <button 
                className={studentStyles.viewAllButton}
                onClick={() => router.push(STUDENT_ROUTES.LEADERBOARD)}
              >
                View All Rankings →
              </button>
            </div>
            
            <div className={studentStyles.leaderboardsGrid}>
              {leaderboards.map((leaderboard) => (
                <div key={leaderboard.id} className={studentStyles.leaderboardCard}>
                  <h3 className={studentStyles.leaderboardTitle}>
                    📚 {leaderboard.title}
                  </h3>
                  <div className={studentStyles.leaderboardList}>
                    {leaderboard.data.map((item, index) => {
                      const participant = Array.isArray(item.participants) 
                        ? item.participants[0] 
                        : item.participants
                      return (
                        <div key={index} className={studentStyles.leaderboardItem}>
                          <div className={studentStyles.leaderboardRank}>
                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                          </div>
                          <div className={studentStyles.leaderboardUser}>
                            <div className={studentStyles.leaderboardUserAvatar}>
                              {participant?.first_name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <span className={studentStyles.leaderboardUserName}>
                              {participant?.first_name} {participant?.last_name}
                            </span>
                          </div>
                          <div className={studentStyles.leaderboardScore}>
                            {item.accumulated_xp} XP
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Joined Rooms Section */}
        <section className={studentStyles.roomsSection}>
          <div className={studentStyles.sectionHeader}>
            <h2>📚 Your Rooms</h2>
            {joinedRooms.length > 3 && (
              <button 
                className={studentStyles.viewAllButton}
                onClick={() => router.push(STUDENT_ROUTES.JOINED_ROOMS)}
              >
                View All Rooms →
              </button>
            )}
          </div>
          
          {roomsLoading ? (
            <div className={dashboardStyles["loading-container"]}>
              <Loader />
            </div>
          ) : joinedRooms.length > 0 ? (
            <div className={dashboardStyles["room-cards"]}>
              <RoomCardsList 
                rooms={joinedRooms.slice(0, 4)} // Show first 3
                onViewRoom={handleViewRoom}
              />
            </div>
          ) : (
            <div className={dashboardStyles["no-data"]}>
              <span className={dashboardStyles["no-data-icon"]}>📚</span>
              <p className={dashboardStyles["no-data-text"]}>No Rooms Yet</p>
              <p className={dashboardStyles["no-data-subtext"]}>
                Join your first room to start learning!
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
