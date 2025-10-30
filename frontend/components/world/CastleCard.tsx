'use client';

import React from 'react';
import { Star, Zap } from 'lucide-react';

interface CastleCardProps {
  castleName: string;
  description: string;
  imageNumber: number;
  totalXpEarned: number;
  chaptersRemaining: number;
  styleModule: any;
}

export default function CastleCard({
  castleName,
  description,
  imageNumber,
  totalXpEarned,
  chaptersRemaining,
  styleModule
}: CastleCardProps) {
  return (
    <div className={styleModule.wizardContainer}>
      <div className={styleModule.wizardCard}>
        <div className={styleModule.wizardAvatar}>
          <img 
            src={`/images/castles/castle${imageNumber}.png`}
            alt={castleName}
            className={styleModule.castleImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove(styleModule.hidden);
            }}
          />
          <span className={`${styleModule.wizardEmoji} ${styleModule.hidden}`}>🏰</span>
        </div>
        <h2 className={styleModule.wizardName}>{castleName}</h2>
        <p className={styleModule.wizardQuote}>"{description}"</p>
        <div className={styleModule.wizardStats}>
          <div className={styleModule.wizardStat}>
            <Star className={styleModule.statIcon} />
            <span>{totalXpEarned} XP Earned</span>
          </div>
          <div className={styleModule.wizardStat}>
            <Zap className={styleModule.statIcon} />
            <span>{chaptersRemaining} Chapters Remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}