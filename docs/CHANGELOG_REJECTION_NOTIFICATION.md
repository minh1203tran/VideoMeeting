# 📋 Summary of Changes - Rejection Notification Feature

## 🎯 Overview
Implemented a complete rejection notification system that notifies participants when a host denies their join request.

---

## 📝 Files Changed/Created

### 1. ✨ NEW: `src/services/rejectionNotificationService.ts`
**Purpose:** Manage rejection notifications using localStorage

**Key Functions:**
- `addRejectionNotification(userId, data)` - Add rejection notification
- `getRejectionNotifications(userId)` - Get all rejections for a user
- `removeRejectionNotification(userId, roomId)` - Remove specific rejection
- `clearRejectionNotifications(userId)` - Clear all for user

**Storage Format:**
```typescript
// Key: rejection_notifications_{userId}
// Value: Array<{
//   userId: string
//   roomId: string
//   roomName: string
//   hostName?: string
//   timestamp: number
// }>
```

---

### 2. 📝 UPDATED: `src/layout/Header.tsx`

**Changes:**
1. Added import: `rejectionNotificationService`
2. Updated `handleRejectJoinRequest()` function:
   - Now calls both `/deny` (POST) and `/reject` (PUT) endpoints
   - Sends rejection notification via `rejectionNotificationService.addRejectionNotification()`
   - Fetches room name to include in notification
   - Shows alert: "Đã từ chối yêu cầu tham gia. Thông báo gửi đến người dùng."

**Code Changes:**
```typescript
// Added import
import { rejectionNotificationService } from '../services/rejectionNotificationService';

// Updated handleRejectJoinRequest
const handleRejectJoinRequest = async (notificationId: string, userId: string, roomId: string) => {
  try {
    // ... API calls ...
    
    // NEW: Send rejection notification
    rejectionNotificationService.addRejectionNotification(userId, {
      userId: userId,
      roomId: roomId,
      roomName: roomName,
      hostName: user?.name,
      timestamp: Date.now()
    });
    
    alert('Đã từ chối yêu cầu tham gia. Thông báo gửi đến người dùng.');
  }
}
```

---

### 3. 📝 UPDATED: `src/pages/Dashboard.tsx`

**Changes:**
1. Added import: `rejectionNotificationService`
2. Added new `useEffect` hook for polling rejection notifications (3-second interval)
3. When rejection is detected:
   - Creates notification in `notificationService`
   - Shows alert to participant
   - Removes rejection from localStorage

**Code Changes:**
```typescript
// Added import
import { rejectionNotificationService } from '../services/rejectionNotificationService';

// NEW: useEffect polling
useEffect(() => {
  if (!user?.id) return;

  const checkRejectionNotifications = () => {
    const rejections = rejectionNotificationService.getRejectionNotifications(user.id);
    
    rejections.forEach(rejection => {
      // Create notification
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

      // Show alert
      alert(`Host đã từ chối yêu cầu tham gia phòng "${rejection.roomName}"`);

      // Cleanup
      rejectionNotificationService.removeRejectionNotification(rejection.userId, rejection.roomId);
    });
  };

  checkRejectionNotifications();
  const interval = setInterval(checkRejectionNotifications, 3000);

  return () => clearInterval(interval);
}, [user?.id]);
```

---

### 4. 📝 UPDATED: `src/pages/MeetingRoom.tsx`

**Changes:**
1. Added import: `rejectionNotificationService`
2. Updated `handleDenyParticipant()` function in two places:
   - When API call succeeds (first attempt)
   - When API call succeeds after token refresh (retry)
3. Now sends rejection notification with room name

**Code Changes:**
```typescript
// Added import
import { rejectionNotificationService } from '../services/rejectionNotificationService';

// Updated handleDenyParticipant - Success case
if (denyResponse.ok) {
  console.log('Participant denied successfully');
  
  // NEW: Send rejection notification
  const roomName = targetRoom.name || targetRoom.title || roomId;
  rejectionNotificationService.addRejectionNotification(participantId, {
    userId: participantId,
    roomId: roomId,
    roomName: roomName,
    hostName: user?.name,
    timestamp: Date.now()
  });
  
  console.log(`✅ Rejection notification sent to user ${participantId}`);
  alert('Đã từ chối tham gia. Thông báo gửi đến người dùng.');
  skipFetchUntilRef.current = Date.now() + 3000;
}

// Similar change in retry success case
```

---

## 🔄 Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          HOST SIDE                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Header.tsx → "Từ chối" button click                             │
│     ↓                                                             │
│  handleRejectJoinRequest()                                       │
│     ├─ Call API: POST /v1/rooms/{roomId}/participants/{userId}/deny
│     ├─ On success:                                               │
│     │    - rejectionNotificationService.addRejectionNotification()
│     │    - Show alert: "Đã từ chối..."                          │
│     │    - Save to: localStorage['rejection_notifications_{userId}']
│     └─ On error: Show error alert                              │
│                                                                   │
│  Alternative (from MeetingRoom):                                 │
│  MeetingRoom.tsx → "✕" button click                              │
│     ↓                                                             │
│  handleDenyParticipant()                                         │
│     ├─ Call API: POST /v1/rooms/{actualRoomId}/participants/{participantId}/deny
│     ├─ On success:                                               │
│     │    - rejectionNotificationService.addRejectionNotification()
│     │    - Show alert: "Đã từ chối..."                          │
│     └─ On error: Show error alert                              │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

                            localStorage
                                  ↓
                    rejection_notifications_{userId}
                    └─ Array of rejection objects

