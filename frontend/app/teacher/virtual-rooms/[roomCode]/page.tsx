"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { useRoomManagement } from '@/hooks/useRoomManagement'
import { useRoomRealtime } from '@/hooks/useRoomRealtime'
import RoomBanner from '@/components/teacher/RoomBanner'
import ProblemsList from '@/components/teacher/ProblemsList'
import ParticipantsSidebar from '@/components/teacher/ParticipantsSidebar'
import EditRoomModal from '@/components/teacher/EditRoomModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import { TEACHER_ROUTES } from '@/constants/routes'
import { FaCopy, FaCheck } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { use } from 'react'
import InviteParticipantModal from '@/components/teacher/InviteParticipantModal'

export default function RoomDetailsPage({ params }: { params: Promise<{ roomCode: string }> }) {
    const { roomCode } = use(params)
    const router = useRouter()
    const { userProfile, isLoggedIn, appLoading } = useAuthStore()
    const { 
        currentRoom, 
        roomLoading, 
        error, 
        fetchRoomDetails, 
        clearCurrentRoom 
    } = useTeacherRoomStore()
    
    const {
        showEditModal,
        setShowEditModal,
        showInviteModal,
        setShowInviteModal,
        editLoading,
        copySuccess,
        handleCopyRoomCode,
        handleEditSubmit,
        handleDeleteRoom,
        handleCompetitionDashboard,
        handleInviteParticipants,
        handleInviteSubmit,
        handleKickParticipant
    } = useRoomManagement(roomCode)

    // Real-time updates for room data
    const { isConnected } = useRoomRealtime(
        currentRoom?.id,
        roomCode,
        fetchRoomDetails
    )

console.log("RoomDetailsPage - currentRoom:", currentRoom)
    useEffect(() => {
        if (roomCode && isLoggedIn) {
            fetchRoomDetails(roomCode)
        }

        return () => {
            // Only clear if navigating OUTSIDE the room context
            // If the next pathname does NOT start with `/teacher/virtual-rooms/${roomCode}`
            // then clear, otherwise keep
            const nextPath = window.location.pathname;
            if (
                !nextPath.startsWith(`${TEACHER_ROUTES.VIRTUAL_ROOMS}/${roomCode}`) || 
                !nextPath.startsWith(`${TEACHER_ROUTES.COMPETITION}/`)
            ) {
                clearCurrentRoom();
            }
        }
    }, [roomCode, isLoggedIn, appLoading, fetchRoomDetails, clearCurrentRoom, router]);

    if (appLoading || roomLoading) {
        return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>
    }

    if (error && !currentRoom) {
        return (
            <div className={styles.errorContainer}>
                <div className={styles.errorContent}>
                    <div className={styles.errorIcon}>!</div>
                    <h2 className={styles.errorTitle}>Room Not Found</h2>
                    <p className={styles.errorMessage}>{error}</p>
                    <button
                        onClick={() => router.push(TEACHER_ROUTES.VIRTUAL_ROOMS)}
                        className={styles.errorButton}
                    >
                        Back to Virtual Rooms
                    </button>
                </div>
            </div>
        )
    }

    if (!currentRoom) {
        return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>
    }

    const { participants = [], problems = [] } = currentRoom

    return (
        <div className={styles.container}>
            {/* Enhanced Banner Header */}
            <RoomBanner
                title={currentRoom.title}
                description={currentRoom.description}
                mantra={currentRoom.mantra}
                banner_image={currentRoom.banner_image}
                roomCode={roomCode}
                copySuccess={copySuccess}
                onCopyRoomCode={handleCopyRoomCode}
                onCompetitionDashboard={handleCompetitionDashboard}
                onEditRoom={() => setShowEditModal(true)}
                onDeleteRoom={handleDeleteRoom}
            />

            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Problems Section - 2/3 */}
                <div className={styles.problemsSection}>
                    <ProblemsList problems={problems} roomCode={roomCode} />
                </div>

                {/* Participants Section - 1/3 */}
                <div className={styles.sidebarSection}>
                    {/* Room Code Section */}
                    <div className={styles.roomCodeSection}>
                        <div 
                            className={styles.roomCodeContainer}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('🔄 Room code container clicked! Room code:', roomCode);
                                handleCopyRoomCode();
                            }}
                            onMouseDown={() => {
                                console.log('🖱️ Mouse down on room code container');
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
                    </div>

                    <ParticipantsSidebar
                        participants={participants}
                        onInviteParticipants={handleInviteParticipants}
                        onKickParticipant={handleKickParticipant}
                    />
                </div>
            </div>

            {/* Edit Room Modal */}
            <EditRoomModal
                room={currentRoom}
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                onSubmit={handleEditSubmit}
                isLoading={editLoading}
            />

            {/* Invite Participant Modal */}
            <InviteParticipantModal 
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                onSubmit={handleInviteSubmit}
            />
        </div>
    )
}
