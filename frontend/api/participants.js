import api from './axios';

export const joinRoom = async (room_code) => {
  try {
    const response = await api.post("/participants/join", {
      room_code,
    });
    return {
      success: true,
      message: response.data.message || 'Successfully joined room',
      data: response.data.data
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Error joining room',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
};

export const leaveRoom = async (room_id) => {
  try {
    const res = await api.delete(`/participants/leave/${room_id}`);
    return {
      success: true,
      message: res.data.message || 'Successfully left room',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Error leaving room',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
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

    let res;
    switch (type) {
      case 'student': 
        res = await api.get(`/participants/student/lists/${room_id}${query ? '?' + query : ''}`);
        break;
      case 'teacher':
      case 'creator':
        res = await api.get(`/participants/creator/lists/${room_id}${query ? '?' + query : ''}`);
        break;
      default:
        throw new Error('Invalid type parameter. Must be "user" or "creator".');  
    }
    return {
      success: true,
      data: res.data.data,
      message: 'Participants fetched successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Server error fetching participants',
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    }
  }
};

export const kickParticipant = async (room_id, part_id) => {
  try {
    console.log({room_id, part_id})
    const res = await api.delete(
      `/participants/room/${room_id}/participant/${part_id}`,
    );
    return {
      success: true,
      message: res.data.message || 'Participant kicked successfully',
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Error kicking participant',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
};

export const getJoinedRooms = async () => {
  try {
    const res = await api.get('/participants/joined');
    return {
      success: true,
      data: res.data.data,
      message: 'Joined rooms fetched successfully'
    }
  } catch (error) {
    console.error('Error fetching joined rooms:', error);
    return {
      success: false,
      message: error.response?.data?.error || 'Error fetching joined rooms',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    };
  }
};

export const inviteParticipant = async ( email, roomCode ) => {
  try {
    const res = await api.post('/participants/invite', {
      email,
      roomCode,
    });

    return {
      success: true,
      message: res.data.message || 'Invitation sent successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Failed to send invitation.',
      error: error.response?.data?.error || error.message,
      status: error.response?.status
    }
  }
};