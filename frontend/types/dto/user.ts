export interface UserProfileDTO {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    gender: string;
    phone?: string;
    profile_pic: string;
    role: 'student' | 'teacher' | 'admin';
}