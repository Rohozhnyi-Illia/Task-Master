import { createSlice, nanoid } from '@reduxjs/toolkit'

const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    items: [],
  },
  reducers: {
    showSuccess: {
      reducer: (state, action) => {
        state.items.push(action.payload)
      },
      prepare: (message) => ({
        payload: {
          id: nanoid(),
          message,
        },
      }),
    },
    clearSuccess: (state, action) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { showSuccess, clearSuccess } = toastSlice.actions
export default toastSlice.reducer
