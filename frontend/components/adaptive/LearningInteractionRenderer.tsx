'use client';

import { useState } from 'react';

interface LearningInteractionProps {
  representationType: 'text' | 'visual' | 'real_world';
  difficultyLevel: number;
  onAnswer: (isCorrect: boolean, selectedOption: any) => void;
  disabled?: boolean;
  question?: any;
  selectedOption?: any;
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
  question,
  selectedOption
}: LearningInteractionProps) {
  const [hoveredButton, setHoveredButton] = useState<number | null>(null);

  const handleSubmit = (isCorrect: boolean, option: any) => {
    onAnswer(isCorrect, option);
  };

  const isOptionSelected = (option: any) => {
    if (!selectedOption) return false;
    // Compare the actual text/label content for precise matching
    const optionText = option.text || option.label || option.value;
    const selectedText = selectedOption.text || selectedOption.label || selectedOption.value;
    return optionText === selectedText && optionText !== undefined && optionText !== '';
  };

  const getButtonStyle = (index: number, option: any) => ({
    ...buttonBaseStyle,
    backgroundColor: isOptionSelected(option) ? '#fef5e7' : (hoveredButton === index && !disabled ? '#fffaf0' : 'white'),
    borderColor: isOptionSelected(option) ? '#b8860b' : (hoveredButton === index && !disabled ? '#daa520' : '#E5E7EB'),
    borderWidth: isOptionSelected(option) ? '3px' : '2px',
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: isOptionSelected(option) ? '0 4px 12px rgba(184, 134, 11, 0.3), inset 0 2px 4px rgba(218, 165, 32, 0.1)' : 'none'
  });

  // TEXT REPRESENTATION
  if (representationType === 'text') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Question Container */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          padding: '24px'
        }}>
          <div style={{ 
            fontSize: '16px', 
            color: '#1F2937',
            lineHeight: '1.6',
            fontWeight: 500,
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
                  style={getButtonStyle(index, option)}
                  onMouseEnter={() => setHoveredButton(index)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {option.text || option.label}
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
          padding: '28px',
          border: '2px solid #3B82F6'
        }}>
          {/* Visual Indicator Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#EFF6FF',
            color: '#3B82F6',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <span style={{ fontSize: '16px' }}>👁️</span>
            VISUAL DESCRIPTION
          </div>
          
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: 600, 
            color: '#1F2937',
            marginBottom: '16px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Visualize and Solve
          </h3>
          
          <div style={{ 
            fontSize: '16px', 
            color: '#4B5563',
            lineHeight: '1.8',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontStyle: 'italic',
            backgroundColor: '#F9FAFB',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid #3B82F6'
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
                  style={getButtonStyle(index + 10, option)}
                  onMouseEnter={() => setHoveredButton(index + 10)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {option.text || option.label}
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
          padding: '28px',
          border: '2px solid #10B981'
        }}>
          {/* Real-World Indicator Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#F0FDF4',
            color: '#10B981',
            padding: '4px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <span style={{ fontSize: '16px' }}>🌍</span>
            REAL-WORLD APPLICATION
          </div>
          
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
            lineHeight: '1.8',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: '#F9FAFB',
            padding: '16px',
            borderRadius: '8px',
            borderLeft: '4px solid #10B981'
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
                  style={getButtonStyle(index + 20, option)}
                  onMouseEnter={() => setHoveredButton(index + 20)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  {option.text || option.label}
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
