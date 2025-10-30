import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import styles from '@/styles/room.module.css'
import { InviteParticipantModalProps } from '@/types'


export default function InviteParticipantModal({ isOpen, onClose, onSubmit }: InviteParticipantModalProps) {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!email.trim()) {
            return
        }

        setIsSubmitting(true)
        try {
            await onSubmit(email)
            setEmail('') // Clear form after successful submit
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className={styles['modal-overlay']} onClick={onClose}>
            <div className={styles['modal-content']} onClick={(e) => e.stopPropagation()}>
                <div className={styles['modal-header']}>
                    <h2>Invite by Email</h2>
                    <button className={styles['modal-close']} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form className={styles['modal-form']} onSubmit={handleSubmit}>
                    <div className={styles['form-group']}>
                        <input
                            type="email"
                            placeholder="Recipient's email"
                            className={styles['form-input']}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div className={styles['modal-actions']}>
                        <button
                            type="button"
                            className={styles['cancel-btn']}
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles['submit-btn']}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Sending...' : 'Send Invite'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}