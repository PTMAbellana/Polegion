import { UserType } from './user'

export interface LeaderboardItem {
  accumulated_xp: number
  participants: UserType | UserType[]
}

export interface LeaderboardData {
  id?: number
  title?: string
  data: LeaderboardItem[]
}

