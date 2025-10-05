export interface RoomType {
  id?: number;
  title?: string;
  description?: string;
  mantra?: string;
  banner_image?: string | File | null;
  code?: string;
}

export interface JoinedRoomType extends RoomType {
  participant_id: string | number;
}
