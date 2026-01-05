'use client';

interface MasteryProgressBarProps {
  masteryLevel: number;
  currentTopic?: string;
  cognitiveDomain?: string;
  cognitiveDomainLabel?: string;
}

export default function MasteryProgressBar({ 
  masteryLevel, 
  currentTopic = 'Geometry',
  cognitiveDomain,
  cognitiveDomainLabel
}: MasteryProgressBarProps) {
  // Calculate mastery level (1-5) from percentage
  const getMasteryLevelFromPercentage = (): number => {
    if (masteryLevel >= 90) return 5;
    if (masteryLevel >= 75) return 4;
    if (masteryLevel >= 60) return 3;
    if (masteryLevel >= 40) return 2;
    if (masteryLevel >= 20) return 1;
    return 0;
  };

  const masteryLevelNum = getMasteryLevelFromPercentage();
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

  const getCognitiveDomainColor = (domain: string) => {
    const colors: Record<string, string> = {
      'knowledge_recall': '#8B5CF6',      // Purple
      'concept_understanding': '#3B82F6', // Blue
      'procedural_skills': '#10B981',     // Green
      'analytical_thinking': '#F59E0B',   // Amber
      'problem_solving': '#EF4444',       // Red
      'higher_order_thinking': '#EC4899'  // Pink
    };
    return colors[domain] || '#6B7280';
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
          
          {/* Cognitive Domain Badge */}
          {cognitiveDomain && cognitiveDomainLabel && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              marginTop: '8px',
              padding: '4px 12px',
              backgroundColor: getCognitiveDomainColor(cognitiveDomain) + '15',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 500,
              color: getCognitiveDomainColor(cognitiveDomain),
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              <span style={{ marginRight: '6px' }}>🧠</span>
              {cognitiveDomainLabel}
            </div>
          )}
        </div>
        
        {/* Mastery container: Level (left) + Percentage (right) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Level indicator on left */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: getBarColor() + '20',
              border: `2px solid ${getBarColor()}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 700,
              color: getBarColor(),
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {masteryLevelNum}
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#6B7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Level
            </span>
          </div>

          {/* Percentage on right */}
          <div style={{ 
            fontSize: '24px', 
            fontWeight: 700, 
            color: getBarColor(),
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {Math.round(masteryLevel)}%
          </div>
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
