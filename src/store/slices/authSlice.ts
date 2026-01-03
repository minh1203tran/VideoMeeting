import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/types/user'

type State = {
  user: User | null
  status: 'idle' | 'loading' | 'failed'
  error?: string | null
  // access token stored only in memory (Redux store)
  accessToken?: string | null
  tokenExpiry?: number | null // unix seconds
}

const initialState: State = {
  user: null,
  status: 'idle',
  error: null,
  accessToken: null,
  tokenExpiry: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload
    },
    setAccessToken(state, action: PayloadAction<{ token: string; expiry?: number | null }>) {
      state.accessToken = action.payload.token
      state.tokenExpiry = action.payload.expiry ?? null
    },
    clearAccessToken(state) {
      state.accessToken = null
      state.tokenExpiry = null
    },
    logout(state) {
      state.user = null
      state.accessToken = null
      state.tokenExpiry = null
    },
  },
})

export const { setUser, setAccessToken, clearAccessToken, logout } = authSlice.actions

export default authSlice.reducer
