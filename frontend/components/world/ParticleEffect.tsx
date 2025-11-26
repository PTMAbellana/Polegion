'use client';

import React from 'react';

interface ParticleEffectProps {
  count?: number;
  styleModule: any;
}

export default function ParticleEffect({ count = 15, styleModule }: ParticleEffectProps) {
  return (
    <div className={styleModule.particlesContainer}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={styleModule.particle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}
    </div>
  );
}