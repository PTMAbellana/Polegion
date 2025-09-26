import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import * as yup from 'yup'

export interface ProfileFormData {
    fullName: string
    gender: string
    phone: string
}

export interface ProfileFormErrors {
    fullName?: string
    gender?: string
    phone?: string
}

// Validation schema
const profileSchema = yup.object().shape({
    fullName: yup
        .string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),
    gender: yup
        .string()
        .oneOf(['male', 'female', 'other', 'prefer_not_to_say'], 'Please select a valid gender'),
    phone: yup
        .string()
        .matches(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must be less than 20 characters')
})

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