import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ExtendedStudentRoomState } from '@/types/state/rooms'
import { 
    getJoinedRooms as apiGetJoinedRooms, 
    joinRoom as apiJoinRoom, 
    leaveRoom as apiLeaveRoom, 
    getAllParticipants
} from '@/api/participants'
import { getRoomProblems } from '@/api/problems';
import { CompetitionType, SProblemType, UserType } from '@/types';
import { getAllCompe } from '@/api/competitions';

export const useStudentRoomStore = create<ExtendedStudentRoomState>()(
    persist(
        (set, get) => ({
            joinedRooms: [],
            loading: false,
            error: null,
            joinLoading: false,

            currentRoom: null,
            roomLoading: false,

            fetchRoomDetails: async (roomCode: string) => {
                set({ roomLoading: true, error: null });
                try {
                    // Get the room from current state
                    const room = get().joinedRooms.find(r => r.code === roomCode);
                    
                    if (!room) {
                        console.log('Room not found with code:', roomCode);
                        set ({
                            error: 'Room not found',
                            currentRoom: null,
                            roomLoading: false
                        });
                        return;
                    }

                    console.log('📡 Fetching fresh data for room:', room.id);

                    const [resPart, resProb, resCompe] = await Promise.allSettled([
                        getAllParticipants(room.id, 'student'), 
                        getRoomProblems(room.id, 'student'),
                        getAllCompe(room.id, 'student')
                    ]);
                    
                    let participants: UserType[];
                    let problems: SProblemType[];
                    let competitions: CompetitionType[] = [{
                        id: 1,
                        title: 'Math Competition',
                        status: 'active'
                    }];

                    if (resPart.status === 'fulfilled') {
                        console.log('Fetched participants:', resPart.value);
                        participants = resPart.value.success ? resPart.value.data : [];
                    } else {
                        console.log('Failed to fetch participants:', resPart.reason);
                        participants = [];
                    }
                    if (resProb.status === 'fulfilled') {
                        console.log('Fetched problems:', resProb.value);
                        problems = resProb.value.success ? resProb.value.data : [];
                    } else {
                        console.log('Failed to fetch problems:', resProb.reason);
                        problems = [];
                    }

                    if (resCompe.status === 'fulfilled') {
                        console.log('Fetched competitions:', resCompe.value);
                        competitions = resCompe.value.success ? resCompe.value.data : [];
                    } else {
                        console.log('Failed to fetch competitions:', resCompe.reason);
                        competitions = [];
                    }
                    
                    set({
                        currentRoom: {
                            ...room,
                            participants,
                            problems,
                            competitions,
                            teacher: {
                                first_name: 'John',
                                last_name: 'Doe',
                                gender: 'male',
                                profile_pic: null,
                                role: 'teacher'
                            }
                        }
                    });
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room details';
                    console.error('Fetch room details error:', error);
                    set({ 
                        error: errorMessage,
                        roomLoading: false,
                        currentRoom: null
                    });
                } finally {
                    set({ roomLoading: false });
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
                        return { success: true, data: response.data };
                    } else {
                        set({ 
                            joinedRooms: [],
                            loading: false,
                            error: response.error || 'No rooms found'
                        });
                        return { success: false, error: response.error };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch joined rooms';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                    return { success: false, error: errorMessage };
                } 
            },

            joinRoom: async (roomCode: string) => {
                set({ joinLoading: true, error: null });
                try {
                    const response = await apiJoinRoom(roomCode);
                    if (response.success) {
                        const newJoin = response.data;
                        set(state => ({ 
                            joinedRooms: [newJoin, ...state.joinedRooms],
                            joinLoading: false
                        }));
                    
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

            leaveRoom: async (roomId: number) => {
                set({ loading: true, error: null });
                try {
                    const response = await apiLeaveRoom(roomId);
                    if (response.success) {
                        set(state => ({ 
                            joinedRooms: state.joinedRooms.filter(room => 
                                room.id !== roomId
                            ),
                        }));
                        return { success: true };
                    } else {
                        set({ 
                            error: response.error || 'Failed to leave room',
                        });
                        return { success: false, error: response.error || 'Failed to leave room' };
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to leave room';
                    set({ 
                        error: errorMessage,
                    });
                    return { success: false, error: errorMessage };
                } finally {
                    set({ loading: false });
                }
            },

            clearError: () => {
                set({ error: null });
            }
        }),
        {
            name: 'student-rooms',
            storage: createJSONStorage(() => {
                // Return a no-op storage during SSR
                if (typeof window === 'undefined') {
                    return {
                        getItem: () => null,
                        setItem: () => {},
                        removeItem: () => {},
                    }
                }
                return localStorage
            }),
            partialize: (state) => ({
                joinedRooms: state.joinedRooms,
            }),
        }
    )
);