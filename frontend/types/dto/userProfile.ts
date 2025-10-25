export interface UserProfileDTO {
    id: string;
    email: string;
    fullName?: string;
    gender?: string;
    phone?: string;
    profile_pic?: string;
    [key: string]: unknown;
}