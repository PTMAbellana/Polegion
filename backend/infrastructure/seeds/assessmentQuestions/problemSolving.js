// ============================================================================
// ASSESSMENT QUESTION POOL - PROBLEM-SOLVING SKILLS CATEGORY
// 50 Questions Total (25 Pretest + 25 Posttest)
// ============================================================================

const problemSolvingQuestions = [
  // ========== PRETEST QUESTIONS (25) ==========
  {
    id: 'ps_pre_01',
    category: 'problem_solving',
    question: 'A rectangular garden has a length of 12 m and a width of 8 m. What is its area?',
    options: ['20 m²', '48 m²', '96 m²', '100 m²'],
    correctAnswer: '96 m²',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_02',
    category: 'problem_solving',
    question: 'A triangle has a base of 10 cm and height of 6 cm. What is its area?',
    options: ['30 cm²', '60 cm²', '20 cm²', '16 cm²'],
    correctAnswer: '30 cm²',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_03',
    category: 'problem_solving',
    question: 'The ratio of two angles forming a linear pair is 2:1. What are their measures?',
    options: ['120° and 60°', '100° and 50°', '90° and 45°', '80° and 40°'],
    correctAnswer: '120° and 60°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_04',
    category: 'problem_solving',
    question: 'A circle has a radius of 7 cm. What is its circumference? (Use π = 22/7)',
    options: ['22 cm', '44 cm', '28 cm', '14 cm'],
    correctAnswer: '44 cm',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_05',
    category: 'problem_solving',
    question: 'What is the interior angle sum of a hexagon?',
    options: ['360°', '540°', '720°', '900°'],
    correctAnswer: '720°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_06',
    category: 'problem_solving',
    question: 'A cube has an edge length of 5 cm. What is its volume?',
    options: ['15 cm³', '25 cm³', '75 cm³', '125 cm³'],
    correctAnswer: '125 cm³',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_07',
    category: 'problem_solving',
    question: 'A student draws two angles measuring 45° and 35°. What is their sum?',
    options: ['75°', '80°', '90°', '100°'],
    correctAnswer: '80°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_08',
    category: 'problem_solving',
    question: 'If a triangle\'s angles measure 2x, x, and 3x, what is x?',
    options: ['15°', '20°', '30°', '45°'],
    correctAnswer: '30°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_09',
    category: 'problem_solving',
    question: 'A rectangular lot has a perimeter of 50 m and width of 10 m. What is the length?',
    options: ['15 m', '20 m', '25 m', '30 m'],
    correctAnswer: '15 m',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_10',
    category: 'problem_solving',
    question: 'What is the area of a circle with diameter 14 cm? (π=3.14)',
    options: ['49π', '153.86 cm²', '78.5 cm²', '154 cm²'],
    correctAnswer: '153.86 cm²',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_11',
    category: 'problem_solving',
    question: 'A 40° angle is adjacent to an angle forming a straight line. What is the missing angle?',
    options: ['140°', '40°', '90°', '180°'],
    correctAnswer: '140°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_12',
    category: 'problem_solving',
    question: 'A pizza has radius 10 cm. What is its circumference?',
    options: ['20π', '40π', '10π', '30π'],
    correctAnswer: '20π',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_13',
    category: 'problem_solving',
    question: 'A square lot has an area of 225 m². What is the side length?',
    options: ['10 m', '12 m', '15 m', '18 m'],
    correctAnswer: '15 m',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_14',
    category: 'problem_solving',
    question: 'A prism has base area 12 cm² and height 10 cm. What is its volume?',
    options: ['120 cm³', '22 cm³', '100 cm³', '60 cm³'],
    correctAnswer: '120 cm³',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_15',
    category: 'problem_solving',
    question: 'A trapezoid has bases 8 cm and 12 cm, and height 5 cm. What is its area?',
    options: ['30 cm²', '40 cm²', '50 cm²', '60 cm²'],
    correctAnswer: '50 cm²',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_16',
    category: 'problem_solving',
    question: 'The sum of two complementary angles is 90°. If one angle is 35°, what is the other?',
    options: ['65°', '55°', '45°', '35°'],
    correctAnswer: '55°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_17',
    category: 'problem_solving',
    question: 'A cone has a radius of 3 cm and height of 4 cm. What is its volume?',
    options: ['12π', '24π', '36π', '48π'],
    correctAnswer: '12π',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_18',
    category: 'problem_solving',
    question: 'A room is shaped like a rectangle: 6 m by 4 m. What is its perimeter?',
    options: ['10 m', '20 m', '18 m', '24 m'],
    correctAnswer: '20 m',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_19',
    category: 'problem_solving',
    question: 'A cylinder has radius 5 cm and height 10 cm. What is its volume?',
    options: ['250π', '500π', '750π', '1000π'],
    correctAnswer: '250π',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_20',
    category: 'problem_solving',
    question: 'What is the measure of each interior angle of a regular pentagon?',
    options: ['108°', '120°', '135°', '150°'],
    correctAnswer: '108°',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_21',
    category: 'problem_solving',
    question: 'A rectangular field is 20 m long and 15 m wide. What is the total distance around it?',
    options: ['35 m', '50 m', '70 m', '300 m²'],
    correctAnswer: '70 m',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_22',
    category: 'problem_solving',
    question: 'Two supplementary angles are in the ratio 5:4. What is the smaller angle?',
    options: ['80°', '100°', '90°', '60°'],
    correctAnswer: '80°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_23',
    category: 'problem_solving',
    question: 'A circular pond has a diameter of 28 m. What is its circumference? (π = 22/7)',
    options: ['44 m', '88 m', '66 m', '56 m'],
    correctAnswer: '88 m',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_24',
    category: 'problem_solving',
    question: 'What is the sum of interior angles of an octagon?',
    options: ['720°', '900°', '1080°', '1260°'],
    correctAnswer: '1080°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_25',
    category: 'problem_solving',
    question: 'A box is 8 cm long, 5 cm wide, and 3 cm high. What is its volume?',
    options: ['40 cm³', '80 cm³', '120 cm³', '240 cm³'],
    correctAnswer: '120 cm³',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },

  // ========== POSTTEST QUESTIONS (25) ==========
  {
    id: 'ps_post_01',
    category: 'problem_solving',
    question: 'A triangle has sides 10 cm, 10 cm, and 12 cm. What type of triangle is it?',
    options: ['Equilateral', 'Isosceles', 'Scalene', 'Right'],
    correctAnswer: 'Isosceles',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_02',
    category: 'problem_solving',
    question: 'A square has a perimeter of 48 cm. What is the area?',
    options: ['144 cm²', '196 cm²', '256 cm²', '576 cm²'],
    correctAnswer: '144 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_03',
    category: 'problem_solving',
    question: 'The angles of a quadrilateral are in the ratio 1:2:3:4. What is the largest angle?',
    options: ['72°', '108°', '144°', '180°'],
    correctAnswer: '144°',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_04',
    category: 'problem_solving',
    question: 'A circle has a circumference of 31.4 cm. What is the radius? (π=3.14)',
    options: ['2 cm', '3 cm', '4 cm', '5 cm'],
    correctAnswer: '5 cm',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_05',
    category: 'problem_solving',
    question: 'A right triangle has legs 9 m and 12 m. What is the hypotenuse?',
    options: ['10 m', '12 m', '15 m', '20 m'],
    correctAnswer: '15 m',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_06',
    category: 'problem_solving',
    question: 'The area of a trapezoid is 48 cm². Bases are 6 cm and 10 cm. What is the height?',
    options: ['4 cm', '6 cm', '8 cm', '10 cm'],
    correctAnswer: '6 cm',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_07',
    category: 'problem_solving',
    question: 'A cone has volume 100π cm³. Radius = 5 cm. What is the height?',
    options: ['8 cm', '10 cm', '12 cm', '15 cm'],
    correctAnswer: '12 cm',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_08',
    category: 'problem_solving',
    question: 'A parallelogram has base 20 cm and height 7 cm. What is the area?',
    options: ['27 cm²', '70 cm²', '140 cm²', '200 cm²'],
    correctAnswer: '140 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_09',
    category: 'problem_solving',
    question: 'The radius of a sphere is doubled. Its volume becomes…',
    options: ['Doubled', 'Tripled', 'Four times', 'Eight times'],
    correctAnswer: 'Eight times',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_10',
    category: 'problem_solving',
    question: 'A polygon has 15 sides. What is its interior angle sum?',
    options: ['1980°', '2160°', '2340°', '2520°'],
    correctAnswer: '2340°',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_11',
    category: 'problem_solving',
    question: 'A cylinder has volume 628 cm³ and height 10 cm (π = 3.14). What is the radius?',
    options: ['2 cm', '3 cm', '4 cm', '5 cm'],
    correctAnswer: '4 cm',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_12',
    category: 'problem_solving',
    question: 'A child draws an angle measuring 75° and another measuring 105°. What relationship do they have?',
    options: ['Complementary', 'Supplementary', 'Vertical', 'Congruent'],
    correctAnswer: 'Supplementary',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_13',
    category: 'problem_solving',
    question: 'What is the area of a triangle with sides 13, 14, and 15?',
    options: ['42 cm²', '84 cm²', '210 cm²', '100 cm²'],
    correctAnswer: '84 cm²',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_14',
    category: 'problem_solving',
    question: 'A rectangular prism is 4 cm × 5 cm × 6 cm. What is its volume?',
    options: ['60 cm³', '100 cm³', '120 cm³', '240 cm³'],
    correctAnswer: '120 cm³',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_15',
    category: 'problem_solving',
    question: 'The base angles of an isosceles triangle measure (x + 10)° each. The vertex angle is (2x – 20)°. Find x.',
    options: ['30°', '40°', '50°', '60°'],
    correctAnswer: '50°',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_16',
    category: 'problem_solving',
    question: 'A ladder leans against a wall forming a right triangle. Ladder = 10 m, base = 6 m. Height?',
    options: ['6 m', '8 m', '10 m', '12 m'],
    correctAnswer: '8 m',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_17',
    category: 'problem_solving',
    question: 'A classroom whiteboard is 3 m × 1.5 m. What is the perimeter?',
    options: ['6 m', '9 m', '10 m', '12 m'],
    correctAnswer: '9 m',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_18',
    category: 'problem_solving',
    question: 'A circle has area 154 cm² (π=22/7). What is the radius?',
    options: ['5 cm', '7 cm', '10 cm', '14 cm'],
    correctAnswer: '7 cm',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_19',
    category: 'problem_solving',
    question: 'A regular decagon has each interior angle measuring…',
    options: ['120°', '135°', '144°', '150°'],
    correctAnswer: '144°',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_20',
    category: 'problem_solving',
    question: 'A cylindrical can has radius 4 cm and height 12 cm. What is its volume?',
    options: ['48π', '96π', '128π', '192π'],
    correctAnswer: '192π',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_21',
    category: 'problem_solving',
    question: 'A triangle has angles in the ratio 1:2:3. What is the largest angle?',
    options: ['60°', '90°', '120°', '180°'],
    correctAnswer: '90°',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_22',
    category: 'problem_solving',
    question: 'A rectangular garden is 18 m × 12 m. What is the area?',
    options: ['60 m²', '120 m²', '180 m²', '216 m²'],
    correctAnswer: '216 m²',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_23',
    category: 'problem_solving',
    question: 'The perimeter of a rhombus is 80 cm. What is the side length?',
    options: ['10 cm', '15 cm', '20 cm', '40 cm'],
    correctAnswer: '20 cm',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_24',
    category: 'problem_solving',
    question: 'A cube has volume 216 cm³. What is its edge length?',
    options: ['4 cm', '6 cm', '8 cm', '12 cm'],
    correctAnswer: '6 cm',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_25',
    category: 'problem_solving',
    question: 'A circle has radius 10 cm. What is its area? (π=3.14)',
    options: ['62.8 cm²', '314 cm²', '31.4 cm²', '628 cm²'],
    correctAnswer: '314 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  }
];

module.exports = { problemSolvingQuestions };