┌─────────────────────────────────────────────────────────────────┐
│                      PARTICIPANT SIDE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Dashboard.tsx → useEffect (polling every 3 seconds)             │
│     ↓                                                             │
│  checkRejectionNotifications()                                   │
│     ├─ rejectionNotificationService.getRejectionNotifications()  │
│     ├─ Found rejection?                                          │
│     │    ├─ YES: notificationService.addNotification()           │
│     │    │       alert("Host đã từ chối...")                     │
│     │    │       rejectionNotificationService.removeRejection()  │
│     │    └─ NO: Do nothing, wait for next poll                   │
│     └─ Repeat every 3 seconds                                    │
│                                                                   │
│  UI Updates:                                                     │
│  - Notification dropdown shows new rejection with ❌ icon        │
│  - Status badge: "✕ Đã từ chối" (red)                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Structure

### Rejection Notification Object:
```typescript
interface RejectionNotificationData {
  userId: string;           // Who got rejected
  roomId: string;           // Which room
  roomName: string;         // Room display name
  hostName?: string;        // Who rejected
  timestamp: number;        // When it happened
}
```

### Stored in localStorage:
```json
{
  "rejection_notifications_user-123": [
    {
      "userId": "user-123",
      "roomId": "room-abc",
      "roomName": "Team Meeting",
      "hostName": "John Doe",
      "timestamp": 1704067200000
    }
  ]
}
```

### Converted to Notification:
```typescript
{
  id: "rejection_room-abc_1704067200000",
  type: "join_request",
  message: "❌ Host từ chối yêu cầu tham gia phòng \"Team Meeting\"",
  timestamp: "Vừa xong",
  read: false,
  userId: "user-123",
  roomId: "room-abc",
  status: "rejected"
}
```

---

## 🔧 Technical Details

### API Endpoints Used:
- **POST** `/v1/rooms/{roomId}/participants/{userId}/deny` (Primary)
- **PUT** `/v1/rooms/{roomId}/participants/{userId}/reject` (Fallback)

### Polling Strategy:
- **Interval:** 3 seconds (configurable in Dashboard.tsx)
- **Trigger:** Every time Dashboard mounts or user changes
- **Cleanup:** Automatic removal after notification created

### Storage Strategy:
- **Type:** Browser localStorage
- **Key Format:** `rejection_notifications_{userId}`
- **Auto-cleanup:** After notification is added to notificationService
- **Persistence:** Works offline, survives page refresh

### Error Handling:
- **Token Expiry:** Auto-retry with refresh token
- **API Failure:** Show error alert, restore waiting list
- **Network Error:** Retry on next poll cycle
- **Invalid Data:** Graceful degradation

---

## ✅ Benefits

1. **No Backend Changes:** Uses existing API endpoints
2. **Works Offline:** localStorage + polling approach
3. **No WebSocket:** Simple polling is sufficient
4. **User-specific:** Each user gets only their rejections
5. **Persistent:** Works even if browser closed
6. **Auto-cleanup:** No stale data accumulation
7. **Better UX:** Clear alert + notification
8. **Scalable:** Can handle multiple rooms/rejections

---

## 🚀 Deployment

### No Additional Configuration Needed
- Already integrated with existing services
- Uses localStorage (browser native)
- Uses existing API endpoints
- Polling interval easily configurable

### Environment Variables:
```env
VITE_API_URL=<existing>
```

---

## 📚 Related Documentation

See also:
- `docs/REJECTION_NOTIFICATION_FEATURE.md` - Detailed feature docs
- `docs/REJECTION_NOTIFICATION_TEST_CHECKLIST.md` - Testing guide
- `docs/JOIN_REQUEST_FEATURE.md` - Related join request feature

---

## 🧪 Testing Recommendation

Before merging:
1. ✅ Test Case 1: Reject from Header
2. ✅ Test Case 2: Reject from MeetingRoom
3. ✅ Test Case 3: Offline persistence
4. ✅ Test Case 4: Multiple rejections
5. ✅ Test Case 5: Error handling

See `REJECTION_NOTIFICATION_TEST_CHECKLIST.md` for detailed steps.

---

## 📞 Support

Questions or issues? Check:
- Console for debug logs (prefixed with ✅ or 🚫)
- localStorage via DevTools
- Network tab for API calls

---

**Created:** 2025-12-30  
**Feature:** Rejection Notifications  
**Status:** ✅ Ready for Testing
