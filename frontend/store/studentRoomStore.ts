import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { StudentRoomState } from '@/types/state/rooms'
import { JoinedRoomType } from '@/types/common/room'
import { 
    getJoinedRooms as apiGetJoinedRooms, 
    joinRoom as apiJoinRoom, 
    leaveRoom as apiLeaveRoom 
} from '@/api/participants'

export const useStudentRoomStore = create<StudentRoomState>()(
    persist(
        (set) => ({
            joinedRooms: [],
            loading: false,
            error: null,
            joinLoading: false,

            fetchJoinedRooms: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await apiGetJoinedRooms();
                    console.log('Fetched joined rooms:', response);
                    if (response.success) {
                        console.log('Raw joined rooms data:', response.data);
                        
                        // Transform to JoinedRoomType with participant_id preserved
                        const transformedRooms: JoinedRoomType[] = response.data.map((item: any) => ({
                            ...item.room,  // All room properties (id, title, description, etc.)
                            participant_id: item.id  // Preserve participant ID
                        }));
                        
                        console.log('Transformed joined rooms:', transformedRooms);
                        
                        set({ 
                            joinedRooms: transformedRooms,
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
                            const transformedRooms: JoinedRoomType[] = joinedResponse.data.map((item: any) => ({
                                ...item.room,
                                participant_id: item.id
                            }));
                            
                            set({ 
                                joinedRooms: transformedRooms,
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