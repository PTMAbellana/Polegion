import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { profileSchema } from '@/schemas/profileSchemas'
import * as yup from 'yup'
import { ProfileFormData, ProfileFormErrors } from '@/types'

// Validation schema

export function useProfileForm() {
    const { userProfile, updateProfile } = useAuthStore()
    
    const [formData, setFormData] = useState<ProfileFormData>({
        fullName: userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : '',
        gender: userProfile?.gender || '',
        phone: userProfile?.phone || ''
    })
    
    const [errors, setErrors] = useState<ProfileFormErrors>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string>('')

    const updateField = (field: keyof ProfileFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const validateForm = async (): Promise<boolean> => {
        try {
            await profileSchema.validate(formData, { abortEarly: false })
            setErrors({})
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const formErrors: ProfileFormErrors = {}
                err.inner.forEach((error) => {
                    if (error.path) {
                        formErrors[error.path as keyof ProfileFormErrors] = error.message
                    }
                })
                setErrors(formErrors)
            }
            return false
        }
    }

    const submitForm = async (): Promise<boolean> => {
        setIsSubmitting(true)
        setError('')
        setSuccess(false)

        try {
            // Validate form
            const isValid = await validateForm()
            if (!isValid) {
                setIsSubmitting(false)
                return false
            }

            // Split full name into first and last name
            const nameParts = formData.fullName.trim().split(' ')
            const firstName = nameParts[0] || ''
            const lastName = nameParts.slice(1).join(' ') || ''

            // Submit to store
            const result = await updateProfile({
                first_name: firstName,
                last_name: lastName,
                gender: formData.gender,
                phone: formData.phone
            })

            if (result.success) {
                setSuccess(true)
                return true
            } else {
                setError(result.error || 'Failed to update profile')
                return false
            }
        } catch (err) {
            console.error('Profile update error:', err)
            setError('An unexpected error occurred')
            return false
        } finally {
            setIsSubmitting(false)
        }
    }

    const resetForm = () => {
        setFormData({
            fullName: userProfile ? `${userProfile.first_name || ''} ${userProfile.last_name || ''}`.trim() : '',
            gender: userProfile?.gender || '',
            phone: userProfile?.phone || ''
        })
        setErrors({})
        setError('')
        setSuccess(false)
    }

    return {
        formData,
        errors,
        isSubmitting,
        success,
        error,
        updateField,
        submitForm,
        validateForm,
        resetForm
    }
}