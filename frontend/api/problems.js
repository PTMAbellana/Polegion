// frontend/api/problems.js
import api from './axios';

export const createProblem = async (problemData, room_code) => {
  try {
    return await api.post('/problems', {
      problemData,
      room_code
    });
  } catch (error){
    throw error
  }
};