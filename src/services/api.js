// api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:6000/api',
  withCredentials: true,
})

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
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
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      return new Promise(async (resolve, reject) => {
        try {
          const res = await api.post('/auth/refresh')
          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)

          api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken
          originalRequest.headers['Authorization'] = 'Bearer ' + accessToken

          processQueue(null, accessToken)
          resolve(api(originalRequest))
        } catch (err) {
          processQueue(err, null)
          reject(err)
        } finally {
          isRefreshing = false
        }
      })
    }

    return Promise.reject(error)
  }
)

export default api
