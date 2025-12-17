import { useEffect, useRef } from 'react';
import { updateParticipantHeartbeat } from '../api/participants';

const HEARTBEAT_INTERVAL = 15000; // 15 seconds

/**
 * Custom hook to manage participant activity heartbeat
 * Sends periodic updates to track active status in the database
 * 
 * @param {string} roomId - The room ID
 * @param {object} options - Configuration options
 * @param {boolean} options.isInCompetition - Whether participant is in active competition
 * @param {string} options.competitionId - Current competition ID (if in competition)
 * @param {boolean} options.enabled - Whether heartbeat is enabled (default: true)
 */
export const useParticipantHeartbeat = (roomId, options = {}) => {
  const {
    isInCompetition = false,
    competitionId = null,
    enabled = true
  } = options;

  const sessionIdRef = useRef(generateSessionId());
  const intervalRef = useRef(null);

  const sendHeartbeat = async () => {
    if (!roomId || !enabled) {
      console.log('[Heartbeat] Skipped:', { roomId, enabled });
      return;
    }

    console.log('[Heartbeat] Sending...', {
      roomId,
      isInCompetition,
      competitionId,
      sessionId: sessionIdRef.current
    });

    const data = {
      is_in_competition: isInCompetition,
      current_competition_id: competitionId,
      session_id: sessionIdRef.current
    };

    const result = await updateParticipantHeartbeat(roomId, data);
    console.log('[Heartbeat] Result:', result);
  };

  useEffect(() => {
    if (!enabled) {
      console.log('[Heartbeat] Hook disabled', { roomId, enabled });
      return;
    }

    console.log('[Heartbeat] Hook mounted', { 
      roomId, 
      enabled, 
      isInCompetition, 
      competitionId,
      interval: HEARTBEAT_INTERVAL 
    });

    // Send initial heartbeat
    sendHeartbeat();

    // Set up interval for periodic heartbeats
    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Cleanup on unmount - send goodbye heartbeat
    return () => {
      console.log('[Heartbeat] Hook unmounting - sending goodbye');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Send final heartbeat to mark user as inactive
      if (roomId) {
        updateParticipantHeartbeat(roomId, {
          is_in_competition: false,
          current_competition_id: null,
          session_id: sessionIdRef.current
        });
      }
    };
  }, [roomId, isInCompetition, competitionId, enabled]);

  return {
    sendHeartbeat,
    sessionId: sessionIdRef.current
  };
};

/**
 * Generate a unique session ID for this browser tab
 */
function generateSessionId() {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
