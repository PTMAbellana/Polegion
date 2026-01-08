'use client';

import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import MasteryProgressBar from './MasteryProgressBar';
import AdaptiveFeedbackBox from './AdaptiveFeedbackBox';
import LearningInteractionRenderer from './LearningInteractionRenderer';
import CelebrationModal from './CelebrationModal';
import CognitiveDomainRadar from './CognitiveDomainRadar';
import ExplanationModal from './ExplanationModal';
import WizardHelper from './WizardHelper';
import Loader from '@/components/Loader';

interface AdaptiveState {
  currentDifficulty: number;
  difficultyLabel: string;
  masteryLevel: number;
  correctStreak: number;
  wrongStreak: number;
  totalAttempts: number;
  accuracy: string;
  longestCorrectStreak?: number;
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
  userId?: string;
}

export default function AdaptiveLearning({ topicId, topicName: topicNameProp, onChangeTopic, userId }: AdaptiveLearningProps) {
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
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [hintRequestCount, setHintRequestCount] = useState(0); // Per-question hint count (resets)
  const [totalHintCount, setTotalHintCount] = useState(0); // Cumulative topic-level hint count
  const [hintUsedForCurrentQuestion, setHintUsedForCurrentQuestion] = useState(false); // Track if hint already used for this question
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null); // Track if last submission was correct
  const [shownUnlockModals, setShownUnlockModals] = useState<Set<string>>(new Set()); // Track shown unlock modals to prevent re-showing
  const [shownMasteryModals, setShownMasteryModals] = useState<Set<string>>(new Set()); // Track shown mastery modals to prevent re-showing
  const [submitMode, setSubmitMode] = useState<'auto' | 'confirm'>('confirm'); // Default to confirm mode for safer UX
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null); // Track selected answer in confirm mode
  const [showExplanationModal, setShowExplanationModal] = useState(false); // Show explanation on wrong answer
  const [wrongAnswerExplanation, setWrongAnswerExplanation] = useState<any>(null); // Store explanation data

  // Load submit mode preference from localStorage
  useEffect(() => {    const saved = localStorage.getItem('polegion-submit-mode');
    if (saved === 'auto' || saved === 'confirm') {
      setSubmitMode(saved as 'auto' | 'confirm');
    }
  }, []);

  // Save submit mode preference to localStorage
  const toggleSubmitMode = (mode: 'auto' | 'confirm') => {
    setSubmitMode(mode);
    localStorage.setItem('polegion-submit-mode', mode);
    // Clear selected answer when switching to auto mode
    if (mode === 'auto') {
      setSelectedAnswer(null);
    }
  };

  const generateNewQuestion = async (forceNew = false) => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching, and forceNew parameter to skip pending question reuse
      const forceParam = forceNew ? '&forceNew=true' : '';
      const response = await axios.get(`/adaptive/question/${topicId}?t=${Date.now()}${forceParam}`);
      
      console.log('[AdaptiveLearning] Question API response:', response.data);
      
      if (response.data.success) {
        const questionData = response.data.data;
        console.log('[AdaptiveLearning] Setting question:', questionData);
        setCurrentQuestion({
          question: questionData.question,
          options: questionData.options,
          questionId: questionData.questionId,
          hint: questionData.hint,
          // Store full metadata for submission tracking (radar chart analytics)
          cognitive_domain: questionData.cognitive_domain,
          cognitiveDomain: questionData.cognitive_domain, // Try both formats
          type: questionData.type,
          difficulty_level: questionData.difficulty_level,
          id: questionData.id || questionData.questionId
        });
        setAnswerSubmitted(false); // Reset for new question
        setHintRequestCount(0); // Reset hint count for new question
        setHintUsedForCurrentQuestion(false); // Reset hint flag for new question
        setSelectedAnswer(null); // Reset selected answer for new question
      } else {
        console.error('[AdaptiveLearning] Question API returned success=false');
      }
    } catch (error) {
      console.error('[AdaptiveLearning] Error generating question:', error);
      setCurrentQuestion({
        question: '😕 Oops! We couldn\'t load your question.',
        options: [{ 
          label: '🔄 Try Again', 
          correct: false,
          subtext: 'Don\'t worry - your progress is saved!' 
        }]
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * RESEARCH NOTE (ICETT Paper - Section 3.2: Mastery Calculation)
   * 
   * Mastery Level Formula: (correct_answers / total_attempts) × 100
   * 
   * Mastery Thresholds (used in Q-learning state discretization):
   * - 0-20%:   Novice       (state_value: 1)
   * - 20-40%:  Developing   (state_value: 2)
   * - 40-60%:  Competent    (state_value: 3)
   * - 60-80%:  Proficient   (state_value: 4)
   * - 80-100%: Expert       (state_value: 5)
   * 
   * Mastery is displayed via:
   * - MasteryProgressBar component (visual percentage bar)
   * - CognitiveDomainRadar component (Bloom's Taxonomy breakdown)
   * 
   * Topic Unlock Criteria:
   * - Mastery ≥ 80% (Expert level)
   * - Minimum 10 questions answered
   * - Cognitive domain coverage ≥ 60% across all 6 domains
   * 
   * Source: backend/application/services/adaptive/AdaptiveLearningService.js
   *         Lines 1800-1850: calculateMasteryLevel()
   */
  const fetchState = async () => {
    try {
      setLoading(true);
      const stateResponse = await axios.get(`/adaptive/state/${topicId}?t=${Date.now()}`);
      const stateData = stateResponse.data.data;
      setState(stateData);
      
      setMasteryData({
        level: stateData.difficulty_level,
        percentage: Math.round(stateData.mastery_level),
        streak: stateData.correct_streak,
        bestStreak: stateData.best_streak || stateData.correct_streak
      });

      // Load cumulative hint count from state
      setTotalHintCount(stateData.hints_shown_count || 0);
      
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

  /**
   * RESEARCH NOTE (ICETT Paper - Section 3.3: Adaptive Learning Loop)
   * 
   * This function implements the 4-phase Q-learning adaptive cycle:
   * 
   * PHASE 1: Student submits answer → Frontend sends to Q-learning engine
   * PHASE 2: Backend calculates reward (±10 scale based on correctness/time)
   * PHASE 3: Backend updates Q-table using: Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]
   *          Where: α=0.1 (learning rate), γ=0.95 (discount factor)
   * PHASE 4: Backend selects next action via ε-greedy policy (ε=0.1)
   * PHASE 5: Frontend applies pedagogical action (difficulty/strategy change)
   * 
   * MDP Actions Applied:
   * - decrease_difficulty: Show easier problem (difficulty_level - 1)
   * - increase_difficulty: Show harder problem (difficulty_level + 1)
   * - give_hint_then_retry: Display AI-generated hint, allow retry
   * - switch_to_visual: Add visual representations (diagrams, drawings)
   * - switch_to_real_world: Transform to real-world context
   * - maintain_difficulty: Continue at same level
   * 
   * State Representation (13 features):
   * - mastery_level (0-100%), difficulty_level (1-5), correct_streak (0-20+)
   * - wrong_streak (0-10+), hints_shown_count (0-50+), cognitive_domains (6 dimensions)
   * 
   * See: backend/application/services/adaptive/AdaptiveLearningService.js
   *      - Lines 800-1200: Q-learning implementation
   *      - Lines 300-500: State discretization
   */
  const submitAnswer = async (isCorrect: boolean, selectedOption: any) => {
    if (answerSubmitted) {
      console.log('[AdaptiveLearning] Answer already submitted, ignoring click');
      return;
    }

    // Validate that we have a valid question with an ID before submitting
    const questionId = currentQuestion?.questionId || currentQuestion?.id;
    if (!questionId) {
      console.error('[AdaptiveLearning] Cannot submit answer - no valid questionId');
      alert('Unable to submit answer. Please refresh and try again.');
      return;
    }
    
    try {
      setAnswerSubmitted(true); // Prevent multiple submissions
      setSubmitting(true);
      
      const questionData = {
        questionText: currentQuestion?.question,
        options: currentQuestion?.options,
        correctAnswer: currentQuestion?.options.find((opt: any) => opt.correct)?.label,
        userAnswer: selectedOption?.label || selectedOption?.text,
        // CRITICAL: Include full question metadata for radar chart tracking
        cognitive_domain: currentQuestion?.cognitive_domain,
        cognitiveDomain: currentQuestion?.cognitiveDomain,
        type: currentQuestion?.type,
        hint: currentQuestion?.hint
      };
      
      console.log('[AdaptiveLearning] Submitting answer:', {
        topicId,
        questionId,
        isCorrect,
        hasQuestionData: !!questionData,
        cognitive_domain: questionData.cognitive_domain || questionData.cognitiveDomain
      });
      
      const response = await axios.post('/adaptive/submit-answer-enhanced', {
        topicId,
        questionId,
        isCorrect,
        timeSpent: Math.floor(Math.random() * 60) + 30,
        questionData
      });

      const responseData = response.data.data;
      setLastResponse(responseData);
      setLastAnswerCorrect(isCorrect); // Track correctness for feedback display
      
      // Only show feedback for significant actions (hints, difficulty changes, etc.)
      const significantActions = [
        'give_hint_then_retry', 'give_hint_retry',
        'increase_difficulty', 'decrease_difficulty',
        'switch_to_visual', 'switch_to_real_world'
      ];
      if (significantActions.includes(responseData.action)) {
        setShowFeedback(true);
      }
      
      // OPTIMIZATION: Only fetch full state if mastery changed significantly (>5%)
      // Otherwise update locally to prevent excessive refreshing
      const masteryDiff = Math.abs((responseData.masteryLevel || responseData.mastery_level || 0) - state.masteryLevel);
      if (masteryDiff > 5 || responseData.topicUnlocked || responseData.masteryAchieved) {
        const stateResponse = await axios.get(`/adaptive/state/${topicId}?t=${Date.now()}`);
        setState(stateResponse.data.data);
      } else {
        // Update state locally without fetch
        setState(prev => ({
          ...prev,
          masteryLevel: responseData.masteryLevel || responseData.mastery_level || prev.masteryLevel,
          currentDifficulty: responseData.currentDifficulty || prev.currentDifficulty,
          correctStreak: isCorrect ? prev.correctStreak + 1 : 0,
          wrongStreak: isCorrect ? 0 : prev.wrongStreak + 1,
          totalAttempts: prev.totalAttempts + 1
        }));
      }
      
      if (isCorrect) {
        setShowCelebration(true);
        // Don't auto-dismiss - wait for user confirmation
        
        // FIX: Only show topic unlock modal if not already shown for this topic
        // Store data but don't show yet - wait for correct answer feedback to be dismissed
        if (responseData.topicUnlocked && responseData.topicUnlocked.unlocked) {
          const topicKey = responseData.topicUnlocked.topic?.id || topicId;
          if (!shownUnlockModals.has(topicKey)) {
            setUnlockedTopic(responseData.topicUnlocked);
            setShownUnlockModals(prev => new Set(prev).add(topicKey));
            // Don't show immediately - will be triggered after correct answer feedback
          }
        }

        // Store mastery data ONLY at 100% mastery level
        // Check the current mastery level from state header display
        const currentMasteryLevel = state?.masteryLevel || 0;
        if (responseData.masteryAchieved && currentMasteryLevel >= 100) {
          const topicKey = topicId;
          if (!shownMasteryModals.has(topicKey)) {
            setMasteryData(responseData.masteryAchieved);
            setShownMasteryModals(prev => new Set(prev).add(topicKey));
          }
        }
        
        // Generate next question
        await generateNewQuestion();
      } else {
        // NEW: Generate AI explanation for wrong answer
        try {
          const correctOption = currentQuestion?.options.find((opt: any) => opt.correct);
          if (correctOption) {
            // Request AI explanation from backend
            const explanationResponse = await axios.post('/adaptive/generate-explanation', {
              topicId,
              questionText: currentQuestion?.question,
              correctAnswer: correctOption.label,
              userAnswer: selectedOption?.label || 'Unknown',
              topic: topicName
            });
            
            if (explanationResponse.data.success) {
              setWrongAnswerExplanation({
                question: currentQuestion?.question,
                userAnswer: selectedOption?.label,
                correctAnswer: correctOption.label,
                explanation: explanationResponse.data.data.explanation,
                hint: currentQuestion?.hint
              });
              setShowExplanationModal(true);
            }
          }
        } catch (err) {
          console.error('Error generating explanation:', err);
          // Continue even if explanation fails
        }
        
        // Handle wrong answer responses - Do NOT auto-show hints
        // Hints are now only shown when student clicks the hint button
        if (responseData.showHint && responseData.hint) {
          // Store hint but don't auto-display - student must click hint button
          setHintText(responseData.hint);
          setCurrentQuestionData(currentQuestion);
          // Don't show modal automatically - student controls when to view hint
          // setShowHintModal(true); // REMOVED - no auto-display
          
          // Reset answerSubmitted so user can retry
          setAnswerSubmitted(false);
          
          // Hint count will be incremented when student clicks hint button
          // Not auto-incremented since hints are not auto-displayed
          
          // No need to save to database here - will be saved when button is clicked
          
          // Check if we should keep question or generate new one
          if (responseData.generateSimilar || !responseData.keepQuestion) {
            // Generate new similar question after hint is closed
            // Note: This will happen when user closes the hint modal
            console.log('[AdaptiveLearning] Will generate new question after hint');
          } else {
            // Keep same question for retry
            console.log('[AdaptiveLearning] Keeping same question for retry after hint');
          }
        } else {
          // No hint - just generate similar or keep question
          if (responseData.generateSimilar || !responseData.keepQuestion) {
            // Generate new question with different numbers/parameters
            // Pass forceNew=true to skip pending question reuse
            await generateNewQuestion(true);
          } else {
            // keepQuestion is true - user should retry the same question (term-based only)
            console.log('[AdaptiveLearning] Keeping same question for retry');
            setAnswerSubmitted(false);
            setShowFeedback(true);
          }
        }
      }
    } catch (error: any) {
      console.error('Error submitting answer:', error);
      console.error('Error response:', error.response?.data);
      
      // Show error message to user
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}\n${error.response.data.message || ''}`);
      }
      
      setAnswerSubmitted(false); // Reset on error so user can retry
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
          background: linear-gradient(135deg, #8b6f47 0%, #6d5940 50%, #5d4e37 100%);
          overflow: hidden;
          display: grid;
          grid-template-rows: 70px 1fr;
          grid-template-columns: 280px 1fr 280px;
          grid-template-areas:
            "header header header"
            "sidebar content feedback";
          position: relative;
          font-family: 'Cinzel', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        
        /* Top Quest Header Banner */
        .quest-header-banner {
          grid-area: header;
          background: linear-gradient(135deg, #8b6f47 0%, #6d5940 100%);
          border-bottom: 3px solid rgba(184, 134, 11, 0.6);
          padding: 12px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          z-index: 10;
        }
        
        .quest-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .quest-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #b8860b, #daa520);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          border: 2px solid rgba(218, 165, 32, 0.6);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        }
        
        .quest-title-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .quest-label {
          font-size: 10px;
          color: #daa520;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        
        .quest-name {
          font-size: 16px;
          color: #fef5e7;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
        }
        
        .mastery-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          border: 2px solid rgba(184, 134, 11, 0.4);
        }
        
        .mastery-level {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #fef5e7;
          font-size: 13px;
          font-weight: 600;
        }
        
        .mastery-icon {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          border: 2px solid #b45309;
        }
        
        .mastery-percentage {
          font-size: 18px;
          color: #fbbf24;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        /* Castle Stone Background Effects */
        .adaptive-learning-container::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 20%, rgba(218, 165, 32, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 70% 80%, rgba(139, 100, 60, 0.12) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        
        .adaptive-learning-container::after {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(139, 100, 60, 0.03) 40px, rgba(139, 100, 60, 0.03) 80px),
            repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(139, 100, 60, 0.03) 40px, rgba(139, 100, 60, 0.03) 80px);
          pointer-events: none;
          z-index: 0;
        }
        
        .sidebar {
          grid-area: sidebar;
          background: linear-gradient(180deg, rgba(255, 250, 240, 0.95) 0%, rgba(250, 240, 220, 0.95) 100%);
          border-right: 3px solid rgba(139, 100, 60, 0.3);
          padding: 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          overflow-y: auto;
          position: relative;
          z-index: 1;
          box-shadow: 4px 0 20px rgba(139, 100, 60, 0.15), inset -2px 0 8px rgba(218, 165, 32, 0.1);
        }
        
        .sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(180deg, rgba(218, 165, 32, 0.2) 0%, transparent 100%);
          pointer-events: none;
        }
        
        .content-area {
          grid-area: content;
          padding: 32px;
          overflow-y: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 1;
          background: linear-gradient(135deg, #f5e6d3 0%, #e8d4b8 50%, #dcc5a8 100%);
        }
        
        .feedback-rail {
          grid-area: feedback;
          background: linear-gradient(180deg, rgba(255, 250, 240, 0.95) 0%, rgba(250, 240, 220, 0.95) 100%);
          border-left: 3px solid rgba(139, 100, 60, 0.3);
          padding: 16px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 1;
          box-shadow: -4px 0 20px rgba(139, 100, 60, 0.15), inset 2px 0 8px rgba(218, 165, 32, 0.1);
        }
        
        .feedback-rail::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: linear-gradient(180deg, rgba(218, 165, 32, 0.2) 0%, transparent 100%);
          pointer-events: none;
        }
        
        /* Custom Scrollbar Styling */
        .sidebar::-webkit-scrollbar,
        .feedback-rail::-webkit-scrollbar,
        .content-area::-webkit-scrollbar {
          width: 10px;
        }
        
        .sidebar::-webkit-scrollbar-track,
        .feedback-rail::-webkit-scrollbar-track,
        .content-area::-webkit-scrollbar-track {
          background: rgba(139, 100, 60, 0.1);
          border-radius: 10px;
        }
        
        .sidebar::-webkit-scrollbar-thumb,
        .feedback-rail::-webkit-scrollbar-thumb,
        .content-area::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #b8860b, #8b643c);
          border-radius: 10px;
          border: 2px solid rgba(255, 250, 240, 0.3);
        }
        
        .sidebar::-webkit-scrollbar-thumb:hover,
        .feedback-rail::-webkit-scrollbar-thumb:hover,
        .content-area::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #daa520, #b8860b);
        }
        
        .topic-header-label {
          font-size: 12px;
          font-weight: 600;
          color: #8b643c;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
          font-family: 'Cinzel', serif;
        }
        
        .topic-header-title {
          font-size: 18px;
          font-weight: 700;
          color: #b8860b;
          margin: 0;
          line-height: 1.3;
          font-family: 'Cinzel', serif;
          text-shadow: 0 2px 4px rgba(184, 134, 11, 0.2);
        }
        
        .mastery-card {
          background: linear-gradient(145deg, rgba(255, 248, 235, 0.9), rgba(250, 240, 220, 0.9));
          border-radius: 12px;
          padding: 16px;
          border: 2px solid rgba(184, 134, 11, 0.3);
          box-shadow: 0 4px 12px rgba(139, 100, 60, 0.15), inset 0 2px 4px rgba(218, 165, 32, 0.1);
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
          color: #8b643c;
          font-family: 'Cinzel', serif;
        }
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
          background: rgba(229, 231, 235, 0.5);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-fill {
          height: 100%;
          transition: width 0.4s ease;
          border-radius: 4px;
          background: linear-gradient(90deg, #b8860b, #daa520) !important;
        }
        
        .stat-chip {
          background: linear-gradient(135deg, rgba(255, 250, 240, 0.9), rgba(250, 245, 230, 0.9));
          border: 2px solid rgba(184, 134, 11, 0.2);
          border-radius: 10px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(139, 100, 60, 0.1), inset 0 1px 3px rgba(218, 165, 32, 0.05);
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
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scrollOpen {
          0% { 
            transform: scaleX(0) scaleY(0.95) rotateY(-15deg);
            opacity: 0;
            filter: blur(4px);
          }
          15% {
            transform: scaleX(0.2) scaleY(0.97) rotateY(-8deg);
            opacity: 0.3;
            filter: blur(3px);
          }
          40% {
            transform: scaleX(0.7) scaleY(0.98) rotateY(2deg);
            opacity: 0.8;
            filter: blur(1px);
          }
          65% {
            transform: scaleX(1.02) scaleY(1.01) rotateY(-1deg);
            opacity: 1;
            filter: blur(0px);
          }
          85% {
            transform: scaleX(0.98) scaleY(1) rotateY(0.5deg);
          }
          100% { 
            transform: scaleX(1) scaleY(1) rotateY(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }
        
        @keyframes scrollShimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      {/* Top Quest Header Banner */}
      <div className="quest-header-banner">
        <div className="quest-title-section">
          <div className="quest-title-text">
            <div className="quest-label">Current Quest</div>
            <div className="quest-name">{topicName}</div>
          </div>
        </div>
        <div className="mastery-badge">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '210px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="mastery-level">
                <div className="mastery-icon">⭐</div>
                <span>Level {Math.ceil(state.masteryLevel / 20)}</span>
              </div>
              <div className="mastery-percentage">{Math.round(state.masteryLevel)}%</div>
            </div>
            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '6px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                width: `${Math.round(state.masteryLevel)}%`,
                background: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
                borderRadius: '3px',
                transition: 'width 0.4s ease',
                boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Left Sidebar - Quest Stats */}
      <div className="sidebar">
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 248, 235, 0.9), rgba(250, 240, 220, 0.9))',
          borderRadius: '12px',
          padding: '14px',
          border: '2px solid rgba(184, 134, 11, 0.3)',
          boxShadow: '0 4px 12px rgba(139, 100, 60, 0.15)',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#654321',
            marginBottom: '12px',
            fontFamily: 'Cinzel, serif',
            textAlign: 'center'
          }}>Quest Stats</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#654321', fontWeight: 600 }}>Attempted:</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#3d2817' }}>{state.totalAttempts}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#654321', fontWeight: 600 }}>Streak:</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: state.correctStreak >= 3 ? '#10B981' : '#3d2817' }}>
                {state.correctStreak}
              </span>
            </div>
            {state.longestCorrectStreak && state.longestCorrectStreak > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px dashed rgba(184, 134, 11, 0.3)' }}>
                <span style={{ fontSize: '11px', color: '#8b643c', fontWeight: 600 }}>🏆 Best:</span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: '#b8860b' }}>{state.longestCorrectStreak}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills Profile / Cognitive Domain */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 248, 235, 0.9), rgba(250, 240, 220, 0.9))',
          borderRadius: '12px',
          padding: '14px',
          border: '2px solid rgba(184, 134, 11, 0.3)',
          boxShadow: '0 4px 12px rgba(139, 100, 60, 0.15)',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: 700,
            color: '#654321',
            marginBottom: '10px',
            fontFamily: 'Cinzel, serif',
            textAlign: 'center'
          }}>Skills Profile</h3>
          <div style={{ marginTop: '8px' }}>
            <CognitiveDomainRadar userId={userId} />
          </div>
        </div>

        {onChangeTopic && (
          <button 
            onClick={onChangeTopic} 
            className="change-topic-button"
            style={{
              padding: '10px 16px',
              background: 'linear-gradient(135deg, #b8860b, #daa520)',
              color: 'white',
              border: '2px solid rgba(184, 134, 11, 0.5)',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 8px rgba(139, 100, 60, 0.25)',
              fontFamily: 'Cinzel, serif',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #9a7209, #b8860b)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(139, 100, 60, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #b8860b, #daa520)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(139, 100, 60, 0.25)';
            }}
          >
            Change Quest
          </button>
        )}
      </div>

      {/* Modals - Outside grid flow */}
      <CelebrationModal
        type="unlock"
        title="Topic Unlocked!"
        message={unlockedTopic?.message || "Great job! You've unlocked the next topic!"}
        onClose={() => { 
          setShowTopicUnlock(false); 
          setUnlockedTopic(null); 
          // After topic unlock, check if mastery achieved, otherwise generate next question
          if (masteryData) {
            setTimeout(() => setShowMastery(true), 500);
          } else {
            generateNewQuestion();
          }
        }}
        show={showTopicUnlock}
      />

      <CelebrationModal
        type="mastery"
        title="Mastery Achieved!"
        message={masteryData?.message || "Congratulations! You've mastered this topic!"}
        onClose={() => { 
          setShowMastery(false); 
          setMasteryData(null); 
          generateNewQuestion(); // Generate next question after mastery modal is dismissed
        }}
        show={showMastery}
      />

      <ExplanationModal
        show={showExplanationModal}
        data={wrongAnswerExplanation}
        onContinue={async () => {
          setShowExplanationModal(false);
          setWrongAnswerExplanation(null);
          // Generate new question after explanation
          await generateNewQuestion(true);
        }}
      />

      {showHintModal && hintText && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 60,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            position: 'relative',
            maxWidth: '650px',
            width: '90%',
            animation: 'scrollOpen 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transformOrigin: 'center center',
            perspective: '1000px',
            transformStyle: 'preserve-3d',
            display: 'flex',
            alignItems: 'center',
            gap: '0'
          }}>
            {/* Left Scroll Rod */}
            <div style={{
              position: 'relative',
              width: '25px',
              alignSelf: 'stretch',
              background: 'linear-gradient(90deg, #5d4e37 0%, #3d3020 50%, #5d4e37 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 2px 0 4px rgba(255, 255, 255, 0.1), inset -2px 0 4px rgba(0, 0, 0, 0.3)',
              zIndex: 2,
              flexShrink: 0
            }}>
              {/* Rod end caps */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '-15px',
                transform: 'translateX(-50%)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #8b7355, #5d4e37)',
                border: '2px solid #3d3020',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
              }} />
              <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '-15px',
                transform: 'translateX(-50%)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #8b7355, #5d4e37)',
                border: '2px solid #3d3020',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
              }} />
            </div>

            {/* Parchment Paper */}
            <div style={{
              backgroundColor: '#f4e9d9',
              padding: '40px 45px',
              position: 'relative',
              flex: 1,
              background: `
                radial-gradient(ellipse 100% 200% at 0% 50%, rgba(210, 180, 140, 0.3), transparent 70%),
                radial-gradient(ellipse 100% 200% at 100% 50%, rgba(139, 100, 60, 0.2), transparent 70%),
                linear-gradient(90deg, #f4e9d9 0%, #ecdcc4 30%, #e8d5ba 50%, #f0e3cf 70%, #f4e9d9 100%)
              `,
              boxShadow: `
                0 0 0 1px rgba(139, 100, 60, 0.2),
                0 30px 60px -15px rgba(0, 0, 0, 0.5),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                inset 0 -1px 0 rgba(139, 100, 60, 0.2)
              `
            }}>
              {/* Parchment texture overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 100, 60, 0.03) 2px, rgba(139, 100, 60, 0.03) 4px),
                  repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 100, 60, 0.02) 2px, rgba(139, 100, 60, 0.02) 4px)
                `,
                pointerEvents: 'none',
                opacity: 0.6
              }} />
              
              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ 
                  fontSize: '52px', 
                  marginBottom: '20px', 
                  textAlign: 'center',
                  width: '90px',
                  height: '90px',
                  margin: '0 auto 24px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 30% 30%, #fef9c3, #fde68a, #fbbf24)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  border: '4px solid #b8860b',
                  boxShadow: '0 6px 20px rgba(184, 134, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
                  filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.5))'
                }}>
                  💡
                </div>
                <div style={{ 
                  fontSize: '28px', 
                  fontWeight: 800, 
                  color: '#654321', 
                  marginBottom: '20px', 
                  textAlign: 'center', 
                  fontFamily: 'Cinzel, serif',
                  textShadow: '0 1px 2px rgba(139, 100, 60, 0.2)',
                  letterSpacing: '0.5px'
                }}>
                  Wisdom from Archimedes
                </div>
                <div style={{
                  fontSize: '17px', 
                  color: '#3d2817', 
                  marginBottom: '28px', 
                  lineHeight: '1.8',
                  padding: '24px', 
                  background: 'rgba(139, 100, 60, 0.08)', 
                  borderRadius: '8px', 
                  borderLeft: '5px solid #b8860b',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic'
                }}>
                  {hintText}
                </div>
                <button onClick={handleHintClose} style={{
                  background: 'linear-gradient(135deg, #8b7355, #654321)',
                  color: '#fef5e7',
                  border: '3px solid #3d2817',
                  borderRadius: '8px',
                  padding: '16px 36px',
                  fontSize: '17px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'Cinzel, serif',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s ease',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #6d5940, #4d3520)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8b7355, #654321)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                }}>
                  I Understand, Continue
                </button>
              </div>
            </div>

            {/* Right Scroll Rod */}
            <div style={{
              position: 'relative',
              width: '25px',
              alignSelf: 'stretch',
              background: 'linear-gradient(90deg, #5d4e37 0%, #3d3020 50%, #5d4e37 100%)',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5), inset 2px 0 4px rgba(255, 255, 255, 0.1), inset -2px 0 4px rgba(0, 0, 0, 0.3)',
              zIndex: 2,
              flexShrink: 0
            }}>
              {/* Rod end caps */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '-15px',
                transform: 'translateX(-50%)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #8b7355, #5d4e37)',
                border: '2px solid #3d3020',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
              }} />
              <div style={{
                position: 'absolute',
                left: '50%',
                bottom: '-15px',
                transform: 'translateX(-50%)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #8b7355, #5d4e37)',
                border: '2px solid #3d3020',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
              }} />
            </div>
          </div>
        </div>
      )}

      {showCelebration && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
        onClick={() => { setShowCelebration(false); generateNewQuestion(); }}
        >
          <div style={{
            backgroundColor: '#f4e9d9',
            borderRadius: '16px',
            padding: 'clamp(16px, 3.5vw, 24px)',
            maxWidth: '500px',
            width: '92%',
            boxShadow: '0 25px 50px -12px rgba(139, 100, 60, 0.4), inset 0 2px 8px rgba(218, 165, 32, 0.1)',
            border: '4px solid #228b22',
            background: 'linear-gradient(135deg, #f4e9d9 0%, #ecdcc4 30%, #e8d5ba 50%, #f0e3cf 70%, #f4e9d9 100%)',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Parchment texture overlay */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(139, 100, 60, 0.03) 2px, rgba(139, 100, 60, 0.03) 4px),
                repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(139, 100, 60, 0.02) 2px, rgba(139, 100, 60, 0.02) 4px)
              `,
              pointerEvents: 'none',
              opacity: 0.5,
              borderRadius: '16px'
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Header Icon */}
              <div style={{
                width: 'clamp(60px, 12vw, 70px)',
                height: 'clamp(60px, 12vw, 70px)',
                margin: '0 auto 16px',
                borderRadius: '50%',
                background: 'radial-gradient(circle at 30% 30%, #6ee7b7, #228b22)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(32px, 6vw, 40px)',
                border: '4px solid #15803d',
                boxShadow: '0 6px 20px rgba(34, 139, 34, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
                filter: 'drop-shadow(0 0 8px rgba(34, 139, 34, 0.3))'
              }}>
                ✓
              </div>

              {/* Title */}
              <h2 style={{
                fontSize: 'clamp(22px, 5vw, 28px)',
                fontWeight: 800,
                color: '#14532d',
                marginBottom: '16px',
                textAlign: 'center',
                margin: '0 0 16px 0',
                fontFamily: 'Cinzel, serif',
                textShadow: '0 1px 2px rgba(139, 100, 60, 0.2)',
                letterSpacing: '0.5px'
              }}>
                Excellent Work! 🎉
              </h2>

              {/* Correct Answer Display */}
              <div style={{
                background: 'rgba(209, 250, 229, 0.6)',
                borderRadius: '10px',
                padding: 'clamp(12px, 2.5vw, 16px)',
                marginBottom: '14px',
                borderLeft: '5px solid #228b22',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: 'clamp(18px, 4vw, 24px)' }}>✅</span>
                <span style={{ fontSize: 'clamp(13px, 3vw, 16px)', color: '#14532d', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
                  Your answer is correct!
                </span>
              </div>

              {/* Encouragement Message */}
              <div style={{
                background: 'rgba(218, 165, 32, 0.15)',
                borderRadius: '10px',
                padding: 'clamp(12px, 3vw, 16px)',
                marginBottom: '14px',
                borderLeft: '5px solid #daa520',
                boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '8px'
                }}>
                  <span style={{ fontSize: 'clamp(20px, 4.5vw, 24px)' }}>🌟</span>
                  <div style={{ fontSize: 'clamp(13px, 2.8vw, 15px)', color: '#654321', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
                    Keep it up!
                  </div>
                </div>
                <div style={{
                  fontSize: 'clamp(13px, 3vw, 15px)',
                  color: '#3d2817',
                  lineHeight: '1.7',
                  fontFamily: 'Georgia, serif'
                }}>
                  You're mastering this concept! Keep up the great work and continue building your skills.
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => { 
                  setShowCelebration(false); 
                  // Show topic unlock modal if it exists, then check for mastery, otherwise generate next question
                  if (unlockedTopic) {
                    setTimeout(() => setShowTopicUnlock(true), 500);
                  } else if (masteryData) {
                    setTimeout(() => setShowMastery(true), 500);
                  } else {
                    generateNewQuestion();
                  }
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #228b22, #15803d)',
                  color: '#fef5e7',
                  border: '3px solid #14532d',
                  borderRadius: '10px',
                  padding: 'clamp(12px, 3vw, 16px) clamp(18px, 4.5vw, 24px)',
                  fontSize: 'clamp(14px, 3.2vw, 18px)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                  fontFamily: 'Cinzel, serif',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #15803d, #14532d)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #228b22, #15803d)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                }}
              >
                Next Question →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Center Column: Question */}
      <div className="content-area" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '40px'
      }}>
        <div className="question-card" style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          maxWidth: '900px',
          width: '100%',
          margin: '0 auto'
        }}>
          {/* Question Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(250, 245, 230, 0.98))',
            borderRadius: '12px 12px 0 0',
            padding: '16px',
            border: '3px solid #8b643c',
            borderBottom: '2px solid #8b643c',
            boxShadow: '0 4px 12px rgba(139, 100, 60, 0.2)'
          }}>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: '#654321',
              textAlign: 'center',
              fontFamily: 'Cinzel, serif',
              margin: 0,
              textShadow: '0 1px 2px rgba(139, 100, 60, 0.1)'
            }}>Solve the Problem</h2>
          </div>

          {/* Question Content */}
          <div style={{
            background: 'white',
            border: '3px solid #8b643c',
            borderTop: 'none',
            borderBottom: 'none',
            padding: '20px',
            flex: '1 1 auto',
            overflowY: 'auto',
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto' }}>
              <LearningInteractionRenderer
                representationType={currentRepresentation}
                difficultyLevel={state.currentDifficulty}
                onAnswer={submitMode === 'auto' ? submitAnswer : (isCorrect: boolean, option: any) => {
                  setSelectedAnswer({ isCorrect, option });
                }}
                disabled={submitting || answerSubmitted}
                question={currentQuestion}
                selectedOption={selectedAnswer?.option}
              />
            </div>
            
            {/* Submit Button - Always visible in confirm mode, inside the box */}
            {submitMode === 'confirm' && !answerSubmitted && (
              <div style={{ flex: '0 0 auto', paddingTop: '20px', borderTop: '2px solid #e5e7eb', marginTop: '16px', textAlign: 'center' }}>
                <button
                  onClick={() => selectedAnswer && submitAnswer(selectedAnswer.isCorrect, selectedAnswer.option)}
                  disabled={submitting || !selectedAnswer}
                  style={{
                    padding: '14px 28px',
                    minWidth: '180px',
                    background: (submitting || !selectedAnswer) ? 'linear-gradient(135deg, #d1d5db, #9ca3af)' : 'linear-gradient(135deg, #b8860b, #daa520)',
                    color: 'white',
                    border: `2px solid ${(submitting || !selectedAnswer) ? '#9ca3af' : 'rgba(139, 100, 60, 0.5)'}`,
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 600,
                    cursor: (submitting || !selectedAnswer) ? 'not-allowed' : 'pointer',
                    boxShadow: (submitting || !selectedAnswer) ? 'none' : '0 4px 12px rgba(184, 134, 11, 0.3)',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Cinzel, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    opacity: !selectedAnswer ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting && selectedAnswer) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #9a7209, #b8860b)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(184, 134, 11, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting && selectedAnswer) {
                      e.currentTarget.style.background = 'linear-gradient(135deg, #b8860b, #daa520)';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(184, 134, 11, 0.3)';
                    }
                  }}
                >
                  {submitting ? 'Submitting...' : !selectedAnswer ? 'Select an Answer' : 'Submit Answer'}
                </button>
              </div>
            )}
          </div>
          
          {/* Bottom border of the box */}
          <div style={{
            background: 'white',
            border: '3px solid #8b643c',
            borderTop: 'none',
            borderRadius: '0 0 12px 12px',
            height: '3px',
            boxShadow: '0 8px 24px rgba(139, 100, 60, 0.2)'
          }} />
        </div>
      </div>

      {/* Right Column: Encouragement & Feedback */}
      <div className="feedback-rail">
        {/* Submit Mode Toggle */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(255, 248, 235, 0.9), rgba(250, 240, 220, 0.9))',
          borderRadius: '12px',
          padding: '16px',
          border: '2px solid rgba(184, 134, 11, 0.3)',
          boxShadow: '0 4px 12px rgba(139, 100, 60, 0.15)',
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            color: '#654321',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '12px',
            textAlign: 'center',
            fontFamily: 'Cinzel, serif'
          }}>
            Submit Mode
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            marginBottom: '10px'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              color: submitMode === 'confirm' ? '#3B82F6' : '#9CA3AF',
              transition: 'color 0.2s ease'
            }}>
              ✓ Confirm
            </span>
            
            <button
              onClick={() => toggleSubmitMode(submitMode === 'auto' ? 'confirm' : 'auto')}
              style={{
                width: '54px',
                height: '28px',
                borderRadius: '14px',
                border: 'none',
                background: submitMode === 'auto' ? '#10B981' : '#E5E7EB',
                cursor: 'pointer',
                padding: '0',
                position: 'relative',
                transition: 'all 0.3s ease',
                boxShadow: submitMode === 'auto' ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <div style={{
                position: 'absolute',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'white',
                top: '2px',
                left: submitMode === 'auto' ? '28px' : '2px',
                transition: 'left 0.3s ease',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
              }} />
            </button>
            
            <span style={{
              fontSize: '12px',
              fontWeight: 500,
              color: submitMode === 'auto' ? '#10B981' : '#9CA3AF',
              transition: 'color 0.2s ease'
            }}>
              ⚡ Auto
            </span>
          </div>
          
          <div style={{
            fontSize: '10px',
            color: '#8b643c',
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: '1.3'
          }}>
            {submitMode === 'auto' 
              ? 'Click answer to submit immediately' 
              : 'Review your answer before submitting'}
          </div>
        </div>

        {/* Encouragement Box */}
        <div style={{
          background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
          borderRadius: '12px',
          padding: '16px',
          border: '2px solid #10b981',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
          textAlign: 'center',
          marginBottom: '12px'
        }}>
          <div style={{
            fontSize: '32px',
            marginBottom: '8px'
          }}>⭐</div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 700,
            color: '#065f46',
            marginBottom: '6px',
            fontFamily: 'Cinzel, serif'
          }}>You're Doing Great!</h3>
          <p style={{
            fontSize: '12px',
            color: '#047857',
            margin: 0,
            lineHeight: '1.4',
            fontWeight: 600
          }}>Keep questing to master angles!</p>
        </div>
        
        {showFeedback && lastResponse ? (
          <AdaptiveFeedbackBox
            mdpAction={lastResponse.action}
            wrongStreak={state.wrongStreak}
            correctStreak={state.correctStreak}
            actionReason={lastResponse.actionReason}
            pedagogicalStrategy={lastResponse.pedagogicalStrategy}
            representationType={currentRepresentation}
            aiExplanation={undefined}
            hintMetadata={lastResponse.hintMetadata}
            isCorrect={lastAnswerCorrect ?? undefined}
          />
        ) : (
          <div style={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '12px',
            padding: '16px',
            border: '2px dashed rgba(184, 134, 11, 0.3)',
            color: '#6B7280',
            fontSize: '13px',
            lineHeight: 1.6,
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '8px', fontSize: '24px' }}>📊</div>
            <div><strong>Hints requested:</strong> {totalHintCount}</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '6px' }}>
              Feedback appears when you need help
            </div>
          </div>
        )}
      </div>

      {/* Wizard Helper Character */}
      <WizardHelper
        onHintRequest={async () => {
          if (currentQuestion?.hint && state.wrongStreak >= 1) {
            setHintText(currentQuestion.hint);
            setShowHintModal(true);
            
            if (!hintUsedForCurrentQuestion) {
              const newCount = hintRequestCount + 1;
              setHintRequestCount(newCount);
              setHintUsedForCurrentQuestion(true);
              
              const questionId = currentQuestion?.questionId || currentQuestion?.id;
              if (questionId) {
                try {
                  const response = await axios.put(`/adaptive/hint-count/${topicId}`, {
                    questionId,
                    hintsRequested: newCount
                  });
                  if (response.data?.data?.hints_shown_count !== undefined) {
                    setTotalHintCount(response.data.data.hints_shown_count);
                  } else {
                    setTotalHintCount(prev => prev + 1);
                  }
                } catch (err) {
                  console.error('Error saving hint count:', err);
                  setTotalHintCount(prev => prev + 1);
                }
              }
            }
          }
        }}
        hintAvailable={!answerSubmitted && state.wrongStreak >= 1 && !!currentQuestion?.hint}
        encouragementMessage={
          state.correctStreak >= 3 
            ? "🌟 Excellent streak! You're mastering this!"
            : state.masteryLevel >= 75
              ? "💎 Your knowledge shines bright!"
              : "📚 Keep learning, scholar!"
        }
        position="bottom-right"
      />
    </div>
  );
}
