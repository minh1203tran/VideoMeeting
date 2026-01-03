/**
 * Mock data cho pending join requests (khi backend không có sẵn)
 * Trong production, dữ liệu này sẽ đến từ API backend
 */
let mockPendingParticipants: {
  [roomId: string]: {
    userId: string;
    userName: string;
    status: 'waiting' | 'pending';
  }[]
} = {};

export const joinRequestService = {
  /**
   * Thêm pending participant vào mock data
   * Được gọi khi user join room
   */
  addPendingParticipant: (roomId: string, userId: string, userName: string) => {
    if (!mockPendingParticipants[roomId]) {
      mockPendingParticipants[roomId] = [];
    }
    
    // Avoid duplicates
    const exists = mockPendingParticipants[roomId].some(p => p.userId === userId);
    if (!exists) {
      mockPendingParticipants[roomId].push({
        userId,
        userName,
        status: 'pending'
      });
    }
  },

  /**
   * Lấy pending participants của phòng
   */
  getPendingParticipants: (roomId: string) => {
    return mockPendingParticipants[roomId] || [];
  },

  /**
   * Approve hoặc reject participant
   */
  updateParticipantStatus: (roomId: string, userId: string, _status: 'approved' | 'rejected') => {
    if (mockPendingParticipants[roomId]) {
      const index = mockPendingParticipants[roomId].findIndex(p => p.userId === userId);
      if (index !== -1) {
        mockPendingParticipants[roomId].splice(index, 1);
      }
    }
  },

  /**
   * Clear all pending participants (for testing)
   */
  clearAll: () => {
    mockPendingParticipants = {};
  }
};
