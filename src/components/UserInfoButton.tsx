import { useState } from 'react'
import apiClient from '@/services/apiClient'

export default function UserInfoButton() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.get('/v1/auth/me')
      setUser(res.data)
    } catch (err: any) {
      setError(err?.response?.data?.message ?? err?.message ?? 'Lỗi khi lấy thông tin')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-6">
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? 'Đang tải...' : 'Xem thông tin user'}
      </button>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}

      {user && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded">
          <div className="font-medium text-gray-900">Thông tin user</div>
          <pre className="text-xs mt-2 overflow-auto max-h-48 bg-white p-2 border border-gray-200 rounded">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
