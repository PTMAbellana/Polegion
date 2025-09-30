import { RoomType } from '../common/room'

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
    joinedRooms: RoomType[]
    loading: boolean
    error: string | null
    joinLoading: boolean
    
    // Actions
    fetchJoinedRooms: () => Promise<void>
    joinRoom: (roomCode: string) => Promise<{ success: boolean; error?: string; data?: RoomType }>
    leaveRoom: (roomId: string) => Promise<{ success: boolean; error?: string }>
    clearError: () => void
}

export interface CreateRoomData {
    title: string
    description: string
    mantra: string
    banner_image?: string | File | null
    visibility?: string
}

export interface UpdateRoomData {
    title?: string
    description?: string
    mantra?: string
    banner_image?: string | File | null
    visibility?: string
}