// ============================================================================
// ASSESSMENT QUESTION POOL - HIGHER-ORDER/CREATIVE THINKING CATEGORY
// 40 Questions Total (20 Pretest + 20 Posttest)
// ============================================================================

const higherOrderThinkingQuestions = [
  // ========== PRETEST QUESTIONS (20) ==========
  {
    id: 'hot_pre_01',
    category: 'higher_order_thinking',
    question: 'If you double the radius of a circle, how does its area change?',
    options: [
      'Twice as large',
      'Three times as large',
      'Four times as large',
      'Eight times as large'
    ],
    correctAnswer: 'Four times as large',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_02',
    category: 'higher_order_thinking',
    question: 'Which diagram best represents perpendicular lines?',
    options: [
      'Two lines forming an acute angle',
      'Two lines crossing at 90°',
      'Two lines that never meet',
      'Two lines crossing at 45°'
    ],
    correctAnswer: 'Two lines crossing at 90°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_03',
    category: 'higher_order_thinking',
    question: 'A cube and a rectangular prism have the same volume. Which statement is MOST likely true?',
    options: [
      'They must have equal lengths of sides',
      'Their shapes are always identical',
      'The cube has shorter edges but more height',
      'They can have different dimensions but same volume'
    ],
    correctAnswer: 'They can have different dimensions but same volume',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_04',
    category: 'higher_order_thinking',
    question: 'A student claims a triangle with sides 4, 5, 10 is possible. Evaluate.',
    options: [
      'Correctany three numbers make a triangle',
      'Incorrectviolates triangle inequality',
      'Correct10 is the longest side',
      'Correct4 + 5 > 10'
    ],
    correctAnswer: 'Incorrectviolates triangle inequality',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_05',
    category: 'higher_order_thinking',
    question: 'A circular table has radius r. If you increase its radius by 20%, what happens to its area?',
    options: [
      'It stays the same',
      'It increases by 20%',
      'It increases by more than 20%',
      'It decreases'
    ],
    correctAnswer: 'It increases by more than 20%',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_06',
    category: 'higher_order_thinking',
    question: 'Which shape would lose the MOST area if its height is reduced?',
    options: ['Square', 'Rectangle', 'Triangle', 'Parallelogram'],
    correctAnswer: 'Triangle',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_07',
    category: 'higher_order_thinking',
    question: 'A builder needs the strongest support, so he chooses two beams forming a right angle. Why?',
    options: [
      'Right angles create symmetry',
      'Right angles distribute weight evenly',
      'Right angles look better',
      'Right angles are the easiest to construct'
    ],
    correctAnswer: 'Right angles distribute weight evenly',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_08',
    category: 'higher_order_thinking',
    question: 'What happens to total surface area if all edge lengths of a cube are tripled?',
    options: ['×3', '×6', '×9', '×27'],
    correctAnswer: '×9',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_09',
    category: 'higher_order_thinking',
    question: 'Which figure CANNOT be the cross-section of a cube?',
    options: ['Triangle', 'Square', 'Pentagon', 'Rectangle'],
    correctAnswer: 'Pentagon',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_10',
    category: 'higher_order_thinking',
    question: 'If two angles are supplementary and one is increased, then the other must…',
    options: [
      'Also increase',
      'Stay the same',
      'Decrease',
      'Become complementary'
    ],
    correctAnswer: 'Decrease',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_11',
    category: 'higher_order_thinking',
    question: 'A solid has 6 rectangular faces. What shape is it?',
    options: ['Cube', 'Cylinder', 'Rectangular prism', 'Hexagonal prism'],
    correctAnswer: 'Rectangular prism',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_12',
    category: 'higher_order_thinking',
    question: 'Which situation requires using the Pythagorean Theorem?',
    options: [
      'Finding area of a garden',
      'Finding distance across a diagonal lot',
      'Finding perimeter of a square',
      'Finding radius from area'
    ],
    correctAnswer: 'Finding distance across a diagonal lot',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_13',
    category: 'higher_order_thinking',
    question: 'A student claims all parallelograms are rectangles. Evaluate.',
    options: ['True', 'False', 'True for some', 'True for squares only'],
    correctAnswer: 'False',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_14',
    category: 'higher_order_thinking',
    question: 'Doubling both height and base of a triangle makes its area…',
    options: ['Twice', 'Four times', 'Half', 'Same'],
    correctAnswer: 'Four times',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_15',
    category: 'higher_order_thinking',
    question: 'A shape has 1 curved surface and 2 circular bases. Identify it.',
    options: ['Cone', 'Cylinder', 'Sphere', 'Prism'],
    correctAnswer: 'Cylinder',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_16',
    category: 'higher_order_thinking',
    question: 'A student draws a 3D shape but all edges appear the same length. What is likely the shape?',
    options: ['Cylinder', 'Cube', 'Rectangular prism', 'Pyramid'],
    correctAnswer: 'Cube',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_17',
    category: 'higher_order_thinking',
    question: 'If the sum of two angles increases, what happens to each angle?',
    options: [
      'They both increase',
      'Both decrease',
      'One increases, one decreases',
      'Not enough information'
    ],
    correctAnswer: 'Not enough information',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_18',
    category: 'higher_order_thinking',
    question: 'A pentagon is regular. Which statement is ALWAYS true?',
    options: [
      'All sides equal',
      'All angles equal',
      'Both A and B',
      'Neither'
    ],
    correctAnswer: 'Both A and B',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_19',
    category: 'higher_order_thinking',
    question: 'Which change creates the BIGGEST increase in circle circumference?',
    options: [
      'Increase radius by 1 cm',
      'Increase diameter by 1 cm',
      'Increase radius by 2 cm',
      'Increase radius by 0.5 cm'
    ],
    correctAnswer: 'Increase radius by 2 cm',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'hot_pre_20',
    category: 'higher_order_thinking',
    question: 'Two figures are similar. Which is ALWAYS true?',
    options: ['Same area', 'Same shape', 'Same size', 'Same perimeter'],
    correctAnswer: 'Same shape',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },

  // ========== POSTTEST QUESTIONS (20) ==========
  {
    id: 'hot_post_01',
    category: 'higher_order_thinking',
    question: 'A cube\'s volume is increased by 800%. How must the edge length change?',
    options: ['×2', '×3', '×4', '×8'],
    correctAnswer: '×3',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_02',
    category: 'higher_order_thinking',
    question: 'Which transformation changes the SIZE of a figure?',
    options: ['Translation', 'Rotation', 'Reflection', 'Dilation'],
    correctAnswer: 'Dilation',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_03',
    category: 'higher_order_thinking',
    question: 'A designer doubles the radius of a cylinder but keeps height the same. What happens to volume?',
    options: ['Doubles', 'Triples', 'Quadruples', 'Decreases'],
    correctAnswer: 'Quadruples',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_04',
    category: 'higher_order_thinking',
    question: 'What shape has the GREATEST area for a fixed perimeter?',
    options: ['Square', 'Rectangle', 'Circle', 'Triangle'],
    correctAnswer: 'Circle',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_05',
    category: 'higher_order_thinking',
    question: 'Two triangles have equal areas but different heights. How is this possible?',
    options: [
      'Their bases adjust to compensate',
      'Impossible',
      'Their shapes are identical',
      'Their perimeters must be equal'
    ],
    correctAnswer: 'Their bases adjust to compensate',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_06',
    category: 'higher_order_thinking',
    question: 'A shape has 5 faces, 9 edges, 6 vertices. What is it?',
    options: [
      'Rectangular prism',
      'Triangular pyramid',
      'Square pyramid',
      'Triangular prism'
    ],
    correctAnswer: 'Triangular prism',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_07',
    category: 'higher_order_thinking',
    question: 'A solid\'s surface area increases. Which MUST be true?',
    options: [
      'Volume increases',
      'Volume decreases',
      'At least one dimension increased',
      'All dimensions increased'
    ],
    correctAnswer: 'At least one dimension increased',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_08',
    category: 'higher_order_thinking',
    question: 'A car turns 90° at an intersection. What type of angle does it make?',
    options: ['Acute', 'Obtuse', 'Right', 'Reflex'],
    correctAnswer: 'Right',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_09',
    category: 'higher_order_thinking',
    question: 'A student says: "A trapezoid with equal legs is a parallelogram." Evaluate.',
    options: [
      'Always true',
      'Sometimes true',
      'Never true',
      'True only if it\'s a square'
    ],
    correctAnswer: 'Never true',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_10',
    category: 'higher_order_thinking',
    question: 'What can you say about two triangles with all angles equal but sides not equal?',
    options: ['Congruent', 'Similar', 'Identical', 'Impossible'],
    correctAnswer: 'Similar',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_11',
    category: 'higher_order_thinking',
    question: 'Which change creates the GREATEST increase in volume?',
    options: [
      'Doubling radius of a sphere',
      'Doubling height only',
      'Doubling width only',
      'Doubling length only'
    ],
    correctAnswer: 'Doubling radius of a sphere',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_12',
    category: 'higher_order_thinking',
    question: 'A student folds a paper circle in half. What new figure is formed?',
    options: ['Sector', 'Semicircle', 'Chord', 'Diameter'],
    correctAnswer: 'Semicircle',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_13',
    category: 'higher_order_thinking',
    question: 'Which statement is ALWAYS true about congruent polygons?',
    options: [
      'Same shape',
      'Same area',
      'Same perimeter',
      'All of the above'
    ],
    correctAnswer: 'All of the above',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_14',
    category: 'higher_order_thinking',
    question: 'A city wants to maximize park area using 100 m of fencing. What shape should they build?',
    options: ['Square', 'Rectangle', 'Circle', 'Triangle'],
    correctAnswer: 'Circle',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_15',
    category: 'higher_order_thinking',
    question: 'A building\'s shadow and a stick\'s shadow are used to find height of the building. What principle is used?',
    options: [
      'Congruent triangles',
      'Vertical angles',
      'Similar triangles',
      'Complementary angles'
    ],
    correctAnswer: 'Similar triangles',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_16',
    category: 'higher_order_thinking',
    question: 'A cube and sphere have equal volume. Which has greater surface area?',
    options: ['Cube', 'Sphere', 'Both equal', 'Not enough info'],
    correctAnswer: 'Cube',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_17',
    category: 'higher_order_thinking',
    question: 'Two triangles have equal height but one has twice the base. What happens to area?',
    options: ['Half', 'Same', 'Double', 'Triple'],
    correctAnswer: 'Double',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_18',
    category: 'higher_order_thinking',
    question: 'A radius is increased by 10%. By how much does area increase (approx.)?',
    options: ['10%', '20%', '21%', '40%'],
    correctAnswer: '21%',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_19',
    category: 'higher_order_thinking',
    question: 'Which of these is the BEST reason why circles minimize fencing material?',
    options: [
      'They are round',
      'They have constant radius',
      'They have max area for fixed perimeter',
      'They look nice'
    ],
    correctAnswer: 'They have max area for fixed perimeter',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'hot_post_20',
    category: 'higher_order_thinking',
    question: 'Which is the MOST efficient cross-section to cut a cylinder into equal parts?',
    options: ['Horizontal', 'Vertical', 'Diagonal', 'Any'],
    correctAnswer: 'Horizontal',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  }
];

module.exports = { higherOrderThinkingQuestions };
