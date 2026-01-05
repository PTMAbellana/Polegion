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
    if (level === 1) return '#EF4444'; // Red
    if (level === 2) return '#F59E0B'; // Orange
    if (level === 3) return '#3B82F6'; // Blue
    if (level === 4) return '#8B5CF6'; // Purple
    if (level === 5) return '#10B981'; // Green
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
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: '#1F2937'
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
                backgroundColor: isLocked ? '#F3F4F6' : '#FFFFFF',
                border: `2px solid ${isSelected ? '#3B82F6' : isLocked ? '#E5E7EB' : '#D1D5DB'}`,
                borderRadius: '12px',
                padding: '20px',
                cursor: isLocked ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isLocked ? 0.6 : 1,
                position: 'relative',
                boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLocked) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isSelected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : 'none';
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
                  backgroundColor: isLocked ? '#E5E7EB' : isMastered ? '#10B981' : 'transparent',
                  color: isLocked ? '#6B7280' : isMastered ? '#FFFFFF' : 'transparent',
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
                  color: isLocked ? '#6B7280' : '#1F2937',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                }}
              >
                {topic.topic_name}
              </h3>

              {/* Cognitive Domain */}
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginBottom: '12px',
                  textTransform: 'capitalize',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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
                      backgroundColor: '#E5E7EB',
                      borderRadius: '4px',
                      overflow: 'hidden'
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
                          backgroundColor: i < topic.mastery_level ? getMasteryColor(topic.mastery_level) : '#E5E7EB',
                          transition: 'all 0.3s ease'
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
                    backgroundColor: '#FEF3C7',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#92400E',
                    textAlign: 'center',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                  }}
                >
                  Complete previous topics to unlock
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
