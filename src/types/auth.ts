export interface UserBase {
  id: string
  name: string
  email: string
}

export interface AuthState extends UserBase {
  accessToken: string
  isAuth: boolean
  keepLogged: boolean
}

export type AuthResponse<T = {}> = UserBase & T

export type RegisterResponse = AuthResponse
export type VerifyEmailResponse = AuthResponse<{ accessToken: string }>
export type ReVerifyEmailResponse = AuthResponse<{ emailActivated: boolean }>
export type LoginResponse = AuthResponse<{ accessToken: string; emailActivated: boolean }>
export type TokenResponse = AuthResponse<{ accessToken: string }>
export type LogoutResponse = AuthResponse<{ message: string }>
export type UpdatePasswordResponse = AuthResponse<{ message: string }>
export type VerifyPasswordResponse = AuthResponse<{ message: string }>

export interface RegisterData {
  email: string
  password: string
  name: string
}

export interface VerifyEmailData {
  email: string
  verifyCode: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UpdatePasswordData {
  email: string
}

export interface VerifyPasswordData {
  email: string
  newPassword: string
  repeatPassword: string
  verifyCode: string
}
