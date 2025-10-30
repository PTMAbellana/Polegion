"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import { resetPassword } from '@/api/auth';
import Loader from '@/components/Loader';
import styles from '@/styles/login.module.css';
import { forgotPasswordSchema } from '@/schemas/authSchemas';
import { ForgotPasswordFormData, ForgotPasswordModalProps } from '@/types';

export default function ForgotPasswordModal({ 
  isOpen, 
  onClose 
}: ForgotPasswordModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (formdata: ForgotPasswordFormData) => {
    try {
      setIsSubmitting(true);
      await resetPassword(formdata.email);
      toast.success("Password reset link sent to your email");
      handleClose();
    } catch (error: any) {
      console.error("Reset password error: ", error);
      toast.error(
        error?.response?.data?.message || "Failed to send reset link"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Reset Password</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            <FaTimes size={20} />
          </button>
        </div>

        <p className={styles.modalDescription}>
          Enter your email address and we&lsquo;ll send you a link to reset your
          password.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.formGroup}>
            <input
              type="email"
              className={styles.inputField}
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <p className={styles.error}>{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className={styles.forgotPasswordButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader />
                <span>Sending...</span>
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}