class GradingService {
    
    // ✅ NEW: Simplified main grading function
    gradeCompetitionSolution(competitionProblemId, solution, problemData = {}) {
        try {
            console.log('🎯 === STARTING NEW GRADING SYSTEM ===');
            console.log('📝 Solution received:', JSON.stringify(solution, null, 2));
            console.log('📋 Problem data:', JSON.stringify(problemData, null, 2));
            
            // Extract parameters
            const difficulty = problemData.difficulty || 'Easy';
            const expected_shape = problemData.expected_shape || null;
            const timeLimit = problemData.timer || 300;
            const timeSpent = problemData.time_spent || 0;
            
            console.log('🔧 Extracted:', { difficulty, timeLimit, timeSpent, hasExpectedShape: !!expected_shape });
            
            // Grade the solution
            const gradingResult = this.gradeShape(solution, expected_shape, timeSpent, timeLimit, difficulty);
            
            // CRITICAL: Ensure XP is always a positive integer
            if (!gradingResult.xp_gained || gradingResult.xp_gained < 10) {
                console.warn('⚠️ XP too low or missing, setting minimum XP to 10');
                gradingResult.xp_gained = 10;
            }
            
            console.log('🏆 FINAL GRADING RESULT:', JSON.stringify(gradingResult, null, 2));
            console.log('💎 XP TO BE AWARDED:', gradingResult.xp_gained);
            return gradingResult;
            
        } catch (error) {
            console.error('❌ Grading error:', error);
            return this.getDefaultGrading();
        }
    }
    
    // ✅ NEW: Main shape grading logic
    gradeShape(solution, expectedShape, timeSpent, timeLimit, difficulty) {
        console.log('🔍 === STEP 1: SHAPE TYPE IDENTIFICATION ===');
        
        const userAnswer = solution.answer?.toLowerCase().trim();
        const userShape = solution.shapes?.[0];
        
        if (!userAnswer || !userShape) {
            console.log('❌ Missing answer or shape data');
            return this.createGradingResult(false, 0, 'Missing answer or shape data', timeSpent, timeLimit, difficulty);
        }
        
        // Step 1: Determine the basic shape type (circle, triangle, square)
        const basicShapeType = this.identifyBasicShapeType(userShape);
        console.log('🏷️ Identified basic shape type:', basicShapeType);
        
        // Step 2: Get expected shape type
        let expectedBasicType = null;
        if (expectedShape) {
            expectedBasicType = this.extractExpectedShapeType(expectedShape);
            console.log('🎯 Expected basic shape type:', expectedBasicType);
        }
        
        // Step 3: Compare shape types
        const shapeTypeAccuracy = this.compareShapeTypes(userAnswer, basicShapeType, expectedBasicType);
        console.log('📊 Shape type accuracy:', shapeTypeAccuracy);
        
        // Step 4: Analyze geometric properties
        const geometryAccuracy = this.analyzeGeometricProperties(userShape, expectedShape, basicShapeType);
        console.log('📐 Geometry accuracy:', geometryAccuracy);
        
        // Step 5: Calculate time bonus
        const timeBonus = this.calculateTimeBonus(timeSpent, timeLimit);
        console.log('⏰ Time bonus:', timeBonus);
        
        // Step 6: Calculate final score
        const finalScore = this.calculateFinalScore(shapeTypeAccuracy, geometryAccuracy, timeBonus, difficulty);
        console.log('🎯 Final score breakdown:', finalScore);
        
        return this.createGradingResult(
            finalScore.isCorrect, 
            finalScore.accuracy, 
            finalScore.feedback, 
            timeSpent, 
            timeLimit, 
            difficulty,
            finalScore.xp,
            finalScore.breakdown
        );
    }
    
    // ✅ NEW: Step 1 - Identify basic shape type (circle, triangle, square)
    identifyBasicShapeType(shape) {
        console.log('🔍 Analyzing shape:', shape.type);
        
        switch (shape.type) {
            case 'circle':
                return 'circle';
            case 'triangle':
                return 'triangle';
            case 'square':
                // All quadrilaterals are categorized as "square" in our 3-shape system
                return 'square';
            default:
                console.log('❓ Unknown shape type, defaulting to square');
                return 'square'; // Default unknown shapes to square category
        }
    }
    
