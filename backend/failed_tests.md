# Failed Tests Summary

Total Failed Tests: 22

## Patient Portal Integration Tests (17 failures)

- **Test:** should get patient user info with valid token
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:94:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should get upcoming appointments for patient
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:104:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should logout patient user successfully
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:124:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle appointment booking with valid data
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 201
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:158:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle appointment cancellation
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:170:31)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle patient profile updates
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:203:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle password reset request
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 404
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:211:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle rate limiting on auth endpoints
  **Failure:** Error: expect(received).toBeGreaterThan(expected)

  Expected: > 0
  Received:   0
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:233:41)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle concurrent session management
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:254:30)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle appointment rescheduling
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:280:31)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle patient medical history retrieval
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:304:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle appointment type listing
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:313:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle provider availability checking
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 200
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:330:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle error responses gracefully
  **Failure:** Error: expect(received).toBe(expected) // Object.is equality

  Expected: 404
  Received: 401
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:339:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle CORS headers properly
  **Failure:** Error: expect(received).toBeDefined()

  Received: undefined
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:351:56)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle large request payloads
  **Failure:** Error: expect(received).toContain(expected) // indexOf

  Expected value: 401
  Received array: [200, 201, 400, 413]
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:372:34)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** should handle database connection errors gracefully
  **Failure:** Error: expect(received).toContain(expected) // indexOf

  Expected value: 401
  Received array: [200, 500]
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:384:24)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

## Patient Auth Middleware (5 failures)

- **Test:** authenticatePatient should authenticate valid patient token from cookies
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

  Expected: "valid-token"
  Number of calls: 0
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:61:52)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** authenticatePatient should authenticate valid patient token from Authorization header
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

  Expected: "valid-token"
  Number of calls: 0
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:98:56)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** authenticatePatient should return 401 for invalid token
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

  Expected: "patientAccessToken"
  Number of calls: 0
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:128:31)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** authenticatePatient should return 401 for inactive patient user
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

  Expected: ObjectContaining {"message": "Conta de paciente inativa", "success": false}
  Received: {"code": "PATIENT_AUTH_FAILED", "message": "Token inválido", "success": false}
  Number of calls: 1
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:156:28)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)

- **Test:** requirePatientEmailVerification should return 401 for missing patient user
  **Failure:** Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

  Expected: 401
  Received: 500
  at Object.<anonymous> (/home/rebelde/development/topsmile/backend/tests/unit/middleware/patientAuth.test.ts:199:26)
  at processTicksAndRejections (node:internal/process/task_queues:105:5)
