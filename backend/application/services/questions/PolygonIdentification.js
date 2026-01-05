/**
 * Polygon Identification - Question Templates
 * Covers: triangles, quadrilaterals, pentagons, hexagons, and other polygons
 */

module.exports = {
  1: [
    {
      type: 'triangle_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A triangle has:',
      params: {},
      solution: () => 0,
      hint: 'A triangle has 3 sides',
      multipleChoice: ['3 sides', '4 sides', '5 sides', '6 sides']
    },
    {
      type: 'quadrilateral_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A quadrilateral has:',
      params: {},
      solution: () => 0,
      hint: 'A quadrilateral has 4 sides',
      multipleChoice: ['4 sides', '3 sides', '5 sides', '6 sides']
    },
    {
      type: 'pentagon_sides',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many sides does a pentagon have?',
      params: {},
      solution: () => 0,
      hint: 'Penta means five',
      multipleChoice: ['5', '4', '6', '7']
    },
    {
      type: 'hexagon_sides',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many sides does a hexagon have?',
      params: {},
      solution: () => 0,
      hint: 'Hex means six',
      multipleChoice: ['6', '5', '7', '8']
    },
    {
      type: 'square_identify',
      cognitiveDomain: 'concept_understanding',
      template: 'A quadrilateral with 4 equal sides and 4 right angles is a:',
      params: {},
      solution: () => 0,
      hint: 'All sides equal and all angles 90°',
      multipleChoice: ['Square', 'Rectangle', 'Rhombus', 'Trapezoid']
    }
  ],
  
  2: [
    {
      type: 'heptagon_sides',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many sides does a heptagon have?',
      params: {},
      solution: () => 0,
      hint: 'Hepta means seven',
      multipleChoice: ['7', '6', '8', '5']
    },
    {
      type: 'octagon_sides',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many sides does an octagon have?',
      params: {},
      solution: () => 0,
      hint: 'Octa means eight',
      multipleChoice: ['8', '7', '9', '6']
    },
    {
      type: 'nonagon_sides',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many sides does a nonagon have?',
      params: {},
      solution: () => 0,
      hint: 'Nona means nine',
      multipleChoice: ['9', '8', '10', '7']
    },
    {
      type: 'decagon_sides',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many sides does a decagon have?',
      params: {},
      solution: () => 0,
      hint: 'Deca means ten',
      multipleChoice: ['10', '9', '11', '8']
    },
    {
      type: 'rectangle_identify',
      cognitiveDomain: 'concept_understanding',
      template: 'A quadrilateral with 4 right angles and opposite sides equal is a:',
      params: {},
      solution: () => 0,
      hint: 'All angles 90°, opposite sides equal',
      multipleChoice: ['Rectangle', 'Square', 'Rhombus', 'Trapezoid']
    }
  ],
  
  3: [
    {
      type: 'rhombus_identify',
      cognitiveDomain: 'concept_understanding',
      template: 'A quadrilateral with 4 equal sides but not necessarily right angles is a:',
      params: {},
      solution: () => 0,
      hint: 'All sides equal, angles not necessarily 90°',
      multipleChoice: ['Rhombus', 'Square', 'Rectangle', 'Trapezoid']
    },
    {
      type: 'trapezoid_identify',
      cognitiveDomain: 'concept_understanding',
      template: 'A quadrilateral with exactly one pair of parallel sides is a:',
      params: {},
      solution: () => 0,
      hint: 'One pair of parallel sides',
      multipleChoice: ['Trapezoid', 'Parallelogram', 'Rectangle', 'Rhombus']
    },
    {
      type: 'parallelogram_identify',
      cognitiveDomain: 'concept_understanding',
      template: 'A quadrilateral with two pairs of parallel sides is a:',
      params: {},
      solution: () => 0,
      hint: 'Two pairs of parallel sides',
      multipleChoice: ['Parallelogram', 'Trapezoid', 'Triangle', 'Pentagon']
    },
    {
      type: 'equilateral_triangle',
      cognitiveDomain: 'concept_understanding',
      template: 'A triangle with all sides equal is:',
      params: {},
      solution: () => 0,
      hint: 'All sides equal',
      multipleChoice: ['Equilateral', 'Isosceles', 'Scalene', 'Right']
    },
    {
      type: 'isosceles_triangle',
      cognitiveDomain: 'concept_understanding',
      template: 'A triangle with exactly two equal sides is:',
      params: {},
      solution: () => 0,
      hint: 'Two sides equal',
      multipleChoice: ['Isosceles', 'Equilateral', 'Scalene', 'Obtuse']
    }
  ],
  
  4: [
    {
      type: 'scalene_triangle',
      cognitiveDomain: 'concept_understanding',
      template: 'A triangle with no equal sides is:',
      params: {},
      solution: () => 0,
      hint: 'No equal sides',
      multipleChoice: ['Scalene', 'Isosceles', 'Equilateral', 'Right']
    },
    {
      type: 'kite_identify',
      cognitiveDomain: 'concept_understanding',
      template: 'A quadrilateral with two pairs of adjacent sides equal is a:',
      params: {},
      solution: () => 0,
      hint: 'Two pairs of adjacent equal sides',
      multipleChoice: ['Kite', 'Trapezoid', 'Parallelogram', 'Rectangle']
    },
    {
      type: 'regular_polygon',
      cognitiveDomain: 'concept_understanding',
      template: 'A polygon with all sides equal and all angles equal is called:',
      params: {},
      solution: () => 0,
      hint: 'All sides and angles equal',
      multipleChoice: ['Regular', 'Irregular', 'Convex', 'Concave']
    },
    {
      type: 'convex_polygon',
      cognitiveDomain: 'concept_understanding',
      template: 'A polygon where all interior angles are less than 180° is:',
      params: {},
      solution: () => 0,
      hint: 'All angles less than 180°, no indentations',
      multipleChoice: ['Convex', 'Concave', 'Regular', 'Irregular']
    },
    {
      type: 'polygon_diagonals',
      cognitiveDomain: 'analytical_thinking',
      template: 'A diagonal of a polygon connects:',
      params: {},
      solution: () => 0,
      hint: 'Connects non-adjacent vertices',
      multipleChoice: ['Two non-adjacent vertices', 'Two adjacent vertices', 'A vertex to the center', 'Two midpoints']
    }
  ]
};
