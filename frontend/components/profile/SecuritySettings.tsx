import React, { useState } from 'react'
import { useSecurityActions } from '@/hooks/profile/useSecurityActions'
import EmailChangeModal from './modals/EmailChangeModal'
import styles from '@/styles/profile.module.css'
import PasswordChangeModal from './modals/PasswordChangeModal'
import { SecuritySettingsProps } from '@/types/props/profile'

export default function SecuritySettings({ userEmail }: SecuritySettingsProps) {
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    
    const securityHook = useSecurityActions()

    const handleEmailChangeSuccess = () => {
        setShowEmailModal(false)
        // Could show a toast notification here
    }

    const handlePasswordChangeSuccess = () => {
        setShowPasswordModal(false)
        // Could show a toast notification here
    }

    return (
        <div className={styles['security-settings']}>
            <h3 className={styles['section-title']}>Security Settings</h3>
            
            <div className={styles['security-options']}>
                {/* Email Section */}
                <div className={styles['security-item']}>
                    <div className={styles['security-info']}>
                        <div className={styles['security-label']}>Email Address</div>
                        <div className={styles['security-value']}>
                            {userEmail || 'Not set'}
                        </div>
                        <div className={styles['security-description']}>
                            Your email is used for login and notifications
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowEmailModal(true)}
                        className={styles['security-button']}
                    >
                        Change Email
                    </button>
                </div>

                {/* Password Section */}
                <div className={styles['security-item']}>
                    <div className={styles['security-info']}>
                        <div className={styles['security-label']}>Password</div>
                        <div className={styles['security-value']}>
                            ••••••••••••
                        </div>
                        <div className={styles['security-description']}>
                            Keep your account secure with a strong password
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowPasswordModal(true)}
                        className={styles['security-button']}
                    >
                        Change Password
                    </button>
                </div>

                {/* Account Deactivation Section */}
                <div className={styles['security-item']}>
                    <div className={styles['security-info']}>
                        <div className={styles['security-label']}>Account Status</div>
                        <div className={styles['security-value']}>Active</div>
                        <div className={styles['security-description']}>
                            Deactivating your account will disable access temporarily
                        </div>
                    </div>
                    <button
                        type="button"
                        className={`${styles['security-button']} ${styles['danger-button']}`}
                        onClick={() => {
                            // This could open another modal for account deactivation
                            if (confirm('Are you sure you want to deactivate your account? This action can be reversed.')) {
                                // Handle account deactivation
                                console.log('Account deactivation requested')
                            }
                        }}
                    >
                        Deactivate Account
                    </button>
                </div>
            </div>

            {/* Modals */}
            {showEmailModal && (
                <EmailChangeModal
                    isOpen={showEmailModal}
                    onClose={() => setShowEmailModal(false)}
                    onSuccess={handleEmailChangeSuccess}
                    securityHook={securityHook}
                />
            )}

            {showPasswordModal && (
                <PasswordChangeModal
                    isOpen={showPasswordModal}
                    onClose={() => setShowPasswordModal(false)}
                    onSuccess={handlePasswordChangeSuccess}
                    securityHook={securityHook}
                />
            )}
        </div>
    )
}