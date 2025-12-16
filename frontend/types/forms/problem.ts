export interface ProblemPayload {
    title: string,
    description: string,
    expected_solution: object[],
    difficulty: string,
    visibility: "public" | "private",
    max_attempts: number | null,
    expected_xp: number,
    timer: number | null,
    hint: string | null,
    problem_type?: string,
    shape_constraint?: string | null,
    grading_rules?: Record<string, any> | null,
    accepts_submissions?: boolean,
}

export interface Shape {
  [key: string]: unknown;
  id: number;
  type: string;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points?: unknown;
}
