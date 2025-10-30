export interface UserCastleProgress {
    id?: string
    user_id: string
    castle_id: string
    unlocked: boolean
    completed: boolean
    total_xp_earned: number
    completion_percentage: number
    started_at?: string
    completed_at?: string
    created_at?: string
    updated_at?: string
}

export interface Castle {
    id: string
    name: string
    description: string
    difficulty: string
    region: string
    total_xp: number
    image_number: number
    route: string
    unlock_order: number
    created_at?: string
    updated_at?: string
}

export interface CastleWithProgress extends Castle {
    progress?: UserCastleProgress
}

export interface CastleStats {
    totalCastles: number
    unlockedCastles: number
    completedCastles: number
    totalXP: number
}

export interface CastleData {
    id: string
    name: string
    description: string
    region: string
    route: string
    image_number: number
    total_xp: number
}

export interface CastleProgress {
    unlocked: boolean
    completed: boolean
    total_xp_earned: number
    completion_percentage: number
}
