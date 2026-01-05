/**
 * QuestionGeneratorService
 * Generates parametric questions with random values for adaptive learning
 * 
 * Instead of storing thousands of questions, we store templates and generate
 * unique variations on-the-fly with different numbers/parameters.
 * 
 * Supports 6 Cognitive Domains based on Bloom's Taxonomy:
 * - KR (Knowledge Recall): Basic definitions and facts
 * - CU (Concept Understanding): Relationships and classifications
 * - PS (Procedural Skills): Computations and algorithms
 * - AT (Analytical Thinking): Patterns, logic, multi-step reasoning
 * - PS+ (Problem Solving): Real-world applications
 * - HOT (Higher Order Thinking): Creative and complex reasoning
 */

class QuestionGeneratorService {
  constructor() {
    // Cognitive domain constants
    this.COGNITIVE_DOMAINS = {
      KR: 'knowledge_recall',        // Basic facts and formulas
      CU: 'concept_understanding',   // Relationships between concepts
      PS: 'procedural_skills',       // Step-by-step calculations
      AT: 'analytical_thinking',     // Multi-step reasoning
      PSP: 'problem_solving',        // Real-world applications
      HOT: 'higher_order_thinking'   // Creative/complex reasoning
    };

    // Define question templates by difficulty level
    // Each template now includes cognitive domain metadata
    this.templates = {
      // DIFFICULTY 1: Very Easy - Basic shapes, single-step
      1: [
        {
          type: 'rectangle_area',
          cognitiveDomain: 'knowledge_recall',
          template: 'Calculate the area of a rectangle with width {width} units and height {height} units.',
          params: {
            width: { min: 3, max: 10 },
            height: { min: 3, max: 10 }
          },
          solution: (p) => p.width * p.height,
          hint: 'Area = Width × Height'
        },
        {
          type: 'square_perimeter',
          cognitiveDomain: 'knowledge_recall',
          template: 'Find the perimeter of a square with side length {side} units.',
          params: {
            side: { min: 4, max: 12 }
          },
          solution: (p) => 4 * p.side,
          hint: 'Perimeter = 4 × side'
        },
        {
          type: 'circle_area',
          cognitiveDomain: 'procedural_skills',
          template: 'Calculate the area of a circle with radius {radius} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 2, max: 8 }
          },
          solution: (p) => Math.PI * p.radius * p.radius,
          hint: 'Area = π × r²'
        },
        {
          type: 'identify_lines',
          cognitiveDomain: 'knowledge_recall',
          template: 'What type of lines never meet and are always the same distance apart?',
          params: {},
          solution: () => 0, // Parallel lines (index 0)
          hint: 'Think about train tracks - they never cross',
          multipleChoice: ['Parallel', 'Perpendicular', 'Intersecting', 'Skew']
        },
        {
          type: 'angle_type',
          cognitiveDomain: 'knowledge_recall',
          template: 'An angle measuring {angle}° is what type of angle?',
          params: {
            angle: { min: 35, max: 85 }
          },
          solution: (p) => p.angle < 90 ? 0 : 1, // Acute or right
          hint: 'Acute: 0-90°, Right: 90°, Obtuse: 90-180°',
          multipleChoice: ['Acute', 'Right', 'Obtuse', 'Straight']
        },
        {
          type: 'circle_parts',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the line segment from the center of a circle to any point on the circle called?',
          params: {},
          solution: () => 0, // Radius
          hint: 'It starts at the center',
          multipleChoice: ['Radius', 'Diameter', 'Chord', 'Arc']
        },
        {
          type: 'polygon_identify',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is a polygon with {sides} sides called?',
          params: {
            sides: { min: 3, max: 8 }
          },
          solution: (p) => {
            const names = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon' };
            return names[p.sides];
          },
          hint: 'Count the number of sides'
        },
        {
          type: 'plane_vs_solid',
          cognitiveDomain: 'concept_understanding',
          template: 'Is a circle a plane figure or a solid figure?',
          params: {},
          solution: () => 0, // Plane
          hint: 'Does it have depth/thickness?',
          multipleChoice: ['Plane figure', 'Solid figure']
        },
        {
          type: 'polygon_interior_triangle',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the sum of the interior angles of a triangle?',
          params: {},
          solution: () => 180,
          hint: 'All triangles have the same angle sum'
        },
        {
          type: 'polygon_interior_quadrilateral',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the sum of the interior angles of any quadrilateral (4-sided polygon)?',
          params: {},
          solution: () => 360,
          hint: 'Think of a square or rectangle - their angles add to this'
        },
        {
          type: 'polygon_types_sides',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many sides does a hexagon have?',
          params: {},
          solution: () => 6,
          hint: 'Hex- means six'
        },
        {
          type: 'polygon_types_triangle',
          cognitiveDomain: 'knowledge_recall',
          template: 'Which polygon has exactly 3 sides and 3 angles?',
          params: {},
          solution: () => 0,
          hint: 'Tri- means three',
          multipleChoice: ['Triangle', 'Square', 'Pentagon', 'Hexagon']
        },
        // Points, Lines, and Planes - Foundational concepts
        {
          type: 'point_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'Which geometric term represents an exact location in space with no size or dimensions?',
          params: {},
          solution: () => 0,
          hint: 'It has no length, width, or height - just position',
          multipleChoice: ['Point', 'Line', 'Plane', 'Ray']
        },
        {
          type: 'line_segment_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is a part of a line with two endpoints called?',
          params: {},
          solution: () => 0,
          hint: 'It has a definite beginning and end',
          multipleChoice: ['Line segment', 'Ray', 'Line', 'Plane']
        },
        {
          type: 'ray_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is a part of a line that starts at one point and extends infinitely in one direction?',
          params: {},
          solution: () => 0,
          hint: 'It has one endpoint and goes on forever in one direction',
          multipleChoice: ['Ray', 'Line segment', 'Line', 'Angle']
        },
        {
          type: 'plane_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is a flat surface that extends infinitely in all directions called?',
          params: {},
          solution: () => 0,
          hint: 'Think of a tabletop that goes on forever',
          multipleChoice: ['Plane', 'Line', 'Point', 'Space']
        },
        // Kinds of Angles - Basic recognition
        {
          type: 'acute_angle',
          cognitiveDomain: 'knowledge_recall',
          template: 'What type of angle measures less than 90°?',
          params: {},
          solution: () => 0,
          hint: 'It\'s smaller than a right angle',
          multipleChoice: ['Acute angle', 'Right angle', 'Obtuse angle', 'Straight angle']
        },
        {
          type: 'right_angle',
          cognitiveDomain: 'knowledge_recall',
          template: 'What type of angle measures exactly 90°?',
          params: {},
          solution: () => 0,
          hint: 'It forms a perfect corner',
          multipleChoice: ['Right angle', 'Acute angle', 'Obtuse angle', 'Reflex angle']
        },
        {
          type: 'obtuse_angle',
          cognitiveDomain: 'knowledge_recall',
          template: 'An angle that measures between 90° and 180° is called:',
          params: {},
          solution: () => 0,
          hint: 'It\'s larger than a right angle but not straight',
          multipleChoice: ['Obtuse angle', 'Acute angle', 'Right angle', 'Reflex angle']
        },
        // Plane and 3D Figures - Basic identification
        {
          type: 'identify_plane_figure',
          cognitiveDomain: 'knowledge_recall',
          template: 'Which of these is a plane figure (2D shape)?',
          params: {},
          solution: () => 0,
          hint: 'It has no thickness or depth',
          multipleChoice: ['Triangle', 'Cube', 'Sphere', 'Cylinder']
        },
        {
          type: 'identify_solid_figure',
          cognitiveDomain: 'knowledge_recall',
          template: 'Which of these is a solid figure (3D shape)?',
          params: {},
          solution: () => 0,
          hint: 'It has length, width, AND height',
          multipleChoice: ['Cube', 'Circle', 'Triangle', 'Rectangle']
        }
      ],

      // DIFFICULTY 2: Easy - Simple multi-step
      2: [
        // Points, Lines, and Planes - Basic understanding
        {
          type: 'collinear_points',
          cognitiveDomain: 'concept_understanding',
          template: 'Points that lie on the same line are called:',
          params: {},
          solution: () => 0,
          hint: 'Col- means together, linear means line',
          multipleChoice: ['Collinear', 'Coplanar', 'Concurrent', 'Perpendicular']
        },
        {
          type: 'coplanar_points',
          cognitiveDomain: 'concept_understanding',
          template: 'Points that lie on the same plane are called:',
          params: {},
          solution: () => 0,
          hint: 'Co- means together, planar means plane',
          multipleChoice: ['Coplanar', 'Collinear', 'Concurrent', 'Parallel']
        },
        {
          type: 'line_naming',
          cognitiveDomain: 'knowledge_recall',
          template: 'A line passing through points A and B can be written as:',
          params: {},
          solution: () => 0,
          hint: 'Use both endpoint names with a line symbol',
          multipleChoice: ['Line AB or Line BA', 'Ray AB', 'Segment AB', 'Angle AB']
        },
        {
          type: 'rectangle_perimeter',
          cognitiveDomain: 'procedural_skills',
          template: 'A rectangle has length {length} units and width {width} units. Find its perimeter.',
          params: {
            length: { min: 8, max: 20 },
            width: { min: 5, max: 15 }
          },
          solution: (p) => 2 * (p.length + p.width),
          hint: 'Perimeter = 2 × (length + width)'
        },
        {
          type: 'triangle_area',
          cognitiveDomain: 'concept_understanding',
          template: 'Calculate the area of a triangle with base {base} units and height {height} units.',
          params: {
            base: { min: 6, max: 16 },
            height: { min: 4, max: 12 }
          },
          solution: (p) => 0.5 * p.base * p.height,
          hint: 'Area = ½ × base × height'
        },
        {
          type: 'circle_circumference',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the circumference of a circle with radius {radius} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 5, max: 15 }
          },
          solution: (p) => 2 * Math.PI * p.radius,
          hint: 'Circumference = 2 × π × r'
        },
        {
          type: 'complementary_angles',
          cognitiveDomain: 'procedural_skills',
          template: 'Two angles are complementary. If one angle is {angle}°, what is the other angle?',
          params: {
            angle: { min: 20, max: 70 }
          },
          solution: (p) => 90 - p.angle,
          hint: 'Complementary angles sum to 90°'
        },
        {
          type: 'supplementary_angles',
          cognitiveDomain: 'procedural_skills',
          template: 'Two angles are supplementary. If one angle is {angle}°, what is the other angle?',
          params: {
            angle: { min: 40, max: 140 }
          },
          solution: (p) => 180 - p.angle,
          hint: 'Supplementary angles sum to 180°'
        },
        // Kinds of Angles - Measurement and construction
        {
          type: 'angle_measurement',
          cognitiveDomain: 'concept_understanding',
          template: 'If an angle measures {angle}°, how many degrees does its complement measure?',
          params: {
            angle: { min: 15, max: 75 }
          },
          solution: (p) => 90 - p.angle,
          hint: 'Complementary angles add up to 90°'
        },
        {
          type: 'straight_angle',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the measure of a straight angle?',
          params: {},
          solution: () => 180,
          hint: 'It forms a straight line'
        },
        // Plane and 3D Figures - Properties
        {
          type: 'solid_figure_properties',
          cognitiveDomain: 'concept_understanding',
          template: 'How many faces does a cube have?',
          params: {},
          solution: () => 6,
          hint: 'Count all the square surfaces'
        },
        {
          type: 'plane_figure_properties',
          cognitiveDomain: 'concept_understanding',
          template: 'A square has how many sides?',
          params: {},
          solution: () => 4,
          hint: 'All sides are equal length'
        },
        {
          type: 'parallelogram_area',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the area of a parallelogram with base {base} units and height {height} units.',
          params: {
            base: { min: 8, max: 18 },
            height: { min: 5, max: 12 }
          },
          solution: (p) => p.base * p.height,
          hint: 'Area = base × height'
        },
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
          type: 'surface_area_cube',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the surface area of a cube with side length {side} units.',
          params: {
            side: { min: 4, max: 12 }
          },
          solution: (p) => 6 * p.side * p.side,
          hint: 'Surface Area = 6 × side²'
        },
        {
          type: 'polygon_interior_pentagon',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the sum of interior angles of a pentagon (5-sided polygon).',
          params: {},
          solution: () => (5 - 2) * 180,
          hint: 'Sum = (n - 2) × 180°, where n = number of sides'
        },
        {
          type: 'polygon_interior_hexagon',
          cognitiveDomain: 'procedural_skills',
          template: 'Calculate the sum of interior angles of a hexagon (6-sided polygon).',
          params: {},
          solution: () => (6 - 2) * 180,
          hint: 'Use the formula: (n - 2) × 180°'
        }
      ],

      // DIFFICULTY 3: Medium - Multiple concepts
      3: [
        // Kinds of Angles - Special angle pairs
        {
          type: 'vertical_angles',
          cognitiveDomain: 'concept_understanding',
          template: 'Two intersecting lines form vertical angles. If one angle is {angle}°, what is the measure of its vertical angle?',
          params: {
            angle: { min: 35, max: 145 }
          },
          solution: (p) => p.angle,
          hint: 'Vertical angles are always equal'
        },
        {
          type: 'adjacent_angles',
          cognitiveDomain: 'concept_understanding',
          template: 'Two adjacent angles on a straight line measure {angle1}° and x°. Find x.',
          params: {
            angle1: { min: 40, max: 140 }
          },
          solution: (p) => 180 - p.angle1,
          hint: 'Adjacent angles on a straight line are supplementary'
        },
        // Plane and 3D Figures - Comparison
        {
          type: 'solid_vs_plane_comparison',
          cognitiveDomain: 'analytical_thinking',
          template: 'A cylinder has a circular base. What is the 2D plane figure that represents this base?',
          params: {},
          solution: () => 0,
          hint: 'Look at the flat surface at the bottom',
          multipleChoice: ['Circle', 'Square', 'Rectangle', 'Triangle']
        },
        // Word Problems - Basic applications
        {
          type: 'area_word_problem',
          cognitiveDomain: 'problem_solving',
          template: 'A rectangular garden is {length} meters long and {width} meters wide. How many square meters of grass seed are needed to cover it?',
          params: {
            length: { min: 8, max: 20 },
            width: { min: 5, max: 15 }
          },
          solution: (p) => p.length * p.width,
          hint: 'Calculate the area of the rectangle'
        },
        {
          type: 'perimeter_word_problem',
          cognitiveDomain: 'problem_solving',
          template: 'A fence is being built around a rectangular field {length} meters by {width} meters. How many meters of fencing are needed?',
          params: {
            length: { min: 15, max: 40 },
            width: { min: 10, max: 30 }
          },
          solution: (p) => 2 * (p.length + p.width),
          hint: 'Calculate the perimeter'
        },
        // Geometric Reasoning - Simple proofs
        {
          type: 'angle_proof_simple',
          cognitiveDomain: 'analytical_thinking',
          template: 'If two parallel lines are cut by a transversal, and one angle is {angle}°, what is the corresponding angle?',
          params: {
            angle: { min: 40, max: 140 }
          },
          solution: (p) => p.angle,
          hint: 'Corresponding angles are equal when lines are parallel'
        },
        {
          type: 'triangle_angle_sum',
          cognitiveDomain: 'analytical_thinking',
          template: 'In a triangle, two angles measure {angle1}° and {angle2}°. Find the third angle.',
          params: {
            angle1: { min: 30, max: 80 },
            angle2: { min: 40, max: 90 }
          },
          solution: (p) => 180 - p.angle1 - p.angle2,
          hint: 'The sum of angles in a triangle is 180°'
        },
        // Points, Lines, and Planes - Application
        {
          type: 'intersecting_lines',
          cognitiveDomain: 'concept_understanding',
          template: 'When two lines cross at exactly one point, they are called:',
          params: {},
          solution: () => 0,
          hint: 'They intersect or meet at a point',
          multipleChoice: ['Intersecting lines', 'Parallel lines', 'Skew lines', 'Perpendicular lines']
        },
        {
          type: 'perpendicular_lines',
          cognitiveDomain: 'concept_understanding',
          template: 'Two lines that intersect at a 90° angle are called:',
          params: {},
          solution: () => 0,
          hint: 'They form right angles',
          multipleChoice: ['Perpendicular lines', 'Parallel lines', 'Intersecting lines', 'Skew lines']
        },
        {
          type: 'skew_lines',
          cognitiveDomain: 'concept_understanding',
          template: 'Lines that do not intersect and are not parallel (not in the same plane) are called:',
          params: {},
          solution: () => 0,
          hint: 'They exist in 3D space and never meet',
          multipleChoice: ['Skew lines', 'Parallel lines', 'Perpendicular lines', 'Intersecting lines']
        },
        {
          type: 'line_segment_notation',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many points are needed to define a unique line?',
          params: {},
          solution: () => 2,
          hint: 'You need at least this many points to draw a straight line',
          multipleChoice: [1, 2, 3, 4]
        },
        {
          type: 'composite_area',
          cognitiveDomain: 'analytical_thinking',
          template: 'A shape consists of a rectangle (length {length}, width {width}) with a semicircle on top (diameter = width). Find the total area.',
          params: {
            length: { min: 10, max: 20 },
            width: { min: 8, max: 16 }
          },
          solution: (p) => {
            const rectArea = p.length * p.width;
            const radius = p.width / 2;
            const semicircleArea = 0.5 * Math.PI * radius * radius;
            return rectArea + semicircleArea;
          },
          hint: 'Total Area = Rectangle Area + Semicircle Area'
        },
        {
          type: 'pythagorean',
          cognitiveDomain: 'concept_understanding',
          template: 'A right triangle has legs of length {a} units and {b} units. Find the length of the hypotenuse.',
          params: {
            a: { min: 3, max: 12 },
            b: { min: 4, max: 12 }
          },
          solution: (p) => Math.sqrt(p.a * p.a + p.b * p.b),
          hint: 'Use Pythagorean theorem: c² = a² + b²'
        },
        {
          type: 'trapezoid_area',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the area of a trapezoid with parallel sides {base1} and {base2} units, and height {height} units.',
          params: {
            base1: { min: 8, max: 16 },
            base2: { min: 12, max: 20 },
            height: { min: 6, max: 12 }
          },
          solution: (p) => 0.5 * (p.base1 + p.base2) * p.height,
          hint: 'Area = ½ × (base₁ + base₂) × height'
        },
        {
          type: 'polygon_interior_angles',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the sum of interior angles of a {sides}-sided polygon.',
          params: {
            sides: { min: 5, max: 10 }
          },
          solution: (p) => (p.sides - 2) * 180,
          hint: 'Sum = (n - 2) × 180°'
        },
        {
          type: 'congruent_angles',
          cognitiveDomain: 'concept_understanding',
          template: 'Angle A measures {angle}°. Angle B is congruent to Angle A. What is the measure of Angle B?',
          params: {
            angle: { min: 25, max: 155 }
          },
          solution: (p) => p.angle,
          hint: 'Congruent angles have equal measures'
        },
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
          type: 'surface_area_rectangular_prism',
          cognitiveDomain: 'analytical_thinking',
          template: 'Find the surface area of a rectangular prism with length {length}, width {width}, and height {height} units.',
          params: {
            length: { min: 6, max: 14 },
            width: { min: 5, max: 12 },
            height: { min: 4, max: 10 }
          },
          solution: (p) => 2 * (p.length * p.width + p.length * p.height + p.width * p.height),
          hint: 'SA = 2(lw + lh + wh)'
        }
      ],

      // DIFFICULTY 4: Hard - Advanced reasoning
      4: [
        // Kinds of Angles - Complex relationships
        {
          type: 'angle_bisector',
          cognitiveDomain: 'analytical_thinking',
          template: 'A {angle}° angle is bisected. What is the measure of each resulting angle?',
          params: {
            angle: { min: 60, max: 160 }
          },
          solution: (p) => p.angle / 2,
          hint: 'Bisecting divides the angle into two equal parts'
        },
        // Plane and 3D - Advanced surface area
        {
          type: 'composite_solid_surface',
          cognitiveDomain: 'analytical_thinking',
          template: 'A rectangular prism ({length} × {width} × {height}) has a square pyramid on top (base = width). Find the total surface area.',
          params: {
            length: { min: 6, max: 12 },
            width: { min: 6, max: 12 },
            height: { min: 4, max: 10 }
          },
          solution: (p) => {
            // Bottom + 4 sides of prism + 4 triangular faces of pyramid (minus top of prism)
            const bottom = p.length * p.width;
            const front_back = 2 * p.length * p.height;
            const left_right = 2 * p.width * p.height;
            return bottom + front_back + left_right; // Simplified - pyramid faces would need slant height
          },
          hint: 'Add surface areas of both shapes, subtract overlapping top'
        },
        // Word Problems - Multi-step
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
        // Geometric Reasoning - Proofs
        {
          type: 'triangle_inequality',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A triangle has sides of {side1} and {side2} units. What is the MAXIMUM possible integer length of the third side?',
          params: {
            side1: { min: 5, max: 12 },
            side2: { min: 6, max: 14 }
          },
          solution: (p) => p.side1 + p.side2 - 1,
          hint: 'Triangle inequality: sum of two sides must be greater than the third'
        },
        {
          type: 'quadrilateral_angles',
          cognitiveDomain: 'analytical_thinking',
          template: 'In a quadrilateral, three angles measure {a1}°, {a2}°, and {a3}°. Find the fourth angle.',
          params: {
            a1: { min: 60, max: 110 },
            a2: { min: 70, max: 120 },
            a3: { min: 50, max: 100 }
          },
          solution: (p) => 360 - p.a1 - p.a2 - p.a3,
          hint: 'Angles in a quadrilateral sum to 360°'
        },
        {
          type: 'similar_triangles',
          cognitiveDomain: 'analytical_thinking',
          template: 'Two similar triangles have corresponding sides in ratio {ratio}:1. If the smaller triangle has area {smallArea} square units, find the area of the larger triangle.',
          params: {
            ratio: { min: 2, max: 4 },
            smallArea: { min: 10, max: 30 }
          },
          solution: (p) => p.smallArea * p.ratio * p.ratio,
          hint: 'Area ratio = (side ratio)²'
        },
        {
          type: 'circle_sector',
          cognitiveDomain: 'problem_solving',
          template: 'Find the area of a circular sector with radius {radius} units and central angle {angle}°.',
          params: {
            radius: { min: 8, max: 15 },
            angle: { min: 60, max: 180 }
          },
          solution: (p) => (p.angle / 360) * Math.PI * p.radius * p.radius,
          hint: 'Sector Area = (angle/360) × πr²'
        },
        {
          type: 'annulus_area',
          cognitiveDomain: 'analytical_thinking',
          template: 'Find the area between two concentric circles with outer radius {outer} units and inner radius {inner} units.',
          params: {
            outer: { min: 10, max: 20 },
            inner: { min: 5, max: 10 }
          },
          solution: (p) => Math.PI * (p.outer * p.outer - p.inner * p.inner),
          hint: 'Area = π(R² - r²)'
        },
        {
          type: 'similar_congruent_polygons',
          cognitiveDomain: 'concept_understanding',
          template: 'Two squares have sides {side1} units and {side2} units. Are they similar, congruent, or both?',
          params: {
            side1: { min: 5, max: 10 },
            side2: { min: 5, max: 10 }
          },
          solution: (p) => {
            if (p.side1 === p.side2) return 2; // Both
            return 0; // Similar only
          },
          hint: 'Congruent = same size and shape, Similar = same shape, different size',
          multipleChoice: ['Similar only', 'Congruent only', 'Both similar and congruent', 'Neither']
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
          type: 'surface_area_cylinder',
          cognitiveDomain: 'analytical_thinking',
          template: 'Find the surface area of a cylinder with radius {radius} units and height {height} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 4, max: 10 },
            height: { min: 8, max: 16 }
          },
          solution: (p) => 2 * Math.PI * p.radius * (p.radius + p.height),
          hint: 'SA = 2πr(r + h)'
        }
      ],

      // DIFFICULTY 5: Very Hard - Complex problems
      5: [
        // Kinds of Angles - Complex angle relationships
        {
          type: 'reflex_angle',
          cognitiveDomain: 'higher_order_thinking',
          template: 'An angle and its reflex angle together form a complete rotation. If the smaller angle is {angle}°, what is the reflex angle?',
          params: {
            angle: { min: 45, max: 180 }
          },
          solution: (p) => 360 - p.angle,
          hint: 'Reflex angle + regular angle = 360°'
        },
        // Word Problems - Complex multi-step
        {
          type: 'optimization_word_problem',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A rectangular swimming pool is {length}m long and {width}m wide. A 2-meter wide walkway surrounds it. What is the area of the walkway?',
          params: {
            length: { min: 10, max: 20 },
            width: { min: 6, max: 12 }
          },
          solution: (p) => ((p.length + 4) * (p.width + 4)) - (p.length * p.width),
          hint: 'Total area with walkway - pool area'
        },
        {
          type: 'scale_factor_word_problem',
          cognitiveDomain: 'problem_solving',
          template: 'A scale model of a building is {ratio}:1. If the model is {modelHeight}cm tall, how many meters tall is the actual building?',
          params: {
            ratio: { min: 100, max: 500 },
            modelHeight: { min: 20, max: 80 }
          },
          solution: (p) => (p.modelHeight * p.ratio) / 100,
          hint: 'Multiply by ratio, convert cm to meters'
        },
        // Geometric Reasoning - Advanced proofs
        {
          type: 'prove_parallel_lines',
          cognitiveDomain: 'higher_order_thinking',
          template: 'Two lines are cut by a transversal. Alternate interior angles measure {angle}° and {angle}°. Are the lines parallel?',
          params: {
            angle: { min: 45, max: 135 }
          },
          solution: () => 0,
          hint: 'Equal alternate interior angles mean lines are parallel',
          multipleChoice: ['Yes', 'No', 'Cannot determine', 'Only if both are acute']
        },
        {
          type: 'exterior_angle_theorem',
          cognitiveDomain: 'analytical_thinking',
          template: 'In a triangle, two interior angles are {a1}° and {a2}°. What is the exterior angle at the third vertex?',
          params: {
            a1: { min: 30, max: 80 },
            a2: { min: 40, max: 90 }
          },
          solution: (p) => p.a1 + p.a2,
          hint: 'Exterior angle = sum of the two non-adjacent interior angles'
        },
        {
          type: 'isosceles_triangle_proof',
          cognitiveDomain: 'higher_order_thinking',
          template: 'An isosceles triangle has a vertex angle of {vertex}°. What is the measure of each base angle?',
          params: {
            vertex: { min: 40, max: 120 }
          },
          solution: (p) => (180 - p.vertex) / 2,
          hint: 'Base angles are equal; sum of all angles = 180°'
        },
        // Plane and 3D - Complex calculations
        {
          type: 'nets_of_solids',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A cube has edge length {edge} units. If its net is laid flat, what is the total area of the net?',
          params: {
            edge: { min: 5, max: 15 }
          },
          solution: (p) => 6 * p.edge * p.edge,
          hint: 'A cube has 6 square faces'
        },
        {
          type: 'volume_composite',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A cylindrical tank (radius {radius} units, height {height} units) is topped with a hemisphere. Find the total volume.',
          params: {
            radius: { min: 5, max: 12 },
            height: { min: 10, max: 25 }
          },
          solution: (p) => {
            const cylinder = Math.PI * p.radius * p.radius * p.height;
            const hemisphere = (2/3) * Math.PI * p.radius * p.radius * p.radius;
            return cylinder + hemisphere;
          },
          hint: 'Volume = Cylinder + Hemisphere'
        },
        {
          type: 'optimization',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A rectangle is inscribed in a circle of radius {radius} units. If the rectangle has width {width} units, find its area.',
          params: {
            radius: { min: 10, max: 15 },
            width: { min: 12, max: 20 }
          },
          solution: (p) => {
            const diameter = 2 * p.radius;
            const height = Math.sqrt(diameter * diameter - p.width * p.width);
            return p.width * height;
          },
          hint: 'Diagonal of rectangle = Diameter of circle'
        },
        {
          type: 'volume_sphere',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the volume of a sphere with radius {radius} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 6, max: 15 }
          },
          solution: (p) => (4/3) * Math.PI * p.radius * p.radius * p.radius,
          hint: 'Volume = ⅘ × π × r³'
        },
        {
          type: 'surface_area_sphere',
          cognitiveDomain: 'procedural_skills',
          template: 'Find the surface area of a sphere with radius {radius} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 7, max: 16 }
          },
          solution: (p) => 4 * Math.PI * p.radius * p.radius,
          hint: 'SA = 4πr²'
        },
        {
          type: 'surface_area_cone',
          cognitiveDomain: 'analytical_thinking',
          template: 'Find the surface area of a cone with radius {radius} units and slant height {slant} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 5, max: 12 },
            slant: { min: 10, max: 20 }
          },
          solution: (p) => Math.PI * p.radius * (p.radius + p.slant),
          hint: 'SA = πr(r + l) where l is slant height'
        },
        {
          type: 'missing_angle_word_problem',
          cognitiveDomain: 'problem_solving',
          template: 'Two complementary angles differ by {difference}°. What is the measure of the larger angle?',
          params: {
            difference: { min: 20, max: 60 }
          },
          solution: (p) => (90 + p.difference) / 2,
          hint: 'Let angles be x and (x + difference). They sum to 90°'
        }
      ]
    };
  }

  /**
   * Generate a random question at specified difficulty level
   */
  generateQuestion(difficultyLevel, chapterId, seed = null, cognitiveDomain = null, representationType = 'text', topicFilter = null) {
    console.log(`[QGen] START - difficulty: ${difficultyLevel}, cognitive: ${cognitiveDomain}, filter: ${topicFilter}`);
    
    const templates = this.templates[difficultyLevel];
    if (!templates || templates.length === 0) {
      throw new Error(`No templates available for difficulty ${difficultyLevel}`);
    }
    console.log(`[QGen] Found ${templates.length} templates for difficulty ${difficultyLevel}`);

    // Filter by topic if specified (e.g., "polygon_interior" matches "polygon_interior_angles")
    let filteredTemplates = templates;
    if (topicFilter) {
      filteredTemplates = templates.filter(t => t.type.includes(topicFilter) || new RegExp(topicFilter).test(t.type));
      console.log(`[QuestionGenerator] Topic filter "${topicFilter}" reduced templates from ${templates.length} to ${filteredTemplates.length}`);
      if (filteredTemplates.length === 0) {
        console.warn(`No templates found for topic filter "${topicFilter}" at difficulty ${difficultyLevel}, using all templates`);
        filteredTemplates = templates;
      }
    }
    
    // Filter by cognitive domain if specified
    if (cognitiveDomain && filteredTemplates.length > 1) {
      console.log(`[QGen] Filtering by cognitive domain: ${cognitiveDomain}`);
      const domainFiltered = filteredTemplates.filter(t => t.cognitiveDomain === cognitiveDomain);
      if (domainFiltered.length > 0) {
        filteredTemplates = domainFiltered;
        console.log(`[QGen] Domain filter reduced to ${domainFiltered.length} templates`);
      } else {
        console.warn(`No templates found for domain ${cognitiveDomain}, using topic-filtered templates`);
      }
    }

    console.log(`[QGen] Selecting from ${filteredTemplates.length} filtered templates`);
    // Select random template from filtered set
    const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
    console.log(`[QGen] Selected template type: ${template.type}`);

    // Generate random parameters
    console.log(`[QGen] Generating parameters...`);
    const params = this.generateParameters(template.params, seed);
    console.log(`[QGen] Parameters generated:`, params);

    // Create question text by replacing placeholders
    console.log(`[QGen] Filling template...`);
    let questionText = this.fillTemplate(template.template, params);
    console.log(`[QGen] Question text created`);
    
    // Transform question based on representation type
    if (representationType === 'real_world') {
      console.log(`[QGen] Transforming to real-world...`);
      questionText = this.transformToRealWorld(questionText, template.type, params);
    } else if (representationType === 'visual') {
      console.log(`[QGen] Transforming to visual...`);
      questionText = this.transformToVisual(questionText, template.type, params);
    }

    // Calculate solution
    console.log(`[QGen] Calculating solution...`);
    const solution = template.solution(params);
    console.log(`[QGen] Solution: ${solution}`);

    // Generate answer options
    console.log(`[QGen] Generating options...`);
    let options = [];
    if (template.multipleChoice) {
      // Predefined multiple choice options
      options = template.multipleChoice.map((label, idx) => ({
        label,
        correct: typeof solution === 'number' ? idx === solution : label === solution
      }));
    } else {
      // Generate numeric options with distractors
      const correctAnswer = this.roundSolution(solution);
      const distractors = this.generateDistractors(correctAnswer, template.type);
      options = [correctAnswer, ...distractors]
        .sort(() => Math.random() - 0.5) // Shuffle
        .map(val => ({
          label: `${val}`,
          correct: val === correctAnswer
        }));
    }
    console.log(`[QGen] Generated ${options.length} options`);

    // Generate unique question ID (deterministic based on parameters)
    console.log(`[QGen] Generating question ID...`);
    const questionId = this.generateQuestionId(difficultyLevel, template.type, params);
    console.log(`[QGen] Question ID: ${questionId}`);

    console.log(`[QGen] COMPLETE - returning question object`);
    return {
      id: questionId,
      chapter_id: chapterId,
      question_text: questionText,
      type: template.type,
      difficulty_level: difficultyLevel,
      cognitive_domain: template.cognitiveDomain,
      representation_type: representationType,
      parameters: params,
      solution: this.roundSolution(solution),
      options,
      hint: template.hint,
      generated_at: new Date().toISOString(),
      is_generated: true
    };
  }

  /**
   * Generate multiple questions at once
   */
  generateQuestions(difficultyLevel, chapterId, count = 10) {
    const questions = [];
    for (let i = 0; i < count; i++) {
      questions.push(this.generateQuestion(difficultyLevel, chapterId, i));
    }
    return questions;
  }

  /**
   * Generate random parameters based on constraints
   */
  generateParameters(paramDefs, seed = null) {
    const params = {};
    
    for (const [key, def] of Object.entries(paramDefs)) {
      // Use seed for reproducibility (testing)
      const random = seed !== null 
        ? this.seededRandom(seed + key.charCodeAt(0)) 
        : Math.random();
      
      params[key] = Math.floor(random * (def.max - def.min + 1)) + def.min;
    }
    
    return params;
  }

  /**
   * Fill template with parameter values
   */
  fillTemplate(template, params) {
    let filled = template;
    for (const [key, value] of Object.entries(params)) {
      filled = filled.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return filled;
  }

  /**
   * Generate unique question ID
   */
  generateQuestionId(difficulty, type, params) {
    // Create deterministic ID based on template type + parameters
    // This ensures the same question (e.g., 8-sided polygon) always has the same ID
    // Format: gen_d{difficulty}_{type}_{param1}_{param2}_...
    const paramStr = params ? Object.values(params).sort().join('_') : '';
    const random = Math.floor(Math.random() * 1000); // Small randomizer for uniqueness
    return `gen_d${difficulty}_${type}_${paramStr}_${random}`;
  }

  /**
   * Round solution to reasonable precision
   */
  roundSolution(value) {
    return Math.round(value * 100) / 100;
  }

  /**
   * Seeded random for reproducibility (testing)
   */
  seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Generate distractor options for multiple choice
   */
  generateDistractors(correctAnswer, questionType) {
    const distractors = new Set();
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loops
    
    // Generate 3 unique distractors
    while (distractors.size < 3 && attempts < maxAttempts) {
      attempts++;
      let distractor;
      
      if (questionType.includes('area') || questionType.includes('volume') || questionType.includes('surface_area')) {
        // For area/volume, use common mistake patterns
        const variations = [
          correctAnswer * 0.5,      // Forgot to multiply/divide
          correctAnswer * 2,        // Used wrong formula
          correctAnswer + 10,       // Off by constant
          correctAnswer - 10,
          correctAnswer * 1.5,
          correctAnswer / 2
        ];
        distractor = this.roundSolution(variations[Math.floor(Math.random() * variations.length)]);
      } else if (questionType.includes('angle') || questionType.includes('polygon_interior')) {
        // For angles and polygon interior angles, use realistic variations
        const variations = [
          correctAnswer * 0.9,      // Common calculation error
          correctAnswer * 1.1,      // Common calculation error
          correctAnswer + 180,      // Added one extra triangle
          correctAnswer - 180,      // Subtracted one triangle
          correctAnswer + 90,       // Off by a right angle
          correctAnswer - 90,       // Off by a right angle
          correctAnswer + (Math.random() * 200 - 100) // Random offset
        ];
        distractor = this.roundSolution(variations[Math.floor(Math.random() * variations.length)]);
      } else {
        // General numeric distractors
        const offset = Math.max(5, Math.floor(correctAnswer * 0.2));
        distractor = this.roundSolution(correctAnswer + (Math.random() > 0.5 ? offset : -offset) * (1 + Math.random()));
      }
      
      // Ensure distractor is positive and different from correct answer
      if (distractor > 0 && distractor !== correctAnswer) {
        distractors.add(distractor);
      }
    }
    
    // If we couldn't generate 3 distractors, fill with simple offsets
    while (distractors.size < 3) {
      const offset = (distractors.size + 1) * 50;
      const distractor = correctAnswer + (Math.random() > 0.5 ? offset : -offset);
      if (distractor > 0 && distractor !== correctAnswer) {
        distractors.add(this.roundSolution(distractor));
      }
    }
    
    return Array.from(distractors);
  }

  /**
   * Get statistics about available templates
   */
  getTemplateStats() {
    const stats = {};
    for (const [difficulty, templates] of Object.entries(this.templates)) {
      stats[`difficulty_${difficulty}`] = {
        count: templates.length,
        types: templates.map(t => t.type)
      };
    }
    return stats;
  }

  /**
   * Add custom template (for extensibility)
   */
  addTemplate(difficultyLevel, templateConfig) {
    if (!this.templates[difficultyLevel]) {
      this.templates[difficultyLevel] = [];
    }
    this.templates[difficultyLevel].push(templateConfig);
  }

  /**
   * Generate question by cognitive domain (regardless of difficulty)
   */
  generateQuestionByDomain(cognitiveDomain, chapterId, seed = null) {
    // Collect all templates matching the cognitive domain
    const matchingTemplates = [];
    for (const [difficulty, templates] of Object.entries(this.templates)) {
      for (const template of templates) {
        if (template.cognitiveDomain === cognitiveDomain) {
          matchingTemplates.push({ ...template, difficulty: parseInt(difficulty) });
        }
      }
    }

    if (matchingTemplates.length === 0) {
      throw new Error(`No templates available for cognitive domain ${cognitiveDomain}`);
    }

    // Select random template
    const templateWithDiff = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
    
    // Generate using the difficulty from the selected template
    return this.generateQuestion(templateWithDiff.difficulty, chapterId, seed, cognitiveDomain);
  }

  /**
   * Get available cognitive domains at a difficulty level
   */
  getDomainsForDifficulty(difficultyLevel) {
    const templates = this.templates[difficultyLevel];
    if (!templates) return [];
    
    const domains = new Set(templates.map(t => t.cognitiveDomain));
    return Array.from(domains);
  }

  /**
   * Get cognitive domain distribution across all templates
   */
  getCognitiveDomainStats() {
    const stats = {};
    
    for (const domain of Object.values(this.COGNITIVE_DOMAINS)) {
      stats[domain] = {
        count: 0,
        difficulties: []
      };
    }

    for (const [difficulty, templates] of Object.entries(this.templates)) {
      for (const template of templates) {
        const domain = template.cognitiveDomain;
        if (stats[domain]) {
          stats[domain].count++;
          if (!stats[domain].difficulties.includes(parseInt(difficulty))) {
            stats[domain].difficulties.push(parseInt(difficulty));
          }
        }
      }
    }

    return stats;
  }

  /**
   * Get human-readable cognitive domain name
   */
  getCognitiveDomainLabel(domain) {
    const labels = {
      'knowledge_recall': 'Knowledge Recall (KR)',
      'concept_understanding': 'Concept Understanding (CU)',
      'procedural_skills': 'Procedural Skills (PS)',
      'analytical_thinking': 'Analytical Thinking (AT)',
      'problem_solving': 'Problem Solving (PS+)',
      'higher_order_thinking': 'Higher Order Thinking (HOT)'
    };
    return labels[domain] || domain;
  }

  /**
   * Get cognitive domain description
   */
  getCognitiveDomainDescription(domain) {
    const descriptions = {
      'knowledge_recall': 'Basic geometry definitions, formulas, and facts',
      'concept_understanding': 'Understanding relationships and classifications between shapes',
      'procedural_skills': 'Computing area, perimeter, angles, and applying formulas',
      'analytical_thinking': 'Patterns, logic, and multi-step reasoning',
      'problem_solving': 'Real-world geometry word problems and applications',
      'higher_order_thinking': 'Creative thinking, complex reasoning, and synthesis'
    };
    return descriptions[domain] || 'No description available';
  }

  /**
   * Transform question to real-world context
   */
  transformToRealWorld(questionText, questionType, params) {
    const realWorldContexts = {
      'rectangle_area': [
        `A farmer has a rectangular field with width ${params.width} meters and length ${params.height} meters. How many square meters of area does the field cover?`,
        `You're designing a rectangular garden that is ${params.width} feet wide and ${params.height} feet long. What is the total area you'll need to cover with soil?`,
        `A builder is laying floor tiles in a rectangular room ${params.width} meters by ${params.height} meters. What is the total floor area?`
      ],
      'square_perimeter': [
        `A square playground has sides of ${params.side} meters. How much fencing is needed to go around the entire playground?`,
        `You're building a square fence around your garden. If each side is ${params.side} feet, how much fencing material do you need?`,
        `A city park has a square walking path with each side measuring ${params.side} meters. What is the total distance around the path?`
      ],
      'triangle_area': [
        `A triangular piece of land has a base of ${params.base} meters and a height of ${params.height} meters. What is the area of this plot?`,
        `You're cutting a triangular sail with base ${params.base} feet and height ${params.height} feet. How much fabric (in square feet) do you need?`,
        `A triangular rooftop has a base of ${params.base} meters and rises ${params.height} meters high. What is its area?`
      ],
      'circle_circumference': [
        `A circular running track has a radius of ${params.radius} meters. How far do you run if you complete one lap around the track?`,
        `A round pizza has a radius of ${params.radius} inches. What is the distance around the edge of the pizza?`,
        `A circular fountain in the park has a radius of ${params.radius} feet. How much decorative edging is needed to go around it?`
      ],
      'circle_area': [
        `A circular pond has a radius of ${params.radius} meters. What is the surface area of the water?`,
        `You're installing a circular pool with radius ${params.radius} feet. How many square feet of pool liner do you need?`,
        `A circular rug has a radius of ${params.radius} meters. What is the total area it covers on the floor?`
      ],
      'polygon_interior_angles': [
        `An architect is designing an ${params.sides}-sided gazebo. To calculate the roof angles, what is the sum of all interior angles?`,
        `A stop sign is an octagon (8-sided shape). If you measured all the interior angles and added them up, what would the total be?`,
        `You're building a ${params.sides}-sided deck. To cut the boards at the correct angles, you need to know: what is the sum of interior angles?`
      ],
      'pythagorean': [
        `A ladder ${params.hypotenuse} feet long leans against a wall ${params.leg1} feet high. How far is the base of the ladder from the wall?`,
        `You're walking ${params.leg1} meters north, then ${params.leg2} meters east. What is the straight-line distance back to where you started?`,
        `A diagonal brace across a ${params.leg1} by ${params.leg2} meter door frame needs to be cut. How long should the brace be?`
      ],
      'volume_rectangular_prism': [
        `A shipping box is ${params.length} cm long, ${params.width} cm wide, and ${params.height} cm tall. What is its total volume?`,
        `You're filling a fish tank that's ${params.length} inches by ${params.width} inches by ${params.height} inches. How much water (in cubic inches) does it hold?`,
        `A storage container measures ${params.length} by ${params.width} by ${params.height} meters. What is its storage capacity in cubic meters?`
      ],
      'volume_cylinder': [
        `A cylindrical water tank has a radius of ${params.radius} meters and height of ${params.height} meters. What is its volume?`,
        `You're filling a round swimming pool with radius ${params.radius} feet and depth ${params.height} feet. How many cubic feet of water does it hold?`,
        `A cylindrical grain silo has radius ${params.radius} meters and height ${params.height} meters. What is its storage capacity?`
      ]
    };

    const contexts = realWorldContexts[questionType];
    if (contexts && contexts.length > 0) {
      const randomContext = contexts[Math.floor(Math.random() * contexts.length)];
      return randomContext;
    }

    // Fallback: add a simple real-world intro
    return `In a real-world situation: ${questionText}`;
  }

  /**
   * Transform question to visual description
   */
  transformToVisual(questionText, questionType, params) {
    const visualDescriptions = {
      'rectangle_area': `Imagine a rectangle drawn on graph paper. It's ${params.width} units wide and ${params.height} units tall. If you count all the square units inside, what's the total area?`,
      'square_perimeter': `Picture a square with each side measuring ${params.side} units. If you trace your finger around all four sides, how many units do you travel?`,
      'triangle_area': `Visualize a triangle with a base of ${params.base} units and a perpendicular height of ${params.height} units. What is the space inside?`,
      'circle_circumference': `Imagine a circle with a radius of ${params.radius} units from the center to the edge. If you walk around the entire circle, how far do you walk?`,
      'circle_area': `Picture a circle with radius ${params.radius} units. If you filled it with unit squares, how many would fit inside?`,
      'polygon_interior_angles': `Imagine drawing an ${params.sides}-sided polygon. At each corner (vertex), there's an interior angle. If you measured and added all these angles, what's the sum?`
    };

    return visualDescriptions[questionType] || `[Visual representation] ${questionText}`;
  }
}

module.exports = QuestionGeneratorService;
