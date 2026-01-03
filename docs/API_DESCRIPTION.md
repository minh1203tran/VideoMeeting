# Complete API Testing Guide - Postman

Hướng dẫn toàn diện test tất cả API endpoints của Meeting Assistant.

## 📋 Setup

### Prerequisites
1. Server chạy: `make run`
2. Database đã migrate
3. Postman cài đặt
4. Tối thiểu 2 user accounts: 1 host, 1 participant

### Postman Environment Variables

```
BASE_URL = http://localhost:8080/v1
HOST_TOKEN = <token của host sau login>
PARTICIPANT_TOKEN = <token của participant sau login>
ROOM_ID = <được set tự động sau tạo room>
PARTICIPANT_ID = <được set tự động sau join>
```

---

## 🔐 Authentication Endpoints

### 1. Google OAuth Login (Redirect)
**Path:** `GET /auth/google/login`  
**Auth:** ❌ Not required  
**Description:** Initiate Google OAuth login, redirects to Google consent screen

---

### 2. Google OAuth Callback
**Path:** `GET /auth/google/callback?code=<auth_code>&state=<state>`  
**Auth:** ❌ Not required  
**Description:** Handle Google OAuth callback, returns tokens

**Success Response (200):**
```json
{
  "access_token": "eyJhbGc...",
  "refresh_token": "refresh_token_xxx",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://..."
  }
}
```

**Action:** Set `access_token` → `HOST_TOKEN` or `PARTICIPANT_TOKEN`

---

### 3. Refresh Token
**Path:** `POST /auth/refresh`  
**Auth:** ❌ Not required  
**Description:** Refresh expired access token

**Request Body:**
```json
{
  "refresh_token": "{{refresh_token}}"
}
```

**Success Response (200):**
```json
{
  "access_token": "new_token_xxx",
  "expires_in": 3600
}
```

---

### 4. Get Current User Info
**Path:** `GET /auth/me`  
**Auth:** ✅ Required (Bearer token)  
**Description:** Get authenticated user information

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json
```

**Success Response (200):**
```json
{
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://..."
  }
}
```

---

### 5. Logout
**Path:** `POST /auth/logout`  
**Auth:** ✅ Required (Bearer token)  
**Description:** Logout and invalidate token

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Success Response (200):**
```json
{
  "message": "logged out successfully"
}
```

---

## 🏢 Room Management Endpoints

### 1. Create Room
**Path:** `POST /rooms`  
**Auth:** ✅ Required  
**Description:** Host creates a new meeting room

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Team Meeting",
  "description": "Weekly sync",
  "type": "public",
  "max_participants": 10,
  "settings": {
    "recording_enabled": true,
    "chat_enabled": true
  },
  "scheduled_start_time": "2025-12-04T10:00:00Z",
  "scheduled_end_time": "2025-12-04T11:00:00Z"
}
```

**Success Response (201):**
```json
{
  "room": {
    "id": "room-uuid",
    "name": "Team Meeting",
    "status": "scheduled",
    "host_id": "host-uuid",
    "type": "public",
    "max_participants": 10,
    "current_participants": 0
  },
  "livekit_token": "eyJhbGc...",
  "livekit_url": "ws://localhost:7880"
}
```

**Action:** Set `room.id` → `ROOM_ID`

---

### 2. List All Rooms
**Path:** `GET /rooms`  
**Auth:** ✅ Required  
**Description:** Get list of rooms user created or joined

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Query Parameters (Optional):**
- `status=scheduled|active|ended` - Filter by status
- `page=1` - Pagination (default: 1)
- `limit=10` - Items per page (default: 10)

**Success Response (200):**
```json
{
  "rooms": [
    {
      "id": "room-uuid",
      "name": "Team Meeting",
      "status": "active",
      "host_id": "host-uuid",
      "current_participants": 3,
      "max_participants": 10,
      "created_at": "2025-12-03T09:00:00Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

---

### 3. Get Room Details
**Path:** `GET /rooms/{{ROOM_ID}}`  
**Auth:** ✅ Required  
**Description:** Get detailed information about a specific room

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Success Response (200):**
```json
{
  "room": {
    "id": "room-uuid",
    "name": "Team Meeting",
    "description": "Weekly sync",
    "status": "active",
    "host_id": "host-uuid",
    "type": "public",
    "max_participants": 10,
    "current_participants": 3,
    "settings": {
      "recording_enabled": true,
      "chat_enabled": true
    },
    "created_at": "2025-12-03T09:00:00Z",
    "started_at": "2025-12-04T10:00:00Z"
  }
}
```

---

### 4. End Room
**Path:** `PATCH /rooms/{{ROOM_ID}}`  
**Auth:** ✅ Required (Host only)  
**Description:** End the meeting room (change status to 'ended')

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "ended"
}
```

**Success Response (200):**
```json
{
  "message": "room ended successfully",
  "room": {
    "id": "room-uuid",
    "status": "ended",
    "ended_at": "2025-12-04T11:00:00Z"
  }
}
```

