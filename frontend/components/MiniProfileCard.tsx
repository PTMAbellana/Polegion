import React from 'react';
import { useRouter } from 'next/navigation';
import AnimatedAvatar from '@/components/profile/AnimatedAvatar';
import styles from '@/styles/mini-profile-card.module.css';

interface MiniProfileCardProps {
  firstName?: string;
  lastName?: string;
  profilePic?: string;
  role: 'Teacher' | 'Student';
  profileRoute: string;
}

const MiniProfileCard: React.FC<MiniProfileCardProps> = ({
  firstName,
  lastName,
  profilePic,
  role,
  profileRoute
}) => {
  const router = useRouter();
  const firstInitial = firstName?.charAt(0).toUpperCase() || (role === 'Teacher' ? 'T' : 'S');

  return (
    <section className={styles.miniProfileCard}>
      <div className={styles.miniProfileAvatar}>
        {profilePic ? (
          <AnimatedAvatar
            className={styles.miniProfileImg}
            src={profilePic}
            alt={`${firstName} ${lastName}`}
          />
        ) : (
          <div className={styles.miniProfileLetter}>
            {firstInitial}
          </div>
        )}
      </div>
      
      <div className={styles.miniProfileInfo}>
        <h3 className={styles.miniProfileName}>
          {firstName} {lastName}
        </h3>
        <p className={styles.miniProfileRole}>
          {role}
        </p>
      </div>
      
      <button 
        className={styles.viewProfileButton}
        onClick={() => router.push(profileRoute)}
        aria-label="View full profile"
      >
        View Full Profile
      </button>
    </section>
  );
};

export default MiniProfileCard;
