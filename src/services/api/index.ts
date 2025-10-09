// src/services/api/index.ts
export { appointmentService } from './appointmentService';
export { patientService } from './patientService';
export { providerService } from './providerService';
export { clinicalService } from './clinicalService';

// Re-export for backward compatibility
import { appointmentService } from './appointmentService';
import { patientService } from './patientService';
import { providerService } from './providerService';
import { clinicalService } from './clinicalService';

export const api = {
  appointments: appointmentService,
  patients: patientService,
  providers: providerService,
  clinical: clinicalService
};
