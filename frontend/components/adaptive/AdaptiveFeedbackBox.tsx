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
  isCorrect?: boolean; // NEW: Track if last answer was correct
}

export default function AdaptiveFeedbackBox({ 
  mdpAction, 
  wrongStreak,
  correctStreak,
  actionReason,
  pedagogicalStrategy,
  representationType,
  aiExplanation,
  hintMetadata,
  isCorrect
}: AdaptiveFeedbackBoxProps) {
  
  const getFeedbackContent = () => {
    // Representation changes
    if (mdpAction === 'switch_to_visual_example' || mdpAction === 'switch_to_visual') {
      return {
        title: "Trying a visual approach",
        message: "The next question will include visual cues and descriptions to help you understand.",
        bgColor: '#EFF6FF',
        iconBg: '#3B82F6',
        icon: 'V'
      };
    }
    
    if (mdpAction === 'switch_to_real_world_context' || mdpAction === 'switch_to_real_world') {
      return {
        title: "Making it practical",
        message: "This question has been transformed to show a real-world application.",
        bgColor: '#F0FDF4',
        iconBg: '#10B981',
        icon: 'R'
      };
    }
    
    if (mdpAction === 'give_hint_then_retry' || mdpAction === 'give_hint_retry') {
      return {
        title: "Here's a hint",
        message: "This clue should help you solve the problem.",
        bgColor: '#FEF3C7',
        iconBg: '#F59E0B',
        icon: 'H'
      };
    }
    
    if (mdpAction === 'decrease_difficulty') {
      return {
        title: "Adjusting difficulty",
        message: "Let's practice with simpler examples first.",
        bgColor: '#F3F4F6',
        iconBg: '#6B7280',
        icon: '↓'
      };
    }
    
    if (mdpAction === 'increase_difficulty') {
      // Only show positive message if answer was actually correct
      // During exploration, increase_difficulty can be chosen randomly even after wrong answers
      const wasCorrect = isCorrect === true || (correctStreak > 0 && wrongStreak === 0);
      return {
        title: wasCorrect ? "Ready for more" : "Adjusting difficulty",
        message: wasCorrect 
          ? "Great work! Let's try a more challenging problem." 
          : "Let's try a different difficulty level to find the right challenge for you.",
        bgColor: wasCorrect ? '#F0FDF4' : '#EFF6FF',
        iconBg: wasCorrect ? '#10B981' : '#6B7280',
        icon: '↑'
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
        icon: '↻'
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
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'white',
              flexShrink: 0
            }}>
              AI
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: 600, 
                color: '#1F2937',
                margin: '0 0 8px 0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {wrongStreak >= 2 ? 'AI Hint' : 'AI Tutor'}
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
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '16px',
          border: `2px solid ${feedback.iconBg}`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: feedback.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}>
              {feedback.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: 700, 
                color: '#1F2937',
                margin: '0 0 8px 0',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                {feedback.title}
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6B7280',
                margin: 0,
                lineHeight: '1.6',
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
