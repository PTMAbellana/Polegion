import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { ExtendTeacherRoomState } from '@/types/state/rooms'
import logger from '@/utils/logger'
import { 
    getRooms, 
    createRoom as apiCreateRoom, 
    updateRoom as apiUpdateRoom, 
    deleteRoom as apiDeleteRoom,
    uploadImage
} from '@/api/rooms'
import {
    inviteParticipant as apiInviteParticipant,
    getAllParticipants,
    kickParticipant
} from '@/api/participants'
import { CreateRoomData, UpdateRoomData } from '@/types';
import { createProblem, deleteProblem, getRoomProblems, updateProblem } from '@/api/problems'
import { createCompe, getAllCompe } from '@/api/competitions'
import { mutate } from 'swr'

export const useTeacherRoomStore = create<ExtendTeacherRoomState>()(
    persist(
        (set, get) => ({
            createdRooms: [],
            loading: false,
            error: null,
            selectedRoom: null,

            currentRoom: null,
            roomLoading: false,

            fetchRoomDetails: async (roomCode: string, forceRefresh: boolean = false) => {
                set({ roomLoading: true });
                try {
                    const currentRoom = get().currentRoom;
                    // Only skip if we already have this room WITH participants loaded
                    // (participants array exists and has been fetched - even if empty, it should be an array)
                    if (!forceRefresh && currentRoom !== null && currentRoom.code === roomCode && Array.isArray(currentRoom.participants)) {
                        set({ roomLoading: false });
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
                    const [resPart, resProb, resComp] = await Promise.allSettled(
                        [
                            getAllParticipants(room.id, 'teacher'), 
                            getRoomProblems(room.id),
                            getAllCompe(room.id, 'admin')
                        ]
                    );
                    
                    let participants;
                    let problems;
                    let competitions;

                    if (resPart.status === 'fulfilled') {
                        participants = resPart.value.success ? resPart.value.data : [];
                        logger.log('Fetched participants:', participants);
                    } else {
                        participants = [];
                    }
                    if (resProb.status === 'fulfilled') {
                        problems = resProb.value.success ? resProb.value.data : [];
                        
                    } else {
                        problems = [];
                    }
                    if (resComp.status === 'fulfilled') {
                        competitions = resComp.value.success ? resComp.value.data : [];
                        logger.log('Fetched competitions:', competitions);
                    } else {
                        competitions = [];
                    }
                    set({
                        currentRoom: {
                            ...room,
                            participants,
                            problems,
                            competitions
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
                            logger.log('Uploading banner image...');
                            const formData = new FormData();
                            formData.append('image', roomData.banner_image);
                            
                            const uploadResponse = await uploadImage(formData);
                            if (uploadResponse.success) {
                                bannerImageUrl = uploadResponse.imageUrl;
                                logger.log('Banner uploaded successfully:', bannerImageUrl);
                            } else {
                                return { 
                                    success: false, 
                                    error: 'Failed to get image URL from upload response' 
                                };
                            }
                        } catch (uploadError: unknown) {
                            const uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload banner image';
                            logger.error('Banner upload failed:', uploadError);
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
                            logger.log('Uploading updated banner image...');
                            const formData = new FormData();
                            formData.append('image', roomData.banner_image);
                            
                            const uploadResponse = await uploadImage(formData);
                            if (uploadResponse.success) {
                                bannerImageUrl = uploadResponse.imageUrl;
                                logger.log('Updated banner uploaded successfully:', bannerImageUrl);
                            } else {
                                return { 
                                    success: false, 
                                    error: 'Failed to get image URL from upload response' 
                                };
                            }
                        } catch (uploadError: unknown) {
                            const uploadErrorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload banner image';
                            logger.error('Banner upload failed:', uploadError);
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
                    const response = await apiInviteParticipant(email, roomCode);
                    
                    logger.log('API: Inviting participant:', email, 'to room:', roomCode);
                    
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

            currentProblem: null,

            setCurrentProblem: (problem) => {
                set({ currentProblem: problem });
            },

            clearCurrentProblem: () => {
                set({ currentProblem: null });
            },

            // Add new problem to currentRoom.problems array
            addProblemToRoom: async(problem) => {
                const currentRoom = get().currentRoom;
                if (!currentRoom) {
                    return {
                        success: false,
                        error: 'No current room selected'
                    };
                }
                
                try {
                    const response = await createProblem(problem, currentRoom.code);
                    if (!response.success) {
                         logger.log('Failed to add problem to room');
                         logger.log(response.error); 
                         return { 
                             success: false, 
                             error: 'Failed to add problem to room'  
                         };
                    }
                    set(state => ({
                        currentRoom: state.currentRoom ? {
                            ...state.currentRoom,
                            problems: [response.data, ...(state.currentRoom.problems || []) ]
                        } : null
                     }));
                     return {
                         success: true,
                         message: response.message
                     }
                } catch (error) {
                    logger.error('Error adding problem to room:', error);
                    return { success: false, error: 'Error adding problem to room' };
                }
            },

            // Update existing problem in currentRoom.problems array
            updateProblemInRoom: async (problemId, updatedProblem) => {
                try {
                    const response = await updateProblem(problemId, updatedProblem);
                    if (!response.success) {
                        logger.log('Failed to update problem in room');
                        logger.log(response.error);
                        return {
                            success: false,
                            error: response.error
                        }
                    }
                    set(state => ({
                        currentRoom: state.currentRoom ? {
                            ...state.currentRoom,
                            problems: (state.currentRoom.problems || []).map(p => 
                                p.id === problemId ? { ...p, ...response.data } : p
                            )
                        } : null
                    }));
                    return {
                        success: true,
                        message: response.message
                    }
                } catch (error) {
                    logger.error('Error updating problem in room:', error);
                    return {
                        success: false,
                        error: 'Error updating problem in room'
                    }
                }
            },

            // Remove problem from currentRoom.problems array
            removeProblemFromRoom: async (problemId) => {
                const currentRoom = get().currentRoom;
                if (!currentRoom) {
                    logger.error('Attempted to remove problem without a current room.');
                    return { success: false, error: 'No current room selected' };
                }
                const roomCode = currentRoom.code;

                try {
                    // Call the API to delete the problem from the database
                    const response = await deleteProblem(problemId);
                    if (!response.success) {
                        logger.log('Failed to delete problem from room via API:', response.error);
                        return { success: false, error: response.error };
                    }

                    // Optimistically update the local state to immediately reflect the change in the UI
                    const updatedProblems = (currentRoom.problems || []).filter(p => p.id !== problemId);
                    const updatedRoom = {
                        ...currentRoom,
                        problems: updatedProblems,
                    };
                    
                    // Update the Zustand store
                    set({ currentRoom: updatedRoom });

                    // Manually update the SWR cache to prevent it from re-fetching stale data.
                    // This tells other components listening to this SWR key that the data has changed.
                    // 'revalidate: false' is crucial to prevent a network request.
                    mutate(`/rooms/${roomCode}`, updatedRoom, { revalidate: false });

                    logger.log(`Problem ${problemId} removed from room ${roomCode}`);
                    return { success: true, message: response.message };

                } catch (error) {
                    logger.error('Error removing problem from room:', error);
                    return { success: false, error: 'Error removing problem from room' };
                }
            },

         removeParticipant: async (partId) => {
            const currentRoom = get().currentRoom;
            if (!currentRoom) return{
                success: false,
                error: 'No current room selected'
            }

            try {
                const response = await kickParticipant(currentRoom.id, partId);
                if (!response.success) {
                    return {
                        success: false,
                        error: response.error || 'Failed to remove participant'
                    };
                }
                set(state => ({
                    currentRoom: state.currentRoom ? {
                        ...state.currentRoom,
                        participants: (state.currentRoom.participants || []).filter(p => p.participant_id !== partId)
                    } : null
                }));
                return {
                    success: true,
                    message: response.message 
                };
            } catch (error) {
                logger.error('Failed to remove participant:', error);
                return { 
                    success: false, 
                    error: 'Failed to remove participant' 
                };
            }
        },

        // Competition management
        addCompetitionToRoom: async (title: string) => {
            const currentRoom = get().currentRoom;
            if (!currentRoom) {
                logger.error('No current room selected');
                return {
                    success: false,
                    error: 'No current room selected'
                };
            }

            logger.log('Creating competition:', { roomId: currentRoom.id, title });

            try {
                const response = await createCompe(currentRoom.id, title);
                logger.log('Create competition response:', response);
                
                // Backend returns the competition directly or in response.data
                const newCompetition = response.data || response;
                
                if (!newCompetition || !newCompetition.id) {
                    logger.error('Invalid competition response:', response);
                    return {
                        success: false,
                        error: 'Invalid response from server'
                    };
                }
                
                // Immediately update local state
                set(state => ({
                    currentRoom: state.currentRoom ? {
                        ...state.currentRoom,
                        competitions: [newCompetition, ...(state.currentRoom.competitions || [])]
                    } : null
                }));
                
                logger.log('Competition added to local state successfully');
                return {
                    success: true,
                    data: newCompetition
                };
            } catch (error: any) {
                logger.error('Failed to create competition:', error);
                const errorMessage = error?.response?.data?.error || error?.message || 'Failed to create competition';
                return {
                    success: false,
                    error: errorMessage
                };
            }
        }
    }),
    {
        name: 'teacher-rooms',
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
                createdRooms: state.createdRooms,
            }),
        }
    )
);