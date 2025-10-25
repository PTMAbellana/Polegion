"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { getRoomLeaderboards, getCompetitionLeaderboards } from '@/api/leaderboards'
import { LeaderboardItem, LeaderboardData, RecordStudent } from '@/types'

interface UseRecordsPreviewReturn {
  roomRecords: RecordStudent[]
  competitionRecords: Map<number, RecordStudent[]>
  competitions: Array<{ id: number; title: string }>
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

// Cache for preventing duplicate requests
const dataCache = new Map<string, { data: { roomRecords: RecordStudent[]; competitionRecords: Map<number, RecordStudent[]>; competitions: Array<{ id: number; title: string }> }; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export function useRecordsPreview(roomId: number): UseRecordsPreviewReturn {
  const [roomRecords, setRoomRecords] = useState<RecordStudent[]>([])
  const [competitionRecords, setCompetitionRecords] = useState<Map<number, RecordStudent[]>>(new Map())
  const [competitions, setCompetitions] = useState<Array<{ id: number; title: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchRecords = useCallback(async () => {
    try {
      // Cancel previous requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      setLoading(true)
      setError(null)

      // Check cache first
      const cacheKey = `records-${roomId}`
      const cached = dataCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('Using cached data for room', roomId)
        setRoomRecords(cached.data.roomRecords)
        setCompetitionRecords(cached.data.competitionRecords)
        setCompetitions(cached.data.competitions)
        setLoading(false)
        return
      }

      // Fetch both in parallel
      const [roomRes, compeRes] = await Promise.all([
        getRoomLeaderboards(roomId),
        getCompetitionLeaderboards(roomId)
      ])

      const roomLeaderboards = roomRes.data || []
      const competitionLeaderboards = compeRes.data || []
      
      // Convert room records
      const roomRecordsConverted = roomLeaderboards.map((item: LeaderboardItem) =>
        convertToRecordStudent(item)
      )
      setRoomRecords(roomRecordsConverted)

      // Extract competitions and convert their records
      const competitionMap = new Map<number, RecordStudent[]>()
      const competitionsList: Array<{ id: number; title: string }> = []

      competitionLeaderboards.forEach((compe: LeaderboardData) => {
        const competitionId = typeof compe.id === 'string' ? parseInt(compe.id) : (compe.id || 0)
        const competitionTitle = compe.title || `Competition ${competitionId}`

        if (competitionId) {
          competitionsList.push({
            id: competitionId,
            title: competitionTitle
          })

          // Convert competition records
          const records = compe.data.map((item: LeaderboardItem) =>
            convertToRecordStudent(item)
          )
          competitionMap.set(competitionId, records)
        }
      })

      setCompetitions(competitionsList)
      setCompetitionRecords(competitionMap)

      // Cache the result
      dataCache.set(cacheKey, {
        data: { roomRecords: roomRecordsConverted, competitionRecords: competitionMap, competitions: competitionsList },
        timestamp: Date.now()
      })
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return
      }
      
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch records'
      console.error('Error fetching records:', err)
      setError(errorMessage)
      setRoomRecords([])
      setCompetitionRecords(new Map())
      setCompetitions([])
    } finally {
      setLoading(false)
    }
  }, [roomId])

  useEffect(() => {
    if (roomId) {
      void fetchRecords()
    }

    return () => {
      // Cleanup: abort pending requests when component unmounts
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [roomId, fetchRecords])

  return {
    roomRecords,
    competitionRecords,
    competitions,
    loading,
    error,
    fetchRecords
  }
}