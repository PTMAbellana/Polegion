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
          backgroundColor: '#f4e9d9',
          borderRadius: '16px',
          padding: 'clamp(16px, 3.5vw, 24px)',
          maxWidth: '600px',
          width: '92%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(139, 100, 60, 0.4), inset 0 2px 8px rgba(218, 165, 32, 0.1)',
          border: '4px solid #b8860b',
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
          transition: 'transform 0.3s ease',
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
            width: 'clamp(50px, 10vw, 60px)',
            height: 'clamp(50px, 10vw, 60px)',
            margin: '0 auto 12px',
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, #fecaca, #ef4444)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(32px, 6vw, 40px)',
            border: '4px solid #b91c1c',
            boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.3))'
          }}>
            ❌
          </div>

          {/* Title */}
          <h2 style={{
            fontSize: 'clamp(20px, 4.5vw, 24px)',
            fontWeight: 800,
            color: '#7c2d12',
            marginBottom: '12px',
            textAlign: 'center',
            margin: '0 0 12px 0',
            fontFamily: 'Cinzel, serif',
            textShadow: '0 1px 2px rgba(139, 100, 60, 0.2)',
            letterSpacing: '0.5px'
          }}>
            Not quite right!
          </h2>

          {/* Your Answer */}
          <div style={{
            background: 'rgba(254, 226, 226, 0.5)',
            borderRadius: '8px',
            padding: 'clamp(8px, 2vw, 10px)',
            marginBottom: '8px',
            borderLeft: '5px solid #dc2626',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#7f1d1d', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
              Your answer:
            </span>
            <span style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: '#3d2817', fontWeight: 600, fontFamily: 'Georgia, serif' }}>
              {data.userAnswer}
            </span>
          </div>

          {/* Correct Answer */}
          <div style={{
            background: 'rgba(209, 250, 229, 0.5)',
            borderRadius: '8px',
            padding: 'clamp(8px, 2vw, 10px)',
            marginBottom: '10px',
            borderLeft: '5px solid #16a34a',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <span style={{ fontSize: 'clamp(11px, 2.5vw, 12px)', color: '#14532d', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
              Correct answer:
            </span>
            <span style={{ fontSize: 'clamp(13px, 3vw, 15px)', color: '#3d2817', fontWeight: 600, fontFamily: 'Georgia, serif' }}>
              {data.correctAnswer}
            </span>
          </div>

          {/* AI Explanation */}
          <div style={{
            background: 'rgba(139, 100, 60, 0.08)',
            borderRadius: '8px',
            padding: 'clamp(10px, 2.5vw, 12px)',
            marginBottom: '8px',
            borderLeft: '5px solid #b8860b',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px'
          }}>
            <span style={{ fontSize: 'clamp(20px, 4.5vw, 24px)' }}>💡</span>
            <div style={{ fontSize: 'clamp(13px, 2.8vw, 14px)', color: '#654321', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
              Let me explain:
            </div>
          </div>
          <div style={{
            fontSize: 'clamp(13px, 3vw, 15px)',
            color: '#3d2817',
            lineHeight: '1.7',
            fontFamily: 'Georgia, serif'
          }}>
            {data.explanation}
          </div>
        </div>

        {/* Quick Tip (if hint available) */}
        {data.hint && (
          <div style={{
            background: 'rgba(254, 243, 199, 0.6)',
            borderRadius: '8px',
            padding: 'clamp(10px, 2.5vw, 12px)',
            marginBottom: '10px',
            borderLeft: '5px solid #d97706',
            boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '6px'
            }}>
              <span style={{ fontSize: 'clamp(18px, 4vw, 20px)' }}>📚</span>
              <div style={{ fontSize: 'clamp(13px, 2.8vw, 14px)', color: '#78350f', fontWeight: 700, fontFamily: 'Cinzel, serif' }}>
                Quick tip:
              </div>
            </div>
            <div style={{ fontSize: 'clamp(13px, 3vw, 14px)', color: '#3d2817', lineHeight: '1.6', fontFamily: 'Georgia, serif' }}>
              {data.hint}
            </div>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #8b7355, #654321)',
            color: '#fef5e7',
            border: '3px solid #3d2817',
            borderRadius: '10px',
            padding: 'clamp(12px, 3vw, 14px) clamp(18px, 4.5vw, 24px)',
            fontSize: 'clamp(14px, 3.2vw, 16px)',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
            fontFamily: 'Cinzel, serif',
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
          }}
        >
          Got it! Next Question →
        </button>
        </div>
      </div>
    </div>
  );
}
