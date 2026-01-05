'use client';

import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import MasteryProgressBar from './MasteryProgressBar';
import AdaptiveFeedbackBox from './AdaptiveFeedbackBox';
import LearningInteractionRenderer from './LearningInteractionRenderer';
import CelebrationModal from './CelebrationModal';
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
  aiExplanation?: string;
  aiHint?: string;
  hintMetadata?: { source: string; reason: string };
  chapterUnlocked?: {
    chapterId: number;
    chapterName: string;
    message: string;
  };
  topicUnlocked?: {
    unlocked: boolean;
    topic: any;
    message: string;
  };
  masteryAchieved?: {
    level: number;
    message: string;
    celebration: string;
  };
  attemptCount?: number;
  showHint?: boolean;
  hint?: string;
  keepQuestion?: boolean;
  generateSimilar?: boolean;
}

interface AdaptiveLearningProps {
  topicId: string;
  topicName?: string;
  onChangeTopic?: () => void;
}

export default function AdaptiveLearning({ topicId, topicName: topicNameProp, onChangeTopic }: AdaptiveLearningProps) {
  const [state, setState] = useState<AdaptiveState | null>(null);
  const [lastResponse, setLastResponse] = useState<AdaptiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [showChapterUnlock, setShowChapterUnlock] = useState(false);
  const [unlockedChapter, setUnlockedChapter] = useState<any>(null);
  const [showHintModal, setShowHintModal] = useState(false);
  const [hintText, setHintText] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [currentQuestionData, setCurrentQuestionData] = useState<any>(null);
  const [showTopicUnlock, setShowTopicUnlock] = useState(false);
  const [unlockedTopic, setUnlockedTopic] = useState<any>(null);
  const [showMastery, setShowMastery] = useState(false);
  const [masteryData, setMasteryData] = useState<any>(null);
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const [pendingHint, setPendingHint] = useState<string | null>(null);
  const [topicName, setTopicName] = useState<string>(topicNameProp || 'Geometry Topic');

  const generateNewQuestion = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching
      const response = await axios.get(`/adaptive/question/${topicId}?t=${Date.now()}`);
      
      console.log('[AdaptiveLearning] Question API response:', response.data);
      
      if (response.data.success) {
        const questionData = response.data.data;
        console.log('[AdaptiveLearning] Setting question:', questionData);
        setCurrentQuestion({
          question: questionData.question,
          options: questionData.options,
          questionId: questionData.questionId,
          hint: questionData.hint
        });
      } else {
        console.error('[AdaptiveLearning] Question API returned success=false');
      }
    } catch (error) {
      console.error('[AdaptiveLearning] Error generating question:', error);
      setCurrentQuestion({
        question: 'Unable to load question. Please try again.',
        options: [{ label: 'Retry', correct: false }]
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchState = async () => {
    try {
      setLoading(true);
      const stateResponse = await axios.get(`/adaptive/state/${topicId}?t=${Date.now()}`);
      const stateData = stateResponse.data.data;
      setState(stateData);
      
      if (topicNameProp) {
        setTopicName(topicNameProp);
      }
      
      await generateNewQuestion();
      // Don't send sessionId - let backend generate it
      setSessionId('');
    } catch (error) {
      console.error('Error fetching state:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [topicId]);

  const submitAnswer = async (isCorrect: boolean, selectedOption: any) => {
    try {
      setSubmitting(true);
      
      const questionData = {
        questionText: currentQuestion?.question,
        options: currentQuestion?.options,
        correctAnswer: currentQuestion?.options.find((opt: any) => opt.correct)?.label,
        userAnswer: selectedOption?.label || selectedOption?.text
      };
      
      const response = await axios.post('/adaptive/submit-answer-enhanced', {
        topicId,
        questionId: currentQuestion?.questionId || currentQuestion?.id || null,
        isCorrect,
        timeSpent: Math.floor(Math.random() * 60) + 30,
        questionData
      });

      const responseData = response.data.data;
      setLastResponse(responseData);
      
      // Always refresh state after submission to get latest mastery
      const stateResponse = await axios.get(`/adaptive/state/${topicId}?t=${Date.now()}`);
      setState(stateResponse.data.data);
      
      if (isCorrect) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
        
        if (responseData.topicUnlocked && responseData.topicUnlocked.unlocked) {
          setUnlockedTopic(responseData.topicUnlocked);
          setTimeout(() => setShowTopicUnlock(true), 2100);
        }

        if (responseData.masteryAchieved) {
          setMasteryData(responseData.masteryAchieved);
          setTimeout(() => setShowMastery(true), responseData.topicUnlocked ? 6000 : 2100);
        }
        
        // Generate next question
        await generateNewQuestion();
      } else {
        if (responseData.showHint && responseData.hint) {
          setHintText(responseData.hint);
          setShowHintModal(true);
          setCurrentQuestionData(currentQuestion);
        } else {
          // Generate similar or new question
          if (responseData.generateSimilar) {
            await generateNewQuestion();
          } else if (!responseData.keepQuestion) {
            await generateNewQuestion();
          }
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleHintClose = async () => {
    setShowHintModal(false);
    setHintText(null);
    const stateResponse = await axios.get(`/adaptive/state/${topicId}?t=${Date.now()}`);
    setState(stateResponse.data.data);
  };

  if (loading) {
    return <Loader />;
  }

  if (!state) {
    return (
      <div className="adaptive-error-container">
        <div className="adaptive-error-content">
          <p>Unable to load adaptive learning state. Please refresh the page.</p>
        </div>
        <style jsx>{`
          .adaptive-error-container {
            min-height: 100vh;
            background: #F9FAFB;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }
          .adaptive-error-content {
            text-align: center;
            max-width: 400px;
          }
          .adaptive-error-content p {
            font-size: 16px;
            color: #6B7280;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        `}</style>
      </div>
    );
  }

  const currentRepresentation = (lastResponse?.representationType || state.currentRepresentation || 'text') as 'text' | 'visual' | 'real_world';

  return (
    <div className="adaptive-learning-container">
      <style jsx>{`
        .adaptive-learning-container {
          height: 100vh;
          background: #F5F7FA;
          overflow: hidden;
          display: grid;
          grid-template-columns: 280px 1fr 360px;
        }
        
        .sidebar {
          background: white;
          border-right: 1px solid #E5E7EB;
          padding: 24px 20px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          overflow-y: auto;
        }
        
        .content-area {
          padding: 32px;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .feedback-rail {
          background: white;
          border-left: 1px solid #E5E7EB;
          padding: 24px 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .topic-header-label {
          font-size: 12px;
          font-weight: 600;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .topic-header-title {
          font-size: 16px;
          font-weight: 700;
          color: #1F2937;
          margin: 0;
          line-height: 1.3;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .mastery-card {
          background: #F9FAFB;
          border-radius: 12px;
          padding: 16px;
        }
        
        .mastery-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        
        .mastery-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .mastery-percentage {
          font-size: 18px;
          font-weight: 700;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #E5E7EB;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-fill {
          height: 100%;
          transition: width 0.4s ease;
          border-radius: 4px;
        }
        
        .stat-chip {
          background: white;
          border: 1px solid #E5E7EB;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .change-topic-button {
          width: 100%;
          background: #EEF2FF;
          border: 1px solid #C7D2FE;
          color: #4338CA;
          border-radius: 10px;
          padding: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 10px 18px rgba(67, 56, 202, 0.15);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          transition: all 0.2s;
        }
        
        .change-topic-button:hover {
          background: #E0E7FF;
          transform: translateY(-1px);
          box-shadow: 0 12px 20px rgba(67, 56, 202, 0.2);
        }
        
        .question-card {
          width: 100%;
          max-width: 900px;
        }
        
        .feedback-header {
          font-size: 11px;
          font-weight: 700;
          color: #92400E;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .motivational-text {
          margin-top: auto;
          padding: 16px;
          background: #FFFBEB;
          border-radius: 8px;
          border: 1px solid #FDE68A;
          text-align: center;
          font-size: 13px;
          color: #92400E;
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        .hint-box {
          margin-top: 14px;
          background: white;
          border-radius: 10px;
          padding: 14px;
          border: 1px solid #E5E7EB;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="topic-header-label">Current Topic</div>
          <h2 className="topic-header-title">{topicName}</h2>
        </div>

        <div className="mastery-card">
          <div className="mastery-row">
            <span className="mastery-label">Mastery</span>
            <span className="mastery-percentage" style={{
              color: state.masteryLevel >= 75 ? '#10B981' : state.masteryLevel >= 50 ? '#3B82F6' : '#94A3B8'
            }}>
              {Math.round(state.masteryLevel)}%
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{
              background: state.masteryLevel >= 75 ? '#10B981' : state.masteryLevel >= 50 ? '#3B82F6' : '#94A3B8',
              width: `${Math.round(state.masteryLevel)}%`
            }} />
          </div>
        </div>

        {state.currentCognitiveDomain && (
          <div style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: '8px',
            padding: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>Learning Style</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#3B82F6' }}>
              🧠 {state.cognitiveDomainLabel || 'Thinking'}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="stat-chip">
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📝</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Attempted</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#1F2937' }}>{state.totalAttempts}</div>
            </div>
          </div>

          <div className="stat-chip" style={{
            background: state.correctStreak >= 3 ? '#ECFDF5' : 'white',
            border: `1px solid ${state.correctStreak >= 3 ? '#A7F3D0' : '#E5E7EB'}`
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: state.correctStreak >= 3 ? '#10B981' : '#F3F4F6',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>
              {state.correctStreak >= 3 ? '🔥' : '✓'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>Streak</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: state.correctStreak >= 3 ? '#10B981' : '#1F2937' }}>
                {state.correctStreak}
              </div>
            </div>
          </div>
        </div>

        {onChangeTopic && (
          <button onClick={onChangeTopic} className="change-topic-button">
            Change topic
          </button>
        )}

        <div className="motivational-text">
          {state.masteryLevel >= 85 ? "🎉 Amazing work!" :
           state.masteryLevel >= 70 ? "⭐ You're doing great!" :
           state.masteryLevel >= 50 ? "💪 Keep going!" : "🌟 Let's learn!"}
        </div>
      </div>

      {/* Modals - Outside grid flow */}
      <CelebrationModal
        type="unlock"
        title="Topic Unlocked!"
        message={unlockedTopic?.message || "Great job! You've unlocked the next topic!"}
        onClose={() => { setShowTopicUnlock(false); setUnlockedTopic(null); }}
        show={showTopicUnlock}
      />

      <CelebrationModal
        type="mastery"
        title="Mastery Achieved!"
        message={masteryData?.message || "🎉 Congratulations! You've mastered this topic!"}
        onClose={() => { setShowMastery(false); setMasteryData(null); }}
        show={showMastery}
      />

      {showHintModal && hintText && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 60,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '20px', padding: '40px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '600px', width: '90%', border: '3px solid #F59E0B'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px', textAlign: 'center' }}>💡</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#F59E0B', marginBottom: '16px', textAlign: 'center' }}>
              Learning Hint
            </div>
            <div style={{
              fontSize: '16px', color: '#1F2937', marginBottom: '24px', lineHeight: '1.7',
              padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px', borderLeft: '4px solid #F59E0B'
            }}>
              {hintText}
            </div>
            <button onClick={handleHintClose} style={{
              backgroundColor: '#F59E0B', color: 'white', border: 'none',
              borderRadius: '12px', padding: '14px 32px', fontSize: '16px',
              fontWeight: 600, cursor: 'pointer', width: '100%'
            }}>
              I Understand, Continue
            </button>
          </div>
        </div>
      )}

      {showCelebration && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '16px', padding: '40px',
            textAlign: 'center', maxWidth: '320px'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
            <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#10B981', margin: 0 }}>Correct!</h2>
          </div>
        </div>
      )}

      {/* Center Column: Question */}
      <div className="content-area">
        <div className="question-card">
          <LearningInteractionRenderer
            representationType={currentRepresentation}
            difficultyLevel={state.currentDifficulty}
            onAnswer={submitAnswer}
            disabled={submitting}
            question={currentQuestion}
          />
        </div>
      </div>

      {/* Right Column: Feedback/Hints */}
      <div className="feedback-rail">
        <div className="feedback-header">💡 Learning Feedback</div>
        {lastResponse ? (
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
        ) : (
          <div style={{
            background: 'white', borderRadius: '10px', padding: '14px',
            border: '1px dashed #FBBF24', color: '#92400E', fontSize: '13px', lineHeight: 1.5
          }}>
            Hints and feedback will appear here as you answer questions. Give the first one a try!
          </div>
        )}

        <div className="hint-box">
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#6B7280', marginBottom: '6px' }}>Hint</div>
          <div style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
            {currentQuestion?.hint || 'Hints will show up here once available.'}
          </div>
        </div>
      </div>
    </div>
  );
}
