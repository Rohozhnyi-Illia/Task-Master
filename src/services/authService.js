import api from './api'

const authService = class AuthServcie {
  async register({ email, password, name }) {
    try {
      const res = await api.post('/auth/register', { email, password, name })
      return { success: true, data: res.data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async verifyEmail({ email, verifyCode }) {
    try {
      const res = await api.post('/auth/verify-email', { email, verifyCode })
      return { success: true, data: res.data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async login({ email, password }) {
    try {
      const res = await api.post('/auth/login', { email, password })
      return { success: true, data: res.data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async logout() {
    try {
      const res = await api.post('/auth/logout')
      return { success: true, data: res.data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async updatePassword({ email }) {
    try {
      const res = await api.post('/auth/update-password', { email })
      return { success: true, data: res.data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }

  async verifyPassword({ email, newPassword, repeatPassword, verifyCode }) {
    try {
      const res = await api.post('/auth/verify-password', {
        email,
        newPassword,
        repeatPassword,
        verifyCode,
      })

      return { success: true, data: res.data }
    } catch (error) {
      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'Error'
      return { success: false, error: message }
    }
  }
}

const AuthService = new authService()
export default AuthService
