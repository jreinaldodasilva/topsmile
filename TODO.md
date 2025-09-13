# TODO: Fix Linting Errors

- [x] Fix src/pages/Home/Home.tsx: Move 'features' definition before use
- [x] Fix src/pages/Patient/Appointment/PatientAppointmentDetail.tsx: Add 'fetchAppointment' to useEffect deps
- [x] Fix src/pages/Patient/Appointment/PatientAppointmentsList.tsx: Add 'fetchAppointments' to useEffect deps
- [x] Fix src/pages/Patient/Dashboard/PatientDashboard.tsx: Add 'fetchUpcomingAppointments' to useEffect deps, remove unused 'handleLogout'
- [x] Fix src/pages/Patient/Profile/PatientProfile.tsx: Add 'loadPatientData' to useEffect deps
- [x] Fix src/services/paymentService.ts: Remove unused 'retryState'
- [x] Fix src/setupTests.ts: Remove useless constructor
- [ ] Fix src/tests/contexts/AuthContext.test.tsx: Refactor remaining multiple assertions in waitFor
- [x] Fix src/tests/contexts/ErrorContext.test.tsx: Remove unused import 'ErrorNotification'
- [x] Fix src/tests/contexts/PatientAuthContext.test.tsx: Remove unused import 'useNavigate', refactor waitFor to single assertions
- [x] Fix src/tests/pages/Patient/Appointment/PatientAppointmentBooking.test.tsx: Refactor remaining waitFor issues
- [x] Fix src/tests/pages/Patient/Appointment/PatientAppointmentDetail.test.tsx: Refactor multiple assertions in waitFor
- [x] Fix src/tests/pages/Patient/Appointment/PatientAppointmentsList.test.tsx: Refactor waitFor issues
- [x] Fix src/tests/pages/Patient/Dashboard/PatientDashboard.test.tsx: Refactor multiple assertions in waitFor
- [x] Fix src/tests/pages/Patient/Profile/PatientProfile.test.tsx: Refactor waitFor issues
- [x] Run linting to verify fixes
