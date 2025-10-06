# Patient Booking Flow

## Registration → Booking → Confirmation

### 1. Patient Registration
```
/patient/register
  ↓
Enter details:
  • Name, email, phone
  • Password
  • Clinic selection
  ↓
POST /api/patient-auth/register
  ↓
Success: Account created
  ↓
Email verification sent
  ↓
/patient/login
```

### 2. Browse Appointments
```
/booking
  ↓
Select:
  • Service type
  • Provider (optional)
  • Date
  ↓
GET /api/appointments/availability
  ↓
Show available time slots
```

### 3. Book Appointment
```
Select time slot
  ↓
Enter patient info (if not logged in)
  ↓
POST /api/appointments
  ↓
Success: Appointment created
  ↓
Confirmation page:
  • Date/time
  • Provider
  • Location
  • Add to calendar
```

### 4. Confirmation
```
Email sent with:
  • Appointment details
  • Cancellation link
  • Directions

SMS sent:
  • Date/time reminder
```

## Logged-in Patient Flow

```
/patient/dashboard
  ↓
View upcoming appointments
  ↓
Click "Book New"
  ↓
Select service + date
  ↓
Confirm booking
  ↓
Added to "My Appointments"
```
