"use client"

import { AuthProtection } from "@/context/AuthProtection"
import { getRooms } from "@/api/rooms"
import { getJoinedRooms } from "@/api/participants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ROUTES } from "@/constants/routes"
import { RoomType } from "@/types/common/room"
import LoadingOverlay from "@/components/LoadingOverlay"
import PageHeader from "@/components/PageHeader"
import RoomCardsList from "@/components/RoomCardsList"
import { useAuthStore } from "@/store/authStore"

export default function Dashboard() { 
    const [rooms, setRooms] = useState<RoomType[]>([])
    const [isRoomsLoading, setRoomsLoading] = useState(true)
    const [joinRooms, setJoinRooms] = useState<RoomType[]>([])
    const { isLoading: authLoading } = AuthProtection()
    const router = useRouter()
    const {userProfile, isLoggedIn} = useAuthStore()
    // Only fetch rooms when authentication is confirmed
    useEffect(() => {
        if (isLoggedIn && !authLoading) {
            fetchRooms()
        }
    }, [isLoggedIn, authLoading])

    const fetchRooms = async () => {
        try {
            setRoomsLoading(true)
            const response = await getRooms()
            const joined_rooms = await getJoinedRooms()
            if (response && response.data) setRooms(response.data)
            if (joined_rooms && joined_rooms.data) setJoinRooms(joined_rooms.data.rooms)
        } catch (error) {
            console.error('Error in fetching rooms: ', error)
        } finally {
            setRoomsLoading(false)
        }
    }

    const handleViewRoom = (roomCode: string | number) => {
        router.push(`${ROUTES.VIRTUAL_ROOMS}/${roomCode}`)    
    }
    
    const handleViewJoinedRoom = (roomCode: string | number) => {
        router.push(`${ROUTES.JOINED_ROOMS}/${roomCode}`)    
    }

    return (
        <LoadingOverlay isLoading={isRoomsLoading}>
            <PageHeader 
                title="Dashboard"
                userName={userProfile?.fullName || 'John Doe'}
            />
            
            <div>
                <RoomCardsList
                    title="Your Joined Rooms"
                    rooms={joinRooms}
                    onViewRoom={handleViewJoinedRoom}
                    useRoomCode={true}
                    emptyMessage="No rooms joined yet."
                />
                
                <RoomCardsList
                    title="Your Virtual Rooms"
                    rooms={rooms}
                    onViewRoom={handleViewRoom}
                    useRoomCode={true}
                    emptyMessage="No rooms found. Contact admin to create your first virtual room."
                />
            </div>
        </LoadingOverlay>
    )
}
