'use client';

interface MasteryProgressBarProps {
  masteryLevel: number;
  currentTopic?: string;
}

export default function MasteryProgressBar({ masteryLevel, currentTopic = 'Geometry' }: MasteryProgressBarProps) {
  const getMasteryMessage = () => {
    if (masteryLevel >= 85) return "Excellent progress!";
    if (masteryLevel >= 70) return "You're doing great!";
    if (masteryLevel >= 50) return "Keep practicing!";
    if (masteryLevel >= 25) return "Good start!";
    return "Let's begin learning";
  };

  const getBarColor = () => {
    if (masteryLevel >= 85) return '#F59E0B'; // Amber
    if (masteryLevel >= 70) return '#10B981'; // Green
    if (masteryLevel >= 50) return '#3B82F6'; // Blue
    return '#94A3B8'; // Gray
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      padding: '24px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: '#1F2937',
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {currentTopic}
          </h3>
          <p style={{ 
            fontSize: '14px', 
            color: '#6B7280',
            margin: '4px 0 0 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {getMasteryMessage()}
          </p>
        </div>
        <div style={{ 
          fontSize: '24px', 
          fontWeight: 700, 
          color: getBarColor(),
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          {Math.round(masteryLevel)}%
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '12px',
        backgroundColor: '#F3F4F6',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative'
      }}>
        <div style={{
          height: '100%',
          backgroundColor: getBarColor(),
          width: `${Math.min(100, masteryLevel)}%`,
          transition: 'width 0.6s ease-out',
          borderRadius: '6px'
        }} />
      </div>
    </div>
  );
}
