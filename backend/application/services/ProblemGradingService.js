/**
 * Problem Grading Service
 * Handles validation and grading of student submissions based on problem type
 */

class ProblemGradingService {
  /**
   * Main grading method that routes to specific validators
   * @param {Object} problem - Problem object with grading_rules
   * @param {Object} submission - Student's submitted solution
   * @returns {Object} Grading result with score, feedback, and validation details
   */
  static async gradeProblem(problem, submission) {
    const { problem_type, grading_rules, expected_solution } = problem;
    
    // Parse grading rules if string
    const rules = typeof grading_rules === 'string' 
      ? JSON.parse(grading_rules) 
      : grading_rules;

    // Route to appropriate validator
    switch (problem_type) {
      case 'angle_complementary':
        return this.validateComplementaryAngle(submission, expected_solution, rules);
      
      case 'angle_supplementary':
        return this.validateSupplementaryAngle(submission, expected_solution, rules);
      
      case 'perimeter':
      case 'perimeter_square':
      case 'perimeter_rectangle':
      case 'perimeter_triangle':
        return this.validatePerimeter(submission, expected_solution, rules, problem_type);
      
      case 'area':
      case 'area_square':
      case 'area_rectangle':
      case 'area_triangle':
        return this.validateArea(submission, expected_solution, rules, problem_type);
      
      case 'angle_sum':
        return this.validateAngleSum(submission, expected_solution, rules);
      
      case 'pythagorean_theorem':
        return this.validatePythagoreanTheorem(submission, expected_solution, rules);
      
      case 'general':
      default:
        return this.validateGeneral(submission, expected_solution, rules);
    }
  }

  /**
   * Validate complementary angle (two angles that sum to 90°)
   */
  static validateComplementaryAngle(submission, expected, rules) {
    const tolerance = rules.tolerance || 0.1;
    const angle = parseFloat(submission.angle || submission.value);
    const expectedAngle = parseFloat(expected.angle || expected.value);

    const isCorrect = Math.abs(angle - expectedAngle) <= tolerance;
    const angleSum = angle + (90 - angle); // Complementary check

    return {
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect 
        ? `Correct! The complementary angle is ${angle}°`
        : `Incorrect. Expected ${expectedAngle}°, got ${angle}°`,
      validation_details: {
        property_checked: 'complementary_angle',
        submitted_value: angle,
        expected_value: expectedAngle,
        tolerance: tolerance,
        difference: Math.abs(angle - expectedAngle)
      }
    };
  }

  /**
   * Validate supplementary angle (two angles that sum to 180°)
   */
  static validateSupplementaryAngle(submission, expected, rules) {
    const tolerance = rules.tolerance || 0.1;
    const angle = parseFloat(submission.angle || submission.value);
    const expectedAngle = parseFloat(expected.angle || expected.value);

    const isCorrect = Math.abs(angle - expectedAngle) <= tolerance;

    return {
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect 
        ? `Correct! The supplementary angle is ${angle}°`
        : `Incorrect. Expected ${expectedAngle}°, got ${angle}°`,
      validation_details: {
        property_checked: 'supplementary_angle',
        submitted_value: angle,
        expected_value: expectedAngle,
        tolerance: tolerance,
        difference: Math.abs(angle - expectedAngle)
      }
    };
  }

