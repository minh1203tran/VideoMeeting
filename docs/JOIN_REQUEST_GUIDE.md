# Hướng Dẫn Sử Dụng Tính Năng Join Request

## 🎯 Mục Đích
Tính năng này cho phép:
1. **Người dùng** nhập Room Code để join vào phòng họp
2. **Host** nhận thông báo join request và có thể duyệt hoặc từ chối

## 🧪 Cách Test

### Chuẩn Bị
Bạn cần 2 trình duyệt/tab khác nhau:
- **Tab 1**: Tài khoản người dùng thường (Participant)
- **Tab 2**: Tài khoản chủ phòng (Host)

### Bước 1: Người Dùng Gửi Yêu Cầu Join

**Trên Tab 1 (Participant):**
1. Đăng nhập vào Dashboard
2. Tìm section "Quick Actions" (bên trái)
3. Nhập **Room Code** vào ô input "Room code..."
4. Nhấn nút **"Tham gia"** (Join)
5. Sẽ thấy alert: "Bạn đã được thêm vào danh sách chờ duyệt"
6. Notification sẽ xuất hiện: "Tôi đã yêu cầu tham gia phòng"

### Bước 2: Host Xem Thông Báo

**Trên Tab 2 (Host):**
1. Nhấn vào **Bell Icon** (chuông thông báo) ở header
2. Sẽ thấy **Notifications Dropdown** mở ra
3. Tìm thông báo kiểu "join_request": `"[Tên người dùng] đã yêu cầu tham gia phòng"`
4. Thông báo sẽ có **2 nút**:
   - ✅ **"Duyệt"** (nút xanh)
   - ❌ **"Từ chối"** (nút đỏ)

### Bước 3: Host Duyệt Hoặc Từ Chối

**Duyệt Yêu Cầu:**
1. Click nút **"Duyệt"** (xanh) trên notification
2. Sẽ thấy alert: "Đã duyệt yêu cầu tham gia"
3. Notification sẽ hiển thị badge **"✓ Đã duyệt"** (xanh)
4. Participant sẽ được approve vào phòng

**Từ Chối Yêu Cầu:**
1. Click nút **"Từ chối"** (đỏ) trên notification
2. Sẽ thấy alert: "Đã từ chối yêu cầu tham gia"
3. Notification sẽ hiển thị badge **"✕ Đã từ chối"** (đỏ)
4. Participant sẽ không thể vào phòng

## 📍 Vị Trí UI

### Tab Participant:
```
┌─ Dashboard
│
├─ Quick Actions (bên trái)
│  ├─ [Instant Meeting]
│  ├─ [Schedule Meeting]
│  └─ [Room code...] [Tham gia] ← Nhập code ở đây
│
└─ Notification (hệ thống)
   └─ "Tôi đã yêu cầu tham gia phòng"
```

### Tab Host:
```
┌─ Header
│  ├─ 🔔 Bell Icon ← Click vào đây
│  │  └─ Notifications Dropdown
│  │     └─ "[Tên user] đã yêu cầu tham gia phòng"
│  │        ├─ [✓ Duyệt]  ← Click duyệt
│  │        └─ [✕ Từ chối] ← Click từ chối
│  │
│  └─ [Minh Duc] [Profile]
│
└─ Main Content
```

## 💾 Lưu Trữ Dữ Liệu

- **Notifications** được lưu trong `localStorage` 
- Khi reload page, thông báo sẽ được restore
- Dữ liệu pending participants được lưu trong **joinRequestService** (in-memory)

## 🔄 Chu Kỳ Polling

Header polling **mỗi 5 giây** để kiểm tra pending join requests:
- Fetch danh sách phòng của user
- Kiểm tra pending participants trong mỗi phòng
- Tạo notifications tương ứng

## ⚙️ API Endpoints

### API được sử dụng:

```
GET /v1/rooms
- Lấy danh sách rooms
- Header: Authorization: Bearer {token}

GET /v1/rooms/{roomId}/participants  
- Lấy danh sách participants của phòng
- Header: Authorization: Bearer {token}

POST /v1/rooms/{roomId}/participants
- Join vào phòng
- Header: Authorization: Bearer {token}
- Body: {}

PUT /v1/rooms/{roomId}/participants/{userId}/approve
- Duyệt participant
- Header: Authorization: Bearer {token}
- Body: { status: 'approved' }

PUT /v1/rooms/{roomId}/participants/{userId}/reject
- Từ chối participant  
- Header: Authorization: Bearer {token}
- Body: { status: 'rejected' }
```

## 🧩 Services

### 1. **notificationService** (`src/services/notificationService.ts`)
- Quản lý notifications (add, update, remove)
- Persist vào localStorage
- Real-time subscription support

### 2. **joinRequestService** (`src/services/joinRequestService.ts`)
- Mock backend cho pending participants
- Dùng khi API backend không có sẵn
- Có thể xóa khi backend có sẵn API

## 📝 Files Đã Cập Nhật

1. `src/types/index.ts` - Cập nhật Notification interface
2. `src/services/notificationService.ts` - Tạo mới
3. `src/services/joinRequestService.ts` - Tạo mới
4. `src/pages/Dashboard.tsx` - Thêm logic join room
5. `src/layout/Header.tsx` - Thêm fetch & UI duyệt/từ chối

## 🐛 Troubleshooting

### Không thấy thông báo?
- ✅ Kiểm tra đã click nút "Tham gia" chưa?
- ✅ Kiểm tra Room Code có hợp lệ không?
- ✅ Kiểm tra 2 tab có cùng localhost không?
- ✅ Mở F12 → Console xem có error không?

### Thông báo biến mất sau reload?
- Notifications được lưu localStorage, nên phải vẫn thấy
- Nếu không thấy, check console xem có error khi load localStorage không

### Không thấy Approve/Reject buttons?
- Chỉ hiển thị nếu notification type = "join_request" và status = "pending"
- Kiểm tra type và status trong localStorage notifications

## 🚀 Cải Tiến Tương Lai

1. **Backend Integration**: 
   - Tạo proper API endpoints cho approve/reject
   - Store pending participants vào database
   
2. **Real-time Sync**:
   - Integrate WebSocket/Socket.io
   - Auto-sync giữa các clients
   
3. **Notification Persistence**:
   - Lưu notifications vào backend database
   - Sync lịch sử notifications

4. **Email Notifications**:
   - Gửi email khi có join request
   - Gửi email khi được approve/reject
