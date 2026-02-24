import { createSlice } from '@reduxjs/toolkit'

interface AppState {
  firstAppLoadDone: boolean
}

const initialState: AppState = {
  firstAppLoadDone: false,
}

const appSlice = createSlice({
  name: 'App',
  initialState,

  reducers: {
    setFirstAppLoadDone(state) {
      state.firstAppLoadDone = true
    },

    resetFirstAppLoadDone(state) {
      state.firstAppLoadDone = false
    },
  },
})

export const { setFirstAppLoadDone, resetFirstAppLoadDone } = appSlice.actions
export default appSlice.reducer