  /**
   * Validate perimeter with optional shape constraint
   */
  static validatePerimeter(submission, expected, rules, problemType) {
    const tolerance = rules.tolerance || 0.01;
    
    // Handle both old format (direct properties) and new format (shapes array)
    let submittedPerimeter, expectedPerimeter;
    
    if (submission.shapes && Array.isArray(submission.shapes)) {
      // New format: extract perimeter from first shape in array
      const shape = submission.shapes[0];
      // Calculate perimeter from sideLengths if available
      if (shape?.sideLengths && Array.isArray(shape.sideLengths)) {
        submittedPerimeter = shape.sideLengths.reduce((sum, length) => sum + parseFloat(length), 0);
      } else {
        submittedPerimeter = parseFloat(shape?.perimeter);
      }
    } else {
      // Old format: direct perimeter property
      submittedPerimeter = parseFloat(submission.perimeter);
    }
    
    if (Array.isArray(expected)) {
      // Expected solution is array of shapes
      const shape = expected[0];
      if (shape?.sideLengths && Array.isArray(shape.sideLengths)) {
        expectedPerimeter = shape.sideLengths.reduce((sum, length) => sum + parseFloat(length), 0);
      } else {
        expectedPerimeter = parseFloat(shape?.perimeter);
      }
    } else {
      // Old format: direct perimeter property
      expectedPerimeter = parseFloat(expected.perimeter);
    }
    
    let result = {
      is_correct: false,
      score: 0,
      feedback: '',
      validation_details: {
        property_checked: 'perimeter',
        submitted_value: submittedPerimeter,
        expected_value: expectedPerimeter,
        tolerance: tolerance
      }
    };

    // Check perimeter value
    const perimeterCorrect = Math.abs(submittedPerimeter - expectedPerimeter) <= tolerance;
    
    if (!perimeterCorrect) {
      result.feedback = `Incorrect perimeter. Expected ${expectedPerimeter}, got ${submittedPerimeter}`;
      return result;
    }

    // If shape constraint exists, validate shape
    if (rules.check_shape && rules.shape_constraint) {
      const shapeValidation = this.validateShape(
        submission.vertices || submission.sides, 
        rules.shape_constraint,
        rules.required_properties
      );
      
      result.validation_details.shape_validation = shapeValidation;
      
      if (!shapeValidation.is_valid) {
        result.feedback = `Perimeter is correct (${submittedPerimeter}), but shape is invalid: ${shapeValidation.error}`;
        result.score = 50; // Partial credit
        return result;
      }
    }

    // Full success
    result.is_correct = true;
    result.score = 100;
    result.feedback = `Correct! The perimeter is ${submittedPerimeter}${rules.check_shape ? ' and the shape is valid' : ''}`;
    
    return result;
  }

  /**
   * Validate area with optional shape constraint
   */
  static validateArea(submission, expected, rules, problemType) {
    const tolerance = rules.tolerance || 0.01;
    
    // Handle both old format (direct properties) and new format (shapes array)
    let submittedArea, expectedArea;
    
    if (submission.shapes && Array.isArray(submission.shapes)) {
      // New format: extract area from first shape in array
      const shape = submission.shapes[0];
      submittedArea = parseFloat(shape?.area);
    } else {
      // Old format: direct area property
      submittedArea = parseFloat(submission.area);
    }
    
    if (Array.isArray(expected)) {
      // Expected solution is array of shapes
      const shape = expected[0];
      expectedArea = parseFloat(shape?.area);
    } else {
      // Old format: direct area property
      expectedArea = parseFloat(expected.area);
    }
    
    let result = {
      is_correct: false,
      score: 0,
      feedback: '',
      validation_details: {
        property_checked: 'area',
        submitted_value: submittedArea,
        expected_value: expectedArea,
        tolerance: tolerance
      }
    };

    // Check area value
    const areaCorrect = Math.abs(submittedArea - expectedArea) <= tolerance;
    
    if (!areaCorrect) {
      result.feedback = `Incorrect area. Expected ${expectedArea}, got ${submittedArea}`;
      return result;
    }

    // If shape constraint exists, validate shape
    if (rules.check_shape && rules.shape_constraint) {
      const shapeValidation = this.validateShape(
        submission.vertices || submission.sides, 
        rules.shape_constraint,
        rules.required_properties
      );
      
      result.validation_details.shape_validation = shapeValidation;
      
      if (!shapeValidation.is_valid) {
        result.feedback = `Area is correct (${submittedArea}), but shape is invalid: ${shapeValidation.error}`;
        result.score = 50; // Partial credit
        return result;
      }
    }

    // Full success
    result.is_correct = true;
    result.score = 100;
    result.feedback = `Correct! The area is ${submittedArea}${rules.check_shape ? ' and the shape is valid' : ''}`;
    
    return result;
  }

  /**
   * Validate shape constraints (square, rectangle, etc.)
   */
  static validateShape(data, shapeType, requiredProperties) {
    // data can be vertices (array of points) or sides (array of lengths)
    
    if (!data) {
      return { is_valid: false, error: 'No shape data provided' };
    }

    const sides = Array.isArray(data.sides) ? data.sides : data;
    
    switch (shapeType) {
      case 'square':
        return this.validateSquare(sides, requiredProperties);
      
      case 'rectangle':
        return this.validateRectangle(sides, requiredProperties);
      
      case 'triangle':
        return this.validateTriangle(sides, requiredProperties);
      
      default:
        return { is_valid: true, error: null };
    }
  }

