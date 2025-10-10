import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'
import { toast } from 'react-hot-toast'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { STUDENT_ROUTES } from '@/constants/routes'

export const useJoinedRoomsManagement = () => {
    const router = useRouter()
    const { joinedRooms, leaveRoom } = useStudentRoomStore()
    const [showJoinModal, setShowJoinModal] = useState(false)

    const handleViewRoom = (roomCode: string | number) => {
        router.push(`${STUDENT_ROUTES.JOINED_ROOMS}/${roomCode}`)
    }

    const handleLeaveRoom = async (roomId: number) => {
        // Find the room to get details for the confirmation dialog
        const room = joinedRooms.find(r => r.id === roomId)
        
        if (!room) {
            toast.error('Room not found')
            return
        }

        const result = await Swal.fire({
            title: 'Leave Room?',
            text: `Are you sure you want to leave "${room.title}"? You can rejoin later with the room code.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, leave room',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
        })

        if (result.isConfirmed) {

            try {
                // Use room_code instead of id for the API call
                const leaveResult = await leaveRoom(roomId)
                
                Swal.close()
                
                if (leaveResult.success) {
                    toast.success(`Successfully left "${room.title}"`)
                } else {
                    toast.error(leaveResult.error || 'Failed to leave room')
                }
            } catch (error) {
                console.error('Leave room error:', error)
                Swal.close()
                toast.error('An error occurred while leaving the room')
            }
        }
    }

    const handleOpenJoinModal = () => {
        setShowJoinModal(true)
    }

    const handleCloseJoinModal = () => {
        setShowJoinModal(false)
    }

    const handleJoinSuccess = (roomCode: string) => {
        toast.success('Successfully joined room!')
        router.push(`${STUDENT_ROUTES.JOINED_ROOMS}/${roomCode}`)
    }

    return {
        showJoinModal,
        handleViewRoom,
        handleLeaveRoom,
        handleOpenJoinModal,
        handleCloseJoinModal,
        handleJoinSuccess
    }
}