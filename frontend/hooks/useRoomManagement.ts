import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTeacherRoomStore } from '@/store/teacherRoomStore'
import { TEACHER_ROUTES } from '@/constants/routes'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

export const useRoomManagement = (roomCode: string) => {
    const router = useRouter()
    const { currentRoom, deleteRoom, updateRoom, inviteParticipant } = useTeacherRoomStore()

    const [showEditModal, setShowEditModal] = useState(false)
    const [showInviteModal, setShowInviteModal] = useState(false) // Add this
    const [editLoading, setEditLoading] = useState(false)
    const [copySuccess, setCopySuccess] = useState(false)

    const handleInviteParticipants = () => {
        setShowInviteModal(true) // Open the modal
    }

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
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Are you sure you want to delete this room? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        })

        if (result.isConfirmed) {
            const deleteResult = await deleteRoom(currentRoom?.id?.toString() || '')
            if (deleteResult.success) {
                toast.success('Room deleted successfully!')
                router.replace(TEACHER_ROUTES.VIRTUAL_ROOMS)
            } else {
                toast.error(deleteResult.error || 'Failed to delete room')
            }
        }
    }

    const handleCompetitionDashboard = () => {
        router.push(TEACHER_ROUTES.COMPETITION) // Temporary until competitions are implemented
    }

    const handleInviteSubmit = async (email: string) => {
        try {
            const result = await inviteParticipant( roomCode, email )
            if (!result.success) {
                toast.error(result.error || 'Failed to send invitation')
                return
            }
            console.log('Inviting participant with email:', email)
            toast.success('Invitation sent successfully!')
            setShowInviteModal(false)
        } catch (error: unknown) {
            console.log('Error sending invitation:', error)
            toast.error('Failed to send invitation')
        }
    }

    return {
        showEditModal,
        setShowEditModal,
        showInviteModal, // Add this
        setShowInviteModal, // Add this
        editLoading,
        copySuccess,
        handleCopyRoomCode,
        handleEditSubmit,
        handleDeleteRoom,
        handleCompetitionDashboard,
        handleInviteParticipants,
        handleInviteSubmit, // ADD THIS LINE
    }
}