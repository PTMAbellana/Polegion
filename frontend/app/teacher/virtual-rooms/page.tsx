"use client"

import React, { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { useVirtualRoomsManagement } from '@/hooks/useVirtualRoomsManagement'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import CreateRoomModal from '@/components/teacher/CreateRoomModal'
import EditRoomModal from '@/components/teacher/EditRoomModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import styles from '@/styles/dashboard-wow.module.css'

export default function VirtualRoomsPage() {
    const { userProfile, appLoading } = useAuthStore()
    const { createdRooms, loading, clearCurrentRoom } = useTeacherRoomStore()
    
    const {
        showCreateModal,
        showEditModal,
        editingRoom,
        editLoading,
        setShowCreateModal,
        handleViewRoom,
        handleEditRoom,
        handleEditSubmit,
        handleDeleteRoom,
        handleCloseEditModal
    } = useVirtualRoomsManagement()

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

    useEffect(() => {
        clearCurrentRoom()
    }, [clearCurrentRoom])

    if (appLoading) {
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

            <div className={styles["scrollable-content"]}>
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

            <EditRoomModal
                room={editingRoom}
                isOpen={showEditModal}
                onClose={handleCloseEditModal}
                onSubmit={handleEditSubmit}
                isLoading={editLoading}
            />
        </LoadingOverlay>
    )
};
