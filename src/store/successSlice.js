import { createSlice, nanoid } from '@reduxjs/toolkit'

const successSlice = createSlice({
  name: 'success',
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

export const { showSuccess, clearSuccess } = successSlice.actions
export default successSlice.reducer
