/**
 * Basic Geometric Figures - Question Templates
 * Covers: points, lines, line segments, rays, planes, space
 */

module.exports = {
  1: [
    {
      type: 'point_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A point is:',
      params: {},
      solution: () => 0,
      hint: 'A point is a position with no size',
      multipleChoice: ['A location in space', 'A straight path', 'A flat surface', 'An angle']
    },
    {
      type: 'line_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A line is:',
      params: {},
      solution: () => 0,
      hint: 'A line extends forever in both directions',
      multipleChoice: ['A straight path that extends infinitely', 'A curved path', 'A finite segment', 'A closed shape']
    },
    {
      type: 'line_segment_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A line segment is:',
      params: {},
      solution: () => 0,
      hint: 'A segment has two endpoints',
      multipleChoice: ['Part of a line with two endpoints', 'A line with no endpoints', 'A line with one endpoint', 'An infinite line']
    },
    {
      type: 'ray_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A ray is:',
      params: {},
      solution: () => 0,
      hint: 'A ray starts at a point and extends forever',
      multipleChoice: ['A line with one endpoint that extends infinitely', 'A line with two endpoints', 'A curved line', 'A closed figure']
    },
    {
      type: 'plane_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A plane is:',
      params: {},
      solution: () => 0,
      hint: 'A plane is a flat surface',
      multipleChoice: ['A flat surface that extends infinitely', 'A curved surface', 'A finite surface', 'A 3D object']
    }
  ],
  
  2: [
    {
      type: 'collinear_points',
      cognitiveDomain: 'concept_understanding',
      template: 'Points that lie on the same line are called:',
      params: {},
      solution: () => 0,
      hint: 'They are in the same line',
      multipleChoice: ['Collinear', 'Coplanar', 'Concurrent', 'Congruent']
    },
    {
      type: 'coplanar_points',
      cognitiveDomain: 'concept_understanding',
      template: 'Points that lie on the same plane are called:',
      params: {},
      solution: () => 0,
      hint: 'They are in the same plane',
      multipleChoice: ['Coplanar', 'Collinear', 'Concurrent', 'Congruent']
    },
    {
      type: 'intersecting_lines',
      cognitiveDomain: 'concept_understanding',
      template: 'Two lines that meet at exactly one point are called:',
      params: {},
      solution: () => 0,
      hint: 'They cross at one point',
      multipleChoice: ['Intersecting lines', 'Parallel lines', 'Skew lines', 'Perpendicular lines']
    },
    {
      type: 'parallel_lines',
      cognitiveDomain: 'concept_understanding',
      template: 'Two lines in the same plane that never meet are called:',
      params: {},
      solution: () => 0,
      hint: 'They never intersect',
      multipleChoice: ['Parallel lines', 'Intersecting lines', 'Perpendicular lines', 'Skew lines']
    },
    {
      type: 'perpendicular_lines',
      cognitiveDomain: 'concept_understanding',
      template: 'Two lines that intersect at a right angle are called:',
      params: {},
      solution: () => 0,
      hint: 'They form 90° angles',
      multipleChoice: ['Perpendicular lines', 'Parallel lines', 'Acute lines', 'Obtuse lines']
    }
  ],
  
  3: [
    {
      type: 'minimum_points_line',
      cognitiveDomain: 'concept_understanding',
      template: 'What is the minimum number of points needed to determine a unique line?',
      params: {},
      solution: () => 2,
      hint: 'Two points determine a line',
      multipleChoice: ['2', '1', '3', '4']
    },
    {
      type: 'minimum_points_plane',
      cognitiveDomain: 'concept_understanding',
      template: 'What is the minimum number of non-collinear points needed to determine a unique plane?',
      params: {},
      solution: () => 3,
      hint: 'Three non-collinear points determine a plane',
      multipleChoice: ['3', '2', '4', '5']
    },
    {
      type: 'skew_lines',
      cognitiveDomain: 'concept_understanding',
      template: 'Lines that do not lie in the same plane and never intersect are called:',
      params: {},
      solution: () => 0,
      hint: 'They are in different planes',
      multipleChoice: ['Skew lines', 'Parallel lines', 'Intersecting lines', 'Perpendicular lines']
    },
    {
      type: 'line_plane_intersection',
      cognitiveDomain: 'analytical_thinking',
      template: 'How many points can a line and a plane have in common?',
      params: {},
      solution: () => 0,
      hint: 'Consider: no points (parallel), one point (intersecting), or infinitely many (contained)',
      multipleChoice: ['0, 1, or infinitely many', 'Exactly 1', 'Exactly 2', 'Always infinitely many']
    },
    {
      type: 'midpoint_concept',
      cognitiveDomain: 'concept_understanding',
      template: 'The midpoint of a line segment:',
      params: {},
      solution: () => 0,
      hint: 'It divides the segment into two equal parts',
      multipleChoice: ['Divides it into two equal parts', 'Is one-third of the way', 'Is closer to one endpoint', 'Is outside the segment']
    }
  ],
  
  4: [
    {
      type: 'parallel_postulate',
      cognitiveDomain: 'analytical_thinking',
      template: 'Through a point not on a line, how many lines can be drawn parallel to the given line?',
      params: {},
      solution: () => 0,
      hint: 'This is the Parallel Postulate in Euclidean geometry',
      multipleChoice: ['Exactly one', 'None', 'Two', 'Infinitely many']
    },
    {
      type: 'plane_intersection',
      cognitiveDomain: 'analytical_thinking',
      template: 'When two distinct planes intersect, their intersection is:',
      params: {},
      solution: () => 0,
      hint: 'Think about two walls meeting',
      multipleChoice: ['A line', 'A point', 'A plane', 'A segment']
    },
    {
      type: 'distance_point_to_line',
      cognitiveDomain: 'concept_understanding',
      template: 'The distance from a point to a line is:',
      params: {},
      solution: () => 0,
      hint: 'The shortest distance is perpendicular',
      multipleChoice: ['The perpendicular distance', 'Any distance to the line', 'The horizontal distance', 'The vertical distance']
    },
    {
      type: 'segment_addition',
      cognitiveDomain: 'procedural_skills',
      template: 'If point B is between points A and C, and AB = {ab} units and BC = {bc} units, what is AC?',
      params: {
        ab: { min: 3, max: 12 },
        bc: { min: 4, max: 15 }
      },
      solution: (p) => p.ab + p.bc,
      hint: 'Use the Segment Addition Postulate: AC = AB + BC'
    },
    {
      type: 'midpoint_calculation',
      cognitiveDomain: 'procedural_skills',
      template: 'The midpoint of a segment from ({x1}, {y1}) to ({x2}, {y2}) is:',
      params: {
        x1: { min: 0, max: 10 },
        y1: { min: 0, max: 10 },
        x2: { min: 0, max: 10 },
        y2: { min: 0, max: 10 }
      },
      solution: (p) => `(${(p.x1 + p.x2) / 2}, ${(p.y1 + p.y2) / 2})`,
      hint: 'Midpoint formula: ((x1+x2)/2, (y1+y2)/2)'
    }
  ]
};
