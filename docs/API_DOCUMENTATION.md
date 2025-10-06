# TopSmile API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.topsmile.com/api
```

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operação realizada com sucesso"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Mensagem de erro",
  "errors": []
}
```

## Endpoints

### Authentication

#### POST /auth/login
Login with email and password.

**Request**:
```json
{
  "email": "admin@topsmile.com",
  "password": "SecurePass123!"
}
```

**Response**:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@topsmile.com",
    "role": "admin"
  }
}
```

### Appointments

#### GET /appointments
List appointments with pagination.

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by status
- `date` (string): Filter by date (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### POST /appointments
Create new appointment.

**Request**:
```json
{
  "patient": "507f1f77bcf86cd799439011",
  "provider": "507f1f77bcf86cd799439012",
  "scheduledStart": "2024-12-01T10:00:00Z",
  "scheduledEnd": "2024-12-01T10:30:00Z",
  "type": "consultation",
  "notes": "First visit"
}
```

### Patients

#### GET /patients
List patients with search and pagination.

#### POST /patients
Create new patient.

#### GET /patients/:id
Get patient details.

#### PUT /patients/:id
Update patient.

### Providers

#### GET /providers
List providers.

#### GET /providers/:id/availability
Get provider availability for date range.

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate resource |
| 500 | Internal Server Error |

## Rate Limiting

- 100 requests per 15 minutes per IP
- 429 status code when exceeded

## Swagger Documentation

Interactive API documentation available at:
```
http://localhost:5000/api-docs
```
