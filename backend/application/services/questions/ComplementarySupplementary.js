/**
 * Complementary and Supplementary Angles - Question Templates
 * Covers: angle relationships, calculations
 */

module.exports = {
  1: [
    {
      type: 'complementary_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Complementary angles add up to:',
      params: {},
      solution: () => 0,
      hint: 'Complementary angles sum to 90°',
      multipleChoice: ['90°', '180°', '360°', '270°']
    },
    {
      type: 'supplementary_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Supplementary angles add up to:',
      params: {},
      solution: () => 0,
      hint: 'Supplementary angles sum to 180°',
      multipleChoice: ['180°', '90°', '360°', '270°']
    },
    {
      type: 'complementary_example',
      cognitiveDomain: 'concept_understanding',
      template: 'If one angle is 30°, its complement is:',
      params: {},
      solution: () => 0,
      hint: '90° - 30° = 60°',
      multipleChoice: ['60°', '150°', '120°', '90°']
    },
    {
      type: 'supplementary_example',
      cognitiveDomain: 'concept_understanding',
      template: 'If one angle is 60°, its supplement is:',
      params: {},
      solution: () => 0,
      hint: '180° - 60° = 120°',
      multipleChoice: ['120°', '30°', '90°', '240°']
    },
    {
      type: 'right_angle_complement',
      cognitiveDomain: 'concept_understanding',
      template: 'The complement of a 90° angle is:',
      params: {},
      solution: () => 0,
      hint: '90° - 90° = 0°',
      multipleChoice: ['0°', '90°', '180°', '45°']
    }
  ],
  
  2: [
    {
      type: 'complementary_calculation',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the complement of {angle}°.',
      params: {
        angle: { min: 10, max: 85, step: 5 }
      },
      solution: (p) => 90 - p.angle,
      hint: 'Complement = 90° - angle'
    },
    {
      type: 'supplementary_calculation',
      cognitiveDomain: 'procedural_skills',
      template: 'Find the supplement of {angle}°.',
      params: {
        angle: { min: 20, max: 170, step: 5 }
      },
      solution: (p) => 180 - p.angle,
      hint: 'Supplement = 180° - angle'
    },
    {
      type: 'complementary_system',
      cognitiveDomain: 'problem_solving',
      template: 'Two complementary angles are in the ratio 1:2. Find the smaller angle.',
      params: {},
      solution: () => 0,
      hint: 'Let the angles be x and 2x. Then x + 2x = 90',
      multipleChoice: ['30°', '45°', '60°', '90°']
    },
    {
      type: 'supplementary_system',
      cognitiveDomain: 'problem_solving',
      template: 'Two supplementary angles are in the ratio 2:3. Find the larger angle.',
      params: {},
      solution: () => 0,
      hint: 'Let the angles be 2x and 3x. Then 2x + 3x = 180',
      multipleChoice: ['108°', '72°', '90°', '120°']
    },
    {
      type: 'angle_relationship_id',
      cognitiveDomain: 'concept_understanding',
      template: 'Angles measuring 40° and 50° are:',
      params: {},
      solution: () => 0,
      hint: '40° + 50° = 90°',
      multipleChoice: ['Complementary', 'Supplementary', 'Vertical', 'Linear pair']
    }
  ],
  
  3: [
    {
      type: 'complementary_word_problem',
      cognitiveDomain: 'problem_solving',
      template: 'One angle is {n} times its complement. Find the angle.',
      params: {
        n: { min: 2, max: 5 }
      },
      solution: (p) => (90 * p.n) / (p.n + 1),
      hint: 'Let x be the angle. Then x = n × (90 - x)'
    },
    {
      type: 'supplementary_word_problem',
      cognitiveDomain: 'problem_solving',
      template: 'An angle is {n} degrees more than its supplement. Find the angle.',
      params: {
        n: { min: 10, max: 80, step: 10 }
      },
      solution: (p) => (180 + p.n) / 2,
      hint: 'Let x be the angle. Then x = (180 - x) + n'
    },
    {
      type: 'complementary_difference',
      cognitiveDomain: 'problem_solving',
      template: 'Two complementary angles differ by {diff}°. Find the larger angle.',
      params: {
        diff: { min: 10, max: 60, step: 10 }
      },
      solution: (p) => (90 + p.diff) / 2,
      hint: 'Let the angles be x and (90-x). Then x - (90-x) = diff'
    },
    {
      type: 'supplementary_difference',
      cognitiveDomain: 'problem_solving',
      template: 'Two supplementary angles differ by {diff}°. Find the smaller angle.',
      params: {
        diff: { min: 20, max: 100, step: 20 }
      },
      solution: (p) => (180 - p.diff) / 2,
      hint: 'Let the angles be x and (180-x). Then (180-x) - x = diff'
    },
    {
      type: 'angle_relationships_multiple',
      cognitiveDomain: 'analytical_thinking',
      template: 'An angle measuring 120° can have:',
      params: {},
      solution: () => 0,
      hint: 'It can have a supplement (60°) but not a complement',
      multipleChoice: ['A supplement only', 'A complement only', 'Both complement and supplement', 'Neither']
    }
  ],
  
  4: [
    {
      type: 'complementary_algebraic',
      cognitiveDomain: 'problem_solving',
      template: 'The complement of an angle is {n} degrees less than twice the angle. Find the angle.',
      params: {
        n: { min: 10, max: 50, step: 10 }
      },
      solution: (p) => (90 + p.n) / 3,
      hint: 'Let x be the angle. Then 90 - x = 2x - n'
    },
    {
      type: 'supplementary_algebraic',
      cognitiveDomain: 'problem_solving',
      template: 'The supplement of an angle is {n} degrees more than half the angle. Find the angle.',
      params: {
        n: { min: 20, max: 100, step: 20 }
      },
      solution: (p) => 2 * (180 - p.n) / 3,
      hint: 'Let x be the angle. Then 180 - x = x/2 + n'
    },
    {
      type: 'complementary_ratio_advanced',
      cognitiveDomain: 'problem_solving',
      template: 'Two complementary angles are in the ratio {a}:{b}. Find the larger angle.',
      params: {
        a: { min: 1, max: 4 },
        b: { min: 2, max: 5 }
      },
      solution: (p) => Math.max((90 * p.a) / (p.a + p.b), (90 * p.b) / (p.a + p.b)),
      hint: 'Let the angles be ax and bx. Then ax + bx = 90'
    },
    {
      type: 'supplementary_ratio_advanced',
      cognitiveDomain: 'problem_solving',
      template: 'Two supplementary angles are in the ratio {a}:{b}. Find the smaller angle.',
      params: {
        a: { min: 1, max: 4 },
        b: { min: 2, max: 5 }
      },
      solution: (p) => Math.min((180 * p.a) / (p.a + p.b), (180 * p.b) / (p.a + p.b)),
      hint: 'Let the angles be ax and bx. Then ax + bx = 180'
    },
    {
      type: 'angle_chain_reasoning',
      cognitiveDomain: 'analytical_thinking',
      template: 'If angle A is complementary to angle B, and angle B is complementary to angle C, then:',
      params: {},
      solution: () => 0,
      hint: 'If A + B = 90 and B + C = 90, then A = C',
      multipleChoice: ['A = C', 'A + C = 90', 'A + C = 180', 'A + B + C = 180']
    }
  ]
};
