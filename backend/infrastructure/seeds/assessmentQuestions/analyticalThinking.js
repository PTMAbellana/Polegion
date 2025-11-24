// ============================================================================
// ASSESSMENT QUESTION POOL - ANALYTICAL THINKING CATEGORY
// 40 Questions Total (20 Pretest + 20 Posttest)
// ============================================================================

const analyticalThinkingQuestions = [
  // ========== PRETEST QUESTIONS (20) ==========
  {
    id: 'at_pre_01',
    category: 'analytical_thinking',
    question: 'Which statement best explains why two acute angles cannot form a straight line?',
    options: [
      'Their sum is always 90°.',
      'Their sum is less than 180°.',
      'They measure more than 90°.',
      'They are always congruent.'
    ],
    correctAnswer: 'Their sum is less than 180°.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_02',
    category: 'analytical_thinking',
    question: 'If two lines are perpendicular, what can you conclude about the angles they form?',
    options: [
      'They form two acute angles.',
      'They form complementary angles.',
      'They form four 90° angles.',
      'They never intersect.'
    ],
    correctAnswer: 'They form four 90° angles.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_03',
    category: 'analytical_thinking',
    question: 'Which of the following sets shows parallel lines?',
    options: [
      'Lines that meet at one point',
      'Lines that lie on different planes',
      'Lines that are always the same distance apart',
      'Lines that intersect at right angles'
    ],
    correctAnswer: 'Lines that are always the same distance apart',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_04',
    category: 'analytical_thinking',
    question: 'Which pair of angles is always supplementary?',
    options: [
      'Adjacent acute angles',
      'Vertical angles',
      'Angles forming a linear pair',
      'Corresponding angles'
    ],
    correctAnswer: 'Angles forming a linear pair',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_05',
    category: 'analytical_thinking',
    question: 'If two angles are congruent, what is true?',
    options: [
      'They have the same shape.',
      'They have the same measure.',
      'They form a straight angle.',
      'They add up to 90°.'
    ],
    correctAnswer: 'They have the same measure.',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_06',
    category: 'analytical_thinking',
    question: 'A chord is drawn inside a circle. Which statement is TRUE?',
    options: [
      'It always passes through the center.',
      'It is always the longest segment in the circle.',
      'It connects two points on the circle.',
      'It is equal to the radius.'
    ],
    correctAnswer: 'It connects two points on the circle.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_07',
    category: 'analytical_thinking',
    question: 'Which statement about a regular pentagon is TRUE?',
    options: [
      'All angles are congruent.',
      'All sides are different.',
      'It has two pairs of parallel sides.',
      'It has 3 equal angles.'
    ],
    correctAnswer: 'All angles are congruent.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_08',
    category: 'analytical_thinking',
    question: 'Which of the following shapes ALWAYS has four right angles?',
    options: ['Parallelogram', 'Kite', 'Square', 'Trapezoid'],
    correctAnswer: 'Square',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_09',
    category: 'analytical_thinking',
    question: 'A triangle has sides 8 cm, 15 cm, and 17 cm. Which statement is TRUE?',
    options: [
      'It is a right triangle.',
      'It is an acute triangle.',
      'It is an equilateral triangle.',
      'It is impossible to form a triangle.'
    ],
    correctAnswer: 'It is a right triangle.',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_10',
    category: 'analytical_thinking',
    question: 'Which figure CANNOT tessellate a plane?',
    options: ['Square', 'Triangle', 'Regular hexagon', 'Regular pentagon'],
    correctAnswer: 'Regular pentagon',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_11',
    category: 'analytical_thinking',
    question: 'Which angle pair is formed when two parallel lines are cut by a transversal?',
    options: [
      'Adjacent angles',
      'Vertical angles',
      'Corresponding angles',
      'Reflex angles'
    ],
    correctAnswer: 'Corresponding angles',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_12',
    category: 'analytical_thinking',
    question: 'Which statement BEST describes a trapezoid?',
    options: [
      'All sides are equal.',
      'It has exactly one pair of parallel sides.',
      'It has two pairs of equal sides.',
      'All angles are right angles.'
    ],
    correctAnswer: 'It has exactly one pair of parallel sides.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_13',
    category: 'analytical_thinking',
    question: 'A prism and a pyramid have the same base. Which is TRUE?',
    options: [
      'They have the same volume formula.',
      'A prism has slant height; a pyramid does not.',
      'A pyramid has only one base.',
      'They have the same number of faces.'
    ],
    correctAnswer: 'A pyramid has only one base.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_14',
    category: 'analytical_thinking',
    question: 'What can be concluded about the radii of the same circle?',
    options: [
      'They are always congruent.',
      'They form acute angles.',
      'They are longer than the diameter.',
      'They form a straight line.'
    ],
    correctAnswer: 'They are always congruent.',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_15',
    category: 'analytical_thinking',
    question: 'Which figure has NO right angles?',
    options: ['Rectangle', 'Square', 'Parallelogram', 'Right triangle'],
    correctAnswer: 'Parallelogram',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_16',
    category: 'analytical_thinking',
    question: 'Two triangles have all three corresponding sides equal. Which is TRUE?',
    options: [
      'They are similar only',
      'They are congruent',
      'They are isosceles',
      'They must be scalene'
    ],
    correctAnswer: 'They are congruent',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_17',
    category: 'analytical_thinking',
    question: 'Which 3D figure has exactly one curved surface and two circular bases?',
    options: ['Cone', 'Sphere', 'Cylinder', 'Pyramid'],
    correctAnswer: 'Cylinder',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_18',
    category: 'analytical_thinking',
    question: 'Which statement distinguishes volume from surface area?',
    options: [
      'Volume measures space inside; surface area measures covering outside.',
      'Volume measures length; surface area measures width.',
      'Volume measures edges; surface area measures vertices.',
      'They measure the same thing.'
    ],
    correctAnswer: 'Volume measures space inside; surface area measures covering outside.',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_19',
    category: 'analytical_thinking',
    question: 'A student says: "A square is a rectangle." Is the statement correct?',
    options: [
      'No, because squares have equal sides.',
      'No, because rectangles are not quadrilaterals.',
      'Yes, because a square has 4 right angles like a rectangle.',
      'Yes, because a square is a rhombus.'
    ],
    correctAnswer: 'Yes, because a square has 4 right angles like a rectangle.',
    difficulty: 'hard',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'at_pre_20',
    category: 'analytical_thinking',
    question: 'All equilateral triangles are _______.',
    options: ['Obtuse', 'Acute', 'Right', 'Straight'],
    correctAnswer: 'Acute',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },

  // ========== POSTTEST QUESTIONS (20) ==========
  {
    id: 'at_post_01',
    category: 'analytical_thinking',
    question: 'Why can\'t two obtuse angles be supplementary?',
    options: [
      'They are both greater than 90°.',
      'They are both less than 45°.',
      'They are equal in measure.',
      'They form vertical angles.'
    ],
    correctAnswer: 'They are both greater than 90°.',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_02',
    category: 'analytical_thinking',
    question: 'If two lines are parallel, what can you conclude when a transversal crosses them?',
    options: [
      'Only acute angles are formed.',
      'All corresponding angles are congruent.',
      'Vertical angles disappear.',
      'Adjacent angles become equal.'
    ],
    correctAnswer: 'All corresponding angles are congruent.',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_03',
    category: 'analytical_thinking',
    question: 'Which of the following shows perpendicular lines?',
    options: [
      'Lines that intersect to form 90° angles',
      'Lines that never meet',
      'Lines that form a linear pair',
      'Lines in different planes'
    ],
    correctAnswer: 'Lines that intersect to form 90° angles',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_04',
    category: 'analytical_thinking',
    question: 'Which angles are ALWAYS congruent?',
    options: [
      'Adjacent angles',
      'Vertical angles',
      'Linear pairs',
      'Alternate interior angles'
    ],
    correctAnswer: 'Vertical angles',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_05',
    category: 'analytical_thinking',
    question: 'Two angles add up to 90°. These angles are called:',
    options: ['Supplementary', 'Vertical', 'Adjacent', 'Complementary'],
    correctAnswer: 'Complementary',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_06',
    category: 'analytical_thinking',
    question: 'A radius is drawn from the center of a circle. What can be concluded?',
    options: [
      'It is always the longest segment',
      'It is half the diameter',
      'It must form a 45° angle',
      'It crosses the circle twice'
    ],
    correctAnswer: 'It is half the diameter',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_07',
    category: 'analytical_thinking',
    question: 'Which property is TRUE for a regular hexagon?',
    options: [
      'Opposite sides are perpendicular',
      'All sides and all angles are equal',
      'It has only one line of symmetry',
      'It has 8 vertices'
    ],
    correctAnswer: 'All sides and all angles are equal',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_08',
    category: 'analytical_thinking',
    question: 'Which shape ALWAYS has opposite sides parallel?',
    options: ['Trapezoid', 'Kite', 'Parallelogram', 'Pentagon'],
    correctAnswer: 'Parallelogram',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_09',
    category: 'analytical_thinking',
    question: 'Triangle sides: 7 cm, 24 cm, 25 cm. What can be concluded?',
    options: [
      'Not a triangle',
      'Acute triangle',
      'Right triangle',
      'Scalene but not right'
    ],
    correctAnswer: 'Right triangle',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_10',
    category: 'analytical_thinking',
    question: 'Which figure CAN tessellate the plane?',
    options: ['Regular octagon', 'Regular pentagon', 'Regular triangle', 'Circle'],
    correctAnswer: 'Regular triangle',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_11',
    category: 'analytical_thinking',
    question: 'When two parallel lines are cut by a transversal, which angle pair is equal?',
    options: [
      'Consecutive interior',
      'Vertical only',
      'Corresponding',
      'Adjacent'
    ],
    correctAnswer: 'Corresponding',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_12',
    category: 'analytical_thinking',
    question: 'Which BEST describes a rhombus?',
    options: [
      'All angles equal',
      'One pair of parallel sides',
      'Four equal sides',
      'Two right angles'
    ],
    correctAnswer: 'Four equal sides',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_13',
    category: 'analytical_thinking',
    question: 'Comparing a cylinder and a cone with the same base and height:',
    options: [
      'Cylinder has half the volume of the cone',
      'Cone has one-third the volume of the cylinder',
      'Their volumes are always equal',
      'Cone has greater surface area'
    ],
    correctAnswer: 'Cone has one-third the volume of the cylinder',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_14',
    category: 'analytical_thinking',
    question: 'All diameters of the same circle are ________.',
    options: ['Parallel', 'Congruent', 'Perpendicular', 'Different lengths'],
    correctAnswer: 'Congruent',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_15',
    category: 'analytical_thinking',
    question: 'Which figure sometimes has right angles but not always?',
    options: ['Square', 'Rectangle', 'Parallelogram', 'Cube'],
    correctAnswer: 'Parallelogram',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_16',
    category: 'analytical_thinking',
    question: 'Two triangles are similar if:',
    options: [
      'All sides are equal',
      'All corresponding angles are equal',
      'They have the same perimeter',
      'They are the same size'
    ],
    correctAnswer: 'All corresponding angles are equal',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_17',
    category: 'analytical_thinking',
    question: 'Which solid has only one vertex?',
    options: ['Cube', 'Cylinder', 'Pyramid', 'Cone'],
    correctAnswer: 'Cone',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_18',
    category: 'analytical_thinking',
    question: 'Which statement is TRUE about surface area?',
    options: [
      'It measures the space inside a solid.',
      'It measures the boundary of a 2D shape.',
      'It measures the total area covering a solid.',
      'It is measured in cubic units.'
    ],
    correctAnswer: 'It measures the total area covering a solid.',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_19',
    category: 'analytical_thinking',
    question: 'A rectangle is a parallelogram. Why?',
    options: [
      'All its sides are equal',
      'It has one pair of parallel sides',
      'It has two pairs of parallel sides',
      'All angles are obtuse'
    ],
    correctAnswer: 'It has two pairs of parallel sides',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'at_post_20',
    category: 'analytical_thinking',
    question: 'All isosceles triangles have ______.',
    options: [
      'Two equal sides',
      'All equal angles',
      'One right angle',
      'A reflex angle'
    ],
    correctAnswer: 'Two equal sides',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  }
];

module.exports = { analyticalThinkingQuestions };
