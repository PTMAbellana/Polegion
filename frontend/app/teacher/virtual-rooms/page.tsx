"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { AuthProtection } from '@/context/AuthProtection'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import CreateRoomModal from '@/components/teacher/CreateRoomModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import { ROUTES } from '@/constants/routes'
import { RoomType } from '@/types/common/room'

export default function VirtualRoomsPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { createdRooms, loading, deleteRoom, setSelectedRoom } = useTeacherRoomStore()
    const { isLoading: authLoading } = AuthProtection()
    
    const [showCreateModal, setShowCreateModal] = useState(false)

    const handleViewRoom = (roomCode: string | number) => {
        router.push(`${ROUTES.VIRTUAL_ROOMS}/${roomCode}`)
    }

    const handleEditRoom = (room: RoomType) => {
        setSelectedRoom(room)
        // You can implement edit functionality here later
        console.log('Edit room:', room)
    }

    const handleDeleteRoom = async (roomId: string | number) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            const result = await deleteRoom(roomId.toString())
            if (!result.success) {
                alert(result.error || 'Failed to delete room')
            }
        }
    }

    const createRoomButton = (
        <button
            onClick={() => setShowCreateModal(true)}
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
    )

    if (authLoading) {
        return <LoadingOverlay isLoading={true}><div /></LoadingOverlay>
    }

    return (
        <LoadingOverlay isLoading={loading}>
            <PageHeader
                title="Virtual Rooms"
                userName={userProfile?.first_name}
                subtitle="Manage your created rooms"
                actionButton={createRoomButton}
            />

            <div style={{ padding: '2rem' }}>
                <RoomCardsList
                    rooms={createdRooms}
                    onViewRoom={handleViewRoom}
                    useRoomCode={true}
                    showClickableCard={true}
                    showEditButton={true}
                    showDeleteButton={true}
                    showRoomCode={true}
                    onEditRoom={handleEditRoom}
                    onDeleteRoom={handleDeleteRoom}
                    emptyMessage="No rooms created yet. Create your first room to get started!"
                    isLoading={loading}
                />
            </div>

            <CreateRoomModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
        </LoadingOverlay>
    )
};
