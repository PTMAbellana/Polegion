// ============================================================================
// ASSESSMENT QUESTION POOL - PROCEDURAL SKILLS CATEGORY
// 50 Questions Total (25 Pretest + 25 Posttest)
// ============================================================================

const proceduralSkillsQuestions = [
  // ========== PRETEST QUESTIONS (25) ==========
  {
    id: 'ps_pre_01',
    category: 'procedural_skills',
    question: 'Which of the following correctly represents line segment AB?',
    options: ['AB→', 'AB↔', 'A̅B̅', 'Ray AB'],
    correctAnswer: 'A̅B̅',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_02',
    category: 'procedural_skills',
    question: 'To construct a perpendicular line to a given line, which tool is best?',
    options: ['Compass', 'Ruler and protractor', 'Divider', 'Pencil only'],
    correctAnswer: 'Ruler and protractor',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_03',
    category: 'procedural_skills',
    question: 'When constructing an angle of 60° using a protractor, which step is first?',
    options: [
      'Place vertex at protractor center',
      'Draw a 60° arc',
      'Connect points to form angle',
      'Extend the line'
    ],
    correctAnswer: 'Place vertex at protractor center',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_04',
    category: 'procedural_skills',
    question: 'When measuring the length of a line segment using a ruler, which unit is most appropriate?',
    options: ['Centimeters', 'Degrees', 'Liters', 'Square meters'],
    correctAnswer: 'Centimeters',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_05',
    category: 'procedural_skills',
    question: 'A ray starting at point A toward point B is represented by which symbol?',
    options: ['A̅B̅', 'AB→', 'AB↔', 'Point A'],
    correctAnswer: 'AB→',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_06',
    category: 'procedural_skills',
    question: 'Find the perimeter of a rectangle with L=12 cm and W=5 cm.',
    options: ['34 cm', '60 cm', '17 cm', '30 cm'],
    correctAnswer: '34 cm',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_07',
    category: 'procedural_skills',
    question: 'Find the area of a triangle with base 10 cm and height 6 cm.',
    options: ['16 cm²', '30 cm²', '60 cm²', '36 cm²'],
    correctAnswer: '30 cm²',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_08',
    category: 'procedural_skills',
    question: 'Find the circumference of a circle with r=7 cm. (π=3.14)',
    options: ['43.96 cm', '21.98 cm', '49 cm', '22 cm'],
    correctAnswer: '43.96 cm',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_09',
    category: 'procedural_skills',
    question: 'Find the area of a circle with r=5 cm. (π=3.14)',
    options: ['31.4 cm²', '78.5 cm²', '25 cm²', '50 cm²'],
    correctAnswer: '78.5 cm²',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_10',
    category: 'procedural_skills',
    question: 'Find the sum of interior angles of a hexagon.',
    options: ['360°', '540°', '720°', '900°'],
    correctAnswer: '720°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_11',
    category: 'procedural_skills',
    question: 'When constructing a regular pentagon, how many equal sides should it have?',
    options: ['4', '5', '6', '8'],
    correctAnswer: '5',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_12',
    category: 'procedural_skills',
    question: 'Find the surface area of a cube with side 3 cm.',
    options: ['9 cm²', '27 cm²', '36 cm²', '54 cm²'],
    correctAnswer: '54 cm²',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_13',
    category: 'procedural_skills',
    question: 'Find the volume of a rectangular prism with L=5, W=3, H=2.',
    options: ['10 cm³', '15 cm³', '30 cm³', '60 cm³'],
    correctAnswer: '30 cm³',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_14',
    category: 'procedural_skills',
    question: 'Find the volume of a cylinder with r=4, h=10 (π=3.14).',
    options: ['125.6 cm³', '502.4 cm³', '251.2 cm³', '100.48 cm³'],
    correctAnswer: '502.4 cm³',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_15',
    category: 'procedural_skills',
    question: 'Find the volume of a cone with r=3, h=9 (π=3.14).',
    options: ['84.78 cm³', '254.34 cm³', '282.6 cm³', '28.26 cm³'],
    correctAnswer: '84.78 cm³',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_16',
    category: 'procedural_skills',
    question: 'Find the area of a parallelogram with base 8 cm and height 5 cm.',
    options: ['20 cm²', '30 cm²', '40 cm²', '50 cm²'],
    correctAnswer: '40 cm²',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_17',
    category: 'procedural_skills',
    question: 'When a student constructs an angle bisector, which is TRUE?',
    options: [
      'Divides the angle into two equal parts',
      'Measures the angle',
      'Extends the line segment',
      'Draws a perpendicular line'
    ],
    correctAnswer: 'Divides the angle into two equal parts',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_18',
    category: 'procedural_skills',
    question: 'When constructing a tangent to a circle at a given point, which is correct?',
    options: [
      'Passes through center',
      'Touches circle at exactly one point',
      'Passes through two points on the circle',
      'Lies inside the circle'
    ],
    correctAnswer: 'Touches circle at exactly one point',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_19',
    category: 'procedural_skills',
    question: 'An angle measured with a protractor shows 110°. Which category is it?',
    options: ['Acute', 'Right', 'Obtuse', 'Straight'],
    correctAnswer: 'Obtuse',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_20',
    category: 'procedural_skills',
    question: 'Find the perimeter of a trapezoid with sides 6, 8, 10, 12 cm.',
    options: ['30 cm', '32 cm', '36 cm', '40 cm'],
    correctAnswer: '36 cm',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_21',
    category: 'procedural_skills',
    question: 'Calculate the perimeter of a square with side length 9 cm.',
    options: ['18 cm', '27 cm', '36 cm', '81 cm'],
    correctAnswer: '36 cm',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_22',
    category: 'procedural_skills',
    question: 'Find the area of a square with side 6 cm.',
    options: ['12 cm²', '24 cm²', '36 cm²', '48 cm²'],
    correctAnswer: '36 cm²',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_23',
    category: 'procedural_skills',
    question: 'If a circle has diameter 14 cm, what is its radius?',
    options: ['7 cm', '14 cm', '28 cm', '3.5 cm'],
    correctAnswer: '7 cm',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_24',
    category: 'procedural_skills',
    question: 'Calculate the area of a rectangle with length 11 cm and width 4 cm.',
    options: ['30 cm²', '44 cm²', '15 cm²', '22 cm²'],
    correctAnswer: '44 cm²',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'ps_pre_25',
    category: 'procedural_skills',
    question: 'A triangle has sides of 7 cm, 8 cm, and 9 cm. What is its perimeter?',
    options: ['20 cm', '22 cm', '24 cm', '26 cm'],
    correctAnswer: '24 cm',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },

  // ========== POSTTEST QUESTIONS (25) ==========
  {
    id: 'ps_post_01',
    category: 'procedural_skills',
    question: 'Which of the following is the correct symbol for line MN?',
    options: ['M̅N̅', 'MN→', 'MN↔', 'Ray MN'],
    correctAnswer: 'MN↔',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_02',
    category: 'procedural_skills',
    question: 'To construct a parallel line through a given point, which tool combination is most appropriate?',
    options: ['Compass only', 'Ruler only', 'Compass and straightedge', 'Protractor only'],
    correctAnswer: 'Compass and straightedge',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_03',
    category: 'procedural_skills',
    question: 'You are asked to construct a 45° angle. What should you do first?',
    options: [
      'Draw an arc above the vertex',
      'Place the protractor at the vertex',
      'Mark 90° then bisect it',
      'Draw two rays randomly'
    ],
    correctAnswer: 'Place the protractor at the vertex',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_04',
    category: 'procedural_skills',
    question: 'What is the most appropriate tool to measure a 5 cm line segment?',
    options: ['Protractor', 'Compass', 'Meter stick', 'Ruler'],
    correctAnswer: 'Ruler',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_05',
    category: 'procedural_skills',
    question: 'Which of the following correctly represents ray CD?',
    options: ['C̅D̅', 'CD↔', 'CD→', 'D̅C̅'],
    correctAnswer: 'CD→',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_06',
    category: 'procedural_skills',
    question: 'What is the area of a rectangle with length 15 cm and width 4 cm?',
    options: ['30 cm²', '60 cm²', '45 cm²', '120 cm²'],
    correctAnswer: '60 cm²',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_07',
    category: 'procedural_skills',
    question: 'Find the area of a triangle with base 12 cm and height 8 cm.',
    options: ['48 cm²', '96 cm²', '36 cm²', '72 cm²'],
    correctAnswer: '48 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_08',
    category: 'procedural_skills',
    question: 'A circle has a diameter of 20 cm. What is its circumference? (π = 3.14)',
    options: ['31.4 cm', '62.8 cm', '94.2 cm', '120 cm'],
    correctAnswer: '62.8 cm',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_09',
    category: 'procedural_skills',
    question: 'A circle has a radius of 9 cm. What is its area? (π = 3.14)',
    options: ['254.34 cm²', '162 cm²', '254 cm²', '254.16 cm²'],
    correctAnswer: '254.34 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_10',
    category: 'procedural_skills',
    question: 'What is the sum of interior angles of an octagon?',
    options: ['900°', '1080°', '1260°', '1440°'],
    correctAnswer: '1080°',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_11',
    category: 'procedural_skills',
    question: 'When constructing a regular hexagon, how many congruent sides does it have?',
    options: ['5', '6', '7', '8'],
    correctAnswer: '6',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_12',
    category: 'procedural_skills',
    question: 'Find the surface area of a cube with side length 4 cm.',
    options: ['16 cm²', '64 cm²', '96 cm²', '384 cm²'],
    correctAnswer: '96 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_13',
    category: 'procedural_skills',
    question: 'Find the volume of a rectangular prism with L=7 cm, W=2 cm, H=5 cm.',
    options: ['35 cm³', '70 cm³', '50 cm³', '140 cm³'],
    correctAnswer: '70 cm³',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_14',
    category: 'procedural_skills',
    question: 'Find the volume of a cylinder with radius 3 cm, height 12 cm (π=3.14).',
    options: ['339.12 cm³', '452.16 cm³', '271.44 cm³', '108 cm³'],
    correctAnswer: '339.12 cm³',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_15',
    category: 'procedural_skills',
    question: 'Find the volume of a cone with radius 5 cm and height 10 cm (π=3.14).',
    options: ['104.67 cm³', '261.67 cm³', '523.33 cm³', '785.4 cm³'],
    correctAnswer: '261.67 cm³',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_16',
    category: 'procedural_skills',
    question: 'Find the area of a parallelogram with base 9 cm and height 7 cm.',
    options: ['16 cm²', '63 cm²', '81 cm²', '72 cm²'],
    correctAnswer: '63 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_17',
    category: 'procedural_skills',
    question: 'Which statement is TRUE about the perpendicular bisector of a segment?',
    options: [
      'It touches the segment at two points',
      'It divides the segment into equal halves',
      'It extends only to the right',
      'It forms a 60° angle'
    ],
    correctAnswer: 'It divides the segment into equal halves',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_18',
    category: 'procedural_skills',
    question: 'Which statement describes a secant line of a circle?',
    options: [
      'Touches circle at one point',
      'Passes through center',
      'Intersects circle at two points',
      'Lies outside the circle'
    ],
    correctAnswer: 'Intersects circle at two points',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_19',
    category: 'procedural_skills',
    question: 'An angle measures 150°. What type of angle is this?',
    options: ['Acute', 'Obtuse', 'Straight', 'Reflex'],
    correctAnswer: 'Obtuse',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_20',
    category: 'procedural_skills',
    question: 'Find the perimeter of a triangle with sides 11 cm, 13 cm, and 15 cm.',
    options: ['29 cm', '30 cm', '39 cm', '41 cm'],
    correctAnswer: '39 cm',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_21',
    category: 'procedural_skills',
    question: 'Calculate the perimeter of a pentagon with all sides measuring 8 cm.',
    options: ['32 cm', '40 cm', '48 cm', '56 cm'],
    correctAnswer: '40 cm',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_22',
    category: 'procedural_skills',
    question: 'Find the area of a trapezoid with bases 6 cm and 10 cm, and height 5 cm.',
    options: ['30 cm²', '40 cm²', '50 cm²', '80 cm²'],
    correctAnswer: '40 cm²',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_23',
    category: 'procedural_skills',
    question: 'If a circle has radius 10 cm, what is its diameter?',
    options: ['5 cm', '10 cm', '20 cm', '30 cm'],
    correctAnswer: '20 cm',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_24',
    category: 'procedural_skills',
    question: 'Calculate the volume of a cube with side 5 cm.',
    options: ['25 cm³', '75 cm³', '100 cm³', '125 cm³'],
    correctAnswer: '125 cm³',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'ps_post_25',
    category: 'procedural_skills',
    question: 'Find the perimeter of a regular hexagon with side length 7 cm.',
    options: ['35 cm', '42 cm', '49 cm', '56 cm'],
    correctAnswer: '42 cm',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  }
];

module.exports = { proceduralSkillsQuestions };
