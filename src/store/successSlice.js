import { createSlice } from '@reduxjs/toolkit'

const successSlice = createSlice({
  name: 'success',
  initialState: {
    message: null,
  },
  reducers: {
    showSuccess: (state, action) => {
      state.message = action.payload
    },
    clearSuccess: (state) => {
      state.message = null
    },
  },
})

export const { showSuccess, clearSuccess } = successSlice.actions
export default successSlice.reducer
