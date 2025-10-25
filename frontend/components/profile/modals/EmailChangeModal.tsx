import React from 'react'
import styles from '@/styles/profile.module.css'
import { EmailChangeModalProps } from '@/types/props/profile'


export default function EmailChangeModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    securityHook 
}: EmailChangeModalProps) {
    const {
        emailData,
        emailErrors,
        isEmailSubmitting,
        emailSuccess,
        emailError,
        updateEmailField,
        submitEmailChange,
        resetEmailForm
    } = securityHook

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await submitEmailChange()
        if (success) {
            onSuccess()
        }
    }

    const handleClose = () => {
        resetEmailForm()
        onClose()
    }

    React.useEffect(() => {
        if (emailSuccess) {
            setTimeout(onSuccess, 1500)
        }
    }, [emailSuccess, onSuccess])

    if (!isOpen) return null

    return (
        <div className={styles['modal-overlay']} onClick={handleClose}>
            <div 
                className={styles['modal-content']} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles['modal-header']}>
                    <h3 className={styles['modal-title']}>Change Email Address</h3>
                    <button 
                        type="button"
                        onClick={handleClose}
                        className={styles['modal-close']}
                        disabled={isEmailSubmitting}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles['modal-form']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="newEmail" className={styles['form-label']}>
                            New Email Address *
                        </label>
                        <input
                            id="newEmail"
                            type="email"
                            value={emailData.newEmail}
                            onChange={(e) => updateEmailField('newEmail', e.target.value)}
                            className={`${styles['form-input']} ${emailErrors.newEmail ? styles['error'] : ''}`}
                            placeholder="Enter your new email"
                            disabled={isEmailSubmitting}
                            autoFocus
                        />
                        {emailErrors.newEmail && (
                            <span className={styles['error-message']}>{emailErrors.newEmail}</span>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {emailSuccess && (
                        <div className={styles['success-message']}>
                            ✅ Email updated successfully!
                        </div>
                    )}
                    {emailError && (
                        <div className={styles['error-message']}>
                            ❌ {emailError}
                        </div>
                    )}

                    <div className={styles['modal-actions']}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles['cancel-button']}
                            disabled={isEmailSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles['submit-button']}
                            disabled={isEmailSubmitting}
                        >
                            {isEmailSubmitting ? (
                                <>
                                    <span className={styles['spinner']}></span>
                                    Updating...
                                </>
                            ) : (
                                'Update Email'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}