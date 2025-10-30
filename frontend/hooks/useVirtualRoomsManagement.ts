import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { RoomType } from '@/types'
import { TEACHER_ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

export const useVirtualRoomsManagement = () => {
    const router = useRouter()
    const { updateRoom, deleteRoom } = useTeacherRoomStore()
    
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

    const handleEditSubmit = async (
        formData: { title: string; description: string; mantra: string; banner_image: File | null }, 
        roomId: number
    ) => {
        setEditLoading(true)
        
        try {
            const response = await updateRoom(roomId.toString(), {
                title: formData.title,
                description: formData.description,
                mantra: formData.mantra,
                banner_image: formData.banner_image
            })

            if (response.success) {
                toast.success('Room updated successfully!')
                setShowEditModal(false)
                // No need to call fetchRoomDetails since the store already updates currentRoom
            } else {
                toast.error(response.error || 'Failed to update room')
            }
        } catch {
            toast.error('An error occurred while updating the room')
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

    const handleCloseEditModal = () => {
        setShowEditModal(false)
        setEditingRoom(null)
    }

    return {
        // State
        showCreateModal,
        showEditModal,
        editingRoom,
        editLoading,
        
        // Actions
        setShowCreateModal,
        handleViewRoom,
        handleEditRoom,
        handleEditSubmit,
        handleDeleteRoom,
        handleCloseEditModal
    }
}