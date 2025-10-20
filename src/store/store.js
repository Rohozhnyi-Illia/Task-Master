import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import { loadState, saveState } from './localStorage'

const persistedState = loadState()

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState,
})

store.subscribe(() => {
  saveState(store.getState())
})

export default store