    // ✅ NEW: Extract expected shape type from database
    extractExpectedShapeType(expectedShape) {
        if (expectedShape.shape_data?.type) {
            const type = expectedShape.shape_data.type.toLowerCase();
            return this.normalizeToBasicType(type);
        }
        if (expectedShape.type) {
            const type = expectedShape.type.toLowerCase();
            return this.normalizeToBasicType(type);
        }
        return null;
    }
    
    // ✅ NEW: Normalize any shape type to basic 3-shape system
    normalizeToBasicType(shapeType) {
        if (shapeType === 'circle') return 'circle';
        if (shapeType === 'triangle' || shapeType.includes('triangle')) return 'triangle';
        
        // All quadrilaterals → square
        const quadTypes = ['square', 'rectangle', 'rhombus', 'parallelogram', 'trapezoid', 'quadrilateral'];
        if (quadTypes.includes(shapeType)) return 'square';
        
        return shapeType;
    }
    
    // ✅ NEW: Step 3 - Compare shape types
    compareShapeTypes(userAnswer, actualBasicType, expectedBasicType) {
        console.log('🔍 === STEP 3: SHAPE TYPE COMPARISON ===');
        console.log('👤 User said:', userAnswer);
        console.log('🤖 Actual basic type:', actualBasicType);
        console.log('🎯 Expected basic type:', expectedBasicType);
        
        const normalizedUserAnswer = this.normalizeToBasicType(userAnswer);
        console.log('🔄 Normalized user answer:', normalizedUserAnswer);
        
        // Use expected type if available, otherwise compare with actual type
        const targetType = expectedBasicType || actualBasicType;
        console.log('🎯 Target type for comparison:', targetType);
        
        if (normalizedUserAnswer === targetType) {
            console.log('✅ Perfect shape type match!');
            return 1.0;
        }
        
        // Partial credit for related shapes
        if (targetType === 'square') {
            const quadAnswers = ['rectangle', 'rhombus', 'parallelogram', 'quadrilateral'];
            if (quadAnswers.includes(userAnswer)) {
                console.log('✅ Valid quadrilateral sub-type!');
                return 0.85;
            }
        }
        
        // Wrong basic type
        console.log('❌ Wrong shape type');
        return 0.0;
    }
    
    // ✅ NEW: Step 4 - Analyze geometric properties
    analyzeGeometricProperties(userShape, expectedShape, basicShapeType) {
        console.log('🔍 === STEP 4: GEOMETRIC PROPERTIES ANALYSIS ===');
        console.log('📐 Analyzing', basicShapeType, 'properties');
        
        if (!expectedShape?.shape_data) {
            console.log('⚠️ No expected shape data, skipping geometry analysis');
            return 0.5; // Neutral score when no comparison data
        }
        
        const expectedData = expectedShape.shape_data;
        
        switch (basicShapeType) {
            case 'circle':
                return this.analyzeCircleProperties(userShape, expectedData);
            case 'triangle':
                return this.analyzeTriangleProperties(userShape, expectedData);
            case 'square':
                return this.analyzeQuadrilateralProperties(userShape, expectedData);
            default:
                return 0.5;
        }
    }
    
    // ✅ UPDATED: Precision-based circle analysis
    analyzeCircleProperties(userCircle, expectedCircle) {
        console.log('⭕ === ANALYZING CIRCLE PROPERTIES ===');
        console.log('👤 User circle:', { 
            diameter: userCircle.diameter, 
            area: userCircle.area, 
            circumference: userCircle.circumference 
        });
        console.log('🎯 Expected circle:', { 
            diameter: expectedCircle.diameter, 
            area: expectedCircle.area, 
            circumference: expectedCircle.circumference 
        });
        
        let totalScore = 0;
        let propertyCount = 0;
        
        // Check diameter
        if (userCircle.diameter && expectedCircle.diameter) {
            propertyCount++;
            const score = this.calculatePropertyScore(userCircle.diameter, expectedCircle.diameter, 'Diameter');
            totalScore += score;
        }
        
        // Check area
        if (userCircle.area && expectedCircle.area) {
            propertyCount++;
            const score = this.calculatePropertyScore(userCircle.area, expectedCircle.area, 'Area');
            totalScore += score;
        }
        
        // Check circumference
        if (userCircle.circumference && expectedCircle.circumference) {
            propertyCount++;
            const score = this.calculatePropertyScore(userCircle.circumference, expectedCircle.circumference, 'Circumference');
            totalScore += score;
        }
        
        const geometryScore = propertyCount > 0 ? totalScore / propertyCount : 0.5;
        console.log('📊 === CIRCLE FINAL SCORE ===');
        console.log(`📊 Circle geometry score: ${geometryScore.toFixed(3)} (average of ${propertyCount} properties)`);
        return geometryScore;
    }
    
