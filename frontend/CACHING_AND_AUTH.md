# Caching & Authentication Implementation Guide

## Overview

This project uses **axios-cache-interceptor** for automatic API response caching and implements **proactive token refresh** to prevent automatic logout issues.

## 🎯 Key Features

- ✅ **Automatic Caching**: GET requests cached for 10 minutes
- ✅ **Proactive Token Refresh**: Tokens refresh BEFORE expiry (30-second buffer)
- ✅ **No Manual Cache Management**: axios-cache-interceptor handles everything
- ✅ **Security**: Cache cleared automatically on token refresh
- ✅ **Development Tools**: Cache control utilities in dev mode

---

## 📦 Installation

```bash
npm install axios-cache-interceptor
```

Already installed in this project.

---

## 🔧 Configuration (`api/axios.js`)

### Cache Setup

```javascript
import { setupCache } from 'axios-cache-interceptor';

const api = setupCache(axiosInstance, {
  ttl: 10 * 60 * 1000, // 10 minutes
  methods: ['get'],     // Only cache GET requests
  cachePredicate: {
    statusCheck: (status) => status >= 200 && status < 300
  }
});
```

### Token Refresh Strategy

**Proactive Approach**: Check token expiry BEFORE making API calls

```javascript
// Request Interceptor
api.interceptors.request.use(async (config) => {
  // Skip token check for auth endpoints
  if (config.url?.includes('/auth/')) {
    return config;
  }

  // Check if token expires within 30 seconds
  if (authUtils.isTokenExpired()) {
    console.log('⚠️ Token expired/expiring, refreshing before request');
    
    // Refresh token proactively
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Update config with new token
      config.headers.Authorization = `Bearer ${authUtils.getToken()}`;
    }
  }

  return config;
});
```

**Reactive Backup**: Handle unexpected 401 errors

```javascript
// Response Interceptor
api.interceptors.response.use(
  (response) => {
    // Log cache hits in development
    if (response.cached) {
      console.log('💾 Cache HIT:', response.config.url);
    }
    return response;
  },
  async (error) => {
    // Handle 401 errors as backup
    if (error.response?.status === 401) {
      await refreshAccessToken();
    }
    return Promise.reject(error);
  }
);
```

---

## 🛡️ Token Management

### Token Expiry Check

```javascript
// authUtils in api/axios.js
export const authUtils = {
  isTokenExpired: () => {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return true;
    
    // 30-second buffer before actual expiry
    const bufferTime = 30 * 1000;
    return Date.now() + bufferTime >= parseInt(expiresAt);
  }
};
```

### Automatic Token Refresh

- **When**: Token expires within 30 seconds
- **How**: Uses separate axios instance to avoid interceptor loops
- **Cache**: Automatically cleared after token refresh for security

---

## 📝 Using API Functions

### Simple GET Requests (Cached Automatically)

```javascript
// api/rooms.js
export const getRooms = async () => {
  try {
    const res = await api.get("/rooms");
    return {
      success: true,
      data: res.data.data,
      message: 'Rooms fetched successfully'
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Error fetching rooms',
      error: error.response?.data?.error || error.message,
      status: error.response?.status 
    };
  }
};
```

**No manual caching needed!** axios-cache-interceptor handles it automatically:
- ✅ First call: Fetches from server
- ✅ Subsequent calls (within 10 min): Returns from cache
- ✅ After 10 min: Fetches fresh data

### POST/PUT/DELETE Requests (Never Cached)

```javascript
// api/rooms.js
export const createRoom = async (roomData) => {
  try {
    const res = await api.post("/rooms", roomData);
    return {
      success: true,
      data: res.data.data,
      message: 'Room created successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.error || 'Error creating room',
      status: error.response?.status 
    }
  }
};
```

**Note**: POST/PUT/DELETE requests are never cached by default.

---

## 🧪 Development Tools

### Cache Control (Dev Mode Only)

```javascript
// Available in browser console
window.cacheControl.clear()  // Clear all cache
window.cacheControl.stats    // View cache statistics
```

### Console Logging

Watch for these messages during development:

- `💾 Cache HIT: /api/rooms` - Request served from cache
- `⚠️ Token expired/expiring, refreshing before request` - Proactive refresh triggered
- `✅ Token refreshed proactively` - Token refresh successful
- `❌ Failed to refresh token` - Token refresh failed (logout triggered)

---

## 🔍 How It Works

### Normal Request Flow

```
1. User triggers API call
2. Request interceptor checks token expiry
3. If token valid: Proceed to step 5
4. If token expiring: Refresh token first
5. Check if response is cached
6. If cached: Return from cache
7. If not cached: Fetch from server → Cache response
8. Return data to user
```

