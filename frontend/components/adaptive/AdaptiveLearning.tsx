'use client';

import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import MasteryProgressBar from './MasteryProgressBar';
import AdaptiveFeedbackBox from './AdaptiveFeedbackBox';
import LearningInteractionRenderer from './LearningInteractionRenderer';
import Loader from '@/components/Loader';

interface AdaptiveState {
  currentDifficulty: number;
  difficultyLabel: string;
  masteryLevel: number;
  correctStreak: number;
  wrongStreak: number;
  totalAttempts: number;
  accuracy: string;
  currentRepresentation?: string;
  teachingStrategy?: string;
  currentCognitiveDomain?: string;
  cognitiveDomainLabel?: string;
  cognitiveDomainDescription?: string;
}

interface AdaptiveResponse {
  isCorrect: boolean;
  currentDifficulty: number;
  masteryLevel: number;
  action: string;
  actionReason: string;
  feedback: string;
  pedagogicalStrategy?: string;
  representationType?: string;
  aiExplanation?: string; // AI-generated explanation (backward compatibility)
  aiHint?: string; // AI-generated hint (new - only when wrong_streak >= 2)
  hintMetadata?: { source: string; reason: string }; // Hint generation metadata
  chapterUnlocked?: { // NEW: Chapter unlock notification
    chapterId: number;
    chapterName: string;
    message: string;
  };
}

interface AdaptiveLearningProps {
  topicId: string;
}

/**
 * Child-Friendly Adaptive Learning Component
 * Designed for elementary students with visual learning emphasis
 */
