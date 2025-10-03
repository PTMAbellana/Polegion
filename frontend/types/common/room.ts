export interface RoomType {
  id?: number;
  title?: string;
  description?: string;
  mantra?: string;
  banner_image?: string | File | null;
  code?: string;
  created_at?: string;
}

export interface JoinedRoomType extends RoomType {
  participant_id: string | number;
}

export interface RoomCardProps {
  room: RoomType;
  onViewRoom: (roomCode: string | number, roomId?: number) => void;
  useRoomCode?: boolean; // Whether to use room code or ID for navigation
  showClickableCard?: boolean; // Whether the entire card is clickable
  showEditButton?: boolean; // Whether to show edit button
  showDeleteButton?: boolean; // Whether to show delete button
  showRoomCode?: boolean; // Whether to display room code
  onEditRoom?: (room: RoomType) => void; // Edit room callback
  onDeleteRoom?: (roomId: number) => void; // Delete room callback
}

export interface RoomCardsListProps {
  title?: string;
  rooms: RoomType[];
  onViewRoom: (roomCode: string | number, roomId?: number) => void;
  useRoomCode?: boolean;
  showClickableCard?: boolean;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  showRoomCode?: boolean;
  onEditRoom?: (room: RoomType) => void;
  onDeleteRoom?: (roomId: number) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}