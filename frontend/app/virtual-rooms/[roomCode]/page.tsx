"use client"

import Loader from '@/components/Loader'
import { useMyApp } from '@/context/AppUtils'
import { AuthProtection } from '@/context/AuthProtection'
import { changeVisibility, getRoomByCode } from '@/api/rooms'
import { getAllParticipants, inviteParticipant, kickParticipant } from '@/api/participants'
import styles from '@/styles/room-competition.module.css'
import { use, useEffect, useState } from 'react'

import { useRouter } from "next/navigation";
import Swal from 'sweetalert2'
import { getRoomProblems } from '@/api/problems'
import { ROUTES } from '@/constants/routes'

interface Room{
    id: number
    title: string
    description: string
    mantra: string
    banner_image: string | File | undefined
    code: string
    visibility: 'private' | 'public'
}

interface Participant {
    id:string
    fullName?: string
    gender?: string
    email?: string
}

interface Problems {
    id: string
    title?: string | 'No Title'
    description: string
    difficulty: string
    max_attempts: number
    expected_xp: number
    visibility: 'show' | 'hide'
}

export default function RoomDetail({ params } : { params  : Promise<{roomCode : string }> }){
    const roomCode = use(params)
    const [ roomDetails, setRoomDetails ] = useState<Room | null>(null)
    const [ participants, setParticipants ] = useState<Participant[]>([])
    const [ problems, setProblems ] = useState<Problems[]>([])
    // const [ totalParticipants, setTotalParticipants ] = useState<number>(0)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ isPrivate, setIsPrivate] = useState<boolean | null>(null)    
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [sending, setSending] = useState(false);
    const [fetched, setFetched] = useState(false);


    const { isLoggedIn } = useMyApp()
    const { isLoading: authLoading } = AuthProtection()

    const router = useRouter();

    console.log('room code ', roomCode)

    useEffect(() => {
        if (isLoggedIn && !authLoading && !fetched) {
            callMe()
            setFetched(true)
        } else {
            if (authLoading || !isLoggedIn) {
                setIsLoading(true)
            }
        }
    }, [isLoggedIn, authLoading, fetched])

    useEffect(() => {
      if (roomDetails) {
        setIsPrivate(roomDetails.visibility === 'private')
        }
    }, [roomDetails])

    const callMe = async () => {
        try {
            setIsLoading(true)
            const res = await getRoomByCode(roomCode.roomCode, 'admin')
            console.log(res.data)
            setRoomDetails(res.data)

            const test = await getAllParticipants(res.data.id, 'creator')
            console.log('Attempting to get all participants: ', test.data)

            setParticipants( test.data.participants || [] )
            console.log('Attempting to get all participants: ', test.data)
            
            const probs = await getRoomProblems(res.data.id)
            console.log('Fetching all problems: ', probs)
            setProblems(probs)
        } catch (error) {
            console.error('Error fetching room details:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // const sendInviteEmail = async (email: string, roomCode: string) => {
    //     // Implement the email sending logic here
    //     console.log(`Sending invite to ${email} for room ${roomCode}`);
    // }

    const redirectCompe = () => {
        router.push(`${ROUTES.COMPETITION}?room=${roomDetails?.id}`)
    }

    const handleRemoveParticipant = async (part_id: string | undefined, part_name: string | undefined) => {
        if (!part_id) return;

        const confirm = await Swal.fire({
            title: `Remove ${part_name}?`,
            text: "This participant will be removed from the room.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, remove",
        });

        if (!confirm.isConfirmed) return;

        // ✅ Optimistically remove from UI
        setParticipants(prev => prev.filter(p => p.id !== part_id));

        try {
            await kickParticipant(roomDetails?.id, part_id);
            Swal.fire("Removed!", `${part_name} has been removed.`, "success");
        } catch (error: unknown) {
            console.error(error);

            // ❌ If backend failed, re-add the participant to UI
            setParticipants(prev => [...prev, {
                id: part_id,
                fullName: part_name
            }]);

            Swal.fire("Error", "Failed to remove participant.", "error");
        }
        };


    const handleVisibility = async () => {
        const nextPrivate = !isPrivate
        setIsPrivate(nextPrivate)
        try {
            await changeVisibility(nextPrivate ? 'private' : 'public', roomDetails?.id);
            // (optional) toast “saved”
        } catch (err) {
            setIsPrivate(!nextPrivate);
            console.error('visibility change failed:', err);
        }
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
                        {/* <button className={styles["share-btn"]}>
                            <span className={styles["share-icon"]}>📤</span>
                            Share Room
                        </button> */}
                        <button onClick={redirectCompe} className={styles["edit-room-btn"]}>
                            <b>COMPETITION DASHBOARD</b>
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
                    <div className={styles["mantra-text"]}>&ldquo;{roomDetails.mantra}&rdquo;</div>
                  </div>
                </div>

                {/* Problems Section */}
                <div className={styles["problems-card"]}>
                  <div className={styles["section-header"]}>
                    <h3>Problems ({problems.length})</h3>
                    <button
                        className={styles["add-btn"]}
                        onClick={() => router.push(`${ROUTES.VIRTUAL_ROOMS}/${roomCode.roomCode}/create-problem`)}
                    >
                        + Add Problem
                    </button>
                  </div>
                  
                  <div className={styles["problems-list"]}>
                    {
                     problems.length === 0 ? (
                        <div className={styles["empty-state"]}>
                            <div className={styles["empty-icon"]}>❓</div>
                            <p>No problems added yet</p>
                            <span>Start by adding your first problem to discuss</span>
                        </div>
                     ) : (
                        problems.map((p, idx) => (
                            <div key={p.id || idx} className={styles["problem-card"]}>
                              <div className={styles["problem-header"]}>
                                <span className={styles["problem-title"]}>{p.title?.trim() ? p.title : "No Title"}</span>
                                <span
                                  className={styles["problem-difficulty"]}
                                  data-difficulty={p.difficulty}
                                >
                                  {p.difficulty}
                                </span>
                                <span
                                  className={styles["problem-difficulty"]}
                                >
                                  {p.visibility}
                                </span>
                              </div>
                              <div className={styles["problem-description"]}>
                                {p.description}
                              </div>
                              <div className={styles["problem-meta"]}>
                                <span className={styles["problem-xp"]}>XP: {p.expected_xp}</span>
                                <span className={styles["problem-attempts"]}>Max Attempts: {p.max_attempts}</span>
                              </div>
                            </div>
                        ))
                     )
                    }
                    {/* Update the scroll indicator message */}
                    {problems.length > 5 && (
                      <div className={styles["scroll-indicator"]}>
                        <small>Showing all {problems.length} problems</small>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className={styles["right-column"]}>
                {/* Participants Section */}
                <div className={styles["participants-card"]}>
                  <div className={styles["section-header"]}>
                    <h3>Participants</h3>
                    <div className={styles["participants-count"]}>{participants.length} members</div>
                  </div>
                  
                  {/* Scrollable participants list */}
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
                          <button
                            onClick={() => handleRemoveParticipant(p.id, p.fullName)}
                            aria-label={`Remove ${p.fullName}`}
                          >
                            ×
                          </button>
                          <span>{p.fullName}</span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {/* Fixed invite section at bottom */}
                  <div className={styles["invite-section"]}>
                    <button className={styles["invite-btn"]} onClick={() => setShowInviteModal(true)}>
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
                      <span className={styles["setting-label"]}>Room Privacy</span>
                      <div className={styles["setting-value"]}>
                        <button
                            className={isPrivate ? styles["private-btn"] : styles["public-btn"]}
                            onClick={handleVisibility}
                        >
                            {isPrivate ? "Private" : "Public"}
                        </button>
                      </div>
                    </div>
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