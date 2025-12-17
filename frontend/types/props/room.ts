import { TProblemType, UserType } from "../common";
import { RoomType } from "../common/room";

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
  viewButtonText?: string; // Custom text for view button
  deleteButtonText?: string; // Custom text for delete button
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
  viewButtonText?: string; // Custom text for view button
  deleteButtonText?: string; // Custom text for delete button
}

export interface RoomBannerProps {
    title?: string
    description?: string
    mantra?: string
    banner_image?: string | File | null
    roomCode: string
    copySuccess: boolean
    onCopyRoomCode: () => void
    onCompetitionDashboard: () => void
    onEditRoom: () => void
    onDeleteRoom: () => void
}

export interface ProblemsListProps {
    problems: TProblemType[]
    roomCode: string
}

export interface ParticipantsSidebarProps {
    participants: UserType[]
    activeCount?: number
    activeParticipantIds?: Set<string>
    onInviteParticipants: () => void
    onKickParticipant: (participant: UserType) => void
}

export interface StudentRoomBannerProps {
    title?: string
    description?: string
    mantra?: string
    banner_image?: string | File | null
    roomId: string
    onLeaveRoom: () => void
}

export interface StudentParticipantsListProps {
    participants: UserType[]
    activeCount?: number
}
