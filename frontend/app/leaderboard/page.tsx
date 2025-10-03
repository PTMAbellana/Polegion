'use client'
import { ROUTES } from '@/constants/routes'
import { useMyApp } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { getRooms } from '@/api/rooms'
import { getJoinedRooms } from '@/api/participants'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RoomType } from '@/types/common/room'
import PageHeader from '@/components/PageHeader'
import RoomCardsList from '@/components/RoomCardsList'
import Loader from '@/components/Loader'
import { useAuthStore } from '@/store/authStore'

export default function LeaderboardRooms() {
    const router = useRouter()
    const { isLoggedIn, userProfile } = useAuthStore()
    const { isLoading: authLoading } = AuthProtection()

    const [myRooms, setMyRooms] = useState<RoomType[]>([])
    const [joinRooms, setJoinRooms] = useState<RoomType[]>([])
    const [isRoomsLoading, setRoomsLoading] = useState(true)
    useEffect(() => {
        console.log('isLoggedin ', isLoggedIn)
        console.log('authLoading ', authLoading)
        if (
            isLoggedIn && 
            !authLoading
        ) fetchRooms()
        else {
            if (authLoading) fullLoader()
            if (!isLoggedIn) fullLoader()
        }
    }, [isLoggedIn, authLoading])

    const fullLoader = () => {
        console.log('Leaderboard Rooms: Auth is still loading')
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Loader/>
            </div>
        )
    }

    const fetchRooms = async () => {
        try {
            setRoomsLoading(true)
            const my_rooms = await getRooms()
            const joined_rooms = await getJoinedRooms()

            console.log('Fetched rooms: ', my_rooms)

            if (
                my_rooms && 
                my_rooms.data
            ) setMyRooms(my_rooms.data)
            
            if (
                joined_rooms && 
                joined_rooms.data
            ) setJoinRooms(joined_rooms.data.rooms)

            else console.log('Failed to get rooms or empty response')
            console.log('Joined Rooms 1: ', joined_rooms.data)
            // setJoinRooms(joined_rooms.data)
        } catch (error) {
            console.error('Error in fetching rooms: ', error)
        } finally {
            setRoomsLoading(false)
        }
    }

    const handleViewRoom = (roomId: string | number) => {
        console.log('Viewing room with ID: ', roomId)
        router.push(`${ROUTES.LEADERBOARD}/${roomId}`)
    }

    return (
        <div>
            <PageHeader 
                title="Leaderboards"
                userName={userProfile?.fullName || 'John Doe'}
                subtitle="How well did you do?"
            />
            
            <div>
                <RoomCardsList
                    title="My Room"
                    rooms={myRooms}
                    onViewRoom={handleViewRoom}
                    useRoomCode={false} // Use ID instead of code
                    showClickableCard={true} // Entire card is clickable
                    emptyMessage="No rooms created yet."
                />
                
                {isRoomsLoading ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>
                        <Loader />
                    </div>
                ) : (
                    <RoomCardsList
                        title="Your Joined Rooms"
                        rooms={joinRooms}
                        onViewRoom={handleViewRoom}
                        useRoomCode={false} // Use ID instead of code
                        emptyMessage="No rooms joined yet."
                        viewButtonText="View Leaderboard"
                    />
                )}
            </div>
        </div>
    )
}
