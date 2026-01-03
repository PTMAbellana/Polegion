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
          cognitiveDomain: 'knowledge_recall', // KR - Basic formula recall
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
          cognitiveDomain: 'knowledge_recall', // KR - Basic formula
          template: 'Find the perimeter of a square with side length {side} units.',
          params: {
            side: { min: 4, max: 12 }
          },
          solution: (p) => 4 * p.side,
          hint: 'Perimeter = 4 × side'
        },
        {
          type: 'circle_area',
          cognitiveDomain: 'procedural_skills', // PS - Apply π formula
          template: 'Calculate the area of a circle with radius {radius} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 2, max: 8 }
          },
          solution: (p) => Math.PI * p.radius * p.radius,
          hint: 'Area = π × r²'
        }
      ],

      // DIFFICULTY 2: Easy - Simple multi-step
      2: [
        {
          type: 'rectangle_perimeter',
          cognitiveDomain: 'procedural_skills', // PS - Apply multi-step formula
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
          cognitiveDomain: 'concept_understanding', // CU - Understand triangle formula
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
          cognitiveDomain: 'procedural_skills', // PS - Calculate with π
          template: 'Find the circumference of a circle with radius {radius} units. (Use π ≈ 3.14)',
          params: {
            radius: { min: 5, max: 15 }
          },
          solution: (p) => 2 * Math.PI * p.radius,
          hint: 'Circumference = 2 × π × r'
        }
      ],

      // DIFFICULTY 3: Medium - Multiple concepts
      3: [
        {
          type: 'composite_area',
          cognitiveDomain: 'analytical_thinking', // AT - Decompose complex shapes
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
          cognitiveDomain: 'concept_understanding', // CU - Understand relationship
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
          cognitiveDomain: 'procedural_skills', // PS - Complex formula application
          template: 'Find the area of a trapezoid with parallel sides {base1} and {base2} units, and height {height} units.',
          params: {
            base1: { min: 8, max: 16 },
            base2: { min: 12, max: 20 },
            height: { min: 6, max: 12 }
          },
          solution: (p) => 0.5 * (p.base1 + p.base2) * p.height,
          hint: 'Area = ½ × (base₁ + base₂) × height'
        }
      ],

      // DIFFICULTY 4: Hard - Advanced reasoning
      4: [
        {
          type: 'similar_triangles',
          cognitiveDomain: 'analytical_thinking', // AT - Apply scaling relationships
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
          cognitiveDomain: 'problem_solving', // PS+ - Proportional reasoning
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
          cognitiveDomain: 'analytical_thinking', // AT - Composite calculation
          template: 'Find the area between two concentric circles with outer radius {outer} units and inner radius {inner} units.',
          params: {
            outer: { min: 10, max: 20 },
            inner: { min: 5, max: 10 }
          },
          solution: (p) => Math.PI * (p.outer * p.outer - p.inner * p.inner),
          hint: 'Area = π(R² - r²)'
        }
      ],

      // DIFFICULTY 5: Very Hard - Complex problems
      5: [
        {
          type: 'volume_composite',
          cognitiveDomain: 'higher_order_thinking', // HOT - Complex 3D reasoning
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
          cognitiveDomain: 'higher_order_thinking', // HOT - Creative problem-solving
          template: 'A rectangle is inscribed in a circle of radius {radius} units. If the rectangle has width {width} units, find its area.',
          params: {
            radius: { min: 10, max: 15 },
            width: { min: 12, max: 20 }
          },
          solution: (p) => {
            // Rectangle inscribed in circle: diagonal = diameter
            const diameter = 2 * p.radius;
            const height = Math.sqrt(diameter * diameter - p.width * p.width);
            return p.width * height;
          },
          hint: 'Diagonal of rectangle = Diameter of circle'
        }
      ]
    };
  }

  /**
   * Generate a random question at specified difficulty level
   */
  generateQuestion(difficultyLevel, chapterId, seed = null, cognitiveDomain = null) {
    const templates = this.templates[difficultyLevel];
    if (!templates || templates.length === 0) {
      throw new Error(`No templates available for difficulty ${difficultyLevel}`);
    }

    // Filter by cognitive domain if specified
    let filteredTemplates = templates;
    if (cognitiveDomain) {
      filteredTemplates = templates.filter(t => t.cognitiveDomain === cognitiveDomain);
      if (filteredTemplates.length === 0) {
        console.warn(`No templates found for domain ${cognitiveDomain} at difficulty ${difficultyLevel}, using all templates`);
        filteredTemplates = templates;
      }
    }

    // Select random template
    const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];

    // Generate random parameters
    const params = this.generateParameters(template.params, seed);

    // Create question text by replacing placeholders
    const questionText = this.fillTemplate(template.template, params);

    // Calculate solution
    const solution = template.solution(params);

    // Generate unique question ID (includes timestamp for uniqueness)
    const questionId = this.generateQuestionId(difficultyLevel, template.type, seed);

    return {
      id: questionId,
      chapter_id: chapterId,
      question_text: questionText,
      type: template.type,
      difficulty_level: difficultyLevel,
      cognitive_domain: template.cognitiveDomain,
      parameters: params,
      solution: this.roundSolution(solution),
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
  generateQuestionId(difficulty, type, seed) {
    const timestamp = Date.now();
    const random = seed !== null ? seed : Math.floor(Math.random() * 10000);
    return `gen_d${difficulty}_${type}_${timestamp}_${random}`;
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
}

module.exports = QuestionGeneratorService;
