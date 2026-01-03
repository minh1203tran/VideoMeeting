import apiClient from './apiClient'
import { store } from '@/store'
import { setAccessToken, clearAccessToken, setUser } from '@/store/slices/authSlice'

// Decode JWT payload (no external deps). Returns payload object or null.
function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join('')
    )
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true
  const payload = decodeJwtPayload(token)
  if (!payload) return false // can't determine -> assume valid
  if (!payload.exp) return false
  const now = Math.floor(Date.now() / 1000)
  return payload.exp <= now
}

// Call backend refresh endpoint which uses httpOnly session cookie
// to issue a new access token. On success, dispatch setAccessToken
// with token and decoded expiry.
let refreshTimer: number | null = null

function clearRefreshTimer() {
  if (refreshTimer !== null) {
    clearTimeout(refreshTimer as any)
    refreshTimer = null
  }
}

function scheduleRefresh(expiresAtUnix?: number | null) {
  clearRefreshTimer()
  if (!expiresAtUnix) return
  const now = Math.floor(Date.now() / 1000)
  // refresh 60 seconds before expiry
  const refreshAt = (expiresAtUnix - 60) - now
  const ms = Math.max(5000, refreshAt * 1000) 
  refreshTimer = window.setTimeout(() => {
    // fire-and-forget refresh; if it fails, clear token
    autoRefreshToken().catch(() => {})
  }, ms)
}

export async function autoRefreshToken(): Promise<string | null> {
  try {
    const res = await apiClient.post('/v1/auth/refresh', {}, { withCredentials: true })
    
    // backend returns { code, message, data: { access_token, ... } }
    const token = res?.data?.data?.access_token ?? res?.data?.access_token ?? res?.data?.token ?? null
    
    if (token) {
      const expiresIn = res?.data?.data?.expires_in ?? res?.data?.expires_in ?? null
      let expiry: number | null = null
      if (expiresIn && typeof expiresIn === 'number') {
        expiry = Math.floor(Date.now() / 1000) + Math.floor(expiresIn)
      } else {
        const payload = decodeJwtPayload(token)
        expiry = payload?.exp ?? null
      }
      store.dispatch(setAccessToken({ token, expiry }))
      localStorage.setItem('authToken', token)
      scheduleRefresh(expiry)
      return token
    }
    store.dispatch(clearAccessToken())
    clearRefreshTimer()
    return null
  } catch (err: any) {
    // if backend returned 401 with specific code, handle accordingly
    try {
      const status = err?.response?.status
      const code = err?.response?.data?.code
      if (status === 401 && code === 1000) {
        // session invalid -> clear and signal
        store.dispatch(clearAccessToken())
        clearRefreshTimer()
        return null
      }
    } catch (e) {}
    store.dispatch(clearAccessToken())
    clearRefreshTimer()
    return null
  }
}

// Generic request wrapper that ensures a valid access token is present
// and attaches Authorization header. If token is missing or expired,
// it will call autoRefreshToken() once.
import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export class AuthError extends Error {
  public code?: number
  constructor(message: string, code?: number) {
    super(message)
    this.code = code
  }
}

export async function requestWithAuth<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  const state = store.getState()
  let token: string | null | undefined = state.auth?.accessToken ?? null

  if (!token || isTokenExpired(token)) {
    token = await autoRefreshToken()
  }

  const makeRequest = async (t?: string | null) => {
    const finalConfig: AxiosRequestConfig = {
      ...config,
      headers: {
        ...(config.headers ?? {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
    }
    return apiClient.request<T>(finalConfig)
  }

  try {
    return await makeRequest(token)
  } catch (err: any) {
    const status = err?.response?.status
    const code = err?.response?.data?.code
    // If 401 and code 1001 => token expired, try refresh once
    if (status === 401 && code === 1001) {
      const newToken = await autoRefreshToken()
      if (newToken) {
        return await makeRequest(newToken)
      }
      throw new AuthError('Unable to refresh token', 1001)
    }
    if (status === 401 && code === 1000) {
      // session invalid, force logout
      store.dispatch(clearAccessToken())
      throw new AuthError('Session invalid', 1000)
    }
    throw err
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/v1/auth/logout', undefined, { withCredentials: true })
  } catch (e) {
    // ignore network errors, proceed to clear
  }
  store.dispatch(clearAccessToken())
  store.dispatch(setUser(null))
  clearRefreshTimer()
}

export default {
  isTokenExpired,
  autoRefreshToken,
  requestWithAuth,
  logout,
}
