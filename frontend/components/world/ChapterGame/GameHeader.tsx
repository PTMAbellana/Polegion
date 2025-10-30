import React from 'react';

interface GameHeaderProps {
  title: string;
  currentPuzzle: number;
  totalPuzzles: number;
  styles: any;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  currentPuzzle,
  totalPuzzles,
  styles
}) => {
  return (
    <div className={styles.headerPanel}>
      <h1 className={styles.chapterTitle}>{title}</h1>
      <div className={styles.puzzleCounter}>
        Puzzle {currentPuzzle} of {totalPuzzles}
      </div>
    </div>
  );
};

export default GameHeader;
