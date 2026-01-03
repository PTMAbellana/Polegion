# ✅ Post-Database Migration Checklist

## Database ✅ DONE
- [x] Run SQL migration
- [x] 12 topics created
- [x] 29 learning objectives created
- [x] 4 tables created with RLS

---

## Backend Updates (30 minutes)

### Step 1: Global Find & Replace
- [ ] Open VS Code
- [ ] Press `Ctrl+Shift+F` (Find in Files)
- [ ] Search: `chapterId` | Replace: `topicId`
- [ ] Files to include: `backend/**/*.js`
- [ ] Click "Replace All" button
- [ ] **Result:** ~75+ replacements

### Step 2: Add New Route
- [ ] Open `backend/presentation/routes/AdaptiveLearningRoutes.js`
- [ ] Add after line 17 (inside `initializeRoutes()`):
```javascript
this.router.get('/topics', this.controller.getTopics.bind(this.controller));
```

### Step 3: Add New Service Method
- [ ] Open `backend/application/services/AdaptiveLearningService.js`
- [ ] Add after constructor:
```javascript
async getAllTopics() {
  return await this.repo.getAllTopics();
}
```

### Step 4: Test Backend
- [ ] `cd backend`
- [ ] `npm start`
- [ ] Test: `curl http://localhost:5000/api/adaptive/topics -H "Authorization: Bearer TOKEN"`
- [ ] Should return 12 topics ✅

---

## Frontend Updates (20 minutes)

### Step 1: Global Find & Replace
- [ ] Press `Ctrl+Shift+F`
- [ ] Search: `chapterId` | Replace: `topicId`
- [ ] Files to include: `frontend/**/*.{ts,tsx,js}`
- [ ] Click "Replace All"
- [ ] **Result:** ~30+ replacements

### Step 2: Replace Adaptive Learning Page
- [ ] Open `frontend/app/student/adaptive-learning/page.tsx`
- [ ] Delete ALL contents
- [ ] Paste code from `QUICK_FRONTEND_UPDATE.md` (Step 2)
- [ ] Save file

### Step 3: Test Frontend
- [ ] `cd frontend`
- [ ] `npm run dev`
- [ ] Open: `http://localhost:3000/student/adaptive-learning`
- [ ] See 12 topics in dropdown? ✅
- [ ] Select topic, see description? ✅
- [ ] Answer questions, difficulty adapts? ✅

---

## Team Testing (Jan 4-5)

### Each Team Member:
- [ ] Create 2-3 test student accounts
- [ ] Test different topics across cognitive domains
- [ ] Complete 30-50 questions per account
- [ ] Intentionally get wrong answers (test adaptation)
- [ ] Export data: `GET /api/adaptive/qlearning/export`

### Data to Collect:
- [ ] Q-Table export (all Q-values)
- [ ] Performance metrics per topic
- [ ] Difficulty transition graphs
- [ ] Mastery progression charts

---

## Paper Writing (Jan 5)

### Results Section:
- [ ] Create graphs from collected data
- [ ] Calculate average mastery improvement
- [ ] Document difficulty adaptation frequency
- [ ] Show Q-Learning convergence

### Methodology Section:
- [ ] Describe 12 curriculum-aligned topics
- [ ] Explain 6 cognitive domains
- [ ] Detail Q-Learning algorithm
- [ ] Show parametric question generation

---

## Quick Reference

**Backend test command:**
```bash
curl http://localhost:5000/api/adaptive/topics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected topics:**
1. Basic Geometric Figures
2. Kinds of Angles
3. Complementary and Supplementary Angles
4. Parts of a Circle
5. Circumference and Area of a Circle
6. Polygon Identification
7. Interior Angles of Polygons
8. Perimeter and Area of Polygons
9. Plane and 3D Figures
10. Volume of Space Figures
11. Geometry Word Problems
12. Geometric Proofs and Reasoning

**Frontend URL:**
```
http://localhost:3000/student/adaptive-learning
```

---

## Estimated Timeline

- **Jan 3 (today)**: Complete backend/frontend updates (1 hour)
- **Jan 3 evening**: Begin team testing (3-4 hours)
- **Jan 4**: Complete testing, export data (full day)
- **Jan 5**: Write paper, create graphs, finalize (full day)

---

## Need Help?

**Documentation:**
- Backend guide: `QUICK_BACKEND_UPDATE.md`
- Frontend guide: `QUICK_FRONTEND_UPDATE.md`
- Full implementation: `docs/ADAPTIVE_TOPICS_IMPLEMENTATION.md`
- Curriculum mapping: `docs/CURRICULUM_ALIGNMENT.md`

**Common Issues:**
- **Topics not showing?** Check backend `/topics` endpoint
- **Q-Learning not adapting?** Check `topicId` vs `chapterId` naming
- **Database errors?** Verify SQL migration ran successfully

---

**You're ready to go! Start with backend updates, then frontend, then testing.** 🚀
