import api from './api'

const URL = 'http://localhost:6000/api/auth'

class AuthServcie {
  async register(email, password) {
    try {
      const result = await api.post(`${URL}/register`)
    } catch (error) {}
  }
}
