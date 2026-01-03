
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, 
  MessageSquare, Users, MoreVertical, Settings, Smile, Send,
  LayoutGrid, Info, Copy, Circle, X
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { MOCK_USERS } from '../utils/mockData';
import { cn } from '../utils/cn';
import { useLanguage } from '../i18n';
import { useAuthContext } from '../context/useAuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { rejectionNotificationService } from '../services/rejectionNotificationService';

// Add CSS animation for floating emojis
const floatUpStyle = `
  @keyframes float-up {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
    100% {
      opacity: 0;
      transform: translateY(-100px) scale(0.8);
    }
  }
  
  .float-up-animation {
    animation: float-up 2s ease-out forwards;
  }
`;

interface MeetingRoomProps {
  roomId?: string | null;
  onLeave?: () => void;
}

export default function MeetingRoom({ roomId: propRoomId, onLeave }: MeetingRoomProps) {
  const { roomId: paramRoomId } = useParams();
  const navigate = useNavigate();
  const roomId = propRoomId || paramRoomId || 'demo-room-123';
  const { t } = useLanguage();
  const { user } = useAuthContext();
  const { isDarkMode } = useDarkMode();

  // Inject styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = floatUpStyle;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<'chat' | 'people' | 'info' | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showReactions, setShowReactions] = useState(false);
  const [floatingEmojis, setFloatingEmojis] = useState<Array<{ id: string; emoji: string; x: number; y: number }>>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'focused'>('grid');
  const [focusedParticipantId, setFocusedParticipantId] = useState<string | null>(null);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const [roomDetails, setRoomDetails] = useState<any>(null);
  const [loadingRoomDetails, setLoadingRoomDetails] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [waitingParticipants, setWaitingParticipants] = useState<any[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [apiParticipants, setApiParticipants] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoGridRef = useRef<HTMLVideoElement>(null);
  const videoThumbnailRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const skipFetchUntilRef = useRef<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch total number of meetings from API
  const fetchTotalMeetings = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      console.log('fetchTotalMeetings called - token:', !!token, 'apiBase:', apiBase);
      
      if (!token || !apiBase) {
        console.log('Missing token or apiBase');
        return;
      }

      const response = await fetch(`${apiBase}/v1/rooms`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Full API response:', data);
        
        const rooms = data.data?.rooms || data.data || data || [];
        console.log('Rooms array:', rooms);
        console.log('Total from data.data.total:', data.data?.total);
        
        const total = data.data?.total || rooms.length || 0;
        console.log('Final total calculated:', total);
      } else {
        console.error('Response not ok, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching total meetings:', error);
    }
  }, []);

  // Fetch total meetings on component mount
  useEffect(() => {
    fetchTotalMeetings();
    const interval = setInterval(fetchTotalMeetings, 30000);
    return () => clearInterval(interval);
  }, [fetchTotalMeetings]);

  // Fetch actual participants from API
  const fetchParticipantsFromAPI = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!token || !apiBase || !roomId) return;

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
          // Find the room matching the current roomId (slug from URL)
          const targetRoom = rooms.find((r: any) => r.slug === roomId || r.id === roomId) || rooms[0];
          const actualRoomId = targetRoom.id;
          
          // Fetch all participants (not waiting, but approved)
          const participantsResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}/participants?status=approved`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (participantsResponse.ok) {
            const participantsData = await participantsResponse.json();
            let participants = participantsData.data?.participants || participantsData.data || [];
            
            // Filter to only include approved/admitted participants (status !== 'waiting')
            participants = participants.filter((p: any) => p.status !== 'waiting');
            
            // Transform API participants to match expected format
            const transformed = participants.map((p: any) => ({
              id: p.user_id,
              name: p.user?.name || 'Unknown',
              email: p.user?.email || '',
              avatar: p.user?.avatar_url || `https://picsum.photos/seed/${p.user_id}/100/100`,
              isMe: p.user_id === user?.id,
              speaking: false
            }));
            
            setApiParticipants(transformed);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  }, [roomId, user?.id]);

  // Fetch participants when component mounts and refresh every 3 seconds
  useEffect(() => {
    fetchParticipantsFromAPI();
    const interval = setInterval(fetchParticipantsFromAPI, 3000);
    return () => clearInterval(interval);
  }, [roomId, user?.id, fetchParticipantsFromAPI]);

  // Auto-fetch room details on component mount
  useEffect(() => {
    if (!roomDetails && roomId) {
      console.log('Auto-fetching room details for roomId:', roomId);
      const fetchRoomDetailsAuto = async () => {
        try {
          let token = localStorage.getItem('authToken');
          const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
          
          if (token && apiBase) {
            // First, get the list of rooms to find the correct ID
            let listResponse = await fetch(`${apiBase}/v1/rooms`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            // If 401, token might be expired - try to refresh
            if (listResponse.status === 401) {
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
                    token = newToken;
                    
                    // Retry the rooms list request with new token
                    listResponse = await fetch(`${apiBase}/v1/rooms`, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    });
                  }
                }
              } catch (refreshError) {
                console.error('Error refreshing token:', refreshError);
                return;
              }
            }

            if (listResponse.ok) {
              const listData = await listResponse.json();
              const rooms = listData.data?.rooms || listData.data || listData || [];
              
              if (rooms.length > 0) {
                // Get the first room's ID (or you can filter by roomId param)
                const actualRoomId = rooms[0].id;
                
                // Now fetch the details of this specific room
                const detailResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });

                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  const roomData = detailData.data || detailData;
                  setRoomDetails(roomData);
                  console.log('Room details auto-loaded:', roomData);

                  // Now fetch participants to get the count
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
                    const total = participantsData.data?.total || participants.length || 0;
                    setParticipantCount(total);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error('Error auto-fetching room details:', error);
        }
      };

      fetchRoomDetailsAuto();
    }
  }, [roomId, roomDetails]);

  // Fetch waiting participants if user is host
  const fetchWaitingParticipants = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!token || !apiBase || !roomId) return;

      // Skip if we just admitted someone (give backend time to update)
      if (Date.now() < skipFetchUntilRef.current) {
        console.log('Skipping fetch - recently admitted/denied');
        return;
      }

      // First get list of rooms to find actual room ID
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
          // Find the room matching the current roomId (slug from URL)
          const targetRoom = rooms.find((r: any) => r.slug === roomId || r.id === roomId) || rooms[0];
          const actualRoomId = targetRoom.id;
          
          // Fetch participants with waiting status
          const participantsResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}/participants?status=waiting`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (participantsResponse.ok) {
            const participantsData = await participantsResponse.json();
            let waiting = participantsData.data?.participants || participantsData.data || [];
            
            console.log('Raw waiting participants from API:', waiting);
            
            // Filter out host and current user from waiting list
            // Use user_id to match with current user and room's host_id
            waiting = waiting.filter((p: any) => p.user_id !== user?.id && p.user_id !== targetRoom?.host_id);
            
            console.log('Filtered waiting participants:', waiting);
            
            setWaitingParticipants(waiting);
            
            // Check if current user is host using targetRoom's host_id
            if (targetRoom?.host_id) {
              setIsHost(targetRoom.host_id === user?.id);
            }
          } else if (participantsResponse.status === 401) {
            // Token expired, try refresh
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
                  // Retry fetch
                  await fetchWaitingParticipants();
                }
              }
            } catch (refreshError) {
              console.error('Error refreshing token for waiting participants:', refreshError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error fetching waiting participants:', error);
    }
  }, [roomId, user?.id]);

  useEffect(() => {
    // Fetch initially and every 3 seconds for real-time updates
    fetchWaitingParticipants();
    const interval = setInterval(fetchWaitingParticipants, 3000);
    return () => clearInterval(interval);
  }, [roomId, roomDetails, user?.id, fetchWaitingParticipants]);

  // Initialize camera on component mount
  useEffect(() => {
    if (cameraOn) {
      console.log('Initializing camera...');
      
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        // Request camera once and share stream with all refs
        navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        }).then(stream => {
          console.log('Camera stream obtained:', stream);
          console.log('Refs status:', {
            videoRef: videoRef.current ? 'OK' : 'NULL',
            videoGridRef: videoGridRef.current ? 'OK' : 'NULL',
            videoThumbnailRef: videoThumbnailRef.current ? 'OK' : 'NULL'
          });
          
          // Assign stream to available refs
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error('Play error (videoRef):', e));
            console.log('Camera stream assigned to videoRef');
          } else {
            console.error('videoRef.current is null!');
          }
          
          if (videoGridRef.current) {
            videoGridRef.current.srcObject = stream;
            videoGridRef.current.play().catch(e => console.error('Play error (videoGridRef):', e));
            console.log('Camera stream assigned to videoGridRef');
          } else {
            console.error('videoGridRef.current is null!');
          }
          
          if (videoThumbnailRef.current) {
            videoThumbnailRef.current.srcObject = stream;
            videoThumbnailRef.current.play().catch(e => console.error('Play error (videoThumbnailRef):', e));
            console.log('Camera stream assigned to videoThumbnailRef');
          } else {
            console.error('videoThumbnailRef.current is null!');
          }
        }).catch(err => {
          console.error('getUserMedia error:', err.name, err.message);
          if (err.name === 'NotAllowedError') {
            alert('Vui lòng cấp quyền truy cập camera');
          } else if (err.name === 'NotFoundError') {
            alert('Không tìm thấy camera. Vui lòng kiểm tra thiết bị');
          }
        });
      }, 100);

      return () => clearTimeout(timer);
    }

    return () => {
      // Cleanup: stop all camera streams
      [videoRef, videoGridRef, videoThumbnailRef].forEach(ref => {
        if (ref.current && ref.current.srcObject) {
          const tracks = (ref.current.srcObject as MediaStream).getTracks();
          tracks.forEach(track => track.stop());
          ref.current.srcObject = null;
        }
      });
    };
  }, [cameraOn]);

  // Recording timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  // Handle camera toggle
  useEffect(() => {
    if (!cameraOn) {
      // Stop both streams when camera is off
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (videoThumbnailRef.current && videoThumbnailRef.current.srcObject) {
        const tracks = (videoThumbnailRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoThumbnailRef.current.srcObject = null;
      }
    }
  }, [cameraOn]);

  // Re-assign camera stream when layout mode changes
  useEffect(() => {
    if (cameraOn && layoutMode === 'focused') {
      console.log('Layout changed to focused, re-assigning streams...');
      
      const timer = setTimeout(() => {
        // Re-request stream for main video if not already assigned
        if (videoRef.current && !videoRef.current.srcObject) {
          navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
          }).then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              console.log('Main video stream re-assigned after layout change');
            }
          }).catch(err => {
            console.error('Error re-assigning main video stream:', err);
          });
        }

        // Re-request stream for thumbnail if not already assigned
        if (videoThumbnailRef.current && !videoThumbnailRef.current.srcObject) {
          navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'user' } 
          }).then(stream => {
            if (videoThumbnailRef.current) {
              videoThumbnailRef.current.srcObject = stream;
              console.log('Thumbnail stream re-assigned after layout change');
            }
          }).catch(err => {
            console.error('Error re-assigning thumbnail stream:', err);
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [layoutMode, cameraOn]);

  // Re-assign camera stream when focused participant changes
  useEffect(() => {
    if (cameraOn && layoutMode === 'focused' && focusedParticipantId) {
      // Check if focused participant is self
      const focusedP = participants.find(p => p.id === focusedParticipantId);
      
      if (focusedP?.isMe && videoRef.current && !videoRef.current.srcObject) {
        console.log('Focused participant is self, re-assigning main video stream...');
        navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' } 
        }).then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            console.log('Main video stream re-assigned for focused self');
          }
        }).catch(err => {
          console.error('Error re-assigning main video stream:', err);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedParticipantId, layoutMode, cameraOn]);

  // Setup screen share stream
  useEffect(() => {
    if (screenStream && screenRef.current) {
      screenRef.current.srcObject = screenStream;
      console.log('Screen stream assigned:', screenStream);
    }
  }, [screenStream]);

  // Handle screen sharing
  const handleScreenShare = async () => {
    if (screenSharing) {
      setScreenSharing(false);
      setScreenStream(null);
      if (screenRef.current?.srcObject) {
        const tracks = (screenRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        screenRef.current.srcObject = null;
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: false
      } as any);
      
      setScreenSharing(true);
      setScreenStream(stream);

      // Handle when user stops screen share via browser UI
      stream.getTracks()[0].onended = () => {
        setScreenSharing(false);
        setScreenStream(null);
      };
    } catch (err) {
      console.error('Screen share error:', err);
      setScreenSharing(false);
      setScreenStream(null);
    }
  };

  const toggleSidebar = (view: 'chat' | 'people' | 'info') => {
    if (sidebarOpen === view) setSidebarOpen(null);
    else setSidebarOpen(view);
  };

  const handleReaction = (emoji: string) => {
    const randomX = Math.random() * 80 + 10; // 10-90%
    const randomY = Math.random() * 60 + 20; // 20-80%
    const id = Math.random().toString(36);
    
    setFloatingEmojis(prev => [...prev, { id, emoji, x: randomX, y: randomY }]);
    
    // Remove emoji after 2 seconds
    setTimeout(() => {
      setFloatingEmojis(prev => prev.filter(e => e.id !== id));
    }, 2000);
    
    setShowReactions(false);
  };

  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };

  const confirmLeaveRoom = async () => {
    try {
      // Turn off camera and mic state
      setCameraOn(false);
      setMicOn(false);
      
      // Stop all video/audio streams
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }

      // Stop screen share stream if active
      if (screenStream) {
        const tracks = screenStream.getTracks();
        tracks.forEach(track => {
          track.stop();
        });
        setScreenStream(null);
        setScreenSharing(false);
      }
      
      // End room via API (non-blocking)
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (token && apiBase && roomId) {
        try {
          console.log(`Getting actual room ID for: ${roomId}`);
          // First, get the list of rooms to find the actual room ID
          const listResponse = await fetch(`${apiBase}/v1/rooms`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (listResponse.ok) {
            const listData = await listResponse.json();
            const rooms = listData.data?.rooms || listData.data || [];
            
            // Find the room by matching roomId (either by ID or name)
            const room = rooms.find((r: any) => r.id === roomId || r.name === roomId);
            const actualRoomId = room?.id || roomId;
            
            console.log(`Ending room with ID: ${actualRoomId}`);
            // Fire and forget - don't wait for response
            fetch(`${apiBase}/v1/rooms/${actualRoomId}`, {
              method: 'PATCH',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }).catch(error => console.error('API call error:', error));
          }
        } catch (error) {
          console.error('Error getting room ID:', error);
        }
      }
    } catch (error) {
      console.error('Error ending room:', error);
    } finally {
      // Close modal and navigate after 500ms
      setTimeout(() => {
        setShowLeaveConfirm(false);
        // Navigate away
        if (onLeave) {
          onLeave();
        } else {
          navigate('/dashboard');
        }
      }, 500);
    }
  };

  const handleAdmitParticipant = async (participantId: string) => {
    // Keep original list for later lookup - declare outside try for catch block access
    const originalWaitingParticipants = [...waitingParticipants];
    
    // Immediately remove from waiting list optimistically
    const updatedWaitingList = waitingParticipants.filter((p: any) => p.user_id !== participantId);
    setWaitingParticipants(updatedWaitingList);
    
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!token || !apiBase || !roomId) {
        // Restore if no auth info
        setWaitingParticipants(originalWaitingParticipants);
        alert('Không đủ thông tin để duyệt tham gia');
        return;
      }

      // Get actual room ID from rooms list
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
          // Find the room matching the current roomId (slug from URL)
          const targetRoom = rooms.find((r: any) => r.slug === roomId || r.id === roomId) || rooms[0];
          const actualRoomId = targetRoom.id;
          
          console.log('Admitting participant:', { actualRoomId, participantId });
          
          // Try with user_id first
          const url1 = `${apiBase}/v1/rooms/${actualRoomId}/participants/${participantId}/admit`;
          console.log('Trying API endpoint (user_id):', url1);
          console.log('Full URL check:', { apiBase, actualRoomId, participantId });
          
          let admitResponse = await fetch(url1, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });

          let admitData = await admitResponse.json();
          console.log('Admit response (user_id):', admitData);

          if (!admitResponse.ok && admitData?.info?.includes('participant not found')) {
            // Try with participation ID from the original waiting list
            const waitingParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
            console.log('Looking for participant in original list:', { participantId, found: waitingParticipant?.id });
            if (waitingParticipant?.id) {
              const url2 = `${apiBase}/v1/rooms/${actualRoomId}/participants/${waitingParticipant.id}/admit`;
              console.log('Trying API endpoint (participation_id):', url2);
              
              admitResponse = await fetch(url2, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
              });

              admitData = await admitResponse.json();
              console.log('Admit response (participation_id):', admitData);
            }
          }

          if (admitResponse.ok) {
            console.log('Participant admitted successfully');
            alert('Đã duyệt tham gia');
            // Already removed optimistically above - just fetch to refresh
            skipFetchUntilRef.current = Date.now() + 3000;
            await fetchParticipantsFromAPI();
          } else if (admitData?.info?.includes('invalid participant status')) {
            // Participant status is no longer "waiting" - already admitted/denied elsewhere
            console.log('Participant already processed');
            alert('Người dùng đã được xử lý');
            // Already removed optimistically above
            skipFetchUntilRef.current = Date.now() + 3000;
            await fetchParticipantsFromAPI();
          } else if (admitResponse.status === 401) {
            // Token expired, refresh and retry
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
                  // Retry admit with new token
                  const retryResponse = await fetch(url1, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${newToken}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                  });

                  if (retryResponse.ok) {
                    alert('Đã duyệt tham gia');
                    // Already removed optimistically
                    await fetchWaitingParticipants();
                    await fetchParticipantsFromAPI();
                  } else {
                    // Restore to list if failed - add back the original participant
                    const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
                    if (failedParticipant) {
                      setWaitingParticipants([...updatedWaitingList, failedParticipant]);
                    }
                    alert('Không thể duyệt tham gia');
                  }
                }
              }
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              // Restore to list if failed
              const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
              if (failedParticipant) {
                setWaitingParticipants([...updatedWaitingList, failedParticipant]);
              }
              alert('Phiên làm việc hết hạn');
            }
          } else {
            // Restore to list if failed
            const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
            if (failedParticipant) {
              setWaitingParticipants([...updatedWaitingList, failedParticipant]);
            }
            alert('Lỗi khi duyệt tham gia: ' + (admitData?.message || admitData?.info || 'Unknown error'));
          }
        }
      }
    } catch (error) {
      console.error('Error admitting participant:', error);
      // Restore to list if failed
      const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
      if (failedParticipant) {
        setWaitingParticipants([...updatedWaitingList, failedParticipant]);
      }
      alert('Có lỗi xảy ra');
    }
  };

  const handleDenyParticipant = async (participantId: string) => {
    // Keep original list for later lookup - declare outside try for catch block access
    const originalWaitingParticipants = [...waitingParticipants];
    
    // Immediately remove from waiting list optimistically
    const updatedWaitingList = waitingParticipants.filter((p: any) => p.user_id !== participantId);
    setWaitingParticipants(updatedWaitingList);
    
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!token || !apiBase || !roomId) {
        // Restore if no auth info
        setWaitingParticipants(originalWaitingParticipants);
        alert('Không đủ thông tin để từ chối tham gia');
        return;
      }

      // Get actual room ID from rooms list
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
          // Find the room matching the current roomId (slug from URL)
          const targetRoom = rooms.find((r: any) => r.slug === roomId || r.id === roomId) || rooms[0];
          const actualRoomId = targetRoom.id;
          
          // Try with user_id first
          const url1 = `${apiBase}/v1/rooms/${actualRoomId}/participants/${participantId}/deny`;
          
          let denyResponse = await fetch(url1, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
          });

          let denyData = await denyResponse.json();

          if (!denyResponse.ok && denyData?.info?.includes('participant not found')) {
            // Try with participation ID from the original waiting list
            const waitingParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
            if (waitingParticipant?.id) {
              const url2 = `${apiBase}/v1/rooms/${actualRoomId}/participants/${waitingParticipant.id}/deny`;
              
              denyResponse = await fetch(url2, {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({})
              });

              denyData = await denyResponse.json();
            }
          }

          if (denyResponse.ok) {
            console.log('Participant denied successfully');
            
            // 📢 Send rejection notification to the denied participant
            const roomName = targetRoom.name || targetRoom.title || roomId;
            rejectionNotificationService.addRejectionNotification(participantId, {
              userId: participantId,
              roomId: roomId,
              roomName: roomName,
              hostName: user?.name,
              timestamp: Date.now()
            });
            
            console.log(`✅ Rejection notification sent to user ${participantId} for room ${roomName}`);
            alert('Đã từ chối tham gia. Thông báo gửi đến người dùng.');
            // Already removed optimistically
            skipFetchUntilRef.current = Date.now() + 3000;
          } else if (denyData?.info?.includes('invalid participant status')) {
            // Participant status is no longer "waiting" - already admitted/denied elsewhere
            console.log('Participant already processed');
            alert('Người dùng đã được xử lý');
            // Already removed optimistically
            skipFetchUntilRef.current = Date.now() + 3000;
          } else if (denyResponse.status === 401) {
            // Token expired, refresh and retry
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
                  // Retry deny with new token
                  const retryResponse = await fetch(url1, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${newToken}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({})
                  });

                  if (retryResponse.ok) {
                    // 📢 Send rejection notification after successful deny
                    const roomName = targetRoom.name || targetRoom.title || roomId;
                    rejectionNotificationService.addRejectionNotification(participantId, {
                      userId: participantId,
                      roomId: roomId,
                      roomName: roomName,
                      hostName: user?.name,
                      timestamp: Date.now()
                    });
                    
                    console.log(`✅ Rejection notification sent to user ${participantId} for room ${roomName}`);
                    alert('Đã từ chối tham gia. Thông báo gửi đến người dùng.');
                    // Already removed optimistically
                    await fetchWaitingParticipants();
                  } else {
                    // Restore to list if failed
                    const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
                    if (failedParticipant) {
                      setWaitingParticipants([...updatedWaitingList, failedParticipant]);
                    }
                    alert('Không thể từ chối tham gia');
                  }
                }
              }
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              // Restore to list if failed
              const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
              if (failedParticipant) {
                setWaitingParticipants([...updatedWaitingList, failedParticipant]);
              }
              alert('Phiên làm việc hết hạn');
            }
          } else {
            // Restore to list if failed
            const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
            if (failedParticipant) {
              setWaitingParticipants([...updatedWaitingList, failedParticipant]);
            }
            alert('Lỗi khi từ chối tham gia: ' + (denyData?.message || denyData?.info || 'Unknown error'));
          }
        }
      }
    } catch (error) {
      console.error('Error denying participant:', error);
      // Restore to list if failed
      const failedParticipant = originalWaitingParticipants.find((p: any) => p.user_id === participantId);
      if (failedParticipant) {
        setWaitingParticipants([...updatedWaitingList, failedParticipant]);
      }
      alert('Có lỗi xảy ra');
    }
  };

  const handleKickParticipant = async (participantId: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
      
      if (!token || !apiBase || !roomId) {
        alert('Không đủ thông tin để kick người dùng');
        return;
      }

      // Get actual room ID from rooms list
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
          const actualRoomId = rooms[0].id;
          
          // Call kick API - DELETE endpoint
          const kickResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}/participants/${participantId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (kickResponse.ok) {
            console.log('Participant kicked successfully');
            alert('Đã kick người dùng khỏi phòng');
            // Reload participants
            window.location.reload();
          } else if (kickResponse.status === 401) {
            // Token expired, refresh and retry
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
                  // Retry kick
                  await handleKickParticipant(participantId);
                }
              }
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              alert('Phiên làm việc hết hạn');
            }
          } else {
            alert('Lỗi khi kick người dùng');
          }
        }
      }
    } catch (error) {
      console.error('Error kicking participant:', error);
      alert('Có lỗi xảy ra');
    }
  };

  const handleInfoClick = async () => {
    if (sidebarOpen === 'info') {
      setSidebarOpen(null);
      return;
    }

    setSidebarOpen('info');
    
    // Fetch room details if not already loaded
    if (!roomDetails) {
      setLoadingRoomDetails(true);
      try {
        let token = localStorage.getItem('authToken');
        const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';
        
        console.log('Token:', token ? 'exists' : 'missing');
        console.log('API Base:', apiBase);
        
        if (token && apiBase) {
          // First, get the list of rooms to find the correct ID
          console.log('Fetching rooms list from:', `${apiBase}/v1/rooms`);
          let listResponse = await fetch(`${apiBase}/v1/rooms`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          console.log('Rooms list response status:', listResponse.status);
          
          // If 401, token might be expired - try to refresh
          if (listResponse.status === 401) {
            console.warn('Token expired, attempting to refresh...');
            try {
              const refreshResponse = await fetch(`${apiBase}/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'include' // Include cookies
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                const newToken = refreshData.data?.access_token || refreshData.access_token;
                
                if (newToken) {
                  console.log('Token refreshed successfully');
                  localStorage.setItem('authToken', newToken);
                  token = newToken;
                  
                  // Retry the rooms list request with new token
                  listResponse = await fetch(`${apiBase}/v1/rooms`, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    }
                  });
                  console.log('Retry rooms list response status:', listResponse.status);
                } else {
                  console.error('No access token in refresh response');
                  alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
                  setLoadingRoomDetails(false);
                  setSidebarOpen(null);
                  return;
                }
              } else {
                console.error('Refresh token failed:', refreshResponse.status);
                alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
                setLoadingRoomDetails(false);
                setSidebarOpen(null);
                return;
              }
            } catch (refreshError) {
              console.error('Error refreshing token:', refreshError);
              alert('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
              setLoadingRoomDetails(false);
              setSidebarOpen(null);
              return;
            }
          }

          const listDataText = await listResponse.text();
          console.log('Rooms list response text:', listDataText);

          if (listResponse.ok) {
            const listData = JSON.parse(listDataText);
            console.log('Parsed rooms data:', listData);
            const rooms = listData.data?.rooms || listData.data || listData || [];
            
            console.log('Rooms array:', rooms);
            
            if (rooms.length > 0) {
              // Get the first room's ID (or you can filter by specific criteria)
              const actualRoomId = rooms[0].id;
              console.log('Found room ID:', actualRoomId);
              
              // Now fetch the details of this specific room
              console.log('Fetching room details from:', `${apiBase}/v1/rooms/${actualRoomId}`);
              const detailResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              console.log('Room details response status:', detailResponse.status);
              const detailDataText = await detailResponse.text();
              console.log('Room details response text:', detailDataText);

              if (detailResponse.ok) {
                const detailData = JSON.parse(detailDataText);
                console.log('Parsed room details:', detailData);
                const roomData = detailData.data || detailData;
                console.log('All room fields:', Object.keys(roomData));
                console.log('Full room details object:', JSON.stringify(roomData, null, 2));
                setRoomDetails(roomData);

                // Now fetch participants to get the count
                console.log('Fetching participants from:', `${apiBase}/v1/rooms/${actualRoomId}/participants`);
                const participantsResponse = await fetch(`${apiBase}/v1/rooms/${actualRoomId}/participants`, {
                  method: 'GET',
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
                });

                if (participantsResponse.ok) {
                  const participantsData = await participantsResponse.json();
                  console.log('Participants data:', participantsData);
                  console.log('Participants data keys:', Object.keys(participantsData));
                  console.log('Full participants response:', JSON.stringify(participantsData, null, 2));
                  
                  const participants = participantsData.data?.participants || [];
                  const total = participantsData.data?.total || participants.length || 0;
                  console.log('Extracted participants array:', participants);
                  console.log('Total count:', total);
                  
                  setParticipantCount(total);
                } else {
                  console.error('Failed to fetch participants:', participantsResponse.status);
                }
              } else {
                console.error('Failed to fetch room details:', detailResponse.status);
              }
            } else {
              console.error('No rooms found in list');
            }
          } else {
            console.error('Failed to fetch rooms list:', listResponse.status);
          }
        } else {
          console.error('Missing token or apiBase');
        }
      } catch (error) {
        console.error('Error fetching room details:', error);
      } finally {
        setLoadingRoomDetails(false);
      }
    }
  };

  const handleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      setRecordingTime(0);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: true, 
          video: true 
        });
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        recordedChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `meeting-${new Date().getTime()}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordingTime(0);
      } catch (err) {
        console.error('Recording error:', err);
      }
    }
  };

  // Use API participants if available, otherwise use mock data
  const participants = apiParticipants.length > 0 ? apiParticipants : [
    { ...(user || { id: 'u1', name: 'User', email: 'user@example.com', avatar: 'https://picsum.photos/seed/user/100/100' }), isMe: true, speaking: true },
    { ...MOCK_USERS[1], isMe: false, speaking: false },
    { ...MOCK_USERS[2], isMe: false, speaking: false },
    { ...MOCK_USERS[3], isMe: false, speaking: false },
  ];

  const handleCopyRoomId = () => {
    const idToCopy = roomDetails?.id || roomId;
    if (idToCopy) {
      navigator.clipboard.writeText(idToCopy);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#202124] text-white flex flex-col overflow-hidden font-sans">
      
      {/* --- Top Bar --- */}
      <div className="h-16 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
           <div>
             <h1 className="font-bold text-lg leading-tight">{roomDetails?.name || 'Meeting Room'}</h1>
             <span 
               onClick={handleCopyRoomId}
               className="text-xs text-gray-400 font-mono bg-gray-800 px-1.5 py-0.5 rounded flex items-center gap-2 w-fit cursor-pointer hover:bg-gray-700 hover:text-white transition-colors"
             >
               ID: {roomDetails?.id || 'Loading...'} <Copy className="w-3 h-3" />
             </span>
           </div>
           
        </div>
        
        {/* Participants Grid / Layout Controls */}
        <div className="hidden md:flex items-center gap-2 bg-gray-800/50 p-1 rounded-xl">
           <button 
             onClick={() => setLayoutMode(layoutMode === 'grid' ? 'focused' : 'grid')}
             className={cn(
               "p-2 rounded-lg transition-colors",
               layoutMode === 'focused' ? "bg-primary-500 text-white" : "hover:bg-gray-700 text-gray-300"
             )}
           >
             <LayoutGrid className="w-5 h-5" />
           </button>
           <button className="p-2 hover:bg-gray-700 rounded-lg text-gray-300"><Settings className="w-5 h-5" /></button>
        </div>
      </div>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex overflow-hidden p-4 gap-4 relative">
        
        {screenSharing ? (
          // Screen Share Layout - Google Meet style
          <>
            {/* Main Screen Share (Left) */}
            <div className="flex-1 relative bg-gray-800 rounded-3xl overflow-hidden border border-gray-700">
              <video 
                ref={screenRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover bg-gray-900" 
              />
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 z-10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                Live
              </div>
            </div>

            {/* Participants Vertical Scroll (Right) */}
            <div className="w-40 flex flex-col gap-3 overflow-y-auto pb-2">
              {participants.map((p) => (
                <div key={p.id} className="relative bg-gray-800 rounded-2xl overflow-hidden shrink-0 h-40 border border-gray-700 hover:border-gray-500 transition-colors group">
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-full opacity-50" />
                  </div>
                  
                  {p.isMe ? (
                    <video 
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  ) : (
                    <img 
                      src={`https://picsum.photos/seed/${p.id}/400/400`} 
                      className="absolute inset-0 w-full h-full object-cover" 
                      alt="Video Feed"
                    />
                  )}

                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/60 backdrop-blur-md px-1.5 py-1 rounded text-[10px] font-bold shadow-sm truncate">
                      {p.name}
                    </div>
                  </div>

                  {p.speaking && <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl pointer-events-none shadow-[inset_0_0_10px_rgba(16,185,129,0.3)]"></div>}
                </div>
              ))}
            </div>
          </>
        ) : layoutMode === 'focused' ? (
          // Focused Layout - Large speaker view with thumbnails
          <>
            {/* Main Speaker View */}
            <div className="flex-1 relative bg-gray-800 rounded-3xl overflow-hidden border border-gray-700">
              {focusedParticipantId ? (
                // Show focused participant
                participants.find(p => p.id === focusedParticipantId) && (() => {
                  const focusedP = participants.find(p => p.id === focusedParticipantId)!;
                  return (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <img src={focusedP.avatar} alt={focusedP.name} className="w-32 h-32 rounded-full opacity-50" />
                      </div>
                      
                      {((focusedP.isMe && cameraOn) || (!focusedP.isMe)) && (
                        <>
                          {focusedP.isMe ? (
                            <video 
                              ref={videoRef}
                              autoPlay
                              playsInline
                              muted
                              onLoadedMetadata={(e) => {
                                console.log('Focused video metadata loaded');
                                (e.currentTarget as HTMLVideoElement).play();
                              }}
                              style={{ display: 'block', width: '100%', height: '100%' }}
                              className="absolute inset-0 object-cover" 
                            />
                          ) : (
                            <img 
                              src={`https://picsum.photos/seed/${focusedP.id}/1200/800`} 
                              className="absolute inset-0 w-full h-full object-cover" 
                              alt="Video Feed"
                            />
                          )}
                        </>
                      )}

                      <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg">
                        {focusedP.name} {focusedP.isMe && `(${t.common.you})`}
                      </div>

                      {focusedP.speaking && <div className="absolute inset-0 border-4 border-primary-500 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]"></div>}
                    </>
                  );
                })()
              ) : (
                // Default: show first participant
                participants[0] && (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <img src={participants[0].avatar} alt={participants[0].name} className="w-32 h-32 rounded-full opacity-50" />
                    </div>
                    
                    {((participants[0].isMe && cameraOn) || (!participants[0].isMe)) && (
                      <>
                        {participants[0].isMe ? (
                          <video 
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover" 
                          />
                        ) : (
                          <img 
                            src={`https://picsum.photos/seed/${participants[0].id}/1200/800`} 
                            className="absolute inset-0 w-full h-full object-cover" 
                            alt="Video Feed"
                          />
                        )}
                      </>
                    )}

                    <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg">
                      {participants[0].name} {participants[0].isMe && `(${t.common.you})`}
                    </div>

                    {participants[0].speaking && <div className="absolute inset-0 border-4 border-primary-500 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]"></div>}
                  </>
                )
              )}
            </div>

            {/* Thumbnails Vertical Scroll (Right) */}
            <div className="w-40 flex flex-col gap-3 overflow-y-auto pb-2">
              {/* Only show self in thumbnails */}
              {participants.filter(p => p.isMe).map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setFocusedParticipantId(p.id)}
                  className={cn(
                    "relative bg-gray-800 rounded-2xl overflow-hidden shrink-0 h-32 border transition-colors cursor-pointer hover:opacity-80",
                    focusedParticipantId === p.id ? "border-primary-500 ring-2 ring-primary-500" : "border-gray-700 hover:border-gray-500"
                  )}
                >
                  <video 
                    ref={videoThumbnailRef}
                    autoPlay
                    playsInline
                    muted
                    onLoadedMetadata={(e) => {
                      console.log('Thumbnail video metadata loaded');
                      (e.currentTarget as HTMLVideoElement).play();
                    }}
                    style={{ display: 'block', width: '100%', height: '100%' }}
                    className="absolute inset-0 object-cover bg-black" 
                  />
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/60 backdrop-blur-md px-1.5 py-1 rounded text-[10px] font-bold shadow-sm truncate">
                      {p.name}
                    </div>
                  </div>

                  {p.speaking && <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl pointer-events-none shadow-[inset_0_0_10px_rgba(16,185,129,0.3)]"></div>}
                </div>
              ))}
              
              {/* Show other participants */}
              {participants.filter(p => !p.isMe).map((p) => (
                <div 
                  key={p.id}
                  onClick={() => setFocusedParticipantId(p.id)}
                  className={cn(
                    "relative bg-gray-800 rounded-2xl overflow-hidden shrink-0 h-32 border transition-colors cursor-pointer hover:opacity-80",
                    focusedParticipantId === p.id ? "border-primary-500 ring-2 ring-primary-500" : "border-gray-700 hover:border-gray-500"
                  )}
                >
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full opacity-50" />
                  </div>
                  <img 
                    src={`https://picsum.photos/seed/${p.id}/400/400`} 
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Video Feed"
                  />
                  
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="bg-black/60 backdrop-blur-md px-1.5 py-1 rounded text-[10px] font-bold shadow-sm truncate">
                      {p.name}
                    </div>
                  </div>

                  {p.speaking && <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl pointer-events-none shadow-[inset_0_0_10px_rgba(16,185,129,0.3)]"></div>}
                </div>
              ))}
            </div>
          </>
        ) : (
          // Normal Grid Layout
          <>
            {/* Video Grid */}
            <div className={cn(
              "flex-1 grid gap-4 transition-all duration-300",
              participants.length === 1 ? "grid-cols-1" : participants.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
            )}>
              {participants.map((p) => {
                const isFocused = focusedParticipantId === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setFocusedParticipantId(isFocused ? null : p.id)}
                    className={cn(
                      "relative bg-gray-800 rounded-3xl overflow-hidden group border transition-all cursor-pointer",
                      isFocused ? "border-primary-500 ring-2 ring-primary-500" : "border-gray-700 hover:border-gray-500"
                    )}
                  >
                   {/* Mock Video Feed (Simulated) */}
                   {p.isMe && cameraOn ? (
                     <video 
                       ref={videoGridRef}
                       autoPlay
                       playsInline
                       muted
                       onLoadedMetadata={(e) => {
                         console.log('Video metadata loaded:', e.currentTarget);
                         (e.currentTarget as HTMLVideoElement).play();
                       }}
                       style={{ display: 'block', width: '100%', height: '100%' }}
                       className="absolute inset-0 object-cover bg-black" 
                     />
                   ) : !p.isMe ? (
                     <img 
                       src={`https://picsum.photos/seed/${p.id}/800/600`} 
                       className="absolute inset-0 w-full h-full object-cover" 
                       alt="Video Feed"
                     />
                   ) : (
                     <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                        <img src={p.avatar} alt={p.name} className="w-24 h-24 rounded-full opacity-50" />
                     </div>
                   )}

               {/* Overlays */}
               <div className="absolute bottom-4 left-4 flex items-center gap-2">
                 <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm flex items-center gap-2">
                    {p.name} {p.isMe && `(${t.common.you})`}
                 </div>
                 {/* Audio Visualizer Mock */}
                 {p.speaking && (
                   <div className="flex gap-1 items-end h-4 p-1 bg-primary-500 rounded-md">
                      <div className="w-1 bg-white animate-[bounce_1s_infinite] h-2"></div>
                      <div className="w-1 bg-white animate-[bounce_1.2s_infinite] h-3"></div>
                      <div className="w-1 bg-white animate-[bounce_0.8s_infinite] h-2"></div>
                   </div>
                 )}
               </div>

               <div className="absolute top-4 right-4 flex gap-2">
                  {!p.isMe && <button className="p-2 bg-black/40 hover:bg-black/60 rounded-full text-white"><MoreVertical className="w-4 h-4" /></button>}
                  {p.isMe && !micOn && <div className="p-2 bg-red-500/90 rounded-full"><MicOff className="w-4 h-4 text-white" /></div>}
               </div>
               
               {/* Border glow when speaking */}
               {p.speaking && <div className="absolute inset-0 border-4 border-primary-500 rounded-3xl pointer-events-none shadow-[inset_0_0_20px_rgba(16,185,129,0.5)]"></div>}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Floating Emojis */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {floatingEmojis.map((item) => (
            <div
              key={item.id}
              className="fixed text-5xl font-bold float-up-animation"
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
              }}
            >
              {item.emoji}
            </div>
          ))}
        </div>

        {/* Right Sidebar (Chat/People) */}
        {sidebarOpen && (
           <div 
             className="w-80 rounded-3xl flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 border text-gray-900"
             style={{
               backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
               borderColor: isDarkMode ? '#374151' : '#e5e7eb',
               color: isDarkMode ? '#e5e7eb' : '#111827'
             }}
           >
              <div className="p-4 border-b flex justify-between items-center"
                style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}
              >
                 <h2 className="font-bold text-lg capitalize">{sidebarOpen}</h2>
                 <button onClick={() => setSidebarOpen(null)} className="transition-opacity hover:opacity-70">
                    <MoreVertical className="w-5 h-5" style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }} />
                 </button>
              </div>

              {sidebarOpen === 'people' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                     style={{ color: isDarkMode ? '#9ca3af' : '#9ca3af' }}
                   >
                      {t.common.inMeeting} ({participants.length})
                   </div>
                   {participants.map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                         <img src={p.avatar} className="w-8 h-8 rounded-full" />
                         <span className="font-medium text-sm flex-1" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                           {p.name} {p.isMe && `(${t.common.you})`}
                         </span>
                         <div className="flex gap-2 items-center">
                            {(p.isMe ? micOn : true) ? <Mic className="w-4 h-4 text-primary-500" /> : <MicOff className="w-4 h-4 text-red-500" />}
                            {isHost && !p.isMe && (
                              <button
                                onClick={() => {
                                  if (confirm(`Bạn có chắc muốn kick ${p.name} khỏi phòng?`)) {
                                    handleKickParticipant(p.id);
                                  }
                                }}
                                className="p-1 rounded hover:bg-red-500/20 transition-colors"
                                title="Kick người này khỏi phòng"
                              >
                                <X className="w-4 h-4 text-red-500" />
                              </button>
                            )}
                         </div>
                      </div>
                   ))}

                   {/* Waiting Participants Section (visible only to host) */}
                   {isHost && waitingParticipants.length > 0 && (
                     <div className="mt-6 pt-4 border-t" style={{ borderColor: isDarkMode ? '#374151' : '#e5e7eb' }}>
                       <div className="flex items-center justify-between mb-3">
                         <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider"
                           style={{ color: isDarkMode ? '#fbbf24' : '#f59e0b' }}
                         >
                           ⏳ Chờ duyệt ({waitingParticipants.length})
                         </div>
                         <button 
                           onClick={() => setWaitingParticipants([])}
                           className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                           title="Clear waiting list"
                         >
                           Clear
                         </button>
                       </div>
                       {waitingParticipants.map((p: any) => (
                         <div key={p.id} className="flex items-center gap-3 mb-3 p-3 rounded-lg" 
                           style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6' }}
                         >
                           <img src={p.avatar || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full" alt={p.name} />
                           <div className="flex-1">
                             <span className="font-medium text-sm" style={{ color: isDarkMode ? '#ffffff' : '#111827' }}>
                               {p.name}
                             </span>
                           </div>
                           <div className="flex gap-2">
                             <button
                               onClick={() => handleAdmitParticipant(p.user_id)}
                               className="px-2 py-1 rounded-lg text-xs font-bold text-white bg-green-500 hover:bg-green-600 transition-colors"
                             >
                               ✓
                             </button>
                             <button
                               onClick={() => handleDenyParticipant(p.user_id)}
                               className="px-2 py-1 rounded-lg text-xs font-bold text-white bg-red-500 hover:bg-red-600 transition-colors"
                             >
                               ✕
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}

                   <Button size="sm" variant="outline" className="w-full mt-4" icon={Users}>{t.common.addPeople}</Button>
                </div>
              )}

              {sidebarOpen === 'info' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                   {loadingRoomDetails ? (
                      <div className="text-center py-8">
                        <p className="text-gray-400">Đang tải...</p>
                      </div>
                   ) : roomDetails ? (
                      <>
                        <div className="space-y-3">
                           <h3 className="font-bold text-base text-white">Chi tiết cuộc họp</h3>
                           
                           <div className="bg-gray-700/50 p-3 rounded-lg space-y-2">
                              <div>
                                 <p className="text-xs text-gray-400">Tên cuộc họp</p>
                                 <p className="text-sm font-semibold text-white">{roomDetails.name || 'N/A'}</p>
                              </div>
                              
                              <div>
                                 <p className="text-xs text-gray-400">Mã phòng</p>
                                 <p className="text-xs font-mono text-gray-200">{roomDetails.id || roomId}</p>
                              </div>
                              
                              <div>
                                 <p className="text-xs text-gray-400">Mô tả</p>
                                 <p className="text-sm text-gray-300">{roomDetails.description || 'Không có'}</p>
                              </div>

                              <div>
                                 <p className="text-xs text-gray-400">Số lượng tham gia hiện tại</p>
                                 <p className="text-sm font-semibold text-white">{participantCount}</p>
                              </div>
                              
                              <div>
                                 <p className="text-xs text-gray-400">Số lượng tối đa</p>
                                 <p className="text-sm font-semibold text-white">{roomDetails.max_participants || 'Không giới hạn'}</p>
                              </div>
                              
                              {roomDetails.scheduled_start_time && (
                                 <div>
                                    <p className="text-xs text-gray-400">Thời gian bắt đầu</p>
                                    <p className="text-sm text-gray-300">{new Date(roomDetails.scheduled_start_time).toLocaleString('vi-VN')}</p>
                                 </div>
                              )}
                              
                              {roomDetails.scheduled_end_time && (
                                 <div>
                                    <p className="text-xs text-gray-400">Thời gian kết thúc</p>
                                    <p className="text-sm text-gray-300">{new Date(roomDetails.scheduled_end_time).toLocaleString('vi-VN')}</p>
                                 </div>
                              )}
                              
                              <div>
                                 <p className="text-xs text-gray-400">Loại phòng</p>
                                 <p className="text-sm text-gray-300">{roomDetails.type || 'N/A'}</p>
                              </div>
                           </div>
                        </div>
                      </>
                   ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 text-sm">Không thể tải thông tin cuộc họp</p>
                      </div>
                   )}
                </div>
              )}

              {sidebarOpen === 'chat' && (
                 <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                     <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[85%]">
                        <p className="text-xs font-bold text-gray-500 mb-1">Sarah Chen • 10:05 AM</p>
                        <p className="text-sm">Can everyone see my screen?</p>
                     </div>
                     <div className="bg-primary-500 text-white p-3 rounded-2xl rounded-tr-none self-end ml-auto max-w-[85%] shadow-md">
                        <p className="text-sm">Yes, loud and clear!</p>
                     </div>
                  </div>
                  <div className="p-3 border-t border-gray-100 dark:border-gray-800">
                     <div className="relative">
                        <input 
                           type="text" 
                           placeholder={t.common.sendMessage} 
                           className="w-full pl-4 pr-10 py-3 rounded-full bg-gray-100 dark:bg-gray-800 border-none focus:ring-2 focus:ring-primary-500 text-sm"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600">
                           <Send className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                 </>
              )}
           </div>
        )}
      </div>

      {/* --- Bottom Control Bar --- */}
      <div className="h-20 shrink-0 flex items-center justify-between px-6 pb-2">
         {/* Time (Left) */}
         <div className="hidden md:flex flex-col">
            <span className="font-mono text-xl font-medium">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
         </div>

         {/* Center Controls */}
         <div className="flex items-center gap-3 bg-gray-800/80 backdrop-blur-xl p-2 rounded-2xl border border-gray-700 shadow-2xl">
            <button 
               onClick={() => setMicOn(!micOn)}
               className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                  micOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
               )}
               title={micOn ? t.meeting.muteAudio : t.meeting.unmuteAudio}
            >
               {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>
            <button 
               onClick={() => setCameraOn(!cameraOn)}
               className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                  cameraOn ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]"
               )}
               title={cameraOn ? t.meeting.turnOffCamera : t.meeting.turnOnCamera}
            >
               {cameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>
            
            <div className="w-px h-8 bg-gray-600 mx-1"></div>

            <button 
               onClick={handleScreenShare}
               className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                  screenSharing ? "bg-primary-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-gray-700 hover:bg-gray-600 text-white"
               )}
               title={screenSharing ? t.meeting.stopSharing : t.meeting.shareScreen}
            >
               <MonitorUp className="w-5 h-5" />
            </button>
            <button 
               onClick={() => setShowReactions(!showReactions)}
               className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center relative" 
               title={t.meeting.reactions}
            >
               <Smile className="w-5 h-5" />
               {showReactions && (
                 <div className="absolute bottom-16 left-0 bg-gray-800 rounded-2xl p-3 flex gap-2 border border-gray-700 shadow-lg animate-in fade-in scale-95 duration-200">
                   {['👍', '❤️', '😂', '😮', '😢', '🔥'].map((emoji) => (
                     <button
                       key={emoji}
                       onClick={() => handleReaction(emoji)}
                       className="text-2xl hover:scale-125 transition-transform"
                     >
                       {emoji}
                     </button>
                   ))}
                 </div>
               )}
            </button>
            <button 
               onClick={handleRecording}
               className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200",
                  isRecording ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse" : "bg-gray-700 hover:bg-gray-600 text-white"
               )}
               title={isRecording ? t.meeting.stopRecording : t.meeting.startRecording}
            >
               <Circle className="w-5 h-5" fill="currentColor" />
            </button>
            {isRecording && (
              <div className="text-xs text-red-500 font-mono flex items-center gap-1 ml-1">
                <Circle className="w-2 h-2 fill-red-500 animate-pulse" />
                {String(Math.floor(recordingTime / 60)).padStart(2, '0')}:{String(recordingTime % 60).padStart(2, '0')}
              </div>
            )}
            <button className="w-12 h-12 rounded-xl bg-gray-700 hover:bg-gray-600 text-white flex items-center justify-center md:hidden" title={t.meeting.moreOptions}>
               <MoreVertical className="w-5 h-5" />
            </button>

            <div className="w-px h-8 bg-gray-600 mx-1"></div>

            <button 
               className="w-16 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/20"
               onClick={handleLeaveClick}
               title={t.meeting.leaveMeeting}
            >
               <PhoneOff className="w-6 h-6" />
            </button>
         </div>

         {/* Right Controls */}
         <div className="hidden md:flex items-center gap-3">
            <button 
               onClick={handleInfoClick}
               className={cn(
                  "p-3 rounded-xl transition-colors",
                  sidebarOpen === 'info' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-gray-800"
               )}
               title={t.meeting.meetingInfo}
            >
               <Info className="w-6 h-6" />
            </button>
            <button 
               onClick={() => toggleSidebar('chat')}
               className={cn(
                  "p-3 rounded-xl transition-colors",
                  sidebarOpen === 'chat' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-gray-800"
               )}
               title={t.meeting.chat}
            >
               <div className="relative">
                  <MessageSquare className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#202124]"></span>
               </div>
            </button>
            <button 
               onClick={() => toggleSidebar('people')}
               className={cn(
                  "p-3 rounded-xl transition-colors",
                  sidebarOpen === 'people' ? "bg-primary-500 text-white" : "text-gray-400 hover:bg-gray-800"
               )}
               title={t.meeting.participants}
            >
               <div className="relative">
                  <Users className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-gray-700 rounded-full text-[10px] flex items-center justify-center text-white border-2 border-[#202124]">{participants.length}</span>
               </div>
            </button>
         </div>
      </div>

      {/* Leave Meeting Confirmation Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#1f1f1f] rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t.meeting.leaveMeeting}
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Bạn có chắc chắn muốn rời cuộc họp này?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLeaveConfirm(false)}
                className="px-6 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmLeaveRoom}
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              >
                Rời
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
