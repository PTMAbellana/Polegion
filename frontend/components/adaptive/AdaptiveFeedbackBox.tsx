'use client';

interface AdaptiveFeedbackBoxProps {
  mdpAction: string;
  wrongStreak: number;
  correctStreak: number;
  actionReason?: string;
  pedagogicalStrategy?: string;
  representationType?: string;
  aiExplanation?: string; // AI-generated hint or explanation
  hintMetadata?: { source: string; reason: string }; // Hint generation metadata
}

export default function AdaptiveFeedbackBox({ 
  mdpAction, 
  wrongStreak,
  correctStreak,
  actionReason,
  pedagogicalStrategy,
  representationType,
  aiExplanation,
  hintMetadata
}: AdaptiveFeedbackBoxProps) {
  
  const getFeedbackContent = () => {
    // Representation changes
    if (mdpAction === 'switch_to_visual_example' || mdpAction === 'switch_to_visual') {
      return {
        title: "Trying a visual approach",
        message: "The next question will include visual cues and descriptions to help you understand.",
        bgColor: '#EFF6FF',
        iconBg: '#3B82F6',
        icon: '📊'
      };
    }
    
    if (mdpAction === 'switch_to_real_world_context' || mdpAction === 'switch_to_real_world') {
      return {
        title: "Making it practical",
        message: "This question has been transformed to show a real-world application.",
        bgColor: '#F0FDF4',
        iconBg: '#10B981',
        icon: '🌍'
      };
    }
    
    if (mdpAction === 'give_hint_then_retry' || mdpAction === 'give_hint_retry') {
      return {
        title: "Here's a hint",
        message: "This clue should help you solve the problem.",
        bgColor: '#FEF3C7',
        iconBg: '#F59E0B',
        icon: '💡'
      };
    }
    
    if (mdpAction === 'decrease_difficulty') {
      return {
        title: "Adjusting difficulty",
        message: "Let's practice with simpler examples first.",
        bgColor: '#F3F4F6',
        iconBg: '#6B7280',
        icon: '📉'
      };
    }
    
    if (mdpAction === 'increase_difficulty') {
      return {
        title: "Ready for more",
        message: "Great work! Let's try a more challenging problem.",
        bgColor: '#F0FDF4',
        iconBg: '#10B981',
        icon: '📈'
      };
    }
    
    if (mdpAction === 'advance_topic') {
      return {
        title: "Topic mastered!",
        message: "You're ready to move on to new concepts.",
        bgColor: '#FEF3C7',
        iconBg: '#F59E0B',
        icon: '✓'
      };
    }
    
    if (mdpAction === 'review_prerequisite') {
      return {
        title: "Quick review",
        message: "Let's refresh some foundational concepts.",
        bgColor: '#EFF6FF',
        iconBg: '#3B82F6',
        icon: '↺'
      };
    }
    
    return null;
  };

  const feedback = getFeedbackContent();
  
  // If no feedback and no AI explanation, return null
  if (!feedback && !aiExplanation) return null;

  return (
    <>
      {/* AI Explanation Box - Displayed First */}
      {aiExplanation && (
        <div style={{
          backgroundColor: '#FEFCE8',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          border: '2px solid #FDE047',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EAB308',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0
            }}>
              🤖
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#1F2937',
                margin: '0 0 8px 0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {wrongStreak >= 2 ? '💡 AI Hint' : '🤖 AI Tutor'}
                {hintMetadata && (
                  <span style={{ fontSize: '11px', fontWeight: 400, color: '#6B7280', marginLeft: '8px' }}>
                    ({hintMetadata.source === 'ai' || hintMetadata.source === 'ai-cached' ? 'AI-powered' : 'Rule-based'})
                  </span>
                )}
              </h3>
              <div style={{ 
                fontSize: '14px', 
                color: '#374151',
                lineHeight: '1.7',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                whiteSpace: 'pre-wrap'
              }}>
                {aiExplanation}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MDP Action Feedback Box */}
      {feedback && (
        <div style={{
          backgroundColor: feedback.bgColor,
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '20px',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: feedback.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0
            }}>
              {feedback.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#1F2937',
                margin: '0 0 4px 0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {feedback.title}
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#4B5563',
                margin: 0,
                lineHeight: '1.5',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {feedback.message}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
