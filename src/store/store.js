import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import tasksReducer from './tasksSlice'
import errorSlice from './errorSlice'
import notificationReducer from './notificationSlice'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    notification: notificationReducer,
    error: errorSlice,
  },
  preloadedState: persistedState,
})

store.subscribe(() => {
  saveState(store.getState())
})

export default store
