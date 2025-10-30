export interface ModalState {
    isOpen: boolean;
    type?: string;
    data?: any;
}

export interface LoadingState {
    isLoading: boolean;
    error: string | null;
    lastUpdated?: number;
}

export interface NotificationState {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}