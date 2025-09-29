import { GENDERS } from '@/constants/dropdown'
import * as yup from 'yup'

export const profileSchema = yup.object().shape({
    fullName: yup
        .string()
        .required('Full name is required')
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must be less than 100 characters'),
    gender: yup
        .string()
        .oneOf([...GENDERS], 'Please select a valid gender'),
    phone: yup
        .string()
        .matches(/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(20, 'Phone number must be less than 20 characters')
})

export const emailChangeSchema = yup.object().shape({
    newEmail: yup
        .string()
        .required('New email is required')
        .email('Please enter a valid email address'),
})

export const passwordChangeSchema = yup.object().shape({
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