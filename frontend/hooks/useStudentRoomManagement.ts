import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useStudentRoomStore } from '@/store/studentRoomStore'
import { STUDENT_ROUTES } from '@/constants/routes'
import Swal from 'sweetalert2'
import toast from 'react-hot-toast'

export function useStudentRoomManagement(roomCode: string, roomId?: number) {
    const router = useRouter()
    const { leaveRoom, clearCurrentRoom } = useStudentRoomStore()
    const [copySuccess, setCopySuccess] = useState(false)

    const handleLeaveRoom = async () => {
        if (!roomId) {
            toast.error('Unable to process request. Room information not found')
            return
        }

        const result = await Swal.fire({
            title: 'Leave Room?',
            text: 'Are you sure you want to leave this room? You can rejoin later with the room code.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, leave room',
            cancelButtonText: 'Cancel'
        })

        if (result.isConfirmed) {
            const response = await leaveRoom(roomId)
            if (response.success) {
                Swal.fire({
                    title: 'Left Room!',
                    text: 'You have successfully left the room.',
                    icon: 'success',
                    confirmButtonColor: '#10b981'
                }).then(() => {
                    clearCurrentRoom()
                    router.replace(STUDENT_ROUTES.JOINED_ROOMS)
                })
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.error || 'Failed to leave room. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#dc2626'
                })
            }
        }
    }

    const handleCopyRoomCode = async () => {
        try {
            // First, try using the Clipboard API
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(roomCode)
                setCopySuccess(true)
                toast.success('Room code copied to clipboard!')
                setTimeout(() => setCopySuccess(false), 2000)
                return
            }

            // Fallback for older browsers
            const textArea = document.createElement('textarea')
            textArea.value = roomCode
            textArea.style.position = 'fixed'
            textArea.style.left = '-999999px'
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()

            try {
                const successful = document.execCommand('copy')
                if (successful) {
                    setCopySuccess(true)
                    toast.success('Room code copied to clipboard!')
                    setTimeout(() => setCopySuccess(false), 2000)
                } else {
                    throw new Error('Copy command failed')
                }
            } finally {
                document.body.removeChild(textArea)
            }
        } catch (err) {
            console.error('Failed to copy:', err)
            // Final fallback - show the code in an alert
            alert(`Room Code: ${roomCode}\n\nPlease copy this code manually.`)
        }
    }

    return {
        copySuccess,
        handleLeaveRoom,
        handleCopyRoomCode
    }
}
