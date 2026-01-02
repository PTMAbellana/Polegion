/**
 * QuestionGeneratorService
 * Generates parametric questions with random values for adaptive learning
 * 
 * Instead of storing thousands of questions, we store templates and generate
 * unique variations on-the-fly with different numbers/parameters.
 * 
 * Similar to GeoDRL's problem generation but for adaptive difficulty learning
 */

class QuestionGeneratorService {
  constructor() {
    // Define question templates by difficulty level
    this.templates = {
      // DIFFICULTY 1: Very Easy - Basic shapes, single-step
      1: [
        {
          type: 'rectangle_area',
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
          template: 'Find the perimeter of a square with side length {side} units.',
          params: {
            side: { min: 4, max: 12 }
          },
          solution: (p) => 4 * p.side,
          hint: 'Perimeter = 4 × side'
        },
        {
          type: 'circle_area',
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
  generateQuestion(difficultyLevel, chapterId, seed = null) {
    const templates = this.templates[difficultyLevel];
    if (!templates || templates.length === 0) {
      throw new Error(`No templates available for difficulty ${difficultyLevel}`);
    }

    // Select random template
    const template = templates[Math.floor(Math.random() * templates.length)];

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
}

module.exports = QuestionGeneratorService;
