const supabase = require('../../config/supabase')

class AttemptsService {
    constructor(attemptRepo, xpService, leaderboardService, gradingService, participantService) {
        this.attemptRepo = attemptRepo;
        this.xpService = xpService;
        this.leaderboardService = leaderboardService;
        this.gradingService = gradingService;
        this.participantService = participantService;
    }

    async submitSolution(competitionId, competitionProblemId, user_id, solution, timeTaken, room_id) {
        try {
            console.log('📝 Starting solution submission:', {
                competitionId,
                competitionProblemId,
                user_id,
                timeTaken,
                room_id,
                solutionLength: Array.isArray(solution) ? solution.length : 'Not array'
            });
            
            // ✅ Check if competition timer has expired
            const { data: competition, error: compError } = await supabase
                .from('competitions')
                .select('timer_end_at, status')
                .eq('id', competitionId)
                .single();
            
            if (compError) {
                console.error('❌ Error fetching competition:', compError);
                throw new Error('Failed to validate competition timer');
            }
            
            if (!competition) {
                throw new Error('Competition not found');
            }
            
            // Check if timer has expired
            if (competition.timer_end_at) {
                const timerEndTime = new Date(competition.timer_end_at).getTime();
                const currentTime = Date.now();
                
                if (currentTime > timerEndTime) {
                    console.log('⏰ Timer expired:', {
                        timerEndTime: new Date(timerEndTime).toISOString(),
                        currentTime: new Date(currentTime).toISOString()
                    });
                    throw new Error('Time has expired. Submissions are no longer allowed for this problem.');
                }
            }
            
            // Check if competition is still ongoing
            if (competition.status !== 'ONGOING') {
                throw new Error('Competition is not active. Submissions are not allowed.');
            }
            
            const part = await this.participantService.getPartInfoByUserId(user_id, room_id);
            console.log('👤 Participant found:', part);
            
            if (!part || !part.id) {
                throw new Error('Participant not found');
            }
            
            // 1. Set submitted_at to now
            const submittedAt = new Date();
            
            // 2. Calculate attempted_at by going backwards from submitted_at
            const attemptedAt = new Date(submittedAt.getTime() - (timeTaken * 1000));

            // ✅ Get problem data for enhanced grading
            console.log('📋 Fetching problem data...');
            const problemData = await this.getProblemData(competitionProblemId);
            console.log('📊 Problem data:', problemData);
            
            // ✅ Format solution for grading service
            const formattedSolution = {
                answer: Array.isArray(solution) && solution.length > 0 ? 
                    this.classifySubmittedShape(solution[0]) : null,
                shapes: Array.isArray(solution) ? solution : []
            };
            
            console.log('🔍 Formatted solution for grading:', formattedSolution);

            // 3. Enhanced grading with problem data
            const gradingResult = this.gradingService.gradeCompetitionSolution(
                competitionProblemId, 
                formattedSolution,
                {
                    ...problemData,
                    time_spent: timeTaken
                }
            );

            console.log('🎯 Grading result:', gradingResult);

            // 4. Create the attempt
            const attempt = await this.attemptRepo.addCompeAttempt({
                room_participant_id: part.id,
                competition_problem_id: competitionProblemId,
                solution: JSON.stringify(solution), // Store as JSON string
                time_taken: timeTaken,
                attempted_at: attemptedAt,
                submitted_at: submittedAt,
                xp_gained: gradingResult.xp_gained,
                feedback: gradingResult.feedback
            });

            console.log('✅ Attempt created:', attempt);

            // 5. Handle XP transaction (internal, no API)
            await this.xpService.createXpTransaction(part.id, attempt.id, gradingResult.xp_gained);

            // 6. Update leaderboards (internal, no API)  
            const part_data = await this.participantService.getPartInfo(part.id);
            
            console.log('💎 Updating leaderboards with XP:', {
                participant_id: part.id,
                competition_id: competitionId,
                room_id: part_data.room_id,
                xp_gained: gradingResult.xp_gained
            });
            
            await this.leaderboardService.updateBothLeaderboards(
                part.id, 
                competitionId, 
                part_data.room_id,
                gradingResult.xp_gained
            );

            // 7. Broadcast submission
            await this.broadcastSubmission(competitionId, attempt);

            return {
                success: true,
                attempt: attempt,
                xp_gained: gradingResult.xp_gained,
                feedback: gradingResult.feedback
            };

        } catch (error) {
            console.error('❌ Submit solution error:', error);
            throw error;
        }
    }

