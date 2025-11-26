export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

export interface ResetPasswordRequest {
    email: string;
}