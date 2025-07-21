import { supabase } from './supabaseClient';

// Debug utility to test realtime connection
export const debugRealtimeConnection = async () => {
  console.log('🔍 [Debug] Starting Realtime Connection Diagnostics...');
  
  // 1. Check environment variables
  console.log('📝 [Debug] Checking environment variables...');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  console.log('SUPABASE_URL:', supabaseUrl ? '✅ Present' : '❌ Missing');
  console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Present' : '❌ Missing');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ [Debug] Environment variables missing! Check your .env.local file');
    return false;
  }

  // 2. Test basic Supabase connection
  console.log('🔌 [Debug] Testing basic Supabase connection...');
  try {
    const { error } = await supabase.from('competitions').select('id').limit(1);
    if (error) {
      console.error('❌ [Debug] Basic connection failed:', error);
      return false;
    }
    console.log('✅ [Debug] Basic connection successful');
  } catch (error) {
    console.error('❌ [Debug] Basic connection error:', error);
    return false;
  }

  // 3. Test realtime channel creation
  console.log('📡 [Debug] Testing realtime channel creation...');
  const testChannel = supabase.channel('debug-test-channel');
  
  return new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      console.error('❌ [Debug] Realtime channel creation timed out');
      supabase.removeChannel(testChannel);
      resolve(false);
    }, 10000);

    testChannel.subscribe((status: string) => {
      console.log('📡 [Debug] Test channel status:', status);
      clearTimeout(timeout);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ [Debug] Realtime channels working correctly');
        supabase.removeChannel(testChannel);
        resolve(true);
      } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
        console.error('❌ [Debug] Realtime channel failed:', status);
        supabase.removeChannel(testChannel);
        resolve(false);
      }
    });
  });
};

// Test specific competition realtime
export const testCompetitionRealtime = async (competitionId: number) => {
  console.log(`🎯 [Debug] Testing realtime for competition ${competitionId}...`);
  
  const testChannel = supabase
    .channel(`debug-competition-${competitionId}`)
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'competitions',
      filter: `id=eq.${competitionId}`
    }, (payload: unknown) => {
      console.log('✅ [Debug] Received competition update:', payload);
    })
    .on('system', {}, (status: string) => {
      console.log('📡 [Debug] Competition channel system event:', status);
    });

  return new Promise<boolean>((resolve) => {
    const timeout = setTimeout(() => {
      console.error('❌ [Debug] Competition realtime test timed out');
      supabase.removeChannel(testChannel);
      resolve(false);
    }, 15000);

    testChannel.subscribe((status: string) => {
      console.log('📡 [Debug] Competition test channel status:', status);
      
      if (status === 'SUBSCRIBED') {
        console.log('✅ [Debug] Competition realtime working');
        clearTimeout(timeout);
        
        // Clean up after 5 seconds
        setTimeout(() => {
          supabase.removeChannel(testChannel);
        }, 5000);
        
        resolve(true);
      } else if (status === 'TIMED_OUT' || status === 'CLOSED') {
        console.error('❌ [Debug] Competition realtime failed:', status);
        clearTimeout(timeout);
        supabase.removeChannel(testChannel);
        resolve(false);
      }
    });
  });
};

// Complete diagnostic function
export const runCompleteDiagnostics = async (competitionId?: number) => {
  console.log('🚀 [Debug] Running complete realtime diagnostics...');
  
  const basicConnection = await debugRealtimeConnection();
  if (!basicConnection) {
    console.error('❌ [Debug] Basic diagnostics failed. Cannot proceed.');
    return false;
  }
  
  if (competitionId) {
    const competitionTest = await testCompetitionRealtime(competitionId);
    if (!competitionTest) {
      console.error('❌ [Debug] Competition-specific realtime failed.');
      return false;
    }
  }
  
  console.log('✅ [Debug] All diagnostics passed!');
  return true;
};
