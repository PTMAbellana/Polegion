"use client"

import { useState, useCallback } from 'react'

interface UseRecordsManagementReturn {
  isLoading: boolean
  handleDownloadRoom: (format: 'csv' | 'json') => Promise<void>
  handleDownloadCompetition: (format: 'csv' | 'json', competitionId?: string) => Promise<void>
}

export function useRecordsManagement(roomId: number): UseRecordsManagementReturn {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownloadRoom = useCallback(async (format: 'csv' | 'json') => {
    setIsLoading(true)
    try {
      console.log('📥 Download initiated:', {
        type: 'room',
        roomId,
        format,
        timestamp: new Date().toISOString()
      })

      // Alert for demo purposes
      alert(
        `Room Records Download\n\n` +
        `Format: ${format.toUpperCase()}\n` +
        `Room ID: ${roomId}\n` +
        `Endpoint: /api/leaderboards/room/${roomId}/export-${format}\n\n` +
        `Check console for full details.`
      )

      // In production, this will call:
      // const response = await fetch(`/api/leaderboards/room/${roomId}/export-${format}`)
      // const blob = await response.blob()
      // ... trigger download
    } catch (error) {
      console.error('❌ Error downloading room records:', error)
      alert('Failed to download room records')
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  const handleDownloadCompetition = useCallback(async (format: 'csv' | 'json', competitionId?: string) => {
    setIsLoading(true)
    try {
      console.log('📥 Download initiated:', {
        type: 'competition',
        roomId,
        competitionId,
        format,
        timestamp: new Date().toISOString()
      })

      alert(
        `Competition Records Download\n\n` +
        `Format: ${format.toUpperCase()}\n` +
        `Room ID: ${roomId}\n` +
        `Competition ID: ${competitionId}\n` +
        `Endpoint: /api/leaderboards/competition/${competitionId}/export-${format}\n\n` +
        `Check console for full details.`
      )

      // In production, this will call:
      // const response = await fetch(`/api/leaderboards/competition/${competitionId}/export-${format}`)
      // const blob = await response.blob()
      // ... trigger download
    } catch (error) {
      console.error('❌ Error downloading competition records:', error)
      alert('Failed to download competition records')
    } finally {
      setIsLoading(false)
    }
  }, [roomId])

  return {
    isLoading,
    handleDownloadRoom,
    handleDownloadCompetition
  }
}
