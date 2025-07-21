import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const useRealtimeDebug = (competitionId: string) => {
  const [debugInfo, setDebugInfo] = useState({
    supabaseUrl: '',
    hasAnonKey: false,
    connectionState: 'INITIALIZING',
    channelsConnected: 0,
    totalChannels: 0,
    lastError: null as string | null,
    lastUpdate: null as string | null,
    competitionExists: false,
    tablePermissions: {
      competitions: 'UNKNOWN',
      competition_leaderboards: 'UNKNOWN',
      competition_attempts: 'UNKNOWN'
    }
  });

  useEffect(() => {
    const checkSetup = async () => {
      // Check environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      console.log('🔍 Debug - Supabase URL:', supabaseUrl);
      console.log('🔍 Debug - Has Anon Key:', !!supabaseAnonKey);

      setDebugInfo(prev => ({
        ...prev,
        supabaseUrl: supabaseUrl || 'MISSING',
        hasAnonKey: !!supabaseAnonKey,
        connectionState: 'CHECKING_DATABASE'
      }));

      // Check if competition exists
      try {
        const { data, error } = await supabase
          .from('competitions')
          .select('id, title, status')
          .eq('id', competitionId)
          .maybeSingle();

        if (error) {
          console.error('❌ Debug - Database error:', error);
          setDebugInfo(prev => ({
            ...prev,
            lastError: error.message,
            competitionExists: false,
            tablePermissions: {
              ...prev.tablePermissions,
              competitions: 'ERROR'
            }
          }));
        } else {
          console.log('✅ Debug - Competition found:', data);
          setDebugInfo(prev => ({
            ...prev,
            competitionExists: !!data,
            tablePermissions: {
              ...prev.tablePermissions,
              competitions: 'READ_OK'
            }
          }));
        }
      } catch (error) {
        console.error('❌ Debug - Connection error:', error);
        setDebugInfo(prev => ({
          ...prev,
          lastError: String(error),
          connectionState: 'CONNECTION_FAILED'
        }));
      }

      // Test real-time connection
      setDebugInfo(prev => ({
        ...prev,
        connectionState: 'TESTING_REALTIME'
      }));

      const testChannel = supabase
        .channel(`debug-${competitionId}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'competitions',
          filter: `id=eq.${competitionId}`
        }, (payload) => {
          console.log('🔥 Debug - Real-time working! Received:', payload);
          setDebugInfo(prev => ({
            ...prev,
            lastUpdate: new Date().toISOString(),
            connectionState: 'REALTIME_OK'
          }));
        })
        .on('system', {}, (status, err) => {
          console.log('📡 Debug - Channel status:', status, err);
          setDebugInfo(prev => ({
            ...prev,
            connectionState: status === 'SUBSCRIBED' ? 'CONNECTED' : 'DISCONNECTED',
            lastError: err ? String(err) : prev.lastError
          }));
        })
        .subscribe(async (status) => {
          console.log('🎯 Debug - Subscription status:', status);
          if (status === 'SUBSCRIBED') {
            setDebugInfo(prev => ({
              ...prev,
              channelsConnected: prev.channelsConnected + 1,
              totalChannels: prev.totalChannels + 1
            }));
          }
        });

      // Cleanup
      return () => {
        supabase.removeChannel(testChannel);
      };
    };

    if (competitionId) {
      checkSetup();
    }
  }, [competitionId]);

  return debugInfo;
};

// Debug component to display the information
export const RealtimeDebugPanel = ({ competitionId }: { competitionId: string }) => {
  const debug = useRealtimeDebug(competitionId);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🔧 Real-time Debug</div>
      
      <div className="space-y-1">
        <div>URL: {debug.supabaseUrl.slice(0, 30)}...</div>
        <div>Anon Key: {debug.hasAnonKey ? '✅' : '❌'}</div>
        <div>Status: <span className={
          debug.connectionState === 'CONNECTED' ? 'text-green-400' : 
          debug.connectionState === 'DISCONNECTED' ? 'text-red-400' : 
          'text-yellow-400'
        }>{debug.connectionState}</span></div>
        <div>Competition: {debug.competitionExists ? '✅' : '❌'}</div>
        <div>Channels: {debug.channelsConnected}/{debug.totalChannels}</div>
        
        {debug.lastError && (
          <div className="text-red-400 mt-2">
            Error: {debug.lastError.slice(0, 50)}...
          </div>
        )}
        
        {debug.lastUpdate && (
          <div className="text-green-400 mt-2">
            Last Update: {new Date(debug.lastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
