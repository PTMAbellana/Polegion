'use client'
import Loader from '@/components/Loader'
import { ROUTES } from '@/constants/routes'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { getRooms } from '@/api/rooms'
import { getJoinedRooms } from '@/api/participants'
import styles from '@/styles/room.module.css'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'


interface RoomType {
    id?: number
    title?: string
    description?: string
    mantra?: string
    banner_image?: string | null
}

export default function LeaderboardRooms() {
    const router = useRouter()
    const { isLoggedIn } = myAppHook()
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
                {/* My Room Section - Updated with consistent UI */}
                <div className={styles["room-cards-section"]}>
                    <h2>My Room</h2>
                    <div className={styles["room-cards"]}>
                        {myRooms.length > 0 ? (
                            myRooms.map((room, index) => (
                                <div 
                                    className={styles["room-card"]} 
                                    key={index}
                                    onClick={() => handleViewRoom(room.id || 0)}    // unsa niii?
                                >
                                    <div className={styles["room-card-banner"]}>
                                        {room.banner_image ? (
                                            <img src={room.banner_image} alt={room.title} />
                                        ) : (
                                            <div className={styles["room-card-banner-placeholder"]}>
                                                No Image
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles["room-card-content"]}>
                                        <h3 className={styles["room-card-title"]}>{room.title}</h3>
                                        <p className={styles["room-card-description"]}>{room.description}</p>
                                        <p className={styles["room-card-mantra"]}>{room.mantra || 'No mantra'}</p>
                                        <div className={styles["room-card-actions"]}>
                                            <button
                                                className={styles["view-btn"]}
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent double click from card onClick
                                                    handleViewRoom(room.id || 0);
                                                }}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No rooms created yet.</p>
                        )}
                    </div>
                </div>
                {isRoomsLoading ? (
                    <div className={styles["loading-indicator"]}><Loader /></div>
                ) : (
                        <div className={styles["room-cards-section"]}>
                            <h2>Your Joined Rooms</h2>
                                <div className={styles["room-cards"] }>
                                    {joinRooms.length > 0 ? (
                                        joinRooms.map((room, index) => (
                                             <div className={styles["room-card"]} key={index}>
                                                <div className={styles["room-card-banner"]}>
                                                    {room.banner_image ? (
                                                        <img src={room.banner_image} alt={room.title} />
                                                    ) : (
                                                        <div className={styles["room-card-banner-placeholder"]}>
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={styles["room-card-content"]}>
                                                    <h3 className={styles["room-card-title"]}>{room.title}</h3>
                                                    <p className={styles["room-card-description"]}>{room.description}</p>
                                                    <p className={styles["room-card-mantra"]}>{room.mantra || 'No mantra'}</p>
                                                    <div className={styles["room-card-actions"]}>
                                                        <button
                                                            className={styles["view-btn"]}
                                                            onClick={() => handleViewRoom(room.id || 0)}
                                                        >
                                                            View
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No rooms joined yet.</p>
                                    )}
                                </div>
                            </div>
                    )
                }
            </div>
        </div>
    )
}