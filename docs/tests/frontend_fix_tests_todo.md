# Frontend Failed Tests - TODO

### `src/tests/services/http.test.ts`
- [ ] http service request function successful requests should make successful GET request without auth
- [ ] http service request function successful requests should make successful POST request with auth
- [ ] http service request function successful requests should handle full URL endpoints
- [ ] http service request function error handling should handle HTTP errors
- [ ] http service request function error handling should handle malformed JSON responses
- [ ] http service request function token refresh should refresh token on 401 and retry request
- [ ] http service request function token refresh should handle refresh failure
- [ ] http service request function token refresh should handle concurrent refresh requests
- [ ] http service logout function should notify backend about logout

### `src/tests/components/AdminDashboard.test.tsx`
- [ ] AdminDashboard renders dashboard title
- [ ] AdminDashboard renders stats cards after loading
- [ ] AdminDashboard renders upcoming appointments section
- [ ] AdminDashboard renders recent patients section
- [ ] AdminDashboard renders pending tasks section
- [ ] AdminDashboard renders quick actions section

### `src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx`
- [ ] PatientAppointmentBooking fetches and displays providers and appointment types
- [ ] PatientAppointmentBooking fetches and displays available time slots
- [ ] PatientAppointmentBooking allows booking an appointment
- [ ] PatientAppointmentBooking shows an error message if booking fails

### `src/tests/components/ProviderManagement.test.tsx`
- [ ] ProviderManagement renders provider management title
- [ ] ProviderManagement renders provider list after loading
- [ ] ProviderManagement renders add provider button

### `src/tests/components/PatientManagement.test.tsx`
- [ ] PatientManagement renders patient management title
- [ ] PatientManagement renders patient list after loading
- [ ] PatientManagement renders add patient button

### `src/tests/components/ContactManagement.test.tsx`
- [ ] ContactManagement renders add contact button

### `src/tests/contexts/PatientAuthContext.test.tsx`
- [ ] PatientAuthContext Initial Authentication Check handles invalid tokens on mount

### `src/tests/components/AppointmentCalendar.test.tsx`
- [ ] AppointmentCalendar renders calendar header
- [ ] AppointmentCalendar renders calendar grid after loading

### `src/components/Admin/Contacts/ContactList.test.tsx`
- [ ] ContactList should render a list of contacts

### `src/tests/components/RegisterPage.test.tsx`
- [ ] RegisterPage renders registration form fields

### `src/tests/components/LoginPage.test.tsx`
- [ ] LoginPage renders login form
- [ ] LoginPage allows user to type email and password
- [ ] LoginPage toggles password visibility
- [ ] LoginPage shows error message on login failure

### `src/tests/contexts/ErrorContext.test.tsx`
- [ ] ErrorContext clears all notifications
- [ ] ErrorContext logs an error and shows a notification

### `src/tests/services/apiService.test.ts`
- [ ] apiService auth methods login should handle network errors
- [ ] apiService patients methods getAll should get all patients
- [ ] apiService patients methods getAll should handle query parameters
- [ ] apiService patients methods getOne should get patient by ID
- [ ] apiService patients methods getOne should handle non-existent patient
- [ ] apiService patients methods create should create a new patient
- [ ] apiService patients methods update should update patient data
- [ ] apiService patients methods delete should delete patient
- [ ] apiService contacts methods getAll should get all contacts
- [ ] apiService contacts methods create should create a new contact
- [ ] apiService appointments methods getAll should get all appointments
- [ ] apiService appointments methods create should create a new appointment
- [ ] apiService dashboard methods getStats should get dashboard statistics
- [ ] apiService public methods sendContactForm should send contact form successfully
- [ ] apiService system methods health should get health status