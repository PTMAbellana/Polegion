import React from 'react';

interface RealtimeDebugProps {
  competitionId: string | number;
  isConnected?: boolean;
  connectionStatus?: string;
  pollCount?: number;
}

export const RealtimeDebug: React.FC<RealtimeDebugProps> = ({ 
  competitionId, 
  isConnected, 
  connectionStatus: externalStatus, 
  pollCount: externalPollCount 
}) => {
  // Just display the status from the main hook, no separate connection
  // This eliminates the channel conflict issue

  // Flash effect when updates are received
  const flashStyle = externalPollCount && externalPollCount > 0 ? {
    backgroundColor: '#00ff00',
    transition: 'background-color 0.2s'
  } : {};

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#000',
      color: '#00ff00',
      padding: '10px',
      borderRadius: '5px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px',
      border: externalPollCount && externalPollCount > 0 ? '2px solid #00ff00' : '1px solid #333',
      ...flashStyle
    }}>
      <div><strong>🐛 REALTIME DEBUG</strong></div>
      <div>Competition: {competitionId}</div>
      <div>Hook Status: <span style={{color: externalStatus === 'CONNECTED' ? '#00ff00' : '#ff0000'}}>{externalStatus || 'UNKNOWN'}</span></div>
      <div>Hook Connected: <span style={{color: isConnected ? '#00ff00' : '#ff0000'}}>{isConnected ? 'YES' : 'NO'}</span></div>
      <div style={{color: '#ffff00'}}>Hook Updates: <strong>{externalPollCount || 0}</strong></div>
      <div style={{marginTop: '5px', fontSize: '10px', color: '#ffff00'}}>
        ℹ️ Click test buttons below to trigger updates
      </div>
      {externalPollCount && externalPollCount > 0 && (
        <div style={{marginTop: '5px', fontSize: '10px', color: '#00ff00', fontWeight: 'bold'}}>
          🎉 REALTIME WORKING!
        </div>
      )}
    </div>
  );
};
