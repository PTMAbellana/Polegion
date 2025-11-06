import api from './axios';

export const addChapterQuiz = async (quizData) => {
  const res = await api.post('/chapter-quizzes', quizData);
  return res.data;
};

export const updateChapterQuiz = async (quizId, quizData) => {
  const res = await api.put(`/chapter-quizzes/${quizId}`, quizData);
  return res.data;
};

export const deleteChapterQuiz = async (quizId) => {
  const res = await api.delete(`/chapter-quizzes/${quizId}`);
  return res.data;
};

export const getChapterQuizzesByChapter = async (chapterId) => {
  const res = await api.get(`/chapter-quizzes/chapter/${chapterId}`);
  return res.data;
};

export const submitQuizAttempt = async (quizId, answers) => {
  const res = await api.post(`/user-quiz-attempts`, {
    chapter_quiz_id: quizId,
    answers: answers
  });
  return res.data;
};

export const getUserQuizAttempts = async (quizId) => {
  const res = await api.get(`/user-quiz-attempts?chapter_quiz_id=${quizId}`);
  return res.data;
};