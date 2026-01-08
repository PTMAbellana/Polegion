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
    // Representation changes (Grade 6 UX: simplified language, emojis, max 10 words)
    if (mdpAction === 'switch_to_visual_example' || mdpAction === 'switch_to_visual') {
      return {
        title: "Let's try pictures! 🖼️",
        message: "Your next question will have drawings to help.",
        bgColor: 'rgba(139, 100, 60, 0.08)',
        iconBg: '#b8860b',
        icon: '🎨'
      };
    }
    
    if (mdpAction === 'switch_to_real_world_context' || mdpAction === 'switch_to_real_world') {
      return {
        title: "Real-life example! 🌍",
        message: "This question shows how you'd use this in real life.",
        bgColor: 'rgba(34, 139, 34, 0.1)',
        iconBg: '#228b22',
        icon: '🌟'
      };
    }
    
    if (mdpAction === 'give_hint_then_retry' || mdpAction === 'give_hint_retry') {
      return {
        title: "Here's a hint! 💡",
        message: "This clue will help you solve it.",
        bgColor: 'rgba(218, 165, 32, 0.15)',
        iconBg: '#daa520',
        icon: '💡'
      };
    }
    
    if (mdpAction === 'decrease_difficulty') {
      return {
        title: "Let's practice! 📚",
        message: "Let's try some easier problems first.",
        bgColor: 'rgba(139, 100, 60, 0.1)',
        iconBg: '#8b7355',
        icon: '📚'
      };
    }
    
    if (mdpAction === 'increase_difficulty') {
      // Only show positive message if answer was actually correct
      // During exploration, increase_difficulty can be chosen randomly even after wrong answers
      const wasCorrect = isCorrect === true || (correctStreak > 0 && wrongStreak === 0);
      return {
        title: wasCorrect ? "You're ready! 🚀" : "Let's adjust ⚖️",
        message: wasCorrect 
          ? "Great job! Time for a bigger challenge." 
          : "Let's find the perfect challenge level for you.",
        bgColor: wasCorrect ? 'rgba(34, 139, 34, 0.1)' : 'rgba(139, 100, 60, 0.08)',
        iconBg: wasCorrect ? '#228b22' : '#b8860b',
        icon: wasCorrect ? '🚀' : '⚖️'
      };
    }
    
    if (mdpAction === 'advance_topic') {
      return {
        title: "You mastered it! 🏆",
        message: "Amazing! You're ready for new topics.",
        bgColor: 'rgba(218, 165, 32, 0.15)',
        iconBg: '#daa520',
        icon: '🏆'
      };
    }
    
    if (mdpAction === 'review_prerequisite') {
      return {
        title: "Quick review! 📖",
        message: "Let's refresh what we learned before.",
        bgColor: 'rgba(139, 100, 60, 0.08)',
        iconBg: '#8b7355',
        icon: '📖'
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
          backgroundColor: '#f4e9d9',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          border: '3px solid #daa520',
          boxShadow: '0 4px 12px rgba(139, 100, 60, 0.2)',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #f4e9d9 0%, #ecdcc4 50%, #f4e9d9 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#b8860b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#fef5e7',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
              fontFamily: 'Cinzel, serif'
            }}>
              AI
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '14px', 
                fontWeight: 700, 
                color: '#654321',
                margin: '0 0 8px 0',
                fontFamily: 'Cinzel, serif',
                textShadow: '0 0.5px 1px rgba(139, 100, 60, 0.15)'
              }}>
                {wrongStreak >= 2 ? 'AI Hint' : 'AI Tutor'}
                {hintMetadata && (
                  <span style={{ fontSize: '11px', fontWeight: 400, color: '#8b7355', marginLeft: '8px', fontFamily: 'Georgia, serif' }}>
                    ({hintMetadata.source === 'ai' || hintMetadata.source === 'ai-cached' ? 'AI-powered' : 'Rule-based'})
                  </span>
                )}
              </h3>
              <div style={{ 
                fontSize: '13px', 
                color: '#3d2817',
                lineHeight: '1.7',
                fontFamily: 'Georgia, serif',
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
          backgroundColor: '#f4e9d9',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '12px',
          border: `3px solid ${feedback.iconBg}`,
          boxShadow: '0 4px 12px rgba(139, 100, 60, 0.2)',
          transition: 'all 0.3s ease',
          background: 'linear-gradient(135deg, #f4e9d9 0%, #ecdcc4 50%, #f4e9d9 100%)'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              backgroundColor: feedback.iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              flexShrink: 0,
              boxShadow: '0 3px 8px rgba(0, 0, 0, 0.2)'
            }}>
              {feedback.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '15px', 
                fontWeight: 700, 
                color: '#654321',
                margin: '0 0 6px 0',
                fontFamily: 'Cinzel, serif',
                textShadow: '0 0.5px 1px rgba(139, 100, 60, 0.15)'
              }}>
                {feedback.title}
              </h3>
              <p style={{ 
                fontSize: '13px', 
                color: '#8b7355',
                margin: 0,
                lineHeight: '1.6',
                fontFamily: 'Georgia, serif'
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
