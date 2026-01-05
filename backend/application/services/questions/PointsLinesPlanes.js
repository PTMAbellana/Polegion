/**
 * Points, Lines, and Planes - Question Templates
 * Covers: notation, relationships, postulates
 */

module.exports = {
  1: [
    {
      type: 'points_needed_line',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many points are needed to determine a line?',
      params: {},
      solution: () => 2,
      hint: 'Two points determine exactly one line',
      multipleChoice: ['2', '1', '3', '4']
    },
    {
      type: 'line_segment_parts',
      cognitiveDomain: 'knowledge_recall',
      template: 'A line segment has:',
      params: {},
      solution: () => 0,
      hint: 'It has two endpoints',
      multipleChoice: ['Two endpoints', 'One endpoint', 'No endpoints', 'Three endpoints']
    },
    {
      type: 'ray_parts',
      cognitiveDomain: 'knowledge_recall',
      template: 'A ray has:',
      params: {},
      solution: () => 0,
      hint: 'It has one endpoint and extends infinitely',
      multipleChoice: ['One endpoint', 'Two endpoints', 'No endpoints', 'Three endpoints']
    },
    {
      type: 'line_notation',
      cognitiveDomain: 'knowledge_recall',
      template: 'A line through points A and B is notated as:',
      params: {},
      solution: () => 0,
      hint: 'Line AB with a double-headed arrow on top',
      multipleChoice: ['Line AB', 'Segment AB', 'Ray AB', 'Point AB']
    },
    {
      type: 'segment_notation',
      cognitiveDomain: 'knowledge_recall',
      template: 'A line segment from point A to point B is notated as:',
      params: {},
      solution: () => 0,
      hint: 'Segment AB with a bar on top',
      multipleChoice: ['Segment AB', 'Line AB', 'Ray AB', 'Angle AB']
    }
  ],
  
  2: [
    {
      type: 'points_needed_plane',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many non-collinear points are needed to determine a plane?',
      params: {},
      solution: () => 3,
      hint: 'Three non-collinear points determine a plane',
      multipleChoice: ['3', '2', '4', '5']
    },
    {
      type: 'collinear_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Collinear points are points that:',
      params: {},
      solution: () => 0,
      hint: 'They lie on the same line',
      multipleChoice: ['Lie on the same line', 'Lie on the same plane', 'Form a triangle', 'Are equidistant']
    },
    {
      type: 'coplanar_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Coplanar points are points that:',
      params: {},
      solution: () => 0,
      hint: 'They lie on the same plane',
      multipleChoice: ['Lie on the same plane', 'Lie on the same line', 'Form angles', 'Are parallel']
    },
    {
      type: 'parallel_lines_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Parallel lines are lines that:',
      params: {},
      solution: () => 0,
      hint: 'They never intersect',
      multipleChoice: ['Never intersect', 'Intersect at one point', 'Intersect at two points', 'Form right angles']
    },
    {
      type: 'intersecting_lines_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Intersecting lines meet at:',
      params: {},
      solution: () => 0,
      hint: 'They meet at exactly one point',
      multipleChoice: ['Exactly one point', 'Two points', 'No points', 'Infinitely many points']
    }
  ],
  
  3: [
    {
      type: 'perpendicular_lines_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Perpendicular lines intersect to form:',
      params: {},
      solution: () => 0,
      hint: 'They form 90° angles',
      multipleChoice: ['Right angles', 'Acute angles', 'Obtuse angles', 'Straight angles']
    },
    {
      type: 'skew_lines_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Skew lines are lines that:',
      params: {},
      solution: () => 0,
      hint: 'They are not parallel and do not intersect',
      multipleChoice: ['Do not intersect and are not parallel', 'Are parallel', 'Intersect at one point', 'Are perpendicular']
    },
    {
      type: 'line_plane_postulate',
      cognitiveDomain: 'analytical_thinking',
      template: 'If two points lie in a plane, then:',
      params: {},
      solution: () => 0,
      hint: 'The entire line through them lies in the plane',
      multipleChoice: ['The line through them lies in the plane', 'Only those points are in the plane', 'No other points are in the plane', 'The plane is perpendicular']
    },
    {
      type: 'plane_intersection_postulate',
      cognitiveDomain: 'analytical_thinking',
      template: 'If two planes intersect, their intersection is:',
      params: {},
      solution: () => 0,
      hint: 'They intersect in a line',
      multipleChoice: ['A line', 'A point', 'A plane', 'A segment']
    },
    {
      type: 'distance_postulate',
      cognitiveDomain: 'concept_understanding',
      template: 'The distance between two points is:',
      params: {},
      solution: () => 0,
      hint: 'The shortest path is a straight line',
      multipleChoice: ['The length of the segment between them', 'Any path between them', 'Twice the segment length', 'Half the segment length']
    }
  ],
  
  4: [
    {
      type: 'segment_addition_postulate',
      cognitiveDomain: 'analytical_thinking',
      template: 'The Segment Addition Postulate states that if B is between A and C, then:',
      params: {},
      solution: () => 0,
      hint: 'AB + BC = AC',
      multipleChoice: ['AB + BC = AC', 'AB = BC', 'AC = 2AB', 'AB - BC = AC']
    },
    {
      type: 'midpoint_postulate',
      cognitiveDomain: 'concept_understanding',
      template: 'A midpoint M of segment AB satisfies:',
      params: {},
      solution: () => 0,
      hint: 'AM = MB',
      multipleChoice: ['AM = MB', 'AM = 2MB', 'AM + MB = 2AB', 'AM = AB']
    },
    {
      type: 'betweenness_concept',
      cognitiveDomain: 'analytical_thinking',
      template: 'Point B is between points A and C if:',
      params: {},
      solution: () => 0,
      hint: 'A, B, C are collinear and AB + BC = AC',
      multipleChoice: ['A, B, C are collinear and AB + BC = AC', 'B is closer to A than C', 'B is the midpoint', 'AB = BC']
    },
    {
      type: 'parallel_postulate_euclidean',
      cognitiveDomain: 'analytical_thinking',
      template: 'The Parallel Postulate states that through a point not on a line:',
      params: {},
      solution: () => 0,
      hint: 'Exactly one parallel line can be drawn',
      multipleChoice: ['Exactly one parallel line exists', 'No parallel lines exist', 'Many parallel lines exist', 'Two parallel lines exist']
    },
    {
      type: 'ruler_postulate',
      cognitiveDomain: 'analytical_thinking',
      template: 'The Ruler Postulate states that:',
      params: {},
      solution: () => 0,
      hint: 'Points on a line can be matched with real numbers',
      multipleChoice: ['Points on a line correspond to real numbers', 'All segments have integer length', 'Lines are always measured in meters', 'Segments must be positive']
    }
  ]
};
