import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'

export interface ToastItem {
  id: string
  message: string
}

interface ToastState {
  items: ToastItem[]
}

const initialState: ToastState = {
  items: [],
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,

  reducers: {
    showSuccess: {
      reducer: (state, action: PayloadAction<ToastItem>) => {
        state.items.push(action.payload)
      },

      prepare: (message: string) => ({
        payload: {
          id: nanoid(),
          message,
        },
      }),
    },

    clearSuccess: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { showSuccess, clearSuccess } = toastSlice.actions
export default toastSlice.reducer
