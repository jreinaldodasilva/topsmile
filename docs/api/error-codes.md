# API Error Codes

## HTTP Status Codes

### 2xx Success
- **200 OK**: Request successful
- **201 Created**: Resource created
- **204 No Content**: Success, no response body

### 4xx Client Errors
- **400 Bad Request**: Invalid input
- **401 Unauthorized**: Not authenticated
- **403 Forbidden**: No permission
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource conflict
- **422 Unprocessable Entity**: Validation failed
- **429 Too Many Requests**: Rate limit exceeded

### 5xx Server Errors
- **500 Internal Server Error**: Server error
- **503 Service Unavailable**: Service down

## Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "param": "email",
      "msg": "Invalid email format"
    }
  ]
}
```

## Common Error Codes

**AUTH_001**: Invalid credentials  
**AUTH_002**: Token expired  
**AUTH_003**: Token blacklisted  
**AUTH_004**: MFA required  

**VAL_001**: Validation failed  
**VAL_002**: Missing required field  
**VAL_003**: Invalid format  

**RES_001**: Resource not found  
**RES_002**: Resource already exists  
**RES_003**: Cannot delete (in use)  

**PERM_001**: Insufficient permissions  
**PERM_002**: Clinic access denied  
**PERM_003**: Resource ownership required  

**RATE_001**: Rate limit exceeded  
**RATE_002**: Too many login attempts
