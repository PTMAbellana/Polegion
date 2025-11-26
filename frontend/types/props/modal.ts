import { RoomType } from "../common";
import { useSecurityActions } from "@/hooks/profile/useSecurityActions"
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

export interface JoinRoomModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (roomCode: string) => void
}

export interface PasswordChangeModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    securityHook: ReturnType<typeof useSecurityActions>
}

export interface EmailChangeModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    securityHook: ReturnType<typeof useSecurityActions>
}
