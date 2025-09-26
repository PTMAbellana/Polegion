import React from 'react'
import styles from '@/styles/profile.module.css'
import { PasswordChangeModalProps } from '@/types/props/profile'


export default function PasswordChangeModal({ 
    isOpen, 
    onClose, 
    onSuccess, 
    securityHook 
}: PasswordChangeModalProps) {
    const {
        passwordData,
        passwordErrors,
        isPasswordSubmitting,
        passwordSuccess,
        passwordError,
        updatePasswordField,
        submitPasswordChange,
        resetPasswordForm
    } = securityHook

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await submitPasswordChange()
        if (success) {
            onSuccess()
        }
    }

    const handleClose = () => {
        resetPasswordForm()
        onClose()
    }

    React.useEffect(() => {
        if (passwordSuccess) {
            setTimeout(onSuccess, 1500)
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
                        <label htmlFor="currentPassword" className={styles['form-label']}>
                            Current Password *
                        </label>
                        <input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => updatePasswordField('currentPassword', e.target.value)}
                            className={`${styles['form-input']} ${passwordErrors.currentPassword ? styles['error'] : ''}`}
                            placeholder="Enter your current password"
                            disabled={isPasswordSubmitting}
                            autoFocus
                        />
                        {passwordErrors.currentPassword && (
                            <span className={styles['error-message']}>{passwordErrors.currentPassword}</span>
                        )}
                    </div>

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
                        />
                        {passwordErrors.newPassword && (
                            <span className={styles['error-message']}>{passwordErrors.newPassword}</span>
                        )}
                        <div className={styles['password-hint']}>
                            Password must contain uppercase, lowercase, and number
                        </div>
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
                        />
                        {passwordErrors.confirmPassword && (
                            <span className={styles['error-message']}>{passwordErrors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Success/Error Messages */}
                    {passwordSuccess && (
                        <div className={styles['success-message']}>
                            ✅ Password updated successfully!
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