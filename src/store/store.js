import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import tasksReducer from './tasksSlice'
import notificationReducer from './notificationSlice'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: tasksReducer,
    notification: notificationReducer,
  },
  preloadedState: persistedState,
})

store.subscribe(() => {
  saveState(store.getState())
})

export default store
