# 🚀 Deployment Checklist

## ✅ Before Deployment

### Database (Supabase)
- [ ] Run `FIX_ASSESSMENT_RLS_FOR_BACKEND.sql` in Supabase SQL Editor
- [ ] Copy service role key (Settings → API → `service_role` secret)
- [ ] Copy anon key (Settings → API → `anon` public)
- [ ] Verify RLS policies are working

### Backend Code
- [ ] All changes committed and pushed to Git
- [ ] Environment variables documented
- [ ] Health check endpoint tested locally

### Frontend Code
- [ ] All changes committed and pushed to Git
- [ ] API_URL points to Railway backend (not localhost)
- [ ] Build succeeds locally: `npm run build`

## 🎯 Railway Deployment (Backend)

### 1. Create New Project
- Go to Railway.app
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository
- Select `backend` folder as root directory

### 2. Set Environment Variables
Copy from `docs/DEPLOYMENT_ENV_VARS.md`:
```
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG...  (⚠️ SERVICE ROLE KEY, NOT ANON!)
JWT_SECRET=your_jwt_secret_32_chars_minimum
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.railway.app
```

### 3. Configure Build
- Build Command: (leave empty, uses `npm start`)
- Start Command: `node server.js`
- Watch Paths: `backend/**`

### 4. Deploy & Get URL
- Click "Deploy"
- Wait for deployment
- Copy the Railway URL: `https://your-backend.railway.app`
- Test: `curl https://your-backend.railway.app/health`

## ☁️ Vercel Deployment (Frontend)

### 1. Import Project
- Go to Vercel.com
- Click "Add New" → "Project"
- Import your GitHub repository
- Select `frontend` folder as root directory

### 2. Configure Framework
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3. Set Environment Variables
⚠️ **CRITICAL:** Use your Railway backend URL!
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...  (⚠️ ANON KEY, NOT SERVICE ROLE!)
```

### 4. Deploy
- Click "Deploy"
- Wait 2-5 minutes for build
- Copy Vercel URL: `https://your-app.vercel.app`

### 5. Update Backend CORS
Go back to Railway → Backend → Environment Variables:
- Update `FRONTEND_URL` to your Vercel URL
- Redeploy backend

## 🧪 Testing After Deployment

### 1. Backend Health Check
```bash
curl https://your-backend.railway.app/health
```
Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "uptime": 123.45,
  "environment": "production"
}
```

### 2. Frontend Loads
- Open `https://your-app.vercel.app`
- Check browser console for errors
- Look for CORS or network errors

### 3. Test Critical Features

#### Test Login
- [ ] Can register new account
- [ ] Can login
- [ ] Token refresh works
- [ ] User data loads

#### Test Castles
- [ ] Castle list loads
- [ ] Can enter a castle
- [ ] Chapters load
- [ ] Progress saves

#### Test Assessments
- [ ] Castle 0 (Pretest) loads questions
- [ ] Can answer questions
- [ ] Can submit assessment
- [ ] Results display correctly
- [ ] No RLS errors in Network tab

#### Test Minigames
- [ ] Minigames load
- [ ] Can play minigame
- [ ] Can submit answers
- [ ] XP/score updates
- [ ] No timeout errors

### 4. Check Logs

#### Railway Logs
- Click on backend service
- Go to "Deployments" → Latest → "View Logs"
- Look for errors or warnings
- Verify health checks are working

#### Vercel Logs
- Click on frontend project
- Go to "Deployments" → Latest → "Functions"
- Check for errors or timeouts
- Verify API calls are succeeding

## 🐛 Common Issues & Fixes

### Issue: "CORS policy blocked"
**Fix:** Update `FRONTEND_URL` in Railway to match your Vercel URL exactly

### Issue: "Request timeout"
**Fix:** Already fixed in code (60s timeout), ensure Railway isn't sleeping

### Issue: "RLS policy violation"
**Fix:** Run `FIX_ASSESSMENT_RLS_FOR_BACKEND.sql` in Supabase

### Issue: "500 Internal Server Error"
**Fix:** Check Railway logs, verify all env vars are set correctly

### Issue: Pages load slowly then fail
**Fix:** Cold start - health check endpoint will help, or upgrade Railway tier

### Issue: Assessment submission fails
**Fix:** 
1. Verify `SUPABASE_SERVICE_KEY` is set in Railway (not anon key!)
2. Verify RLS policies are fixed
3. Check Railway logs for actual error

## 📊 Monitoring

### Set Up Alerts
- Railway: Enable deployment notifications
- Vercel: Enable build/deployment notifications
- Supabase: Monitor API usage

### Performance Monitoring
- Railway dashboard shows CPU/memory usage
- Vercel analytics shows page load times
- Browser DevTools → Network tab shows request times

## 🔄 Updating Deployment

### Update Backend
1. Push changes to Git
2. Railway auto-deploys from main branch
3. Check deployment logs
4. Test health endpoint

### Update Frontend
1. Push changes to Git
2. Vercel auto-deploys from main branch
3. Wait for build to complete
4. Test in browser

## 📝 Post-Deployment Notes

- **Railway URL:** `____________________`
- **Vercel URL:** `____________________`
- **Deployed on:** `____________________`
- **Database:** Supabase
- **Deployed by:** `____________________`

### Known Issues
- [ ] List any known issues or limitations
- [ ] Note any workarounds needed
- [ ] Document any manual steps required

---

## 🎉 Success Criteria

- ✅ Backend health check returns 200
- ✅ Frontend loads without errors
- ✅ Users can login/register
- ✅ Assessments can be submitted
- ✅ Minigames work correctly
- ✅ No CORS errors
- ✅ No timeout errors
- ✅ Progress saves correctly
