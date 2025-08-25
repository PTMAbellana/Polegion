
export interface AuthFormProps {
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export interface PasswordInputProps {
  name: string;
  placeholder: string;
  register: any;
  error?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
}

export interface EmailInputProps {
  register: any;
  error?: string;
  placeholder?: string;
}

export interface LoginFormProps {
  onForgotPassword: () => void;
}

export interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ResetPasswordFormProps {
  token: string;
}

export interface SocialAuthProps {
  type: "login" | "register";
}