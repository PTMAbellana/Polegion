"use client"

import React, { useState, useMemo, useRef } from 'react'
import { Download } from 'lucide-react'
import { RecordsDownloadSectionProps, RecordStudent } from '@/types/common/records'
import styles from '@/styles/records.module.css'
import RecordsPreview from './RecordsPreview'

interface RecordsDownloadSectionWithPreviewProps extends RecordsDownloadSectionProps {
  roomRecords: RecordStudent[]
  competitionRecords: Map<number, RecordStudent[]>
  competitions: Array<{ id: number; title: string }>
}

export default function RecordsDownloadSection({
  onDownloadRoomAction,
  onDownloadCompetitionAction,
  isLoading = false,
  roomRecords = [],
  competitionRecords = new Map(),
  competitions = []
}: RecordsDownloadSectionWithPreviewProps) {
  const [recordType, setRecordType] = useState<'room' | 'competition' | 'worldmap'>('room')
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<number | ''>('')
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get preview records based on selected type and competition
  const previewRecords = useMemo(() => {
    if (recordType === 'room') {
      return roomRecords
    }
    if (recordType === 'worldmap') {
      return roomRecords // Use room records for worldmap too
    }
    if (selectedCompetitionId && competitionRecords.has(selectedCompetitionId)) {
      return competitionRecords.get(selectedCompetitionId) || []
    }
    return []
  }, [recordType, selectedCompetitionId, roomRecords, competitionRecords])

  const handleDownload = async () => {
    console.log('🔽 Download button clicked, recordType:', recordType)
    if (recordType === 'room') {
      await onDownloadRoomAction()
    } else if (recordType === 'worldmap') {
      console.log('📍 Downloading WORLDMAP CSV')
      await onDownloadRoomAction('worldmap')
    } else {
      if (!selectedCompetitionId) {
        alert('Please select a competition')
        return
      }
      await onDownloadCompetitionAction(selectedCompetitionId.toString())
    }
  }

  const handleViewProgress = (userId: string) => {
    window.open(`/teacher/student-progress/${userId}`, '_blank')
  }

  return (
    <div className={styles.records_download_section}>
      {/* Type Selection */}
      <div className={styles.records_type_selector}>
        <label className={styles.records_type_option}>
          <input
            type="radio"
            name="recordType"
            value="room"
            checked={recordType === 'room'}
            onChange={(e) => setRecordType(e.target.value as 'room' | 'competition' | 'worldmap')}
            disabled={isLoading}
          />
          <span>Total Room Ranking</span>
        </label>
        <label className={styles.records_type_option}>
          <input
            type="radio"
            name="recordType"
            value="competition"
            checked={recordType === 'competition'}
            onChange={(e) => setRecordType(e.target.value as 'room' | 'competition' | 'worldmap')}
            disabled={isLoading}
          />
          <span>Competition Ranking</span>
        </label>
        <label className={styles.records_type_option}>
          <input
            type="radio"
            name="recordType"
            value="worldmap"
            checked={recordType === 'worldmap'}
            onChange={(e) => setRecordType(e.target.value as 'room' | 'competition' | 'worldmap')}
            disabled={isLoading}
          />
          <span>Worldmap Progress</span>
        </label>
      </div>

      {/* Competition Selector & Search - Inline */}
      <div className={styles.records_controls_row}>
        {recordType === 'competition' && (
          <div className={styles.records_competition_selector}>
            <label className={styles.records_selector_label}>Select Competition:</label>
            <select
              value={selectedCompetitionId}
              onChange={(e) => setSelectedCompetitionId(e.target.value ? parseInt(e.target.value) : '')}
              disabled={isLoading}
              className={styles.records_select}
            >
              <option value="">-- Choose a competition --</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.title}
                </option>
              ))}
            </select>
          </div>
        )}
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search by first or last name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.records_filter_input_inline}
        />
      </div>

      {/* Records Preview - No label */}
      <div className={styles.records_preview_section}>
        <RecordsPreview
          records={previewRecords}
          searchTerm={searchTerm}
          emptyMessage="No records to display"
          showProgressButton={recordType === 'worldmap'}
          onViewProgress={handleViewProgress}
          isWorldmapView={recordType === 'worldmap'}
        />
      </div>

      {/* Download Controls */}
      <div className={styles.records_download_controls}>
        <button
          onClick={handleDownload}
          disabled={isLoading || (recordType === 'competition' && !selectedCompetitionId)}
          className={styles.records_download_button}
        >
          <Download size={18} />
          <span>{isLoading ? 'Downloading...' : 'Download CSV Records'}</span>
        </button>
      </div>
    </div>
  )
}
