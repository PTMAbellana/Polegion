// Quick test to check if postgres_changes work on your Supabase project
// Run this in your browser console on any page that imports supabase

import { supabase } from './lib/supabaseClient';

export const testPostgresChanges = async () => {
  console.log('🧪 Testing postgres_changes availability...');
  
  try {
    const channel = supabase
      .channel('test-postgres-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'competitions'
      }, (payload) => {
        console.log('✅ postgres_changes WORKS! Payload:', payload);
      })
      .subscribe((status) => {
        console.log('📡 Postgres changes subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('🎉 SUCCESS! postgres_changes is available on your project');
          console.log('💡 You can use the more efficient postgres_changes instead of broadcast');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('❌ postgres_changes NOT available - stick with broadcast approach');
        }
        
        // Cleanup after test
        setTimeout(() => {
          supabase.removeChannel(channel);
          console.log('🧹 Test cleanup completed');
        }, 5000);
      });
      
  } catch (error) {
    console.error('❌ postgres_changes test failed:', error);
    console.log('💡 Stick with broadcast approach');
  }
};

// Call this function to test
// testPostgresChanges();
