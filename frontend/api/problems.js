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

export const getRoomProblemsByCode = async(room_code) => {
  try {
    return (await api.get(`/problems/room-code/${room_code}`)).data
  } catch (error) {
    throw error
  }
}

export const getProblem = async(problem_id) => {
  try {
    return (await api.get(`/problems/${problem_id}`)).data
  } catch (error) {
    throw error
  }
}

export const getCompeProblem = async(compe_prob_id) => {
  try {
    return (await api.get(`/problems/compe-problem/${compe_prob_id}`)).data
  } catch (error) {
    throw error
  }
}

export const deleteProblem = async(problem_id) => {
  try {
    return (await api.delete(`/problems/${problem_id}`)).data
  } catch (error) {
    throw error
  }
}

export const updateProblem = async(problem_id, problemData) => {
  try {
    return (await api.put(`/problems/${problem_id}`, problemData)).data
  } catch (error) {
    throw error
  }
}

export const updateTimer = async(problem_id, timer) => {
  try {
    return (await api.put(`/problems/update-timer/${problem_id}`, { timer })).data
  } catch (error) {
    throw error
  }
}

export const getCompeProblems = async(competition_id) => {
  console.log('getCompeProblems competition_id', competition_id)
  try {
    return (await api.get(`/problems/compe-problems/${competition_id}`)).data
  } catch (error) {
    throw error
  }
}

export const addCompeProblem = async(problem_id, competition_id) => {
  try {
    return (await api.post(`/problems/${problem_id}/${competition_id}`)).data
  } catch (error) {
    throw error
  }
}
export const removeCompeProblem = async(problem_id, competition_id) => {
  try {
    return (await api.delete(`/problems/${problem_id}/${competition_id}`)).data
  } catch (error) {
    throw error
  }
}   