import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    id: '',
    email: '',
    name: '',
    accessToken: '',
    isAuth: false,
    keepLoged: false,
  },
  reducers: {
    setAuth(state, action) {
      const { email, name, accessToken, id } = action.payload
      state.email = email
      state.name = name
      state.accessToken = accessToken
      state.id = id
      state.isAuth = true
    },

    logout: (state) => {
      state.id = null
      state.name = null
      state.email = null
      state.accessToken = null
      state.isAuth = false
      localStorage.removeItem('authState')
    },
  },
})

export const { setAuth, logout } = authSlice.actions
export default authSlice.reducer
