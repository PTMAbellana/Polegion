'use client';

import { useState } from 'react';
import Image from 'next/image';

interface WizardHelperProps {
  onHintRequest: () => void;
  hintAvailable: boolean;
  encouragementMessage?: string;
  position?: 'bottom-left' | 'bottom-right';
}

export default function WizardHelper({ 
  onHintRequest, 
  hintAvailable, 
  encouragementMessage,
  position = 'bottom-right'
}: WizardHelperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const positionStyles = position === 'bottom-left' 
    ? { bottom: '32px', left: '32px' }
    : { bottom: '32px', right: '32px' };

  return (
    <>
      {/* Wizard Character */}
      <div
        style={{
          position: 'fixed',
          ...positionStyles,
          zIndex: 100,
          cursor: hintAvailable ? 'pointer' : 'default',
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (hintAvailable) {
            onHintRequest();
          } else {
            setShowMessage(true);
            setTimeout(() => setShowMessage(false), 3000);
          }
        }}
      >
        {/* Wizard Avatar Container */}
        <div style={{
          position: 'relative',
          width: '120px',
          height: '120px'
        }}>
          {/* Glow Effect */}
          <div style={{
            position: 'absolute',
            inset: '-10px',
            background: hintAvailable 
              ? 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(184, 134, 11, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            animation: hintAvailable ? 'pulse 2s ease-in-out infinite' : 'none',
            filter: 'blur(8px)'
          }} />

          {/* Wizard Image Circle */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: hintAvailable 
              ? 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)'
              : 'linear-gradient(135deg, #fef5e7 0%, #f5e6d3 100%)',
            border: `4px solid ${hintAvailable ? '#F59E0B' : '#b8860b'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: hintAvailable 
              ? '0 8px 24px rgba(245, 158, 11, 0.4), inset 0 2px 8px rgba(255, 255, 255, 0.3)'
              : '0 4px 12px rgba(139, 100, 60, 0.3), inset 0 2px 8px rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease'
          }}>
            <Image
              src="/images/wizards/archim-wizard.webp"
              alt="Wizard Archimedes"
              width={112}
              height={112}
              style={{
                objectFit: 'cover',
                borderRadius: '50%'
              }}
            />
          </div>

          {/* Hint Badge */}
          {hintAvailable && (
            <div style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#EF4444',
              border: '3px solid white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'white',
              animation: 'bounce 1s ease-in-out infinite',
              boxShadow: '0 4px 8px rgba(239, 68, 68, 0.4)'
            }}>
              !
            </div>
          )}
        </div>

        {/* Wizard Name Tag */}
        <div style={{
          marginTop: '8px',
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 600,
          color: '#8b643c',
          fontFamily: 'Cinzel, serif',
          textShadow: '0 1px 2px rgba(255, 255, 255, 0.8)'
        }}>
          Archimedes
        </div>
      </div>

      {/* Floating Message Bubble */}
      {(showMessage || (isHovered && encouragementMessage)) && (
        <div style={{
          position: 'fixed',
          ...positionStyles,
          [position === 'bottom-left' ? 'left' : 'right']: '172px',
          bottom: '72px',
          zIndex: 99,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #fffaf0 0%, #fef5e7 100%)',
            border: '3px solid #b8860b',
            borderRadius: '16px',
            padding: '16px 20px',
            boxShadow: '0 8px 24px rgba(139, 100, 60, 0.25), inset 0 2px 4px rgba(218, 165, 32, 0.1)',
            maxWidth: '280px',
            position: 'relative',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            {/* Speech Bubble Arrow */}
            <div style={{
              position: 'absolute',
              [position === 'bottom-left' ? 'left' : 'right']: '-12px',
              bottom: '24px',
              width: 0,
              height: 0,
              borderTop: '10px solid transparent',
              borderBottom: '10px solid transparent',
              [position === 'bottom-left' ? 'borderRight' : 'borderLeft']: '12px solid #b8860b'
            }} />
            <div style={{
              position: 'absolute',
              [position === 'bottom-left' ? 'left' : 'right']: '-8px',
              bottom: '25px',
              width: 0,
              height: 0,
              borderTop: '9px solid transparent',
              borderBottom: '9px solid transparent',
              [position === 'bottom-left' ? 'borderRight' : 'borderLeft']: '10px solid #fffaf0'
            }} />

            <div style={{
              fontSize: '14px',
              color: '#4a3f2e',
              lineHeight: '1.5'
            }}>
              {hintAvailable 
                ? "🌟 I sense you need guidance! Click me for a hint!"
                : showMessage
                  ? "⏳ Hints will unlock after you try once more."
                  : encouragementMessage || "Keep up the great work, young scholar!"}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(${position === 'bottom-left' ? '-20px' : '20px'}); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
