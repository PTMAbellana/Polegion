import api from './axios';

export const getChaptersByCastle = async (castleId) => {
  const res = await api.get(`/chapters/castle/${castleId}`);
  return res.data;
};

export const getChapterById = async (chapterId) => {
  const res = await api.get(`/chapters/${chapterId}`);
  return res.data;
};

export const startChapter = async (chapterId) => {
  const res = await api.post(`/user-chapter-progress/start/${chapterId}`);
  return res.data;
};

export const completeChapter = async (chapterId) => {
  const res = await api.post(`/user-chapter-progress/${chapterId}/complete`);
  return res.data;
};

export const awardLessonXP = async (chapterId, xpAmount) => {
  const res = await api.post(`/user-chapter-progress/${chapterId}/award-xp`, { xp_amount: xpAmount });
  return res.data;
};