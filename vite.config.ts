import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    // Dev-only proxy to forward API calls to backend and avoid CORS issues
    // Frontend can call `/v1/*` and Vite will proxy to `https://api-meeting.infoquang.id.vn/v1/*`
    proxy: {
      '/v1': {
        target: 'https://api-meeting.infoquang.id.vn',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
