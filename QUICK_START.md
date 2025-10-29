# 🚀 Quick Start - World Map Testing

## Step-by-Step Testing Guide

### 1️⃣ Restart Backend Server (CRITICAL)
The `Castle.toJSON()` fix requires restarting the server:

```powershell
# Navigate to backend directory
cd backend

# Stop current server (Ctrl+C if running)

# Start server
npm run dev
# OR
node server.js
```

**Expected output:**
```
Server running on port 5000
Supabase connected
```

---

### 2️⃣ Verify Database Setup

Open your Supabase SQL Editor and run:

```sql
-- Check if castles exist
SELECT id, name, image_number, unlock_order, route FROM castles ORDER BY unlock_order;
```

**If empty**, run the insert from `DATABASE_CASTLE_SETUP.md`:
```sql
INSERT INTO castles (name, description, difficulty, region, route, image_number, total_xp, unlock_order) VALUES
('Beginner''s Keep', 'Start your coding journey...', 'Easy', 'Northern Plains', 'castle1', 1, 500, 1),
('Apprentice Tower', 'Test your growing skills...', 'Medium', 'Eastern Forest', 'castle2', 2, 1000, 2),
('Scholar''s Sanctuary', 'Dive deeper...', 'Medium', 'Southern Valley', 'castle3', 3, 1500, 3),
('Master''s Citadel', 'Face complex challenges...', 'Hard', 'Western Mountains', 'castle4', 4, 2000, 4),
('Grand Fortress', 'The ultimate test...', 'Expert', 'Central Highlands', 'castle5', 5, 3000, 5);
```

---

### 3️⃣ Get Your User ID

```sql
-- Find your user ID
SELECT id, email, raw_user_meta_data->>'role' as role 
FROM auth.users 
WHERE email = 'YOUR_EMAIL@example.com';
```

Copy the `id` (UUID format like `550e8400-e29b-41d4-a716-446655440000`)

---

### 4️⃣ Unlock First Castle

```sql
-- Replace YOUR_USER_ID with the UUID from step 3
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, completion_percentage, xp_earned)
SELECT 
  'YOUR_USER_ID'::UUID, 
  id, 
  true,
  false,
  0,
  0
FROM castles 
WHERE unlock_order = 1
ON CONFLICT (user_id, castle_id) DO UPDATE SET unlocked = true;
```

**Verify:**
```sql
SELECT 
  c.name,
  c.unlock_order,
  ucp.unlocked,
  ucp.completed
FROM user_castle_progress ucp
JOIN castles c ON ucp.castle_id = c.id
WHERE ucp.user_id = 'YOUR_USER_ID'
ORDER BY c.unlock_order;
```

Expected result:
```
name             | unlock_order | unlocked | completed
Beginner's Keep  | 1           | true     | false
```

---

### 5️⃣ Add Castle Images (Optional but Recommended)

Create folder if it doesn't exist:
```powershell
New-Item -ItemType Directory -Force -Path "frontend\public\images\castles"
```

Add images:
- `castle1.png` through `castle5.png`
- `castle1-background.png` through `castle5-background.png` (optional)

**Don't have images?** That's okay! The app will show:
- Fallback SVG with 🏰 emoji for castle images
- Gradient backgrounds if background images are missing

---

### 6️⃣ Test in Browser

1. **Login as student**
   - Email: `YOUR_EMAIL@example.com`
   - Password: `your_password`

2. **Navigate to World Map**
   - Should auto-redirect or go to: `http://localhost:3000/student/worldmap`

3. **Open Browser Console** (F12)
   - Look for these logs:
   ```
   [CastleStore] Initializing...
   [CastleStore] Fetching castles for user: YOUR_USER_ID
   [API] getAllCastles called with userId: YOUR_USER_ID
   ```

4. **Check Network Tab** (F12 → Network)
   - Look for: `GET /api/castles?userId=YOUR_USER_ID`
   - Status should be: `200 OK`
   - Response should have array of castles

---

### 7️⃣ Expected Behavior

