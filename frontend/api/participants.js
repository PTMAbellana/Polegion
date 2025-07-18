import api from './axios';

export const joinRoom = async (room_code) => {
  try {
    const response = await api.post("/participants/join", {
      room_code,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const leaveRoom = async (room_id) => {
  try {
    return await api.delete(`/participants/leave/${room_id}`);
  } catch (error) {
    throw error;
  }
};

export const isParticipant = async (room_id) => {
  try {
    return await api.get(`/participants/status/${room_id}`);
  } catch (error) {
    throw error;
  }
};

export const totalParticipant = async (room_id) => {
  try {
    return await api.get(`/participants/count/${room_id}`);
  } catch (error) {
    throw error;
  }
};

export const getAllParticipants = async (room_id, type='user', withXp=false, compe_id = -1) => {
  try {
    const xpParam = withXp ? 'withXp=true' : '';
    const compeParam = compe_id ? `compe_id=${compe_id}` : '';
    const query = [xpParam, compeParam].filter(Boolean).join('&');

    return type === 'user' ? 
      await api.get(`/participants/user/lists/${room_id}${query ? '?' + query : ''}`) : 
      await api.get(`/participants/creator/lists/${room_id}${query ? '?' + query : ''}`);
  } catch (error) {
    throw error;
  }
};

export const kickParticipant = async (room_id, part_id) => {
  try {
    console.log({room_id, part_id})
    return await api.delete(
      `/participants/room/${room_id}/participant/${part_id}`,
    );
  } catch (error) {
    throw error;
  }
};

export const getJoinedRooms = async () => {
  try {
    return await api.get('/participants/joined');
  } catch (error) {
    console.error('Error fetching joined rooms:', error);
    throw error;
  }
};

export const inviteParticipant = async ({ email, roomCode }) => {
  try {
    return await api.post('/participants/invite', {
      email,
      roomCode,
    });
  } catch (error) {
    throw error;
  }
};