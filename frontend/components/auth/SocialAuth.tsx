"use client";
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '@/lib/supabaseClient';
import styles from '@/styles/login.module.css';

export default function SocialAuth() {
  const handleSocialOauth = async (provider: "google" | "github") => {
    try {
      await supabase.auth.signInWithOAuth({
        provider,
      });
    } catch (error) {
      console.error(`${provider} OAuth error:`, error);
    }
  };

  return (
    <>
      <div className={styles.socialDivider}>
        <div className={styles.dividerLine}></div>
        <span className={styles.dividerText}>OR</span>
        <div className={styles.dividerLine}></div>
      </div>

      <div className={styles.socialButtons}>
        <button
          className={styles.socialButton}
          onClick={() => handleSocialOauth("google")}
        >
          <FcGoogle size={24} className={styles.socialIcon} />
          Google
        </button>
        <button
          className={styles.socialButton}
          onClick={() => handleSocialOauth("github")}
        >
          <FaGithub size={24} className={styles.socialIcon} />
          GitHub
        </button>
      </div>
    </>
  );
}