// ============================================================================
// DYNAMIC PRACTICE QUESTION GENERATOR
// ============================================================================
// Generates randomized multiple-choice questions for 6 geometry categories
// ============================================================================

export interface Question {
  question: string;
  options: string[];
  correct: string;
}

// Utility function: shuffle array
function shuffleArray<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

/* ============================================================
   CATEGORY 1 — KNOWLEDGE RECALL (5 questions)
============================================================ */
export function generateKnowledgeRecallQuestions(): Question[] {
  const questions: Question[] = [];

  questions.push({
    question: "How many sides does a triangle have?",
    options: shuffleArray(["3", "4", "5", "6"]),
    correct: "3",
  });

  questions.push({
    question: "A polygon with 4 equal sides is called a ____.",
    options: shuffleArray(["Square", "Rectangle", "Pentagon", "Rhombus"]),
    correct: "Square",
  });

  questions.push({
    question: "A straight angle measures ____ degrees.",
    options: shuffleArray(["180°", "90°", "360°", "45°"]),
    correct: "180°",
  });

  questions.push({
    question: "The distance around a circle is called ____.",
    options: shuffleArray(["Circumference", "Area", "Diameter", "Radius"]),
    correct: "Circumference",
  });

  questions.push({
    question: "A 3D figure with 6 faces and 12 edges is a ____.",
    options: shuffleArray(["Cube", "Sphere", "Cylinder", "Cone"]),
    correct: "Cube",
  });

  return questions;
}

/* ============================================================
   CATEGORY 2 — CONCEPT UNDERSTANDING (5 questions)
============================================================ */
export function generateConceptUnderstandingQuestions(): Question[] {
  const questions: Question[] = [];

  questions.push({
    question: "Two lines that never meet are called ____ lines.",
    options: shuffleArray(["Parallel", "Intersecting", "Skew", "Perpendicular"]),
    correct: "Parallel",
  });

  questions.push({
    question: "Lines that meet at a right angle are ____.",
    options: shuffleArray(["Perpendicular", "Parallel", "Skew", "Horizontal"]),
    correct: "Perpendicular",
  });

  questions.push({
    question: "Two angles whose sum is 90° are called ____ angles.",
    options: shuffleArray(["Complementary", "Supplementary", "Vertical", "Linear"]),
    correct: "Complementary",
  });

  questions.push({
    question: "In a circle, the line passing through the center and touching two points is the ____.",
    options: shuffleArray(["Diameter", "Radius", "Chord", "Tangent"]),
    correct: "Diameter",
  });

  questions.push({
    question: "A line that touches the circle at exactly one point is called a ____.",
    options: shuffleArray(["Tangent", "Secant", "Chord", "Diameter"]),
    correct: "Tangent",
  });

  return questions;
}

/* ============================================================
   CATEGORY 3 — PROCEDURAL SKILLS (5 dynamic questions)
============================================================ */
export function generateProceduralQuestions(): Question[] {
  const questions: Question[] = [];

  // Question 1: Area of a square
  const side = Math.floor(Math.random() * 10) + 2;
  questions.push({
    question: `Find the area of a square with side length ${side}.`,
    options: shuffleArray([
      String(side * side),
      String(side + side),
      String(side * 4),
      String(side * 2),
    ]),
    correct: String(side * side),
  });

  // Question 2: Perimeter of rectangle
  const L = Math.floor(Math.random() * 10) + 4;
  const W = Math.floor(Math.random() * 5) + 2;
  questions.push({
    question: `Find the perimeter of a rectangle with length ${L} and width ${W}.`,
    options: shuffleArray([
      String(2 * (L + W)),
      String(L * W),
      String(L + W),
      String(L - W),
    ]),
    correct: String(2 * (L + W)),
  });

  // Question 3: Missing angle in linear pair
  const A = Math.floor(Math.random() * 130) + 20;
  questions.push({
    question: `Two angles form a linear pair. If one angle is ${A}°, what is the other angle?`,
    options: shuffleArray([
      String(180 - A),
      String(A),
      "90",
      String(A + 10),
    ]),
    correct: String(180 - A),
  });

  // Question 4: Circumference
  const r = Math.floor(Math.random() * 10) + 3;
  questions.push({
    question: `Find the circumference of a circle with radius ${r}. (Use π = 3.14)`,
    options: shuffleArray([
      String((2 * 3.14 * r).toFixed(2)),
      String((3.14 * r * r).toFixed(2)),
      String((3.14 * r).toFixed(2)),
      String(r * 4),
    ]),
    correct: String((2 * 3.14 * r).toFixed(2)),
  });

  // Question 5: Area of triangle
  const base = Math.floor(Math.random() * 10) + 4;
  const height = Math.floor(Math.random() * 10) + 3;
  questions.push({
    question: `Find the area of a triangle with base ${base} and height ${height}.`,
    options: shuffleArray([
      String((0.5 * base * height).toFixed(2)),
      String(base * height),
      String(base + height),
      "0",
    ]),
    correct: String((0.5 * base * height).toFixed(2)),
  });

  return questions;
}

