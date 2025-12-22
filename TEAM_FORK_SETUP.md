# Team Fork Setup: Adaptive Learning Research

**For:** Multiple researchers collaborating on MDP adaptive learning  
**Deadline:** January 5, 2025

---

## 🍴 Step 1: Create Team Fork (Team Lead Does This)

### On GitHub Web Interface

1. **Go to original repo:** https://github.com/PTMAbellana/Polegion

2. **Click "Fork"** (top right)

3. **Configure fork:**
   - **Owner:** Choose your account or organization
   - **Repository name:** `Polegion-Research-MDP` (or your choice)
   - **Description:** "Adaptive learning research using Markov Decision Processes"
   - ⚠️ **UNCHECK** "Copy the master branch only" (get all code)
   - **Private:** Recommended (can make public after research)

4. **Click "Create fork"**

5. **Get fork URL:** Copy the URL (e.g., `https://github.com/YourUsername/Polegion-Research-MDP`)

---

## 👥 Step 2: Add Collaborators (Team Lead)

### Option A: GitHub Collaborators (Simpler)

1. Go to your fork: `https://github.com/YourUsername/Polegion-Research-MDP`
2. Click **Settings** → **Collaborators** → **Add people**
3. Add each team member by username/email
4. They'll receive invitation emails

### Option B: GitHub Organization (Better for 5+ people)

1. Create organization (free): https://github.com/organizations/plan
2. Fork into organization instead of personal account
3. Add members to organization
4. Set team permissions

**Recommended Permissions:**
- Team Lead: Admin
- Researchers: Write (can push to branches)
- Observers: Read (view only)

---

## 💻 Step 3: Each Team Member Clones Fork

### For Each Researcher

```powershell
# Navigate to your workspace
cd "C:\Users\YourName\Desktop\Projects"

# Clone the FORKED repository (not original!)
git clone https://github.com/YourUsername/Polegion-Research-MDP.git
cd Polegion-Research-MDP

# Add original repo as "upstream" (to get updates)
git remote add upstream https://github.com/PTMAbellana/Polegion.git

# Verify remotes
git remote -v
# Should show:
#   origin    https://github.com/YourUsername/Polegion-Research-MDP.git (your fork)
#   upstream  https://github.com/PTMAbellana/Polegion.git (original)

# Create your personal branch
git checkout -b yourname-adaptive-learning

# Example: alice-adaptive-learning, bob-mdp-backend, etc.
```

---

## 🌿 Step 4: Branch Strategy for Team

### Main Branches in Fork

```
master                    # Stable production code (don't touch)
  ↓
research-main            # Main research branch (team integrates here)
  ↓
├── alice-frontend       # Alice works on adaptive UI
├── bob-backend          # Bob works on MDP backend
├── charlie-database     # Charlie works on schema
└── diana-testing        # Diana works on user testing
```

### Setup Research Main Branch (Team Lead)

```powershell
# In the forked repo
git checkout master
git checkout -b research-main

# Run cleanup script
.\phase1-remove-features.ps1

# Commit clean slate
git add .
git commit -m "Research setup: Remove competition features, prepare for adaptive learning"
git push origin research-main

# Set as default branch (optional)
# Go to GitHub → Settings → Branches → Default branch → Change to research-main
```

### Each Member Creates Personal Branch

```powershell
# Update to latest research-main
git checkout research-main
git pull origin research-main

# Create your personal branch from research-main
git checkout -b yourname-feature-name

# Example branches:
# alice-adaptive-ui
# bob-mdp-service
# charlie-database-schema
# diana-data-collection
```

---

## 🔄 Step 5: Daily Workflow for Each Member

### Morning Routine

```powershell
# Get latest from research-main
git checkout research-main
git pull origin research-main

# Update your branch
git checkout yourname-feature
git merge research-main

# Resolve conflicts if any
# Start working...
```

### During Work

```powershell
# Make changes
# Edit files...

# Save progress regularly
git add .
git commit -m "Descriptive message about what you did"

# Push to YOUR branch on fork
git push origin yourname-feature
```

### End of Day / When Feature Complete

