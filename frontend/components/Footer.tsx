import styles from '../styles/Footer.module.css';
import React from 'react';

const Footer = () => {
    return (
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            &copy; {new Date().getFullYear()} Polegion. All Rights Reserved.
          </p>
        </footer>
    );
}

export default Footer;