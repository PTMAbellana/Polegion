# How to Fork and Set Up Research Repository

## Option 1: Fork on GitHub (Recommended)

### Step 1: Fork via GitHub Web
1. Go to: https://github.com/PTMAbellana/Polegion
2. Click "Fork" button (top right)
3. Name it: `Polegion-Research-MDP`
4. Uncheck "Copy the master branch only" (get all branches)
5. Click "Create fork"

### Step 2: Clone Your Fork
```powershell
# Go to parent directory
cd "C:\Users\User\Desktop\BSCS-3\Second Semester\SoftEng"

# Clone your fork
git clone https://github.com/YOUR_USERNAME/Polegion-Research-MDP.git
cd Polegion-Research-MDP

# Keep connection to original (for pulling updates)
git remote add upstream https://github.com/PTMAbellana/Polegion.git
```

### Step 3: Start Clean for Research
```powershell
# Create research branch
git checkout -b adaptive-learning-mdp

# Run cleanup
.\phase1-remove-features.ps1

# Commit
git add .
git commit -m "Initial: Adaptive learning research setup"
git push origin adaptive-learning-mdp
```

---

## Option 2: Manual Repository Creation

### Step 1: Create New Repo on GitHub
1. Go to GitHub
2. Create new repository: `Polegion-Research-MDP`
3. Keep it private (or public for research)

### Step 2: Copy Current Code
```powershell
# Go to parent directory
cd "C:\Users\User\Desktop\BSCS-3\Second Semester\SoftEng"

# Copy entire project
Copy-Item -Path "Polegion" -Destination "Polegion-Research-MDP" -Recurse

# Go into new folder
cd Polegion-Research-MDP

# Remove old git history
Remove-Item -Path ".git" -Recurse -Force

# Initialize new repo
git init
git remote add origin https://github.com/YOUR_USERNAME/Polegion-Research-MDP.git

# Initial commit
git add .
git commit -m "Initial: Forked from Polegion for adaptive learning research"
git branch -M master
git push -u origin master
```

---

## Comparison Table

| Feature | Branch | Fork |
|---------|--------|------|
| Setup Time | ✅ 0 min (done) | ⚠️ 10 min |
| Safety | ⚠️ Can affect master | ✅ Completely isolated |
| Deployment | ✅ Same URLs | ⚠️ New URLs needed |
| Merging Back | ✅ Easy | ⚠️ Pull request |
| Management | ✅ One repo | ⚠️ Two repos |
| Good for 2 weeks | ✅ Yes | ✅ Yes |

---

## 🎯 My Recommendation

**Stick with the branch** because:
1. ✅ Already set up (don't waste time)
2. ✅ 2-week project (short-term)
3. ✅ You're solo developer (low risk)
4. ✅ Can still protect master by not pushing to it

**Safety Tips for Branch Approach:**
```powershell
# Always check your branch before committing
git branch  # Should show: * research-adaptive-learning-mdp

# If you accidentally switch to master, just switch back
git checkout research-adaptive-learning-mdp

# Never push to master
git push origin research-adaptive-learning-mdp  # ✅ Good
git push origin master  # ❌ Don't do this during research
```

---

## 🔒 Extra Safety: Protect Master Branch

If worried about accidentally changing master:

```powershell
# Option 1: Make master read-only locally
git config branch.master.pushRemote no_push

# Option 2: Create a backup tag
git checkout master
git tag backup-before-research
git push origin backup-before-research
git checkout research-adaptive-learning-mdp

# Now you can always restore: git checkout backup-before-research
```

---

## Decision Guide

**Choose Branch if:**
- "I just want to start coding NOW" ✓
- "2 weeks is too short to manage two repos" ✓
- "I'll be careful not to touch master" ✓

**Choose Fork if:**
- "I want 100% guarantee I won't break production"
- "I want separate deployment for research demo"
- "I might have other people help with research"

---

## What I Suggest You Do

**Option A (Recommended): Keep Branch, Add Safety**
```powershell
# Protect master locally
git checkout master
git tag production-backup
git push origin production-backup
git checkout research-adaptive-learning-mdp

# Now start Phase 1
.\phase1-remove-features.ps1
```

**Option B: Switch to Fork**
1. Fork on GitHub (5 minutes)
2. Clone your fork (2 minutes)
3. Copy research files we created (1 minute)
4. Run cleanup script (2 minutes)
5. **Total: 10 minutes extra**

Both are valid! What do you prefer?
