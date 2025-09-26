import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import * as yup from 'yup'

export interface EmailChangeData {
    newEmail: string
    password: string
}

export interface PasswordChangeData {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

export interface SecurityErrors {
    newEmail?: string
    password?: string
    currentPassword?: string
    newPassword?: string
    confirmPassword?: string
}

// Validation schemas
const emailChangeSchema = yup.object().shape({
    newEmail: yup
        .string()
        .required('New email is required')
        .email('Please enter a valid email address'),
    password: yup
        .string()
        .required('Current password is required')
        .min(6, 'Password must be at least 6 characters')
})

const passwordChangeSchema = yup.object().shape({
    currentPassword: yup
        .string()
        .required('Current password is required')
        .min(6, 'Password must be at least 6 characters'),
    newPassword: yup
        .string()
        .required('New password is required')
        .min(6, 'Password must be at least 6 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Password must contain uppercase, lowercase, and number'
        ),
    confirmPassword: yup
        .string()
        .required('Please confirm your new password')
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
})

export function useSecurityActions() {
    const { updateEmail, updatePassword } = useAuthStore()
    
    // Email change state
    const [emailData, setEmailData] = useState<EmailChangeData>({
        newEmail: '',
        password: ''
    })
    const [emailErrors, setEmailErrors] = useState<SecurityErrors>({})
    const [isEmailSubmitting, setIsEmailSubmitting] = useState(false)
    const [emailSuccess, setEmailSuccess] = useState(false)
    const [emailError, setEmailError] = useState('')

    // Password change state
    const [passwordData, setPasswordData] = useState<PasswordChangeData>({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })
    const [passwordErrors, setPasswordErrors] = useState<SecurityErrors>({})
    const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
    const [passwordSuccess, setPasswordSuccess] = useState(false)
    const [passwordError, setPasswordError] = useState('')

    // Email change methods
    const updateEmailField = (field: keyof EmailChangeData, value: string) => {
        setEmailData(prev => ({ ...prev, [field]: value }))
        if (emailErrors[field]) {
            setEmailErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const validateEmailForm = async (): Promise<boolean> => {
        try {
            await emailChangeSchema.validate(emailData, { abortEarly: false })
            setEmailErrors({})
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const formErrors: SecurityErrors = {}
                err.inner.forEach((error) => {
                    if (error.path) {
                        formErrors[error.path as keyof SecurityErrors] = error.message
                    }
                })
                setEmailErrors(formErrors)
            }
            return false
        }
    }

    const submitEmailChange = async (): Promise<boolean> => {
        setIsEmailSubmitting(true)
        setEmailError('')
        setEmailSuccess(false)

        try {
            const isValid = await validateEmailForm()
            if (!isValid) {
                return false
            }

            const result = await updateEmail(emailData.newEmail)
            
            if (result.success) {
                setEmailSuccess(true)
                setEmailData({ newEmail: '', password: '' })
                return true
            } else {
                setEmailError(result.error || 'Failed to update email')
                return false
            }
        } catch (err) {
            console.error('Email update error:', err)
            setEmailError('An unexpected error occurred')
            return false
        } finally {
            setIsEmailSubmitting(false)
        }
    }

    // Password change methods
    const updatePasswordField = (field: keyof PasswordChangeData, value: string) => {
        setPasswordData(prev => ({ ...prev, [field]: value }))
        if (passwordErrors[field]) {
            setPasswordErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const validatePasswordForm = async (): Promise<boolean> => {
        try {
            await passwordChangeSchema.validate(passwordData, { abortEarly: false })
            setPasswordErrors({})
            return true
        } catch (err) {
            if (err instanceof yup.ValidationError) {
                const formErrors: SecurityErrors = {}
                err.inner.forEach((error) => {
                    if (error.path) {
                        formErrors[error.path as keyof SecurityErrors] = error.message
                    }
                })
                setPasswordErrors(formErrors)
            }
            return false
        }
    }

    const submitPasswordChange = async (): Promise<boolean> => {
        setIsPasswordSubmitting(true)
        setPasswordError('')
        setPasswordSuccess(false)

        try {
            const isValid = await validatePasswordForm()
            if (!isValid) {
                return false
            }

            const result = await updatePassword(
                passwordData.currentPassword, 
                passwordData.newPassword
            )
            
            if (result.success) {
                setPasswordSuccess(true)
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                })
                return true
            } else {
                setPasswordError(result.error || 'Failed to update password')
                return false
            }
        } catch (err) {
            console.error('Password update error:', err)
            setPasswordError('An unexpected error occurred')
            return false
        } finally {
            setIsPasswordSubmitting(false)
        }
    }

    // Reset methods
    const resetEmailForm = () => {
        setEmailData({ newEmail: '', password: '' })
        setEmailErrors({})
        setEmailError('')
        setEmailSuccess(false)
    }

    const resetPasswordForm = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        })
        setPasswordErrors({})
        setPasswordError('')
        setPasswordSuccess(false)
    }

    return {
        // Email change
        emailData,
        emailErrors,
        isEmailSubmitting,
        emailSuccess,
        emailError,
        updateEmailField,
        submitEmailChange,
        resetEmailForm,
        
        // Password change
        passwordData,
        passwordErrors,
        isPasswordSubmitting,
        passwordSuccess,
        passwordError,
        updatePasswordField,
        submitPasswordChange,
        resetPasswordForm
    }
}