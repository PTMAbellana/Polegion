import React, { useState } from 'react'
import styles from '@/styles/profile.module.css'
import { PasswordChangeModalProps } from '@/types/props/profile'
import { PasswordChangeData } from '@/types'


export default function PasswordChangeModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    securityHook 
}: PasswordChangeModalProps) {
    // Local password state (not persisted in hook)
    const [passwordData, setPasswordData] = useState<PasswordChangeData>({
        newPassword: '',
        confirmPassword: ''
    })

    const {
        passwordErrors,
        isPasswordSubmitting,
        passwordSuccess,
        passwordError,
        submitPasswordChange,
        clearPasswordErrors,
        resetPasswordForm
    } = securityHook

    const updatePasswordField = (field: keyof PasswordChangeData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }))
        // Clear errors when user starts typing
        if (passwordErrors[field]) {
            clearPasswordErrors()
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        // Pass password data to hook for validation and submission
        const success = await submitPasswordChange(passwordData)
        
        if (success) {
            // Clear local password data immediately
            setPasswordData({ newPassword: '', confirmPassword: '' })
            onSuccess()
        }
    }

    const handleClose = () => {
        // Clear local password data
        setPasswordData({ newPassword: '', confirmPassword: '' })
        resetPasswordForm()
        onClose()
    }

    React.useEffect(() => {
        if (passwordSuccess) {
            // Clear local data and close after showing success
            setTimeout(() => {
                setPasswordData({ newPassword: '', confirmPassword: '' })
                onSuccess()
            }, 1500)
        }
    }, [passwordSuccess, onSuccess])

    if (!isOpen) return null

    return (
        <div className={styles['modal-overlay']} onClick={handleClose}>
            <div 
                className={styles['modal-content']} 
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles['modal-header']}>
                    <h3 className={styles['modal-title']}>Change Password</h3>
                    <button 
                        type="button"
                        onClick={handleClose}
                        className={styles['modal-close']}
                        disabled={isPasswordSubmitting}
                    >
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles['modal-form']}>
                    <div className={styles['form-group']}>
                        <label htmlFor="newPassword" className={styles['form-label']}>
                            New Password *
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => updatePasswordField('newPassword', e.target.value)}
                            className={`${styles['form-input']} ${passwordErrors.newPassword ? styles['error'] : ''}`}
                            placeholder="Enter your new password"
                            disabled={isPasswordSubmitting}
                            autoComplete="new-password"
                        />
                        {passwordErrors.newPassword && (
                            <span className={styles['error-message']}>{passwordErrors.newPassword}</span>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label htmlFor="confirmPassword" className={styles['form-label']}>
                            Confirm New Password *
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => updatePasswordField('confirmPassword', e.target.value)}
                            className={`${styles['form-input']} ${passwordErrors.confirmPassword ? styles['error'] : ''}`}
                            placeholder="Confirm your new password"
                            disabled={isPasswordSubmitting}
                            autoComplete="new-password"
                        />
                        {passwordErrors.confirmPassword && (
                            <span className={styles['error-message']}>{passwordErrors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {passwordSuccess && (
                        <div className={styles['success-message']}>
                            ✅ Password updated successfully! You will be logged out shortly.
                        </div>
                    )}
                    {passwordError && (
                        <div className={styles['error-message']}>
                            ❌ {passwordError}
                        </div>
                    )}

                    <div className={styles['modal-actions']}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles['cancel-button']}
                            disabled={isPasswordSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles['submit-button']}
                            disabled={isPasswordSubmitting}
                        >
                            {isPasswordSubmitting ? (
                                <>
                                    <span className={styles['spinner']}></span>
                                    Updating...
                                </>
                            ) : (
                                'Update Password'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}