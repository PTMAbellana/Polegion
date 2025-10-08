import { CompetitionType } from "./competition";
import { SProblemType, TProblemType } from "./problem";
import { UserType } from "./user";

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

// for teachers detailed view
export interface RoomDetails extends RoomType { 
  visibility?: string;
  participants: UserType[];
  problems: TProblemType[];
}

// for students detailed view
export interface JoinedRoomDetails extends JoinedRoomType { 
  participants: UserType[];
  competitions: CompetitionType[];
  problems: SProblemType[];
  teacher: UserType;
}

