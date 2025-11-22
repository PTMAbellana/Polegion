'use client';

import React, { useRef, useEffect } from 'react';
import Image from 'next/image';

interface ConceptCardProps {
  title: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  icon?: React.ReactNode;
  highlighted?: boolean;
  onClick?: () => void;
  styleModule: { readonly [key: string]: string };
}

const ConceptCard: React.FC<ConceptCardProps> = ({
  title,
  description,
  imageSrc,
  imageAlt = '',
  icon,
  highlighted = false,
  onClick,
  styleModule,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to highlighted card
  useEffect(() => {
    if (highlighted && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [highlighted]);

  return (
    <div
      ref={cardRef}
      className={`${styleModule.conceptCard} ${
        highlighted ? styleModule.conceptCardHighlighted : ''
      } ${onClick ? styleModule.conceptCardClickable : ''}`}
      onClick={onClick}
    >
      {/* Icon/Image Section - Only render if there's content */}
      {(imageSrc || icon) && (
        <div className={styleModule.conceptImageSection}>
          {imageSrc && (
            <div className={styleModule.conceptImage}>
              <Image src={imageSrc} alt={imageAlt} width={120} height={120} />
            </div>
          )}
          
          {!imageSrc && icon && (
            <div className={styleModule.conceptImage}>{icon}</div>
          )}
        </div>
      )}

      {/* Text Section */}
      <div className={styleModule.conceptTextSection}>
        <h3 className={styleModule.conceptTitle}>{title}</h3>
        <p className={styleModule.conceptDescription}>{description}</p>
      </div>
    </div>
  );
};

export default ConceptCard;
