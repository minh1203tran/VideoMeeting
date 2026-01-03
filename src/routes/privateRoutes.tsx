import ProtectedRoute from './ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import MyMeetings from '@/pages/MyMeetings';
import Recordings from '@/pages/Recordings';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import MeetingRoom from '@/pages/MeetingRoom';
import MainLayout from '@/layout/MainLayout';

export const privateRoutes = [
  {
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/meetings', element: <MyMeetings /> },
      { path: '/recordings', element: <Recordings /> },
      { path: '/reports', element: <Reports /> },
      { path: '/settings', element: <Settings /> },
    ],
  },
  {
    path: '/meeting/:roomId',
    element: <ProtectedRoute><MeetingRoom /></ProtectedRoute>
  }
] as const;

export default privateRoutes;
