// api/records.js - Leaderboards API (Student-only build)
import api from './axios';

// Students can view room leaderboards
export const getRoomLeaderboards = async (room_id) => {
    try {
        const res = await api.get(`leaderboards/room/${room_id}`);
        return {
            success: true,
            message: 'Room leaderboards fetched successfully',
            data: res.data.data
        };
    } catch (error) {
        console.log('Error fetching room leaderboards:', error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to fetch room leaderboards',
            message: error.response?.data?.message || 'An error occurred',
            status: error.response?.status
        }
    }
}

// Students can view competition leaderboards
export const getCompetitionLeaderboards = async (room_id) => {
    try {
        const res = await api.get(`leaderboards/competition/${room_id}`);
        return {
            success: true,
            message: 'Competition leaderboards fetched successfully',
            data: res.data.data
        };
    } catch (error) {
        console.log('Error fetching competition leaderboards:', error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to fetch competition leaderboards',
            message: error.response?.data?.message || 'An error occurred',
            status: error.response?.status
        }
    }
}

// REMOVED: Teacher-only functions
// - downloadRoomRecordsCSV (teacher only)
// - downloadCompetitionRecordsCSV (teacher only)
