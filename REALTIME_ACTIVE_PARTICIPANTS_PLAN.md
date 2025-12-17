# REALTIME ACTIVE PARTICIPANTS - IMPLEMENTATION PLAN

## Problem Analysis

### Current Issues:
1. **Supabase Presence is unreliable**:
   - Ephemeral state (disappears on refresh)
   - Requires manual tracking on each page
   - No deduplication (multiple tabs = multiple presence entries)
   - Doesn't persist across page navigations

2. **Manual refresh required**:
   - Active count doesn't update until refresh
   - Presence sync event fires inconsistently
   - Race conditions between subscription and tracking

3. **Host/Owner included in counts**:
   - Filter logic inconsistent across components
   - No server-side filtering

## Recommended Solution: Database-Based Active Tracking

### Why This Approach is Better:

1. **Persistent State**: Active status stored in database
2. **Realtime Updates**: Subscribe to database changes (more reliable than Presence)
3. **Deduplication**: One record per user, regardless of tabs
4. **Server-Side Logic**: Filtering happens in database/backend
5. **Scalable**: Works with any number of users
6. **Queryable**: Can get historical active data

### Architecture Overview:

```
┌─────────────────┐
│  Frontend Page  │
│   (Student/     │
│    Teacher)     │
└────────┬────────┘
         │
         │ 1. On page load/mount
         │ 2. Heartbeat every 15s
         │
         v
┌─────────────────────────┐
│  Backend API Endpoint   │
│  PUT /participants/     │
│     heartbeat           │
└────────┬────────────────┘
         │
         │ Updates last_active
         │ Sets is_in_competition
         │
         v
┌─────────────────────────┐
│   room_participants     │
│   ┌─────────────────┐   │
│   │ last_active     │   │
│   │ is_in_competition │ │
│   │ current_comp_id │   │
│   └─────────────────┘   │
└────────┬────────────────┘
         │
         │ Supabase Realtime
         │ postgres_changes
         │
         v
┌─────────────────────────┐
│  Frontend Subscription  │
│  (useRoomRealtime or    │
│   useCompetitionRealtime)│
└─────────────────────────┘
         │
         │ Updates UI instantly
         v
┌─────────────────────────┐
│  Active Participant     │
│  List / Count           │
└─────────────────────────┘
```

## Implementation Steps

### Step 1: Database Schema (SQL)
✅ Created: `docs/sql/ADD_ACTIVE_TRACKING.sql`

- Add `last_active`, `is_in_competition`, `current_competition_id`, `session_id` columns
- Create views for active participants
- Add indexes for performance
- Create helper functions for staleness check

### Step 2: Backend API Endpoints

#### New Endpoints Needed:

```javascript
// PUT /api/participants/:participantId/heartbeat
// Updates last_active timestamp + competition status
{
  is_in_competition: boolean,
  competition_id: number | null,
  session_id: string
}

// GET /api/participants/active/:roomId
// Returns list of currently active participants
// Filters out:
// - Room creator/owner
// - Stale sessions (>30s old)
// - Teachers (if role='teacher')

// GET /api/competitions/:competitionId/active
// Returns active participants for specific competition
```

### Step 3: Backend Repository Layer

```javascript
// ParticipantRepo.js additions:

async updateHeartbeat(participantId, data) {
  return await this.supabase
    .from('room_participants')
    .update({
      last_active: new Date().toISOString(),
      is_in_competition: data.is_in_competition,
      current_competition_id: data.competition_id,
      session_id: data.session_id
    })
    .eq('id', participantId)
}

async getActiveParticipants(roomId) {
  return await this.supabase
    .from('active_room_participants')
    .select('*')
    .eq('room_id', roomId)
    .neq('role', 'teacher') // Exclude teachers
}

async getActiveCompetitionParticipants(competitionId) {
  return await this.supabase
    .from('active_competition_participants')
    .select('*')
    .eq('current_competition_id', competitionId)
    .neq('role', 'teacher')
}
```

### Step 4: Backend Service Layer

```javascript
// ParticipantService.js additions:

async updateParticipantHeartbeat(userId, roomId, data) {
  // Get participant record
  const participant = await this.participantRepo
    .getParticipantByUserId(userId, roomId);
  
  // Update heartbeat
  return await this.participantRepo
    .updateHeartbeat(participant.id, {
      ...data,
      session_id: data.session_id || generateSessionId()
    });
}

async getActiveParticipants(roomId, excludeCreatorId = null) {
  const active = await this.participantRepo
    .getActiveParticipants(roomId);
  
  // Filter out room creator
  if (excludeCreatorId) {
    return active.filter(p => p.user_id !== excludeCreatorId);
  }
  
  return active;
}
```

### Step 5: Frontend Hook - Heartbeat Manager

Create `hooks/useParticipantHeartbeat.js`:

```javascript
import { useEffect, useRef } from 'react';
import { updateParticipantHeartbeat } from '@/api/participants';

export const useParticipantHeartbeat = (
  roomId,
  competitionId = null,
  isActive = true
) => {
  const intervalRef = useRef(null);
  const sessionId = useRef(generateSessionId());
  
  useEffect(() => {
    if (!roomId || !isActive) return;
    
    // Immediate heartbeat on mount
    sendHeartbeat();
    
    // Set up interval for periodic heartbeats
    intervalRef.current = setInterval(sendHeartbeat, 15000); // 15s
    
    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
      // Send final heartbeat marking as inactive
      updateParticipantHeartbeat(roomId, {
        is_in_competition: false,
        competition_id: null,
        session_id: sessionId.current
      });
    };
  }, [roomId, competitionId, isActive]);
  
  const sendHeartbeat = async () => {
    try {
      await updateParticipantHeartbeat(roomId, {
        is_in_competition: !!competitionId,
        competition_id: competitionId,
        session_id: sessionId.current
      });
    } catch (error) {
      console.warn('[Heartbeat] Failed:', error);
    }
  };
};

function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
```

