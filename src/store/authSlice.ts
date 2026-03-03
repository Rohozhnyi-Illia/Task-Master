import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AuthState } from '../types/auth'
import { RootState } from './store'

const initialState: AuthState = {
  id: '',
  email: '',
  name: '',
  accessToken: '',
  keepLogged: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<Partial<AuthState>>) {
      const { email, name, accessToken, id, keepLogged } = action.payload
      if (email !== undefined) state.email = email
      if (name !== undefined) state.name = name
      if (accessToken !== undefined) state.accessToken = accessToken
      if (id !== undefined) state.id = id
      if (keepLogged !== undefined) state.keepLogged = keepLogged
    },

    logout: (state) => {
      state.id = ''
      state.name = ''
      state.email = ''
      state.accessToken = ''
      state.keepLogged = false
      localStorage.removeItem('authState')
    },

    updateEmail(state, action: PayloadAction<string>) {
      state.email = action.payload
    },
  },
})

export const { setAuth, logout, updateEmail } = authSlice.actions
export const selectIsAuth = (state: RootState) => Boolean(state.auth.accessToken)
export default authSlice.reducer
