import React from 'react'
import { useProfileForm } from '@/hooks/profile/useProfileForm'
import { GENDER_OPTIONS } from '@/constants/dropdown'
import styles from '@/styles/profile.module.css'
import { ProfileEditFormProps } from '@/types/props/profile'

export default function ProfileEditForm({ 
    onSuccess, 
    onCancel 
}: ProfileEditFormProps) {
    const {
        formData,
        errors,
        isSubmitting,
        success,
        error,
        updateField,
        submitForm,
        resetForm
    } = useProfileForm()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const success = await submitForm()
        if (success && onSuccess) {
            onSuccess()
        }
    }

    const handleCancel = () => {
        resetForm()
        if (onCancel) {
            onCancel()
        }
    }

    React.useEffect(() => {
        if (success && onSuccess) {
            setTimeout(onSuccess, 1500) // Auto-close after success
        }
    }, [success, onSuccess])

    return (
        <form onSubmit={handleSubmit} className={styles['profile-edit-form']}>
            <div className={styles['form-section']}>
                <h3 className={styles['section-title']}>Personal Information</h3>
                
                {/* Two Column Layout */}
                <div className={styles['form-row']}>
                    {/* First Name Field */}
                    <div className={styles['form-group']}>
                        <label htmlFor="firstName" className={styles['form-label']}>
                            First Name *
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => updateField('firstName', e.target.value)}
                            className={`${styles['form-input']} ${errors.firstName ? styles['error'] : ''}`}
                            placeholder="Enter your first name"
                            disabled={isSubmitting}
                        />
                        {errors.firstName && (
                            <span className={styles['error-message']}>{errors.firstName}</span>
                        )}
                    </div>

                    {/* Last Name Field */}
                    <div className={styles['form-group']}>
                        <label htmlFor="lastName" className={styles['form-label']}>
                            Last Name *
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => updateField('lastName', e.target.value)}
                            className={`${styles['form-input']} ${errors.lastName ? styles['error'] : ''}`}
                            placeholder="Enter your last name"
                            disabled={isSubmitting}
                        />
                        {errors.lastName && (
                            <span className={styles['error-message']}>{errors.lastName}</span>
                        )}
                    </div>
                </div>

                <div className={styles['form-row']}>
                    {/* Gender Field */}
                    <div className={styles['form-group']}>
                        <label htmlFor="gender" className={styles['form-label']}>
                            Gender
                        </label>
                        <select
                            id="gender"
                            value={formData.gender}
                            onChange={(e) => updateField('gender', e.target.value)}
                            className={`${styles['form-select']} ${errors.gender ? styles['error'] : ''}`}
                            disabled={isSubmitting}
                        >
                            <option value="">Select gender</option>
                            {GENDER_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.gender && (
                            <span className={styles['error-message']}>{errors.gender}</span>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className={styles['form-group']}>
                        <label htmlFor="phone" className={styles['form-label']}>
                            Phone Number
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className={`${styles['form-input']} ${errors.phone ? styles['error'] : ''}`}
                            placeholder="Enter your phone number"
                            disabled={isSubmitting}
                        />
                        {errors.phone && (
                            <span className={styles['error-message']}>{errors.phone}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className={styles['success-message']}>
                    ✅ Profile updated successfully!
                </div>
            )}
            {error && (
                <div className={styles['error-message']}>
                    ❌ {error}
                </div>
            )}

            {/* Action Buttons */}
            <div className={styles['form-actions']}>
                <button
                    type="button"
                    onClick={handleCancel}
                    className={styles['cancel-button']}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className={styles['submit-button']}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <>
                            <span className={styles['spinner']}></span>
                            Updating...
                        </>
                    ) : (
                        'Update Profile'
                    )}
                </button>
            </div>
        </form>
    )
}