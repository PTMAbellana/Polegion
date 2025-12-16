# Competition Realtime Issues Fix

## Issues Identified

### 1. Timer Not Starting on Student Side
**Symptoms:** When teacher starts competition, timer shows correctly on teacher's end but doesn't start/update on student's end

**Root Cause:** 
- The backend broadcasts competition updates when starting
- Students are subscribed to the broadcast channel 
- However, there's a 2-second polling interval that might be delaying the update
- The timer hook relies on `competition.timer_started_at` being set properly

### 2. Only One Participant Showing
**Symptoms:** Multiple students join the competition, but only one shows in the participants list

**Root Causes:**
- **Presence tracking:** Students need to be on the competition page (`/student/competition/[id]`) for presence to track them
- **Automatic redirect:** When competition starts (status=ONGOING, gameplay_indicator=PLAY), students are automatically redirected to `/play` page
- **Participants vs Active Participants:**
  - `participants`: Students who joined the competition (from database/leaderboard)
  - `activeParticipants`: Users currently online (from Supabase Presence)
- If students are redirected away from the waiting room before all join, presence count will be low

## Debugging Steps

### 1. Check if Students Are Receiving Broadcasts

**On Student Browser Console:**
```javascript
// Check if presence channel is connected
console.log('Supabase channels:', supabase.getChannels());

// Check active participants
// Look for logs like:
// 👥 [Presence] Sync for competition-X: Y presence keys
// 👥 [Presence] Active users: [...]
```

### 2. Check Timer Data

**On Both Teacher and Student Console:**
```javascript
// Look for logs like:
// ⏱️ [Timer] Competition data received: {...}
// Check that timer_started_at and timer_duration are present
```

### 3. Check Participants Data

**On Teacher Console:**
```javascript
// Look for:
// 📊 [Polling] Participants with XP: [...]
// 🔍 [Teacher Filter] Active participants RAW: [...]
```

**On Student Console:**
```javascript
// Look for:
// 🔍 [Filter] Active participants before filter: [...]
// 🔍 [Filter] Participants list: [...]
```

## Solutions

### Solution 1: Verify Students Are Connected to Presence

**Students need to:**
1. Navigate to `/student/competition/[id]` page (waiting room)
2. Wait for presence to connect (look for "✅ [Presence] User tracked successfully" in console)
3. Teacher should see the student count increase in participants

**Check:**
- Is the roomId being passed correctly in the URL? (`?room=X&roomCode=Y`)
- Are students staying on the waiting room page long enough to connect?

### Solution 2: Increase Polling Frequency (Temporary Fix)

If broadcast isn't working immediately, the polling will eventually sync the data, but it takes 2 seconds per poll.

**Location:** `frontend/hooks/useCompetitionRealtime.js` line 167

**Current:**
```javascript
pollIntervalRef.current = setInterval(pollCompetition, 2000); // 2 seconds
```

**Faster polling (for testing):**
```javascript
pollIntervalRef.current = setInterval(pollCompetition, 500); // 500ms
```

**⚠️ Warning:** Faster polling increases server load. Use only for debugging.

### Solution 3: Force Immediate Competition Fetch on Start

The broadcast should trigger immediately, but we can add a manual refetch on the student side.

### Solution 4: Check Supabase Realtime Settings

1. Go to Supabase Dashboard
2. Navigate to Project Settings > API
3. Ensure Realtime is enabled
4. Check that the competition channel isn't blocked

## Testing Checklist

### Presence Testing
- [ ] Open teacher competition page
- [ ] Open 2-3 student browser windows
- [ ] Navigate students to `/student/competition/[id]`
- [ ] Wait 3-5 seconds on waiting room
- [ ] Check teacher sees all students in "Active Participants"
- [ ] Check console logs for presence sync messages

### Timer Testing
- [ ] Students on waiting room with status = "NEW"
- [ ] Teacher starts competition
- [ ] Check teacher console: "📡 Competition X start broadcasted successfully!"
- [ ] Check student console: "🔥 [Polling] Competition updated:" or "🔥 [Broadcast] Update received"
- [ ] Verify timer appears and counts down on student side
- [ ] Verify students auto-redirect to play page

### Participants Count Testing
- [ ] Multiple students join competition
- [ ] Check teacher sees correct count in sidebar
- [ ] Start competition
- [ ] Check students redirect to play page
- [ ] Teacher should still see participant count (even if they're on play page now)

## Expected Behavior

### Normal Flow:
1. **Students join:**
   - Navigate to competition waiting room
   - Presence tracks them (appears in "Active Participants")
   - They appear in "Participants" list

2. **Teacher starts:**
   - Clicks "Start Competition"
   - Backend broadcasts update to all connected clients
   - Teacher sees timer start immediately
   - Students see timer start (via broadcast or 2s polling)
   - Students auto-redirect to play page

3. **During competition:**
   - Timer syncs via polling every 2s
   - Participants list shows all students who joined
   - Active participants shows who is currently online

## Common Issues

### Issue: "Students don't auto-redirect when competition starts"
**Check:**
- `liveCompetition.status === "ONGOING"`
- `liveCompetition.gameplay_indicator === "PLAY"`
- Console logs show the redirect trigger

**Fix:** Check the useEffect in `/student/competition/[id]/page.tsx` around line 95

### Issue: "Timer shows 00:00 on student side"
**Check:**
- Is `timer_started_at` being received? (Check console logs)
- Is `timer_duration` set correctly?
- Is the time zone causing issues? (Should use UTC)

**Debug:**
```javascript
// In browser console:
console.log('Timer data:', {
  timer_started_at: competition.timer_started_at,
  timer_duration: competition.timer_duration,
  status: competition.status,
  gameplay_indicator: competition.gameplay_indicator
});
```

### Issue: "Participants count is 0 or wrong"
**Check:**
- Are students actually on the competition page?
- Did they navigate away too quickly?
- Check leaderboard API response (provides participant data)

**Debug:**
```javascript
// Check what polling returns:
// Look for: 📊 [Polling] Participants with XP: [...]
```

## Files Involved

- `frontend/hooks/useCompetitionRealtime.js` - Presence and polling logic
- `frontend/hooks/useCompetitionTimer.js` - Timer calculation and display
- `frontend/app/student/competition/[competitionId]/page.tsx` - Student waiting room
- `frontend/app/teacher/competition/[competitionId]/page.tsx` - Teacher management
- `backend/application/services/CompetitionService.js` - Competition state and broadcasts

## Quick Debug Commands

### Check Presence State
```javascript
// In browser console on any competition page:
const channels = supabase.getChannels();
const compChannel = channels.find(ch => ch.topic.includes('competition'));
if (compChannel) {
  console.log('Presence state:', compChannel.presenceState());
}
```

### Force Refresh Competition Data
```javascript
// Reload the page or clear cache:
window.location.reload();
```

### Check localStorage for User Profile
```javascript
// Verify user profile is stored (needed for presence):
const authStorage = localStorage.getItem('auth-storage');
console.log('Auth storage:', JSON.parse(authStorage));
```
