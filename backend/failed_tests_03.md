# Failed Tests Report

This document lists the failed tests from the JUnit XML report (`backend/reports/junit-backend.xml`), including test names and their failure causes.

Total tests: 265  
Failures: 29  
Errors: 0  

## Patient Portal Integration Tests

- **Test:** should get patient user info with valid token  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:94:28)

- **Test:** should get upcoming appointments for patient  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:104:28)

- **Test:** should logout patient user successfully  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:124:28)

- **Test:** should handle appointment booking with valid data  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 201  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:158:28)

- **Test:** should handle appointment cancellation  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:170:31)

- **Test:** should handle patient profile updates  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:203:28)

- **Test:** should handle password reset request  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 404  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:211:28)

- **Test:** should handle rate limiting on auth endpoints  
  **Cause:** Error: expect(received).toBeGreaterThan(expected)  
  Expected: > 0  
  Received: 0  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:233:41)

- **Test:** should handle concurrent session management  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:253:18)

- **Test:** should handle appointment rescheduling  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:280:31)

- **Test:** should handle patient medical history retrieval  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:304:28)

- **Test:** should handle appointment type listing  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:313:28)

- **Test:** should handle provider availability checking  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 200  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:330:28)

- **Test:** should handle error responses gracefully  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: 404  
  Received: 401  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:339:28)

- **Test:** should handle CORS headers properly  
  **Cause:** Error: expect(received).toBeDefined()  
  Received: undefined  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:351:56)

- **Test:** should handle large request payloads  
  **Cause:** Error: expect(received).toContain(expected) // indexOf  
  Expected value: 401  
  Received array: [200, 201, 400, 413]  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:372:34)

- **Test:** should handle database connection errors gracefully  
  **Cause:** Error: expect(received).toContain(expected) // indexOf  
  Expected value: 401  
  Received array: [200, 500]  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:384:24)

## Auth Routes Integration

- **Test:** POST /api/auth/register should register a new user successfully  
  **Cause:** Error: expect(received).toBeDefined()  
  Received: undefined  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:57:46)

- **Test:** POST /api/auth/register should return 400 for duplicate email  
  **Cause:** expected 400 "Bad Request", got 409 "Conflict"  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:87:10)

- **Test:** POST /api/auth/login should login user successfully  
  **Cause:** Error: expect(received).toBeDefined()  
  Received: undefined  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:108:46)

- **Test:** POST /api/auth/login should return 401 for invalid credentials  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality  
  Expected: false  
  Received: undefined  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:133:37)

- **Test:** POST /api/auth/logout should logout user successfully  
  **Cause:** expected 200 "OK", got 500 "Internal Server Error"  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:202:10)

- **Test:** POST /api/auth/refresh should refresh access token successfully  
  **Cause:** expected 200 "OK", got 500 "Internal Server Error"  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:224:10)

- **Test:** POST /api/auth/refresh should return 401 for invalid refresh token  
  **Cause:** expected 401 "Unauthorized", got 500 "Internal Server Error"  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/authRoutes.test.ts:235:10)

## Patient Auth Middleware

- **Test:** authenticatePatient should authenticate valid patient token from cookies  
  **Cause:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)  
  Expected: "valid-token"  
  Number of calls: 0  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:61:52)

- **Test:** authenticatePatient should authenticate valid patient token from Authorization header  
  **Cause:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)  
  Expected: "valid-token"  
  Number of calls: 0  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:98:56)

- **Test:** authenticatePatient should return 401 for invalid token  
  **Cause:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)  
  Expected: "patientAccessToken"  
  Number of calls: 0  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:128:31)

- **Test:** authenticatePatient should return 401 for inactive patient user  
  **Cause:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)  
  Expected: ObjectContaining {"message": "Conta de paciente inativa", "success": false}  
  Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token inválido", "success": false}  
  Number of calls: 1  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:156:28)

- **Test:** requirePatientEmailVerification should return 401 for missing patient user  
  **Cause:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)  
  Expected: 401  
  Received: 500  
  Number of calls: 1  
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:199:26)
