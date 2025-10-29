# Database Setup for World Map

## 📋 Required Tables

### 1. **castles** table
```sql
CREATE TABLE castles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  difficulty VARCHAR(50),
  region VARCHAR(100),
  route VARCHAR(100) NOT NULL,
  image_number INTEGER NOT NULL,
  total_xp INTEGER DEFAULT 0,
  unlock_order INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **user_castle_progress** table
```sql
CREATE TABLE user_castle_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  castle_id UUID NOT NULL REFERENCES castles(id),
  unlocked BOOLEAN DEFAULT FALSE,
  completed BOOLEAN DEFAULT FALSE,
  completion_percentage INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, castle_id)
);
```

---

## 🌱 Sample Data

### Insert Sample Castles
```sql
INSERT INTO castles (name, description, difficulty, region, route, image_number, total_xp, unlock_order) VALUES
('Beginner''s Keep', 'Start your coding journey in this foundational castle. Learn the basics and build your confidence.', 'Easy', 'Northern Plains', 'castle1', 1, 500, 1),
('Apprentice Tower', 'Test your growing skills with intermediate challenges. Master the fundamentals before moving forward.', 'Medium', 'Eastern Forest', 'castle2', 2, 1000, 2),
('Scholar''s Sanctuary', 'Dive deeper into advanced concepts. Sharpen your problem-solving abilities.', 'Medium', 'Southern Valley', 'castle3', 3, 1500, 3),
('Master''s Citadel', 'Face complex challenges that will push your limits. Only the skilled may enter.', 'Hard', 'Western Mountains', 'castle4', 4, 2000, 4),
('Grand Fortress', 'The ultimate test of your abilities. Conquer this castle to prove your mastery.', 'Expert', 'Central Highlands', 'castle5', 5, 3000, 5);
```

### Unlock First Castle for a User
```sql
-- Replace 'YOUR_USER_ID' with actual user UUID from auth.users table
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, completion_percentage, xp_earned)
SELECT 
  'YOUR_USER_ID'::UUID, 
  id, 
  true,
  false,
  0,
  0
FROM castles 
WHERE unlock_order = 1;
```

### View Current Progress
```sql
-- Check all castles
SELECT id, name, image_number, unlock_order, route, difficulty, total_xp 
FROM castles 
ORDER BY unlock_order;

-- Check user progress
SELECT 
  c.name,
  c.unlock_order,
  ucp.unlocked,
  ucp.completed,
  ucp.completion_percentage,
  ucp.xp_earned
FROM user_castle_progress ucp
JOIN castles c ON ucp.castle_id = c.id
WHERE ucp.user_id = 'YOUR_USER_ID'
ORDER BY c.unlock_order;
```

---

## 🖼️ Image Requirements

Place these images in `frontend/public/images/castles/`:

### Castle Images
- `castle1.png` - Beginner's Keep
- `castle2.png` - Apprentice Tower
- `castle3.png` - Scholar's Sanctuary
- `castle4.png` - Master's Citadel
- `castle5.png` - Grand Fortress

### Background Images (Optional)
- `castle1-background.png`
- `castle2-background.png`
- `castle3-background.png`
- `castle4-background.png`
- `castle5-background.png`

**If background images are missing**, the app will use gradient fallbacks.

**If castle images are missing**, a fallback SVG with 🏰 emoji will be displayed.

---

## 🔄 Progress Update Examples

### Unlock Next Castle (When Previous is Completed)
```sql
-- Mark castle 1 as completed
UPDATE user_castle_progress
SET completed = true, completion_percentage = 100, updated_at = NOW()
WHERE user_id = 'YOUR_USER_ID' AND castle_id = (SELECT id FROM castles WHERE unlock_order = 1);

-- Unlock castle 2
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, completion_percentage)
SELECT 'YOUR_USER_ID'::UUID, id, true, false, 0
FROM castles WHERE unlock_order = 2
ON CONFLICT (user_id, castle_id) DO UPDATE SET unlocked = true;
```

### Update Progress Percentage
```sql
UPDATE user_castle_progress
SET 
  completion_percentage = 75,
  xp_earned = 750,
  updated_at = NOW()
WHERE user_id = 'YOUR_USER_ID' 
  AND castle_id = (SELECT id FROM castles WHERE unlock_order = 2);
```

---

## 🧪 Testing Queries

### Get All Castles with Progress for a User
```sql
SELECT 
  c.*,
  ucp.unlocked,
  ucp.completed,
  ucp.completion_percentage,
  ucp.xp_earned
