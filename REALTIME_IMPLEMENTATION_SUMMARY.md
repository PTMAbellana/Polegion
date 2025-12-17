# Real-time Active Tracking Implementation Summary

## Overview
Implemented a comprehensive database-backed active participant tracking system with real-time updates for both teacher and student interfaces.

## Key Features Implemented

### 1. Database Schema
- **Table**: `room_participants` with columns:
  - `last_active` (timestamp) - Updated every 15 seconds
  - `is_in_competition` (boolean) - Tracks if user is actively in competition
  - `current_competition_id` (bigint) - Links to active competition
  - `session_id` (text) - Unique session identifier per browser tab
- **Views**: `active_room_participants`, `active_competition_participants`
- **Functions**: `is_participant_active()` (30-second staleness threshold)

### 2. Backend API (3 Endpoints)
- `PUT /participants/heartbeat/:roomId` - Receive heartbeat updates
- `GET /participants/active/room/:roomId` - Get active participants in room
- `GET /participants/active/competition/:competitionId` - Get active competition participants

### 3. Frontend Implementation

#### Heartbeat System
- **Frequency**: Every 15 seconds
- **Initial**: Fires immediately on page load
- **Cleanup**: Sends "goodbye" heartbeat on unmount
- **Data Sent**: `is_in_competition`, `current_competition_id`, `session_id`

#### Real-time Updates
- **Method**: Polling every 5 seconds (backup for Supabase Realtime)
- **Pages Updated**:
  - Student: `/student/joined-rooms/[roomCode]`
  - Teacher: `/teacher/virtual-rooms/[roomCode]`
  - Competition pages (both teacher and student)

#### Active Indicators
- **Student Pages**: Shows "X active / Y total" participants
- **Teacher Pages**: Shows "X active / Y total" + green dot on active participant avatars
- **Competition**: Automatically filters out teachers/hosts from active counts

### 4. UI Improvements

#### Competition Timer (Teacher)
- Compact 5-second countdown with circular progress ring
- Same height as "Start Competition" button (44px)
- No emojis, professional styling
- Cancel option available

#### Public/Private Problem Indicators
- Removed emojis from visibility labels
- Clean text: "Public" or "Private"

#### Active Status Indicators
- Green pulsing dot on participant avatars (teacher view)
- Real-time updates without page refresh

## Technical Details

### Polling Strategy
Used as primary update mechanism due to Supabase Realtime event reliability issues:
- **Competition Status**: 2-second polling (existing)
- **Active Participants**: 5-second polling (new)
- **Heartbeat Send**: 15-second interval (new)

### Staleness Detection
- Participants inactive if `last_active` > 30 seconds ago
- Automatic cleanup via database function
- Session deduplication by `session_id`

### Student Competition Start
- Polling ensures students see competition start within 2 seconds
- No manual refresh required
- Status updates: NEW → ONGOING → DONE

## Files Modified

### Backend (4 files)
1. `backend/infrastructure/repository/ParticipantRepo.js`
2. `backend/application/services/ParticipantService.js`
3. `backend/presentation/controllers/ParticipantController.js`
4. `backend/presentation/routes/ParticipantRoutes.js`

### Frontend (13 files)
1. `frontend/api/participants.js`
2. `frontend/hooks/useParticipantHeartbeat.js` (new)
3. `frontend/hooks/useCompetitionRealtime.js`
4. `frontend/hooks/useRoomRealtime.js`
5. `frontend/app/student/joined-rooms/[roomCode]/page.tsx`
6. `frontend/app/student/competition/[competitionId]/page.tsx`
7. `frontend/app/student/competition/[competitionId]/play/page.tsx`
8. `frontend/app/teacher/virtual-rooms/[roomCode]/page.tsx`
9. `frontend/components/student/StudentParticipantsList.tsx`
10. `frontend/components/teacher/ParticipantsSidebar.tsx`
11. `frontend/components/competition/teacher/CompetitionControls.tsx`
12. `frontend/components/competition/teacher/ProblemsManagement.tsx`
13. `frontend/types/props/room.ts`

### Styles (2 files)
1. `frontend/styles/competition-teacher.module.css`
2. `frontend/styles/room-details.module.css`

### SQL (2 files)
1. `docs/sql/ADD_ACTIVE_TRACKING.sql`
2. `docs/sql/ENABLE_REALTIME_PUBLICATION.sql`

## Performance Considerations
- Heartbeat: Minimal overhead (1 request per 15s per user)
- Polling: 5s interval prevents excessive API calls
- Database indexes on `last_active` and `current_competition_id` for fast queries
- Session deduplication prevents counting same user multiple times

## Known Limitations
- Supabase Realtime events not firing reliably (polling used as workaround)
- 30-second staleness threshold means up to 30s delay before marking inactive
- Polling introduces 2-5 second lag for updates (acceptable tradeoff)

## Future Improvements
- Investigate Supabase Realtime configuration for event-driven updates
- Add WebSocket fallback for instant updates
- Implement exponential backoff for heartbeat failures
- Add connection status indicator for students
