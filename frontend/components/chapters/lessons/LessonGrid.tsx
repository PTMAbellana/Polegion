'use client';

import React from 'react';

interface LessonGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'small' | 'medium' | 'large';
  styleModule: { readonly [key: string]: string };
}

const LessonGrid: React.FC<LessonGridProps> = ({
  children,
  columns = 2,
  gap = 'medium',
  styleModule,
}) => {
  const gridClass = styleModule[`lessonGrid${columns}Col`] || styleModule.lessonGrid;
  const gapClass = styleModule[`gap${gap.charAt(0).toUpperCase() + gap.slice(1)}`] || '';

  return (
    <div className={`${gridClass} ${gapClass}`}>
      {children}
    </div>
  );
};

export default LessonGrid;
