# API Integration Guide - Patient Management

**Version:** 1.0  
**Date:** 2024  
**Component:** PatientDetail Integration  

## Overview

This guide documents the API integration for the PatientDetail page, covering all endpoints, request/response formats, and error handling.

## Base Configuration

```typescript
// src/services/apiService.ts
import { request } from './http';

export const apiService = {
  patients: { /* ... */ },
  dentalCharts: { /* ... */ },
  treatmentPlans: { /* ... */ },
  clinicalNotes: { /* ... */ },
  medicalHistory: { /* ... */ }
};
```

## Patient APIs

### Get Patient by ID
**Endpoint:** `GET /api/patients/:id`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.patients.getOne(patientId);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "patient-123",
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao@example.com",
    "phone": "(11) 98765-4321",
    "cpf": "123.456.789-00",
    "dateOfBirth": "1990-01-15",
    "gender": "male",
    "status": "active",
    "address": {
      "street": "Rua Teste",
      "number": "123",
      "neighborhood": "Centro",
      "city": "São Paulo",
      "state": "SP",
      "zipCode": "01234-567"
    }
  }
}
```

### Update Patient
**Endpoint:** `PATCH /api/patients/:id`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.patients.update(patientId, {
  firstName: "José",
  email: "jose@example.com"
});
```

**Request Body:**
```json
{
  "firstName": "José",
  "lastName": "Silva",
  "email": "jose@example.com",
  "phone": "(11) 98765-4321"
}
```

**Response:** Same as Get Patient

## Dental Chart APIs

### Get Latest Chart
**Endpoint:** `GET /api/clinical/dental-charts/patient/:patientId/latest`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.dentalCharts.getLatest(patientId);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "chart-123",
    "patient": "patient-123",
    "numberingSystem": "fdi",
    "teeth": [
      {
        "toothNumber": "11",
        "conditions": [
          {
            "type": "caries",
            "surface": "occlusal",
            "severity": "moderate"
          }
        ]
      }
    ],
    "notes": "Patient has good oral hygiene"
  }
}
```

### Get Chart History
**Endpoint:** `GET /api/clinical/dental-charts/patient/:patientId`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.dentalCharts.getHistory(patientId);
```

**Response:** Array of dental charts

## Treatment Plan APIs

### Get All Plans
**Endpoint:** `GET /api/clinical/treatment-plans/patient/:patientId`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.treatmentPlans.getAll(patientId);
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "plan-123",
      "patient": "patient-123",
      "title": "Plano Ortodôntico",
      "status": "proposed",
      "phases": [
        {
          "phaseNumber": 1,
          "title": "Fase Inicial",
          "status": "pending",
          "procedures": [
            {
              "code": "D0150",
              "description": "Exame Completo",
              "cost": 150.00,
              "tooth": null
            }
          ]
        }
      ],
      "totalCost": 5000.00,
      "totalInsuranceCoverage": 1000.00,
      "totalPatientCost": 4000.00
    }
  ]
}
```

## Clinical Notes APIs

### Get All Notes
**Endpoint:** `GET /api/clinical/clinical-notes/patient/:patientId`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.clinicalNotes.getAll(patientId);
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "note-123",
      "noteType": "soap",
      "createdAt": "2024-01-15T10:30:00Z",
      "provider": {
        "name": "Dr. Maria Santos"
      },
      "subjective": "Patient complains of tooth pain",
      "objective": "Visible cavity on tooth 16",
      "assessment": "Dental caries",
      "plan": "Schedule filling procedure",
      "isLocked": false
    }
  ]
}
```

## Medical History APIs

### Get Medical History
**Endpoint:** `GET /api/patients/:patientId/medical-history`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.medicalHistory.get(patientId);
```

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": "patient-123",
    "chiefComplaint": "Dor de dente",
    "chronicConditions": ["diabetes", "hypertension"],
    "pastDentalHistory": ["root_canal", "extraction"],
    "medications": [
      {
        "name": "Metformina",
        "dosage": "500mg",
        "frequency": "2x/dia"
      }
    ],
    "allergies": [
      {
        "allergen": "Penicilina",
        "severity": "moderate"
      }
    ],
    "socialHistory": {
      "smoking": "never",
      "alcohol": "occasional"
    }
  }
}
```

### Update Medical History
**Endpoint:** `PUT /api/patients/:patientId/medical-history`  
**Authentication:** Required  
**Usage:**
```typescript
const result = await apiService.medicalHistory.update(patientId, data);
```

**Request Body:** Same structure as response data

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "message": "Paciente não encontrado"
}
```

### Error Codes
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

### Handling Errors
```typescript
try {
  const result = await apiService.patients.getOne(id);
  if (result.success && result.data) {
    // Success
  } else {
    // Handle error message
    console.error(result.message);
  }
} catch (err) {
  // Network or unexpected error
  console.error(err);
}
```

## Best Practices

### 1. Always Check Success Flag
```typescript
if (result.success && result.data) {
  // Use data
}
```

### 2. Handle Loading States
```typescript
setLoading(true);
try {
  const result = await apiService.patients.getOne(id);
  // Process result
} finally {
  setLoading(false);
}
```

### 3. Provide User Feedback
```typescript
if (!result.success) {
  setError(result.message || 'Erro ao carregar dados');
}
```

### 4. Implement Retry Logic
```typescript
const retry = () => {
  setError(null);
  fetchData();
};
```

### 5. Validate Before Sending
```typescript
if (!data.firstName?.trim()) {
  setError('Nome é obrigatório');
  return;
}
```

## Integration Checklist

- [ ] Import apiService
- [ ] Add loading state
- [ ] Add error state
- [ ] Implement try-catch
- [ ] Check success flag
- [ ] Handle error messages
- [ ] Provide retry mechanism
- [ ] Add user feedback
- [ ] Validate inputs
- [ ] Test error scenarios

## Example: Complete Integration

```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);
    const result = await apiService.patients.getOne(id);
    if (result.success && result.data) {
      setData(result.data);
    } else {
      setError(result.message || 'Erro ao carregar');
    }
  } catch (err) {
    setError('Erro de conexão');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData();
}, [id]);
```

## Support

For API issues or questions:
- Check backend logs
- Verify authentication token
- Confirm endpoint URL
- Test with Postman/curl
- Review network tab in DevTools
