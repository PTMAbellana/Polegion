/**
 * QuestionGeneratorService
 * Parametric question generation system for adaptive learning
 * 
 * CORE CONCEPT: Instead of storing thousands of static questions, we store
 * "templates" with variable parameters. This allows infinite unique variations
 * while maintaining pedagogical quality.
 * 
 * Example Template:
 *   "Find the area of a rectangle with width {width} and height {height}"
 *   Parameters: width: {min: 3, max: 10}, height: {min: 3, max: 10}
 *   Generates: "Find the area of a rectangle with width 5 and height 7"
 *              (Solution: 5 × 7 = 35)
 * 
 * COGNITIVE DOMAINS (Bloom's Taxonomy):
 * - Knowledge Recall (KR): Basic facts and formulas
 * - Concept Understanding (CU): Relationships and classifications  
 * - Procedural Skills (PS): Step-by-step computations
 * - Analytical Thinking (AT): Multi-step reasoning and patterns
 * - Problem Solving (PS+): Real-world applications
 * - Higher Order Thinking (HOT): Creative and complex reasoning
 * 
 * ARCHITECTURE:
 * - Templates organized by difficulty level (1-4)
 * - Each template includes: type, cognitive domain, parameters, solution function
 * - Supports multi-modal representations: text, visual, real-world context
 * - Topic filtering for curriculum alignment
 * - Recent question exclusion to prevent repetition
 */

