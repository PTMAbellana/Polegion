"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { useTeacherRoomStore } from "@/store/teacherRoomStore"
import { getRoomLeaderboards } from "@/api/records"
import { useTeacherDashboardRealtime } from "@/hooks/useTeacherDashboardRealtime"
import Loader from "@/components/Loader"
import LoadingOverlay from "@/components/LoadingOverlay"
import PageHeader from "@/components/PageHeader"
import MiniProfileCard from "@/components/MiniProfileCard"
import RoomCardsList from "@/components/RoomCardsList"
import { TEACHER_ROUTES } from "@/constants/routes"
import dashboardStyles from "@/styles/dashboard-wow.module.css"
import teacherStyles from "@/styles/dashboard.module.css"
import competitionStyles from "@/styles/competitions-dashboard.module.css"
import { Competition } from "@/types/common/competition"
import { LeaderboardData } from "@/types/common/leaderboard"
import AnimatedAvatar from "@/components/profile/AnimatedAvatar"
import { FaChalkboardTeacher, FaPlus, FaRegFileAlt, FaFortAwesome, FaBrain, FaBook } from 'react-icons/fa'
import { safeAverage, safeMax, safeNumber } from "@/utils/numberFormat"

// Extended type for competitions with room context and additional fields
interface CompetitionWithRoom extends Competition {
  roomTitle?: string;
  roomCode?: string;
  problems?: Array<{ id: number }>;
  participants?: Array<{ id: number; accumulated_xp?: number }>;
}

