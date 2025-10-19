"use client"

import React, { useState, useMemo } from 'react'
import { RecordStudent } from '@/types'
import styles from '@/styles/leaderboard.module.css'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface RecordsPreviewProps {
  records: RecordStudent[]
  searchTerm?: string
  emptyMessage?: string
}

type SortField = 'firstName' | 'lastName' | 'xp'
type SortDirection = 'asc' | 'desc'

export default function RecordsPreview({
  records,
  searchTerm = '',
  emptyMessage = 'No records available'
}: RecordsPreviewProps) {
  const [sortField, setSortField] = useState<SortField>('xp')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Sort and filter records
  const sortedRecords = useMemo(() => {
    const filtered = records.filter(record => {
      const firstName = record.first_name?.toLowerCase() || ''
      const lastName = record.last_name?.toLowerCase() || ''
      const search = searchTerm.toLowerCase()
      return firstName.includes(search) || lastName.includes(search)
    })

    return filtered.sort((a, b) => {
      let compareA: string | number = 0
      let compareB: string | number = 0

      switch (sortField) {
        case 'firstName':
          compareA = a.first_name?.toLowerCase() || ''
          compareB = b.first_name?.toLowerCase() || ''
          break
        case 'lastName':
          compareA = a.last_name?.toLowerCase() || ''
          compareB = b.last_name?.toLowerCase() || ''
          break
        case 'xp':
          compareA = a.xp || 0
          compareB = b.xp || 0
          break
      }

      if (compareA < compareB) {
        return sortDirection === 'asc' ? -1 : 1
      }
      if (compareA > compareB) {
        return sortDirection === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [records, sortField, sortDirection, searchTerm])

  // Create a rank map based on XP (rank never changes, always based on XP order)
  const rankMap = useMemo(() => {
    const xpSorted = [...records].sort((a, b) => (b.xp || 0) - (a.xp || 0))
    const map = new Map<RecordStudent, number>()
    xpSorted.forEach((record, index) => {
      map.set(record, index + 1)
    })
    return map
  }, [records])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // If clicking same field, toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // If clicking different field, set appropriate default direction
      setSortField(field)
      // XP should default to descending (highest first), names to ascending
      setSortDirection(field === 'xp' ? 'desc' : 'asc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className={styles.records_sort_placeholder} />
    return sortDirection === 'asc' ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    )
  }

  if (records.length === 0) {
    return (
      <div className={styles.records_empty_state}>
        <div className={styles.records_empty_icon}>📋</div>
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={styles.records_preview_wrapper}>
      {/* Scrollable Table */}
      <div className={styles.records_preview_container}>
        <div className={styles.records_table_header}>
          <div className={styles.records_table_header_cell}>
            <span>Rank</span>
          </div>
          <button
            onClick={() => handleSort('firstName')}
            className={styles.records_table_header_cell}
          >
            <span>First Name</span>
            <SortIcon field="firstName" />
          </button>
          <button
            onClick={() => handleSort('lastName')}
            className={styles.records_table_header_cell}
          >
            <span>Last Name</span>
            <SortIcon field="lastName" />
          </button>
          <button
            onClick={() => handleSort('xp')}
            className={styles.records_table_header_cell}
          >
            <span>XP</span>
            <SortIcon field="xp" />
          </button>
        </div>

        <div className={styles.records_table_body}>
          {sortedRecords.map((record, idx) => (
            <div key={`record-${idx}-${record.xp}`} className={styles.records_table_row}>
                <div className={styles.records_table_cell}>#{rankMap.get(record)}</div>
                <div className={styles.records_table_cell}>
                    {record.first_name || 'Unknown'}
                </div>
                <div className={styles.records_table_cell}>
                    {record.last_name || ''}
                </div>
                <div className={styles.records_table_cell}>
                    <strong>{record.xp || 0}</strong>
                </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Count */}
      {searchTerm && (
        <div className={styles.records_results_count}>
          Showing {sortedRecords.length} of {records.length} records
        </div>
      )}
    </div>
  )
}
