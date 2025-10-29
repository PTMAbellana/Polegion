'use client';

import React from 'react';

interface CastleIntroProps {
  show: boolean;
  castleName: string;
  description: string;
  styleModule: any;
}

export default function CastleIntro({ show, castleName, description, styleModule }: CastleIntroProps) {
  if (!show) return null;

  return (
    <div className={styleModule.introOverlay}>
      <div className={styleModule.introContent}>
        <h1 className={styleModule.introTitle}>Welcome to {castleName}</h1>
        <p className={styleModule.introText}>{description}</p>
        <div className={styleModule.introSpinner}></div>
      </div>
    </div>
  );
}