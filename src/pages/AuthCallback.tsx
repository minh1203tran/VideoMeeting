import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '@/store/slices/authSlice'
import { autoRefreshToken } from '@/services/authHelpers'
import apiClient from '@/services/apiClient'

export default function AuthCallback() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    let mounted = true

    async function run() {
      try {
        const token = await autoRefreshToken()
        
        if (!mounted) return

        if (!token) {
          navigate('/login')
          return
        }

        localStorage.setItem('authToken', token)

        try {
          const res = await apiClient.get('/v1/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          
          if (!mounted) return

          const userData = res.data?.data?.user ?? res.data?.user ?? res.data?.data ?? res.data
          
          if (userData && userData.id) {
            const user = {
              id: userData.id,
              name: userData.fullName || userData.name,
              email: userData.email,
              avatar: userData.avatar || `https://picsum.photos/seed/${userData.id}/100/100`,
            }
            dispatch(setUser(user))
            localStorage.setItem('user', JSON.stringify(user))
            navigate('/dashboard')
          } else {
            navigate('/login')
          }
        } catch (fetchErr: any) {
          navigate('/login')
        }
      } catch (err: any) {
        navigate('/login')
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [dispatch, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto" />
        <p className="text-text-muted font-medium">Đang xác thực...</p>
      </div>
    </div>
  )
}