    // ✅ Helper method to auto-classify shapes
    classifySubmittedShape(shape) {
        if (!shape || !shape.type) {
            console.warn('⚠️ Invalid shape for classification:', shape);
            return 'unknown';
        }
        
        console.log('🔍 Classifying shape:', shape.type, shape.angles);
        
        if (shape.type === 'triangle' && shape.angles) {
            const hasRightAngle = shape.angles.some(angle => Math.abs(angle - 90) < 3);
            if (hasRightAngle) {
                console.log('✅ Classified as: right triangle');
                return 'right triangle';
            }
            
            const isEquilateral = shape.angles.every(angle => Math.abs(angle - 60) < 3);
            if (isEquilateral) {
                console.log('✅ Classified as: equilateral triangle');
                return 'equilateral triangle';
            }
            
            console.log('✅ Classified as: triangle');
            return 'triangle';
        }
        
        if (shape.type === 'square' && shape.sideLengths) {
            const tolerance = 0.8;
            const sortedSides = [...shape.sideLengths].sort((a, b) => a - b);
            const allSidesEqual = Math.abs(sortedSides[0] - sortedSides[3]) < tolerance;
            
            if (allSidesEqual) {
                console.log('✅ Classified as: square');
                return 'square';
            } else {
                console.log('✅ Classified as: rectangle');
                return 'rectangle';
            }
        }
        
        console.log('✅ Classified as:', shape.type);
        return shape.type;
    }

