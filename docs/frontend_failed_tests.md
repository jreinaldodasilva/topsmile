# Frontend Failed Tests

This document lists the failed tests from the frontend test suite, extracted from `reports/junit-frontend.xml`. Each failed test includes the test name and the failure cause.

## Test Suite: apiService (19 failures)

- **Test:** apiService auth methods login should successfully login with valid credentials  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService auth methods login should handle login failure with invalid credentials  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService auth methods login should handle network errors  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService auth methods register should successfully register a new user  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService auth methods me should get current user data  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods getAll should get all patients  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods getAll should handle query parameters  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods getOne should get patient by ID  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods getOne should handle non-existent patient  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods create should create a new patient  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods update should update patient data  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService patients methods delete should delete patient  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService contacts methods getAll should get all contacts  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService contacts methods create should create a new contact  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService appointments methods getAll should get all appointments  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService appointments methods create should create a new appointment  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService dashboard methods getStats should get dashboard statistics  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService public methods sendContactForm should send contact form successfully  
  **Cause:** Error: Network error - please check your connection

- **Test:** apiService system methods health should get health status  
  **Cause:** Error: Network error - please check your connection

## Test Suite: http service (11 failures)

- **Test:** http service request function successful requests should make successful GET request without auth  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function successful requests should make successful POST request with auth  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function successful requests should handle full URL endpoints  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function error handling should handle HTTP errors  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function error handling should handle network errors  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function error handling should handle malformed JSON responses  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function token refresh should refresh token on 401 and retry request  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function token refresh should handle refresh failure  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service request function token refresh should handle concurrent refresh requests  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service logout function should notify backend about logout  
  **Cause:** TypeError: mockFetch.mockClear is not a function

- **Test:** http service logout function should handle backend logout failure gracefully  
  **Cause:** TypeError: mockFetch.mockClear is not a function

## Test Suite: PatientAuthContext (2 failures)

- **Test:** PatientAuthContext Login Functionality handles successful login  
  **Cause:** Error: expect(received).toBe(expected) // Object.is equality Expected: "access-token" Received: null

- **Test:** PatientAuthContext Initial Authentication Check handles invalid tokens on mount  
  **Cause:** Error: expect(received).toBeNull() Received: "invalid-token"

## Test Suite: ErrorContext (2 failures)

- **Test:** ErrorContext clears all notifications  
  **Cause:** Error: expect(received).toHaveLength(expected) Expected length: 2 Received length: 6

- **Test:** ErrorContext logs an error and shows a notification  
  **Cause:** TestingLibraryElementError: Found multiple elements by: [data-testid="/notification-/"]

## Test Suite: PatientAppointmentBooking (5 failures)

- **Test:** PatientAppointmentBooking redirects to login if not authenticated  
  **Cause:** Error: No QueryClient set, use QueryClientProvider to set one

- **Test:** PatientAppointmentBooking fetches and displays providers and appointment types  
  **Cause:** Error: No QueryClient set, use QueryClientProvider to set one

- **Test:** PatientAppointmentBooking fetches and displays available time slots  
  **Cause:** Error: No QueryClient set, use QueryClientProvider to set one

- **Test:** PatientAppointmentBooking allows booking an appointment  
  **Cause:** Error: No QueryClient set, use QueryClientProvider to set one

- **Test:** PatientAppointmentBooking shows an error message if booking fails  
  **Cause:** Error: No QueryClient set, use QueryClientProvider to set one

## Test Suite: LoginPage (4 failures)

- **Test:** LoginPage renders login form  
  **Cause:** Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports. Check the render method of `AllTheProviders`.

- **Test:** LoginPage allows user to type email and password  
  **Cause:** Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports. Check the render method of `AllTheProviders`.

- **Test:** LoginPage toggles password visibility  
  **Cause:** Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports. Check the render method of `AllTheProviders`.

- **Test:** LoginPage shows error message on login failure  
  **Cause:** Error: Element type is invalid: expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports. Check the render method of `AllTheProviders`.

## Test Suite: ContactList (1 failure)

- **Test:** ContactList should render a list of contacts  
  **Cause:** Error: Unable to find an element with the text: John Doe. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

## Test Suite: RegisterPage (1 failure)

- **Test:** RegisterPage renders registration form fields  
  **Cause:** TestingLibraryElementError: Unable to find role="button" and name `/Criar Conta/i`

## Test Suite: ProviderManagement (1 failure)

- **Test:** ProviderManagement renders provider management title  
  **Cause:** TestingLibraryElementError: Unable to find an element with the text: /Gestão de Profissionais/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

## Test Suite: PatientManagement (1 failure)

- **Test:** PatientManagement renders patient management title  
  **Cause:** TestingLibraryElementError: Unable to find an element with the text: /Gerenciamento de Pacientes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

## Test Suite: ContactManagement (1 failure)

- **Test:** ContactManagement renders add contact button  
  **Cause:** Error: Unable to find role="button" and name `/Criar Contato/i`

## Test Suite: AppointmentCalendar (1 failure)

- **Test:** AppointmentCalendar renders calendar header  
  **Cause:** TestingLibraryElementError: Unable to find an element with the text: /Agenda de Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

## Test Suite: undefined (1 failure)

- **Test:**  renders learn react link  
  **Cause:** TestingLibraryElementError: Unable to find an element with the text: /Loading.../i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
