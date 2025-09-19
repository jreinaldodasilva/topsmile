# Backend Failed Tests

This document lists the failed tests from the backend test suite, extracted from `backend/reports/junit-backend.xml`. Each failed test includes the test name and the failure cause.

## Test Suite: Patient Routes Integration Tests (2 failures)

- **Test:** Patient Routes Integration Tests POST /api/patients should return 400 for duplicate phone in same clinic  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 400
Received: 201

- **Test:** Patient Routes Integration Tests GET /api/patients should search patients by phone  
  **Cause:** Error: expect(received).toHaveLength(expected)

Expected length: 1
Received length: 0
Received array:  []

## Test Suite: Patient Portal Integration Tests (21 failures)

- **Test:** Patient Portal Integration Tests should login patient user and return access token  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should get patient user info with valid token  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should get upcoming appointments for patient  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle invalid login credentials  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should logout patient user successfully  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should reject requests with invalid token  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should reject requests without token  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle appointment booking with valid data  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle appointment cancellation  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle patient profile updates  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle password reset request  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle rate limiting on auth endpoints  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle concurrent session management  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle appointment rescheduling  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle patient medical history retrieval  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle appointment type listing  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle provider availability checking  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle error responses gracefully  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle CORS headers properly  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle large request payloads  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

- **Test:** Patient Portal Integration Tests should handle database connection errors gracefully  
  **Cause:** TypeError: Cannot read properties of undefined (reading 'accessToken')

## Test Suite: Auth Routes Integration (2 failures)

- **Test:** Auth Routes Integration POST /api/auth/logout should logout user successfully  
  **Cause:** Error: expected 200 "OK", got 500 "Internal Server Error"

- **Test:** Auth Routes Integration POST /api/auth/refresh should refresh access token successfully  
  **Cause:** Error: expected 200 "OK", got 401 "Unauthorized"