#### ✅ **Successful Load**
- See castle carousel with 5 castles
- First castle (Beginner's Keep) should be unlocked (full color)
- Other castles should be locked (grayscale with 🔒)
- Stats panel shows: "Completed: 0/5 | Unlocked: 1 | Total XP: 0"
- Click current castle opens modal

#### ❌ **Common Issues**

**Issue: "No castles found"**
- **Cause:** Database empty
- **Fix:** Run INSERT query from step 2

**Issue: "All castles locked"**
- **Cause:** No progress record
- **Fix:** Run INSERT query from step 4

**Issue: "castleundefined.png 404"**
- **Cause:** Server not restarted
- **Fix:** Restart backend (step 1)

**Issue: "400 Bad Request"**
- **Cause:** Old code cached or server not restarted
- **Fix:** 
  1. Restart backend
  2. Hard refresh browser (Ctrl+Shift+R)
  3. Clear browser cache

---

### 8️⃣ Test Features

#### **Carousel Navigation**
- [ ] Click left/right arrows
- [ ] Click dot indicators
- [ ] Press Arrow Left/Right keys
- [ ] Swipe on mobile

#### **Castle States**
- [ ] Locked castle shows grayscale + lock
- [ ] Unlocked castle shows full color
- [ ] Hover effect: castle lifts up
- [ ] Click unlocked castle opens modal

#### **Modal**
- [ ] Shows castle name and description
- [ ] Shows progress bar (0% initially)
- [ ] "Enter Castle" button visible
- [ ] Close with X button or click outside
- [ ] Locked castle shows "🔒 Complete previous castles"

#### **Stats Panel**
- [ ] Shows correct completed count
- [ ] Shows correct unlocked count
- [ ] Shows total XP earned

---

### 9️⃣ Optional - Test Progress

Mark castle 1 as completed and unlock castle 2:

```sql
-- Complete castle 1
UPDATE user_castle_progress
SET completed = true, completion_percentage = 100, xp_earned = 500
WHERE user_id = 'YOUR_USER_ID' 
  AND castle_id = (SELECT id FROM castles WHERE unlock_order = 1);

-- Unlock castle 2
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, completion_percentage)
SELECT 'YOUR_USER_ID'::UUID, id, true, false, 0
FROM castles WHERE unlock_order = 2
ON CONFLICT (user_id, castle_id) DO UPDATE SET unlocked = true;
```

**Refresh page** and verify:
- [ ] Castle 1 shows 👑 crown
- [ ] Castle 2 is now unlocked (full color)
- [ ] Stats: "Completed: 1/5 | Unlocked: 2 | Total XP: 500"

---

### 🔟 Troubleshooting Checklist

If something doesn't work:

1. **Check Backend Logs**
   - Look for errors in terminal
   - Should see: `[CastleController] ===== GET ALL CASTLES =====`

2. **Check Browser Console**
   - Look for errors (red messages)
   - Should see: `[CastleStore] Castles fetched successfully`

3. **Check Network Response**
   - F12 → Network → Click `/api/castles` request
   - Preview tab should show array of castles
   - Each castle should have `image_number`, `total_xp`, `unlock_order`

4. **Verify Backend Changes**
   - Open `backend/domain/models/Castle.js`
   - Find `toJSON()` method
   - Verify it returns `image_number` (not `imageNumber`)

5. **Clear Everything**
   ```powershell
   # Stop backend
   # Delete node_modules in backend
   cd backend
   Remove-Item -Recurse -Force node_modules
   npm install
   npm run dev
   
   # In another terminal, restart frontend
   cd frontend
   npm run dev
   ```

---

## 🎉 Success Criteria

You'll know everything works when you see:

✅ Carousel with 5 castles displays
✅ First castle unlocked, others locked
✅ Images load without 404 errors (or fallback SVG appears)
✅ Background changes per castle (or gradient fallback)
✅ Stats panel shows correct data
✅ Modal opens when clicking current unlocked castle
✅ No errors in browser console
✅ No errors in backend terminal

---

## 📚 Documentation Files

- `WORLDMAP_REFACTOR_SUMMARY.md` - Complete overview of all changes
- `DATABASE_CASTLE_SETUP.md` - Database structure and queries
- `QUICK_START.md` - This file

---

## 🆘 Need Help?

Check logs in this order:
1. Browser Console (F12)
2. Network Tab (F12 → Network)
3. Backend Terminal
4. Supabase Logs (if using Supabase hosted)

Common log patterns:

**✅ Good:**
```
[CastleStore] Castles fetched successfully: 5
[API] getAllCastles response: [Array(5)]
```

**❌ Bad:**
```
[CastleStore] Error fetching castles: 400 Bad Request
[API] Error: Request failed with status code 400
```

If you see bad patterns, restart backend server (step 1).

---

**Good luck! Your worldmap should now be fully functional! 🏰✨**
