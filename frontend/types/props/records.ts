/**
 * Records Component Props - Props interfaces for records components
 */

export interface RecordsHeaderProps {
  roomId: number
  totalStudents: number
}

export interface RecordsDownloadSectionProps {
  onDownloadRoomAction: () => Promise<void>
  onDownloadCompetitionAction: (competitionId: string) => Promise<void>
  isLoading?: boolean
}
