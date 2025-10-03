"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { AuthProtection } from '@/context/AuthProtection'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import JoinRoomModal from '@/components/student/JoinRoomModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import { ROUTES } from '@/constants/routes'


export default function JoinedRoomsPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { joinedRooms, loading, leaveRoom } = useStudentRoomStore()
    const { isLoading: authLoading } = AuthProtection()
    
    const [showJoinModal, setShowJoinModal] = useState(false)

    const handleViewRoom = (roomCode: string | number) => {
        router.push(`${ROUTES.JOINED_ROOMS}/${roomCode}`)
    }

    const handleLeaveRoom = async (roomId: string | number) => {
        if (window.confirm('Are you sure you want to leave this room?')) {
            // Find the room to get the participant_id
            const room = joinedRooms.find(r => r.id?.toString() === roomId.toString());
            if (room && room.id) {
                const result = await leaveRoom(room.id.toString())
                if (!result.success) {
                    alert(result.error || 'Failed to leave room')
                }
            } else {
                alert('Room not found or invalid participant data')
            }
        }
    }

    const joinRoomButton = (
        <button
            onClick={() => setShowJoinModal(true)}
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

            <div style={{ padding: '2rem' }}>
                <RoomCardsList
                    rooms={joinedRooms}
                    onViewRoom={handleViewRoom}
                    useRoomCode={true}
                    showClickableCard={true}
                    showDeleteButton={true}
                    showRoomCode={true}
                    onDeleteRoom={handleLeaveRoom}
                    emptyMessage="No rooms joined yet. Join your first room to get started!"
                    isLoading={loading}
                    viewButtonText="Enter"
                    deleteButtonText="Leave"
                />
            </div>

            <JoinRoomModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
            />
        </LoadingOverlay>
    )
};
