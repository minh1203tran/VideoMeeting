# Testing Checklist: Rejection Notifications

## ✅ Pre-Testing Setup

- [ ] Mở 2 browser windows hoặc 2 tabs (incognito)
- [ ] Window 1: Đăng nhập với tài khoản Host
- [ ] Window 2: Đăng nhập với tài khoản Participant (khác)
- [ ] Đảm bảo API backend đang chạy

## 🧪 Test Case 1: Từ Chối Từ Header (Notification Dropdown)

### Steps:
1. **Setup:**
   - Host: Ở trang Dashboard
   - Participant: Ở trang Dashboard
   - Participant: Copy room code từ bất kỳ room nào

2. **Participant Join:**
   - Participant: Nhập room code → Click "Tham gia"
   - Participant: Thấy alert "Bạn đã được thêm vào danh sách chờ duyệt"
   - Participant: Nhận được notification trong notification service

3. **Host Reject:**
   - Host: Nhấn icon 🔔 (Bell icon)
   - Host: Thấy notification: "[Participant Name] đã yêu cầu tham gia phòng..."
   - Host: Click nút "Từ chối" (red button with X)
   - Host: Thấy alert "Đã từ chối yêu cầu tham gia. Thông báo gửi đến người dùng."
   - Host: Notification status thay đổi thành "✕ Đã từ chối"

4. **Participant Receives Rejection:**
   - **Wait 3-5 seconds** (polling interval)
   - Participant: Thấy alert "Host đã từ chối yêu cầu tham gia phòng..."
   - Participant: Kiểm tra Notification Dropdown (Bell icon)
   - Participant: Thấy notification mới với ❌ "Host từ chối yêu cầu tham gia"
   - Participant: Notification status = "rejected"

### Expected Results:
- ✅ Host API call thành công (200 OK)
- ✅ Participant nhận được rejection notification
- ✅ Alert hiển thị cho participant
- ✅ Notification trong dropdown hiển thị status "rejected"

---

## 🧪 Test Case 2: Từ Chối Từ Phòng Họp

### Steps:
1. **Setup:**
   - Host: Tạo instant meeting (Start Meeting)
   - Host: Đợi trang MeetingRoom load
   - Participant: Join cùng phòng

2. **Wait for Waiting List:**
   - Host: Scroll xuống "Chờ duyệt" section
   - Host: Thấy Participant name trong danh sách
   - Participant: Thấy waiting status

3. **Host Deny from Meeting Room:**
   - Host: Click nút "✕" (deny button) next to participant name
   - Host: Thấy alert "Đã từ chối tham gia. Thông báo gửi đến người dùng."
   - Host: Participant được xóa khỏi waiting list

4. **Participant Receives Rejection:**
   - **Wait 3-5 seconds**
   - Participant: Thấy alert "Host đã từ chối yêu cầu tham gia phòng..."
   - Participant: Thấy notification mới với rejection message

### Expected Results:
- ✅ Participant removed from waiting list immediately
- ✅ API call thành công
- ✅ Participant nhận được rejection notification
- ✅ Participant không thể join phòng

---

## 🧪 Test Case 3: Rejection Notification Persistence

### Steps:
1. **Host Reject while Participant Offline:**
   - Participant: Đóng tab hoặc browser
   - Host: Reject participant từ Header
   - Participant: Mở lại tab sau 1-2 phút

2. **Check Persistence:**
   - Participant: Thấy notification vẫn còn trong notification dropdown
   - Participant: Rejection notification được lưu trong localStorage

### Expected Results:
- ✅ Notification persist ngay cả khi offline
- ✅ Có thể thấy notification khi quay lại
- ✅ localStorage key `rejection_notifications_{userId}` có data

---

## 🧪 Test Case 4: Multiple Rejections

### Steps:
1. **First Rejection:**
   - Participant A: Join room X
   - Host: Reject Participant A

2. **Second Rejection (Same Room):**
   - Participant B: Join room X
   - Host: Reject Participant B

3. **Different Room:**
   - Participant A (lần 2): Join room Y
   - Host: Reject Participant A again

### Expected Results:
- ✅ Mỗi rejection tạo notification riêng
- ✅ Notifications không bị mix up
- ✅ Mỗi notification có room name đúng
- ✅ Không bị duplicate notifications

---

## 🧪 Test Case 5: API Error Handling

### Steps:
1. **Token Expiry Simulation:**
   - Clear localStorage authToken
   - Host: Try to reject participant
   - Host: Should see error alert

2. **Invalid Room ID:**
   - Host: Try with malformed room ID
   - Should fail gracefully

3. **Participant Not Found:**
   - Host: Join room
   - Host: Close connection (simulating participant left)
   - Host: Try to reject participant
   - Should handle gracefully

### Expected Results:
- ✅ Alert showing proper error message
- ✅ Waiting list restored if API fails
- ✅ No duplicate rejections sent
- ✅ Proper error logging in console

---

## 🔍 Browser DevTools Checks

### Console:
```javascript
// Check rejection notifications
localStorage.getItem('rejection_notifications_{userId}')
// Should return JSON array with rejection data

// Check notifications
localStorage.getItem('notifications')
// Should include rejection notifications
```

### Network Tab:
- [ ] POST `/v1/rooms/{roomId}/participants/{userId}/deny` - 200 OK
- [ ] Or PUT `/v1/rooms/{roomId}/participants/{userId}/reject` - 200 OK

### Storage Tab:
- [ ] Key: `rejection_notifications_{userId}` exists after rejection
- [ ] Data contains `{ userId, roomId, roomName, hostName, timestamp }`
- [ ] Removed after notification processed

---

## ⏱️ Timing Tests

### 3-Second Polling:
- [ ] Rejection notification appears within 3-5 seconds
- [ ] No excessive polling (check Network tab for frequency)
- [ ] CPU usage normal

### Cleanup:
- [ ] Rejection notification removed from localStorage after processing
- [ ] No memory leaks
- [ ] Polling stops when component unmounts

---

## 🎯 Edge Cases

- [ ] **Rapid rejections:** Host rejects multiple people quickly
- [ ] **Network latency:** Slow network - should still work
- [ ] **Session expired:** Token refresh + retry
- [ ] **Browser offline:** Notification saved, shows when back online
- [ ] **Same person, multiple rooms:** Different room IDs tracked correctly
- [ ] **Duplicate rejection:** Same person rejected twice - should show both

---

## ✨ UX/UI Checks

- [ ] Alert message clear and actionable
- [ ] Notification color/icon appropriate (❌ for rejected)
- [ ] Notification disappears from list after reading
- [ ] No lag in UI when polling
- [ ] All text properly translated (Vietnamese)

---

## 📋 Final Checklist

- [ ] All test cases passed
- [ ] No console errors
- [ ] No TypeScript compilation errors
- [ ] Network requests in Network tab look correct
- [ ] localStorage data clean after testing
- [ ] Performance acceptable (no memory leaks)
- [ ] Code follows project conventions
- [ ] Documentation updated

---

## 🐛 Known Issues (if any)

- [ ] Issue #1: ...
- [ ] Issue #2: ...

---

## 📝 Notes

- Polling interval: 3 seconds (can adjust in Dashboard.tsx)
- Rejection notification auto-cleanup after processing
- Uses localStorage for persistence (no backend changes needed)
- Works offline and online

---

**Test Date:** ___________  
**Tester Name:** ___________  
**Result:** ☐ PASS ☐ FAIL  
**Comments:** ___________
