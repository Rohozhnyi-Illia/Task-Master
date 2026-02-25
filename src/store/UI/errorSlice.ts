import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ErrorState {
  error: string
}

const initialState: ErrorState = {
  error: '',
}

const errorSlice = createSlice({
  name: 'error',
  initialState,

  reducers: {
    showError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },

    clearError: (state) => {
      state.error = ''
    },
  },
})

export const { showError, clearError } = errorSlice.actions
export default errorSlice.reducer
