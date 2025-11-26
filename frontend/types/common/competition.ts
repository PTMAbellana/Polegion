import { Problem } from './problem';

// Competition Status Types
export type CompetitionStatus = 'NEW' | 'ONGOING' | 'DONE';
export type GameplayIndicator = 'ACTIVE' | 'PLAY' | 'PAUSE' | 'FINISHED';

// Core Competition Interface
export interface Competition {
  id: number;
  title: string;
  status: CompetitionStatus;
  room_id: number;
  gameplay_indicator?: GameplayIndicator;
  current_problem_id?: number;
  current_problem_index?: number;
  timer_started_at?: string | null;
  timer_duration?: number | null;
  timer_end_at?: string | null;
  time_remaining?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Competition Problem Mapping
export interface CompetitionProblem {
  id: string;
  competition_id: number;
  problem_id: string;
  timer: number | null;
  sequence_order: number;
  problem: Problem;
}

// Re-export Problem for convenience
export type { Problem } from './problem';

// Participant in Competition
export interface CompetitionParticipant {
  id: number;
  user_id: number;
  room_id: number;
  fullName?: string;
  accumulated_xp: number;
  profile_pic?: string | null;
  rank?: number;
}

// Competition Creation Data
export interface CompetitionCreateData {
  room_id: number | string;
  title: string;
}

// Competition Start Data
export interface CompetitionStartData {
  problems: CompetitionProblem[];
}

// Competition Next Problem Data
export interface CompetitionNextData {
  problems: CompetitionProblem[];
  current_index: number;
}

// Legacy Type for Compatibility
export interface CompetitionType {
  id: number;
  title: string;
  status: CompetitionStatus;
}