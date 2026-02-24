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

export interface RegisterResponse extends UserBase {}
export interface VerifyEmailResponse extends UserBase {
  accessToken: string
}
export interface ReVerifyEmailResponse {
  emailActivated: boolean
}
export interface LoginResponse {
  accessToken: string
  emailActivated: boolean
}
export interface MessageResponse {
  message: string
}
export interface TokenResponse {
  accessToken: string
}
