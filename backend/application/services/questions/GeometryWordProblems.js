/**
 * Geometry Word Problems - Question Templates
 * Covers: real-world applications across multiple topics
 */

module.exports = {
  1: [
    {
      type: 'perimeter_word_simple',
      cognitiveDomain: 'problem_solving',
      template: 'A square garden has sides of {side} meters. How many meters of fence are needed to enclose it?',
      params: {
        side: { min: 5, max: 15 }
      },
      solution: (p) => 4 * p.side,
      hint: 'Perimeter = 4 × side'
    },
    {
      type: 'area_word_simple',
      cognitiveDomain: 'problem_solving',
      template: 'A rectangular room is {length}m long and {width}m wide. What is its area?',
      params: {
        length: { min: 4, max: 10 },
        width: { min: 3, max: 8 }
      },
      solution: (p) => p.length * p.width,
      hint: 'Area = length × width'
    },
    {
      type: 'angle_word_simple',
      cognitiveDomain: 'problem_solving',
      template: 'A slice of pizza forms an angle of {angle}°. Its complement is:',
      params: {
        angle: { min: 20, max: 70 }
      },
      solution: (p) => 90 - p.angle,
      hint: 'Complement = 90° - angle'
    },
    {
      type: 'distance_word',
      cognitiveDomain: 'problem_solving',
      template: 'Two houses are {a}m and {b}m from a corner. If they are on perpendicular streets, how far apart are they? (Round to nearest meter)',
      params: {
        a: { min: 30, max: 80 },
        b: { min: 40, max: 90 }
      },
      solution: (p) => Math.sqrt(p.a * p.a + p.b * p.b),
      hint: 'Use Pythagorean theorem: c = √(a² + b²)'
    },
    {
      type: 'circle_word_simple',
      cognitiveDomain: 'problem_solving',
      template: 'A circular pond has radius {radius}m. What is the distance around it? (Use π ≈ 3.14)',
      params: {
        radius: { min: 3, max: 10 }
      },
      solution: (p) => 2 * Math.PI * p.radius,
      hint: 'Circumference = 2πr'
    }
  ],
  
  2: [
    {
      type: 'rectangle_cost_problem',
      cognitiveDomain: 'problem_solving',
      template: 'Fencing costs ${cost} per meter. How much to fence a {length}m × {width}m yard?',
      params: {
        cost: { min: 5, max: 15 },
        length: { min: 10, max: 25 },
        width: { min: 8, max: 20 }
      },
      solution: (p) => 2 * (p.length + p.width) * p.cost,
      hint: 'Total cost = perimeter × cost per meter'
    },
    {
      type: 'paint_area_problem',
      cognitiveDomain: 'problem_solving',
      template: 'Paint covers {coverage} sq meters per liter. How many liters for a {length}m × {width}m wall?',
      params: {
        coverage: { min: 8, max: 12 },
        length: { min: 6, max: 12 },
        width: { min: 3, max: 5 }
      },
      solution: (p) => (p.length * p.width) / p.coverage,
      hint: 'Liters needed = area ÷ coverage per liter'
    },
    {
      type: 'triangle_garden_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A triangular flower bed has base {base}m and height {height}m. What is its area?',
      params: {
        base: { min: 4, max: 12 },
        height: { min: 3, max: 10 }
      },
      solution: (p) => 0.5 * p.base * p.height,
      hint: 'Area = ½ × base × height'
    },
    {
      type: 'running_track_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A circular track has diameter {diameter}m. How far do you run in one lap? (Use π ≈ 3.14)',
      params: {
        diameter: { min: 40, max: 100, step: 10 }
      },
      solution: (p) => Math.PI * p.diameter,
      hint: 'Circumference = πd'
    },
    {
      type: 'ladder_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A {ladder}m ladder leans against a wall {height}m high. How far is the base from the wall? (Round to nearest meter)',
      params: {
        ladder: { min: 10, max: 15 },
        height: { min: 6, max: 12 }
      },
      solution: (p) => Math.sqrt(p.ladder * p.ladder - p.height * p.height),
      hint: 'Use Pythagorean theorem'
    }
  ],
  
  3: [
    {
      type: 'composite_area_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A {length}m × {width}m patio has a {side}m × {side}m hot tub. What is the remaining patio area?',
      params: {
        length: { min: 8, max: 15 },
        width: { min: 6, max: 12 },
        side: { min: 2, max: 4 }
      },
      solution: (p) => (p.length * p.width) - (p.side * p.side),
      hint: 'Remaining area = patio area - hot tub area'
    },
    {
      type: 'circular_garden_border',
      cognitiveDomain: 'problem_solving',
      template: 'A circular garden (radius {r}m) has a {w}m wide border. What is the border area? (Use π ≈ 3.14)',
      params: {
        r: { min: 5, max: 10 },
        w: { min: 1, max: 3 }
      },
      solution: (p) => Math.PI * ((p.r + p.w) * (p.r + p.w) - p.r * p.r),
      hint: 'Border area = outer circle area - inner circle area'
    },
    {
      type: 'roof_area_problem',
      cognitiveDomain: 'problem_solving',
      template: 'Two rectangular roof sections are {l1}m × {w}m and {l2}m × {w}m. What is the total roof area?',
      params: {
        l1: { min: 8, max: 15 },
        l2: { min: 6, max: 12 },
        w: { min: 4, max: 8 }
      },
      solution: (p) => (p.l1 * p.w) + (p.l2 * p.w),
      hint: 'Total area = area1 + area2'
    },
    {
      type: 'box_volume_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A storage box is {l}cm long, {w}cm wide, and {h}cm tall. How many cubic centimeters can it hold?',
      params: {
        l: { min: 20, max: 50 },
        w: { min: 15, max: 40 },
        h: { min: 10, max: 30 }
      },
      solution: (p) => p.l * p.w * p.h,
      hint: 'Volume = length × width × height'
    },
    {
      type: 'water_tank_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A cylindrical water tank has radius {r}m and height {h}m. What is its volume? (Use π ≈ 3.14)',
      params: {
        r: { min: 2, max: 6 },
        h: { min: 4, max: 10 }
      },
      solution: (p) => Math.PI * p.r * p.r * p.h,
      hint: 'Volume = πr²h'
    }
  ],
  
  4: [
    {
      type: 'scale_drawing_problem',
      cognitiveDomain: 'problem_solving',
      template: 'On a map, {scale}cm represents {real}m. A road is {map}cm on the map. How long is it in meters?',
      params: {
        scale: { min: 1, max: 2 },
        real: { min: 50, max: 200, step: 50 },
        map: { min: 5, max: 15 }
      },
      solution: (p) => (p.map * p.real) / p.scale,
      hint: 'Real distance = (map distance × real per scale) ÷ scale'
    },
    {
      type: 'pool_filling_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A pool is {l}m × {w}m × {h}m deep. Water fills at {rate} cubic meters per hour. How many hours to fill?',
      params: {
        l: { min: 8, max: 15 },
        w: { min: 4, max: 8 },
        h: { min: 1, max: 3 },
        rate: { min: 5, max: 15 }
      },
      solution: (p) => (p.l * p.w * p.h) / p.rate,
      hint: 'Time = volume ÷ rate'
    },
    {
      type: 'cone_sand_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A cone-shaped pile of sand has radius {r}m and height {h}m. What is its volume? (Use π ≈ 3.14)',
      params: {
        r: { min: 3, max: 8 },
        h: { min: 4, max: 10 }
      },
      solution: (p) => (1/3) * Math.PI * p.r * p.r * p.h,
      hint: 'Volume = ⅓πr²h'
    },
    {
      type: 'sphere_ball_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A spherical ball has radius {r}cm. What is its volume? (Use π ≈ 3.14)',
      params: {
        r: { min: 5, max: 15 }
      },
      solution: (p) => (4/3) * Math.PI * p.r * p.r * p.r,
      hint: 'Volume = (4/3)πr³'
    },
    {
      type: 'optimization_problem',
      cognitiveDomain: 'analytical_thinking',
      template: 'A fence is {total}m long. To enclose the maximum rectangular area, the dimensions should be:',
      params: {
        total: { min: 40, max: 80, step: 20 }
      },
      solution: (p) => `${p.total/4} × ${p.total/4}`,
      hint: 'Square gives maximum area for fixed perimeter',
      multipleChoice: ['Square', 'Rectangle with 2:1 ratio', 'Rectangle with 3:1 ratio', 'Any shape']
    }
  ]
};
