export interface UserProfileDTO {
    id: string;
    email: string;
    fullName?: string;
    gender?: string;
    phone?: string;
    profile_pic?: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface UserMetadataDTO {
    fullName?: string;
    gender?: string;
    phone?: string;
    avatar_url?: string;
}