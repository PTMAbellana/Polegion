// ============================================================================
// ASSESSMENT QUESTION POOL - KNOWLEDGE RECALL CATEGORY
// 40 Questions Total (20 Pretest + 20 Posttest)
// ============================================================================

const knowledgeRecallQuestions = [
  // ========== PRETEST QUESTIONS (20) ==========
  {
    id: 'kr_pre_01',
    category: 'knowledge_recall',
    question: 'Which of the following is a location with no size?',
    options: ['Line', 'Point', 'Ray', 'Plane'],
    correctAnswer: 'Point',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_02',
    category: 'knowledge_recall',
    question: 'A straight path that extends infinitely in both directions is called a',
    options: ['Line', 'Line Segment', 'Ray', 'Angle'],
    correctAnswer: 'Line',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_03',
    category: 'knowledge_recall',
    question: 'A part of a line with two endpoints is called',
    options: ['Ray', 'Line', 'Line Segment', 'Plane'],
    correctAnswer: 'Line Segment',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_04',
    category: 'knowledge_recall',
    question: 'Two lines that never meet are called',
    options: ['Intersecting lines', 'Perpendicular lines', 'Parallel lines', 'Skew lines'],
    correctAnswer: 'Parallel lines',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_05',
    category: 'knowledge_recall',
    question: 'Lines that meet or cross at one point are called',
    options: ['Parallel', 'Intersecting', 'Perpendicular', 'Skew'],
    correctAnswer: 'Intersecting',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_06',
    category: 'knowledge_recall',
    question: 'Lines that intersect to form a right angle are',
    options: ['Parallel', 'Skew', 'Intersecting', 'Perpendicular'],
    correctAnswer: 'Perpendicular',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_07',
    category: 'knowledge_recall',
    question: 'Lines that are not coplanar and do not meet are',
    options: ['Parallel', 'Skew', 'Perpendicular', 'Coplanar'],
    correctAnswer: 'Skew',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_08',
    category: 'knowledge_recall',
    question: 'A figure formed by two rays with a common endpoint is',
    options: ['Segment', 'Ray', 'Angle', 'Line'],
    correctAnswer: 'Angle',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_09',
    category: 'knowledge_recall',
    question: 'The common endpoint of an angle is called the',
    options: ['Vertex', 'Arm', 'Side', 'Endpoint'],
    correctAnswer: 'Vertex',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_10',
    category: 'knowledge_recall',
    question: 'A triangle has how many sides?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '3',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_11',
    category: 'knowledge_recall',
    question: 'A polygon with four sides is called',
    options: ['Triangle', 'Quadrilateral', 'Pentagon', 'Hexagon'],
    correctAnswer: 'Quadrilateral',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_12',
    category: 'knowledge_recall',
    question: 'A circle is named using its',
    options: ['Center', 'Radius', 'Diameter', 'Chord'],
    correctAnswer: 'Center',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_13',
    category: 'knowledge_recall',
    question: 'The distance from the center of a circle to any point on the circle is',
    options: ['Radius', 'Diameter', 'Chord', 'Arc'],
    correctAnswer: 'Radius',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_14',
    category: 'knowledge_recall',
    question: 'The longest chord in a circle is the',
    options: ['Radius', 'Diameter', 'Tangent', 'Secant'],
    correctAnswer: 'Diameter',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_15',
    category: 'knowledge_recall',
    question: 'A flat surface that extends infinitely is a',
    options: ['Point', 'Line', 'Plane', 'Solid'],
    correctAnswer: 'Plane',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_16',
    category: 'knowledge_recall',
    question: 'A 3D figure with a circular base and one vertex is a',
    options: ['Cylinder', 'Sphere', 'Cone', 'Prism'],
    correctAnswer: 'Cone',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_17',
    category: 'knowledge_recall',
    question: 'Which is NOT a polygon?',
    options: ['Triangle', 'Circle', 'Hexagon', 'Octagon'],
    correctAnswer: 'Circle',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_18',
    category: 'knowledge_recall',
    question: 'A solid figure with two congruent parallel faces is a',
    options: ['Prism', 'Pyramid', 'Sphere', 'Cone'],
    correctAnswer: 'Prism',
    difficulty: 'medium',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_19',
    category: 'knowledge_recall',
    question: 'A figure with all points equidistant from the center is a',
    options: ['Circle', 'Square', 'Triangle', 'Rectangle'],
    correctAnswer: 'Circle',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },
  {
    id: 'kr_pre_20',
    category: 'knowledge_recall',
    question: 'A three-dimensional figure with no edges and no vertices is a',
    options: ['Cube', 'Sphere', 'Cone', 'Prism'],
    correctAnswer: 'Sphere',
    difficulty: 'easy',
    testType: 'pretest',
    points: 1
  },

  // ========== POSTTEST QUESTIONS (20) ==========
  {
    id: 'kr_post_01',
    category: 'knowledge_recall',
    question: 'A location in space without width, length, or height is a',
    options: ['Plane', 'Point', 'Line', 'Vertex'],
    correctAnswer: 'Point',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_02',
    category: 'knowledge_recall',
    question: 'A plane extends in:',
    options: ['One direction', 'Two directions', 'Three directions', 'Four directions'],
    correctAnswer: 'Two directions',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_03',
    category: 'knowledge_recall',
    question: 'A ray has',
    options: ['No endpoints', 'One endpoint', 'Two endpoints', 'Infinite endpoints'],
    correctAnswer: 'One endpoint',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_04',
    category: 'knowledge_recall',
    question: 'Which lines are always the same distance apart?',
    options: ['Perpendicular', 'Intersecting', 'Parallel', 'Skew'],
    correctAnswer: 'Parallel',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_05',
    category: 'knowledge_recall',
    question: 'Lines that lie in different planes are',
    options: ['Skew lines', 'Perpendicular', 'Intersecting', 'Coplanar'],
    correctAnswer: 'Skew lines',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_06',
    category: 'knowledge_recall',
    question: 'Two rays forming an angle are called',
    options: ['Arms', 'Bases', 'Segments', 'Ends'],
    correctAnswer: 'Arms',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_07',
    category: 'knowledge_recall',
    question: 'A polygon with 8 sides is a',
    options: ['Heptagon', 'Octagon', 'Nonagon', 'Decagon'],
    correctAnswer: 'Octagon',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_08',
    category: 'knowledge_recall',
    question: 'A closed figure made of straight segments is a',
    options: ['Circle', 'Arc', 'Polygon', 'Ray'],
    correctAnswer: 'Polygon',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_09',
    category: 'knowledge_recall',
    question: 'The line passing through the center and touching two points on the circle is',
    options: ['Chord', 'Radius', 'Diameter', 'Arc'],
    correctAnswer: 'Diameter',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_10',
    category: 'knowledge_recall',
    question: 'A chord that passes through the center is the',
    options: ['Radius', 'Diameter', 'Tangent', 'Secant'],
    correctAnswer: 'Diameter',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_11',
    category: 'knowledge_recall',
    question: 'A polyhedron with one base and triangular faces is a',
    options: ['Prism', 'Pyramid', 'Cylinder', 'Sphere'],
    correctAnswer: 'Pyramid',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_12',
    category: 'knowledge_recall',
    question: 'A solid figure with two circular congruent bases is a',
    options: ['Cone', 'Sphere', 'Cylinder', 'Pyramid'],
    correctAnswer: 'Cylinder',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_13',
    category: 'knowledge_recall',
    question: 'The measure of the "opening" of an angle refers to',
    options: ['Sides', 'Vertex', 'Degree', 'Length'],
    correctAnswer: 'Degree',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_14',
    category: 'knowledge_recall',
    question: 'A 5-sided polygon is called',
    options: ['Pentagram', 'Pentagon', 'Hexagon', 'Septagon'],
    correctAnswer: 'Pentagon',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_15',
    category: 'knowledge_recall',
    question: 'How many faces does a cube have?',
    options: ['4', '6', '8', '12'],
    correctAnswer: '6',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_16',
    category: 'knowledge_recall',
    question: 'A triangle with all sides equal is',
    options: ['Isosceles', 'Scalene', 'Equilateral', 'Right'],
    correctAnswer: 'Equilateral',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_17',
    category: 'knowledge_recall',
    question: 'A figure that is flat and has length and width is',
    options: ['Solid figure', 'Plane figure', 'Spatial figure', 'Volume'],
    correctAnswer: 'Plane figure',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_18',
    category: 'knowledge_recall',
    question: 'Which is NOT a solid figure?',
    options: ['Cube', 'Cone', 'Triangle', 'Prism'],
    correctAnswer: 'Triangle',
    difficulty: 'easy',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_19',
    category: 'knowledge_recall',
    question: 'A curved surface with no edges belongs to a',
    options: ['Cube', 'Cylinder', 'Sphere', 'Prism'],
    correctAnswer: 'Sphere',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  },
  {
    id: 'kr_post_20',
    category: 'knowledge_recall',
    question: 'A figure formed by points in space is a',
    options: ['Plane figure', 'Solid figure', 'Circular figure', 'Line figure'],
    correctAnswer: 'Solid figure',
    difficulty: 'medium',
    testType: 'posttest',
    points: 1
  }
];

module.exports = { knowledgeRecallQuestions };