/* ============================================================
   CATEGORY 4 — ANALYTICAL THINKING (5 questions)
============================================================ */
export function generateAnalyticalQuestions(): Question[] {
  return [
    {
      question: "If two triangles are congruent, which statement is ALWAYS true?",
      options: shuffleArray([
        "All corresponding sides are equal",
        "All angles must be 90°",
        "They must be equilateral",
        "They form a linear pair",
      ]),
      correct: "All corresponding sides are equal",
    },
    {
      question: "If a polygon has 10 sides, how many triangles can it be divided into?",
      options: shuffleArray(["8", "10", "9", "5"]),
      correct: "8",
    },
    {
      question: "Two complementary angles differ by 30°. What are the angles?",
      options: shuffleArray(["30° and 60°", "45° and 45°", "20° and 70°", "15° and 75°"]),
      correct: "30° and 60°",
    },
    {
      question: "A circle has a radius that doubles. What happens to its area?",
      options: shuffleArray([
        "Area becomes 4 times larger",
        "Area doubles",
        "Area becomes half",
        "Area becomes 8 times larger",
      ]),
      correct: "Area becomes 4 times larger",
    },
    {
      question: "Which statement is true about parallelograms?",
      options: shuffleArray([
        "Opposite sides are equal",
        "All angles are right angles",
        "Only one pair of sides is parallel",
        "It must be a square",
      ]),
      correct: "Opposite sides are equal",
    },
  ];
}

/* ============================================================
   CATEGORY 5 — PROBLEM-SOLVING (5 questions)
============================================================ */
export function generateProblemSolvingQuestions(): Question[] {
  return [
    {
      question: "A garden shaped like a rectangle is 8m long and 5m wide. How much fencing is needed around it?",
      options: shuffleArray(["26m", "40m", "16m", "13m"]),
      correct: "26m",
    },
    {
      question: "A circular pool has a radius of 4m. How many meters around is the pool? (Use π = 3.14)",
      options: shuffleArray(["25.12m", "50.24m", "12.56m", "16m"]),
      correct: "25.12m",
    },
    {
      question: "A pizza has a diameter of 12 inches. What is its radius?",
      options: shuffleArray(["6 in", "12 in", "24 in", "3 in"]),
      correct: "6 in",
    },
    {
      question: "A triangle has angles 40° and 60°. What is the missing angle?",
      options: shuffleArray(["80°", "40°", "60°", "100°"]),
      correct: "80°",
    },
    {
      question: "A square has perimeter 36 cm. What is the length of one side?",
      options: shuffleArray(["9 cm", "6 cm", "12 cm", "8 cm"]),
      correct: "9 cm",
    },
  ];
}

/* ============================================================
   CATEGORY 6 — HIGHER ORDER / CREATIVE THINKING (5 questions)
============================================================ */
export function generateHOTSQuestions(): Question[] {
  return [
    {
      question: "A prism and a pyramid have the same base area and height. Which has a larger volume?",
      options: shuffleArray([
        "Prism",
        "Pyramid",
        "Both have equal volume",
        "Not enough information",
      ]),
      correct: "Prism",
    },
    {
      question: "If each side of a square increases by 50%, how does the area change?",
      options: shuffleArray([
        "Area becomes 2.25 times larger",
        "Area doubles",
        "Area becomes 1.5 times larger",
        "Area becomes 4 times larger",
      ]),
      correct: "Area becomes 2.25 times larger",
    },
    {
      question: "A cylinder and a cone have equal radius and height. Which statement is true?",
      options: shuffleArray([
        "Cylinder has 3 times the volume of the cone",
        "Cone has twice the volume of the cylinder",
        "Both have equal volumes",
        "The cone has more volume",
      ]),
      correct: "Cylinder has 3 times the volume of the cone",
    },
    {
      question: "A triangle's sides all double. What happens to its perimeter?",
      options: shuffleArray(["It doubles", "It quadruples", "It stays the same", "It becomes half"]),
      correct: "It doubles",
    },
    {
      question: "Which shape will have the largest area if all have the same perimeter?",
      options: shuffleArray([
        "Circle",
        "Square",
        "Rectangle",
        "Triangle",
      ]),
      correct: "Circle",
    },
  ];
}

/* ============================================================
   HELPER: Get questions by category name
============================================================ */
export function getQuestionsByCategory(category: string): Question[] {
  switch (category.toLowerCase()) {
    case 'knowledge-recall':
      return generateKnowledgeRecallQuestions();
    case 'concept-understanding':
      return generateConceptUnderstandingQuestions();
    case 'procedural-skills':
      return generateProceduralQuestions();
    case 'analytical-thinking':
      return generateAnalyticalQuestions();
    case 'problem-solving':
      return generateProblemSolvingQuestions();
    case 'hots':
    case 'higher-order-thinking':
      return generateHOTSQuestions();
    default:
      return [];
  }
}
