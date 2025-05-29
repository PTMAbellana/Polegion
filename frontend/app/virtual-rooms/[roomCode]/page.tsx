"use client"
import Loader from '@/components/Loader'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { getRoomByCode } from '@/lib/apiService'
import styles from '@/styles/room.module.css'
import { use, useEffect, useState } from 'react'

interface Room{
    title: string
    description: string
    mantra: string
    banner_image: string | File | undefined
    code: string
}

export default function RoomDetail({ params } : { params  : Promise<{roomCode : string }> }){
    const roomCode = use(params)
    const [ roomDetails, setRoomDetails ] = useState<Room | null>(null)
    const [ isLoading, setIsLoading ] = useState(true)

    const { isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    console.log('room code ', roomCode)

    useEffect(() => {
        if (isLoggedIn && !authLoading) {
            callMe()
        } else {
            if (authLoading || !isLoggedIn) {
                setIsLoading(true)
            }
        }
    }, [isLoggedIn, authLoading])

    const callMe = async () => {
        try {
            setIsLoading(true)
            const res = await getRoomByCode(roomCode.roomCode)
            console.log(res.data)
            setRoomDetails(res.data)
        } catch (error) {
            console.error('Error fetching room details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading || authLoading) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["loading-container"]}>
                    <Loader/>
                </div>
            </div>
        )
    }

    if (!roomDetails) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["main-content"]}>
                    <div className={styles["no-data"]}>
                        Room not found or failed to load
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles["dashboard-container"]}>
            {/* Header Section */}
            <div className={styles["header-section"]}>
                <div className={styles["welcome-text"]}>
                    <h1>Room Details</h1>
                    <p>Viewing room: {roomCode.roomCode}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles["main-content"]}>
                <div className={styles["dashboard-grid"]}>
                    {/* Room Detail Card */}
                    <div className={styles["card"]}>
                        <div className={styles["room-card-banner"]}>
                            {roomDetails.banner_image ? (
                                <img 
                                    src={typeof roomDetails.banner_image === 'string' ? roomDetails.banner_image : ''} 
                                    alt={roomDetails.title}
                                />
                            ) : (
                                <div className={styles["room-card-banner-placeholder"]}>
                                    No Image Available
                                </div>
                            )}
                        </div>
                        
                        <div className={styles["room-card-content"]}>
                            <h3 className={styles["room-card-title"]}>{roomDetails.title}</h3>
                            
                            <div className={styles["room-code"]}>
                                Room Code: {roomDetails.code}
                            </div>
                            
                            <div className={styles["form-group"]}>
                                <label>Description:</label>
                                <div className={styles["room-card-description"]}>
                                    {roomDetails.description}
                                </div>
                            </div>
                            
                            <div className={styles["form-group"]}>
                                <label>Mantra:</label>
                                <div className={styles["room-card-mantra"]}>
                                    "{roomDetails.mantra}"
                                </div>
                            </div>
                            
                            <div className={styles["room-card-actions"]}>
                                <button 
                                    className={styles["edit-btn"]}
                                    onClick={() => {
                                        // Add edit functionality here
                                        console.log('Edit room:', roomDetails.code)
                                    }}
                                >
                                    Edit Room
                                </button>
                                <button 
                                    className={styles["view-btn"]}
                                    onClick={() => {
                                        // Add join/enter room functionality here
                                        console.log('Enter room:', roomDetails.code)
                                    }}
                                >
                                    Enter Room
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Additional Information Card */}
                    <div className={styles["card"]}>
                        <h3>Room Information</h3>
                        <div className={styles["form-group"]}>
                            <label>Room Code:</label>
                            <div className={styles["form-control"]} style={{background: '#f8f9fa', cursor: 'text'}}>
                                {roomDetails.code}
                            </div>
                        </div>
                        
                        <div className={styles["form-group"]}>
                            <label>Share this room:</label>
                            <div className={styles["form-actions"]}>
                                <button 
                                    className={styles["submit-btn"]}
                                    onClick={() => {
                                        navigator.clipboard.writeText(roomDetails.code)
                                        alert('Room code copied to clipboard!')
                                    }}
                                >
                                    Copy Room Code
                                </button>
                                <button 
                                    className={styles["cancel-btn"]}
                                    onClick={() => {
                                        const url = window.location.href
                                        navigator.clipboard.writeText(url)
                                        alert('Room link copied to clipboard!')
                                    }}
                                >
                                    Copy Room Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}