"use client"
import Loader from '@/components/Loader'
import { myAppHook } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { getAllParticipants, getRoomByCode } from '@/lib/apiService'
import styles from '@/styles/room-competition.module.css'
import { use, useEffect, useState } from 'react'

import { useRouter } from "next/navigation";
import { set } from 'react-hook-form'

interface Room{
    title: string
    description: string
    mantra: string
    banner_image: string | File | undefined
    code: string
}

interface Participant {
    id?:string
    fullName?: string
    gender?: string
    email?: string
}

export default function RoomDetail({ params } : { params  : Promise<{roomCode : string }> }){
    const roomCode = use(params)
    const [ roomDetails, setRoomDetails ] = useState<Room | null>(null)
    const [ participants, setParticipants ] = useState<Participant[]>([])
    const [ isLoading, setIsLoading ] = useState(true)

    const { isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    const router = useRouter();

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
            const test = await getAllParticipants(res.data.id)
            setParticipants( test.data.participants || [] )
            console.log('Attempting to get all participants: ', test.data)
            // console.log('Participants: ', participants)
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

    console.log(
        'Participants: ',
        participants && participants.length > 0 ? participants[0].fullName : 'No participants'
    );

    return (
        <div className={styles["dashboard-container"]}>
            {/* Header Section */}
            <div className={styles["room-header"]}>
                <div className={styles["room-header-content"]}>
                    <div className={styles["room-title-section"]}>
                        <h1 className={styles["room-title"]}>{roomDetails.title}</h1>
                        <div className={styles["room-code-display"]}>
                            Room Code: <span>{roomDetails.code}</span>
                        </div>
                    </div>
                    <div className={styles["room-actions"]}>
                        <button className={styles["share-btn"]}>
                            <span className={styles["share-icon"]}>📤</span>
                            Share Room
                        </button>
                        <button className={styles["edit-room-btn"]}>
                            <span className={styles["edit-icon"]}>✏️</span>
                            Edit Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles["room-content"]}>
                {/* Left Column */}
                <div className={styles["left-column"]}>
                    {/* Room Banner */}
                    <div className={styles["room-banner-section"]}>
                        <div className={styles["room-banner"]}>
                            {roomDetails.banner_image ? (
                                <img 
                                    src={typeof roomDetails.banner_image === 'string' ? roomDetails.banner_image : ''} 
                                    alt={roomDetails.title}
                                    className={styles["banner-image"]}
                                />
                            ) : (
                                <div className={styles["banner-placeholder"]}>
                                    <div className={styles["placeholder-icon"]}>🖼️</div>
                                    <span>No Banner Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Room Description */}
                    <div className={styles["room-info-card"]}>
                        <h3>About This Room</h3>
                        <div className={styles["room-description"]}>
                            {roomDetails.description}
                        </div>
                        <div className={styles["room-mantra"]}>
                            <div className={styles["mantra-label"]}>Room Mantra:</div>
                            <div className={styles["mantra-text"]}>"{roomDetails.mantra}"</div>
                        </div>
                    </div>

                    {/* Problems Section */}
                    <div className={styles["problems-card"]}>
                        <div className={styles["section-header"]}>
                            <h3>Problems</h3>
                            <button
                                className={styles["add-btn"]}
                                onClick={() => router.push(`/virtual-rooms/${roomCode.roomCode}/create-problem`)}
                            >
                                + Add Problem
                            </button>
                        </div>
                        <div className={styles["problems-list"]}>
                            <div className={styles["empty-state"]}>
                                <div className={styles["empty-icon"]}>❓</div>
                                <p>No problems added yet</p>
                                <span>Start by adding your first problem to discuss</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className={styles["right-column"]}>
                    {/* Participants Section */}
                    <div className={styles["participants-card"]}>
                        <div className={styles["section-header"]}>
                            <h3>Participants</h3>
                            <div className={styles["participants-count"]}>0 members</div>
                        </div>
                        <div className={styles["participants-list"]}>
                            <div className={styles["empty-state"]}>
                                <div className={styles["empty-icon"]}>👥</div>
                                <p>No participants yet</p>
                                <span>Invite people to join this room</span>
                            </div>
                        </div>
                        <div className={styles["invite-section"]}>
                            <button className={styles["invite-btn"]}>
                                <span className={styles["invite-icon"]}>✉️</span>
                                Invite Participants
                            </button>
                        </div>
                    </div>

                    {/* Room Settings */}
                    <div className={styles["settings-card"]}>
                        <h3>Room Settings</h3>
                        <div className={styles["settings-list"]}>
                            <div className={styles["setting-item"]}>
                                <span className={styles["setting-label"]}>Room Code</span>
                                <div className={styles["setting-value"]}>
                                    <span>{roomDetails.code}</span>
                                    <button 
                                        className={styles["copy-btn"]}
                                        onClick={() => {
                                            navigator.clipboard.writeText(roomDetails.code)
                                            alert('Room code copied to clipboard!')
                                        }}
                                    >
                                        📋
                                    </button>
                                </div>
                            </div>
                            <div className={styles["setting-item"]}>
                                <span className={styles["setting-label"]}>Room Link</span>
                                <div className={styles["setting-value"]}>
                                    <button 
                                        className={styles["copy-btn"]}
                                        onClick={() => {
                                            const url = window.location.href
                                            navigator.clipboard.writeText(url)
                                            alert('Room link copied to clipboard!')
                                        }}
                                    >
                                        🔗 Copy Link
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={styles["quick-actions-card"]}>
                        <h3>Quick Actions</h3>
                        <div className={styles["action-buttons"]}>
                            <button className={styles["action-btn", "primary"]}>
                                <span className={styles["action-icon"]}>🚀</span>
                                Start Session
                            </button>
                            <button className={styles["action-btn", "secondary"]}>
                                <span className={styles["action-icon"]}>📊</span>
                                View Analytics
                            </button>
                            <button className={styles["action-btn", "secondary"]}>
                                <span className={styles["action-icon"]}>⚙️</span>
                                Room Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}