FROM castles c
LEFT JOIN user_castle_progress ucp 
  ON c.id = ucp.castle_id 
  AND ucp.user_id = 'YOUR_USER_ID'
ORDER BY c.unlock_order;
```

### Check User Stats
```sql
SELECT 
  COUNT(*) as total_castles,
  COUNT(CASE WHEN ucp.unlocked THEN 1 END) as unlocked_castles,
  COUNT(CASE WHEN ucp.completed THEN 1 END) as completed_castles,
  COALESCE(SUM(ucp.xp_earned), 0) as total_xp
FROM castles c
LEFT JOIN user_castle_progress ucp 
  ON c.id = ucp.castle_id 
  AND ucp.user_id = 'YOUR_USER_ID';
```

---

## 🚨 Common Issues

### Issue: No castles appear on worldmap
**Solution:**
```sql
-- Check if castles exist
SELECT COUNT(*) FROM castles;

-- If empty, insert sample data above
```

### Issue: All castles are locked
**Solution:**
```sql
-- Unlock first castle
INSERT INTO user_castle_progress (user_id, castle_id, unlocked)
SELECT 'YOUR_USER_ID'::UUID, id, true
FROM castles WHERE unlock_order = 1
ON CONFLICT (user_id, castle_id) DO UPDATE SET unlocked = true;
```

### Issue: Castle images show as undefined
**Checklist:**
1. Check `image_number` field exists and has values 1-5
2. Restart backend server (for toJSON() fix)
3. Verify images exist in `frontend/public/images/castles/`
4. Check browser console for 404 errors

### Issue: Progress not updating
**Solution:**
```sql
-- Check if progress record exists
SELECT * FROM user_castle_progress 
WHERE user_id = 'YOUR_USER_ID' AND castle_id = 'CASTLE_UUID';

-- If not, create it
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completion_percentage)
VALUES ('YOUR_USER_ID', 'CASTLE_UUID', true, 0);
```

---

## 📊 Expected Data Flow

1. **User logs in as student** → `AppProvider.tsx` calls `fetchCastles(userId)`
2. **Frontend calls API** → `GET /api/castles?userId=xxx`
3. **Backend fetches data** → `CastleService.getAllCastlesWithUserProgress(userId)`
4. **Repository queries Supabase**:
   - Gets all castles from `castles` table
   - Gets user progress from `user_castle_progress` table
   - Joins data in JavaScript
5. **Backend returns JSON** → Array of castles with embedded `progress` objects
6. **Frontend stores in Zustand** → `castleStore.castles`
7. **Components consume data** → Worldmap page displays carousel

---

## ✅ Verification Checklist

Before testing worldmap:
- [ ] `castles` table has data with valid `image_number` (1-5)
- [ ] `user_castle_progress` has at least one unlocked castle for test user
- [ ] Backend server restarted after `Castle.toJSON()` fix
- [ ] Images exist in `frontend/public/images/castles/`
- [ ] User is logged in as student role
- [ ] Browser console shows no 404 errors

---

## 🎓 Best Practices

1. **Always unlock castle 1 first** for new users
2. **Unlock next castle** only when previous is completed
3. **Update `completion_percentage`** based on actual progress (chapters/quizzes/minigames)
4. **Use transactions** when updating multiple progress records
5. **Add indexes** for performance:
```sql
CREATE INDEX idx_user_castle_progress_user_id ON user_castle_progress(user_id);
CREATE INDEX idx_user_castle_progress_castle_id ON user_castle_progress(castle_id);
CREATE INDEX idx_castles_unlock_order ON castles(unlock_order);
```

---

## 🔐 Security Notes

- User can only access their own progress (verify `user_id` matches authenticated user)
- Backend should validate castle unlock order before allowing entry
- Don't allow skipping castles (enforce `unlock_order` sequence)
- Validate XP and completion percentage ranges (0-100%)

---

## 📝 Quick Reference

### Get User ID
```sql
SELECT id, email FROM auth.users WHERE email = 'student@example.com';
```

### Reset All Progress for a User
```sql
DELETE FROM user_castle_progress WHERE user_id = 'YOUR_USER_ID';
-- Then unlock first castle again
```

### Complete All Castles (Testing)
```sql
INSERT INTO user_castle_progress (user_id, castle_id, unlocked, completed, completion_percentage, xp_earned)
SELECT 'YOUR_USER_ID'::UUID, id, true, true, 100, total_xp
FROM castles
ON CONFLICT (user_id, castle_id) DO UPDATE SET unlocked = true, completed = true, completion_percentage = 100;
```

---

Need help? Check the logs in browser console and backend terminal for detailed debugging information.
