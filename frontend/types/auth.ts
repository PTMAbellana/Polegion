export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
  confirm_password: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}