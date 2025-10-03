# Medical Data Testing Guidelines

## HIPAA Compliance Testing

### Patient Data Protection

#### Data Encryption Testing
```typescript
describe('Medical Data Encryption', () => {
  it('should encrypt sensitive patient information', async () => {
    const patient = await createTestPatient({
      ssn: '123-45-6789',
      medicalHistory: {
        conditions: ['Diabetes Type 2', 'Hypertension'],
        medications: ['Metformin', 'Lisinopril'],
        allergies: ['Penicillin', 'Latex']
      }
    });

    // Verify data is encrypted at database level
    const rawData = await mongoose.connection.db
      .collection('patients')
      .findOne({ _id: patient._id });

    expect(rawData.ssn).not.toBe('123-45-6789');
    expect(JSON.stringify(rawData)).not.toContain('Diabetes');
    expect(JSON.stringify(rawData)).not.toContain('Penicillin');
  });
});
```

#### Access Control Testing
```typescript
describe('Patient Data Access Control', () => {
  it('should restrict access to authorized personnel only', async () => {
    const patient = await createTestPatient();
    const unauthorizedUser = await createTestUser({ role: 'receptionist' });
    const token = generateAuthToken(unauthorizedUser._id, 'receptionist');

    await request(app)
      .get(`/api/patients/${patient._id}/medical-history`)
      .set('Authorization', `Bearer ${token}`)
      .expect(403);
  });

  it('should allow authorized access to medical data', async () => {
    const patient = await createTestPatient();
    const doctor = await createTestUser({ role: 'dentist' });
    const token = generateAuthToken(doctor._id, 'dentist');

    const response = await request(app)
      .get(`/api/patients/${patient._id}/medical-history`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.data.medicalHistory).toBeDefined();
  });
});
```

### Audit Logging

#### Data Access Auditing
```typescript
describe('Medical Data Audit Logging', () => {
  it('should log all patient data access attempts', async () => {
    const patient = await createTestPatient();
    const doctor = await createTestUser({ role: 'dentist' });
    const token = generateAuthToken(doctor._id, 'dentist');

    await request(app)
      .get(`/api/patients/${patient._id}`)
      .set('Authorization', `Bearer ${token}`);

    const auditLog = await AuditLog.findOne({
      userId: doctor._id,
      resourceType: 'Patient',
      resourceId: patient._id,
      action: 'READ'
    });

    expect(auditLog).toBeTruthy();
    expect(auditLog.timestamp).toBeDefined();
    expect(auditLog.ipAddress).toBeDefined();
  });

  it('should log failed access attempts', async () => {
    const patient = await createTestPatient();
    const invalidToken = 'invalid-token';

    await request(app)
      .get(`/api/patients/${patient._id}`)
      .set('Authorization', `Bearer ${invalidToken}`)
      .expect(401);

    const auditLog = await AuditLog.findOne({
      resourceType: 'Patient',
      resourceId: patient._id,
      action: 'READ_FAILED'
    });

    expect(auditLog).toBeTruthy();
    expect(auditLog.reason).toContain('Invalid token');
  });
});
```

### Data Retention and Deletion

