import api from './axios'

export const submitSolution = async (competitionId, problemId, solutionData) => {
    try {
        console.log('🚀 Submitting solution:', {
            competitionId,
            problemId,
            solutionData
        });
        
        // ✅ Use the correct endpoint that matches your backend
        const response = await api.post('/attempts/submit', {
            competition_id: competitionId,
            competition_problem_id: problemId,
            participant_solution: solutionData.solution, // Array of shapes with properties
            time_taken: solutionData.time_taken,
            room_id: solutionData.room_id
        });
        
        console.log('✅ Solution submitted successfully:', response.data);
        return response.data;
        
    } catch (error) {
        console.error('❌ Submit solution error:', error);
        
        // Better error handling
        if (error.response) {
            console.error('Error response:', error.response.data);
            throw new Error(error.response.data.message || 'Failed to submit solution');
        } else if (error.request) {
            throw new Error('Network error - please check your connection');
        } else {
            throw new Error('An unexpected error occurred');
        }
    }
};