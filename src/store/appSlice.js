import { createSlice } from '@reduxjs/toolkit'

const appSlice = createSlice({
  name: 'App',
  initialState: {
    firstAppLoadDone: false,
  },

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
