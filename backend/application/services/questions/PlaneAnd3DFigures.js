/**
 * Plane and Space Figures - Question Templates
 * Covers: 2D vs 3D, faces, edges, vertices, Euler's formula
 */

module.exports = {
  1: [
    {
      type: 'plane_figure_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A plane figure is:',
      params: {},
      solution: () => 0,
      hint: 'It is flat and two-dimensional',
      multipleChoice: ['A flat, two-dimensional shape', 'A three-dimensional object', 'A curved surface', 'A solid object']
    },
    {
      type: 'space_figure_definition',
      cognitiveDomain: 'knowledge_recall',
      template: 'A space figure is:',
      params: {},
      solution: () => 0,
      hint: 'It is three-dimensional',
      multipleChoice: ['A three-dimensional object', 'A flat shape', 'A two-dimensional shape', 'A line']
    },
    {
      type: 'plane_figure_examples',
      cognitiveDomain: 'concept_understanding',
      template: 'Which of these is a plane figure?',
      params: {},
      solution: () => 0,
      hint: 'Circles, triangles, squares are flat',
      multipleChoice: ['Circle', 'Sphere', 'Cube', 'Cylinder']
    },
    {
      type: 'space_figure_examples',
      cognitiveDomain: 'concept_understanding',
      template: 'Which of these is a space figure?',
      params: {},
      solution: () => 0,
      hint: 'Cubes, spheres, pyramids are 3D',
      multipleChoice: ['Cube', 'Triangle', 'Circle', 'Square']
    },
    {
      type: 'dimensions_plane',
      cognitiveDomain: 'knowledge_recall',
      template: 'Plane figures have:',
      params: {},
      solution: () => 0,
      hint: 'Length and width (2 dimensions)',
      multipleChoice: ['2 dimensions', '3 dimensions', '1 dimension', '4 dimensions']
    }
  ],
  
  2: [
    {
      type: 'dimensions_space',
      cognitiveDomain: 'knowledge_recall',
      template: 'Space figures have:',
      params: {},
      solution: () => 0,
      hint: 'Length, width, and height (3 dimensions)',
      multipleChoice: ['3 dimensions', '2 dimensions', '1 dimension', '4 dimensions']
    },
    {
      type: 'cube_faces',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many faces does a cube have?',
      params: {},
      solution: () => 0,
      hint: 'A cube has 6 square faces',
      multipleChoice: ['6', '8', '12', '4']
    },
    {
      type: 'cube_vertices',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many vertices does a cube have?',
      params: {},
      solution: () => 0,
      hint: 'A cube has 8 corners',
      multipleChoice: ['8', '6', '12', '4']
    },
    {
      type: 'cube_edges',
      cognitiveDomain: 'knowledge_recall',
      template: 'How many edges does a cube have?',
      params: {},
      solution: () => 0,
      hint: 'A cube has 12 edges',
      multipleChoice: ['12', '6', '8', '10']
    },
    {
      type: 'prism_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'A prism is a space figure with:',
      params: {},
      solution: () => 0,
      hint: 'Two parallel congruent bases',
      multipleChoice: ['Two parallel congruent bases', 'One base', 'No bases', 'Curved surfaces']
    }
  ],
  
  3: [
    {
      type: 'pyramid_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'A pyramid is a space figure with:',
      params: {},
      solution: () => 0,
      hint: 'One base and triangular faces meeting at apex',
      multipleChoice: ['One base and triangular lateral faces', 'Two bases', 'No bases', 'Curved surfaces']
    },
    {
      type: 'cylinder_bases',
      cognitiveDomain: 'knowledge_recall',
      template: 'A cylinder has:',
      params: {},
      solution: () => 0,
      hint: 'Two circular bases',
      multipleChoice: ['Two circular bases', 'One circular base', 'No circular bases', 'Three circular bases']
    },
    {
      type: 'cone_base',
      cognitiveDomain: 'knowledge_recall',
      template: 'A cone has:',
      params: {},
      solution: () => 0,
      hint: 'One circular base',
      multipleChoice: ['One circular base', 'Two circular bases', 'No bases', 'One square base']
    },
    {
      type: 'sphere_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'A sphere is:',
      params: {},
      solution: () => 0,
      hint: 'All points equidistant from center',
      multipleChoice: ['All points equidistant from a center', 'A flat circle', 'A cylinder', 'A pyramid']
    },
    {
      type: 'polyhedron_definition',
      cognitiveDomain: 'concept_understanding',
      template: 'A polyhedron is:',
      params: {},
      solution: () => 0,
      hint: 'A solid with flat polygonal faces',
      multipleChoice: ['A solid with flat polygonal faces', 'A solid with curved surfaces', 'A plane figure', 'A two-dimensional shape']
    }
  ],
  
  4: [
    {
      type: 'euler_formula',
      cognitiveDomain: 'analytical_thinking',
      template: "Euler's formula for polyhedra states:",
      params: {},
      solution: () => 0,
      hint: 'V - E + F = 2',
      multipleChoice: ['V - E + F = 2', 'V + E + F = 2', 'V + E - F = 2', 'V × E × F = 2']
    },
    {
      type: 'euler_formula_application',
      cognitiveDomain: 'problem_solving',
      template: 'A polyhedron has {v} vertices and {e} edges. How many faces does it have?',
      params: {
        v: { min: 6, max: 12 },
        e: { min: 9, max: 18 }
      },
      solution: (p) => 2 - p.v + p.e,
      hint: "Use Euler's formula: F = 2 - V + E"
    },
    {
      type: 'rectangular_prism_properties',
      cognitiveDomain: 'procedural_skills',
      template: 'A rectangular prism has:',
      params: {},
      solution: () => 0,
      hint: '6 faces, 8 vertices, 12 edges',
      multipleChoice: ['6 faces, 8 vertices, 12 edges', '5 faces, 6 vertices, 9 edges', '8 faces, 6 vertices, 12 edges', '6 faces, 12 vertices, 8 edges']
    },
    {
      type: 'triangular_pyramid_properties',
      cognitiveDomain: 'procedural_skills',
      template: 'A triangular pyramid (tetrahedron) has:',
      params: {},
      solution: () => 0,
      hint: '4 faces, 4 vertices, 6 edges',
      multipleChoice: ['4 faces, 4 vertices, 6 edges', '5 faces, 5 vertices, 8 edges', '3 faces, 3 vertices, 3 edges', '4 faces, 6 vertices, 4 edges']
    },
    {
      type: 'cross_section',
      cognitiveDomain: 'analytical_thinking',
      template: 'When a plane cuts through a cube parallel to a face, the cross-section is:',
      params: {},
      solution: () => 0,
      hint: 'The cut produces a square',
      multipleChoice: ['A square', 'A triangle', 'A circle', 'A hexagon']
    }
  ]
};
