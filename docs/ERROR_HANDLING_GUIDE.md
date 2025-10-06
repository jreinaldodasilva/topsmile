# Error Handling Guide

## Backend Error Handling

### Error Classes

**AppError (Base Class)**
```typescript
throw new AppError('Error message', 500, 'ERROR_CODE', { details });
```

**ValidationError**
```typescript
throw new ValidationError('Invalid input', { field: 'email' });
```

**NotFoundError**
```typescript
throw new NotFoundError('User');
```

**UnauthorizedError**
```typescript
throw new UnauthorizedError('Invalid credentials');
```

**ForbiddenError**
```typescript
throw new ForbiddenError('Insufficient permissions');
```

**ConflictError**
```typescript
throw new ConflictError('Email already exists');
```

**BadRequestError**
```typescript
throw new BadRequestError('Missing required field');
```

### Usage in Services

```typescript
async getUser(id: string) {
  const user = await User.findById(id);
  if (!user) {
    throw new NotFoundError('User');
  }
  return user;
}
```

### Usage in Routes

```typescript
router.post('/', async (req, res, next) => {
  try {
    const result = await service.create(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error); // Pass to error handler
  }
});
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "message": "User não encontrado",
    "code": "NOT_FOUND",
    "statusCode": 404,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

### Error Logging

Errors are automatically logged with context:
```typescript
ErrorLogger.log(error, 'POST /api/users');
```

Log format:
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "context": "POST /api/users",
  "name": "NotFoundError",
  "message": "User não encontrado",
  "statusCode": 404,
  "code": "NOT_FOUND",
  "isOperational": true
}
```

## Frontend Error Handling

### Error Interceptor

Automatically handles API errors:
```typescript
// In BaseApiService
catch (error) {
  if (error.response?.status === 401) {
    // Redirect to login
  }
  throw new Error(error.response?.data?.error?.message || 'Error');
}
```

### Error Display

```tsx
const { error } = useAppointments();

{error && (
  <div className="error-message">
    {error}
  </div>
)}
```

### Error Boundaries

```tsx
<ErrorBoundary level="page" context="user-profile">
  <UserProfile />
</ErrorBoundary>
```

## Error Codes

### Authentication (401)
- `UNAUTHORIZED` - Invalid credentials
- `TOKEN_EXPIRED` - JWT token expired
- `TOKEN_INVALID` - Invalid JWT token

### Authorization (403)
- `FORBIDDEN` - Insufficient permissions
- `ACCESS_DENIED` - Resource access denied

### Validation (400)
- `VALIDATION_ERROR` - Input validation failed
- `BAD_REQUEST` - Malformed request
- `INVALID_INPUT` - Invalid input data

### Not Found (404)
- `NOT_FOUND` - Resource not found

### Conflict (409)
- `CONFLICT` - Resource conflict
- `DUPLICATE_ENTRY` - Duplicate entry

### Server Error (500)
- `INTERNAL_ERROR` - Internal server error
- `DATABASE_ERROR` - Database operation failed

## Best Practices

### 1. Use Specific Error Classes
```typescript
// ❌ Bad
throw new Error('Not found');

// ✅ Good
throw new NotFoundError('User');
```

### 2. Provide Context
```typescript
// ❌ Bad
throw new ValidationError('Invalid');

// ✅ Good
throw new ValidationError('Invalid email format', { 
  field: 'email',
  value: email 
});
```

### 3. Don't Expose Sensitive Info
```typescript
// ❌ Bad
throw new Error(`Database error: ${dbError.message}`);

// ✅ Good
ErrorLogger.log(dbError);
throw new AppError('Database operation failed');
```

### 4. Handle Async Errors
```typescript
// ✅ Always use try-catch with async
async function handler(req, res, next) {
  try {
    await asyncOperation();
  } catch (error) {
    next(error);
  }
}
```

### 5. Log Appropriately
```typescript
// Operational errors (expected)
ErrorLogger.log(new NotFoundError('User'));

// Programming errors (unexpected)
ErrorLogger.log(new Error('Undefined variable'));
```

## Testing Errors

```typescript
it('throws NotFoundError when user not found', async () => {
  await expect(service.getUser('invalid-id'))
    .rejects
    .toThrow(NotFoundError);
});
```

## Monitoring

### Production Setup
1. Integrate with error tracking service (Sentry, DataDog)
2. Set up alerts for critical errors
3. Monitor error rates
4. Track error patterns

### Error Metrics
- Error rate by endpoint
- Error types distribution
- Response time on errors
- User impact