    // ✅ Get problem data from database
    async getProblemData(competitionProblemId) {
        try {
            console.log('🔍 === STARTING getProblemData ===');
            console.log('🔍 Competition Problem ID:', competitionProblemId);
            console.log('🔍 Type of competitionProblemId:', typeof competitionProblemId);
            
            // ✅ Step 1: Get competition problem data
            console.log('📋 STEP 1: Querying competition_problems table...');
            const { data: competitionProblem, error: compError } = await supabase
                .from('competition_problems')
                .select('*') // Select everything to see what's available
                .eq('id', competitionProblemId)
                .single();
            
            console.log('📋 === COMPETITION_PROBLEMS QUERY RESULT ===');
            console.log('📋 Error:', compError);
            console.log('📋 Data:', JSON.stringify(competitionProblem, null, 2));
            console.log('📋 Data type:', typeof competitionProblem);
            console.log('📋 Data keys:', competitionProblem ? Object.keys(competitionProblem) : 'null');
            
            if (compError) {
                console.error('❌ Supabase error in competition_problems query:', compError);
                console.error('❌ Error message:', compError.message);
                console.error('❌ Error code:', compError.code);
                console.error('❌ Error details:', compError.details);
                return this.getDefaultProblemData();
            }
            
            if (!competitionProblem) {
                console.log('⚠️ No competition problem found for ID:', competitionProblemId);
                return this.getDefaultProblemData();
            }
            
            console.log('✅ Competition problem found successfully!');
            console.log('📋 problem_id field:', competitionProblem.problem_id);
            console.log('📋 problem_id type:', typeof competitionProblem.problem_id);
            
            // ✅ Step 2: Get problem data using the UUID
            console.log('📋 STEP 2: Querying problems table...');
            console.log('📋 Using problem_id:', competitionProblem.problem_id);
            
            const { data: problem, error: problemError } = await supabase
                .from('problems')
                .select('*') // Select everything to see what's available
                .eq('id', competitionProblem.problem_id)
                .single();
            
            console.log('📋 === PROBLEMS QUERY RESULT ===');
            console.log('📋 Error:', problemError);
            console.log('📋 Data:', JSON.stringify(problem, null, 2));
            console.log('📋 Data type:', typeof problem);
            console.log('📋 Data keys:', problem ? Object.keys(problem) : 'null');
            
            if (problemError) {
                console.error('❌ Supabase error in problems query:', problemError);
                console.error('❌ Error message:', problemError.message);
                console.error('❌ Error code:', problemError.code);
                console.error('❌ Error details:', problemError.details);
                console.log('⚠️ Will return partial data without expected_solution');
                return {
                    difficulty: competitionProblem.difficulty || 'Easy',
                    expected_shape: null,
                    timer: competitionProblem.timer || 300,
                    problem_type: competitionProblem.problem_type || 'shape_identification'
                };
            }
            
            if (!problem) {
                console.log('⚠️ No problem found for UUID:', competitionProblem.problem_id);
                console.log('⚠️ This means the foreign key relationship is broken');
                return {
                    difficulty: competitionProblem.difficulty || 'Easy',
                    expected_shape: null,
                    timer: competitionProblem.timer || 300,
                    problem_type: competitionProblem.problem_type || 'shape_identification'
                };
            }
            
            console.log('✅ Problem found successfully!');
            console.log('📋 expected_solution field exists:', 'expected_solution' in problem);
            console.log('📋 expected_solution value:', problem.expected_solution);
            console.log('📋 expected_solution type:', typeof problem.expected_solution);
            console.log('📋 expected_solution is null:', problem.expected_solution === null);
            console.log('📋 expected_solution is undefined:', problem.expected_solution === undefined);
            
            // ✅ Step 3: Process expected_solution
            let expectedShape = null;
            if (problem.expected_solution) {
                console.log('📋 STEP 3: Processing expected_solution...');
                console.log('📋 Raw expected_solution:', JSON.stringify(problem.expected_solution, null, 2));
                
                try {
                    let expectedSolution = problem.expected_solution;
            
                    // Parse if it's a string
                    if (typeof expectedSolution === 'string') {
                        console.log('📋 Expected solution is a string, parsing...');
                        expectedSolution = JSON.parse(expectedSolution);
                        console.log('📋 Parsed expected_solution:', JSON.stringify(expectedSolution, null, 2));
                    } else {
                        console.log('📋 Expected solution is already an object');
                    }
            
                    // ✅ Handle array format like your example: [{"type": "square", ...}]
                    if (Array.isArray(expectedSolution)) {
                        console.log('📋 Expected solution is an array with length:', expectedSolution.length);
                        
                        if (expectedSolution.length > 0) {
                            const firstShape = expectedSolution[0];
                            console.log('📋 First shape from array:', JSON.stringify(firstShape, null, 2));
                            console.log('📋 First shape type:', firstShape.type);
                
                            if (firstShape.type) {
                                expectedShape = {
                                    type: firstShape.type,
                                    shape_data: firstShape
                            };
                            console.log('✅ SUCCESS: Extracted expected shape from array!');
                            console.log('✅ Expected shape:', JSON.stringify(expectedShape, null, 2));
                            } else {
                                console.log('⚠️ First shape has no type field');
                            }
                        } else {
                            console.log('⚠️ Expected solution array is empty');
                        }
                    } 
                    // ✅ Handle object format: {"type": "square", ...}
                    else if (expectedSolution && typeof expectedSolution === 'object' && expectedSolution.type) {
                        console.log('📋 Expected solution is an object with type:', expectedSolution.type);
                        expectedShape = {
                            type: expectedSolution.type,
                            shape_data: expectedSolution
                        };
                        console.log('✅ SUCCESS: Extracted expected shape from object!');
                        console.log('✅ Expected shape:', JSON.stringify(expectedShape, null, 2));
                    }
                    else {
                        console.log('⚠️ Expected solution format not recognized');
                        console.log('⚠️ Expected solution structure:', typeof expectedSolution, Array.isArray(expectedSolution));
                    }
            
                } catch (parseError) {
                    console.error('❌ Error parsing expected_solution:', parseError);
                    console.error('❌ Parse error message:', parseError.message);
                    console.error('❌ Raw expected_solution that failed:', problem.expected_solution);
                    expectedShape = null;
                }
            } else {
                console.log('⚠️ No expected_solution found - field is null/undefined');
            }
            
            // ✅ Step 4: Build final result
            const result = {
                difficulty: competitionProblem.difficulty || 'Easy',
                expected_shape: expectedShape,
                timer: competitionProblem.timer || 300,
                problem_type: competitionProblem.problem_type || 'shape_identification',
                problem_text: problem.problem_text,
                category: problem.category
            };
            
            console.log('📋 === FINAL RESULT ===');
            console.log('📋 Has expected_shape:', !!result.expected_shape);
            console.log('📋 Expected shape type:', result.expected_shape?.type);
            console.log('📋 Full result:', JSON.stringify(result, null, 2));
            console.log('🔍 === END getProblemData ===');
            
            return result;
            
        } catch (error) {
            console.error('❌ === UNEXPECTED ERROR in getProblemData ===');
            console.error('❌ Error:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            console.error('❌ === END ERROR ===');
            return this.getDefaultProblemData();
        }
    }

    getDefaultProblemData() {
        return {
            difficulty: 'Easy',
            expected_shape: null,
            timer: 300,
            problem_type: 'shape_identification'
        };
    }

    calculateTimeTaken(competition) {
        const startTime = new Date(competition.timer_started_at).getTime();
        const submitTime = Date.now();
        return Math.floor((submitTime - startTime) / 1000);
    }

    async broadcastSubmission(competitionId, attempt) {
        try {
            const channel = supabase.channel(`competition-${competitionId}`);
            await channel.send({
                type: 'broadcast',
                event: 'submission_update',
                payload: {
                    participant_id: attempt.room_participant_id,
                    xp_gained: attempt.xp_gained,
                    submitted_at: attempt.submitted_at
                }
            });
        } catch (error) {
            console.error('❌ Broadcast error:', error);
            // Don't throw - broadcasting is not critical
        }
    }

    // ✅ Temporary debug method - call this manually to check your data
    async debugDatabaseStructure(competitionProblemId = 461) {
        try {
            console.log('🔍 === DEBUG DATABASE STRUCTURE ===');
            
            // Check competition_problems table
            console.log('📋 Checking competition_problems table...');
            const { data: allCompProblems, error: allCompError } = await supabase
                .from('competition_problems')
                .select('*')
                .limit(5);
            
            console.log('📋 Sample competition_problems:', JSON.stringify(allCompProblems, null, 2));
            console.log('📋 Competition_problems error:', allCompError);
            
            // Check problems table
            console.log('📋 Checking problems table...');
            const { data: allProblems, error: allProblemsError } = await supabase
                .from('problems')
                .select('*')
                .limit(5);
            
            console.log('📋 Sample problems:', JSON.stringify(allProblems, null, 2));
            console.log('📋 Problems error:', allProblemsError);
            
            // Check specific relationship
            if (allCompProblems && allCompProblems.length > 0) {
                const firstCompProblem = allCompProblems[0];
                console.log('📋 First competition problem:', JSON.stringify(firstCompProblem, null, 2));
                
                if (firstCompProblem.problem_id) {
                    console.log('📋 Looking up problem with ID:', firstCompProblem.problem_id);
                    const { data: linkedProblem, error: linkedError } = await supabase
                        .from('problems')
                        .select('*')
                        .eq('id', firstCompProblem.problem_id)
                        .single();
                    
                    console.log('📋 Linked problem:', JSON.stringify(linkedProblem, null, 2));
                    console.log('📋 Linked problem error:', linkedError);
                }
            }
            
            console.log('🔍 === END DEBUG ===');
            
        } catch (error) {
            console.error('❌ Debug error:', error);
        }
    }
}

module.exports = AttemptsService;