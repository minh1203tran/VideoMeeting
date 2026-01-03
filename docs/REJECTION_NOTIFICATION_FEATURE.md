# Tính Năng: Host Từ Chối Tham Gia Và Thông Báo Người Dùng

## 🎯 Mục Đích
Khi host nhấn nút "Từ chối" (❌ button), hệ thống sẽ:
1. Gọi API để từ chối người dùng tham gia phòng
2. Gửi thông báo tới người dùng bị từ chối
3. Người dùng nhận được thông báo rằng host đã từ chối yêu cầu của họ

## 🏗️ Kiến Trúc

### 1. **rejectionNotificationService** (Service Mới)
**File:** `src/services/rejectionNotificationService.ts`

Quản lý thông báo từ chối thông qua localStorage:
```typescript
// Gửi thông báo từ chối cho một user cụ thể
rejectionNotificationService.addRejectionNotification(userId, {
  userId: userId,
  roomId: roomId,
  roomName: 'Room Name',
  hostName: 'Host Name',
  timestamp: Date.now()
});

// Lấy tất cả thông báo từ chối của một user
const rejections = rejectionNotificationService.getRejectionNotifications(userId);

// Xóa notification từ chối
rejectionNotificationService.removeRejectionNotification(userId, roomId);
```

**Lưu trữ:** Sử dụng localStorage key: `rejection_notifications_{userId}`

### 2. **Header.tsx** (Tạo Rejection Notification)
**Hàm:** `handleRejectJoinRequest`

Khi host nhấn nút "Từ chối" trong notification dropdown:
1. Gọi API: `POST /v1/rooms/{roomId}/participants/{userId}/deny` hoặc `PUT /v1/rooms/{roomId}/participants/{userId}/reject`
2. Sau API thành công, gửi rejection notification tới người dùng
3. Cập nhật notification status thành `'rejected'`

```typescript
// Gửi rejection notification
rejectionNotificationService.addRejectionNotification(userId, {
  userId: userId,
  roomId: roomId,
  roomName: roomName,
  hostName: user?.name,
  timestamp: Date.now()
});
```

### 3. **Dashboard.tsx** (Nhận Rejection Notification)
**Hook:** `useEffect` polling (3 giây)

Định kỳ kiểm tra xem người dùng có rejection notification nào:
```typescript
// Poll every 3 seconds
useEffect(() => {
  if (!user?.id) return;

  const checkRejectionNotifications = () => {
    const rejections = rejectionNotificationService.getRejectionNotifications(user.id);
    
    rejections.forEach(rejection => {
      // Tạo notification trong notificationService
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

      // Hiển thị alert cho người dùng
      alert(`Host đã từ chối yêu cầu tham gia phòng "${rejection.roomName}"`);

      // Xóa rejection notification sau khi xử lý
      rejectionNotificationService.removeRejectionNotification(rejection.userId, rejection.roomId);
    });
  };

  // Check immediately and every 3 seconds
  checkRejectionNotifications();
  const interval = setInterval(checkRejectionNotifications, 3000);

  return () => clearInterval(interval);
}, [user?.id]);
```

### 4. **MeetingRoom.tsx** (Từ Chối Trong Phòng)
**Hàm:** `handleDenyParticipant`

Khi host từ chối từ danh sách chờ duyệt trong phòng họp:
1. Gọi API `POST /v1/rooms/{actualRoomId}/participants/{participantId}/deny`
2. Gửi rejection notification tới người dùng
3. Xóa người dùng từ danh sách chờ

```typescript
if (denyResponse.ok) {
  // 📢 Send rejection notification
  rejectionNotificationService.addRejectionNotification(participantId, {
    userId: participantId,
    roomId: roomId,
    roomName: roomName,
    hostName: user?.name,
    timestamp: Date.now()
  });
}
```

## 🔄 Flow Hoạt Động

```
Host (Header.tsx)
│
├─ Click "Từ chối" button
│  │
│  └─ handleRejectJoinRequest()
│     │
│     ├─ Call API: POST /v1/rooms/{roomId}/participants/{userId}/deny
│     │
│     └─ rejectionNotificationService.addRejectionNotification(userId, {
│        userId, roomId, roomName, hostName, timestamp
│        })  ← Lưu vào localStorage
│
└─ Thông báo được lưu trong localStorage key: rejection_notifications_{userId}


Participant (Dashboard.tsx)
│
└─ useEffect polling (3 giây)
   │
   ├─ rejectionNotificationService.getRejectionNotifications(userId)
   │  └─ Đọc từ localStorage
   │
   ├─ Tạo notification trong notificationService
   │
   ├─ Hiển thị alert cho người dùng
   │
   └─ Xóa rejection notification từ localStorage
```

## 📊 Data Flow

### Khi Host Từ Chối:
```
localStorage: rejection_notifications_{participantId}
↓ (3 second poll)
Dashboard.tsx: useEffect
↓
notificationService.addNotification()
↓
Notification Dropdown / Alert
```

## 🧪 Cách Test

### Test Case 1: Từ Chối Từ Header
1. Host đăng nhập
2. Participant join room → Host thấy notification
3. Host click "Từ chối" button
4. Participant thấy alert: "Host đã từ chối yêu cầu tham gia phòng..."
5. Notification trong Header của Participant hiển thị status "✕ Đã từ chối"

### Test Case 2: Từ Chối Từ Phòng Họp
1. Host trong phòng → Thấy danh sách "Chờ duyệt"
2. Host click nút "✕" (deny button)
3. API call thành công
4. Participant thấy alert: "Host đã từ chối..."
5. Notification được lưu và hiển thị

## 🔑 Key Features

✅ **Không cần WebSocket/Real-time**: Dùng localStorage + polling
✅ **User-specific**: Mỗi user có rejection notifications riêng
✅ **Auto-cleanup**: Xóa notification sau khi xử lý
✅ **Fallback API**: Hỗ trợ cả `/deny` (POST) và `/reject` (PUT)
✅ **Error Handling**: Auto-retry khi token hết hạn
✅ **UX Friendly**: Alert + Notification trong dropdown

## 📝 Environment Variables

```env
VITE_API_URL=<API_BASE_URL>
```

## 🚀 Deployment

Không cần configuration thêm. Service hoạt động hoàn toàn dựa trên localStorage và polling.

## 🔗 Related Files

- `src/services/rejectionNotificationService.ts` - Service quản lý rejection notifications
- `src/services/notificationService.ts` - Service quản lý tất cả notifications
- `src/layout/Header.tsx` - UI duyệt/từ chối
- `src/pages/Dashboard.tsx` - Polling rejection notifications
- `src/pages/MeetingRoom.tsx` - Từ chối từ phòng họp
- `src/types/index.ts` - Type definitions
