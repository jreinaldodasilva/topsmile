# Failed Tests Report

This document lists the failed tests from the JUnit XML report (`junit-backend.xml`), including their causes.

## Summary
- Total tests: 265
- Total failures: 34
- Total errors: 0

## Failed Tests by Test Suite

### AppointmentService (5 failures)

1. **AppointmentService getAppointments should return appointments for clinic**
   - **Cause**: ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

2. **AppointmentService getAppointments should filter appointments by status**
   - **Cause**: ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

3. **AppointmentService getAppointmentsByProvider should return appointments for provider**
   - **Cause**: ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

4. **AppointmentService checkAvailability should return true for available time slot**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: true
     Received: [{"end": 2025-09-25T21:52:54.682Z, "start": 2025-09-25T20:52:54.682Z}]

5. **AppointmentService checkAvailability should return false for conflicting time slot**
   - **Cause**: ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

### Patient Portal Integration Tests (17 failures)

1. **Patient Portal Integration Tests should get patient user info with valid token**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 401

2. **Patient Portal Integration Tests should get upcoming appointments for patient**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 401

3. **Patient Portal Integration Tests should logout patient user successfully**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 401

4. **Patient Portal Integration Tests should handle appointment booking with valid data**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 201
     Received: 401

5. **Patient Portal Integration Tests should handle appointment cancellation**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 401

6. **Patient Portal Integration Tests should handle patient profile updates**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 401

7. **Patient Portal Integration Tests should handle password reset request**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 404

8. **Patient Portal Integration Tests should handle rate limiting on auth endpoints**
   - **Cause**: Error: expect(received).toBeGreaterThan(expected)
     Expected: > 0
     Received: 0

9. **Patient Portal Integration Tests should handle concurrent session management**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: 200
     Received: 401

10. **Patient Portal Integration Tests should handle appointment rescheduling**
    - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
      Expected: 200
      Received: 401

11. **Patient Portal Integration Tests should handle patient medical history retrieval**
    - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
      Expected: 200
      Received: 401

12. **Patient Portal Integration Tests should handle appointment type listing**
    - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
      Expected: 200
      Received: 401

13. **Patient Portal Integration Tests should handle provider availability checking**
    - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
      Expected: 200
      Received: 401

14. **Patient Portal Integration Tests should handle error responses gracefully**
    - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
      Expected: 404
      Received: 401

15. **Patient Portal Integration Tests should handle CORS headers properly**
    - **Cause**: Error: expect(received).toBeDefined()
      Received: undefined

16. **Patient Portal Integration Tests should handle large request payloads**
    - **Cause**: Error: expect(received).toContain(expected) // indexOf
      Expected value: 401
      Received array: [200, 201, 400, 413]

17. **Patient Portal Integration Tests should handle database connection errors gracefully**
    - **Cause**: Error: expect(received).toContain(expected) // indexOf
      Expected value: 401
      Received array: [200, 500]

### Auth Routes Integration (7 failures)

1. **Auth Routes Integration POST /api/auth/register should register a new user successfully**
   - **Cause**: Error: expect(received).toBeDefined()
     Received: undefined

2. **Auth Routes Integration POST /api/auth/register should return 400 for duplicate email**
   - **Cause**: expected 400 "Bad Request", got 409 "Conflict"

3. **Auth Routes Integration POST /api/auth/login should login user successfully**
   - **Cause**: Error: expect(received).toBeDefined()
     Received: undefined

4. **Auth Routes Integration POST /api/auth/login should return 401 for invalid credentials**
   - **Cause**: Error: expect(received).toBe(expected) // Object.is equality
     Expected: false
     Received: undefined

5. **Auth Routes Integration POST /api/auth/logout should logout user successfully**
   - **Cause**: expected 200 "OK", got 500 "Internal Server Error"

6. **Auth Routes Integration POST /api/auth/refresh should refresh access token successfully**
   - **Cause**: expected 200 "OK", got 500 "Internal Server Error"

7. **Auth Routes Integration POST /api/auth/refresh should return 401 for invalid refresh token**
   - **Cause**: expected 401 "Unauthorized", got 500 "Internal Server Error"

### Patient Auth Middleware (5 failures)

1. **Patient Auth Middleware authenticatePatient should authenticate valid patient token from cookies**
   - **Cause**: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
     Expected: "valid-token"

2. **Patient Auth Middleware authenticatePatient should authenticate valid patient token from Authorization header**
   - **Cause**: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
     Expected: "valid-token"

3. **Patient Auth Middleware authenticatePatient should return 401 for invalid token**
   - **Cause**: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
     Expected: "patientAccessToken"

4. **Patient Auth Middleware authenticatePatient should return 401 for inactive patient user**
   - **Cause**: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
     Expected: ObjectContaining {"message": "Conta de paciente inativa", "success": false}
     Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token inválido", "success": false}

5. **Patient Auth Middleware requirePatientEmailVerification should return 401 for missing patient user**
   - **Cause**: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
     Expected: 401
     Received: 500
