import { TProblemType } from '../common'
import { RoomType, JoinedRoomType, JoinedRoomDetails, RoomDetails } from '../common/room'
import { CreateRoomData, ProblemPayload, UpdateRoomData } from '../forms'

export interface TeacherRoomState {
    createdRooms: RoomType[]
    loading: boolean
    error: string | null
    selectedRoom: RoomType | null
    
    // Actions
    fetchCreatedRooms: () => Promise<void>
    createRoom: (roomData: CreateRoomData) => Promise<{ success: boolean; error?: string; data?: RoomType }>
    updateRoom: (roomId: string, roomData: UpdateRoomData) => Promise<{ success: boolean; error?: string; data?: RoomType }>
    deleteRoom: (roomId: string) => Promise<{ success: boolean; error?: string }>
    setSelectedRoom: (room: RoomType | null) => void
    clearError: () => void
}

export interface StudentRoomState {
    joinedRooms: JoinedRoomType[]
    loading: boolean
    error: string | null
    joinLoading: boolean
    
    // Actions
    fetchJoinedRooms: () => Promise<void>
    joinRoom: (roomCode: string) => Promise<{ success: boolean; error?: string; data?: RoomType }>
    leaveRoom: (roomId: number) => Promise<{ success: boolean; error?: string }>
    clearError: () => void
}

// Extended state for additional functionalities
export interface ExtendedStudentRoomState extends StudentRoomState {
    currentRoom: JoinedRoomDetails | null; 
    roomLoading: boolean;
    
    fetchRoomDetails: (roomCode: string) => Promise<void>;
    clearCurrentRoom: () => void;
}

export interface ExtendTeacherRoomState extends TeacherRoomState {
    currentRoom: RoomDetails | null; 
    roomLoading: boolean;
    inviteParticipant: (roomCode: string, email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
    
    fetchRoomDetails: (roomCode: string, forceRefresh?: boolean) => Promise<void>;
    clearCurrentRoom: () => void;

    // Problem Management
    currentProblem: TProblemType | null;
    setCurrentProblem: (problem: TProblemType) => void;
    clearCurrentProblem: () => void;
    
    // New optimistic update methods:
    addProblemToRoom: (problem: ProblemPayload) => Promise<{ success: boolean; error?: string }>;
    updateProblemInRoom: (problemId: string, updatedProblem: Partial<ProblemPayload>) => Promise<{ success: boolean; error?: string }>;
    removeProblemFromRoom: (problemId: string) => Promise<{ success: boolean; error?: string }>;

    removeParticipant: (partId: number) => Promise<{ success: boolean; error?: string; message?: string }>;
    
    // Competition Management
    addCompetitionToRoom: (title: string) => Promise<{ success: boolean; error?: string; data?: any }>;
}