```powershell
# Push final changes
git add .
git commit -m "Complete: [Feature name]"
git push origin yourname-feature

# Create Pull Request on GitHub:
# 1. Go to fork on GitHub
# 2. Click "Pull requests" → "New pull request"
# 3. Base: research-main ← Compare: yourname-feature
# 4. Title: "[Feature] Brief description"
# 5. Description: What you changed, why, how to test
# 6. Assign reviewers (other team members)
# 7. Click "Create pull request"

# Team lead reviews and merges
```

---

## 🎯 Step 6: Task Assignment (Team Lead)

### Suggested Division of Work

**Person 1: MDP Backend (3-4 days)**
- File: `backend/application/services/adaptiveLearningService.js`
- Tasks:
  - [ ] State assessment (mastery, streaks)
  - [ ] Action selection (difficulty adjustment logic)
  - [ ] Reward calculation
  - [ ] Question selection by difficulty
- Branch: `name-mdp-backend`

**Person 2: Database Schema (2 days)**
- Files: `docs/sql/*.sql`
- Tasks:
  - [ ] Create `student_difficulty_levels` table
  - [ ] Create `mdp_state_transitions` table
  - [ ] Add `difficulty_level` to questions
  - [ ] Seed sample questions with difficulty
- Branch: `name-database-schema`

**Person 3: Frontend Adaptive UI (3-4 days)**
- Files: `frontend/app/student/assessments/[id]/page.tsx`
- Tasks:
  - [ ] Mastery progress bar component
  - [ ] Difficulty level indicator
  - [ ] Adaptive feedback messages
  - [ ] Progress visualization charts
- Branch: `name-adaptive-ui`

**Person 4: Testing & Data Collection (2-3 days)**
- Files: `scripts/test-users.js`, research documentation
- Tasks:
  - [ ] Create test user accounts
  - [ ] Run user testing sessions
  - [ ] Collect performance data
  - [ ] Survey creation and analysis
- Branch: `name-testing-data`

**Everyone: Documentation (last 2 days)**
- Compile results
- Write research paper
- Create presentation

---

## 🚨 Step 7: Handling Conflicts

### When Two People Edit Same File

```powershell
# You try to merge research-main into your branch
git checkout yourname-feature
git merge research-main

# Git says: CONFLICT!

# Open conflicting files, look for:
<<<<<<< HEAD
Your changes
=======
Their changes
>>>>>>> research-main

# Manually fix to keep both changes or choose one

# After fixing all conflicts:
git add .
git commit -m "Resolve merge conflict with research-main"
git push origin yourname-feature
```

### Prevention Tips
- **Communicate!** Use Discord/Slack to say "I'm editing X file"
- Work on different files when possible
- Pull from research-main frequently (daily)
- Create small, focused pull requests

---

## 📋 Step 8: GitHub Project Board (Optional but Helpful)

### Setup Task Tracking

1. Go to fork → **Projects** → **New project**
2. Choose "Board" template
3. Create columns:
   - 📋 **To Do**
   - 🏗️ **In Progress**
   - 👀 **Review** (Pull request open)
   - ✅ **Done**

4. Add issues/tasks:
   - "Implement MDP backend service"
   - "Design adaptive UI components"
   - "Create database schema"
   - "Test with 10 users"

5. Assign to team members
6. Move cards as you progress

---

## 🔐 Step 9: Environment Variables (Important!)

### Shared Secrets Management

**Option A: 1Password/LastPass (Team Plan)**
- Store all API keys securely
- Share with team members

**Option B: Encrypted File in Repo**
```powershell
# Team lead creates .env.example
# File: .env.example
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=<get-from-team-lead>
JWT_SECRET=<get-from-team-lead>
FRONTEND_URL=http://localhost:3000

# Each member copies and fills in
cp .env.example .env

# NEVER commit .env file!
# Already in .gitignore
```

**Option C: Supabase Organization**
- Invite team to Supabase project
- Everyone has access to keys

---

## 📞 Step 10: Communication Protocol

### Daily Standup (5-10 min)

**When:** Every morning (Discord/Zoom)

**Each person shares:**
1. What I did yesterday
2. What I'm doing today
3. Any blockers?

### Code Review Guidelines

