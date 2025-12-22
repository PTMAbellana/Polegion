# Deployment Issues Fix: Railway & Vercel

## Problems Identified

1. **Pages not loading** - Likely timeout or CORS issues
2. **Minigames not submitting** - API connection or timeout problems
3. **10-second timeout** too short for serverless/cold starts
4. **Missing environment variables** in production
5. **No CORS configuration** for production domains

## Root Causes

### 1. Timeout Issues
- Default 10-second timeout is too short for:
  - Cold starts on Railway/Vercel (can take 15-30 seconds)
  - Assessment grading (30-60 questions)
  - Database-heavy operations
  
### 2. CORS Issues
- Backend might not allow requests from Vercel domain
- Production API URL not set in frontend

### 3. Environment Variables
- `NEXT_PUBLIC_API_URL` might not be set correctly
- Backend environment variables missing in Railway

### 4. Serverless Function Limits
- Vercel has 10-second execution timeout on free tier
- Railway has resource constraints on free tier

## Solutions

### Fix 1: Increase Timeouts (Critical)

#### Frontend API Timeouts
Already partially fixed, but need to increase for production:

**File: `frontend/api/axios.js`**
```javascript
// Update base timeout for production
const baseAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000, // Increase to 60 seconds for production
});

const refreshAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000, // 30 seconds for token refresh
});
```

**File: `frontend/api/minigames.js`**
```javascript
export const submitMinigameAttempt = async (minigameId, attemptData) => {
  const res = await api.post(`/user-minigame-attempts`, {
    minigame_id: minigameId,
    ...attemptData
  }, {
    timeout: 30000, // 30 seconds for minigame submission
    cache: false // Don't cache submissions
  });
  return res.data;
};
```

### Fix 2: CORS Configuration (Backend)

**File: `backend/server.js`**

Update CORS to allow your production domains:
```javascript
// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL, // Add this to .env
    'https://your-app.vercel.app', // Your Vercel domain
    'https://your-app-production.vercel.app',
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || 
            origin.endsWith('.vercel.app') || 
            origin.endsWith('.railway.app')) {
            callback(null, true);
        } else {
            console.warn('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Fix 3: Environment Variables

#### Vercel (Frontend)
In Vercel Dashboard → Settings → Environment Variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

#### Railway (Backend)
In Railway Dashboard → Variables:
```
PORT=5000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJhbG... (service role key!)
JWT_SECRET=your-jwt-secret
FRONTEND_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Fix 4: Add Health Check Endpoint

**File: `backend/server.js`**

Add before other routes:
```javascript
// Health check endpoint (prevents cold starts)
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Ping health check every 5 minutes to keep server warm
if (process.env.NODE_ENV === 'production') {
    const HEALTH_CHECK_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    setInterval(() => {
        fetch(`${HEALTH_CHECK_URL}/health`)
            .catch(err => console.error('Health check failed:', err));
    }, 5 * 60 * 1000); // 5 minutes
}
```

### Fix 5: Add Retry Logic for Failed Requests

**File: `frontend/api/minigames.js`**

```javascript
import api from './axios';

// Retry helper function
const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      
      // Only retry on network errors or 5xx errors
      const shouldRetry = 
        !error.response || 
        (error.response.status >= 500 && error.response.status < 600) ||
        error.code === 'ECONNABORTED';
      
      if (!shouldRetry) throw error;
      
      console.log(`Retry attempt ${i + 1}/${retries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

export const submitMinigameAttempt = async (minigameId, attemptData) => {
  return retryRequest(async () => {
    const res = await api.post(`/user-minigame-attempts`, {
      minigame_id: minigameId,
      ...attemptData
    }, {
      timeout: 30000,
      cache: false
    });
    return res.data;
  });
};

export const getMinigamesByChapter = async (chapterId) => {
  return retryRequest(async () => {
    const res = await api.get(`/minigames/chapter/${chapterId}`, {
      timeout: 15000
    });
    return res.data;
  });
};
```

### Fix 6: Add Loading States & Better Error Handling

For any component that submits minigames or assessments, ensure:
1. Show loading spinner during submission
2. Disable submit button during loading
3. Show specific error messages
4. Retry failed requests

### Fix 7: Optimize Cold Starts

#### Railway (Backend)
Create `Procfile` in backend folder:
```
web: node server.js
```

#### Vercel (Frontend)
Create `vercel.json` in frontend folder:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "functions": {
    "app/**/*.js": {
      "maxDuration": 30
    }
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "@next_public_api_url"
  }
}
```

## Deployment Checklist

### Backend (Railway)
- [ ] Environment variables set
- [ ] CORS configured for Vercel domain
- [ ] Health check endpoint added
- [ ] Database connection verified
- [ ] Service role key (not anon key) used

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_URL` points to Railway backend
- [ ] Timeouts increased in API calls
- [ ] Retry logic added for critical requests
- [ ] Loading states implemented
- [ ] Error boundaries in place

### Database (Supabase)
- [ ] RLS policies fixed (run `FIX_ASSESSMENT_RLS_FOR_BACKEND.sql`)
- [ ] Service role key added to Railway
- [ ] Connection pooling configured

## Testing After Deployment

1. **Test API Connection**
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Test from Frontend**
   - Open browser console
   - Go to Network tab
   - Try loading a page
   - Check for CORS errors or timeouts

3. **Test Minigame Submission**
   - Play a minigame
   - Submit answers
   - Check Network tab for 500/timeout errors

4. **Monitor Logs**
   - Railway: Check logs for errors
   - Vercel: Check function logs
   - Look for timeout or CORS errors

## Common Errors & Solutions

### Error: "Request timeout of 10000ms exceeded"
**Solution:** Increase timeout in API calls (see Fix 1)

### Error: "CORS policy blocked"
**Solution:** Update CORS config to allow Vercel domain (see Fix 2)

### Error: "Network Error"
**Solution:** Check if backend is running on Railway, verify API URL

### Error: "500 Internal Server Error"
**Solution:** Check Railway logs, verify environment variables

### Pages load slowly then fail
**Solution:** Cold start issue - add health check endpoint (see Fix 4)

## Performance Optimization for Production

1. **Enable compression** in backend
2. **Add CDN** for static assets
3. **Implement caching** for frequently accessed data
4. **Use connection pooling** for database
5. **Monitor performance** with Railway/Vercel analytics
