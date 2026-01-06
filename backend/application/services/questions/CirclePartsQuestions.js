/**
 * Parts of a Circle - Question Templates
 * Covers: radius, diameter, chord, arc, sector, tangent, central angles
 */

module.exports = {
  1: [
    {
      type: 'circle_parts',
      cognitiveDomain: 'knowledge_recall',
      template: 'What is the line segment from the center of a circle to any point on the circle called?',
      params: {},
      solution: () => 0,
      hint: 'It starts at the center',
      multipleChoice: ['Radius', 'Diameter', 'Chord', 'Arc']
    },
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
    {
      type: 'circle_center_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'The fixed point in the middle of a circle is called the:',
      params: {},
      solution: () => 0,
      hint: 'All radii extend from this point',
      multipleChoice: ['Center', 'Vertex', 'Midpoint', 'Origin']
    },
    {
      type: 'circle_diameter_radius_comparison',
      cognitiveDomain: 'concept_understanding',
      template: 'How many radii equal one diameter?',
      params: {},
      solution: () => 0,
      hint: 'Diameter = 2 × radius',
      multipleChoice: ['2', '1', '3', '4']
    }
  ],
  
  2: [
    {
      type: 'circle_arc_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A part of the circumference of a circle is called:',
      params: {},
      solution: () => 0,
      hint: 'It\'s a curved section of the circle\'s edge',
      multipleChoice: ['Arc', 'Chord', 'Sector', 'Segment']
    },
    {
      type: 'circle_sector_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'The region bounded by two radii and an arc is called:',
      params: {},
      solution: () => 0,
      hint: 'It looks like a slice of pizza',
      multipleChoice: ['Sector', 'Segment', 'Arc', 'Chord']
    },
    {
      type: 'circle_tangent_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'A line that touches a circle at exactly one point is called:',
      params: {},
      solution: () => 0,
      hint: 'It just barely touches the circle',
      multipleChoice: ['Tangent', 'Secant', 'Chord', 'Diameter']
    },
    {
      type: 'circle_central_angle',
      cognitiveDomain: 'concept_understanding',
      template: 'An angle whose vertex is at the center of a circle is called:',
      params: {},
      solution: () => 0,
      hint: 'Central means at the center',
      multipleChoice: ['Central angle', 'Inscribed angle', 'Right angle', 'Reflex angle']
    },
    {
      type: 'circle_major_minor_arc',
      cognitiveDomain: 'concept_understanding',
      template: 'An arc that measures less than 180° is called:',
      params: {},
      solution: () => 0,
      hint: 'Minor means smaller',
      multipleChoice: ['Minor arc', 'Major arc', 'Semicircle', 'Full circle']
    },
    {
      type: 'circle_semicircle_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'An arc that measures exactly 180° is called:',
      params: {},
      solution: () => 0,
      hint: 'Semi means half',
      multipleChoice: ['Semicircle', 'Minor arc', 'Major arc', 'Quarter circle']
    },
    {
      type: 'circle_congruent_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'Circles with equal radii are called:',
      params: {},
      solution: () => 0,
      hint: 'Congruent means identical in size and shape',
      multipleChoice: ['Congruent circles', 'Concentric circles', 'Similar circles', 'Intersecting circles']
    }
  ],
  
  3: [
    {
      type: 'circle_secant_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'A line that intersects a circle at two points is called:',
      params: {},
      solution: () => 0,
      hint: 'It cuts through the circle',
      multipleChoice: ['Secant', 'Tangent', 'Radius', 'Diameter']
    },
    {
      type: 'circle_inscribed_angle',
      cognitiveDomain: 'analytical_thinking',
      template: 'An angle formed by two chords with its vertex on the circle is called:',
      params: {},
      solution: () => 0,
      hint: 'Inscribed means written inside',
      multipleChoice: ['Inscribed angle', 'Central angle', 'Right angle', 'Exterior angle']
    },
    {
      type: 'circle_segment_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'The region bounded by a chord and the arc it cuts off is called:',
      params: {},
      solution: () => 0,
      hint: 'A segment is a piece or section',
      multipleChoice: ['Segment', 'Sector', 'Arc', 'Chord']
    },
    {
      type: 'circle_concentric',
      cognitiveDomain: 'concept_understanding',
      template: 'Circles that have the same center but different radii are called:',
      params: {},
      solution: () => 0,
      hint: 'They share the same center point',
      multipleChoice: ['Concentric circles', 'Congruent circles', 'Intersecting circles', 'Tangent circles']
    },
    {
      type: 'circle_point_of_tangency',
      cognitiveDomain: 'analytical_thinking',
      template: 'The point where a tangent line touches a circle is called the:',
      params: {},
      solution: () => 0,
      hint: 'It\'s the single point of contact',
      multipleChoice: ['Point of tangency', 'Center', 'Vertex', 'Endpoint']
    },
    {
      type: 'circle_common_tangent',
      cognitiveDomain: 'analytical_thinking',
      template: 'A line that is tangent to two circles is called:',
      params: {},
      solution: () => 0,
      hint: 'It touches both circles',
      multipleChoice: ['Common tangent', 'Common chord', 'Common secant', 'Common radius']
    },
    {
      type: 'circle_minor_arc_comparison',
      cognitiveDomain: 'concept_understanding',
      template: 'If a minor arc measures 120°, what is the measure of its corresponding major arc?',
      params: {},
      solution: () => 0,
      hint: 'Minor arc + Major arc = 360°',
      multipleChoice: ['240°', '180°', '120°', '300°']
    }
  ],
  
  4: [
    {
      type: 'circle_inscribed_angle_theorem',
      cognitiveDomain: 'analytical_thinking',
      template: 'An inscribed angle is always:',
      params: {},
      solution: () => 0,
      hint: 'It\'s half the measure of the central angle',
      multipleChoice: ['Half the central angle subtending the same arc', 'Equal to the central angle', 'Twice the central angle', 'Unrelated to the central angle']
    },
    {
      type: 'circle_tangent_perpendicular',
      cognitiveDomain: 'analytical_thinking',
      template: 'A tangent to a circle is always perpendicular to:',
      params: {},
      solution: () => 0,
      hint: 'The radius forms a 90° angle with the tangent',
      multipleChoice: ['The radius at the point of tangency', 'Any chord', 'The diameter', 'Another tangent']
    },
    {
      type: 'circle_chord_properties',
      cognitiveDomain: 'higher_order_thinking',
      template: 'If two chords in a circle are equal in length, they are:',
      params: {},
      solution: () => 0,
      hint: 'Equal chords are the same distance from the center',
      multipleChoice: ['Equidistant from the center', 'Parallel to each other', 'Perpendicular to each other', 'Always diameters']
    },
    {
      type: 'circle_arc_relationship',
      cognitiveDomain: 'analytical_thinking',
      template: 'If a central angle measures {angle}°, what is the measure of its intercepted arc?',
      params: {
        angle: { min: 45, max: 180 }
      },
      solution: (p) => p.angle,
      hint: 'The arc measure equals the central angle measure'
    },
    {
      type: 'circle_diameter_perpendicular_chord',
      cognitiveDomain: 'higher_order_thinking',
      template: 'A diameter that is perpendicular to a chord:',
      params: {},
      solution: () => 0,
      hint: 'It cuts the chord into two equal parts',
      multipleChoice: ['Bisects the chord', 'Is parallel to the chord', 'Is shorter than the chord', 'Has no special relationship']
    },
    {
      type: 'circle_tangent_radius_angle',
      cognitiveDomain: 'higher_order_thinking',
      template: 'What is the measure of the angle formed by a tangent and a radius at the point of tangency?',
      params: {},
      solution: () => 0,
      hint: 'Tangent is perpendicular to radius',
      multipleChoice: ['90°', '180°', '45°', '60°']
    },
    {
      type: 'circle_inscribed_angle_arc',
      cognitiveDomain: 'analytical_thinking',
      template: 'If an inscribed angle measures 40°, what is the measure of its intercepted arc?',
      params: {},
      solution: () => 0,
      hint: 'Inscribed angle = ½ arc measure',
      multipleChoice: ['80°', '40°', '20°', '120°']
    }
  ]
};
