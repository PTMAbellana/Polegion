export const ROUTES = {
    HOME: '/',
    //auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    RESET_PASSWORD: '/auth/reset-password',
    
    //pages
    DASHBOARD: '/dashboard',

    //virtual rooms
    VIRTUAL_ROOMS: '/virtual-rooms',
    JOINED_ROOMS: '/virtual-rooms/join',

    //world map
    WORLD_MAP: '/world-map',

    //competition
    COMPETITION: '/competition',
    PLAY: '/competition/play',

    // leaderboards
    LEADERBOARD: '/leaderboard',
    
    //profile
    PROFILE: '/profile',
    EDIT_PROFILE: '/profile/edit'
}

export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.RESET_PASSWORD
]