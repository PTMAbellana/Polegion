import { LeaderboardItem, LeaderboardData } from '../common'

export interface LeaderboardRowProps {
  row: LeaderboardItem
  rank: number
}

export interface LeaderboardGridProps {
  items: LeaderboardItem[]
  emptyMessage?: string
  emptyIcon?: string
}

export interface LeaderboardTabsProps {
  activeTab: 'overall' | 'competition'
  onTabChange: (tab: 'overall' | 'competition') => void
  overallCount: number
  competitionCount: number
}

export interface LeaderboardHeaderProps {
  totalPlayers: number
  totalCompetitions: number
}

export interface CompetitionLeaderboardsProps {
  competitions: LeaderboardData[]
}
