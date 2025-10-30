export interface QuizQuestion {
    id: string
    question: string
    options: string[]
    correctAnswer: string
    points: number
}

export interface ChapterQuiz {
    id: string
    chapter_id: string
    title: string
    description: string
    xp_reward: number
    passing_score: number
    time_limit: number | null
    quiz_config: {
        questions: QuizQuestion[]
    }
    created_at?: string
}

export interface MinigamePoint {
    id: string
    x: number
    y: number
    label: string
}

export interface MinigameLine {
    id: string
    x1: number
    y1: number
    x2: number
    y2: number
    label?: string
}

export interface MinigameQuestion {
    id: string
    instruction: string
    // Chapter-specific properties (all optional to support different chapter types)
    points?: MinigamePoint[]        // Chapter 1: point-based minigames
    lines?: MinigameLine[]          // Chapter 2: line-based minigames
    shapes?: any[]                  // Chapter 3: shape-based minigames
    partType?: string               // Castle 3 Chapter 1: circle parts (center, radius, diameter, chord, arc, sector)
    // Answer and metadata
    correctAnswer: string | number | string[]
    type?: string
    showType?: 'segment' | 'ray' | 'line' | string
    hint?: string
    // Additional properties for calculation-based minigames
    sides?: number
    dimensions?: { length?: number; width?: number; base?: number; height?: number }
    shape?: string
    unit?: string
    formula?: string
    radius?: number
    diameter?: number
    base?: number
    height?: number
}

export interface Minigame {
    id: string
    chapter_id: string
    title: string
    description: string
    game_type: string
    xp_reward: number
    time_limit: number | null
    order_index: number
    game_config: {
        questions: MinigameQuestion[]
    }
    created_at?: string
}

export interface QuizAttempt {
    quiz_id: string
    answers: Record<string, string>
}

export interface MinigameAttempt {
    score: number
    time_taken: number
    attempt_data: Record<string, any>
}