### Token Refresh Flow

```
1. Token expires within 30 seconds
2. Proactive refresh triggered
3. POST /auth/refresh with refresh_token
4. Receive new access_token and expires_at
5. Update localStorage
6. Clear cache for security
7. Continue with original request
```

---

## 🚫 What NOT to Do

### ❌ Don't manually cache responses
```javascript
// BAD - No need for this!
const cachedData = localStorage.getItem('rooms');
if (cachedData) return JSON.parse(cachedData);
```

### ❌ Don't manually invalidate cache
```javascript
// BAD - Cache clears automatically on token refresh
await cacheInvalidation.rooms();
```

### ❌ Don't import old cache utilities
```javascript
// BAD - These files don't exist anymore
import { cachedGet } from '@/lib/apiCacheHelper';
import { cacheInvalidation } from '@/lib/apiCacheHelper';
```

---

## ✅ What TO Do

### ✅ Just use the axios instance
```javascript
// GOOD - Simple and automatic
const res = await api.get('/rooms');
```

### ✅ Trust the token refresh
```javascript
// GOOD - Interceptor handles token refresh
// No need to check token manually in components
```

### ✅ Use cache control in development
```javascript
// GOOD - Debug cache behavior
window.cacheControl.clear(); // Clear cache during testing
window.cacheControl.stats;   // Check cache hit rate
```

---

## 🐛 Troubleshooting

### Issue: Still getting automatic logout

**Check**:
1. Is `expires_at` stored correctly in localStorage?
2. Look for "Token expired/expiring" logs in console
3. Check if refresh token is valid

**Solution**: The proactive refresh should prevent this. If it still happens, check backend refresh endpoint.

### Issue: Not seeing cached data

**Check**:
1. Is it a GET request? (Only GET requests are cached)
2. Is the status code 200-299? (Only successful requests are cached)
3. Has 10 minutes passed? (Cache expires after TTL)

**Solution**: Check console for "Cache HIT" logs. Use `window.cacheControl.stats` to verify cache is working.

### Issue: Stale data showing

**Check**:
1. Is token refreshing? (Cache clears on token refresh)
2. Has TTL (10 min) expired?

**Solution**: Manually clear cache in dev: `window.cacheControl.clear()`

---

## 📊 Cache Statistics

### View Cache Performance

```javascript
// In browser console
window.cacheControl.stats

// Example output:
// {
//   size: 15,              // Number of cached entries
//   hits: 42,              // Cache hit count
//   misses: 8,             // Cache miss count
//   hitRate: 84%           // Hit rate percentage
// }
```

---

## 🔒 Security Notes

- ✅ Cache cleared automatically on token refresh
- ✅ Tokens stored securely in localStorage (httpOnly cookies recommended for production)
- ✅ Proactive refresh prevents expired token leakage
- ✅ Cache only stores response data, not sensitive headers

---

## 📚 Updated API Files

All these files have been updated to remove old cache imports:

- ✅ `api/axios.js` - Core setup with axios-cache-interceptor
- ✅ `api/rooms.js` - Room management
- ✅ `api/problems.js` - Problem management
- ✅ `api/participants.js` - Participant management
- ✅ `api/competitions.js` - Competition management
- ✅ `api/leaderboards.js` - Leaderboard data
- ✅ `api/castles.js` - Castle/world map data
- ✅ `api/chapters.js` - Chapter management
- ✅ `api/users.js` - User profile
- ✅ `api/progress.js` - Progress tracking
- ✅ `api/attempt.js` - Solution submission (no caching, POST only)
- ✅ `api/auth.js` - Authentication (no caching)

---

## 🎉 Benefits

### Before (IndexedDB Custom Cache)
- ❌ Manual cache invalidation required
- ❌ Complex cache helper utilities
- ❌ Reactive token refresh (after 401 errors)
- ❌ More code to maintain
- ❌ Cache management scattered across files

### After (axios-cache-interceptor)
- ✅ Automatic caching with zero configuration
- ✅ Proactive token refresh (prevents 401 errors)
- ✅ Clean, simple API functions
- ✅ Less code, easier maintenance
- ✅ Centralized cache control in axios.js

---

## 📝 Summary

1. **Install**: `npm install axios-cache-interceptor` ✅
2. **Setup**: Configured in `api/axios.js` ✅
3. **Use**: Just use `api.get()`, caching is automatic ✅
4. **Test**: Check console for cache logs and token refresh messages ✅
5. **Debug**: Use `window.cacheControl` in development ✅

**No more manual cache management needed!** 🎉
