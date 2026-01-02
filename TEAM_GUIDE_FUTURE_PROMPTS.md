# ADAPTIVE LEARNING SYSTEM - TEAM GUIDE & FUTURE PROMPTS

**Last Updated:** January 2, 2026  
**Deadline:** January 5, 2026  
**Project:** MDP-based Adaptive Learning for Elementary Geometry Education

---

## 🎯 PROJECT OVERVIEW

This system uses **Q-Learning (Markov Decision Process)** to adaptively adjust:
- **Difficulty level** (1-5 scale)
- **Teaching representation** (Text, Visual diagrams, Real-world contexts)
- **Pedagogical strategies** (Scaffolding, challenge, review)

**Goal:** Improve elementary students' geometry learning by adapting to their needs in real-time.

---

## 📁 PROJECT STRUCTURE

### Frontend (Next.js/React)
```
frontend/
├── app/student/adaptive-learning/page.tsx    ← Main page route
├── components/adaptive/
│   ├── AdaptiveLearning.tsx                  ← Main component
│   ├── MasteryProgressBar.tsx                ← Progress visualization
│   ├── AdaptiveFeedbackBox.tsx               ← System feedback to student
│   └── LearningInteractionRenderer.tsx       ← Question renderer (3 modes)
```

### Backend (Node.js/Express)
```
backend/
├── server.js                                  ← Entry point
├── application/services/
│   ├── AdaptiveLearningService.js            ← MDP logic (10 teaching actions)
├── infrastructure/repository/
│   └── AdaptiveLearningRepo.js               ← Database operations
```

### Database (Supabase PostgreSQL)
```
Key Tables:
- student_difficulty_levels      ← Student state (mastery, difficulty, representation)
- mdp_state_transitions          ← Action log (for research analysis)
- q_table                        ← Q-Learning values
```

### Documentation
```
docs/
├── ADAPTIVE_LEARNING_API.md              ← API endpoints
├── sql/
│   ├── ADAPTIVE_LEARNING_SCHEMA.sql      ← Initial schema
│   └── ENHANCE_ADAPTIVE_SCHEMA.sql       ← Enhanced columns
```

---

## 🚀 HOW TO RUN THE SYSTEM

### 1. Start Backend
```powershell
cd backend
node server.js
# Server runs on http://localhost:5000
```

### 2. Start Frontend
```powershell
cd frontend
npm run dev
# Server runs on http://localhost:3000
```

### 3. Access Adaptive Learning
Navigate to: `http://localhost:3000/student/adaptive-learning`

---

## 🧠 KEY SYSTEM COMPONENTS

### MDP Teaching Actions (10 Total)
1. `decrease_difficulty` - Make problems easier
2. `increase_difficulty` - Make problems harder
3. `maintain_difficulty` - Keep current level
4. `repeat_different_representation` - Same difficulty, different format
5. `switch_to_visual` - Show diagram/picture
6. `switch_to_real_world` - Show real-life context
7. `give_hint_retry` - Provide helpful hint
8. `advance_topic` - Move to next concept
9. `review_prerequisite` - Go back to basics
10. `repeat_current` - Stay at same level

### Representation Types
- **TEXT**: Word problems (symbolic/algebraic)
- **VISUAL**: SVG diagrams with labeled dimensions
- **REAL_WORLD**: Contextual scenarios (e.g., garden fence)

### Reward Function (Educational Psychology)
```
+10: Advance to next topic (mastery achieved)
+7:  Flow state (optimal challenge)
+3:  Strategy improvement (adapting well)
-3:  Boredom (too easy)
-5:  Frustration (too hard)
-7:  Poor adaptation (wrong action)
-6:  Misconception repeated (not learning from errors)
```

### Misconception Detection
Analyzes last 10 attempts to detect:
- Repeated failures with same representation type
- Difficulty level mismatches
- Prerequisite knowledge gaps

---

## 🔧 COMMON TASKS & PROMPTS

