'use client';

import React from 'react';

interface VisualDemoProps {
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  height?: number | string;
  backgroundColor?: string;
  caption?: string;
  styleModule: { readonly [key: string]: string };
}

const VisualDemo: React.FC<VisualDemoProps> = ({
  title,
  children,
  width = '100%',
  height = 'auto',
  backgroundColor = 'transparent',
  caption,
  styleModule,
}) => {
  return (
    <div className={styleModule.visualDemo}>
      {title && <h4 className={styleModule.visualDemoTitle}>{title}</h4>}
      
      <div
        className={styleModule.visualDemoContent}
        style={{
          width,
          height,
          backgroundColor,
        }}
      >
        {children}
      </div>
      
      {caption && <p className={styleModule.visualDemoCaption}>{caption}</p>}
    </div>
  );
};

export default VisualDemo;
