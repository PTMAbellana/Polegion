/**
 * Real-time hook for Student Dashboard
 * Subscribes to participants, competitions, and leaderboards for joined rooms
 * Replaces manual fetch polling with Supabase real-time subscriptions
 */

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getRoomLeaderboards } from '@/api/records'
import logger from '@/utils/logger'

export const useStudentDashboardRealtime = (userId, joinedRooms) => {
  const [activeCompetitions, setActiveCompetitions] = useState([])
  const [leaderboards, setLeaderboards] = useState([])
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Extract active competitions from joined rooms
  const updateCompetitions = useCallback((rooms) => {
    if (!rooms || rooms.length === 0) {
      setActiveCompetitions([])
      return
    }

    const competitions = []
    rooms.forEach(room => {
      if (room.competitions && Array.isArray(room.competitions)) {
        // Filter for NEW or ONGOING competitions
        const activeOnes = room.competitions.filter(
          comp => comp.status === 'NEW' || comp.status === 'ONGOING'
        )
        competitions.push(...activeOnes.map(comp => ({
          ...comp,
          roomTitle: room.title,
          roomCode: room.code,
          room_id: comp.room_id ?? room.id
        })))
      }
    })
    
    // Sort by status (ONGOING first, then NEW)
    competitions.sort((a, b) => {
      if (a.status === 'ONGOING' && b.status !== 'ONGOING') return -1
      if (a.status !== 'ONGOING' && b.status === 'ONGOING') return 1
      return 0
    })
    
    setActiveCompetitions(competitions)
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
    if (!userId || !joinedRooms) return

    // Initial data processing
    updateCompetitions(joinedRooms)
    updateLeaderboards(joinedRooms)

    let channel = null
    let isSubscribed = false

    const setupRealtimeSubscription = async () => {
      try {
        // Create unique channel for this student's dashboard
        channel = supabase.channel(`student-dashboard-${userId}`, {
          config: {
            broadcast: { self: false },
            presence: { key: '' },
          },
        })

        // Subscribe to competitions table changes
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'competitions'
          },
          (payload) => {
            if (isSubscribed) {
              logger.log('[Student Dashboard Realtime] Competition changed:', payload)
              setLastUpdate(Date.now()) // Trigger re-fetch from store
            }
          }
        )

        // Subscribe to participants table changes (when student joins/leaves rooms)
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'participants',
            filter: `user_id=eq.${userId}`
          },
          (payload) => {
            if (isSubscribed) {
              logger.log('[Student Dashboard Realtime] Own participation changed:', payload)
              setLastUpdate(Date.now())
            }
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
            if (isSubscribed) {
              logger.log('[Student Dashboard Realtime] Leaderboard changed:', payload)
              // Re-fetch leaderboards when XP changes
              updateLeaderboards(joinedRooms)
            }
          }
        )

        // Subscribe to rooms table changes (room updates)
        channel.on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rooms'
          },
          (payload) => {
            if (isSubscribed) {
              logger.log('[Student Dashboard Realtime] Room changed:', payload)
              setLastUpdate(Date.now())
            }
          }
        )

        channel.subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
            isSubscribed = true
            logger.log('[Student Dashboard Realtime] Subscribed successfully')
          } else if (status === 'CHANNEL_ERROR') {
            logger.warn('[Student Dashboard Realtime] Channel error:', err)
          } else if (status === 'TIMED_OUT') {
            logger.warn('[Student Dashboard Realtime] Connection timed out - dashboard will use manual updates')
          } else if (status === 'CLOSED') {
            isSubscribed = false
            logger.log('[Student Dashboard Realtime] Channel closed')
          }
        })
      } catch (error) {
        logger.error('[Student Dashboard Realtime] Setup error:', error)
      }
    }

    setupRealtimeSubscription()

    // Cleanup function
    return () => {
      isSubscribed = false
      if (channel) {
        logger.log('[Student Dashboard Realtime] Unsubscribing...')
        supabase.removeChannel(channel)
      }
    }
  }, [userId, joinedRooms, updateCompetitions, updateLeaderboards])

  // Update local state when joinedRooms changes
  useEffect(() => {
    if (joinedRooms) {
      updateCompetitions(joinedRooms)
      updateLeaderboards(joinedRooms)
    }
  }, [joinedRooms, updateCompetitions, updateLeaderboards])

  return {
    activeCompetitions,
    leaderboards,
    lastUpdate // Can be used to trigger store refresh if needed
  }
}
