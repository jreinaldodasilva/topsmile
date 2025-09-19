# Type Alignment Task

## Completed Tasks
- [x] Update frontend Contact type to match backend (required clinic/email, correct priority enum)
- [x] Update frontend Patient type (gender enum, status field)
- [x] Update frontend Appointment type (make required fields required)
- [x] Update frontend User type (isActive required)
- [x] Update mappers to handle any new differences
- [x] Check and update any services using these types
- [x] Align frontend User type: remove clinicId, standardize clinic to string
- [x] Align frontend Contact type: remove tags, customFields
- [x] Align frontend Clinic type: remove isActive, update subscription.status enum, remove requireApproval
- [x] Align frontend Patient type: standardize to name field, rename dateOfBirth to birthDate, remove isActive/rg, standardize clinic to string
- [x] Align frontend Provider type: rename license to licenseNumber, add user field
- [x] Align frontend AppointmentType type: add missing fields (allowOnlineBooking, preparationInstructions, postTreatmentInstructions), update category enum
- [x] Standardize reference field types to use string IDs consistently
