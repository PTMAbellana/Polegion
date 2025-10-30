import React, { ReactNode } from 'react';

interface GameLayoutProps {
  children: ReactNode;
  styles: any;
  showIntro?: boolean;
  introContent?: ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  styles,
  showIntro = false,
  introContent
}) => {
  return (
    <div className={styles.chapterContainer}>
      {showIntro && introContent}
      {children}
    </div>
  );
};

export default GameLayout;
