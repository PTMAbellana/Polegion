/**
 * Records Component Props - Props interfaces for records components
 */

import { DownloadFormat } from '@/types/common/records'

export interface RecordsHeaderProps {
  roomId: number
  totalStudents: number
}

export interface RecordsDownloadSectionProps {
  onDownloadRoomAction: (format: DownloadFormat) => Promise<void>
  onDownloadCompetitionAction: (format: DownloadFormat, competitionId: string) => Promise<void>
  isLoading?: boolean
}
