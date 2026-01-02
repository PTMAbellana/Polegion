# PROJECT FILES - WHAT TO KEEP & WHAT'S REMOVED

**Updated:** January 2, 2026

---

## ✅ ESSENTIAL FILES (KEEP THESE)

### Root Level
- `README.md` - Main project documentation
- `package.json` - Root project dependencies
- `.gitignore` - Git ignore rules
- **`ADAPTIVE_LEARNING_QA_TEST.md`** - **NEW: QA testing checklist**
- **`TEAM_GUIDE_FUTURE_PROMPTS.md`** - **NEW: Team guide & AI prompts**

### Frontend (`frontend/`)
- `package.json` - Frontend dependencies
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - Linting rules
- `postcss.config.mjs` - PostCSS configuration

#### Critical Frontend Files
```
frontend/
├── app/
│   ├── student/adaptive-learning/page.tsx  ← Adaptive learning page
│   └── globals.css                         ← Global styles
├── components/
│   ├── adaptive/
│   │   ├── AdaptiveLearning.tsx           ← Main adaptive component
│   │   ├── MasteryProgressBar.tsx         ← Progress visualization
│   │   ├── AdaptiveFeedbackBox.tsx        ← Feedback messages
│   │   └── LearningInteractionRenderer.tsx ← Question renderer
│   └── Loader.tsx                         ← Loading animation
├── api/
│   ├── axios.js                           ← API client
│   └── adaptive.js                        ← Adaptive API calls (if exists)
└── public/
    └── images/polegion-logo.gif           ← Loader logo
```

### Backend (`backend/`)
- `server.js` - Express server entry point
- `package.json` - Backend dependencies
- `Procfile` - Deployment configuration

#### Critical Backend Files
```
backend/
├── application/
│   └── services/
│       └── AdaptiveLearningService.js     ← MDP logic (10 actions)
├── infrastructure/
│   └── repository/
│       └── AdaptiveLearningRepo.js        ← Database operations
├── presentation/
│   ├── controllers/
│   │   └── AdaptiveLearningController.js (if exists)
│   └── routes/
│       └── adaptiveLearningRoutes.js (if exists)
└── config/
    ├── supabase.js                        ← Database config
    └── jwt.js                             ← Authentication
```

### Documentation (`docs/`)
```
docs/
├── ADAPTIVE_LEARNING_API.md              ← API documentation
├── PROJECT_DOCUMENTATION.md              ← Overall project docs
└── sql/
    ├── ADAPTIVE_LEARNING_SCHEMA.sql      ← Initial database schema
    ├── ENHANCE_ADAPTIVE_SCHEMA.sql       ← Enhanced columns
    └── DATABASE_COMPLETE_SCHEMA.sql      ← Full schema
```

---

## ❌ REMOVED FILES (No Longer Needed)

### Development Scripts (Removed)
- ~~`convert-castle-css.ps1`~~ - PowerShell script for CSS conversion
- ~~`optimize-assets.ps1`~~ - Asset optimization script
- ~~`phase1-remove-features.ps1`~~ - Feature removal script
- ~~`keep-alive-service.js`~~ - Server keep-alive utility

### Temporary Documentation (Removed)
- ~~`QUICK_START_RESEARCH.md`~~ - Initial research notes
- ~~`RESEARCH_IMPLEMENTATION_PLAN.md`~~ - Planning document
- ~~`STATUS_JAN2_2026.md`~~ - Status update (info now in TEAM_GUIDE)
- ~~`TEAM_FORK_SETUP.md`~~ - Fork setup (no longer relevant)
- ~~`DOCUMENTATION.txt`~~ - Old plain text docs

### Code Files (Previously Removed)
- ~~`EnhancedPedagogy.js`~~ - Redundant (integrated into AdaptiveLearningService.js)
- ~~`AdaptiveLearningDemo.tsx`~~ - Old demo component (replaced by AdaptiveLearning.tsx)

---

## 📦 FILE SIZE SUMMARY

**Total Project Size:** ~150MB (mostly node_modules)

**Core Code Size:** ~2MB
- Backend: ~500KB
- Frontend: ~1.5MB
- Documentation: ~200KB

**Dependencies:**
- Frontend node_modules: ~120MB
- Backend node_modules: ~30MB

---

## 🔍 HOW TO FIND SPECIFIC FUNCTIONALITY

### "Where is the MDP algorithm?"
→ `backend/application/services/AdaptiveLearningService.js` (lines 300-700)

### "Where are the UI components?"
→ `frontend/components/adaptive/` folder (4 files)

### "Where is the database schema?"
→ `docs/sql/ADAPTIVE_LEARNING_SCHEMA.sql` and `ENHANCE_ADAPTIVE_SCHEMA.sql`

