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
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '28px',
        marginBottom: '20px'
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
          marginBottom: '24px',
          lineHeight: '1.6',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <p style={{ marginBottom: '12px' }}>
            {question?.question || 'Loading question...'}
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {(question?.options || [
            { value: 26, label: '26 units', correct: true },
            { value: 40, label: '40 units', correct: false },
            { value: 13, label: '13 units', correct: false },
            { value: 18, label: '18 units', correct: false }
          ]).map((option: any, index: number) => {
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
    );
  }

  // VISUAL REPRESENTATION
  if (representationType === 'visual') {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '28px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#1F2937',
          marginBottom: '12px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Find the Perimeter
        </h3>
        
        <p style={{ 
          fontSize: '15px', 
          color: '#6B7280',
          marginBottom: '24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Add up all the sides of the rectangle
        </p>
        
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
          <svg width="280" height="180" viewBox="0 0 280 180" style={{ maxWidth: '100%' }}>
            <rect x="40" y="30" width="200" height="120" 
              fill="#EFF6FF" 
              stroke="#3B82F6" 
              strokeWidth="3"
            />
            
            <text x="140" y="20" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1F2937">
              8 units
            </text>
            <text x="140" y="170" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1F2937">
              8 units
            </text>
            
            <text x="20" y="90" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1F2937" transform="rotate(-90, 20, 90)">
              5 units
            </text>
            <text x="260" y="90" textAnchor="middle" fontSize="16" fontWeight="600" fill="#1F2937" transform="rotate(90, 260, 90)">
              5 units
            </text>
            
            <circle cx="40" cy="30" r="5" fill="#3B82F6" />
            <circle cx="240" cy="30" r="5" fill="#3B82F6" />
            <circle cx="240" cy="150" r="5" fill="#3B82F6" />
            <circle cx="40" cy="150" r="5" fill="#3B82F6" />
          </svg>
        </div>

        <div style={{ 
          textAlign: 'center', 
          fontSize: '15px', 
          color: '#6B7280',
          marginBottom: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          8 + 5 + 8 + 5 = ?
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { value: 26, label: '26 units', correct: true },
            { value: 40, label: '40 units', correct: false },
            { value: 13, label: '13 units', correct: false },
            { value: 18, label: '18 units', correct: false }
          ].map((option, index) => (
            <button
              key={option.value}
              onClick={() => !disabled && handleSubmit(option.correct, option)}
              disabled={disabled}
              style={getButtonStyle(index + 10)}
              onMouseEnter={() => setHoveredButton(index + 10)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // REAL-WORLD REPRESENTATION
  if (representationType === 'real_world') {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '28px',
        marginBottom: '20px'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: 600, 
          color: '#1F2937',
          marginBottom: '16px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          Garden Fence Problem
        </h3>
        
        <div style={{ 
          backgroundColor: '#F9FAFB',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #E5E7EB'
        }}>
          <p style={{ 
            fontSize: '15px', 
            color: '#4B5563',
            lineHeight: '1.7',
            margin: '0 0 16px 0',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            Sarah wants to build a fence around her rectangular garden.
          </p>
          <p style={{ 
            fontSize: '15px', 
            color: '#4B5563',
            lineHeight: '1.7',
            margin: 0,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            The garden is <span style={{ fontWeight: 600, color: '#1F2937' }}>8 meters long</span> and{' '}
            <span style={{ fontWeight: 600, color: '#1F2937' }}>5 meters wide</span>.
          </p>
        </div>
        
        <p style={{ 
          fontSize: '16px', 
          fontWeight: 600,
          color: '#1F2937',
          marginBottom: '20px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          How many meters of fence does she need?
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {[
            { value: 26, label: '26 meters', correct: true },
            { value: 40, label: '40 meters', correct: false },
            { value: 13, label: '13 meters', correct: false },
            { value: 18, label: '18 meters', correct: false }
          ].map((option, index) => (
            <button
              key={option.value}
              onClick={() => !disabled && handleSubmit(option.correct, option)}
              disabled={disabled}
              style={getButtonStyle(index + 20)}
              onMouseEnter={() => setHoveredButton(index + 20)}
              onMouseLeave={() => setHoveredButton(null)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
