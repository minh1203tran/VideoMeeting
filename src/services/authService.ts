import apiClient from './apiClient'

export const authService = {
  // Redirect to Google OAuth login
  getGoogleLoginUrl: () => {
    const apiUrl = import.meta.env.VITE_API_URL || ''
    return `${apiUrl}/v1/auth/google/login`
  },
  
  // Get current user info
  getCurrentUser: () => {
    console.log('Fetching current user from /v1/auth/me');
    return apiClient.get('/v1/auth/me');
  },
  
  // Logout user
  logout: () => apiClient.post('/v1/auth/logout'),
}

export default authService
