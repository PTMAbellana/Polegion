'use client';

interface Topic {
  id: string;
  topic_name: string;
  cognitive_domain: string;
  unlocked: boolean;
  mastered: boolean;
  mastery_level: number; // 0-5
  mastery_percentage: number; // 0-100
  description?: string;
  topic_code?: string;
}

interface TopicSelectorProps {
  topics: Topic[];
  onTopicSelect: (topicId: string) => void;
  selectedTopicId?: string;
}

/**
 * TopicSelector Component
 * Displays all topics with lock/unlock/mastery status
 * - Locked topics: Gray with lock icon
 * - Unlocked topics: Colored, clickable
 * - Mastered topics: Green with checkmark
 */
export default function TopicSelector({ topics, onTopicSelect, selectedTopicId }: TopicSelectorProps) {
  const handleTopicClick = (topic: Topic) => {
    if (!topic.unlocked) {
      // Show message that topic is locked
      alert('This topic is locked. Complete previous topics to unlock!');
      return;
    }

    onTopicSelect(topic.id);
  };

  const getMasteryColor = (level: number) => {
    if (level === 0) return '#9CA3AF'; // Gray
    if (level === 1) return '#8b4513'; // Saddle Brown
    if (level === 2) return '#cd853f'; // Peru
    if (level === 3) return '#daa520'; // Goldenrod
    if (level === 4) return '#b8860b'; // Dark Goldenrod
    if (level === 5) return '#228b22'; // Forest Green
    return '#9CA3AF';
  };

  const getMasteryLabel = (level: number) => {
    if (level === 0) return 'Not Started';
    if (level === 1) return 'Beginner';
    if (level === 2) return 'Learning';
    if (level === 3) return 'Proficient';
    if (level === 4) return 'Advanced';
    if (level === 5) return 'Mastered';
    return 'Unknown';
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          fontFamily: 'Cinzel, serif',
          color: '#654321',
          textShadow: '0 1px 2px rgba(139, 100, 60, 0.2)',
          letterSpacing: '0.5px'
        }}
      >
        Geometry Topics
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '16px'
        }}
      >
        {topics.map((topic) => {
          const isSelected = topic.id === selectedTopicId;
          const isLocked = !topic.unlocked;
          const isMastered = topic.mastered;

          return (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic)}
              style={{
                backgroundColor: isLocked ? '#e8dcc4' : '#f4e9d9',
                border: `3px solid ${isSelected ? '#b8860b' : isLocked ? '#c4b5a0' : '#d4c4a8'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLocked ? 0.65 : 1,
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px rgba(184, 134, 11, 0.3)' : '0 2px 4px rgba(139, 100, 60, 0.1)',
                background: isLocked ? '#e8dcc4' : 'linear-gradient(135deg, #f4e9d9 0%, #ecdcc4 50%, #f4e9d9 100%)'
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(139, 100, 60, 0.25)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(184, 134, 11, 0.3)' : '0 2px 4px rgba(139, 100, 60, 0.1)';
                }
              }}
            >
              {/* Lock/Mastery Icon */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isLocked ? '#c4b5a0' : isMastered ? '#228b22' : 'transparent',
                  color: isLocked ? '#6B7280' : isMastered ? '#fef5e7' : 'transparent',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {isLocked ? 'L' : isMastered ? '✓' : ''}
              </div>

              {/* Topic Name */}
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  color: isLocked ? '#8b7355' : '#654321',
                  fontFamily: 'Cinzel, serif',
                  textShadow: '0 0.5px 1px rgba(139, 100, 60, 0.15)'
                }}
              >
                {topic.topic_name}
              </h3>

              {/* Cognitive Domain */}
              <p
                style={{
                  fontSize: '13px',
                  color: '#8b7355',
                  marginBottom: '12px',
                  textTransform: 'capitalize',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic'
                }}
              >
                {topic.cognitive_domain?.replace(/_/g, ' ') || 'Geometry'}
              </p>

              {/* Mastery Progress */}
              {!isLocked && (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px'
                    }}
                  >
                    <span
                      style={{
                        fontSize: '12px',
                        fontWeight: 'bold',
                        color: getMasteryColor(topic.mastery_level),
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      {getMasteryLabel(topic.mastery_level)}
                    </span>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                      }}
                    >
                      {topic.mastery_percentage?.toFixed(0) || 0}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div
                    style={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: 'rgba(139, 100, 60, 0.2)',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div
                      style={{
                        width: `${topic.mastery_percentage || 0}%`,
                        height: '100%',
                        backgroundColor: getMasteryColor(topic.mastery_level),
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>

                  {/* Mastery Level Indicators */}
                  <div style={{ marginTop: '12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: i < topic.mastery_level ? getMasteryColor(topic.mastery_level) : 'rgba(139, 100, 60, 0.2)',
                          transition: 'all 0.3s ease',
                          boxShadow: i < topic.mastery_level ? '0 1px 3px rgba(0, 0, 0, 0.2)' : 'none'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Locked Message */}
              {isLocked && (
                <div
                  style={{
                    marginTop: '12px',
                    padding: '8px',
                    backgroundColor: 'rgba(218, 165, 32, 0.15)',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#654321',
                    textAlign: 'center',
                    fontFamily: 'Georgia, serif',
                    fontWeight: 600,
                    border: '1px solid rgba(218, 165, 32, 0.3)'
                  }}
                >
                  🔒 Complete previous topics to unlock
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
