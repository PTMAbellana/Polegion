export interface UpdateProfileFormData {
    fullName: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
}

export interface ProfilePictureFormData {
    file: File;
}