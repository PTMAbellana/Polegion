import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ExtendTeacherRoomState } from '@/types/state/rooms'
import { 
    getRooms, 
    createRoom as apiCreateRoom, 
    updateRoom as apiUpdateRoom, 
    deleteRoom as apiDeleteRoom,
    uploadImage
} from '@/api/rooms'
import {
    inviteParticipant as apiInviteParticipant,
    getAllParticipants
} from '@/api/participants'
import { CreateRoomData, UpdateRoomData } from '@/types';
import { getRoomProblems } from '@/api/problems'

export const useTeacherRoomStore = create<ExtendTeacherRoomState>()(
    persist(
        (set, get) => ({
            createdRooms: [],
            loading: false,
            error: null,
            selectedRoom: null,

            currentRoom: null,
            roomLoading: false,

            fetchRoomDetails: async (roomCode: string) => {
                set({ roomLoading: true });
                try {
                    const currentRoom = get().currentRoom;
                    if (currentRoom !== null && currentRoom.code === roomCode) {
                        return;
                    }
                    const room = get().createdRooms.find(r => r.code === roomCode);
                    if (!room) {
                        set ({
                            error: 'Room not found',
                            currentRoom: null,
                            roomLoading: false
                        });
                        return;
                    }
                    const [resPart, resProb] = await Promise.allSettled([getAllParticipants(room.id, 'teacher'), getRoomProblems(room.id)]);
                    
                    let participants;
                    let problems;

                    if (resPart.status === 'fulfilled') {
                        participants = resPart.value.success ? resPart.value.data : [];
                    } else {
                        participants = [];
                    }
                    if (resProb.status === 'fulfilled') {
                        problems = resProb.value.success ? resProb.value.data : [];
                    } else {
                        problems = [];
                    }
                    set({
                        currentRoom: {
                            ...room,
                            participants,
                            problems
                        }
                    });
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room details';
                    set({
                        currentRoom: null, 
                        error: errorMessage 
                    });
                } finally {
                    set({ roomLoading: false });
                }
            },
            
            clearCurrentRoom: () => {
                set({ currentRoom: null });
            },

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
                    let bannerImageUrl: string | null = null;
                    
                    // First, handle image upload if there's a file
                    if (roomData.banner_image instanceof File) {
                        try {
                            console.log('Uploading banner image...');
                            const formData = new FormData();
                            formData.append('image', roomData.banner_image);
                            
                            const uploadResponse = await uploadImage(formData);
                            if (uploadResponse.success) {
                                bannerImageUrl = uploadResponse.imageUrl;
                                console.log('Banner uploaded successfully:', bannerImageUrl);
                            } else {
                                return { 
                                    success: false, 
                                    error: 'Failed to get image URL from upload response' 
                                };
                            }
                        } catch (uploadError: unknown) {
                            const uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload banner image';
                            console.error('Banner upload failed:', uploadError);
                            set({ 
                                error: `Failed to upload banner image: ${uploadErrorMessage}`,
                                loading: false 
                            });
                            return { 
                                success: false, 
                                error: `Failed to upload banner image: ${uploadErrorMessage}` 
                            };
                        }
                    } else if (typeof roomData.banner_image === 'string') {
                        // If banner_image is already a URL string, use it as is
                        bannerImageUrl = roomData.banner_image;
                    }

                    // Prepare room data with the uploaded image URL
                    const roomDataWithImage = {
                        ...roomData,
                        banner_image: bannerImageUrl,
                        visibility: 'private',
                    };

                    // Now create the room with the image URL
                    const response = await apiCreateRoom(roomDataWithImage);
                    if (response.success && response.data) {
                        const newRoom = response.data;
                        set(state => ({ 
                            createdRooms: [ newRoom, ...state.createdRooms ],
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
                    let bannerImageUrl: string | null = null;
                    
                    // First, handle image upload if there's a new file
                    if (roomData.banner_image instanceof File) {
                        try {
                            console.log('Uploading updated banner image...');
                            const formData = new FormData();
                            formData.append('image', roomData.banner_image);
                            
                            const uploadResponse = await uploadImage(formData);
                            if (uploadResponse.success) {
                                bannerImageUrl = uploadResponse.imageUrl;
                                console.log('Updated banner uploaded successfully:', bannerImageUrl);
                            } else {
                                return { 
                                    success: false, 
                                    error: 'Failed to get image URL from upload response' 
                                };
                            }
                        } catch (uploadError: unknown) {
                            const uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload banner image';
                            console.error('Banner upload failed:', uploadError);
                            set({ 
                                error: `Failed to upload banner image: ${uploadErrorMessage}`,
                                loading: false 
                            });
                            return { success: false, error: `Failed to upload banner image: ${uploadErrorMessage}` };
                        }
                    } else if (typeof roomData.banner_image === 'string') {
                        // If banner_image is already a URL string, use it as is
                        bannerImageUrl = roomData.banner_image;
                    }

                    // Prepare room data with the uploaded/existing image URL
                    const roomDataWithImage = {
                        ...roomData,
                        banner_image: bannerImageUrl
                    };

                    // Now update the room with the image URL
                    const response = await apiUpdateRoom(roomId, roomDataWithImage);
                    if (response.success && response.data) {
                        const updatedRoom = response.data;
                        set(state => ({ 
                            createdRooms: state.createdRooms.map(room => 
                                room.id?.toString() === roomId ? updatedRoom : room
                            ),
                            currentRoom: state.currentRoom?.id?.toString() === roomId ? updatedRoom : state.currentRoom,
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
            
            inviteParticipant: async (roomCode: string, email: string) => {
                set({ loading: true, error: null });
                try {
                    // TODO: Replace with your actual API call
                    const response = await apiInviteParticipant(email, roomCode);
                    
                    console.log('API: Inviting participant:', email, 'to room:', roomCode);
                    
                    // Optionally refresh room details to update participants list
                    // const updatedRoom = await get().fetchRoomDetails(roomCode);
                    
                    set({ loading: false });
                    return { 
                        success: true,
                        message: response.message 
                    };
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to invite participant';
                    set({ 
                        error: errorMessage,
                        loading: false 
                    });
                    return { 
                        success: false, 
                        error: errorMessage 
                    };
                }
            },

            setSelectedRoom: (room) => {
                set({ selectedRoom: room });
            },

            clearError: () => {
                set({ error: null });
            },

            // Problem Management
            problems: [],
            currentProblem: null,
            problemLoading: false,

            fetchProblems: async (roomCode: string) => {
                set({ problemLoading: true, error: null });
                try {
                    const room = get().createdRooms.find(r => r.code === roomCode);
                    if (!room) {
                        set({ problemLoading: false, error: 'Room not found' });
                        return;
                    }
                    const response = await getRoomProblems(room.id);
                    if (response.success) {
                        set({ problems: response.data, problemLoading: false });
                    } else {
                        set({ problems: [], problemLoading: false, error: response.error });
                    }
                } catch (error: unknown) {
                    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch problems';
                    set({ error: errorMessage, problemLoading: false });
                }
            },

            setCurrentProblem: (problem) => {
                set({ currentProblem: problem });
            },

            clearCurrentProblem: () => {
                set({ currentProblem: null });
            },
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