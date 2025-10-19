"use client"

import React, { useState, useMemo, useRef } from 'react'
import { Download } from 'lucide-react'
import { RecordsDownloadSectionProps } from '@/types'
import styles from '@/styles/leaderboard.module.css'
import RecordsPreview from './RecordsPreview'

interface RecordsDownloadSectionWithPreviewProps extends RecordsDownloadSectionProps {
  roomRecords: Array<{ first_name?: string; last_name?: string; xp: number }>
  competitionRecords: Map<string, Array<{ first_name?: string; last_name?: string; xp: number }>>
  competitions: Array<{ id: string; name: string }>
}

export default function RecordsDownloadSection({
  onDownloadRoomAction,
  onDownloadCompetitionAction,
  isLoading = false,
  roomRecords = [],
  competitionRecords = new Map(),
  competitions = []
}: RecordsDownloadSectionWithPreviewProps) {
  const [recordType, setRecordType] = useState<'room' | 'competition'>('room')
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Get preview records based on selected type and competition
  const previewRecords = useMemo(() => {
    if (recordType === 'room') {
      return roomRecords
    }
    if (selectedCompetitionId && competitionRecords.has(selectedCompetitionId)) {
      return competitionRecords.get(selectedCompetitionId) || []
    }
    return []
  }, [recordType, selectedCompetitionId, roomRecords, competitionRecords])

  const handleDownload = async () => {
    if (recordType === 'room') {
      await onDownloadRoomAction()
    } else {
      if (!selectedCompetitionId) {
        alert('Please select a competition')
        return
      }
      await onDownloadCompetitionAction(selectedCompetitionId)
    }
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
            onChange={(e) => setRecordType(e.target.value as 'room' | 'competition')}
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
            onChange={(e) => setRecordType(e.target.value as 'room' | 'competition')}
            disabled={isLoading}
          />
          <span>Competition Ranking</span>
        </label>
      </div>

      {/* Competition Selector & Search - Inline */}
      <div className={styles.records_controls_row}>
        {recordType === 'competition' && (
          <div className={styles.records_competition_selector}>
            <label className={styles.records_selector_label}>Select Competition:</label>
            <select
              value={selectedCompetitionId}
              onChange={(e) => setSelectedCompetitionId(e.target.value)}
              disabled={isLoading}
              className={styles.records_select}
            >
              <option value="">-- Choose a competition --</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.name}
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
