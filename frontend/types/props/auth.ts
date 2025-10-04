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
  userType: "student" | "teacher";
}

export interface ResetPasswordFormProps {
  token: string;
}