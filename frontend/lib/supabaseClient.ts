import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,     // ✅ Enable automatic token refresh
    persistSession: true,        // ✅ Persist session across reloads
    detectSessionInUrl: true,    // ✅ Handle OAuth redirects
    storageKey: 'polegion-auth', // Custom storage key
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    },
    timeout: 60000, // 60 seconds timeout (increased from 30s for production)
    heartbeatIntervalMs: 15000, // Send heartbeat every 15 seconds (more frequent)
  }
});
