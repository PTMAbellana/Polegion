'use client'

import { myAppHook } from "@/context/AppUtils"
import { AuthProtection } from "@/context/AuthProtection"
import { use, useEffect, useState } from "react"
import styles from '@/styles/join-room.module.css'
import Loader from "@/components/Loader"
import { getRoomByCode } from "@/api/rooms"
import { getAllParticipants, isParticipant, leaveRoom, totalParticipant } from "@/api/participants"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import toast from "react-hot-toast"

interface Room{
    id?: string
    title: string
    description: string
    mantra: string
    banner_image: string | File | undefined
    code: string
}

interface Participant {
    id?: string
    fullName?: string
    gender?: string
    email?: string
}

export default function JoinRoom({ params } : { params  : Promise<{roomCode : string }> }){
    console.log(params)
    const roomCode = use(params)
    const router = useRouter()
    
    const [roomDetails, setRoomDetails] = useState<Room | null>(null)
    const [ participants, setParticipants ] = useState<Participant[]>([])
    const [ totalParticipants, setTotalParticipants ] = useState<number>(0)
    const [isLoading, setIsLoading] = useState(true)
    const [ isPart, setIsPart ] = useState(false)
    const [showJoinStatus, setShowJoinStatus] = useState(true);

    const { isLoggedIn } = myAppHook()
    const { isLoading: authLoading } = AuthProtection()

    console.log(roomCode)

    useEffect(() => {
        if (isLoggedIn && !authLoading) {
            callMe()
        } else {
            if (authLoading || !isLoggedIn) setIsLoading(true)
        }
    }, [isLoggedIn, authLoading])

    const callMe = async() => {
        try {
            setIsLoading(true)
            const res = await getRoomByCode(roomCode.roomCode)
            console.log(res.data)
            setRoomDetails(res.data)

            const data = await isParticipant(res.data.id)
            console.log('isParticipant :', data)
            setIsPart(data.data?.isParticipant)
            
            const test = await getAllParticipants(res.data.id)
            console.log('Attempting to get all participants: ', test.data)

            setParticipants( test.data.participants || [] )
            console.log('Attempting to get all participants: ', test.data)

            const total = await totalParticipant(res.data.id)
            setTotalParticipants(total.data.total_participants || 0)
            console.log('Attempting to total participants: ', total.data.total_participants)
        } catch (error) {
            console.log('Error fetching room details: ', error)
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
                <div className={styles["no-data"]}>
                    Room not found or failed to load
                </div>
            </div>
        )
    }
    
    if (!isPart) {
        return (
            <div className={styles["dashboard-container"]}>
                <div className={styles["no-data"]}>
                    Room not authorized
                </div>
            </div>
        )
    }

    const handleLeaveRoom = async () => {
        console.log('isCLicked leave room')
        try {
            await leaveRoom(roomDetails.id)
            router.replace(ROUTES.DASHBOARD)
        } catch (error) {
            console.log('Error in leaving room: ', error)
            toast.error('Error in leaving room')
        }
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
                        <button className={styles["leave-room-btn"]} onClick={handleLeaveRoom}>
                            <span className={styles["leave-icon"]}>🚶🏾</span>
                            Leave Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className={styles["room-content"]}>
                <div className={styles["main-column"]}>
                    {/* Join Status */}
                    {showJoinStatus && (
                        <div className={styles["modal-overlay"]}>
                            <div className={styles["join-status-modal"]}>
                                <span className={styles["join-status-icon"]}>✅</span>
                                <span>You have successfully joined this room!</span>
                                <button
                                    className={styles["close-modal-btn"]}
                                    onClick={() => setShowJoinStatus(false)}
                                    aria-label="Close"
                                >
                                    ✖
                                </button>
                            </div>
                        </div>
                    )}

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
                            <div className={styles["mantra-text"]}>&ldquo;{roomDetails.mantra}&rdquo;</div>
                        </div>
                    </div>

                    {/* Problems Section - Read Only */}
                    <div className={styles["problems-card"]}>
                        <div className={styles["section-header"]}>
                            <h3>Problems</h3>
                        </div>
                        <div className={styles["problems-list"]}>
                            <div className={styles["empty-state"]}>
                                <div className={styles["empty-icon"]}>❓</div>
                                <p>No problems added yet</p>
                                <span>Problems will appear here when the room owner adds them</span>
                            </div>
                        </div>
                    </div>

                    {/* Room Settings */}
                    <div className={styles["settings-card"]}>
                        <h3>Room Information</h3>
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
                </div>

                {/* Participants Section */}
                    <div className={styles["participants-card"]}>
                        <div className={styles["section-header"]}>
                            <h3>Participants</h3>
                            <div className={styles["participants-count"]}> { totalParticipants } members</div>
                        </div>
                        <div className={styles["participants-list"]}>
                            {participants.length === 0 ? (
                                <div className={styles["empty-state"]}>
                                    <div className={styles["empty-icon"]}>👥</div>
                                    <p>No participants yet</p>
                                    <span>Invite people to join this room</span>
                                </div>
                            ) : (
                                participants.map((p, idx) => (
                                    <div key={p.id || idx} className={styles["participant-item"]}>
                                        {p.fullName}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className={styles["invite-section"]}>
                            <button className={styles["invite-btn"]}>
                                <span className={styles["invite-icon"]}>✉️</span>
                                Invite Participants
                            </button>
                        </div>
                    </div>

            </div>
        </div>
    )
}