export interface AuthSessionDTO {
    access_token: string;
    refresh_token: string;
    expires_at: number;
    expires_in: number;
    token_type: string;
}

export interface AuthUserDTO {
    id: string;
    email: string;
    email_confirmed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface AuthResponseDTO {
    session: AuthSessionDTO;
    user: AuthUserDTO;
}

export interface RefreshTokenResponseDTO {
    session: AuthSessionDTO;
    user: AuthUserDTO;
}