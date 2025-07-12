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

export const getRoomProblems = async(room_id) => {
  try {
    return (await api.get(`/problems/${room_id}`)).data
  } catch (error) {
    throw error
  }
}