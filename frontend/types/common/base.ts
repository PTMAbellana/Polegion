export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string;
}

export interface TimestampedEntity {
    created_at: string;
    updated_at: string;
}

export interface SoftDeletable {
    deleted_at?: string;
}