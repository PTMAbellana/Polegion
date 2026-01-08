'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationModalProps {
  type: 'unlock' | 'mastery';
  title: string;
  message: string;
  onClose: () => void;
  show: boolean;
}

/**
 * CelebrationModal
 * Displays celebration animations when:
 * - Topic is unlocked (mastery level 3)
 * - Topic is mastered (mastery level 5)
 */
export default function CelebrationModal({
  type,
  title,
  message,
  onClose,
  show
}: CelebrationModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);

      // Trigger confetti for mastery achievement
      if (type === 'mastery') {
        triggerConfetti();
      }

      // Auto-close after 4 seconds
      const timer = setTimeout(() => {
        handleClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, type]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FFA500', '#FF6347', '#4CAF50', '#2196F3'];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for fade-out animation
  };

  if (!show) return null;

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
        transition: 'opacity 0.3s ease'
      }}
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: '#f4e9d9',
          borderRadius: '20px',
          padding: '40px',
          maxWidth: '550px',
          width: '90%',
          textAlign: 'center',
          boxShadow: '0 25px 60px rgba(139, 100, 60, 0.5), inset 0 2px 8px rgba(218, 165, 32, 0.1)',
          border: type === 'mastery' ? '5px solid #daa520' : '5px solid #b8860b',
          transform: isVisible ? 'scale(1)' : 'scale(0.8)',
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
          borderRadius: '20px'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Icon */}
          <div style={{ 
            width: '110px',
            height: '110px',
            margin: '0 auto 24px',
            borderRadius: '50%',
            background: type === 'mastery'
              ? 'radial-gradient(circle at 30% 30%, #fbbf24, #daa520)'
              : 'radial-gradient(circle at 30% 30%, #b8860b, #8b7355)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '56px',
            fontWeight: 'bold',
            border: type === 'mastery' ? '5px solid #b8860b' : '5px solid #654321',
            boxShadow: '0 8px 24px rgba(139, 100, 60, 0.5), inset 0 2px 6px rgba(255, 255, 255, 0.3)',
            filter: 'drop-shadow(0 0 12px rgba(218, 165, 32, 0.4))'
          }}>
            {type === 'unlock' ? '🔓' : '👑'}
          </div>

          {/* Title */}
          <h2
            style={{
              fontSize: '36px',
              fontWeight: 800,
              marginBottom: '20px',
              fontFamily: 'Cinzel, serif',
              color: type === 'mastery' ? '#654321' : '#8b4513',
              textShadow: '0 2px 4px rgba(139, 100, 60, 0.3)',
              letterSpacing: '1px'
            }}
          >
            {title}
          </h2>

          {/* Message */}
          <p
            style={{
              fontSize: '18px',
              marginBottom: '32px',
              lineHeight: '1.7',
              fontFamily: 'Georgia, serif',
              color: '#3d2817',
              fontWeight: 500
            }}
          >
            {message}
          </p>

          {/* Close Button */}
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              maxWidth: '320px',
              background: type === 'mastery'
                ? 'linear-gradient(135deg, #daa520, #b8860b)'
                : 'linear-gradient(135deg, #8b7355, #654321)',
              color: '#fef5e7',
              border: '3px solid #3d2817',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '18px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'Cinzel, serif',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
            }}
          >
            Continue Quest
          </button>

          {/* Mastery Level Indicator */}
          {type === 'mastery' && (
            <div style={{ marginTop: '24px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    border: '2px solid #b8860b',
                    boxShadow: '0 2px 6px rgba(184, 134, 11, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)'
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
