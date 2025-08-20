// TEST COMPONENT - Add this to your admin page temporarily to test real-time updates
import React from 'react';
import { supabase } from '../../lib/supabaseClient';
import { startCompetition, pauseCompetition, resumeCompetition } from '../../api/competitions';
import { useMyApp } from '../../context/AppUtils';
import { getCompeProblems } from '@/api/problems';

const RealtimeTestComponent = ({ competitionId }: { competitionId: string }) => {
  const { isLoggedIn, userProfile, authToken } = useMyApp();

  // Check if user is authenticated using your existing auth context
  const checkAuth = () => {
    console.log('🔐 Current login state:', isLoggedIn);
    console.log('🔐 Current user profile:', userProfile);
    console.log('🔐 Has auth token:', !!authToken);
    
    if (!isLoggedIn || !userProfile) {
      alert('❌ You are not authenticated! Please log in first.');
      return false;
    }
    
    console.log('✅ User is authenticated:', userProfile.email);
    return true;
  };

  const testDirectUpdate = async () => {
    // First check authentication
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) return;
    
    try {
      console.log('🧪 Testing backend API update for competition:', competitionId);
      
      // Use your existing backend API that handles permissions properly
      const result = await startCompetition(competitionId, (await getCompeProblems(competitionId)));
      
      console.log('✅ Backend API successful:', result);
      alert('✅ Competition started using backend API! Check if your UI updated automatically.');
      
    } catch (error) {
      console.error('❌ Backend API Error:', error);
      alert('Backend API Error: ' + String(error));
      
      // If backend fails, show helpful message
      console.log('💡 Try using the purple "🚀 Start (Backend API)" button instead!');
    }
  };

  const testResetUpdate = async () => {
    // First check authentication
    const isAuthenticated = checkAuth();
    if (!isAuthenticated) return;

    try {
      console.log('🔄 Trying to reset competition to NEW status using backend...');
      
      // Since there's no direct reset API, we'll use direct Supabase as fallback
      const { data, error } = await supabase
        .from('competitions')
        .update({ 
          status: 'NEW',
          updated_at: new Date().toISOString()
        })
        .eq('id', competitionId)
        .select();

      if (error) {
        console.error('❌ Reset failed:', error);
        alert('Reset failed: ' + error.message);
        return;
      }

      if (!data || data.length === 0) {
        console.error('❌ No rows were updated during reset.');
        alert('Reset failed: No rows updated. Check permissions.');
        return;
      }

      console.log('✅ Reset successful:', data[0]);

      // Send broadcast to notify all clients
      const channel = supabase.channel(`competition-${competitionId}`);
      await channel.send({
        type: 'broadcast',
        event: 'competition_update',
        payload: data[0]
      });

      console.log('📡 Reset broadcast sent!');
      alert('🔄 Competition reset to NEW and broadcasted! Check if your UI updated automatically.');
    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error: ' + String(error));
    }
  };

  // Test using your backend API (this should work!)
  const testBackendAPI = async () => {
    try {
      console.log('🧪 Testing backend API update...');
      
      // Use your existing API that handles permissions properly
      const result = await startCompetition(competitionId, (await getCompeProblems(competitionId)));
      
      console.log('✅ Backend API successful:', result);
      alert('✅ Competition started using backend API! Check if your UI updated automatically.');
      
    } catch (error) {
      console.error('❌ Backend API Error:', error);
      alert('Backend API Error: ' + String(error));
    }
  };

  const testPauseAPI = async () => {
    try {
      console.log('🧪 Testing pause API...');
      
      const result = await pauseCompetition(competitionId);
      
      console.log('✅ Pause API successful:', result);
      alert('⏸️ Competition paused using backend API! Check if your UI updated automatically.');
      
    } catch (error) {
      console.error('❌ Pause API Error:', error);
      alert('Pause API Error: ' + String(error));
    }
  };

  const testResumeAPI = async () => {
    try {
      console.log('🧪 Testing resume API...');
      
      const result = await resumeCompetition(competitionId);
      
      console.log('✅ Resume API successful:', result);
      alert('▶️ Competition resumed using backend API! Check if your UI updated automatically.');
      
    } catch (error) {
      console.error('❌ Resume API Error:', error);
      alert('Resume API Error: ' + String(error));
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#333',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      zIndex: 9999
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>🧪 Real-time Test</h4>
      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button 
          onClick={testBackendAPI}
          style={{
            backgroundColor: '#8b5cf6',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🚀 Start (Backend API)
        </button>
        <button 
          onClick={testPauseAPI}
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          ⏸️ Pause (Backend API)
        </button>
        <button 
          onClick={testResumeAPI}
          style={{
            backgroundColor: '#06b6d4',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          ▶️ Resume (Backend API)
        </button>
        <button 
          onClick={testDirectUpdate}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          ✅ Start (Backend API v2)
        </button>
        <button 
          onClick={testResetUpdate}
          style={{
            backgroundColor: '#f59e0b',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Reset to NEW (Direct)
        </button>
      </div>
    </div>
  );
};

export default RealtimeTestComponent;
