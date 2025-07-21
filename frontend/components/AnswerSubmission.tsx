import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

interface AnswerSubmissionProps {
  competitionId: string;
  participantId: string;
  currentProblem: any;
  isActive: boolean;
  onSubmit: (answer: any) => void;
}

export const AnswerSubmission = ({ 
  competitionId, 
  participantId, 
  currentProblem, 
  isActive,
  onSubmit 
}: AnswerSubmissionProps) => {
  const [answer, setAnswer] = useState<any>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Listen for timer updates
  useEffect(() => {
    if (!competitionId) return;

    const timerChannel = supabase
      .channel(`timer-${competitionId}`)
      .on('broadcast', { event: 'timer_update' }, (payload) => {
        setTimeLeft(payload.payload.time_remaining || 0);
        
        // Auto-submit when time runs out
        if (payload.payload.time_remaining <= 0 && answer && !isSubmitted) {
          handleSubmit();
        }
      })
      .subscribe();

    return () => supabase.removeChannel(timerChannel);
  }, [competitionId, answer, isSubmitted]);

  // Reset when problem changes
  useEffect(() => {
    setAnswer(null);
    setIsSubmitted(false);
  }, [currentProblem?.id]);

  const handleSubmit = async () => {
    if (!answer || isSubmitted) return;

    try {
      const { error } = await supabase
        .from('competition_attempts')
        .insert({
          competition_id: competitionId,
          participant_id: participantId,
          problem_id: currentProblem.id,
          answer: answer,
          time_taken: (currentProblem.timer || 30) - timeLeft,
        });

      if (error) throw error;
      
      setIsSubmitted(true);
      onSubmit(answer);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!currentProblem || !isActive) {
    return (
      <div className="answer-submission waiting">
        <h3>🎯 Waiting for next problem...</h3>
        <p>Get ready! The instructor will start the next problem soon.</p>
      </div>
    );
  }

  return (
    <div className="answer-submission active">
      <div className="problem-header">
        <h3>{currentProblem.title || 'Geometry Problem'}</h3>
        <div className="timer-display">
          ⏱️ {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      <div className="problem-description">
        <p>{currentProblem.description}</p>
      </div>
      
      <div className="problem-canvas">
        {/* Your geometry problem canvas goes here */}
        {/* This would integrate with your existing shape components */}
      </div>
      
      <div className="answer-section">
        {!isSubmitted ? (
          <button 
            onClick={handleSubmit}
            disabled={!answer || timeLeft <= 0}
            className="submit-button"
          >
            Submit Answer
          </button>
        ) : (
          <div className="submitted-status">
            ✅ Answer Submitted! Waiting for results...
          </div>
        )}
      </div>
      
      <style jsx>{`
        .answer-submission {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          margin: 1rem 0;
        }
        
        .answer-submission.waiting {
          text-align: center;
          background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
        }
        
        .problem-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 1rem;
        }
        
        .timer-display {
          font-size: 1.2rem;
          font-weight: bold;
          color: ${timeLeft < 10 ? '#ef4444' : '#059669'};
          animation: ${timeLeft < 10 ? 'pulse 1s infinite' : 'none'};
        }
        
        .problem-canvas {
          min-height: 300px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          margin: 1rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f9fafb;
        }
        
        .submit-button {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border: none;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          width: 100%;
        }
        
        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .submitted-status {
          text-align: center;
          padding: 1rem;
          background: rgba(16, 185, 129, 0.1);
          border: 2px solid rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          color: #059669;
          font-weight: 600;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
