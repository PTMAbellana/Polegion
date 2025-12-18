"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import PageHeader from "@/components/PageHeader"
import LoadingOverlay from "@/components/LoadingOverlay"
import styles from "@/styles/dashboard-wow.module.css"
import castleStyles from "@/styles/teacher-castle-viewer.module.css"
import { FaBook, FaGraduationCap, FaListAlt } from "react-icons/fa"

// Static Castle and Chapter Data with Real Geometry Lessons
const CASTLE_DATA = [
  {
    id: 0,
    castle_number: 0,
    name: "Pre-Assessment",
    description: "Diagnostic assessment to evaluate baseline geometric knowledge",
    chapters: [
      {
        id: 1,
        chapter_number: 1,
        title: "Geometry Diagnostic Test",
        content: `
          <h2>Purpose of This Assessment</h2>
          <p>This diagnostic assessment evaluates students' foundational understanding of geometric concepts before beginning the formal curriculum. It covers basic shape recognition, spatial reasoning, and mathematical terminology.</p>
          
          <h3>Assessment Coverage</h3>
          <ul>
            <li>Basic shape identification (2D and 3D)</li>
            <li>Understanding of geometric properties</li>
            <li>Spatial visualization skills</li>
            <li>Measurement concepts</li>
            <li>Problem-solving with geometric figures</li>
          </ul>
          
          <h3>Teaching Notes</h3>
          <p>Use results from this assessment to:</p>
          <ul>
            <li>Identify students who may need additional support</li>
            <li>Determine which foundational concepts require review</li>
            <li>Group students for differentiated instruction</li>
            <li>Establish a baseline for measuring student growth</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 1,
    castle_number: 1,
    name: "Introduction to Geometric Shapes",
    description: "Foundational concepts of geometry and basic shapes",
    chapters: [
      {
        id: 2,
        chapter_number: 1,
        title: "Understanding Geometric Shapes",
        content: `
          <h2>Introduction to Geometric Shapes</h2>
          <p>In Mathematics, <strong>geometric shapes</strong> are the figures which demonstrate the shape of the objects we see in our everyday life. In geometry, shapes are the forms of objects which have boundary lines, angles and surfaces. There are different types of 2D shapes and 3D shapes.</p>
          
          <h3>Classification of Shapes</h3>
          <p>Shapes are classified with respect to their regularity or uniformity. A <strong>regular shape</strong> is usually symmetrical such as a square, circle, etc. <strong>Irregular shapes</strong> are asymmetrical. They are also called freeform shapes or organic shapes. For example, the shape of a tree is irregular or organic.</p>
          
          <h3>Two-Dimensional Shapes</h3>
          <p>In plane geometry, the two-dimensional shapes are flat shapes and closed figures such as circles, squares, rectangles, rhombus, etc. These shapes lie on the x-axis and y-axis.</p>
          
          <h3>Three-Dimensional Shapes</h3>
          <p>In solid geometry, the three-dimensional shapes are cube, cuboid, cone, sphere and cylinder. We can observe all these shapes in our daily existence. For example:</p>
          <ul>
            <li>Books (cuboid shape)</li>
            <li>Glasses (cylindrical shape)</li>
            <li>Traffic cones (conical shape)</li>
            <li>Basketballs (spherical shape)</li>
          </ul>
          
          <h3>Important Note</h3>
          <p>A point has no dimension and a line is a one-dimensional shape. Both of these are the base of geometry. When two lines meet at a point, they form an angle where the point is said to be the vertex and lines are the arms.</p>
          
          <h3>Teaching Strategies</h3>
          <ul>
            <li>Use real-world objects to demonstrate different shapes</li>
            <li>Have students identify shapes in their environment</li>
            <li>Create shape collages from magazine cutouts</li>
            <li>Use manipulatives to explore 3D shapes</li>
          </ul>
        `
      },
      {
        id: 3,
        chapter_number: 2,
        title: "Properties of Basic Shapes",
        content: `
          <h2>Properties of Basic Geometric Shapes</h2>
          <p>Understanding the properties of shapes is fundamental to geometry. Each shape has unique characteristics that define it.</p>
          
          <h3>Triangles</h3>
          <p>A triangle is a closed figure with three sides and three angles. The sum of all angles in a triangle is always 180 degrees.</p>
          <ul>
            <li><strong>Equilateral Triangle:</strong> All sides and angles are equal</li>
            <li><strong>Isosceles Triangle:</strong> Two sides and two angles are equal</li>
            <li><strong>Scalene Triangle:</strong> All sides and angles are different</li>
          </ul>
          
          <h3>Quadrilaterals</h3>
          <p>A quadrilateral is a four-sided polygon. The sum of all angles is 360 degrees.</p>
          <ul>
            <li><strong>Square:</strong> All sides equal, all angles 90 degrees</li>
            <li><strong>Rectangle:</strong> Opposite sides equal, all angles 90 degrees</li>
            <li><strong>Rhombus:</strong> All sides equal, opposite angles equal</li>
            <li><strong>Parallelogram:</strong> Opposite sides parallel and equal</li>
          </ul>
          
          <h3>Circles</h3>
          <p>A circle is a round shape where all points are equidistant from the center. Key terms include:</p>
          <ul>
            <li><strong>Radius:</strong> Distance from center to edge</li>
            <li><strong>Diameter:</strong> Distance across the circle through the center (2 × radius)</li>
            <li><strong>Circumference:</strong> Distance around the circle</li>
          </ul>
          
          <h3>Classroom Activities</h3>
          <ul>
            <li>Measure and compare angles in different triangles</li>
            <li>Create quadrilaterals using straws or popsicle sticks</li>
            <li>Use string and pins to draw circles and measure components</li>
          </ul>
        `
      },
      {
        id: 4,
        chapter_number: 3,
        title: "Perimeter and Area",
        content: `
          <h2>Understanding Perimeter and Area</h2>
          <p>Perimeter and area are fundamental measurements in geometry that help us quantify the size and boundaries of shapes.</p>
          
          <h3>Perimeter</h3>
          <p><strong>Perimeter</strong> is the total distance around the outside of a shape. It is measured in linear units (cm, m, inches, feet).</p>
          <ul>
            <li><strong>Rectangle:</strong> P = 2(length + width)</li>
            <li><strong>Square:</strong> P = 4 × side</li>
            <li><strong>Triangle:</strong> P = side₁ + side₂ + side₃</li>
            <li><strong>Circle (Circumference):</strong> C = 2πr or πd</li>
          </ul>
          
          <h3>Area</h3>
          <p><strong>Area</strong> is the amount of space inside a shape. It is measured in square units (cm², m², square inches).</p>
          <ul>
            <li><strong>Rectangle:</strong> A = length × width</li>
            <li><strong>Square:</strong> A = side²</li>
            <li><strong>Triangle:</strong> A = ½ × base × height</li>
            <li><strong>Circle:</strong> A = πr²</li>
          </ul>
          
          <h3>Practical Applications</h3>
          <p>Understanding perimeter and area is essential for:</p>
          <ul>
            <li>Calculating fence length needed for a yard (perimeter)</li>
            <li>Determining carpet needed for a room (area)</li>
            <li>Finding paint needed for a wall (area)</li>
            <li>Planning garden layouts</li>
          </ul>
          
          <h3>Teaching Tips</h3>
          <ul>
            <li>Use grid paper for students to visualize area</li>
            <li>Measure real classroom objects</li>
            <li>Create word problems from real-life scenarios</li>
            <li>Use online geometry tools for interactive practice</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 2,
    castle_number: 2,
    name: "Angles and Lines",
    description: "Understanding angles, parallel and perpendicular lines",
    chapters: [
      {
        id: 5,
        chapter_number: 1,
        title: "Types of Angles",
        content: `
          <h2>Understanding Angles</h2>
          <p>An <strong>angle</strong> is formed when two rays meet at a common point called the vertex. Angles are measured in degrees (°).</p>
          
          <h3>Types of Angles by Measurement</h3>
          <ul>
            <li><strong>Acute Angle:</strong> Less than 90° (example: 45°, 60°)</li>
            <li><strong>Right Angle:</strong> Exactly 90° (forms a perfect corner)</li>
            <li><strong>Obtuse Angle:</strong> Greater than 90° but less than 180° (example: 120°, 150°)</li>
            <li><strong>Straight Angle:</strong> Exactly 180° (forms a straight line)</li>
            <li><strong>Reflex Angle:</strong> Greater than 180° but less than 360°</li>
          </ul>
          
          <h3>Complementary and Supplementary Angles</h3>
          <p><strong>Complementary angles</strong> are two angles that add up to 90°. For example, 30° and 60° are complementary.</p>
          <p><strong>Supplementary angles</strong> are two angles that add up to 180°. For example, 110° and 70° are supplementary.</p>
          
          <h3>Adjacent Angles</h3>
          <p><strong>Adjacent angles</strong> share a common vertex and a common side but do not overlap.</p>
          
          <h3>Vertical Angles</h3>
          <p>When two lines intersect, they form two pairs of <strong>vertical angles</strong>. Vertical angles are always equal.</p>
          
          <h3>Classroom Activities</h3>
          <ul>
            <li>Use protractors to measure angles around the classroom</li>
            <li>Create angle art by drawing designs with specific angle measurements</li>
            <li>Play "angle estimation" games</li>
            <li>Find real-world examples of different angle types</li>
          </ul>
        `
      },
      {
        id: 6,
        chapter_number: 2,
        title: "Parallel and Perpendicular Lines",
        content: `
          <h2>Parallel Lines</h2>
          <p><strong>Parallel lines</strong> are lines in the same plane that never intersect, no matter how far they are extended. They are always the same distance apart.</p>
          
          <h3>Properties of Parallel Lines</h3>
          <ul>
            <li>Parallel lines have the same slope</li>
            <li>They never meet or cross</li>
            <li>The distance between them remains constant</li>
            <li>Symbol: ||  (Example: Line AB || Line CD)</li>
          </ul>
          
          <h3>Real-World Examples</h3>
          <ul>
            <li>Railroad tracks</li>
            <li>Opposite edges of a ruler</li>
            <li>Lines on notebook paper</li>
            <li>Opposite sides of a rectangle</li>
          </ul>
          
          <h2>Perpendicular Lines</h2>
          <p><strong>Perpendicular lines</strong> are lines that intersect at a right angle (90°).</p>
          
          <h3>Properties of Perpendicular Lines</h3>
          <ul>
            <li>They intersect at exactly one point</li>
            <li>They form four right angles at the intersection</li>
            <li>Symbol: ⊥  (Example: Line AB ⊥ Line CD)</li>
          </ul>
          
          <h3>Real-World Examples</h3>
          <ul>
            <li>Corner of a room where walls meet</li>
            <li>Streets at an intersection</li>
            <li>The plus sign (+)</li>
            <li>Edges of a book</li>
          </ul>
          
          <h3>Teaching Strategies</h3>
          <ul>
            <li>Use geoboards to create parallel and perpendicular lines</li>
            <li>Take photos of parallel and perpendicular lines in the school</li>
            <li>Use graph paper to draw and identify line relationships</li>
            <li>Practice with compass and straightedge constructions</li>
          </ul>
        `
      },
      {
        id: 7,
        chapter_number: 3,
        title: "Transversals and Angle Relationships",
        content: `
          <h2>Transversals</h2>
          <p>A <strong>transversal</strong> is a line that intersects two or more lines at different points. When a transversal crosses parallel lines, it creates special angle relationships.</p>
          
          <h3>Angles Formed by Transversals</h3>
          <p>When a transversal intersects two parallel lines, eight angles are formed. These angles have special relationships:</p>
          
          <h4>Corresponding Angles</h4>
          <p>Angles that are in the same position at each intersection. Corresponding angles are equal when lines are parallel.</p>
          
          <h4>Alternate Interior Angles</h4>
          <p>Angles on opposite sides of the transversal, between the parallel lines. These angles are equal when lines are parallel.</p>
          
          <h4>Alternate Exterior Angles</h4>
          <p>Angles on opposite sides of the transversal, outside the parallel lines. These angles are equal when lines are parallel.</p>
          
          <h4>Consecutive Interior Angles</h4>
          <p>Angles on the same side of the transversal, between the parallel lines. These angles are supplementary (add up to 180°).</p>
          
          <h3>Practical Applications</h3>
          <ul>
            <li>Architecture and building design</li>
            <li>Engineering and construction</li>
            <li>Road and highway planning</li>
            <li>Creating parallel park designs</li>
          </ul>
          
          <h3>Problem-Solving Tips</h3>
          <ul>
            <li>Always identify which lines are parallel</li>
            <li>Label all known angles</li>
            <li>Use angle relationships to find unknown angles</li>
            <li>Check your work by verifying angle sums</li>
          </ul>
        `
      },
      {
        id: 8,
        chapter_number: 4,
        title: "Angle Bisectors and Constructions",
        content: `
          <h2>Angle Bisectors</h2>
          <p>An <strong>angle bisector</strong> is a ray that divides an angle into two equal parts. The bisector creates two congruent angles.</p>
          
          <h3>Properties of Angle Bisectors</h3>
          <ul>
            <li>Divides the angle into two equal angles</li>
            <li>Starts at the vertex of the angle</li>
            <li>Any point on the bisector is equidistant from the sides of the angle</li>
          </ul>
          
          <h3>Constructing an Angle Bisector</h3>
          <p><strong>Using Compass and Straightedge:</strong></p>
          <ol>
            <li>Place the compass point on the vertex of the angle</li>
            <li>Draw an arc that intersects both sides of the angle</li>
            <li>Place the compass on each intersection point</li>
            <li>Draw two arcs that intersect each other</li>
            <li>Draw a ray from the vertex through the arc intersection</li>
          </ol>
          
          <h3>Perpendicular Bisector</h3>
          <p>A <strong>perpendicular bisector</strong> is a line that divides a line segment into two equal parts at a 90° angle.</p>
          
          <h3>Applications</h3>
          <ul>
            <li>Finding the center of a circle</li>
            <li>Creating symmetrical designs</li>
            <li>Dividing spaces equally</li>
            <li>Navigation and mapping</li>
          </ul>
          
          <h3>Classroom Activities</h3>
          <ul>
            <li>Practice compass and straightedge constructions</li>
            <li>Create geometric art using bisectors</li>
            <li>Use folding paper to demonstrate bisectors</li>
            <li>Solve real-world problems involving bisectors</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 3,
    castle_number: 3,
    name: "Triangles and Polygons",
    description: "In-depth study of triangles and multi-sided polygons",
    chapters: [
      {
        id: 9,
        chapter_number: 1,
        title: "Triangle Classification and Properties",
        content: `
          <h2>Triangles: The Foundation of Polygons</h2>
          <p>A <strong>triangle</strong> is a polygon with three sides, three vertices, and three angles. It is the simplest polygon and forms the basis for understanding more complex shapes.</p>
          
          <h3>Classification by Sides</h3>
          <ul>
            <li><strong>Equilateral Triangle:</strong> All three sides are equal in length. All three angles are 60°.</li>
            <li><strong>Isosceles Triangle:</strong> Two sides are equal in length. The angles opposite the equal sides are also equal.</li>
            <li><strong>Scalene Triangle:</strong> All three sides have different lengths. All three angles are different.</li>
          </ul>
          
          <h3>Classification by Angles</h3>
          <ul>
            <li><strong>Acute Triangle:</strong> All three angles are less than 90°</li>
            <li><strong>Right Triangle:</strong> One angle is exactly 90°</li>
            <li><strong>Obtuse Triangle:</strong> One angle is greater than 90°</li>
          </ul>
          
          <h3>Triangle Angle Sum Theorem</h3>
          <p>The sum of the interior angles of any triangle is always <strong>180 degrees</strong>. This is one of the most important properties in geometry.</p>
          <p><em>Example:</em> If two angles of a triangle are 60° and 70°, the third angle must be 50° (180° - 60° - 70° = 50°)</p>
          
          <h3>Triangle Inequality Theorem</h3>
          <p>The sum of the lengths of any two sides of a triangle must be greater than the length of the third side.</p>
          <p><em>Example:</em> If a triangle has sides of 5 cm and 7 cm, the third side must be less than 12 cm and greater than 2 cm.</p>
          
          <h3>Teaching Strategies</h3>
          <ul>
            <li>Use straws or toothpicks to build different types of triangles</li>
            <li>Have students measure angles to verify the angle sum theorem</li>
            <li>Challenge students to find triangles in architecture and design</li>
            <li>Create triangle tessellations and patterns</li>
          </ul>
        `
      },
      {
        id: 10,
        chapter_number: 2,
        title: "Pythagorean Theorem",
        content: `
          <h2>The Pythagorean Theorem</h2>
          <p>The <strong>Pythagorean Theorem</strong> is one of the most famous theorems in mathematics. It describes the relationship between the sides of a right triangle.</p>
          
          <h3>The Theorem</h3>
          <p>In a right triangle, the square of the hypotenuse (the longest side opposite the right angle) equals the sum of the squares of the other two sides.</p>
          <p><strong>Formula:</strong> a² + b² = c²</p>
          <p>Where c is the hypotenuse, and a and b are the other two sides (legs).</p>
          
          <h3>Example Problem</h3>
          <p>If a right triangle has legs of 3 cm and 4 cm, what is the length of the hypotenuse?</p>
          <p><strong>Solution:</strong></p>
          <ul>
            <li>a² + b² = c²</li>
            <li>3² + 4² = c²</li>
            <li>9 + 16 = c²</li>
            <li>25 = c²</li>
            <li>c = 5 cm</li>
          </ul>
          
          <h3>Pythagorean Triples</h3>
          <p><strong>Pythagorean triples</strong> are sets of three positive integers that satisfy the Pythagorean theorem:</p>
          <ul>
            <li>3, 4, 5 (most common)</li>
            <li>5, 12, 13</li>
            <li>8, 15, 17</li>
            <li>7, 24, 25</li>
          </ul>
          
          <h3>Real-World Applications</h3>
          <ul>
            <li>Construction: Ensuring corners are square (using 3-4-5 triangle)</li>
            <li>Navigation: Calculating shortest distances</li>
            <li>Architecture: Determining roof slopes and rafter lengths</li>
            <li>Sports: Calculating diagonal distances on fields</li>
          </ul>
          
          <h3>Hands-On Activities</h3>
          <ul>
            <li>Use rope to create a 3-4-5 triangle outdoors</li>
            <li>Measure diagonal distances in the classroom</li>
            <li>Solve real-world distance problems</li>
            <li>Create visual proofs using graph paper</li>
          </ul>
        `
      },
      {
        id: 11,
        chapter_number: 3,
        title: "Polygons and Their Properties",
        content: `
          <h2>Understanding Polygons</h2>
          <p>A <strong>polygon</strong> is a closed figure made up of straight line segments. The word "polygon" comes from Greek words meaning "many angles."</p>
          
          <h3>Types of Polygons by Number of Sides</h3>
          <ul>
            <li><strong>Triangle:</strong> 3 sides</li>
            <li><strong>Quadrilateral:</strong> 4 sides</li>
            <li><strong>Pentagon:</strong> 5 sides</li>
            <li><strong>Hexagon:</strong> 6 sides</li>
            <li><strong>Heptagon:</strong> 7 sides</li>
            <li><strong>Octagon:</strong> 8 sides</li>
            <li><strong>Nonagon:</strong> 9 sides</li>
            <li><strong>Decagon:</strong> 10 sides</li>
          </ul>
          
          <h3>Regular vs. Irregular Polygons</h3>
          <p><strong>Regular polygons</strong> have all sides equal and all angles equal. Examples include equilateral triangles, squares, and regular hexagons.</p>
          <p><strong>Irregular polygons</strong> have sides and angles that are not all equal.</p>
          
          <h3>Interior Angle Sum Formula</h3>
          <p>The sum of interior angles of a polygon with n sides is:</p>
          <p><strong>Sum = (n - 2) × 180°</strong></p>
          <p><em>Examples:</em></p>
          <ul>
            <li>Triangle (3 sides): (3-2) × 180° = 180°</li>
            <li>Quadrilateral (4 sides): (4-2) × 180° = 360°</li>
            <li>Pentagon (5 sides): (5-2) × 180° = 540°</li>
            <li>Hexagon (6 sides): (6-2) × 180° = 720°</li>
          </ul>
          
          <h3>Exterior Angles</h3>
          <p>The sum of the exterior angles of any polygon is always <strong>360°</strong>, regardless of the number of sides.</p>
          
          <h3>Real-World Polygons</h3>
          <ul>
            <li>Stop signs are regular octagons</li>
            <li>Honeycomb cells are regular hexagons</li>
            <li>Home plate in baseball is a pentagon</li>
            <li>Many floor tiles are squares or hexagons</li>
          </ul>
          
          <h3>Teaching Activities</h3>
          <ul>
            <li>Create polygon posters identifying real-world examples</li>
            <li>Build polygons with pattern blocks</li>
            <li>Calculate interior angle sums for different polygons</li>
            <li>Design tessellations using regular polygons</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 4,
    castle_number: 4,
    name: "Circles and Circular Geometry",
    description: "Properties of circles, arcs, and sectors",
    chapters: [
      {
        id: 12,
        chapter_number: 1,
        title: "Circle Fundamentals",
        content: `
          <h2>Introduction to Circles</h2>
          <p>A <strong>circle</strong> is a set of all points in a plane that are equidistant from a fixed point called the center. The circle is one of the most important shapes in geometry.</p>
          
          <h3>Parts of a Circle</h3>
          <ul>
            <li><strong>Center:</strong> The fixed point from which all points on the circle are equidistant</li>
            <li><strong>Radius (r):</strong> The distance from the center to any point on the circle</li>
            <li><strong>Diameter (d):</strong> The distance across the circle through the center (d = 2r)</li>
            <li><strong>Chord:</strong> A line segment connecting two points on the circle</li>
            <li><strong>Secant:</strong> A line that intersects the circle at two points</li>
            <li><strong>Tangent:</strong> A line that touches the circle at exactly one point</li>
          </ul>
          
          <h3>Circumference</h3>
          <p>The <strong>circumference</strong> is the distance around the circle. It's calculated using:</p>
          <p><strong>C = 2πr</strong> or <strong>C = πd</strong></p>
          <p>Where π (pi) ≈ 3.14159...</p>
          
          <h3>Area of a Circle</h3>
          <p>The <strong>area</strong> of a circle is the space enclosed by the circle:</p>
          <p><strong>A = πr²</strong></p>
          
          <h3>Example Problems</h3>
          <p><strong>Problem 1:</strong> Find the circumference of a circle with radius 7 cm.</p>
          <ul>
            <li>C = 2πr = 2 × π × 7 = 14π ≈ 43.98 cm</li>
          </ul>
          
          <p><strong>Problem 2:</strong> Find the area of a circle with diameter 10 m.</p>
          <ul>
            <li>Radius = 10 ÷ 2 = 5 m</li>
            <li>A = πr² = π × 5² = 25π ≈ 78.54 m²</li>
          </ul>
          
          <h3>Real-World Applications</h3>
          <ul>
            <li>Calculating the size of pizzas</li>
            <li>Designing circular gardens or pools</li>
            <li>Determining wheel rotations and distances</li>
            <li>Engineering circular structures</li>
          </ul>
        `
      },
      {
        id: 13,
        chapter_number: 2,
        title: "Arcs and Sectors",
        content: `
          <h2>Arcs</h2>
          <p>An <strong>arc</strong> is a portion of the circumference of a circle. Arcs are measured in degrees or in length.</p>
          
          <h3>Types of Arcs</h3>
          <ul>
            <li><strong>Minor Arc:</strong> An arc less than 180° (less than half the circle)</li>
            <li><strong>Major Arc:</strong> An arc greater than 180° (more than half the circle)</li>
            <li><strong>Semicircle:</strong> An arc that is exactly 180° (half the circle)</li>
          </ul>
          
          <h3>Arc Length Formula</h3>
          <p>The length of an arc is proportional to its central angle:</p>
          <p><strong>Arc Length = (θ/360°) × 2πr</strong></p>
          <p>Where θ is the central angle in degrees</p>
          
          <h3>Sectors</h3>
          <p>A <strong>sector</strong> is the region bounded by two radii and an arc. It looks like a "slice of pie."</p>
          
          <h3>Area of a Sector</h3>
          <p><strong>Area of Sector = (θ/360°) × πr²</strong></p>
          
          <h3>Example Problem</h3>
          <p>Find the arc length and sector area for a circle with radius 6 cm and central angle 60°.</p>
          <p><strong>Arc Length:</strong></p>
          <ul>
            <li>Arc Length = (60°/360°) × 2π(6) = (1/6) × 12π = 2π ≈ 6.28 cm</li>
          </ul>
          <p><strong>Sector Area:</strong></p>
          <ul>
            <li>Area = (60°/360°) × π(6²) = (1/6) × 36π = 6π ≈ 18.85 cm²</li>
          </ul>
          
          <h3>Real-World Examples</h3>
          <ul>
            <li>Pie charts in statistics</li>
            <li>Pizza slices</li>
            <li>Windshield wipers covering an arc</li>
            <li>Pendulum swing paths</li>
          </ul>
        `
      },
      {
        id: 14,
        chapter_number: 3,
        title: "Angles in Circles",
        content: `
          <h2>Central Angles</h2>
          <p>A <strong>central angle</strong> is an angle whose vertex is at the center of the circle. The measure of a central angle equals the measure of its intercepted arc.</p>
          
          <h3>Inscribed Angles</h3>
          <p>An <strong>inscribed angle</strong> is an angle formed by two chords that share an endpoint on the circle.</p>
          <p><strong>Key Property:</strong> An inscribed angle is half the measure of its intercepted arc.</p>
          
          <h3>Inscribed Angle Theorem</h3>
          <p>If an inscribed angle intercepts a semicircle (180° arc), the inscribed angle is 90°. This means any angle inscribed in a semicircle is a right angle.</p>
          
          <h3>Angles Formed by Chords, Secants, and Tangents</h3>
          <p><strong>Two Chords Intersecting Inside a Circle:</strong></p>
          <p>The measure of the angle equals half the sum of the intercepted arcs.</p>
          
          <p><strong>Two Secants Intersecting Outside a Circle:</strong></p>
          <p>The measure of the angle equals half the difference of the intercepted arcs.</p>
          
          <p><strong>Tangent-Chord Angle:</strong></p>
          <p>The angle formed by a tangent and a chord equals half the measure of the intercepted arc.</p>
          
          <h3>Properties of Tangent Lines</h3>
          <ul>
            <li>A tangent line is perpendicular to the radius at the point of tangency</li>
            <li>Two tangents from an external point are equal in length</li>
          </ul>
          
          <h3>Problem-Solving Strategies</h3>
          <ul>
            <li>Always identify the type of angle (central, inscribed, etc.)</li>
            <li>Draw and label all known information</li>
            <li>Use the appropriate angle-arc relationship</li>
            <li>Check your answer by verifying angle measures</li>
          </ul>
        `
      },
      {
        id: 15,
        chapter_number: 4,
        title: "Circle Theorems and Applications",
        content: `
          <h2>Important Circle Theorems</h2>
          
          <h3>Theorem 1: Perpendicular from Center to Chord</h3>
          <p>A perpendicular line from the center of a circle to a chord bisects the chord (divides it into two equal parts).</p>
          
          <h3>Theorem 2: Equal Chords</h3>
          <p>In the same circle or congruent circles:</p>
          <ul>
            <li>Equal chords are equidistant from the center</li>
            <li>Chords equidistant from the center are equal in length</li>
          </ul>
          
          <h3>Theorem 3: Angle in the Same Segment</h3>
          <p>Angles inscribed in the same arc (or segment) are equal.</p>
          
          <h3>Theorem 4: Opposite Angles of Cyclic Quadrilateral</h3>
          <p>A cyclic quadrilateral is a quadrilateral whose vertices all lie on a circle. The opposite angles of a cyclic quadrilateral are supplementary (add up to 180°).</p>
          
          <h3>Applications of Circle Geometry</h3>
          
          <h4>Architecture and Design</h4>
          <ul>
            <li>Arches in buildings (semicircular or segmental arcs)</li>
            <li>Domed structures (portions of spheres)</li>
            <li>Circular windows and rose windows in cathedrals</li>
          </ul>
          
          <h4>Engineering</h4>
          <ul>
            <li>Gear design and mechanics</li>
            <li>Wheel and axle systems</li>
            <li>Circular motion in machinery</li>
          </ul>
          
          <h4>Navigation and Astronomy</h4>
          <ul>
            <li>Earth's orbit calculations</li>
            <li>Satellite positioning</li>
            <li>GPS coordinate systems</li>
          </ul>
          
          <h3>Advanced Problem Solving</h3>
          <ul>
            <li>Combine multiple theorems to solve complex problems</li>
            <li>Use algebraic equations with circle properties</li>
            <li>Apply coordinate geometry to circle problems</li>
            <li>Explore tangent circles and intersecting circles</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 5,
    castle_number: 5,
    name: "3D Geometry and Solid Figures",
    description: "Understanding three-dimensional shapes and their properties",
    chapters: [
      {
        id: 16,
        chapter_number: 1,
        title: "Introduction to 3D Shapes",
        content: `
          <h2>Three-Dimensional Geometry</h2>
          <p><strong>Three-dimensional (3D) shapes</strong> are solid figures that have length, width, and height. Unlike 2D shapes that lie flat on a plane, 3D shapes occupy space and have volume.</p>
          
          <h3>Key Terms in 3D Geometry</h3>
          <ul>
            <li><strong>Face:</strong> A flat surface of a 3D shape</li>
            <li><strong>Edge:</strong> The line segment where two faces meet</li>
            <li><strong>Vertex:</strong> The point where edges meet (plural: vertices)</li>
            <li><strong>Volume:</strong> The amount of space inside a 3D shape</li>
            <li><strong>Surface Area:</strong> The total area of all faces</li>
          </ul>
          
          <h3>Common 3D Shapes</h3>
          
          <h4>Polyhedra (Shapes with Flat Faces)</h4>
          <ul>
            <li><strong>Cube:</strong> 6 square faces, 12 edges, 8 vertices</li>
            <li><strong>Rectangular Prism (Cuboid):</strong> 6 rectangular faces</li>
            <li><strong>Triangular Prism:</strong> 2 triangular faces, 3 rectangular faces</li>
            <li><strong>Pyramid:</strong> Triangular faces meeting at a point (apex)</li>
          </ul>
          
          <h4>Curved Surfaces</h4>
          <ul>
            <li><strong>Sphere:</strong> Perfectly round like a ball</li>
            <li><strong>Cylinder:</strong> Two circular faces connected by a curved surface</li>
            <li><strong>Cone:</strong> One circular face tapering to a point</li>
          </ul>
          
          <h3>Euler's Formula for Polyhedra</h3>
          <p>For any polyhedron: <strong>V - E + F = 2</strong></p>
          <p>Where V = vertices, E = edges, F = faces</p>
          <p><em>Example:</em> For a cube: 8 - 12 + 6 = 2 ✓</p>
          
          <h3>Real-World 3D Shapes</h3>
          <ul>
            <li>Dice (cubes)</li>
            <li>Books and boxes (rectangular prisms)</li>
            <li>Soup cans (cylinders)</li>
            <li>Ice cream cones (cones)</li>
            <li>Basketballs (spheres)</li>
            <li>Tents (triangular prisms or pyramids)</li>
          </ul>
          
          <h3>Teaching Activities</h3>
          <ul>
            <li>Build 3D shapes with clay or play-dough</li>
            <li>Create nets and fold them into 3D shapes</li>
            <li>Count faces, edges, and vertices on real objects</li>
            <li>Use 3D modeling software or apps</li>
          </ul>
        `
      },
      {
        id: 17,
        chapter_number: 2,
        title: "Surface Area of 3D Shapes",
        content: `
          <h2>Understanding Surface Area</h2>
          <p><strong>Surface area</strong> is the total area of all the faces or surfaces of a three-dimensional shape. It's measured in square units (cm², m², etc.).</p>
          
          <h3>Surface Area Formulas</h3>
          
          <h4>Cube</h4>
          <p><strong>SA = 6s²</strong></p>
          <p>Where s is the length of one side</p>
          <p><em>Example:</em> If s = 5 cm, then SA = 6 × 5² = 6 × 25 = 150 cm²</p>
          
          <h4>Rectangular Prism (Cuboid)</h4>
          <p><strong>SA = 2(lw + lh + wh)</strong></p>
          <p>Where l = length, w = width, h = height</p>
          <p><em>Example:</em> If l = 8, w = 3, h = 4</p>
          <p>SA = 2(8×3 + 8×4 + 3×4) = 2(24 + 32 + 12) = 2(68) = 136 units²</p>
          
          <h4>Cylinder</h4>
          <p><strong>SA = 2πr² + 2πrh</strong></p>
          <p>Where r = radius, h = height</p>
          <p>This includes the two circular bases (2πr²) and the curved surface (2πrh)</p>
          
          <h4>Sphere</h4>
          <p><strong>SA = 4πr²</strong></p>
          <p>Where r is the radius</p>
          
          <h4>Cone</h4>
          <p><strong>SA = πr² + πrl</strong></p>
          <p>Where r = radius of base, l = slant height</p>
          <p>This includes the circular base (πr²) and the curved surface (πrl)</p>
          
          <h3>Nets and Surface Area</h3>
          <p>A <strong>net</strong> is a two-dimensional pattern that can be folded to form a 3D shape. Drawing and analyzing nets helps visualize and calculate surface area.</p>
          
          <h3>Real-World Applications</h3>
          <ul>
            <li>Calculating paint needed for walls and rooms</li>
            <li>Determining wrapping paper needed for gifts</li>
            <li>Designing packaging for products</li>
            <li>Estimating material for manufacturing</li>
          </ul>
          
          <h3>Problem-Solving Tips</h3>
          <ul>
            <li>Identify the shape and write the formula</li>
            <li>Substitute the given measurements</li>
            <li>Calculate step by step</li>
            <li>Include the correct square units in your answer</li>
          </ul>
        `
      },
      {
        id: 18,
        chapter_number: 3,
        title: "Volume of 3D Shapes",
        content: `
          <h2>Understanding Volume</h2>
          <p><strong>Volume</strong> is the amount of space inside a three-dimensional shape. It's measured in cubic units (cm³, m³, etc.).</p>
          
          <h3>Volume Formulas</h3>
          
          <h4>Cube</h4>
          <p><strong>V = s³</strong></p>
          <p>Where s is the length of one side</p>
          <p><em>Example:</em> If s = 4 cm, then V = 4³ = 64 cm³</p>
          
          <h4>Rectangular Prism</h4>
          <p><strong>V = l × w × h</strong></p>
          <p>Where l = length, w = width, h = height</p>
          <p><em>Example:</em> If l = 10, w = 5, h = 3, then V = 10 × 5 × 3 = 150 units³</p>
          
          <h4>Cylinder</h4>
          <p><strong>V = πr²h</strong></p>
          <p>Where r = radius, h = height</p>
          <p><em>Example:</em> If r = 3 cm and h = 7 cm, then V = π × 3² × 7 = 63π ≈ 197.92 cm³</p>
          
          <h4>Sphere</h4>
          <p><strong>V = (4/3)πr³</strong></p>
          <p>Where r is the radius</p>
          <p><em>Example:</em> If r = 6 cm, then V = (4/3) × π × 6³ = 288π ≈ 904.78 cm³</p>
          
          <h4>Cone</h4>
          <p><strong>V = (1/3)πr²h</strong></p>
          <p>Where r = radius of base, h = height</p>
          <p><em>Note:</em> A cone has 1/3 the volume of a cylinder with the same base and height</p>
          
          <h4>Pyramid</h4>
          <p><strong>V = (1/3) × Base Area × h</strong></p>
          <p>Where h is the perpendicular height</p>
          <p>For a square pyramid: V = (1/3) × s² × h</p>
          
          <h3>Comparing Volumes</h3>
          <ul>
            <li>A cone has 1/3 the volume of a cylinder with the same dimensions</li>
            <li>A pyramid has 1/3 the volume of a prism with the same base and height</li>
            <li>A sphere has 2/3 the volume of a cylinder that perfectly contains it</li>
          </ul>
          
          <h3>Real-World Applications</h3>
          <ul>
            <li>Calculating water tank capacity</li>
            <li>Determining package shipping sizes</li>
            <li>Measuring ingredient volumes in cooking</li>
            <li>Calculating concrete needed for construction</li>
            <li>Determining storage capacity</li>
          </ul>
          
          <h3>Practice Problems</h3>
          <p>Encourage students to:</p>
          <ul>
            <li>Measure real containers and calculate volumes</li>
            <li>Compare volumes of different shaped containers</li>
            <li>Solve word problems involving volume</li>
            <li>Investigate how changing dimensions affects volume</li>
          </ul>
        `
      },
      {
        id: 19,
        chapter_number: 4,
        title: "Composite 3D Shapes",
        content: `
          <h2>Composite Solid Figures</h2>
          <p>A <strong>composite shape</strong> is a three-dimensional figure made up of two or more basic 3D shapes combined together. To find the surface area or volume of composite shapes, we calculate each part separately and then combine the results.</p>
          
          <h3>Strategies for Composite Shapes</h3>
          
          <h4>Volume of Composite Shapes</h4>
          <ol>
            <li><strong>Identify</strong> the basic shapes that make up the composite figure</li>
            <li><strong>Calculate</strong> the volume of each individual shape</li>
            <li><strong>Add or subtract</strong> volumes as needed</li>
          </ol>
          
          <h4>Surface Area of Composite Shapes</h4>
          <ol>
            <li><strong>Identify</strong> all visible surfaces</li>
            <li><strong>Calculate</strong> the area of each surface</li>
            <li><strong>Subtract</strong> areas where shapes connect (hidden surfaces)</li>
            <li><strong>Add</strong> all visible surface areas</li>
          </ol>
          
          <h3>Common Composite Shapes</h3>
          
          <h4>Cylinder with Hemisphere</h4>
          <p>Example: A capsule (like a pill)</p>
          <p><strong>Volume = πr²h + (2/3)πr³</strong></p>
          <p>Volume of cylinder + volume of two hemispheres (which equals one sphere)</p>
          
          <h4>Cone on Top of Cylinder</h4>
          <p>Example: A silo or tower</p>
          <p><strong>Volume = πr²h₁ + (1/3)πr²h₂</strong></p>
          <p>Where h₁ is cylinder height and h₂ is cone height</p>
          
          <h4>Cube with Pyramid on Top</h4>
          <p>Example: A house shape</p>
          <p><strong>Volume = s³ + (1/3)s²h</strong></p>
          <p>Where s is the side of the cube and h is the height of the pyramid</p>
          
          <h3>Real-World Examples</h3>
          <ul>
            <li><strong>Buildings:</strong> Combination of rectangular prisms with pyramidal or conical roofs</li>
            <li><strong>Silos:</strong> Cylinder with cone top</li>
            <li><strong>Ice cream cones:</strong> Cone with hemisphere of ice cream</li>
            <li><strong>Monuments:</strong> Often composite shapes (e.g., Washington Monument)</li>
            <li><strong>Trophies:</strong> Various shapes combined on a base</li>
          </ul>
          
          <h3>Problem-Solving Steps</h3>
          <ol>
            <li>Draw and label the composite shape</li>
            <li>Break it down into familiar 3D shapes</li>
            <li>Write the formula for each component</li>
            <li>Calculate each part separately</li>
            <li>Combine the results appropriately</li>
            <li>Check that your answer makes sense</li>
          </ol>
          
          <h3>Advanced Concepts</h3>
          <ul>
            <li>Shapes with holes (subtract the volume of the hole)</li>
            <li>L-shaped prisms</li>
            <li>Irregular shapes approximated by basic shapes</li>
            <li>Using calculus of revolution for complex curves</li>
          </ul>
          
          <h3>Classroom Activities</h3>
          <ul>
            <li>Build composite shapes with blocks and calculate volumes</li>
            <li>Design creative structures and calculate their properties</li>
            <li>Find composite shapes in architecture around school</li>
            <li>Create 3D models using software and verify calculations</li>
          </ul>
        `
      }
    ]
  },
  {
    id: 6,
    castle_number: 6,
    name: "Coordinate Geometry",
    description: "Applying geometry to the coordinate plane",
    chapters: [
      {
        id: 20,
        chapter_number: 1,
        title: "The Coordinate Plane",
        content: `
          <h2>Introduction to Coordinate Geometry</h2>
          <p><strong>Coordinate geometry</strong> (also called analytic geometry) combines algebra and geometry by using a coordinate system to describe geometric figures and their properties.</p>
          
          <h3>The Cartesian Coordinate System</h3>
          <p>The coordinate plane consists of two perpendicular number lines:</p>
          <ul>
            <li><strong>x-axis:</strong> The horizontal number line</li>
            <li><strong>y-axis:</strong> The vertical number line</li>
            <li><strong>Origin:</strong> The point (0, 0) where the axes intersect</li>
          </ul>
          
          <h3>Ordered Pairs</h3>
          <p>Every point on the coordinate plane is identified by an <strong>ordered pair (x, y)</strong>:</p>
          <ul>
            <li>The <strong>x-coordinate</strong> tells how far left or right from the origin</li>
            <li>The <strong>y-coordinate</strong> tells how far up or down from the origin</li>
          </ul>
          <p><em>Example:</em> The point (3, -2) is 3 units right and 2 units down from the origin</p>
          
          <h3>The Four Quadrants</h3>
          <ul>
            <li><strong>Quadrant I:</strong> (+, +) - Both coordinates positive</li>
            <li><strong>Quadrant II:</strong> (-, +) - x negative, y positive</li>
            <li><strong>Quadrant III:</strong> (-, -) - Both coordinates negative</li>
            <li><strong>Quadrant IV:</strong> (+, -) - x positive, y negative</li>
          </ul>
          
          <h3>Distance Formula</h3>
          <p>To find the distance between two points (x₁, y₁) and (x₂, y₂):</p>
          <p><strong>d = √[(x₂ - x₁)² + (y₂ - y₁)²]</strong></p>
          <p>This formula comes from the Pythagorean theorem!</p>
          <p><em>Example:</em> Distance from (1, 2) to (4, 6):</p>
          <p>d = √[(4-1)² + (6-2)²] = √[9 + 16] = √25 = 5 units</p>
          
          <h3>Midpoint Formula</h3>
          <p>To find the midpoint between two points (x₁, y₁) and (x₂, y₂):</p>
          <p><strong>M = ((x₁ + x₂)/2, (y₁ + y₂)/2)</strong></p>
          <p><em>Example:</em> Midpoint of (2, 3) and (8, 7):</p>
          <p>M = ((2+8)/2, (3+7)/2) = (5, 5)</p>
          
          <h3>Real-World Applications</h3>
          <ul>
            <li>GPS navigation and mapping</li>
            <li>Computer graphics and game design</li>
            <li>Architecture and engineering drawings</li>
            <li>Data visualization and plotting</li>
          </ul>
          
          <h3>Classroom Activities</h3>
          <ul>
            <li>Create coordinate plane art by plotting points</li>
            <li>Play "Battleship" to practice coordinates</li>
            <li>Plot real data on graphs</li>
            <li>Use graphing calculators or software</li>
          </ul>
        `
      }
    ]
  }
]

export default function TeacherCastleContentPage() {
  const { userProfile, appLoading } = useAuthStore()
  const [selectedCastleId, setSelectedCastleId] = useState<number | null>(null)
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null)

  if (appLoading) {
    return <LoadingOverlay isLoading={true} />
  }

  const selectedCastle = CASTLE_DATA.find(c => c.id === selectedCastleId)
  const selectedChapter = selectedCastle?.chapters.find(ch => ch.id === selectedChapterId)

  return (
    <>
      <div className={styles["dashboard-container"]}>
        <PageHeader
          title="Castle Content Handbook"
          subtitle="Comprehensive geometry curriculum guide for teachers"
          showAvatar={true}
          avatarText={userProfile?.first_name?.charAt(0).toUpperCase() || 'T'}
        />

        <div className={styles["scrollable-content"]}>
          <div className={castleStyles.mainContainer}>
            {/* Castle Tabs */}
            <div className={castleStyles.mainTabsContainer}>
              {CASTLE_DATA.map((castle) => (
                <button
                  key={castle.id}
                  className={`${castleStyles.mainTab} ${selectedCastleId === castle.id ? castleStyles.mainTabActive : ''}`}
                  onClick={() => {
                    setSelectedCastleId(castle.id)
                    setSelectedChapterId(castle.chapters[0]?.id || null)
                  }}
                >
                  <div className={castleStyles.mainTabNumber}>Castle {castle.castle_number}</div>
                  <div className={castleStyles.mainTabLabel}>{castle.name}</div>
                </button>
              ))}
            </div>

            {/* Chapter Tabs */}
            {selectedCastle && selectedCastle.chapters.length > 0 && (
              <div className={castleStyles.chapterTabsRow}>
                {selectedCastle.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    className={`${castleStyles.chapterTab} ${selectedChapterId === chapter.id ? castleStyles.chapterTabActive : ''}`}
                    onClick={() => setSelectedChapterId(chapter.id)}
                  >
                    <span className={castleStyles.chapterTabNum}>Ch {chapter.chapter_number}</span>
                    <span className={castleStyles.chapterTabName}>{chapter.title}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Area */}
            <div className={castleStyles.contentArea}>
              {!selectedCastle && (
                <div className={castleStyles.handbookContent}>
                  <div className={castleStyles.handbookHeader}>
                    <FaBook size={56} className={castleStyles.handbookIcon} />
                    <div>
                      <h1>Teacher's Geometry Curriculum Guide</h1>
                      <p className={castleStyles.handbookSubtitle}>
                        A comprehensive resource covering all geometry topics from foundational shapes through advanced coordinate geometry. 
                        Select a castle above to begin exploring lesson content.
                      </p>
                    </div>
                  </div>
                  
                  <div className={castleStyles.handbookGrid}>
                    <div className={castleStyles.handbookCard}>
                      <FaBook size={36} />
                      <h3>7 Learning Modules</h3>
                      <p>Progressive curriculum from pre-assessment through coordinate geometry</p>
                    </div>
                    <div className={castleStyles.handbookCard}>
                      <FaGraduationCap size={36} />
                      <h3>Complete Lessons</h3>
                      <p>Ready-to-teach content with definitions, examples, and applications</p>
                    </div>
                    <div className={castleStyles.handbookCard}>
                      <FaListAlt size={36} />
                      <h3>Teaching Strategies</h3>
                      <p>Practical classroom activities and problem-solving tips</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedChapter && (
                <div className={castleStyles.chapterContent}>
                  <div className={castleStyles.chapterTitleSection}>
                    <div className={castleStyles.chapterMeta}>
                      <span className={castleStyles.castleBadge}>Castle {selectedCastle?.castle_number}</span>
                      <span className={castleStyles.chapterBadge}>Chapter {selectedChapter.chapter_number}</span>
                    </div>
                    <h1>{selectedChapter.title}</h1>
                    <p className={castleStyles.chapterDesc}>{selectedCastle?.description}</p>
                  </div>

                  <div 
                    className={castleStyles.lessonContent}
                    dangerouslySetInnerHTML={{ __html: selectedChapter.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
