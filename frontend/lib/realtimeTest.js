import { supabase } from '../lib/supabaseClient';

// Test realtime by making actual database changes
export const testRealtimeWithActualChanges = async (competitionId) => {
  console.log('🧪 [Test] Starting realtime test with actual database changes...');
  
  return new Promise((resolve) => {
    let received = false;
    
    // Set up the listener first
    const testChannel = supabase
      .channel(`realtime-test-${Date.now()}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'competitions',
        filter: `id=eq.${competitionId}`
      }, (payload) => {
        console.log('✅ [Test] RECEIVED DATABASE UPDATE:', payload);
        received = true;
        supabase.removeChannel(testChannel);
        resolve({ success: true, received: true, payload });
      })
      .subscribe(async (status) => {
        console.log('📡 [Test] Channel status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ [Test] Channel subscribed, now making database change...');
          
          // Wait a moment for subscription to be fully ready
          setTimeout(async () => {
            try {
              // Make a small change to the competition
              const timestamp = new Date().toISOString();
              const { data, error } = await supabase
                .from('competitions')
                .update({ 
                  updated_at: timestamp,
                  // Add a test field or update description to trigger change
                  description: `Test update at ${timestamp}`
                })
                .eq('id', competitionId);

              if (error) {
                console.error('❌ [Test] Failed to update competition:', error);
                supabase.removeChannel(testChannel);
                resolve({ success: false, error: error.message });
              } else {
                console.log('✅ [Test] Database update sent:', data);
                
                // Wait 5 seconds for realtime response
                setTimeout(() => {
                  if (!received) {
                    console.error('❌ [Test] No realtime event received after database update');
                    supabase.removeChannel(testChannel);
                    resolve({ success: false, received: false, error: 'No realtime event received' });
                  }
                }, 5000);
              }
            } catch (updateError) {
              console.error('❌ [Test] Error updating database:', updateError);
              supabase.removeChannel(testChannel);
              resolve({ success: false, error: updateError.message });
            }
          }, 1000);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error('❌ [Test] Channel failed:', status);
          supabase.removeChannel(testChannel);
          resolve({ success: false, error: status });
        }
      });

    // Overall timeout
    setTimeout(() => {
      if (!received) {
        console.error('❌ [Test] Test timed out');
        supabase.removeChannel(testChannel);
        resolve({ success: false, error: 'Test timed out' });
      }
    }, 15000);
  });
};

// Check if realtime publication includes your tables
export const checkRealtimePublication = async () => {
  console.log('📋 [Test] Checking realtime publication...');
  
  try {
    const { data, error } = await supabase.rpc('pg_publication_tables_query', {
      publication_name: 'supabase_realtime'
    });

    if (error) {
      console.log('ℹ️ [Test] Cannot check publication (this might be expected)');
      return { success: false, error: error.message };
    }

    console.log('📋 [Test] Published tables:', data);
    return { success: true, data };
  } catch (error) {
    console.log('ℹ️ [Test] Cannot check publication programmatically');
    return { success: false, error: error.message };
  }
};

// Complete test that tries everything
export const runCompleteRealtimeTest = async (competitionId) => {
  console.log('🚀 [Test] Running complete realtime test for competition:', competitionId);
  
  const results = {};
  
  // Test 1: Check if competition exists
  try {
    const { data: compData, error: compError } = await supabase
      .from('competitions')
      .select('id, title, status, updated_at')
      .eq('id', competitionId)
      .single();

    if (compError || !compData) {
      console.error('❌ [Test] Competition not found:', compError);
      return { success: false, error: 'Competition not found' };
    }

    console.log('✅ [Test] Competition found:', compData);
    results.competition = compData;
  } catch (error) {
    console.error('❌ [Test] Error checking competition:', error);
    return { success: false, error: error.message };
  }

  // Test 2: Check realtime publication
  results.publication = await checkRealtimePublication();

  // Test 3: Test actual realtime with database changes
  console.log('🔄 [Test] Testing realtime with actual database changes...');
  results.realtimeTest = await testRealtimeWithActualChanges(competitionId);

  console.log('📊 [Test] Complete test results:', results);
  return results;
};
