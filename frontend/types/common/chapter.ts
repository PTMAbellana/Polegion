export interface UserChapterProgress {
    id?: string
    user_id: string
    chapter_id: string
    unlocked: boolean
    completed: boolean
    xp_earned: number
    quiz_passed: boolean
    started_at?: string
    completed_at?: string
    created_at?: string
    updated_at?: string
}

export interface Chapter {
    id: string
    castle_id: string
    title: string
    description: string
    chapter_number: number
    xp_reward: number
    created_at?: string
    updated_at?: string
}

export interface ChapterWithProgress extends Chapter {
    progress: UserChapterProgress | null
}

export interface CastleInitializeResponse {
    success: boolean
    data: {
        castle: {
            id: string
            name: string
            description: string
            region: string
            route: string
            image_number: number
            total_xp: number
        }
        castleProgress: {
            unlocked: boolean
            completed: boolean
            total_xp_earned: number
            completion_percentage: number
        }
        chapters: ChapterWithProgress[]
    }
    error?: string
}
