export const ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
    DASHBOARD: '/dashboard',
    VIRTUAL_ROOMS: '/virtual-rooms',
    LEADERBOARD: '/leaderboard',
    PROFILE: '/profile',

    OAUTH_CALLBACK: '/auth/callback'
}

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.RESET_PASSWORD,
    ROUTES.OAUTH_CALLBACK
]