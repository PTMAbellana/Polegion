import api from './axios'

export const submitSolution = async (competitionId, problemId, solution) => {
    try {
        const response = await api.post(`/competitions/${competitionId}/problems/${problemId}/submit`, {
            solution
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting solution:', error);
        throw error;
    }
};
