"use client"

import Loader from "@/components/Loader"
import { myAppHook } from "@/context/AppUtils"
import { AuthProtection } from "@/context/AuthProtection"
import { getRooms } from "@/lib/apiService"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import styles from '@/styles/dashboard.module.css'

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

    const { userProfile, isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()
    const router = useRouter()

    useEffect(() => {
        // Only fetch rooms when authentication is confirmed
        if (
            isLoggedIn 
            && !authLoading
        ) {
            fetchRooms()
        } else {
            console.log('Dashboard: user not logged in yet, waiting for auth')
        }
    }, [
        isLoggedIn,
        authLoading
    ])

    const fetchRooms = async () => {
        try {
            setRoomsLoading(true)
            const response = await getRooms()

            if (
                response && 
                response.data
            ) setRooms(response.data)
            else console.log('Failed to get rooms or empty response')
        } catch (error) {
            console.error('Error in fetching rooms: ', error)
        } finally {
            setRoomsLoading(false)
        }
    }

    const handleViewRoom = (roomId: string) => {
        router.push(`/virtual-rooms/${roomId}`)
    }

    // Show full page loader while auth is being checked
    if (authLoading) {
        console.log('Dashboard: Auth is still loading')
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    // If auth check is complete but user is not logged in, let AuthProtection handle redirect
    if (!isLoggedIn) {
        console.log('Dashboard: User is not logged in')
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    return (
        <div className={styles["dashboard-container"]}>
            {/* Main Content */}
            <div className={styles["main-content"]}>
                <div className={styles["welcome-section"]}>
                    <h3>Welcome, {userProfile?.fullName || 'User'}!</h3>
                    <h1>Dashboard</h1>
                </div>
                
                {isRoomsLoading ? (
                    <div className={styles["loading-indicator"]}><Loader /></div>
                ) : (
                    <div className={styles["dashboard-grid"]} style={{ gridTemplateColumns: "1fr" }}>
                        {/* Room Cards Section */}
                        <div className={styles["room-cards-section"]}>
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
                )}
            </div>
        </div>
    )
}