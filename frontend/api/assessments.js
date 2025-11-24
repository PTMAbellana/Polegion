import { fetchApiData } from "./axios";

/**
 * Generate assessment questions for a user
 * @param {string} userId - User ID
 * @param {string} testType - 'pretest' or 'posttest'
 * @returns {Promise<{questions: Array, metadata: Object}>}
 */
export const generateAssessment = async (userId, testType) => {
  try {
    const response = await fetchApiData({
      url: `/assessments/generate/${testType}`,
      method: "POST",
      data: { userId },
    });
    return response;
  } catch (error) {
    console.error("Error generating assessment:", error);
    throw error;
  }
};

/**
 * Submit assessment answers for grading
 * @param {string} userId - User ID
 * @param {string} testType - 'pretest' or 'posttest'
 * @param {Array<{questionId: number, selectedAnswer: string}>} answers - User's answers
 * @returns {Promise<{results: Object}>}
 */
export const submitAssessment = async (userId, testType, answers) => {
  try {
    const response = await fetchApiData({
      url: "/assessments/submit",
      method: "POST",
      data: {
        userId,
        testType,
        answers,
      },
    });
    return response;
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
    const response = await fetchApiData({
      url: `/assessments/results/${userId}/${testType}`,
      method: "GET",
    });
    return response;
  } catch (error) {
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
    const response = await fetchApiData({
      url: `/assessments/comparison/${userId}`,
      method: "GET",
    });
    return response;
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
