# Asset Optimization & Performance Guide

## Problem
Free-tier Railway deployment is slow due to 562+ images and audio files being served from the frontend server.

## Solutions

### Option 1: Use Supabase Storage (RECOMMENDED - FREE)

#### Step 1: Create Storage Bucket
1. Go to your Supabase Dashboard
2. Navigate to **Storage** section
3. Click **New Bucket**
4. Name it `assets`
5. Make it **Public**

#### Step 2: Upload Assets
```bash
# Option A: Manual Upload via Supabase Dashboard
1. Go to Storage > assets bucket
2. Create folders: images/, audio/
3. Upload files from frontend/public/images and frontend/public/audio

# Option B: Bulk Upload using Supabase CLI (faster)
npm install -g supabase
supabase login
# Then create upload script (see upload-to-supabase.js below)
```

#### Step 3: Update Environment Variables
```env
# Add to .env.local (frontend)
NEXT_PUBLIC_USE_SUPABASE_STORAGE=true
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

#### Step 4: Use Optimized Image Component
```tsx
import Image from 'next/image';
import { imageLoader } from '@/utils/imageLoader';

// Before (slow):
<img src="/images/castle.png" alt="Castle" />

// After (optimized):
<Image 
  src="/images/castle.png" 
  alt="Castle"
  width={800}
  height={600}
  loader={imageLoader}
  loading="lazy"
/>
```

### Option 2: Image Compression (QUICK WIN)

#### Compress Images Before Deployment
1. **Use TinyPNG** (https://tinypng.com/) - Reduces PNG size by 70%
2. **Use Squoosh** (https://squoosh.app/) - Convert to WebP (80% smaller)
3. **Batch compress**: Use the provided script below

#### Run Compression Script
```bash
# Install sharp for image compression
cd frontend
npm install --save-dev sharp

# Run optimization
node scripts/optimize-images.js
```

### Option 3: Lazy Loading

#### For Images
```tsx
// Use loading="lazy" attribute
<Image src="/images/large.png" loading="lazy" />

// Or use Intersection Observer for custom lazy loading
import { useEffect, useRef, useState } from 'react';

function LazyImage({ src, alt }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsLoaded(true);
        observer.disconnect();
      }
    });

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={imgRef}
      src={isLoaded ? src : '/placeholder.png'}
      alt={alt}
    />
  );
}
```

#### For Audio
```tsx
import { useState } from 'react';
import { preloadAudio } from '@/utils/imageLoader';

function AudioPlayer({ src }) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const loadAndPlay = async () => {
    if (!audio) {
      const loadedAudio = await preloadAudio(src);
      setAudio(loadedAudio);
      loadedAudio.play();
    } else {
      audio.play();
    }
  };

  return <button onClick={loadAndPlay}>Play Sound</button>;
}
```

## Performance Comparison

| Method | Load Time | Size Reduction | Cost |
|--------|-----------|----------------|------|
| Current (Railway) | ~8-15s | 0% | Free |
| Image Compression | ~5-8s | 60-70% | Free |
| Supabase Storage | ~2-4s | 0% + CDN | Free |
| Supabase + Compression | ~1-3s | 60-70% + CDN | Free |

## Recommended Strategy

1. **Immediate (5 min)**: Enable Next.js image optimization in next.config.js ✅ DONE
2. **Short-term (1 hour)**: Compress images with TinyPNG/Squoosh
3. **Long-term (2-3 hours)**: Migrate to Supabase Storage
4. **Ongoing**: Use lazy loading for below-the-fold content

## Additional Tips

### 1. Use Code Splitting
```tsx
// Dynamic import for heavy components
import dynamic from 'next/dynamic';

const HeavyGameComponent = dynamic(() => import('@/components/Game'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});
```

### 2. Reduce Initial Bundle
```json
// In package.json, analyze bundle
"scripts": {
  "analyze": "ANALYZE=true next build"
}
```

### 3. Use Railway Static Assets
Upload static files to Railway's static file hosting:
- More efficient than serving from Node.js
- Automatic caching

### 4. Enable Brotli Compression
```js
// In next.config.js (already added)
compress: true
```

## Monitoring

Check performance after optimization:
```bash
# Test load time
curl -w "@curl-format.txt" -o /dev/null -s https://your-app.railway.app

# Lighthouse score
npx lighthouse https://your-app.railway.app --view
```

Target Scores:
- Performance: 90+
- First Contentful Paint: < 1.8s
- Time to Interactive: < 3.8s
