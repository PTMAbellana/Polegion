// Database types (matches Supabase schema)
export interface Castle {
  id: string;
  name: string;
  region: string;
  description: string;
  difficulty: 'Easy' | 'Intermediate' | 'Hard';
  terrain: string;
  image_number: number;
  total_xp: number;
  unlock_order: number;
  route: string; // e.g., 'castle1', 'castle2', etc.
  created_at?: string;
}

export interface CastleProgress {
  id: string;
  user_id: string;
  castle_id: string;
  unlocked: boolean;
  completed: boolean;
  total_xp_earned: number;
  completion_percentage: number;
  questions_answered?: number;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CastleWithProgress extends Castle {
  progress?: CastleProgress;
  questions_count?: number;
  order?: number;
}

export interface Chapter {
  id: string;
  castle_id: string;
  title: string;
  description?: string;
  chapter_number: number;
  xp_reward: number;
  created_at?: string;
}

export interface ChapterProgress {
  id?: string;
  user_id: string;
  chapter_id: string;
  unlocked: boolean;
  completed: boolean;
  xp_earned: number;
  quiz_passed: boolean;
  started_at?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChapterWithProgress extends Chapter {
  progress?: ChapterProgress;
}

export interface Minigame {
  id: string;
  chapter_id: string;
  title: string;
  description?: string;
  game_type: string;
  game_config?: any;
  xp_reward: number;
  time_limit?: number;
  order_index: number;
  created_at: string;
}

export interface MinigameAttempt {
  id: string;
  user_id: string;
  minigame_id: string;
  score?: number;
  time_taken?: number;
  xp_earned: number;
  completed: boolean;
  attempt_data?: any;
  attempted_at: string;
  created_at: string;
}

export interface ChapterQuiz {
  id: string;
  chapter_id: string;
  title: string;
  description?: string;
  quiz_config?: any;
  xp_reward: number;
  passing_score: number;
  time_limit?: number;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  chapter_quiz_id: string;
  score: number;
  passing_score: number;
  passed: boolean;
  xp_earned: number;
  answers?: any;
  time_taken?: number;
  attempt_number: number;
  attempted_at: string;
  created_at: string;
}

export interface ProgressOverview {
  user_id: string;
  total_xp: number;
  castles_unlocked: number;
  castles_completed: number;
  chapters_completed: number;
  current_castle?: CastleWithProgress;
  current_chapter?: ChapterWithProgress;
}