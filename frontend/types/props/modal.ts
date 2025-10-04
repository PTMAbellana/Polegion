export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}