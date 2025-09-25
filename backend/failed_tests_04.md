# Failed Tests Report

This document lists the failed tests from the JUnit XML report `backend/reports/junit-backend.xml`, including the test names and their failure causes.

## Auth Routes Integration (7 failures)

- **POST /api/auth/register should register a new user successfully**: expect(received).toBeDefined() Received: undefined
- **POST /api/auth/register should return 400 for duplicate email**: expected 400 "Bad Request", got 409 "Conflict"
- **POST /api/auth/login should login user successfully**: expect(received).toBeDefined() Received: undefined
- **POST /api/auth/login should return 401 for invalid credentials**: expect(received).toBe(expected) // Object.is equality Expected: false Received: undefined
- **POST /api/auth/logout should logout user successfully**: expected 200 "OK", got 500 "Internal Server Error"
- **POST /api/auth/refresh should refresh access token successfully**: expected 200 "OK", got 500 "Internal Server Error"
- **POST /api/auth/refresh should return 401 for invalid refresh token**: expected 401 "Unauthorized", got 500 "Internal Server Error"

## Patient Portal Integration Tests (16 failures)

- **should get patient user info with valid token**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should get upcoming appointments for patient**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should logout patient user successfully**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle appointment booking with valid data**: expect(received).toBe(expected) // Object.is equality Expected: 201 Received: 401
- **should handle appointment cancellation**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle patient profile updates**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle rate limiting on auth endpoints**: expect(received).toBeGreaterThan(expected) Expected: > 0 Received: 0
- **should handle concurrent session management**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle appointment rescheduling**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle patient medical history retrieval**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle appointment type listing**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle provider availability checking**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **should handle error responses gracefully**: expect(received).toBe(expected) // Object.is equality Expected: 404 Received: 401
- **should handle CORS headers properly**: expect(received).toBeDefined() Received: undefined
- **should handle large request payloads**: expect(received).toContain(expected) // indexOf Expected value: 401 Received array: [200, 201, 400, 413]
- **should handle database connection errors gracefully**: expect(received).toContain(expected) // indexOf Expected value: 401 Received array: [200, 500]

## Patient Auth Middleware (5 failures)

- **authenticatePatient should authenticate valid patient token from cookies**: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "valid-token" Number of calls: 0
- **authenticatePatient should authenticate valid patient token from Authorization header**: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "valid-token" Number of calls: 0
- **authenticatePatient should return 401 for invalid token**: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: "patientAccessToken" Number of calls: 0
- **authenticatePatient should return 401 for inactive patient user**: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: ObjectContaining {"message": "Conta de paciente inativa", "success": false} Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token inválido", "success": false}
- **requirePatientEmailVerification should return 401 for missing patient user**: expect(jest.fn()).toHaveBeenCalledWith(...expected) Expected: 401 Received: 500

## Patient Routes Integration Tests (20 failures)

- **POST /api/patients should create a patient successfully**: expect(received).toBe(expected) // Object.is equality Expected: 201 Received: 401
- **POST /api/patients should return 400 for invalid data**: expect(received).toBe(expected) // Object.is equality Expected: 400 Received: 401
- **POST /api/patients should return 400 for duplicate phone in same clinic**: expect(received).toBe(expected) // Object.is equality Expected: 201 Received: 401
- **POST /api/patients should create patient with minimal required data**: expect(received).toBe(expected) // Object.is equality Expected: 201 Received: 401
- **GET /api/patients should return paginated list of patients**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients should search patients by name**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients should search patients by phone**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients should search patients by email**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients should filter by status**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients should paginate results**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients should sort results**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **GET /api/patients/stats should return patient statistics**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **PATCH /api/patients/:id should update patient successfully**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **PATCH /api/patients/:id should return 404 for non-existent patient**: expect(received).toBe(expected) // Object.is equality Expected: 404 Received: 401
- **PATCH /api/patients/:id/medical-history should update medical history successfully**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **PATCH /api/patients/:id/medical-history should update partial medical history**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **PATCH /api/patients/:id/reactivate should reactivate patient successfully**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **PATCH /api/patients/:id/reactivate should return 404 for active patient**: expect(received).toBe(expected) // Object.is equality Expected: 404 Received: 401
- **DELETE /api/patients/:id should delete patient successfully**: expect(received).toBe(expected) // Object.is equality Expected: 200 Received: 401
- **DELETE /api/patients/:id should return 404 for non-existent patient**: expect(received).toBe(expected) // Object.is equality Expected: 404 Received: 401

**Total Failures:** 48
