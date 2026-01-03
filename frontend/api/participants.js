// api/participants.js - Participants API (Student-only build)
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

export const getAllParticipants = async (room_id, type='student', withXp=false, compe_id = -1) => {
  try {
    const xpParam = withXp ? 'withXp=true' : '';
    const compeParam = compe_id ? `compe_id=${compe_id}` : '';
    const query = [xpParam, compeParam].filter(Boolean).join('&');
    
    // Students only see student lists
    const res = await api.get(`/participants/student/lists/${room_id}${query ? '?' + query : ''}`);
    
    return {
      success: true,
      data: res.data.data,
      message: 'Participants fetched successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Server error fetching participants',
      error: error.response?.data?.error || error.message,
      status: error.response?.status || 500
    }
  }
};

// =====================================================
// ACTIVE TRACKING API
// =====================================================

export const updateParticipantHeartbeat = async (roomId, data) => {
  try {
    await api.put(`/participants/heartbeat/${roomId}`, data);
    return { success: true };
  } catch (error) {
    console.warn('[Heartbeat] Failed:', error.message);
    return { success: false, error: error.message };
  }
};

export const getActiveParticipants = async (roomId) => {
  try {
    const res = await api.get(`/participants/active/room/${roomId}`);
    return {
      success: true,
      data: res.data.data || []
    };
  } catch (error) {
    return {
      success: false,
      data: [],
      error: error.message
    };
  }
};

export const getActiveCompetitionParticipants = async (competitionId) => {
  try {
    console.log('[API] Fetching active participants for competition:', competitionId);
    const res = await api.get(`/participants/active/competition/${competitionId}`);
    console.log('[API] Active participants response:', res.data);
    return {
      success: true,
      data: res.data.data || []
    };
  } catch (error) {
    console.error('[API] Failed to fetch active participants:', error);
    return {
      success: false,
      data: [],
      error: error.message
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
    };
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

// REMOVED: Teacher-only functions
// - kickParticipant (teacher admin only)
// - inviteParticipant (teacher admin only)