### Add More Question Variations
**Prompt for AI:**
```
Add 5 new perimeter problems to LearningInteractionRenderer.tsx with different dimensions:
- Easy: length=4, width=3
- Medium: length=10, width=7
- Hard: length=15, width=12

Maintain all three representation types (text, visual, real_world).
Ensure SVG diagrams scale dimensions proportionally.
```

### Adjust Difficulty Thresholds
**File:** `backend/application/services/AdaptiveLearningService.js`
**Lines:** ~450-550 (determineActionRuleBased method)

**Prompt:**
```
Change the threshold for increasing difficulty from 7 consecutive correct to 5.
Change the threshold for switching to visual from 3 wrong to 2 wrong.
Update in AdaptiveLearningService.js determineActionRuleBased() method.
```

### Change UI Colors/Styling
**Files:** 
- `frontend/components/adaptive/*.tsx`

**Prompt:**
```
Change the primary color from blue (#3B82F6) to purple (#9333EA) across all adaptive learning components:
- MasteryProgressBar.tsx
- AdaptiveFeedbackBox.tsx  
- LearningInteractionRenderer.tsx
- AdaptiveLearning.tsx

Maintain accessibility (WCAG AA contrast).
```

### Add New Teaching Strategy
**File:** `backend/application/services/AdaptiveLearningService.js`

**Prompt:**
```
Add a new MDP action called "provide_worked_example" that:
1. Triggers when student gets 4 wrong answers in a row
2. Sets pedagogical_strategy to "modeling"
3. Gives reward of +5 when used appropriately
4. Updates teaching_strategy in database

Add corresponding feedback message in AdaptiveFeedbackBox.tsx:
- Icon: 📝
- Title: "Let me show you"
- Message: "Watch how I solve this step-by-step."
```

### Export Research Data
**Prompt:**
```
Write a SQL query to export all adaptive learning data for research analysis:
- Student mastery progression over time
- Frequency of each MDP action
- Representation type distribution
- Misconception detection occurrences
- Reward distribution

Export as CSV for analysis in Python/R.
```

**Query Location:** Create in `docs/sql/EXPORT_RESEARCH_DATA.sql`

### Fix Bug in Representation Switching
**Prompt:**
```
Debug: Visual representation not switching after 3 wrong answers.

Check:
1. AdaptiveLearningService.js - Is switch_to_visual action being triggered?
2. AdaptiveLearningRepo.js - Is representation_type being saved correctly?
3. AdaptiveLearning.tsx - Is currentRepresentation state updating?

Add console.logs to trace representation flow.
```

### Add Celebration Animation
**Prompt:**
```
Add a confetti animation when student reaches 85% mastery in AdaptiveLearning.tsx.

Use CSS keyframes (no external libraries).
Animation should:
- Trigger once when masteryLevel crosses 85%
- Show for 3 seconds
- Not block interaction
```

### Optimize Database Queries
**File:** `backend/infrastructure/repository/AdaptiveLearningRepo.js`

**Prompt:**
```
Optimize getRecentAttempts() query:
- Add index on (user_id, chapter_id, timestamp)
- Use EXPLAIN ANALYZE to check query plan
- Ensure query runs in < 50ms

Create migration in docs/sql/OPTIMIZE_ADAPTIVE_QUERIES.sql
```

---

## 📊 RESEARCH DATA COLLECTION

### Required Metrics for ICETT Paper
1. **Mastery progression curves** - How fast do students improve?
2. **Action frequency distribution** - Which MDP actions most common?
3. **Representation effectiveness** - Do visual aids help more than text?
4. **Misconception patterns** - What errors do students repeat?
5. **Flow state duration** - How long in optimal challenge zone?
6. **Difficulty adaptation accuracy** - Does system choose right difficulty?

### Data Export Commands
```sql
-- Export all state transitions
COPY (SELECT * FROM mdp_state_transitions ORDER BY timestamp) 
TO '/path/to/state_transitions.csv' CSV HEADER;

-- Export student progress
COPY (SELECT * FROM student_difficulty_levels) 
TO '/path/to/student_progress.csv' CSV HEADER;

-- Export Q-table
COPY (SELECT * FROM q_table ORDER BY state_id, action) 
TO '/path/to/q_values.csv' CSV HEADER;
```