    // ✅ UPDATED: Precision-based triangle analysis with rotation invariance
    analyzeTriangleProperties(userTriangle, expectedTriangle) {
        console.log('📐 === ANALYZING TRIANGLE PROPERTIES ===');
        console.log('👤 User triangle:', { 
            sideLengths: userTriangle.sideLengths, 
            area: userTriangle.area,
            angles: userTriangle.angles 
        });
        console.log('🎯 Expected triangle:', { 
            sideLengths: expectedTriangle.sideLengths, 
            area: expectedTriangle.area,
            angles: expectedTriangle.angles 
        });
        
        let totalScore = 0;
        let propertyCount = 0;
        
        // Check side lengths with rotation invariance
        if (userTriangle.sideLengths && expectedTriangle.sideLengths && 
            userTriangle.sideLengths.length === 3 && expectedTriangle.sideLengths.length === 3) {
            propertyCount++;
            
            // IMPORTANT: Sort to handle rotated/flipped triangles
            // This makes [3,4,5] equivalent to [4,5,3] (rotated triangle)
            const userSides = [...userTriangle.sideLengths].sort((a, b) => a - b);
            const expectedSides = [...expectedTriangle.sideLengths].sort((a, b) => a - b);
            
            console.log('📏 === TRIANGLE SIDE ANALYSIS (ROTATION-INVARIANT) ===');
            console.log('👤 User sides (sorted):', userSides);
            console.log('🎯 Expected sides (sorted):', expectedSides);
            
            let sideScores = [];
            for (let i = 0; i < 3; i++) {
                const score = this.calculatePropertyScore(userSides[i], expectedSides[i], `Side ${i+1}`);
                sideScores.push(score);
            }
            
            // Average of all side scores
            const sidesScore = sideScores.reduce((sum, score) => sum + score, 0) / sideScores.length;
            console.log(`📏 Overall sides score: ${sidesScore.toFixed(3)} (average of individual side scores)`);
            totalScore += sidesScore;
        }
        
        // Check area
        if (userTriangle.area && expectedTriangle.area) {
            propertyCount++;
            const score = this.calculatePropertyScore(userTriangle.area, expectedTriangle.area, 'Area');
            totalScore += score;
        }
        
        const geometryScore = propertyCount > 0 ? totalScore / propertyCount : 0.5;
        console.log('📊 === TRIANGLE FINAL SCORE ===');
        console.log(`📊 Triangle geometry score: ${geometryScore.toFixed(3)} (average of ${propertyCount} properties)`);
        console.log('✅ Rotation/flip invariance applied - sorted side lengths used');
        return geometryScore;
    }
    
    // ✅ UPDATED: Precision-based quadrilateral analysis with rotation invariance
    analyzeQuadrilateralProperties(userQuad, expectedQuad) {
        console.log('🔲 === ANALYZING QUADRILATERAL PROPERTIES ===');
        console.log('👤 User quad:', { 
            sideLengths: userQuad.sideLengths, 
            area: userQuad.area,
            angles: userQuad.angles 
        });
        console.log('🎯 Expected quad:', { 
            sideLengths: expectedQuad.sideLengths, 
            area: expectedQuad.area,
            angles: expectedQuad.angles 
        });
        
        let totalScore = 0;
        let propertyCount = 0;
        
        // Check side lengths with rotation invariance
        if (userQuad.sideLengths && expectedQuad.sideLengths && 
            userQuad.sideLengths.length === 4 && expectedQuad.sideLengths.length === 4) {
            propertyCount++;
            
            // IMPORTANT: Sort both arrays to handle rotated/flipped shapes
            // This makes [10,5,10,5] equivalent to [5,10,5,10] (rotated rectangle)
            const userSides = [...userQuad.sideLengths].sort((a, b) => a - b);
            const expectedSides = [...expectedQuad.sideLengths].sort((a, b) => a - b);
            
            console.log('📏 === QUADRILATERAL SIDE ANALYSIS (ROTATION-INVARIANT) ===');
            console.log('👤 User sides (sorted):', userSides);
            console.log('🎯 Expected sides (sorted):', expectedSides);
            
            let sideScores = [];
            for (let i = 0; i < 4; i++) {
                const score = this.calculatePropertyScore(userSides[i], expectedSides[i], `Side ${i+1}`);
                sideScores.push(score);
            }
            
            // Average of all side scores
            const sidesScore = sideScores.reduce((sum, score) => sum + score, 0) / sideScores.length;
            console.log(`📏 Overall sides score: ${sidesScore.toFixed(3)} (average of individual side scores)`);
            totalScore += sidesScore;
        }
        
        // Check area
        if (userQuad.area && expectedQuad.area) {
            propertyCount++;
            const score = this.calculatePropertyScore(userQuad.area, expectedQuad.area, 'Area');
            totalScore += score;
        }
        
        const geometryScore = propertyCount > 0 ? totalScore / propertyCount : 0.5;
        console.log('📊 === QUADRILATERAL FINAL SCORE ===');
        console.log(`📊 Quadrilateral geometry score: ${geometryScore.toFixed(3)} (average of ${propertyCount} properties)`);
        console.log('✅ Rotation/flip invariance applied - sorted side lengths used');
        return geometryScore;
    }
    
