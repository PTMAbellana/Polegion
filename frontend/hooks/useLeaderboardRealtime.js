/**
 * Real-time hook for Leaderboard Pages
 * Subscribes to problem_leaderboards and room_leaderboards tables
 * Automatically updates XP and rankings when students complete problems
 * Eliminates need for manual refresh
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import logger from '@/utils/logger'

export const useLeaderboardRealtime = (roomId, fetchLeaderboards) => {
  const [lastUpdate, setLastUpdate] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!roomId || !fetchLeaderboards) {
      logger.log('[Leaderboard Realtime] Missing required params:', { roomId, hasFetch: !!fetchLeaderboards })
      return
    }

    logger.log(`[Leaderboard Realtime] Setting up subscriptions for room ${roomId}`)

    // Create unique channel for this leaderboard
    const channel = supabase.channel(`leaderboard-${roomId}`)

    // Subscribe to problem_leaderboards table (individual problem XP)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'problem_leaderboards',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Leaderboard Realtime] Problem leaderboard changed:', {
          event: payload.eventType,
          participant: payload.new?.participant_id || payload.old?.participant_id,
          xp: payload.new?.accumulated_xp
        })
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to room_leaderboards table (overall room XP)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_leaderboards',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Leaderboard Realtime] Room leaderboard changed:', {
          event: payload.eventType,
          participant: payload.new?.participant_id || payload.old?.participant_id,
          totalXp: payload.new?.total_xp
        })
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to participants table (for user info changes)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Leaderboard Realtime] Participant changed:', payload.eventType)
        setLastUpdate(Date.now())
      }
    )

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        logger.log(`[Leaderboard Realtime] ✅ Connected to leaderboard for room ${roomId}`)
        setIsConnected(true)
      } else if (status === 'CHANNEL_ERROR') {
        logger.error('[Leaderboard Realtime] ❌ Channel error')
        setIsConnected(false)
      } else if (status === 'TIMED_OUT') {
        logger.error('[Leaderboard Realtime] ⏱️ Connection timed out')
        setIsConnected(false)
      } else if (status === 'CLOSED') {
        logger.log('[Leaderboard Realtime] 🔌 Channel closed')
        setIsConnected(false)
      }
    })

    // Cleanup function
    return () => {
      logger.log(`[Leaderboard Realtime] 🔌 Unsubscribing from leaderboard ${roomId}`)
      supabase.removeChannel(channel)
      setIsConnected(false)
    }
  }, [roomId, fetchLeaderboards])

  // Auto-refresh when changes detected (with debounce)
  useEffect(() => {
    if (lastUpdate === 0) return // Skip initial mount

    const timeSinceUpdate = Date.now() - lastUpdate
    if (timeSinceUpdate < 1000) {
      logger.log('[Leaderboard Realtime] 🔄 Auto-refreshing leaderboard data...')
      fetchLeaderboards()
    }
  }, [lastUpdate, fetchLeaderboards])

  return {
    isConnected,
    lastUpdate
  }
}
