# Quick Start: Adaptive Learning Research Project

## 🎯 Goal
Implement MDP-based adaptive learning system that adjusts difficulty in real-time based on student performance.

**Deadline:** January 5, 2025 (14 days)

---

## ✅ What We Just Did

1. ✅ Created research branch: `research-adaptive-learning-mdp`
2. ✅ Created implementation plan: `RESEARCH_IMPLEMENTATION_PLAN.md`
3. ✅ Created cleanup script: `phase1-remove-features.ps1`
4. ✅ Created team fork guide: `TEAM_FORK_SETUP.md` (for collaboration)

⚠️ **IMPORTANT:** Multiple people working? Use **FORK** workflow!  
👉 See: [TEAM_FORK_SETUP.md](TEAM_FORK_SETUP.md)

---

## 🚀 Start NOW (30 minutes)

### Step 1: Run Feature Removal Script
```powershell
# Execute cleanup script
.\phase1-remove-features.ps1

# Type "yes" when prompted
```

### Step 2: Update Route Index (Manual)
**File:** `backend/presentation/routes/index.js`

Remove these imports:
```javascript
// DELETE THESE LINES
const competitionRoutes = require('./competitionRoutes');
const roomRoutes = require('./roomRoutes');

// DELETE THESE LINES
router.use('/competitions', competitionRoutes);
router.use('/rooms', roomRoutes);
```

### Step 3: Commit Changes
```powershell
git add .
git commit -m "Phase 1: Remove competition, room, teacher features for adaptive learning research"
git push origin research-adaptive-learning-mdp
```

---

## 📅 2-Week Timeline (3-Person Team)

**Team Members:** 3 people  
**Your Absence:** Dec 25-29 (5 days)

| Days | Phase | Who | What to Do |
|------|-------|-----|------------|
| **Day 1-2** (Dec 22-23) | ✅ Feature Removal | All | Run cleanup script, test basic functionality |
| **Day 3-4** (Dec 24-25) | Database Setup | **Member 2** | Create tables, add difficulty to questions |
| **Day 5-6** (Dec 26-27) | Backend Service | **Member 3** | Build AdaptiveLearningService.js |
| **Day 7** (Dec 28) | Backend API | **Member 2+3** | Create controllers/routes, test with Postman |
| **Day 8** (Dec 29) | Integration Test | **You return** | Verify backend works end-to-end |
| **Day 9-10** (Dec 30-31) | Simple Frontend | **All** | Basic /adaptive page, question display |
| **Day 11** (Jan 1) | Connect UI | **All** | Wire frontend to backend API |
| **Day 12** (Jan 2) | User Testing | **All** | Test with 5+ users, collect data |
| **Day 13-14** (Jan 3-4) | Documentation | **All** | Write research paper, analyze results |
| **Jan 5** | **Deadline** | **All** | Submit research |

---

## 🧠 MDP Simplified Explanation

**What is MDP?**  
A decision-making framework where the system observes student performance and decides whether to make problems easier, harder, or advance to next chapter.

**How it works:**
```
Student takes assessment
  ↓
System observes: Score, streak, mastery level
  ↓
MDP decides: "Too easy? Too hard? Just right?"
  ↓
System adjusts: Difficulty level (1-5)
  ↓
Student gets next question at adjusted difficulty
  ↓
Repeat...
```

**Key Components:**
1. **State:** Current mastery level (0-100%)
2. **Action:** Increase/decrease difficulty, advance chapter
3. **Reward:** +10 if student improves, -5 if frustrated
4. **Policy:** Rules for when to adjust difficulty

---

## 🎯 What Makes This Different from Current System

### Current (Production)
- ❌ Fixed difficulty for all students
- ❌ Manual chapter progression
- ❌ One assessment per chapter
- ❌ Competitive (leaderboards, rooms)

### Research (New)
- ✅ **Adaptive difficulty per student**
- ✅ **Automatic progression based on mastery**
- ✅ **Continuous assessment (not one-time)**
- ✅ **Individual learning (no competition)**

---

## 🔬 Research Questions You'll Answer

1. **Does MDP improve learning speed?**
   - Measure: Time to reach 80% mastery

2. **Does adaptive difficulty reduce frustration?**
   - Measure: Quit rate, consecutive wrong answers

3. **What's the optimal difficulty progression?**
   - Analyze: State transition patterns

4. **Do students prefer adaptive vs fixed?**
   - Survey: User satisfaction scores

---

## 📊 Data You'll Collect

### Automatic (From Database)
- Every question answered (correct/wrong)
- Time spent per question
- Difficulty adjustments made
- Mastery level over time
- State transitions (before/after each action)

### Manual (Survey)
- "Was the difficulty appropriate?" (1-5 scale)
- "Did you feel frustrated?" (Yes/No)
- "Would you prefer fixed or adaptive difficulty?"

---

## 🛠️ Tech Stack for Research

