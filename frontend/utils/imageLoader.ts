// Utility for optimized image loading with Supabase Storage fallback

const SUPABASE_STORAGE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/**
 * Image loader for Next.js Image component
 * Attempts to load from Supabase Storage first, falls back to local
 */
export function imageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // If it's an external URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  // Check if we should use Supabase Storage
  if (SUPABASE_STORAGE_URL && process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE === 'true') {
    // Remove leading slash if present
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/assets/${cleanSrc}?width=${width}&quality=${quality || 75}`;
  }

  // Default: use local public folder
  return src;
}

/**
 * Get optimized image path with WebP fallback
 */
export function getOptimizedImageSrc(path: string, useWebP = true): string {
  if (!useWebP || path.endsWith('.gif')) {
    return path;
  }

  // Convert to WebP if possible
  const webpPath = path.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  return webpPath;
}

/**
 * Lazy load audio files
 */
export function preloadAudio(src: string): Promise<HTMLAudioElement> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'metadata'; // Only load metadata, not full file
    audio.addEventListener('canplaythrough', () => resolve(audio));
    audio.addEventListener('error', reject);
    audio.src = src;
  });
}

/**
 * Get audio source with Supabase fallback
 */
export function getAudioSrc(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  if (SUPABASE_STORAGE_URL && process.env.NEXT_PUBLIC_USE_SUPABASE_STORAGE === 'true') {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/assets/${cleanPath}`;
  }

  return path;
}
