# Failed Tests

The following tests failed in the backend test suite:

## Patient Portal Integration Tests

1. **should get patient user info with valid token**
   - **Failure**: Expected status 200, but received 401

2. **should get upcoming appointments for patient**
   - **Failure**: Expected status 200, but received 401

3. **should logout patient user successfully**
   - **Failure**: Expected status 200, but received 401

4. **should handle appointment booking with valid data**
   - **Failure**: Expected status 201, but received 401

5. **should handle appointment cancellation**
   - **Failure**: Expected status 200, but received 401

6. **should handle patient profile updates**
   - **Failure**: Expected status 200, but received 401

7. **should handle password reset request**
   - **Failure**: Expected status 200, but received 404

8. **should handle rate limiting on auth endpoints**
   - **Failure**: Expected rate limit violations > 0, but received 0

9. **should handle concurrent session management**
   - **Failure**: Expected status 200, but received 401

10. **should handle appointment rescheduling**
    - **Failure**: Expected status 200, but received 401

11. **should handle patient medical history retrieval**
    - **Failure**: Expected status 200, but received 401

12. **should handle appointment type listing**
    - **Failure**: Expected status 200, but received 401

13. **should handle provider availability checking**
    - **Failure**: Expected status 200, but received 401

14. **should handle error responses gracefully**
    - **Failure**: Expected status 404, but received 401

15. **should handle CORS headers properly**
    - **Failure**: Expected CORS headers to be defined, but received undefined

16. **should handle large request payloads**
    - **Failure**: Expected response codes to contain 401, but received [200, 201, 400, 413]

17. **should handle database connection errors gracefully**
    - **Failure**: Expected response codes to contain 401, but received [200, 500]
