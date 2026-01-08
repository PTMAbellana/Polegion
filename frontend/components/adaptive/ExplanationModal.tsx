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
          borderRadius: '16px',
          padding: 'clamp(20px, 4vw, 32px)',
          maxWidth: '650px',
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)',
          border: '3px solid #EF4444',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon */}
        <div style={{
          width: 'clamp(50px, 12vw, 64px)',
          height: 'clamp(50px, 12vw, 64px)',
          margin: '0 auto 16px',
          borderRadius: '50%',
          backgroundColor: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(28px, 6vw, 36px)'
        }}>
          ❌
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: 'clamp(20px, 5vw, 24px)',
          fontWeight: 700,
          color: '#EF4444',
          marginBottom: '16px',
          textAlign: 'center',
          margin: '0 0 16px 0'
        }}>
          Not quite right!
        </h2>

        {/* Your Answer */}
        <div style={{
          background: '#FEE2E2',
          borderRadius: '10px',
          padding: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: '12px',
          borderLeft: '3px solid #EF4444',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#991B1B', fontWeight: 600 }}>
            Your answer:
          </span>
          <span style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: '#1F2937', fontWeight: 500 }}>
            {data.userAnswer}
          </span>
        </div>

        {/* Correct Answer */}
        <div style={{
          background: '#D1FAE5',
          borderRadius: '10px',
          padding: 'clamp(10px, 2.5vw, 14px)',
          marginBottom: '12px',
          borderLeft: '3px solid #10B981',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#065F46', fontWeight: 600 }}>
            Correct answer:
          </span>
          <span style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: '#1F2937', fontWeight: 500 }}>
            {data.correctAnswer}
          </span>
        </div>

        {/* AI Explanation */}
        <div style={{
          background: '#EFF6FF',
          borderRadius: '10px',
          padding: 'clamp(12px, 3vw, 16px)',
          marginBottom: '12px',
          borderLeft: '3px solid #3B82F6'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: 'clamp(16px, 4vw, 18px)' }}>💡</span>
            <div style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#1E40AF', fontWeight: 600 }}>
              Let me explain:
            </div>
          </div>
          <div style={{
            fontSize: 'clamp(12px, 3vw, 14px)',
            color: '#1F2937',
            lineHeight: '1.6'
          }}>
            {data.explanation}
          </div>
        </div>

        {/* Quick Tip (if hint available) */}
        {data.hint && (
          <div style={{
            background: '#FEF3C7',
            borderRadius: '10px',
            padding: 'clamp(12px, 3vw, 14px)',
            marginBottom: '12px',
            borderLeft: '3px solid #F59E0B'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px'
            }}>
              <span style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>📚</span>
              <div style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#92400E', fontWeight: 600 }}>
                Quick tip:
              </div>
            </div>
            <div style={{ fontSize: 'clamp(12px, 2.8vw, 13px)', color: '#78350F', lineHeight: '1.5' }}>
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
            borderRadius: '10px',
            padding: 'clamp(12px, 3vw, 14px) clamp(20px, 5vw, 28px)',
            fontSize: 'clamp(14px, 3.5vw, 15px)',
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
