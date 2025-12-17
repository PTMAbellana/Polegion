/**
 * Real-time hook for Room Detail Pages (Teacher & Student)
 * Subscribes to participants, problems, and competitions for a specific room
 * Automatically triggers store refresh when changes occur
 * Eliminates need for manual "Refresh" buttons
 */

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import logger from '@/utils/logger'

export const useRoomRealtime = (roomId, roomCode, fetchRoomDetails) => {
  const [lastUpdate, setLastUpdate] = useState(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!roomId || !roomCode || !fetchRoomDetails) {
      logger.log('[Room Realtime] Missing required params:', { roomId, roomCode, hasFetch: !!fetchRoomDetails })
      return
    }

    logger.log(`[Room Realtime] Setting up subscriptions for room ${roomCode} (ID: ${roomId})`)

    // Create unique channel for this room
    const channel = supabase.channel(`room-${roomCode}`)

    // Subscribe to participants table (students joining/leaving)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'participants',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Room Realtime] Participant changed:', payload.eventType, payload.new || payload.old)
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to room_participants table (active tracking / heartbeats)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Room Realtime] Active status changed:', payload.eventType, payload.new || payload.old)
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to problems table (problems added/updated/deleted)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'problems',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Room Realtime] Problem changed:', payload.eventType, payload.new?.title || payload.old?.title)
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to competitions table (competitions created/updated)
    channel.on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'competitions',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Room Realtime] Competition changed:', payload.eventType, payload.new?.title || payload.old?.title)
        setLastUpdate(Date.now())
      }
    )

    // Subscribe to rooms table (room info updated)
    channel.on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`
      },
      (payload) => {
        logger.log('[Room Realtime] Room updated:', payload.new?.title)
        setLastUpdate(Date.now())
      }
    )

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        logger.log(`[Room Realtime] ✅ Connected to room ${roomCode}`)
        setIsConnected(true)
      } else if (status === 'CHANNEL_ERROR') {
        logger.warn('[Room Realtime] ⚠️ Channel connection issue - retrying...')
        setIsConnected(false)
      } else if (status === 'TIMED_OUT') {
        logger.warn('[Room Realtime] ⏱️ Connection took longer than expected')
        setIsConnected(false)
      } else if (status === 'CLOSED') {
        logger.log('[Room Realtime] 🔌 Channel closed')
        setIsConnected(false)
      }
    })

    // Cleanup function
    return () => {
      logger.log(`[Room Realtime] 🔌 Unsubscribing from room ${roomCode}`)
      supabase.removeChannel(channel)
      setIsConnected(false)
    }
  }, [roomId, roomCode, fetchRoomDetails])

  // Auto-refresh when changes detected (with debounce)
  useEffect(() => {
    if (lastUpdate === 0) return // Skip initial mount

    const timeSinceUpdate = Date.now() - lastUpdate
    if (timeSinceUpdate < 1000) {
      logger.log('[Room Realtime] 🔄 Auto-refreshing room data...')
      fetchRoomDetails(roomCode, true) // Force refresh
    }
  }, [lastUpdate, roomCode, fetchRoomDetails])

  return {
    isConnected,
    lastUpdate
  }
}
