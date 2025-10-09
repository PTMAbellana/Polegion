'use client'

import { useMyApp } from "@/context/AppUtils"
import { AuthProtection } from "@/context/AuthProtection"
import { use, useEffect, useState } from "react"
import styles from '@/styles/join-room.module.css'
import Loader from "@/components/Loader"
import { getRoomByCode } from "@/api/rooms"
import { getAllParticipants, isParticipant, leaveRoom, totalParticipant } from "@/api/participants"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import { getAllCompe } from "@/api/competitions"
import Swal from "sweetalert2"
import { useAuthStore } from "@/store/authStore"

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

interface Competition {
    id: string
    title: string
    status: string
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
    const [competitions, setCompetitions] = useState<Competition[]>([])
    // FIX: Track join status properly
    const [showJoinStatus, setShowJoinStatus] = useState(false) // Changed from true to false
    const [hasCheckedJoinStatus, setHasCheckedJoinStatus] = useState(false)

    const [showInviteModal, setShowInviteModal] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [playingCompetition, setPlayingCompetition] = useState<string | null>(null);
    
    const { isLoggedIn, authLoading } = useAuthStore()

    console.log(roomCode)

    useEffect(() => {
        if (isLoggedIn && !authLoading) {
            callMe()
        } else {
            if (authLoading || !isLoggedIn) setIsLoading(true)
        }
    }, [isLoggedIn, authLoading])

    // NEW: Check if user just joined via URL parameters or session storage
    useEffect(() => {
        if (!hasCheckedJoinStatus) {
            // Check URL parameters for 'joined' flag
            const urlParams = new URLSearchParams(window.location.search)
            const justJoined = urlParams.get('joined') === 'true'
            
            // Or check session storage for join flag
            const sessionJoinFlag = sessionStorage.getItem(`joined_${roomCode.roomCode}`)
            
            if (justJoined || sessionJoinFlag === 'true') {
                setShowJoinStatus(true)
                
                // Clear the session flag so it doesn't show again
                sessionStorage.removeItem(`joined_${roomCode.roomCode}`)
                
                // Clean up URL parameters
                if (justJoined) {
                    const url = new URL(window.location.href)
                    url.searchParams.delete('joined')
                    window.history.replaceState({}, '', url.toString())
                }
                
                // Auto-hide after 3 seconds
                setTimeout(() => {
                    setShowJoinStatus(false)
                }, 3000)
            }
            setHasCheckedJoinStatus(true)
        }
    }, [roomCode.roomCode, hasCheckedJoinStatus])

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
            
            const compe = await getAllCompe(res.data.id, 'users')
            console.log('Competitions data: ', compe)
            setCompetitions(compe || [])
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

    
    const handleInvite = async () => {
        try {
            setSending(true);
            await inviteParticipant({ email: recipientEmail, roomCode: roomDetails?.code });
            alert("Invitation sent!");
            setShowInviteModal(false);
            setRecipientEmail("");
        } catch (error : unknown) {
            console.log(error)
            alert("Failed to send invitation.");
        } finally {
            setSending(false);
        }
    };

    const handleLeaveRoom = async () => {
        console.log('isCLicked leave room')
        
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to leave this room?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, leave room!'
        })
        
        if (result.isConfirmed) {
            try {
                await leaveRoom(roomDetails.id)
                
                Swal.fire({
                    title: 'Success!',
                    text: 'You have left the room successfully',
                    icon: 'success'
                })
                
                router.replace(ROUTES.DASHBOARD)
            } catch (error) {
                console.log('Error in leaving room: ', error)
                
                Swal.fire({
                    title: 'Error!',
                    text: 'Error in leaving room',
                    icon: 'error'
                })
            }
        }
    }

    const handlePlayCompe = (compeId: string) => async () => {
      console.log('Clicked play competition with ID:', compeId);
      setPlayingCompetition(compeId);
      
      try {
        // Add a small delay to show loading state
        await new Promise(resolve => setTimeout(resolve, 500));
        router.push(`${ROUTES.PLAY}/${compeId}?room=${roomDetails.id}`);
      } catch (error) {
        console.error('Error navigating to competition:', error);
        setPlayingCompetition(null);
      }
    };

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
                        {/* <button className={styles["share-btn"]}>
                            <span className={styles["share-icon"]}>📤</span>
                            Share Room
                        </button> */}
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
                    {/* Join Status Modal - Only shows when user just joined */}
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
                            <h3>Competitions</h3>
                        </div>
                        <div className={styles["problems-list"]}>
                            {
                                competitions.length > 0 ?
                                    competitions.map((comp) => (
                                        <div key={comp.id} className={styles["problem-item"]}>
                                            <div className={styles["problem-content"]}>
                                                <div className={styles["problem-info"]}>
                                                    <div className={styles["problem-title"]}>{comp.title}</div>
                                                    <div className={styles["problem-status"]}>
                                                        Status: {comp.status}
                                                    </div>
                                                </div>
                                                <div className={styles["problem-actions"]}>
                                                    <button 
                                                      onClick={handlePlayCompe(comp.id)} 
                                                      className={`${styles["play-btn"]} ${styles[`status-${comp.status.toLowerCase()}`]} ${playingCompetition === comp.id ? styles.loading : ''}`}
                                                      disabled={comp.status === 'PAUSED' || playingCompetition === comp.id}
                                                      aria-label={`Play ${comp.title} competition`}
                                                    >
                                                      {playingCompetition === comp.id ? 'Loading...' : 'Play'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )) :
                                        <div className={styles["empty-state"]}>
                                            <div className={styles["empty-icon"]}>❓</div>
                                            <p>No competitions added yet</p>
                                            <span>Competitions will appear here when the room owner adds them</span>
                                        </div>
                            }
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
                <div className={styles["sidebar-column"]}>
                    <div className={styles["participants-card"]}>
                        <div className={styles["section-header"]}>
                            <h3>Participants</h3>
                            <div className={styles["participants-count"]}>{totalParticipants} members</div>
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
                            <button className={styles["invite-btn"]} onClick={() => setShowInviteModal(true)}>
                                <span className={styles["invite-icon"]}>✉️</span>
                                Invite Participants
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        
            {/* Invite Participants Modal */}
            {showInviteModal && (
              <div className={styles["modal-overlay"]}>
                <div className={styles["modal-content"]}>
                  <h3>Invite by Email</h3>
                  <input
                    type="email"
                    placeholder="Recipient's email"
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e0e0e0",
                      marginBottom: "20px",
                      fontSize: "16px"
                    }}
                  />
                  <div className={styles["modal-actions"]}>
                    <button
                      className={styles["add-btn"]}
                      disabled={sending}
                      onClick={handleInvite}
                      style={{ minWidth: 120 }}
                    >
                      {sending ? "Sending..." : "Send Invite"}
                    </button>
                    <button
                      className={styles["edit-room-btn"]}
                      onClick={() => setShowInviteModal(false)}
                      type="button"
                      style={{ minWidth: 100 }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
        </div>
    )
}