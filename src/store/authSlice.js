import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: '',
    email: '',
    name: '',
    accessToken: '',
    isAuth: false,
    keepLogged: false,
  },
  reducers: {
    setAuth(state, action) {
      const { email, name, accessToken, id, keepLogged } = action.payload
      state.email = email
      state.name = name
      state.accessToken = accessToken
      state.id = id
      state.isAuth = true
      state.keepLogged = !!keepLogged
    },

    logout: (state) => {
      state.id = null
      state.name = null
      state.email = null
      state.accessToken = null
      state.isAuth = false
      state.keepLogged = false
      localStorage.removeItem('authState')
    },

    updateEmail(state, action) {
      state.email = action.payload
    },
  },
})

export const { setAuth, logout, updateEmail } = authSlice.actions
export default authSlice.reducer
