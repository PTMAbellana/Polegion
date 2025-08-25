import styles from '@/styles/login.module.css';
import { EmailInputProps } from '@/types';

export default function EmailInput({ register, error, placeholder = "Enter your email" }: EmailInputProps) {
  return (
    <div className={styles.formGroup}>
      <input
        type="email"
        className={styles.inputField}
        placeholder={placeholder}
        {...register("email")}
      />
      {error && (
        <p className={styles.error}>{error}</p>
      )}
    </div>
  );
}