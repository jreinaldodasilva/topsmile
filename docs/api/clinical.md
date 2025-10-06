# Clinical API

## POST /api/dental-charts
Create dental chart.

**Request:**
```json
{
  "patientId": "123",
  "teeth": [
    {
      "number": 18,
      "condition": "cavity",
      "treatment": "filling",
      "notes": "Upper right molar"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "456",
    "version": 1
  }
}
```

---

## POST /api/treatment-plans
Create treatment plan.

**Request:**
```json
{
  "patientId": "123",
  "procedures": [
    {
      "code": "D0120",
      "description": "Periodic oral evaluation",
      "toothNumber": null,
      "cost": 75.00,
      "phase": 1
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "_id": "789" }
}
```

---

## POST /api/clinical-notes
Create clinical note.

**Request:**
```json
{
  "patientId": "123",
  "appointmentId": "456",
  "subjective": "Patient reports pain",
  "objective": "Swelling observed",
  "assessment": "Infection likely",
  "plan": "Prescribe antibiotics"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "_id": "999" }
}
```

---

## POST /api/prescriptions
Create prescription.

**Request:**
```json
{
  "patientId": "123",
  "medication": "Amoxicillin",
  "dosage": "500mg",
  "frequency": "3x daily",
  "duration": "7 days"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { "_id": "111" }
}
```
