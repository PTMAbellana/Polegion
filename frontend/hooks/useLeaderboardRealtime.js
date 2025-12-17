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
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  const retryDelay = 5000 // 5 seconds

  useEffect(() => {
    if (!roomId || !fetchLeaderboards) {
      logger.log('[Leaderboard Realtime] Missing required params:', { roomId, hasFetch: !!fetchLeaderboards })
      return
    }

    logger.log(`[Leaderboard Realtime] Setting up subscriptions for room ${roomId} (attempt ${retryCount + 1})`)

    // Create unique channel for this leaderboard with retry timestamp
    const channelName = `leaderboard-${roomId}-${Date.now()}`
    const channel = supabase.channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: 'leaderboard' }
      }
    })

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

    // Retry logic - must be defined before subscribe callback
    const handleRetry = () => {
      if (retryCount < maxRetries) {
        logger.log(`[Leaderboard Realtime] 🔄 Retrying connection in ${retryDelay/1000}s...`)
        setTimeout(() => {
          setRetryCount(prev => prev + 1)
        }, retryDelay)
      } else {
        logger.error(`[Leaderboard Realtime] ❌ Max retries (${maxRetries}) reached. Using polling fallback.`)
        // Fallback to polling every 30 seconds
        const pollInterval = setInterval(() => {
          logger.log('[Leaderboard Realtime] 📡 Polling leaderboard data (fallback mode)')
          fetchLeaderboards()
        }, 30000)
        
        // Store interval for cleanup
        return pollInterval
      }
    }

    // Track polling interval for cleanup
    let pollInterval = null

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        logger.log(`[Leaderboard Realtime] ✅ Connected to leaderboard for room ${roomId}`)
        setIsConnected(true)
        setRetryCount(0) // Reset retry count on success
        // Clear any polling fallback
        if (pollInterval) {
          clearInterval(pollInterval)
          pollInterval = null
        }
      } else if (status === 'CHANNEL_ERROR') {
        logger.error('[Leaderboard Realtime] ❌ Channel error')
        setIsConnected(false)
        handleRetry()
      } else if (status === 'TIMED_OUT') {
        logger.error(`[Leaderboard Realtime] ⏱️ Connection timed out (attempt ${retryCount + 1}/${maxRetries})`)
        setIsConnected(false)
        const interval = handleRetry()
        if (interval) pollInterval = interval
      } else if (status === 'CLOSED') {
        logger.log('[Leaderboard Realtime] 🔌 Channel closed')
        setIsConnected(false)
      }
    })

    // Cleanup function
    return () => {
      logger.log(`[Leaderboard Realtime] 🔌 Unsubscribing from leaderboard ${roomId}`)
      supabase.removeChannel(channel)
      if (pollInterval) clearInterval(pollInterval)
      setIsConnected(false)
    }
  }, [roomId, fetchLeaderboards, retryCount])

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
