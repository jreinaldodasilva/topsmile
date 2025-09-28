# TODO List: Fix Frontend Test Failures

This plan prioritizes fixing test failures based on their impact on core functionality.

## http service

- [ ] **http service request function successful requests should make successful GET request without auth**  
  _Class:_ `http service request function successful requests should make successful GET request without auth`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function successful requests should make successful POST request with auth**  
  _Class:_ `http service request function successful requests should make successful POST request with auth`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function successful requests should handle full URL endpoints**  
  _Class:_ `http service request function successful requests should handle full URL endpoints`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function error handling should handle HTTP errors**  
  _Class:_ `http service request function error handling should handle HTTP errors`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function error handling should handle malformed JSON responses**  
  _Class:_ `http service request function error handling should handle malformed JSON responses`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function token refresh should refresh token on 401 and retry request**  
  _Class:_ `http service request function token refresh should refresh token on 401 and retry request`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function token refresh should handle refresh failure**  
  _Class:_ `http service request function token refresh should handle refresh failure`  
  _Issue:_ Error: Network request failed

- [ ] **http service request function token refresh should handle concurrent refresh requests**  
  _Class:_ `http service request function token refresh should handle concurrent refresh requests`  
  _Issue:_ Error: Network request failed

- [ ] **http service logout function should notify backend about logout**  
  _Class:_ `http service logout function should notify backend about logout`  
  _Issue:_ Error: expect(jest.fn()).toHaveBeenCalledWith(...expected)

## PatientAuthContext

- [ ] **PatientAuthContext Initial Authentication Check handles invalid tokens on mount**  
  _Class:_ `PatientAuthContext Initial Authentication Check handles invalid tokens on mount`  
  _Issue:_ Error: expect(received).toBeNull()

## PatientAppointmentBooking

- [ ] **PatientAppointmentBooking fetches and displays providers and appointment types**  
  _Class:_ `PatientAppointmentBooking fetches and displays providers and appointment types`  
  _Issue:_ Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **PatientAppointmentBooking fetches and displays available time slots**  
  _Class:_ `PatientAppointmentBooking fetches and displays available time slots`  
  _Issue:_ Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **PatientAppointmentBooking allows booking an appointment**  
  _Class:_ `PatientAppointmentBooking allows booking an appointment`  
  _Issue:_ Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **PatientAppointmentBooking shows an error message if booking fails**  
  _Class:_ `PatientAppointmentBooking shows an error message if booking fails`  
  _Issue:_ Error: Unable to find an element with the text: Dr. Smith - General. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

## AppointmentCalendar

- [ ] **AppointmentCalendar renders calendar header**  
  _Class:_ `AppointmentCalendar renders calendar header`  
  _Issue:_ TestingLibraryElementError: Unable to find an element with the text: /Agenda de Consultas/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **AppointmentCalendar renders calendar grid after loading**  
  _Class:_ `AppointmentCalendar renders calendar grid after loading`  
  _Issue:_ Error: Unable to find an element with the text: /Nenhuma consulta encontrada/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

## ProviderManagement

- [ ] **ProviderManagement renders provider management title**  
  _Class:_ `ProviderManagement renders provider management title`  
  _Issue:_ TestingLibraryElementError: Unable to find an element with the text: /Gestão de Profissionais/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **ProviderManagement renders provider list after loading**  
  _Class:_ `ProviderManagement renders provider list after loading`  
  _Issue:_ Error: Unable to find an element with the text: /Nenhum profissional encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **ProviderManagement renders add provider button**  
  _Class:_ `ProviderManagement renders add provider button`  
  _Issue:_ Error: Unable to find role="button" and name `/Novo Profissional/i`

## PatientManagement

- [ ] **PatientManagement renders patient management title**  
  _Class:_ `PatientManagement renders patient management title`  
  _Issue:_ TestingLibraryElementError: Unable to find an element with the text: /Gerenciamento de Pacientes/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **PatientManagement renders patient list after loading**  
  _Class:_ `PatientManagement renders patient list after loading`  
  _Issue:_ Error: Unable to find an element with the text: /Nenhum paciente encontrado/i. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.

- [ ] **PatientManagement renders add patient button**  
  _Class:_ `PatientManagement renders add patient button`  
  _Issue:_ Error: Unable to find role="button" and name `/Novo Paciente/i`

## ContactManagement

- [ ] **ContactManagement renders add contact button**  
  _Class:_ `ContactManagement renders add contact button`  
  _Issue:_ Error: Unable to find role="button" and name `/Criar Contato/i`

## ContactList

- [ ] **ContactList should render a list of contacts**  
  _Class:_ `ContactList should render a list of contacts`  
  _Issue:_ Error: Unable to find an element with the text: John Doe. This could be because the text is broken up by multiple elements. In this case, you can provide a function for your text matcher to make your matcher more flexible.
