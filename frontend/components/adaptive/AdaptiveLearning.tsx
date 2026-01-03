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
}

interface AdaptiveLearningProps {
  chapterId: string;
}

/**
 * Child-Friendly Adaptive Learning Component
 * Designed for elementary students with visual learning emphasis
 */
export default function AdaptiveLearning({ chapterId }: AdaptiveLearningProps) {
  const [state, setState] = useState<AdaptiveState | null>(null);
  const [lastResponse, setLastResponse] = useState<AdaptiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Fetch current adaptive state
  const fetchState = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/adaptive/state/${chapterId}`);
      setState(response.data.data);
    } catch (error) {
      console.error('Error fetching adaptive state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [chapterId]);

  // Submit answer with celebration on correct
  const submitAnswer = async (isCorrect: boolean) => {
    try {
      setSubmitting(true);
      const response = await axios.post('/adaptive/submit-answer', {
        chapterId,
        questionId: `q-${Date.now()}`,
        isCorrect,
        timeSpent: Math.floor(Math.random() * 60) + 30
      });

      setLastResponse(response.data.data);
      
      if (isCorrect) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
      
      // Refresh state
      await fetchState();
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
          />
        )}

        {/* Learning Question */}
        <LearningInteractionRenderer
          representationType={currentRepresentation}
          difficultyLevel={state.currentDifficulty}
          onAnswer={submitAnswer}
          disabled={submitting}
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