#### Soft Delete Testing
```typescript
describe('Patient Data Retention', () => {
  it('should soft delete patient records', async () => {
    const patient = await createTestPatient();
    
    await request(app)
      .delete(`/api/patients/${patient._id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verify record still exists but marked as deleted
    const deletedPatient = await Patient.findById(patient._id);
    expect(deletedPatient).toBeTruthy();
    expect(deletedPatient.status).toBe('deleted');
    expect(deletedPatient.deletedAt).toBeDefined();
  });

  it('should exclude deleted patients from normal queries', async () => {
    const activePatient = await createTestPatient({ status: 'active' });
    const deletedPatient = await createTestPatient({ 
      status: 'deleted',
      deletedAt: new Date()
    });

    const response = await request(app)
      .get('/api/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    const patientIds = response.body.data.map(p => p._id);
    expect(patientIds).toContain(activePatient._id.toString());
    expect(patientIds).not.toContain(deletedPatient._id.toString());
  });
});
```

## Medical Workflow Testing

### Appointment Medical Data

#### Medical History Integration
```typescript
describe('Appointment Medical Integration', () => {
  it('should include relevant medical history in appointment', async () => {
    const patient = await createTestPatient({
      medicalHistory: {
        allergies: ['Lidocaine'],
        conditions: ['Diabetes'],
        medications: ['Insulin']
      }
    });

    const appointment = await createTestAppointment({
      patient: patient._id,
      type: 'Cirurgia'
    });

    const response = await request(app)
      .get(`/api/appointments/${appointment._id}`)
      .set('Authorization', `Bearer ${doctorToken}`)
      .expect(200);

    expect(response.body.data.patient.medicalHistory.allergies)
      .toContain('Lidocaine');
  });

  it('should flag high-risk patients in appointments', async () => {
    const highRiskPatient = await createTestPatient({
      medicalHistory: {
        conditions: ['Heart Disease', 'Diabetes'],
        riskLevel: 'high'
      }
    });

    const appointment = await createTestAppointment({
      patient: highRiskPatient._id
    });

    expect(appointment.riskFlags).toContain('HIGH_RISK_PATIENT');
    expect(appointment.specialInstructions).toBeDefined();
  });
});
```

### Treatment Records

#### Treatment Documentation
```typescript
describe('Treatment Record Management', () => {
  it('should create treatment record with medical context', async () => {
    const patient = await createTestPatient();
    const appointment = await createTestAppointment({
      patient: patient._id,
      status: 'completed'
    });

    const treatmentData = {
      appointmentId: appointment._id,
      procedures: ['Limpeza', 'Aplicação de Flúor'],
      medications: ['Ibuprofeno 400mg'],
      notes: 'Paciente apresentou sensibilidade',
      followUpRequired: true
    };

    const response = await request(app)
      .post('/api/treatments')
      .set('Authorization', `Bearer ${doctorToken}`)
      .send(treatmentData)
      .expect(201);

    expect(response.body.data.procedures).toHaveLength(2);
    expect(response.body.data.followUpRequired).toBe(true);
  });
});
```

## Compliance Validation

### Data Privacy Testing

#### PII Masking
```typescript
describe('PII Data Masking', () => {
  it('should mask sensitive data in logs', async () => {
    const patient = await createTestPatient({
      ssn: '123-45-6789',
      phone: '(11) 99999-9999'
    });

    // Simulate logging
    const logEntry = maskSensitiveData({
      patientId: patient._id,
      ssn: patient.ssn,
      phone: patient.phone,
      action: 'UPDATE'
    });

    expect(logEntry.ssn).toBe('12***89');
    expect(logEntry.phone).toBe('(1***99');
  });
});
```

#### Data Export Compliance
```typescript
describe('Data Export Compliance', () => {
  it('should export patient data in compliant format', async () => {
    const patient = await createTestPatient();

    const response = await request(app)
      .get(`/api/patients/${patient._id}/export`)
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // Verify export includes required HIPAA fields
    expect(response.body.data).toHaveProperty('dataExportDate');
    expect(response.body.data).toHaveProperty('exportedBy');
    expect(response.body.data).toHaveProperty('patientConsent');
    expect(response.body.data.medicalHistory).toBeDefined();
  });
});
```

## Emergency Scenarios

### Emergency Access Testing
```typescript
describe('Emergency Medical Access', () => {
  it('should allow emergency access to patient data', async () => {
    const patient = await createTestPatient();
    const emergencyUser = await createTestUser({ role: 'emergency' });
    const emergencyToken = generateAuthToken(emergencyUser._id, 'emergency');

    const response = await request(app)
      .get(`/api/patients/${patient._id}/emergency`)
      .set('Authorization', `Bearer ${emergencyToken}`)
      .set('X-Emergency-Code', 'MEDICAL_EMERGENCY')
      .expect(200);

    expect(response.body.data.medicalHistory).toBeDefined();
    expect(response.body.data.emergencyContacts).toBeDefined();

    // Verify emergency access is logged
    const auditLog = await AuditLog.findOne({
      action: 'EMERGENCY_ACCESS',
      resourceId: patient._id
    });
    expect(auditLog).toBeTruthy();
  });
});
```

## Test Data Guidelines

### Medical Test Data Creation
```typescript
// Safe medical test data - no real patient information
export const createMedicalTestData = () => ({
  conditions: [
    'Cárie Dentária',
    'Gengivite',
    'Periodontite',
    'Sensibilidade Dentária'
  ],
  medications: [
    'Ibuprofeno 400mg',
    'Paracetamol 500mg',
    'Amoxicilina 500mg'
  ],
  allergies: [
    'Penicilina',
    'Látex',
    'Lidocaína',
    'Ibuprofeno'
  ],
  procedures: [
    'Limpeza',
    'Restauração',
    'Extração',
    'Tratamento de Canal',
    'Aplicação de Flúor'
  ]
});
```

### Compliance Test Checklist
- [ ] Patient data encryption at rest
- [ ] Access control validation
- [ ] Audit logging for all data access
- [ ] Soft delete implementation
- [ ] PII masking in logs
- [ ] Emergency access procedures
- [ ] Data export compliance
- [ ] Treatment record integrity
- [ ] Medical history protection
- [ ] Appointment medical context