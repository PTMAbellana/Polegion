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

    // records
    RECORDS: '/records',
    
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
    
    // adaptive learning (RESEARCH FEATURE)
    ADAPTIVE_LEARNING: `/student/adaptive-learning`,
    
    // practice
    PRACTICE: `/student/practice`,
    
    // playground
    PLAYGROUND: `/student/playground`,
    
    // wall of fame or leaderboards
    LEADERBOARD: `/student/leaderboard`,
    
    // profile
    PROFILE: `/student${ROUTES.PROFILE}`,
    EDIT_PROFILE: `/student${ROUTES.EDIT_PROFILE}`,

    // play competition
    PLAY: `/student${ROUTES.COMPETITION}`,
}

// TEACHER_ROUTES removed - Student-only build
export const TEACHER_ROUTES = {
    LOGIN: '/restricted',
    REGISTER: '/restricted',
    DASHBOARD: '/restricted',
    VIRTUAL_ROOMS: '/restricted',
    RECORDS: '/restricted',
    CASTLE_CONTENT: '/restricted',
    PRACTICE_PROBLEMS: '/restricted',
    PROFILE: '/restricted',
    EDIT_PROFILE: '/restricted',
    COMPETITION: '/restricted',
}
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.RESET_PASSWORD,
    STUDENT_ROUTES.LOGIN,
    STUDENT_ROUTES.REGISTER,
    '/terms-and-conditions',
    '/privacy-policy'
]
