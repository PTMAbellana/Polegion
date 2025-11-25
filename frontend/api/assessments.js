import api from "./axios";

/**
 * Generate assessment questions for a user
 * @param {string} userId - User ID
 * @param {string} testType - 'pretest' or 'posttest'
 * @returns {Promise<{questions: Array, metadata: Object}>}
 */
export const generateAssessment = async (userId, testType) => {
  try {
    const response = await api.post(`/assessments/generate/${testType}`, { userId });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Error generating assessment:", error);
    throw error;
  }
};

/**
 * Submit assessment answers for grading
 * @param {string} userId - User ID
 * @param {string} testType - 'pretest' or 'posttest'
 * @param {Array<{questionId: number, answer: string}>} answers - User's answers
 * @param {string} startTime - ISO timestamp when assessment started
 * @param {string} endTime - ISO timestamp when assessment ended
 * @param {number} duration - Duration in seconds
 * @returns {Promise<{results: Object}>}
 */
export const submitAssessment = async (userId, testType, answers, startTime = null, endTime = null, duration = 0) => {
  try {
    const response = await api.post("/assessments/submit", {
      userId,
      testType,
      answers,
      startTime,
      endTime,
      duration,
    });
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Error submitting assessment:", error);
    throw error;
  }
};

/**
 * Get assessment results for a user
 * @param {string} userId - User ID
 * @param {string} testType - 'pretest' or 'posttest'
 * @returns {Promise<{results: Object}>}
 */
export const getAssessmentResults = async (userId, testType) => {
  try {
    const response = await api.get(`/assessments/results/${userId}/${testType}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    // Return null for 404 (not found) instead of throwing
    if (error.response?.status === 404) {
      return { success: false, results: null };
    }
    console.error("Error fetching assessment results:", error);
    throw error;
  }
};

/**
 * Get comparison data between pretest and posttest
 * @param {string} userId - User ID
 * @returns {Promise<{comparison: Object}>}
 */
export const getAssessmentComparison = async (userId) => {
  try {
    const response = await api.get(`/assessments/comparison/${userId}`);
    return response.data?.data ?? response.data;
  } catch (error) {
    console.error("Error fetching assessment comparison:", error);
    throw error;
  }
};

/**
 * Check if user has completed a specific test
 * @param {string} userId - User ID
 * @param {string} testType - 'pretest' or 'posttest'
 * @returns {Promise<boolean>}
 */
export const hasCompletedTest = async (userId, testType) => {
  try {
    const response = await getAssessmentResults(userId, testType);
    return response.success && response.results !== null;
  } catch (error) {
    // If error is 404, test not completed
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};
