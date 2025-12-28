import { createSlice } from '@reduxjs/toolkit'

const errorSlice = createSlice({
  name: 'error',
  initialState: {
    error: null,
  },
  reducers: {
    showError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { showError, clearError } = errorSlice.actions
export default errorSlice.reducer