**Keep (No Changes):**
- Next.js 15 (Frontend)
- Express.js (Backend)
- Supabase (Database)
- Vercel/Railway (Deployment)

**Add (New):**
- MDP Algorithm (Q-learning simplified)
- State tracking tables
- Adaptive question selection
- Real-time difficulty adjustment

**Remove (Cleanup):**
- Competition system
- Virtual rooms
- Teacher dashboard
- Leaderboards

---

## ✅ MVP Features (Must Have by Jan 5)

### Backend (Days 3-7 - Automated)
- [x] Remove competition/room features
- [ ] Create `AdaptiveLearningService.js` with core logic
- [ ] Add MDP state tracking repository
- [ ] Create adaptive API endpoints
- [ ] Implement difficulty adjustment algorithm

### Database (Days 3-7 - Automated)
- [ ] Add `student_difficulty_levels` table
- [ ] Add `mdp_state_transitions` table (for research data)
- [ ] Add `difficulty_level` column to questions
- [ ] Seed questions with difficulty ratings (1-5)

### Frontend (Days 9-10 - Simple UI Only)
- [x] Remove teacher/competition pages
- [ ] Create `/student/adaptive` route (separate from worldmap)
- [ ] Basic question display page
- [ ] Answer submission form
- [ ] Simple text feedback (correct/wrong)
- [ ] Difficulty indicator (1-5 stars as text)
- [ ] Mastery percentage display

### Testing (Days 11-12)
- [ ] Backend API testing with Postman
- [ ] Verify difficulty adjustments work
- [ ] Test with 5+ students
- [ ] Collect mdp_state_transitions data
- [ ] Basic performance comparison

---

## 🚨 What to Do if Behind Schedule

### Priority 1 (Must Complete)
- MDP backend logic (even if simplified)
- Difficulty adjustment working
- Data collection

### Priority 2 (Important)
- Frontend adaptive UI
- Mastery visualization
- User testing

### Priority 3 (Nice to Have)
- Advanced Q-learning
- Beautiful visualizations
- Survey collection

**If running out of time:** Focus on Priority 1 + minimal UI. You can analyze data manually for research paper.

---

## 📞 Getting Help

### Stuck on MDP algorithm?
- See: `RESEARCH_IMPLEMENTATION_PLAN.md` Section "MDP Implementation"
- Simplified version: Rule-based policy (if/else logic)
- Advanced version: Q-learning (if time permits)

### Database issues?
- Backup before schema changes: `pg_dump` or Supabase backup
- Test on development DB first

### Frontend not updating?
- Check API connection
- Use browser console for errors
- Test backend with Postman first

---

## 🎓 Research Paper Outline (Jan 3-4)

### 1. Abstract (1 paragraph)
"We implemented an MDP-based adaptive learning system for geometry education..."

### 2. Introduction (1 page)
- Problem: Fixed difficulty doesn't work for all students
- Solution: MDP adjusts difficulty in real-time
- Research questions

### 3. Related Work (1 page)
- Adaptive learning systems
- MDP in education
- Intelligent tutoring systems

### 4. Methodology (2 pages)
- MDP components (State, Action, Reward, Policy)
- System architecture
- Implementation details

### 5. Results (2 pages)
- Performance comparison (adaptive vs fixed)
- Learning curves
- User satisfaction

### 6. Discussion (1 page)
- What worked
- What didn't
- Limitations

### 7. Conclusion (1 paragraph)
"Our MDP system improved learning efficiency by X%..."

---

## 🎯 Success Metrics

**Minimum Success:**
- System adjusts difficulty automatically ✓
- 10+ students tested ✓
- Data collected for analysis ✓

**Good Success:**
- Adaptive group performs 20% better ✓
- 80%+ user satisfaction ✓
- Clear improvement over fixed ✓

**Excellent Success:**
- Adaptive group performs 50% better ✓
- Publishable research results ✓
- Working prototype for demo ✓

---

## 📋 Daily Checklist Template

Copy this for each day:

```
Date: ___________

Today's Goal:
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

Blockers:
- 

Completed:
- 

Tomorrow:
- 
```

---

## � Team Work Distribution (While You're Gone: Dec 25-29)

### ⚠️ IMPORTANT: Setup Team Collaboration First
Before you leave, ensure:
```powershell
# Push current work
git push origin research-adaptive-learning-mdp

# Share branch with team
# Each member should clone and checkout the research branch
```

### 📋 Member 2: Database Person (Dec 24-27)

**Tasks:**
1. Create SQL migration file with 2 tables
2. Add difficulty levels to existing questions
3. Test database setup

**Files to create:**
- `docs/sql/ADAPTIVE_LEARNING_SCHEMA.sql`

**Detailed instructions:** See [RESEARCH_IMPLEMENTATION_PLAN.md](RESEARCH_IMPLEMENTATION_PLAN.md) Phase 3