// Import modular question templates
const circlePartsQuestions = require('./questions/CirclePartsQuestions');
const volumeQuestions = require('./questions/VolumeQuestions');
const basicGeometricFigures = require('./questions/BasicGeometricFigures');
const perimeterAreaQuestions = require('./questions/PerimeterAreaQuestions');
const pointsLinesPlanes = require('./questions/PointsLinesPlanes');
const kindsOfAngles = require('./questions/KindsOfAngles');
const complementarySupplementary = require('./questions/ComplementarySupplementary');
const circleCircumferenceArea = require('./questions/CircleCircumferenceArea');
const polygonIdentification = require('./questions/PolygonIdentification');
const interiorAngles = require('./questions/InteriorAngles');
const planeAnd3DFigures = require('./questions/PlaneAnd3DFigures');
const geometryWordProblems = require('./questions/GeometryWordProblems');
const geometricProofs = require('./questions/GeometricProofs');

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
          hint: 'Count the number of sides',
          multipleChoice: ['Triangle', 'Quadrilateral', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon']
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
          type: 'polygon_interior_pentagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the sum of the interior angles of a pentagon (5-sided polygon)?',
          params: {},
          solution: () => 540,
          hint: 'Use the formula: (n-2) × 180° where n is the number of sides'
        },
        {
          type: 'polygon_interior_hexagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the sum of the interior angles of a hexagon (6-sided polygon)?',
          params: {},
          solution: () => 720,
          hint: 'Use the formula: (n-2) × 180° where n=6'
        },
        {
          type: 'triangle_missing_angle_easy',
          cognitiveDomain: 'procedural_skills',
          template: 'A triangle has angles of {angle1}° and {angle2}°. What is the measure of the third angle?',
          params: {
            angle1: { min: 30, max: 70 },
            angle2: { min: 40, max: 80 }
          },
          solution: (p) => 180 - p.angle1 - p.angle2,
          hint: 'Remember: all triangle angles add up to 180°'
        },
        {
          type: 'quadrilateral_missing_angle',
          cognitiveDomain: 'procedural_skills',
          template: 'A quadrilateral has three angles measuring {angle1}°, {angle2}°, and {angle3}°. Find the fourth angle.',
          params: {
            angle1: { min: 60, max: 100 },
            angle2: { min: 70, max: 110 },
            angle3: { min: 50, max: 90 }
          },
          solution: (p) => 360 - p.angle1 - p.angle2 - p.angle3,
          hint: 'All angles in a quadrilateral sum to 360°'
        },
        {
          type: 'polygon_types_sides',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many sides does a hexagon have?',
          params: {},
          solution: () => 6,
          hint: 'Think about the prefix "hex" - you might see it in other math terms'
        },
        {
          type: 'polygon_types_triangle',
          cognitiveDomain: 'knowledge_recall',
          template: 'Which polygon has exactly 3 sides and 3 angles?',
          params: {},
          solution: () => 0,
          hint: 'Think of the simplest polygon - what shape has the fewest sides?',
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
        },
        
        // Additional Circle questions for Difficulty 1
        {
          type: 'circle_diameter_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the line segment that passes through the center and connects two points on a circle called?',
          params: {},
          solution: () => 0,
          hint: 'It goes all the way across through the center',
          multipleChoice: ['Diameter', 'Radius', 'Chord', 'Arc']
        },
        {
          type: 'circle_radius_relation',
          cognitiveDomain: 'knowledge_recall',
          template: 'The diameter of a circle is {diameter} units. What is the radius?',
          params: {
            diameter: { min: 6, max: 20, step: 2 }
          },
          solution: (p) => p.diameter / 2,
          hint: 'The radius is half the diameter'
        },
        {
          type: 'circle_basic_circumference',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the distance around a circle called?',
          params: {},
          solution: () => 0,
          hint: 'It\'s like the perimeter of a circle',
          multipleChoice: ['Circumference', 'Diameter', 'Radius', 'Area']
        },
        {
          type: 'circle_chord_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is a line segment that connects any two points on a circle called?',
          params: {},
          solution: () => 0,
          hint: 'It doesn\'t have to go through the center',
          multipleChoice: ['Chord', 'Radius', 'Diameter', 'Tangent']
        },
        
        // Additional Angle questions for Difficulty 1
        {
          type: 'complementary_angles_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'Two angles that add up to 90° are called:',
          params: {},
          solution: () => 0,
          hint: 'They complete a right angle',
          multipleChoice: ['Complementary angles', 'Supplementary angles', 'Vertical angles', 'Adjacent angles']
        },
        {
          type: 'supplementary_angles_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'Two angles that add up to 180° are called:',
          params: {},
          solution: () => 0,
          hint: 'They form a straight line',
          multipleChoice: ['Supplementary angles', 'Complementary angles', 'Vertical angles', 'Right angles']
        },
        
        // Additional Polygon questions for Difficulty 1
        {
          type: 'polygon_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'A polygon is a closed figure made up of:',
          params: {},
          solution: () => 0,
          hint: 'Polygons are made of straight sides',
          multipleChoice: ['Line segments', 'Curves', 'Circles', 'Arcs']
        },
        {
          type: 'rectangle_properties',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many right angles does a rectangle have?',
          params: {},
          solution: () => 4,
          hint: 'Count all the corners'
        },
        {
          type: 'square_properties',
          cognitiveDomain: 'knowledge_recall',
          template: 'A square has all sides:',
          params: {},
          solution: () => 0,
          hint: 'All four sides are the same',
          multipleChoice: ['Equal length', 'Different lengths', 'Parallel only', 'Perpendicular only']
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
        },
        
        // Additional Circle questions for Difficulty 2
        {
          type: 'circle_diameter_from_radius',
          cognitiveDomain: 'procedural_skills',
          template: 'A circle has a radius of {radius} units. What is its diameter?',
          params: {
            radius: { min: 4, max: 15 }
          },
          solution: (p) => p.radius * 2,
          hint: 'Diameter = 2 × radius'
        },
        {
          type: 'circle_area_comparison',
          cognitiveDomain: 'concept_understanding',
          template: 'If you double the radius of a circle, its area becomes:',
          params: {},
          solution: () => 0,
          hint: 'Area depends on r², so doubling r means area becomes 4 times larger',
          multipleChoice: ['4 times larger', '2 times larger', '8 times larger', 'Same size']
        },
        {
          type: 'circle_semicircle_perimeter',
          cognitiveDomain: 'analytical_thinking',
          template: 'A semicircle has a diameter of {diameter} units. What is the perimeter of the semicircle (curved part + diameter)? (Use π ≈ 3.14)',
          params: {
            diameter: { min: 6, max: 14, step: 2 }
          },
          solution: (p) => (Math.PI * p.diameter / 2) + p.diameter,
          hint: 'Perimeter = half circumference + diameter'
        },
        
        // Additional Polygon questions for Difficulty 2
        {
          type: 'polygon_perimeter_regular',
          cognitiveDomain: 'procedural_skills',
          template: 'A regular pentagon has each side measuring {side} units. What is its perimeter?',
          params: {
            side: { min: 5, max: 12 }
          },
          solution: (p) => 5 * p.side,
          hint: 'Perimeter = number of sides × side length'
        },
        {
          type: 'triangle_perimeter',
          cognitiveDomain: 'procedural_skills',
          template: 'A triangle has sides of {side1}, {side2}, and {side3} units. What is its perimeter?',
          params: {
            side1: { min: 5, max: 12 },
            side2: { min: 6, max: 13 },
            side3: { min: 7, max: 14 }
          },
          solution: (p) => p.side1 + p.side2 + p.side3,
          hint: 'Perimeter = sum of all sides'
        },
        
        // Additional Volume questions for Difficulty 2
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
        
        // Polygon Identification - Difficulty 2
        {
          type: 'polygon_identify_quadrilateral',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the name for a polygon with 4 sides?',
          params: {},
          solution: () => 0,
          hint: 'Think about the prefix for shapes with this many sides - squares and rectangles are examples',
          multipleChoice: ['Quadrilateral', 'Triangle', 'Pentagon', 'Hexagon']
        },
        {
          type: 'polygon_types_pentagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'A polygon with 5 sides is called:',
          params: {},
          solution: () => 0,
          hint: 'The prefix "penta" appears in pentathlon (5 events)',
          multipleChoice: ['Pentagon', 'Hexagon', 'Heptagon', 'Octagon']
        },
        {
          type: 'polygon_types_octagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many sides does an octagon have?',
          params: {},
          solution: () => 8,
          hint: 'Think of a STOP sign - count the sides'
        },
        {
          type: 'polygon_identify_by_angles',
          cognitiveDomain: 'concept_understanding',
          template: 'A polygon has 6 sides and 6 angles. What is it called?',
          params: {},
          solution: () => 0,
          hint: 'Think of honeycombs - what shape are the cells?',
          multipleChoice: ['Hexagon', 'Pentagon', 'Heptagon', 'Octagon']
        },
        {
          type: 'polygon_regular_definition',
          cognitiveDomain: 'knowledge_recall',
          template: 'A regular polygon has:',
          params: {},
          solution: () => 0,
          hint: 'All parts are equal in a regular polygon',
          multipleChoice: ['All sides and angles equal', 'Only sides equal', 'Only angles equal', 'No equal parts']
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
        
        // Circles - Intermediate level
        {
          type: 'circle_area',
          cognitiveDomain: 'procedural_skills',
          template: 'A circular pool has a radius of {radius} meters. What is its area? (Use π ≈ 3.14)',
          params: {
            radius: { min: 5, max: 12 }
          },
          solution: (p) => Math.PI * p.radius * p.radius,
          hint: 'Area = π × r²'
        },
        {
          type: 'circle_circumference',
          cognitiveDomain: 'procedural_skills',
          template: 'A circular track has a radius of {radius} meters. How far is one complete lap around the track? (Use π ≈ 3.14)',
          params: {
            radius: { min: 8, max: 20 }
          },
          solution: (p) => 2 * Math.PI * p.radius,
          hint: 'Circumference = 2 × π × r'
        },
        {
          type: 'circle_diameter_to_circumference',
          cognitiveDomain: 'concept_understanding',
          template: 'A circle has a diameter of {diameter} units. What is its circumference? (Use π ≈ 3.14)',
          params: {
            diameter: { min: 10, max: 24 }
          },
          solution: (p) => Math.PI * p.diameter,
          hint: 'Circumference = π × diameter'
        },
        {
          type: 'circle_radius_from_circumference',
          cognitiveDomain: 'analytical_thinking',
          template: 'A circle has a circumference of {circumference} units. What is its radius? (Use π ≈ 3.14)',
          params: {
            circumference: { min: 31.4, max: 62.8, step: 6.28 }
          },
          solution: (p) => p.circumference / (2 * Math.PI),
          hint: 'Radius = Circumference ÷ (2π)'
        },
        {
          type: 'circle_area_from_diameter',
          cognitiveDomain: 'analytical_thinking',
          template: 'A circular garden has a diameter of {diameter} meters. What is its area? (Use π ≈ 3.14)',
          params: {
            diameter: { min: 8, max: 18, step: 2 }
          },
          solution: (p) => Math.PI * Math.pow(p.diameter / 2, 2),
          hint: 'First find the radius (diameter ÷ 2), then use Area = π × r²'
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
          solution: () => 1, // Index 1 in the array [1, 2, 3, 4] = value 2 (correct answer)
          hint: 'Two points determine exactly one unique line',
          multipleChoice: [1, 2, 3, 4]
        },
        {
          type: 'point_naming_convention',
          cognitiveDomain: 'concept_understanding',
          template: 'Points are typically labeled with:',
          params: {},
          solution: () => 0,
          hint: 'Points use capital letters like A, B, C',
          multipleChoice: ['Capital letters', 'Lowercase letters', 'Numbers only', 'Greek symbols']
        },
        {
          type: 'line_infinite_property',
          cognitiveDomain: 'concept_understanding',
          template: 'Which statement is true about a line?',
          params: {},
          solution: () => 0,
          hint: 'A line has no endpoints and continues forever',
          multipleChoice: ['It extends infinitely in both directions', 'It has two endpoints', 'It has one endpoint', 'It has a fixed length']
        },
        {
          type: 'plane_points_required',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is the minimum number of non-collinear points needed to define a unique plane?',
          params: {},
          solution: () => 2, // Index 2 = 3 points
          hint: 'Think about how many legs a table needs to be stable',
          multipleChoice: [1, 2, 3, 4]
        },
        {
          type: 'ray_vs_line_segment',
          cognitiveDomain: 'concept_understanding',
          template: 'What is the main difference between a ray and a line segment?',
          params: {},
          solution: () => 0,
          hint: 'A ray has one endpoint, a line segment has two',
          multipleChoice: ['A ray extends infinitely in one direction, a line segment has finite length', 'A ray is curved, a line segment is straight', 'A ray has two endpoints, a line segment has one', 'There is no difference']
        },
        {
          type: 'collinear_points_line',
          cognitiveDomain: 'analytical_thinking',
          template: 'If points A, B, and C are collinear, what can you conclude?',
          params: {},
          solution: () => 0,
          hint: 'Collinear means on the same line',
          multipleChoice: ['They all lie on the same line', 'They form a triangle', 'They are equidistant', 'They define a plane']
        },
        {
          type: 'line_notation_symbols',
          cognitiveDomain: 'knowledge_recall',
          template: 'How is a line segment AB typically written in geometry?',
          params: {},
          solution: () => 0,
          hint: 'A line segment has two endpoints and uses a bar above the letters',
          multipleChoice: ['Segment AB with a bar on top', 'Ray AB with an arrow', 'Line AB with arrows on both ends', 'Just AB with no symbol']
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
        
        // Polygon Identification - Difficulty 3
        {
          type: 'polygon_identify_heptagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'What is a 7-sided polygon called?',
          params: {},
          solution: () => 0,
          hint: 'The prefix "hepta" - it comes between hexagon and octagon',
          multipleChoice: ['Heptagon', 'Hexagon', 'Octagon', 'Nonagon']
        },
        {
          type: 'polygon_types_nonagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many sides does a nonagon have?',
          params: {},
          solution: () => 9,
          hint: 'This shape comes right after an octagon in the polygon sequence'
        },
        {
          type: 'polygon_identify_decagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'A polygon with 10 sides is called:',
          params: {},
          solution: () => 0,
          hint: 'Think about the prefix "dec" - like decade or decimal system',
          multipleChoice: ['Decagon', 'Nonagon', 'Hendecagon', 'Dodecagon']
        },
        {
          type: 'polygon_convex_definition',
          cognitiveDomain: 'concept_understanding',
          template: 'A convex polygon has:',
          params: {},
          solution: () => 0,
          hint: 'All interior angles are less than 180°',
          multipleChoice: ['All interior angles less than 180°', 'At least one angle greater than 180°', 'All right angles', 'Only 3 sides']
        },
        {
          type: 'polygon_diagonals',
          cognitiveDomain: 'analytical_thinking',
          template: 'How many diagonals can be drawn from one vertex of a hexagon?',
          params: {},
          solution: () => 3,
          hint: 'From one vertex, you can draw diagonals to all non-adjacent vertices'
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
        },
        
        // Additional Circle questions for Difficulty 4
        {
          type: 'circle_arc_length',
          cognitiveDomain: 'analytical_thinking',
          template: 'Find the arc length of a circle with radius {radius} units and central angle {angle}°. (Use π ≈ 3.14)',
          params: {
            radius: { min: 8, max: 16 },
            angle: { min: 45, max: 270 }
          },
          solution: (p) => (p.angle / 360) * 2 * Math.PI * p.radius,
          hint: 'Arc length = (angle/360) × 2πr'
        },
        {
          type: 'circle_segment_area',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A circle has radius {radius} units. If a chord divides it creating a 90° sector, what is the sector area? (Use π ≈ 3.14)',
          params: {
            radius: { min: 6, max: 14 }
          },
          solution: (p) => (90 / 360) * Math.PI * p.radius * p.radius,
          hint: 'This is 1/4 of the circle area'
        },
        {
          type: 'circle_inscribed_square',
          cognitiveDomain: 'problem_solving',
          template: 'A square is inscribed in a circle of radius {radius} units. What is the area of the square?',
          params: {
            radius: { min: 5, max: 12 }
          },
          solution: (p) => 2 * p.radius * p.radius,
          hint: 'The diagonal of the square equals the diameter of the circle'
        },
        
        // Additional Polygon questions for Difficulty 4
        {
          type: 'polygon_exterior_angles',
          cognitiveDomain: 'analytical_thinking',
          template: 'What is the sum of all exterior angles of any polygon?',
          params: {},
          solution: () => 360,
          hint: 'This is true for ALL polygons, regardless of the number of sides'
        },
        {
          type: 'regular_polygon_interior_angle',
          cognitiveDomain: 'analytical_thinking',
          template: 'A regular {sides}-sided polygon has interior angles. What is the measure of ONE interior angle?',
          params: {
            sides: { min: 5, max: 8 }
          },
          solution: (p) => ((p.sides - 2) * 180) / p.sides,
          hint: 'Total interior angles = (n-2)×180°, then divide by n'
        },
        
        // Additional Volume questions for Difficulty 4
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
        },
        {
          type: 'surface_area_rectangular_prism',
          cognitiveDomain: 'analytical_thinking',
          template: 'A box has dimensions {length} × {width} × {height} units. What is its total surface area?',
          params: {
            length: { min: 6, max: 14 },
            width: { min: 5, max: 12 },
            height: { min: 4, max: 10 }
          },
          solution: (p) => 2 * (p.length * p.width + p.length * p.height + p.width * p.height),
          hint: 'SA = 2(lw + lh + wh)'
        },
        
        // Additional Angle questions for Difficulty 4
        {
          type: 'angle_pairs_parallel_lines',
          cognitiveDomain: 'analytical_thinking',
          template: 'Two parallel lines are cut by a transversal. If one angle is {angle}°, what is the alternate interior angle?',
          params: {
            angle: { min: 40, max: 140 }
          },
          solution: (p) => p.angle,
          hint: 'Alternate interior angles are equal when lines are parallel'
        },
        {
          type: 'angle_sum_pentagon',
          cognitiveDomain: 'procedural_skills',
          template: 'In a pentagon, four angles measure {a1}°, {a2}°, {a3}°, and {a4}°. Find the fifth angle.',
          params: {
            a1: { min: 80, max: 120 },
            a2: { min: 90, max: 130 },
            a3: { min: 85, max: 125 },
            a4: { min: 95, max: 135 }
          },
          solution: (p) => 540 - p.a1 - p.a2 - p.a3 - p.a4,
          hint: 'Sum of interior angles of pentagon = 540°'
        },
        
        // Polygon Identification - Difficulty 4
        {
          type: 'polygon_types_dodecagon',
          cognitiveDomain: 'knowledge_recall',
          template: 'How many sides does a dodecagon have?',
          params: {},
          solution: () => 12,
          hint: 'Think about the prefix "dodeca" - it appears in dozen'
        },
        {
          type: 'polygon_total_diagonals',
          cognitiveDomain: 'analytical_thinking',
          template: 'How many total diagonals does a hexagon have?',
          params: {},
          solution: () => 9,
          hint: 'Use formula: n(n-3)/2 where n=6'
        },
        {
          type: 'polygon_identify_classification',
          cognitiveDomain: 'concept_understanding',
          template: 'A polygon with all sides equal and all angles equal is called:',
          params: {},
          solution: () => 0,
          hint: 'Regular means all equal',
          multipleChoice: ['Regular polygon', 'Irregular polygon', 'Concave polygon', 'Simple polygon']
        },
        {
          type: 'polygon_exterior_angle_regular',
          cognitiveDomain: 'analytical_thinking',
          template: 'What is the measure of ONE exterior angle of a regular pentagon?',
          params: {},
          solution: () => 72,
          hint: 'Exterior angles sum to 360°, divide by number of sides'
        },
        {
          type: 'polygon_identify_by_diagonals',
          cognitiveDomain: 'higher_order_thinking',
          template: 'A polygon has 5 diagonals. How many sides does it have?',
          params: {},
          solution: () => 5,
          hint: 'Use formula: n(n-3)/2 = 5, solve for n'
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

    // Load and merge modular question templates
    this.loadModularTemplates();
  }

  /**
   * Load and merge modular question templates with existing templates
   * Adds questions from the questions/ directory to the existing inline templates
   */
  loadModularTemplates() {
    const modularFiles = [
      circlePartsQuestions,
      volumeQuestions,
      basicGeometricFigures,
      perimeterAreaQuestions,
      pointsLinesPlanes,
      kindsOfAngles,
      complementarySupplementary,
      circleCircumferenceArea,
      polygonIdentification,
      interiorAngles,
      planeAnd3DFigures,
      geometryWordProblems,
      geometricProofs
    ];

    // Merge each modular file's questions into the main templates
    for (const modularTemplate of modularFiles) {
      for (let difficulty = 1; difficulty <= 4; difficulty++) {
        if (modularTemplate[difficulty]) {
          this.templates[difficulty].push(...modularTemplate[difficulty]);
        }
      }
    }

    console.log(`[QuestionGenerator] Loaded modular templates:`);
    for (let difficulty = 1; difficulty <= 4; difficulty++) {
      console.log(`  Difficulty ${difficulty}: ${this.templates[difficulty].length} questions`);
    }
  }

  /**
   * Generate a random question at specified difficulty level
   */
  generateQuestion(difficultyLevel, chapterId, seed = null, cognitiveDomain = null, representationType = 'text', topicFilter = null, excludeTypes = []) {
    console.log(`[QGen] START - difficulty: ${difficultyLevel}, cognitive: ${cognitiveDomain}, filter: ${topicFilter}, excludeTypes: ${excludeTypes.join(',')}`);
    
    const templates = this.templates[difficultyLevel];
    if (!templates || templates.length === 0) {
      throw new Error(`No templates available for difficulty ${difficultyLevel}`);
    }
    console.log(`[QGen] Found ${templates.length} templates for difficulty ${difficultyLevel}`);

    // Filter by topic if specified (e.g., "polygon_interior" matches "polygon_interior_angles")
    let filteredTemplates = templates;
    if (topicFilter) {
      // Split the filter by | and check if question type matches any of the filter parts
      const filterParts = topicFilter.split('|');
      filteredTemplates = templates.filter(t => 
        filterParts.some(part => t.type === part || t.type.startsWith(part + '_'))
      );
      console.log(`[QuestionGenerator] Topic filter "${topicFilter}" reduced templates from ${templates.length} to ${filteredTemplates.length}`);
      
      // Only fall back to all templates if BOTH topic filter AND cognitive domain filtering fail
      // Don't fall back immediately - wait to see if cognitive domain helps
      if (filteredTemplates.length === 0) {
        console.warn(`No templates found for topic filter "${topicFilter}" at difficulty ${difficultyLevel}`);
        // Keep filteredTemplates empty for now, will check cognitive domain next
      }
    }
    
    // Filter by cognitive domain if specified
    if (cognitiveDomain) {
      console.log(`[QGen] Filtering by cognitive domain: ${cognitiveDomain}`);
      
      // If topic filter found templates, filter those by domain
      if (filteredTemplates.length > 0) {
        const domainFiltered = filteredTemplates.filter(t => t.cognitiveDomain === cognitiveDomain);
        if (domainFiltered.length > 0) {
          filteredTemplates = domainFiltered;
          console.log(`[QGen] Domain filter reduced to ${domainFiltered.length} templates`);
        } else {
          console.warn(`No templates found for domain ${cognitiveDomain}, keeping topic-filtered templates`);
        }
      } else {
        // Topic filter failed, try filtering all templates by cognitive domain only
        const domainFiltered = templates.filter(t => t.cognitiveDomain === cognitiveDomain);
        if (domainFiltered.length > 0) {
          filteredTemplates = domainFiltered;
          console.log(`[QGen] Using domain-only filter: ${domainFiltered.length} templates`);
        } else {
          console.warn(`No templates found for domain ${cognitiveDomain}, using all templates`);
          filteredTemplates = templates;
        }
      }
    } else if (filteredTemplates.length === 0) {
      // No cognitive domain specified and topic filter failed - use all templates as last resort
      console.warn(`Topic filter failed and no cognitive domain specified, using all templates`);
      filteredTemplates = templates;
    }
    
    // === STEP 4: Exclude Recent Question Types (Prevent Immediate Repetition) ===
    // WHY: Spaced repetition is more effective than immediate repetition.
    // Exclude the 2 most recent question types to ensure variety while maintaining
    // curriculum coverage. If only 1-2 templates available, allow repeats rather than fail.
    if (excludeTypes && excludeTypes.length > 0 && filteredTemplates.length > 2) {
      const beforeExclude = filteredTemplates.length;
      const typesToExclude = excludeTypes.slice(0, 2); // Only exclude 2 most recent
      
      console.log(`[QGen] Before exclusion - templates:`, filteredTemplates.map(t => t.type));
      console.log(`[QGen] Types to exclude (last 2):`, typesToExclude);
      
      const templatesAfterExclude = filteredTemplates.filter(t => !typesToExclude.includes(t.type));
      console.log(`[QGen] After exclusion - templates:`, templatesAfterExclude.map(t => t.type));
      
      if (templatesAfterExclude.length > 0) {
        filteredTemplates = templatesAfterExclude;
        console.log(`[QGen] Excluded ${typesToExclude.length} recent types, reduced from ${beforeExclude} to ${filteredTemplates.length} templates`);
      } else {
        console.warn(`[QGen] Not enough template variety, allowing repeats`);
      }
    }

    console.log(`[QGen] Selecting from ${filteredTemplates.length} filtered templates`);
    
    // === SAFETY CHECK: Ensure Template Availability ===
    if (filteredTemplates.length === 0) {
      console.error(`[QGen] CRITICAL: No templates available after filtering!`);
      console.error(`[QGen] Filters applied: difficulty=${difficultyLevel}, cognitive=${cognitiveDomain}, topicFilter=${topicFilter}`);
      throw new Error(`No question templates available for difficulty ${difficultyLevel} with filters: topic=${topicFilter}, cognitive=${cognitiveDomain}`);
    }
    
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
      // Generate numeric options with pedagogically meaningful distractors
      const correctAnswer = this.roundSolution(solution);
      const distractors = this.generateDistractors(correctAnswer, template.type, params);
      
      // Create option set
      options = [correctAnswer, ...distractors].map(val => ({
        label: `${val}`,
        correct: val === correctAnswer
      }));
      
      // Randomize order AFTER creating options
      options.sort(() => Math.random() - 0.5);
    }
    console.log(`[QGen] Generated ${options.length} options`);
    
    // Validate answer options (defensive check)
    try {
      this.validateAnswerOptions(options);
    } catch (error) {
      console.error(`[QGen] Validation failed:`, error.message);
      console.error(`[QGen] Options:`, options);
      throw error;
    }

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
   * Optionally scales based on mastery level for adaptive difficulty
   */
  generateParameters(paramDefs, seed = null, masteryLevel = null) {
    const params = {};
    
    for (const [key, def] of Object.entries(paramDefs)) {
      // Use seed for reproducibility (testing)
      const random = seed !== null 
        ? this.seededRandom(seed + key.charCodeAt(0)) 
        : Math.random();
      
      let min = def.min;
      let max = def.max;
      
      // Adjust range based on mastery level (adaptive difficulty)
      if (masteryLevel !== null) {
        if (masteryLevel <= 2) {
          // LOW mastery: use lower half of range, smaller numbers
          max = Math.floor(min + (max - min) * 0.6);
        } else if (masteryLevel >= 4) {
          // HIGH mastery: use upper half of range, larger numbers
          min = Math.floor(min + (max - min) * 0.4);
        }
        // MEDIUM mastery (3): use full range (no adjustment)
      }
      
      params[key] = Math.floor(random * (max - min + 1)) + min;
    }
    
    return params;
  }
  
  /**
   * Generate a similar question (for wrong answer regeneration)
   * Same concept, same difficulty, different numbers/representation
   */
  generateSimilarQuestion(originalQuestion, masteryLevel = null) {
    const { type, difficulty_level, chapter_id, representation_type } = originalQuestion;
    
    // Find the template for this question type
    const templates = this.templates[difficulty_level] || [];
    const template = templates.find(t => t.type === type);
    
    if (!template) {
      console.warn(`[QGen] Could not find template for regeneration: ${type}`);
      // Fallback: generate any question at this difficulty
      return this.generateQuestion(difficulty_level, chapter_id, null, null, representation_type);
    }
    
    // Generate new parameters (different from original)
    const newSeed = Date.now(); // Ensure different values
    const newParams = this.generateParameters(template.params, newSeed, masteryLevel);
    
    // Prefer different representation if mastery is low
    let newRepresentation = representation_type;
    if (masteryLevel !== null && masteryLevel <= 2) {
      // Low mastery: try visual representation
      newRepresentation = representation_type === 'visual' ? 'text' : 'visual';
    }
    
    // Create question text
    let questionText = this.fillTemplate(template.template, newParams);
    if (newRepresentation === 'real_world') {
      questionText = this.transformToRealWorld(questionText, template.type, newParams);
    } else if (newRepresentation === 'visual') {
      questionText = this.transformToVisual(questionText, template.type, newParams);
    }
    
    // Calculate solution
    const solution = template.solution(newParams);
    
    // Generate options
    let options = [];
    if (template.multipleChoice) {
      options = template.multipleChoice.map((label, idx) => ({
        label,
        correct: typeof solution === 'number' ? idx === solution : label === solution
      }));
    } else {
      const correctAnswer = this.roundSolution(solution);
      const distractors = this.generateDistractors(correctAnswer, template.type, newParams);
      options = [correctAnswer, ...distractors].map(val => ({
        label: `${val}`,
        correct: val === correctAnswer
      }));
      options.sort(() => Math.random() - 0.5);
    }
    
    // Validate
    this.validateAnswerOptions(options);
    
    // Generate new ID
    const questionId = this.generateQuestionId(difficulty_level, template.type, newParams);
    
    return {
      id: questionId,
      chapter_id,
      question_text: questionText,
      type: template.type,
      difficulty_level,
      cognitive_domain: template.cognitiveDomain,
      representation_type: newRepresentation,
      parameters: newParams,
      solution: this.roundSolution(solution),
      options,
      hint: template.hint,
      generated_at: new Date().toISOString(),
      is_generated: true,
      is_regenerated: true
    };
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
   * Generate pedagogically meaningful distractors for multiple choice
   * Distractors map to common misconceptions, not random values
   */
  generateDistractors(correctAnswer, questionType, params = {}) {
    const distractors = new Set();
    const isInteger = Number.isInteger(correctAnswer);
    
    // Count-based geometry must use integers only
    const isCountBased = questionType.includes('_sides') || 
                         questionType.includes('_vertices') || 
                         questionType.includes('_edges') || 
                         questionType.includes('_faces') ||
                         questionType.includes('_definition') && (correctAnswer === 3 || correctAnswer === 4 || correctAnswer === 5 || correctAnswer === 6);
    
    // Polygon side counting (3-12 sides)
    if (isCountBased && correctAnswer >= 3 && correctAnswer <= 12) {
      // Off-by-one errors (most common student mistake)
      if (correctAnswer > 3) distractors.add(correctAnswer - 1);
      if (correctAnswer < 12) distractors.add(correctAnswer + 1);
      
      // Confusion with nearby polygons
      if (correctAnswer > 4) distractors.add(correctAnswer - 2);
      if (correctAnswer < 11) distractors.add(correctAnswer + 2);
      
      // Ensure we have 3 distractors
      const candidates = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
      for (const c of candidates) {
        if (c !== correctAnswer && distractors.size < 3) {
          distractors.add(c);
        }
      }
    }
    // Angle measurements (0-360)
    else if (questionType.includes('angle') && correctAnswer >= 0 && correctAnswer <= 360) {
      // Common angle confusions
      if (correctAnswer === 90) {
        distractors.add(180); distractors.add(45); distractors.add(60);
      } else if (correctAnswer === 180) {
        distractors.add(90); distractors.add(360); distractors.add(270);
      } else if (correctAnswer === 360) {
        distractors.add(180); distractors.add(270); distractors.add(90);
      } else {
        // Complementary angle (90 - x)
        const complement = 90 - correctAnswer;
        if (complement > 0 && complement <= 90) distractors.add(complement);
        
        // Supplementary angle (180 - x)
        const supplement = 180 - correctAnswer;
        if (supplement > 0 && supplement <= 180) distractors.add(supplement);
        
        // Off by ±10-30 degrees
        if (correctAnswer > 15) distractors.add(correctAnswer - 15);
        if (correctAnswer < 345) distractors.add(correctAnswer + 15);
        
        // Common multiples confusion
        if (correctAnswer % 30 === 0) {
          if (correctAnswer > 30) distractors.add(correctAnswer - 30);
          if (correctAnswer < 330) distractors.add(correctAnswer + 30);
        }
      }
    }
    // Polygon interior angle sums
    else if (questionType.includes('polygon_interior') || questionType.includes('angle_sum')) {
      // Formula: (n-2) × 180
      // Common mistakes: forgot -2, used wrong n, added instead of multiplied
      const variations = [
        correctAnswer + 180,  // Used (n-1) instead of (n-2)
        correctAnswer - 180,  // Used (n-3) instead of (n-2)
        correctAnswer / 2,    // Divided by 2 incorrectly
        Math.round(correctAnswer * 1.5), // Multiplied by wrong factor
      ];
      variations.forEach(v => {
        if (v > 0 && v !== correctAnswer && v <= 3600) distractors.add(v);
      });
    }
    // Area calculations
    else if (questionType.includes('area')) {
      // Common mistakes: forgot to multiply, used wrong formula, forgot to divide by 2 (triangles)
      const mistakes = [
        correctAnswer * 2,     // Forgot to divide by 2 (triangle)
        correctAnswer / 2,     // Divided when shouldn't have
        correctAnswer * 1.5,   // Used wrong dimension
        correctAnswer + (params.base || params.side || 10), // Added instead of multiplied
      ];
      mistakes.forEach(m => {
        const val = isInteger ? Math.round(m) : this.roundSolution(m);
        if (val > 0 && val !== correctAnswer) distractors.add(val);
      });
    }
    // Volume calculations
    else if (questionType.includes('volume')) {
      // Common mistakes: forgot one dimension, used area formula, used wrong formula
      const mistakes = [
        correctAnswer / (params.side || params.height || params.radius || 2), // Forgot one dimension
        correctAnswer * 2,     // Doubled incorrectly
        Math.round(correctAnswer / 1.5), // Used 2D instead of 3D
        Math.round(correctAnswer * 1.2), // Arithmetic error
      ];
      mistakes.forEach(m => {
        const val = isInteger ? Math.round(m) : this.roundSolution(m);
        if (val > 0 && val !== correctAnswer) distractors.add(val);
      });
    }
    // Circumference/Perimeter
    else if (questionType.includes('circumference') || questionType.includes('perimeter')) {
      // Common mistakes: used radius instead of diameter, forgot to multiply by 2, confused with area
      const mistakes = [
        correctAnswer / 2,     // Used radius instead of diameter
        correctAnswer * 2,     // Doubled incorrectly
        Math.round(correctAnswer * 0.8), // Arithmetic error
        Math.round(correctAnswer * 1.2), // Arithmetic error
      ];
      mistakes.forEach(m => {
        const val = this.roundSolution(m);
        if (val > 0 && val !== correctAnswer) distractors.add(val);
      });
    }
    // General numeric distractors (fallback)
    else {
      const range = Math.max(10, Math.abs(correctAnswer * 0.3));
      const candidates = [
        correctAnswer - range * 0.3,
        correctAnswer + range * 0.3,
        correctAnswer - range * 0.6,
        correctAnswer + range * 0.6,
        correctAnswer * 0.75,
        correctAnswer * 1.25,
      ];
      candidates.forEach(c => {
        const val = isInteger ? Math.round(c) : this.roundSolution(c);
        if (val > 0 && val !== correctAnswer) distractors.add(val);
      });
    }
    
    // Ensure all distractors are valid and convert to array
    const validDistractors = Array.from(distractors)
      .filter(d => d > 0 && d !== correctAnswer)
      .slice(0, 3);
    
    // Fill to 3 distractors if needed with safe fallbacks
    while (validDistractors.length < 3) {
      const offset = (validDistractors.length + 1) * (isInteger ? 1 : 0.5);
      const fallback = isInteger 
        ? Math.round(correctAnswer + offset) 
        : this.roundSolution(correctAnswer + offset);
      if (fallback > 0 && fallback !== correctAnswer && !validDistractors.includes(fallback)) {
        validDistractors.push(fallback);
      }
    }
    
    return validDistractors;
  }
  
  /**
   * Validate answer options before returning question
   * Ensures exactly one correct answer, no duplicates, consistent formatting
   */
  validateAnswerOptions(options) {
    // Check: exactly one correct answer
    const correctCount = options.filter(opt => opt.correct).length;
    if (correctCount !== 1) {
      throw new Error(`Invalid answer set: ${correctCount} correct answers (expected 1)`);
    }
    
    // Check: no duplicate labels
    const labels = options.map(opt => opt.label.toString().trim().toLowerCase());
    const uniqueLabels = new Set(labels);
    if (labels.length !== uniqueLabels.size) {
      throw new Error(`Invalid answer set: duplicate options detected`);
    }
    
    // Check: consistent numeric formatting
    const numericOptions = options.filter(opt => !isNaN(parseFloat(opt.label)));
    if (numericOptions.length === options.length) {
      // All numeric - check for decimal consistency
      const hasDecimals = numericOptions.some(opt => opt.label.includes('.'));
      const allIntegers = numericOptions.every(opt => !opt.label.includes('.') || opt.label.endsWith('.0'));
      // If correct is integer, all should be integers
      const correctOption = options.find(opt => opt.correct);
      const correctIsInt = !correctOption.label.includes('.') || correctOption.label.endsWith('.0');
      if (correctIsInt && hasDecimals) {
        // Some distractors have decimals but answer is integer - fix them
        options.forEach(opt => {
          if (opt.label.includes('.')) {
            opt.label = Math.round(parseFloat(opt.label)).toString();
          }
        });
      }
    }
    
    return true;
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
