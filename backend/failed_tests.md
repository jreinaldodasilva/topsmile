# Failed Tests Report

This document lists the failed tests from the JUnit backend test report, grouped by test suite.

## Patient Auth Routes Integration (15 failures)

- **Test:** POST /api/patient-auth/register should register a new patient user successfully
  **Failure:** Error: expected 201 "Created", got 400 "Bad Request"

- **Test:** POST /api/patient-auth/register should register with existing patient ID
  **Failure:** ValidationError: Patient validation failed: lastName: Sobrenome é obrigatório, firstName: Nome é obrigatório, phone: Telefone deve estar em formato brasileiro válido

- **Test:** POST /api/patient-auth/register should return 400 for duplicate email
  **Failure:** Error: expected 201 "Created", got 400 "Bad Request"

- **Test:** POST /api/patient-auth/login should login with correct credentials
  **Failure:** TypeError: Cannot read properties of undefined (reading 'patientUser')

- **Test:** POST /api/patient-auth/login should return 400 for missing credentials
  **Failure:** TypeError: Cannot read properties of undefined (reading 'patientUser')

- **Test:** POST /api/patient-auth/login should return 401 for invalid credentials
  **Failure:** TypeError: Cannot read properties of undefined (reading 'patientUser')

- **Test:** POST /api/patient-auth/refresh should refresh access token with valid refresh token
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** POST /api/patient-auth/refresh should return 401 for missing refresh token
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** GET /api/patient-auth/me should return current patient profile
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** GET /api/patient-auth/me should return 401 for missing token
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** PATCH /api/patient-auth/profile should update patient profile successfully
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** PATCH /api/patient-auth/profile should return 400 for invalid data
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** PATCH /api/patient-auth/change-password should change password successfully
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** PATCH /api/patient-auth/change-password should return 400 for weak new password
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

- **Test:** POST /api/patient-auth/logout should logout successfully
  **Failure:** TypeError: Cannot read properties of undefined (reading 'find')

## Patient Portal Integration Tests (16 failures)

- **Test:** should get patient user info with valid token
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should get upcoming appointments for patient
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should logout patient user successfully
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle appointment booking with valid data
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 201
Received: 401

- **Test:** should handle appointment cancellation
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle patient profile updates
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle password reset request
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 404

- **Test:** should handle concurrent session management
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 429

- **Test:** should handle appointment rescheduling
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle patient medical history retrieval
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle appointment type listing
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle provider availability checking
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401

- **Test:** should handle error responses gracefully
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: 404
Received: 401

- **Test:** should handle CORS headers properly
  **Failure:** Error: expect(received).toBeDefined()

Received: undefined

- **Test:** should handle large request payloads
  **Failure:** Error: expect(received).toContain(expected) // indexOf

Expected value: 401
Received array: [200, 201, 400, 413]

- **Test:** should handle database connection errors gracefully
  **Failure:** Error: expect(received).toContain(expected) // indexOf

Expected value: 401
Received array: [200, 500]

## AppointmentService (5 failures)

- **Test:** getAppointments should return appointments within date range
  **Failure:** ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

- **Test:** getAppointments should filter appointments by status
  **Failure:** ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

- **Test:** getAppointmentsByProvider should return appointments for provider
  **Failure:** ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

- **Test:** checkAvailability should return true for available time slot
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: [{"end": 2025-09-25T21:24:43.074Z, "start": 2025-09-25T20:24:43.074Z}]

- **Test:** checkAvailability should return false for conflicting time slot
  **Failure:** ValidationError: Appointment validation failed: appointmentType: Cast to ObjectId failed for value "Consulta" (type string) at path "appointmentType" because of "BSONError"

## Patient Auth Middleware (5 failures)

- **Test:** authenticatePatient should authenticate valid patient token from cookies
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "valid-token"

Number of calls: 0

- **Test:** authenticatePatient should authenticate valid patient token from Authorization header
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: "valid-token"

Number of calls: 0

- **Test:** authenticatePatient should return 401 for invalid token
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: ObjectContaining {"message": "Token inválido", "success": false}
Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token de acesso não fornecido", "success": false}

Number of calls: 1

- **Test:** authenticatePatient should return 401 for inactive patient user
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: ObjectContaining {"message": "Conta de paciente inativa", "success": false}
Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token de acesso não fornecido", "success": false}

Number of calls: 1

- **Test:** requirePatientEmailVerification should return 401 for missing patient user
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

Expected: 401
Received: 500

Number of calls: 1

## Auth Routes Integration (7 failures)

- **Test:** POST /api/auth/register should register a new user successfully
  **Failure:** Error: expect(received).toBeDefined()

Received: undefined

- **Test:** POST /api/auth/register should return 400 for duplicate email
  **Failure:** Error: expected 400 "Bad Request", got 409 "Conflict"

- **Test:** POST /api/auth/login should login user successfully
  **Failure:** Error: expect(received).toBeDefined()

Received: undefined

- **Test:** POST /api/auth/login should return 401 for invalid credentials
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: undefined

- **Test:** POST /api/auth/logout should logout user successfully
  **Failure:** Error: expected 200 "OK", got 500 "Internal Server Error"

- **Test:** POST /api/auth/refresh should refresh access token successfully
  **Failure:** Error: expected 200 "OK", got 500 "Internal Server Error"

- **Test:** POST /api/auth/refresh should return 401 for invalid refresh token
  **Failure:** Error: expected 401 "Unauthorized", got 500 "Internal Server Error"
