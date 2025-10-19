/**
 * Records Types - Common types for teacher records management
 */

export interface RecordStudent {
  id?: string | number           // Add this - unique identifier
  user_id?: string | number       // Or this
  first_name?: string
  last_name?: string
  xp?: number
  competitions_completed?: number
  average_score?: number
  problems_solved?: number
  success_rate?: string
}

export interface RecordsData {
  roomId?: number
  competitionId?: number
  records: RecordStudent[]
  totalCount: number
  generatedAt: string
}

export type DownloadFormat = 'csv' | 'json'
export type RecordType = 'room' | 'competition'
