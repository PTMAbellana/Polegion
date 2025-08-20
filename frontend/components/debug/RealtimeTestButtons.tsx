import React from 'react';
import { supabase } from '../../lib/supabaseClient';

interface RealtimeTestButtonsProps {
  competitionId: string | number;
  onUpdateCompetition?: () => void;
}

const RealtimeTestButtons: React.FC<RealtimeTestButtonsProps> = ({ 
  competitionId, 
  onUpdateCompetition 
}) => {
  const testUpdate = async () => {
    try {
      console.log('🧪 [Test] Broadcasting competition update for:', competitionId);
      
      // Send a broadcast message directly (no database needed!)
      const testData = {
        id: competitionId,
        status: 'ONGOING',
        last_updated: new Date().toISOString(),
        test_message: `Broadcast test at ${new Date().toLocaleTimeString()}`
      };
      
      const channel = supabase.channel(`competition-${competitionId}`);
      await channel.send({
        type: 'broadcast',
        event: 'competition_update',
        payload: testData
      });
      
      console.log('✅ [Test] Broadcast sent successfully:', testData);
      if (onUpdateCompetition) {
        onUpdateCompetition();
      }
    } catch (error) {
      console.error('❌ [Test] Error broadcasting:', error);
    }
  };

  const testStatusUpdate = async () => {
    try {
      console.log('🧪 [Test] Broadcasting timer update for:', competitionId);
      
      const timerData = {
        timer_started_at: new Date().toISOString(),
        timer_duration: 300, // 5 minutes
        timer_end_at: new Date(Date.now() + 300000).toISOString(),
        status: Math.random() > 0.5 ? 'ONGOING' : 'PAUSED'
      };
      
      const channel = supabase.channel(`competition-${competitionId}`);
      await channel.send({
        type: 'broadcast',
        event: 'timer_update',
        payload: timerData
      });
      
      console.log('✅ [Test] Timer broadcast sent:', timerData);
    } catch (error) {
      console.error('❌ [Test] Error broadcasting timer:', error);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      right: '10px',
      background: '#333',
      color: '#fff',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999
    }}>
      <div><strong>🧪 REALTIME TESTS</strong></div>
      <button 
        onClick={testUpdate}
        style={{
          background: '#007ACC',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '5px',
          marginRight: '5px'
        }}
      >
        Broadcast Test
      </button>
      <button 
        onClick={testStatusUpdate}
        style={{
          background: '#FF6B35',
          color: 'white',
          border: 'none',
          padding: '5px 10px',
          borderRadius: '3px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '5px'
        }}
      >
        Timer Test
      </button>
    </div>
  );
};

export { RealtimeTestButtons };