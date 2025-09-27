# Frontend Failed Tests - TODO Plan

This document provides a **TODO checklist** organized by test suite to resolve all failed tests.

## General Strategy

- [ ] Reproduce failures by running failing tests individually
- [ ] Categorize issues by root cause (e.g., network, UI rendering, test setup)
- [ ] Apply fixes in code or test configuration
- [ ] Re-run full test suite to confirm no regressions


## Suite: http service

- [ ] **Test:** http service request function successful requests should make successful GET request without auth
  - File/Class: `http service request function successful requests should make successful GET request without auth`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function successful requests should make successful POST request with auth
  - File/Class: `http service request function successful requests should make successful POST request with auth`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function successful requests should handle full URL endpoints
  - File/Class: `http service request function successful requests should handle full URL endpoints`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function error handling should handle HTTP errors
  - File/Class: `http service request function error handling should handle HTTP errors`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function error handling should handle malformed JSON responses
  - File/Class: `http service request function error handling should handle malformed JSON responses`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function token refresh should refresh token on 401 and retry request
  - File/Class: `http service request function token refresh should refresh token on 401 and retry request`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function token refresh should handle refresh failure
  - File/Class: `http service request function token refresh should handle refresh failure`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service request function token refresh should handle concurrent refresh requests
  - File/Class: `http service request function token refresh should handle concurrent refresh requests`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** http service logout function should notify backend about logout
  - File/Class: `http service logout function should notify backend about logout`
  - Observed Issue: Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: AdminDashboard

- [ ] **Test:** AdminDashboard renders dashboard title
  - File/Class: `AdminDashboard renders dashboard title`
  - Observed Issue: Error: Unable to find an element with the text: /Dashboard/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** AdminDashboard renders stats cards after loading
  - File/Class: `AdminDashboard renders stats cards after loading`
  - Observed Issue: Error: Unable to find an element with the text: /Total de Contatos/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** AdminDashboard renders upcoming appointments section
  - File/Class: `AdminDashboard renders upcoming appointments section`
  - Observed Issue: Error: Unable to find an element with the text: /Próximas Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** AdminDashboard renders recent patients section
  - File/Class: `AdminDashboard renders recent patients section`
  - Observed Issue: Error: Unable to find an element with the text: /Pacientes Recentes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** AdminDashboard renders pending tasks section
  - File/Class: `AdminDashboard renders pending tasks section`
  - Observed Issue: Error: Unable to find an element with the text: /Tarefas Pendentes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** AdminDashboard renders quick actions section
  - File/Class: `AdminDashboard renders quick actions section`
  - Observed Issue: Error: Unable to find an element with the text: /Ações Rápidas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: PatientAppointmentBooking

- [ ] **Test:** PatientAppointmentBooking fetches and displays providers and appointment types
  - File/Class: `PatientAppointmentBooking fetches and displays providers and appointment types`
  - Observed Issue: Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** PatientAppointmentBooking fetches and displays available time slots
  - File/Class: `PatientAppointmentBooking fetches and displays available time slots`
  - Observed Issue: Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** PatientAppointmentBooking allows booking an appointment
  - File/Class: `PatientAppointmentBooking allows booking an appointment`
  - Observed Issue: Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** PatientAppointmentBooking shows an error message if booking fails
  - File/Class: `PatientAppointmentBooking shows an error message if booking fails`
  - Observed Issue: Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: ProviderManagement

- [ ] **Test:** ProviderManagement renders provider management title
  - File/Class: `ProviderManagement renders provider management title`
  - Observed Issue: TestingLibraryElementError: Unable to find an element with the text: /Gestão de Profissionais/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** ProviderManagement renders provider list after loading
  - File/Class: `ProviderManagement renders provider list after loading`
  - Observed Issue: Error: Unable to find an element with the text: /Nenhum profissional encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** ProviderManagement renders add provider button
  - File/Class: `ProviderManagement renders add provider button`
  - Observed Issue: Error: Unable to find role="button" and name `/Novo Profissional/i`
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: PatientManagement

- [ ] **Test:** PatientManagement renders patient management title
  - File/Class: `PatientManagement renders patient management title`
  - Observed Issue: TestingLibraryElementError: Unable to find an element with the text: /Gerenciamento de Pacientes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** PatientManagement renders patient list after loading
  - File/Class: `PatientManagement renders patient list after loading`
  - Observed Issue: Error: Unable to find an element with the text: /Nenhum paciente encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** PatientManagement renders add patient button
  - File/Class: `PatientManagement renders add patient button`
  - Observed Issue: Error: Unable to find role="button" and name `/Novo Paciente/i`
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: ContactManagement

