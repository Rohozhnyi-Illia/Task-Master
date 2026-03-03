import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import store from '../store/store';
import { setAuth, logout } from '../store/authSlice';

const URL: string[] = [
  'http://localhost:9000/api',
  'https://taskmaster-backend-e940.onrender.com/api',
];
const currentURL = 0;

interface FailedRequest {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}

const api = axios.create({
  baseURL: URL[currentURL],
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  if (token !== null) {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  }
  failedQueue = [];
};

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth?.accessToken;
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await axios.post(
          `${URL[currentURL]}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        const newAccessToken = refreshRes.data.data;

        store.dispatch(setAuth({ ...store.getState().auth, accessToken: newAccessToken }));
        processQueue(null, newAccessToken);

        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>)['Authorization'] =
          `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);

        store.dispatch(logout());
        window.location.replace('/login');

        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
