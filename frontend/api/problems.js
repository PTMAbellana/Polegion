// frontend/api/problems.js
import api from './axios';

export const createProblem = async (problemData) => {
  return await api.post('/problems', problemData);
};