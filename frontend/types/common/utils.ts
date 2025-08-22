export interface SelectOption<T = string> {
    value: T;
    label: string;
    disabled?: boolean;
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';

export type Theme = 'light' | 'dark' | 'system';

export type Size = 'sm' | 'md' | 'lg' | 'xl';