```powershell
# Member 2 workflow
git checkout research-adaptive-learning-mdp
git pull origin research-adaptive-learning-mdp
# Create SQL files
git add docs/sql/ADAPTIVE_LEARNING_SCHEMA.sql
git commit -m "Add adaptive learning database schema"
git push origin research-adaptive-learning-mdp
```

---

### 📋 Member 3: Backend Developer (Dec 26-28)

**Tasks:**
1. Create `AdaptiveLearningService.js`
2. Create `AdaptiveLearningController.js`
3. Create API routes
4. Test with Postman

**Files to create:**
- `backend/application/services/AdaptiveLearningService.js`
- `backend/presentation/controllers/AdaptiveLearningController.js`
- `backend/presentation/routes/AdaptiveLearningRoutes.js`
- `backend/infrastructure/repository/AdaptiveLearningRepo.js`

**Detailed instructions:** See [RESEARCH_IMPLEMENTATION_PLAN.md](RESEARCH_IMPLEMENTATION_PLAN.md) Phase 2

```powershell
# Member 3 workflow
git checkout research-adaptive-learning-mdp
git pull origin research-adaptive-learning-mdp
# Build backend files
git add backend/
git commit -m "Implement adaptive learning backend service"
git push origin research-adaptive-learning-mdp
```

---

### 📋 You: Integration & Frontend (Dec 29-31)

**When you return Dec 29:**
1. Pull latest changes
2. Test backend with Postman
3. Build simple frontend UI
4. Connect UI to API

```powershell
# Your workflow when back
git checkout research-adaptive-learning-mdp
git pull origin research-adaptive-learning-mdp
# Test everything works
# Build frontend
git commit -m "Add simple adaptive learning UI"
git push origin research-adaptive-learning-mdp
```

---

## 🔄 Daily Team Sync (Async Communication)

**Use GitHub Issues for coordination:**

Create these 3 issues now:
1. **Issue #1:** "Database Schema for Adaptive Learning" (Assign Member 2)
2. **Issue #2:** "Backend Service Implementation" (Assign Member 3)
3. **Issue #3:** "Frontend UI & Integration" (Assign yourself)

**Communication:**
- Comment progress in issues
- Push code daily with clear commit messages
- Tag teammates: `@username need help with X`

## 🚀 When You Return (Dec 29)

### Step 1: Pull Latest Changes
```powershell
cd "c:\Users\User\Desktop\BSCS-3\Second Semester\SoftEng\Polegion"
git checkout research-adaptive-learning-mdp
git pull origin research-adaptive-learning-mdp
```
```powershell
cd backend
node server.js
# Should see: "Server running on port 5000"
```

### Step 2: Verify Backend (Built by Team)
```powershell
cd backend
node server.js
# Should see: "Server running on port 5000"
```

### Step 4: Check Database Tables (Created by Member 2)
```sql
SELECT * FROM student_difficulty_levels LIMIT 5;
SELECT * FROM mdp_state_transitions LIMIT 10;
SELECT difficulty_level, COUNT(*) FROM questions GROUP BY difficulty_level;
```

### Step 5: Build Simple Frontend (Your Main Job)
- Create `/student/adaptive` page
- Display questions one at a time
- Show "Correct ✓" or "Wrong ✗"
- Display difficulty as text: "Level 3/5"
- Show mastery: "Mastery: 75%"

---

## 📝 Before You Leave (Dec 24)

**Critical Setup:**
1. ✅ Push current work to GitHub
2. ✅ Update this guide with teammate assignments
3. ✅ Create 3 GitHub Issues (Database, Backend, Frontend)
4. ✅ Share login credentials for:
   - Supabase dashboard
   - GitHub repository
   - Any API keys needed

**Share with team:**
- Link to [RESEARCH_IMPLEMENTATION_PLAN.md](RESEARCH_IMPLEMENTATION_PLAN.md)
- Link to [TEAM_FORK_SETUP.md](TEAM_FORK_SETUP.md)
- This guide (QUICK_START_RESEARCH.md)

---

## ✅ What Should Be Done When You Return

### Member 2 (Database):
- ✅ SQL schema file created
- ✅ Tables exist in Supabase
- ✅ Questions have difficulty ratings
- ✅ Indexes created

### Member 3 (Backend):
- ✅ AdaptiveLearningService.js exists
- ✅ API routes registered in server.js
- ✅ Can test with Postman
- ✅ Basic difficulty logic works

### You (Integration):
- Build simple UI
- Connect to backend
- End-to-end testing
- User testing coordination

---

**Check `RESEARCH_IMPLEMENTATION_PLAN.md` for detailed code specifications.**

**Team collaboration guide:** [TEAM_FORK_SETUP.md](TEAM_FORK_SETUP.md)
### What You'll Do:
- Day 8: Test backend
- Day 9-10: Build simple UI
- Day 11: Integration testing
- Day 12-14: User testing + documentation

**Check `RESEARCH_IMPLEMENTATION_PLAN.md` for detailed specifications.**

**You got this! 🎓**
