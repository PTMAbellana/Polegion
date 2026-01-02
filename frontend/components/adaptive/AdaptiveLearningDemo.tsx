'use client';

import { useState, useEffect } from 'react';
import axios from '@/api/axios';

interface AdaptiveState {
  currentDifficulty: number;
  difficultyLabel: string;
  masteryLevel: number;
  correctStreak: number;
  wrongStreak: number;
  totalAttempts: number;
  accuracy: string;
  prediction?: {
    successProbability: string;
    confidence: string;
    recommendation: string;
  };
  learningPattern?: {
    accuracy: string;
    avgDifficulty: string;
    learningVelocity: string;
    pattern: string;
    recommendation: string;
  };
  qLearning?: {
    stateKey: string;
    epsilon: string;
    explorationRate: string;
    totalStatesLearned: number;
    qValues: Record<string, string>;
  };
}

interface AdaptiveResponse {
  isCorrect: boolean;
  currentDifficulty: number;
  masteryLevel: number;
  action: string;
  actionReason: string;
  feedback: string;
  reward?: number;
  learningMode?: string;
}

interface AdaptiveLearningDemoProps {
  chapterId: string;
  userId?: string;
}

/**
 * AdaptiveLearningDemo Component
 * Demonstrates Q-Learning based adaptive difficulty system
 * Focuses on AI logic over visual design
 */
export default function AdaptiveLearningDemo({ chapterId }: AdaptiveLearningDemoProps) {
  const [state, setState] = useState<AdaptiveState | null>(null);
  const [lastResponse, setLastResponse] = useState<AdaptiveResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch current adaptive state
  const fetchState = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching state for chapterId:', chapterId);
      const response = await axios.get(`/adaptive/state/${chapterId}`);
      console.log('✅ State response:', response.data);
      setState(response.data.data);
    } catch (error) {
      console.error('❌ Error fetching adaptive state:', error);
      console.error('ChapterId was:', chapterId);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, [chapterId]);

  // Simulate answering a question
  const submitAnswer = async (isCorrect: boolean) => {
    try {
      setSubmitting(true);
      const response = await axios.post('/adaptive/submit-answer', {
        chapterId,
        questionId: `sim-${Date.now()}`, // Simulated question
        isCorrect,
        timeSpent: Math.floor(Math.random() * 60) + 30 // Random 30-90 seconds
      });

      setLastResponse(response.data.data);
      
      // Refresh state after submission
      await fetchState();
    } catch (error) {
      console.error('Error submitting answer:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading adaptive learning state...</div>;
  }

  if (!state) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">🧠 Adaptive Learning AI Demo</h2>
        <p className="text-gray-600">Q-Learning based difficulty adjustment system</p>
      </div>

      {/* Current State - Core Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Current Difficulty</h3>
          <div className="flex items-center gap-2">
            <div className="text-3xl">{'⭐'.repeat(state.currentDifficulty)}</div>
            <span className="text-gray-600">({state.difficultyLabel})</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-3">Mastery Level</h3>
          <div className="space-y-2">
            <div className="text-3xl font-bold">{state.masteryLevel.toFixed(1)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  state.masteryLevel >= 80 ? 'bg-green-500' :
                  state.masteryLevel >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${state.masteryLevel}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-3">Performance Metrics</h3>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">{state.correctStreak}</div>
            <div className="text-sm text-gray-600">Correct Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">{state.wrongStreak}</div>
            <div className="text-sm text-gray-600">Wrong Streak</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{state.totalAttempts}</div>
            <div className="text-sm text-gray-600">Total Attempts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{state.accuracy}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
      </div>

      {/* AI Prediction (if available) */}
      {state.prediction && (
        <div className="bg-blue-50 border-2 border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🤖 AI Prediction
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700">Success Probability:</span>
              <span className="font-bold">{state.prediction.successProbability}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Confidence:</span>
              <span className="font-bold">{state.prediction.confidence}</span>
            </div>
            <div className="mt-3 p-3 bg-white rounded">
              <p className="text-sm font-medium">{state.prediction.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Q-Learning Insights */}
      {state.qLearning && (
        <div className="bg-purple-50 border-2 border-purple-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            🎓 Q-Learning Algorithm Status
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>State Key:</span>
              <code className="bg-white px-2 py-1 rounded font-mono">{state.qLearning.stateKey}</code>
            </div>
            <div className="flex justify-between">
              <span>Exploration Rate (ε):</span>
              <span className="font-bold">{state.qLearning.explorationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>States Learned:</span>
              <span className="font-bold">{state.qLearning.totalStatesLearned}</span>
            </div>
            
            {/* Q-Values */}
            <div className="mt-3">
              <div className="font-semibold mb-2">Q-Values (Action Quality):</div>
              <div className="space-y-1">
                {Object.entries(state.qLearning.qValues).map(([action, value]) => (
                  <div key={action} className="flex justify-between bg-white px-2 py-1 rounded text-xs">
                    <span>{action.replace(/_/g, ' ')}:</span>
                    <span className="font-mono font-bold">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learning Pattern Analysis */}
      {state.learningPattern && (state.learningPattern as any).insufficient_data !== true && (
        <div className="bg-green-50 border-2 border-green-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">📊 Learning Pattern Analysis</h3>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-700">Pattern:</span>
                <span className="ml-2 font-bold capitalize">{state.learningPattern.pattern}</span>
              </div>
              <div>
                <span className="text-gray-700">Velocity:</span>
                <span className="ml-2 font-bold">{state.learningPattern.learningVelocity}</span>
              </div>
            </div>
            <div className="mt-2 p-3 bg-white rounded">
              <p className="text-sm">{state.learningPattern.recommendation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Last Response (if any) */}
      {lastResponse && (
        <div className={`p-4 rounded-lg border-2 ${
          lastResponse.isCorrect ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
        }`}>
          <h3 className="font-semibold mb-2">
            {lastResponse.isCorrect ? '✅ Correct!' : '❌ Incorrect'}
          </h3>
          <p className="text-sm mb-2">{lastResponse.feedback}</p>
          <div className="text-xs space-y-1 bg-white p-3 rounded">
            <div><strong>Action Taken:</strong> {lastResponse.action.replace(/_/g, ' ')}</div>
            <div><strong>Reason:</strong> {lastResponse.actionReason}</div>
            {lastResponse.reward !== undefined && (
              <div><strong>Reward:</strong> {lastResponse.reward > 0 ? '+' : ''}{lastResponse.reward}</div>
            )}
            {lastResponse.learningMode && (
              <div><strong>Mode:</strong> {lastResponse.learningMode}</div>
            )}
          </div>
        </div>
      )}

      {/* Simulation Controls */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">🎮 Test Adaptive System</h3>
        <p className="text-sm text-gray-600 mb-4">
          Simulate answering questions to see how the AI adjusts difficulty in real-time
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => submitAnswer(true)}
            disabled={submitting}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ✓ Submit Correct Answer
          </button>
          <button
            onClick={() => submitAnswer(false)}
            disabled={submitting}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            ✗ Submit Wrong Answer
          </button>
        </div>
        {submitting && (
          <div className="mt-4 text-center text-gray-600">
            Processing answer with Q-Learning algorithm...
          </div>
        )}
      </div>

      {/* Research Info */}
      <div className="bg-gray-100 p-4 rounded-lg text-xs text-gray-600">
        <strong>Research Note:</strong> This adaptive system uses Q-Learning (Reinforcement Learning) 
        to optimize difficulty in real-time. It balances exploration (trying new difficulty levels) with 
        exploitation (using learned optimal actions) to maximize learning outcomes.
      </div>
    </div>
  );
}
