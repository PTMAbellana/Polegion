/**
 * Circumference and Area of a Circle - Question Templates
 * Covers: radius, diameter, circumference, area calculations
 */

module.exports = {
  1: [
    {
      type: 'circle_radius_to_diameter',
      cognitiveDomain: 'procedural_skills',
      template: 'If a circle has a radius of {radius} units, its diameter is:',
      params: {
        radius: { min: 2, max: 10 }
      },
      solution: (p) => 2 * p.radius,
      hint: 'Diameter = 2 × radius'
    },
    {
      type: 'circle_diameter_to_radius',
      cognitiveDomain: 'procedural_skills',
      template: 'If a circle has a diameter of {diameter} units, its radius is:',
      params: {
        diameter: { min: 4, max: 20, step: 2 }
      },
      solution: (p) => p.diameter / 2,
      hint: 'Radius = diameter ÷ 2'
    },
    {
      type: 'circumference_formula',
      cognitiveDomain: 'knowledge_recall',
      template: 'The formula for the circumference of a circle is:',
      params: {},
      solution: () => 0,
      hint: 'C = 2πr or C = πd',
      multipleChoice: ['C = 2πr', 'C = πr²', 'C = 2r', 'C = πr']
    },
    {
      type: 'area_formula',
      cognitiveDomain: 'knowledge_recall',
      template: 'The formula for the area of a circle is:',
      params: {},
      solution: () => 0,
      hint: 'A = πr²',
      multipleChoice: ['A = πr²', 'A = 2πr', 'A = πd', 'A = r²']
    },
    {
      type: 'pi_approximation',
      cognitiveDomain: 'knowledge_recall',
      template: 'Pi (π) is approximately equal to:',
      params: {},
      solution: () => 0,
      hint: 'π ≈ 3.14',
      multipleChoice: ['3.14', '3.41', '2.14', '4.13']
    },
    {
      type: 'circle_pi_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Pi (π) represents the ratio of:',
      params: {},
      solution: () => 0,
      hint: 'π = circumference ÷ diameter',
      multipleChoice: ['Circumference to diameter', 'Area to radius', 'Diameter to radius', 'Radius to circumference']
    },
    {
      type: 'circle_basic_properties',
      cognitiveDomain: 'knowledge_recall',
      template: 'Which statement is TRUE about all circles?',
      params: {},
      solution: () => 0,
      hint: 'All points on a circle are equidistant from the center',
      multipleChoice: ['All radii have the same length', 'All circles have the same area', 'All diameters are perpendicular', 'All circles have radius = 1']
    }
  ],
  
  2: [
    {
      type: 'circumference_from_radius',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the circumference of a circle with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 3, max: 10 }
      },
      solution: (p) => 2 * Math.PI * p.radius,
      hint: 'C = 2πr'
    },
    {
      type: 'circumference_from_diameter',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the circumference of a circle with diameter {diameter} units. (Use π ≈ 3.14)',
      params: {
        diameter: { min: 6, max: 20 }
      },
      solution: (p) => Math.PI * p.diameter,
      hint: 'C = πd'
    },
    {
      type: 'area_from_radius',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the area of a circle with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 3, max: 10 }
      },
      solution: (p) => Math.PI * p.radius * p.radius,
      hint: 'A = πr²'
    },
    {
      type: 'area_from_diameter',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the area of a circle with diameter {diameter} units. (Use π ≈ 3.14)',
      params: {
        diameter: { min: 6, max: 20, step: 2 }
      },
      solution: (p) => Math.PI * (p.diameter / 2) * (p.diameter / 2),
      hint: 'First find radius, then A = πr²'
    },
    {
      type: 'radius_from_circumference',
      cognitiveDomain: 'problem_solving',
      template: 'A circle has circumference {c} units. What is its radius? (Use π ≈ 3.14)',
      params: {
        c: { min: 18, max: 62, step: 6 }
      },
      solution: (p) => p.c / (2 * Math.PI),
      hint: 'r = C / (2π)'
    },
    {
      type: 'circle_diameter_from_circumference',
      cognitiveDomain: 'procedural_skills',
      template: 'A circle has circumference {c} units. What is its diameter? (Use π ≈ 3.14)',
      params: {
        c: { min: 18, max: 62, step: 6 }
      },
      solution: (p) => p.c / Math.PI,
      hint: 'd = C / π'
    },
    {
      type: 'circle_compare_measurements',
      cognitiveDomain: 'analytical_thinking',
      template: 'Circle A has radius {r1} units and Circle B has radius {r2} units. How many times larger is the area of the larger circle compared to the smaller?',
      params: {
        r1: { min: 6, max: 10 },
        r2: { min: 2, max: 5 }
      },
      solution: (p) => (p.r1 * p.r1) / (p.r2 * p.r2),
      hint: 'Compare the areas: A₁/A₂ = r₁²/r₂²'
    }
  ],
  
  3: [
    {
      type: 'radius_from_area',
      cognitiveDomain: 'problem_solving',
      template: 'A circle has area {area} square units. What is its radius? (Use π ≈ 3.14)',
      params: {
        area: { min: 28, max: 314, step: 28 }
      },
      solution: (p) => Math.sqrt(p.area / Math.PI),
      hint: 'r = √(A / π)'
    },
    {
      type: 'circle_word_problem_circumference',
      cognitiveDomain: 'problem_solving',
      template: 'A circular track has radius {radius} meters. How far does someone run in one lap? (Use π ≈ 3.14)',
      params: {
        radius: { min: 20, max: 100, step: 10 }
      },
      solution: (p) => 2 * Math.PI * p.radius,
      hint: 'Distance = circumference'
    },
    {
      type: 'circle_word_problem_area',
      cognitiveDomain: 'problem_solving',
      template: 'A circular garden has radius {radius} meters. What is its area? (Use π ≈ 3.14)',
      params: {
        radius: { min: 5, max: 20 }
      },
      solution: (p) => Math.PI * p.radius * p.radius,
      hint: 'A = πr²'
    },
    {
      type: 'semicircle_perimeter',
      cognitiveDomain: 'problem_solving',
      template: 'Find the perimeter of a semicircle with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 4, max: 14 }
      },
      solution: (p) => Math.PI * p.radius + 2 * p.radius,
      hint: 'Perimeter = πr + 2r (curved part + diameter)'
    },
    {
      type: 'semicircle_area',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the area of a semicircle with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 4, max: 14 }
      },
      solution: (p) => 0.5 * Math.PI * p.radius * p.radius,
      hint: 'Area = ½πr²'
    },
    {
      type: 'circle_word_problem_wheel',
      cognitiveDomain: 'problem_solving',
      template: 'A bicycle wheel has a diameter of {diameter} cm. How many complete rotations does it make when the bicycle travels {distance} meters? (Use π ≈ 3.14)',
      params: {
        diameter: { min: 40, max: 80, step: 10 },
        distance: { min: 100, max: 300, step: 50 }
      },
      solution: (p) => (p.distance * 100) / (Math.PI * p.diameter),
      hint: 'Find wheel circumference in cm, convert distance to cm, divide: rotations = distance / circumference'
    },
    {
      type: 'circle_multiple_step_pizza',
      cognitiveDomain: 'problem_solving',
      template: 'A circular pizza has diameter {diameter} inches and costs ${cost}. What is the cost per square inch? (Use π ≈ 3.14)',
      params: {
        diameter: { min: 10, max: 16, step: 2 },
        cost: { min: 8, max: 16, step: 2 }
      },
      solution: (p) => p.cost / (Math.PI * (p.diameter / 2) * (p.diameter / 2)),
      hint: 'First find area using A = πr², then divide cost by area'
    }
  ],
  
  4: [
    {
      type: 'quarter_circle_area',
      cognitiveDomain: 'problem_solving',
      template: 'Find the area of a quarter circle with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 4, max: 16 }
      },
      solution: (p) => 0.25 * Math.PI * p.radius * p.radius,
      hint: 'Area = ¼πr²'
    },
    {
      type: 'annulus_area',
      cognitiveDomain: 'problem_solving',
      template: 'Find the area between two circles with radii {r1} and {r2} units. (Use π ≈ 3.14)',
      params: {
        r1: { min: 8, max: 14 },
        r2: { min: 4, max: 7 }
      },
      solution: (p) => Math.PI * (p.r1 * p.r1 - p.r2 * p.r2),
      hint: 'Area = π(R² - r²)'
    },
    {
      type: 'circle_sector_area',
      cognitiveDomain: 'problem_solving',
      template: 'Find the area of a sector with radius {radius} and central angle {angle}°. (Use π ≈ 3.14)',
      params: {
        radius: { min: 6, max: 12 },
        angle: { min: 60, max: 120, step: 30 }
      },
      solution: (p) => (p.angle / 360) * Math.PI * p.radius * p.radius,
      hint: 'Area = (θ/360) × πr²'
    },
    {
      type: 'arc_length',
      cognitiveDomain: 'problem_solving',
      template: 'Find the arc length for a central angle of {angle}° in a circle with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        angle: { min: 60, max: 180, step: 30 },
        radius: { min: 6, max: 15 }
      },
      solution: (p) => (p.angle / 360) * 2 * Math.PI * p.radius,
      hint: 'Arc length = (θ/360) × 2πr'
    },
    {
      type: 'circle_scale_factor',
      cognitiveDomain: 'analytical_thinking',
      template: 'If the radius of a circle is doubled, its area becomes:',
      params: {},
      solution: () => 0,
      hint: 'Area depends on r², so 2² = 4 times larger',
      multipleChoice: ['4 times larger', '2 times larger', '8 times larger', '16 times larger']
    },
    {
      type: 'circle_sector_perimeter',
      cognitiveDomain: 'analytical_thinking',
      template: 'A sector has radius {radius} units and central angle {angle}°. Find the perimeter of the sector. (Use π ≈ 3.14)',
      params: {
        radius: { min: 8, max: 16 },
        angle: { min: 60, max: 120, step: 30 }
      },
      solution: (p) => 2 * p.radius + (p.angle / 360) * 2 * Math.PI * p.radius,
      hint: 'Perimeter = 2r + arc length, where arc = (θ/360) × 2πr'
    },
    {
      type: 'circle_optimization_fence',
      cognitiveDomain: 'analytical_thinking',
      template: 'You have {fence} meters of fencing to enclose a circular garden. What is the maximum area you can enclose? (Use π ≈ 3.14)',
      params: {
        fence: { min: 60, max: 120, step: 20 }
      },
      solution: (p) => (p.fence * p.fence) / (4 * Math.PI),
      hint: 'Circumference = fence length. Find r = C/(2π), then A = πr²'
    }
  ]
};
