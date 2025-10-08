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
}

export interface EditRoomFormData {
    title: string
    description: string
    mantra: string
}
