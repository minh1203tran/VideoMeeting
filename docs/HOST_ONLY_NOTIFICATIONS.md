# Cập Nhật: Chỉ Host Thấy Join Request Notifications

## 📋 Thay Đổi

### Điều Kiện Mới
✅ **Thông báo join_request chỉ hiển thị cho HOST của phòng**
- ❌ Người dùng thường KHÔNG thấy thông báo join_request của người khác
- ✅ CHỈ HOST của phòng mới thấy các yêu cầu join từ những người khác

### Cách Hoạt Động

#### 1. **Khi User Join Room (Dashboard.tsx)**
```
User A nhập Room Code → Click "Tham gia"
    ↓
Gọi API: POST /v1/rooms/{roomId}/participants
    ↓
Tạo notification join_request
    ↓
Lưu vào notificationService (bên client User A)
```

#### 2. **Khi Host Mở App (Header.tsx)**
```
Host mở app
    ↓
Header polling mỗi 5 giây
    ↓
Fetch rooms → Filter: chỉ rooms mà user là HOST
    ↓
Fetch pending participants từ các phòng của Host
    ↓
Kiểm tra: host_id === user.id ?
    ├─ YES → Tạo notification cho Host
    └─ NO  → Bỏ qua, không tạo notification
    ↓
Host thấy thông báo tại Bell Icon
```

### Điều Kiện Check Host

**Trong Header (fetchPendingJoinRequests):**
```typescript
const isHostOfRoom = room.host_id === user.id || room.hostId === user.id;

if (isHostOfRoom) {
  // Chỉ tạo notification nếu user là host
  // Fetch pending participants
  // Tạo notifications
}
```

## 📍 Flow Ví Dụ

```
Tình huống: User A join vào Room của User B (Host)

┌─ User A (Participant)
│  ├─ Dashboard
│  ├─ Input Room Code → Click "Tham gia"
│  └─ Notification: "Tôi đã yêu cầu tham gia" (tự tạo)
│
└─ User B (Host)
   ├─ Header polling (5s)
   ├─ Check: user.id === room.host_id ? YES
   ├─ Fetch pending participants → [User A]
   ├─ Create notification: "User A đã yêu cầu tham gia phòng..."
   └─ Bell Icon → Hiển thị thông báo
      ├─ [✓ Duyệt]
      └─ [✕ Từ chối]
```

## 🔍 Debug Logs

Khi enable debug mode, bạn sẽ thấy logs:
```
[Header] Checking room "Meeting Room 1": isHost=true, hostId=user123, userId=user123
[Header] Room "Meeting Room 1": Found 2 pending participants
[Header] Creating notification for user "User A" in room "Meeting Room 1"
```

Nếu không phải host:
```
[Header] Checking room "Meeting Room 2": isHost=false, hostId=user456, userId=user123
```
→ Không tạo notification (bỏ qua)

## ✅ Cách Test

### Chuẩn Bị
- User A: Người dùng thường
- User B: Host/Owner của phòng

### Test Case 1: Host thấy thông báo
1. User B tạo room hoặc là owner của room
2. User A nhập room code → Click "Tham gia"
3. **Kỳ vọng**: User B thấy notification "User A đã yêu cầu tham gia"
4. **Không kỳ vọng**: User A KHÔNG thấy notification join_request

### Test Case 2: Non-Host không thấy
1. User A join vào room
2. User C (người khác, không phải host) mở app
3. **Kỳ vọng**: User C KHÔNG thấy notification join_request
4. ✅ Chỉ User B (host) mới thấy

## 📝 Files Đã Cập Nhật

### `src/layout/Header.tsx`
- Thêm log debug cho việc check host
- Thêm điều kiện `isHostOfRoom` trước khi tạo notification
- Log tên phòng và số pending participants

### `src/pages/Dashboard.tsx`
- Cải tiến: Fetch room name khi join (hiển thị tên phòng trong thông báo)
- Thêm comment giải thích: notification chỉ cho host

## 🔄 Polling Logic

```
Header polling (5s interval)
  ↓
Fetch /v1/rooms (tất cả rooms)
  ↓
For each room:
  Check: room.host_id === user.id ?
    ├─ YES → Fetch participants từ room này
    │        Tìm pending participants
    │        Tạo notifications
    │
    └─ NO  → Bỏ qua room này
```

## 🎯 Lợi Ích

✅ **Chỉ Host nhận thông báo** - Giảm noise/spam notifications
✅ **Rõ ràng & Trực quan** - User biết rõ role của họ
✅ **Bảo mật** - Không lộ thông tin yêu cầu join của người khác

## 📊 Architecture

```
┌─ Dashboard (User A)
│  └─ Join Room
│     └─ notificationService.addNotification()
│        └─ localStorage (client A)
│
└─ Header (User B - Host)
   └─ fetchPendingJoinRequests() [5s polling]
      └─ Check: isHostOfRoom ? 
         └─ notificationService.addNotification()
            └─ localStorage (client B)
```

## ⚠️ Lưu Ý

- Notification chỉ sync qua **localStorage** (cùng machine)
- Nếu host đóng tab/browser, sẽ không polling được
- Cần **WebSocket/Backend** để real-time 24/7 monitoring
- API cần trả về `host_id` hoặc `hostId` để check

## 🚀 Cải Tiến Tương Lai

1. **WebSocket Integration** - Real-time notifications mà không cần polling
2. **Backend Persistence** - Lưu notifications vào database
3. **Email Alerts** - Gửi email khi có join request
4. **Push Notifications** - Thông báo trên điện thoại

## 🔗 Related Docs

- [JOIN_REQUEST_FEATURE.md](./JOIN_REQUEST_FEATURE.md) - Tính năng chi tiết
- [JOIN_REQUEST_GUIDE.md](./JOIN_REQUEST_GUIDE.md) - Hướng dẫn sử dụng
