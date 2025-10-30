
export interface AnimatedAvatarProps {
    src?: string | null
    alt?: string
    className?: string
}

export interface ProfileInfoItemProps {
    label: string
    value: string | null | undefined
    fallback?: string
}

export interface ProfileCardProps {
    userType?: 'student' | 'teacher'
}

export interface SecuritySettingsProps {
    userEmail?: string
}

export interface ProfileImageUploadProps {
    onSuccess?: () => void
}

export interface ProfileEditFormProps {
    onSuccess?: () => void
    onCancel?: () => void
}