import * as yup from 'yup'

export const editRoomSchema = yup.object().shape({
    title: yup.string().required("Room title is required"),
    description: yup.string().required("Room description is required"),
    mantra: yup.string().required("Room mantra is required")
})

export const createRoomSchema = yup.object().shape({
    title: yup.string().required("Room title is required"),
    description: yup.string().required("Room description is required"),
    mantra: yup.string().required("Room mantra is required")
})

export const joinRoomSchema = yup.object().shape({
    roomCode: yup.string()
        .required("Room code is required")
        .min(6, "Room code must be at least 6 characters")
})
