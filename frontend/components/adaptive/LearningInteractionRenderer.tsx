'use client';

import { useState } from 'react';

interface LearningInteractionProps {
  representationType: 'text' | 'visual' | 'real_world';
  difficultyLevel: number;
  onAnswer: (isCorrect: boolean, selectedOption: any) => void;
  disabled?: boolean;
  question?: any;
}

const buttonBaseStyle = {
  padding: '18px 24px',
  fontSize: '16px',
  fontWeight: 500,
  backgroundColor: 'white',
  border: '2px solid #E5E7EB',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  color: '#1F2937',
  textAlign: 'left' as const,
  width: '100%'
};

export default function LearningInteractionRenderer({
  representationType = 'text',
  difficultyLevel,
  onAnswer,
  disabled = false,
  question
}: LearningInteractionProps) {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  const handleSubmit = (isCorrect: boolean, option: any) => {
    onAnswer(isCorrect, option);
  };

  const getButtonStyle = (index: number) => ({
    ...buttonBaseStyle,
    backgroundColor: hoveredButton === index && !disabled ? '#F9FAFB' : 'white',
    borderColor: hoveredButton === index && !disabled ? '#3B82F6' : '#E5E7EB',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer'
  });

  // TEXT REPRESENTATION
  if (representationType === 'text') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Question Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '28px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#1F2937',
            marginBottom: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Solve the Problem
          </h3>
          
          <div style={{ 
            fontSize: '16px', 
            color: '#4B5563',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <p style={{ margin: 0 }}>
              {question?.question || 'Loading question...'}
            </p>
          </div>
        </div>
        
        {/* Choices Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '28px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {(question?.options || []).length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '20px',
                color: '#6B7280',
                fontSize: '14px'
              }}>
                Loading options...
              </div>
            ) : (question?.options || []).map((option: any, index: number) => {
              const isCorrect = option.correct === true || option.isCorrect === true;
              return (
                <button
                  key={option.value || index}
                  onClick={() => !disabled && handleSubmit(isCorrect, option)}
                  disabled={disabled}
                  style={getButtonStyle(index)}
                  onMouseEnter={() => setHoveredButton(index)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {option.label || option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // VISUAL REPRESENTATION
  if (representationType === 'visual') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Question Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '28px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#1F2937',
            marginBottom: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Solve the Problem
          </h3>
          
          <div style={{ 
            fontSize: '16px', 
            color: '#4B5563',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <p style={{ margin: 0 }}>
              {question?.question || 'Loading question...'}
            </p>
          </div>
        </div>
        
        {/* Choices Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '28px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {(question?.options || []).length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '20px',
                color: '#6B7280',
                fontSize: '14px'
              }}>
                Loading options...
              </div>
            ) : (question?.options || []).map((option: any, index: number) => {
              const isCorrect = option.correct === true || option.isCorrect === true;
              return (
                <button
                  key={option.value || index}
                  onClick={() => !disabled && handleSubmit(isCorrect, option)}
                  disabled={disabled}
                  style={getButtonStyle(index + 10)}
                  onMouseEnter={() => setHoveredButton(index + 10)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {option.label || option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // REAL-WORLD REPRESENTATION
  if (representationType === 'real_world') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Question Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '28px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#1F2937',
            marginBottom: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Real-World Problem
          </h3>
          
          <div style={{ 
            fontSize: '16px', 
            color: '#4B5563',
            lineHeight: '1.6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <p style={{ margin: 0 }}>
              {question?.question || 'Loading question...'}
            </p>
          </div>
        </div>
        
        {/* Choices Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '28px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {(question?.options || []).length === 0 ? (
              <div style={{
                gridColumn: '1 / -1',
                textAlign: 'center',
                padding: '20px',
                color: '#6B7280',
                fontSize: '14px'
              }}>
                Loading options...
              </div>
            ) : (question?.options || []).map((option: any, index: number) => {
              const isCorrect = option.correct === true || option.isCorrect === true;
              return (
                <button
                  key={option.value || index}
                  onClick={() => !disabled && handleSubmit(isCorrect, option)}
                  disabled={disabled}
                  style={getButtonStyle(index + 20)}
                  onMouseEnter={() => setHoveredButton(index + 20)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {option.label || option.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