---

## 👥 Participant Management Endpoints

### 1. Join Room (Create Participant)
**Path:** `POST /rooms/{{ROOM_ID}}/participants`  
**Auth:** ✅ Required  
**Description:** Join room as participant or host

**Headers:**
```
Authorization: Bearer {{PARTICIPANT_TOKEN}}
Content-Type: application/json
```

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "participant": {
    "id": "participant-uuid",
    "room_id": "room-uuid",
    "user_id": "user-uuid",
    "status": "joined",
    "role": "participant",
    "joined_at": "2025-12-04T10:00:00Z"
  },
  "livekit_token": "eyJhbGc...",
  "livekit_url": "ws://localhost:7880"
}
```

**Action:** Set `participant.id` → `PARTICIPANT_ID`

---

### 2. Leave Room
**Path:** `DELETE /rooms/{{ROOM_ID}}/participants/me`  
**Auth:** ✅ Required  
**Description:** Leave room and remove own participant record

**Headers:**
```
Authorization: Bearer {{PARTICIPANT_TOKEN}}
```

**Success Response (200):**
```json
{
  "message": "left room successfully"
}
```

---

### 3. List All Participants
**Path:** `GET /rooms/{{ROOM_ID}}/participants`  
**Auth:** ✅ Required  
**Description:** Get all participants in room

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Success Response (200):**
```json
{
  "participants": [
    {
      "id": "host-participant-uuid",
      "user_id": "host-uuid",
      "room_id": "room-uuid",
      "user": {
        "id": "host-uuid",
        "name": "Host Name",
        "email": "host@example.com",
        "avatar_url": "https://..."
      },
      "status": "joined",
      "role": "host",
      "joined_at": "2025-12-04T10:00:00Z"
    },
    {
      "id": "participant-uuid",
      "user_id": "user-uuid",
      "room_id": "room-uuid",
      "user": {
        "id": "user-uuid",
        "name": "Participant Name",
        "email": "participant@example.com",
        "avatar_url": "https://..."
      },
      "status": "joined",
      "role": "participant",
      "joined_at": "2025-12-04T10:05:00Z"
    }
  ],
  "total": 2
}
```

---

### 4. Get Waiting Participants
**Path:** `GET /rooms/{{ROOM_ID}}/participants/waiting`  
**Auth:** ✅ Required (Host only)  
**Description:** Get list of participants waiting for admission

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Success Response (200):**
```json
{
  "participants": [
    {
      "id": "participant-uuid",
      "user_id": "user-uuid",
      "room_id": "room-uuid",
      "user": {
        "id": "user-uuid",
        "name": "Waiting User",
        "email": "waiting@example.com",
        "avatar_url": "https://..."
      },
      "status": "waiting",
      "role": "participant",
      "created_at": "2025-12-04T10:05:00Z"
    }
  ],
  "total": 1
}
```

**Error (403 Forbidden):** If not host
```json
{
  "error": "forbidden",
  "message": "only room host can view waiting list"
}
```

---

### 5. Admit Participant
**Path:** `POST /rooms/{{ROOM_ID}}/participants/{{PARTICIPANT_ID}}/admit`  
**Auth:** ✅ Required (Host only)  
**Description:** Admit participant from waiting room to join

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Success Response (200):**
```json
{
  "message": "participant admitted successfully",
  "participant": {
    "id": "participant-uuid",
    "status": "joined",
    "joined_at": "2025-12-04T10:06:00Z"
  }
}
```

**Error (403 Forbidden):** If not host
```json
{
  "error": "forbidden",
  "message": "only room host can admit participants"
}
```

**Error (409 Conflict):** If room full
```json
{
  "error": "room_full",
  "message": "cannot admit, room is at maximum capacity"
}
```

---

### 6. Deny Participant
**Path:** `POST /rooms/{{ROOM_ID}}/participants/{{PARTICIPANT_ID}}/deny`  
**Auth:** ✅ Required (Host only)  
**Description:** Deny participant from joining room

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "Room is full"
}
```

**Success Response (200):**
```json
{
  "message": "participant denied successfully",
  "participant": {
    "id": "participant-uuid",
    "status": "denied"
  }
}
```

---

### 7. Remove Participant
**Path:** `DELETE /rooms/{{ROOM_ID}}/participants/{{PARTICIPANT_ID}}`  
**Auth:** ✅ Required (Host only)  
**Description:** Remove participant from room (kick out)

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
```

**Success Response (200):**
```json
{
  "message": "participant removed successfully"
}
```

---

### 8. Transfer Host
**Path:** `PATCH /rooms/{{ROOM_ID}}/host`  
**Auth:** ✅ Required (Current host only)  
**Description:** Transfer host role to another participant

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json
```

**Request Body:**
```json
{
  "new_host_id": "new-host-uuid"
}
```

**Success Response (200):**
```json
{
  "message": "host transferred successfully",
  "new_host_id": "new-host-uuid"
}
```

---

## 🤖 AI Processing Endpoints

