// for studeent view under room details
export interface SProblemType {
    id: number;
    title: string | 'No Title';
    description: string;
    difficulty: 'easy' | 'intermediate' | 'hard';
    max_attempts?: number;
    timer? : number | null; // in seconds, null means no timer    
}

// for teacher view under room details
export interface TProblemType extends SProblemType {
  visibility: 'show' | 'hide';
}