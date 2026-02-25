import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import tasksReducer from './tasksSlice'
import errorSlice from './UI/errorSlice'
import loaderSlice from './UI/loaderSlice'
import notificationReducer from './notificationSlice'
import toastSlice from './UI/toastSlice'
import appSlice from './appSlice'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const initialAuthState = {
  id: '',
  email: '',
  name: '',
  accessToken: '',
  isAuth: false,
  keepLogged: false,
}

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    notification: notificationReducer,
    error: errorSlice,
    loader: loaderSlice,
    success: toastSlice,
    app: appSlice,
  },

  preloadedState: {
    auth: persistedState?.auth ?? initialAuthState,
    tasks: persistedState?.tasks ?? [],
    notification: persistedState?.notification ?? [],
  },
})

store.subscribe(() => {
  saveState(store.getState())
})

export default store
export type RootState = ReturnType<typeof store.getState>
