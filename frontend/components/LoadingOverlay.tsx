import React from 'react';
import Loader from './Loader';
import styles from '@/styles/dashboard-wow.module.css';

interface LoadingOverlayProps {
  isLoading: boolean;
  children?: React.ReactNode;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className = ""
}) => {
  return (
    <div className={className}>
      {isLoading && (
        <div className={styles["loading-overlay"]}>
          <Loader />
        </div>
      )}
      {children}
    </div>
  );
};

export default LoadingOverlay;