import AppRoutes from '@/routes'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/i18n'
import { AuthProvider } from '@/context/AuthContext'
import { DarkModeProvider } from '@/context/DarkModeProvider'

export default function App() {
  return (
    <LanguageProvider>
      <DarkModeProvider>
        <AuthProvider>
          <div className="min-h-screen">
            <AppRoutes />
            <Toaster position="top-right" richColors />
          </div>
        </AuthProvider>
      </DarkModeProvider>
    </LanguageProvider>
  )
}
