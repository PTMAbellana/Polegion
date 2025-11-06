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
    <div className={styleModule.castleInfoContainer}>
      <div className={styleModule.castleInfoCard}>
        <div className={styleModule.castleInfoAvatar}>
          <img 
            src={`/images/castles/castle${imageNumber}.png`}
            alt={castleName}
            className={styleModule.castleImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove(styleModule.hidden);
            }}
          />
          <span className={`${styleModule.castleEmoji} ${styleModule.hidden}`}>🏰</span>
        </div>
        <h2 className={styleModule.castleInfoName}>{castleName}</h2>
        <p className={styleModule.castleInfoQuote}>"{description}"</p>
        <div className={styleModule.castleInfoStats}>
          <div className={styleModule.castleInfoStat}>
            <Star className={styleModule.statIcon} />
            <span>{totalXpEarned} XP Earned</span>
          </div>
          <div className={styleModule.castleInfoStat}>
            <Zap className={styleModule.statIcon} />
            <span>{chaptersRemaining} Chapters Remaining</span>
          </div>
        </div>
      </div>
    </div>
  );
}