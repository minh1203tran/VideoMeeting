import axios from 'axios'
import { env } from '@/utils/env'
import { toast } from 'sonner'

const apiClient = axios.create({
  baseURL: env.apiUrl ?? undefined,
  // We include credentials so browser will send httpOnly session cookie
  withCredentials: true,
})

// Global error handling interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle Network Errors (Server Down / Unreachable)
    if (error.code === 'ERR_NETWORK' || !error.response) {
      toast.error('Unable to connect to the server', {
        description: 'Please check your internet connection or try again later.',
        duration: 5000,
      })
    }
    
    // Handle 5xx Server Errors
    if (error.response && error.response.status >= 500) {
      toast.error('Server Error', {
        description: 'Something went wrong on our end. Please try again later.',
      })
    }

    return Promise.reject(error)
  }
)

// Note: Authorization header (Bearer token) is handled at request time
// by `requestWithAuth` / `autoRefreshToken`. We intentionally do NOT
// persist tokens into localStorage or set default headers here.

export default apiClient
