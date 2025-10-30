import { useState } from 'react'
import { getCompetitionLeaderboards, getRoomLeaderboards } from '@/api/leaderboards'
import { LeaderboardData, LeaderboardItem } from '@/types'

export function useLeaderboardManagement(roomId: number) {
  const [roomBoards, setRoomBoards] = useState<LeaderboardItem[]>([])
  const [compeBoards, setCompeBoards] = useState<LeaderboardData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeaderboards = async () => {
    try {
      setLoading(true)
      setError(null)
      const [roomRes, compeRes] = await Promise.all([
        getRoomLeaderboards(roomId),
        getCompetitionLeaderboards(roomId)
      ])

      setRoomBoards(roomRes.data || [])
      setCompeBoards(compeRes.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch leaderboards'
      console.error('Error fetching leaderboards:', err)
      setError(errorMessage)
      setRoomBoards([])
      setCompeBoards([])
    } finally {
      setLoading(false)
    }
  }

  const clearLeaderboards = () => {
    setRoomBoards([])
    setCompeBoards([])
    setError(null)
  }

  return {
    roomBoards,
    compeBoards,
    loading,
    error,
    fetchLeaderboards,
    clearLeaderboards
  }
}
