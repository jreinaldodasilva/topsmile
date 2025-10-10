# TopSmile API Reference

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.topsmile.com/api
```

## Authentication

All authenticated endpoints require JWT token in HttpOnly cookie.

---

## Staff Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "staff@clinic.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "user": {
    "id": "user_id",
    "email": "staff@clinic.com",
    "name": "Staff Name",
    "role": "admin",
    "clinicId": "clinic_id"
  }
}
```

### Refresh Token
```http
POST /auth/refresh
Cookie: topsmile_refresh_token

Response 200:
{
  "success": true,
  "message": "Token renovado com sucesso"
}
```

### Logout
```http
POST /auth/logout
Cookie: topsmile_refresh_token

Response 200:
{
  "success": true,
  "message": "Logout realizado com sucesso"
}
```

---

## Patient Authentication

### Register
```http
POST /patient-auth/register
Content-Type: application/json

{
  "email": "patient@email.com",
  "password": "password123",
  "name": "Patient Name",
  "phone": "+5511999999999"
}

Response 201:
{
  "success": true,
  "patient": { ... }
}
```

### Login
```http
POST /patient-auth/login
Content-Type: application/json

{
  "email": "patient@email.com",
  "password": "password123"
}

Response 200:
{
  "success": true,
  "patient": { ... }
}
```

---

## Appointments

### List Appointments
```http
GET /scheduling/appointments?date=2024-01-15&status=scheduled
Authorization: Required

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "apt_id",
      "patient": { "id": "patient_id", "name": "Patient Name" },
      "provider": { "id": "provider_id", "name": "Dr. Name" },
      "scheduledStart": "2024-01-15T10:00:00Z",
      "duration": 30,
      "status": "scheduled"
    }
  ]
}
```

### Create Appointment
```http
POST /scheduling/appointments
Authorization: Required
Content-Type: application/json

{
  "patientId": "patient_id",
  "providerId": "provider_id",
  "appointmentTypeId": "type_id",
  "scheduledStart": "2024-01-15T10:00:00Z",
  "duration": 30,
  "notes": "First visit"
}

Response 201:
{
  "success": true,
  "data": { ... },
  "message": "Agendamento criado com sucesso"
}
```

### Update Appointment
```http
PUT /scheduling/appointments/:id
Authorization: Required
Content-Type: application/json

{
  "scheduledStart": "2024-01-15T11:00:00Z",
  "status": "confirmed"
}

Response 200:
{
  "success": true,
  "data": { ... }
}
```

### Delete Appointment
```http
DELETE /scheduling/appointments/:id
Authorization: Required

Response 200:
{
  "success": true,
  "message": "Agendamento cancelado com sucesso"
}
```

---

## Patients

### List Patients
```http
GET /patients?search=john&page=1&limit=20
Authorization: Required

Response 200:
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

### Get Patient
```http
GET /patients/:id
Authorization: Required

Response 200:
{
  "success": true,
  "data": {
    "id": "patient_id",
    "name": "Patient Name",
    "email": "patient@email.com",
    "phone": "+5511999999999",
    "dateOfBirth": "1990-01-01",
    "medicalHistory": { ... }
  }
}
```

### Create Patient
```http
POST /patients
Authorization: Required
Content-Type: application/json

{
  "name": "Patient Name",
  "email": "patient@email.com",
  "phone": "+5511999999999",
  "dateOfBirth": "1990-01-01"
}

Response 201:
{
  "success": true,
  "data": { ... }
}
```

---

## Providers

### List Providers
```http
GET /providers?specialty=orthodontics
Authorization: Required

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "provider_id",
      "name": "Dr. Name",
      "specialty": ["orthodontics"],
      "isActive": true
    }
  ]
}
```

### Get Provider Availability
```http
GET /scheduling/availability?providerId=provider_id&date=2024-01-15
Authorization: Required

Response 200:
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "slots": [
      { "time": "09:00", "available": true },
      { "time": "09:30", "available": false },
      { "time": "10:00", "available": true }
    ]
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": [
    {
      "field": "email",
      "message": "E-mail inválido"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Não autorizado"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Acesso negado"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Recurso não encontrado"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Muitas requisições. Tente novamente em 15 minutos."
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| /auth/login | 5 | 15 min |
| /auth/refresh | 20 | 15 min |
| /patient-auth/login | 5 | 15 min |
| /api/* | 100 | 15 min |

---

## Pagination

All list endpoints support pagination:

```http
GET /patients?page=1&limit=20&sort=name&order=asc
```

Response includes pagination metadata:
```json
{
  "data": {
    "items": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

## Filtering

Common filter parameters:
- `search` - Text search
- `status` - Filter by status
- `date` - Filter by date
- `startDate` / `endDate` - Date range

---

## Sorting

Use `sort` and `order` parameters:
```http
GET /appointments?sort=scheduledStart&order=desc
```

---

## API Versioning

Version can be specified via:

**URL Path:**
```http
GET /api/v1/appointments
```

**Accept Header:**
```http
GET /api/appointments
Accept: application/vnd.topsmile.v1+json
```

---

## Webhooks

### Stripe Webhook
```http
POST /webhooks/stripe
Stripe-Signature: signature

{
  "type": "payment_intent.succeeded",
  "data": { ... }
}
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Complete API Documentation** - All endpoints (1 week)
2. **Add OpenAPI/Swagger Spec** - Interactive docs (3 days)

### 🟧 High Priority
3. **Implement GraphQL** - Alternative to REST (2 months)
4. **Add Batch Endpoints** - Multiple operations (1 week)
5. **Implement Webhooks** - Event notifications (2 weeks)

---

**Related:** [01-System-Architecture-Overview.md](../architecture/01-System-Architecture-Overview.md)

**Full API Documentation:** http://localhost:5000/api-docs
