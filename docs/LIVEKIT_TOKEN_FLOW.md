# Architecture: Cross-Machine Token Sharing

## ❌ Vấn Đề Với localStorage

```
Host (Machine A)                     Participant (Machine B)
└─ localStorage                      └─ localStorage
   └─ approval_token_...               └─ KHÔNG thể access
   
❌ localStorage không thể share giữa các máy khác nhau
❌ Không thể share giữa các domain/origin khác nhau
```

## ✅ Giải Pháp: Lưu Token Trên Server

```
┌─ Host (Machine A)
│  ├─ Click "Duyệt"
│  └─ API PUT /v1/rooms/{roomId}/participants/{userId}/approve
│     └─ Server: lưu token vào database
│
├─ Server Database
│  └─ participants: [
│       { user_id, status: 'approved', livekit_token: 'xxx' }
│     ]
│
└─ Participant (Machine B)
   ├─ Poll mỗi 1 giây
   └─ API GET /v1/rooms/{roomId}/participants
      └─ Server: trả về participants kèm livekit_token
         (nếu status = approved)
```

## 📋 Flow Chi Tiết

### **Bước 1: Host Nhấn Duyệt**

```typescript
// Header.tsx
handleApproveJoinRequest(notificationId, userId, roomId)
  ↓
PUT /v1/rooms/{roomId}/participants/{userId}/approve
  ↓
Request body: { status: 'approved' }
```

**API Server Response:**
```json
{
  "status": "success",
  "data": {
    "participant": {
      "user_id": "user123",
      "status": "approved",
      "livekit_token": "eyJhbGc..." // ← Server tạo token này
    }
  }
}
```

**Server Database sau approve:**
```sql
UPDATE participants 
SET status = 'approved', 
    livekit_token = 'eyJhbGc...'
WHERE room_id = 'room123' 
  AND user_id = 'user123'
```

### **Bước 2: Participant Polling**

```typescript
// Dashboard.tsx - pollApprovalStatus()
GET /v1/rooms/{roomId}/participants
  ↓
Server check database
  ↓
Trả về participants với livekit_token (nếu approved)
```

**API Response:**
```json
{
  "data": {
    "participants": [
      {
        "user_id": "user123",
        "user_name": "John Doe",
        "status": "approved",
        "livekit_token": "eyJhbGc..."  // ← Lấy từ database
      }
    ]
  }
}
```

### **Bước 3: Redirect LiveKit**

```typescript
if (currentParticipant.status === 'approved' && currentParticipant.livekit_token) {
  const url = `https://meet.livekit.io/custom?liveKitUrl=${apiBase}&token=${currentParticipant.livekit_token}`;
  window.location.href = url;
}
```

## 🔑 Key Points

### **Token Sources** (theo thứ tự ưu tiên)
1. `currentParticipant.livekit_token` ← **CHÍNH (từ server)**
2. `currentParticipant.token` ← fallback
3. `participantsData.data?.livekit_token` ← fallback

### **Không dùng localStorage** để share token
- ❌ Removed: `localStorage.setItem(approval_token_...)`
- ❌ Removed: `localStorage.getItem(approval_token_...)`
- ✅ Use API response thay vào

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   Backend Server                     │
│  ┌──────────────────────────────────────────────┐   │
│  │              Database                        │   │
│  │  rooms:                                      │   │
│  │  - id, name, host_id, ...                   │   │
│  │                                              │   │
│  │  participants:                               │   │
│  │  - room_id, user_id, status, livekit_token  │   │
│  │    (status: 'waiting', 'approved', etc.)    │   │
│  └──────────────────────────────────────────────┘   │
│                        ↑                             │
│         ┌─────────────┼─────────────┐               │
│         │             │             │               │
│    PUT /approve   GET /rooms   GET /participants    │
│         │             │             │               │
└─────────────────────────────────────────────────────┘
         ↑             ↑             ↑
         │             │             │
      Host          Participant    Host/Participant
   (Machine A)      (Machine B)    (Any Machine)
```

## 🔄 Complete Flow Timeline

```
Time  Host (Machine A)              Participant (Machine B)
────────────────────────────────────────────────────────────

t0    Open Notifications
      See: "User B yêu cầu join"

t1    Click "Duyệt"
      ├─ PUT /approve
      └─ Server saves token
                                    Polling...
                                    (status still 'waiting')

t2                                  Polling...
                                    (status still 'waiting')

t3                                  Polling...
                                    GET /participants
                                    ├─ Found: status='approved'
                                    ├─ Got: livekit_token
                                    └─ Redirect LiveKit!
                                    
                                    window.location.href = 
                                    "https://meet.livekit.io/
                                     custom?token={token}"
                                    
                                    ✅ Vào phòng họp!
```

## 🚀 Implementation Checklist

### Backend API Endpoints

- [ ] `GET /v1/rooms` - Trả về rooms
- [ ] `GET /v1/rooms/{roomId}/participants` 
  - ✅ Trả về participants
  - ✅ Include `livekit_token` nếu status = 'approved'
- [ ] `POST /v1/rooms/{roomId}/participants` - Join room
- [ ] `PUT /v1/rooms/{roomId}/participants/{userId}/approve`
  - ✅ Set status = 'approved'
  - ✅ Generate LiveKit token
  - ✅ Save token vào database

### Frontend Logic

- ✅ [Header] Host click approve → Call API
- ✅ [Dashboard] Participant polling → Check status
- ✅ [Dashboard] Get livekit_token từ response
- ✅ [Dashboard] Redirect LiveKit nếu có token

## 📝 Notes

- **Token generation**: Backend nên tạo LiveKit token (không client)
- **Token storage**: Database, NOT localStorage
- **Token lifetime**: Đặt expiry time phù hợp
- **Security**: Verify user authentication trước khi return token

## 🎯 Summary

| Component | Cũ | Mới |
|-----------|-----|-----|
| Token storage | localStorage ❌ | Server Database ✅ |
| Cross-machine share | Không (❌) | Có (✅) |
| Token in API response | Optional | Bắt buộc |
| Host-Participant sync | Via localStorage | Via API |
