import api from './axios';

export const getMinigamesByChapter = async (chapterId) => {
  const res = await api.get(`/minigames/chapter/${chapterId}`);
  return res.data;
};

export const submitMinigameAttempt = async (minigameId, attemptData) => {
  const res = await api.post(`/user-minigame-attempts`, {
    minigame_id: minigameId,
    ...attemptData
  });
  return res.data;
};