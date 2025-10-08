import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { TEACHER_ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'

export const useRoomManagement = (roomCode: string) => {
    const router = useRouter()
    const { currentRoom, deleteRoom, updateRoom } = useTeacherRoomStore()
    
    const [showEditModal, setShowEditModal] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)

    const handleCopyRoomCode = async () => {
        console.log('🔄 Copy room code clicked! Room code:', roomCode)
        try {
            // Try the modern clipboard API first
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(roomCode)
                console.log('✅ Room code copied successfully with navigator.clipboard!')
            } else {
                // Fallback method for older browsers or non-HTTPS contexts
                console.log('📋 Using fallback copy method...')
                const textArea = document.createElement('textarea')
                textArea.value = roomCode
                textArea.style.position = 'fixed'
                textArea.style.left = '-999999px'
                textArea.style.top = '-999999px'
                document.body.appendChild(textArea)
                textArea.focus()
                textArea.select()
                document.execCommand('copy')
                textArea.remove()
                console.log('✅ Room code copied successfully with fallback method!')
            }
            
            setCopySuccess(true)
            toast.success('Room code copied to clipboard!')
            setTimeout(() => setCopySuccess(false), 2000)
        } catch (error) {
            console.error('❌ Failed to copy room code:', error)
            toast.error('Failed to copy room code')
            
            // Final fallback - show the room code in an alert
            alert(`Room code: ${roomCode}\n\nPlease copy this manually.`)
        }
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

    const handleDeleteRoom = async () => {
        if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
            const result = await deleteRoom(currentRoom?.id?.toString() || '')
            if (result.success) {
                toast.success('Room deleted successfully!')
                router.push(TEACHER_ROUTES.VIRTUAL_ROOMS)
            } else {
                toast.error(result.error || 'Failed to delete room')
            }
        }
    }

    const handleCompetitionDashboard = () => {
        router.push(`/teacher/competitions/${roomCode}`)
    }

    const handleInviteParticipants = () => {
        toast('Invite functionality coming soon!', { icon: 'ℹ️' })
    }

    return {
        showEditModal,
        setShowEditModal,
        editLoading,
        copySuccess,
        handleCopyRoomCode,
        handleEditSubmit,
        handleDeleteRoom,
        handleCompetitionDashboard,
        handleInviteParticipants
    }
}