**When reviewing pull requests:**
- ✅ Does it work? (test locally)
- ✅ Is code readable?
- ✅ Any security issues?
- ✅ Follows project structure?
- ⚠️ Suggest improvements kindly
- ✅ Approve or request changes

**When receiving reviews:**
- Don't take it personally
- Discuss if you disagree
- Make requested changes
- Push updates to same branch (PR auto-updates)

---

## 🎯 Milestone Checklist

### Week 1 (Dec 22-28)
- [ ] Fork created, team added
- [ ] Everyone cloned and has personal branch
- [ ] Phase 1: Features removed (research-main)
- [ ] Phase 2: MDP backend implemented
- [ ] Phase 3: Database schema deployed

### Week 2 (Dec 29 - Jan 5)
- [ ] Phase 4: Frontend UI complete
- [ ] Phase 5: User testing (10+ participants)
- [ ] Phase 6: Data analysis
- [ ] Research paper drafted
- [ ] Final presentation ready

---

## 🚀 Quick Commands Cheat Sheet

```powershell
# Update your branch with latest research-main
git checkout research-main && git pull origin research-main
git checkout yourname-branch && git merge research-main

# Save your work
git add . && git commit -m "Your message" && git push origin yourname-branch

# Get updates from original Polegion (if needed)
git fetch upstream
git checkout research-main
git merge upstream/master

# Check which branch you're on
git branch

# Switch branches
git checkout branch-name

# See what changed
git status
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes (DANGEROUS!)
git reset --hard HEAD
```

---

## 🆘 Common Issues

### "Permission denied" when pushing
→ Make sure you're pushing to fork, not original
→ Check: `git remote -v` should show YOUR fork as origin

### "Merge conflict" when creating PR
→ Update your branch from research-main before creating PR
→ Resolve conflicts locally, then push

### "Can't see my teammate's changes"
→ They need to push to fork: `git push origin their-branch`
→ Create PR to merge into research-main
→ You pull after PR is merged

### "My changes disappeared!"
→ Check you're on correct branch: `git branch`
→ Check commits: `git log`
→ Your code is safe in your branch

---

## 📚 Resources for Team

**Git Collaboration:**
- https://git-scm.com/book/en/v2/GitHub-Contributing-to-a-Project
- https://www.atlassian.com/git/tutorials/comparing-workflows/forking-workflow

**Pull Request Best Practices:**
- https://github.com/blog/1943-how-to-write-the-perfect-pull-request

**MDP Learning Resources:**
- [See RESEARCH_IMPLEMENTATION_PLAN.md Section "MDP Implementation"]

---

## 🎓 First Team Meeting Agenda

### Before Meeting (Each Member)
- [ ] Read RESEARCH_IMPLEMENTATION_PLAN.md
- [ ] Read this document (TEAM_FORK_SETUP.md)
- [ ] Accept GitHub fork invitation
- [ ] Clone fork locally

### During Meeting (60 minutes)
1. **Intro (5 min)** - Research goals, timeline
2. **Task assignment (15 min)** - Who does what
3. **Git workflow demo (20 min)** - Branch, commit, PR
4. **Environment setup (10 min)** - Share API keys
5. **Daily standup schedule (5 min)** - When to meet
6. **Q&A (5 min)**

### After Meeting
- Everyone creates their personal branch
- Start working on assigned tasks
- First standup tomorrow morning

---

## ✅ Ready to Start

**Team Lead:** Run this NOW:
```powershell
# 1. Go to GitHub and fork PTMAbellana/Polegion
# 2. Add collaborators
# 3. Then run:

cd "C:\Users\User\Desktop\BSCS-3\Second Semester\SoftEng"
git clone https://github.com/YOUR_FORK_URL/Polegion-Research-MDP.git
cd Polegion-Research-MDP
git checkout -b research-main
.\phase1-remove-features.ps1
git add .
git commit -m "Research setup: Clean slate for adaptive learning"
git push origin research-main

# 4. Share fork URL with team
# 5. Schedule first meeting
```

**Team Members:** Wait for team lead to share fork URL, then clone and create your branch.

---

Good luck! 🚀 You got this! 🎓