### "Where are the API endpoints?"
→ `backend/server.js` or `backend/presentation/routes/`

### "Where is the visual diagram rendered?"
→ `frontend/components/adaptive/LearningInteractionRenderer.tsx` (lines 80-150)

### "Where is the progress bar?"
→ `frontend/components/adaptive/MasteryProgressBar.tsx`

### "Where is misconception detection?"
→ `backend/application/services/AdaptiveLearningService.js` method `detectMisconception()`

### "Where are the 10 teaching actions?"
→ `backend/application/services/AdaptiveLearningService.js` method `determineActionRuleBased()`

---

## 📋 WHAT EACH NEW DOCUMENT CONTAINS

### ADAPTIVE_LEARNING_QA_TEST.md
**Purpose:** Comprehensive testing checklist  
**Sections:**
1. Functionality tests (questions, variety, switching)
2. Adaptive behavior (MDP actions, tracking)
3. Database persistence (logging, Q-values)
4. User experience (flow, engagement)
5. User interface (design quality, responsiveness)
6. Performance & bugs (speed, edge cases)
7. Content accuracy (math, pedagogy)
8. Research validity (data collection)
9. System integration (backend, database)
10. Overall assessment (sign-off)

**Use when:** Testing before demo, finding bugs, validating research data

---

### TEAM_GUIDE_FUTURE_PROMPTS.md
**Purpose:** Onboarding guide + AI prompt templates  
**Sections:**
- Project overview
- File structure map
- How to run system
- Key components explained
- Common tasks with AI prompts ready to copy
- Research data collection
- Known issues & workarounds
- Future enhancements
- Team member quick start
- Troubleshooting guide
- Before deadline checklist

**Use when:** 
- New team member joins
- Need to make changes (use prompt templates)
- Preparing for demo/paper
- Troubleshooting issues

---

## 🎯 QUICK REFERENCE: WHAT TO DO NEXT

### For Testing (Before Demo)
1. Open `ADAPTIVE_LEARNING_QA_TEST.md`
2. Go through each section systematically
3. Check off items as you test
4. Document bugs in "Bugs Found" sections
5. Fix critical issues before demo

### For Development (Adding Features)
1. Open `TEAM_GUIDE_FUTURE_PROMPTS.md`
2. Find relevant section (e.g., "Add More Question Variations")
3. Copy the AI prompt
4. Modify for your specific need
5. Use with GitHub Copilot or ChatGPT

### For Research (Data Analysis)
1. Use SQL queries in `TEAM_GUIDE_FUTURE_PROMPTS.md` → "Research Data Collection"
2. Export CSVs from Supabase
3. Analyze in Python/R (pandas, matplotlib)
4. Create graphs for ICETT paper

### For Presentation (Demo Prep)
1. Review QA test to ensure system is stable
2. Practice demo flow: Select chapter → Answer questions → Show adaptation
3. Prepare to explain:
   - What is MDP/Q-Learning?
   - How does system adapt?
   - What data are you collecting?
   - Why is this better than fixed difficulty?

---

## 💡 BEST PRACTICES

### When Editing Code
1. **Always test locally first** - Run both backend and frontend
2. **Check browser console** - Look for errors before assuming it works
3. **Test all 3 representations** - Text, Visual, Real-world
4. **Test edge cases** - 0% mastery, 100% mastery, rapid clicks
5. **Commit often** - Small, logical commits with clear messages

### When Using AI Assistants
1. **Provide context** - Reference file names and line numbers
2. **Use prompts from guide** - They're pre-tested and specific
3. **Verify generated code** - AI can make mistakes, test thoroughly
4. **Ask for explanations** - Understand what code does, don't just copy

### When Collecting Data
1. **Clear database between tests** - Avoid contaminated data
2. **Use consistent test scenarios** - Same questions, same order
3. **Document test conditions** - Record who tested, when, what device
4. **Export backups** - Never rely on single database copy

---

## 🆘 IF SOMETHING BREAKS

### Check these in order:
1. **Are servers running?** (backend port 5000, frontend port 3000)
2. **Browser console errors?** (F12 → Console tab)
3. **Network tab shows API failures?** (F12 → Network tab)
4. **Database connection working?** (Check Supabase dashboard)
5. **Recent code changes?** (git diff to see what changed)

### Emergency Recovery:
```bash
# Stop all servers
Ctrl+C in both terminals

# Clear node_modules if needed
cd frontend && rm -rf node_modules && npm install
cd backend && rm -rf node_modules && npm install

# Restart fresh
cd backend && node server.js
cd frontend && npm run dev
```

---

**Remember:** This system is for research. Document everything, test thoroughly, and keep backups of your data!

**Deadline:** January 5, 2026 - You have 3 days! 🚀
