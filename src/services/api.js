import axios from 'axios'
import store from '../store/store'
import { setAuth, logout } from '../store/authSlice'

const URL = ['http://localhost:9000/api', 'https://taskmaster-backend-e940.onrender.com']
const currentURL = 1

const api = axios.create({
  baseURL: URL[currentURL],
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)))
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.accessToken
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest._retry = true
          originalRequest.headers['Authorization'] = `Bearer ${token}`
          return api(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshRes = await axios.post(
          `${URL[currentURL]}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newAccessToken = refreshRes.data.accessToken

        store.dispatch(setAuth({ ...store.getState().auth, accessToken: newAccessToken }))

        processQueue(null, newAccessToken)

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (err) {
        processQueue(err, null)

        store.dispatch(logout())
        window.location.replace('/login')

        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default api
