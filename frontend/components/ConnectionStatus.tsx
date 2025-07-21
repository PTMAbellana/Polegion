import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
  connectionStatus: string;
  className?: string;
  showLabel?: boolean;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  isConnected, 
  connectionStatus, 
  className = '',
  showLabel = true
}) => {
  // Use connectionStatus first, then fallback to isConnected
  const actualStatus = connectionStatus || (isConnected ? 'CONNECTED' : 'DISCONNECTED');
  
  const getStatusColor = () => {
    switch (actualStatus) {
      case 'CONNECTED':
        return 'text-green-600 bg-green-100';
      case 'CONNECTING':
        return 'text-yellow-600 bg-yellow-100';
      case 'DISCONNECTED':
        return 'text-red-600 bg-red-100';
      case 'ERROR':
        return 'text-red-800 bg-red-200';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = () => {
    switch (actualStatus) {
      case 'CONNECTED':
        return '●';
      case 'CONNECTING':
        return '◐';
      case 'DISCONNECTED':
        return '○';
      case 'ERROR':
        return '✕';
      default:
        return '?';
    }
  };

  const getStatusText = () => {
    switch (actualStatus) {
      case 'CONNECTED':
        return 'Live';
      case 'CONNECTING':
        return 'Connecting...';
      case 'DISCONNECTED':
        return 'Disconnected';
      case 'ERROR':
        return 'Connection Error';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()} ${className}`}>
      <span className="text-sm">{getStatusIcon()}</span>
      {showLabel && (
        <span>{getStatusText()}</span>
      )}
    </div>
  );
};

// Hook version for easy integration
export const useConnectionStatus = () => {
  return { ConnectionStatus };
};
