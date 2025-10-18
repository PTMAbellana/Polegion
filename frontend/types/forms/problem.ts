export interface ProblemPayload {
    title: string,
    description: string,
    expected_solution: object[],
    difficulty: string,
    visibility: "show" | "hide",
    max_attempts: number | null,
    expected_xp: number,
    timer: number | null,
    hint: string | null,
}

export interface Shape {
  id: number;
  type: string;
  x: number;
  y: number;
  size: number;
  fill?: string;
  points?: unknown;
}
