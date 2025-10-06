# Appointments API

## GET /api/appointments
List appointments.

**Query Params:**
- `date`: Filter by date (YYYY-MM-DD)
- `providerId`: Filter by provider
- `status`: Filter by status

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "123",
      "patient": { "name": "John Doe" },
      "provider": { "name": "Dr. Smith" },
      "startTime": "2024-10-07T10:00:00Z",
      "duration": 60,
      "status": "scheduled"
    }
  ]
}
```

---

## POST /api/appointments
Create appointment.

**Request:**
```json
{
  "patientId": "123",
  "providerId": "456",
  "startTime": "2024-10-07T10:00:00Z",
  "duration": 60,
  "serviceType": "cleaning"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "789",
    "status": "scheduled"
  }
}
```

**Errors:**
- 400: Invalid data
- 409: Time slot unavailable

---

## PUT /api/appointments/:id
Update appointment.

**Request:**
```json
{
  "startTime": "2024-10-07T11:00:00Z",
  "status": "confirmed"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { "_id": "789" }
}
```

---

## DELETE /api/appointments/:id
Cancel appointment.

**Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled"
}
```
