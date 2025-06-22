'use client'
import Loader from '@/components/Loader'
import { ROUTES } from '@/constants/routes'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { getJoinedRooms, getRooms } from '@/lib/apiService'
import styles from '@/styles/room.module.css'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'


interface RoomType {
    id?: number
    title?: string
    description?: string
    banner_image?: string | null
}

export default function LeaderboardRooms() {
    const router = useRouter()
    const { isLoggedIn, userProfile } = myAppHook()
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
            <div className={styles["loading-container"]}>
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

    const handleViewRoom = (roomId: number) => {
        console.log('Viewing room with ID: ', roomId)
        router.push(`${ROUTES.LEADERBOARD}/${roomId}`)
    }

    return (
        <div className={styles['dashboard-container']}>
            <div className={styles["main-content"]}>
                <h1>Leaderboard is coming soon!</h1>
                <h2>My Room</h2>
                <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap' }}>
                    {myRooms.length > 0 ? (
                        myRooms.map((room, index) => (
                            <div 
                            key={index} 
                            className={styles["room-card"]} 
                            style={{ width: '20%'}}
                            onClick={() => handleViewRoom(room.id)}>
                                <h3>{room.title}</h3>
                                <p>{room.description}</p>
                                {room.banner_image && (
                                    <img 
                                    src={room.banner_image} 
                                    alt={room.title}
                                    style={{ width: '100%', height: 'auto' }}
                                     />
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No rooms created yet.</p>
                    )}
                </div>
                <h2>Your Joined Rooms</h2>
                <div style={{ marginBottom: '20px', width: '100%', display: 'flex', flexDirection: 'row', gap: '10px', flexWrap: 'wrap' }}>
                    {joinRooms.length > 0 ? (
                        joinRooms.map((room, index) => (
                            <div 
                            key={index} 
                            className={styles["room-card"]} 
                            style={{ width: '20%'}}
                            onClick={() => handleViewRoom(room.id)}>
                                <h3>{room.title}</h3>
                                <p>{room.description}</p>
                                {room.banner_image && (
                                    <img 
                                    src={room.banner_image} 
                                    alt={room.title}
                                    style={{ width: '100%', height: 'auto' }}
                                    />
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No rooms joined yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}