import api from './api'

const URL = 'http://localhost:9000/api/auth'

const authService = class AuthServcie {
  async register({ email, password, name }) {
    try {
      const res = await api.post(`${URL}/register`, { email, password, name })
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
      const res = await api.post(`${URL}/login`, { email, password })
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
      const res = await api.post(`${URL}/logout`)
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

  async updatePassword({ email, newPassword, repeatPassword }) {
    try {
      const res = await api.post(`${URL}/update-password`, {
        email,
        newPassword,
        repeatPassword,
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
