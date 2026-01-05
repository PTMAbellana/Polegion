/**
 * Kinds of Angles - Question Templates
 * Covers: acute, right, obtuse, straight, reflex angles
 */

module.exports = {
  1: [
    {
      type: 'right_angle_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A right angle measures:',
      params: {},
      solution: () => 0,
      hint: 'A right angle is exactly 90°',
      multipleChoice: ['90°', '180°', '45°', '60°']
    },
    {
      type: 'acute_angle_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'An acute angle measures:',
      params: {},
      solution: () => 0,
      hint: 'Less than 90°',
      multipleChoice: ['Less than 90°', 'More than 90°', 'Exactly 90°', 'Exactly 180°']
    },
    {
      type: 'obtuse_angle_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'An obtuse angle measures:',
      params: {},
      solution: () => 0,
      hint: 'Between 90° and 180°',
      multipleChoice: ['Between 90° and 180°', 'Less than 90°', 'Exactly 90°', 'More than 180°']
    },
    {
      type: 'straight_angle_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A straight angle measures:',
      params: {},
      solution: () => 0,
      hint: 'A straight angle is exactly 180°',
      multipleChoice: ['180°', '90°', '360°', '270°']
    },
    {
      type: 'angle_classification_45',
      cognitiveDomain: 'concept_understanding',
      template: 'A 45° angle is:',
      params: {},
      solution: () => 0,
      hint: '45° is less than 90°',
      multipleChoice: ['Acute', 'Obtuse', 'Right', 'Straight']
    }
  ],
  
  2: [
    {
      type: 'angle_classification_120',
      cognitiveDomain: 'concept_understanding',
      template: 'A 120° angle is:',
      params: {},
      solution: () => 0,
      hint: '120° is between 90° and 180°',
      multipleChoice: ['Obtuse', 'Acute', 'Right', 'Straight']
    },
    {
      type: 'reflex_angle_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A reflex angle measures:',
      params: {},
      solution: () => 0,
      hint: 'Between 180° and 360°',
      multipleChoice: ['Between 180° and 360°', 'Between 90° and 180°', 'Less than 90°', 'Exactly 180°']
    },
    {
      type: 'complete_rotation',
      cognitiveDomain: 'knowledge_recall',
      template: 'A complete rotation measures:',
      params: {},
      solution: () => 0,
      hint: 'A full circle is 360°',
      multipleChoice: ['360°', '180°', '270°', '90°']
    },
    {
      type: 'vertical_angles',
      cognitiveDomain: 'concept_understanding',
      template: 'When two lines intersect, vertical angles are:',
      params: {},
      solution: () => 0,
      hint: 'Vertical angles are equal',
      multipleChoice: ['Equal', 'Complementary', 'Supplementary', 'Adjacent']
    },
    {
      type: 'adjacent_angles',
      cognitiveDomain: 'concept_understanding',
      template: 'Adjacent angles are angles that:',
      params: {},
      solution: () => 0,
      hint: 'They share a common vertex and side',
      multipleChoice: ['Share a vertex and a side', 'Are equal', 'Are vertical', 'Are opposite']
    }
  ],
  
  3: [
    {
      type: 'angle_bisector',
      cognitiveDomain: 'concept_understanding',
      template: 'An angle bisector:',
      params: {},
      solution: () => 0,
      hint: 'It divides the angle into two equal parts',
      multipleChoice: ['Divides an angle into two equal parts', 'Doubles an angle', 'Creates a right angle', 'Forms parallel lines']
    },
    {
      type: 'linear_pair',
      cognitiveDomain: 'concept_understanding',
      template: 'A linear pair of angles:',
      params: {},
      solution: () => 0,
      hint: 'They are adjacent and supplementary',
      multipleChoice: ['Are adjacent and supplementary', 'Are vertical angles', 'Are complementary', 'Are equal']
    },
    {
      type: 'vertical_angles_property',
      cognitiveDomain: 'procedural_skills',
      template: 'If one vertical angle measures {angle}°, the other measures:',
      params: {
        angle: { min: 30, max: 150 }
      },
      solution: (p) => p.angle,
      hint: 'Vertical angles are congruent'
    },
    {
      type: 'angle_addition',
      cognitiveDomain: 'procedural_skills',
      template: 'If angle ABC is divided by ray BD into angles ABD = {angle1}° and DBC = {angle2}°, what is angle ABC?',
      params: {
        angle1: { min: 20, max: 80 },
        angle2: { min: 20, max: 80 }
      },
      solution: (p) => p.angle1 + p.angle2,
      hint: 'Use Angle Addition Postulate'
    },
    {
      type: 'reflex_angle_example',
      cognitiveDomain: 'concept_understanding',
      template: 'A 270° angle is:',
      params: {},
      solution: () => 0,
      hint: '270° is between 180° and 360°',
      multipleChoice: ['Reflex', 'Obtuse', 'Straight', 'Complete']
    }
  ],
  
  4: [
    {
      type: 'angle_bisector_calculation',
      cognitiveDomain: 'procedural_skills',
      template: 'An angle of {angle}° is bisected. Each resulting angle measures:',
      params: {
        angle: { min: 60, max: 160, step: 2 }
      },
      solution: (p) => p.angle / 2,
      hint: 'Divide the angle by 2'
    },
    {
      type: 'linear_pair_calculation',
      cognitiveDomain: 'procedural_skills',
      template: 'Two angles form a linear pair. If one angle is {angle}°, the other is:',
      params: {
        angle: { min: 40, max: 140 }
      },
      solution: (p) => 180 - p.angle,
      hint: 'Linear pairs are supplementary (sum to 180°)'
    },
    {
      type: 'angle_measurement_word',
      cognitiveDomain: 'problem_solving',
      template: 'An angle is {times} times as large as its complement. What is the angle?',
      params: {
        times: { min: 2, max: 5 }
      },
      solution: (p) => (90 * p.times) / (p.times + 1),
      hint: 'Let x be the angle. Then x + x/{times} = 90'
    },
    {
      type: 'clock_angle',
      cognitiveDomain: 'problem_solving',
      template: 'At 3:00, the angle between clock hands is:',
      params: {},
      solution: () => 0,
      hint: 'The hands form a right angle',
      multipleChoice: ['90°', '180°', '60°', '120°']
    },
    {
      type: 'angle_relationships',
      cognitiveDomain: 'analytical_thinking',
      template: 'If two parallel lines are cut by a transversal, corresponding angles are:',
      params: {},
      solution: () => 0,
      hint: 'Corresponding angles are congruent',
      multipleChoice: ['Congruent', 'Supplementary', 'Complementary', 'Vertical']
    }
  ]
};
