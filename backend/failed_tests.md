# Failed Tests Report

This document lists the failed tests from the JUnit XML report (`backend/reports/junit-backend.xml`), including the test names and their failure causes.

## Summary
- Total tests: 265
- Total failures: 17
- Total errors: 0

All failures are from the "Patient Portal Integration Tests" test suite.

## Failed Tests

### 1. should get patient user info with valid token
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:94:28

### 2. should get upcoming appointments for patient
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:104:28

### 3. should logout patient user successfully
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:124:28

### 4. should handle appointment booking with valid data
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 201  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:158:28

### 5. should handle appointment cancellation
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:170:31

### 6. should handle patient profile updates
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:203:28

### 7. should handle password reset request
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 404  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:211:28

### 8. should handle rate limiting on auth endpoints
**Cause:** expect(received).toBeGreaterThan(expected)  
Expected: > 0  
Received: 0  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:233:41

### 9. should handle concurrent session management
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:254:30

### 10. should handle appointment rescheduling
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:280:31

### 11. should handle patient medical history retrieval
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:304:28

### 12. should handle appointment type listing
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:313:28

### 13. should handle provider availability checking
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 200  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:330:28

### 14. should handle error responses gracefully
**Cause:** expect(received).toBe(expected) // Object.is equality  
Expected: 404  
Received: 401  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:339:28

### 15. should handle CORS headers properly
**Cause:** expect(received).toBeDefined()  
Received: undefined  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:351:56

### 16. should handle large request payloads
**Cause:** expect(received).toContain(expected) // indexOf  
Expected value: 401  
Received array: [200, 201, 400, 413]  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:372:34

### 17. should handle database connection errors gracefully
**Cause:** expect(received).toContain(expected) // indexOf  
Expected value: 401  
Received array: [200, 500]  
Location: /home/rebelde/development/topsmile/backend/tests/integration/patientPortal.test.ts:384:24
