/**
 * Perimeter and Area of Polygons - Question Templates
 * Covers: triangles, quadrilaterals, regular polygons
 */

module.exports = {
  1: [
    {
      type: 'perimeter_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Perimeter is:',
      params: {},
      solution: () => 0,
      hint: 'The distance around a shape',
      multipleChoice: ['The distance around a shape', 'The space inside a shape', 'The height of a shape', 'The width of a shape']
    },
    {
      type: 'area_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Area measures:',
      params: {},
      solution: () => 0,
      hint: 'The space inside a shape',
      multipleChoice: ['The space inside a shape', 'The distance around a shape', 'The volume of a shape', 'The perimeter of a shape']
    },
    {
      type: 'square_perimeter_simple',
      cognitiveDomain: 'procedural_skills',
      template: 'A square has sides of {side} units. What is its perimeter?',
      params: {
        side: { min: 2, max: 8 }
      },
      solution: (p) => 4 * p.side,
      hint: 'Perimeter = 4 × side'
    },
    {
      type: 'rectangle_perimeter_simple',
      cognitiveDomain: 'procedural_skills',
      template: 'A rectangle is {length} units long and {width} units wide. What is its perimeter?',
      params: {
        length: { min: 3, max: 10 },
        width: { min: 2, max: 7 }
      },
      solution: (p) => 2 * (p.length + p.width),
      hint: 'Perimeter = 2 × (length + width)'
    },
    {
      type: 'square_area_simple',
      cognitiveDomain: 'procedural_skills',
      template: 'A square has sides of {side} units. What is its area?',
      params: {
        side: { min: 2, max: 8 }
      },
      solution: (p) => p.side * p.side,
      hint: 'Area = side²'
    }
  ],
  
  2: [
    {
      type: 'rectangle_area',
      cognitiveDomain: 'procedural_skills',
      template: 'A rectangle is {length} units long and {width} units wide. What is its area?',
      params: {
        length: { min: 4, max: 12 },
        width: { min: 3, max: 10 }
      },
      solution: (p) => p.length * p.width,
      hint: 'Area = length × width'
    },
    {
      type: 'triangle_perimeter',
      cognitiveDomain: 'procedural_skills',
      template: 'A triangle has sides of {a} units, {b} units, and {c} units. What is its perimeter?',
      params: {
        a: { min: 3, max: 8 },
        b: { min: 4, max: 9 },
        c: { min: 5, max: 10 }
      },
      solution: (p) => p.a + p.b + p.c,
      hint: 'Perimeter = sum of all sides'
    },
    {
      type: 'triangle_area_basic',
      cognitiveDomain: 'procedural_skills',
      template: 'A triangle has base {base} units and height {height} units. What is its area?',
      params: {
        base: { min: 4, max: 12 },
        height: { min: 3, max: 10 }
      },
      solution: (p) => 0.5 * p.base * p.height,
      hint: 'Area = ½ × base × height'
    },
    {
      type: 'parallelogram_area',
      cognitiveDomain: 'procedural_skills',
      template: 'A parallelogram has base {base} units and height {height} units. What is its area?',
      params: {
        base: { min: 5, max: 14 },
        height: { min: 3, max: 10 }
      },
      solution: (p) => p.base * p.height,
      hint: 'Area = base × height'
    },
    {
      type: 'trapezoid_area_intro',
      cognitiveDomain: 'concept_understanding',
      template: 'The area of a trapezoid uses which formula?',
      params: {},
      solution: () => 0,
      hint: 'Average the parallel sides, multiply by height',
      multipleChoice: ['½ × (base1 + base2) × height', 'base × height', '½ × base × height', 'side × side']
    }
  ],
  
  3: [
    {
      type: 'trapezoid_area',
      cognitiveDomain: 'procedural_skills',
      template: 'A trapezoid has parallel sides of {base1} units and {base2} units, and height {height} units. What is its area?',
      params: {
        base1: { min: 4, max: 12 },
        base2: { min: 6, max: 14 },
        height: { min: 3, max: 10 }
      },
      solution: (p) => 0.5 * (p.base1 + p.base2) * p.height,
      hint: 'Area = ½ × (base1 + base2) × height'
    },
    {
      type: 'rhombus_area',
      cognitiveDomain: 'procedural_skills',
      template: 'A rhombus has diagonals of {d1} units and {d2} units. What is its area?',
      params: {
        d1: { min: 6, max: 16 },
        d2: { min: 8, max: 18 }
      },
      solution: (p) => 0.5 * p.d1 * p.d2,
      hint: 'Area = ½ × diagonal1 × diagonal2'
    },
    {
      type: 'regular_polygon_perimeter',
      cognitiveDomain: 'procedural_skills',
      template: 'A regular pentagon has side length {side} units. What is its perimeter?',
      params: {
        side: { min: 4, max: 12 }
      },
      solution: (p) => 5 * p.side,
      hint: 'Perimeter = number of sides × side length'
    },
    {
      type: 'composite_figure',
      cognitiveDomain: 'problem_solving',
      template: 'A shape is made of a rectangle ({length} × {width}) and a square ({side} × {side}). What is the total area?',
      params: {
        length: { min: 5, max: 10 },
        width: { min: 3, max: 7 },
        side: { min: 3, max: 6 }
      },
      solution: (p) => (p.length * p.width) + (p.side * p.side),
      hint: 'Add the areas of both shapes'
    },
    {
      type: 'area_units',
      cognitiveDomain: 'concept_understanding',
      template: 'Area is measured in:',
      params: {},
      solution: () => 0,
      hint: 'Square units for 2D space',
      multipleChoice: ['Square units', 'Cubic units', 'Linear units', 'Angular units']
    }
  ],
  
  4: [
    {
      type: 'triangle_area_word',
      cognitiveDomain: 'problem_solving',
      template: 'A triangular garden has base {base} meters and height {height} meters. How many square meters is the garden?',
      params: {
        base: { min: 6, max: 18 },
        height: { min: 4, max: 15 }
      },
      solution: (p) => 0.5 * p.base * p.height,
      hint: 'Area = ½ × base × height'
    },
    {
      type: 'rectangle_word_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A rectangular field is {length} meters long and {width} meters wide. If fencing costs ${cost} per meter, how much will it cost to fence the entire field?',
      params: {
        length: { min: 20, max: 50 },
        width: { min: 15, max: 40 },
        cost: { min: 5, max: 15 }
      },
      solution: (p) => 2 * (p.length + p.width) * p.cost,
      hint: 'Calculate perimeter, then multiply by cost'
    },
    {
      type: 'hexagon_perimeter',
      cognitiveDomain: 'procedural_skills',
      template: 'A regular hexagon has side length {side} units. What is its perimeter?',
      params: {
        side: { min: 5, max: 15 }
      },
      solution: (p) => 6 * p.side,
      hint: 'Perimeter = 6 × side'
    },
    {
      type: 'composite_area_word',
      cognitiveDomain: 'problem_solving',
      template: 'A wall is {length}m × {height}m with a window that is {window_w}m × {window_h}m. What is the area to be painted?',
      params: {
        length: { min: 8, max: 15 },
        height: { min: 3, max: 5 },
        window_w: { min: 1, max: 2 },
        window_h: { min: 1, max: 2 }
      },
      solution: (p) => (p.length * p.height) - (p.window_w * p.window_h),
      hint: 'Wall area minus window area'
    },
    {
      type: 'scale_factor_area',
      cognitiveDomain: 'analytical_thinking',
      template: 'If the sides of a rectangle are doubled, its area becomes:',
      params: {},
      solution: () => 0,
      hint: 'Area depends on length × width, so 2 × 2 = 4 times larger',
      multipleChoice: ['4 times larger', '2 times larger', '8 times larger', '16 times larger']
    }
  ]
};
