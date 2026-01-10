/**
 * Volume of Space Figures - Question Templates
 * Covers: cubes, rectangular prisms, cylinders, cones, pyramids, spheres
 */

module.exports = {
  1: [
    {
      type: 'volume_cube_basic',
      cognitiveDomain: 'knowledge_recall',
      template: 'A cube has sides of {side} units. What is its volume?',
      params: {
        side: { min: 2, max: 5 }
      },
      solution: (p) => p.side * p.side * p.side,
      hint: 'Volume = side³'
    },
    {
      type: 'volume_rectangular_prism_basic',
      cognitiveDomain: 'knowledge_recall',
      template: 'A box is {length} units long, {width} units wide, and {height} units tall. What is its volume?',
      params: {
        length: { min: 2, max: 6 },
        width: { min: 2, max: 5 },
        height: { min: 2, max: 4 }
      },
      solution: (p) => p.length * p.width * p.height,
      hint: 'Volume = length × width × height'
    },
    {
      type: 'volume_concept',
      cognitiveDomain: 'knowledge_recall',
      template: 'Volume measures:',
      params: {},
      solution: () => 0,
      hint: 'Volume tells us how much space is inside',
      multipleChoice: ['The space inside a 3D shape', 'The surface area', 'The perimeter', 'The distance around']
    },
    {
      type: 'volume_units',
      cognitiveDomain: 'knowledge_recall',
      template: 'Volume is measured in:',
      params: {},
      solution: () => 0,
      hint: 'Cubic units for 3D space',
      multipleChoice: ['Cubic units', 'Square units', 'Linear units', 'Degrees']
    },
    {
      type: 'volume_cube_visual',
      cognitiveDomain: 'concept_understanding',
      template: 'If a cube is made of {side} × {side} × {side} unit cubes, its total volume is:',
      params: {
        side: { min: 3, max: 5 }
      },
      solution: (p) => p.side * p.side * p.side,
      hint: 'Count all the unit cubes'
    }
  ],
  
  2: [
    {
      type: 'volume_cube',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the volume of a cube with side length {side} units.',
      params: {
        side: { min: 3, max: 10 }
      },
      solution: (p) => p.side * p.side * p.side,
      hint: 'Volume = side³'
    },
    {
      type: 'volume_rectangular_prism_simple',
      cognitiveDomain: 'procedural_skills',
      template: 'A box is {length} units long, {width} units wide, and {height} units tall. What is its volume?',
      params: {
        length: { min: 4, max: 10 },
        width: { min: 3, max: 8 },
        height: { min: 2, max: 7 }
      },
      solution: (p) => p.length * p.width * p.height,
      hint: 'Volume = length × width × height'
    },
    {
      type: 'volume_cylinder_basic',
      cognitiveDomain: 'procedural_skills',
      template: 'A cylinder has radius {radius} units and height {height} units. Find its volume. (Use π ≈ 3.14)',
      params: {
        radius: { min: 3, max: 8 },
        height: { min: 4, max: 10 }
      },
      solution: (p) => Math.PI * p.radius * p.radius * p.height,
      hint: 'Volume = π × r² × h'
    },
    {
      type: 'volume_prism_word',
      cognitiveDomain: 'problem_solving',
      template: 'A storage container is {length}m long, {width}m wide, and {height}m tall. How many cubic meters can it hold?',
      params: {
        length: { min: 3, max: 8 },
        width: { min: 2, max: 6 },
        height: { min: 2, max: 5 }
      },
      solution: (p) => p.length * p.width * p.height,
      hint: 'Calculate the volume'
    },
    {
      type: 'volume_comparison',
      cognitiveDomain: 'analytical_thinking',
      template: 'If you double the side length of a cube, its volume becomes:',
      params: {},
      solution: () => 0,
      hint: 'Volume depends on side³, so 2³ = 8 times larger',
      multipleChoice: ['8 times larger', '2 times larger', '4 times larger', '6 times larger']
    }
  ],
  
  3: [
    {
      type: 'volume_rectangular_prism',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the volume of a rectangular prism with length {length}, width {width}, and height {height} units.',
      params: {
        length: { min: 5, max: 15 },
        width: { min: 4, max: 12 },
        height: { min: 3, max: 10 }
      },
      solution: (p) => p.length * p.width * p.height,
      hint: 'Volume = length × width × height'
    },
    {
      type: 'volume_cylinder',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the volume of a cylinder with radius {radius} units and height {height} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 4, max: 10 },
        height: { min: 6, max: 15 }
      },
      solution: (p) => Math.PI * p.radius * p.radius * p.height,
      hint: 'Volume = π × r² × h'
    },
    {
      type: 'volume_pyramid_intro',
      cognitiveDomain: 'concept_understanding',
      template: 'The volume of a pyramid is what fraction of a prism with the same base and height?',
      params: {},
      solution: () => 0,
      hint: 'A pyramid is one-third of a prism',
      multipleChoice: ['One-third', 'One-half', 'Two-thirds', 'Equal']
    },
    {
      type: 'volume_cone_intro',
      cognitiveDomain: 'concept_understanding',
      template: 'The volume of a cone is what fraction of a cylinder with the same base and height?',
      params: {},
      solution: () => 0,
      hint: 'A cone is one-third of a cylinder',
      multipleChoice: ['One-third', 'One-half', 'Two-thirds', 'Equal']
    },
    {
      type: 'volume_sphere_intro',
      cognitiveDomain: 'knowledge_recall',
      template: 'The volume of a sphere with radius r is:',
      params: {},
      solution: () => 0,
      hint: 'Remember the formula (4/3)πr³',
      multipleChoice: ['(4/3)πr³', 'πr³', '(2/3)πr³', '4πr³']
    }
  ],
  
  4: [
    {
      type: 'volume_word_problem',
      cognitiveDomain: 'problem_solving',
      template: 'A water tank is {length}m long, {width}m wide, and {height}m tall. If it is filled to 75% capacity, how many cubic meters of water does it contain?',
      params: {
        length: { min: 3, max: 8 },
        width: { min: 2, max: 6 },
        height: { min: 2, max: 5 }
      },
      solution: (p) => p.length * p.width * p.height * 0.75,
      hint: 'Calculate volume, then multiply by 0.75'
    },
    {
      type: 'volume_pyramid',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the volume of a square pyramid with base side {base} units and height {height} units.',
      params: {
        base: { min: 6, max: 14 },
        height: { min: 8, max: 16 }
      },
      solution: (p) => (1/3) * p.base * p.base * p.height,
      hint: 'Volume = ⅓ × base² × height'
    },
    {
      type: 'volume_cone',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the volume of a cone with radius {radius} units and height {height} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 5, max: 12 },
        height: { min: 9, max: 18 }
      },
      solution: (p) => (1/3) * Math.PI * p.radius * p.radius * p.height,
      hint: 'Volume = ⅓ × π × r² × h'
    },
    {
      type: 'volume_sphere',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the volume of a sphere with radius {radius} units. (Use π ≈ 3.14)',
      params: {
        radius: { min: 3, max: 9 }
      },
      solution: (p) => (4/3) * Math.PI * p.radius * p.radius * p.radius,
      hint: 'Volume = (4/3) × π × r³'
    },
    {
      type: 'volume_cylinder_word',
      cognitiveDomain: 'problem_solving',
      template: 'A cylindrical water tank has radius {radius} meters and height {height} meters. How many cubic meters of water can it hold? (Use π ≈ 3.14)',
      params: {
        radius: { min: 3, max: 8 },
        height: { min: 5, max: 12 }
      },
      solution: (p) => Math.PI * p.radius * p.radius * p.height,
      hint: 'Volume = π × r² × h'
    }
  ]
};
