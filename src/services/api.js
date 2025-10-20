// api.js
import axios from 'axios'
import store from '../store/store'
import { logout, setAuth } from '../store/authSlice'

const api = axios.create({
  baseURL: 'http://localhost:9000/api',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const token = state.auth?.accessToken

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const res = await api.post('/auth/refresh')
        const { accessToken } = res.data

        const prevState = store.getState().auth
        store.dispatch(setAuth({ ...prevState, accessToken }))

        processQueue(null, accessToken)

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)
        store.dispatch(logout())

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    if (error.response?.status === 403) {
      store.dispatch(logout())
    }

    return Promise.reject(error)
  }
)

export default api
