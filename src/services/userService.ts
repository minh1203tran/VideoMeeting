import apiClient from './apiClient'

export const userService = {
  getProfile: () => apiClient.get('/user/me'),
}

export default userService
