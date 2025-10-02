# TopSmile Browser Testing Workflow

## Quick Start

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
npm start
```

**URLs:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Docs: http://localhost:5000/api/docs

---

## Testing Checklist

### Phase 1: Initial Setup (5 min)

#### 1.1 Backend Health Check
- [ ] Open http://localhost:5000/api/health
- [ ] Verify JSON response with `status: "ok"`
- [ ] Check database connection status

#### 1.2 Frontend Load
- [ ] Open http://localhost:3000
- [ ] Verify homepage loads without errors
- [ ] Open browser console (F12) - check for errors
- [ ] Verify no 404s in Network tab

---

### Phase 2: Public Features (10 min)

#### 2.1 Homepage
- [ ] Navigate to http://localhost:3000
- [ ] Verify hero section displays
- [ ] Check "Agendar Consulta" button works
- [ ] Test responsive design (resize browser)

#### 2.2 Contact Form
- [ ] Find contact form on homepage
- [ ] Fill out form:
  - Name: "Test User"
  - Email: "test@example.com"
  - Phone: "(11) 99999-9999"
  - Clinic: "Test Clinic"
  - Specialty: "Ortodontia"
- [ ] Submit form
- [ ] Verify success message appears
- [ ] Check Network tab for POST to `/api/contact`

---

### Phase 3: Admin Authentication (10 min)

#### 3.1 Admin Login
- [ ] Navigate to http://localhost:3000/admin/login
- [ ] Try invalid credentials:
  - Email: "wrong@example.com"
  - Password: "wrongpass"
  - Verify error message
- [ ] Login with valid credentials:
  - Email: "admin@topsmile.com"
  - Password: "SecurePass123!"
- [ ] Verify redirect to admin dashboard

#### 3.2 Admin Dashboard
- [ ] Verify dashboard loads at `/admin/dashboard`
- [ ] Check stats cards display:
  - Total Patients
  - Today's Appointments
  - Monthly Revenue
  - Satisfaction Score
- [ ] Verify navigation menu works
- [ ] Test logout button

---

### Phase 4: Patient Management (15 min)

#### 4.1 View Patients
- [ ] Navigate to http://localhost:3000/admin/patients
- [ ] Verify patient list displays
- [ ] Test search functionality
- [ ] Test pagination (if >10 patients)
- [ ] Test status filter (Active/Inactive)

#### 4.2 Create Patient
- [ ] Click "Novo Paciente" button
- [ ] Fill form:
  - First Name: "João"
  - Last Name: "Silva"
  - Email: "joao.silva@example.com"
  - Phone: "(11) 98888-8888"
  - Date of Birth: "1990-01-01"
  - Gender: "Male"
  - CPF: "123.456.789-00"
- [ ] Submit form
- [ ] Verify success message
- [ ] Verify patient appears in list

#### 4.3 Edit Patient
- [ ] Click on a patient from list
- [ ] Click "Editar" button
- [ ] Update phone number
- [ ] Save changes
- [ ] Verify update success message

#### 4.4 Patient Details
- [ ] Click on patient name
- [ ] Verify patient details page loads
- [ ] Check tabs: Info, Appointments, Medical History
- [ ] Verify all data displays correctly

---

### Phase 5: Appointment Management (15 min)

#### 5.1 View Appointments
- [ ] Navigate to http://localhost:3000/admin/appointments
- [ ] Verify calendar view displays
- [ ] Test date navigation (prev/next)
- [ ] Switch to list view
- [ ] Test status filters

#### 5.2 Create Appointment
- [ ] Click "Nova Consulta" button
- [ ] Fill form:
  - Patient: Select from dropdown
  - Provider: Select dentist
  - Date: Tomorrow's date
  - Time: 10:00 AM
  - Type: "Consulta Geral"
  - Duration: 60 minutes
- [ ] Submit form
- [ ] Verify appointment appears on calendar

#### 5.3 Edit Appointment
- [ ] Click on appointment in calendar
- [ ] Click "Editar"
- [ ] Change time to 11:00 AM
- [ ] Save changes
- [ ] Verify appointment moved on calendar

#### 5.4 Cancel Appointment
- [ ] Click on appointment
- [ ] Click "Cancelar"
- [ ] Enter cancellation reason
- [ ] Confirm cancellation
- [ ] Verify status changed to "Cancelled"

---

### Phase 6: Contact Management (10 min)

#### 6.1 View Contacts
- [ ] Navigate to http://localhost:3000/admin/contacts
- [ ] Verify contact list displays
- [ ] Test status filter (New, Contacted, Qualified)
- [ ] Test search by name/email

#### 6.2 Manage Contact
- [ ] Click on a contact
- [ ] Update status to "Contacted"
- [ ] Add notes
- [ ] Assign to user
- [ ] Set follow-up date
- [ ] Save changes
- [ ] Verify updates saved

---

### Phase 7: Patient Portal (15 min)

#### 7.1 Patient Registration
- [ ] Navigate to http://localhost:3000/patient/register
- [ ] Fill registration form:
  - First Name: "Maria"
  - Last Name: "Santos"
  - Email: "maria@example.com"
  - Phone: "(11) 97777-7777"
  - Password: "PatientPass123!"
  - Confirm Password: "PatientPass123!"
- [ ] Submit form
- [ ] Verify success message

#### 7.2 Patient Login
- [ ] Navigate to http://localhost:3000/patient/login
- [ ] Login with patient credentials
- [ ] Verify redirect to patient dashboard

#### 7.3 Patient Dashboard
- [ ] Verify dashboard at `/patient/dashboard`
- [ ] Check upcoming appointments section
- [ ] Check recent activity
- [ ] Test navigation menu

#### 7.4 Book Appointment
- [ ] Click "Agendar Consulta"
- [ ] Select appointment type
- [ ] Choose available date/time
- [ ] Confirm booking
- [ ] Verify appointment appears in dashboard

#### 7.5 Patient Profile
- [ ] Navigate to profile page
- [ ] Update personal information
- [ ] Update medical history
- [ ] Save changes
- [ ] Verify updates saved

---

### Phase 8: Error Handling (10 min)

#### 8.1 Network Errors
- [ ] Stop backend server
- [ ] Try to load admin dashboard
- [ ] Verify error message displays
- [ ] Restart backend
- [ ] Verify app recovers

#### 8.2 Validation Errors
- [ ] Try to create patient with invalid email
- [ ] Try to create appointment in the past
- [ ] Try to submit empty forms
- [ ] Verify validation messages display

#### 8.3 Authentication Errors
- [ ] Logout from admin
- [ ] Try to access `/admin/patients` directly
- [ ] Verify redirect to login
- [ ] Try expired token (wait or manipulate localStorage)
- [ ] Verify re-authentication required

---

### Phase 9: Performance & UX (10 min)

#### 9.1 Loading States
- [ ] Navigate between pages
- [ ] Verify loading indicators appear
- [ ] Check for smooth transitions
- [ ] No blank screens

#### 9.2 Responsive Design
- [ ] Resize browser to mobile width (375px)
- [ ] Test navigation menu (hamburger)
- [ ] Verify forms are usable
- [ ] Test on tablet width (768px)

#### 9.3 Accessibility
- [ ] Tab through forms (keyboard navigation)
- [ ] Verify focus indicators visible
- [ ] Check color contrast
- [ ] Test with screen reader (optional)

---

### Phase 10: Edge Cases (10 min)

#### 10.1 Concurrent Operations
- [ ] Open app in two browser tabs
- [ ] Login as admin in both
- [ ] Edit same patient in both tabs
- [ ] Save in both - verify conflict handling

#### 10.2 Long Sessions
- [ ] Leave app open for 15+ minutes
- [ ] Try to perform action
- [ ] Verify token refresh or re-auth

#### 10.3 Data Limits
- [ ] Try to create patient with very long name (1000 chars)
- [ ] Try to upload large file (if applicable)
- [ ] Verify proper error handling

---

## Common Issues & Solutions

### Backend Not Starting
```bash
# Check if port 5000 is in use
lsof -i :5000
# Kill process if needed
kill -9 <PID>
# Restart backend
cd backend && npm run dev
```

### Frontend Not Starting
```bash
# Check if port 3000 is in use
lsof -i :3000
# Clear cache and restart
rm -rf node_modules/.cache
npm start
```

### Database Connection Error
```bash
# Check MongoDB is running
# If using MongoDB Memory Server, it starts automatically
# Check backend logs for connection string
```

### CORS Errors
```bash
# Verify backend .env has:
FRONTEND_URL=http://localhost:3000
# Restart backend after changes
```

---

## Test Data

### Admin Credentials
```
Email: admin@topsmile.com
Password: SecurePass123!
```

### Test Patient Data
```
Name: João Silva
Email: joao.silva@example.com
Phone: (11) 98888-8888
CPF: 123.456.789-00
DOB: 1990-01-01
```

### Test Contact Data
```
Name: Maria Santos
Email: maria@example.com
Phone: (11) 97777-7777
Clinic: Clínica TopSmile
Specialty: Ortodontia
```

---

## Browser DevTools Checklist

### Console Tab
- [ ] No red errors
- [ ] No unhandled promise rejections
- [ ] No 404 errors

### Network Tab
- [ ] API calls return 200/201
- [ ] No failed requests
- [ ] Response times < 1s

### Application Tab
- [ ] localStorage has auth tokens
- [ ] sessionStorage used correctly
- [ ] Cookies set properly (if used)

### Performance Tab
- [ ] Page load < 3s
- [ ] No memory leaks
- [ ] Smooth animations (60fps)

---

## Success Criteria

✅ **All phases completed without critical errors**
✅ **All forms submit successfully**
✅ **All CRUD operations work**
✅ **Authentication flows work**
✅ **No console errors**
✅ **Responsive design works**
✅ **Error handling works**

---

## Reporting Issues

When you find a bug, note:
1. **URL** where it occurred
2. **Steps to reproduce**
3. **Expected behavior**
4. **Actual behavior**
5. **Browser console errors**
6. **Network tab errors**

---

## Quick Test (5 min)

If short on time, test these critical paths:

1. **Admin Login** → Dashboard loads
2. **Create Patient** → Patient appears in list
3. **Create Appointment** → Appointment appears on calendar
4. **Patient Login** → Dashboard loads
5. **Book Appointment** → Appointment confirmed

---

**Total Testing Time: ~2 hours for complete workflow**
**Quick Test Time: ~5 minutes for critical paths**
