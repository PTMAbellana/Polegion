/**
 * Geometric Proofs - Question Templates
 * Covers: logical reasoning, proof structure, theorems
 */

module.exports = {
  1: [
    {
      type: 'proof_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A geometric proof is:',
      params: {},
      solution: () => 0,
      hint: 'Logical arguments showing statements are true',
      multipleChoice: ['A logical argument showing a statement is true', 'A measurement', 'A calculation', 'A drawing']
    },
    {
      type: 'given_statement',
      cognitiveDomain: 'concept_understanding',
      template: 'In a proof, "given" refers to:',
      params: {},
      solution: () => 0,
      hint: 'Information provided at the start',
      multipleChoice: ['Information assumed to be true', 'What we want to prove', 'The conclusion', 'A theorem']
    },
    {
      type: 'prove_statement',
      cognitiveDomain: 'concept_understanding',
      template: 'In a proof, "prove" refers to:',
      params: {},
      solution: () => 0,
      hint: 'What we want to show is true',
      multipleChoice: ['What we want to show is true', 'What is given', 'A postulate', 'A definition']
    },
    {
      type: 'postulate_vs_theorem',
      cognitiveDomain: 'concept_understanding',
      template: 'A postulate is:',
      params: {},
      solution: () => 0,
      hint: 'Accepted without proof',
      multipleChoice: ['A statement accepted as true without proof', 'A statement that must be proven', 'A definition', 'A calculation']
    },
    {
      type: 'theorem_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A theorem is:',
      params: {},
      solution: () => 0,
      hint: 'A statement that can be proven',
      multipleChoice: ['A statement that can be proven true', 'A statement accepted without proof', 'A definition', 'A measurement']
    }
  ],
  
  2: [
    {
      type: 'congruent_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Congruent figures have:',
      params: {},
      solution: () => 0,
      hint: 'Same size and shape',
      multipleChoice: ['Same size and shape', 'Same shape only', 'Same size only', 'Same color']
    },
    {
      type: 'similar_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'Similar figures have:',
      params: {},
      solution: () => 0,
      hint: 'Same shape but not necessarily same size',
      multipleChoice: ['Same shape but not necessarily same size', 'Same size and shape', 'Same size only', 'Same angles only']
    },
    {
      type: 'reflexive_property',
      cognitiveDomain: 'concept_understanding',
      template: 'The Reflexive Property states:',
      params: {},
      solution: () => 0,
      hint: 'Any quantity equals itself',
      multipleChoice: ['Any quantity equals itself', 'If a = b, then b = a', 'If a = b and b = c, then a = c', 'a + b = b + a']
    },
    {
      type: 'symmetric_property',
      cognitiveDomain: 'concept_understanding',
      template: 'The Symmetric Property states:',
      params: {},
      solution: () => 0,
      hint: 'If a = b, then b = a',
      multipleChoice: ['If a = b, then b = a', 'a = a', 'If a = b and b = c, then a = c', 'a + b = b + a']
    },
    {
      type: 'transitive_property',
      cognitiveDomain: 'concept_understanding',
      template: 'The Transitive Property states:',
      params: {},
      solution: () => 0,
      hint: 'If a = b and b = c, then a = c',
      multipleChoice: ['If a = b and b = c, then a = c', 'a = a', 'If a = b, then b = a', 'a + b = b + a']
    }
  ],
  
  3: [
    {
      type: 'vertical_angles_theorem',
      cognitiveDomain: 'analytical_thinking',
      template: 'The Vertical Angles Theorem states:',
      params: {},
      solution: () => 0,
      hint: 'Vertical angles are congruent',
      multipleChoice: ['Vertical angles are congruent', 'Adjacent angles are equal', 'All angles are equal', 'Complementary angles are equal']
    },
    {
      type: 'linear_pair_theorem',
      cognitiveDomain: 'analytical_thinking',
      template: 'The Linear Pair Theorem states that angles in a linear pair are:',
      params: {},
      solution: () => 0,
      hint: 'They are supplementary',
      multipleChoice: ['Supplementary', 'Complementary', 'Congruent', 'Vertical']
    },
    {
      type: 'triangle_congruence_sss',
      cognitiveDomain: 'analytical_thinking',
      template: 'SSS Triangle Congruence states that if three sides of one triangle are congruent to three sides of another:',
      params: {},
      solution: () => 0,
      hint: 'The triangles are congruent',
      multipleChoice: ['The triangles are congruent', 'The triangles are similar', 'The triangles are equal', 'Nothing can be concluded']
    },
    {
      type: 'triangle_congruence_sas',
      cognitiveDomain: 'analytical_thinking',
      template: 'SAS Triangle Congruence requires:',
      params: {},
      solution: () => 0,
      hint: 'Two sides and the included angle',
      multipleChoice: ['Two sides and the included angle congruent', 'Three sides congruent', 'Two angles and a side congruent', 'Three angles congruent']
    },
    {
      type: 'triangle_congruence_asa',
      cognitiveDomain: 'analytical_thinking',
      template: 'ASA Triangle Congruence requires:',
      params: {},
      solution: () => 0,
      hint: 'Two angles and the included side',
      multipleChoice: ['Two angles and the included side congruent', 'Three sides congruent', 'Two sides and an angle congruent', 'Three angles congruent']
    }
  ],
  
  4: [
    {
      type: 'cpctc',
      cognitiveDomain: 'analytical_thinking',
      template: 'CPCTC stands for:',
      params: {},
      solution: () => 0,
      hint: 'Corresponding Parts of Congruent Triangles are Congruent',
      multipleChoice: ['Corresponding Parts of Congruent Triangles are Congruent', 'Congruent Parts Create Triangle Congruence', 'Congruent Pairs Confirm Triangle Correspondence', 'Complete Proof Creates Triangle Congruence']
    },
    {
      type: 'parallel_lines_theorem',
      cognitiveDomain: 'analytical_thinking',
      template: 'If two parallel lines are cut by a transversal, then corresponding angles are:',
      params: {},
      solution: () => 0,
      hint: 'Corresponding angles are congruent',
      multipleChoice: ['Congruent', 'Supplementary', 'Complementary', 'Vertical']
    },
    {
      type: 'alternate_interior_angles',
      cognitiveDomain: 'analytical_thinking',
      template: 'When two parallel lines are cut by a transversal, alternate interior angles are:',
      params: {},
      solution: () => 0,
      hint: 'They are congruent',
      multipleChoice: ['Congruent', 'Supplementary', 'Complementary', 'Vertical']
    },
    {
      type: 'proof_reasoning',
      cognitiveDomain: 'analytical_thinking',
      template: 'In a two-column proof, the right column contains:',
      params: {},
      solution: () => 0,
      hint: 'Reasons justify the statements',
      multipleChoice: ['Reasons', 'Statements', 'Given information', 'Diagrams']
    },
    {
      type: 'pythagorean_theorem_converse',
      cognitiveDomain: 'analytical_thinking',
      template: 'The converse of the Pythagorean Theorem states that if a² + b² = c², then:',
      params: {},
      solution: () => 0,
      hint: 'The triangle is a right triangle',
      multipleChoice: ['The triangle is a right triangle', 'The triangle is equilateral', 'The triangle is isosceles', 'The triangle is obtuse']
    }
  ]
};
