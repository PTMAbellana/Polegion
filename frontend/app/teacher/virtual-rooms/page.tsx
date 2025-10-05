"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/authStore'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { AuthProtection } from '@/context/AuthProtection'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import CreateRoomModal from '@/components/teacher/CreateRoomModal'
import EditRoomModal from '@/components/EditRoomModal'
import LoadingOverlay from '@/components/LoadingOverlay'
import { TEACHER_ROUTES } from '@/constants/routes'
import { RoomType } from '@/types/common/room'
import { updateRoom, uploadImage } from '@/api/rooms'
import styles from '@/styles/dashboard-wow.module.css'
import toast from 'react-hot-toast'

export default function VirtualRoomsPage() {
    const router = useRouter()
    const { userProfile } = useAuthStore()
    const { createdRooms, loading, deleteRoom } = useTeacherRoomStore()
    const { isLoading: authLoading } = AuthProtection()
    
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingRoom, setEditingRoom] = useState<RoomType | null>(null)
    const [editLoading, setEditLoading] = useState(false)

    const handleViewRoom = (roomCode: string | number) => {
        router.push(`${TEACHER_ROUTES.VIRTUAL_ROOMS}/${roomCode}`)
    }

    const handleEditRoom = (room: RoomType) => {
        setEditingRoom(room)
        setShowEditModal(true)
    }

    const handleEditSubmit = async (formData: { title: string; description: string; mantra: string; banner_image: File | null }, roomId: number) => {
        setEditLoading(true)
        
        try {
            let bannerImageUrl: string | File | null = null

            // Handle image upload if a new file was selected
            if (formData.banner_image instanceof File) {
                const formDataForUpload = new FormData()
                formDataForUpload.append('image', formData.banner_image)
                
                const uploadResponse = await uploadImage(formDataForUpload)

                if (uploadResponse.success && uploadResponse.imageUrl) {
                    bannerImageUrl = uploadResponse.imageUrl
                } else {
                    toast.error('Failed to upload image. Please try again.')
                    return
                }
            } else {
                const currentRoom = createdRooms.find(r => r.id === roomId)
                if (currentRoom?.banner_image) {
                    bannerImageUrl = currentRoom.banner_image
                }
            }

            const roomPayload = {
                title: formData.title,
                description: formData.description,
                mantra: formData.mantra,
                banner_image: bannerImageUrl,
            }

            const response = await updateRoom(roomId, roomPayload)
            
            if (response.success) {
                toast.success('Room updated successfully!')
                
                // Close modal
                setShowEditModal(false)
                setEditingRoom(null)
                
                // The store should automatically refresh the rooms list
            } else {
                toast.error(response.message || 'Failed to update room')
            }
            
        } catch (error) {
            console.error('Error updating room:', error)
            toast.error('Failed to update room. Please try again.')
        } finally {
            setEditLoading(false)
        }
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
                onClose={() => {
                    setShowEditModal(false)
                    setEditingRoom(null)
                }}
                onSubmit={handleEditSubmit}
                isLoading={editLoading}
            />
        </LoadingOverlay>
    )
};
