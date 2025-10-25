export interface EmailChangeData {
    newEmail: string
}

export interface PasswordChangeData {
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

export interface ProfileFormData {
    firstName: string
    lastName: string
    gender: string
    phone: string
}

export interface ProfileFormErrors {
    firstName?: string
    lastName?: string
    gender?: string
    phone?: string
}
