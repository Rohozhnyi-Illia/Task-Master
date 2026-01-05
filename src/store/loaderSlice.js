import { createSlice } from '@reduxjs/toolkit'

const loaderSlice = createSlice({
  name: 'loader',
  initialState: {
    isLoaderShown: false,
  },
  reducers: {
    showLoader: (state) => {
      state.isLoaderShown = true
    },
    closeLoader: (state) => {
      state.isLoaderShown = false
    },
  },
})

export const { showLoader, closeLoader } = loaderSlice.actions
export default loaderSlice.reducer