### Step 6: Frontend Hook - Realtime Subscriptions

Update `hooks/useCompetitionRealtime.js`:

```javascript
// REMOVE: Supabase Presence tracking
// REPLACE WITH: Database subscription

useEffect(() => {
  const channel = supabase
    .channel(`room-${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'room_participants',
        filter: `room_id=eq.${roomId}`
      },
      (payload) => {
        console.log('[Realtime] Participant updated:', payload);
        // Refetch active participants
        refreshActiveParticipants();
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}, [roomId]);

const refreshActiveParticipants = async () => {
  const active = await getActiveParticipants(roomId);
  setActiveParticipants(active);
};
```

### Step 7: Frontend Component Integration

#### Student Competition Page:
```javascript
// app/student/competition/[competitionId]/page.tsx

import { useParticipantHeartbeat } from '@/hooks/useParticipantHeartbeat';

function CompetitionPage({ competitionId, roomId }) {
  // Send heartbeat to mark as active in this competition
  useParticipantHeartbeat(roomId, competitionId, true);
  
  // Subscribe to realtime updates
  const { activeParticipants } = useCompetitionRealtime(competitionId, roomId);
  
  return (
    <div>
      <h2>Active: {activeParticipants.length}</h2>
      {/* ... */}
    </div>
  );
}
```

#### Teacher Competition Page:
```javascript
// app/teacher/competition/[competitionId]/page.tsx

function TeacherCompetitionPage({ competitionId, roomId }) {
  // Teacher also sends heartbeat but not marked as participant
  useParticipantHeartbeat(roomId, competitionId, true);
  
  const { activeParticipants, participants } = useCompetitionRealtime(
    competitionId,
    roomId,
    'creator'
  );
  
  // Active count already filtered (no teachers, no host)
  const activeStudentCount = activeParticipants.length;
  
  return (
    <div>
      <h2>Active Students: {activeStudentCount}</h2>
      {/* ... */}
    </div>
  );
}
```

## Benefits of This Approach

### 1. **No Refresh Required**
- Database updates trigger realtime events
- Frontend subscribes to `postgres_changes` on `room_participants`
- Updates propagate instantly to all connected clients

### 2. **Accurate Active Counts**
- Server-side filtering (no teachers, no host)
- Deduplication by user_id (one entry per user)
- Stale detection (>30s = inactive)

### 3. **Scalable**
- No need for each client to broadcast presence
- Database handles all the heavy lifting
- Views pre-filter data for performance

### 4. **Persistent**
- `last_active` stored in database
- Can query historical activity
- Survives page refreshes

### 5. **Multi-Tab/Device Support**
- `session_id` tracks individual sessions
- Server deduplicates by `user_id`
- Last heartbeat wins

## Migration from Current System

### Phase 1: Add Database Columns
- Run `ADD_ACTIVE_TRACKING.sql`
- Test views work correctly

### Phase 2: Add Backend Endpoints
- Implement heartbeat endpoint
- Add active participants getter
- Test with Postman/Thunder Client

### Phase 3: Update Frontend Hooks
- Add `useParticipantHeartbeat` hook
- Refactor `useCompetitionRealtime` to use database subscription
- Remove Supabase Presence code

### Phase 4: Update Components
- Add heartbeat hook to all competition pages
- Update active count displays
- Test realtime updates work without refresh

### Phase 5: Cleanup
- Remove old Presence-based code
- Update documentation
- Add monitoring/logging

## Testing Checklist

- [ ] Student joins competition → active count increases immediately
- [ ] Student closes tab → active count decreases after 30s
- [ ] Teacher not included in active count
- [ ] Room creator not included in active count
- [ ] Multiple tabs from same user = counted as 1
- [ ] Page refresh doesn't reset active status
- [ ] Realtime updates work across all clients
- [ ] Works with 10+ concurrent users
- [ ] Stale session cleanup works

## Performance Considerations

1. **Heartbeat Frequency**: 15 seconds (balance between realtime and server load)
2. **Staleness Threshold**: 30 seconds (2x heartbeat interval)
3. **Index Usage**: Queries use `idx_room_participants_last_active`
4. **View Caching**: Postgres materializes views for fast reads
5. **Cleanup Job**: Run `cleanup_stale_sessions()` every 5 minutes

## Fallback Strategy

If database approach has issues:
1. Keep heartbeat mechanism
2. Fall back to polling active participants API every 5s
3. Disable realtime subscription temporarily

## Next Steps

1. **Run the SQL migration**: Execute `ADD_ACTIVE_TRACKING.sql`
2. **Implement backend endpoints**: Start with heartbeat endpoint
3. **Test backend**: Verify active filtering works
4. **Implement frontend hooks**: Create heartbeat hook
5. **Update pages**: Add hooks to competition pages
6. **Test realtime**: Verify updates without refresh
7. **Deploy**: Roll out to production

Would you like me to proceed with implementing these changes?
