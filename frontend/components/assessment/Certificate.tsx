'use client';

import React, { forwardRef } from 'react';
import styles from '@/styles/certificate.module.css';

interface CertificateProps {
  userName: string;
  completionDate: string;
}

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(
  ({ userName, completionDate }, ref) => {
    return (
      <div ref={ref} className={styles.certificateContainer}>
        <div className={styles.certificateBorder}>
          <div className={styles.certificateInner}>
            {/* Header with logo */}
            <div className={styles.header}>
              <img 
                src="/images/polegionLogo.webp" 
                alt="Polegion Logo" 
                className={styles.logo}
              />
              <h1 className={styles.mainTitle}>Certificate of Completion</h1>
            </div>

            {/* Decorative line */}
            <div className={styles.decorativeLine}></div>

            {/* Body */}
            <div className={styles.body}>
              <p className={styles.subtitle}>This is to certify that</p>
              
              <h2 className={styles.userName}>{userName}</h2>
              
              <p className={styles.description}>
                has successfully completed the
              </p>
              
              <h3 className={styles.programName}>
                Polegion Geometry Adventure
              </h3>
              
              <p className={styles.achievement}>
                Demonstrating mastery in geometric principles, problem-solving,
                <br />
                and analytical thinking through the completion of all challenges
                <br />
                in the Kingdom of Geometry.
              </p>

              <div className={styles.dateSection}>
                <p className={styles.dateLabel}>Date of Completion</p>
                <p className={styles.date}>{completionDate}</p>
              </div>
            </div>

            {/* Footer decorations */}
            <div className={styles.footer}>
              <div className={styles.seal}>
                <div className={styles.sealInner}>
                  <span className={styles.sealText}>GEOMETRY</span>
                  <span className={styles.sealText}>MASTER</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Certificate.displayName = 'Certificate';

export default Certificate;
