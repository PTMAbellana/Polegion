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

    //competition
    COMPETITION: '/competition',
    PLAY: '/competition/play',

    // leaderboards
    LEADERBOARD: '/leaderboard',
    
    //profile
    PROFILE: '/profile',
    EDIT_PROFILE: '/profile/edit'
}

export const STUDENT_ROUTES = {
    // auth
    LOGIN: `/student${ROUTES.LOGIN}`,
    REGISTER: `/student${ROUTES.REGISTER}`,
    
    // dashboard
    DASHBOARD: `/student${ROUTES.DASHBOARD}`,
    
    // dungeons or joined rooms
    JOINED_ROOMS: `/student/joined-rooms`,
    
    // worldmap
    WORLD_MAP: `/student/worldmap`,
    
    // wall of fame or leaderboards
    LEADERBOARD: `/student${ROUTES.LEADERBOARD}`,
    
    // profile
    PROFILE: `/student${ROUTES.PROFILE}`,
    EDIT_PROFILE: `/student${ROUTES.EDIT_PROFILE}`,

    // play competition
    PLAY: `/student${ROUTES.PLAY}`,
}

export const TEACHER_ROUTES = {
    // auth
    LOGIN: `/teacher${ROUTES.LOGIN}`,
    REGISTER: `/teacher${ROUTES.REGISTER}`,
    
    // dashboard
    DASHBOARD: `/teacher${ROUTES.DASHBOARD}`,
    
    // virtual rooms
    VIRTUAL_ROOMS: `/teacher/virtual-rooms`,
    
    // leaderboards
    LEADERBOARD: `/teacher${ROUTES.LEADERBOARD}`,
    
    // profile
    PROFILE: `/teacher${ROUTES.PROFILE}`,
    EDIT_PROFILE: `/teacher${ROUTES.EDIT_PROFILE}`,

    // competition
    COMPETITION: `/teacher${ROUTES.COMPETITION}`,
}
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.RESET_PASSWORD,
    STUDENT_ROUTES.LOGIN,
    STUDENT_ROUTES.REGISTER,
    TEACHER_ROUTES.LOGIN,
    TEACHER_ROUTES.REGISTER
]
