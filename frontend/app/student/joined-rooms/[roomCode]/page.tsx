"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { useStudentRoomManagement } from '@/hooks/useStudentRoomManagement'
import StudentRoomBanner from '@/components/student/StudentRoomBanner'
import TabContainer from '@/components/student/TabContainer'
import StudentParticipantsList from '@/components/student/StudentParticipantsList'
import LoadingOverlay from '@/components/LoadingOverlay'
import { STUDENT_ROUTES } from '@/constants/routes'
import { FaCopy, FaCheck, FaSyncAlt } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { use } from 'react'
import Loader from '@/components/Loader'

export default function StudentRoomDetailsPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const { roomCode } = use(params)
    const router = useRouter()
    const { userProfile, isLoggedIn, appLoading } = useAuthStore()
    const { 
        currentRoom, 
        roomLoading, 
        error, 
        fetchRoomDetails,
        fetchJoinedRooms,
        clearCurrentRoom 
    } = useStudentRoomStore()
    
    const {
        copySuccess,
        handleLeaveRoom,
        handleCopyRoomCode
    } = useStudentRoomManagement(roomCode, currentRoom?.id)

    const handleRefresh = async () => {
        if (roomCode) {
            // First refetch the joined rooms to get latest room data
            await fetchJoinedRooms()
            // Then fetch the detailed room data
            await fetchRoomDetails(roomCode)
        }
    }

    useEffect(() => {
        if (roomCode && isLoggedIn) {
            fetchRoomDetails(roomCode)
        }

        return () => {
            clearCurrentRoom()
        }
    }, [roomCode, isLoggedIn, appLoading, fetchRoomDetails, clearCurrentRoom])

    if (appLoading || roomLoading) {
        return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>
    }

    if (error && !currentRoom) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2 className={styles.errorTitle}>Room Not Found</h2>
                    <p className={styles.errorMessage}>{error}</p>
                    <button
                        onClick={() => router.push(STUDENT_ROUTES.JOINED_ROOMS)}
                        className={styles.errorButton}
                    >
                        Back to Joined Rooms
                    </button>
                </div>
            </div>
        )
    }

    if (!currentRoom) {
        return <LoadingOverlay isLoading={true}><Loader /></LoadingOverlay>
    }

    const { participants = [], problems = [], competitions = [] } = currentRoom

    return (
        <div className={styles.container}>
            {/* Student Banner Header */}
            <StudentRoomBanner
                title={currentRoom.title}
                description={currentRoom.description}
                mantra={currentRoom.mantra}
                banner_image={currentRoom.banner_image}
                roomId={currentRoom.id?.toString() || ''}
                onLeaveRoom={handleLeaveRoom}
            />

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Tabs Section - 2/3 */}
                <div className={styles.problemsSection}>
                    <TabContainer 
                        problems={problems} 
                        competitions={competitions} 
                        roomCode={roomCode} 
                    />
                </div>

                {/* Sidebar Section - 1/3 */}
                <div className={styles.sidebarSection}>
                    {/* Room Code Section */}
                    <div className={styles.roomCodeSection}>
                        <div 
                            className={styles.roomCodeContainer}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCopyRoomCode();
                            }}
                            style={{ 
                                cursor: 'pointer', 
                                userSelect: 'none',
                                position: 'relative',
                                zIndex: 10,
                                pointerEvents: 'auto'
                            }}
                            title="Click to copy room code"
                        >
                            <span className={styles.roomCodeText}>{roomCode}</span>
                            {copySuccess ? (
                                <FaCheck className={`${styles.roomCodeIcon} ${styles.roomCodeIconSuccess}`} />
                            ) : (
                                <FaCopy className={styles.roomCodeIcon} />
                            )}
                        </div>
                        <button 
                            onClick={handleRefresh}
                            className={styles.refreshButton}
                            title="Refresh room data"
                            disabled={roomLoading}
                        >
                            <FaSyncAlt className={roomLoading ? styles.spinning : ''} />
                            <span>Refresh</span>
                        </button>
                    </div>

                    <StudentParticipantsList participants={participants} />
                </div>
            </div>
        </div>
    )
}
