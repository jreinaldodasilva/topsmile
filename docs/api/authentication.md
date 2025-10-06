# Authentication API

## POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "123",
      "email": "user@example.com",
      "role": "dentist",
      "clinicId": "456"
    }
  }
}
```
**Cookies:** Sets `accessToken` and `refreshToken` (httpOnly)

**Errors:**
- 400: Invalid credentials
- 429: Too many attempts

---

## POST /api/auth/refresh
Refresh access token.

**Request:** No body (uses refreshToken cookie)

**Response (200):**
```json
{
  "success": true
}
```
**Cookies:** Sets new `accessToken`

**Errors:**
- 401: Invalid refresh token

---

## POST /api/auth/logout
Logout and revoke tokens.

**Request:** No body

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```
**Cookies:** Clears all tokens

---

## GET /api/auth/me
Get current user.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "123",
    "email": "user@example.com",
    "role": "dentist",
    "name": "Dr. Smith"
  }
}
```

**Errors:**
- 401: Not authenticated
