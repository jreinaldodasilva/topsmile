# Failed Tests Report - Backend (05)

This document lists the failed tests from the JUnit XML report (`backend/reports/junit-backend.xml`), including the test name and failure cause.

Total failed tests: 29

## Auth Routes Integration (7 failures)

1. **POST /api/auth/register should register a new user successfully**
   - Cause: expect(received).toBeDefined() Received: undefined

2. **POST /api/auth/register should return 400 for duplicate email**
   - Cause: expected 400 "Bad Request", got 409 "Conflict"

3. **POST /api/auth/login should login user successfully**
   - Cause: expect(received).toBeDefined() Received: undefined

4. **POST /api/auth/login should return 401 for invalid credentials**
   - Cause: expect(received).toBe(expected) // Object.is equality Expected: false Received: undefined

5. **POST /api/auth/logout should logout user successfully**
   - Cause: expected 200 "OK", got 500 "Internal Server Error"

6. **POST /api/auth/refresh should refresh access token successfully**
   - Cause: expected 200 "OK", got 500 "Internal Server Error"

7. **POST /api/auth/refresh should return 401 for invalid refresh token**
   - Cause: expected 401 "Unauthorized", got 500 "Internal Server Error"

## Patient Portal Integration Tests (17 failures)

1. **should get patient user info with valid token**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

2. **should get upcoming appointments for patient**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

3. **should logout patient user successfully**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

4. **should handle appointment booking with valid data**
   - Cause: expect(received).toBe(expected) Expected: 201 Received: 401

5. **should handle appointment cancellation**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

6. **should handle patient profile updates**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

7. **should handle password reset request**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 404

8. **should handle rate limiting on auth endpoints**
   - Cause: expect(received).toBeGreaterThan(expected) Expected: > 0 Received: 0

9. **should handle concurrent session management**
   - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

10. **should handle appointment rescheduling**
    - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

11. **should handle patient medical history retrieval**
    - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

12. **should handle appointment type listing**
    - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

13. **should handle provider availability checking**
    - Cause: expect(received).toBe(expected) Expected: 200 Received: 401

14. **should handle error responses gracefully**
    - Cause: expect(received).toBe(expected) Expected: 404 Received: 401

15. **should handle CORS headers properly**
    - Cause: expect(received).toBeDefined() Received: undefined

16. **should handle large request payloads**
    - Cause: expect(received).toContain(expected) Expected value: 401 Received array: [200, 201, 400, 413]

17. **should handle database connection errors gracefully**
    - Cause: expect(received).toContain(expected) Expected value: 401 Received array: [200, 500]

## Patient Auth Middleware (5 failures)

1. **authenticatePatient should authenticate valid patient token from cookies**
   - Cause: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "valid-token"

2. **authenticatePatient should authenticate valid patient token from Authorization header**
   - Cause: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "valid-token"

3. **authenticatePatient should return 401 for invalid token**
   - Cause: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "patientAccessToken"

4. **authenticatePatient should return 401 for inactive patient user**
   - Cause: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: ObjectContaining {"message": "Conta de paciente inativa", "success": false} Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token inválido", "success": false}

5. **requirePatientEmailVerification should return 401 for missing patient user**
   - Cause: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: 401 Received: 500
