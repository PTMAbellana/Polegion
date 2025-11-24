// ============================================================================
// ASSESSMENT QUESTION POOL - CONCEPT UNDERSTANDING CATEGORY
// 40 Questions Total (20 Pretest + 20 Posttest)
// ============================================================================

const conceptUnderstandingQuestions = [
  // ========== PRETEST QUESTIONS (20) ==========
  {
    id: 'cu_pre_01',
    category: 'concept_understanding',
    question: 'Which best describes parallel lines?',
    options: [
      'Lines that meet at a right angle',
      'Lines that meet at one point',
      'Lines that lie in the same plane and never meet',
      'Lines that are in different planes'
    ],
    correctAnswer: 'Lines that lie in the same plane and never meet',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_02',
    category: 'concept_understanding',
    question: 'What makes perpendicular lines different from intersecting lines?',
    options: [
      'They do not meet',
      'They meet but form a 90° angle',
      'They are in different planes',
      'They form an obtuse angle'
    ],
    correctAnswer: 'They meet but form a 90° angle',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_03',
    category: 'concept_understanding',
    question: 'What is true about skew lines?',
    options: [
      'They are parallel',
      'They lie in the same plane',
      'They intersect at one point',
      'They never meet and are in different planes'
    ],
    correctAnswer: 'They never meet and are in different planes',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_04',
    category: 'concept_understanding',
    question: 'Which angle is greater than 90° but less than 180°?',
    options: ['Acute', 'Right', 'Obtuse', 'Straight'],
    correctAnswer: 'Obtuse',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_05',
    category: 'concept_understanding',
    question: 'A straight angle measures—',
    options: ['45°', '90°', '180°', '360°'],
    correctAnswer: '180°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_06',
    category: 'concept_understanding',
    question: 'Complementary angles have measures that add up to—',
    options: ['90°', '180°', '270°', '360°'],
    correctAnswer: '90°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_07',
    category: 'concept_understanding',
    question: 'Supplementary angles add up to—',
    options: ['60°', '90°', '120°', '180°'],
    correctAnswer: '180°',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_08',
    category: 'concept_understanding',
    question: 'Which describes a radius?',
    options: [
      'A line from one point on the circle to another',
      'A line segment from center to a point on the circle',
      'A line passing through the circle',
      'A curve around the circle'
    ],
    correctAnswer: 'A line segment from center to a point on the circle',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_09',
    category: 'concept_understanding',
    question: 'A diameter is—',
    options: [
      'Twice the radius',
      'Half the radius',
      'Same as radius',
      'Larger than circumference'
    ],
    correctAnswer: 'Twice the radius',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_10',
    category: 'concept_understanding',
    question: 'What makes a regular polygon "regular"?',
    options: [
      'It has all right angles',
      'All sides and angles are equal',
      'It has curved sides',
      'It has at least six sides'
    ],
    correctAnswer: 'All sides and angles are equal',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_11',
    category: 'concept_understanding',
    question: 'Which is NOT a property of a triangle?',
    options: [
      'Has three sides',
      'Has three vertices',
      'Has interior angle sum of 180°',
      'Has four angles'
    ],
    correctAnswer: 'Has four angles',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_12',
    category: 'concept_understanding',
    question: 'A quadrilateral has—',
    options: ['2 sides', '3 sides', '4 sides', '5 sides'],
    correctAnswer: '4 sides',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_13',
    category: 'concept_understanding',
    question: 'A cone is different from a cylinder because a cone has—',
    options: [
      'Two circular bases',
      'A curved surface',
      'One circular base and a vertex',
      'No base'
    ],
    correctAnswer: 'One circular base and a vertex',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_14',
    category: 'concept_understanding',
    question: 'A prism is identified by its—',
    options: ['Sides', 'Base shape', 'Height', 'Surface area'],
    correctAnswer: 'Base shape',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_15',
    category: 'concept_understanding',
    question: 'A sphere is unique because—',
    options: [
      'It has edges',
      'It has vertices',
      'All points are equidistant from the center',
      'It has flat surfaces'
    ],
    correctAnswer: 'All points are equidistant from the center',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_16',
    category: 'concept_understanding',
    question: 'What do we call a triangle with all angles less than 90°?',
    options: ['Right', 'Scalene', 'Acute', 'Obtuse'],
    correctAnswer: 'Acute',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_17',
    category: 'concept_understanding',
    question: 'A polygon is a figure made of—',
    options: ['Curved lines', 'Straight segments', 'Rays', 'Arcs'],
    correctAnswer: 'Straight segments',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_18',
    category: 'concept_understanding',
    question: 'Which set of angles forms a linear pair?',
    options: [
      'They add up to 90°',
      'They are opposite angles',
      'They are adjacent and sum to 180°',
      'They are acute'
    ],
    correctAnswer: 'They are adjacent and sum to 180°',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_19',
    category: 'concept_understanding',
    question: 'Vertical angles are—',
    options: [
      'Adjacent',
      'Formed by parallel lines',
      'Equal in measure',
      'Always acute'
    ],
    correctAnswer: 'Equal in measure',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'cu_pre_20',
    category: 'concept_understanding',
    question: 'Which describes a plane?',
    options: [
      'Has one endpoint',
      'Curved surface',
      'A flat surface extending forever',
      'A solid figure'
    ],
    correctAnswer: 'A flat surface extending forever',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },

  // ========== POSTTEST QUESTIONS (20) ==========
  {
    id: 'cu_post_01',
    category: 'concept_understanding',
    question: 'If two lines are perpendicular, which is always true?',
    options: [
      'They never meet',
      'They form four 90° angles',
      'They form parallel lines',
      'They lie in different planes'
    ],
    correctAnswer: 'They form four 90° angles',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_02',
    category: 'concept_understanding',
    question: 'If ∠A and ∠B are complementary, which must be true?',
    options: [
      'Both angles are obtuse',
      'One angle is straight',
      'Their sum is 90°',
      'They are vertical angles'
    ],
    correctAnswer: 'Their sum is 90°',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_03',
    category: 'concept_understanding',
    question: 'If an angle measures 120°, it is—',
    options: ['Acute', 'Right', 'Obtuse', 'Straight'],
    correctAnswer: 'Obtuse',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_04',
    category: 'concept_understanding',
    question: 'A radius is always—',
    options: [
      'Half of the diameter',
      'Equal to the circumference',
      'Longer than the diameter',
      'Longer than the chord'
    ],
    correctAnswer: 'Half of the diameter',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_05',
    category: 'concept_understanding',
    question: 'Two polygons are congruent if—',
    options: [
      'They have the same number of sides only',
      'They have equal corresponding sides and angles',
      'One is rotated',
      'They have curved boundaries'
    ],
    correctAnswer: 'They have equal corresponding sides and angles',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_06',
    category: 'concept_understanding',
    question: 'Which best describes a tangent to a circle?',
    options: [
      'Passes through two points of the circle',
      'Passes through the center',
      'Touches the circle at exactly one point',
      'Lies entirely inside the circle'
    ],
    correctAnswer: 'Touches the circle at exactly one point',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_07',
    category: 'concept_understanding',
    question: 'The sum of interior angles of a pentagon is—',
    options: ['360°', '540°', '720°', '900°'],
    correctAnswer: '540°',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_08',
    category: 'concept_understanding',
    question: 'A right triangle must have—',
    options: [
      'One 90° angle',
      'One obtuse angle',
      'All angles equal',
      'No equal angles'
    ],
    correctAnswer: 'One 90° angle',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_09',
    category: 'concept_understanding',
    question: 'Opposite angles formed by intersecting lines are called—',
    options: [
      'Adjacent angles',
      'Complementary angles',
      'Vertical angles',
      'Linear pairs'
    ],
    correctAnswer: 'Vertical angles',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_10',
    category: 'concept_understanding',
    question: 'A regular hexagon has—',
    options: [
      '3 congruent sides',
      '4 congruent sides',
      '5 congruent sides',
      '6 congruent sides'
    ],
    correctAnswer: '6 congruent sides',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_11',
    category: 'concept_understanding',
    question: 'A cylinder has—',
    options: [
      'One base',
      'Two circular congruent bases',
      'Four faces',
      'No curved surface'
    ],
    correctAnswer: 'Two circular congruent bases',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_12',
    category: 'concept_understanding',
    question: 'A pyramid is different from a prism because—',
    options: [
      'A pyramid has only one base',
      'A pyramid has parallel bases',
      'A pyramid has no vertices',
      'A pyramid is 2D'
    ],
    correctAnswer: 'A pyramid has only one base',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_13',
    category: 'concept_understanding',
    question: 'A square is always a—',
    options: ['Rhombus', 'Rectangle', 'Parallelogram', 'All of the above'],
    correctAnswer: 'All of the above',
    difficulty: 'hard',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_14',
    category: 'concept_understanding',
    question: 'The point where all radii of a circle meet is called—',
    options: ['Chord', 'Center', 'Diameter', 'Tangent'],
    correctAnswer: 'Center',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_15',
    category: 'concept_understanding',
    question: 'When two angles form a straight line, they are—',
    options: ['Complementary', 'Vertical', 'Adjacent angles', 'Linear pair'],
    correctAnswer: 'Linear pair',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_16',
    category: 'concept_understanding',
    question: 'If two angles share a common arm, they are—',
    options: ['Vertical', 'Adjacent', 'Complementary', 'Straight'],
    correctAnswer: 'Adjacent',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_17',
    category: 'concept_understanding',
    question: 'A triangle with exactly two equal sides is—',
    options: ['Scalene', 'Isosceles', 'Equilateral', 'Right'],
    correctAnswer: 'Isosceles',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_18',
    category: 'concept_understanding',
    question: 'A three-dimensional object with a circular base and no edges is—',
    options: ['Cone', 'Sphere', 'Cylinder', 'Prism'],
    correctAnswer: 'Sphere',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_19',
    category: 'concept_understanding',
    question: 'A quadrilateral with only one pair of parallel sides is—',
    options: ['Square', 'Trapezoid', 'Rectangle', 'Rhombus'],
    correctAnswer: 'Trapezoid',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'cu_post_20',
    category: 'concept_understanding',
    question: 'The boundary of a circle is called—',
    options: ['Radius', 'Chord', 'Circumference', 'Arc'],
    correctAnswer: 'Circumference',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  }
];

module.exports = { conceptUnderstandingQuestions };
