import api from './axios';

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

export const downloadRoomRecordsCSV = async (room_id) => {
    try {
        const res = await api.get(`leaderboards/room/${room_id}/export-csv`, {
            responseType: 'blob'
        })
        return {
            success: true,
            data: res.data,
            filename: res.headers['content-disposition']?.split('filename=')[1]?.replace(/"/g, '') || `room-records.csv`
        }
    } catch (error) {
        console.log('Error downloading room records CSV:', error);
        return {
            success: false,
            error: error.response?.data?.error || 'Failed to download room records',
            message: error.response?.data?.message || 'An error occurred',
            status: error.response?.status
        }
    }
}

export const downloadCompetitionRecordsCSV = async (room_id, competition_id) => {
    try {
        const res = await api.get(`leaderboards/room/${room_id}/competition/${competition_id}/export-csv`, {
            responseType: 'blob'
        })

        const filename = res.headers['content-disposition']
            ?.split('filename="')[1]
            ?.split('"')[0] || `competition-records-${new Date().toISOString().split('T')[0]}.csv`

        return {
            success: true,
            data: res.data,
            filename: filename
        }
    } catch (error) {
        console.error('Error downloading competition records:', error)
        return {
            success: false,
            error: error.response?.data?.message || error.message
        }
    }
}