'use client';

import React from 'react';
import { Star, Trophy } from 'lucide-react';

interface CastleCardProps {
  castleName: string;
  description: string;
  imageNumber: number;
  totalXpEarned: number;
  chaptersRemaining: number;
  styleModule: any;
  totalXp?: number;
}

export default function CastleCard({
  castleName,
  description,
  imageNumber,
  totalXpEarned,
  chaptersRemaining,
  styleModule,
  totalXp = 500
}: CastleCardProps) {
  return (
    <div className={styleModule.castleInfoContainer}>
      <div className={styleModule.castleInfoCard}>
        {/* Castle Image */}
        <div className={styleModule.castleInfoAvatar}>
          <img 
            src={`/images/castles/castle${imageNumber}.png`}
            alt={castleName}
            className={styleModule.castleImage}
          />
        </div>

        {/* Castle Name */}
        <h2 className={styleModule.castleInfoName}>{castleName}</h2>

        {/* Stats Grid */}
        <div className={styleModule.castleInfoStats}>
          <div className={styleModule.castleInfoStat}>
            <Star className={styleModule.statIcon} />
            <div className={styleModule.statText}>
              <span className={styleModule.statValue}>{totalXpEarned}</span>
              <span className={styleModule.statLabel}>XP Earned</span>
            </div>
          </div>
          <div className={styleModule.castleInfoStat}>
            <Trophy className={styleModule.statIcon} />
            <div className={styleModule.statText}>
              <span className={styleModule.statValue}>{totalXp}</span>
              <span className={styleModule.statLabel}>Total XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}