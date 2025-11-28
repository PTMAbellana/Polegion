"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { getRoomLeaderboards, getCompetitionLeaderboards } from '@/api/records'
import { getUserCastleProgress, getUserAssessmentScores } from '@/api/users'
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
    user_id: participant?.user_id || '',
    first_name: participant?.first_name || 'Unknown',
    last_name: participant?.last_name || '',
    xp: item.accumulated_xp,
    total_xp: item.accumulated_xp,
    castles_completed: 0,
    total_castles: 7,
    pretest_score: undefined,
    posttest_score: undefined
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
        
        // Still need to enrich cached data with fresh castle/assessment data
        const enrichedCachedRecords = await Promise.all(
          cached.data.roomRecords.map(async (record: RecordStudent) => {
            console.log(`[CACHE] Processing record:`, { user_id: record.user_id, first_name: record.first_name })
            if (record.user_id) {
              try {
                const [castleProgressRes, assessmentScoresRes] = await Promise.all([
                  getUserCastleProgress(String(record.user_id)),
                  getUserAssessmentScores(String(record.user_id))
                ])

                let enrichedRecord = { ...record }

                if (castleProgressRes.success && castleProgressRes.data) {
                  const castleData = castleProgressRes.data
                  const completedCastles = castleData.filter((c: any) => c.completed).length
                  console.log(`[CACHE] User ${record.user_id}: ${completedCastles} of ${castleData.length} castles completed`)
                  enrichedRecord = {
                    ...enrichedRecord,
                    castles_completed: completedCastles,
                    total_castles: castleData.length || 7
                  }
                }

                if (assessmentScoresRes.success && assessmentScoresRes.data) {
                  const { pretest_score, posttest_score } = assessmentScoresRes.data
                  console.log(`[CACHE] User ${record.user_id}: Pretest=${pretest_score}%, Posttest=${posttest_score}%`)
                  enrichedRecord = {
                    ...enrichedRecord,
                    pretest_score: pretest_score,
                    posttest_score: posttest_score
                  }
                }

                return enrichedRecord
              } catch (error) {
                console.error('Error enriching cached record for user:', record.user_id, error)
              }
            }
            return record
          })
        )
        
        setRoomRecords(enrichedCachedRecords)
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

      // Enrich room records with castle progress and assessment scores
      const enrichedRoomRecords = await Promise.all(
        roomRecordsConverted.map(async (record) => {
          console.log(`[FRESH] Processing record:`, { user_id: record.user_id, first_name: record.first_name })
          if (record.user_id) {
            try {
              // Fetch castle progress and assessment scores in parallel
              const [castleProgressRes, assessmentScoresRes] = await Promise.all([
                getUserCastleProgress(String(record.user_id)),
                getUserAssessmentScores(String(record.user_id))
              ])

              console.log(`User ${record.user_id} castle progress:`, castleProgressRes)
              console.log(`User ${record.user_id} assessment scores:`, assessmentScoresRes)

              let enrichedRecord = { ...record }

              // Add castle progress
              if (castleProgressRes.success && castleProgressRes.data) {
                const castleData = castleProgressRes.data
                const completedCastles = castleData.filter((c: any) => c.completed).length
                console.log(`User ${record.user_id}: ${completedCastles} of ${castleData.length} castles completed`)
                enrichedRecord = {
                  ...enrichedRecord,
                  castles_completed: completedCastles,
                  total_castles: 7 // Always show out of 7 total castles
                }
              }

              // Add assessment scores
              if (assessmentScoresRes.success && assessmentScoresRes.data) {
                const { pretest_score, posttest_score } = assessmentScoresRes.data
                console.log(`User ${record.user_id}: Pretest=${pretest_score}%, Posttest=${posttest_score}%`)
                enrichedRecord = {
                  ...enrichedRecord,
                  pretest_score: pretest_score,
                  posttest_score: posttest_score
                }
              }

              return enrichedRecord
            } catch (error) {
              console.error('Error enriching record for user:', record.user_id, error)
            }
          }
          return record
        })
      )
      
      setRoomRecords(enrichedRoomRecords)

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