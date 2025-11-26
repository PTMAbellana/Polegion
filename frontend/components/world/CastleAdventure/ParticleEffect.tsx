import React from 'react';

interface ParticleEffectProps {
  count?: number;
  styles: any;
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  count = 15,
  styles
}) => {
  return (
    <div className={styles.particlesContainer}>
      {[...Array(count)].map((_, i) => (
        <div 
          key={i} 
          className={styles.particle}
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${3 + Math.random() * 4}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default ParticleEffect;
