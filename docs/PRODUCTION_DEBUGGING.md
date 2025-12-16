# Production Debugging Guide

## Quick Diagnostics

### 1. Check Backend Status
```bash
# Health check
curl https://your-backend.railway.app/health

# Should return:
# {"status":"ok","timestamp":"...","uptime":123.45,"environment":"production"}
```

### 2. Check Frontend → Backend Connection
Open browser console on your Vercel site:
```javascript
// Test API connection
fetch('https://your-backend.railway.app/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend OK:', d))
  .catch(e => console.error('❌ Backend failed:', e));

// Check environment variables
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

### 3. Check Database Connection
```bash
# From Railway logs, look for:
# "Supabase URL: Present"
# "Service Key present: true"
```

## Common Production Errors

### Error: "Failed to load page"

**Symptoms:**
- Page shows loading spinner then nothing
- Browser console shows network errors
- No content loads

**Debug Steps:**
1. Open browser DevTools → Network tab
2. Reload page
3. Look for failed requests (red)
4. Click failed request → Response tab

**Possible Causes:**
- ❌ Backend is down → Check Railway deployment
- ❌ CORS blocking → Check CORS config in backend
- ❌ API_URL not set → Check Vercel env vars
- ❌ Cold start timeout → Wait 30s and retry

**Fix:**
```bash
# Verify backend is running
curl https://your-backend.railway.app/health

# If down, check Railway logs
# If CORS error, update backend/server.js CORS config
# If timeout, check Railway resource usage
```

---

### Error: "Request timeout of 60000ms exceeded"

**Symptoms:**
- Loading indicator shows for 1 minute
- Then shows error message
- Network tab shows "canceled" or "timeout"

**Debug Steps:**
1. Check which endpoint timed out
2. Check Railway logs for that time
3. Look for slow database queries

**Possible Causes:**
- ❌ Cold start taking >60s → Upgrade Railway tier or add keep-alive
- ❌ Database query too slow → Add indexes
- ❌ Large data transfer → Paginate results

**Fix:**
- Already increased timeout to 60s
- Add health check pings to keep server warm
- Optimize slow queries

---

### Error: "CORS policy blocked"

**Symptoms:**
- Network tab shows CORS error
- Request fails immediately
- Console: "Access-Control-Allow-Origin"

**Debug Steps:**
```bash
# Check backend CORS config
curl -H "Origin: https://your-app.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://your-backend.railway.app/api/auth/login
```

**Possible Causes:**
- ❌ FRONTEND_URL not set in Railway
- ❌ CORS not allowing Vercel domain
- ❌ CORS not allowing credentials

**Fix in Railway:**
1. Go to Variables
2. Add: `FRONTEND_URL=https://your-app.vercel.app`
3. Redeploy

**Or update backend/server.js:**
```javascript
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};
```

---

### Error: "500 Internal Server Error"

**Symptoms:**
- Request completes but returns 500
- Error message in response
- Something worked before but now broken

**Debug Steps:**
1. Check Railway logs (most important!)
2. Look for stack trace
3. Find the actual error message

**Common 500 Errors:**

#### A) "RLS policy violation"
```
Error: new row violates row-level security policy
```
**Fix:** Run `FIX_ASSESSMENT_RLS_FOR_BACKEND.sql` in Supabase

#### B) "Invalid service role key"
```
Error: Invalid JWT
```
**Fix:** Check `SUPABASE_SERVICE_KEY` in Railway env vars

#### C) "Database connection failed"
```
Error: Connection timeout
```
**Fix:** Check Supabase is running, verify URL and key

#### D) "JWT secret not set"
```
Error: secretOrPrivateKey must have a value
```
**Fix:** Add `JWT_SECRET` to Railway env vars

---

### Error: "Assessment won't submit"

**Symptoms:**
- Submit button clicked
- Shows "Submitting..." forever
- Eventually times out or shows error

**Debug Steps:**
1. Open browser DevTools → Network tab
2. Click submit
3. Find the `POST /assessments/submit` request
4. Check response and timing

**Possible Causes:**

#### A) Timeout (60+ seconds)
- Backend taking too long to grade
- Already fixed with 60s timeout
- If still timing out, check Railway resources

#### B) RLS policy error (500 error)
- Check Response tab in Network
- If "RLS policy violation", run SQL fix

#### C) Missing data (400 error)
- Check Request payload in Network
- Verify all answers are included
- Check userId is present

**Fix based on error:**
```bash
# For RLS errors:
# Run FIX_ASSESSMENT_RLS_FOR_BACKEND.sql

# For timeouts:
# Check Railway logs for slow queries
# Verify database indexes exist

# For 400 errors:
# Check frontend is sending correct data
# Verify assessment questions loaded properly
```