export default function TeacherDashboard() {
  const router = useRouter()
  const { isLoggedIn, appLoading, userProfile } = useAuthStore()
  const { 
    createdRooms, 
    loading: roomsLoading, 
    fetchCreatedRooms 
  } = useTeacherRoomStore()

  const [selectedLeaderboardIndex, setSelectedLeaderboardIndex] = useState(0)

  // Initial fetch on mount
  useEffect(() => {
    if (isLoggedIn && !appLoading) {
      void fetchCreatedRooms()
    }
  }, [isLoggedIn, appLoading, fetchCreatedRooms])

  // Real-time hook for competitions and leaderboards
  const { recentCompetitions, leaderboards, lastUpdate } = useTeacherDashboardRealtime(
    userProfile?.id,
    createdRooms
  )

  // Auto-refresh rooms when real-time updates occur
  useEffect(() => {
    if (lastUpdate > 0 && createdRooms.length > 0) {
      // Debounce: only refresh if last update was recent
      const timeSinceUpdate = Date.now() - lastUpdate
      if (timeSinceUpdate < 1000) {
        void fetchCreatedRooms()
      }
    }
  }, [lastUpdate, fetchCreatedRooms, createdRooms.length])

  const handleCreateRoom = () => {
    router.push(TEACHER_ROUTES.VIRTUAL_ROOMS)
  }

  const handleViewRoom = (roomCode: string | number) => {
    router.push(`${TEACHER_ROUTES.VIRTUAL_ROOMS}/${roomCode}`)
  }

  const handleCompetitionClick = (competition: CompetitionWithRoom) => {
    if (competition.roomCode) {
      router.push(`/teacher/competition/${competition.id}?room=${competition.roomCode}`)
    }
  }

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'NEW': return { text: '⏳ Pending', color: '#ffd700' }
      case 'ONGOING': return { text: '🔴 Live', color: '#ff4444' }
      case 'PAUSE': return { text: '⏸️ Paused', color: '#ff9800' }
      case 'DONE': return { text: '✅ Completed', color: '#4caf50' }
      default: return { text: status, color: '#666' }
    }
  }

  if (appLoading || !isLoggedIn) {
    return <LoadingOverlay isLoading={true} />
  }

  return (
    <div className={dashboardStyles["dashboard-container"]}>
      {/* Fixed Header */}
      <PageHeader 
        title={`Welcome, Professor ${userProfile?.first_name || 'Teacher'}!`}
        subtitle="Manage your classrooms and track student progress"
        showAvatar={true}
        avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'T'}
        actionButton={
          <button 
            onClick={handleCreateRoom}
            className="btn btn-primary"
            style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #84cc16 100%)',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontSize: '14px'
            }}
          >
            + Create Room
          </button>
        }
      />

      {/* Scrollable Content */}
      <div className={dashboardStyles["scrollable-content"]}>

        {/* Top Section: Mini Profile + Quick Actions */}
        <div className={teacherStyles.topSection}>
          {/* Mini Profile Card */}
          <MiniProfileCard
            firstName={userProfile?.first_name}
            lastName={userProfile?.last_name}
            profilePic={userProfile?.profile_pic}
            role="Teacher"
            profileRoute={TEACHER_ROUTES.PROFILE}
          />

          {/* Quick Actions Cards */}
          <div className={teacherStyles.quickActionsGrid}>
            <button 
              className={teacherStyles.quickActionCard}
              onClick={() => router.push(TEACHER_ROUTES.VIRTUAL_ROOMS)}
            >
              <div className={teacherStyles.quickActionIcon}>
                <FaChalkboardTeacher />
              </div>
              <div className={teacherStyles.quickActionContent}>
                <h4>Manage Rooms</h4>
                <p>View all classrooms</p>
              </div>
            </button>
            
            <button 
              className={teacherStyles.quickActionCard}
              onClick={handleCreateRoom}
            >
              <div className={teacherStyles.quickActionIcon}>
                <FaPlus />
              </div>
              <div className={teacherStyles.quickActionContent}>
                <h4>Create Room</h4>
                <p>Start a new classroom</p>
              </div>
            </button>

            <button 
              className={teacherStyles.quickActionCard}
              onClick={() => router.push(TEACHER_ROUTES.RECORDS)}
            >
              <div className={teacherStyles.quickActionIcon}>
                <FaRegFileAlt />
              </div>
              <div className={teacherStyles.quickActionContent}>
                <h4>View Records</h4>
                <p>Student performance</p>
              </div>
            </button>

            <button 
              className={teacherStyles.quickActionCard}
              onClick={() => router.push(TEACHER_ROUTES.CASTLE_CONTENT)}
            >
              <div className={teacherStyles.quickActionIcon}>
                <FaBook />
              </div>
              <div className={teacherStyles.quickActionContent}>
                <h4>Castle Handbook</h4>
                <p>Content reference</p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Competitions Section */}
        {recentCompetitions.length > 0 && (
          <section className={dashboardStyles["card"]}>
            <div className={competitionStyles.section_header}>
              <div>
                <h2 className={`${competitionStyles.section_title} ${competitionStyles.teacher}`}>
                  <span className={competitionStyles.icon}></span>
                  Recent Competitions
                </h2>
                <p className={competitionStyles.section_subtitle}>
                  Monitor and manage your active and recent competitions
                </p>
              </div>
            </div>
            
            <div className={competitionStyles.competitions_grid}>
              {recentCompetitions.map(competition => {
                const statusDisplay = getStatusDisplay(competition.status)
                return (
                  <div 
                    key={competition.id} 
                    className={`${competitionStyles.competition_card} ${competitionStyles.teacher_card}`}
                    onClick={() => handleCompetitionClick(competition as Competition & { roomCode?: string })}
                  >
                    <div className={competitionStyles.competition_header}>
                      <h3 className={`${competitionStyles.competition_title} ${competitionStyles.teacher_title}`}>{competition.title}</h3>
                      <span 
                        className={competitionStyles.status_badge}
                        style={{ background: statusDisplay.color }}
                      >
                        {statusDisplay.text}
                      </span>
                    </div>
                    
                    <div className={`${competitionStyles.competition_meta} ${competitionStyles.teacher_meta}`}>
                      <span className={competitionStyles.meta_item}>
                        {competition.roomTitle || 'Unknown Room'}
                      </span>
                      <span className={competitionStyles.meta_item}>
                        {competition.problems?.length || 0} Problems
                      </span>
                      {competition.participants && (
                        <span className={competitionStyles.meta_item}>
                          {competition.participants.length} Students
                        </span>
                      )}
                    </div>

                    <div className={competitionStyles.competition_stats}>
                      {competition.participants && competition.participants.length > 0 && (
                        <>
                          <div className={competitionStyles.stat}>
                            <span className={competitionStyles.stat_label}>Avg Score:</span>
                            <span className={competitionStyles.stat_value}>
                              {safeAverage(
                                competition.participants.map(p => p.accumulated_xp || 0)
                              )} XP
                            </span>
                          </div>
                          <div className={competitionStyles.stat}>
                            <span className={competitionStyles.stat_label}>Top Score:</span>
                            <span className={competitionStyles.stat_value}>
                              {safeMax(competition.participants.map(p => p.accumulated_xp || 0))} XP
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className={competitionStyles.competition_action}>
                      <button className={competitionStyles.manage_button}>
                        ⚙️ Manage
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Leaderboards Section */}
        {leaderboards.length > 0 && (
          <section className={teacherStyles.leaderboardsSection}>
            <div className={teacherStyles.sectionHeader}>
              <h2>Top Students</h2>
              <button 
                className={teacherStyles.viewAllButton}
                onClick={() => router.push(TEACHER_ROUTES.RECORDS)}
              >
                View All Records
              </button>
            </div>
            
            <div className={teacherStyles.leaderboardContainer}>
              {/* Tabs for multiple leaderboards */}
              {leaderboards.length > 1 && (
                <div className={teacherStyles.leaderboardTabs}>
                  {leaderboards.map((leaderboard, index) => (
                    <button
                      key={leaderboard.id}
                      className={`${teacherStyles.leaderboardTab} ${
                        selectedLeaderboardIndex === index ? teacherStyles.activeTab : ''
                      }`}
                      onClick={() => setSelectedLeaderboardIndex(index)}
                    >
                      {leaderboard.title}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Leaderboard title (only shown when single leaderboard) */}
              {leaderboards.length === 1 && (
                <h3 className={teacherStyles.leaderboardTitle}>
                  {leaderboards[0].title}
                </h3>
              )}
              
              {/* Leaderboard list */}
              <div className={teacherStyles.leaderboardList}>
                {leaderboards[selectedLeaderboardIndex]?.data.map((item, index) => {
                  const participant = Array.isArray(item.participants) 
                    ? item.participants[0] 
                    : item.participants
                  return (
                    <div key={index} className={teacherStyles.leaderboardItem}>
                      <div className={teacherStyles.leaderboardRank}>
                        {index === 0 ? '#1' : index === 1 ? '#2' : index === 2 ? '#3' : `#${index + 1}`}
                      </div>
                      <div className={teacherStyles.leaderboardUser}>
                        <div className={teacherStyles.leaderboardUserAvatar}>
                          {participant?.first_name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className={teacherStyles.leaderboardUserName}>
                          {participant?.first_name} {participant?.last_name}
                        </span>
                      </div>
                      <div className={teacherStyles.leaderboardScore}>
                        {safeNumber(item.accumulated_xp, 0)} XP
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Created Rooms Section */}
        <section className={teacherStyles.roomsSection}>
          <div className={teacherStyles.sectionHeader}>
            <h2>🏫 Your Classrooms</h2>
            {createdRooms.length > 6 && (
              <button 
                className={teacherStyles.viewAllButton}
                onClick={() => router.push(TEACHER_ROUTES.VIRTUAL_ROOMS)}
              >
                View All Rooms
              </button>
            )}
          </div>
          
          {roomsLoading ? (
            <div className={dashboardStyles["loading-container"]}>
              <Loader />
            </div>
          ) : createdRooms.length > 0 ? (
            <div className={dashboardStyles["room-cards"]}>
              <RoomCardsList 
                rooms={createdRooms.slice(0, 4)} // Show first 6
                onViewRoom={handleViewRoom}
              />
            </div>
          ) : (
            <div className={dashboardStyles["no-data"]}>
              <span className={dashboardStyles["no-data-icon"]}>🏫</span>
              <p className={dashboardStyles["no-data-text"]}>No Classrooms Yet</p>
              <p className={dashboardStyles["no-data-subtext"]}>
                Create your first classroom to get started!
              </p>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
