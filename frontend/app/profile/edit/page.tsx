"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { deactivateAccount, logout, updateEmail, updatePassword, updateUserProfile } from '@/lib/apiService'
import { myAppHook } from '@/context/AppUtils'
import Loader from '@/components/Loader'
import styles from '@/styles/profile.module.css'
import { ROUTES } from '@/constants/routes'

// Define the form data interface
interface ProfileFormData {
  fullName: string;
  gender: string;
  phone: string;
}

interface FormErrors {
  fullName?: string;
  gender?: string;
  phone?: string;
}

export default function EditProfile() {
    const router = useRouter()
    const { isLoggedIn, userProfile, refreshUserSession, isLoading } = myAppHook()

    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: '',
        gender: '',
        phone: ''
    })
    const [formErrors, setFormErrors] = useState<FormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [success, setSuccess] = useState<boolean>(false)
    
    // Add states for email and password modals/inputs
    const [showEmailModal, setShowEmailModal] = useState<boolean>(false)
    const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false)
    const [newEmail, setNewEmail] = useState<string>('')
    const [newPassword, setNewPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')

    useEffect(() => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.fullName || '',
                gender: userProfile.gender || '',
                phone: userProfile.phone || ''
            })
        }
    }, [userProfile])

    if (isLoading || !isLoggedIn) {
        return (
            <div className={styles["loading-container"]}>
                <Loader/>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        
        // Clear specific field error when user starts typing
        if (formErrors[name as keyof FormErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: undefined
            }))
        }
    }

    const validateForm = (): boolean => {
        const errors: FormErrors = {}
        let isValid = true

        if (!formData.fullName.trim()) {
            errors.fullName = 'Full name is required'
            isValid = false
        }
        
        // Add phone number validation if needed
        if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
            errors.phone = 'Please enter a valid phone number'
            isValid = false
        }

        setFormErrors(errors)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }
        
        setIsSubmitting(true)
        setError('')
        
        try {
            await updateUserProfile(formData)
            await refreshUserSession()
            setSuccess(true)
            setTimeout(() => {
                router.push(ROUTES.PROFILE)
            }, 2000)
        } catch (err: any) {
            console.error('Error updating profile:', err)
            setError(err?.response?.data?.error || 'Failed to update profile. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleBack = () => {
        router.push(ROUTES.PROFILE)
    }

    // Fixed: Remove the immediate function call
    const handleChangeEmailClick = () => {
        setShowEmailModal(true)
        setError('')
    }

    const handleChangePasswordClick = () => {
        setShowPasswordModal(true)
        setError('')
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!newEmail.trim()) {
            setError('Please enter a valid email address')
            return
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(newEmail)) {
            setError('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)
        setError('')
        
        try {
            await updateEmail(newEmail)
            await refreshUserSession()
            setSuccess(true)
            setShowEmailModal(false)
            setNewEmail('')
            setTimeout(() => {
                router.push(ROUTES.PROFILE)
            }, 2000)
        } catch (error: any) {
            console.error('Error updating email:', error)
            setError(error?.response?.data?.error || 'Failed to update email. Please try again.')   
        } finally {
            setIsSubmitting(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!newPassword.trim()) {
            setError('Please enter a new password')
            return
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsSubmitting(true)
        setError('')
        
        try {
            await updatePassword(newPassword)
            await refreshUserSession()
            setSuccess(true)
            setShowPasswordModal(false)
            setNewPassword('')
            setConfirmPassword('')
            setTimeout(() => {
                router.push(ROUTES.PROFILE)
            }, 2000)
        } catch (error: any) {
            console.error('Error updating password:', error)
            setError(error?.response?.data?.error || 'Failed to update password. Please try again.')   
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeactivateAccount = async() => {
        // not yet implemented in backend, teka lang kayo
        console.log('Deactivate account clicked')
        alert("You're deactivating account, contact admin to activate again")
        try {
            await deactivateAccount()
            setSuccess(true)
            await logout()
            setTimeout(() => {
                router.push(ROUTES.LOGIN)
            }, 2000)
        } catch (error) {
            console.log('Error in deactivating account: ', error)
            // setError(error?..data?.error || 'Failed to update password. Please try again.')
        }
    }

    return (
        <div className={styles['edit-profile-page']}>
            {/* Back Button */}
            <button className={styles['back-button']} onClick={handleBack}>
                &lt; Back
            </button>

            {/* Edit Profile Title */}
            <h1 className={styles['edit-page-title']}>Edit Profile</h1>

            {/* Profile Section */}
            <div className={styles['profile-section']}>
                {/* Profile Image */}
                <div className={styles['edit-profile-image-container']}>
                    <div className={styles['edit-profile-image']}></div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className={styles['edit-form']}>
                    {/* Full Name Field */}
                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Full Name</label>
                        <div className={styles['input-container']}>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter your Full Name"
                                className={styles['form-input']}
                                required
                            />
                        </div>
                        {formErrors.fullName && (
                            <span className={styles['error-text']}>{formErrors.fullName}</span>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Phone Number</label>
                        <div className={styles['input-container']}>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Enter your Phone Number"
                                className={styles['form-input']}
                            />
                        </div>
                        {formErrors.phone && (
                            <span className={styles['error-text']}>{formErrors.phone}</span>
                        )}
                    </div>

                    {/* Gender Selection */}
                    <div className={styles['form-group']}>
                        <label className={styles['gender-label']}>Gender</label>
                        <div className={styles['gender-options']}>
                            <label className={styles['gender-option']}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Male"
                                    checked={formData.gender === 'Male'}
                                    onChange={handleChange}
                                    className={styles['gender-radio']}
                                />
                                <span className={styles['gender-text']}>Male</span>
                            </label>
                            <label className={styles['gender-option']}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Female"
                                    checked={formData.gender === 'Female'}
                                    onChange={handleChange}
                                    className={styles['gender-radio']}
                                />
                                <span className={styles['gender-text']}>Female</span>
                            </label>
                            <label className={styles['gender-option']}>
                                <input
                                    type="radio"
                                    name="gender"
                                    value="Others"
                                    checked={formData.gender === 'Others'}
                                    onChange={handleChange}
                                    className={styles['gender-radio']}
                                />
                                <span className={styles['gender-text']}>Others</span>
                            </label>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles['save-button']}
                    >
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Account Security Section */}
            <div className={styles['security-section']}>
                <div className={styles['warning-section']}>
                    <div className={styles['warning-icon']}></div>
                    <span className={styles['warning-text']}>WARNING! Danger Zone!</span>
                </div>
                
                <h2 className={styles['security-title']}>Account Security</h2>
                
                <div className={styles['security-item']}>
                    <div className={styles['security-info']}>
                        <h3 className={styles['security-label']}>Email</h3>
                        <p className={styles['security-value']}>{userProfile?.email || "janedoe@email.com"}</p>
                    </div>
                    {/* Fixed: Pass function reference, not function call */}
                    <button type="button" className={styles['change-button']} onClick={handleChangeEmailClick}>
                        Change Email
                    </button>
                </div>
                
                <div className={styles['security-item']}>
                    <div className={styles['security-info']}>
                        <h3 className={styles['security-label']}>Password</h3>
                        <p className={styles['security-value']}>Change your password to login to your account.</p>
                    </div>
                    {/* Fixed: Pass function reference, not function call */}
                    <button type="button" className={styles['change-button']} onClick={handleChangePasswordClick}>
                        Change Password
                    </button>
                </div>
            </div>

            {/* Deactivate Account */}
            <div className={styles['deactivate-section']}>
                <button className={styles['deactivate-button']} onClick={handleDeactivateAccount}>
                    Deactivate Account
                </button>
            </div>

            {/* Email Change Modal */}
            {showEmailModal && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal']}>
                        <h3>Change Email</h3>
                        <form onSubmit={handleEmailSubmit}>
                            <div className={styles['form-group']}>
                                <label>New Email</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter new email"
                                    required
                                />
                            </div>
                            <div className={styles['modal-buttons']}>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowEmailModal(false)
                                        setNewEmail('')
                                        setError('')
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Update Email'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className={styles['modal-overlay']}>
                    <div className={styles['modal']}>
                        <h3>Change Password</h3>
                        <form onSubmit={handlePasswordSubmit}>
                            <div className={styles['form-group']}>
                                <label>New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                />
                            </div>
                            <div className={styles['form-group']}>
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                />
                            </div>
                            <div className={styles['modal-buttons']}>
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowPasswordModal(false)
                                        setNewPassword('')
                                        setConfirmPassword('')
                                        setError('')
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success/Error Messages */}
            {success && (
                <div className={styles["success-message"]}>
                    Profile updated successfully! Redirecting...
                </div>
            )}
            
            {error && (
                <div className={styles["error-message"]}>
                    {error}
                </div>
            )}
        </div>
    )
}