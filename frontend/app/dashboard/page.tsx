"use client"

import Loader from "@/components/Loader"
import { myAppHook } from "@/context/AppUtils"
import { AuthProtection } from "@/context/AuthProtection"
import { getRooms } from "@/api/rooms"
import { getJoinedRooms } from "@/api/participants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import styles from '@/styles/dashboard-wow.module.css'
import { ROUTES } from "@/constants/routes"

interface RoomType {
    id?: number
    title?: string
    description?: string
    mantra?: string
    banner_image?: string | null
    created_at?: string
    code?: string
}

export default function Dashboard() { 
    const [rooms, setRooms] = useState<RoomType[]>([])
    const [isRoomsLoading, setRoomsLoading] = useState(true)
    const [joinRooms, setJoinRooms] = useState<RoomType[]>([])
    const { userProfile, isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()
    const router = useRouter()

    // Only fetch rooms when authentication is confirmed
    useEffect(() => {
        if (isLoggedIn && !authLoading) {
            fetchRooms()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const handleViewRoom = (roomCode: string) => {
        router.push(`${ROUTES.VIRTUAL_ROOMS}/${roomCode}`)    
    }
    
    const handleViewJoinedRoom = (roomCode: string) => {
        router.push(`${ROUTES.JOINED_ROOMS}/${roomCode}`)    
    }

    return (
        <div className={styles["dashboard-container"]}>
            {isRoomsLoading && (
                <div className={styles["loading-overlay"]}>
                    <Loader />
                </div>
            )}{/* Header Section */}
            <div className={styles["header-section"]}>
                <div className={styles["user-avatar"]}>
                    <span className={styles["avatar-letter"]}>
                        {userProfile?.fullName?.charAt(0)?.toUpperCase() || 'J'}
                    </span>
                </div>
                <div className={styles["welcome-text"]}>
                    <h1>Dashboard</h1>
                    <p>Welcome, {userProfile?.fullName || 'John Doe'}</p>
                    {/* <p>Let your imagination run wild!</p> */}
                </div>
                {/* <div className={styles["search-section"]}>
                    <span>Search</span>
                    <div className={styles["search-icon"]}>🔍</div>
                </div> */}
            </div>
            {/* Main Content */}
            <div className={styles["main-content"]}>
                {/* <div className={styles["welcome-section"]}>
                    <h1>Dashboard</h1>
                </div> */}
                <div className={styles["room-cards-section"]}>
                    <h2>Your Joined Rooms</h2>
                    <div className={styles["room-cards"]}>
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
                                                onClick={() => handleViewJoinedRoom(room.code || '')}
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
                <div className={styles["room-cards-section"]}>
                    <br></br>
                    <br></br>
                    <h2>Your Virtual Rooms</h2>
                    {rooms && rooms.length > 0 ? (
                        <div className={styles["room-cards"]}>
                            {rooms.map((room, index) => (
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
                                                onClick={() => handleViewRoom(room.code || '')}
                                            >
                                                View
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles["no-data"]}>
                            No rooms found. Contact admin to create your first virtual room.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}