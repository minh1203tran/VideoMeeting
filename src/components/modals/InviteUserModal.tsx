import React, { useState } from 'react';
import { X, Search, UserPlus } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useDarkMode } from '../../context/DarkModeContext';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  roomName: string;
  onInviteSuccess?: (user: User) => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  roomId,
  roomName,
  onInviteSuccess
}) => {
  const { isDarkMode } = useDarkMode();

  const [searchEmail, setSearchEmail] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  // Search users by email
  const handleSearch = async (email: string) => {
    setSearchEmail(email);
    
    if (!email.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

      if (!token || !apiBase) {
        console.log('Missing token or apiBase');
        setIsSearching(false);
        return;
      }

      // Try to search users endpoint
      const response = await fetch(`${apiBase}/v1/users/search?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const users = data.data?.users || data.data || [];
        setSearchResults(users);
        console.log('Search results:', users);
      } else {
        console.log('Search failed:', response.status);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Send invitation
  const handleSendInvite = async () => {
    if (!selectedUser) {
      alert('Vui lòng chọn người dùng');
      return;
    }

    setIsInviting(true);
    try {
      const token = localStorage.getItem('authToken');
      const apiBase = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || '';

      if (!token || !apiBase) {
        alert('Không thể kết nối tới server');
        return;
      }

      // Send invitation via API
      const response = await fetch(`${apiBase}/v1/rooms/${roomId}/invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: selectedUser.id,
          email: selectedUser.email,
          message: inviteMessage || `Mời bạn tham gia phòng họp: ${roomName}`
        })
      });

      if (response.ok) {
        console.log('Invitation sent successfully');
        alert(`Mời ${selectedUser.name} tham gia phòng ${roomName} thành công!`);
        onInviteSuccess?.(selectedUser);
        
        // Reset form
        setSearchEmail('');
        setSelectedUser(null);
        setInviteMessage('');
        setSearchResults([]);
        onClose();
      } else {
        const errorData = await response.json();
        alert(`Lỗi: ${errorData.message || 'Không thể gửi lời mời'}`);
      }
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert('Có lỗi xảy ra khi gửi lời mời');
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mời người dùng vào phòng"
    >
      <div className="space-y-6 py-4">
        {/* Search Section */}
        <div className="space-y-3">
          <label style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="block font-medium">
            Tìm kiếm người dùng
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Nhập email để tìm kiếm..."
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                disabled={isSearching}
                style={{
                  backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
                  color: isDarkMode ? '#e5e7eb' : '#111827',
                  borderColor: isDarkMode ? '#374151' : '#e5e7eb'
                }}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={() => handleSearch(searchEmail)}
              disabled={isSearching || !searchEmail.trim()}
              style={{
                backgroundColor: !searchEmail.trim() || isSearching ? (isDarkMode ? '#374151' : '#e5e7eb') : '#16a34a',
                color: !searchEmail.trim() || isSearching ? (isDarkMode ? '#6b7280' : '#9ca3af') : '#ffffff'
              }}
              className="px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isSearching ? 'Tìm...' : 'Tìm'}
            </button>
          </div>

          {/* Loading State */}
          {isSearching && (
            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm">
              Đang tìm kiếm...
            </p>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div
              style={{
                backgroundColor: isDarkMode ? '#1f2937' : '#f9fafb',
                borderColor: isDarkMode ? '#374151' : '#e5e7eb'
              }}
              className="border rounded-lg divide-y max-h-64 overflow-y-auto"
            >
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  style={{
                    backgroundColor:
                      selectedUser?.id === user.id
                        ? isDarkMode
                          ? '#374151'
                          : '#ede9fe'
                        : 'transparent'
                  }}
                  className="p-3 cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-3"
                >
                  <img
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="font-medium">
                      {user.name}
                    </p>
                    <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm">
                      {user.email}
                    </p>
                  </div>
                  {selectedUser?.id === user.id && (
                    <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {searchEmail && !isSearching && searchResults.length === 0 && (
            <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm">
              Không tìm thấy người dùng nào
            </p>
          )}
        </div>

        {/* Selected User */}
        {selectedUser && (
          <div
            style={{
              backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6',
              borderColor: '#10b981'
            }}
            className="border-l-4 border-green-500 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}`}
                  alt={selectedUser.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="font-semibold">
                    {selectedUser.name}
                  </p>
                  <p style={{ color: isDarkMode ? '#9ca3af' : '#6b7280' }} className="text-sm">
                    {selectedUser.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Message (Optional) */}
        {selectedUser && (
          <div className="space-y-2">
            <label style={{ color: isDarkMode ? '#ffffff' : '#111827' }} className="block font-medium text-sm">
              Lời nhắn (Tùy chọn)
            </label>
            <textarea
              placeholder="Thêm lời nhắn cho lời mời..."
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              style={{
                backgroundColor: isDarkMode ? '#1a2332' : '#ffffff',
                color: isDarkMode ? '#e5e7eb' : '#111827',
                borderColor: isDarkMode ? '#374151' : '#e5e7eb'
              }}
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isInviting}
            className="flex-1"
            style={{
              width: '100%',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#5d3a3a';
              e.currentTarget.style.color = '#ef4444';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = isDarkMode ? '#1f2937' : '#f3f4f6';
              e.currentTarget.style.color = isDarkMode ? '#9ca3af' : '#4b5563';
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSendInvite}
            disabled={!selectedUser || isInviting}
            icon={UserPlus}
            className="flex-1"
          >
            {isInviting ? 'Đang gửi...' : 'Gửi lời mời'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
