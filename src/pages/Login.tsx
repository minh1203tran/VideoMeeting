import { useState, useEffect } from 'react';
import { Chrome, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../i18n';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle OAuth callback with token in URL
  useEffect(() => {
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    
    if (token) {
      // Token received from OAuth callback
      localStorage.setItem('authToken', token);
      navigate('/dashboard', { replace: true });
    } else if (code) {
      // Authorization code received, exchange for token
      navigate('/auth/callback', { replace: true });
    }
  }, [searchParams, navigate]);

  // Read dark mode from localStorage
  const isDarkMode = (() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  })();

  // When website is dark, keep dark mode UI and use white text
  const keepDarkUI = isDarkMode;

  // Ensure the base URL is set correctly
  const base = import.meta.env.VITE_API_URL;
  const isConfigured = !!base;

  // Construct the backend login URL
  const apiBase = base ? base.replace(/\/+$/g, '') : '';
  const backendLoginUrl = `${apiBase}/v1/auth/google/login`;

  async function handleLogin() {
    if (!isConfigured) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Directly redirect to backend login without checking connectivity
      // The backend will handle any connection issues
      window.location.assign(backendLoginUrl);
    } catch (err) {
      // This catch block rarely executes for window.location.assign
      console.error("Login error:", err);
      setError(t.login.connectionErrorMsg);
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2 text-center lg:text-left">
        <h2 
          className="text-3xl font-bold"
          style={{ color: keepDarkUI ? '#ffffff' : '#111827' }}
        >
          {t.login.title}
        </h2>
        <p style={{ color: keepDarkUI ? '#e5e7eb' : '#6b7280' }}>
          {t.login.subtitle}
        </p>
      </div>

      {error && (
        <div 
          className="p-4 rounded-xl flex gap-3 items-start animate-in fade-in slide-in-from-top-2"
          style={{
            backgroundColor: keepDarkUI ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2',
            borderColor: keepDarkUI ? '#991b1b' : '#fecaca',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <AlertCircle 
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: keepDarkUI ? '#f87171' : '#dc2626' }}
          />
          <div className="space-y-1">
            <h3 
              className="font-semibold text-sm"
              style={{ color: keepDarkUI ? '#ffffff' : '#7f1d1d' }}
            >
              {t.login.connectionError}
            </h3>
            <p 
              className="text-sm"
              style={{ color: keepDarkUI ? '#fecaca' : '#b91c1c' }}
            >
              {error}
            </p>
          </div>
        </div>
      )}

      {!isConfigured && (
        <div 
          className="p-4 rounded-xl flex gap-3 items-start"
          style={{
            backgroundColor: keepDarkUI ? 'rgba(127, 29, 29, 0.2)' : '#fef2f2',
            borderColor: keepDarkUI ? '#991b1b' : '#fecaca',
            borderWidth: '1px',
            borderStyle: 'solid'
          }}
        >
          <AlertCircle 
            className="w-5 h-5 shrink-0 mt-0.5"
            style={{ color: keepDarkUI ? '#f87171' : '#dc2626' }}
          />
          <div className="space-y-1">
            <h3 
              className="font-semibold text-sm"
              style={{ color: keepDarkUI ? '#ffffff' : '#7f1d1d' }}
            >
              {t.login.configurationError}
            </h3>
            <p 
              className="text-sm"
              style={{ color: keepDarkUI ? '#fecaca' : '#b91c1c' }}
            >
              {t.login.configErrorMsg}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleLogin}
          disabled={!isConfigured || isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
          style={{
            backgroundColor: keepDarkUI ? '#1f2937' : '#ffffff',
            borderColor: keepDarkUI ? '#374151' : '#e5e7eb',
            borderWidth: '1px',
            borderStyle: 'solid',
            color: keepDarkUI ? '#e5e7eb' : '#374151'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = keepDarkUI ? '#374151' : '#f9fafb';
            e.currentTarget.style.borderColor = keepDarkUI ? '#4b5563' : '#d1d5db';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = keepDarkUI ? '#1f2937' : '#ffffff';
            e.currentTarget.style.borderColor = keepDarkUI ? '#374151' : '#e5e7eb';
          }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
          ) : (
            <Chrome 
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              style={{ color: keepDarkUI ? '#ffffff' : '#111827' }}
            />
          )}
          <span>{isLoading ? t.common.loading : `${t.login.or} ${t.login.google}`}</span>
        </button>
      </div>
    </div>
  );
}