---

## 🐛 KNOWN ISSUES & WORKAROUNDS

### Issue 1: Frontend crashes on rapid clicks
**Workaround:** Disable submit button while processing (already implemented via `disabled={submitting}`)

### Issue 2: Browser cache shows old component
**Fix:** Hard refresh with Ctrl+Shift+R

### Issue 3: Database RLS blocks backend writes
**Fix:** Ensure backend uses `service_role` key, not `anon` key in `.env`

---

## 📝 FUTURE ENHANCEMENTS

### Short-term (Before Jan 5 Demo)
- [ ] Add sound effects for correct/wrong answers
- [ ] Add more question variety (currently only perimeter)
- [ ] Improve mobile responsiveness
- [ ] Add keyboard shortcuts (Enter to submit)

### Medium-term (Post-Demo, Pre-Paper)
- [ ] Add area calculations (not just perimeter)
- [ ] Add triangle and circle shapes
- [ ] Implement hint system with actual worked examples
- [ ] A/B test different reward functions

### Long-term (Future Research)
- [ ] Multi-topic support (geometry + fractions + algebra)
- [ ] Teacher dashboard to view student progress
- [ ] Export student reports
- [ ] Integrate with Learning Management System (LMS)

---

## 👥 TEAM MEMBER QUICK START

### If you're continuing this work:

1. **Read this file first** to understand system architecture
2. **Run QA test** (`ADAPTIVE_LEARNING_QA_TEST.md`) to verify everything works
3. **Check `docs/ADAPTIVE_LEARNING_API.md`** for API endpoints
4. **Review `backend/application/services/AdaptiveLearningService.js`** for MDP logic
5. **Test with real students** if possible (elementary school age)

### Before making changes:
```bash
# Create a branch
git checkout -b feature/your-feature-name

# Make changes, then test thoroughly
cd frontend && npm run dev
cd backend && node server.js

# Commit with clear messages
git commit -m "Add: New feature description"
```

---

## 🆘 TROUBLESHOOTING

### "Cannot connect to backend"
1. Check backend is running: `http://localhost:5000`
2. Check frontend .env has correct NEXT_PUBLIC_API_URL
3. Check CORS enabled in backend server.js

### "Database error"
1. Verify Supabase connection in backend/.env
2. Check service_role key is set (not anon key)
3. Run schema migrations in docs/sql/

### "UI not updating"
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check React DevTools for state updates
3. Verify API calls in Network tab return 200 status

### "Mastery not saving"
1. Check browser console for errors
2. Verify student_difficulty_levels table exists
3. Check user_id is being passed correctly

---

## 📞 CONTACT & RESOURCES

**Project Documentation:**
- Main README: `README.md`
- API Docs: `docs/ADAPTIVE_LEARNING_API.md`
- Database Schema: `docs/sql/ADAPTIVE_LEARNING_SCHEMA.sql`

**Research Papers (for reference):**
- Q-Learning: Watkins & Dayan (1992)
- Adaptive Learning: VanLehn (2011)
- Pedagogical Strategies: Chi et al. (2018)

**External Tools:**
- Supabase Dashboard: https://app.supabase.com
- VS Code Extensions: ES7 React snippets, Prettier, ESLint

---

## ✅ BEFORE DEADLINE CHECKLIST

- [ ] Run full QA test and fix critical bugs
- [ ] Collect data from 5+ test sessions (minimum 100 attempts total)
- [ ] Export research data to CSV
- [ ] Create graphs for paper (mastery curves, action distribution)
- [ ] Practice demo presentation (5 minutes max)
- [ ] Prepare to explain MDP algorithm to non-technical audience
- [ ] Backup database (export all tables)
- [ ] Screenshot UI for documentation
- [ ] Write "Lessons Learned" section for paper

---

**Good luck with your demo and research paper! 🎓**

This system represents cutting-edge educational technology research. Document everything carefully for reproducibility.
