import Home from '@/pages/Home';
import Login from '@/pages/Login';
import AuthCallback from '@/pages/AuthCallback';
import { AuthLayout } from '@/layout/AuthLayout';
import { Navigate } from 'react-router-dom';

export const publicRoutes = [
  // Temporarily redirect home and login to dashboard during development
  { path: '/', element: <Home /> }, // Home component already handles redirect internally
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> }, // Login component already handles redirect internally
    ],
  },
  { path: '/auth/callback', element: <AuthCallback /> },
  // Catch-all redirect for unknown routes
  { path: '*', element: <Navigate to="/dashboard" replace /> },
] as const;

export default publicRoutes;
