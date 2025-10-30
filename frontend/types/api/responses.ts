export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
    success: boolean;
}

export interface ApiError {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: PaginationMeta;
}