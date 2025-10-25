import { Shape } from "../forms";

export interface Problem {
  id: string;
  title?: string | null;
  description?: string | null;
  visibility: string;
  difficulty: string;
  max_attempts: number;
  expected_xp: number;
  timer?: number | null;
  hint?: string | null;
}

// for studeent view under room details
export interface SProblemType {
    id: string;
    title: string | 'No Title';
    description: string;
    difficulty: 'easy' | 'intermediate' | 'hard';
    max_attempts?: number;
    expected_xp: number;
    hint?: string | null;
    timer? : number | null; // in seconds, null means no timer    
}

// for teacher view under room details
export interface TProblemType extends SProblemType {
  visibility: 'show' | 'hide';
  expected_solution?: Shape[] | null; // expected solution for auto-grading, null means no expected solution
}