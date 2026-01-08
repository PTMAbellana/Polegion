'use client';

import { useEffect, useState } from 'react';

interface ExplanationModalProps {
  show: boolean;
  data: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    explanation: string;
    hint?: string;
  } | null;
  onContinue: () => void;
}

/**
 * ExplanationModal
 * Shows AI-generated explanation when student gets a question wrong
 * Helps with formative assessment by teaching the correct concept
 */
export default function ExplanationModal({ show, data, onContinue }: ExplanationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [show]);

  if (!show || !data) return null;

  const handleContinue = () => {
    setIsVisible(false);
    setTimeout(() => {
      onContinue();
    }, 300);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
      onClick={handleContinue}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '650px',
          width: '90%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '3px solid #EF4444',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div style={{
          width: '80px',
          height: '80px',
          margin: '0 auto 24px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}>
          ❌
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '28px',
          fontWeight: 700,
          color: '#EF4444',
          marginBottom: '16px',
          textAlign: 'center',
          margin: '0 0 24px 0'
        }}>
          Not quite right!
        </h2>

        {/* Your Answer */}
        <div style={{
          background: '#FEE2E2',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '16px',
          borderLeft: '4px solid #EF4444'
        }}>
          <div style={{ fontSize: '13px', color: '#991B1B', fontWeight: 600, marginBottom: '8px' }}>
            Your answer:
          </div>
          <div style={{ fontSize: '16px', color: '#1F2937', fontWeight: 500 }}>
            {data.userAnswer}
          </div>
        </div>

        {/* Correct Answer */}
        <div style={{
          background: '#D1FAE5',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          borderLeft: '4px solid #10B981'
        }}>
          <div style={{ fontSize: '13px', color: '#065F46', fontWeight: 600, marginBottom: '8px' }}>
            Correct answer:
          </div>
          <div style={{ fontSize: '16px', color: '#1F2937', fontWeight: 500 }}>
            {data.correctAnswer}
          </div>
        </div>

        {/* AI Explanation */}
        <div style={{
          background: '#EFF6FF',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          borderLeft: '4px solid #3B82F6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ fontSize: '20px' }}>💡</span>
            <div style={{ fontSize: '13px', color: '#1E40AF', fontWeight: 600 }}>
              Let me explain:
            </div>
          </div>
          <div style={{
            fontSize: '15px',
            color: '#1F2937',
            lineHeight: '1.7'
          }}>
            {data.explanation}
          </div>
        </div>

        {/* Quick Tip (if hint available) */}
        {data.hint && (
          <div style={{
            background: '#FEF3C7',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px',
            borderLeft: '4px solid #F59E0B'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '16px' }}>📚</span>
              <div style={{ fontSize: '13px', color: '#92400E', fontWeight: 600 }}>
                Quick tip:
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#78350F', lineHeight: '1.6' }}>
              {data.hint}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          style={{
            width: '100%',
            backgroundColor: '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 32px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3B82F6';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
          }}
        >
          Got it! Next Question →
        </button>
      </div>
    </div>
  );
}
