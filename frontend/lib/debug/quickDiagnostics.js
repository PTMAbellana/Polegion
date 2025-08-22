import { supabase } from '../supabaseClient';

// Simple test to see if basic Supabase connection works
export const testBasicConnection = async () => {
  console.log('🔍 Testing basic Supabase connection...');
  
  try {
    const { data, error } = await supabase
      .from('competitions')
      .select('id, title, status')
      .limit(1);

    if (error) {
      console.error('❌ Basic connection test failed:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Basic connection test passed:', data);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Connection error:', error);
    return { success: false, error: error.message };
  }
};

// Simple realtime test
export const testRealtimeSimple = async (competitionId) => {
  console.log('🔍 Testing simple realtime connection...');
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.error('❌ Realtime test timed out');
      resolve({ success: false, error: 'Connection timed out' });
    }, 15000);

    const testChannel = supabase
      .channel(`test-${Date.now()}`)
      .subscribe((status) => {
        console.log('📡 Test channel status:', status);
        
        clearTimeout(timeout);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime test passed');
          supabase.removeChannel(testChannel);
          resolve({ success: true, status });
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime test failed:', status);
          supabase.removeChannel(testChannel);
          resolve({ success: false, error: status });
        }
      });
  });
};

// Test specific competition channel
export const testCompetitionChannel = async (competitionId) => {
  console.log(`🔍 Testing competition channel for ID: ${competitionId}...`);
  
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.error('❌ Competition channel test timed out');
      resolve({ success: false, error: 'Competition channel timed out' });
    }, 15000);

    const channel = supabase
      .channel(`competition-test-${competitionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'competitions',
        filter: `id=eq.${competitionId}`
      }, (payload) => {
        console.log('✅ Received test update:', payload);
      })
      .subscribe((status) => {
        console.log('📡 Competition channel status:', status);
        
        if (status === 'SUBSCRIBED') {
          clearTimeout(timeout);
          console.log('✅ Competition channel test passed');
          supabase.removeChannel(channel);
          resolve({ success: true, status });
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          clearTimeout(timeout);
          console.error('❌ Competition channel test failed:', status);
          supabase.removeChannel(channel);
          resolve({ success: false, error: status });
        }
      });
  });
};

// Run all tests
export const runQuickDiagnostics = async (competitionId) => {
  console.log('🚀 Running quick diagnostics...');
  
  const results = {};
  
  // Test 1: Basic connection
  results.basic = await testBasicConnection();
  if (!results.basic.success) {
    console.error('❌ Basic connection failed, stopping tests');
    return results;
  }
  
  // Test 2: Simple realtime
  results.realtime = await testRealtimeSimple();
  if (!results.realtime.success) {
    console.error('❌ Basic realtime failed, but continuing...');
  }
  
  // Test 3: Competition specific
  if (competitionId) {
    results.competition = await testCompetitionChannel(competitionId);
  }
  
  console.log('📊 Diagnostic results:', results);
  return results;
};
