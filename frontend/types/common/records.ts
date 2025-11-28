/**
 * Records Types - Common types for teacher records management
 */

export interface RecordStudent {
  id?: string | number           // Add this - unique identifier
  user_id?: string | number       // Or this
  first_name?: string
  last_name?: string
  xp?: number
  total_xp?: number
  competitions_completed?: number
  average_score?: number
  problems_solved?: number
  success_rate?: string
  castles_completed?: number
  total_castles?: number
  pretest_score?: number
  posttest_score?: number
}

export interface RecordsData {
  roomId?: number
  competitionId?: number
  records: RecordStudent[]
  totalCount: number
  generatedAt: string
}

export interface RecordCompetition {
  id: number
  title: string
}

export interface RecordsDownloadSectionProps {
  onDownloadRoomAction: () => Promise<void>
  onDownloadCompetitionAction: (competitionId: string) => Promise<void>
  isLoading?: boolean
  roomRecords?: RecordStudent[]
  competitionRecords?: Map<number, RecordStudent[]>
  competitions?: RecordCompetition[]
}

export type DownloadFormat = 'csv' | 'json'
export type RecordType = 'room' | 'competition'

