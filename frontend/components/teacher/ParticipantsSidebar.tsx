import React from 'react'
import { FaUsers, FaPlus, FaUserSlash, FaPrint } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { ParticipantsSidebarProps } from '@/types'


export default function ParticipantsSidebar({ 
    participants, 
    activeCount = 0,
    activeParticipantIds = new Set(),
    roomId,
    onInviteParticipants,
    onKickParticipant 
}: ParticipantsSidebarProps) {
    
    const handlePrintProgress = (participant: any) => {
        // Open student progress in new window for printing
        const userId = participant.user_id || participant.id;
        if (roomId && userId) {
            window.open(`/teacher/records/${roomId}/student/${userId}`, '_blank');
        }
    };
    
    return (
        <div className={styles.participantsContainer}>
            <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>
                    <FaUsers />
                    Participants
                    <span className={styles.participantsCount}>
                        {activeCount > 0 ? `${activeCount} active / ${participants.length}` : participants.length}
                    </span>
                </h2>
            </div>
            
            <div className={styles.participantsContent}>
                <button
                    onClick={onInviteParticipants}
                    className={styles.inviteButton}
                >
                    <FaPlus />
                    Invite Participants
                </button>

                {participants.length === 0 ? (
                    <div className={styles.emptyParticipants}>
                        <FaUsers className={styles.emptyParticipantsIcon} />
                        <h3 className={styles.emptyParticipantsTitle}>No Participants Yet</h3>
                        <p className={styles.emptyParticipantsDescription}>Invite students to join your room!</p>
                    </div>
                ) : (
                    <div className={styles.participantsList}>
                        {participants.map((participant, index) => {
                            const participantId = participant.user_id || participant.id;
                            const isActive = activeParticipantIds.has(participantId);
                            
                            return (
                                <div key={index} className={styles.participantItem}>
                                    <div className={styles.participantAvatar}>
                                        {participant.profile_pic ? (
                                            <img
                                                src={participant.profile_pic}
                                                alt={`${participant.first_name} ${participant.last_name}`}
                                                className={styles.avatarImage}
                                            />
                                        ) : (
                                            participant.first_name?.charAt(0)?.toUpperCase() || 'U'
                                        )}
                                        {isActive && <span className={styles.activeIndicator} title="Active now" />}
                                    </div>
                                    <div className={styles.participantInfo}>
                                        <p className={styles.participantName}>
                                            {participant.first_name} {participant.last_name}
                                        </p>
                                    </div>
                                    <button
                                        className={styles.printProgressButton}
                                        title="Print student progress"
                                        onClick={() => handlePrintProgress(participant)}
                                    >
                                        <FaPrint />
                                    </button>
                                    <button
                                        className={styles.kickButton}
                                        title="Kick participant"
                                        onClick={() => onKickParticipant(participant)}
                                    >
                                        <FaUserSlash />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}