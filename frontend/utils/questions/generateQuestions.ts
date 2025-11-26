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

// Utility function: select N random items from array and shuffle their options
function selectRandomItems<T extends Question>(arr: T[], count: number): T[] {
  const shuffled = shuffleArray(arr);
  const selected = shuffled.slice(0, count);
  // Reshuffle options for each selected question
  return selected.map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  }));
}

/* ============================================================
   CATEGORY 1 — KNOWLEDGE RECALL (5 questions from pool)
============================================================ */
export function generateKnowledgeRecallQuestions(): Question[] {
  const questionPool: Question[] = [
    {
      question: "How many sides does a triangle have?",
      options: ["3", "4", "5", "6"],
      correct: "3",
    },
    {
      question: "A polygon with 4 equal sides is called a ____.",
      options: ["Square", "Rectangle", "Pentagon", "Rhombus"],
      correct: "Square",
    },
    {
      question: "A straight angle measures ____ degrees.",
      options: ["180°", "90°", "360°", "45°"],
      correct: "180°",
    },
    {
      question: "The distance around a circle is called ____.",
      options: ["Circumference", "Area", "Diameter", "Radius"],
      correct: "Circumference",
    },
    {
      question: "A 3D figure with 6 faces and 12 edges is a ____.",
      options: ["Cube", "Sphere", "Cylinder", "Cone"],
      correct: "Cube",
    },
    {
      question: "How many vertices does a cube have?",
      options: ["8", "6", "12", "4"],
      correct: "8",
    },
    {
      question: "A line segment from the center of a circle to any point on the circle is called ____.",
      options: ["Radius", "Diameter", "Chord", "Arc"],
      correct: "Radius",
    },
    {
      question: "How many degrees are in a right angle?",
      options: ["90°", "180°", "45°", "360°"],
      correct: "90°",
    },
    {
      question: "A polygon with 5 sides is called a ____.",
      options: ["Pentagon", "Hexagon", "Octagon", "Heptagon"],
      correct: "Pentagon",
    },
    {
      question: "An angle less than 90° is called ____.",
      options: ["Acute", "Obtuse", "Right", "Straight"],
      correct: "Acute",
    },
  ];

  return selectRandomItems(questionPool, 5);
}

/* ============================================================
   CATEGORY 2 — CONCEPT UNDERSTANDING (5 questions from pool)
============================================================ */
export function generateConceptUnderstandingQuestions(): Question[] {
  const questionPool: Question[] = [
    {
      question: "Two lines that never meet are called ____ lines.",
      options: ["Parallel", "Intersecting", "Skew", "Perpendicular"],
      correct: "Parallel",
    },
    {
      question: "Lines that meet at a right angle are ____.",
      options: ["Perpendicular", "Parallel", "Skew", "Horizontal"],
      correct: "Perpendicular",
    },
    {
      question: "Two angles whose sum is 90° are called ____ angles.",
      options: ["Complementary", "Supplementary", "Vertical", "Linear"],
      correct: "Complementary",
    },
    {
      question: "In a circle, the line passing through the center and touching two points is the ____.",
      options: ["Diameter", "Radius", "Chord", "Tangent"],
      correct: "Diameter",
    },
    {
      question: "A line that touches the circle at exactly one point is called a ____.",
      options: ["Tangent", "Secant", "Chord", "Diameter"],
      correct: "Tangent",
    },
    {
      question: "Two angles whose sum is 180° are called ____ angles.",
      options: ["Supplementary", "Complementary", "Vertical", "Adjacent"],
      correct: "Supplementary",
    },
    {
      question: "When two lines intersect, the opposite angles formed are called ____.",
      options: ["Vertical angles", "Adjacent angles", "Complementary angles", "Linear pairs"],
      correct: "Vertical angles",
    },
    {
      question: "A polygon with all sides and angles equal is called ____.",
      options: ["Regular polygon", "Irregular polygon", "Convex polygon", "Concave polygon"],
      correct: "Regular polygon",
    },
  ];

  return selectRandomItems(questionPool, 5);
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
    options: [
      String(side * side),
      String(side + side),
      String(side * 4),
      String(side * 2),
    ],
    correct: String(side * side),
  });

  // Question 2: Perimeter of rectangle
  const L = Math.floor(Math.random() * 10) + 4;
  const W = Math.floor(Math.random() * 5) + 2;
  questions.push({
    question: `Find the perimeter of a rectangle with length ${L} and width ${W}.`,
    options: [
      String(2 * (L + W)),
      String(L * W),
      String(L + W),
      String(L - W),
    ],
    correct: String(2 * (L + W)),
  });

  // Question 3: Missing angle in linear pair
  const A = Math.floor(Math.random() * 130) + 20;
  questions.push({
    question: `Two angles form a linear pair. If one angle is ${A}°, what is the other angle?`,
    options: [
      String(180 - A),
      String(A),
      "90",
      String(A + 10),
    ],
    correct: String(180 - A),
  });

  // Question 4: Circumference
  const r = Math.floor(Math.random() * 10) + 3;
  questions.push({
    question: `Find the circumference of a circle with radius ${r}. (Use π = 3.14)`,
    options: [
      String((2 * 3.14 * r).toFixed(2)),
      String((3.14 * r * r).toFixed(2)),
      String((3.14 * r).toFixed(2)),
      String(r * 4),
    ],
    correct: String((2 * 3.14 * r).toFixed(2)),
  });

  // Question 5: Area of triangle
  const base = Math.floor(Math.random() * 10) + 4;
  const height = Math.floor(Math.random() * 10) + 3;
  questions.push({
    question: `Find the area of a triangle with base ${base} and height ${height}.`,
    options: [
      String((0.5 * base * height).toFixed(2)),
      String(base * height),
      String(base + height),
      "0",
    ],
    correct: String((0.5 * base * height).toFixed(2)),
  });

  // Shuffle options for each question
  return questions.map(q => ({
    ...q,
    options: shuffleArray([...q.options])
  }));
}

