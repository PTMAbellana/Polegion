/**
 * Interior Angles of Polygons - Question Templates
 * Covers: angle sum formulas, regular polygons, exterior angles
 */

module.exports = {
  1: [
    {
      type: 'triangle_angle_sum',
      cognitiveDomain: 'knowledge_recall',
      template: 'The sum of interior angles in any triangle is:',
      params: {},
      solution: () => 0,
      hint: 'Triangle angles always sum to 180°',
      multipleChoice: ['180°', '360°', '90°', '270°']
    },
    {
      type: 'triangle_angle_find',
      cognitiveDomain: 'procedural_skills',
      template: 'In a triangle, two angles measure {angle1}° and {angle2}°. Find the third angle.',
      params: {
        angle1: { min: 30, max: 80 },
        angle2: { min: 40, max: 90 }
      },
      solution: (p) => 180 - p.angle1 - p.angle2,
      hint: 'Sum of angles = 180°'
    },
    {
      type: 'right_triangle_angles',
      cognitiveDomain: 'procedural_skills',
      template: 'In a right triangle, one angle is 90° and another is {angle}°. Find the third angle.',
      params: {
        angle: { min: 20, max: 70 }
      },
      solution: (p) => 90 - p.angle,
      hint: '90° + angle + third = 180°'
    },
    {
      type: 'isosceles_triangle_angles',
      cognitiveDomain: 'concept_understanding',
      template: 'In an isosceles triangle, the two base angles are:',
      params: {},
      solution: () => 0,
      hint: 'Base angles are equal',
      multipleChoice: ['Equal', 'Complementary', 'Supplementary', 'Right angles']
    },
    {
      type: 'equilateral_triangle_angle',
      cognitiveDomain: 'knowledge_recall',
      template: 'Each angle in an equilateral triangle measures:',
      params: {},
      solution: () => 0,
      hint: '180° ÷ 3 = 60°',
      multipleChoice: ['60°', '90°', '45°', '120°']
    }
  ],
  
  2: [
    {
      type: 'quadrilateral_angle_sum',
      cognitiveDomain: 'knowledge_recall',
      template: 'The sum of interior angles in any quadrilateral is:',
      params: {},
      solution: () => 0,
      hint: 'Quadrilateral angles sum to 360°',
      multipleChoice: ['360°', '180°', '540°', '270°']
    },
    {
      type: 'quadrilateral_angle_find',
      cognitiveDomain: 'procedural_skills',
      template: 'In a quadrilateral, three angles measure {a}°, {b}°, and {c}°. Find the fourth angle.',
      params: {
        a: { min: 60, max: 100 },
        b: { min: 70, max: 110 },
        c: { min: 50, max: 90 }
      },
      solution: (p) => 360 - p.a - p.b - p.c,
      hint: 'Sum of angles = 360°'
    },
    {
      type: 'rectangle_angles',
      cognitiveDomain: 'knowledge_recall',
      template: 'Each angle in a rectangle measures:',
      params: {},
      solution: () => 0,
      hint: 'All angles are right angles',
      multipleChoice: ['90°', '60°', '120°', '45°']
    },
    {
      type: 'pentagon_angle_sum',
      cognitiveDomain: 'knowledge_recall',
      template: 'The sum of interior angles in a pentagon is:',
      params: {},
      solution: () => 0,
      hint: 'Use formula (n-2) × 180° where n=5',
      multipleChoice: ['540°', '360°', '720°', '180°']
    },
    {
      type: 'hexagon_angle_sum',
      cognitiveDomain: 'knowledge_recall',
      template: 'The sum of interior angles in a hexagon is:',
      params: {},
      solution: () => 0,
      hint: 'Use formula (n-2) × 180° where n=6',
      multipleChoice: ['720°', '540°', '900°', '360°']
    }
  ],
  
  3: [
    {
      type: 'polygon_angle_sum_formula',
      cognitiveDomain: 'concept_understanding',
      template: 'The formula for the sum of interior angles of an n-sided polygon is:',
      params: {},
      solution: () => 0,
      hint: '(n - 2) × 180°',
      multipleChoice: ['(n - 2) × 180°', 'n × 180°', '(n + 2) × 180°', 'n × 90°']
    },
    {
      type: 'polygon_angle_sum_calculation',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the sum of interior angles in a {n}-sided polygon.',
      params: {
        n: { min: 7, max: 12 }
      },
      solution: (p) => (p.n - 2) * 180,
      hint: 'Use formula (n - 2) × 180°'
    },
    {
      type: 'regular_polygon_angle',
      cognitiveDomain: 'procedural_skills',
      template: 'Find each interior angle of a regular {n}-sided polygon.',
      params: {
        n: { min: 5, max: 10 }
      },
      solution: (p) => ((p.n - 2) * 180) / p.n,
      hint: 'Sum of angles ÷ number of angles'
    },
    {
      type: 'exterior_angle_theorem',
      cognitiveDomain: 'concept_understanding',
      template: 'An exterior angle of a triangle equals:',
      params: {},
      solution: () => 0,
      hint: 'Sum of the two non-adjacent interior angles',
      multipleChoice: ['The sum of the two non-adjacent interior angles', 'One interior angle', 'Half the sum of all angles', '180°']
    },
    {
      type: 'exterior_angles_sum',
      cognitiveDomain: 'knowledge_recall',
      template: 'The sum of exterior angles of any polygon is:',
      params: {},
      solution: () => 0,
      hint: 'Always 360° for any polygon',
      multipleChoice: ['360°', '180°', '540°', 'Depends on the polygon']
    }
  ],
  
  4: [
    {
      type: 'regular_polygon_exterior_angle',
      cognitiveDomain: 'procedural_skills',
      template: 'Find each exterior angle of a regular {n}-sided polygon.',
      params: {
        n: { min: 5, max: 12 }
      },
      solution: (p) => 360 / p.n,
      hint: '360° ÷ number of sides'
    },
    {
      type: 'polygon_sides_from_angle_sum',
      cognitiveDomain: 'problem_solving',
      template: 'A polygon has an angle sum of {sum}°. How many sides does it have?',
      params: {
        sum: { min: 540, max: 1800, step: 180 }
      },
      solution: (p) => (p.sum / 180) + 2,
      hint: 'Use (n - 2) × 180° = sum, solve for n'
    },
    {
      type: 'regular_polygon_from_interior_angle',
      cognitiveDomain: 'problem_solving',
      template: 'Each interior angle of a regular polygon is {angle}°. How many sides does it have?',
      params: {
        angle: { min: 108, max: 156, step: 12 }
      },
      solution: (p) => 360 / (180 - p.angle),
      hint: 'Exterior angle = 180 - interior, then n = 360 ÷ exterior'
    },
    {
      type: 'triangle_exterior_angle_calculation',
      cognitiveDomain: 'problem_solving',
      template: 'In a triangle, two interior angles are {a}° and {b}°. Find an exterior angle at the third vertex.',
      params: {
        a: { min: 40, max: 80 },
        b: { min: 50, max: 90 }
      },
      solution: (p) => p.a + p.b,
      hint: 'Exterior angle = sum of non-adjacent interior angles'
    },
    {
      type: 'isosceles_triangle_angle_problem',
      cognitiveDomain: 'problem_solving',
      template: 'In an isosceles triangle, the vertex angle is {vertex}°. Find each base angle.',
      params: {
        vertex: { min: 40, max: 100, step: 20 }
      },
      solution: (p) => (180 - p.vertex) / 2,
      hint: 'Base angles are equal, and all three sum to 180°'
    }
  ]
};
