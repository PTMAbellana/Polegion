import React from 'react';

interface PollingStatusProps {
  isConnected: boolean;
  connectionStatus: string;
  pollCount: number;
  participantCount: number;
}

export const PollingStatus: React.FC<PollingStatusProps> = ({ 
  isConnected, 
  connectionStatus, 
  pollCount, 
  participantCount 
}) => {
  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: isConnected ? '#4CAF50' : '#f44336',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      minWidth: '200px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      <div><strong>📡 Polling Status</strong></div>
      <div>Status: {connectionStatus}</div>
      <div>Updates: #{pollCount}</div>
      <div>Participants: {participantCount}</div>
      <div style={{
        display: 'inline-block',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: isConnected ? '#fff' : '#ffcccb',
        marginRight: '4px',
        animation: isConnected ? 'pulse 2s infinite' : 'none'
      }} />
      {isConnected ? 'Live' : 'Disconnected'}
    </div>
  );
};
