import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '../types/auth'

const initialState: AuthState = {
  id: '',
  email: '',
  name: '',
  accessToken: '',
  isAuth: false,
  keepLogged: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<Partial<AuthState>>) {
      if (!state) return

      const { email, name, accessToken, id, isAuth, keepLogged } = action.payload
      if (email !== undefined) state.email = email
      if (name !== undefined) state.name = name
      if (accessToken !== undefined) state.accessToken = accessToken
      if (id !== undefined) state.id = id
      if (isAuth !== undefined) state.isAuth = isAuth
      if (keepLogged !== undefined) state.keepLogged = keepLogged
    },

    logout: (state) => {
      state.id = ''
      state.name = ''
      state.email = ''
      state.accessToken = ''
      state.isAuth = false
      state.keepLogged = false
      localStorage.removeItem('authState')
    },

    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload
    },
  },
})

export const { setAuth, logout, updateEmail } = authSlice.actions
export default authSlice.reducer
