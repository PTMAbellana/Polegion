import React from 'react'
import { FaUsers, FaPlus } from 'react-icons/fa'
import styles from '@/styles/room-details.module.css'
import { ParticipantsSidebarProps } from '@/types'


export default function ParticipantsSidebar({ 
    participants, 
    onInviteParticipants 
}: ParticipantsSidebarProps) {
    return (
        <div className={styles.participantsContainer}>
            <div className={styles.participantsHeader}>
                <h2 className={styles.participantsTitle}>
                    <FaUsers />
                    Participants
                    <span className={styles.participantsCount}>
                        {participants.length}
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
                        {participants.map((participant, index) => (
                            <div key={index} className={styles.participantItem}>
                                <div className={styles.participantAvatar}>
                                    {participant.first_name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className={styles.participantInfo}>
                                    <p className={styles.participantName}>
                                        {participant.first_name} {participant.last_name}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}