import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ExtendedStudentRoomState } from '@/types/state/rooms'
import { 
    getJoinedRooms as apiGetJoinedRooms, 
    joinRoom as apiJoinRoom, 
    leaveRoom as apiLeaveRoom 
} from '@/api/participants'
import { getRoomByCode } from '@/api/rooms';

export const useStudentRoomStore = create<ExtendedStudentRoomState>()(
    persist(
        (set) => ({
            joinedRooms: [],
            loading: false,
            error: null,
            joinLoading: false,

            currentRoom: null,
            roomLoading: false,

            fetchRoomDetails: async (roomCode: string) => {
                set({ roomLoading: true, error: null });
                try {
                    const response = await getRoomByCode(roomCode, 'student');
                    console.log('Fetched room details:', response);
                    
                    if (response.success) {
                        set({ 
                            currentRoom: response.data,
                            roomLoading: false 
                        });
                    } else {
                        set({ 
                            currentRoom: null,
                            roomLoading: false,
                            error: response.error || 'Room not found'
                        });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room details';
                    set({ 
                        error: errorMessage,
                        roomLoading: false,
                        currentRoom: null
                    });
                }
            },

            clearCurrentRoom: () => {
                set({ currentRoom: null });
            },

            fetchJoinedRooms: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await apiGetJoinedRooms();
                    console.log('Fetched joined rooms:', response);
                    if (response.success) {
                        console.log('Raw joined rooms data:', response.data);
                        
                        
                        set({ 
                            joinedRooms: response.data,
                            loading: false 
                        });
                    } else {
                        set({ 
                            joinedRooms: [],
                            loading: false,
                            error: response.error || 'No rooms found'
                        });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch joined rooms';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                } 
            },

            joinRoom: async (roomCode: string) => {
                set({ joinLoading: true, error: null });
                try {
                    const response = await apiJoinRoom(roomCode);
                    if (response.success) {
                        // Refresh the joined rooms list after successful join
                        const joinedResponse = await apiGetJoinedRooms();
                        if (joinedResponse.success) {
                            
                            set({ 
                                joinedRooms: response.data,
                                joinLoading: false 
                            });
                        } else {
                            set({ joinLoading: false });
                        }
                        return { success: true, data: response.data };
                    } else {
                        set({ 
                            error: response.error || 'Failed to join room',
                            joinLoading: false 
                        });
                        return { success: false, error: response.error || 'Failed to join room' };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to join room';
                    set({ 
                        error: errorMessage,
                        joinLoading: false 
                    });
                    return { success: false, error: errorMessage };
                }
            },

            leaveRoom: async (roomId: string) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiLeaveRoom(roomId);
                    if (response.success) {
                        set(state => ({ 
                            joinedRooms: state.joinedRooms.filter(room => 
                                room.id?.toString() !== roomId
                            ),
                            loading: false 
                        }));
                        return { success: true };
                    } else {
                        set({ 
                            error: response.error || 'Failed to leave room',
                            loading: false 
                        });
                        return { success: false, error: response.error || 'Failed to leave room' };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to leave room';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                    return { success: false, error: errorMessage };
                }
            },

            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'student-rooms',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                joinedRooms: state.joinedRooms,
            }),
        }
    )
);