  /**
   * Validate if shape is a square
   */
  static validateSquare(sides, properties) {
    const tolerance = properties?.tolerance || 0.01;
    
    // Must have 4 sides
    if (sides.length !== 4) {
      return { 
        is_valid: false, 
        error: `Square must have 4 sides, got ${sides.length}` 
      };
    }

    // All sides must be equal
    const firstSide = sides[0];
    const allEqual = sides.every(side => 
      Math.abs(side - firstSide) <= tolerance
    );

    if (!allEqual) {
      return { 
        is_valid: false, 
        error: 'Square must have all sides equal. This appears to be a rectangle or other quadrilateral.' 
      };
    }

    // Check right angles if vertices provided
    if (properties?.check_angles && properties.vertices) {
      const anglesValid = this.checkRightAngles(properties.vertices, tolerance);
      if (!anglesValid) {
        return { 
          is_valid: false, 
          error: 'Square must have right angles at all corners' 
        };
      }
    }

    return { is_valid: true, error: null };
  }

  /**
   * Validate if shape is a rectangle
   */
  static validateRectangle(sides, properties) {
    const tolerance = properties?.tolerance || 0.01;
    
    // Must have 4 sides
    if (sides.length !== 4) {
      return { 
        is_valid: false, 
        error: `Rectangle must have 4 sides, got ${sides.length}` 
      };
    }

    // Opposite sides must be equal
    const oppositePairsEqual = (
      Math.abs(sides[0] - sides[2]) <= tolerance &&
      Math.abs(sides[1] - sides[3]) <= tolerance
    );

    if (!oppositePairsEqual) {
      return { 
        is_valid: false, 
        error: 'Rectangle must have opposite sides equal. This appears to be a different quadrilateral.' 
      };
    }

    // Should not be a square (all sides equal)
    if (properties?.reject_square) {
      const allEqual = sides.every(side => 
        Math.abs(side - sides[0]) <= tolerance
      );
      if (allEqual) {
        return { 
          is_valid: false, 
          error: 'This is a square, not a rectangle. A rectangle must have two different side lengths.' 
        };
      }
    }

    return { is_valid: true, error: null };
  }

  /**
   * Validate if shape is a triangle
   */
  static validateTriangle(sides, properties) {
    const tolerance = properties?.tolerance || 0.01;
    
    // Must have 3 sides
    if (sides.length !== 3) {
      return { 
        is_valid: false, 
        error: `Triangle must have 3 sides, got ${sides.length}` 
      };
    }

    // Triangle inequality theorem: sum of any two sides must be greater than third
    const [a, b, c] = sides;
    if (a + b <= c || b + c <= a || a + c <= b) {
      return { 
        is_valid: false, 
        error: 'Invalid triangle: sides do not satisfy triangle inequality' 
      };
    }

    return { is_valid: true, error: null };
  }

  /**
   * Check if angles are right angles (90 degrees)
   */
  static checkRightAngles(vertices, tolerance = 0.01) {
    // Calculate angles between consecutive vertices
    // This would require coordinate geometry calculations
    // Simplified version - actual implementation would calculate dot products
    return true; // Placeholder
  }

  /**
   * Validate angle sum
   */
  static validateAngleSum(submission, expected, rules) {
    const tolerance = rules.tolerance || 0.1;
    const submittedSum = parseFloat(submission.angle_sum || submission.value);
    const expectedSum = parseFloat(expected.angle_sum || expected.value);

    const isCorrect = Math.abs(submittedSum - expectedSum) <= tolerance;

    return {
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect 
        ? `Correct! The angle sum is ${submittedSum}°`
        : `Incorrect. Expected ${expectedSum}°, got ${submittedSum}°`,
      validation_details: {
        property_checked: 'angle_sum',
        submitted_value: submittedSum,
        expected_value: expectedSum,
        tolerance: tolerance
      }
    };
  }

  /**
   * Validate Pythagorean theorem problem
   */
  static validatePythagoreanTheorem(submission, expected, rules) {
    const tolerance = rules.tolerance || 0.01;
    const submittedValue = parseFloat(submission.value);
    const expectedValue = parseFloat(expected.value);

    const isCorrect = Math.abs(submittedValue - expectedValue) <= tolerance;

    return {
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect 
        ? `Correct! The answer is ${submittedValue}`
        : `Incorrect. Expected ${expectedValue}, got ${submittedValue}`,
      validation_details: {
        property_checked: 'pythagorean_theorem',
        submitted_value: submittedValue,
        expected_value: expectedValue,
        tolerance: tolerance
      }
    };
  }

  /**
   * Validate general problem (flexible comparison)
   */
  static validateGeneral(submission, expected, rules) {
    const tolerance = rules.tolerance || 0.01;
    
    // Simple JSON comparison for general problems
    const isCorrect = JSON.stringify(submission) === JSON.stringify(expected);

    return {
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0,
      feedback: isCorrect 
        ? 'Correct!'
        : 'Incorrect answer',
      validation_details: {
        property_checked: 'general',
        submitted: submission,
        expected: expected
      }
    };
  }
}

module.exports = ProblemGradingService;
