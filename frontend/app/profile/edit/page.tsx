"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { updateUserProfile } from '@/lib/apiService'
import { myAppHook } from '@/context/AppUtils'
import Loader from '@/components/Loader'
import { FormField, FormButtons } from '@/components/FormComponents'
import styles from '@/styles/dashboard.module.css'
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

    return (
        <div className={styles['dashboard-container']}>
            <div className={styles["main-content"]}>
                <div className={styles["welcome-section"]}>
                    <h1>Edit Profile</h1>
                </div>
                
                <div className={styles["dashboard-grid"]}>
                    <div className={`${styles.card} ${styles["profile-card"]}`}>
                        <h3>Update Your Information</h3>
                        
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
                        
                        <form onSubmit={handleSubmit} className={styles["profile-form"]}>
                            <FormField
                                id="fullName"
                                name="fullName"
                                label="Full Name"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                required={true}
                                error={formErrors.fullName}
                            />
                            
                            <FormField
                                id="gender"
                                name="gender"
                                label="Gender"
                                type="select"
                                value={formData.gender}
                                onChange={handleChange}
                                options={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                    { value: 'other', label: 'Other' },
                                    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                                ]}
                                error={formErrors.gender}
                            />
                            
                            <FormField
                                id="phone"
                                name="phone"
                                label="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                error={formErrors.phone}
                            />
                            
                            <FormButtons
                                cancelHandler={() => router.push(ROUTES.PROFILE)}
                                isSubmitting={isSubmitting}
                                submitLabel="Update Profile"
                                cancelLabel="Cancel"
                            />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}