"use client"

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { AuthProtection } from '@/context/AuthProtection'
import { useJoinedRoomsManagement } from '@/hooks/useJoinedRoomsManagement'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import JoinRoomModal from '@/components/student/JoinRoomModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/dashboard-wow.module.css' // Add this import

export default function JoinedRoomsPage() {
    const { userProfile } = useAuthStore()
    const { joinedRooms, loading, fetchJoinedRooms } = useStudentRoomStore()
    const { isLoading: authLoading } = AuthProtection()
    
    const {
        showJoinModal,
        handleViewRoom,
        handleLeaveRoom,
        handleOpenJoinModal,
        handleCloseJoinModal,
        handleJoinSuccess
    } = useJoinedRoomsManagement()

    // Fetch joined rooms when page loads
    useEffect(() => {
        fetchJoinedRooms()
    }, [])

    const joinRoomButton = (
        <button
            onClick={handleOpenJoinModal}
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
            + Join Room
        </button>
    )

    if (authLoading) {
        return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>
    }

    return (
        <LoadingOverlay isLoading={loading}>
            <PageHeader
                title="Joined Rooms"
                userName={userProfile?.first_name}
                subtitle="Rooms you have joined"
                actionButton={joinRoomButton}
            />

            <div className={styles["scrollable-content"]}> {/* Changed from inline style to className */}
                <RoomCardsList
                    rooms={joinedRooms}
                    onViewRoom={handleViewRoom}
                    useRoomCode={true}
                    showClickableCard={true}
                    showDeleteButton={true}
                    showRoomCode={false}
                    onDeleteRoom={handleLeaveRoom}
                    emptyMessage="No rooms joined yet. Join your first room to get started!"
                    isLoading={loading}
                    viewButtonText="Enter"
                    deleteButtonText="Leave"
                />
            </div>

            <JoinRoomModal
                isOpen={showJoinModal}
                onClose={handleCloseJoinModal}
                onSuccess={handleJoinSuccess}
            />
        </LoadingOverlay>
    )
}
