
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, Calendar as CalendarIcon, Mic, CheckCircle2, Clock, AlertCircle, UserPlus
} from 'lucide-react';
import { StatCard } from '../components/features/dashboard/StatCard';
import { SpeakingTimeChart, TrendChart, ScoreChart } from '../components/features/dashboard/Charts';
import { UpcomingMeetings } from '../components/features/dashboard/UpcomingMeetings';
import { RecentMeetingsTable } from '../components/features/dashboard/RecentMeetingsTable';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { CreateMeetingModal } from '../components/modals/CreateMeetingModal';
import { InviteUserModal } from '../components/modals/InviteUserModal';
import { StatMetric } from '../types';
import { useLanguage } from '../i18n';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuthContext } from '../context/useAuthContext';
import { notificationService } from '../services/notificationService';
import { joinRequestService } from '../services/joinRequestService';
import { rejectionNotificationService } from '../services/rejectionNotificationService';

interface QuickActionsProps {
  onInstantMeeting: () => void;
  onScheduleMeeting: () => void;
  onJoin: (roomId: string) => void;
  onJoinSuccess?: () => void;
  onInviteUser?: () => void;
}

const QuickActions = ({ onInstantMeeting, onScheduleMeeting, onJoin, onJoinSuccess, onInviteUser }: QuickActionsProps) => {
  const [roomCode, setRoomCode] = useState('');
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  
  const handleJoin = () => {
    onJoin(roomCode);
    // Clear input after joining
    setRoomCode('');
    onJoinSuccess?.();
  };
  
  return (
  <Card className="clay-panel" noPadding>
    <div className="p-8">
      <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111827', marginBottom: '1.5rem' }}>{t.dashboard.quickActions}</h2>
      <div className="flex flex-row gap-4">
        <Button 
          className="flex-1 shadow-lg shadow-primary-500/20" 
          icon={Video}
          onClick={onInstantMeeting}
        >
          {t.dashboard.startMeeting}
        </Button>
        <Button 
          className="flex-1" 
          variant="outline" 
          icon={CalendarIcon}
          onClick={onScheduleMeeting}
        >
          {t.dashboard.scheduleMeeting}
        </Button>
        <Button 
          className="flex-1" 
          variant="outline" 
          icon={UserPlus}
          onClick={onInviteUser}
        >
          Mời người dùng
        </Button>
        <div className="flex-1 relative flex">
          <input 
            type="text" 
            placeholder="Room code..."
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            style={{
              backgroundColor: isDarkMode ? '#1a2332' : '#f9fafb',
              color: isDarkMode ? '#e5e7eb' : '#111827',
              borderColor: isDarkMode ? '#374151' : '#e5e7eb',
              transition: 'all 0.3s ease'
            }}
            className="w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium placeholder:text-gray-500"
          />
          <button 
            onClick={handleJoin}
            className="absolute right-1 top-1 bottom-1 bg-gray-900 dark:bg-gray-700 text-white px-5 rounded-xl font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors shadow-md">
            {t.common.join}
          </button>
        </div>
      </div>
    </div>
  </Card>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isDarkMode } = useDarkMode();
  const { user } = useAuthContext();
  
  console.log('🟥 Dashboard RENDER: isDarkMode =', isDarkMode);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'instant' | 'schedule'>('instant');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  
  // Error Modal State
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{ title: string; message: string }>({ title: '', message: '' });
  
  // Total Meetings State
  const [totalMeetings, setTotalMeetings] = useState(0);

  // Fetch total meetings from API
  useEffect(() => {
    const fetchTotalMeetings = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
        
        console.log('📊 Dashboard: Fetching total meetings...');
        console.log('API Base:', apiBase);
        
        if (!apiBase) {
          console.log('Missing apiBase, skipping fetch');
          return;
        }

        // Try to get token from localStorage first
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage:', token ? '✅ exists' : '❌ missing');
        
        if (!token) {
          console.log('No token available, skipping fetch');
          return;
        }

        console.log('About to fetch from:', `${apiBase}/v1/rooms`);
        
        const response = await fetch(`${apiBase}/v1/rooms`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('✅ Response received!');
        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log('Full API response:', data);
          
          const rooms = data.data?.rooms || data.data || data || [];
          console.log('Rooms array:', rooms);
          console.log('Rooms length:', rooms.length);
          console.log('data.data?.total:', data.data?.total);
          
          const total = data.data?.total || rooms.length || 0;
          console.log('✅ Final total:', total);
          setTotalMeetings(total);
        } else {
          console.error('❌ Response not ok:', response.status);
          const errorText = await response.text();
          console.error('Response text:', errorText);
          
          // If 401, token is invalid - show error
          if (response.status === 401) {
            console.log('Token is invalid/expired');
            showErrorModal(
              'Phiên làm việc đã hết hạn',
              'Token xác thực của bạn không còn hợp lệ. Vui lòng đăng nhập lại để tiếp tục.'
            );
            localStorage.removeItem('authToken');
          }
        }
      } catch (error) {
        console.error('❌ Error fetching total meetings:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          console.error('Error stack:', error.stack);
        }
      } finally {
        // Fetch complete
      }
    };

    fetchTotalMeetings();
  }, []);

  // Poll for rejection notifications every 3 seconds
  // IMPORTANT: Only participants (not hosts) should see rejection notifications
  useEffect(() => {
    if (!user?.id) return;

    const checkRejectionNotifications = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
        
        // Get rejections stored for this user
        const rejections = rejectionNotificationService.getRejectionNotifications(user.id);
        
        // Only process rejections - verify that user is actually a participant, not a host
        for (const rejection of rejections) {
          const notificationId = `rejection_${rejection.roomId}_${rejection.timestamp}`;
          const existingNotification = notificationService.getNotifications().find(n => n.id === notificationId);
          
          if (!existingNotification) {
            console.log(`🚫 Rejection received for room: ${rejection.roomName}`);
            console.log(`🚫 User ${user.id} was rejected from room ${rejection.roomId}`);
            
            // Verify this rejection is for the current user (they are the participant)
            // Get room info to check if user is host
            let isUserHostOfRoom = false;
            if (token && apiBase) {
              try {
                const roomResponse = await fetch(`${apiBase}/v1/rooms/${rejection.roomId}`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });
                
                if (roomResponse.ok) {
                  const roomData = await roomResponse.json();
                  const room = roomData.data?.room || roomData.data;
                  isUserHostOfRoom = room?.host_id === user.id || room?.hostId === user.id;
                }
              } catch (e) {
                console.log('Could not verify room host:', e);
              }
            }
            
            // ✅ Only show rejection if user is NOT the host (is the participant)
            if (!isUserHostOfRoom) {
              notificationService.addNotification({
                id: notificationId,
                type: 'join_request',
                message: `❌ Host từ chối yêu cầu tham gia phòng "${rejection.roomName}"`,
                timestamp: 'Vừa xong',
                read: false,
                userId: rejection.userId,
                roomId: rejection.roomId,
                status: 'rejected'
              });

              // Show alert to user
              alert(`Host đã từ chối yêu cầu tham gia phòng "${rejection.roomName}"`);
            } else {
              console.log(`⏭️ Skipping: User ${user.id} is the HOST of room ${rejection.roomId}, not a participant`);
            }

            // Remove the rejection notification after processing
            rejectionNotificationService.removeRejectionNotification(rejection.userId, rejection.roomId);
          }
        }
      } catch (error) {
        console.error('Error checking rejection notifications:', error);
      }
    };

    // Check immediately and then every 3 seconds
    checkRejectionNotifications();
    const interval = setInterval(checkRejectionNotifications, 3000);

    return () => clearInterval(interval);
  }, [user?.id]);

  // Stats Data
  const stats: (StatMetric & { color: string })[] = [
    { label: t.dashboard.stats.totalMeetings, value: totalMeetings, trend: 'up', trendValue: '+3', icon: Video, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { label: t.dashboard.stats.actionItems, value: '8.5h', trend: 'down', trendValue: '-1.2h', icon: Mic, color: 'bg-gradient-to-br from-violet-500 to-violet-600' },
    { label: t.dashboard.stats.recordingTime, value: '4.2h', trend: 'up', trendValue: '+1.5h', icon: Clock, color: 'bg-gradient-to-br from-amber-400 to-orange-500' },
    { label: t.dashboard.stats.aiScore, value: '85%', trend: 'up', trendValue: '+5%', icon: CheckCircle2, color: 'bg-gradient-to-br from-emerald-400 to-emerald-600' },
  ];

  const handleOpenInstant = () => {
    setModalType('instant');
    setIsModalOpen(true);
  };

  const handleOpenSchedule = () => {
    setModalType('schedule');
    setIsModalOpen(true);
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!roomId.trim()) {
      alert('Vui lòng nhập mã phòng');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      let latestParticipantId = '';
      
      if (!token) {
        alert('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      if (!apiBase) {
        alert('API URL chưa được cấu hình. Vui lòng kiểm tra biến môi trường.');
        return;
      }

      console.log('Joining room:', roomId);
      
      const response = await fetch(`${apiBase}/v1/rooms/${roomId}/participants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({})
      });

      const responseText = await response.text();
      console.log('Join API Response Status:', response.status);
      console.log('Join API Response:', responseText);

      if (response.status === 401) {
        // Try to refresh token and retry
        try {
          const refreshResponse = await fetch(`${apiBase}/v1/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            const newToken = refreshData.data?.access_token || refreshData.access_token;
            
            if (newToken) {
              localStorage.setItem('authToken', newToken);
              
              // Retry join with new token
              const retryResponse = await fetch(`${apiBase}/v1/rooms/${roomId}/participants`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${newToken}`
                },
                body: JSON.stringify({})
              });

              if (retryResponse.ok) {
                navigate(`/meeting/${roomId}`);
                return;
              }
            }
          }
          throw new Error('Token refresh failed');
        } catch (refreshError) {
          alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
          return;
        }
      }

      if (!response.ok) {
        throw new Error(`API Error ${response.status}: ${responseText}`);
      }

      latestParticipantId = JSON.parse(responseText).data?.participant?.user_id || '';

      console.log('Joined room successfully, waiting for host approval');
      
      // Get room info to check host (optional - mainly for notification message)
      let roomName = roomId;
      let hostUser : any = null;
      try {
        const roomInfoResponse = await fetch(`${apiBase}/v1/rooms/${roomId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (roomInfoResponse.ok) {
          const roomInfo = await roomInfoResponse.json();
          const room = roomInfo.data?.room || roomInfo.data;
          roomName = room?.name || room?.title || roomId;
          hostUser = roomInfo.data?.host || {};
        }
      } catch (error) {
        console.log('Could not fetch room info:', error);
      }
      
      if (hostUser  && hostUser?.email.toLowerCase() === user?.email?.toLowerCase()) {
        // Create notification for host about join request
        // This notification will only be visible to the host (Header checks host_id)
        const notification = {
          id: `join_${roomId}_${Date.now()}_${user?.id}`,
          type: 'join_request' as const,
          message: `${latestParticipantId || 'Người dùng'} đã yêu cầu tham gia phòng "${roomName}"`,
          // message: `Minh DZ đã yêu cầu tham gia phòng "${roomName}"`,
          timestamp: 'Vừa xong',
          read: false,
          userId: user?.id,
          userName: user?.name,
          roomId: roomId,
          status: 'pending' as const
        };
        
        notificationService.addNotification(notification); 
      }
      
      // Also add to joinRequestService for cross-client sync (mock backend)
      joinRequestService.addPendingParticipant(roomId, user?.id || '', user?.name || 'Người dùng');
      
      // Monitor for approval with polling
      let isApproved = false;
      let pollAttempts = 0;
      const maxPollAttempts = 120; // 2 minutes with 1-second intervals
      
      const pollApprovalStatus = async () => {
        try {
          const token = localStorage.getItem('authToken');
          const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
          
          if (!token || !apiBase) return;
          
          // Get list of rooms to find actual room ID
          const listResponse = await fetch(`${apiBase}/v1/rooms`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (listResponse.ok) {
            const listData = await listResponse.json();
            const rooms = listData.data?.rooms || listData.data || listData || [];
            
            if (rooms.length > 0) {
              // Find the room matching the roomId
              const targetRoom = rooms.find((r: any) => r.slug === roomId || r.id === roomId) || rooms[0];
              const actualRoomId = targetRoom.id;
              
              // Fetch current user's participant status
              const participantsResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}/participants`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (participantsResponse.ok) {
                const participantsData = await participantsResponse.json();
                const participants = participantsData.data?.participants || [];
                
                console.log(`[Poll ${pollAttempts}] All participants:`, participants);
                console.log(`[Poll ${pollAttempts}] Looking for user ID:`, user?.id);
                
                // Find current user's participant record - check multiple status variations
                // Status might be "approved", "admitted", "active" or other variations
                const currentParticipant = participants.find((p: any) => {
                  const userId = p.user_id || p.userId;
                  const status = p.status?.toLowerCase() || '';
                  const isCurrentUser = userId === user?.id;
                  const isApprovedStatus = status !== 'waiting' && status !== 'denied' && status !== 'rejected';
                  
                  console.log(`[Poll ${pollAttempts}] Checking participant:`, { 
                    userId, 
                    status, 
                    isCurrentUser, 
                    isApprovedStatus,
                    fullParticipant: p
                  });
                  
                  return isCurrentUser && isApprovedStatus;
                });
                
                console.log(`[Poll ${pollAttempts}] Found current participant:`, currentParticipant);
                
                if (currentParticipant) {
                  isApproved = true;
                  console.log('User approved! Checking for LiveKit token...');
                  
                  // Get LiveKit token from API response (server should return it when participant is approved)
                  const livekitToken = currentParticipant.livekit_token || 
                                      currentParticipant.token || 
                                      participantsData.data?.livekit_token;
                  
                  console.log('LiveKit token from API:', livekitToken);
                  console.log('Full participant data:', currentParticipant);
                  
                  if (livekitToken) {
                    // Redirect to LiveKit with token
                    const livekitUrl = import.meta.env.VITE_LIVEKIT_URL || 'https://meet.livekit.io';
                    const redirectUrl = `${livekitUrl}/custom?liveKitUrl=${apiBase}&token=${livekitToken}`;
                    console.log('Redirecting to LiveKit:', redirectUrl);
                    window.location.href = redirectUrl;
                  } else {
                    console.warn('No LiveKit token found in response. Falling back to meeting room page.');
                    // Fallback: navigate to meeting room page
                    navigate(`/meeting/${roomId}`);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error polling approval status:', error);
        }
      };
      
      // Start polling
      const pollInterval = setInterval(() => {
        pollAttempts++;
        if (isApproved || pollAttempts >= maxPollAttempts) {
          clearInterval(pollInterval);
          if (!isApproved) {
            alert('Quá thời gian chờ. Yêu cầu tham gia đã hết hạn.');
          }
        } else {
          pollApprovalStatus();
        }
      }, 1000); // Poll every 1 second
      
      // Show waiting notification
      alert('Bạn đã được thêm vào danh sách chờ duyệt. Vui lòng đợi chủ phòng duyệt yêu cầu của bạn.');
    } catch (error) {
      console.error('Error joining room:', error);
      const errorMessage = error instanceof Error ? error.message : 'Lỗi không xác định';
      alert(`Không thể tham gia phòng: ${errorMessage}`);
    }
  };

  const handleCreateRoom = async (data: any) => {
    try {
      let token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!token) {
        showErrorModal(t.errors.authenticationError, t.errors.sessionExpired);
        return;
      }

      if (!apiBase) {
        showErrorModal(t.errors.configurationError, t.errors.apiNotConfigured);
        return;
      }

      console.log('Creating room with API:', `${apiBase}/v1/rooms`);
      console.log('Payload:', JSON.stringify(data, null, 2));
      
      let response = await fetch(`${apiBase}/v1/rooms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Length': JSON.stringify(data).length.toString(),
          'Host': new URL(apiBase).host,
          'accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      let responseText = await response.text();
      console.log('API Response Status:', response.status);
      console.log('API Response:', responseText);

      // If 401, try to refresh token and retry
      if (response.status === 401) {
        console.log('Token expired, attempting to refresh...');
        try {
          const refreshResponse = await fetch(`${apiBase}/v1/auth/refresh`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include' // Include httpOnly cookies
          });

          console.log('Refresh response status:', refreshResponse.status);
          const refreshText = await refreshResponse.text();
          console.log('Refresh response:', refreshText);

          if (refreshResponse.ok) {
            let refreshData;
            try {
              refreshData = JSON.parse(refreshText);
            } catch {
              console.error('Failed to parse refresh response');
              showErrorModal(t.errors.authenticationError, t.errors.sessionExpired);
              return;
            }

            // Try multiple possible field names for the token
            const newToken = refreshData.data?.access_token || refreshData.access_token || refreshData.token || refreshData.accessToken;
            
            if (newToken) {
              localStorage.setItem('authToken', newToken);
              token = newToken;
              console.log('Token refreshed successfully, retrying room creation...');
              
              // Retry creating room with new token
              response = await fetch(`${apiBase}/v1/rooms`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
              });

              responseText = await response.text();
              console.log('Retry API Response Status:', response.status);
            } else {
              console.error('No token in refresh response. Available keys:', Object.keys(refreshData));
              showErrorModal(t.errors.authenticationError, t.errors.sessionExpired);
              return;
            }
          } else {
            console.log('Token refresh failed with status:', refreshResponse.status);
            showErrorModal(t.errors.authenticationError, t.errors.sessionExpired);
            return;
          }
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          showErrorModal(t.errors.authenticationError, t.errors.sessionExpired);
          return;
        }
      }

      if (!response.ok) {
        // Use status-based error messages (translated)
        let errorTitle = t.errors.unexpectedError;
        let errorMessage = t.errors.unknownError;

        switch (response.status) {
          case 400:
            errorTitle = t.errors.unexpectedError;
            errorMessage = t.errors.invalidMeetingInfo;
            break;
          case 401:
            errorTitle = t.errors.authenticationError;
            errorMessage = t.errors.sessionExpired;
            break;
          case 403:
            errorTitle = t.errors.permissionDenied;
            errorMessage = t.errors.noPermission;
            break;
          case 409:
            errorTitle = t.errors.roomAlreadyExists;
            errorMessage = t.errors.roomExists;
            break;
          case 429:
            errorTitle = t.errors.tooManyRequests;
            errorMessage = t.errors.tooQuickly;
            break;
          case 500:
          case 502:
          case 503:
            errorTitle = t.errors.serverError;
            errorMessage = t.errors.serverIssues;
            break;
          default:
            errorMessage = `${t.errors.serverError} (${response.status})`;
        }

        showErrorModal(errorTitle, errorMessage);
        return;
      }

      const result = JSON.parse(responseText);
      console.log('Room created successfully:', result);
      
      // Save newly created room to localStorage for MyMeetings to display
      let roomToSave = null;
      if (result.data?.room) {
        roomToSave = result.data.room;
      } else if (result.room) {
        roomToSave = result.room;
      }
      
      if (roomToSave) {
        console.log('🟢 Saving room to localStorage:', roomToSave);
        localStorage.setItem('newlyCreatedRoom', JSON.stringify(roomToSave));
        sessionStorage.setItem('newlyCreatedRoom', JSON.stringify(roomToSave));
      } else {
        console.log('🔴 No room object found in response:', result);
      }
      
      // Navigate to meeting with actual room ID from API response
      // const actualRoomId = result.id || result.room_id || result.data?.room?.id || result.room?.id || roomId;
      // navigate(`/meeting/${actualRoomId}`);
      const urlAbc = `https://meet.livekit.io/custom?liveKitUrl=${result.data?.livekit_url}&token=${result.data?.livekit_token}`;
      console.log('🟢 Redirecting to:', urlAbc);
      console.log('🟢 livekit_url:', result.data?.livekit_url);
      console.log('🟢 livekit_token:', result.data?.livekit_token);
      window.open(urlAbc, '_blank');
    } catch (error) {
      console.error('Error creating room:', error);
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        showErrorModal(t.errors.connectionError, t.errors.connectionFailed);
      } else {
        showErrorModal(t.errors.unexpectedError, t.errors.unknownError);
      }
    }
  };

  const showErrorModal = (title: string, message: string) => {
    setShowError(true);
    setErrorMessage({ title, message });
  };

  return (
    <div style={{ 
      backgroundColor: isDarkMode ? '#1a1f2e' : '#f0f2f5',
      color: isDarkMode ? '#ffffff' : '#111827',
      transition: 'all 0.3s'
    }}>
      
      {/* Main content */}
      <div>
      
      {/* 1. Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, idx) => (
          <StatCard key={idx} metric={stat} colorClass={stat.color} />
        ))}
      </div>

      {/* 2. Quick Actions - Full Width */}
      <div className="mb-8">
        <QuickActions 
          onInstantMeeting={handleOpenInstant}
          onScheduleMeeting={handleOpenSchedule}
          onJoin={handleJoinRoom}
          onInviteUser={() => setIsInviteModalOpen(true)}
        />
      </div>

      {/* 3. Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column (2/3) */}
        <div className="xl:col-span-2 space-y-8">
          <UpcomingMeetings />
          <RecentMeetingsTable />
        </div>

        {/* Right Column (1/3) - Analytics */}
        <div className="space-y-8">
          {/* Analytics Card - Match height with UpcomingMeetings */}
          <Card className="h-full min-h-[600px]">
            <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: isDarkMode ? '#ffffff' : '#111827', marginBottom: '0.5rem' }}>{t.dashboard.analytics}</h2>
            <div className="space-y-8">
              <SpeakingTimeChart />
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <TrendChart />
              </div>
              <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                <ScoreChart />
              </div>
            </div>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl"></div>
             <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem', position: 'relative', zIndex: 10, color: '#ffffff' }}>{t.dashboard.proTip}</h3>
             <p className="text-sm text-gray-300 mb-6 relative z-10">Track all your meetings in one place with AI-powered insights</p>
             <Button size="sm" className="w-full bg-white text-gray-900 hover:bg-gray-200 border-none relative z-10">{t.dashboard.viewReport}</Button>
          </Card>
        </div>
      </div>

      {/* Meeting Creation Modal */}
      <CreateMeetingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType={modalType}
        onSubmit={handleCreateRoom}
      />

      {/* Invite User Modal */}
      <InviteUserModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roomId={user?.id || ''}
        roomName="Phòng của tôi"
        onInviteSuccess={(invitedUser) => {
          console.log('User invited successfully:', invitedUser);
          setIsInviteModalOpen(false);
        }}
      />
      
      {/* Error Modal */}
      <Modal
        isOpen={showError}
        onClose={() => setShowError(false)}
        title={errorMessage.title}
      >
        <div className="flex items-start gap-4 py-4">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {errorMessage.message}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button 
            variant="outline" 
            onClick={() => setShowError(false)}
          >
            {t.common.close || 'Close'}
          </Button>
        </div>
      </Modal>
      </div>
    </div>
  );
}
