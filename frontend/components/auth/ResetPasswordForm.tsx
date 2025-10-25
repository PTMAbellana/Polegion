"use client";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { ResetPasswordFormData } from '@/types/auth';
import { resetPasswordSchema } from '@/schemas/authSchemas';
import { ROUTES } from '@/constants/routes';
import PasswordInput from '@/components/auth/inputs/PasswordInput';
import { useMyApp } from '@/context/AppUtils';
import styles from '@/styles/login.module.css';
import { ResetPasswordFormProps } from '@/types';

export default function ResetPasswordForm({ 
  token 
}: ResetPasswordFormProps) {
  const router = useRouter();
  const { resetPassword, loginLoading } = useAuthStore();
  const { refreshUserSession } = useMyApp();
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (formData: ResetPasswordFormData) => {
    const result = await resetPassword(token, formData.password);
    
    if (result.success) {
      toast.success("Password reset successfully!");
      await refreshUserSession();
      
      setTimeout(() => {
        router.push(ROUTES.LOGIN);
      }, 1500);
    } else {
      toast.error(result.error || "Failed to reset password");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <PasswordInput
        name="password"
        placeholder="New password"
        register={register}
        error={errors.password?.message?.toString()}
        showPassword={showPassword}
        onToggleVisibility={() => setShowPassword(!showPassword)}
      />

      <PasswordInput
        name="confirmPassword"
        placeholder="Confirm new password"
        register={register}
        error={errors.confirmPassword?.message?.toString()}
        showPassword={showConfirmPassword}
        onToggleVisibility={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      <button
        type="submit"
        className={styles.loginButton}
        disabled={loginLoading}
      >
        {loginLoading ? "Resetting Password..." : "Reset Password"}
      </button>
    </form>
  );
}