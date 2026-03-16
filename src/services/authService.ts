import api from './api';
import parseError from '@utils/helpers/parseError';
import { ServiceResponse } from '../types/shared';
import {
  RegisterResponse,
  VerifyEmailResponse,
  ReVerifyEmailResponse,
  LoginResponse,
  LogoutResponse,
  UpdatePasswordResponse,
  VerifyPasswordResponse,
  RegisterData,
  VerifyEmailData,
  LoginData,
  UpdatePasswordData,
  VerifyPasswordData,
} from '../types/auth';

const authService = class AuthServcie {
  async register({
    email,
    password,
    name,
  }: RegisterData): Promise<ServiceResponse<RegisterResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<RegisterResponse>>('/auth/register', {
        email,
        password,
        name,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async verifyEmail({
    email,
    verifyCode,
  }: VerifyEmailData): Promise<ServiceResponse<VerifyEmailResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<VerifyEmailResponse>>('/auth/verify-email', {
        email,
        verifyCode,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async reVerifyEmail(email: string): Promise<ServiceResponse<ReVerifyEmailResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<ReVerifyEmailResponse>>(
        '/auth/re-verify-email',
        { email },
      );
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async login({ email, password }: LoginData): Promise<ServiceResponse<LoginResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<LoginResponse>>('/auth/login', {
        email,
        password,
      });
      return data;
    } catch (error) {
      const message = parseError(error);
      console.log('Parsed error:', message);
      return { success: false, error: message };
    }
  }

  async logout(): Promise<ServiceResponse<LogoutResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<LogoutResponse>>('/auth/logout');
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async updatePassword({
    email,
  }: UpdatePasswordData): Promise<ServiceResponse<UpdatePasswordResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<UpdatePasswordResponse>>(
        '/auth/update-password',
        { email },
      );
      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }

  async verifyPassword({
    email,
    newPassword,
    repeatPassword,
    verifyCode,
  }: VerifyPasswordData): Promise<ServiceResponse<VerifyPasswordResponse>> {
    try {
      const { data } = await api.post<ServiceResponse<VerifyPasswordResponse>>(
        '/auth/verify-password',
        {
          email,
          newPassword,
          repeatPassword,
          verifyCode,
        },
      );

      return data;
    } catch (error) {
      const message = parseError(error);
      return { success: false, error: message };
    }
  }
};

const AuthService = new authService();
export default AuthService;
