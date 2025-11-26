import React from 'react';
import styles from '@/styles/dashboard-wow.module.css';

interface PageHeaderProps {
  title: string;
  userName?: string;
  subtitle?: string;
  showAvatar?: boolean;
  avatarText?: string;
  className?: string;
  actionButton?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  userName,
  subtitle,
  showAvatar = true,
  avatarText,
  className = "",
  actionButton
}) => {
  const getAvatarLetter = () => {
    if (avatarText) return avatarText;
    if (userName) return userName.charAt(0).toUpperCase();
    return 'U';
  };

  return (
    <div className={`${styles["header-section"]} ${className}`}>
      {showAvatar && (
        <div className={styles["user-avatar"]}>
          <span className={styles["avatar-letter"]}>
            {getAvatarLetter()}
          </span>
        </div>
      )}
      <div className={styles["welcome-text"]}>
        <h1>{title}</h1>
        {userName && (
          <p>Welcome, {userName}</p>
        )}
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actionButton && (
        <div className={styles["header-actions"]}>
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default PageHeader;