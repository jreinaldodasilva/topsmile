# TopSmile User Journey Flows

**Version:** 1.0.0 | **Date:** 2024-01-15 | **Status:** ✅ Complete

---

## Patient Journey

### 1. Registration & Onboarding
```
Visit Website → Register → Email Verification → Complete Profile → Dashboard
```

**Steps:**
1. Patient visits `/patient/register`
2. Fills registration form (name, email, password, phone)
3. Receives verification email
4. Clicks verification link
5. Completes medical history
6. Redirected to patient dashboard

### 2. Appointment Booking
```
Dashboard → Book Appointment → Select Service → Choose Provider → Pick Time → Confirm → Confirmation
```

**Steps:**
1. Click "Book Appointment"
2. Select appointment type (cleaning, consultation, etc.)
3. Choose preferred provider (or any available)
4. View available time slots
5. Select date and time
6. Review and confirm
7. Receive confirmation email/SMS

### 3. Appointment Management
```
Dashboard → My Appointments → View Details → Reschedule/Cancel
```

**Actions:**
- View upcoming appointments
- View appointment history
- Reschedule appointment (if >24h notice)
- Cancel appointment
- Download appointment details

### 4. Medical Records Access
```
Dashboard → Medical Records → View History → Download Reports
```

**Features:**
- View medical history
- Access treatment plans
- Download prescriptions
- View clinical notes (provider-shared)

---

## Staff Journey

### 1. Login & Dashboard
```
Login → Dashboard → View Today's Schedule → Quick Actions
```

**Dashboard Widgets:**
- Today's appointments
- Pending tasks
- Recent patients
- Quick statistics

### 2. Patient Management
```
Dashboard → Patients → Search/Filter → View Patient → Edit/Update
```

**Actions:**
- Search patients by name, email, phone
- View patient details
- Update patient information
- View appointment history
- Access medical records

### 3. Appointment Management
```
Dashboard → Calendar → View Schedule → Create/Edit Appointment → Confirm
```

**Features:**
- Calendar view (day/week/month)
- Drag-and-drop rescheduling
- Color-coded by status
- Provider filtering
- Quick appointment creation

### 4. Clinical Workflow
```
Appointment → Check-in → Clinical Notes → Treatment → Complete → Checkout
```

**Steps:**
1. Mark patient as checked-in
2. Review medical history
3. Add clinical notes
4. Update treatment plan
5. Add prescriptions
6. Mark appointment complete
7. Process payment

---

## Admin Journey

### 1. Dashboard Overview
```
Login → Admin Dashboard → View Metrics → Manage Resources
```

**Metrics:**
- Daily/weekly/monthly appointments
- Revenue statistics
- Patient growth
- Provider utilization

### 2. Provider Management
```
Dashboard → Providers → Add/Edit Provider → Set Availability → Assign Specialties
```

**Actions:**
- Add new providers
- Update provider information
- Configure availability schedules
- Assign specialties
- Deactivate providers

### 3. Clinic Configuration
```
Dashboard → Settings → Clinic Info → Business Hours → Appointment Types → Notifications
```

**Settings:**
- Clinic information
- Business hours
- Appointment types and durations
- Email/SMS templates
- Payment settings

### 4. Reports & Analytics
```
Dashboard → Reports → Select Report Type → Filter → Generate → Export
```

**Report Types:**
- Appointment reports
- Revenue reports
- Patient demographics
- Provider performance
- Cancellation rates

---

## Common Flows

### Password Reset
```
Login Page → Forgot Password → Enter Email → Receive Link → Reset Password → Login
```

### Profile Update
```
Dashboard → Profile → Edit Information → Save → Confirmation
```

### Notification Preferences
```
Dashboard → Settings → Notifications → Toggle Preferences → Save
```

---

## Navigation Structure

### Patient Portal
```
Dashboard
├── Book Appointment
├── My Appointments
├── Medical Records
├── Profile
└── Settings
```

### Staff Dashboard
```
Dashboard
├── Calendar
├── Patients
│   ├── Patient List
│   └── Add Patient
├── Appointments
│   ├── Today's Schedule
│   └── Create Appointment
└── Profile
```

### Admin Console
```
Dashboard
├── Analytics
├── Patients
├── Providers
│   ├── Provider List
│   └── Add Provider
├── Appointments
├── Settings
│   ├── Clinic Info
│   ├── Appointment Types
│   └── Notifications
└── Reports
```

---

## Improvement Recommendations

### 🟥 Critical
1. **Add Breadcrumb Navigation** - Better orientation (1 day)
2. **Implement Back Button Handling** - Proper navigation (4 hours)

### 🟧 High Priority
3. **Add Onboarding Tour** - First-time user guidance (1 week)
4. **Implement Search Functionality** - Global search (3 days)
5. **Add Quick Actions Menu** - Faster workflows (2 days)

### 🟨 Medium Priority
6. **Implement Keyboard Shortcuts** - Power user features (1 week)
7. **Add Recent Items** - Quick access (2 days)
8. **Implement Favorites** - Bookmark common actions (3 days)

---

**Related:** [07-Authentication-Flows.md](./07-Authentication-Flows.md)