/* ============================================================
   CATEGORY 4 — ANALYTICAL THINKING (5 questions from pool)
============================================================ */
export function generateAnalyticalQuestions(): Question[] {
  const questionPool: Question[] = [
    {
      question: "If two triangles are congruent, which statement is ALWAYS true?",
      options: [
        "All corresponding sides are equal",
        "All angles must be 90°",
        "They must be equilateral",
        "They form a linear pair",
      ],
      correct: "All corresponding sides are equal",
    },
    {
      question: "If a polygon has 10 sides, how many triangles can it be divided into?",
      options: ["8", "10", "9", "5"],
      correct: "8",
    },
    {
      question: "Two complementary angles differ by 30°. What are the angles?",
      options: ["30° and 60°", "45° and 45°", "20° and 70°", "15° and 75°"],
      correct: "30° and 60°",
    },
    {
      question: "A circle has a radius that doubles. What happens to its area?",
      options: [
        "Area becomes 4 times larger",
        "Area doubles",
        "Area becomes half",
        "Area becomes 8 times larger",
      ],
      correct: "Area becomes 4 times larger",
    },
    {
      question: "Which statement is true about parallelograms?",
      options: [
        "Opposite sides are equal",
        "All angles are right angles",
        "Only one pair of sides is parallel",
        "It must be a square",
      ],
      correct: "Opposite sides are equal",
    },
    {
      question: "If each angle of a regular polygon is 120°, how many sides does it have?",
      options: ["6", "8", "5", "10"],
      correct: "6",
    },
    {
      question: "Two angles in a triangle are 50° and 70°. What type of triangle is it?",
      options: ["Acute triangle", "Right triangle", "Obtuse triangle", "Equilateral triangle"],
      correct: "Acute triangle",
    },
  ];

  return selectRandomItems(questionPool, 5);
}

/* ============================================================
   CATEGORY 5 — PROBLEM-SOLVING (5 questions from pool)
============================================================ */
export function generateProblemSolvingQuestions(): Question[] {
  const questionPool: Question[] = [
    {
      question: "A garden shaped like a rectangle is 8m long and 5m wide. How much fencing is needed around it?",
      options: ["26m", "40m", "16m", "13m"],
      correct: "26m",
    },
    {
      question: "A circular pool has a radius of 4m. How many meters around is the pool? (Use π = 3.14)",
      options: ["25.12m", "50.24m", "12.56m", "16m"],
      correct: "25.12m",
    },
    {
      question: "A pizza has a diameter of 12 inches. What is its radius?",
      options: ["6 in", "12 in", "24 in", "3 in"],
      correct: "6 in",
    },
    {
      question: "A triangle has angles 40° and 60°. What is the missing angle?",
      options: ["80°", "40°", "60°", "100°"],
      correct: "80°",
    },
    {
      question: "A square has perimeter 36 cm. What is the length of one side?",
      options: ["9 cm", "6 cm", "12 cm", "8 cm"],
      correct: "9 cm",
    },
    {
      question: "A rectangular room is 10m by 6m. What is its area?",
      options: ["60 m²", "32 m²", "16 m²", "100 m²"],
      correct: "60 m²",
    },
    {
      question: "A circular clock has diameter 30 cm. What is its radius?",
      options: ["15 cm", "30 cm", "60 cm", "7.5 cm"],
      correct: "15 cm",
    },
  ];

  return selectRandomItems(questionPool, 5);
}

/* ============================================================
   CATEGORY 6 — HIGHER ORDER / CREATIVE THINKING (5 questions from pool)
============================================================ */
export function generateHOTSQuestions(): Question[] {
  const questionPool: Question[] = [
    {
      question: "A prism and a pyramid have the same base area and height. Which has a larger volume?",
      options: [
        "Prism",
        "Pyramid",
        "Both have equal volume",
        "Not enough information",
      ],
      correct: "Prism",
    },
    {
      question: "If each side of a square increases by 50%, how does the area change?",
      options: [
        "Area becomes 2.25 times larger",
        "Area doubles",
        "Area becomes 1.5 times larger",
        "Area becomes 4 times larger",
      ],
      correct: "Area becomes 2.25 times larger",
    },
    {
      question: "A cylinder and a cone have equal radius and height. Which statement is true?",
      options: [
        "Cylinder has 3 times the volume of the cone",
        "Cone has twice the volume of the cylinder",
        "Both have equal volumes",
        "The cone has more volume",
      ],
      correct: "Cylinder has 3 times the volume of the cone",
    },
    {
      question: "A triangle's sides all double. What happens to its perimeter?",
      options: ["It doubles", "It quadruples", "It stays the same", "It becomes half"],
      correct: "It doubles",
    },
    {
      question: "Which shape will have the largest area if all have the same perimeter?",
      options: [
        "Circle",
        "Square",
        "Rectangle",
        "Triangle",
      ],
      correct: "Circle",
    },
    {
      question: "If a rectangle's length doubles and width halves, what happens to the area?",
      options: [
        "Stays the same",
        "Doubles",
        "Becomes half",
        "Quadruples",
      ],
      correct: "Stays the same",
    },
    {
      question: "Which 3D shape has the most faces among these options?",
      options: [
        "Octahedron (8 faces)",
        "Cube (6 faces)",
        "Tetrahedron (4 faces)",
        "Triangular prism (5 faces)",
      ],
      correct: "Octahedron (8 faces)",
    },
  ];

  return selectRandomItems(questionPool, 5);
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
