/**
 * Service để quản lý thông báo từ chối (rejection notifications)
 * Lưu trữ thông báo từ chối của từng user dựa trên userId
 * Được dùng để gửi thông báo tới người dùng khi host từ chối yêu cầu join
 */

interface RejectionNotificationData {
  userId: string;
  roomId: string;
  roomName: string;
  hostName?: string;
  timestamp: number;
}

const getRejectionStorageKey = (userId: string) => `rejection_notifications_${userId}`;

export const rejectionNotificationService = {
  // Thêm thông báo từ chối cho một user cụ thể
  addRejectionNotification: (userId: string, data: RejectionNotificationData) => {
    try {
      const storageKey = getRejectionStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      const rejections: RejectionNotificationData[] = stored ? JSON.parse(stored) : [];
      
      // Thêm notification mới (check trùng lặp)
      const isDuplicate = rejections.some(r => r.roomId === data.roomId && r.timestamp > Date.now() - 5000);
      if (!isDuplicate) {
        rejections.unshift(data); // Thêm vào đầu
        localStorage.setItem(storageKey, JSON.stringify(rejections));
        console.log(`✅ Rejection notification added for user ${userId} in room ${data.roomId}`);
      }
    } catch (error) {
      console.error('Error adding rejection notification:', error);
    }
  },

  // Lấy tất cả thông báo từ chối cho một user
  getRejectionNotifications: (userId: string): RejectionNotificationData[] => {
    try {
      const storageKey = getRejectionStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error retrieving rejection notifications:', error);
      return [];
    }
  },

  // Xóa thông báo từ chối sau khi đã đọc
  clearRejectionNotifications: (userId: string) => {
    try {
      const storageKey = getRejectionStorageKey(userId);
      localStorage.removeItem(storageKey);
      console.log(`✅ Rejection notifications cleared for user ${userId}`);
    } catch (error) {
      console.error('Error clearing rejection notifications:', error);
    }
  },

  // Xóa notification từ chối cụ thể
  removeRejectionNotification: (userId: string, roomId: string) => {
    try {
      const storageKey = getRejectionStorageKey(userId);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        let rejections: RejectionNotificationData[] = JSON.parse(stored);
        rejections = rejections.filter(r => r.roomId !== roomId);
        
        if (rejections.length > 0) {
          localStorage.setItem(storageKey, JSON.stringify(rejections));
        } else {
          localStorage.removeItem(storageKey);
        }
      }
    } catch (error) {
      console.error('Error removing rejection notification:', error);
    }
  }
};