    // ✅ NEW: Calculate precision-based property score
    calculatePropertyScore(userValue, expectedValue, propertyName) {
        console.log(`🔍 Analyzing ${propertyName}: ${userValue} vs ${expectedValue}`);
        
        // Perfect match gets full score
        if (userValue === expectedValue) {
            console.log(`✅ ${propertyName}: PERFECT MATCH! Score: 1.000`);
            return 1.0;
        }
        
        // Calculate percentage difference
        const difference = Math.abs(userValue - expectedValue);
        const percentDiff = (difference / expectedValue) * 100;
        
        console.log(`📊 ${propertyName}: ${difference.toFixed(2)} difference (${percentDiff.toFixed(2)}% off)`);
        
        // Scoring tiers based on precision
        let score;
        if (percentDiff <= 1) {
            // Within 1% - Excellent (95-100%)
            score = 1.0 - (percentDiff * 0.05); // Linear decrease from 1.0 to 0.95
            console.log(`🌟 ${propertyName}: EXCELLENT precision (≤1% off) - Score: ${score.toFixed(3)}`);
        } else if (percentDiff <= 5) {
            // Within 5% - Very Good (80-95%)
            score = 0.95 - ((percentDiff - 1) * 0.0375); // Linear from 0.95 to 0.80
            console.log(`⭐ ${propertyName}: VERY GOOD precision (1-5% off) - Score: ${score.toFixed(3)}`);
        } else if (percentDiff <= 10) {
            // Within 10% - Good (60-80%)
            score = 0.80 - ((percentDiff - 5) * 0.04); // Linear from 0.80 to 0.60
            console.log(`👍 ${propertyName}: GOOD precision (5-10% off) - Score: ${score.toFixed(3)}`);
        } else if (percentDiff <= 20) {
            // Within 20% - Fair (30-60%)
            score = 0.60 - ((percentDiff - 10) * 0.03); // Linear from 0.60 to 0.30
            console.log(`📝 ${propertyName}: FAIR precision (10-20% off) - Score: ${score.toFixed(3)}`);
        } else if (percentDiff <= 40) {
            // Within 40% - Poor (10-30%)
            score = 0.30 - ((percentDiff - 20) * 0.01); // Linear from 0.30 to 0.10
            console.log(`⚠️ ${propertyName}: POOR precision (20-40% off) - Score: ${score.toFixed(3)}`);
        } else {
            // More than 40% off - Very Poor (0-10%)
            score = Math.max(0.05, 0.10 - ((percentDiff - 40) * 0.001)); // Asymptotic approach to 0.05
            console.log(`❌ ${propertyName}: VERY POOR precision (>40% off) - Score: ${score.toFixed(3)}`);
        }
        
        return Math.max(0.05, Math.min(1.0, score)); // Clamp between 0.05 and 1.0
    }
    
