import React, { useState, useEffect, useCallback } from 'react';
import { Menu, Search, Bell, Sparkles, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/useAuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { 
  Moon, Sun
} from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { joinRequestService } from '../services/joinRequestService';
import { rejectionNotificationService } from '../services/rejectionNotificationService';
import { Notification } from '../types';
interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
}
import { LanguageSelector } from '../components/common/LanguageSelector';

const Header: React.FC<HeaderProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Initialize with stored notifications (no mock data anymore)
    const storedNotifications = notificationService.getNotifications();
    return [...storedNotifications];
  });
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Fetch pending join requests for rooms where user is host
  const fetchPendingJoinRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!user?.id) return;

      // Try to fetch from API first
      if (token && apiBase) {
        try {
          // Fetch all rooms to find those where user is host
          const response = await fetch(`${apiBase}/v1/rooms`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const rooms = data.data?.rooms || data.data || [];

            // For each room where user is host, fetch pending participants
            for (const room of rooms) {
              // Check if user is host (adjust based on actual API response)
              const isHostOfRoom = room.host_id === user.id || room.hostId === user.id;
              
              console.log(`[Header] Checking room "${room.name || room.slug}": isHost=${isHostOfRoom}, hostId=${room.host_id || room.hostId}, userId=${user.id}`);
              
              if (isHostOfRoom) {
                const participantsResponse = await fetch(`${apiBase}/v1/rooms/${room.id}/participants`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });

                if (participantsResponse.ok) {
                  const participantsData = await participantsResponse.json();
                  const participants = participantsData.data?.participants || [];

                  // Find pending participants
                  const pendingParticipants = participants.filter((p: any) => {
                    const status = p.status?.toLowerCase() || '';
                    return status === 'waiting' || status === 'pending';
                  });

                  console.log(`[Header] Room "${room.name || room.slug}": Found ${pendingParticipants.length} pending participants`);

                  // Create notifications for pending participants that don't already exist
                  pendingParticipants.forEach((p: any) => {
                    const notificationId = `join_${room.id}_${p.user_id || p.userId}`;
                    const existingNotification = notificationService.getNotifications().find(n => n.id === notificationId);
                    
                    if (!existingNotification) {
                      console.log(`existingNotification user:"`);
                      console.log(p);
                      
                      console.log(`[Header] Creating notification for user ${p.user?.name} in room "${room.name || room.slug}"`);
                      notificationService.addNotification({
                        id: notificationId,
                        type: 'join_request',
                        message: `${p.user?.name || 'Người dùng'} đã yêu cầu tham gia phòng "${room.name || room.title || room.slug}"`,
                        timestamp: 'Vừa xong',
                        read: false,
                        userId: p.user_id || p.userId,
                        userName: p.user_name || p.userName,
                        roomId: room.id || room.slug,
                        status: 'pending'
                      });
                    }
                  });
                }
              }
            }
            return; // Success, don't fall back to mock data
          }
        } catch (apiError) {
          console.log('API fetch failed, falling back to mock data:', apiError);
        }
      }

      // Fallback: Use mock joinRequestService data for testing/demo
      console.log('Using mock join request data...');
      // Get all pending requests from joinRequestService (mock implementation)
      // This is populated by Dashboard when user joins a room
      // In a real app, this would be the API response above
      
    } catch (error) {
      console.error('Error fetching pending join requests:', error);
    }
  }, [user]);

  // Handle click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const notificationContainer = document.querySelector('[data-notifications-container]');
      const bellButton = document.querySelector('[data-bell-button]');
      
      if (notificationsOpen && notificationContainer && bellButton &&
          !notificationContainer.contains(target) && !bellButton.contains(target)) {
        setNotificationsOpen(false);
      }
    };

    if (notificationsOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [notificationsOpen]);

  // Subscribe to notification changes
  useEffect(() => {
    const unsubscribe = notificationService.subscribe((updatedNotifications) => {
      setNotifications([...updatedNotifications]);
    });
    
    // Fetch pending join requests from rooms where user is host
    fetchPendingJoinRequests();
    
    // Poll for new pending join requests every 5 seconds
    const pollInterval = setInterval(fetchPendingJoinRequests, 5000);
    
    return () => {
      unsubscribe();
      clearInterval(pollInterval);
    };
  }, [user?.id, fetchPendingJoinRequests]);

  // Fetch pending join requests for rooms where user is host
  const handleNotificationClick = (type: string) => {
    setNotificationsOpen(false);

    switch (type) {
      case 'recording_ready':
        navigate('/recordings');
        break;
      case 'invite':
        navigate('/meetings');
        break;
      case 'report':
        navigate('/reports');
        break;
      case 'task':
        navigate('/dashboard'); 
        break;
      case 'join_request':
        // Stay on current page but this will trigger the approval UI
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleApproveJoinRequest = async (notificationId: string, userId: string, roomId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      // Try to call API
      if (token && apiBase) {
        try {
          const response = await fetch(`${apiBase}/v1/rooms/${roomId}/participants/${userId}/approve`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: 'approved' })
          });

          if (response.ok) {
            const approvalData = await response.json();
            console.log('Approval response:', approvalData);
            
            // Server should handle token storage
            // Participant will fetch token via GET /participants API
          }
        } catch (apiError) {
          console.log('API approve failed, using mock:', apiError);
        }
      }

      // Always update local state (works with both API and mock)
      notificationService.updateNotification(notificationId, { status: 'approved', read: true });
      joinRequestService.updateParticipantStatus(roomId, userId, 'approved');
      
      alert('Đã duyệt yêu cầu tham gia. Người dùng sẽ được chuyển hướng tới phòng họp.');
    } catch (error) {
      console.error('Error approving join request:', error);
      alert('Lỗi khi duyệt yêu cầu');
    }
  };

  const handleRejectJoinRequest = async (notificationId: string, userId: string, roomId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      // Try to call API with proper deny endpoint
      if (token && apiBase) {
        try {
          // Try using /deny endpoint first (POST)
          let response = await fetch(`${apiBase}/v1/rooms/${roomId}/participants/${userId}/deny`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({})
          });

          // If not found, try /reject endpoint (PUT)
          if (!response.ok) {
            response = await fetch(`${apiBase}/v1/rooms/${roomId}/participants/${userId}/reject`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ status: 'rejected' })
            });
          }

          console.log('API deny/reject response:', response.status);
        } catch (apiError) {
          console.log('API deny/reject failed, using mock:', apiError);
        }
      }

      // Get room name for notification
      let roomName = roomId;
      if (token && apiBase) {
        try {
          const roomResponse = await fetch(`${apiBase}/v1/rooms/${roomId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (roomResponse.ok) {
            const roomData = await roomResponse.json();
            roomName = roomData.data?.room?.name || roomData.data?.name || roomId;
          }
        } catch (e) {
          console.log('Could not fetch room name:', e);
        }
      }

      // Always update local state (works with both API and mock)
      notificationService.updateNotification(notificationId, { status: 'rejected', read: true });
      joinRequestService.updateParticipantStatus(roomId, userId, 'rejected');
      
      // 📢 Gửi thông báo từ chối tới người dùng
      rejectionNotificationService.addRejectionNotification(userId, {
        userId: userId,
        roomId: roomId,
        roomName: roomName,
        hostName: user?.name,
        timestamp: Date.now()
      });

      console.log(`✅ Rejection notification sent to user ${userId} for room ${roomId}`);
      alert('Đã từ chối yêu cầu tham gia. Thông báo gửi đến người dùng.');
    } catch (error) {
      console.error('Error rejecting join request:', error);
      alert('Lỗi khi từ chối yêu cầu');
    }
  };

  return (
    <header className="sticky top-4 z-20 px-0 md:px-0 mb-8">
      <div 
        style={{
          backgroundColor: isDarkMode ? 'rgba(26, 35, 50, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.5)',
          transition: 'all 0.3s ease'
        }}
        className="backdrop-blur-xl rounded-[2rem] border shadow-sm p-3 2xl:p-5 flex justify-between items-center"
      >
        
        {/* Left: Toggle & Search */}
        <div className="flex items-center gap-4 flex-1">
           <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className="p-3 2xl:p-4 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
            >
              <Menu className="w-5 h-5 2xl:w-6 2xl:h-6" />
           </button>
           
           <div className="relative hidden md:block group flex-1 max-w-xl 2xl:max-w-4xl transition-all duration-300">
             <div className="absolute inset-y-0 left-0 pl-3 2xl:pl-5 flex items-center pointer-events-none">
               <Search className="h-4 w-4 2xl:h-5 2xl:w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
             </div>
             <input 
              type="text" 
              placeholder="Ask AI about your meetings..."
              style={{
                backgroundColor: isDarkMode ? '#1a2332' : '#f3f4f6',
                color: isDarkMode ? '#e5e7eb' : '#111827',
                transition: 'all 0.3s ease'
              }}
              className="w-full pl-10 2xl:pl-12 pr-4 py-2.5 2xl:py-4 rounded-xl border-none text-sm 2xl:text-lg focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <div 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg shadow-sm"
              style={{
                backgroundColor: isDarkMode ? '#374151' : '#ffffff'
              }}
            >
              <Sparkles className="w-3 h-3 2xl:w-4 2xl:h-4 text-primary-500" />
            </div>
           </div>
        </div>

        {/* Center: Language + Dark Mode */}
        <div className="flex items-center gap-4 ml-8 2xl:ml-12">
          <LanguageSelector shouldUseDarkText={false} isDarkMode={isDarkMode} />
          <button
            onClick={toggleDarkMode}
            className="p-3 2xl:p-4 rounded-xl hover:opacity-80 transition-all border"
            style={{
              backgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
              borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
            }}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-6 h-6 2xl:w-7 2xl:h-7 text-yellow-400" /> : <Moon className="w-6 h-6 2xl:w-7 2xl:h-7 text-gray-600" />}
          </button>
        </div>

        {/* Right: Actions & Profile */}
        <div className="flex items-center gap-3 md:gap-4 pr-2 pl-4">
          <button 
            data-bell-button
            className="relative p-3 2xl:p-4 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all hover:scale-105 active:scale-95" 
            onClick={() => setNotificationsOpen(!notificationsOpen)}
          >
            <Bell className="w-5 h-5 2xl:w-6 2xl:h-6" />
            <span className="absolute top-2 right-3 2xl:top-3 2xl:right-4 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></span>
          </button>
          
          <div 
            className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700 cursor-pointer group"
            onClick={() => navigate('/settings')}
          >
            <div className="text-right hidden sm:block leading-tight group-hover:opacity-100 transition-opacity">
              <p 
                className="text-sm 2xl:text-base font-bold"
                style={{
                  color: isDarkMode ? '#ffffff' : '#111827',
                  textShadow: isDarkMode ? '0 2px 4px rgba(0,0,0,0.5)' : 'none'
                }}
              >
                {user?.name || 'User'}
              </p>
            </div>
            <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-primary-500 to-secondary-500 group-hover:scale-105 transition-transform">
              <img src={user?.avatar || 'https://picsum.photos/seed/user/100/100'} alt="Profile" className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-2xl border-2 border-white dark:border-gray-800 object-cover" />
            </div>
          </div>
        </div>

        {/* Notifications Dropdown */}
        {notificationsOpen && (
           <div 
             data-notifications-container
             className="absolute top-20 2xl:top-24 right-0 w-80 2xl:w-96 rounded-3xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border z-50 p-4 animate-in fade-in zoom-in-95 duration-200"
             style={{
               backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
               borderColor: isDarkMode ? '#374151' : '#e5e7eb'
             }}
           >
             <div className="flex justify-between items-center mb-4 px-2">
                <h3 
                  className="font-bold 2xl:text-lg"
                  style={{ color: isDarkMode ? '#ffffff' : '#111827' }}
                >
                  Notifications
                </h3>
                <button 
                  className="text-xs 2xl:text-sm font-medium hover:opacity-80 transition-opacity"
                  style={{ color: isDarkMode ? '#10b981' : '#10b981' }}
                >
                  Mark all read
                </button>
             </div>
             <div className="space-y-2 max-h-80 overflow-y-auto">
               {notifications.map(n => (
                 <div 
                    key={n.id} 
                    className="flex gap-3 text-sm 2xl:text-base p-3 rounded-2xl transition-colors"
                    style={{
                      backgroundColor: isDarkMode ? '#0f1115' : '#f9fafb',
                      color: isDarkMode ? '#e5e7eb' : '#111827'
                    }}
                 >
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 shrink-0"></div>
                    <div className="flex-1">
                      <p 
                        className="font-medium cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ color: isDarkMode ? '#ffffff' : '#1f2937' }}
                        onClick={() => handleNotificationClick(n.type)}
                      >
                        {n.message}
                      </p>
                      <p 
                        className="text-xs mt-1"
                        style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}
                      >
                        {n.timestamp}
                      </p>
                      
                      {/* Show approve/reject buttons for join_request notifications */}
                      {n.type === 'join_request' && n.status === 'pending' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleApproveJoinRequest(n.id, n.userId || '', n.roomId || '')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <Check className="w-3 h-3" />
                            Duyệt
                          </button>
                          <button
                            onClick={() => handleRejectJoinRequest(n.id, n.userId || '', n.roomId || '')}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            <X className="w-3 h-3" />
                            Từ chối
                          </button>
                        </div>
                      )}
                      
                      {/* Show status badge for approved/rejected notifications */}
                      {n.type === 'join_request' && n.status !== 'pending' && (
                        <div className="mt-2">
                          <span 
                            className="text-xs font-medium px-2 py-1 rounded-full"
                            style={{
                              backgroundColor: n.status === 'approved' ? '#d1fae5' : '#fee2e2',
                              color: n.status === 'approved' ? '#065f46' : '#991b1b'
                            }}
                          >
                            {n.status === 'approved' ? '✓ Đã duyệt' : '✕ Đã từ chối'}
                          </span>
                        </div>
                      )}
                    </div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
    </header>
  );
};

export default Header;
