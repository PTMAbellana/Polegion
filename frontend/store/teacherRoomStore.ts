import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { TeacherRoomState, CreateRoomData, UpdateRoomData } from '@/types/state/rooms'
import { 
    getRooms, 
    createRoom as apiCreateRoom, 
    updateRoom as apiUpdateRoom, 
    deleteRoom as apiDeleteRoom 
} from '@/api/rooms'

export const useTeacherRoomStore = create<TeacherRoomState>()(
    persist(
        (set) => ({
            createdRooms: [],
            loading: false,
            error: null,
            selectedRoom: null,

            fetchCreatedRooms: async () => {
                set({ loading: true, error: null });
                try {
                    const response = await getRooms();
                    if (response.success) {
                        set({ 
                            createdRooms: response.data,
                            loading: false 
                        });
                    } else {
                        set({ 
                            createdRooms: [],
                            loading: false,
                            error: response.error || 'No rooms found'
                        });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rooms';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                } 
            },

            createRoom: async (roomData: CreateRoomData) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiCreateRoom(roomData);
                    if (response.success && response.data) {
                        const newRoom = response.data;
                        set(state => ({ 
                            createdRooms: [...state.createdRooms, newRoom],
                            loading: false 
                        }));
                        return { success: true, data: newRoom };
                    } else {
                        set({ 
                            error: response.error || 'Failed to create room',
                            loading: false 
                        });
                        return { success: false, error: response.error || 'Failed to create room' };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to create room';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                    return { success: false, error: errorMessage };
                }
            },

            updateRoom: async (roomId: string, roomData: UpdateRoomData) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiUpdateRoom(roomId, roomData);
                    if (response.success && response.data) {
                        const updatedRoom = response.data;
                        set(state => ({ 
                            createdRooms: state.createdRooms.map(room => 
                                room.id?.toString() === roomId ? updatedRoom : room
                            ),
                            loading: false,
                            selectedRoom: null
                        }));
                        return { success: true, data: updatedRoom };
                    } else {
                        set({ 
                            error: response.error || 'Failed to update room',
                            loading: false 
                        });
                        return { success: false, error: response.error || 'Failed to update room' };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to update room';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                    return { success: false, error: errorMessage };
                }
            },

            deleteRoom: async (roomId: string) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiDeleteRoom(roomId);
                    if (response.success) {
                        set(state => ({ 
                            createdRooms: state.createdRooms.filter(room => 
                                room.id?.toString() !== roomId
                            ),
                            loading: false 
                        }));
                        return { success: true };
                    } else {
                        set({ 
                            error: 'Failed to delete room',
                            loading: false 
                        });
                        return { success: false, error: 'Failed to delete room' };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to delete room';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                    return { success: false, error: errorMessage };
                }
            },

            setSelectedRoom: (room) => {
                set({ selectedRoom: room });
            },

            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'teacher-rooms',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                createdRooms: state.createdRooms,
            }),
        }
    )
);