    // ✅ UPDATED: More nuanced final score calculation
    calculateFinalScore(shapeTypeAccuracy, geometryAccuracy, timeBonus, difficulty) {
        console.log('🔍 === STEP 6: FINAL SCORE CALCULATION ===');
        console.log('📊 Input scores:', {
            shapeTypeAccuracy: shapeTypeAccuracy.toFixed(3),
            geometryAccuracy: geometryAccuracy.toFixed(3),
            timeBonus: timeBonus.toFixed(3),
            difficulty
        });
        
        // Base accuracy: 40% shape type + 60% geometry (precision-weighted)
        const baseAccuracy = (shapeTypeAccuracy * 0.4) + (geometryAccuracy * 0.6);
        console.log('📈 Base accuracy (40% type + 60% geometry):', baseAccuracy.toFixed(3));
        
        // Apply time bonus
        const withTimeBonus = Math.min(1.0, baseAccuracy * (1 + timeBonus * 0.5)); // Max 12.5% boost
        console.log('⏰ With time bonus:', withTimeBonus.toFixed(3));
        
        // More nuanced correctness threshold
        let isCorrect;
        let qualityLevel;
        
        if (withTimeBonus >= 0.95) {
            isCorrect = true;
            qualityLevel = 'EXCELLENT';
        } else if (withTimeBonus >= 0.85) {
            isCorrect = true;
            qualityLevel = 'VERY_GOOD';
        } else if (withTimeBonus >= 0.75) {
            isCorrect = true;
            qualityLevel = 'GOOD';
        } else if (withTimeBonus >= 0.65) {
            isCorrect = false;
            qualityLevel = 'FAIR';
        } else {
            isCorrect = false;
            qualityLevel = 'POOR';
        }
        
        console.log(`✅ Quality level: ${qualityLevel} (${withTimeBonus.toFixed(3)}) - Correct: ${isCorrect}`);
        
        // Calculate XP with difficulty multiplier and quality bonus
        const difficultyMultipliers = {
            'Easy': 1.0,
            'Intermediate': 1.5,
            'Hard': 2.0
        };
        
        const multiplier = difficultyMultipliers[difficulty] || 1.0;
        console.log('🎯 Difficulty multiplier:', multiplier);
        
        // More sophisticated XP calculation
        let baseXP = 10; // Effort points
        
        if (isCorrect) {
            baseXP += 20; // Correctness bonus
            baseXP += Math.floor(withTimeBonus * 40); // Precision bonus (0-40 points)
        } else {
            baseXP += Math.floor(withTimeBonus * 20); // Partial credit (0-20 points)
        }
        
        // Quality bonus for exceptional work
        if (qualityLevel === 'PERFECT') {
            baseXP += 10; // Perfect bonus
        } else if (qualityLevel === 'EXCELLENT') {
            baseXP += 5; // Excellence bonus
        }
        
        const finalXP = Math.floor(baseXP * multiplier);
        console.log('💎 Final XP calculation:', `${baseXP} × ${multiplier} = ${finalXP}`);
        
        // Generate feedback based on quality level
        let feedback;
        switch (qualityLevel) {
            case 'PERFECT':
                feedback = `🎉 PERFECT! Absolutely flawless shape analysis! (+${finalXP} XP)`;
                break;
            case 'EXCELLENT':
                feedback = `✨ EXCELLENT! Outstanding precision and accuracy! (+${finalXP} XP)`;
                break;
            case 'VERY_GOOD':
                feedback = `⭐ VERY GOOD! Great shape identification with good precision! (+${finalXP} XP)`;
                break;
            case 'GOOD':
                feedback = `👍 GOOD! Correct identification with decent precision! (+${finalXP} XP)`;
                break;
            case 'FAIR':
                feedback = `📝 FAIR! Right idea but work on precision! (+${finalXP} XP)`;
                break;
            case 'POOR':
                feedback = `⚠️ Keep practicing! Focus on shape accuracy! (+${finalXP} XP)`;
                break;
            case 'VERY_POOR':
                feedback = `💪 Keep trying! Every attempt helps you learn! (+${finalXP} XP)`;
                break;
            default:
                feedback = `📚 Good effort! Keep learning! (+${finalXP} XP)`;
        }
        
        return {
            isCorrect,
            accuracy: withTimeBonus,
            xp: finalXP,
            feedback,
            qualityLevel,
            breakdown: {
                shapeTypeAccuracy,
                geometryAccuracy,
                timeBonus,
                baseAccuracy,
                difficulty,
                multiplier,
                baseXP
            }
        };
    }
    
