# Clinical Workflow

## Charting → Treatment Plan → Clinical Notes

### 1. Dental Charting
```
/admin/patients/:id
  ↓
Click "Dental Chart" tab
  ↓
Interactive tooth diagram
  ↓
Click tooth → Add annotation:
  • Condition
  • Treatment
  • Notes
  ↓
POST /api/dental-charts
  ↓
Chart saved with version
```

### 2. Treatment Planning
```
Click "Treatment Plan" tab
  ↓
Add procedure:
  • CDT code
  • Tooth number
  • Description
  • Cost
  • Phase
  ↓
POST /api/treatment-plans
  ↓
Plan created
  ↓
Generate estimate
```

### 3. Clinical Notes (SOAP)
```
Click "Clinical Notes" tab
  ↓
Select template or create new
  ↓
Enter SOAP format:
  • Subjective
  • Objective
  • Assessment
  • Plan
  ↓
POST /api/clinical-notes
  ↓
Note saved
  ↓
Linked to appointment
```

### 4. Prescriptions
```
Click "Prescriptions"
  ↓
Add medication:
  • Drug name
  • Dosage
  • Frequency
  • Duration
  ↓
POST /api/prescriptions
  ↓
Prescription created
  ↓
Print or send electronically
```

## Sequence Diagram

```
Patient Visit
  ↓
Check-in (Receptionist)
  ↓
Medical History Review (Hygienist)
  ↓
Dental Charting (Hygienist/Dentist)
  ↓
Examination (Dentist)
  ↓
Treatment Plan (Dentist)
  ↓
Clinical Notes (Dentist)
  ↓
Prescriptions (if needed)
  ↓
Schedule Follow-up
  ↓
Check-out + Payment
```
