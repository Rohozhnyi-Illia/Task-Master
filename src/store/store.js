import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import tasksReducer from './tasksSlice'
import errorSlice from './UI/errorSlice'
import loaderSlice from './UI/loaderSlice'
import notificationReducer from './notificationSlice'
import toastSlice from './UI/toastSlice'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    notification: notificationReducer,
    error: errorSlice,
    loader: loaderSlice,
    success: toastSlice,
  },
  preloadedState: persistedState,
})

store.subscribe(() => {
  saveState(store.getState())
})

export default store
