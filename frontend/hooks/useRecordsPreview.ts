"use client"

import { useState, useEffect } from 'react'
import { getRoomLeaderboards, getCompetitionLeaderboards } from '@/api/leaderboards'
import { LeaderboardItem, LeaderboardData, RecordStudent } from '@/types'

interface UseRecordsPreviewReturn {
  roomRecords: RecordStudent[]
  competitionRecords: Map<string, RecordStudent[]>
  competitions: Array<{ id: string; name: string }>
  loading: boolean
  error: string | null
  fetchRecords: () => Promise<void>
}

/**
 * Converts LeaderboardItem data to RecordStudent format
 * Includes all participants regardless of XP (unlike student view)
 */
function convertToRecordStudent(item: LeaderboardItem): RecordStudent {
  const participant = Array.isArray(item.participants)
    ? item.participants[0]
    : item.participants

  return {
    first_name: participant?.first_name || 'Unknown',
    last_name: participant?.last_name || '',
    xp: item.accumulated_xp
  }
}

export function useRecordsPreview(roomId: number): UseRecordsPreviewReturn {
  const [roomRecords, setRoomRecords] = useState<RecordStudent[]>([])
  const [competitionRecords, setCompetitionRecords] = useState<Map<string, RecordStudent[]>>(new Map())
  const [competitions, setCompetitions] = useState<Array<{ id: string; name: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRecords = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch room leaderboards (all records regardless of XP)
      const roomRes = await getRoomLeaderboards(roomId)
      const roomLeaderboards = roomRes.data || []
      
      // Convert to RecordStudent format (includes 0 XP)
      const roomRecordsConverted = roomLeaderboards.map((item: LeaderboardItem) =>
        convertToRecordStudent(item)
      )
      setRoomRecords(roomRecordsConverted)

      // Fetch competition leaderboards
      const compeRes = await getCompetitionLeaderboards(roomId)
      const competitionLeaderboards = compeRes.data || []

      // Extract competitions and convert their records
      const competitionMap = new Map<string, RecordStudent[]>()
      const competitionsList: Array<{ id: string; name: string }> = []

      competitionLeaderboards.forEach((compe: LeaderboardData) => {
        const competitionId = compe.id?.toString() || ''
        const competitionName = compe.title || `Competition ${competitionId}`

        if (competitionId) {
          competitionsList.push({
            id: competitionId,
            name: competitionName
          })

          // Convert competition records (includes 0 XP)
          const records = compe.data.map((item: LeaderboardItem) =>
            convertToRecordStudent(item)
          )
          competitionMap.set(competitionId, records)
        }
      })

      setCompetitions(competitionsList)
      setCompetitionRecords(competitionMap)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch records'
      console.error('Error fetching records:', err)
      setError(errorMessage)
      setRoomRecords([])
      setCompetitionRecords(new Map())
      setCompetitions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (roomId) {
      void fetchRecords()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  return {
    roomRecords,
    competitionRecords,
    competitions,
    loading,
    error,
    fetchRecords
  }
}