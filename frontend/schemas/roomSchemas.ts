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