    // ✅ NEW: Step 5 - Calculate time bonus
    calculateTimeBonus(timeSpent, timeLimit) {
        console.log('🔍 === STEP 5: TIME BONUS CALCULATION ===');
        console.log('⏰ Time spent:', timeSpent, 'seconds');
        console.log('⏱️ Time limit:', timeLimit, 'seconds');
        
        // ✅ VALIDATE: Check for invalid time data
        if (timeSpent <= 0 || timeLimit <= 0) {
            console.log('⚠️ Invalid time data, no time bonus');
            return 0;
        }
        
        // ✅ VALIDATE: Check for impossible values
        if (timeSpent < 0) {
            console.log('❌ Negative time spent, no time bonus');
            return 0;
        }
        
        if (timeSpent > timeLimit * 2) {
            console.log('❌ Time spent is way over limit, suspicious data');
            return 0;
        }
        
        const timeRatio = timeSpent / timeLimit;
        console.log('📊 Time ratio (timeSpent/timeLimit):', timeRatio.toFixed(3));
        
        let timeBonus = 0;
        
        if (timeRatio <= 0.25) {
            // Completed in 25% or less of time limit - AMAZING!
            timeBonus = 0.25;
            console.log('🚀 LIGHTNING FAST! 25% time bonus (completed in ≤25% of time)');
        } else if (timeRatio <= 0.40) {
            // Completed in 40% or less of time limit - EXCELLENT!
            timeBonus = 0.20;
            console.log('⚡ EXCELLENT speed! 20% time bonus (completed in ≤40% of time)');
        } else if (timeRatio <= 0.60) {
            // Completed in 60% or less of time limit - VERY GOOD!
            timeBonus = 0.15;
            console.log('🏃 VERY GOOD speed! 15% time bonus (completed in ≤60% of time)');
        } else if (timeRatio <= 0.80) {
            // Completed in 80% or less of time limit - GOOD!
            timeBonus = 0.10;
            console.log('👍 GOOD speed! 10% time bonus (completed in ≤80% of time)');
        } else if (timeRatio <= 1.0) {
            // Completed within time limit but slower
            timeBonus = 0.05;
            console.log('✅ Within time limit! 5% time bonus (completed in 80-100% of time)');
        } else {
            // Overtime - NO BONUS, might even penalize
            timeBonus = 0;
            console.log('⏳ OVERTIME! No time bonus (took longer than time limit)');
            
            // ✅ OPTIONAL: Add time penalty for going way over
            if (timeRatio > 1.5) {
                timeBonus = -0.1; // 10% penalty for taking 50% longer than allowed
                console.log('⚠️ MAJOR OVERTIME! -10% time penalty');
            }
        }
        
        return timeBonus;
    }
    
    // ✅ NEW: Create standardized grading result
    createGradingResult(isCorrect, accuracy, feedback, timeSpent, timeLimit, difficulty, xp = null, breakdown = null) {
        if (xp === null) {
            // Fallback XP calculation
            const baseXP = 10 + (isCorrect ? 20 : 0) + Math.floor(accuracy * 15);
            const multiplier = difficulty === 'Hard' ? 2.0 : difficulty === 'Intermediate' ? 1.5 : 1.0;
            xp = Math.floor(baseXP * multiplier);
        }
        
        return {
            is_correct: isCorrect,
            accuracy: accuracy,
            xp_gained: xp,
            feedback: feedback,
            breakdown: {
                base_xp: breakdown?.baseXP || 10,
                difficulty_bonus: breakdown ? Math.floor((breakdown.baseXP * breakdown.multiplier) - breakdown.baseXP) : 0,
                time_bonus: breakdown?.timeBonus || 0,
                accuracy_bonus: Math.floor(accuracy * 20),
                effort_points: 10
            },
            grading_details: {
                shape_type_accuracy: breakdown?.shapeTypeAccuracy || 0,
                geometry_accuracy: breakdown?.geometryAccuracy || 0,
                time_bonus: breakdown?.timeBonus || 0,
                difficulty: difficulty,
                time_spent: timeSpent,
                time_limit: timeLimit
            }
        };
    }
    
    getDefaultGrading() {
        return this.createGradingResult(false, 0.1, "Unable to grade solution properly. (+10 XP for effort)", 0, 300, 'Easy', 10);
    }
}

module.exports = GradingService;