### 1. Process Meeting with AI
**Path:** `POST /meetings/{{ROOM_ID}}/process-ai`  
**Auth:** ✅ Required  
**Description:** Trigger AI processing on completed meeting

**Headers:**
```
Authorization: Bearer {{HOST_TOKEN}}
Content-Type: application/json
```

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
  "message": "AI processing initiated",
  "ai_job": {
    "id": "job-uuid",
    "meeting_id": "room-uuid",
    "status": "submitted",
    "external_job_id": "aai_xxxxxx"
  }
}
```

---

## 🪝 Webhook Endpoints (No Auth Required)

### 1. LiveKit Webhook
**Path:** `POST /webhooks/livekit`  
**Auth:** ❌ Not required (signature verified)  
**Description:** Receive LiveKit events (room_finished, recording_finished, etc)

**Supported Events:**
- `participant_joined` - User joined room
- `participant_left` - User left room
- `room_started` - Room started
- `room_finished` - Room ended
- `recording_finished` - Recording ready for processing

---

### 2. AssemblyAI Webhook
**Path:** `POST /webhooks/assemblyai`  
**Auth:** ❌ Not required (signature verified)  
**Description:** Receive transcript from AssemblyAI

**Triggered by:** AssemblyAI after processing completes

---

## 🏥 Health Check Endpoint

### 1. Health Status
**Path:** `GET /health`  
**Auth:** ❌ Not required  
**Description:** Check API server health

**Success Response (200):**
```json
{
  "status": "ok",
  "environment": "production"
}
```

---

## 📊 Postman Collection Structure

```
📁 Meeting Assistant API
  📁 Health & Info
    └─ GET Health Check

  📁 Authentication
    ├─ GET Google Login (redirect)
    ├─ GET Google Callback (with code param)
    ├─ POST Refresh Token
    ├─ GET Get Current User
    └─ POST Logout

  📁 Room Management
    ├─ POST Create Room
    ├─ GET List Rooms
    ├─ GET Get Room Details
    └─ PATCH End Room

  📁 Participant Management
    ├─ POST Join Room
    ├─ DELETE Leave Room
    ├─ GET List Participants
    ├─ GET Get Waiting Participants
    ├─ POST Admit Participant
    ├─ POST Deny Participant
    ├─ DELETE Remove Participant
    └─ PATCH Transfer Host

  📁 AI Processing
    └─ POST Process Meeting with AI

  📁 Webhooks (Testing)
    ├─ POST LiveKit Webhook (test)
    └─ POST AssemblyAI Webhook (test)
```

---

## 🧪 End-to-End Test Scenario

**Timeline:**
1. ✅ Health check server
2. ✅ Host Google login
3. ✅ Participant Google login
4. ✅ Host gets current user info
5. ✅ Host creates room
6. ✅ Participant joins room
7. ✅ Host lists all participants
8. ✅ Host gets waiting participants (if any)
9. ✅ Host admits participant
10. ✅ Host lists participants again (verify admission)
11. ✅ Host ends room
12. ✅ Host trigger AI processing
13. ✅ Host gets room details (verify ended status)

---

## ❌ Error Test Cases

### 1. Unauthorized Access
```
GET /rooms/{{ROOM_ID}}/participants/waiting
Headers: (no auth)

Response: 401 Unauthorized
```

### 2. Forbidden - Non-Host
```
POST /rooms/{{ROOM_ID}}/participants/{{PARTICIPANT_ID}}/admit
Headers: Authorization: Bearer {{PARTICIPANT_TOKEN}}

Response: 403 Forbidden
```

### 3. Room Not Found
```
GET /rooms/invalid-uuid
Headers: Authorization: Bearer {{HOST_TOKEN}}

Response: 404 Not Found
```

### 4. Invalid Room Status
```
POST /rooms/{{ENDED_ROOM_ID}}/participants
Headers: Authorization: Bearer {{PARTICIPANT_TOKEN}}

Response: 409 Conflict - "room already ended"
```

### 5. Room Full
```
POST /rooms/{{FULL_ROOM_ID}}/participants/{{WAITING_ID}}/admit
Headers: Authorization: Bearer {{HOST_TOKEN}}

Response: 409 Conflict - "room is full"
```

---

## 🔍 Important Notes

1. **Bearer Token Format:** `Authorization: Bearer <token>`
2. **Content-Type:** Always `application/json` for POST/PATCH requests
3. **Token Expiration:** Access tokens typically expire after ~1 hour
4. **ROOM_ID Format:** Must be valid UUID
5. **PARTICIPANT_ID Format:** Must be valid UUID
6. **Host Privileges:** Only room host can admit/deny/remove participants

---

## 📱 Testing Tips

- Use Postman **Environment Variables** to store tokens and IDs
- Use **Pre-request Scripts** to auto-populate dynamic values
- Use **Tests** tab to validate response codes and data
- Use **Collection Runner** to run full test suite at once
- Check **Response** tab for detailed error messages
- Use **Console** (bottom left) to debug issues
