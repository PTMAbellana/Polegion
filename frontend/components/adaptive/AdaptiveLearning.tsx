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
  aiExplanation?: string; // AI-generated step-by-step explanation
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

  // Fetch current adaptive state
  const fetchState = async () => {
    try {
      setLoading(true);
      const stateResponse = await axios.get(`/adaptive/state/${topicId}`);
      const stateData = stateResponse.data.data;
      setState(stateData);
      
      // Generate topic-specific question
      const topicResponse = await axios.get(`/adaptive/topics`);
      const topics = topicResponse.data.data || [];
      const currentTopic = topics.find((t: any) => t.id === topicId);
      const topicName = currentTopic?.topic_name || '';
      
      let question;
      
      // Generate different questions based on exact topic name from database
      switch (topicName) {
        case 'Kinds of Angles': {
          const angles = [
            { type: 'acute', measure: Math.floor(Math.random() * 70) + 10, answer: 'Acute angle (less than 90°)' },
            { type: 'right', measure: 90, answer: 'Right angle (exactly 90°)' },
            { type: 'obtuse', measure: Math.floor(Math.random() * 80) + 100, answer: 'Obtuse angle (between 90° and 180°)' },
            { type: 'straight', measure: 180, answer: 'Straight angle (exactly 180°)' }
          ];
          const selected = angles[Math.floor(Math.random() * angles.length)];
          const allOptions = angles.map(a => a.answer);
          question = {
            question: `An angle measures ${selected.measure}°. What type of angle is it?`,
            options: allOptions.sort(() => Math.random() - 0.5).map(opt => ({ label: opt, correct: opt === selected.answer }))
          };
          break;
        }
        
        case 'Complementary and Supplementary Angles': {
          const isSupplementary = Math.random() > 0.5;
          const angle1 = isSupplementary ? Math.floor(Math.random() * 90) + 30 : Math.floor(Math.random() * 60) + 20;
          const answer = isSupplementary ? 180 - angle1 : 90 - angle1;
          const wrongAnswers = [answer + 10, answer - 15, isSupplementary ? 90 - angle1 : 180 - angle1].filter(v => v > 0);
          question = {
            question: `Two angles are ${isSupplementary ? 'supplementary' : 'complementary'}. If one angle is ${angle1}°, find the other angle.`,
            options: [answer, ...wrongAnswers.slice(0, 3)].sort(() => Math.random() - 0.5).map(val => ({ label: `${val}°`, correct: val === answer }))
          };
          break;
        }
        
        case 'Interior Angles of Polygons': {
          const sides = Math.floor(Math.random() * 6) + 3; // 3-8 sides
          const answer = (sides - 2) * 180;
          const names: any = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon' };
          question = {
            question: `What is the sum of interior angles of a ${names[sides]}?`,
            options: [answer, answer + 180, answer - 180, sides * 180].sort(() => Math.random() - 0.5).map(val => ({ label: `${val}°`, correct: val === answer }))
          };
          break;
        }
        
        case 'Perimeter and Area of Polygons': {
          const shapeType = Math.floor(Math.random() * 3);
          if (shapeType === 0) {
            const length = Math.floor(Math.random() * 12) + 8;
            const width = Math.floor(Math.random() * 10) + 5;
            const isPerimeter = Math.random() > 0.5;
            const answer = isPerimeter ? 2 * (length + width) : length * width;
            question = {
              question: `A rectangle has length ${length} units and width ${width} units. Find the ${isPerimeter ? 'perimeter' : 'area'}.`,
              options: [answer, isPerimeter ? length * width : 2 * (length + width), answer + 10, answer - 5]
                .sort(() => Math.random() - 0.5).map(val => ({ label: `${val} ${isPerimeter ? 'units' : 'sq units'}`, correct: val === answer }))
            };
          } else if (shapeType === 1) {
            const side = Math.floor(Math.random() * 10) + 6;
            const isPerimeter = Math.random() > 0.5;
            const answer = isPerimeter ? 4 * side : side * side;
            question = {
              question: `A square has side ${side} units. Find the ${isPerimeter ? 'perimeter' : 'area'}.`,
              options: [answer, isPerimeter ? side * side : 4 * side, answer + 8, answer - 4]
                .sort(() => Math.random() - 0.5).map(val => ({ label: `${val} ${isPerimeter ? 'units' : 'sq units'}`, correct: val === answer }))
            };
          } else {
            const base = Math.floor(Math.random() * 10) + 6;
            const height = Math.floor(Math.random() * 8) + 4;
            const answer = 0.5 * base * height;
            question = {
              question: `A triangle has base ${base} units and height ${height} units. Find the area.`,
              options: [answer, base * height, answer * 2, base + height]
                .sort(() => Math.random() - 0.5).map(val => ({ label: `${val} sq units`, correct: val === answer }))
            };
          }
          break;
        }
        
        case 'Circumference and Area of a Circle': {
          const radius = Math.floor(Math.random() * 8) + 5;
          const isCircumference = Math.random() > 0.5;
          const answer = isCircumference ? Math.round(2 * 3.14 * radius * 100) / 100 : Math.round(3.14 * radius * radius * 100) / 100;
          question = {
            question: `A circle has radius ${radius} units. Find the ${isCircumference ? 'circumference' : 'area'}. (Use π = 3.14)`,
            options: [answer, isCircumference ? answer * 2 : answer / 2, answer + 5, Math.round(3.14 * radius * 100) / 100]
              .sort(() => Math.random() - 0.5).map(val => ({ label: `${val.toFixed(2)} ${isCircumference ? 'units' : 'sq units'}`, correct: Math.abs(val - answer) < 0.1 }))
          };
          break;
        }
        
        case 'Parts of a Circle': {
          const parts = ['radius', 'diameter', 'chord', 'arc', 'center'];
          const correct = parts[Math.floor(Math.random() * parts.length)];
          const descriptions: any = {
            radius: 'A line segment from the center to any point on the circle',
            diameter: 'A line segment passing through the center with both endpoints on the circle',
            chord: 'A line segment with both endpoints on the circle',
            arc: 'A part of the circumference of the circle',
            center: 'The fixed point from which all points on the circle are equidistant'
          };
          question = {
            question: `What is the name of this circle part? "${descriptions[correct]}"`,
            options: parts.sort(() => Math.random() - 0.5).map(p => ({ label: p.charAt(0).toUpperCase() + p.slice(1), correct: p === correct }))
          };
          break;
        }
        
        case 'Volume of Space Figures': {
          const figureType = Math.floor(Math.random() * 2);
          if (figureType === 0) {
            const side = Math.floor(Math.random() * 8) + 4;
            const answer = side * side * side;
            question = {
              question: `A cube has side length ${side} units. Find the volume.`,
              options: [answer, side * side, 6 * side * side, answer / 2]
                .sort(() => Math.random() - 0.5).map(val => ({ label: `${val} cubic units`, correct: val === answer }))
            };
          } else {
            const length = Math.floor(Math.random() * 8) + 5;
            const width = Math.floor(Math.random() * 6) + 4;
            const height = Math.floor(Math.random() * 7) + 3;
            const answer = length * width * height;
            question = {
              question: `A rectangular prism has length ${length}, width ${width}, and height ${height} units. Find the volume.`,
              options: [answer, length * width, 2 * (length + width + height), answer + 20]
                .sort(() => Math.random() - 0.5).map(val => ({ label: `${val} cubic units`, correct: val === answer }))
            };
          }
          break;
        }
        
        case 'Polygon Identification': {
          const polygons = [
            { sides: 3, name: 'Triangle' },
            { sides: 4, name: 'Quadrilateral' },
            { sides: 5, name: 'Pentagon' },
            { sides: 6, name: 'Hexagon' },
            { sides: 8, name: 'Octagon' }
          ];
          const selected = polygons[Math.floor(Math.random() * polygons.length)];
          question = {
            question: `What is the name of a polygon with ${selected.sides} sides?`,
            options: polygons.map(p => p.name).sort(() => Math.random() - 0.5).map(name => ({ label: name, correct: name === selected.name }))
          };
          break;
        }
        
        case 'Plane and 3D Figures': {
          const is3D = Math.random() > 0.5;
          const plane = ['circle', 'square', 'triangle', 'rectangle'];
          const solid = ['cube', 'sphere', 'cylinder', 'cone'];
          const correct = is3D ? solid[Math.floor(Math.random() * solid.length)] : plane[Math.floor(Math.random() * plane.length)];
          
          // Get 3 wrong answers from the opposite category
          const wrongAnswers = is3D ? plane.slice(0, 3) : solid.slice(0, 3);
          
          question = {
            question: `Which of these is a ${is3D ? '3D (solid)' : 'plane (2D)'} figure?`,
            options: [correct, ...wrongAnswers].sort(() => Math.random() - 0.5)
              .map(fig => ({ label: fig.charAt(0).toUpperCase() + fig.slice(1), correct: fig === correct }))
          };
          break;
        }
        
        case 'Basic Geometric Figures': {
          const lineTypes = ['parallel', 'perpendicular', 'intersecting'];
          const correct = lineTypes[Math.floor(Math.random() * lineTypes.length)];
          const descriptions: any = {
            parallel: 'never meet and are always the same distance apart',
            perpendicular: 'meet at a 90° angle',
            intersecting: 'cross each other at any angle'
          };
          question = {
            question: `What type of lines ${descriptions[correct]}?`,
            options: lineTypes.sort(() => Math.random() - 0.5).map(t => ({ label: t.charAt(0).toUpperCase() + t.slice(1) + ' lines', correct: t === correct }))
          };
          break;
        }
        
        default: {
          // Default fallback
          const side = Math.floor(Math.random() * 10) + 5;
          const perimeter = 4 * side;
          question = {
            question: `A square has side ${side} units. What is the perimeter?`,
            options: [perimeter, side * side, perimeter + 4, perimeter - 4]
              .sort(() => Math.random() - 0.5).map(val => ({ label: `${val} units`, correct: val === perimeter }))
          };
        }
      }
      
      setCurrentQuestion(question);
    } catch (error) {
      console.error('Error fetching adaptive state:', error);
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
            aiExplanation={lastResponse.aiExplanation}
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