- [ ] **Test:** ContactManagement renders add contact button
  - File/Class: `ContactManagement renders add contact button`
  - Observed Issue: Error: Unable to find role="button" and name `/Criar Contato/i`
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: PatientAuthContext

- [ ] **Test:** PatientAuthContext Initial Authentication Check handles invalid tokens on mount
  - File/Class: `PatientAuthContext Initial Authentication Check handles invalid tokens on mount`
  - Observed Issue: Error: expect(received).toBeNull()
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: AppointmentCalendar

- [ ] **Test:** AppointmentCalendar renders calendar header
  - File/Class: `AppointmentCalendar renders calendar header`
  - Observed Issue: TestingLibraryElementError: Unable to find an element with the text: /Agenda de Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** AppointmentCalendar renders calendar grid after loading
  - File/Class: `AppointmentCalendar renders calendar grid after loading`
  - Observed Issue: Error: Unable to find an element with the text: /Nenhuma consulta encontrada/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: ContactList

- [ ] **Test:** ContactList should render a list of contacts
  - File/Class: `ContactList should render a list of contacts`
  - Observed Issue: Error: Unable to find an element with the text: John Doe. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: RegisterPage

- [ ] **Test:** RegisterPage renders registration form fields
  - File/Class: `RegisterPage renders registration form fields`
  - Observed Issue: TestingLibraryElementError: Unable to find an accessible element with the role "button" and name `/Criar Conta/i`
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: LoginPage

- [ ] **Test:** LoginPage renders login form
  - File/Class: `LoginPage renders login form`
  - Observed Issue: Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** LoginPage allows user to type email and password
  - File/Class: `LoginPage allows user to type email and password`
  - Observed Issue: Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** LoginPage toggles password visibility
  - File/Class: `LoginPage toggles password visibility`
  - Observed Issue: Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** LoginPage shows error message on login failure
  - File/Class: `LoginPage shows error message on login failure`
  - Observed Issue: Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: ErrorContext

- [ ] **Test:** ErrorContext clears all notifications
  - File/Class: `ErrorContext clears all notifications`
  - Observed Issue: Error: expect(received).toHaveLength(expected)
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** ErrorContext logs an error and shows a notification
  - File/Class: `ErrorContext logs an error and shows a notification`
  - Observed Issue: Error: expect(received).toHaveLength(expected)
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution


## Suite: apiService

- [ ] **Test:** apiService auth methods login should handle network errors
  - File/Class: `apiService auth methods login should handle network errors`
  - Observed Issue: Error: Network request failed
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods getAll should get all patients
  - File/Class: `apiService patients methods getAll should get all patients`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods getAll should handle query parameters
  - File/Class: `apiService patients methods getAll should handle query parameters`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods getOne should get patient by ID
  - File/Class: `apiService patients methods getOne should get patient by ID`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods getOne should handle non-existent patient
  - File/Class: `apiService patients methods getOne should handle non-existent patient`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods create should create a new patient
  - File/Class: `apiService patients methods create should create a new patient`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods update should update patient data
  - File/Class: `apiService patients methods update should update patient data`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService patients methods delete should delete patient
  - File/Class: `apiService patients methods delete should delete patient`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService contacts methods getAll should get all contacts
  - File/Class: `apiService contacts methods getAll should get all contacts`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService contacts methods create should create a new contact
  - File/Class: `apiService contacts methods create should create a new contact`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService appointments methods getAll should get all appointments
  - File/Class: `apiService appointments methods getAll should get all appointments`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService appointments methods create should create a new appointment
  - File/Class: `apiService appointments methods create should create a new appointment`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService dashboard methods getStats should get dashboard statistics
  - File/Class: `apiService dashboard methods getStats should get dashboard statistics`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService public methods sendContactForm should send contact form successfully
  - File/Class: `apiService public methods sendContactForm should send contact form successfully`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution

- [ ] **Test:** apiService system methods health should get health status
  - File/Class: `apiService system methods health should get health status`
  - Observed Issue: TypeError: Cannot read properties of undefined (reading 'ok')
  - TODO:
    - [ ] Investigate root cause
    - [ ] Fix implementation or test setup
    - [ ] Re-run test to confirm resolution
