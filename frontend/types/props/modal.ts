import { RoomType } from "../common";
import { EditRoomFormData } from "../forms";

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CreateRoomModalProps {
    isOpen: boolean
    onClose: () => void
}

export interface EditRoomModalProps {
    room: RoomType | null
    isOpen: boolean
    onClose: () => void
    onSubmit: (formData: EditRoomFormData & { banner_image: File | null }, roomId: number) => Promise<void>
    isLoading: boolean
}

export interface InviteParticipantModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (email: string) => Promise<void> // Add this
}