---

### Error: "Minigame won't submit"

**Symptoms:**
- Complete minigame
- Click submit
- Nothing happens or error

**Debug Steps:**
1. Check Network tab for `/user-minigame-attempts` request
2. Look at request payload
3. Check response status

**Possible Causes:**
- ❌ Same as assessment errors (RLS, timeout, etc.)
- ❌ Missing minigame_id
- ❌ Invalid attempt data structure

**Fix:**
- Apply same fixes as assessment submission
- Verify RLS policies are fixed
- Check minigame data structure in request

---

## Railway Logs Deep Dive

### How to Read Logs
1. Go to Railway dashboard
2. Click on backend service
3. Click "Deployments" → Latest → "View Logs"

### What to Look For

#### Good Signs ✅
```
Server running on port 5000
✅ Health check successful
Supabase URL: Present
Service Key present: true
```

#### Bad Signs ❌
```
❌ Error: Connection refused
❌ CORS blocked origin: https://...
❌ Error: Invalid JWT
❌ RLS policy violation
❌ Database error
```

### Common Log Patterns

#### Successful Request
```
🌐 API CALL: /api/assessments/submit
✅ Validation passed, calling service...
✅ Service completed successfully
```

#### Failed Request
```
🌐 API CALL: /api/assessments/submit
❌ Validation failed: Missing required fields
```

#### Database Error
```
❌ Error fetching questions: {code: 'PGRST...'}
```

---

## Vercel Logs Deep Dive

### How to View Logs
1. Go to Vercel dashboard
2. Click on frontend project
3. Click "Deployments" → Latest
4. Click "Functions" or "Build Logs"

### Build Logs
Look for:
- ✅ "Build Completed"
- ❌ "Build Failed" → Check error message

### Function Logs
- Shows API route errors
- Shows serverless function timeouts
- Shows Next.js errors

---

## Performance Issues

### Pages Load Slowly

**Symptoms:**
- Long wait before content appears
- Multiple seconds of loading
- Sometimes fails completely

**Debug:**
1. Network tab → Look at timing
2. Check "Waiting (TTFB)" time
3. If >5 seconds, likely cold start

**Fix:**
- Health check endpoint keeps server warm
- Upgrade Railway tier for better resources
- Optimize slow database queries
- Add caching for frequently accessed data

### Slow API Responses

**Check in Network Tab:**
- Time to First Byte (TTFB)
- Total request time
- Response size

**Fix:**
- Add database indexes
- Implement pagination
- Cache frequent requests
- Optimize queries

---

## Environment Variable Verification

### Backend (Railway)
```bash
# SSH into Railway or check in dashboard
echo $PORT                    # Should be 5000
echo $NODE_ENV                # Should be production
echo $SUPABASE_URL            # Should be https://...supabase.co
echo $SUPABASE_SERVICE_KEY    # Should start with eyJhbG...
echo $JWT_SECRET              # Should be set
echo $FRONTEND_URL            # Should be https://...vercel.app
```

### Frontend (Vercel)
Check in Vercel → Settings → Environment Variables:
- `NEXT_PUBLIC_API_URL` → Should point to Railway
- `NEXT_PUBLIC_SUPABASE_URL` → Should match backend
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Should be anon key (NOT service role!)

---

## Testing Checklist After Fixes

- [ ] Backend health check returns 200
- [ ] Frontend loads without console errors
- [ ] Can login/register
- [ ] Can view castles and chapters
- [ ] Can start assessment
- [ ] Can complete assessment
- [ ] Can submit assessment (no timeout or RLS error)
- [ ] Results display correctly
- [ ] Can play minigame
- [ ] Can submit minigame
- [ ] Progress saves correctly
- [ ] No CORS errors in console
- [ ] No timeout errors in console

---

## Getting Help

When asking for help, provide:
1. **Error message** (exact text)
2. **Browser console** (screenshot or copy)
3. **Network tab** (screenshot of failed request)
4. **Railway logs** (relevant section)
5. **Steps to reproduce**
6. **What you've tried**

Example:
```
❌ Problem: Assessment won't submit

Error: "Request timeout of 60000ms exceeded"

Steps:
1. Login to https://my-app.vercel.app
2. Go to Castle 0 (Pretest)
3. Answer all questions
4. Click "Submit Assessment"
5. Wait 60 seconds
6. Shows error

Network tab shows:
- POST /api/assessments/submit
- Status: (canceled)
- Time: 60.00s

Railway logs show:
📝 Submit Assessment Request:
  userId: abc-123
  testType: pretest
  answers count: 30
(then nothing else, no error)

Tried:
- Clearing cache
- Different browser
- Checking env vars (all set)
```
