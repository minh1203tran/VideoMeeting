# Tính Năng Join Request Notifications

## Mô Tả
Khi người dùng nhập Room Code và nhấn "Tham gia", hệ thống sẽ:
1. Gọi API `POST /v1/rooms/{roomId}/participants` để thêm người dùng vào danh sách chờ duyệt
2. Gửi thông báo (`join_request`) tới host của phòng
3. Host sẽ thấy thông báo trong Notifications Dropdown và có thể duyệt hoặc từ chối yêu cầu

## Cách Hoạt Động

### 1. Người Dùng Gửi Yêu Cầu Join
- Người dùng nhập mã phòng vào input "Room code" ở Dashboard
- Nhấn nút "Tham gia"
- API được gọi: `POST /v1/rooms/{roomId}/participants`

### 2. Thông Báo Được Tạo
- Một thông báo kiểu `join_request` được tạo
- Thông báo chứa thông tin:
  - `userId`: ID của người yêu cầu
  - `userName`: Tên người yêu cầu
  - `roomId`: ID phòng họp
  - `status`: 'pending' (chờ duyệt)

### 3. Host Xem Thông Báo
- Host mở Notifications Dropdown (click vào Bell icon)
- Thấy thông báo: "[Tên người dùng] đã yêu cầu tham gia phòng"
- Có 2 nút: "Duyệt" (xanh) và "Từ chối" (đỏ)

### 4. Host Duyệt hoặc Từ Chối
**Duyệt:**
- Gọi API: `PUT /v1/rooms/{roomId}/participants/{userId}/approve`
- Thông báo được cập nhật thành `status: 'approved'`
- Hiển thị badge "✓ Đã duyệt"

**Từ Chối:**
- Gọi API: `PUT /v1/rooms/{roomId}/participants/{userId}/reject`
- Thông báo được cập nhật thành `status: 'rejected'`
- Hiển thị badge "✕ Đã từ chối"

## Files Đã Thay Đổi

### 1. `src/types/index.ts`
- Cập nhật `Notification` interface
- Thêm trường: `type`, `userId`, `userName`, `roomId`, `status`

### 2. `src/services/notificationService.ts` (Mới)
- Service quản lý notifications
- Hỗ trợ:
  - `addNotification()`: Thêm thông báo mới
  - `updateNotification()`: Cập nhật thông báo
  - `subscribe()`: Theo dõi thay đổi
  - `markAsRead()`: Đánh dấu đã đọc

### 3. `src/pages/Dashboard.tsx`
- Import `notificationService`
- Thêm logic tạo notification khi join room
- Gọi `notificationService.addNotification()` sau khi join thành công

### 4. `src/layout/Header.tsx`
- Import `notificationService` và `Notification` type
- Subscribe tới notification changes
- Thêm hàm `handleApproveJoinRequest()` - duyệt yêu cầu
- Thêm hàm `handleRejectJoinRequest()` - từ chối yêu cầu
- Cập nhật UI hiển thị:
  - Nút "Duyệt" (xanh) và "Từ chối" (đỏ) cho pending join_request
  - Badge trạng thái cho approved/rejected join_request

## API Endpoints

### Join Room
```
POST /v1/rooms/{roomId}/participants
Headers: Authorization: Bearer {token}
Body: {}
```

### Approve Participant
```
PUT /v1/rooms/{roomId}/participants/{userId}/approve
Headers: Authorization: Bearer {token}
Body: { status: 'approved' }
```

### Reject Participant
```
PUT /v1/rooms/{roomId}/participants/{userId}/reject
Headers: Authorization: Bearer {token}
Body: { status: 'rejected' }
```

## Testing

1. Mở ứng dụng với tài khoản Host
2. Mở ứng dụng khác với tài khoản khác (Participant)
3. Participant nhập Room Code và nhấn "Tham gia"
4. Host sẽ thấy thông báo join_request
5. Host có thể click "Duyệt" hoặc "Từ chối"

## Lưu Ý

- Notifications được lưu in-memory. Trong production, cần kết nối với database/backend
- Trạng thái thông báo được cập nhật real-time qua notification service
- API endpoints cần được triển khai trên backend để hoạt động đầy đủ
