import { createSlice } from '@reduxjs/toolkit'

interface LoaderState {
  isLoaderShown: boolean
}

const initialState: LoaderState = {
  isLoaderShown: false,
}

const loaderSlice = createSlice({
  name: 'loader',
  initialState,

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
