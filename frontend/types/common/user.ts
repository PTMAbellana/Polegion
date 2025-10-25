export interface UserType {
  participant_id?: number;
  first_name?: string;
  last_name?: string;
  gender?: 'male' | 'female' | 'other';
  profile_pic?: string | null;
  role?: 'student' | 'teacher' | 'admin';
}