export default function AdaptiveLearning({ topicId }: AdaptiveLearningProps) {
  const [state, setState] = useState<AdaptiveState | null>(null);
  const [lastResponse, setLastResponse] = useState<AdaptiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showChapterUnlock, setShowChapterUnlock] = useState(false);
  const [unlockedChapter, setUnlockedChapter] = useState<any>(null);
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const [pendingHint, setPendingHint] = useState<string | null>(null);

  // Generate a new question by calling backend API
  const generateNewQuestion = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/adaptive/question/${topicId}`);
      
      if (response.data.success) {
        const questionData = response.data.data;
        setCurrentQuestion({
          question: questionData.question,
          options: questionData.options,
          questionId: questionData.questionId,
          hint: questionData.hint
        });
      }
    } catch (error) {
      console.error('Error generating question:', error);
      // Fallback error handling
      setCurrentQuestion({
        question: 'Unable to load question. Please try again.',
        options: [{ label: 'Retry', correct: false }]
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch current adaptive state
  const fetchState = async () => {
    try {
      setLoading(true);
      const stateResponse = await axios.get(`/adaptive/state/${topicId}`);
      const stateData = stateResponse.data.data;
      setState(stateData);
      
      // Generate first question
      await generateNewQuestion();
    } catch (error) {
      console.error('Error fetching state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [topicId]);

  // Submit answer with celebration on correct
  const submitAnswer = async (isCorrect: boolean, selectedOption: any) => {
    try {
      setSubmitting(true);
      
      // Prepare question data for AI explanation
      const questionData = {
        questionText: currentQuestion?.question,
        options: currentQuestion?.options,
        correctAnswer: currentQuestion?.options.find((opt: any) => opt.correct)?.label,
        userAnswer: selectedOption?.label || selectedOption?.text
      };
      
      const response = await axios.post('/adaptive/submit-answer', {
        topicId,
        questionId: currentQuestion?.id || null,
        isCorrect,
        timeSpent: Math.floor(Math.random() * 60) + 30,
        questionData // Send question data for AI explanation
      });

      const responseData = response.data.data;
      setLastResponse(responseData);
      
      if (isCorrect) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
        
        // Check for chapter unlock
        if (responseData.chapterUnlocked) {
          setUnlockedChapter(responseData.chapterUnlocked);
          setTimeout(() => {
            setShowChapterUnlock(true);
          }, 2100); // Show after celebration
        }
        
        // Refresh state and generate NEW question (only if correct)
        const stateResponse = await axios.get(`/adaptive/state/${topicId}`);
        setState(stateResponse.data.data);
        
        // Generate next question
        await generateNewQuestion();
      } else {
        // Wrong answer - check if hint should be shown
        if (responseData.aiExplanation) {
          // Show hint modal - keep current question visible
          setPendingHint(responseData.aiExplanation);
          setShowHintPrompt(true);
        } else {
          // No hint needed - move to next question immediately
          const stateResponse = await axios.get(`/adaptive/state/${topicId}`);
          setState(stateResponse.data.data);
          
          // Generate next question
          await generateNewQuestion();
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!state) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#F9FAFB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <p style={{ 
            fontSize: '16px', 
            color: '#6B7280',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Unable to load adaptive learning state. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  const currentRepresentation = (lastResponse?.representationType || state.currentRepresentation || 'text') as 'text' | 'visual' | 'real_world';

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB',
      padding: '24px 16px'
    }}>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Chapter Unlock Notification */}
        {showChapterUnlock && unlockedChapter && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '48px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              textAlign: 'center',
              maxWidth: '480px',
              border: '3px solid #10B981'
            }}>
              <div style={{ 
                fontSize: '80px', 
                marginBottom: '20px',
                filter: 'drop-shadow(0 10px 15px rgba(16, 185, 129, 0.3))'
              }}>
                🎉
              </div>
              <div style={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#10B981',
                marginBottom: '12px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Chapter Unlocked!
              </div>
              <div style={{
                fontSize: '18px',
                color: '#1F2937',
                marginBottom: '24px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                lineHeight: '1.6'
              }}>
                {unlockedChapter.message}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '24px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                You've achieved 60%+ mastery (Level 3/5) and unlocked the next chapter!
              </div>
              <button
                onClick={() => {
                  setShowChapterUnlock(false);
                  setUnlockedChapter(null);
                }}
                style={{
                  backgroundColor: '#10B981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  boxShadow: '0 4px 6px rgba(16, 185, 129, 0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#10B981';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(16, 185, 129, 0.3)';
                }}
              >
                Continue Learning
              </button>
            </div>
          </div>
        )}

        {/* Hint Acknowledgment Modal */}
        {showHintPrompt && pendingHint && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 60,
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '40px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              maxWidth: '600px',
              width: '90%',
              border: '3px solid #F59E0B'
            }}>
              <div style={{ 
                fontSize: '60px', 
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                💡
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                color: '#F59E0B',
                marginBottom: '16px',
                textAlign: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Learning Hint
              </div>
              <div style={{
                fontSize: '16px',
                color: '#1F2937',
                marginBottom: '24px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                lineHeight: '1.7',
                padding: '20px',
                backgroundColor: '#FEF3C7',
                borderRadius: '12px',
                borderLeft: '4px solid #F59E0B'
              }}>
                {pendingHint}
              </div>
              <div style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '20px',
                textAlign: 'center',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Read the hint carefully before continuing.
              </div>
              <button
                onClick={async () => {
                  setShowHintPrompt(false);
                  setPendingHint(null);
                  
                  // Now generate the next question
                  await generateNewQuestion();
                }}
                style={{
                  backgroundColor: '#F59E0B',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '14px 32px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)',
                  transition: 'all 0.2s',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#D97706';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 8px rgba(245, 158, 11, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#F59E0B';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(245, 158, 11, 0.3)';
                }}
              >
                I Understand, Continue
              </button>
            </div>
          </div>
        )}

        {/* Success Celebration */}
        {showCelebration && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '40px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              maxWidth: '320px'
            }}>
              <div style={{ 
                fontSize: '64px', 
                marginBottom: '16px',
                filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
              }}>
                ✓
              </div>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: 600, 
                color: '#10B981',
                margin: 0,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
              }}>
                Correct!
              </h2>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <MasteryProgressBar 
          masteryLevel={state.masteryLevel} 
          currentTopic="Geometry Shapes"
          cognitiveDomain={state.currentCognitiveDomain}
          cognitiveDomainLabel={state.cognitiveDomainLabel}
        />

        {/* Adaptive Feedback */}
        {lastResponse && (
          <AdaptiveFeedbackBox
            mdpAction={lastResponse.action}
            wrongStreak={state.wrongStreak}
            correctStreak={state.correctStreak}
            actionReason={lastResponse.actionReason}
            pedagogicalStrategy={lastResponse.pedagogicalStrategy}
            representationType={currentRepresentation}
            aiExplanation={lastResponse.aiHint || lastResponse.aiExplanation}
            hintMetadata={lastResponse.hintMetadata}
          />
        )}

        {/* Learning Question */}
        <LearningInteractionRenderer
          representationType={currentRepresentation}
          difficultyLevel={state.currentDifficulty}
          onAnswer={submitAnswer}
          disabled={submitting}
          question={currentQuestion}
        />

        {/* Stats Footer */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ 
              fontSize: '13px', 
              color: '#6B7280',
              marginBottom: '4px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Questions Attempted
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: '#1F2937',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {state.totalAttempts}
            </div>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#6B7280',
              marginBottom: '4px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Mastery Level
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 700, 
              color: state.masteryLevel >= 90 ? '#10B981' : state.masteryLevel >= 75 ? '#3B82F6' : state.masteryLevel >= 60 ? '#8B5CF6' : state.masteryLevel >= 40 ? '#F59E0B' : state.masteryLevel >= 20 ? '#EF4444' : '#6B7280',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {state.masteryLevel >= 90 ? '⭐ MASTERED (5/5)' : 
               state.masteryLevel >= 75 ? '💎 PROFICIENT (4/5)' : 
               state.masteryLevel >= 60 ? '🔓 DEVELOPING (3/5)' : 
               state.masteryLevel >= 40 ? '📚 BEGINNER (2/5)' :
               state.masteryLevel >= 20 ? '🌱 NOVICE (1/5)' : 
               '❓ NONE (0/5)'}
            </div>
            <div style={{ 
              fontSize: '11px', 
              color: '#9CA3AF',
              marginTop: '2px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {state.masteryLevel}% accuracy {state.masteryLevel >= 60 ? '• Unlocks next chapter!' : ''}
            </div>
          </div>
          
          <div style={{ textAlign: 'right' }}>
            <div style={{ 
              fontSize: '13px', 
              color: '#6B7280',
              marginBottom: '4px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              Current Streak
            </div>
            <div style={{ 
              fontSize: '20px', 
              fontWeight: 600, 
              color: state.correctStreak >= 3 ? '#10B981' : '#1F2937',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              {state.correctStreak} {state.correctStreak >= 3 ? '✓' : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
