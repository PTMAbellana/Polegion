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
