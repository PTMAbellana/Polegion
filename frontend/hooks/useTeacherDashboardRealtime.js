/**
 * Real-time hook for Teacher Dashboard
 * Subscribes to rooms, participants, competitions, and leaderboards
 * Replaces manual fetch polling with Supabase real-time subscriptions
 */

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getRoomLeaderboards } from '@/api/records'
import logger from '@/utils/logger'

export const useTeacherDashboardRealtime = (userId, createdRooms) => {
  const [recentCompetitions, setRecentCompetitions] = useState([])
  const [leaderboards, setLeaderboards] = useState([])
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Extract and sort competitions from rooms
  const updateCompetitions = useCallback((rooms) => {
    if (!rooms || rooms.length === 0) {
      setRecentCompetitions([])
      return
    }

    const competitions = []
    rooms.forEach(room => {
      if (room.competitions && Array.isArray(room.competitions)) {
        competitions.push(...room.competitions.map(comp => ({
          ...comp,
          roomTitle: room.title,
          roomCode: room.code
        })))
      }
    })
    
    // Sort by most recent (ONGOING first, then by ID desc)
    competitions.sort((a, b) => {
      if (a.status === 'ONGOING' && b.status !== 'ONGOING') return -1
      if (a.status !== 'ONGOING' && b.status === 'ONGOING') return 1
      return (b.id || 0) - (a.id || 0)
    })
    
    setRecentCompetitions(competitions.slice(0, 6)) // Show max 6
  }, [])

  // Fetch leaderboards for top 3 rooms
  const updateLeaderboards = useCallback(async (rooms) => {
    if (!rooms || rooms.length === 0) {
      setLeaderboards([])
      return
    }

    const leaderboardPromises = rooms.slice(0, 3).map(async (room) => {
      try {
        const result = await getRoomLeaderboards(room.id)
        if (result.success && result.data) {
          return {
            id: room.id,
            title: room.title,
            data: result.data.slice(0, 5) // Top 5
          }
        }
      } catch (error) {
        logger.error('Failed to fetch leaderboard for room:', room.id, error)
      }
      return null
    })
    
    const results = await Promise.all(leaderboardPromises)
    setLeaderboards(results.filter(Boolean))
  }, [])

  // Initial data load and real-time setup
  useEffect(() => {
    if (!userId || !createdRooms) return

    // Initial data processing
    updateCompetitions(createdRooms)
    updateLeaderboards(createdRooms)

    // Create unique channel for this teacher's dashboard
    const channel = supabase.channel(`teacher-dashboard-${userId}`)

    // Subscribe to competitions table changes (any room's competitions)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'competitions'
      },
      (payload) => {
        logger.log('[Teacher Dashboard Realtime] Competition changed:', payload)
        setLastUpdate(Date.now()) // Trigger re-fetch from store
      }
    )

    // Subscribe to participants table changes (student joins/leaves)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants'
      },
      (payload) => {
        logger.log('[Teacher Dashboard Realtime] Participant changed:', payload)
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to problem_leaderboards table changes
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'problem_leaderboards'
      },
      (payload) => {
        logger.log('[Teacher Dashboard Realtime] Leaderboard changed:', payload)
        // Re-fetch leaderboards when XP changes
        updateLeaderboards(createdRooms)
      }
    )

    // Subscribe to rooms table changes (room updates/deletes)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms'
      },
      (payload) => {
        logger.log('[Teacher Dashboard Realtime] Room changed:', payload)
        setLastUpdate(Date.now())
      }
    )

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        logger.log('[Teacher Dashboard Realtime] Subscribed successfully')
      } else if (status === 'CHANNEL_ERROR') {
        logger.error('[Teacher Dashboard Realtime] Channel error')
      } else if (status === 'TIMED_OUT') {
        logger.error('[Teacher Dashboard Realtime] Connection timed out')
      }
    })

    // Cleanup function
    return () => {
      logger.log('[Teacher Dashboard Realtime] Unsubscribing...')
      supabase.removeChannel(channel)
    }
  }, [userId, createdRooms, updateCompetitions, updateLeaderboards])

  // Update local state when createdRooms changes
  useEffect(() => {
    if (createdRooms) {
      updateCompetitions(createdRooms)
      updateLeaderboards(createdRooms)
    }
  }, [createdRooms, updateCompetitions, updateLeaderboards])

  return {
    recentCompetitions,
    leaderboards,
    lastUpdate // Can be used to trigger store refresh if needed
  }
}
